const mongoose = require("mongoose");
const studentSchema1 = new mongoose.Schema({
    name: String,
    age: Number
});

module.exports = mongoose.model("Student", studentSchema1);