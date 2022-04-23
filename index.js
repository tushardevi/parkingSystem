import session from 'koa-session'
import Koa from 'koa'
//import Router from 'koa-router'
import server from 'koa-static'
import views from 'koa-views'
import bodyParser from 'koa-body'


//const router = new Router()
router.use(bodyParser({multipart: true}))

import router from './routes/routes.js'
//import { recognition } from './websocket.js'

const app = new Koa()
app.keys = ['darkSecret']

import * as live_data_wss from './wss/live_data.js'
import * as send_image_wss from './wss/send_image.js'

// make a call to the web socket servers
send_image_wss
live_data_wss


// HTTP server
const defaultPort = 8080
const port = process.env.PORT || defaultPort

//cookies
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


app.listen(port, async() => console.log(`HTTP server listening on port ${port}`))
