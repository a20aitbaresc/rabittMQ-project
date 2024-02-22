const WebSocket = require('ws');
const amqp = require('amqplib');
const express = require('express');
const http = require('http');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
const PORT = 3000;
const QUEUE = 'chat_messages';

async function connectRabbitMQ() {
  const conn = await amqp.connect('amqp://localhost');
  const channel = await conn.createChannel();
  await channel.assertQueue(QUEUE, { durable: false });
  return { conn, channel };
}

let rabbitMQChannel;

connectRabbitMQ().then(({ channel }) => {
  rabbitMQChannel = channel;

  channel.consume(QUEUE, (msg) => {
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(msg.content.toString());
      }
    });
    channel.ack(msg);
  });
});

wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    rabbitMQChannel.sendToQueue(QUEUE, Buffer.from(message));
  });
});

server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
app.use(express.static('.'));
