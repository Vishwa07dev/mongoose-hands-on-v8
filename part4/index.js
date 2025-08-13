// Feature 4: Custom validators (including async uniqueness-like check)
const mongoose = require('mongoose');
require('dotenv').config();

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    validate: {
      validator: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
      message: 'Invalid email format'
    }
  },
  rollNumber: {
    type: Number,
    required: true,
    validate: {
      validator: async function (value) {
        const count = await this.constructor.countDocuments({ rollNumber: value, _id: { $ne: this._id } });
        return count === 0;
      },
      message: 'Roll number must be unique'
    }
  }
}, { timestamps: true });

studentSchema.index({ rollNumber: 1 }, { unique: true });

const Student = mongoose.model('Student', studentSchema);

(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/learn_mongoose');
    console.log('✔ Mongo connected');
    await Student.deleteMany({});

    await Student.create({ name: 'Evan', email: 'evan@example.com', rollNumber: 101 });
    console.log('Created Evan');

    try {
      await Student.create({ name: 'Eve2', email: 'eve2@example.com', rollNumber: 101 });
    } catch (e) {
      console.log('Expected validation error:', e.errors?.rollNumber?.message || e.message);
    }
  } catch (err) {
    console.error('Mongo error:', err);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected');
  }
})();
