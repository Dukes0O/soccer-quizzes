function seasonTotals(matches) {
  return matches.filter(m => m.countsForTeamStats !== false).reduce((total, match) => {
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

async function renderSeason() {
  const container = document.getElementById('season-stats');
  try {
    const response = await fetch('data/current-season.json', { cache: 'no-cache' });
    if (!response.ok) throw new Error('Season unavailable');
    const season = await response.json();
    document.getElementById('season-label').textContent = `${season.season} Season`;
    const totals = seasonTotals(season.matches);
    const metrics = [['Matches', totals.played], ['Clean sheets', totals.cleanSheets], ['Goals for', totals.for], ['Goals against', totals.against]];
    container.innerHTML = `<dl class="season-metrics">${metrics.map(([label, value]) => `<div><dt>${label}</dt><dd>${value}</dd></div>`).join('')}</dl>`;
    if (!season.matches.length) {
      container.insertAdjacentHTML('beforeend', '<section class="py-12 border-b border-white/10"><h2 class="font-sports text-3xl font-bold mb-3">A New Season Starts Here</h2><p class="text-slate-300">No matches recorded yet.</p></section>');
      return;
    }
    const heading = document.createElement('h2');
    heading.className = 'font-sports text-2xl mt-8 mb-4';
    heading.textContent = 'Match Record';
    container.appendChild(heading);
    const list = document.createElement('ul');
    for (const match of season.matches) {
      const row = document.createElement('li');
      row.className = 'archive-link';
      row.textContent = `${match.date} | ${match.opponent} | ${match.for}-${match.against}${match.countsForTeamStats === false ? ' (Friendly, excluded from totals)' : ''}`;
      list.appendChild(row);
    }
    container.appendChild(list);
  } catch (error) {
    container.innerHTML = '<p role="alert">Results could not load. Please reload the page. The season archive is still available below.</p>';
  }
}

if (typeof document !== 'undefined') document.addEventListener('DOMContentLoaded', renderSeason);
if (typeof module !== 'undefined') module.exports = { seasonTotals };
