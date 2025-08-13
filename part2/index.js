// Feature 2: Referencing & populate (Student ↔ Address)
const mongoose = require('mongoose');
require('dotenv').config();
const Student = require('./models/Student');
const Address = require('./models/Address');

(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/learn_mongoose');
    console.log('✔ Mongo connected');

    await Promise.all([ Address.deleteMany({}), Student.deleteMany({})]);
    
    const a = await Address.create({ line1: '123 Main St', city: 'Pune', country: 'IN' });
    const s = await Student.create({ name: 'Charlie', email: 'charlie@example.com', address :a._id  });
    
    console.log(s);
    const s_populated = await Student.findOne({_id:s._id}).populate('address');
    console.log(s_populated);

    // modern populate usagea
    //const populated = await Address.findOne({ student: s._id }).populate('student');
    //console.log('Address -> Student:', { city: populated.city, student: populated.student.name });
  } catch (err) {
    console.error('Mongo error:', err);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected');
  }
})();
