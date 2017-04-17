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
      $(".edit-album").on('click', function(e) {
        //console.log($(this).parentsUntil("div.row.album").find('ul').find("span"));
        var spanList = $(this).parentsUntil("div.row.album").find('ul').find("span");
        if ($(".edit-album").is(':visible')) {
          console.log("visible");
          $(".edit-album").addClass("hidden");
          $(".save-album").removeClass("hidden");
         }
        handleEdit(spanList);
       });
      $(".save-album").on('click', function(e) {
        if ($(".save-album").is(':visible')) {
          console.log("visible");
          var id = $(this).parents('.album').data('album-id');
          saveEdit(id);
          $(".edit-album").removeClass("hidden");
          $(".save-album").addClass("hidden");
         }
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

function handleEdit(spanList) {
  //console.log($(liList[0]));
  //$(liList[0].chi).replaceWith('<input id="textinput" name="artistName" type="text" placeholder="" class="form-control input-md">');
  spanList.each(function(i, span){
    if(i < spanList.length-1) {
      $(span).replaceWith("<span><input id='textinput' name='artistName'' type='text' placeholder='" + span.innerHTML +"' class='form-control input-md'></span>");
    }

  });
  //$(spanList[0]).replaceWith("<span><input id='textinput' name='artistName'' type='text' placeholder='" + spanList[0].innerHTML +"' class='form-control input-md'></span>");
}

function saveEdit(id) {
  $.post("/api/albums/"+id, function( album ) {
    console.log("post return" + album);
  });
  // $.get( "/api/albums/"+id, function( album ) {
  //     console.log("ajax request album: " + album.name);
  //      $('div[data-album-id='+ id +']').find('ul').children().remove();
  //          var newUl = 
  //             "<li class='list-group-item'>" +
  //             "<h4 class='inline-header'>Album Name:</h4>" +
  //             "<span class='album-name'>" + album.name + "</span>" +
  //             "</li>" +
  //             "<li class='list-group-item'>" +
  //             "<h4 class='inline-header'>Artist Name:</h4>" +
  //             "<span class='artist-name'>" +  album.artistName + "</span>" +
  //             "</li>" +
  //             "<li class='list-group-item'>" +
  //             "<h4 class='inline-header'>Released date:</h4>" +
  //             "<span class='album-releaseDate'>" + album.releaseDate + "</span>" +
  //             "</li>" +
  //             buildSongsHtml(album.songs);
  //       $('div[data-album-id='+ id +']').find('ul').append(newUl); 
  // });
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
  "                    <ul class='list-group album-group'>" +
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
                  "<div class='col-md-8'>" +
                  "<button class='btn btn-info edit-album'>Edit Album</button>" + 
                  "<button class='btn btn-info save-album hidden'>Save Album</button>" + 
                  "</div>" +
                  "<div class='col-md-2'>" +
                  "<button name='delete-btn' class='btn btn-danger delete-album pull-right'>Delete</button>" + 
                  "</div>" +
                  "</div>" +
  "              </div>" +

  "            </div>" +
  "          </div>" +
  "          <!-- end one album -->";

  // render to the page with jQuery
    $("#albums").append(albumHtml);
}


