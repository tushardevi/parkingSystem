import Koa from 'koa'
import Router from 'koa-router'
import server from 'koa-static'
import websockify from 'koa-websocket'
import { WebSocketServer } from 'ws';
import views from 'koa-views'
import bodyParser from 'koa-body'
import { recognition } from './websocket.js';
const router = new Router()
router.use(bodyParser({multipart: true}))


const app = new Koa()
app.keys = ['darkSecret']


// // router.get('/streamer', async ctx => {
//     ctx.body = '<html>\
// <head>\
//     <title>Streamer</title>\
// </head>\
// <body>\
//        <button>Start camera</button>\
//            <br/>\
//            <video></video>\
//            <script>\
//                 function getFrame() {\
//                     const canvas = document.createElement("canvas");\
//                     canvas.width = video.videoWidth;\
//                     canvas.height = video.videoHeight;\
//                     canvas.getContext("2d").drawImage(video, 0, 0);\
//                     const data = canvas.toDataURL("image/png");\
//                     return data;\
//                     \
//                 }\
// 				var video = document.querySelector("video");\
//                 if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {\
//                      console.log("getUserMedia() not supported.");\
//                 }\
//                 var btn = document.querySelector("button");\
//                \
//                 btn.onclick=function(e) {\
// 						let constraints = { video: { facingMode: "environment" } };\
//             navigator.mediaDevices.getUserMedia(constraints)\
//                          .then(function(stream) {\
//                              \
//                              if ("srcObject" in video) {\
//                                  video.srcObject = stream;\
//                              } else {\
//                                  video.src = window.URL.createObjectURL(stream);\
//                              }\
//                              video.onloadedmetadata = function(e) {\
// 									video.play();\
//                              }\
														 
//                         })\
//                           .catch(function(err) {\
//                                console.log(err.name + ": " + err.message);\
//                            });\
//                 };\
//            </script> \
//      </body>\
// </html>'
// // });

router.get('/streamer2',async ctx=>{
		ctx.body = '<html>\
<head>\
    <title>Streamer</title>\
</head>\
<body>\
    <video autoplay></video>\
    <script>\
        \
        const video = document.querySelector("video");\
        \
        \
        navigator.mediaDevices.getUserMedia({video: {width: 426, height: 240}}).then((stream) => video.srcObject = stream);\
        \
        \
        const getFrame = () => {\
            const canvas = document.createElement("canvas");\
            canvas.width = video.videoWidth;\
            canvas.height = video.videoHeight;\
            canvas.getContext("2d").drawImage(video, 0, 0);\
            const data = canvas.toDataURL("image/png");\
            return data;\
        }\
\
        const WS_URL = "wss://buffalowatch-laddernorway-3001.codio-box.uk/";\
        const FPS = 3;\
        const ws = new WebSocket(WS_URL);\
        ws.onopen = () => {\
            console.log(`Connected to ${WS_URL}`);\
            setInterval(() => {\
                ws.send(getFrame());\
            }, 1000 / FPS);\
        }\
    </script>\
</body>\
</html>'


})






//https://webmobtuts.com/javascript/accessing-webcam-with-javascript-getusermedia/



router.get('/admin', async ctx=>{
    await ctx.render('admin');
})




router.get('/client', async ctx => {
    await ctx.render('takePic')
});
router.get('/receptor', async ctx => {
    await ctx.render('receptor')
});


// router.get('/register', async ctx => {
// 	console.log(ctx.hbs)

// })





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

    ws.on('message', data => {
        // send the base64 encoded frame to each connected ws
        connectedClients.forEach((ws, i) => {
            if (ws.readyState === ws.OPEN) { // check if it is still connected
                // const file = new FileReader()
                // file.onload = function(e){
                //     var arrayBuffer = file.result
                // }
                // file.readAsArrayBuffer(data)
				// console.log(file.result)
                // console.log("***")
                console.log("SENDING TO PYTHON:")
                recognition(data)
               // console.log("df"+data)
                ws.send("LOLO"+data);
                //console.log('this is the data:' + data)
                //console.log('coming..') // send
            } else { // if it's not connected remove from the array of connected ws
                connectedClients.splice(i, 1);
                console.log("a client left, now clients connected:"+connectedClients.length)
            }
        });
    });
});






// wss.on('connection', function connection(ws) {
//   console.log('received:');
//   ws.on('message', function message() {
//     console.log('received:');
//   });

// //  ws.send('something');
// });




async function getHandlebarData(ctx, next) {
	console.log(`${ctx.method} ${ctx.path}`)
	ctx.hbs = {
		host: `https://${ctx.host}`
	}

	await next()
}

app.use(views('views', { extension: 'handlebars' }, {map: { handlebars: 'handlebars' }}))
app.use(server('public'))
//app.use(session(app))
app.use(getHandlebarData)
app.use(router.routes())
app.use(router.allowedMethods())


const HTTPport = process.env.HTTP_PORT || 8080
app.listen(HTTPport, async() => console.log(`listening on port ${HTTPport}`))







// app.get('/streamer', (req, res) => {
//     res.sendFile(path.resolve(__dirname, './streamer.html'));
// });

// app.listen(HTTP_PORT, () => {
//     console.log(`HTTP server listening at http://localhost:${HTTP_PORT}`)
// });https://medium.com/@alexcambose/webcam-live-streaming-with-websockets-and-base64-64b1b4992db8