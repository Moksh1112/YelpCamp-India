const mapDiv = document.getElementById('map');

if (mapDiv) {

    const map = L.map('map').setView([28.6139, 77.2090], 5);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19
    }).addTo(map);
    
    if (typeof campgrounds !== "undefined") {
        campgrounds.forEach(camp => {
    if (!camp.geometry || !camp.geometry.coordinates) return;
        const coords = camp.geometry.coordinates;
    if (!coords[0] || !coords[1]) return;
        L.marker([coords[1], coords[0]])
            .addTo(map)
            .bindPopup(camp.title);

});

    }
}