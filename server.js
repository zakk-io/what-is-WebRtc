// server.js (Node.js with Express and Socket.io)
const express = require('express');
const app = express()
const http = require('http');
const path = require("path");
const {v4 : uuid4} = require("uuid")
const {Server} = require("socket.io")
const server = http.createServer(app)

const io = new Server(server)


io.on("connection", async (socket) =>{
    socket.on("join-call",call_id => {
        socket.join(call_id)
        socket.to(call_id).emit("new-socket",socket.id)
    })

    socket.on("offer",data => {
        socket.to(data.to).emit("recive-offer",{"from":socket.id,"offer":data.offer})
    })

    socket.on("answer",data => {
        socket.to(data.to).emit("recive-answer",{"from":socket.id,"answer":data.answer})
    })

    socket.on("icecandidate",data => {
        socket.to(data.to).emit("recive-icecandidate",{"from":socket.id,"candidate":data.candidate})
    })
})


app.use(express.static(path.join(__dirname,"public")))
app.set("view engine","ejs")
app.set("views",path.join(__dirname,"views"))



app.get("/",(req,res) => {
    res.redirect(`/call/${uuid4()}`)
})


app.get("/call/:call_id",(req,res) => {
    data = {
        call_id : req.params.call_id
    }
    res.render("call",data)
})





server.listen(2000, () => console.log('Server running on port 2000'));
