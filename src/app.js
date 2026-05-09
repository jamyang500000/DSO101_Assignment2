const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// In-memory storage for todos
let todos = [];
let nextId = 1;

// GET all todos
app.get('/todos', (req, res) => {
  res.status(200).json(todos);
});

// GET single todo by id
app.get('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const todo = todos.find(t => t.id === id);
  if (!todo) {
    return res.status(404).json({ error: 'Todo not found' });
  }
  res.status(200).json(todo);
});

// POST create new todo
app.post('/todos', (req, res) => {
  const { title } = req.body;
  if (!title || title.trim() === '') {
    return res.status(400).json({ error: 'Title is required' });
  }
  const todo = {
    id: nextId++,
    title: title.trim(),
    completed: false,
    createdAt: new Date().toISOString()
  };
  todos.push(todo);
  res.status(201).json(todo);
});

// PUT update todo
app.put('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const todo = todos.find(t => t.id === id);
  if (!todo) {
    return res.status(404).json({ error: 'Todo not found' });
  }
  const { title, completed } = req.body;
  if (title !== undefined) todo.title = title;
  if (completed !== undefined) todo.completed = completed;
  res.status(200).json(todo);
});

// DELETE todo
app.delete('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = todos.findIndex(t => t.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Todo not found' });
  }
  todos.splice(index, 1);
  res.status(204).send();
});

// Helper function to reset todos (for testing)
const resetTodos = () => {
  todos = [];
  nextId = 1;
};

// Only start the server if this file is run directly (not when imported for tests)
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Todo app listening on port ${PORT}`);
  });
}

module.exports = { app, resetTodos };
