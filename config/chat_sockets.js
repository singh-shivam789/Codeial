module.exports.chatSockets = function(socketServer) {
    let io = require('socket.io')(socketServer);
    io.sockets.on("connection", function(socket) {
        console.log("New Connection recieved", socket.id);

        socket.on('disconnect', function() {
            console.log('Socket Disconnected!');
        });
        //on for detecting an event send by the client
        socket.on('join_room', function(data) {
            console.log("Joining request recieved", data);
            socket.join(data.chatroom); //joins a room using the name of the room provided
            //if chatroom doesn't exist, it'll create the chatroom and then join
            io.in(data.chatroom).emit('user_joined', data);
        });

        //detect send_message event and broadcast to everyone in the room
        socket.on('send_message', function(data) {
            io.in(data.chatroom).emit('receive_message', data);
        });
    });
}