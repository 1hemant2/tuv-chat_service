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
          const  sessionId = crypto.randomBytes(16).toString('hex');
          await redisSetUserGeoLocation('sessionId', {longitude, lattitude, sessionId});
          responseClient.setSuccess({sessionId});
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
           const sessionId = req.body.sessionId;
           if (!sessionId) {
              responseClient.setError(400, 'Session Id is required');
              return responseClient.send(res);
           }
           await redisDelete(sessionId);
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
            const sessionId = req.query.sessionId;
            if (!sessionId) {
              throw errors('Session Id is required', 400);
            }
            const nearestSessionId = await redisGetNearestAvailableSession(sessionId);
            if (!nearestSessionId) {
               responseClient.setError(400,  'No match found please apply after sometime');
               return responseClient.send(res);
            }
            await redisMarkSessionBusy(sessionId, nearestSessionId);
            await redisMarkAlreadyMatchedSession(sessionId, nearestSessionId);
            responseClient.setSuccess({currentSessionId : sessionId, nearestSessionId});
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