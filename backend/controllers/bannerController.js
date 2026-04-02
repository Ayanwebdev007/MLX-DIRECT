const Banner = require('../models/Banner');
const fs = require('fs');
const path = require('path');

// Admin only: create a banner
exports.createBanner = async (req, res) => {
  try {
    const { title, link } = req.body;
    let imageUrl = req.body.imageUrl;

    // RULE 1: Enforce the Elite 3-Banner Limit
    const bannerCount = await Banner.countDocuments();
    if (bannerCount >= 3) {
      // If a file was uploaded, delete it immediately since we're blocking the creation
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(400).json({ 
        message: 'Elite Limit Reached: Maximum of 3 active banners allowed. Please remove an old one first.' 
      });
    }

    // Check if a file was uploaded via Multer
    if (req.file) {
      // Use the request host to construct the URL dynamically
      const host = req.get('host');
      const protocol = req.protocol;
      imageUrl = `${protocol}://${host}/uploads/${req.file.filename}`;
    }

    if (!title || !imageUrl) {
      return res.status(400).json({ message: 'Title and Image (URL or File) are required' });
    }

    const banner = new Banner({ title, imageUrl, link });
    await banner.save();

    res.status(201).json({ message: 'Banner created successfully', banner });
  } catch (error) {
    res.status(500).json({ message: 'Error creating banner', error: error.message });
  }
};

// Admin only: delete a banner
exports.deleteBanner = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);
    if (!banner) return res.status(404).json({ message: 'Banner not found' });
    
    // RULE 2: Automated Physical File Cleanup
    // Only delete if the image is hosted locally (contains /uploads/)
    if (banner.imageUrl && banner.imageUrl.includes('/uploads/')) {
      try {
        const filename = banner.imageUrl.split('/uploads/').pop();
        const filePath = path.join(__dirname, '../uploads', filename);
        
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
          console.log(`Successfully deleted orphaned image: ${filename}`);
        }
      } catch (unlinkError) {
        console.error('File cleanup failed (non-critical):', unlinkError.message);
        // We continue with the DB deletion even if file cleanup fails
      }
    }

    await Banner.findByIdAndDelete(req.params.id);
    res.json({ message: 'Banner removed and storage cleaned successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting banner', error: error.message });
  }
};

// Public: get all active banners
exports.getBanners = async (req, res) => {
  try {
    const banners = await Banner.find({ isActive: true }).sort({ createdAt: -1 });
    res.json(banners);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching banners', error: error.message });
  }
};
