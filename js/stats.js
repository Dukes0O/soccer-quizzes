function seasonTotals(matches) {
  return matches.filter(m => m.countsForTeamStats !== false && Number.isInteger(m.for) && Number.isInteger(m.against)).reduce((total, match) => {
    total.played++;
    total.for += match.for;
    total.against += match.against;
    total.wins += Number(match.for > match.against);
    total.ties += Number(match.for === match.against);
    total.losses += Number(match.for < match.against);
    total.cleanSheets += Number(match.against === 0);
    return total;
  }, { played: 0, for: 0, against: 0, wins: 0, ties: 0, losses: 0, cleanSheets: 0 });
}

function seasonSummary(season) {
  const totals = seasonTotals(season.matches);
  const players = season.players || [];
  const assists = players.length ? players.reduce((sum, player) => sum + player.assists, 0) : null;
  return {
    ...totals,
    difference: `${totals.for - totals.against > 0 ? '+' : ''}${totals.for - totals.against}`,
    gaAverage: totals.played ? (totals.against / totals.played).toFixed(2) : '--',
    gfAverage: totals.played ? (totals.for / totals.played).toFixed(2) : '--',
    assists,
    points: assists === null ? null : totals.for + assists,
    cleanMinutes: Number.isFinite(season.cleanMinutes) ? season.cleanMinutes : null
  };
}

function statsCell(text, className = '') {
  return { text: text ?? '--', className };
}

function renderStatsTable(id, rows, columns, emptyText) {
  const body = document.getElementById(id);
  body.replaceChildren();
  if (!rows.length) {
    const row = document.createElement('tr');
    const cell = document.createElement('td');
    cell.colSpan = columns;
    cell.className = 'px-6 py-8 text-slate-400';
    cell.textContent = emptyText;
    row.appendChild(cell);
    body.appendChild(row);
    return;
  }
  rows.forEach(values => {
    const row = document.createElement('tr');
    values.forEach(value => {
      const cell = document.createElement('td');
      cell.className = `px-5 py-4 ${value.className || 'text-slate-300'}`;
      cell.textContent = value.text;
      row.appendChild(cell);
    });
    body.appendChild(row);
  });
}

function againstClass(value) {
  if (value === 0) return 'text-green-400 bg-green-500/10';
  if (value === 1) return 'text-lime-300 bg-lime-500/10';
  if (value === 2) return 'text-amber-300 bg-amber-500/10';
  return 'text-red-300 bg-red-500/10';
}

function renderUnitCredit(id, credits, color) {
  const container = document.getElementById(id);
  container.replaceChildren();
  if (!credits.length) {
    const placeholder = document.createElement('p');
    placeholder.className = 'text-slate-400 text-sm';
    placeholder.textContent = 'Appearances not recorded yet.';
    container.appendChild(placeholder);
    return;
  }
  credits.forEach(player => {
    const row = document.createElement('div');
    row.className = 'flex items-center justify-between gap-4 border-b border-white/5 pb-4';
    const name = document.createElement('p');
    name.className = 'font-sports text-2xl font-bold text-white';
    name.textContent = player.name;
    const value = document.createElement('p');
    value.className = `font-sports text-4xl font-bold ${color}`;
    value.textContent = player.sheets;
    row.append(name, value);
    container.appendChild(row);
  });
}

function renderSeasonStats(season) {
  const summary = seasonSummary(season);
  const set = (id, value) => { document.getElementById(id).textContent = value ?? '--'; };
  const matches = season.matches.filter(m => Number.isInteger(m.for) && Number.isInteger(m.against));
  const counted = matches.filter(m => m.countsForTeamStats !== false);
  const latest = counted.at(-1);
  const formatDate = date => new Intl.DateTimeFormat('en-CA', { month: 'short', day: 'numeric' }).format(new Date(`${date}T12:00:00`));
  set('season-label', `${season.season} Season${latest ? ` | Results through ${formatDate(latest.date)}` : ''}`);
  set('stat-clean-sheets', summary.cleanSheets);
  set('stat-clean-minutes', summary.cleanMinutes);
  set('stat-record', `${summary.wins}-${summary.losses}-${summary.ties}`);
  set('stat-difference', summary.difference);
  set('stat-ga-average', summary.gaAverage);
  set('stat-goals-for', summary.for);
  set('team-story', `${summary.played} matches recorded, with ${summary.for} goals scored and ${summary.against} conceded. The focus stays on holding shape, protecting each other, and defending as a unit.`);
  const shutoutWins = counted.filter(m => m.against === 0 && m.for > 0).length;
  set('shutout-wins', shutoutWins);
  set('shutout-note', shutoutWins ? `${shutoutWins} shutout win${shutoutWins === 1 ? '' : 's'} recorded this season.` : 'No shutout wins recorded in the results entered so far.');
  const players = season.players || [];
  set('scoring-balance', players.length ? `${players.filter(p => p.goals > 0).length} Players` : 'Awaiting records');
  const numeric = 'text-right font-sports text-2xl font-bold text-white';
  renderStatsTable('match-table', matches.map(match => [
    statsCell(formatDate(match.date), 'font-sports text-lg font-bold text-slate-200'),
    statsCell(match.opponent), statsCell(match.for, numeric),
    statsCell(match.against, `${numeric} ${againstClass(match.against)}`),
    statsCell(match.countsForTeamStats === false ? 'FRIENDLY' : match.for > match.against ? 'WIN' : match.for < match.against ? 'LOSS' : 'TIE', 'text-right font-sports text-lg font-bold')
  ]), 5, 'No match results recorded yet.');
  renderUnitCredit('keeper-credit', season.keeperCleanSheetCredits || [], 'text-blue-400');
  renderUnitCredit('defensive-credit', season.cleanSheetCredits || [], 'text-green-400');
  renderStatsTable('defense-table', (season.defensiveLines || []).map(line => [
    statsCell(formatDate(line.date)), statsCell(line.keeper), statsCell(line.mid),
    statsCell(line.left), statsCell(line.right), statsCell(line.against, numeric)
  ]), 6, 'Defensive lineups have not been recorded yet.');
  renderStatsTable('attacking-table', [...players].sort((a, b) => (b.goals + b.assists) - (a.goals + a.assists) || b.goals - a.goals).map(player => [
    statsCell(player.name, 'font-sports text-xl font-bold text-white'),
    statsCell(player.goals, numeric), statsCell(player.assists, numeric), statsCell(player.goals + player.assists, numeric)
  ]), 4, 'Player goals and assists have not been recorded yet.');
  const totals = document.getElementById('team-totals');
  totals.replaceChildren();
  for (const [label, value] of [['Goals For', summary.for], ['Goals Against', summary.against], ['Goal Spread', summary.difference], ['Clean Sheets', summary.cleanSheets], ['GA / Game', summary.gaAverage], ['GF / Game', summary.gfAverage], ['Assists', summary.assists], ['Team Points', summary.points]]) {
    const cell = document.createElement('div');
    cell.className = 'bg-slate-900/95 p-6';
    const amount = document.createElement('p');
    amount.className = 'font-sports text-4xl font-bold text-white';
    amount.textContent = value ?? '--';
    const caption = document.createElement('p');
    caption.className = 'font-sports text-xs text-slate-400 uppercase';
    caption.textContent = label;
    cell.append(amount, caption);
    totals.appendChild(cell);
  }
}

async function renderSeason() {
  const status = document.getElementById('stats-status');
  try {
    const response = await fetch('data/current-season.json', { cache: 'no-cache' });
    if (!response.ok) throw new Error('Season unavailable');
    renderSeasonStats(await response.json());
    status.hidden = true;
  } catch (error) {
    status.textContent = 'Season stats could not load. Please reload the page.';
  }
}

if (typeof document !== 'undefined') document.addEventListener('DOMContentLoaded', renderSeason);
if (typeof module !== 'undefined') module.exports = { seasonTotals, seasonSummary };
