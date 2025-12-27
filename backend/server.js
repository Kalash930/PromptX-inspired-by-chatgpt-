require('dotenv').config(); // Load environment variables from .env file
const app = require('./src/app'); // Import the Express application
const connectDB = require('./src/db/db'); // Import the database connection function
const initSocketServer = require('./src/sockets/socket.server'); // Import the socket server initialization function
const httpServer = require('http').createServer(app); // Create an HTTP server using the Express app


// Connect to the database
connectDB();
initSocketServer(httpServer); // Initialize the socket server with the HTTP server


// Start the HTTP server
httpServer.listen(3000,()=>{
    console.log("Server is running on port 3000");
})