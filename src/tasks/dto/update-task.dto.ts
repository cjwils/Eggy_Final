import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { CreateTaskSchema } from './create-task.dto';

export const UpdateTaskSchema = CreateTaskSchema.extend({
  done: z.boolean().optional(),
}).partial();

export class UpdateTaskDto extends createZodDto(UpdateTaskSchema) {}