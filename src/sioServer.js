import http from 'http';
import socketio from 'socket.io';
import express from 'express';

const app = express();

app.set('view engine', 'pug');
app.set('views', __dirname + '/views'); // static assets
app.use('/public', express.static(__dirname + '/public'));
app.get('/', (_, res) => res.render('home'));

const server = http.createServer(app);

const sioServer = socketio(server);
const handleListen = () => console.log(`Socket IO Server is Listening on http://localhost:3000`);

server.listen(3000, handleListen);

sioServer.on('connection', socket => {
    console.log(socket);
});
