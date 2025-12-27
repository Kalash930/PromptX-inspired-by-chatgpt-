const express = require('express'); // Import the Express framework
const cookieParser = require('cookie-parser'); // Import the cookie-parser middleware
const path = require('path'); // Import the path module


const cors = require("cors"); // Import the CORS middleware


// Import route modules

const authRoutes = require('./routes/auth.routes'); // Import authentication routes
const chatRoutes = require('./routes/chat.routes'); // Import chat routes



const app = express(); // Create an instance of an Express application



app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
})); // Enable CORS for requests from the specified origin with credentials



// Middleware setup
app.use(express.json()); // Middleware to parse JSON request bodies
app.use(cookieParser()); // Middleware to parse cookies
app.use(express.static(path.join(__dirname, '../public'))); // Serve static files from the 'public' directory

// Use the imported routes
app.use('/api/auth', authRoutes); // Use authentication routes with the '/api/auth' prefix
app.use('/api/chat', chatRoutes); // Use chat routes with the '/api/chat' prefix




app.get("*name", (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
}); // Catch-all route to serve the main HTML file for any unmatched routes


module.exports=app;









/*




(











)










*/

















