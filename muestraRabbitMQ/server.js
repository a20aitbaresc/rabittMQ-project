const WebSocket = require('ws');
const amqp = require('amqplib');
const express = require('express');
const http = require('http');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
const PORT = 3000;
const QUEUE_CHANNEL_1 = 'chat_messages_channel_1';
const QUEUE_CHANNEL_2 = 'chat_messages_channel_2';

async function connectRabbitMQ() {
    const conn = await amqp.connect('amqp://localhost');
    const channel = await conn.createChannel();
    await channel.assertQueue(QUEUE_CHANNEL_1, { durable: false });
    await channel.assertQueue(QUEUE_CHANNEL_2, { durable: false });
    return { conn, channel };
}

let rabbitMQChannel;

connectRabbitMQ().then(({ conn, channel }) => {
    rabbitMQChannel = channel;

    const consumeMessage = (queue, channel) => {
        channel.consume(queue, (msg) => {
            sendMessageToClients(msg, queue);
            channel.ack(msg);
        });
    };

    consumeMessage(QUEUE_CHANNEL_1, channel);
    consumeMessage(QUEUE_CHANNEL_2, channel);
});

function sendMessageToClients(msg, queueName) {
    const messageContent = msg.content.toString();
    console.log('Mensaje recibido de RabbitMQ:', messageContent);
    const targetChannel = queueName === QUEUE_CHANNEL_1 ? 'channel1' : 'channel2';
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN && client.channel === targetChannel) {
            console.log('Enviando mensaje al cliente en el canal', targetChannel, ':', messageContent);
            client.send(JSON.stringify({ text: messageContent }));
        }
    });
}


wss.on('connection', (ws) => {
    ws.on('message', (message) => {
        const { channel, text } = JSON.parse(message);
        ws.channel = channel;
        const queueName = channel === 'channel1' ? QUEUE_CHANNEL_1 : QUEUE_CHANNEL_2;
        console.log('Enviando mensaje a RabbitMQ:', text);
        rabbitMQChannel.sendToQueue(queueName, Buffer.from(text));
    });

    // Log cuando se conecta un cliente
    console.log('Nuevo cliente conectado');

    ws.on('close', () => {
        console.log('Cliente desconectado');
    });
});

server.listen(PORT, () => console.log(`Servidor en ejecución en http://localhost:${PORT}`));
app.use(express.static('.'));
