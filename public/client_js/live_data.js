var ws;

const WS_URL = "ws:localhost:3002";
if ('WebSocket' in window) {
    connect(WS_URL);
} else {
    console.log('web sockets not suported');
}

function updateClock() {
    var time = document.querySelector('.time');
            
    var dateTime = document.querySelector('.date-time');
    // Get the current time, day , month and year
    var now = new Date();
    var hours = now.getHours();
    var minutes = now.getMinutes();
    var seconds = now.getSeconds();
    var day = now.getDay();
    var date = now.getDate();
    var month = now.getMonth();
    var year = now.getFullYear();

    // store day and month name in an array
    var dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    var monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    // format date and time
   // hours = hours % 12 || 12;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    seconds = seconds < 10 ? '0' + seconds : seconds;
    date = date < 10 ? '0' + date : date;

    // display date and time
   // var period = hours < 12 ? 'AM' : 'PM';
    time.innerHTML = hours + ':' + minutes + ':' + seconds + ' '
    dateTime.innerHTML = dayNames[day] + ', ' + monthNames[month] + ' ' + date + ', ' + year;
  }


function connect(host) {
    ws = new WebSocket(host);
    
    ws.onopen = function () {
        console.log('connected to real data websocket');
        

         setInterval(() =>{
                updateClock()
                ws.send("get")

            },2000)

    }
    
    
    ws.onmessage = function (evt) {
            // let table = document.getElementById("bookingTable")
            // table.oldHTML = table.innerHTML
            
            //const a = document.getElementById("header")
            //a.innerText = "TUSHAR"
            
            let data = evt.data
           // const arr = evt.data
            
            try{
                const bookings = JSON.parse(data)
                //console.log(bookings[0])
              //  const all = document.querySelectorAll('td')
               
              
               console.clear()
 
           
                let table = document.getElementById("bookingTable")
            //   table.style.margin.left("200px")
               
            //    var child = template.lastElementChild; 
            //     while (child) {
            //         template.removeChild(child);
            //         child = template.lastElementChild;
            //     }

               let div = document.getElementById("records")

           
                div.innerHTML = ""
              
               for(const item of bookings){
                
                  // let node = body.cloneNode(true)
                   //NEW object (booking)
                   console.log(item.carReg)
                   console.log(item.driver_id)
                   console.log(item.start_dateTime)
                   console.log(item.end_dateTime)
                   console.log("********************")
                

                   //driver name
                   let name  = document.createElement("td")
                   name.innerText  = item.driver_id

                   //car registation plate
                   let carReg = document.createElement("td")
                   carReg.innerText = item.carReg

                   // start date time
                   let s_date = document.createElement("td")
                   let date1 = (item.start_dateTime).toString()
                  
                   const arr = date1.split("GM")
                  // console.log(arr)
                   s_date.innerText = arr[0]

                // end date time
                   let e_date = document.createElement("td")
                   let date2 = (item.end_dateTime).toString()
                  
                   const arr2 = date2.split("GM")
                   //console.log(arr2)
                   e_date.innerText = arr2[0]



                   let tr  = document.createElement('tr')
                    tr.classList.add("even")
                   

                    tr.appendChild(name)
                    tr.appendChild(carReg)
                    tr.appendChild(s_date)
                    tr.appendChild(e_date)
                  

                   div.appendChild(tr)

                   table.appendChild(div)
                   
                   

               }
    
                
            }catch(err){
                console.log("cannot get live bookings")
                console.log(err.message)
            }

         
            
            
    
        }

    
    ws.onclose = function () {
        console.log('connection to the socket has been closed');
    }
    
    ws.onerror = function(evt) {
        console.log("ERROR IN LIVE DATA MANAGER")
        console.log(evt.data)
        console.log('<span style="color: red;">ERROR:</span> ' + evt.data);
    }
}
    
    

