require("dotenv").config();

const http = require("http");

const app = require("./src/app");
const connectDB = require("./src/config/db");
const setupSocket = require("./src/sockets/socketServer");

const PORT = process.env.PORT || 5000;


// ========================================
// CREATE HTTP SERVER
// ========================================

const server = http.createServer(app);


// ========================================
// CREATE SOCKET.IO SERVER
// ========================================

const { Server } = require("socket.io");

const io = new Server(server, {
    cors: {
        origin: true,
        credentials: true
    }
});


// ========================================
// SOCKET SETUP
// ========================================

setupSocket(io);


// ========================================
// START SERVER
// ========================================

const startServer = async () => {

    try {

        await connectDB();

        server.listen(
            PORT,
            () => {

                console.log(
                    `Unfazed server running on port ${PORT}`
                );

                console.log(
                    "Socket.IO server is ready"
                );

            }
        );

    } catch (error) {

        console.error(
            "Failed to start server:",
            error.message
        );

        process.exit(1);

    }

};


startServer();