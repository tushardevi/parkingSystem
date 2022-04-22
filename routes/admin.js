/** @routes Admin */
import Router from 'koa-router'

const router = new Router({ prefix: '/admin'})


import Email from '../modules/sendEmail.js'
import Accounts from '../modules/accounts.js'
import Expenses from '../modules/bookings.js'
const dbName = 'website.db'

//import 

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

async function checkAuth2(ctx, next) {
	console.log('manager router middleware')
	console.log(ctx.hbs)
	if(ctx.hbs.authorisedManager !== true) return ctx.redirect('/login?msg=you need to log in&referrer=/admin')
	await next()
}


//router.use(checkAuth2)


/**
 * Summary :
 * Admin Home page (for admin only).
 *
 * @name Admin Home.
 * @route {GET} /admin
 */
router.get('/', async ctx => {

	try {
		await ctx.render('admin', ctx.hbs)

	} catch(err) {
		console.log(err.message)
		ctx.hbs.error = err.message
		await ctx.render('error', ctx.hbs)
	}


})


// /**
//  * Summary :
//  * Script to get the scan car page.
//  *
//  * @name scan car.
//  * @route {GET} /admin/scanCar
//  */
router.get('/scanCar', async ctx => {
    await ctx.render('scanCar')
});

export default router


