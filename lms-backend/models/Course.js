const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  title: String,
  content: String,
  order: Number
});

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  lessons: [lessonSchema],
  published: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Course', courseSchema);
