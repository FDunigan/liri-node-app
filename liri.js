require("dotenv").config();

var keys = require('./keys.js');
var fs = require("fs");
var request = require("request");
var twitter = require('twitter');
var client = new twitter(keys.twitter);
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);
var liriCommand = process.argv[2];
var movieName = process.argv[3];

switch(liriCommand) {
    case "my-tweets":
        myTweets();
        break;

    case "spotify-this-song":
        spotifyThisSong();
        break;

    case "movie-this":
        movieThis();
        break;

    case "do-what-it-says":
        doWhatItSays();
        break;

    default: console.log()
}

function myTweets() {
    var params = { screen_name: "DuniganFoster" }; 
    client.get("statuses/user_timeline", params, function(error, tweets, response) {
        if(!error) {
            for (var i = 0; i < tweets.length; i++) {
                console.log("Tweet: " + tweets[i].text);
                console.log("\n--------")
            };
        } else {
            console.log("error: " + err);
            return;
        };
    });
};

function spotifyThisSong(trackName) {
    var trackName = process.argv[3];
    if (!trackName) {
        trackName = "The Sign";
    };
    songRequest = trackName;
    spotify.search({
        type: "track",
        query: songRequest
    },
        function(err, data) {
            if (!err) {
                var trackInfo = data.tracks.items;
                for (var i = 0; i < 3; i++) {
                    if (trackInfo[i] != undefined) {
                        var spotifyResults = 
                            "Artist: " + trackInfo[i].artists[0].name + "\n" +
                            "Song: " + trackInfo[i].name + "\n" +
                            "Preview URL: " + trackInfo[i].preview_url + "\n" +
                            "Album: " + trackInfo[i].album.name + "\n"

                        console.log(spotifyResults);
                        console.log("\n---------");
                    };
                };
            } else {
                console.log("error: " + err);
                return;
            };
        });
    };

function movieThis() {
    var queryURL = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";

    request(queryURL, function(error, response, body) {

        if (!error && response.statusCode === 200) {
            var myMovieData = JSON.parse(body);
            var queryURLResults = 
                "Title: " + myMovieData.Title + "\n" +
                "Year: " + myMovieData.Year + "\n" +
                "IMDB Rating: " + myMovieData.Ratings[0].Value + "\n" +
                "Rotten Tomatoes Rating: " + myMovieData.Ratings[1].Value + "\n" +
                "Country of Origin: " + myMovieData.Country + "\n" +
                "Language: " + myMovieData.Language + "\n" +
                "Plot: " + myMovieData.Plot + "\n" +
                "Actors: " + myMovieData.Actors + "\n"

            console.log(queryURLResults);
        } else {
            console.log("error: " + err);
            return;
        };
     });
};

function doWhatItSays() {
    fs.readFile("random.txt", "utf-8", function(error, data) {
        if (error) {
            return console.log("error: " + err);
        }

        console.log(data); 
    });
};