const map = L.map('map', {
  zoomControl: true,
});

const markers = [];
const filterButtons = Array.from(document.querySelectorAll('.filter-btn'));
const markerCount = document.getElementById('marker-count');
const statusText = document.getElementById('status-text');
const initialView = [-6.2, 106.816666];
let activeCategory = 'all';

const categoryColors = {
  wisata: '#0f6c5f',
  kuliner: '#c26a20',
  sejarah: '#7a4ea3',
  ibadah: '#2057b8',
  default: '#5d6a65',
};

const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; OpenStreetMap contributors',
});


tiles.addTo(map);

map.setView(initialView, 12);

function syncMarkerCount() {
  const visibleCount = markers.filter((entry) => {
    return activeCategory === 'all' || entry.category === activeCategory;
  }).length;

  markerCount.textContent = String(visibleCount);
}

function setStatus(message) {
  statusText.textContent = message;
}

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

function addMarker(markerData) {
  const latlng = [markerData.lat, markerData.lng];
  const category = markerData.category || 'wisata';
  const title = markerData.title || `${markerData.lat}, ${markerData.lng}`;

  const marker = L.marker(latlng, {
    icon: createMarkerIcon(category),
  }).addTo(map);

  // 🔥 Popup + tombol delete
  const popupContent = `
    <div class="popup-content">
      <strong>${title}</strong><br/>
      <button class="delete-btn">🗑 Hapus</button>
    </div>
  `;

  marker.bindPopup(popupContent);

  // Tooltip
  if (markerData.description) {
    marker.bindTooltip(markerData.description, {
      direction: 'top',
      sticky: true,
    });
  }

  // 🔥 Simpan dengan struktur konsisten
  const entry = { marker, category };
  markers.push(entry);

  // 🔥 Event delete
  marker.on('popupopen', () => {
    const deleteBtn = document.querySelector('.delete-btn');

    if (deleteBtn) {
      deleteBtn.addEventListener('click', () => {
        const confirmDelete = confirm(`Yakin ingin menghapus marker "${title}"?`);
        if (!confirmDelete) return;

        map.removeLayer(marker);

        // hapus dari array (pakai entry, bukan marker langsung)
        const index = markers.indexOf(entry);
        if (index !== -1) {
          markers.splice(index, 1);
        }

        syncMarkerCount();
        setStatus(`Marker "${title}" dihapus.`);
      });
    }
  });

  return marker;
}

function applyFilter() {
  markers.forEach((entry) => {
    const shouldShow = activeCategory === 'all' || entry.category === activeCategory;

    if (shouldShow) {
      if (!map.hasLayer(entry.marker)) {
        entry.marker.addTo(map);
      }
      return;
    }

    if (map.hasLayer(entry.marker)) {
      map.removeLayer(entry.marker);
    }
  });

  syncMarkerCount();

  const label = activeCategory === 'all'
    ? 'semua kategori'
    : `kategori ${activeCategory}`;

  setStatus(`Menampilkan marker untuk ${label}.`);
}

function setActiveFilter(category) {
  activeCategory = category;

  filterButtons.forEach((button) => {
    button.classList.toggle('active', button.dataset.category === category);
  });

  applyFilter();
}

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    setActiveFilter(button.dataset.category);
  });
});

async function loadMarkers() {
  try {
    const response = await fetch('data/markers.json', { cache: 'no-store' });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const markerDataList = await response.json();

    if (!Array.isArray(markerDataList)) {
      throw new Error('Format markers.json harus berupa array');
    }

    markerDataList.forEach((markerData) => {
      if (
        typeof markerData.lat !== 'number' ||
        typeof markerData.lng !== 'number'
      ) {
        return;
      }

      addMarker(markerData);
    });

    if (markers.length === 0) {
      setStatus('markers.json belum berisi marker.');
      return;
    }

    applyFilter();
  } catch (error) {
    setStatus('Gagal memuat markers.json. Jalankan via server lokal dan cek isi file.');
    console.error('Failed to load markers.json:', error);
  }
}

loadMarkers();