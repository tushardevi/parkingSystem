
/** @module sendEmail */
import nodemailer from 'nodemailer'


/**
   * Summary:
   * This class is used to send emails
   * to members
   * once an expense gets approved
   * ES6 module
   */

class Email {

	/**
	 * Summary:
	 * This function creates a route
	 * and sends an email using the
	 * gmail sever, using an account
	 * that I created.
	 *
	 *
	 * @param {String} receiver The email address of the person receiving the email
   * @param {Integer} ExpenseID Expense ID needed so it can be used in the body of the email
	 * @returns {Boolean} returns true
	 * when an email is sucessfully sent.
	 */
	async sendEmail(receiver,times,booking) {

		const transporter = nodemailer.createTransport({
			service: 'gmail',
			auth: {
				user: 'javascript3211@gmail.com',
				pass: 'Javascript'
			}

		})
		
		const msg = `
		Your booking has been confirmed! \n  details of your booking: \n starting time : ${times.startingTime} \n
		ending time : ${times.endingTime} \n Registration plate : ${booking.carReg}`
	
		const mailOtions = {
			from: 'javascript3211@gmail.com',
			to: 'javascript3211@gmail.com',
			subject: 'Parking Booked ',
			text: msg
		}

		transporter.sendMail(mailOtions, async(err,data) => {
			if(err) {
				console.log('Error email not sent : ',err)
			}else{
				console.log(`Email Succesfully sent to ${receiver}`)
				true
			}
		})
	}
}

export default Email
