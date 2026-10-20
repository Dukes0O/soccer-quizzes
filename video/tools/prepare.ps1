# Prepares one episode for rendering: copies its clips, grabs the freeze frames,
# and records the narration with the chosen voice.
#   .\tools\prepare.ps1 -Episode ep3                      (Windows voice, free)
#   .\tools\prepare.ps1 -Episode ep3 -Provider elevenlabs -VoiceId shoo8w685etzyZBFBkQR
# ElevenLabs lines are kept in public\narration-cache\<voice id>\, named by their text, so an
# unchanged line is reused instead of paid for again.
param(
  [Parameter(Mandatory)][string]$Episode,
  [ValidateSet('windows', 'elevenlabs')][string]$Provider = 'windows',
  [string]$Voice = 'Microsoft Richard',
  [string]$VoiceId,
  [double]$Similarity = 0.97
)
$ErrorActionPreference = 'Stop'
$root = Split-Path $PSScriptRoot -Parent
$videos = Join-Path $root '..\output\videos'
$public = Join-Path $root 'public'
$spec = Get-Content (Join-Path $root "src\episodes\$Episode.json") -Raw | ConvertFrom-Json

foreach ($dir in 'clips', 'stills', 'figures', "narration\$Episode") { New-Item -ItemType Directory -Force (Join-Path $public $dir) | Out-Null }

# Player figures shared with the Training Ground app
$figures = Join-Path $public 'figures\miniature-players.webp'
if (-not (Test-Path $figures)) { Copy-Item 'C:\Users\kyleb\dev\training-ground\src\assets\miniature-players.webp' $figures }

# Clips: copied as they are, or cropped first when the episode says so
foreach ($scene in $spec.scenes | Where-Object type -eq 'clip') {
  $target = Join-Path $public $scene.src
  if (Test-Path $target) { continue }
  $recipe = $spec.clipSources.($scene.src)
  if ($recipe) {
    # Optional start/duration (seconds) cut a segment; beat times are then relative to `start`.
    $cut = @()
    if ($recipe.start) { $cut += @('-ss', $recipe.start) }
    if ($recipe.duration) { $cut += @('-t', $recipe.duration) }
    ffmpeg -v error -y -i (Join-Path $videos $recipe.from) @cut -vf "crop=$($recipe.crop),scale=1920:1080" -c:v libx264 -crf 16 -preset fast -c:a aac $target
  } else {
    Copy-Item (Join-Path $videos $scene.src) $target
  }
}

# Freeze frames, one per freeze beat
foreach ($scene in $spec.scenes | Where-Object type -eq 'clip') {
  $clip = Join-Path $public $scene.src
  for ($i = 0; $i -lt $scene.beats.Count; $i++) {
    $beat = $scene.beats[$i]
    if ($beat.t -eq 'freeze') {
      ffmpeg -v error -y -ss $beat.at -i $clip -frames:v 1 (Join-Path $public "stills\$Episode-$($scene.id)-$i.png")
    }
  }
}

# Narration lines
$lines = foreach ($scene in $spec.scenes) {
  if ($scene.vo) { [pscustomobject]@{ key = "$($scene.id).vo"; text = $scene.vo } }
  $parts = if ($scene.steps) { $scene.steps } elseif ($scene.beats) { $scene.beats } else { @() }
  for ($i = 0; $i -lt $parts.Count; $i++) {
    if ($parts[$i].vo) { [pscustomobject]@{ key = "$($scene.id).$i"; text = $parts[$i].vo } }
  }
}

if ($Provider -eq 'windows') {
  Add-Type -AssemblyName System.Speech
  $synth = New-Object System.Speech.Synthesis.SpeechSynthesizer
  $synth.SelectVoice($Voice)
  $synth.Rate = 0
  $format = New-Object System.Speech.AudioFormat.SpeechAudioFormatInfo(44100, [System.Speech.AudioFormat.AudioBitsPerSample]::Sixteen, [System.Speech.AudioFormat.AudioChannel]::Mono)
} else {
  $apiKey = $env:ELEVENLABS_API_KEY
  if (-not $apiKey) { $apiKey = [Environment]::GetEnvironmentVariable('ELEVENLABS_API_KEY', 'User') }
  $headers = @{ 'xi-api-key' = $apiKey }
  $voiceId = $VoiceId
  if (-not $voiceId) {
    $voiceId = ((Invoke-RestMethod 'https://api.elevenlabs.io/v2/voices?page_size=100' -Headers $headers).voices | Where-Object { $_.name -like "$Voice*" } | Select-Object -First 1).voice_id
  }
  if (-not $voiceId) { throw "No ElevenLabs voice named $Voice" }
  $cache = Join-Path $public "narration-cache\$voiceId"
  New-Item -ItemType Directory -Force $cache | Out-Null
  $sha = [System.Security.Cryptography.SHA1]::Create()
  $paid = 0
}

Remove-Item (Join-Path $public "narration\$Episode\*") -ErrorAction SilentlyContinue
$durations = [ordered]@{}
foreach ($line in $lines) {
  if ($Provider -eq 'windows') {
    $file = Join-Path $public "narration\$Episode\$($line.key).wav"
    $synth.SetOutputToWaveFile($file, $format)
    $synth.Speak($line.text)
    $synth.SetOutputToNull()
  } else {
    $file = Join-Path $public "narration\$Episode\$($line.key).mp3"
    # Whole line in one take, with ElevenLabs break tags after punctuation so the voice makes
    # the pauses itself (Multilingual v2 honours them; punctuation alone it often runs through).
    $spoken = $line.text.Trim()
    $spoken = [regex]::Replace($spoken, '\?\s+', '? <break time="0.5s" /> ')
    $spoken = [regex]::Replace($spoken, '([.!])\s+', '$1 <break time="0.4s" /> ')
    $spoken = [regex]::Replace($spoken, ':\s+', ': <break time="0.3s" /> ')
    $spoken = [regex]::Replace($spoken, '([,;])\s+', '$1 <break time="0.2s" /> ')
    $hash = -join ($sha.ComputeHash([Text.Encoding]::UTF8.GetBytes("breaktags2|$spoken")) | ForEach-Object { $_.ToString('x2') })
    $hash = -join ($sha.ComputeHash([Text.Encoding]::UTF8.GetBytes("breaktags3|$(if ($Similarity -ne 0.95) { "sim$Similarity|" })$spoken")) | ForEach-Object { $_.ToString('x2') })
    $cached = Join-Path $cache "$hash.mp3"
    $timing = Join-Path $cache "$hash.json"
    if (-not (Test-Path $cached) -or -not (Test-Path $timing)) {
      $body = @{ text = $spoken; model_id = 'eleven_multilingual_v2'; voice_settings = @{ stability = 0.5; similarity_boost = $Similarity; style = 0; use_speaker_boost = $true; speed = 1.06 } } | ConvertTo-Json
      $reply = Invoke-RestMethod "https://api.elevenlabs.io/v1/text-to-speech/$voiceId/with-timestamps?output_format=mp3_44100_128" -Method Post -Headers $headers -ContentType 'application/json' -Body ([Text.Encoding]::UTF8.GetBytes($body))
      [IO.File]::WriteAllBytes($cached, [Convert]::FromBase64String($reply.audio_base64))
      $reply.alignment | ConvertTo-Json -Depth 4 -Compress | Set-Content $timing -Encoding utf8
      $paid += $line.text.Length
    }
    Copy-Item $cached $file
    # When each word starts, so on-screen labels can appear as the word is said.
    $align = Get-Content $timing -Raw | ConvertFrom-Json
    $words = @(); $current = ''; $start = 0; $inTag = $false
    for ($c = 0; $c -lt $align.characters.Count; $c++) {
      $ch = [string]$align.characters[$c]
      if ($ch -eq '<') { $inTag = $true }
      if ($inTag) { if ($ch -eq '>') { $inTag = $false }; continue }
      if ($ch -match "[\p{L}\p{N}']") {
        if ($current -eq '') { $start = [double]$align.character_start_times_seconds[$c] }
        $current += $ch
      } elseif ($current -ne '') { $words += , @($current.ToLower(), [math]::Round($start, 3)); $current = '' }
    }
    if ($current -ne '') { $words += , @($current.ToLower(), [math]::Round($start, 3)) }
  }
  $seconds = [double](ffprobe -v error -show_entries format=duration -of csv=p=0 $file)
  $entry = @{ file = "narration/$Episode/" + (Split-Path $file -Leaf); seconds = [math]::Round($seconds, 3) }
  if ($Provider -eq 'elevenlabs') { $entry.words = $words }
  $durations[$line.key] = $entry
}

$durations | ConvertTo-Json -Depth 6 | Set-Content (Join-Path $root "src\episodes\$Episode.narration.json") -Encoding utf8
Write-Host "Prepared $Episode with $(@($lines).Count) narration lines ($Provider)."
if ($Provider -eq 'elevenlabs') { Write-Host "ElevenLabs characters used this run: $paid" }
