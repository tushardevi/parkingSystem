import session from 'koa-session'
import Koa from 'koa'
//import Router from 'koa-router'
import server from 'koa-static'
import websockify from 'koa-websocket'
import { WebSocketServer } from 'ws';
import views from 'koa-views'
import bodyParser from 'koa-body'

// imported functions to scan car and get numbe rplate as text using image recognition
import { recognition } from './scanCar.js';
import{regPlate} from './scanCar.js';
//const router = new Router()
router.use(bodyParser({multipart: true}))

//import sqlite from 'sqlite-async'
import Bookings from './modules/bookings.js'

import router from './routes/routes.js'
//import { recognition } from './websocket.js'

const app = new Koa()
app.keys = ['darkSecret']


//****************************************** */
	//SERVER FOR SENDING IMAGES
//****************************************** */
const WS_PORT = process.env.WS_PORT || 3001;
const wss = new WebSocketServer({ port: WS_PORT }, () => console.log(`WS server is listening at ws://localhost:${WS_PORT}`));

// array of connected websocket clients
let connectedClients = [];

wss.on('connection', (ws, req) => {
    console.log('Connected');
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
//****************************************** */
	//SERVER TO SHOW REAL TIME DATA 
//****************************************** */

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
					connectedClients.splice(i, 1);
					console.log("a client left, now clients connected:"+connectedClients.length)
				}
			})

			
	})


});


//****************************************** */


const defaultPort = 8080
const port = process.env.PORT || defaultPort

async function getHandlebarData(ctx, next) {
	console.log(`${ctx.method} ${ctx.path}`)
	ctx.hbs = {
		authorisedMember: ctx.session.authorisedMember,
		authorisedManager: ctx.session.authorisedManager,
		username: ctx.session.username,
		host: `http://${ctx.host}`
	}

	for(const key in ctx.query) {
		ctx.hbs[key] = ctx.query[key]
	}

	await next()
}

app.use(server('public'))
app.use(session(app))
app.use(views('views', { extension: 'handlebars' }, {map: { handlebars: 'handlebars' }}))

app.use(getHandlebarData)
router.pub
app.use(router.routes())
app.use(router.allowedMethods())


app.listen(port, async() => console.log(`listening on port ${port}`))
