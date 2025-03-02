// main.js

// Global variables
let localStream;
let peerConnection;
let socket;

// STUN servers to help with NAT traversal
const configuration = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' }
  ]
};

// DOM elements
const localVideo = document.getElementById('video-player-1');
const remoteVideo = document.getElementById('video-player-2');

// Initialize the application
async function init() {
  socket = io();
  
  try {
    // Get local media stream
    localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    localVideo.srcObject = localStream;

    peerConnection = new RTCPeerConnection(configuration);
  
    // ICE candidate event
    peerConnection.onicecandidate = event => {
      if (event.candidate) {
        socket.emit('icecandidate', event.candidate);
      }
    };

        // Add local stream to peer connection
    localStream.getTracks().forEach(track => {
      peerConnection.addTrack(track, localStream);
    });

    createOffer();
    
    // Track event to receive remote streams
    peerConnection.ontrack = event => {
      remoteVideo.srcObject = event.streams[0];
    };
    
    // Setup Socket.IO event listeners
    setupSignalingChannelListeners();
    
    
    
  } catch (error) {
    console.error('Error initializing WebRTC:', error);
  }
}


// Setup Socket.IO event listeners for signaling
function setupSignalingChannelListeners() {
  // Receiving ICE candidates from the other peer
  socket.on('broadcast_icecandidate', async (iceCandidate) => {
    try {
      await peerConnection.addIceCandidate(new RTCIceCandidate(iceCandidate));
    } catch (error) {
      console.error('Error adding ICE candidate:', error);
    }
  });
  
  // Receiving offers from the other peer
  socket.on('broadcast_offer', async (offer) => {
    try {
      await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
      
      // Create answer
      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);
      
      // Send answer to signaling server
      socket.emit('answer', answer);
    } catch (error) {
      console.error('Error handling offer:', error);
    }
  });
  
  // Receiving answers from the other peer
  socket.on('broadcast_answer', async (answer) => {
    try {
      await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
    } catch (error) {
      console.error('Error handling answer:', error);
    }
  });
}

// Create and send offer
async function createOffer() {
  try {
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
    
    // Send offer to signaling server
    socket.emit('offer', offer);
  } catch (error) {
    console.error('Error creating offer:', error);
  }
}

// Start the application when the DOM is loaded
init()