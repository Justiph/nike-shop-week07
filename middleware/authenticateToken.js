// middleware/authenticateToken.js
const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const token = req.cookies.token; // Get the token from the cookies
  
  if (!token) {
    return next(); // If no token, proceed without user data
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token
    res.locals.user = decoded; // Attach the decoded user data to res.locals
  } catch (err) {
    console.error('Token verification failed', err);
  }
  next(); // Continue with the request
};

module.exports = authenticateToken;
