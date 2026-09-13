const jwt = require("jsonwebtoken");

function setupSocket(io) {
    // ========================================
    // SOCKET AUTHENTICATION
    // ========================================

    io.use((socket, next) => {
        try {
            const token = socket.handshake.auth?.token;

            if (!token) {
                return next(
                    new Error("Authentication token required")
                );
            }

            const decoded = jwt.verify(
                token,
                process.env.JWT_SECRET
            );

            socket.therapistId = decoded.id;

            next();

        } catch (error) {
            console.error(
                "Socket authentication failed:",
                error.message
            );

            next(
                new Error("Invalid authentication token")
            );
        }
    });


    // ========================================
    // CONNECTION
    // ========================================

    io.on("connection", (socket) => {

        console.log(
            `Socket connected: ${socket.id}`
        );

        console.log(
            `Therapist connected: ${socket.therapistId}`
        );


        // ========================================
        // JOIN THERAPIST ROOM
        // ========================================

        socket.join(
            `therapist:${socket.therapistId}`
        );


        // ========================================
        // SEND MESSAGE
        // ========================================

        socket.on("send_message", (data) => {

            if (!data?.message) {
                return;
            }

            const message = {
                message: data.message,
                sender: "Therapist",
                therapistId: socket.therapistId,
                createdAt: new Date()
            };


            io.to(
                `therapist:${socket.therapistId}`
            ).emit(
                "receive_message",
                message
            );

        });


        // ========================================
        // DISCONNECT
        // ========================================

        socket.on("disconnect", () => {

            console.log(
                `Socket disconnected: ${socket.id}`
            );

        });

    });
}


module.exports = setupSocket;