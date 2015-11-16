

 function getPlaylistItems() {
 var request = gapi.client.youtube.playlistItems.list({
 playlistId: 'UU2pmfLm7iq6Ov1UwYrWYkZA  ',
 part: 'snippet, id',
 maxResults: 25,
 mine:true
 });

 request.execute(function (response) {
   var playlistItems = response.result.items;
   if (playlistItems) {
     $.each(playlistItems, function (index, item) {
       displayResult(item.snippet, item.id);
     });
   } else {
   $('#video-container').html('Sorry you have no uploaded videos');
   }




    function displayResult(videoSnippet, videoId) {
       console.debug(videoSnippet)
       var title = videoSnippet.title;
       var thumbnail = videoSnippet.thumbnails.default.url;
       var id = videoId;
       var video =
       $('#video-container').append('<p><iframe width="560" height="315" src="https://www.youtube.com/v/'+videoSnippet.resourceId.videoId+'" frameborder="0" allowfullscreen></iframe></p>');
       $('#video-container').append('<p>' + title + '</p>');
       $('#video-container').append('<p>' + id + '</p>');

     }
   });
 }

 function init() {
 gapi.client.setApiKey('AIzaSyCH87lFHKzVGrtxIDabWViPnR9tjyKhMGc');
 gapi.client.load('youtube', 'v3').then(getPlaylistItems);

 }
