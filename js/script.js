

 function getPlaylistItems() {
 var request = gapi.client.youtube.playlistItems.list({
 playlistId: 'UU2pmfLm7iq6Ov1UwYrWYkZA  ',
 part: 'snippet, id',
 maxResults: 25,
 mine:true
 });

 request.execute(function (response) {
   var playlistItems = response.result.items;
   $('#video-container').empty();
   if (playlistItems) {
     $.each(playlistItems, function (index, item) {
       displayResult(item.snippet, item.id);
     });
   } else {
   $('#video-container').html('Sorry you have no uploaded videos');
   }




    function displayResult(videoSnippet, videoId) {
       //console.debug('---->'+videoSnippet)
       var title = videoSnippet.title;
       var thumbnail = videoSnippet.thumbnails.default.url;
       var id = videoId;
       if (flag == 1) {
         var showbtnPlayList = '        <a id="'+videoSnippet.resourceId.videoId+'" class="btn-floating btn-large waves-effect waves-light green" onclick=addToPlaylist("'+videoSnippet.resourceId.videoId+'")><i class="material-icons">add</i></a>';
       } else {
         var showbtnPlayList = '';
       }

      $('#video-container').append('<div class="col s4">'
      +'  <div class="">'
      +'    <div class="card">'
      +'      <div class="card-image center-align video-container">'
      +'        <iframe width="470" height="420" src="https://www.youtube.com/v/'+videoSnippet.resourceId.videoId+'" frameborder="0" allowfullscreen></iframe>'
      +'        <span class="card-title">'+title+'</span>'
      +'      </div>'
      +'      <div class="card-content" onclick=getCommentsById("'+videoSnippet.resourceId.videoId+'")>'
      +'        <a class"waves-effect waves-light btn modal-trigger" href="#modal1">View Comments</p>'
      +'      </div>'
      +'      <div class="card-action right-align">'
      + showbtnPlayList
      +'      </div>'
      +'    </div>'
      +'  </div>'
      +'</div>');

     }
   });
 }

 function init() {
 gapi.client.setApiKey('AIzaSyCH87lFHKzVGrtxIDabWViPnR9tjyKhMGc');
 gapi.client.load('youtube', 'v3').then(getPlaylistItems);

 }

function getCommentsById(id){
  var URL="https://www.googleapis.com/youtube/v3/commentThreads?key=AIzaSyCH87lFHKzVGrtxIDabWViPnR9tjyKhMGc&textFormat=plainText&part=snippet&videoId="+id+"&maxResults=50";
  $.ajax({
        type: "GET",
        url: URL,
        success: function(data) {
            //console.log(data);
            $('#modal1').openModal();
            var model = $('.comments');
            model.empty();
            for (var i in data.items) {
                var item = data.items[i];
                model.append(
                '<ul class="collection">'+
                  '<li class="collection-item avatar">'+
                    '<img src="'+item.snippet.topLevelComment.snippet.authorProfileImageUrl+'" alt="" class="circle">'+
                    '<span class="title">'+item.snippet.topLevelComment.snippet.textDisplay+'</span>'+
                  '</li>'+
                '</ul>'
              );
            }
        },
        error: function(xhr, ajaxOptions, thrownError) {

        }
    });

}

var playlistId='';
var flag =0;
var channelId;

// After the API loads, call a function to enable the playlist creation form.
function handleAPILoaded() {
  enableForm();
}

// Enable the form for creating a playlist.
function enableForm() {
  $('#playlist-button').attr('disabled', false);
}

function showCreatePlaylist() {
  $('#modal2').openModal();
}

function createPlaylist() {
  var title = $('#title').val();
  var description = $('#description').val();
  var request = gapi.client.youtube.playlists.insert({
    part: 'snippet,status',
    resource: {
      snippet: {
        title: title,
        description: description
      },
      status: {
        privacyStatus: 'public'
      }
    }
  });
  request.execute(function(response) {
    var result = response.result;
    if (result) {
      playlistId = result.id;
      $('#playlist-id').val(playlistId);
      $('#playlist-title').html(result.snippet.title);
      $('#playlist-description').html(result.snippet.description);
    } else {
      $('#status').html('Could not create playlist');
    }
  });
  flag = 1;
  //refresh
  init();
}

// Add a video to a playlist. The "startPos" and "endPos" values let you
// start and stop the video at specific times when the video is played as
// part of the playlist. However, these values are not set in this example.
function addToPlaylist(id, startPos, endPos) {
  var details = {
    videoId: id,
    kind: 'youtube#video'
  }
  if (startPos != undefined) {
    details['startAt'] = startPos;
  }
  if (endPos != undefined) {
    details['endAt'] = endPos;
  }
  var request = gapi.client.youtube.playlistItems.insert({
    part: 'snippet',
    resource: {
      snippet: {
        playlistId: playlistId,
        resourceId: details
      }
    }
  });
  request.execute(function(response) {
    $('#status').html('<pre>' + JSON.stringify(response.result) + '</pre>');
    $( "#"+id ).removeClass( "green" ).addClass( "blue" );
  });
}




function auth() {
  var config = {
    'client_id': '624240182723-uc3ik6ta3ln56t72gjjvfag9g79slc8p.apps.googleusercontent.com',
    'scope': 'https://www.googleapis.com/auth/youtube.force-ssl'
  };
  gapi.auth.authorize(config, function() {
    //console.log('login complete');
    //console.log(gapi.auth.getToken());
  });
}




// The client ID is obtained from the {{ Google Cloud Console }}
// at {{ https://cloud.google.com/console }}.
// If you run this code from a server other than http://localhost,
// you need to register your own client ID.
var OAUTH2_CLIENT_ID = '624240182723-uc3ik6ta3ln56t72gjjvfag9g79slc8p.apps.googleusercontent.com';
var OAUTH2_SCOPES = [
  'https://www.googleapis.com/auth/youtube'
];

// Upon loading, the Google APIs JS client automatically invokes this callback.
googleApiClientReady = function() {
  gapi.auth.init(function() {
    window.setTimeout(checkAuth, 1);
  });
}

// Attempt the immediate OAuth 2.0 client flow as soon as the page loads.
// If the currently logged-in Google Account has previously authorized
// the client specified as the OAUTH2_CLIENT_ID, then the authorization
// succeeds with no user intervention. Otherwise, it fails and the
// user interface that prompts for authorization needs to display.
function checkAuth() {
  gapi.auth.authorize({
    client_id: OAUTH2_CLIENT_ID,
    scope: OAUTH2_SCOPES,
    immediate: true
  }, handleAuthResult);
  init();
}

// Handle the result of a gapi.auth.authorize() call.
function handleAuthResult(authResult) {
  if (authResult && !authResult.error) {
    // Authorization was successful. Hide authorization prompts and show
    // content that should be visible after authorization succeeds.
    $('.pre-auth').hide();
    $('.post-auth').show();
    loadAPIClientInterfaces();
  } else {
    // Make the #login-link clickable. Attempt a non-immediate OAuth 2.0
    // client flow. The current function is called when that flow completes.
    $('#login-link').click(function() {
      gapi.auth.authorize({
        client_id: OAUTH2_CLIENT_ID,
        scope: OAUTH2_SCOPES,
        immediate: false
        }, handleAuthResult);
    });
  }
}

// Load the client interfaces for the YouTube Analytics and Data APIs, which
// are required to use the Google APIs JS client. More info is available at
// https://developers.google.com/api-client-library/javascript/dev/dev_jscript#loading-the-client-library-and-the-api
function loadAPIClientInterfaces() {
  gapi.client.load('youtube', 'v3', function() {
    handleAPILoaded();
  });
}
