// Feature 5: Common queries (modernized)
const mongoose = require('mongoose');
require('dotenv').config();

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  age: Number
}, { timestamps: true });

studentSchema.index({ email: 1 }, { unique: true });

const Student = mongoose.model('Student', studentSchema);

(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/learn_mongoose');
    console.log('✔ Mongo connected');
    await Student.deleteMany({});

    await Student.insertMany([
      { name: 'Frank', email: 'frank@example.com', age: 23 },
      { name: 'Grace', email: 'grace@example.com', age: 27 }
    ]);

    // countDocuments instead of deprecated count()
    const n = await Student.countDocuments({ age: { $gte: 21 } });
    console.log('Adults:', n);

    // findOneAndUpdate with new:true; includeResultMetadata example
    const res = await Student.findOneAndUpdate(
      { email: 'frank@example.com' },
      { $set: { age: 24 } },
      { new: true, includeResultMetadata: true }
    );
    console.log('Updated doc:', res.value?.toObject?.());

    // findOneAndDelete instead of findOneAndRemove
    const deleted = await Student.findOneAndDelete({ email: 'grace@example.com' });
    console.log('Deleted:', deleted?.email);

    // lean read for perf
    const leanDoc = await Student.findOne({ email: 'frank@example.com' }).lean();
    console.log('Lean read keys:', Object.keys(leanDoc));

    // Simple aggregation
    const byAge = await Student.aggregate([
      { $group: { _id: '$age', count: { $sum: 1 } } }
    ]);
    console.log('Aggregation (by age):', byAge);
  } catch (err) {
    console.error('Mongo error:', err);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected');
  }
})();
