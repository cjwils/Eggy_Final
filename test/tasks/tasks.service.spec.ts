// tests/tasks/tasks.service.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { NotFoundException } from '@nestjs/common';
import { TasksService } from '../../src/tasks/tasks.service';
import { Task } from '../../src/tasks/task.schema';

type MockModel = {
  find?: jest.Mock;
  findById?: jest.Mock;
  create?: jest.Mock;
  findByIdAndUpdate?: jest.Mock;
  findByIdAndDelete?: jest.Mock;
};

describe('TasksService', () => {
  let service: TasksService;

  const mockTaskModel: MockModel = {
    find: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
  };

  beforeEach(async () => {
    // reset mock implementations & call counts so tests are isolated
    jest.resetAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: getModelToken(Task.name), // matches @InjectModel(Task.name)
          useValue: mockTaskModel,
        },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
  });

  /* -------------------------
     findAll
     ------------------------- */
  it('findAll - returns empty array when none found', async () => {
    // mock find().sort().lean() -> []
    mockTaskModel.find!.mockImplementation(() => ({
      sort: () => ({ lean: () => Promise.resolve([]) }),
    }));

    const result = await service.findAll();
    expect(mockTaskModel.find).toHaveBeenCalledTimes(1);
    expect(result).toEqual([]);
  });

  it('findAll - returns array of tasks when present', async () => {
    const tasks = [
      { _id: '1', title: 'A', done: false },
      { _id: '2', title: 'B', done: true },
    ];
    mockTaskModel.find!.mockImplementation(() => ({
      sort: () => ({ lean: () => Promise.resolve(tasks) }),
    }));

    const result = await service.findAll();
    expect(mockTaskModel.find).toHaveBeenCalledTimes(1);
    expect(result).toEqual(tasks);
  });

  /* -------------------------
     findOne
     ------------------------- */
  it('findOne - returns a task when found', async () => {
    const task = { _id: 'abc', title: 'hello', done: false };
    mockTaskModel.findById!.mockImplementation(() => ({
      lean: () => Promise.resolve(task),
    }));

    const result = await service.findOne('abc');
    expect(mockTaskModel.findById).toHaveBeenCalledWith('abc');
    expect(result).toEqual(task);
  });

  it('findOne - throws NotFoundException when not found', async () => {
    mockTaskModel.findById!.mockImplementation(() => ({
      lean: () => Promise.resolve(null),
    }));

    await expect(service.findOne('missing-id')).rejects.toThrow(NotFoundException);
    expect(mockTaskModel.findById).toHaveBeenCalledWith('missing-id');
  });

  /* -------------------------
     create
     ------------------------- */
  it('create - creates a task and returns plain object (toObject)', async () => {
    const input = { title: 'New', description: 'desc' };
    const saved = { _id: 'created-id', title: input.title, description: input.description, done: false };

    // create(...) resolves to a "document" with toObject()
    mockTaskModel.create!.mockResolvedValueOnce({
      toObject: () => saved,
    });

    const result = await service.create(input as any);
    expect(mockTaskModel.create).toHaveBeenCalledWith(input);
    expect(result).toEqual(saved);
  });

  /* -------------------------
     update
     ------------------------- */
  it('update - returns updated task when found', async () => {
    const id = 'upd-id';
    const input = { title: 'updated', done: true };
    const updated = { _id: id, title: input.title, done: input.done };

    mockTaskModel.findByIdAndUpdate!.mockImplementation(() => ({
      lean: () => Promise.resolve(updated),
    }));

    const result = await service.update(id, input as any);
    expect(mockTaskModel.findByIdAndUpdate).toHaveBeenCalledWith(id, input, {
      new: true,
      runValidators: true,
    });
    expect(result).toEqual(updated);
  });

  it('update - throws NotFoundException when not found', async () => {
    const id = 'nope';
    const input = { title: 'x' };

    mockTaskModel.findByIdAndUpdate!.mockImplementation(() => ({
      lean: () => Promise.resolve(null),
    }));

    await expect(service.update(id, input as any)).rejects.toThrow(NotFoundException);
    expect(mockTaskModel.findByIdAndUpdate).toHaveBeenCalledWith(id, input, {
      new: true,
      runValidators: true,
    });
  });

  /* -------------------------
     remove
     ------------------------- */
  it('remove - deletes a task when found', async () => {
    const id = 'del-1';
    mockTaskModel.findByIdAndDelete!.mockImplementation(() => ({
      lean: () => Promise.resolve({ _id: id }),
    }));

    // should resolve (service returns nothing)
    await expect(service.remove(id)).resolves.toBeUndefined();
    expect(mockTaskModel.findByIdAndDelete).toHaveBeenCalledWith(id);
  });

  it('remove - throws NotFoundException when not found', async () => {
    const id = 'no-such';
    mockTaskModel.findByIdAndDelete!.mockImplementation(() => ({
      lean: () => Promise.resolve(null),
    }));

    await expect(service.remove(id)).rejects.toThrow(NotFoundException);
    expect(mockTaskModel.findByIdAndDelete).toHaveBeenCalledWith(id);
  });
});
