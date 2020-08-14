const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const messageFormat = require('./util/messageFormat');
const {userJoin, fetchUser, userLeave, getRoomUsers} = require('./util/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

//set static folder
app.use(express.static(path.join(__dirname, 'public')));

//Run when client connects
io.on('connection', socket => {


    //Welcome user
    socket.on('joinRoom', (msg) => { 
        const user = userJoin(socket.id, msg.username, msg.room);
        socket.join(user.room);
        socket.emit('message', messageFormat('ChatBot', 'Welcome to chatting'));

 
        //Broadcast everyone except one user
        socket.broadcast.to(user.room).emit('message', messageFormat('ChatBot', `${msg.username} has joined chat.`));

        //Send users and room info 
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        });
    });
    

    //Broadcast everyone
    //io.emit()

            //Listen message from client
            socket.on('clientMessage', msg => {
                const user = fetchUser(socket.id);
               console.log('fetchUser--->',user);
              io.to(user.room).emit('message', messageFormat(user.username,msg));
           });
    //Run when client disconnects
    socket.on('disconnect', () => {
        const user = userLeave(socket.id);
        if(user){
            io.emit('message', messageFormat('ChatBot', `${user.username} has leave the room.`));
           
            //Send users and room info 
             io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomUsers(user.room)
            });
        }
        
    })

})

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
