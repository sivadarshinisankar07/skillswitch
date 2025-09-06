const { createMessage } = require('../controllers/messageController');

module.exports = (io, socket) => {
  socket.on('joinRoom', ({ userId, peerId }) => {
    const roomId = [userId, peerId].sort().join('_');
    socket.join(roomId);
  });

  socket.on('sendMessage', async ({ fromUser, toUser, body }) => {
    const msg = await createMessage({ fromUser, toUser, body });
    const roomId = [fromUser, toUser].sort().join('_');
    io.to(roomId).emit('newMessage', msg);
  });

  socket.on('userTyping', ({ userId, peerId }) => {
  const roomId = [userId, peerId].sort().join('_');
    io.to(roomId).emit('userTyping', { userId });
});

socket.on('newMessage', (msg) => {
  const roomId = [msg.fromUser, msg.toUser].sort().join('_');
  io.to(roomId).emit('newMessage', msg);
});


};
