const userStatus = new Map(); // Store user status


const setUserStatusOnline = (userId, socketId) => {
   try {
       userStatus.set(userId, socketId); // Map userId to socket.id
       console.log(`User ${userId} is online with socket ID: ${socketId}`);
   } catch (error) {
       console.error('Error setting user status online:', error);
   }
}

const setUserStatusOffline = (userid, socketid) => {
   try {
       for(let [userId, socketId] of userStatus.entries()) {
            if(userId === userid || socketId === socketid) {
                userStatus.delete(userId);
                console.log(`User ${userId} is now offline`);
                break;
            }
       }
   } catch (error) {
         console.error('Error setting user status offline:', error);
   }
}   

const getSocketId = (userId) => {
    try {
        const socketId = userStatus.get(userId);
        if (socketId) {
            console.log(`Socket ID for user ${userId}: ${socketId}`);
            return socketId;
        } else {
            console.log(`User ${userId} is not online`);
            return null;
        }
    } catch (error) {
        console.error(`Error getting socket ID for user ${userId}:`, error);
    }
}

module.exports = {setUserStatusOffline, setUserStatusOnline, getSocketId};