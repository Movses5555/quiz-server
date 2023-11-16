const express = require('express');
const router = express.Router();
const {
  checkQuestionAnswer,
  answerQuestion,
  GetAllQuestion,
  GetChildAllQuestion,
  GetQuestionById,
} = require('../controllers/userQuestionController');


// Get Question route
router.get('/', GetAllQuestion);


// Create Question route
router.post('/', answerQuestion);


// Create Question route
router.post('/answer', checkQuestionAnswer);

// Get Question By Id route
router.get('/:id', GetQuestionById);

// Get Question By Id route
router.get('/child/:id', GetChildAllQuestion);


module.exports = router;
