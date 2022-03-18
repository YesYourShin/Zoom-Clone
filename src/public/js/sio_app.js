const socket = io();

const welcome = document.querySelector('#welcome');
const roomForm = welcome.querySelector('form');
let roomName = '';

roomForm.addEventListener('submit', event => {
    event.preventDefault();
    roomName = roomForm.querySelector('input').value;

    socket.emit('enter_room', roomName, () => {
        console.log('server in done');
        showRoom();
    });
});

const room = document.querySelector('#room');
room.hidden = true;

function showRoom() {
    welcome.hidden = true;
    room.hidden = false;
    const h3 = room.querySelector('h3');
    h3.innerText = `Room : ${roomName}`;
}

function addMessage(msg) {
    const ul = room.querySelector('ul');

    const li = document.createElement('li');
    li.innerText = msg;

    ul.appendChild(li);
}

socket.on('welcome', () => {
    addMessage('Somebody joined!');
});

socket.on('bye', () => {
    addMessage('Somebody left');
});

const messageForm = room.querySelector('form');

messageForm.addEventListener('submit', event => {
    event.preventDefault();
    const input = messageForm.querySelector('input');
    const message = input.value;
    socket.emit('new_message', message, roomName, () => {
        addMessage(`You : ${message}`);
    });
    input.value = '';
});

socket.on('new_message', addMessage); // (msg) => {addMessage(msg);}
