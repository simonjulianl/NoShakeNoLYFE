const path = require('path');
const express = require('express');
const app = express();
const http = require('https');
const fs = require('fs');

const server = http.createServer({
   key: fs.readFileSync('server.key'),
   cert: fs.readFileSync('server.cert')
}, app);


const io = require('socket.io')().listen(server);
const morgan = require('morgan');
app.use(morgan('dev'));
app.use(express.static(__dirname + '/public'));
app.use('/scripts', express.static(path.join(__dirname, 'node_modules')));

app.get('/', (req, res) => {
    if (req.headers["user-agent"].match(/\bMobile\b/) === null) {
        res.sendFile(__dirname + '/game.html')
    } else {
        res.sendFile(__dirname + '/controller.html')
    }
}); // serve index.html

// Setup variables
const players = {};
let score = 0;

io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on("lobby_scene_connected", () => console.log('lobby scene connected'));

    socket.on('requestPlayers', () => {
        socket.emit('playerList', players);
        socket.broadcast.emit('playerList', players);
    });
    socket.on('requestScore', () => {
        socket.emit('currentScore', score);
        socket.broadcast.emit('currentScore', score);
    })
    socket.on('updateScore', (currentScore) => {
        score = currentScore;
        socket.emit('currentScore', score);
        socket.broadcast.emit('currentScore', score);
    });

    socket.on('playerMovement', (movementInfo) => {
        socket.broadcast.emit('playerMoved', movementInfo);
    });

    socket.on('gameLost', () => {
        socket.emit('openLoseScreen');
        socket.broadcast.emit('openLoseScreen');
    })

    socket.on("dropPlayer", (socketId) => {
        socket.emit("dropPlayer");
        socket.broadcast.emit("dropPlayer");
    })

    socket.on('mobileToServer', (socketId) => {
        // console.log("Mobile Device Connected");
        // console.log(socketId);
        socket.emit("newPlayer", socketId)
        socket.broadcast.emit("newPlayer", socketId);
    })

    socket.on('moveUp', (socketId) => {
        socket.broadcast.emit('moveUp', socketId);
    })

    socket.on('moveDown', (socketId) => {
        socket.broadcast.emit('moveDown', socketId);
    })

    socket.on('deviceShaking', (playerId) => {
        // console.log('Device is Shaking');
        socket.broadcast.emit("yesShaking", playerId);
    })

    socket.on('deviceNotShaking', (playerId) => {
        // console.log('Device is NOT Shaking');
        socket.broadcast.emit('noShaking', playerId);
    })

    socket.on('disconnect', () => {
        console.log("A user disconnected");
        socket.emit('deletePlayer', socket.id);
        socket.broadcast.emit('deletePlayer', socket.id);
        console.log("A user disconnected (2)");
        io.emit('disconnected', socket.id);
    });

    socket.on("window", (window) => console.log(window));
});
server.listen(process.env.PORT || 8081, () => console.log(`Listening on ${server.address().port}`));
