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
    // Envía el mensaje a todos los clientes conectados
    // Completar la lógica de consumo de mensajes
  });
});

wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    // Publica el mensaje recibido en la cola de RabbitMQ
    // Completar el evento 'message'
  });
});

server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
app.use(express.static('.'));
