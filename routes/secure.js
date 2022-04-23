/** @routes Secure */

import Router from 'koa-router'
const router = new Router({ prefix: '/secure' })
import Bookings from '../modules/bookings.js'
const dbName = 'website.db'

/**
	 * Summary:
	 * This function checks for
	 * authentication
	 *
	 * Parameters:
	 * @param {Function} ctx middleware
	 * @param {Function} next middleware
	 *
	 * @returns (redirects member to home page if
	 * authentication is not valid.
	 */

async function checkAuth(ctx, next) {
	console.log('secure router middleware')
	console.log(ctx.hbs)
	if(ctx.hbs.authorisedMember !== true) return ctx.redirect('/login?msg=you need to log in&referrer=/secure')
	await next()
}


router.use(checkAuth)



router.get('/',async ctx => {
	await ctx.render('secure',ctx.hbs)
})




/**
 * Summary :
 * function to add new bookings
 *
 * @name AddBooking Script
 * @route {POST} / 
 */
router.post('/', async ctx => {
	const bookings = await new Bookings(dbName) 

	try {
		console.log("POST / secure")
		
		
		//add username to the data so his details could be retrived
		ctx.request.body.username = ctx.session.username
		console.log(ctx.request.body)

		// call the function to add booking
		 await bookings.addBooking(ctx.request.body)
	
		//once sucefully booked refresh the page with a message
		ctx.redirect('/secure?msg=booking sucessful')

	} catch(err) {
		ctx.hbs.msg = err.message
		ctx.hbs.body = ctx.request.body
		console.log(err.message)
		console.log(ctx.hbs)
		await ctx.render('secure', ctx.hbs)
	} finally {
		bookings.close()
	}
})

export default router
