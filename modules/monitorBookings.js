import sqlite from 'sqlite-async'
import cron from 'node-cron'

//const dbName = "website.db"
import Bookings from './bookings.js'
import Email from './sendEmail.js'


class monitorBookings{
  constructor() {
			this.db_name = "website.db"
            this.array_sent_email = []
		
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
            if(Math.abs(expiry_date.hours - c.hours) > 0 && Math.abs(expiry_date.hours - c.hours) <= 15){

            }
            // if the curren time is greater than the expirty bokoing time then
            // we know boking has been expired
            if(c > expiry_date){
                console.log("EXPIRED BOOKING FOUND!")

                console.log("appending to ARCHIEVE BOOKINGS TABLE....")

                // insert the booking to different table
                const sql4 = `INSERT INTO archive_bookings('driver_id','car_reg','start_dateTime', 'end_dateTime')\
                VALUES('${dt[0].driver_id}','${dt[0].carReg}','${Date(dt[0].end_dateTime)}','${Date(dt[0].start_dateTime)}')`
                await db.run(sql4)

                console.log("deleting from ~LIVE_BOOKINGS TABLE... ")
                const sql3 = `DELETE FROM live_bookings WHERE booking_id = "${dt[0].booking_id}"`
                await db.run(sql3)

                // delete the user_id from the temp array of sending alerts to users before booing expiration
                let arr = this.array_sent_email
                if(!this.array_sent_email.length == 0){
                    for(let i = 0; i < this.array_sent_email.length; i++){
                        if(this.array_sent_email[i] == dt[0].booking_id){
                          delete this.array_sent_email[i]
                        }
                      }

                }
                console.log("mointor side")
                console.log(this.array_sent_email)
                


                
                //console.log(dt[0].end_dateTime)
                //console.log(c)

            }

        

        }catch(err){
            console.log("ERROR")
            console.log(err.message)
        }
            
        
        
    }

    // function to alert users when their booking is about to expire.
    async  send_alert_notification(){
        try{
        
            const db = await sqlite.open("website.db")
        
        //     // THIS IS THE CODE TO GET ALL ABOUT TO EXPIRE BOOKINGS IN ORDER
            const sql2 = ' SELECT * FROM live_bookings ORDER BY end_dateTime ASC;'
            const dt = await db.all(sql2)
            if(dt.length  < 1) {return}
        
            // CONSTRUCT a new date object to store current date and time
            const current_date = new Date()
           
            //get the hours and minutes of current date_time
            const current_hours = current_date.getHours()
            const current_mins = current_date.getMinutes()
           // console.log(current_hours + " :" + current_mins)
            //let c = current_date + ''
        
           //construct another date object of the end booking time
           for(let i = 0; i < dt.length; i++){
                console.log(dt[i])
                let expiry_date = dt[i].end_dateTime
                const expiry_date_obj = new Date(expiry_date)
        
                //get its hours and mins
                const expiry_hours = expiry_date_obj.getHours()
                const expiry_mins = expiry_date_obj.getMinutes()
                //console.log(expiry_hours + " :" + expiry_mins)
        
                // check if the hours are equal in value
            // if true then calculate the diff between expirty_mins and curren_mins 
            //check if it falls between 0 and 15.
            console.log("entering with bookingid : " + dt[i].booking_id)
            console.log("the ARRAY")
            console.log(this.array_sent_email)
            console.log((expiry_date_obj.getTime() - current_date.getTime())/60000)
            const diff = Math.abs((current_date.getTime() - expiry_date_obj.getTime())/60000)

                if(diff > 0 && diff < 1){
                    // check if the booking_id exists in the array, if yes, the emails has already been sent do not send again
                    if(this.array_sent_email.includes(dt[i].booking_id)){
                    continue
                    }
                    else{
                        // push the booking_id into an array that keeeps track of the emails sent to users
                        this.array_sent_email.push(dt[i].booking_id)
                    
                        // get the email of the user and send them an alert email
                        const email_obj = await new Email()
                        const email =  await this.get_email(dt[0].driver_id)
                        await email_obj.send_alert_email(email,dt[0])
                        ///call the send email class here get the email of the person from the records
    
                        console.log("TIME TO SEND A MESSAGE TO THE USER : " + dt[i].driver_id + "with booking id : "+dt[i].booking_id)
                        
                }
                    
                    
                }
    
            }
            
    
    
        }catch(err){
            console.log("ERROR in sending notification to user before expiry time")
            console.log(err.message)
        }
    
    }

    async get_email(user_id){
        try{
            const db = await sqlite.open(this.db_name)
            
            const sql = `SELECT email from driver_details WHERE driver_id = '${user_id}'`
            const records = await db.get(sql)
    
            console.log("email of user is.... ")
            console.log(records.email)
            return records.email
    
        }catch(err){
            console.log(err)
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

