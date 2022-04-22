
/** @module Bookings */


import sqlite from 'sqlite-async'
import fs from 'fs-extra'
import mime from 'mime-types'
import { get } from 'http'
import Email from '../modules/sendEmail.js'


/**
   * Summary:
   * This class is used to add new bookings,
   * retrieve bookings' details ,
   * ES6 module
   */
class Expenses {

	/**
   * Create an expense object
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


	/**
	 * Summary:
	 * Function which gets all the data and saves it
	 * into the expenses table,
	 * also checks if all fields are filled.
	 *
	 * Dictionary is passed with the following data types:
	 * @param {String} date Date
	 * @param {String} category Category
	 * @param {String} label Label
	 * @param {String} description Description
	 * @param {Integer} amount Amount spent
	 * @param {Integer} userid User ID
	 * @param {String} filename. Scanned receipt (if present)
	 *
	 * @returns {Boolean} returns true if
	 * the new expense is sucessfully added.
	 */
	 addHours(date, hours) {
		let newDate = new Date(date);
		newDate.setHours(newDate.getHours() + hours);
		return newDate;
	  }
	getAllDateTime(bookingHours){
		console.log("BOOKINGS HOURS")
		console.log(bookingHours)
		 let current_dateTime  = new Date()
		// let hours = current_dateTime.getHours()
		// let mins = current_dateTime.getMinutes()
		// let secs = current_dateTime.getSeconds()

		// let day = current_dateTime.getDate()
		// let month = current_dateTime.getMonth() +1
		// let year = current_dateTime.getFullYear() 

		let ending_dateTime = this.addHours(current_dateTime,parseInt(bookingHours))
		
		// let date = year+'-'+month+'-'+day
		// let time = hours+':'+mins+':'+secs

		// let starting_dateTime = date+" "+time
		// console.log("STARTING DATE-TIME")
		// console.log(starting_dateTime)


		return {startingTime: current_dateTime,endingTime: ending_dateTime}

}

//   appendDate(starting_date){


// 	    let current_date_time = this.getDateTime

// 		const d  = new Date()
// 		let day = d.getDate()
// 		let month = d.getMonth()+1
// 		let year = d.getFullYear() 

// 		let date = day + "/" + month + "/" + year 

// 		let endTime = data+"#"+date

// 		return endTime
// }


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
	async get_email(driverID){
		let sql = `SELECT email FROM driver_details WHERE driver_id = ${driverID}`
		const record = await this.db.all(sql)
		console.log("this is the email of user")
		console.log(record[0].email)
		return record[0].email
	}
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
			//console.log("booking expires on "+ alltimes.endingTime)

		} catch(err) {
			throw err
		}
		return true

	}


	/**
	 * Summary:
	 * Function to retrieve data from the expenses' table
   * This function also sets a placeholder image if
   * an img url is not present,
   * and changes dateTime's format to DD/MM/YYYY.
	 *
	 * Parameters:
	 * @param {Integer} userid User ID
	 *
	 * @returns {Struct} an array of dictionaries
	 * with all the expense details.
	 */

	async all(userid) {

		try{

			const sql = `SELECT expense_id,expense_date, category, label, descrip, amount,filename,userid FROM expenses\
                  WHERE userid = "${userid}" AND status = 0 ORDER BY expense_date DESC;`

			const expenses = await this.db.all(sql)
			for(const index in expenses) {
				if(expenses[index].filename === 'null') expenses[index].filename = 'place.jpg'
				const dateTime = new Date(expenses[index].expense_date)
				const date = `${dateTime.getDate()}/${dateTime.getMonth()+1}/${dateTime.getFullYear()}`
				expenses[index].expense_date = date
			}

			return expenses

		} catch(err) {
			// 			console.log(err.message)
			throw err
		}

	}
	async close() {
		await this.db.close()
	}


	/**
	 * Summary:
	 * Function to retrieve a single expense
	 * from the expenses' table
   * This function also sets a placeholder image if
   * an img url is not present,
   * and chancges datatime format to DD/MM/YYYY.
	 *
	 * Parameters:
	 * @param {Integer} ExpenseID Expense ID
	 *
	 * @returns {Struct} a dictionary
	 * with all the expense details.
	 */

	async getExpense(expenseID) {


		const sql = `SELECT expense_id,expense_date, category, label, descrip, amount,filename,userid FROM expenses\
                  WHERE expense_id = ${expenseID} AND status = 0 ORDER BY expense_date DESC;`


		const expense = await this.db.get(sql)

		if(expense.filename === 'null') expense.filename = 'place.jpg'
		const dateTime = new Date(expense.expense_date)
		const date = `${dateTime.getDate()}/${dateTime.getMonth()+1}/${dateTime.getFullYear()}`
		expense.expense_date = date


		return expense
	}


	async close() {
		await this.db.close()
	}


	/**
	 * Summary:
	 * Function to check if the user inputs the right date.
   * so that input_date <= current_date.
	 *
	 * Parameters:
	 * @param {String} Date Date of expense
	 *
	 * @returns {Boolean} return true if Date is valid
	 * otherwise throws error.
	 */
	async checkDate(expenses) {

		// get the date given by the user
		const date = new Date(expenses.date)

		// get the current date
		const currentDate = new Date()


		// perform a check
		try{
			if(date > currentDate ) throw new Error('Date must be less or equal to todays date')


		} catch(err) {
			// 			console.log(err.message)
			throw err
		}


		return true
	}


	

}

export default Expenses
