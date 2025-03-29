const redis = require('ioredis'); 
const { constantVariable } = require('../Helper/constant');

const redisClient = new redis(constantVariable.redistUrl);

const redisSet = async (key, value) => {
    return await redisClient.set(key, value);
}

const redisGet = async (key) => { 
    return await redisClient.get(key);
}

const redisDelete = async (key) => {
    return await redisClient.del(key);
}

const redisSetUserGeoLocation = async (key, data) => {
     const value = data.sessionId;
     await redisClient.geoadd(key,  data.longitude,  data.lattitude, value);
     await redisClient.hset('user_busy_status', data.sessionId, "false");
     return data;
}

/**
 * @description : get the nearest first free sessionId
 * @Cons : need to optimize it further because it's time compexity is O(n * log n), for million records in worst case it will take approx 10 sec. we need to optimize it and bring in down to less than 100 ms.
 */
const redisGetNearestAvailableSession = async (key) => { 
     const totalSession = await redisClient.hgetall('user_busy_status');
     const totalSessionCount = Object.keys(totalSession).length;
     let batch = 100;
     for(let i = 0; i <= (totalSessionCount / batch); i += batch) {
        const nearestSessions = await redistSeachGeoLocation(key, 1000, 'km', 'ASC', batch);
        for (const session of nearestSessions) {
            const isBusy = await redisClient.hget('user_busy_status', session);
            const isAlreadyMatched = await redisCheckAlreadyMatchedSession(key, session);
            if (isBusy === "false" && isAlreadyMatched === false) {
                return session;
            }
        }
        batch *= 10;
     }
     return null;
}

// search the nearset geo locations 
const redistSeachGeoLocation = async (member, radius, unit, sort, batch) => {
    const nearestSessions =  await redisClient.geosearch(
        'sessionId', 
        'FROMMEMBER', String(member),  
        'BYRADIUS', Number(radius),
        String(unit), 
        String(sort), 
        'COUNT', Number(batch)
      );
    return nearestSessions;
}

// mark the matching session as busy
const redisMarkSessionBusy = async (sessionId1, sessionId2) => {
    await redisClient.hset('user_busy_status', sessionId1, "true");
    await redisClient.hset('user_busy_status', sessionId2, "true"); 
}

// mark the sessions as already matched 
const redisMarkAlreadyMatchedSession = async (sessionId1, sessionId2) => {
    await redisClient.hset('user_matched', sessionId1, sessionId2);
    await redisClient.hset('user_matched', sessionId2, sessionId1);
}

// check if session is already matched 
const redisCheckAlreadyMatchedSession = async (currentSessionId, nearestSessionId) => {
    const alreadyMatchedSession = await redisClient.hget('user_matched', currentSessionId);
    if (alreadyMatchedSession === nearestSessionId) {
        return true;
    }
    return false;
}

module.exports = {
    redisSet, 
    redisGet,
    redisDelete, 
    redisSetUserGeoLocation,
    redisGetNearestAvailableSession,
    redisMarkSessionBusy,
    redisMarkAlreadyMatchedSession,
    redisCheckAlreadyMatchedSession,
};