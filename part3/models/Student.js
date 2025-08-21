const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
    phone: { type: String, match: /^[0-9]{10}$/ },
    guardian: { type: String, trim: true }
  }, { _id: false });

const studentSchema1 = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    age: {type: Number, required : true},
    address : { type: mongoose.Schema.Types.ObjectId, ref: 'Address' },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    scores: { type: [Number], validate: v => Array.isArray(v) && v.every(n => n >= 0 && n <= 100) },
    contact: { type: contactSchema, default: {} },

},{timestamps: true});

//Setting the index
studentSchema1.index({ email: 1 }, { unique: true }); //adding unique is not mandatory here as defined in schema already

module.exports = mongoose.model("Student", studentSchema1);
