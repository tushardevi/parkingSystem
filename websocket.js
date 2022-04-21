import {spawn} from 'child_process'

//const child = spawn('python3',['./pythonScripts/scripts/open.py','tushar saying hi']);
export let regPlate = ""

export async function recognition(base64){
  //const img = './pythonScripts/scripts/car3.jpg'
  //const child = spawn('python3',['./pythonScripts/scripts/open.py',img,'popo','lolo','pipa']);
  let h_base64 = " "+base64
  //console.log(h_base64)
  let img = ""
  if(h_base64.includes(";base64,")){ //changed this before
      img = h_base64.split(";base64,")
  }else{
    img = h_base64
  }
  
  //console.log("BOBOBOBOBOBOB lobo")
 // console.log(img[0])
  const child = spawn('python3',['./pythonScripts/scripts/open.py',img]);

  child.stdout.on('data', function(data) {
    
    //console.log("RECEIVING RESPONSE FROM CHILD PROCESS")
    //console.log("starting open_cv")

    
    const res = data.toString()
    
    regPlate = res
    //console.log(a)
  });

  child.stderr.on('data', (data) => {
    console.error(`stderr: WE GOT ERROR`);
    console.error(`${data}`);
  });

  child.on('error', (error) => {
    console.error(`error: ${error.message}`);
  });

  child.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
  });

}











































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




