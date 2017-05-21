/**
 * Created by kasun on 5/17/17.
 */


var leaf_map = L.map('mapid').setView([7.872453, 80.771496], 7);

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
    maxZoom: 18,
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
    '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
    'Imagery © <a href="http://mapbox.com">Mapbox</a>',
    id: 'mapbox.streets'
}).addTo(leaf_map);

L.marker([7.884677, 80.534522]).addTo(leaf_map);

L.marker([7.884677, 80.534522]).addTo(leaf_map).bindPopup("<b>Hello world!</b><br />I am a popup.").openPopup();

// L.circle([7.90, 80.01], {
//     color: 'red',
//     fillColor: '#f03',
//     fillOpacity: 0.5,
//     radius: 1000
// }).addTo(leaf_map);

L.polygon([
    [7.80, 80.6],
    [7.89, 80.5],
    [7.85, 80.4]
]).addTo(leaf_map);

function onMapClick(e) {
    alert("You clicked the map at " + e.latlng);
}

leaf_map.addControl(new L.Control.Search({
    url: 'https://nominatim.openstreetmap.org/search?format=json&q={s}',
    jsonpParam: 'json_callback',
    propertyName: 'display_name',
    propertyLoc: ['lat', 'lon'],
    circleLocation: false,
    markerLocation: false,
    autoType: false,
    autoCollapse: true,
    minLength: 2,
    zoom: 12
}));

leaf_map.on('click', onMapClick);
