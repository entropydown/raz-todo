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
