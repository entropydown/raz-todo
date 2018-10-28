import app from './server';
import http from 'http';
import socket_io from 'socket.io';

function bail(err) {
  console.error(err);
  process.exit(1);
}

var queueName = 'todos';

var channel = '';

function publisher(conn) {
  conn.createChannel(on_open);

  function on_open(err, ch) {
    if (err != null) bail(err);
    channel = ch;
    ch.assertQueue(queueName);
  }

}

function publish(message) {
    channel.sendToQueue(
        queueName,
        Buffer.from(message)
    );
}

var url = process.env.CLOUDAMQP_URL || 'amqp://localhost';

require('amqplib/callback_api').connect(
    url,
    function(err, connection) {
        if (err != null) bail(err);
        publisher(connection);
    });

var io = socket_io();

const server = http.createServer(app);

io.attach(server);

io.on('connection', function(socket) {
    console.log("Socket connected: " + socket.id);
    socket.on('action', (action) => {
        if(action.type == 'add') {
            console.log("Got todo add", action.data);
            publish(action.data);
        }
    });
});

let currentApp = app;
const getEnv = c => process.env[c];

server.listen(getEnv('PORT') || 3000, error => {
  if (error) {
    console.log(error);
  }

  console.log('🚀 started');
});

if (module.hot) {
  console.log('✅  Server-side HMR Enabled!');

  module.hot.accept('./server', () => {
    console.log('🔁  HMR Reloading `./server`...');
    server.removeListener('request', currentApp);
    const newApp = require('./server').default;
    server.on('request', newApp);
    currentApp = newApp;
  });
}
