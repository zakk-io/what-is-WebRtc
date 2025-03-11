# WebRTC + WebSocket Streaming & Meeting App 🚀

Hey there! 👋 This project is all about real-time video calls, live streaming, and chatting using **WebRTC** and **WebSockets**. Whether you’re setting up a meeting or broadcasting a stream, this app’s got you covered!

---
## What’s Cool About It

- **Real-time Video Calls & Streams** 🎥
- **Live Chat** 💬
- **Peer-to-Peer Connections** with WebRTC
- **Instant Signaling** using Socket.IO (WebSockets)


### app deployment , check it
https://what-is-webrtc.onrender.com

### Youtube Demo
[![Youtube Demo](/screenshots/1.png)](https://youtube.com/shorts/3dmkJFWUUgY?feature=share)

### live stream with chatting area
![live stream with chatting aream](/screenshots/2.png)

### video calling 
![video calling ](/screenshots/3.jpeg)



---

## How It Works 🤔

### WebSockets
WebSockets provide a persistent, full-duplex communication channel between a client and a server over a single TCP connection.
Think of it like an open phone line 📞—it lets your app instantly send and receive signals (like call setup info and chat messages).

### WebRTC
WebRTC is a framework designed for direct, peer-to-peer communication between browsers. It enables the transmission of video, audio, and data directly between users without routing the media through intermediary servers

---

## Flow of the Project 🔄

1. **Capture Media:**  
   Your camera and mic are activated with `getUserMedia()` 🎥🎤.

2. **Join the Room:**  
   Connect to our signaling server via WebSockets. This is where the "hello" messages and call invites happen! 🤝

3. **Exchange Signals:**  
   Your browser sends and receives WebRTC offers, answers, and ICE candidates through WebSockets to set up peer connections.

4. **Peer-to-Peer Connection:**  
   Once signals are exchanged, WebRTC establishes direct connections between you and your peers for streaming video and audio.

5. **Live Chat:**  
   Chat in real-time during calls or streams with instant messaging via WebSockets 💬.

6. **Enjoy the Experience:**  
   Kick back and enjoy your smooth, real-time video call or live stream! 🎉

---


## Do you have internship for me?

Why I Built This Project 💡:
I built this project because I'm absolutely passionate about real-time applications and the future of communication. Not only is it a fun playground to experiment with cutting-edge tech like WebRTC and WebSockets, but it’s also a key part of my internship journey 🚀

## Quick Setup

no need to tell you what to do 😂 just **Clone the Repo**

