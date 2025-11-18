import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest'; 
import { getModelToken } from '@nestjs/mongoose';
import { TasksModule } from '../../src/tasks/tasks.module';
import { Task } from '../../src/tasks/task.schema';

describe('Tasks (e2e)', () => {
  let app: INestApplication;

  // Mock data
  const mockTasks = [
    { _id: '1', title: 'Task 1', description: 'Desc 1', done: false },
    { _id: '2', title: 'Task 2', description: 'Desc 2', done: true },
  ];

  // Mock Mongoose model
  const mockModel = {
    find: jest.fn().mockImplementation(() => ({
      sort: jest.fn().mockReturnThis(),
      lean: jest.fn().mockResolvedValue(mockTasks),
    })),
    findById: jest.fn().mockImplementation((id) => ({
      lean: jest.fn().mockResolvedValue(mockTasks.find((t) => t._id === id) || null),
    })),
    create: jest.fn().mockImplementation((dto) => ({
      toObject: () => ({ _id: 'new-id', ...dto }),
    })),
    findByIdAndUpdate: jest.fn().mockImplementation((id, dto) => ({
      lean: jest.fn().mockResolvedValue({ _id: id, ...dto }),
    })),
    findByIdAndDelete: jest.fn().mockImplementation((id) => ({
      lean: jest.fn().mockResolvedValue(mockTasks.find((t) => t._id === id) || null),
    })),
  };

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [TasksModule],
    })
      .overrideProvider(getModelToken(Task.name))
      .useValue(mockModel) // override Mongoose model with mock
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/GET tasks should return an array of tasks', async () => {
    return request(app.getHttpServer())
      .get('/tasks')
      .expect(200)
      .expect(mockTasks);
  });

  it('/GET tasks/:id should return a single task', async () => {
    const id = '1';
    return request(app.getHttpServer())
      .get(`/tasks/${id}`)
      .expect(200)
      .expect(mockTasks[0]);
  });

  it('/POST tasks should create a task', async () => {
    const payload = { title: 'New Task', description: 'New Desc', done: false };
    return request(app.getHttpServer())
      .post('/tasks')
      .send(payload)
      .expect(201)
      .expect({ _id: 'new-id', ...payload });
  });

  it('/PATCH tasks/:id should update a task', async () => {
    const payload = { title: 'Updated Task', done: true };
    return request(app.getHttpServer())
      .patch(`/tasks/1`)
      .send(payload)
      .expect(200)
      .expect({ _id: '1', ...payload });
  });

  it('/DELETE tasks/:id should delete a task', async () => {
    return request(app.getHttpServer())
      .delete('/tasks/1')
      .expect(200);
  });
});
