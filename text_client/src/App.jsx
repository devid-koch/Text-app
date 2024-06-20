import React, { useEffect, useState } from 'react';
import socketIOClient from 'socket.io-client';
import { TailSpin } from 'react-loader-spinner'; // Import the loading spinner component

const ENDPOINT = "http://localhost:4000";

function App() {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const socket = socketIOClient(ENDPOINT, {
            transports: ['websocket', 'polling'] // Ensure socket.io uses websocket and polling transports
        });

        socket.on("message", (data) => {
            setMessages(data.text ? data.text : "Want to regenerate again please reload");
            setLoading(true);
            setTimeout(() => {
                setLoading(false);
            }, 1000); // Show loading spinner for 1 second
        });

        socket.on('connect_error', (err) => {
            console.error('Connection error:', err);
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    return (
        <div className="App">
            <h1>Transcript</h1>
            <div>
              <pre style={{ whiteSpace: 'pre-wrap',color:"white" }}>{messages}</pre>
            </div>
        </div>
    );
}

export default App;
