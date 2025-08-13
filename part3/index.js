// Feature 3: Nested schema + constraints
const mongoose = require('mongoose');
require('dotenv').config();

const contactSchema = new mongoose.Schema({
  phone: { type: String, match: /^[0-9]{10}$/ },
  guardian: { type: String, trim: true }
}, { _id: false });

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  contact: { type: contactSchema, default: {} },
  scores: { type: [Number], validate: v => Array.isArray(v) && v.every(n => n >= 0 && n <= 100) }
}, { timestamps: true });

studentSchema.index({ email: 1 }, { unique: true });

const Student = mongoose.model('Student', studentSchema);

(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/learn_mongoose');
    console.log('✔ Mongo connected');
    await Student.deleteMany({});

    await Student.create({
      name: 'Diana',
      email: 'diana@example.com',
      contact: { phone: '9876543210', guardian: 'Mrs. Prince' },
      scores: [88, 92, 77]
    });

    const doc = await Student.findOne({ email: 'diana@example.com' });
    console.log('Nested contact guardian:', doc.contact.guardian);
  } catch (err) {
    console.error('Mongo error:', err);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected');
  }
})();
