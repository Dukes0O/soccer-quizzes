async function loadGallery() {
  const gallery = document.getElementById('gallery');
  try {
    const res = await fetch('../resources/manifest.json');
    if (!res.ok) {
      gallery.innerHTML = '<p class="text-red-400">Failed to load tactical data.</p>';
      return;
    }
    const formations = await res.json();
    gallery.innerHTML = '';
    formations.forEach(item => {
      if (!item.image || typeof item.image !== 'string') return;

      const card = document.createElement('div');
      card.className = 'glass-panel rounded-2xl overflow-hidden card-hover flex flex-col border-t-4';
      card.style.borderColor = item.themeColor || '#22c55e';

      card.innerHTML = `
        <div class="relative aspect-video overflow-hidden bg-slate-800">
          <img src="../${item.image}" alt="${item.title}" loading="lazy" class="w-full h-full object-contain p-4">
          <div class="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
        </div>
        <div class="p-6 flex flex-col flex-1">
          <h2 class="text-2xl font-bold font-sports mb-2 text-white">${item.title}</h2>
          <p class="text-slate-400 text-sm mb-6 flex-1">${item.description}</p>
          <a href="../resources/formation.html?id=${item.id}" class="mt-auto inline-block text-center bg-green-600 hover:bg-green-500 text-white font-sports py-3 rounded-xl transition shadow-lg tracking-widest">ANALYSIS</a>
        </div>
      `;
      gallery.appendChild(card);
    });
  } catch (e) {
    gallery.innerHTML = '<p class="text-red-400">Failed to load tactical data.</p>';
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadGallery);
} else {
  loadGallery();
}
