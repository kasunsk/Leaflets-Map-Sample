/**
 * Created by kasun on 5/17/17.
 */


var leaf_map;

var latitude;
var longitude;

var drawnItems;

var drawControl;

var navigationScript = true;

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

    var zoomResetDiv = document.createElement('div');
    //var zoomReset = new ZoomReset(zoomResetDiv, map);

    zoomResetDiv.index = 1;

    var zoomResetIcon = L.control({
        position: 'topleft'
    });

    zoomResetIcon.onAdd = function () {
        zoomResetDiv.style.display = 'inline-block';
        zoomResetDiv.style.float = 'center';
        this._div = L.DomUtil.create('div', 'myControl');
        var img_log = "<div class='homeIcon' title='toggle ' onclick='reset();'><img src='imgs/home.png'></img></div>";
        this._div.innerHTML = img_log;
        return this._div;
    };

    zoomResetIcon.addTo(leaf_map);



    var toggleDashboardDiv = document.createElement('div');
    toggleDashboardDiv.index = 1;

    var toggleDashboardIcon = L.control({
        position: 'topleft'
    });

    toggleDashboardIcon.onAdd = function () {
        zoomResetDiv.style.display = 'inline-block';
        zoomResetDiv.style.float = 'center';
        this._div = L.DomUtil.create('div', 'myControl');
        var img_log = "<div class='homeIcon' title='toggle ' onclick='reset();'><img src='imgs/Dashboard.png'></img></div>";
        this._div.innerHTML = img_log;
        return this._div;
    };

    toggleDashboardIcon.addTo(leaf_map);


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

    leaf_map.on('contextmenu', function (event) {
        var content = showContextMenu(event.latlng, 'map');
        var popup = L.popup().setLatLng(event.latlng).setContent(content)
            .openOn(leaf_map);
    });

    L.control.weather().addTo(leaf_map);

}

function actions() {

    var type;

    leaf_map.on('draw:drawstart', function (e) {

        drawnItems.eachLayer(function (layer) {
            drawnItems.removeLayer(layer);
        });

    });

    leaf_map.on('draw:drawvertex', function (e) {

        $("#coordinateTable").empty();
        var layers = e.layers;

        var i = 0;

        layers.eachLayer(function (layer) {
            i++;
            var latlng = layer.getLatLng();
            $('#coordinateTable').append('<tr><td>' + 'Coordinate ' + i + ' ' + '</td><td>' + latlng + '</td></tr>');
        });

    });

    leaf_map.on('draw:created', function (e) {

         type = e.layerType;
         var layer = e.layer;

        leaf_map.addLayer(layer);

        if (type === 'marker') {

            $("#coordinateTable").empty();
            $('#shape').text('Marker');

            $('#coordinateTable').append( '<tr><td>' + 'Lat & Lng : ' + '</td><td>' + layer.getLatLng() + '</td></tr>' );
        }

        if (type === 'rectangle') {

            $("#coordinateTable").empty();
            $('#shape').text('Rectangle');

            $('#coordinateTable').append( '<tr><td>' + 'NE : ' + '</td><td>' + layer.getBounds().getNorthEast() + '</td></tr>' );
            $('#coordinateTable').append( '<tr><td>' + 'SW : ' + '</td><td>' + layer.getBounds().getSouthWest() + '</td></tr>' );
        }

        if (type === 'circle') {

            $("#coordinateTable").empty();
            $('#shape').text('Circle');
            var center =  layer.getLatLng();

            $('#coordinateTable').append( '<tr><td>' + 'Radius ' + '</td><td>' + layer.getRadius() + '</td></tr>' );
            $('#coordinateTable').append( '<tr><td>' + 'Center ' + '</td><td>' + center + '</td></tr>' );

        }

        if (type === 'polyline') {

            $("#coordinateTable").empty();
            $('#shape').text('Polyline');

            var latlngs = layer.getLatLngs();
            for(var i = 0; i < latlngs.length; i++){
                $('#coordinateTable').append( '<tr><td>' + 'Coordinate ' +  ( i + 1) + '</td><td>' + latlngs[i] + '</td></tr>' );
            }
        }

        if (type === 'polygon') {

            $("#coordinateTable").empty();
            $('#shape').text('Polygon');
            var latlngs = layer.getLatLngs();
            for(var i = 0; i < latlngs.length; i++){
                $('#coordinateTable').append( '<tr><td>' + 'Coordinate ' +  ( i + 1) + '</td><td>' + latlngs[i] + '</td></tr>' );
            }
        }

        drawnItems.addLayer(layer);
    });

    leaf_map.on('draw:editmove', function (e) {

        var layer = e.layer;

        leaf_map.addLayer(layer);

        if (type === 'marker') {

            $("#coordinateTable").empty();
            $('#shape').text('Marker');

            $('#coordinateTable').append( '<tr><td>' + 'Lat & Lng : ' + '</td><td>' + layer.getLatLng() + '</td></tr>' );
        }

        if (type === 'circle') {

            $("#coordinateTable").empty();
            $('#shape').text('Circle');
            var center =  layer.getLatLng();

            $('#coordinateTable').append( '<tr><td>' + 'Radius ' + '</td><td>' + layer.getRadius() + '</td></tr>' );
            $('#coordinateTable').append( '<tr><td>' + 'Center ' + '</td><td>' + center + '</td></tr>' );
        }

        if (type === 'rectangle')
        {
            $("#coordinateTable").empty();
            $('#shape').text('Rectangle');

            $('#coordinateTable').append( '<tr><td>' + 'NE : ' + '</td><td>' + layer.getBounds().getNorthEast() + '</td></tr>' );
            $('#coordinateTable').append( '<tr><td>' + 'SW : ' + '</td><td>' + layer.getBounds().getSouthWest() + '</td></tr>' );
        }

        if (type === 'polygon') {

            $("#coordinateTable").empty();
            $('#shape').text('Polygon');
            var latlngs = layer.getLatLngs();
            for(var i = 0; i < latlngs.length; i++){
                $('#coordinateTable').append( '<tr><td>' + 'Coordinate '+  ( i + 1) + '</td><td>' + latlngs[i] + '</td></tr>' );
            }
        }

        drawnItems.addLayer(layer);
    });

    leaf_map.on('draw:editresize', function (e) {

        var layer = e.layer;

        if (type === 'circle')
        {
            $("#coordinateTable").empty();
            $('#shape').text('Circle');
            var center =  layer.getLatLng();

            $('#coordinateTable').append( '<tr><td>' + 'Radius ' + '</td><td>' + layer.getRadius() + '</td></tr>' );
            $('#coordinateTable').append( '<tr><td>' + 'Center ' + '</td><td>' + center + '</td></tr>' );
        }

        if (type === 'rectangle')
        {
            $("#coordinateTable").empty();
            $('#shape').text('Rectangle');

            $('#coordinateTable').append( '<tr><td>' + 'NE : ' + '</td><td>' + layer.getBounds().getNorthEast() + '</td></tr>' );
            $('#coordinateTable').append( '<tr><td>' + 'SW : ' + '</td><td>' + layer.getBounds().getSouthWest() + '</td></tr>' );
        }

        if (type === 'polyline') {

            $("#coordinateTable").empty();
            $('#shape').text('Polyline');

            var latlngs = layer.getLatLngs();
            for(var i = 0; i < latlngs.length; i++){
                $('#coordinateTable').append( '<tr><td>' + 'Coordinate ' +  ( i + 1) + '</td><td>' + latlngs[i] + '</td></tr>' );
            }
        }

        if (type === 'polygon') {

            $("#coordinateTable").empty();
            $('#shape').text('Polygon');
            var latlngs = layer.getLatLngs();
            for (var i = 0; i < latlngs.length; i++) {
                $('#coordinateTable').append('<tr><td>' + 'Coordinate ' + ( i + 1) + '</td><td>' + latlngs[i] + '</td></tr>');
            }
        }

        drawnItems.addLayer(layer);
    });

    leaf_map.on('draw:editvertex', function (e) {

        var layers = e.layers;

        if (type === 'polyline') {

            $("#coordinateTable").empty();
            var layers = e.layers;

            var i = 0;

            layers.eachLayer(function (layer) {
                i++;
                var latlng = layer.getLatLng();
                $('#coordinateTable').append('<tr><td>' + 'Coordinate ' + i + ' ' + '</td><td>' + latlng + '</td></tr>');
            });
        }

        if (type === 'polygon') {

            $('#shape').text('Polygon');
            $("#coordinateTable").empty();
            var layers = e.layers;

            var i = 0;

            layers.eachLayer(function (layer) {
                i++;
                var latlng = layer.getLatLng();
                $('#coordinateTable').append('<tr><td>' + 'Coordinate ' + i + ' ' + '</td><td>' + latlng + '</td></tr>');
            });
        }

    });

    leaf_map.on('draw:deleted', function (e) {

        $("#coordinateTable").empty();

        drawnItems.eachLayer(function (layer) {
            drawnItems.removeLayer(layer);
        });
    });
}

function showContextMenu(currentLatLng, mapDiv) {
    var latContext = currentLatLng.lat;
    var lngContext = currentLatLng.lng;
    var projection;
    var contextmenuDir;
    $('.contextmenu').remove();
    contextmenuDir = document.createElement("div");
    contextmenuDir.className = 'contextmenu';
    if (navigationScript) {
        console.log("navigationScript");
        contextmenuDir.innerHTML = '<a href="javascript:void(0)" onclick="addLocationMarkerContext(true,'
            + latContext
            + ','
            + lngContext
            + ')" id="menu1"><div class="context">  Direction from here  </div></a>'
            + '<a href="javascript:void(0)" onclick="addLocationMarkerContext(false,'
            + latContext
            + ','
            + lngContext
            + ')" id="menu2"><div class="context">  Direction to here  </div></a>'
            + '<div class="context"><hr></div>'
            + '<a href="javascript:void(0)" onclick="zoomInHere('
            + latContext
            + ','
            + lngContext
            + ')" id="menu3"><div class="context">  Zoom in here  </div></a>'
            + '<a href="javascript:void(0)" onclick="zoomOutHere('
            + latContext
            + ','
            + lngContext
            + ')" id="menu4"><div class="context">  Zoom out here  </div></a>'
            + '<div class="context"><hr></div>'
            + '<a href="javascript:void(0)" onclick="centreMapHere('
            + latContext
            + ','
            + lngContext
            + ')" id="menu5"><div class="context">  Centre map here  </div></a>';
    } else if (geoFenceScript) {
        console.log("geoFenceScript");
        contextmenuDir.innerHTML = '<a href="javascript:void(0)" onclick="addLocationMarkerContextWithoutNavigation(true,'
            + latContext
            + ','
            + lngContext
            + ')" id="menu1"><div class="context">  Direction from here  </div></a>'
            + '<a href="javascript:void(0)" onclick="addLocationMarkerContextWithoutNavigation(false,'
            + latContext
            + ','
            + lngContext
            + ')" id="menu2"><div class="context">  Direction to here  </div></a>'
            + '<div class="context"><hr></div>'
            + '<a href="javascript:void(0)" onclick="zoomInHere('
            + latContext
            + ','
            + lngContext
            + ')" id="menu3"><div class="context">  Zoom in here  </div></a>'
            + '<a href="javascript:void(0)" onclick="zoomOutHere('
            + latContext
            + ','
            + lngContext
            + ')" id="menu4"><div class="context">  Zoom out here  </div></a>'
            + '<div class="context"><hr></div>'
            + '<a href="javascript:void(0)" onclick="centreMapHere('
            + latContext
            + ','
            + lngContext
            + ')" id="menu5"><div class="context">  Centre map here  </div></a>';
    } else {
        console.log("else");
        contextmenuDir.innerHTML = '<a href="javascript:void(0)" onclick="zoomInHere('
            + latContext
            + ','
            + lngContext
            + ')" id="menu3"><div class="context">  Zoom in here  </div></a>'
            + '<a href="javascript:void(0)" onclick="zoomOutHere('
            + latContext
            + ','
            + lngContext
            + ')" id="menu4"><div class="context">  Zoom out here  </div></a>'
            + '<div class="context"><hr></div>'
            + '<a href="javascript:void(0)" onclick="centreMapHere('
            + latContext
            + ','
            + lngContext
            + ')" id="menu5"><div class="context">  Centre map here  </div></a>';
    }
    console.log("showContextMenu3");
    // leaf_map.on('contextmenu' ,);

    return '<a href="javascript:void(0)" onclick="zoomInHere('
        + latContext
        + ','
        + lngContext
        + ')" id="menu3"><div class="context">  Zoom in here  </div></a>'
        + '<a href="javascript:void(0)" onclick="zoomOutHere('
        + latContext
        + ','
        + lngContext
        + ')" id="menu4"><div class="context">  Zoom out here  </div></a>'
        + '<div class="context"><hr></div>'
        + '<a href="javascript:void(0)" onclick="centreMapHere('
        + latContext
        + ','
        + lngContext
        + ')" id="menu5"><div class="context">  Centre map here  </div></a>';
    /*
     * $(mapDiv).append(contextmenuDir); setMenuXY(currentLatLng);
     * console.log("showContextMenu4"); contextmenuDir.style.visibility =
     * "visible"; console.log("showContextMenu5");
     */
}


function startPolling() {
}

