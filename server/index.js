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

const commentController = require('../server/controllers/comment.controller');
io.on('connection', (socket) => {
    socket.on('joinRomm', (roomID) => {
        socket.join(roomID);
    })
    socket.on('submitComment', (data) => {
        const movie_id = data.movie_id;
        const sender_id = data.sender_id;
        const comment = data.comment;
        io.to(movie_id).emit('renderComment', {sender_name: data.senderName, comment: comment});
        commentController.inputComment(movie_id, sender_id, comment);
    });
    socket.on('submitIcon', (data) => {
        const movie_id = data.movie_id;
        const comment_id = data.comment_id;
        const icon = data.icon;
        const from = data.from;
        io.to(movie_id).emit('renderIcon', {sender_name: data.senderName, comment: comment, icon: icon});
        commentController.pushIcon(movie_id, comment_id, icon, from);
    });
    socket.on('changeIcon', (data) => {
        const movie_id = data.movie_id;
        const comment_id = data.comment_id;
        const newIcon = data.newIcon;
        const from = data.from;
        io.to(movie_id).emit('renderIcon', {sender_name: data.senderName, comment: comment, icon: icon});
        commentController.changeIcon(movie_id, comment_id, newIcon, from);
    });
    socket.on('submitRepComment', (data)=> {
        const movie_id = data.movie_id;
        const comment_id = data.comment_id;
        const sender_id = data.sender_id;
        const comment = data.comment;
        commentController.inputRepComment(movie_id, comment_id, sender_id, comment);
    });
    socket.on('submitIconRepComment', (data) => {
        commentController.pushRepIcon(data.movie_id, data.comment_id, data.repComment_id , data.icon, data.from);
    });
    socket.on('changeIconRepComment', (data) => {
        commentController.changeRepIcon(data.movie_id, data.comment_id, data.repComment_id, data.from_repIcon, data.newIcon);
    })

  });


server.listen(BE_PORT, () => {
    console.log(`Running on port ${BE_PORT}`);
})
