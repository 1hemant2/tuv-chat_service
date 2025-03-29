const { userController } = require('../Controller/userController');
const userRouter = require('express').Router(); 

userRouter.get('/generate-session-id', userController.generateSessionKey);
userRouter.delete('/delete-session-id', userController.deleteSessionKey);
userRouter.get('/match-session-id', userController.matchUser);

module.exports = userRouter;