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

        ws.onmessage = function (evt) {
            //     const a = URL.createObjectURL(evt.data,'image/png')
            //    //console.log(a)
            //     const array = a.split('/')
            //     console.log(array)
            //     const bl = array[0].split(':')
            //     const res = bl[0]+array[3]
                let data = evt.data
                const res= JSON.parse(data)
                console.log("does the car have a valid ticket?")
                console.log("output : " + res )
                let button = document.getElementById("pic_btn")

                button.style.display = 'none'
                let msg = document.getElementById("msg")
                if(res==false){
                    msg.style.color = "green"
                    msg.innerText = "Valid Booking"
                }else{
                    msg.style.color = "red"
                    msg.innerText = "No Valid Booking"
                }
                
                
                setInterval(async()=>{
                    button.style.display = 'block'
                    msg.innerText = ""
                } ,5000)

                


               
                
               // img.src = array[1]
                // var reader = new FileReader()
        
                // reader.onloadend = function(){
                //     var base64 = reader.result
                //     img.src= base64;
                // }
                // reader.readAsDataURL(evt.data)
                
        
                // if (evt.data != null) {
                //     console.log("data incoming...")
                //     console.log(evt.data)
                    
                //    // img.src= base64;
                  
                // }
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
        console.log("sending image to server:")
       // console.log(stringData)
        send(stringData);
        
       // setTimeout(function() { draw(v, bc, w, h) });
    }
    
} else {
    alert('getUserMedia() is not supported in your browser!');
}