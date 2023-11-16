const mongoose = require('mongoose');


const answersSchema = new mongoose.Schema({
  answer: {
    type: String,
    required: true,
  },
  isCorrect: Boolean
});


const questionSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
    },
    answers: [answersSchema],
    parentQuestionID: mongoose.Schema.Types.ObjectId,
    score: Number,
    hasChild: {
      type: Boolean,
      default: false
    }
  }, 
  {
    timestamps: true
  }
);

const Question = mongoose.model('Question', questionSchema);

module.exports = Question;
