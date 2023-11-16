const express = require('express');
const router = express.Router();
const {
  CreateQuestion,
  UpdateQuestion,
  GetAllQuestion,
  GetChildAllQuestion,
  GetQuestionById,
  DeleteQuestionById
} = require('../controllers/adminQuestionController');


// Get Question route
router.get('/', GetAllQuestion);

// Create Question route
router.post('/', CreateQuestion);

// Update Question route
router.put('/', UpdateQuestion);

// Get Question By Id route
router.get('/:id', GetQuestionById);

// Get Question By Id route
router.get('/child/:id', GetChildAllQuestion);

// Delete Question By Id route
router.delete('/:id', DeleteQuestionById);


module.exports = router;
