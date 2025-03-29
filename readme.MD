
Task List 
### **1. Guest Mode Authentication Only**

📌 **Goal:** Allow users to chat without sign-up, using temporary session-based IDs.

- [ ]  Generate a temporary guest ID when a user joins.
- [ ]  Expire guest ID when the user refreshes or closes the page.
- [ ]  Authenticate users via WebSocket using the guest ID.

### **2. Location-Based Matching**

📌 **Goal:** Match users within the same city using IP-based geolocation.

- [ ]  Get user's city using IP-based geolocation.
- [ ]  Store guest users in Redis with their city.
- [ ]  Match users within the same city for chat.

### **3. One-to-One Real-Time Chat**

📌 **Goal:** Enable real-time messaging between matched users.

- [ ]  Set up WebSocket server for real-time messaging.
- [ ]  Allow only matched users to communicate.
- [ ]  Store chat messages in MongoDB (session-only, no persistence).
- [ ]  Clear chat history when the guest session ends.**.**