/**
 * Created by kasun on 5/17/17.
 */


var leaf_map;


leaf_map = L.map('mapid').setView([7.872453, 80.771496], 7);

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
    maxZoom: 18,
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
    '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
    'Imagery © <a href="http://mapbox.com">Mapbox</a>',
    id: 'mapbox.streets'
}).addTo(leaf_map);

mbUrl = 'https://mt{s}.google.com/vt/v=w2.106&x={x}&y={y}&z={z}&s=';
L.tileLayer(mbUrl, {
    maxZoom: 18,
    subdomains: '0123'
}).addTo(leaf_map);

var greenIcon = L.icon({
    iconUrl: 'imgs/leaf-green.png',

    iconSize:     [38, 95], // size of the icon
    iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
    popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
});

L.marker([7.884677, 80.534522],
    {
        icon : greenIcon,
        draggable: true,
        title : "Test Marker"
    }
).addTo(leaf_map).bindPopup("<b>Hello world!</b><br />I am a popup.").openPopup();

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

// leaf_map.addControl(new L.Control.Search({
//     url: 'https://nominatim.openstreetmap.org/search?format=json&q={s}',
//     jsonpParam: 'json_callback',
//     propertyName: 'display_name',
//     propertyLoc: ['lat', 'lon'],
//     circleLocation: false,
//     markerLocation: false,
//     autoType: false,
//     autoCollapse: true,
//     minLength: 2,
//     zoom: 12
// }));


var refreshIcon = L.control({
    position: 'topleft'
});
refreshIcon.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'myControl');
    var img_log = "<div class='refreshIcon' title='Refresh locations' onclick='refreshMarkers()'><img src='imgs/refresh.png'></img></div>";
    this._div.innerHTML = img_log;
    return this._div;
};

refreshIcon.addTo(leaf_map);

var resetIcon = L.control({
    position: 'topleft'
});
resetIcon.onAdd = function () {
    this._div = L.DomUtil.create('div', 'myControl');
    var img_log = "<div class='resetIcon' title='Clear Vehicle List ' onclick='deselectAllChecked()'><img src='imgs/reset.png'></img></div>";
    this._div.innerHTML = img_log;
    return this._div;
};

resetIcon.addTo(leaf_map);


var removeGeoFenceIcon = L.control({
    position: 'topleft'
});

removeGeoFenceIcon.onAdd = function () {
    this._div = L.DomUtil.create('div', 'myControl');
    var img_log = "<div class='removeGeoFenceIcon' title='Remove Geofences' onclick='removeGeofencesFromMap()'><img src='imgs/removegef.png'></img></div>";
    this._div.innerHTML = img_log;
    return this._div;
};

removeGeoFenceIcon.addTo(leaf_map);

function removeGeofencesFromMap() {
}

function refreshMarkers() {
}

leaf_map.on('click', onMapClick);

var cameraDiv = L.control({
    position: 'topleft'
});

cameraDiv.onAdd = function () {
    this._div = L.DomUtil.create('div', 'myControl');
    var img_log = "<div class='homeIcon' title='toggle ' onclick='startPolling()'><img src='imgs/camera.png'></img></div>";
    this._div.innerHTML = img_log;
    return this._div;
};
cameraDiv.addTo(leaf_map);

function startPolling() {
}



function onMapClick(e) {
    alert("You clicked the map at " + e.latlng);
}