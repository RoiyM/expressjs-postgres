import WebSocket from "ws";

const PORT = 8080; // Change this to the desired port number

// Create a WebSocket server instance
const wss = new WebSocket.Server({ port: PORT });

// This event will be triggered when a new WebSocket connection is established
wss.on("connection", (ws) => {
  console.log("New client connected");

  // Event listener for messages received from the client
  ws.on("message", (message) => {
    console.log("Received message:", message);

    // Echo the received message back to the client
    ws.send(message);
  });

  // Event listener for the client connection close
  ws.on("close", () => {
    console.log("Client disconnected");
  });
});

console.log(`WebSocket server listening on port ${PORT}`);
