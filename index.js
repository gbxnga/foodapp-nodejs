const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const userRoutes = require('./routes/user');
const authRoutes = require('./routes/auth');
const foodRoutes = require('./routes/food');

const { authMiddleware, loggerMiddleware } = require('./middlewares');

const publicDirectoryPath = path.join(__dirname, './public');
app.use(express.static(publicDirectoryPath));

app.use(bodyParser.json());

app.use('/api/auth', [loggerMiddleware], authRoutes); 
app.use('/api/foods', [authMiddleware, loggerMiddleware], foodRoutes);
app.use('/api/users', [authMiddleware], userRoutes);


app.use(express.json());  


app.listen(process.env.PORT, _ => {
    console.log('Server is up on port ' + process.env.PORT);
});