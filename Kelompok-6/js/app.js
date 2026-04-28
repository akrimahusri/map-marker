const map = L.map('map', { zoomControl: true });
const markers = [];
const markerCount = document.getElementById('marker-count');
const statusText = document.getElementById('status-text');
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; OpenStreetMap contributors',
}).addTo(map);

map.setView([5.5512, 95.3235], 13);

function syncMarkerCount() {
  markerCount.textContent = String(markers.length);
}

function addMarker(markerData) {
  // FILTER OTOMATIS: Abaikan data yang koordinatnya di luar bumi
  if (Math.abs(markerData.lat) > 90 || Math.abs(markerData.lng) > 180) return;

  const latlng = [markerData.lat, markerData.lng];
  const marker = L.marker(latlng).addTo(map);
  
  marker.myTitle = (markerData.title || "").toLowerCase();
  
  const popupText = markerData.title || `${markerData.lat}, ${markerData.lng}`;
  marker.bindPopup(popupText);
  
  if (markerData.description) {
    marker.bindTooltip(markerData.description, { direction: 'top', sticky: true });
  }
  
  markers.push(marker);
}

function performSearch() {
  const query = searchInput.value.toLowerCase();
  const filtered = [];

  markers.forEach(marker => {
    if (marker.myTitle.includes(query)) {
      if (!map.hasLayer(marker)) marker.addTo(map);
      filtered.push(marker);
    } else {
      if (map.hasLayer(marker)) map.removeLayer(marker);
    }
  });

  if (filtered.length > 0) {
    const group = new L.featureGroup(filtered);
    map.fitBounds(group.getBounds().pad(0.1));
    statusText.textContent = `Ditemukan ${filtered.length} lokasi.`;
  } else {
    statusText.textContent = "Tidak ditemukan.";
  }
}

searchBtn.addEventListener('click', performSearch);
searchInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') performSearch(); });

async function loadMarkers() {
  try {
    const response = await fetch('data/markers.json', { cache: 'no-store' });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    
    const data = await response.json();
    data.forEach(item => addMarker(item));
    
    syncMarkerCount();
    statusText.textContent = `Berhasil memuat ${markers.length} data.`;
  } catch (err) {
    statusText.textContent = "Gagal memuat (Gunakan Live Server!)";
    console.error(err);
  }
}

loadMarkers();