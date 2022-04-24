import { WebSocketServer } from 'ws';
// imported functions to scan car and get numbe rplate as text using image recognition
import { recognition } from '../scanCar.js';
import{regPlate} from '../scanCar.js';
import Bookings from '../modules/bookings.js'

//****************************************** */
	//WEB SOCKET SERVER FOR SENDING IMAGES
//****************************************** */
const WS_PORT = process.env.WS_PORT || 3001;
const wss = new WebSocketServer({ port: WS_PORT }, () => console.log(`WS server is listening at ws://localhost:${WS_PORT}`));

// array of connected websockot clients

let connectedClients = [];

wss.on('connection', async function(ws) {
    console.log('Connected TO SCAN CAR SOCKET');
    // add new connected client
    connectedClients.push(ws);
    console.log("clients connected:"+connectedClients.length)
    // listen for messages from the streamer, the clients will not send anything so we don't need to filter

    ws.on('message', async function(data) {
        // send the base64 encoded frame to each connected ws
		
        try{
            // call the algorithm to extract the number plate as text 
            //and save it in a global variable regPlate
            recognition(data)
            // validate the regplate using the method inside the bookings class
            const dbName = "website.db"
            const bookings = await new Bookings(dbName)
            console.log("Extracting number plate.... ")
            console.log("number plate is : FW12 GMF ")
            const res = await bookings.validate_regPlate(regPlate) // send reg plate to procedure
       

            connectedClients.forEach((ws, i) => {
                if (ws.readyState === ws.OPEN) { // check if it is still connected
                
                    try{
                  
                    // send the result of validation to the client
                        console.log("validation done, does the car have a valid booking?: " + res)
                        ws.send(JSON.stringify(res))
                       // ws.send("LOLO"+data);

                    }catch(e){
                        console.log(e)

                    }
                
                } else { // if it's not connected remove from the array of connected ws
                    connectedClients.splice(i, 1);
                    console.log("a client left, now clients connected:"+connectedClients.length)
                }
            });

        }catch(err){
            console.log("error in send_iamge wss")
            console.log(err)
        }
    });
});
