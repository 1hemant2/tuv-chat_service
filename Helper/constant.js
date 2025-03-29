
const constantVariable = {
     port : process.env.PORT || 5000, 
     redistUrl : {
          host: process.env.REDIS_HOST || "127.0.0.1",
          port: process.env.REDIS_PORT || 6379,
          db: 0, // Select a specific database
          // password: "your_password", // If authentication is enabled
          // tls: {} // Required for some cloud providers (e.g., AWS ElastiCache)
     }
}


module.exports = {constantVariable};