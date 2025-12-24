// public/js/map.js
document.addEventListener("DOMContentLoaded", () => {
    const mapElement = document.getElementById('map');
    if (mapElement) {
        const rawCoords = JSON.parse(mapElement.getAttribute('data-coords'));
        const title = mapElement.getAttribute('data-title');

        // GeoJSON [lon, lat] hota hai, humein [lat, lon] mein convert karna hai
        const coordinates = (rawCoords && rawCoords.length === 2) 
            ? [rawCoords[1], rawCoords[0]] 
            : [28.6139, 77.2090]; 

        const map = L.map('map').setView(coordinates, 12);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '© OpenStreetMap'
        }).addTo(map);

        L.marker(coordinates).addTo(map)
            .bindPopup(`<div style="text-align: center;">
            <h6 style="margin: 0; color: #fe424d;">${listingTitle}</h6>
            <p style="margin: 0; font-size: 12px; color: #555;">Exact location shared after booking.</p>
        </div>`)
            .openPopup();
            
        // Map tiles ko sahi se load karne ke liye
        setTimeout(() => { map.invalidateSize(); }, 500);
    }
});