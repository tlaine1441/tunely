/* CLIENT-SIDE JS
 *
 * You may edit this file as you see fit.  Try to separate different components
 * into functions and objects as needed.
 *
 */


/* hard-coded data! */
var sampleAlbums = [];
sampleAlbums.push({
             artistName: 'Ladyhawke',
             name: 'Ladyhawke',
             releaseDate: '2008, November 18',
             genres: [ 'new wave', 'indie rock', 'synth pop' ]
           });
sampleAlbums.push({
             artistName: 'The Knife',
             name: 'Silent Shout',
             releaseDate: '2006, February 17',
             genres: [ 'synth pop', 'electronica', 'experimental' ]
           });
sampleAlbums.push({
             artistName: 'Juno Reactor',
             name: 'Shango',
             releaseDate: '2000, October 9',
             genres: [ 'electronic', 'goa trance', 'tribal house' ]
           });
sampleAlbums.push({
             artistName: 'Philip Wesley',
             name: 'Dark Night of the Soul',
             releaseDate: '2008, September 12',
             genres: [ 'piano' ]
           });
/* end of hard-coded data */




$(document).ready(function() {
  console.log('app.js loaded!');
  //Request album data from api
  $.get( "/api/albums", function( albums ) {
      console.log("ajax request albums: " + albums);
      albums.forEach(function(album){
        renderAlbum(album);
     });
      $('#albums').on('click', '.add-song', function(e) {
          console.log('asdfasdfasdf');
          var id= $(this).parents('.album').data('album-id'); // "5665ff1678209c64e51b4e7b"
          console.log('id',id);
          $('#songModal').attr('data-album-id', id).modal('show');
      });
      $('#songModal').on('click', '#saveSong', function(e) {
        handleNewSongSubmit(e);
      });
     $( ".delete-album" ).click(function(e) {
        e.preventDefault();
        // console.log($(this).closest('div[data-album-id]').data("album-id"));
        var album_id = JSON.stringify($(this).closest('div[data-album-id]').data("album-id"));
        console.log(album_id);
       $.ajax({
           url: '/api/albums',
           type: 'DELETE',
           dataType: "json",
           data: {
             album_id: album_id
           },
           success: function(status) {
               // Do something with the result
               console.log("success deleted");
               //window.location.reload();
               $("div[data-album-id=" + album_id + "]").remove();
               $('#deleteModal').modal('show');
           },
           error: function(error) {
            console.log(error);
            //window.location.reload();
           }
       });
     });
   });
  // adds event listener to form
  $( "form" ).on( "submit", function( event ) {
    event.preventDefault();
    console.log( $( this ).serialize() );
    $.post( "/api/albums", $( this ).serialize() )
      .done(function() {
        window.location.reload();

      });;
      $(this).trigger("reset");
    });
});

function buildSongsHtml(songs) {
  //console.log(songs);
  var songText = "  – "; 
  songs.forEach(function(song) { 
    songText = songText + "(" + song.trackNumber + ") " + song.name + " – "; }); 
  var songsHtml = "<li class='list-group-item'><h4 class='inline-header'>Songs:</h4><span>" + songText + "</span> </li>";
  return songsHtml;
}

function handleNewSongSubmit(e) {
  e.preventDefault();
  // get data from modal fields
  console.log($("#songName").val());
  console.log($("#trackNumber").val()); 
  var newSong= {
    name: $("#songName").val(),
    trackNumber: $("#trackNumber").val()
  }
  console.log(newSong);
  console.log("modal " + $("#songModal").attr('data-album-id'));
  var albumId = $("#songModal").attr('data-album-id');
  var URL = albumId + "/songs";
  console.log(URL);
  // POST to SERVER
  $.post( ("/api/albums/" + URL), newSong)
  .done(function(e){
    // clear form
    $("#songName").val("");
    $("#trackNumber").val("");
    // close modal
    $('#songModal').modal('hide');
    // update the correct album to show the new song
    $.get( ("/api/albums/" + albumId), function( album ) {
        console.log("ajax request album by id: " + album);
        console.log($("div[data-album-id=" + albumId + "]").find("ul").children()[3]);
        $("div[data-album-id=" + albumId + "]").find("ul").children()[3].remove();
        var newSongs = buildSongsHtml(album.songs);
        console.log(newSongs);
        $("div[data-album-id=" + albumId + "]").find("ul").append(newSongs);
    });
  });
}


// this function takes a single album and renders it to the page
function renderAlbum(album) {
  console.log('rendering album:', album);

  var albumHtml =
  "        <!-- one album -->" +
  "        <div class='row album' data-album-id='" + album._id + "'>" +
  "          <div class='col-md-10 col-md-offset-1'>" +
  "            <div class='panel panel-default'>" +
  "              <div class='panel-body'>" +
  "              <!-- begin album internal row -->" +
  "                <div class='row'>" +
  "                  <div class='col-md-3 col-xs-12 thumbnail album-art'>" +
  "                     <img src='" + "http://placehold.it/400x400'" +  " alt='album image'>" +
  "                  </div>" +
  "                  <div class='col-md-9 col-xs-12'>" +
  "                    <ul class='list-group'>" +
  "                      <li class='list-group-item'>" +
  "                        <h4 class='inline-header'>Album Name:</h4>" +
  "                        <span class='album-name'>" + album.name + "</span>" +
  "                      </li>" +
  "                      <li class='list-group-item'>" +
  "                        <h4 class='inline-header'>Artist Name:</h4>" +
  "                        <span class='artist-name'>" +  album.artistName + "</span>" +
  "                      </li>" +
  "                      <li class='list-group-item'>" +
  "                        <h4 class='inline-header'>Released date:</h4>" +
  "                        <span class='album-releaseDate'>" + album.releaseDate + "</span>" +
  "                      </li>" +
                          buildSongsHtml(album.songs) +
  "                    </ul>" +
  "                  </div>" +
  "                </div>" +
  "                <!-- end of album internal row -->" +

  "              </div>" + // end of panel-body

  "              <div class='panel-footer'>" +
                  "<div class='row'>" +
                  "<div class='col-md-2'>" +
                  "<button class='btn btn-primary add-song'>Add Song</button>" +
                  "</div>" + 
                  "<div class='col-md-2'>" +
                  "<button name='delete-btn' class='btn btn-danger delete-album'>Delete</button>" + 
                  "</div>" +
                  "</div>" +
  "              </div>" +

  "            </div>" +
  "          </div>" +
  "          <!-- end one album -->";

  // render to the page with jQuery
    $("#albums").append(albumHtml);
}


