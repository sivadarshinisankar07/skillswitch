const Profile = require('../models/Profile');


exports.createOrUpdateProfile = async (req, res) => {
  try {
    const { userId, designation, age, qualification, skills, skillsToLearn } = req.body;

    let profilePic = null;
    if (req.file) {
      
      profilePic = `/uploads/${req.file.filename}`;
    }

  
    const parsedSkills = typeof skills === 'string' ? JSON.parse(skills) : skills;
    const parsedSkillsToLearn = typeof skillsToLearn === 'string' ? JSON.parse(skillsToLearn) : skillsToLearn;

    const profile = await Profile.findOneAndUpdate(
      { userId },
      {
        designation,
        profilePic: profilePic || undefined, 
        age,
        qualification,
        skills: parsedSkills || [],
        skillsToLearn: parsedSkillsToLearn || []
      },
      { new: true, upsert: true }
    );

    res.json(profile);
  } catch (err) {
    console.error('Error creating/updating profile:', err);
    res.status(500).json({ message: err.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
        const { userId } = req.params;
    const id = typeof userId === 'object' && userId._id ? userId._id : userId;
    const profile = await Profile.findOne({ userId: id }).populate('userId', 'name');
    console.log(JSON.stringify(profile))
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    res.json(profile);
  } catch (err) {
    console.error('Error fetching profile:', err);
    res.status(500).json({ message: err.message });
  }
};

exports.getMatchingProfiles = async (req, res) => {
  try {
    const current = await Profile.findOne({ userId: req.params.userId });
    if (!current) return res.status(404).json({ message: 'Current profile not found' });

    const matches = await Profile.find({
      userId: { $ne: current.userId },
      skills: { $in: current.skillsToLearn || [] },
    }).populate('userId', 'name').select('-__v');

    res.json(matches);
  } catch (err) {
    console.error('Error fetching matching profiles:', err);
    res.status(500).json({ message: err.message });
  }
};

exports.getAllProfiles = async (req, res) => {
  try {
    const current = await Profile.findOne({ userId: req.params.userId });
    if (!current) {
      return res.status(404).json({ message: "Current profile not found" });
    }

    // First, get the matches
    const matches = await Profile.find({
      userId: { $ne: current.userId },
      skills: { $in: current.skillsToLearn || [] },
    }).select("_id"); // only get IDs

    const matchIds = matches.map((m) => m._id);

    // Now get all profiles except current and matching
    const profiles = await Profile.find({
      userId: { $ne: current.userId },
      _id: { $nin: matchIds },
    })
      .populate("userId", "name")
      .select("-__v");

    res.json(profiles);
  } catch (err) {
    console.error("Error fetching profiles:", err);
    res.status(500).json({ message: err.message });
  }
};



exports.savePushToken = async (req, res) => {
  const { userId, token } = req.body;
  console.log(token)
  await Profile.findOneAndUpdate({ userId }, { expoPushToken: token }, { upsert: true, new: true });
  res.json({ success:true });
};