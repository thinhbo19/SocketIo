const { Server } = require("socket.io");

const io = new Server({
  cors: {
    origin: "https://shoesstore-thinhbo19s-projects.vercel.app",
    methods: ["GET", "POST"],
  },
});
let onlineUser = [];
io.on("connection", (socket) => {
  console.log("new connect", socket.id);

  socket.on("addNewUser", (userId) => {
    !onlineUser.some((user) => user.userId === userId) &&
      onlineUser.push({
        userId,
        socketId: socket.id,
      });

    io.emit("getOnlineUser", onlineUser);
  });

  socket.on("sendMess", (message) => {
    const user = onlineUser.find((user) => user.userId === message.recipientId);
    if (user) {
      io.to(user.socketId).emit("getMess", message);
      io.to(user.socketId).emit("getNotification", {
        senderId: message.senderId,
        isRead: false,
        chatId: message.chatId,
        date: new Date(),
      });
    }
  });

  socket.on("disconnect", () => {
    onlineUser = onlineUser.filter((user) => user.socketId !== socket.id);
    io.emit("getOnlineUser", onlineUser);
  });
});

io.listen(3001);
