import sqlite from 'sqlite-async'
import cron from 'node-cron'
let counter = 0
const dbName = "website.db"


async function monitorBookings (){
    try{
        counter = counter + 1
        const db = await sqlite.open(dbName)
    //     // THIS IS THE CODE TO GET ALL ABOUT TO EXPIRE BOOKINGS IN ORDER
        const sql2 = ' SELECT booking_id , end_dateTime FROM live_bookings ORDER BY end_dateTime ASC;'
        const dt = await db.all(sql2)
        if(dt.length  < 1) {console.log("no data"); return}
       // console.log("some data found")
        const current_date = new Date()
        let c = current_date + ''
      

        let expiry_date = dt[0].end_dateTime

        console.log(dt[0])
        console.log("minute :"+ counter)
        if(c < expiry_date){
            console.log("ABOUT TO DELETE FOLLOWING DATE ")
            const sql3 = `DELETE FROM live_bookings WHERE booking_id = "${dt[0].booking_id}"`
            await db.run(sql3)
            //console.log(dt[0].end_dateTime)
            //console.log(c)

        }
    }catch(err){
        console.log("ERROR")
        console.log(err.message)
    }
        
       
    
}

// async function monitorBookings2 (){
//     try{
//         counter = counter + 1
//         const db = await sqlite.open(dbName)

       
//         console.log("ABOUT TO DELETE FOLLOWING DATE ")
//         const sql3 = `DELETE FROM LiveBookings WHERE booking_id = "${counter}"`
//         await db.all(sql3)
//         //console.log(dt[0].end_dateTime)
//         //console.log(c)

        
//     }catch(err){
//         console.log("ERROR")
//         console.log(err.message)
//     }
        
       
    
// }



async function close() {
    await db.close()
}


//setInterval(monitorBookings,1000)

cron.schedule('*/2 * * * * *', monitorBookings)
  
  //task.start();



// while(1 ==1){
//     // THIS IS THE CODE TO GET ALL ABOUT TO EXPIRE BOOKINGS IN ORDER
//         const sql2 = ' SELECT end_dateTime FROM liveBookings ORDER BY end_dateTime ASC;'
//         const dt = await this.db.all(sql2)
//         console.log("BEBOOOOOOOOO PEPSI COLA")
//         console.log(dt)

//     console.log("hi")
// }