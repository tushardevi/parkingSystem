
/** @module Bookings */


import sqlite from 'sqlite-async'
import Email from './sendEmail.js'


/**
   * Summary:
   * This class is used to add new bookings,
   * retrieve bookings' details , validate bookings,
   * ES6 module
   */
class Bookings {

	/**
   * Create an booking object
   * @param {String} [dbName=":memory:"] - The name of the database file to use.
   */
	constructor(dbName = '../website.db:') {
		return (async() => {
			this.db = await sqlite.open(dbName)
			// we need this table to store the expenses of all users
			const sql = 'CREATE TABLE IF NOT EXISTS live_bookings(\
				booking_id INTEGER PRIMARY KEY AUTOINCREMENT,\
				driver_id INTEGER,\
				carReg TEXT NOT NULL,\
				start_dateTime SMALLDATETIME NOT NULL,\
				end_dateTime SMALLDATETIME NOT NULL,\
				FOREIGN KEY(driver_id) REFERENCES driver_details(driver_id)\
			  );'

			await this.db.run(sql)
			return this
		})()
	}

	//function to get all the bookings
	async get_bookings() {
		const dbName = "website.db"
		const db = await sqlite.open(dbName)
		const sql = `SELECT * FROM live_bookings ORDER BY end_dateTime ASC; `
	
		const live_bookings = await db.all(sql)

	
		return 	JSON.stringify(live_bookings,null,2)
	
	}



	// function to add the hours with current date time
	 addHours(date, hours) {
		let newDate = new Date(date);
		newDate.setHours(newDate.getHours() + hours);
		return newDate;
	  }

	 // function to get starting and ending time for each booking 
	getAllDateTime(bookingHours){
		console.log("BOOKINGS HOURS")
		console.log(bookingHours)
		let current_dateTime  = new Date()
		

		let ending_dateTime = this.addHours(current_dateTime,parseInt(bookingHours))
	

		return {startingTime: current_dateTime,endingTime: ending_dateTime}

}

    // function to check if a booking already exists using the car registration plate
	async check_carReg(carReg){
		try{
		let sql = `SELECT count(carReg) AS count FROM live_bookings WHERE carReg="${carReg}";`
		const records = await this.db.get(sql)
		if(records.count) return false 
		return true
		}catch(err){
			console.log("error when checking car reg")
			console.log(err)

		}
	}

	// function to  get the email of the user
	async get_email(driverID){
		let sql = `SELECT email FROM driver_details WHERE driver_id = ${driverID}`
		const record = await this.db.all(sql)
		console.log("this is the email of user")
		console.log(record[0].email)
		return record[0].email
	}

	// function to add new booking to the database
	async addBooking(data) {
		try{
			for(const item in data) {
				if(data[item].length === 0) throw new Error('missing fields')
			}
			const flag = await this.check_carReg(data.carReg)
			if(flag== false) throw new Error(`Registation plate : "${data.carReg}" already has an active booking`)

			let alltimes = this.getAllDateTime(data.bookingHours)
			console.log("PUTTING TO THE DATABASE")
			console.log(alltimes)
		
			 // getting the username driver_id so it could be added in the bookings table
		
			 let sql = `SELECT driver_id FROM driver_details WHERE username = "${data.username}"`
			 const res = await this.db.all(sql)
			 console.log("THIS IS THE DRIVER ID")
			 console.log(JSON.stringify(res))
			 


			 sql = `INSERT INTO live_bookings('driver_id', 'carReg', 'start_dateTime','end_dateTime')\ 
                   VALUES("${res[0].driver_id}","${data.carReg}", "${alltimes.startingTime}", "${alltimes.endingTime}")`
			

		
			const user_email = await this.get_email(res[0].driver_id)
			const obj = new Email()
			obj.sendEmail(user_email,alltimes,data)
			await this.db.run(sql)
			console.log("booking at "+ alltimes.startingTime.getHours() + " was made by username " + data.username)
			

		} catch(err) {
			throw err
		}
		return true

	}

	
	async close() {
		await this.db.close()
	}



}

export default Bookings
