
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



	constructor(dbName = ':memory:') {
		return (async() => {
			this.db = await sqlite.open(dbName)

			const sql = 'CREATE TABLE IF NOT EXISTS DriverDetails\
				(username TEXT,\
        DriverFirstName TEXT,\
        DriverLastName TEXT,\
        email TEXT,\
        phoneNum INTEGER,\
        password TEXT,\
        admin INTEGER,\
				PRIMARY KEY (username)\
        );'


			await this.db.run(sql)
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

			// checks if username exists in DB
			let sql = `SELECT COUNT(username) as records FROM DriverDetails WHERE username="${data.username}";`
			const username = await this.db.get(sql)
			if(username.records !== 0) throw new Error(`username "${data.username}" already in use`)

			// checks if e-mail exists in DB
			sql = `SELECT COUNT(username) as records FROM DriverDetails WHERE email="${data.email}";`
			const emails = await this.db.get(sql)
			if(emails.records !== 0) throw new Error(`email address "${data.email}" is in use`)

			//encrypt the password
	    data.password = await bcrypt.hash(data.password, saltRounds)

			//save all details into users table
			
			console.log("ADDING NOW TO SQL :")
			sql = `INSERT INTO DriverDetails(username,DriverFirstName,  DriverLastName ,email,phoneNum,password,admin)
    VALUES("${data.username}","${data.DriverFirstName}","${data.DriverLastName}","${data.email }",
          "${data.phoneNum}","${data.password}", 0)`


			await this.db.run(sql)
			console.log("DHAN DONE DONE :")

			return true

		}catch(err) {
			// 			console.log(err.message)
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
		let sql = `SELECT count(username) AS count FROM DriverDetails WHERE username="${username}";`
		const records = await this.db.get(sql)
		if(!records.count) throw new Error(`username "${username}" not found`)

		sql = `SELECT username,password,admin FROM DriverDetails WHERE username = "${username}";`
		const record = await this.db.get(sql)
		const valid = await bcrypt.compare(password, record.password)
		if(valid === false) throw new Error(`invalid password for account "${username}"`)


		if(record.admin === -1) {
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
