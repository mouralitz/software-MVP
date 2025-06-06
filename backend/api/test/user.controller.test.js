import request from 'supertest';
import express from 'express';
import userRoutes from '../routes/user.route.js';

const app = express();
app.use(express.json());
app.use('/api/users', userRoutes);

describe('User Controller', () => {
  let userId;
  let token;

  it('deve retornar erro ao registrar usuário sem dados', async () => {
    const res = await request(app)
      .post('/api/users/register')
      .send({});
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('message');
  });

  it('deve registrar usuário com dados válidos', async () => {
    const res = await request(app)
      .post('/api/users/register')
      .send({
        name: 'Teste',
        email: 'teste1@example.com',
        password: '123456'
      });
    expect([200, 201]).toContain(res.statusCode);
    expect(res.body).toHaveProperty('id');
    userId = res.body.id;
  });

  it('deve retornar erro ao registrar usuário já existente', async () => {
    const res = await request(app)
      .post('/api/users/register')
      .send({
        name: 'Teste',
        email: 'teste1@example.com',
        password: '123456'
      });
    expect(res.statusCode).toBe(409); // ou 400, dependendo da sua implementação
    expect(res.body).toHaveProperty('message');
  });

  it('deve retornar erro ao fazer login sem dados', async () => {
    const res = await request(app)
      .post('/api/users/login')
      .send({});
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('message');
  });

  it('deve retornar erro ao fazer login com senha errada', async () => {
    const res = await request(app)
      .post('/api/users/login')
      .send({
        email: 'teste1@example.com',
        password: 'senhaerrada'
      });
    expect([400, 401]).toContain(res.statusCode);
    expect(res.body).toHaveProperty('message');
  });

  it('deve fazer login com sucesso', async () => {
    const res = await request(app)
      .post('/api/users/login')
      .send({
        email: 'teste1@example.com',
        password: '123456'
      });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
    token = res.body.token;
  });

  it('deve listar usuários (requer autenticação)', async () => {
    const res = await request(app)
      .get('/api/users')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('deve retornar erro ao listar usuários sem autenticação', async () => {
    const res = await request(app)
      .get('/api/users');
    expect([401, 403]).toContain(res.statusCode);
    expect(res.body).toHaveProperty('message');
  });

  it('deve buscar usuário pelo id', async () => {
    const res = await request(app)
      .get(`/api/users/${userId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('email', 'teste1@example.com');
  });

  it('deve atualizar usuário', async () => {
    const res = await request(app)
      .put(`/api/users/${userId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Novo Nome' });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('name', 'Novo Nome');
  });

  it('deve deletar usuário', async () => {
    const res = await request(app)
      .delete(`/api/users/${userId}`)
      .set('Authorization', `Bearer ${token}`);
    expect([200, 204]).toContain(res.statusCode);
  });
});