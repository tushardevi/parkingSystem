import * as live_data_wss from './servers/live_data.js'
import * as send_image_wss from './servers/send_image.js'
import * as http_server from './servers/http.js'
import cron from 'node-cron'
import monitorBookings from './modules/monitorBookings.js'

// call the HTTP server
http_server

// call the web socket servers
send_image_wss
live_data_wss


// start schedule function to check for expired bookings
const monitorbookings = new monitorBookings()
//let a = await monitorbookings.monitor()
cron.schedule('*/2 * * * * *', async ()=>{
	monitorbookings.monitor()
})

//start schedule function to send emails to users 15 minutes before their booking expires
cron.schedule('*/2 * * * * *', async ()=>{
	monitorbookings.send_alert_notification()
})
