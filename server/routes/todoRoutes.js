const express = require('express');
const router = express.Router();
const Todo = require('../models/Todo');

// Get all todos
router.get('/', async (req, res) => {
  try {
    const todos = await Todo.find().sort({ timestamp: -1 });
    res.json(todos);
  } catch (err) {
    console.error('Error fetching todos:', err);
    res.status(500).json({ message: 'Error fetching todos' });
  }
});

// Create a new todo
router.post('/', async (req, res) => {
  if (!req.body.text) {
    return res.status(400).json({ message: 'Todo text is required' });
  }

  const todo = new Todo({
    text: req.body.text,
  });

  try {
    const newTodo = await todo.save();
    res.status(201).json(newTodo);
  } catch (err) {
    console.error('Error creating todo:', err);
    res.status(400).json({ message: 'Error creating todo' });
  }
});

// Get a single todo
router.get('/:id', getTodo, (req, res) => {
  res.json(res.todo);
});

// Update a todo
router.patch('/:id', getTodo, async (req, res) => {
  if (req.body.text != null) {
    res.todo.text = req.body.text;
  }
  if (req.body.completed != null) {
    res.todo.completed = req.body.completed;
  }
  try {
    const updatedTodo = await res.todo.save();
    res.json(updatedTodo);
  } catch (err) {
    console.error('Error updating todo:', err);
    res.status(400).json({ message: 'Error updating todo' });
  }
});

// Delete a todo
router.delete('/:id', getTodo, async (req, res) => {
  try {
    await res.todo.deleteOne();
    res.json({ message: 'Todo deleted successfully' });
  } catch (err) {
    console.error('Error deleting todo:', err);
    res.status(500).json({ message: 'Error deleting todo' });
  }
});

async function getTodo(req, res, next) {
  let todo;
  try {
    todo = await Todo.findById(req.params.id);
    if (todo == null) {
      return res.status(404).json({ message: 'Todo not found' });
    }
  } catch (err) {
    console.error('Error finding todo:', err);
    return res.status(500).json({ message: 'Error finding todo' });
  }

  res.todo = todo;
  next();
}

module.exports = router; 