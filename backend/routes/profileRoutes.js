const express = require('express'); 
const router = express.Router();
const profileController = require('../controllers/profileController');
const upload = require('../config/multerConfig');

router.post('/', upload.single('profilePic'), profileController.createOrUpdateProfile);
router.get('/:userId', profileController.getProfile);
router.get('/matching/:userId', profileController.getMatchingProfiles);
router.post('/pushtoken',profileController.savePushToken)
router.get('/all/:userId', profileController.getAllProfiles);

module.exports = router;
