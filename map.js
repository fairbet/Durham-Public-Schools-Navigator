var map;
var address;
function mainJSFunction(inputForm){ 
    address = inputForm.elements[0].value;
    var schoolLevel = inputForm.elements[1].value;
    var minGrade = inputForm.elements[2].value;
    document.getElementById("outputDiv").innerHTML = "Showing Top 5 Closest " + schoolLevel + 
        " Schools to " + address + " with at Least a(n) " + minGrade + " Ranking";
    FindLatLong(address, function(data) { //add of this inside callback function!
    var topNIndices = computeSchool(data.Latitude, data.Longitude, schoolLevel, minGrade);
    initMap();
    addInfo(topNIndices);
        console.log(address);
        console.log(data);
    });
}
function FindLatLong(address, callback)
{
var geocoder = new google.maps.Geocoder();

geocoder.geocode({ 'address': address }, function (results, status) {
if (status == google.maps.GeocoderStatus.OK) {
    var lat = results[0].geometry.location.lat();
    var lng = results[0].geometry.location.lng();
    callback({ Status: "OK", Latitude: lat, Longitude: lng });
}
});
}

function computeSchool(userLat,userLon,schoolLevel,minGrade) {
			var n = 3;
			var result = [];
			var distArray = new Array(names.length);
			for(i=0;i<names.length;i++){
				distArray[i] = distance(userLat,userLon,lat[i],lon[i]);
			}
			var distdummy = distArray.slice();
            distdummy.sort();
			var count = 0;
			for(i=0;i<names.length;i++){
				var schoolIndex = distArray.indexOf(distdummy[i]);
				if(type[schoolIndex] === schoolLevel && grade[schoolIndex].localeCompare(minGrade) <= 0){
					result.push(schoolIndex);
					count++;
				}
				if(count>=n){
					break;
				}
			}
		
			return result;
}
function distance(lat1, lon1, lat2, lon2) {
   var radlat1 = Math.PI * lat1/180
   var radlat2 = Math.PI * lat2/180
   var theta = lon1-lon2
   var radtheta = Math.PI * theta/180
   var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
   dist = Math.acos(dist)
   dist = dist * 180/Math.PI
   dist = dist * 60 * 1.1515
   return dist
}

function initMap(){ //run when webpage first loads - called from the long URL script tag
    map = new google.maps.Map(document.getElementById('map'), {center: {lat:36.0018764,lng:-78.9385708}, zoom: 16});
}
function addInfo(topNIndices){
    var topNMarkers = [];
    for(var i = 0; i < topNIndices.length; i++){
        var index = topNIndices[i];
        topNMarkers.push(new google.maps.Marker({map: map, position: {lat: lat[index], lng: lon[index]}, title: names[index], index: topNIndices[i]}));
    }
    var infowindow = new google.maps.InfoWindow();
    for(var i = 0; i < topNIndices.length; i++){
        topNMarkers[i].addListener('click', function(){writeInInfoWindow(this, infowindow)});
    }
}
function writeInInfoWindow(marker, infowindow){
    if(infowindow.marker != marker){
    infowindow.marker = marker;
    infowindow.setContent('<div>Name: ' + marker.title + '<br>Grade: ' + grade[marker.index] + '</div>');
    infowindow.open(map, marker);
    infowindow.addListener('closeclick', function(){
        infowindow.setMarker(null);
    });
    }
}

//top5Markers[i].addListener('click', function(){console.log("Hi!" + i)});

