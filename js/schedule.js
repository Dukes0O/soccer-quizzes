const formatDate = date => new Intl.DateTimeFormat('en-CA', { weekday: 'short', month: 'short', day: 'numeric' }).format(new Date(`${date}T12:00:00`));
const formatTime = time => time ? new Intl.DateTimeFormat('en-CA', { hour: 'numeric', minute: '2-digit' }).format(new Date(`2026-01-01T${time}:00`)) : 'Time not posted';

fetch('data/schedule.json', { cache: 'no-cache' }).then(response => {
  if (!response.ok) throw new Error('Schedule unavailable');
  return response.json();
}).then(schedule => {
  document.querySelector('#schedule-title').textContent = `${schedule.team} | ${schedule.season}`;
  document.querySelector('#fixture-list').innerHTML = schedule.fixtures.map((fixture, index) => `
    <article class="glass-panel rounded-2xl p-5 fixture-card" aria-label="Fixture ${index + 1}">
      <div class="fixture-date"><span class="text-green-400">${formatDate(fixture.date)}</span><span>${fixture.status === 'bye' ? 'BYE' : formatTime(fixture.time)}</span></div>
      <div class="fixture-match"><span>${fixture.home}</span><strong>${Number.isInteger(fixture.homeScore) && Number.isInteger(fixture.awayScore) ? `${fixture.homeScore} - ${fixture.awayScore}` : fixture.status === 'bye' ? 'BYE' : fixture.home === schedule.team ? 'HOME' : 'AWAY'}</strong><span>${fixture.away}</span></div>
      ${fixture.status === 'bye' ? '<p class="text-slate-300 text-sm mt-3">No game</p>' : `<p class="text-slate-400 text-sm mt-3">Field: <span class="text-slate-200">${fixture.field}</span></p>`}
    </article>`).join('');
}).catch(() => { document.querySelector('#fixture-list').innerHTML = '<p>Schedule unavailable. Please try again later.</p>'; });
