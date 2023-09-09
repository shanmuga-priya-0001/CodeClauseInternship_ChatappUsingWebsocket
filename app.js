const { Socket } = require('dgram')
const express = require('express')
const { Server } = require('http')
const path = require('path')
const app = express()
const PORT = process.env.PORT || 4000
const server = app.listen(PORT, () => console.log(`server on port ${PORT}` ))

const io = require('socket.io')(server); // Assuming you have an HTTP server instance

io.on('connection', onConnected);

let socketsConnected = new Set();

function onConnected(socket)
{
    const socketId = socket.id;
    console.log(`Client connected with socket ID: ${socketId}`);
    socketsConnected.add(socketId);


io.emit('clients-total', socketsConnected.size);

socket.on('disconnect', () => {
    
    const socketId = socket.id;
    console.log(socketId);
    socketsConnected.delete(socketId);
    io.emit('clients-total', socketsConnected.size);

})

socket.on('message', (data) =>
{
    console.log(data);
    socket.broadcast.emit('chat-message', data);
})

socket.on('feedback', (data) => {
    socket.broadcast.emit('feedback', data);
})

}
app.use(express.static(path.join(__dirname, 'public')))
 
