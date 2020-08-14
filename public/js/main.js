const chatForm = document.getElementById('chat-form');
const chatMessage = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

//Get username and room from url query param
const {username, room} = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});

console.log(username, room);
const socket = io();

//Join room
socket.emit('joinRoom', {username, room});

//Get room and users
socket.on('roomUsers', ({room, users}) => {
    outputRoomName(room);
    outputUsername(users);
})

socket.on('message', message => {
    console.log(message);
    outputMessage(message);
    chatMessage.scrollTop = chatMessage.scrollHeight;
})

chatForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const msg = e.target.elements.msg.value;
    
    //emit msg to server
    socket.emit('clientMessage', msg);

    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
})

//Output Broadcast msg
function outputMessage(message) {
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meta">${message.user} <span>${message.time}</span></p>
    <p class="text">${message.msg}</p>`
    
    document.querySelector('.chat-messages').appendChild(div);
}

//Add room name to DOM
function outputRoomName(room){
    roomName.innerHTML = `<small>${room}</small>`;
}

function outputUsername(users){
    userList.innerHTML = `
    ${users.map(user => `<li>${user.username}</li>`).join('')}
    `;
}