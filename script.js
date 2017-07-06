var map;
var infoWindow;

var request;
var service;
var markers = [];

function initialize(){
  var center = new google.maps.LatLng(33.4484, -112.0740);
  map = new google.maps.Map(document.getElementById('map'),{
    center: center,
    zoom: 13
  });
  request = {
     location: center,
     radius: document.getElementById("distance").value,
     type: ['bar']
   };
   infowindow = new google.maps.InfoWindow();
   var service = new google.maps.places.PlacesService(map);

   service.nearbySearch(request, callback);


   document.getElementById("beer-button").addEventListener('click',function(event){
     clearResults(markers)

   })


   var input = document.getElementById('searchbox');
   var autocomplete = new google.maps.places.SearchBox(input, {bounds: map.getBounds()});
   autocomplete.addListener('places_changed', function() {
  var place = autocomplete.getPlaces()[0];

  if (place.length == 0) {
    return;
  }
  map.setCenter(place.geometry.location)
  clearResults(markers);
  request = {
     location: place.geometry.location,
     radius: document.getElementById("distance").value,
     type: ['bar']
   };

   service.nearbySearch(request, callback);
});


   google.maps.event.addListener(map, 'rightclick', searcher)
 function searcher(event) {
   map.setCenter(event.latLng)
   clearResults(markers)

    request = {
     location: event.latLng,
     radius: document.getElementById("distance").value,
     types: ['bar']
   };
   service.nearbySearch(request, callback);
 }
 function callback(results, status) {
   if(status == google.maps.places.PlacesServiceStatus.OK){
     for (var i = 0; i < results.length; i++){
     markers.push(createMarker(results[i]));
     }
   }
 }



 function createMarker(place){
   var placeLoc = place.geometry.location;
   var marker = new google.maps.Marker({
     map: map,
     position: place.geometry.location

   });
   google.maps.event.addListener(marker, 'click', function(){
     infowindow.setContent(`
       <h1>${place.name}</h1>
       <h1>${place.vicinity}</h1>
       <img src="${place.photos[0].getUrl({'maxWidth': 550, 'maxHeight': 150})}"></img>
       <h1>Rating: ${place.rating}</h1>
       `);
     infowindow.open(map, this);
     console.log(place)
   });
   return marker;
 }
 function clearResults(markers) {
   for (var m in markers){
     markers[m].setMap(null)
   }
   markers = []
 }
 }
 google.maps.event.addDomListener(window, 'load', initialize);
