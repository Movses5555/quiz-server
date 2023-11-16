const { Question } = require('../models');

// Create Question controller
const CreateQuestion = async (req, res) => {
  try {
    const { question, answers, parentQuestionID } = req.body;
    Question.init();
    const questionModel = new Question({
      question,
      answers,
      parentQuestionID
    });
    await questionModel.save();
    if(!!parentQuestionID) {
      const parentQuestion = await Question.findOne({ _id: parentQuestionID });
      parentQuestion.hasChild = true;
      await parentQuestion.save();
    }
    await calculateQuestionScore();
    res.status(200).json(questionModel);
  } catch (error) {
    console.log('error.message----', error.message);
    res.status(400).json({
      message: error.message
    });
  }
};

// Calculate Questions Score
const calculateQuestionScore = async (parentQuestionID = null, parentLevelScore = 100) => {
  try {
    const allQuestion = await Question.find({ parentQuestionID: parentQuestionID });
    if(allQuestion) {
      let levelScore = parentLevelScore / allQuestion.length;
      for (let question of allQuestion) {
        if(question.hasChild) {
          levelScore = levelScore / 2;
        }
        question.score = Math.round(levelScore * 10**6) / 10**6;
        await question.save();
        if(question.hasChild) {
          await calculateQuestionScore(question._id, levelScore);
        }
      }; 
    }
  } catch (error) {
    console.log('error', error);
  }
};


// Update Question controller
const UpdateQuestion = async (req, res) => {
  let data = req.body;
  try {
    await Question.updateOne(
      {_id: data._id},
      {
        $set: {
          question: data.question,
          answers: data.answers,
        }
      }
    );
    const question = await Question.findOne({_id: data._id});
    res.status(200).json(question);
  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
};



// Get All Question controller
const GetAllQuestion = async (req, res) => {
  try {
    const allQuestion = await Question.find({
      parentQuestionID: null
    });
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
    const allQuestion = await Question.find({
      parentQuestionID: id
    });
    console.log('allQuestion', allQuestion);
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
    await deleteAllChildQuestions()
    const question = await Question.findOne({_id: id});
    if(question?.parentQuestionID) {
      const count = await Question.find({parentQuestionID: question.parentQuestionID}).count();
      console.log('count', count);
      if(count === 1 ) {
        await Question.updateOne(
          {_id: question.parentQuestionID},
          {
            $set: {
              hasChild: false
            }
          }
        );
      }
    }
    const data = await Question.deleteOne({_id: id });
    console.log('data---', data)
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
};

// Delete All Child Questions
const deleteAllChildQuestions = async (questionID) => {
  try {
    const childQuestions = await Question.find({ parentQuestionID: questionID });
    console.log('childQuestions', childQuestions);
    if(childQuestions) {
      for (let childQuestion of childQuestions) {
        if(childQuestion.hasChild) {
          await calculateQuestionScore(childQuestion._id);
        } else {
          await Question.deleteOne({ _id: questionID })
        }
      }; 
    }
  } catch (error) {
    console.log('error', error);
  }
};


module.exports = {
  CreateQuestion,
  UpdateQuestion,
  GetAllQuestion,
  GetChildAllQuestion,
  GetQuestionById,
  DeleteQuestionById
};

