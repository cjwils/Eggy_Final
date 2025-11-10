import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const CreateTaskSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(80, 'Keep the title under 80 characters'),
  description: z
    .string()
    .max(200, 'Description should be short')
    .optional(),
});

export class CreateTaskDto extends createZodDto(CreateTaskSchema) {}