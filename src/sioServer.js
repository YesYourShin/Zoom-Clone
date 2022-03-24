import http from 'http';
import socketio from 'socket.io';
import express from 'express';
import { doesNotMatch } from 'assert';

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
    socket['nickname'] = 'Anonymous';
    // console.log(socket);
    socket.onAny(event => {
        console.log(`Socket Event: ${event}`);
    });
    socket.on('enter_room', (roomName, done) => {
        // console.log(msg);
        console.log(socket.rooms);

        socket.join(roomName);
        // setTimeout(() => {
        //     done();
        // }, 3000);
        done();

        socket.to(roomName).emit('welcome', socket.nickname);
    });
    socket.on('disconnecting', () => {
        socket.rooms.forEach(aRoom => {
            socket.to(aRoom).emit('bye', socket.nickname);
        });
    });

    socket.on('new_message', (msg, room, done) => {
        socket.to(room).emit('new_message', `${socket.nickname} : ${msg}`);
        done();
    });

    socket.on('nickname', nickName => {
        socket['nickname'] = nickName;
    });
});
