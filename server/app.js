const path = require('path');
const http = require('http');
const express = require('express');
const socketIo = require('socket.io');
const mongodb = require('mongodb');
const cors = require('cors');
const mongoClient = mongodb.MongoClient;
const ObjectId = mongodb.ObjectID;


const publicPath = path.join(__dirname + '/../frontend');
const port = process.env.PORT || 4000;
let app = express();
let server = http.createServer(app);
let io = socketIo(server, {
    cors: {
    origin: "https://multicoder.ml",
    methods: ["GET", "POST"]
  }
});
const rooms = {};
const score = {};

//getting random number
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}



app.use(express.static(publicPath));

io.on('connection', (socket) => {
    socket.on('username', (data) => {
        socket.username = data;
    })
    //mongodb stuff
    const connectionUrl = 'mongodb+srv://Admin:TrawlerLALA1904@multicoder.e6eon.mongodb.net/MultiCoder?retryWrites=true&w=majority';
    mongoClient.connect(connectionUrl, {useNewUrlParser:true}, (error, client) => {
        if(error){
            return console.log('unable to connect to db');
        }
        const db = client.db('MultiCoder');
        db.collection('questions').findOne(
            {
                "_id": getRandomInt(1, 22)
            }, (err, question) => {
                if(err) return console.log('unable to fetch');
                socket.on('gameStarted', () => {
                    io.to(rooms[socket.id]).emit('startingGameData', question);
                });
            }
        );
    });
    console.log(`a user connected: ${socket.id}`);
    socket.on('disconnecting', () => {
        console.log(`user disconnected ${socket.id}`);
        console.log(socket.rooms);
        delete rooms[socket.id];
        delete score[socket.username];
    });
    socket.on('createARoom', (data) => {
        rooms[socket.id] = data;
        socket.join(data);
    });
    socket.on('joinARoom', (data) => {
        rooms[socket.id] = data;
        socket.join(data);
        socket.broadcast.to(data).emit('someoneJoined', socket.username);
    });
    socket.on('winnerAmountOfSeconds', (data) => {
        score[socket.username] = data;
        //sending the result to the other users in the room
        socket.broadcast.to(rooms[socket.id]).emit('winnerSeconds', score[socket.username]);
        io.to(rooms[socket.id]).emit('finalResult', score);
    });
    socket.on('loserAmountOfSeconds', (data) => {
        socket.broadcast.to(rooms[socket.id]).emit('loserSeconds', data);
    });
    socket.on('reqNewQ', () => {
        mongoClient.connect(connectionUrl, {useNewUrlParser:true}, (error, client) => {
            if(error){
                return console.log('unable to connect to db');
            }
            const db = client.db('MultiCoder');
            db.collection('questions').findOne(
                {
                    "_id": getRandomInt(1, 22)
                }, (err, question) => {
                    if(err) return console.log('unable to fetch');
                    io.to(rooms[socket.id]).emit('startingGameData', question);
                }
            );
        });
    });
});

server.listen(port, () => {
    console.log(`listening on port ${port}`);
});
