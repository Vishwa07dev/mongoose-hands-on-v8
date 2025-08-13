const mongoose = require("mongoose");
const studentSchema1 = new mongoose.Schema({
    name: String,
    age: Number,
    address : { type: mongoose.Schema.Types.ObjectId, ref: 'Address' }
});

module.exports = mongoose.model("Student", studentSchema1);
