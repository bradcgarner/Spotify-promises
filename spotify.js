'use strict';
/* $ global */

// !!!FILL IN YOUR CLIENT ID FROM YOUR APPLICATION CONSOLE:
// https://developer.spotify.com/my-applications/#!/applications !!!
const CLIENT_ID = 'ebe76ed56d814a1cb53d9340fdc930ea';

const getFromApi = function (endpoint, query = {}) {
  // You won't need to change anything in this function, but you will use this function 
  // to make calls to Spotify's different API endpoints. Pay close attention to this 
  // function's two parameters.

  const url = new URL(`https://api.spotify.com/v1/${endpoint}`);
  const headers = new Headers();
  headers.set('Authorization', `Bearer ${localStorage.getItem('SPOTIFY_ACCESS_TOKEN')}`);
  headers.set('Content-Type', 'application/json');
  const requestObject = {
    headers
  };

  Object.keys(query).forEach(key => url.searchParams.append(key, query[key]));
  return fetch(url, requestObject).then(function (response) {
    if (!response.ok) {
      return Promise.reject(response.statusText);
    }
    return response.json();
  });
};

let artist;

const getArtist = function (name) {
  console.log('I ran');
  // Edit me!
  // (Plan to call `getFromApi()` several times over the whole exercise from here!)

  // Make a call to the search endpoint using the getFromApi function.
  // The query parameter should contain the following information:
  let query = {
    q: name, // populated from script in the index.html file
    limit: 1,
    type: 'artist'
  };
  return getFromApi('search', query).then( function(res){
    artist = res.artists.items[0];
    console.log('artist');
    console.log(artist);
    return getFromApi(`artists/${artist.id}/related-artists`);
  }).then( function(res) {
    // It should use the artist ID from the artist object.
    // Chain another then call to handle the response from your second request.
    // Inside the callback you should:
    // Set artist.related to item.artists, where item is the object returned by the get related artists endpoint.
    // Return the artist object.
    let query = {
      country: 'US'
    };
    artist.related = res.artists;
    let arrayofArtists = artist.related.map(item => getFromApi(`artists/${item.id}/top-tracks`, query));
    console.log('arrayofArtists');
    console.log(arrayofArtists);
    return Promise.all(arrayofArtists);
  }).then(response => {
    response.map((item, index) => {
      artist.related[index].tracks = item.tracks;
    });
    console.log('final artist');
    console.log(artist);
    return artist;
    console.log('final artist');
    console.log(artist);
  }).catch( function(err){
    console.log('error ' + err);
  });
  
  // Use .then to add a callback which will run when getFromApi resolves.
   // Inside the callback you should:
    // Set the artist global to be equal to item.artists.items[0], where item is the information obtained from the API (which will be passed as the first argument to your callback).
    // Return the artist object.
  
    // Return the promise which you created by calling getFromApi.
}
//getArtist('The Black Keys');

// =========================================================================================================
// IGNORE BELOW THIS LINE - THIS IS RELATED TO SPOTIFY AUTHENTICATION AND IS NOT NECESSARY  
// TO REVIEW FOR THIS EXERCISE
// =========================================================================================================
const login = function () {
  const AUTH_REQUEST_URL = 'https://accounts.spotify.com/authorize';
  const REDIRECT_URI = 'http://localhost:8080/auth.html';

  const query = new URLSearchParams();
  query.set('client_id', CLIENT_ID);
  query.set('response_type', 'token');
  query.set('redirect_uri', REDIRECT_URI);

  window.location = AUTH_REQUEST_URL + '?' + query.toString();
};

$(() => {
  $('#login').click(login);
});
