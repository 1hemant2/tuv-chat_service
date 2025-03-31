const { setUserStatusOnline, setUserStatusOffline, getSocketId } = require("./userManager");

const userSocket = async (io) => {
    try {
        console.log('User Socket initialized...');
        const userNamespace = io.of('/user');
        userNamespace.on('connection', (socket) => {
            console.log('User connected to userNamespace with socketId:', socket.id);
            
            // set the user online
            socket.on('user-join', (userId) => {
                setUserStatusOnline(userId, socket.id);
                socket.emit("user-join", userId); // Emit only after connecting
            });
            
            // Find and remove the user from the online map
            socket.on('user-left', (userId) => {
                setUserStatusOffline(userId, socket.id);
                socket.emit("user-left", userId); // Emit only after disconnecting
                console.log('User disconnected from user namespace:', socket.id);
            });

            // when user click on match button
            socket.on('user-match', (userId, matchedUserId) => {   
                const matchedSocketId = getSocketId(matchedUserId);
                if (matchedSocketId) {
                    socket.to(matchedSocketId).emit('user-match', userId); // Emit to the matched user
                    console.log(`User ${userId} matched with ${matchedUserId}`);
                } else {
                    console.log(`Matched user ${matchedUserId} is not online`);
                }
            })
             
            // when nearest user click on  button
            // socket.on('user-accept', (userId, matchedUserId) => {
            //     const matchedSocketId = userStatus.get(matchedUserId);
            //     if (matchedSocketId) {
            //         socket.to(matchedSocketId).emit('user-accept', userId); // Emit to the matched user
            //         console.log(`User ${userId} accepted match with ${matchedUserId}`);
            //     } else {
            //         console.log(`Matched user ${matchedUserId} is not online`);
            //     }
            // } )

            // when nearest user click on cancel button 
            // socket.on('user-cancel', (userId, matchedUserId) => {   
            //     const matchedSocketId = userStatus.get(matchedUserId);
            //     if (matchedSocketId) {
            //         socket.to(matchedSocketId).emit('user-cancel', userId); // Emit to the matched user
            //         console.log(`User ${userId} canceled match with ${matchedUserId}`);
            //     } else {
            //         console.log(`Matched user ${matchedUserId} is not online`);
            //     }
            // })
         })
    } catch (error) {
        console.error('Error in chatSocketEvent:', error);
    }
}

module.exports = { userSocket };