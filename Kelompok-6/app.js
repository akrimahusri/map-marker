const map = L.map('map', {
  zoomControl: true,
});

const markers = [];
const markerCount = document.getElementById('marker-count');
const statusText = document.getElementById('status-text');
const locateButton = document.getElementById('locate-btn');
const clearButton = document.getElementById('clear-btn');

const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; OpenStreetMap contributors',
});

tiles.addTo(map);

map.setView([-6.2, 106.816666], 12);

function syncMarkerCount() {
  markerCount.textContent = String(markers.length);
}

function setStatus(message) {
  statusText.textContent = message;
}

function addMarker(latlng, label) {
  const marker = L.marker(latlng).addTo(map);
  marker.bindPopup(label).openPopup();
  markers.push(marker);
  syncMarkerCount();
  setStatus(`Marker ditambahkan di ${latlng.lat.toFixed(5)}, ${latlng.lng.toFixed(5)}`);
}

map.on('click', (event) => {
  const label = `Marker baru: ${event.latlng.lat.toFixed(5)}, ${event.latlng.lng.toFixed(5)}`;
  addMarker(event.latlng, label);
});

locateButton.addEventListener('click', () => {
  if (!navigator.geolocation) {
    setStatus('Browser tidak mendukung geolocation.');
    return;
  }

  setStatus('Mencari lokasi perangkat...');

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const latlng = [position.coords.latitude, position.coords.longitude];
      map.setView(latlng, 15, { animate: true });

      const label = 'Lokasi Anda saat ini';
      addMarker(L.latLng(latlng[0], latlng[1]), label);
    },
    () => {
      setStatus('Lokasi perangkat tidak bisa diakses.');
    },
    {
      enableHighAccuracy: true,
      timeout: 8000,
      maximumAge: 0,
    }
  );
});

clearButton.addEventListener('click', () => {
  while (markers.length > 0) {
    const marker = markers.pop();
    map.removeLayer(marker);
  }

  syncMarkerCount();
  setStatus('Semua marker sudah dihapus.');
});

syncMarkerCount();