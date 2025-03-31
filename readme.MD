
# Flow chart 
- https://lucid.app/lucidchart/b081dd24-696b-49b7-a827-872bd50f5b2d/edit?invitationId=inv_0a21a221-5ad5-4d63-afe7-ef46e59adcd7&page=0_0

Task List 
### **1. Guest Mode Authentication Only**

📌 **Goal:** Allow users to chat without sign-up, using temporary session-based IDs.
- 

### **2. Location-Based Matching**

📌 **Goal:** Match users within the same city using IP-based geolocation.



### **3. One-to-One Real-Time Chat**

📌 **Goal:** Enable real-time messaging between matched users.

  **Tech**
- tech : socket.io, Rabbit MQ, redis pub/sub, mongo db to keep the history.
- socket.io : using to connect the user through socket and when both user online send the messages. 
- Rabbit MQ : Suppose a session created and user1 goes offilne at that time user2 send a message,     message will be get lost because user1 is offline to deliver message when user1 will be online.
- redis pub/sub : We are going to create a event driven architure, in future if we need to pass the event accross multiple services we can maintain with redis. We are not using node.js event driven architecture because it is suitable for single micro service for passing accross multiple service we have to maintain state and it will slower than redis.

 **Implementation Plan**

- User connects via WebSocket (Socket.io).
- User sends a message -> Message goes to Redis Pub/Sub.
- If the receiver is online -> Redis sends it instantly via WebSocket. 
- If the receiver is offline -> Message is sent to RabbitMQ for later delivery.
- When the receiver comes online -> Backend fetches missed messages from RabbitMQ.
- Once delivered, messages are stored in the database for history.

### Websocket implementation through socket.io
- we are choosing socket.io becuase we can implement group chat easily with socket.io
- we are creating writing modular code and name spaces. 
- When user come to application accept disclaimer and give a location permission we are going to generate userid and set to the socket. 
- When user1 click on match request will go to nearest free user to accept if accepted, will get the unique sessionId from accepted user and now  we are going to set that sessionId in the socket, otherwise never going to match these users again. 
- event used -> user-join : user join socket, client side : connect.
- event used -> user-left : user disconnect from socket, client side : disconnect.
- event used -> user-session when user matched
- event used -> user-match : accept the session. 


### Rule for event name
- Event name will be start with to which namespace we are sending, not from which namespace sending. 
- Event name will be start with namespace prefix(except default name namespace)