import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Task, TaskDocument } from './task.schema';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task.name)
    private readonly taskModel: Model<TaskDocument>,
  ) {}

  async findAll() {
    return this.taskModel.find().sort({ updatedAt: -1 }).lean();
  }

  async findOne(id: string) {
    const task = await this.taskModel.findById(id).lean();
    if (!task) throw new NotFoundException(`Task ${id} not found`);
    return task;
  }

  async create(input: CreateTaskDto) {
    const task = await this.taskModel.create(input);
    return task.toObject();
  }

  async update(id: string, input: UpdateTaskDto) {
    const task = await this.taskModel
      .findByIdAndUpdate(id, input, { new: true, runValidators: true })
      .lean();
    if (!task) throw new NotFoundException(`Task ${id} not found`);
    return task;
  }

  async remove(id: string) {
    const result = await this.taskModel.findByIdAndDelete(id).lean();
    if (!result) throw new NotFoundException(`Task ${id} not found`);
  }
}