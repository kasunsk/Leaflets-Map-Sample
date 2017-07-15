/**
 * Created by kasun on 5/17/17.
 */


var leaf_map;

var latitude;
var longitude;

var navigationOn = true;

var fromBool = true;

var routingController;

var fromMarker;

var toMarker;

var fromLocationLat;
var fromLocationLng;
var toLocationLat;
var toLocationLng;

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

    var str = '<table border="0"><tbody><tr><td><table border="0" width="250px" style="float:left"><tbody><tr><td colspan="3">2015 Thu January 15, 2:45:34 PM</td></tr><tr><td width="15%" rowspan="4"><img src="imgs/pp/type_4.png" width="54px" hight="36px"></td><td colspan="2">LK-2519</td></tr><tr><td>0km/h</td></tr><tr><td> </td></tr><tr><td> </td></tr><tr><td> </td></tr><tr><td><img src="imgs/pp/engineg.png" width="20px" hight="20px"></td> <td style="color:#00FF00">Ignition On</td> </tr><tr><td colspan="2"> </td></tr><tr><td><img src="imgs/pp/redf.png" width="20px" hight="20px"></td><td>-25.07/351 l</td></tr><tr><td><img src="imgs/pp/redb.png" width="30px" hight="20px"></td><td>0 V</td></tr><tr><td colspan="2"> </td></tr><tr><td><a href="#"><img src="imgs/zoom.png" alt="zoom.png" width="15px" height="15px" onclick="locateVehicle(6.916650295257568,79.86936950683594)"></a> </td><td>Locate Vehicle</td></tr><tr><td colspan="3"><hr></td></tr><tr><td><a href="#"><img src="imgs/correct.png" alt="correct.png" width="15px" height="15px" onclick="changeSpeedAlert(false,'
     + 'LK - 2519'
     + ')"></a> </td><td style="color:#00FF00">Speed Alert On</td></tr><tr><td colspan="2"><hr></td></tr><tr><td><a href="#"><img src="imgs/add.png" alt="add.png" width="15px" height="15px" onclick="addFromLocation(6.916650295257568,79.86936950683594)"></a> </td><td>Direction from here</td></tr><tr><td colspan="2"> </td></tr></tbody></table></td><td><table border="0" style="margin-right:5px; margin-left:5px;"><tbody><tr><td><img src="imgs/pp/down.png" title="click to view service details" id="serviceDataDownIcon" onclick="expandServiceDetail()" style="cursor:pointer;"></td></tr><tr><td><img src="imgs/pp/up.png" id="serviceDataUpIcon" title="click to hide service details" onclick="collapseServiceDetail()" style="cursor:pointer;"></td></tr></tbody></table></td><td style="vertical-align:top;"><table border="0" style="width:210px;display:none;margin-right:10px;" id="serviceTable"><tbody><tr><td colspan="2">Service Details</td></tr><tr><td colspan="2"></td></tr><tr><td>ODO Meter (*)</td> <td>0.9 Km</td></tr><tr><td>Trip Meter</td> <td>0.9 Km</td></tr><tr><td>Last Service Date</td> <td>2015-06-09</td></tr><tr><td>Last Service Mileage</td> <td>0 Km</td></tr><tr><td><font color="red">Next Service Date</font></td> <td><font color="red">2015-06-09</font></td></tr><tr><td><font color="red">Next Service Mileage</font></td> <td><font color="red">0 Km </font></td></tr></tbody></table></td></tr></tbody></table>';


    var myIcon = L.icon({
        iconUrl: 'imgs/image.png',
        iconSize: [20, 20],
        iconAnchor: [10, 10],
        labelAnchor: [6, 0] // as I want the label to appear 2px past the icon (10 + 2 - 6)
    });

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
    var toggleDashboard = new ToggleDashboard(toggleDashboardDiv, leaf_map);

    toggleDashboardDiv.index = 1;
    var toggleDashboardIcon = L.control({
        position: 'topleft'
    });

    toggleDashboardIcon.onAdd = function () {
        toggleDashboardDiv.style.display = 'inline-block';
        toggleDashboardDiv.style.float = 'center';
        this._div = toggleDashboardDiv;
        return this._div;
    };
    toggleDashboardIcon.addTo(leaf_map);

    function refreshMarkers() {
    }

    var myCustomIcon = L.icon({
        shadowUrl: null,
        iconAnchor: [12, 12],
        iconSize: [24, 24],
        iconUrl: 'imgs/image.png'
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
                icon: myCustomIcon
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

    //marker.bindPopup(str);

}

function expandServiceDetail() {
    // $(".serviceData").show();
    $("#serviceTable").css("display", "block");
    $("#serviceDataDownIcon").hide();
    $("#serviceDataUpIcon").show();
    // $("#serviceDataIcon").attr("src", "imgs/pp/up.png");

}

function collapseServiceDetail() {
    $("#serviceTable").css("display", "none");
    $("#serviceDataDownIcon").show();
    $("#serviceDataUpIcon").hide();

}


function ToggleDashboard(controlDiv, map) {

    // Set CSS styles for the DIV containing the control
    // Setting padding to 5 px will offset the control
    // from the edge of the map.
    controlDiv.style.paddingLeft = '5px';
    controlDiv.style.paddingTop = '15px';

    // Set CSS for the control border.
    var controlUI = document.createElement('div');
    controlUI.id = 'toggleDashboardId';
    controlUI.style.cursor = 'pointer';
    controlUI.style.padding = '0px';
    controlUI.style.margin = '0px';
    controlUI.title = 'Toggle Dashboard';
    controlDiv.appendChild(controlUI);

    // Set CSS for the control interior.
    var controlText = document.createElement('div');
    controlText.style.padding = '0px';
    controlText.style.margin = '0px';
    controlText.innerHTML = "<img src='imgs/Dashboard.png' alt='Dashboard.png' width='20px' height='20px'/>";
    controlUI.appendChild(controlText);

    // Setup the click event listeners: simply set the map to Chicago.
    L.DomEvent.addListener(controlUI, 'click', function () {
        dijit.byId("carDashboard").toggle();
    });
}

function initNavigation() {

    var startIcon = L.icon({
        iconUrl: 'imgs/start_location.png',
        iconSize: [30, 30],
        iconAnchor: [15, 30]
    });

    var endIcon = L.icon({
        iconUrl: 'imgs/end_location.png',
        iconSize: [30, 30],
        iconAnchor: [15, 30]
    });

    var viaIcon = L.icon({
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.5/images/marker-icon.png',
        iconSize: [30, 30],
        iconAnchor: [15, 30]
    });

    routingController = L.Routing.control({

        createMarker : function(i, wp, nWps) {
            if (i === 0) {
                var startMarker = L.marker(wp.latLng, {icon: startIcon, draggable:true});
                return startMarker;
            }
            else if (i === nWps - 1) {
                    return L.marker(wp.latLng, {icon: endIcon });
            } else {
                return L.marker(wp.latLng, {icon: viaIcon, draggable: true });
            }
        },
        waypoints: [],
        geocoder: L.Control.Geocoder.nominatim(),
        routeWhileDragging: true,
        draggableWaypoints: true,
        addWaypoints: true,
        reverseWaypoints: true,
        showAlternatives: true,
        waypointMode: 'connect',
        altLineOptions: {
            styles: [{
                color: 'black',
                opacity: 0.15,
                weight: 9
            }, {
                color: 'white',
                opacity: 0.8,
                weight: 6
            }, {
                color: 'blue',
                opacity: 0.5,
                weight: 2
            }]
        }
    }).addTo(leaf_map);

    // L.Routing.errorControl(routingController).addTo(leaf_map);
}

function addOrRemoveNavigation() {
    if (routingController == null) {
        initNavigation();
    } else {
        leaf_map.removeControl(routingController);
        routingController = null;
    }
}

function getReverseGeocoding(longitude,latitude) {
    var locationServiceUrl = ROOT_URL + REVERSE_GEO_CORDING_BASE_URL
        + latitude
        + '&lon='
        + longitude
        + '&zoom=18&addressdetails=1&email=maps@nimbusventure.com&accept-language=en-US';
    return httpGet(locationServiceUrl);
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

            $('#coordinateTable').append('<tr><td>' + 'Lat & Lng : ' + '</td><td>' + layer.getLatLng() + '</td></tr>');
        }

        if (type === 'rectangle') {

            $("#coordinateTable").empty();
            $('#shape').text('Rectangle');

            $('#coordinateTable').append('<tr><td>' + 'NE : ' + '</td><td>' + layer.getBounds().getNorthEast() + '</td></tr>');
            $('#coordinateTable').append('<tr><td>' + 'SW : ' + '</td><td>' + layer.getBounds().getSouthWest() + '</td></tr>');
        }

        if (type === 'circle') {

            $("#coordinateTable").empty();
            $('#shape').text('Circle');
            var center = layer.getLatLng();

            $('#coordinateTable').append('<tr><td>' + 'Radius ' + '</td><td>' + layer.getRadius() + '</td></tr>');
            $('#coordinateTable').append('<tr><td>' + 'Center ' + '</td><td>' + center + '</td></tr>');

        }

        if (type === 'polyline') {

            $("#coordinateTable").empty();
            $('#shape').text('Polyline');

            var latlngs = layer.getLatLngs();
            for (var i = 0; i < latlngs.length; i++) {
                $('#coordinateTable').append('<tr><td>' + 'Coordinate ' + ( i + 1) + '</td><td>' + latlngs[i] + '</td></tr>');
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

    leaf_map.on('draw:editmove', function (e) {

        var layer = e.layer;

        leaf_map.addLayer(layer);

        if (type === 'marker') {

            $("#coordinateTable").empty();
            $('#shape').text('Marker');

            $('#coordinateTable').append('<tr><td>' + 'Lat & Lng : ' + '</td><td>' + layer.getLatLng() + '</td></tr>');
        }

        if (type === 'circle') {

            $("#coordinateTable").empty();
            $('#shape').text('Circle');
            var center = layer.getLatLng();

            $('#coordinateTable').append('<tr><td>' + 'Radius ' + '</td><td>' + layer.getRadius() + '</td></tr>');
            $('#coordinateTable').append('<tr><td>' + 'Center ' + '</td><td>' + center + '</td></tr>');
        }

        if (type === 'rectangle') {
            $("#coordinateTable").empty();
            $('#shape').text('Rectangle');

            $('#coordinateTable').append('<tr><td>' + 'NE : ' + '</td><td>' + layer.getBounds().getNorthEast() + '</td></tr>');
            $('#coordinateTable').append('<tr><td>' + 'SW : ' + '</td><td>' + layer.getBounds().getSouthWest() + '</td></tr>');
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

    leaf_map.on('draw:editresize', function (e) {

        var layer = e.layer;

        if (type === 'circle') {
            $("#coordinateTable").empty();
            $('#shape').text('Circle');
            var center = layer.getLatLng();

            $('#coordinateTable').append('<tr><td>' + 'Radius ' + '</td><td>' + layer.getRadius() + '</td></tr>');
            $('#coordinateTable').append('<tr><td>' + 'Center ' + '</td><td>' + center + '</td></tr>');
        }

        if (type === 'rectangle') {
            $("#coordinateTable").empty();
            $('#shape').text('Rectangle');

            $('#coordinateTable').append('<tr><td>' + 'NE : ' + '</td><td>' + layer.getBounds().getNorthEast() + '</td></tr>');
            $('#coordinateTable').append('<tr><td>' + 'SW : ' + '</td><td>' + layer.getBounds().getSouthWest() + '</td></tr>');
        }

        if (type === 'polyline') {

            $("#coordinateTable").empty();
            $('#shape').text('Polyline');

            var latlngs = layer.getLatLngs();
            for (var i = 0; i < latlngs.length; i++) {
                $('#coordinateTable').append('<tr><td>' + 'Coordinate ' + ( i + 1) + '</td><td>' + latlngs[i] + '</td></tr>');
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

    return contextmenuDir;
}

function addLocationMarkerContext(fromBool, latContext, lngContext) {
    leaf_map.closePopup();
    if (!navigationOn) {
        //clearAll();
        navigationOn = true;
    }
    var iconInfo = L.icon({
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.5/images/marker-icon.png',
        iconSize: [24, 36],
        iconAnchor: [12, 36]
    });

    var latlng = new L.LatLng(latContext, lngContext);
    if (fromBool) {
        fromMarker = new L.marker(latlng, {icon: iconInfo}).addTo(leaf_map);
        addFromLocation(latContext, lngContext);
        if (fromMarker != null) {
            // leaf_map.removeLayer(fromMarker);
            // fromMarker = null;
        }
    } else {
        toMarker = new L.marker(latlng, {icon: iconInfo}).addTo(leaf_map);
        addToLocation(latContext, lngContext);
        if (toMarker != null) {
            leaf_map.removeLayer(toMarker);
            toMarker = null;
        }

        if (fromMarker != null) {
            leaf_map.removeLayer(fromMarker);
            fromMarker = null;
        }
    }
}

function addFromLocation(lat, lng) {
    fromLocationLat = lat;
    fromLocationLng = lng;

    if (!navigationOn) {
        navigationOn = true;
    }
    var address = lat + "," + lng;
    var latlng = new L.LatLng(lat, lng);
    if (fromMarker != null) {
        // leaf_map.removeLayer(fromMarker);
        // fromMarker = null;
    }
}

function addToLocation(lat, lng) {

    toLocationLat = lat;
    toLocationLng = lng;

    var address = lat + "," + lng;
    var latlng = new L.LatLng(lat, lng);
    if (toMarker != null) {
        leaf_map.removeLayer(toMarker);
        toMarker = null;
    }

    getDirection();
}

function getDirection() {

    if (routingController == null) {
        initNavigation();
    }

    routing = null;
    routingController.spliceWaypoints(0, 1, L.latLng(fromLocationLat, fromLocationLng));
    routingController.spliceWaypoints(routingController.getWaypoints().length - 1, 1, L.latLng(toLocationLat, toLocationLng));

    $("#coordinateTable").empty();
    $('#shape').text('Polyline : Route');
    //$('#coordinateTable').append('<tr><td>' + 'Lat & Lng : ' + '</td><td>' + layer.getLatLng() + '</td></tr>');

    routingController.on('routesfound', function (e) {
        var firstRoute = e.routes[0];

        for (var i = 0; i < firstRoute.coordinates.length; i++) {
            $('#coordinateTable').append('<tr><td>' + 'Coordinate ' + ( i + 1) + '</td><td>' + firstRoute.coordinates [i] + '</td></tr>');
        }
    });

}


function startPolling() {
}

