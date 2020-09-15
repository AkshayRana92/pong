const express = require('express');
const http = require('http');
const path = require('path');
const socketIo = require('socket.io');


const app = express();
const server = http.createServer(app);
const io = socketIo.listen(server);


const PORT = 3000;

server.listen(PORT, () => console.log(`Server running on ${PORT}`))

const clientsLimit = 4;
const scoreLimit = 3;
const TIMER = 20;
let playersList = [];
let interval;
let counter = TIMER;
let isGameRunning = false;

io.on('connection', (socket) => {
    socket.on('join', (name) => {
        if (!isGameRunning) {
            let player = {};
            player.socket = socket.id;
            player.name = name;
            player.score = 0;

            if (playersList.length < clientsLimit) {
                playersList.push(player);
                io.to(socket.id).emit('message', `you joined the game`);
                socket.broadcast.emit('message', `${name} joined the game`);
                io.emit('playerList', playersList);

                if (!interval) {
                    interval = setInterval(() => {
                        console.log(counter);
                        io.emit('timer', counter);
                        if (counter > 0) {
                            counter--;
                        } else if (counter === 0) {
                            isGameRunning = true;
                        } else {
                            clearInterval(interval);
                            counter = TIMER;
                            interval = undefined;
                        }
                    }, 1000)
                }
            } else {
                socket.emit('message', '4 players already playing. Please wait.');
                socket.emit('clear', true);
            }
        } else {
            socket.emit('message', 'Game is already going on. Please wait.');
        }

    });

    socket.on('onPlayerMove', movement => {
        socket.broadcast.emit('playerMoved', movement);
    });

    socket.on('onBallMove', movement => {
        socket.broadcast.emit('ballMoved', movement);
    });

    socket.on('setScore', scores => {
        playersList.forEach((val, i) => {
            val.score = scores[i];
            if (val.score >= 3) {
                io.emit('message', `${playersList[i].name} Lost`);
                io.to(playersList[i].socket).emit('lost', true);
                playersList.splice(i, 1);
            }
        });

        if (playersList.length === 1) {
            io.emit('winner', playersList[0]);
            io.emit('message', `${playersList[0]} is the winner`);
            socket.disconnect();
            playersList = [];
            interval = null;
            counter = TIMER;
            io.emit('playerList', playersList);
        }

        io.emit('playerList', playersList);
    });

    socket.on('reset', _ => {
        counter = TIMER;
    });

    socket.on('disconnect', () => {
        let len = 0;

        for (let i = 0, len = playersList.length; i < len; ++i) {
            let player = playersList[i];

            if (player.socket === socket.id) {
                playersList.splice(i, 1);
                io.emit('playerList', playersList);
                if (playersList.length === 1) {
                    interval = null;
                    counter = TIMER;
                }
                break;
            }
        }
    });
});
