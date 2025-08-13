// Feature 1: Basic app + Student schema + DB connection + inserts
const mongoose = require('mongoose');
require('dotenv').config();

const Student = require("./models/Students.model");


(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/learn_mongoose');
    console.log('✔ Mongo connected');
    
    //Delete all the documents inside the function
    await Student.deleteMany({});

    const student1 = await Student.insertOne(
      { name: 'Vishwa', age: 21, email: 'vishwa@aimerz.ai' }
    );

    console.log(student1);

    //Insert multiple documents insude the Students collections
    const docs = await Student.insertMany([
      { name: 'Alice', age: 21, email: 'alice@example.com' },
      { name: 'Bob', age: 22, email: 'bob@example.com' }
    ]);
    console.log('Inserted:', docs.map(d => d.name));
    
    /**
     * Count the number of documents
     */
    const count = await Student.countDocuments();

    /**
     * Search for the documents
     */
    console.log('Student count:', count);

    const std = await Student.findOne({name : "Vishwa"});
    console.log(std)

    const std1 = await Student.findOne({name : "Mohan"});
    console.log(std1)

    

  } catch (err) {
    console.error('Mongo error:', err);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected');
  }
})();
