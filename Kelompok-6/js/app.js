const map = L.map('map', {
  zoomControl: true,
});

const markers = [];
const markerCount = document.getElementById('marker-count');
const statusText = document.getElementById('status-text');
const initialView = [-6.2, 106.816666];

const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; OpenStreetMap contributors',
});

tiles.addTo(map);

map.setView(initialView, 12);

function syncMarkerCount() {
  markerCount.textContent = String(markers.length);
}

function setStatus(message) {
  statusText.textContent = message;
}

function addMarker(markerData) {
  const latlng = [markerData.lat, markerData.lng];
  const marker = L.marker(latlng).addTo(map);
  const popupText = markerData.title || `${markerData.lat}, ${markerData.lng}`;
  marker.bindPopup(popupText);
  markers.push(marker);

  if (markerData.description) {
    marker.bindTooltip(markerData.description, {
      direction: 'top',
      sticky: true,
    });
  }

  return marker;
}

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

    syncMarkerCount();

    if (markers.length === 0) {
      setStatus('markers.json belum berisi marker.');
      return;
    }

    setStatus(`Berhasil memuat ${markers.length} marker dari markers.json.`);
  } catch (error) {
    setStatus('Gagal memuat markers.json. Jalankan via server lokal dan cek isi file.');
    console.error('Failed to load markers.json:', error);
  }
}

loadMarkers();