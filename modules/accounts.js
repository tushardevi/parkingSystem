
/**@module Acounts */

import bcrypt from 'bcrypt-promise'
import sqlite from 'sqlite-async'
import fs from 'fs-extra'
import mime from 'mime-types'
const saltRounds = 10

/*
 * Summary:
 * Accounts
 * ES6 module
 *
 * This class is used to add new members, check for exisiting
 * members and to retieve member details when necessary.
 */

class Accounts {
	/**
   * Create an account object
   * @param {String} [dbName=":memory:"] - The name of the database file to use.
   */



	constructor(dbName = '../website.db') {
		return (async() => {
			this.db = await sqlite.open(dbName)

			const sql = 'CREATE TABLE IF NOT EXISTS driver_details(\
				driver_id INTEGER PRIMARY KEY AUTOINCREMENT,\
				firstname TEXT NOT NULL,\
				lastname TEXT NOT NULL,\
				email TEXT NOT NULL,\
				telephone INT,\
				username VARCHAR(20) NOT NULL,\
				FOREIGN KEY(username) REFERENCES accounts(username)\
			  );'

			  const sql2 = 'CREATE TABLE IF NOT EXISTS accounts(\
				username VARCHAR(20) PRIMARY KEY,\
				password_ VARCHAR(30) NOT NULL,\
				admin_ INT NOT NULL\
			  );'

			await this.db.run(sql)
			await this.db.run(sql2)
			return this
		})()
	}


	/**
	 * Summary:
	 * This function registers members.
	 * also, it sets a placeholder img if
	 * img is not present and changes dateTime
	 * format to DD/MM/YYYY.
	 *
	 * Parameters:
	 * @param {Struct] a dictionary with the user's
	 * details.
	 * Parameters:
	 *
	 * @param {String} firstName First name
	 * @param {String} lastName  Last name
	 * @param {String} username  Username
	 * @param {String} email     E-mail Address
	 * @param {String} password  Password
	 * @param {String} filename  Profile picture name
	 *
	 * @returns {Boolean} true if the member is
	 * successfully registered.
	 */


	async register(data) {
		try{

			for(const item in data) {
				if(data[item].length === 0) throw new Error('missing fields')
			}

			// let filename
			// //if member provides a picture, then store it using a unique name
			// if(data.fileName) {
			// 	filename = `${Date.now()}.${mime.extension(data.fileType)}`
			// 	await fs.copy(data.filePath, `public/users/${filename}`)
			// } else{
			// 	filename = 'null'
			// }

			// checks if username already exists in DB
			let sql = `SELECT COUNT(username) as records FROM accounts WHERE username="${data.username}";`
			const username = await this.db.get(sql)
			if(username.records !== 0) throw new Error(`username "${data.username}" already in use`)

			// checks if e-mail already exists in DB
			sql = `SELECT COUNT(email) as records FROM driver_details WHERE email="${data.email}";`
			const emails = await this.db.get(sql)
			if(emails.records !== 0) throw new Error(`email address "${data.email}" is in use`)

			// checks if phone number already exists in DB
			sql = `SELECT COUNT(telephone) as records FROM driver_details WHERE telephone="${data.phoneNum}";`
			const num = await this.db.get(sql)
			if(num.records !== 0) throw new Error(`Phone number "${data.phoneNum}" is in use`)


			//encrypt the password
	    	data.password = await bcrypt.hash(data.password, saltRounds)
			console.log("ENCRYPTED PASSWORD")
			console.log(data.password)

		
			//save username and password to accounts table
			sql = `INSERT INTO accounts(username,password_,admin_)
    				VALUES("${data.username}","${data.password}",0)`
			
			//save all other details to driver_details table
			await this.db.run(sql)


			sql = `INSERT INTO driver_details(firstname,lastname ,email,telephone,username)
    					VALUES("${data.DriverFirstName}","${data.DriverLastName}","${data.email }",
          					"${data.phoneNum}","${data.username}")`


			await this.db.run(sql)
			console.log(`New account has been created for person with username:  ${data.username}`)

			return true

		}catch(err) {
			console.log("**Error when registering user in accounts.register class**")
			console.log(err.message)
			throw err
		}


	}


	/**
	 * Summary:
	 * This function logins  members,
	 * it also checks for managers accounts.
	 *
	 * Parameters:
	 * @param {String} password Password
	 * @param {String} username Username
	 * @returns {Struct} returns a dictionary with
	 * different values, depending on who logged in;
	 * member or manager.
	 */
	async login(username, password) {

		//get
		let sql = `SELECT count(username) AS count FROM accounts WHERE username="${username}";`
		const records = await this.db.get(sql)
		if(!records.count) throw new Error(`username "${username}" not found`)

		sql = `SELECT username,password_,admin_ FROM accounts WHERE username = "${username}";`
		const record = await this.db.get(sql)
		const valid = await bcrypt.compare(password, record.password_)
		if(valid === false) throw new Error(`invalid password for account "${username}"`)


		if(record.admin_ === 1) {
			//manager
			return {username: record.username, isAdmin: -1}
		} else{
			//member
			return {username: record.username, isAdmin: 0}
		}


	}

	/**
	 * Summary:
	 * Function which retrieves all users' details,
   * this function also sets a placeholder image if
   * an img url is not present,
	 *
	 * Parameters:
	 * None.
	 *
	 * @returns {Struct} an array of dictionaries
	 * with all the users' details.
	 */

	async allUsers() {

		try{
			const sql = 'SELECT * FROM DriverDetails WHERE admin = 0'
			const users = await this.db.all(sql)

			for(const index in users) {
				if(users[index].filename === 'null') users[index].filename = 'placeholder.jpg'

			}

			return users

		}catch(err) {
			// 			console.log(err.message)
			throw err
		}

	}


	/**
	 * Summary:
	 * Function to retrieve just one user details
   * this function also sets a placeholder image if
   * an img url is not present,
	 *
	 * Parameters:
	 * @params {Interger} userid User ID
	 *
	 * @returns {Struct} a dictionary
	 * with user's details.
	 */

	async getUser(userid) {

		try{
			const sql = `SELECT * FROM DriverDetails WHERE id = ${userid};`

			const users = await this.db.get(sql)

			for(const index in users) {
				if(users[index].filename === 'null') users[index].filename = 'calculator.jpg'
			}
			return users

		}catch(err) {
			// 			console.log(err.message)
			throw err
		}


	}


	async close() {
		await this.db.close()
	}
}

export default Accounts
