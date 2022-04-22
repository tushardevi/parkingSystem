
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
}

export default Email
