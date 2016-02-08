
/*
function getName() {
var name = window.names[Math.floor(Math.random() * window.names.length)];

var tokens = name.split(',');

if(tokens.length > 1) {
    return $.trim(tokens[1]) + " " + $.trim(tokens[0]);
}

return name;
}

function searchUrlFor(name) {
return 'https://www.google.com/search?q=' + encodeURIComponent(name) + '%20site:wikipedia.org&btnI=3564';
}
*/

function escaped(s) {
return $("<div></div>").html(s).html();
}

//var name = getName();
var name = $('#username').text();

$("#data").attr('placeholder', 'send message as ' + name);

var socket = io.connect('/');

// on connection to server, ask for user's name with an anonymous callback
socket.on('connect', function() {
// call the server-side function 'adduser' and send one parameter (value of prompt)
socket.emit('adduser', name);
//notify_me.update('message',escaped(name) + ' Online'); 
});

// listener, whenever the server emits 'updatechat', this updates the chat body
socket.on('updatechat', function (username, data) {
$('#conversation').append('<b>'+ escaped(username) + ':</b> ' + escaped(data) + "<br/>");
  
});

// listener, whenever the server emits 'updateusers', this updates the username list
socket.on('updateusers', function(data) {
$('#users').empty();
$.each(data, function(key, value) {
    //$('#users').append('<div><a href="' + searchUrlFor(key) + '" target="_blank">' + key + '</div>');            
    $('#users').append('<div><div><img id="people-img" class="people-img-card" src="//ssl.gstatic.com/accounts/ui/avatar_2x.png" /></div><div class="users">' + key + '</div></div><br/>');
});
});

socket.on('servernotification', function (data) {
//var searchUrl = searchUrlFor(data.username);
if(data.connected) {
    //if(data.to_self) data.username = "you";   
    if(data.to_self) data.username = $('#username').text();
               
    //$('#conversation').append('connected: ' + escaped(data.username) + "<br/>");       
    $.notify({icon:'/public/images/online-status.png',message:data.username + ' is Online'},{type:'success'});
    
} else {
    
    //$('#conversation').append('disconnected: ' + escaped(data.username) + "<br/>");        
     $.notify({icon:'/public/images/offline-status.png',message:data.username + ' is Offline'},{type:'warning'});
}

});


// on load of page
$(function(){
// when the client hits ENTER on their keyboard

 function emojiConvert (data) {        
        var output = emojione.unicodeToImage(data);
        return output;
  }

$('#data').keypress(function(e) {
    if(e.which == 13) {
    //var message = $('#data').val();
    if ($('#data').val() != '')
    {
        var message = emojiConvert($('#data').val());
        $('#data').val('');
        // tell server to execute 'sendchat' and send along one parameter
        
        socket.emit('sendchat', message);
    }
    }
});


});
