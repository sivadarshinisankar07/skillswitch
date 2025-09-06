const LearnRequest = require('../models/LearnRequest');
const Profile = require('../models/Profile');
const { Expo } = require('expo-server-sdk');
const expo = new Expo();
const path = require('path');
const Mailimage = 'http://localhost:5000/assets/front.jpg';
const sendPushNotification = require('../utils/sendNotification')

exports.createRequest = async (req, res) => {
  try {
    const { fromUser, toUser } = req.body;
    if (String(fromUser) === String(toUser)) {
      return res.status(400).json({ message: 'Cannot send request to yourself' });
    }

    const doc = await LearnRequest.findOneAndUpdate(
      { fromUser, toUser },
      { $setOnInsert: { status: 'pending' } },
      { new: true, upsert: true }
    );

    const profile = await Profile.findOne({ userId: toUser }).lean();

    if (profile?.expoPushToken) {
      await sendPushNotification(profile.expoPushToken, {
    title: '🎓 New Learning Request!',
    body: 'Someone wants to learn with you. Tap to view.',
    data: { fromUser },
    image: Mailimage
      });
    } else {
      console.warn('⚠️ No Expo push token found for user:', toUser);
    }

    res.json(doc);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: 'Request already exists' });
    }
    console.error('createRequest error:', err);
    res.status(500).json({ message: err.message });
  }
};

exports.getReceived = async (req, res) => {
  try {
    const { userId } = req.params;

    const list = await LearnRequest.find({ toUser: userId })
      .populate('fromUser', 'name email') 
      .sort('-createdAt')
      .lean(); 

    const userIds = list.map(item => item.fromUser._id);

    const profiles = await Profile.find(
      { userId: { $in: userIds } },
      'userId profilePic'
    ).lean();
    const mergedList = list.map(item => {
      const profile = profiles.find(
        p => String(p.userId) === String(item.fromUser._id)
      );
      return {
        ...item,
        fromUser: {
          ...item.fromUser,
          profilePic: profile?.profilePic || null
        }
      };
    });
    res.json(mergedList);
  } catch (err) {
    console.error('getReceived error:', err);
    res.status(500).json({ message: err.message });
  }
};


exports.acceptRequest = async (req, res) => {
  try {
    const { id } = req.params;

    const doc = await LearnRequest.findByIdAndUpdate(
      id,
      { status: 'accepted' },
      { new: true }
    );
    if (!doc) return res.status(404).json({ message: 'Request not found' });

    const profile = await Profile.findOne({ userId: doc.fromUser }).lean();
    if (profile?.expoPushToken) {
      await sendPushNotification(profile.expoPushToken, {
        title: '🎉 Request Accepted',
        body: 'Your learning request has been accepted.',
        data: { requestId: doc._id }
      });
    }

    res.json(doc);
  } catch (err) {
    console.error('acceptRequest error:', err);
    res.status(500).json({ message: err.message });
  }
};

exports.rejectRequest = async (req, res) => {
  try {
    const { id } = req.params;

    const doc = await LearnRequest.findByIdAndUpdate(
      id,
      { status: 'rejected' },
      { new: true }
    );
    if (!doc) return res.status(404).json({ message: 'Request not found' });

    const profile = await Profile.findOne({ userId: doc.fromUser }).lean();
    if (profile?.expoPushToken) {
      await sendPushNotification(profile.expoPushToken, {
        title: '❌ Request Rejected',
        body: 'Your learning request has been rejected.',
        data: { requestId: doc._id }
      });
    }

    res.json(doc);
  } catch (err) {
    console.error('rejectRequest error:', err);
    res.status(500).json({ message: err.message });
  }
};



exports.getAcceptedPartners = async (req, res) => {
  try {
    const { userId } = req.params;
    const accepted = await LearnRequest.find({
      status: 'accepted',
      $or: [{ fromUser: userId }, { toUser: userId }]
    });

    const partnerIds = accepted.map(r =>
      String(r.fromUser) === String(userId) ? r.toUser : r.fromUser
    );

    
    const profiles = await Profile.find({ userId: { $in: partnerIds } }).populate('userId', 'name');
    console.log(JSON.stringify(profiles))
    res.json(profiles);
  } catch (err) {
    console.error('getAcceptedPartners error:', err);
    res.status(500).json({ message: err.message });
  }
};


exports.checkStatus = async (req, res) => {
  try {
    const { currentUserId, targetUserId } = req.params;

    const request = await LearnRequest.findOne({
      $or: [
        { fromUser: currentUserId, toUser: targetUserId },
        { fromUser: targetUserId, toUser: currentUserId }
      ]
    });

    if (!request) {
      return res.json({ status: 'none' }); // no request
    }

    res.json({
      status: request.status, // 'pending', 'accepted', 'rejected'
      fromUser: request.fromUser
    });
  } catch (err) {
    console.error('checkStatus error:', err);
    res.status(500).json({ message: err.message });
  }
};
