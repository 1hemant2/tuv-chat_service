const {Server} = require('socket.io');
const {chatSocket} = require('./chatSocket');
const { userSocket } = require('./userSocket');


const initScoketIo = (server) => {  
    console.log('Socket.IO initialized...');
    const io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]        
        }
    });

    io.on('connection', (socket) => {
       console.log('User connect with socketId : ', socket.id);
    });
    chatSocket(io); // Initialize chat socket events
    userSocket(io); // Initialize user socket events
    
    return io;
}

module.exports = {initScoketIo};