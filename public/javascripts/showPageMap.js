    mapboxgl.accessToken = mapToken;
    const map = new mapboxgl.Map({
    container: 'map', 
    style: 'mapbox://styles/mapbox/streets-v11',
    center: guildbase.geometry.coordinates, // starting position [lng, lat]
    zoom: 8 // starting zoom
    });
 
    map.addControl(new mapboxgl.NavigationControl());

    new mapboxgl.Marker()
    .setLngLat(guildbase.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({ offset: 25 })
            .setHTML(
                `<h3>${guildbase.title}</h3><p>${guildbase.location}</p>`
            )
    )
    .addTo(map)