const Contact = require('../models/Contact');

// Submit a new message (Public)
exports.submitMessage = async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    if (!name || !email || !phone || !message) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const newMessage = new Contact({
      name,
      email,
      phone,
      message
    });

    await newMessage.save();
    res.status(201).json({ message: 'Message sent successfully' });
  } catch (error) {
    console.error('Submit contact error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get all messages (Admin)
exports.getMessages = async (req, res) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 });
    res.status(200).json(messages);
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Mark message as read (Admin)
exports.markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const message = await Contact.findByIdAndUpdate(id, { status: 'read' }, { new: true });
    
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    res.status(200).json(message);
  } catch (error) {
    console.error('Mark as read error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete a message (Admin)
exports.deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const message = await Contact.findByIdAndDelete(id);

    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    res.status(200).json({ message: 'Message deleted successfully' });
  } catch (error) {
    console.error('Delete message error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
