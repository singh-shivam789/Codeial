class ChatEngine {
    constructor(chatBoxId, userEmail, userName) {
        this.chatBox = $(`#${chatBoxId}`);
        this.userEmail = userEmail;
        this.userName = userName;

        this.socket = io.connect('http://localhost:5000');

        if (this.userEmail) {
            this.connectionHandler();
        }
    }

    connectionHandler() {
        let self = this;

        //on means detecting an event
        this.socket.on('connect', function() {
            console.log('Connection established using sockets !');
            //emit for sending an event
            self.socket.emit("join_room", {
                user_name: self.userName,
                user_email: self.userEmail,
                chatroom: 'codeial'
            });
            self.socket.on('user_joined', function(data) {
                console.log('A user joined', data);
            });

            //send a message on clicking the send button
            $('#send-message').click(function() {
                let msg = $('#chat-message-input').val();

                if (msg != '') {
                    //emit for sending an event
                    self.socket.emit('send_message', {
                        message: msg,
                        user_email: self.userEmail,
                        user_name: self.userName,
                        chatroom: 'codeial'
                    });
                }
            });
            self.socket.on('receive_message', function(data) {
                console.log('message received', data.message);

                let newMessage = $('<li>');
                let messageType = 'other-message';
                if (data.user_email == self.userEmail) {
                    messageType = 'self-message';
                }

                newMessage.append($('<span>', {
                    'html': data.message
                }));

                newMessage.append($('<sub>', {
                    'html': '  ' + data.user_name
                }));
                newMessage.addClass(messageType);

                $('#chat-messages-list').append(newMessage);
            });
        });
    }
}