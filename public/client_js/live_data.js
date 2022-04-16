var ws;

const WS_URL = "ws:localhost:3002";
if ('WebSocket' in window) {
    connect(WS_URL);
} else {
    console.log('web sockets not suported');
}

function connect(host) {
    ws = new WebSocket(host);
    
    ws.onopen = function () {
        console.log('connected to real data websocket');
         setInterval(() =>{
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
                   console.log(item.username)
                   console.log(item.start_dateTime)
                   console.log(item.end_dateTime)
                   console.log("********************")
                

                   //driver name
                   let name  = document.createElement("td")
                   name.innerText  = item.username

                   //car registation plate
                   let carReg = document.createElement("td")
                   carReg.innerText = item.carReg

                   // start date time
                   let s_date = document.createElement("td")
                   s_date.innerText = item.start_dateTime

                // end date time
                   let e_date = document.createElement("td")
                   e_date.innerText = item.start_dateTime



                   let tr  = document.createElement('tr')

                   

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
    
    

