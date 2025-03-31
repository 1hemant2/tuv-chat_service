const { getSocketId } = require("./userManager");


const chatSocket = async (io) => {
    try {
        console.log('Chat socket initialized...');
        const chatNamespace = io.of('/chat');
        chatNamespace.on('connection', (socket) => {
            console.log('User connected to chat namespace:', socket.id);
            socket.on('disconnect', () => {
                console.log('User disconnected from chat namespace:', socket.id);
            });
            
            //Setting a sessionId to to socket.
            socket.on('chat-session-id-emit', (userId1, userId2, sessionId) => {
                const socketId1 = getSocketId(userId1);
                const socketId2 = getSocketId(userId2);
                io.of('/user').to(socketId1).emit('user-session-id', sessionId); // Emit to the user namespace
                io.of('/user').to(socketId2).emit('user-session-id', sessionId); // Emit to the user namespace
                console.log('sessoin id set in chat socket for users ', userId1, userId2, sessionId);
            });

            socket.on('chat-session-join', (sessionId) => {
                socket.join(sessionId); // Join the room
                console.log('User joined room:', sessionId);
            });

            // Sending message to a specific room
            socket.on("chat-message", (userId, sessionId, message) => {
                chatNamespace.to(sessionId).emit("chat-message", { sender: userId, message, sessionId  });
                console.log(`Message from ${userId}  in room ${sessionId}: ${message}`);
            });

         })
    } catch (error) {
        console.error('Error in chatSocketEvent:', error);
    }
}

module.exports = { chatSocket };