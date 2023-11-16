const { Question } = require('../models');


// Create Question controller
const checkQuestionAnswer = async (req, res) => {
  try {
    const { questionID, answerID } = req.body;
    const question = await Question.findOne({ _id: questionID });
    if(!!question) {
      let answer = question.answers.find(answer => answer._id.toString() === answerID);
      if(answer?.isCorrect) {
        let subQuestions = [];
        if(question.hasChild) {
          subQuestions = await Question.find({ parentQuestionID: question._id });
          subQuestions = subQuestions.map(question => {
            const sanitizedQuestion = question.toObject();
            sanitizedQuestion.answers = sanitizedQuestion.answers.map(answer => ({
              _id: answer._id,
              answer: answer.answer,
            }));
            return sanitizedQuestion;
          })
        }
        res.status(200).json({
          message: 'Correct answer!',
          subQuestions,
          score: question.score,
          questionId: question._id,
          correctAnswerId: answer._id,
        });
      } else {
        let answer = question.answers.find(answer => answer.isCorrect);
        res.status(400).json({
          message: 'Incorrect answer. Try again!',
          questionId: question._id,
          correctAnswerId: answer._id,
        });
      }
    } else {
      res.status(404).json({
        message: 'Question not found.'
      });
    }
  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
}

// Create Question controller
const answerQuestion = async (req, res) => {
  try {
    const { question, answers, parentQuestionID, level } = req.body;
    Question.init();
    const questionModel = new Question({
      question,
      answers,
      parentQuestionID,
      level
    });
    await questionModel.save();
    if(!!parentQuestionID) {
      const parentQuestion = await Question.findOne({ _id: parentQuestionID });
      parentQuestion.hasChild = true;
      await parentQuestion.save();
    }
    res.status(200).json(questionModel);
  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
};

// Get All Question controller
const GetAllQuestion = async (req, res) => {
  try {
    let allQuestion = await Question.find({
      parentQuestionID: null
    });
    allQuestion = allQuestion.map(question => {
      const sanitizedQuestion = question.toObject();
      sanitizedQuestion.answers = sanitizedQuestion.answers.map(answer => ({
        _id: answer._id,
        answer: answer.answer,
      }));
      return sanitizedQuestion;
    })
    res.status(200).json(allQuestion);
  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
};

// Get child all Question controller
const GetChildAllQuestion = async (req, res) => {
  const { id } = req.params;
  console.log('id', id);
  try {
    let allQuestion = await Question.find({
      parentQuestionID: id
    });
    allQuestion = allQuestion.map(question => {
      const sanitizedQuestion = question.toObject();
      sanitizedQuestion.answers = sanitizedQuestion.answers.map(answer => ({
        answer: answer.answer
      }));
      return sanitizedQuestion;
    })
    res.status(200).json(allQuestion);
  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
};

// Get Question By Id controller
const GetQuestionById = async (req, res) => {
  try {
    const { id } = req.params;
    const questionModel = await Question.findOne({_id: id});
    res.status(200).json(questionModel);
  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
};

// Delete Question By Id controller
const DeleteQuestionById = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await Question.deleteOne({_id: id});
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
};

module.exports = {
  checkQuestionAnswer,
  answerQuestion,
  GetAllQuestion,
  GetChildAllQuestion,
  GetQuestionById,
  DeleteQuestionById
};

