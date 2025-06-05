const express = require('express');
const multer = require('multer');
const path = require('path');
const Issue = require('../models/Issue');
const auth = require('../middleware/auth');

const router = express.Router();
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, `${Date.now()}${path.extname(file.originalname)}`)
});
const upload = multer({ storage });

router.use(auth);

router.post('/', upload.single('photo'), async (req, res) => {
    const { title, description, location } = req.body;
    const photo = req.file ? `/uploads/${req.file.filename}` : null;
    const issue = new Issue({ title, description, location, photo, createdBy: req.user._id });
    await issue.save();
    res.json(issue);
});

router.get('/', async (req, res) => {
    const filter = req.user.role === 'admin' ? {} : { createdBy: req.user._id };
    const issues = await Issue.find(filter).sort({ createdAt: -1 });
    res.json(issues);
});

router.patch('/:id', async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
    const issue = await Issue.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    res.json(issue);
});

// DELETE endpoint to delete an issue
router.delete('/:id', async (req, res) => {
    try {
        const issue = await Issue.findById(req.params.id);
        if (!issue) return res.status(404).json({ message: 'Issue not found' });

        // Allow delete if admin or owner of the issue
        if (req.user.role !== 'admin' && !issue.createdBy.equals(req.user._id)) {
            return res.status(403).json({ message: 'Forbidden' });
        }

        await issue.remove();
        res.json({ message: 'Issue deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
