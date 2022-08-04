const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const path = require('path');
const initRoutes = require('./routes/index.route.js');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const { env } = require('process');

//Get hostname & port
const backendHostName = process.env.BACKEND_HOST;
const frontendHostName = process.env.FRONTEND_HOST;
const FE_PORT = process.env.FE_PORT || 3000;
const BE_PORT = process.env.PORT || 3030;

const corsOptions = {
    origin: `${frontendHostName}`,
    credentials: true,            //access-control-allow-credentials:true
    optionSuccessStatus: 200
}

//Initialize app
const app = express();

app.use(cors(corsOptions));

//Connect to MongoDB
const db = require('./config/db/index.db');

db.connect();

//Connect to MySQL server
const MySQL = require('./config/db/dbMysql');

//------ Middleware -----//
//[express] Serving static files in express
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/', express.static(path.join(__dirname, 'public')));

//[cookie-parser] Parse cookie header
app.use(cookieParser());
//[body-parser] Parse request object as a JSON object: application/json
app.use(bodyParser.json());
//[body-parser] Parse urlencoded bodies: application/xwww-
app.use(bodyParser.urlencoded({ extended: true }));
//Set view engine
app.set('view engine', 'ejs');
//Set views folder path
app.set('views', path.join(__dirname, 'views'));

//Routes init
initRoutes(app);

const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const CommentController = require('../server/controllers/comment.controller');
const commentController = require('../server/controllers/comment.controller');

io.on('connection', (socket) => {
    socket.on('setRoom', function(room_id) {
        socket.join(room_id);
     });
     socket.on('submitComment', (data) => {
        io.in(data.room_id).emit('newComment', data);
        const movie_id = data.movieID;
        const sender_id = data.senderID;
        const comment = data.comment;
        const icon = data.icon;
        commentController.inputComment(movie_id, sender_id, comment, icon);
     })
  });


server.listen(BE_PORT, () => {
    console.log(`Running on port ${BE_PORT}`);
})

module.exports = {io};