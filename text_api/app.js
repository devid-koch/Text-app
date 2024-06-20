const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "http://localhost:5173", // Allow your frontend origin
        methods: ["GET", "POST"]
    }
});

const port = 4000;

app.use(cors());


// Full text to be sent in parts
const fullText = 
    "Computer science is a multifaceted field that encompasses the study of computation, algorithms, data structures, and the design and implementation of computer systems and applications.";

const parts = [];
let currentPart = "";
const words = fullText.split(" ");

for (let i = 0; i < words.length; i++) {
    if (i === 0) {
        currentPart = words[i];
    } else {
        currentPart += " " + words[i];
    }
    parts.push(currentPart);
}


io.on('connection', (socket) => {
    console.log('a user connected');

    let messageIndex = 0;

    const sendTextPart = () => {
        if (messageIndex < fullText.length) {
            socket.emit('message', { text: parts[messageIndex] });
            messageIndex++;
            setTimeout(sendTextPart, 1000); // Call the function again after 1 second
        }
    };

    sendTextPart();

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
