require('dotenv').config({path: "./vars/.env"});

const app = require('./app')

// PORT 
var PORT = process.env.PORT || 5000

// Starting the Server
app.listen(PORT, () => {
    console.log(`Dev Server is listening on port ${PORT}`);
})