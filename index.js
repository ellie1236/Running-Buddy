document.addEventListener("deviceready", function () {
   
  
    
    if (navigator.network.connection.type == Connection.NONE){
    $("#networkbutton").text('No Internet Access')
                 .attr("data-icon", "delete")
                 .button('refresh');
  }
 
    
    
});

$(document).ready(function() {
    
     $('#myPanel').enhanceWithin().panel();
    console.log( "ready!" );
});

$(document).on('pageshow', '#running', function (e, data) {
    
   // async defer src=""
  setTimeout(function () {
        // This is the minimum zoom level that we'll allow
        var minZoomLevel = 12;

        var map = new google.maps.Map(document.getElementById('map_canvas'), {
            zoom: minZoomLevel,
            center: new google.maps.LatLng(52.190084, -2.243133),
            mapTypeId: google.maps.MapTypeId.ROADMAP  , 
            
            });
     var latlng = new google.maps.LatLng(52.190084, -2.243133);

function addmarker(latilongi) { //this function will allow the user to place on markers
    var marker = new google.maps.Marker({
        position: latilongi,
        title: 'Running Marker',
        draggable: true,
        map: map
    });
   
    map.setCenter(marker.getPosition())
}

$('#btnaddmarker').on('click', function() { 
    addmarker(latlng)
}) 
      
    infoWindow = new google.maps.InfoWindow;
      
      
      navigator.geolocation.getCurrentPosition( 
          
          //location as been retrieved
          function(position) {
   
          var pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };

            infoWindow.setPosition(pos);
            infoWindow.setContent('Location found.');
            infoWindow.open(map);
            map.setCenter(pos);
          }, 
    
                                               
        //loction has not worked                                
        function() {
            
             infoWindow.setContent(browserHasGeolocation ?
                              'Error: The Geolocation service failed.' :
                              'Error: Your browser doesn\'t support geolocation.');
     
          });
      
        }) 
    
    var track_id = '';      // Name/ID of the exercise
    var watch_id = null;    // ID of the geolocation
    var tracking_data = []; // Array containing GPS position objects
 
$("#startTracking_start").on('click', function(){
     
    // Start tracking the User
    watch_id = navigator.geolocation.watchPosition(
     
        // Success
        function(position){
            tracking_data.push(position);
        },
         
        // Error
        function(error){
            console.log(error);
        },
         
        // Settings
        { frequency: 3000, enableHighAccuracy: true });
     
    // Tidy up the UI
    track_id = $("#track_id").val();
     
    $("#track_id").hide();
     
    $("#startTracking_status").html("Tracking your run: <strong>" + track_id + "</strong>");
    
    });
    
$("#startTracking_stop").on('click', function(){
   
  // on click of button, it will stop tracking.
  navigator.geolocation.clearWatch(watch_id);
   
  // Save the tracking data to the local storage
  window.localStorage.setItem(track_id, JSON.stringify(tracking_data));
 
  // Reset watch_id and tracking_data 
  var watch_id = null;
  var tracking_data = null;
 
  // Tidy up the UI
  $("#track_id").val("").show();
   
  $("#startTracking_status").html("Stopped tracking run: <strong>" + track_id + "</strong>"); //message is displayed when tracking is stopped. 
 
});  

            
})
        
$(document).on('pageshow', '#pedometer', function (e, data) { //Used .on() to attach event to handlers.

// When the user views the history page
$('#pedometer').on('pageshow', function () {
   
  // Count the number of entries in localStorage and display this information to the user
  tracks_recorded = window.localStorage.length;
  $("#tracks_recorded").html("<strong>" + tracks_recorded + "</strong> workout(s) recorded");
   
  // Empty the list of recorded tracks
  $("#routehistory").empty();
   
  // Iterate over all of the recorded tracks, populating the list
  for(i=0; i<tracks_recorded; i++){
    $("#routehistory").append("<li><a href='#pedometer' data-ajax='false'>" + window.localStorage.key(i) + "</a></li>");
  }
   
  // Tell jQueryMobile to refresh the list
  $("#routehistory").listview('refresh');
 
});
      
    $("clear").on('click', function(){          //should clear all the local storage's history 
    window.localStorage.clear();
});
    
 $("#history_tracklist li a").on('click', function(){
 
  $("#track_info").attr("track_id", $(this).text());
   
});
 
//   
$('#track_info').on('pageshow', function(){
 
  // Find the track_id of the workout they are viewing
  var key = $(this).attr("track_id");
   
  // Update the Track Info page header to the track_id
  $("#track_info div[data-role=header] h1").text(key);
   
  // Get all the GPS data for the specific workout
  var data = window.localStorage.getItem(key);
   
  // Turn the stringified GPS data back into a JS object
  data = JSON.parse(data);   
    
})
    
});