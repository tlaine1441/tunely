// SERVER-SIDE JAVASCRIPT

//require express in our app
var express = require('express');
// generate a new express app and call it 'app'
var app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// serve static files from public folder
app.use(express.static(__dirname + '/public'));

/************
 * DATABASE *
 ************/

 var db = require('./models');

/* hard-coded data */
var albums = [];
albums.push({
              _id: 132,
              artistName: 'the Old Kanye',
              name: 'The College Dropout',
              releaseDate: '2004, February 10',
              genres: [ 'rap', 'hip hop' ]
            });
albums.push({
              _id: 133,
              artistName: 'the New Kanye',
              name: 'The Life of Pablo',
              releaseDate: '2016, Febraury 14',
              genres: [ 'hip hop' ]
            });
albums.push({
              _id: 134,
              artistName: 'the always rude Kanye',
              name: 'My Beautiful Dark Twisted Fantasy',
              releaseDate: '2010, November 22',
              genres: [ 'rap', 'hip hop' ]
            });
albums.push({
              _id: 135,
              artistName: 'the sweet Kanye',
              name: '808s & Heartbreak',
              releaseDate: '2008, November 24',
              genres: [ 'r&b', 'electropop', 'synthpop' ]
            });



/**********
 * ROUTES *
 **********/

/*
 * HTML Endpoints
 */

app.get('/', function homepage (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


/*
 * JSON API Endpoints
 */

app.get('/api', function api_index (req, res){
  res.json({
    message: "Welcome to tunely!",
    documentation_url: "https://github.com/tgaff/tunely/api.md",
    base_url: "http://tunely.herokuapp.com",
    endpoints: [
      {method: "GET", path: "/api", description: "Describes available endpoints"}
    ]
  });
});

app.get('/api/albums/:id', function album_index(req, res){
  console.log(req.params.id);
  db.Album.findOne({_id: req.params.id}, function(err, album) {
    res.json(album);
  });
});

app.get('/api/albums', function album_index(req, res){
  db.Album.find({}, function(err, albums) {
    res.json(albums);
  });
});

app.post('/api/albums/:album_id/songs', function song_create(req, res){
  var body = req.body;
  //console.log(body);
  db.Album.findOne({_id: req.params.album_id}, function(err, album) {
    //console.log(album.songs);
    if(err) res.json({message: 'Could not album because:' + error});
    album.songs.push(body);
    res.status(200).send();
    album.save(function (err) {
        if(err) {
            console.error('ERROR!');
        }

    });
  });
});

app.post('/api/albums', function album_create(req, res){
  var body = req.body;
  console.log(body.genres.split(', '));
  body.genres = body.genres.split(', ');
  console.log(body);
  db.Album.create(body, function(err, album) {
    console.log(album)
    if(err) res.json({message: 'Could not album because:' + error});
    res.status(200).send();
  });
});


app.delete('/api/albums', function album_create(req, res){
  var _id = JSON.parse(req.body.album_id);
  console.log(_id);
 db.Album.findOneAndRemove({_id: _id }, function(err, album) {
  if(err) response.json({message: 'Could not album because:' + error});
    album.save(function(err){
      if(err) return res.send(err);
      res.json({status:'done'});
    });
  });
});

/**********
 * SERVER *
 **********/

// listen on port 3000
app.listen(process.env.PORT || 3000, function () {
  console.log('Express server is running on http://localhost:3000/');
});
