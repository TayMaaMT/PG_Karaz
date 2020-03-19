var redis = require('redis');

var client = redis.createClient(15479, 'redis-15479.c16.us-east-1-3.ec2.cloud.redislabs.com', { no_ready_check: true });
client.auth('Ai73f8cdlJS9tpjRHND977PbqX6qWI9p', function(err) {
    if (err) throw err;
});


client.on('error', function(err) {
    console.log('Error ' + err);
});

client.on('connect', function() {
    console.log('Connected to Redis');
});

module.exports = { client }