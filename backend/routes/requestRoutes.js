const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/requestController');

router.post('/', ctrl.createRequest);
router.get('/received/:userId', ctrl.getReceived);
router.patch('/:id/accept', ctrl.acceptRequest);
router.patch('/:id/reject', ctrl.rejectRequest);
router.get('/accepted/:userId', ctrl.getAcceptedPartners);
router.get('/status/:currentUserId/:targetUserId', ctrl.checkStatus);

module.exports = router;
