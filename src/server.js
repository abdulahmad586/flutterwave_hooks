const EventEmitter = require('events');
const cors = require('cors');
const express = require('express');
const router = require('./route');
const jwt = require('jsonwebtoken');
const { jwtKey } = require('./config')
const sockerUsers = ['App'];

class AppServer extends EventEmitter {

    #port;
    #io;
    #clientsNum = 0;

    constructor(port) {
        super();
        this.#port = port;
        this.#init();
    }

    #init() {
        const app = express();
        app.use(cors());
        app.use(express.json({
            verify: (req, res, buf) => {
                req.rawBody = buf.toString(); // only for this route
            },
        }));
        app.use(express.urlencoded({ extended: false }));

        app.use(router());

        const server = require('http').createServer(app);

        this.#io = require('socket.io')(server, {
            cors: {
                origin: "*",
                methods: ["GET", "POST"]
            }
        });

        this.#io.on('connection', (sock) => {
            const token = sock.handshake.auth['x-access-token'];

            if (!token) sock.disconnect();
            try {
                const decoded = jwt.verify(token, jwtKey);
                sock.user = decoded;
                sock.token = token;
                if (!sockerUsers.includes(sock.user?.userType)) {
                    console.log("Disconnected client because their userType is not accepted", sock.user.userType);
                    return sock.disconnect()
                };
            } catch (err) {
                console.log("Disconnected client because there was an error", err);
                return sock.disconnect();
            }

            this.#clientsNum++;


            sock.on("disconnect", (reason) => {
                this.#clientsNum--;
            });

            this.emit('connection', sock);
        });

        server.listen(this.#port, '0.0.0.0')
        console.log(`Webhook Server running on port ${this.#port}`);
    }

    hasClients() {
        return this.#clientsNum > 0;
    }

    sendMessage(topic, message) {
        try {
            this.#io.emit(topic, message);
        } catch (e) {
            console.log("Error >> sendMessage >> ", e);
        }
    }

}

module.exports = new AppServer(3000);