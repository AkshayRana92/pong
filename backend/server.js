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
let playersList = [];
let interval;
let timer = 5;

io.on('connection' ,(socket) => {
    if (io.engine.clientsCount > clientsLimit) {
        socket.emit('error', { message: '4 players already playing' })
        socket.disconnect()
        playersList = [];
        console.log('Disconnected')
        return
    }

    socket.on('join', (name) => {
        let player = {};
        player.socket = socket.id;
        player.name = name;

        playersList.push(player);

        socket.broadcast.emit('message', `${name} joined the game`);
        io.emit('totalPlayers', playersList.length)
        io.emit('playerList', playersList)

        if (!interval) {
            interval = setInterval(() => {
                console.log(timer)
                io.emit('timer', timer)
                if (timer > 0) {
                    timer --;
                } else {
                    clearInterval(interval);
                }
            }, 1000)
        }
    });

    socket.on('reset', _ => {
        timer = 5;
    });

    socket.on('disconnect', () => {
        let len = 0;

        for(let i=0, len = playersList.length; i < len; ++i ) {
            let player = playersList[i];

            if(player.socket === socket.id){
                playersList.splice(i, 1);
                if (playersList.length === 0) {
                    interval = null;
                }
                break;
            }
        }
    });
})
