import bodyParser from "body-parser";
import express from "express";
import pg from "pg";
import http from "http";
import WebSocket from "ws";

// Connect to the database using the DATABASE_URL environment
//   variable injected by Railway
const pool = new pg.Pool();

const app = express();
const port = process.env.PORT || 8080;
const wsPort = process.env.PORT || 3333;

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const clients = new Set();

app.use(bodyParser.json());
app.use(bodyParser.raw({ type: "application/vnd.custom-type" }));
app.use(bodyParser.text({ type: "text/html" }));

app.get("/", async (req, res) => {
  const { rows } = await pool.query("SELECT NOW()");
  res.send(`Hello, World! The time from the DB is ${rows[0].now}`);
});

const broadcastMessage = (message: string) => {
  clients.forEach((client: any) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
};

wss.on("connection", (ws: any) => {
  clients.add(ws);

  ws.on("message", (message: string) => {
    broadcastMessage(message);
  });

  ws.on("close", () => {
    clients.delete(ws);
  });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

server.listen(wsPort, () => {
  console.log(`WebSocket server listening on port ${wsPort}`);
});
