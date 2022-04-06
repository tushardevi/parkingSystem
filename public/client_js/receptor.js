var img;
var heading;
function init() {
    img = document.getElementById('frame');
    heading = document.querySelector('h')
}

$(document).ready(function (){
    init();
});
const WS_URL = "ws:localhost:3001";
if ('WebSocket' in window) {
    connect(WS_URL);
} else {
    console.log('web sockets not suported');
}

var ws;

function connect(host) {
    ws = new WebSocket(host);

    ws.onopen = function () {
        console.log('connected to receptor');
    }

    ws.onmessage = function (evt) {
    //     const a = URL.createObjectURL(evt.data,'image/png')
    //    //console.log(a)
    //     const array = a.split('/')
    //     console.log(array)
    //     const bl = array[0].split(':')
    //     const res = bl[0]+array[3]
        let data = evt.data
        const array = data.split('LOLO')
        console.log(array)
        img.src = array[1]
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
