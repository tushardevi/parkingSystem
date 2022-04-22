
import Router from 'koa-router'

import publicRouter from './public.js'
import secureRouter from'./secure.js'
import adminRouter from'./admin.js'

const mainRouter = new Router()

const nestedRoutes = [publicRouter, secureRouter, adminRouter]
for (const router of nestedRoutes) {
	mainRouter.use(router.routes())
	mainRouter.use(router.allowedMethods())
}

export default mainRouter
