import sqlite from 'sqlite-async'
import cron from 'node-cron'

//const dbName = "website.db"
import Bookings from './bookings.js'



class monitorBookings{
  constructor() {
			this.db_name = "website.db"
		
	}
    

    async monitor(){
        try{
            //console.log("checking .....")
            const db = await sqlite.open(this.db_name)
        // const obj = await new Bookings
        //     // THIS IS THE CODE TO GET ALL ABOUT TO EXPIRE BOOKINGS IN ORDER
            const sql2 = ' SELECT * FROM live_bookings ORDER BY end_dateTime ASC;'
            const dt = await db.all(sql2)
            if(dt.length  < 1) {return}
        // console.log("some data found")
            const current_date = new Date()
            let c = current_date + ''
        

            let expiry_date = dt[0].end_dateTime

            //console.log(dt[0])
        
            if(c > expiry_date){
                console.log("EXPIRED BOOKING FOUND!")

                console.log("appending to ARCHIEVE BOOKINGS TABLE....")

                const sql4 = `INSERT INTO archive_bookings('driver_id','car_reg','start_dateTime', 'end_dateTime')\
                VALUES('${dt[0].driver_id}','${dt[0].carReg}','${Date(dt[0].end_dateTime)}','${Date(dt[0].start_dateTime)}')`
                await db.run(sql4)

                console.log("deleting from ~LIVE_BOOKINGS TABLE... ")
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
    async close() {
        await this.db.close()
    }

}
export default monitorBookings





//setInterval(monitorBookings,1000)


//cron.schedule('*/2 * * * * *', monitorbookings.monitor())
  
  //task.start();



// while(1 ==1){
//     // THIS IS THE CODE TO GET ALL ABOUT TO EXPIRE BOOKINGS IN ORDER
//         const sql2 = ' SELECT end_dateTime FROM liveBookings ORDER BY end_dateTime ASC;'
//         const dt = await this.db.all(sql2)
//         console.log("BEBOOOOOOOOO PEPSI COLA")
//         console.log(dt)

//     console.log("hi")
// }

