/**
 * Created by kasun on 5/17/17.
 */


var leaf_map;

var latitude;
var longitude;

var drawnItems;

var drawControl;

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

    drawnItems = new L.FeatureGroup();
    leaf_map.addLayer(drawnItems);
    drawControl = new L.Control.Draw({
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
            circle: true, // Turns off this drawing tool
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
            remove: true
        }
    });
    leaf_map.addControl(drawControl);

}

function actions() {

    var type;

    leaf_map.on('draw:drawstart', function (e) {

        drawnItems.eachLayer(function (layer) {
            drawnItems.removeLayer(layer);
        });

    });

    leaf_map.on('draw:created', function (e) {

         type = e.layerType;
         var layer = e.layer;

        leaf_map.addLayer(layer);

        if (type === 'marker') {

            $('#shape').text('Marker');

            $('#var1').text('Lat & Lng : ');
            $('#val1').text(layer.getLatLng());

            $('#var2').text('');
            $('#val2').text('');
        }

        if (type === 'rectangle') {

            $('#shape').text('Rectangle');

            $('#var1').text('NE : ');
            $('#val1').text(layer.getBounds().getNorthEast());

            $('#var2').text('SW : ');
            $('#val2').text(layer.getBounds().getSouthWest());
        }

        if (type === 'circle') {

            $('#shape').text('Circle');

            $('#var1').text('Radius : ');
            $('#val1').text(layer.getRadius());

            $('#var2').text('Center : ');
            var center =  layer.getLatLng();
            $('#val2').text(center);

        }
        drawnItems.addLayer(layer);
    });

    leaf_map.on('draw:editmove', function (e) {

        var layer = e.layer;

        leaf_map.addLayer(layer);

        if (type === 'marker') {

            $('#shape').text('Marker');

            $('#var1').text('Lat & Lng : ');
            $('#val1').text(layer.getLatLng());

            $('#var2').text('');
            $('#val2').text('');
        }

        if (type === 'circle') {
            $('#shape').text('Circle');

            $('#var1').text('Radius : ');
            $('#val1').text(layer.getRadius());

            $('#var2').text('Center : ');
            var center =  layer.getLatLng();
            $('#val2').text(center);
        }

        if (type === 'rectangle')
        {
            $('#shape').text('Rectangle');

            $('#var1').text('NE : ');
            $('#val1').text(layer.getBounds().getNorthEast());

            $('#var2').text('SW : ');
            $('#val2').text(layer.getBounds().getSouthWest());
        }
    });

    leaf_map.on('draw:editresize', function (e) {

        var layer = e.layer;

        if (type === 'circle')
        {
            $('#shape').text('Circle');

            $('#var1').text('Radius : ');
            $('#val1').text(layer.getRadius());

            $('#var2').text('Center : ');
            var center = layer.getLatLng();
            $('#val2').text(center);
        }

        if (type === 'rectangle')
        {
            $('#shape').text('Rectangle');

            $('#var1').text('NE : ');
            $('#val1').text(layer.getBounds().getNorthEast());

            $('#var2').text('SW : ');
            $('#val2').text(layer.getBounds().getSouthWest());
        }

    });
}


function startPolling() {
}

