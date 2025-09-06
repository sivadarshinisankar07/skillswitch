const Message = require('../models/Message');
const Profile = require('../models/Profile');
const sendPushNotification = require('../utils/sendNotification');

exports.getConversation = async (req, res) => {
  try {
    const { userA, userB } = req.query; 
    const messages = await Message.find({
      $or: [
        { fromUser: userA, toUser: userB },
        { fromUser: userB, toUser: userA },
      ]
    }).sort('createdAt');
    res.json(messages);
  } catch (err) {
    console.error('getConversation error:', err);
    res.status(500).json({ message: err.message });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const { fromUser, toUser, body } = req.body;
    const msg = await Message.create({ fromUser, toUser, body });

    const profile = await Profile.findOne({ userId: toUser }).lean();
    if (profile?.expoPushToken) {
      await sendPushNotification(profile.expoPushToken, {
        title: '📩 New Message',
        body,
        data: { fromUser }
      });
    }

    res.json(msg);
  } catch (err) {
    console.error('sendMessage error:', err);
    res.status(500).json({ message: err.message });
  }
};

exports.createMessage = async ({ fromUser, toUser, body }) => {
  const message = await Message.create({ fromUser, toUser, body });

  const profile = await Profile.findOne({ userId: toUser }).lean();
  if (profile?.expoPushToken) {
    await sendPushNotification(profile.expoPushToken, {
      title: '📩 New Message',
      body,
      data: { fromUser }
    });
  }

  return message;
};

exports.sendFileMessage = async (req, res) => {
  try {
    const { fromUser, toUser } = req.body;
    const filePath = `/uploads/${req.file.filename}`;
    const msg = await Message.create({
      fromUser,
      toUser,
      body: 'File uploaded', 
      fileUrl: filePath
    });

    const profile = await Profile.findOne({ userId: toUser }).lean();
    if (profile?.expoPushToken) {
      await sendPushNotification(profile.expoPushToken, {
        title: '📁 File Received',
        body: 'Tap to open the conversation.',
        data: { fromUser }
      });
    }

    res.json(msg);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
