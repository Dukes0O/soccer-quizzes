async function loadGallery() {
  console.log('gallery.js: loadGallery');
  const gallery = document.getElementById('gallery');
  try {
    // Use relative path to the manifest file
    const res = await fetch('../resources/manifest.json');
    if (!res.ok) {
      console.error('gallery.js: manifest fetch error', res.status, res.statusText);
      gallery.innerHTML = '<p class="text-red-600">Failed to load gallery.</p>';
      return;
    }
    const formations = await res.json();
    console.log('gallery.js: loaded items', formations.length);
    gallery.innerHTML = '';
    formations.forEach(item => {
      // Defensive: skip items with missing image file or empty string
      if (!item.image || typeof item.image !== 'string') return;
      const card = document.createElement('div');
      card.className = 'bg-white rounded shadow p-4 flex flex-col items-center';
      card.innerHTML = `
        <img src="/${item.image}" alt="${item.title}" loading="lazy" class="max-w-full h-auto mb-3 border rounded" style="background:${item.themeColor};">
        <h2 class="text-xl font-semibold mb-1">${item.title}</h2>
        <p class="mb-2 text-gray-700">${item.description}</p>
        <a href="../resources/formation.html?id=${item.id}" class="mt-auto px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">View Full</a>
      `;
      gallery.appendChild(card);
    });
  } catch (e) {
    gallery.innerHTML = '<p class="text-red-600">Failed to load gallery.</p>';
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadGallery);
} else {
  loadGallery();
}
