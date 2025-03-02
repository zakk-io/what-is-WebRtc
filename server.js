// server.js (Node.js with Express and Socket.io)
const express = require('express');
const app = express()
const http = require('http');
const path = require("path");

const {Server} = require("socket.io")
const server = http.createServer(app)

const io = new Server(server,{
    cors: {
        origin: "https://what-is-webrtc.onrender.com", // or "*" to allow all origins
        methods: ["GET", "POST", "OPTIONS", "PUT", "DELETE", "PATCH"]
      }
})


io.on("connection", async (socket) =>{

    socket.on("icecandidate",(icecandidate) => {
        socket.broadcast.emit("broadcast_icecandidate",icecandidate)
    })

    socket.on("offer",(offer) => {
        socket.broadcast.emit("broadcast_offer",offer)
    })


    socket.on("answer",(answer) => {
        socket.broadcast.emit("broadcast_answer",answer)
    })

    console.log("socket.io is fired");
})


app.use(express.static(path.join(__dirname,"public")))

app.get("/",(res,req) => {
    res.sendFile(path.join(__dirname,"public","index.html"))
})


server.listen(2000, () => console.log('Server running on port 3000'));
