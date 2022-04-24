//****************************************** */
	//WEB SOCKET SERVER TO SHOW REAL TIME DATA 
//****************************************** */
import { WebSocketServer } from 'ws';
import Bookings from '../modules/bookings.js'
let connectedClients2 = [];
const WS_PORT_2 = process.env.WS_PORT_2 || 3002;
const wss2 = new WebSocketServer({ port: WS_PORT_2 }, () => console.log(`WS server is listening at ws://localhost:${WS_PORT_2}`));

 wss2.on('connection', async function(ws) {
	
	connectedClients2.push(ws);

	
    console.log('Connected TO REAL TIME DATA SOCKET');
	//console.log(a)
	//const data = setInterval(get_bookings,20000)

    console.log("admins connected:"+connectedClients2.length)
    // listen for messages from the streamer, the clients will not send anything so we don't need to filter

	ws.on('message', async function(data) {
		//setInterval(async () =>{
		try{
		const dbName = "website.db"
		const obj = await new Bookings(dbName)
		const bookings = await obj.get_bookings()


		connectedClients2.forEach((ws, i) => {
			if (ws.readyState === ws.OPEN) { // check if it is still connected
				try{
					//console.log("sending real data back to the admin page..")
					
					ws.send(bookings)

				}catch(e){
					console.log(e.message)

				  }
				
				} 
				else { // if it's not connected remove from the array of connected ws
					connectedClients2.splice(i, 1);
					console.log("a client left, now clients connected:"+connectedClients2.length)
				}
			})
			
		}catch(err){
			console.log("getting error in live_data websocket server")
			console.log(err)
		}

			
	})


});


//****************************************** */