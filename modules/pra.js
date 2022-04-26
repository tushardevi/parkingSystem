
import sqlite from 'sqlite-async'
async function send_alert_notification(){
    try{
        //console.log("checking .....")
        const db = await sqlite.open("website.db")
    // const obj = await new Bookings
    //     // THIS IS THE CODE TO GET ALL ABOUT TO EXPIRE BOOKINGS IN ORDER
        const sql2 = ' SELECT * FROM live_bookings ORDER BY end_dateTime ASC;'
        const dt = await db.all(sql2)
        if(dt.length  < 1) {return}
    
        // CONSTRUCT a new date object to store current date and time
        const current_date = new Date()
        //console.log(dt[0])
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
            if(expiry_hours == current_hours){
                if((Math.abs(expiry_mins - current_mins)) > 0 && (Math.abs(expiry_mins - current_mins)) < 16 ){
                    // get the email of the user and send them an alert email
                // const email =  await get_email(dt[0].driver_id)
                    ///call the send email class here get the email of the person from the records
    
                    console.log("TIME TO SEND A MESSAGE TO THE USER")
                    
                }
            }

        }
        


    }catch(err){
        console.log("ERROR in sending notification to user before expiry time")
        console.log(err.message)
    }
}



async function get_email(user_id){
    try{
        const db = await sqlite.open("website.db")
        
        const sql = `SELECT email from driver_details WHERE driver_id = '${user_id}'`
        const records = await db.get(sql)

        console.log("email of user is.... ")
        console.log(records.email)
        return records.email

    }catch(err){
        console.log(err)
    }
}


function pa(expiry_hours,current_hours,expiry_mins,current_mins){
    if(expiry_hours == current_hours){
        if((Math.abs(expiry_mins - current_mins)) > 0 && (Math.abs(expiry_mins - current_mins)) < 16 ){
           // const email =  await get_email(dt[0].driver_id)
            ///call the send email class here get the email of the person from the records

            console.log("TIME TO SEND A MESSAGE TO THE USER")
            
        }
    }
}
send_alert_notification()

//pa(20,20,45,30)