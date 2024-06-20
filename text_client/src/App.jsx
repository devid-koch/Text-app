import React, { useEffect, useState } from 'react';
import socketIOClient from 'socket.io-client';

const ENDPOINT = "https://assigment-api.onrender.com";

function App() {
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        const socket = socketIOClient(ENDPOINT, {
            transports: ['websocket', 'polling']
        });

        socket.on("message", (data) => {
            setMessages(data.text ? data.text : "Want to regenerate again please reload");
            setTimeout(() => {
                setLoading(false);
            }, 1000);
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
