f (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                     console.log("getUserMedia() not supported.");
                }
                var btn = document.querySelector("button");
               
                btn.onclick=function(e) {
                        let constraints = { video: { facingMode: "environment" } };
                        navigator.mediaDevices.getUserMedia(constraints)
                         .then(function(stream) {
                             var video = document.querySelector("video");
                             if ("srcObject" in video) {\
                                 video.srcObject = stream;\
                             } else {\
                                 video.src = window.URL.createObjectURL(stream);\
                             }\
                             video.onloadedmetadata = function(e) {\
                                 video.play();\
                             };\

															const getFrame = () => {
																	const canvas = document.createElement("canvas");\
																	canvas.width = video.videoWidth;\
																	canvas.height = video.videoHeight;\
																	canvas.getContext("2d").drawImage(video, 0, 0);\
																	const data = canvas.toDataURL("image/png");\
																	return data;\
															}
											
															const WS_URL = "wss://buffalowatch-laddernorway-3001.codio-box.uk/";\
															const FPS = 3;\
															const ws = new WebSocket(WS_URL);\
															ws.onopen = () => {\
																	console.log(`Connected to ${WS_URL}`);\
																	setInterval(() => {\
																			ws.send(getFrame());\
																	}, 1000 / FPS);\
															}\

                        })\
                          .catch(function(err) {\
                               console.log(err.name + ": " + err.message);\
                           });\
                };\