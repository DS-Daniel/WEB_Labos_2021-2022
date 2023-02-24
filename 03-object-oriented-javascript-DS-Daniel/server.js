const express = require('express');
const app = express();

// Serve the public directory
app.use(express.static('public'));

// Serve the src directory
app.use('/src', express.static('src'));


app.listen(3000, () => {
  console.log(`server ready at http://localhost:3000`)
});
