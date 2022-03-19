import {spawn} from 'child_process'
const child = spawn('python',['./pythonScripts/hello.py']);


child.stdout.on('data', (data) => {
  console.log(`stdout:\n${data}`);
});

child.stderr.on('data', (data) => {
  console.error(`stderr: ${data}`);
});

child.on('error', (error) => {
  console.error(`error: ${error.message}`);
});

child.on('close', (code) => {
  console.log(`child process exited with code ${code}`);
});











































// import Koa from 'koa'
// import server from 'koa-static'
// import views from 'koa-views'
// import session from 'koa-session'

// import managerRouter from './routes/manager.js'



// const app = websockify(new Koa());

// app.ws.use(function(ctx, next) {
//   // return `next` to pass the context (ctx) on to the next ws middleware
//   return next(ctx);
// });


// const defaultPort = 3000
// const port = process.env.PORT || defaultPort


// //app.use(server('public'))
// //app.use(session(app))
// //app.use(views('views', { extension: 'handlebars' }, {map: { handlebars: 'handlebars' }}))


// //router.pub
// app.ws.use(managerRouter.routes())
// app.ws.use(managerRouter.allowedMethods())


// /app.listen(port, async() => console.log(`listening on port ${port}`))




