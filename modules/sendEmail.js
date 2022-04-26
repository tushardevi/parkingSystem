
/** @module sendEmail */
import nodemailer from 'nodemailer'


/**
   * Summary:
   * This class is used to send emails
   * to members
   * once they book a parking
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
   * @param {Object}times the ending and starting times of the booking
   * @param {Object}booking the booking details
   * 
	 * @returns {Object} returns true 
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
		const html = `<body>
		<h1> Your booking has been confirmed.</h1>
        <section>
            <h2>Starting Time:</h2>
             
<p style = "font-size: 22px;">${times.startingTime}</p>
 
        </section>

        <section>
            <h2>Ending Time:</h2>
             
<p style = "font-size: 22px;">${times.endingTime}</p>
 
        </section>
        <section>
            <h2>Registration Plate:</h2>
        
<p style = "font-size: 22px;">${booking.carReg}</p>
        </section>
    </body>`
	
		const mailOtions = {
			from: 'javascript3211@gmail.com',
			to: receiver,
			subject: 'Parking Booked ',
			html: html
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

	// a function to send an alert notification to the user when their boking is about to expire
	//same functionality as the sendEmail
	async send_alert_email(receiver,booking) {

		// build a transporter using the gmail smtp
		const transporter = nodemailer.createTransport({
			service: 'gmail',
			auth: {
				user: 'javascript3211@gmail.com',
				pass: 'Javascript'
			}

		})
		const html = `<body>
		<h1 style = "color: red;"> This is a remainder of your booking which is about to expire.</h1>
		<p> The following is some details related to your booking</p>
        <section>
            <h2>Starting Time:</h2>
             
<p style = "font-size: 22px;">${booking.start_dateTime}</p>
 
        </section>

        <section>
            <h2>Ending Time:</h2>
             
<p style = "font-size: 22px;">${booking.end_dateTime}</p>
 
        </section>
        <section>
            <h2>Registration Plate:</h2>
        
<p style = "font-size: 22px;">${booking.carReg}</p>
        </section>
    </body>`
	
		const mailOtions = {
			from: 'javascript3211@gmail.com',
			to: receiver,
			subject: 'Booking about to expire...',
			html: html
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
