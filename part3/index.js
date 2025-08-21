// Feature 3: Nested schema + constraints
const mongoose = require('mongoose');
require('dotenv').config();

const Student = require("./models/Student");

(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/learn_mongoose');
    console.log('✔ Mongo connected');
    await Student.deleteMany({});

    await Student.create({
      name: 'Diana',
      email: 'diana@example.com',
      contact: { phone: '9876543210', guardian: 'Mrs. Prince' },
      scores: [88, 92, 77],
      age : 19
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
