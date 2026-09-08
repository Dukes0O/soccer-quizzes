const formatDate = date => new Intl.DateTimeFormat('en-CA', { weekday: 'short', month: 'short', day: 'numeric' }).format(new Date(`${date}T12:00:00`));
const formatTime = time => time ? new Intl.DateTimeFormat('en-CA', { hour: 'numeric', minute: '2-digit' }).format(new Date(`2026-01-01T${time}:00`)) : 'Time not posted';

fetch('data/schedule.json').then(response => response.json()).then(schedule => {
  document.querySelector('#schedule-title').textContent = `${schedule.team} | ${schedule.season}`;
  document.querySelector('#fixture-list').innerHTML = schedule.fixtures.map((fixture, index) => `
    <article class="glass-panel rounded-2xl p-5 fixture-card" aria-label="Fixture ${index + 1}">
      <div class="fixture-date"><span class="text-green-400">${formatDate(fixture.date)}</span><span>${formatTime(fixture.time)}</span></div>
      <div class="fixture-match"><span>${fixture.home}</span><strong>${fixture.home === schedule.team ? 'HOME' : fixture.away === schedule.team ? 'AWAY' : 'BYE'}</strong><span>${fixture.away}</span></div>
      <p class="text-slate-400 text-sm mt-3">Field: <span class="text-slate-200">${fixture.field}</span></p>
      ${fixture.time ? '<p class="text-slate-500 text-xs mt-2">35-minute game · approximately 5-minute halftime</p>' : ''}
    </article>`).join('');
}).catch(() => { document.querySelector('#fixture-list').innerHTML = '<p>Schedule unavailable. Please try again later.</p>'; });
