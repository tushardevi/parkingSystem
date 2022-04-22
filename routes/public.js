/** @routes Public */

import Router from 'koa-router'
import bodyParser from 'koa-body'

const router = new Router()
router.use(bodyParser({multipart: true}))

import Accounts from '../modules/accounts.js'
const dbName = 'website.db'


/**
 * Summary:
 * The home page.
 *
 * @name Home Page
 * @route {GET}
 *
 */
router.get('/', async ctx => {

	try {
		console.log(ctx.hbs)

		if(ctx.hbs.authorisedMember) {
			return ctx.redirect('/secure')
		}
		if(ctx.hbs.authorisedManager) {
			return ctx.redirect('/admin')
		}


		await ctx.render('index', ctx.hbs)

	} catch(err) {
		await ctx.render('error', ctx.hbs)
	}
})


/**
 * Summary :
 * User registration page.
 *
 * @name Register Page
 * @route {GET} /register
 */
router.get('/register', async ctx => {
	console.log(ctx.hbs)
	await ctx.render('register', ctx.hbs)
})


/**
 * Summary :
 * Script to retieve data from the texboxes in the "/register"
 * page and add it to the database.
 *
 * @name Register Script
 * @route {POST} /register
 */
router.post('/register', async ctx => {

	const account = await new Accounts(dbName)
	

	try {
		

		// register the member.
		console.log("driver details here: ")
		console.log(ctx.request.body)
		await account.register(ctx.request.body)


		ctx.redirect('/?msg= Account Created!')

	} catch(err) {
		ctx.hbs.msg = err.message
		console.log(err.message)
		ctx.hbs.body = ctx.request.body
		console.log(ctx.hbs)
		await ctx.render('register', ctx.hbs)

	}


})


/**
 * Summary :
 * Script to retieve username and password from the
 * texboxes in the "/login" page,
 * also checks if the user is a manager or not.
 *
 * @name Login Script
 * @route {POST} /login

 */
router.post('/login', async ctx => {

	// new object Accounts
	const account = await new Accounts(dbName)
	//ctx.hbs.body = ctx.request.body
	let referrer = ''
	try {

		const body = ctx.request.body

		// function returns an dictionary with 2 values: username and isAdmin
		const info = await account.login(body.user, body.pass)

		//ctx.session.user = body.user
		ctx.session.username = info['username']

		// give it a check and change authorised to true or false
		// according to who logged in

		if(info['isAdmin'] < 0 ) {
			ctx.session.authorisedMember = null
			ctx.session.authorisedManager = true
			referrer = body.referrer || '/admin'

		}

		if(info['isAdmin'] >= 0) {
			ctx.hbs.username = info['username']
			ctx.session.authorisedManager = null
			ctx.session.authorisedMember = true
			referrer = body.referrer || '/secure'

		}

		// redirect to an appropiate route
   	return ctx.redirect(`${referrer}?msg= Welcome ${body.user}`)


	} catch(err) {
		ctx.hbs.msg = err.message
		await ctx.render('index', ctx.hbs)
	} finally {
		account.close()
	}


})


/**
 * Summary :
 * Script to log out the system.
 *
 * @name Logout Script
 * @route {GET} /logout
 */
router.get('/logout', async ctx => {
	ctx.session.authorisedMember = null
	ctx.session.authorisedManager = null
	//delete ctx.session.user
	delete ctx.session.username

	ctx.redirect('/')
})

export default router
