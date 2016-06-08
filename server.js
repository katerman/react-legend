var express = require('express');
var path = require('path');
var app = express();

app.use('/', express.static(path.join(__dirname + '/')));
app.use('/public', express.static(path.join(__dirname + '/public')));
app.use('/bower_components', express.static(path.join(__dirname + '/bower_components')));

app.get('/', function (req, res) {
	res.sendFile(__dirname + '/index.html');
});

app.listen(3000, function () {
  console.log('NodeJS listening on port 3000!');
});
