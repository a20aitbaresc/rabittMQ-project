const WebSocket = require('ws');
const amqp = require('amqplib');
const express = require('express');
const http = require('http');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
const PORT = 3000;
const EXCHANGE_PREFIX = 'chat_exchange_';

async function connectRabbitMQ() {
  const conn = await amqp.connect('amqp://localhost');
  const channel = await conn.createChannel();
  return channel;
}

let clientChannels = {};

connectRabbitMQ().then((channel) => {
  wss.on('connection', (ws) => {
    let clientChannel;
    ws.on('message', async (data) => {
      const { channelName, message } = JSON.parse(data);
      if (!clientChannel) {
        // Create a new channel for the client if it doesn't exist
        clientChannel = await channel;
        clientChannels[ws] = clientChannel;
      }
      const exchangeName = EXCHANGE_PREFIX + channelName;
      try {
        await clientChannel.assertExchange(exchangeName, 'fanout', { durable: false });
        await clientChannel.publish(exchangeName, '', Buffer.from(message));
      } catch (error) {
        console.error('Error publishing message:', error.message);
      }
    });

    ws.on('close', () => {
      // Clean up when client disconnects
      if (clientChannels[ws]) {
        clientChannels[ws].close();
        delete clientChannels[ws];
      }
    });
  });
});

server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
app.use(express.static('.'));
