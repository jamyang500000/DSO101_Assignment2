const request = require('supertest');
const { app, resetTodos } = require('../src/app');

describe('Todo API Tests', () => {
  beforeEach(() => {
    resetTodos();
  });

  describe('GET /todos', () => {
    test('should return empty array when no todos exist', async () => {
      const response = await request(app).get('/todos');
      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });

    test('should return all todos', async () => {
      await request(app).post('/todos').send({ title: 'Test Todo 1' });
      await request(app).post('/todos').send({ title: 'Test Todo 2' });
      
      const response = await request(app).get('/todos');
      expect(response.status).toBe(200);
      expect(response.body.length).toBe(2);
    });
  });

  describe('POST /todos', () => {
    test('should create a new todo', async () => {
      const response = await request(app)
        .post('/todos')
        .send({ title: 'Buy groceries' });
      
      expect(response.status).toBe(201);
      expect(response.body.title).toBe('Buy groceries');
      expect(response.body.completed).toBe(false);
      expect(response.body.id).toBeDefined();
    });

    test('should return 400 when title is missing', async () => {
      const response = await request(app)
        .post('/todos')
        .send({});
      
      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Title is required');
    });

    test('should return 400 when title is empty', async () => {
      const response = await request(app)
        .post('/todos')
        .send({ title: '   ' });
      
      expect(response.status).toBe(400);
    });
  });

  describe('GET /todos/:id', () => {
    test('should return a specific todo', async () => {
      const created = await request(app)
        .post('/todos')
        .send({ title: 'Test Todo' });
      
      const response = await request(app).get(`/todos/${created.body.id}`);
      expect(response.status).toBe(200);
      expect(response.body.title).toBe('Test Todo');
    });

    test('should return 404 for non-existent todo', async () => {
      const response = await request(app).get('/todos/999');
      expect(response.status).toBe(404);
    });
  });

  describe('PUT /todos/:id', () => {
    test('should update todo title', async () => {
      const created = await request(app)
        .post('/todos')
        .send({ title: 'Original' });
      
      const response = await request(app)
        .put(`/todos/${created.body.id}`)
        .send({ title: 'Updated' });
      
      expect(response.status).toBe(200);
      expect(response.body.title).toBe('Updated');
    });

    test('should mark todo as completed', async () => {
      const created = await request(app)
        .post('/todos')
        .send({ title: 'Test' });
      
      const response = await request(app)
        .put(`/todos/${created.body.id}`)
        .send({ completed: true });
      
      expect(response.status).toBe(200);
      expect(response.body.completed).toBe(true);
    });

    test('should return 404 when updating non-existent todo', async () => {
      const response = await request(app)
        .put('/todos/999')
        .send({ title: 'Updated' });
      
      expect(response.status).toBe(404);
    });
  });

  describe('DELETE /todos/:id', () => {
    test('should delete a todo', async () => {
      const created = await request(app)
        .post('/todos')
        .send({ title: 'To be deleted' });
      
      const response = await request(app).delete(`/todos/${created.body.id}`);
      expect(response.status).toBe(204);
      
      const getResponse = await request(app).get(`/todos/${created.body.id}`);
      expect(getResponse.status).toBe(404);
    });

    test('should return 404 when deleting non-existent todo', async () => {
      const response = await request(app).delete('/todos/999');
      expect(response.status).toBe(404);
    });
  });
});
