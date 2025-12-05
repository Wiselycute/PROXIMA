const express = require("express");
const http = require("http");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const { Server } = require("socket.io");

const User = require("./models/User");
const Chat = require("./models/Chat");
const Message = require("./models/Message");

require("dotenv").config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});

// -----------------------
// CONNECT MONGODB
// -----------------------
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log("MongoDB Error:", err));

// Presence tracking
const onlineUsers = new Map();   // userId -> socketIds

// -----------------------
// SOCKET.IO LOGIC
// -----------------------
io.on("connection", (socket) => {
  console.log("Socket Connected:", socket.id);

  socket.on("register", async ({ userId }) => {
    if (!userId) return;

    if (!onlineUsers.has(userId)) onlineUsers.set(userId, new Set());
    onlineUsers.get(userId).add(socket.id);

    await User.findByIdAndUpdate(userId, { online: true });

    io.emit("presence-update", { userId, online: true });
  });

  // join a chat room
  socket.on("join-chat", ({ chatId }) => {
    socket.join(chatId);
  });

  // send message
  socket.on("send-message", async ({ chatId, senderId, content, tempId }) => {
    const msg = await Message.create({
      chat: chatId,
      sender: senderId,
      content,
      seenBy: [senderId] // sender auto sees their own msg
    });

    await Chat.findByIdAndUpdate(chatId, { latestMessage: msg._id });

    io.to(chatId).emit("new-message", {
      ...msg.toObject(),
      tempId
    });
  });

  // typing
  socket.on("typing", ({ chatId, userId }) => {
    socket.to(chatId).emit("typing", { chatId, userId });
  });
  socket.on("stop-typing", ({ chatId, userId }) => {
    socket.to(chatId).emit("stop-typing", { chatId, userId });
  });

  // seen receipts
  socket.on("seen-messages", async ({ chatId, userId }) => {
    await Message.updateMany(
      { chat: chatId, seenBy: { $ne: userId } },
      { $push: { seenBy: userId } }
    );

    io.to(chatId).emit("messages-seen", { chatId, userId });
  });

  // disconnect
  socket.on("disconnect", async () => {
    for (let [userId, sockets] of onlineUsers.entries()) {
      if (sockets.has(socket.id)) {
        sockets.delete(socket.id);
        if (sockets.size === 0) {
          onlineUsers.delete(userId);
          await User.findByIdAndUpdate(userId, { online: false });
          io.emit("presence-update", { userId, online: false });
        }
        break;
      }
    }
  });
});

// -----------------------
// REST ROUTES
// -----------------------
app.get("/chats", async (req, res) => {
  const chats = await Chat.find({})
    .populate("members")
    .populate("latestMessage")
    .sort({ updatedAt: -1 });

  res.json({ chats });
});

app.get("/chats/:chatId/messages", async (req, res) => {
  const messages = await Message.find({ chat: req.params.chatId })
    .populate("sender")
    .sort({ createdAt: 1 });

  res.json({ messages });
});

const PORT = 4000;
server.listen(PORT, () => console.log(`Socket Server running on ${PORT}`));
