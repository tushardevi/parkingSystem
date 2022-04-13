var ws;

const WS_URL = "ws:localhost:3002";
if ('WebSocket' in window) {
    connect(WS_URL);
} else {
    console.log('web sockets not suported');
}

function connect(host) {
    ws = new WebSocket(host);
    
    ws.onopen = function () {
        console.log('connected to real data websocket');

    }

    ws.onmessage = function (evt) {
        
            let data = evt.data
            console.log(data)
           

            
        }














    
    ws.onclose = function () {
        console.log('connection to the socket has been closed');
    }
    
    ws.onerror = function(evt) {
        console.log('<span style="color: red;">ERROR:</span> ' + evt.data);
    }
}
    
    

