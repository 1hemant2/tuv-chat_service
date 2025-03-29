const express = require('express');
const app = express(); 
const { constantVariable } = require('./Helper/constant');
const bodyParser = require('body-parser'); 
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
const port = constantVariable.port; 
const userRouter = require('./Routes/userRoutes');
const version =  "/api/v" + require('./package.json').version.slice(0, 1); 

app.get('/health', (req, res) => {
  res.send('Server is running');
});

app.use(`${version}/user/`, userRouter);
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});               