const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/messageController');
const upload = require('../config/multerConfig');

router.get('/', ctrl.getConversation); 
router.post('/', ctrl.sendMessage);
router.post('/file', upload.single('file'), ctrl.sendFileMessage);
module.exports = router;
