/*
 * Verifry if browser has getUserMedia
 */


function hasGetUserMedia() {
    return !!(navigator.getUserMedia || navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia || navigator.msGetUserMedia);
}

var video = document.getElementById('sourcevid');

navigator.getMedia = ( navigator.getUserMedia ||
                       navigator.webkitGetUserMedia ||
                       navigator.mozGetUserMedia ||
                       navigator.msGetUserMedia);

const a = 1
const b = 1

if (hasGetUserMedia()) {
    console.log("entering if st")
    navigator.getMedia(
        {video: true, audio: false}, 

        function (localMediaStream) {
            console.log("setting to video")
           // video.src = window.URL.createObjectURL(localMediaStream);
             video.srcObject = localMediaStream;
        }, 
        function (e) {
            console.log(e);
        }
    );
    
    var back = document.createElement('canvas');
    var backcontext = back.getContext('2d');
    
    var ws;
    const WS_URL = "ws:localhost:3001";
    if ('WebSocket' in window) {
        connect(WS_URL);
    } else {
        console.log('web sockets not suported');
    }
    
    function connect(host) {
        ws = new WebSocket(host);
        
        ws.onopen = function () {
            console.log('connected youu whuuu');
        }
        
        ws.onclose = function () {
            console.log('closed');
        }
        
        ws.onerror = function(evt) {
            console.log('<span style="color: red;">ERROR:</span> ' + evt.data);
        }
    }
    
    function send(msg) {
        if (ws != null) {
            if (ws.readyState === 1)
                ws.send(msg);
        } else {
            console.log('not ready yet');
        }
    }
    
    cw = video.clientWidth;
    ch = video.clientHeight;
    back.width = cw;
    back.height = ch;
    //draw(video, backcontext, cw, ch);
    let button = document.getElementById("pic_btn")
    button.addEventListener('click',function(){
        draw(video, backcontext, cw, ch);


    },false)

    function draw(v, bc, w, h) {
        bc.drawImage(v, 0, 0, w, h);
        
        var stringData = back.toDataURL();
        console.log("sending this stinrg:")
        console.log(stringData)
        send(stringData);
        
       // setTimeout(function() { draw(v, bc, w, h) });
    }
    
} else {
    alert('getUserMedia() is not supported in your browser!');
}