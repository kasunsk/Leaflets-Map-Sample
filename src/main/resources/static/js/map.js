/**
 * Created by kasun on 5/17/17.
 */


var leaf_map;

function init() {

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


    function refreshMarkers() {
    }

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

    var MyCustomMarker = L.Icon.extend({
        options: {
            shadowUrl: null,
            iconAnchor: new L.Point(12, 12),
            iconSize: new L.Point(24, 24),
            iconUrl: 'imgs/image.png'
        }
    });

    var drawnItems = new L.FeatureGroup();
    leaf_map.addLayer(drawnItems);
    var drawControl = new L.Control.Draw({
        position: 'topright',
        draw: {
            polyline: {
                shapeOptions: {
                    color: '#f357a1',
                    weight: 10
                }
            },
            polygon: {
                allowIntersection: false, // Restricts shapes to simple polygons
                drawError: {
                    color: '#e1e100', // Color the shape will turn when intersects
                    message: '<strong>Oh snap!<strong> you can\'t draw that!' // Message that will show when intersect
                },
                shapeOptions: {
                    color: '#bada55'
                }
            },
            circle: false, // Turns off this drawing tool
            rectangle: {
                shapeOptions: {
                    clickable: false
                }
            },
            marker: {
                icon: new MyCustomMarker()
            }
        },
        edit: {
            featureGroup: drawnItems, //REQUIRED!!
            remove: false
        }
    });
    leaf_map.addControl(drawControl);

}

function actions() {

    leaf_map.on('draw:created', function (e) {
            alert('It wordks')
    });

    leaf_map.on('draw:deleted', function (e) {
        alert('It Deleted')
    });

    leaf_map.on('draw:edited', function (e) {
        alert('It Edited')
    });
}


function startPolling() {
}

