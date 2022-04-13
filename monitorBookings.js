import sqlite from 'sqlite-async'
let counter = 0
const dbName = "website.db"


async function monitorBookings (){
    try{
        counter = counter + 1
        const db = await sqlite.open(dbName)
    //     // THIS IS THE CODE TO GET ALL ABOUT TO EXPIRE BOOKINGS IN ORDER
        const sql2 = ' SELECT end_dateTime FROM liveBookings ORDER BY end_dateTime ASC;'
        const dt = await db.all(sql2)
        const current_date = new Date()
        let c = current_date + ''
      

        let expiry_date = dt[0].end_dateTime

      //  console.log(expiry_date)
        console.log("minute :"+ counter)
        if(c > expiry_date){
            console.log("ABOUT TO DELETE FOLLOWING DATE ")
            const sql3 = `DELETE FROM LiveBookings WHERE booking_id = "${counter}"`
            await db.all(sql2)
            //console.log(dt[0].end_dateTime)
            //console.log(c)

        }
    }catch(err){
        console.log("ERROR")
        console.log(err.message)
    }
        
       
    
}

async function monitorBookings2 (){
    try{
        counter = counter + 1
        const db = await sqlite.open(dbName)

       
        console.log("ABOUT TO DELETE FOLLOWING DATE ")
        const sql3 = `DELETE FROM LiveBookings WHERE booking_id = "${counter}"`
        await db.all(sql3)
        //console.log(dt[0].end_dateTime)
        //console.log(c)

        
    }catch(err){
        console.log("ERROR")
        console.log(err.message)
    }
        
       
    
}



async function close() {
    await db.close()
}


setInterval(monitorBookings2,10000)





// while(1 ==1){
//     // THIS IS THE CODE TO GET ALL ABOUT TO EXPIRE BOOKINGS IN ORDER
//         const sql2 = ' SELECT end_dateTime FROM liveBookings ORDER BY end_dateTime ASC;'
//         const dt = await this.db.all(sql2)
//         console.log("BEBOOOOOOOOO PEPSI COLA")
//         console.log(dt)

//     console.log("hi")
// }