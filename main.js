let StreamObject;
let PeerConnection;

let servers = {
    iceServers:[
        {
            urls:['stun:stun1.1.google.com:19302', 'stun:stun2.1.google.com:19302']
        }
    ]
}

const init = async () => {
    StreamObject = await navigator.mediaDevices.getUserMedia({video:true,audio:true})
    document.getElementById("user-1").srcObject = StreamObject
}


document.getElementById("create-offer").addEventListener("click", async() => {
    PeerConnection = new RTCPeerConnection(servers)
    StreamObject.getTracks().forEach((track) => PeerConnection.addTrack(track,StreamObject))

    PeerConnection.ontrack = (event) => {
        console.log("event.streams[0]: ",event.streams[0]);
        document.getElementById("user-2").srcObject = event.streams[0]
    }

    PeerConnection.onicecandidate = event => {
        if (event.candidate) {
            console.log("Offer ICE candidate:", event.candidate);
            document.getElementById("offer-sdp").value = JSON.stringify(PeerConnection.localDescription);
        } else {
            console.log("ICE gathering complete");
        }
    };

    await PeerConnection.createOffer().then((offer) => {
       PeerConnection.setLocalDescription(offer) 
       document.getElementById("offer-sdp").value = JSON.stringify(offer) 
    })


})



document.getElementById("create-answer").addEventListener("click", async () => {
    
    PeerConnection = new RTCPeerConnection(servers)
    StreamObject.getTracks().forEach((track) => PeerConnection.addTrack(track,StreamObject))

    PeerConnection.ontrack = (event) => {
        console.log("event.streams[0]: ",event.streams[0]);
        document.getElementById("user-2").srcObject = event.streams[0]
    }

    PeerConnection.onicecandidate = event => {
        if (event.candidate) {
            console.log("Offer ICE candidate:", event.candidate);
            document.getElementById("answer-sdp").value = JSON.stringify(PeerConnection.localDescription);
        } else {
            console.log("ICE gathering complete");
        }
    };


    let offer = JSON.parse(document.getElementById("offer-sdp").value)
    await PeerConnection.setRemoteDescription(new RTCSessionDescription(offer))


    await PeerConnection.createAnswer().then((answer) => {
        PeerConnection.setLocalDescription(answer)
        document.getElementById("answer-sdp").value = JSON.stringify(answer) 
    })
})



document.getElementById("add-answer").addEventListener("click", async () => {
    let answer = JSON.parse(document.getElementById("answer-sdp").value)
    await PeerConnection.setRemoteDescription(new RTCSessionDescription(answer))

})






init()