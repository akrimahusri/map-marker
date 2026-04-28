const map = L.map('map', { zoomControl: true });

const markers = [];
const filterButtons = Array.from(document.querySelectorAll('.filter-btn'));
const markerCount = document.getElementById('marker-count');
const statusText = document.getElementById('status-text');

const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');

const initialView = [-6.2, 106.816666];
let activeCategory = 'all';

const categoryColors = {
  wisata: '#0f6c5f',
  kuliner: '#c26a20',
  sejarah: '#7a4ea3',
  ibadah: '#2057b8',
  default: '#5d6a65',
};

// MAP TILE
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; OpenStreetMap contributors',
}).addTo(map);

map.setView(initialView, 12);

// STATUS
function setStatus(message) {
  if (statusText) statusText.textContent = message;
}

// MARKER ICON
function createMarkerIcon(category) {
  const color = categoryColors[category] || categoryColors.default;

  return L.divIcon({
    className: 'category-marker-icon',
    html: `<span class="category-marker-dot" style="background:${color}"></span>`,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
    popupAnchor: [0, -8],
  });
}

// COUNT
function syncMarkerCount() {
  const visibleCount = markers.filter((entry) => {
    return activeCategory === 'all' || entry.category === activeCategory;
  }).length;

  markerCount.textContent = String(visibleCount);
}

// ADD MARKER
function addMarker(markerData) {
  if (Math.abs(markerData.lat) > 90 || Math.abs(markerData.lng) > 180) return;

  const latlng = [markerData.lat, markerData.lng];
  const category = markerData.category || 'wisata';
  const title = markerData.title || `${markerData.lat}, ${markerData.lng}`;

  const marker = L.marker(latlng, {
    icon: createMarkerIcon(category),
  }).addTo(map);

  marker.myTitle = (title || "").toLowerCase();

  const popupContent = `
    <div>
      <strong>${title}</strong><br/>
      <button class="delete-btn">🗑 Hapus</button>
    </div>
  `;

  marker.bindPopup(popupContent);

  if (markerData.description) {
    marker.bindTooltip(markerData.description, {
      direction: 'top',
      sticky: true,
    });
  }

  const entry = { marker, category };
  markers.push(entry);

  // DELETE HANDLER
  marker.on('popupopen', () => {
    const btn = document.querySelector('.delete-btn');

    if (btn) {
      btn.onclick = () => {
        const confirmDelete = confirm(`Hapus marker "${title}"?`);
        if (!confirmDelete) return;

        map.removeLayer(marker);

        const index = markers.indexOf(entry);
        if (index !== -1) markers.splice(index, 1);

        syncMarkerCount();
        setStatus(`Marker "${title}" dihapus.`);
      };
    }
  });

  return marker;
}

// FILTER
function applyFilter() {
  markers.forEach((entry) => {
    const show =
      activeCategory === 'all' || entry.category === activeCategory;

    if (show) {
      if (!map.hasLayer(entry.marker)) entry.marker.addTo(map);
    } else {
      if (map.hasLayer(entry.marker)) map.removeLayer(entry.marker);
    }
  });

  syncMarkerCount();

  setStatus(
    activeCategory === 'all'
      ? 'Menampilkan semua marker.'
      : `Menampilkan kategori ${activeCategory}.`
  );
}

function setActiveFilter(category) {
  activeCategory = category;

  filterButtons.forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.category === category);
  });

  applyFilter();
}

// FILTER EVENTS
filterButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    setActiveFilter(btn.dataset.category);
  });
});

// SEARCH
function performSearch() {
  const query = searchInput.value.toLowerCase();
  const filtered = [];

  markers.forEach((entry) => {
    if (entry.marker.myTitle.includes(query)) {
      if (!map.hasLayer(entry.marker)) entry.marker.addTo(map);
      filtered.push(entry.marker);
    } else {
      if (map.hasLayer(entry.marker)) map.removeLayer(entry.marker);
    }
  });

  if (filtered.length) {
    const group = new L.featureGroup(filtered);
    map.fitBounds(group.getBounds().pad(0.1));
    setStatus(`Ditemukan ${filtered.length} lokasi.`);
  } else {
    setStatus("Tidak ditemukan.");
  }
}

searchBtn.addEventListener('click', performSearch);
searchInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') performSearch();
});

// LOAD DATA
async function loadMarkers() {
  try {
    const response = await fetch('data/markers.json', {
      cache: 'no-store',
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const data = await response.json();

    if (!Array.isArray(data)) {
      throw new Error('markers.json harus array');
    }

    data.forEach(addMarker);

    syncMarkerCount();
    setStatus(`Berhasil memuat ${markers.length} marker.`);
  } catch (err) {
    console.error(err);
    setStatus("Gagal memuat data (gunakan Live Server)");
  }
}

loadMarkers();