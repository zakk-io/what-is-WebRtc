

const socket = io();
const peer = new RTCPeerConnection();

navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    .then(stream => {
        document.getElementById('user-1').srcObject = stream;
        stream.getTracks().forEach(track => peer.addTrack(track, stream));
    });

peer.ontrack = event => {
    document.getElementById('user-2').srcObject = event.streams[0];
};

peer.onicecandidate = event => {
    if (event.candidate) socket.emit('candidate', event.candidate);
};

socket.on('offer', async offer => {
    console.log("i recived your offer");
    
    await peer.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await peer.createAnswer();
    await peer.setLocalDescription(answer);
    console.log("i created answer");
    socket.emit('answer', answer);
});

socket.on('answer', async answer => {
    console.log("i recived your answer");
    await peer.setRemoteDescription(new RTCSessionDescription(answer));
});

socket.on('candidate', async candidate => {
    await peer.addIceCandidate(new RTCIceCandidate(candidate));
});

async function createOffer() {
    console.log("i created offer");
    const offer = await peer.createOffer();
    await peer.setLocalDescription(offer);
    socket.emit('offer', offer);
}

setTimeout(createOffer, 1000);
