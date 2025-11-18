// tests/tasks/tasks.controller.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from '../../src/tasks/tasks.controller';
import { TasksService } from '../../src/tasks/tasks.service';

// Test Task shape matching your schema (uses `done` as in your schema)
interface Task {
  id?: string;
  title: string;
  description?: string;
  done?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

describe('TasksController - findAll', () => {
  let controller: TasksController;
  let tasksServiceMock: {
    findAll: jest.Mock<Promise<Task[]>, []>;
  };

  beforeEach(async () => {
    tasksServiceMock = {
      findAll: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [
        {
          provide: TasksService,
          useValue: tasksServiceMock,
        },
      ],
    }).compile();

    controller = module.get<TasksController>(TasksController);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('controller should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('returns an empty array when the database is empty', async () => {
    // Arrange: service returns no tasks
    tasksServiceMock.findAll.mockResolvedValueOnce([]);

    // Act
    const result = await controller.findAll();

    // Assert
    expect(tasksServiceMock.findAll).toHaveBeenCalledTimes(1);
    expect(Array.isArray(result)).toBe(true);
    expect(result).toHaveLength(0);
    expect(result).toEqual([]);
  });

  it('returns a single task when the database contains one task', async () => {
    // Arrange: service returns exactly one task
    const oneTask: Task = {
      id: '1',
      title: 'Only task',
      description: 'a single task in DB',
      done: false,
    };
    tasksServiceMock.findAll.mockResolvedValueOnce([oneTask]);

    // Act
    const result = await controller.findAll();

    // Assert
    expect(tasksServiceMock.findAll).toHaveBeenCalledTimes(1);
    expect(Array.isArray(result)).toBe(true);
    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject(oneTask);
  });

  it('returns multiple tasks when the database contains multiple tasks', async () => {
    // Arrange: service returns multiple tasks
    const multipleTasks: Task[] = [
      { id: 'a', title: 'Task A', done: false },
      { id: 'b', title: 'Task B', done: true },
      { id: 'c', title: 'Task C', done: false },
    ];
    tasksServiceMock.findAll.mockResolvedValueOnce(multipleTasks);

    // Act
    const result = await controller.findAll();

    // Assert
    expect(tasksServiceMock.findAll).toHaveBeenCalledTimes(1);
    expect(Array.isArray(result)).toBe(true);
    expect(result).toHaveLength(multipleTasks.length);
    expect(result).toEqual(multipleTasks);
  });
});
