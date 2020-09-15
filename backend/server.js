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
const scoreLimit = 2;
const TIMER = 5;
let playersList = [];
let interval;
let counter = TIMER;
let isGameRunning = false;

io.on('connection', (socket) => {
    socket.on('join', (name) => onJoin(name));

    socket.on('onPlayerMove', movement => {
        socket.broadcast.emit('playerMoved', movement);
    });

    socket.on('onBallMove', movement => {
        socket.broadcast.emit('ballMoved', movement);
    });

    socket.on('setScore', scores => onSetStore(scores));

    socket.on('reset', _ => {
        counter = TIMER;
    });

    socket.on('disconnect', () => {
        for (let i = 0, len = playersList.length; i < len; ++i) {
            let player = playersList[i];
            if (player.socket === socket.id) {
                playersList.splice(i, 1);
                io.emit('playerList', playersList);
                if (playersList.length === 1) {
                    isGameRunning = false;
                    clearInterval(interval);
                    io.to(playersList[0].socket).emit('winner', true);
                    counter = TIMER;
                }
                break;
            }
        }
    });

    function onJoin(name) {
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
                        io.emit('timer', counter);
                        if (counter > 0) {
                            counter--;
                        } else if (counter === 0) {
                            if (playersList.length >= 2) {
                                isGameRunning = true;
                                clearInterval(interval);
                                counter = TIMER;
                                interval = undefined;
                            } else {
                                clearInterval(interval);
                                counter = TIMER;
                                interval = undefined;
                                playersList = [];
                            }
                        } else {
                            clearInterval(interval);
                            counter = TIMER;
                            interval = undefined;
                        }
                    }, 1000)
                }
            } else {
                socket.emit('message', '4 players are already playing. Please wait.');
                socket.emit('clear', true);
            }
        } else {
            socket.emit('message', 'Game is already going on. Please wait.');
            socket.emit('clear', true);
        }

    }

    function onSetStore(scores) {
        playersList.forEach((val, i) => {
            val.score = scores[i];
            if (val.score >= scoreLimit) {
                io.emit('message', `${playersList[i].name} Lost`);
                io.to(playersList[i].socket).emit('lost', true);
                playersList.splice(i, 1);
            }
        });

        if (playersList.length === 1) {
            io.to(playersList[0].socket).emit('winner', true);
            isGameRunning = false;
            io.emit('message', `${playersList[0].name} is the winner`);
            playersList = [];
            clearInterval(interval);
            interval = null;
            counter = TIMER;
            io.emit('playerList', playersList);
        }

        io.emit('playerList', playersList);
    }

});
