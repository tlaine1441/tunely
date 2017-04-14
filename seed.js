// This file allows us to seed our application with data
// simply run: `node seed.js` from the root of this project folder.

var db = require("./models");

var albumsList =[
  // put data here!
];
albumsList.push({
              artistName: 'the Old Kanye',
              name: 'The College Dropout',
              releaseDate: '2004, February 10',
              genres: [ 'rap', 'hip hop' ]
            });
albumsList.push({
              artistName: 'the New Kanye',
              name: 'The Life of Pablo',
              releaseDate: '2016, Febraury 14',
              genres: [ 'hip hop' ]
            });
albumsList.push({
              artistName: 'the always rude Kanye',
              name: 'My Beautiful Dark Twisted Fantasy',
              releaseDate: '2010, November 22',
              genres: [ 'rap', 'hip hop' ]
            });
albumsList.push({
              artistName: 'the sweet Kanye',
              name: '808s & Heartbreak',
              releaseDate: '2008, November 24',
              genres: [ 'r&b', 'electropop', 'synthpop' ]
            });

db.Album.remove({}, function(err, albums){

  db.Album.create(albumsList, function(err, albums){
    if (err) { return console.log('ERROR', err); }
    console.log("all albums:", albums);
    console.log("created", albums.length, "albums");
    process.exit();
  });

});
