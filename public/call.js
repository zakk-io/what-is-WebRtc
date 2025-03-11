const configuration = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' }
  ]
};

socket = io("https://what-is-webrtc.onrender.com");
let RTCPeersConnections = {}


// 1 - ask for user media and join the call
let objectStream;
let call_id = document.getElementById("call_id").value
let localVideo = document.getElementById("local-video-player")
navigator.mediaDevices.getUserMedia({video:true,audio:true}).then((stream) => {
  objectStream = stream
  localVideo.srcObject = objectStream
  socket.emit("join-call",call_id)
})




// 2 - notify every others socket about the new socket joing the call
socket.on("new-socket",socket_id => {
// 3 - every socket in the call will create new RTCpeer connection to communicate with the new socket
  CreateRTCpeer(socket_id,true)
})



// 5 - the new socket recive the offer from all the peers and create RTCpeer connection for each of them , (to set setRemoteDescription)
socket.on("recive-offer",async data => {
  CreateRTCpeer(data.from,false)
  const pc = RTCPeersConnections[data.from]
  await pc.setRemoteDescription(data.offer)

  // 6 - send sdp answer to each peer that send the sdp offer
  pc.createAnswer().then((answer) => {
    pc.setLocalDescription(answer)
    socket.emit("answer",{"to":data.from,"answer":answer})
  })
})


socket.on("recive-answer",async data => {
  const pc = RTCPeersConnections[data.from]
  await pc.setRemoteDescription(data.answer)

})


socket.on("recive-icecandidate",async data => {
  const pc = RTCPeersConnections[data.from]
  await pc.addIceCandidate(data.candidate)
})


const CreateRTCpeer = (socket_id,Isofferer) => {
  const pc = new RTCPeerConnection(configuration)
  RTCPeersConnections[socket_id] = pc

  objectStream.getTracks().forEach(track => {
    pc.addTrack(track,objectStream)
  });



  const videos = document.getElementById("videos");

  pc.ontrack = event => {
      if (!document.getElementById(`video-${socket_id}`)) {
          // Create a container for the remote video
          const remoteContainer = document.createElement("div");
          remoteContainer.className = "video-container";
          remoteContainer.id = `container-${socket_id}`;
  
          // Create the remote video element
          const remoteVideo = document.createElement("video");
          remoteVideo.id = `video-${socket_id}`;
          remoteVideo.autoplay = true;
          remoteVideo.className = "video-player";
          remoteVideo.srcObject = event.streams[0];
  
          // Append video to container
          remoteContainer.appendChild(remoteVideo);
  
          // Append container to videos section
          videos.appendChild(remoteContainer);
      }
  };
  


  if(Isofferer){
    pc.createOffer().then((offer) => {
      pc.setLocalDescription(offer)
      // 4 - send the offer to the new socket
      socket.emit("offer",{"to":socket_id,"offer":offer})
    })
  }

  // 7 - exchange icecandidate between the new peer and other peers
  pc.onicecandidate = event => {
    if(event.candidate){
      socket.emit("icecandidate",{"to":socket_id,"candidate":event.candidate})
    }
  }


  console.log(RTCPeersConnections);
}



