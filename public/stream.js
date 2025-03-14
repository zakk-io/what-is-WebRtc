

const socket = io("https://what-is-webrtc.onrender.com")

const stream_id = document.getElementById("stream_id").value

const Is_streamer = new URLSearchParams(window.location.search).get("streamer")


const configuration = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' }
    ]
  };
let RTCPeersConnections = {}


let stream_object;
let stream_video = document.getElementById("stream-video")

if(Is_streamer === "true"){
    navigator.mediaDevices.getUserMedia({video:true,audio:true})
    .then((stream) => {
        stream_object = stream
        stream_video.srcObject = stream
        //socket.emit("create-stream",stream_id)
    })
}



socket.emit("join-stream",stream_id)


if(Is_streamer === "true"){
    socket.on("new-socket",socket_id => {
        CreatePeer(socket_id,true)
    })
}


socket.on("viewers-count",viwersCount => {
    document.getElementById("viewer-count").textContent = viwersCount
})

socket.on("recive-offer",data => {
    const pc = new RTCPeerConnection(configuration)
    pc.ontrack = event => {
        stream_video.srcObject = event.streams[0]
    }

    RTCPeersConnections[data.from] = pc
    pc.setRemoteDescription(data.offer)
    pc.createAnswer()
    .then((answer) => {
        pc.setLocalDescription(answer)
        socket.emit("answer",{"to" : data.from , "answer":answer})

        pc.onicecandidate = event => {
            console.log("candidate from viwer:",event.candidate);
            if(event.candidate){
              socket.emit("icecandidate",{"to":data.from,"candidate":event.candidate})
            }
        }
    })
})


socket.on("recive-answer",async data => {
    const pc = RTCPeersConnections[data.from] //socket_id in CreatePeer()
    await pc.setRemoteDescription(data.answer)
})


socket.on("recive-icecandidate",async data => {
    const pc = RTCPeersConnections[data.from]
    await pc.addIceCandidate(data.candidate)
})






const CreatePeer = (socket_id,offerer) => {
    const pc = new RTCPeerConnection(configuration)
    RTCPeersConnections[socket_id] = pc

    stream_object.getTracks().forEach(track => {
        pc.addTrack(track,stream_object)
    });

    if(offerer){
        pc.createOffer()
        .then((offer) => {
            pc.setLocalDescription(offer)
            socket.emit("offer",{"to" : socket_id , "offer":offer})
        })
    }

    pc.onicecandidate = event => {
        console.log("candidate from streamer:",event.candidate);
        if(event.candidate){
          socket.emit("icecandidate",{"to":socket_id,"candidate":event.candidate})
        }
    }

}



//chating
const chatForm = document.getElementById("chat-form")
const chatInput = document.getElementById("chat-input")
const chatBox = document.getElementById("chat-box")


chatForm.addEventListener("submit", (e) => {
    e.preventDefault()
    socket.emit("chat-message",{"to" : stream_id , "message" : chatInput.value})
    chatInput.value = ""
})


socket.on("brodcast-message", data => {
    const avatarUrl = `https://robohash.org/${encodeURIComponent(data.from)}?set=set1&size=80x80`;

    
    const m = `<div class="flex items-start space-x-2">
                 <img src="${avatarUrl}" alt="User Avatar" class="w-10 h-10 rounded-full">
                 <div class="bg-gray-700 p-2 rounded-md">
                   <p class="text-sm">${data.message}</p>
                 </div>
               </div>`;

    chatBox.innerHTML += m
});




