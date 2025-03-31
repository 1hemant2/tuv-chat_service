const crypto = require('crypto');  
const { responseClient } = require('../Helper/reponseClient');
const { redisDelete,  redisSetUserGeoLocation, redisGetFirstAvailableSession, redisMarkSessionBusy, redisGetNearestAvailableSession, redisMarkAlreadyMatchedSession } = require('../Redis/redisClient');
const { customErrors, errors } = require('../Helper/errorHandler');


class UserController {
    /**
    * @description : create a session id, store the latitude, longitude, busy status in redis
    * @returns : user session id
    */
    async generateSessionKey (req, res) {       
       try {
          let { longitude, lattitude } = req.query;
          longitude = parseFloat(longitude);
          lattitude = parseFloat(lattitude);
          if (!longitude || !lattitude) {
             throw errors('Longitude and Latitude are required', 400);
          }
          const  userId = crypto.randomBytes(16).toString('hex');
          await redisSetUserGeoLocation('userId', {longitude, lattitude, userId});
          responseClient.setSuccess({userId});
          return responseClient.send(res);
       } catch (error) {
          console.error(error);
          responseClient.setError(error.status || 500, error.message || 'Internal Server Error');
          return responseClient.send(res);
       }
    }
    
    /**
    * @description : Deleted a session id from redis and destroy the session
    */
    async deleteSessionKey (req, res) {
       try {
           const userId = req.body.userId;
           if (!userId) {
              responseClient.setError(400, 'Session Id is required');
              return responseClient.send(res);
           }
           await redisDelete(userId);
           responseClient.setSuccess('Session Key Deleted');
           return responseClient.send(res);
       } catch (error) {
           console.error(error);
           responseClient.setError(error.status || 500, error.message || 'Internal Server Error');
           return responseClient.send(res);
       }
    }

     /**
     * @description : Deleted a session id from redis and destroy the session
     */
      async matchUser (req, res) {
        try {
            const userId = req.query.userId;
            if (!userId) {
              throw errors('User id is required', 400);
            }
            const nearestuserId = await redisGetNearestAvailableSession(userId);
            if (!nearestuserId) {
               responseClient.setError(400,  'No match found please apply after sometime');
               return responseClient.send(res);
            }
            await redisMarkSessionBusy(userId, nearestuserId);
            await redisMarkAlreadyMatchedSession(userId, nearestuserId);
            responseClient.setSuccess({currentuserId : userId, nearestuserId, roomId : `${userId}:${nearestuserId}` });
            return responseClient.send(res);
        } catch (error) {
            console.error(error);
            responseClient.setError(error.status || 500, error.message || 'Internal Server Error');
            return responseClient.send(res);
        }
      }
}

const userController = new UserController();
module.exports = {userController};