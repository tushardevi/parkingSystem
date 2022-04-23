import { WebSocketServer } from 'ws';
// imported functions to scan car and get numbe rplate as text using image recognition
import { recognition } from '../scanCar.js';
import{regPlate} from '../scanCar.js';


//****************************************** */
	//WEB SOCKET SERVER FOR SENDING IMAGES
//****************************************** */
const WS_PORT = process.env.WS_PORT || 3001;
const wss = new WebSocketServer({ port: WS_PORT }, () => console.log(`WS server is listening at ws://localhost:${WS_PORT}`));

// array of connected websocket clients
let connectedClients = [];

wss.on('connection', (ws, req) => {
    console.log('Connected TO SCAN CAR SOCKET');
    // add new connected client
    connectedClients.push(ws);
    console.log("clients connected:"+connectedClients.length)
    // listen for messages from the streamer, the clients will not send anything so we don't need to filter

    ws.on('message', async function(data) {
        // send the base64 encoded frame to each connected ws
		recognition(data)
        connectedClients.forEach((ws, i) => {
            if (ws.readyState === ws.OPEN) { // check if it is still connected
               
				try{
				  // await recognition(data)
				   console.log("SERVER SIDE REG PLATE XXX")
				   console.log(regPlate)
					ws.send("LOLO"+data);

				}catch(e){
					console.log(e)

				}
               
            } else { // if it's not connected remove from the array of connected ws
                connectedClients.splice(i, 1);
                console.log("a client left, now clients connected:"+connectedClients.length)
            }
        });
    });
});
