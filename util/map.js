// ====== Leaflet Map Initialization ======
    const map = L.map('map').setView([-7.7862798032977025, 110.35876243689253], 16);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
    }).addTo(map);

    L.marker([-7.7862798032977025, 110.35876243689253]).addTo(map)
      .bindPopup('Kelurahan Bumiijo')
      .openPopup();