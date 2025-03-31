const express = require('express');
const app = express(); 
const bodyParser = require('body-parser'); 
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
const cors = require('cors');
app.use(cors()); // Enable CORS for all routes
const http = require('http');
const server = http.createServer(app);

const { constantVariable } = require('./Helper/constant');
const port = constantVariable.port; 
const userRouter = require('./Routes/userRoutes');
const { initScoketIo } = require('./socket/socketIo');
const version =  "/api/v" + require('./package.json').version.slice(0, 1); 
app.get('/health', (req, res) => {
  res.send('Server is running');
});

initScoketIo(server); // Initialize Socket.IO with the server

app.use(`${version}/user/`, userRouter);
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});           