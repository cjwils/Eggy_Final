// tests/tasks/dto/create-task.dto.spec.ts
import { z } from 'zod';
import { CreateTaskSchema } from '../../../src/tasks/dto/create-task.dto';

describe('CreateTaskDto (Zod schema)', () => {
  it('accepts a valid payload', () => {
    const data = {
      title: 'A valid title',
      description: 'Some short description',
    };

    const result = CreateTaskSchema.safeParse(data);
    expect(result.success).toBe(true);
    if (result.success) {
      // the parsed value should match input (no extra fields)
      expect(result.data).toMatchObject(data);
    }
  });

  it('rejects when title is missing', () => {
    const data = { description: 'no title' };
    const result = CreateTaskSchema.safeParse(data);
    expect(result.success).toBe(false);
    if (!result.success) {
      // check at least one issue references title required / min length
      const issues = result.error.issues.map((i) => i.message);
      expect(issues.join(',')).toMatch(/Title is required|Required/);
    }
  });

  it('rejects when title is empty string', () => {
    const data = { title: '', description: 'desc' };
    const result = CreateTaskSchema.safeParse(data);
    expect(result.success).toBe(false);
    if (!result.success) {
      const issues = result.error.issues.map((i) => i.message);
      expect(issues.join(',')).toMatch(/Title is required/);
    }
  });

  it('rejects when title is longer than 80 characters', () => {
    const data = {
      title: 'a'.repeat(81),
      description: 'desc',
    };
    const result = CreateTaskSchema.safeParse(data);
    expect(result.success).toBe(false);
    if (!result.success) {
      // find the specific issue for title length
      const titleIssues = result.error.issues.filter((i) => i.path[0] === 'title');
      expect(titleIssues.length).toBeGreaterThan(0);
      expect(titleIssues[0].message).toMatch(/Keep the title under 80 characters/);
    }
  });

  it('rejects when description is longer than 200 characters', () => {
    const data = {
      title: 'Good title',
      description: 'x'.repeat(201),
    };
    const result = CreateTaskSchema.safeParse(data);
    expect(result.success).toBe(false);
    if (!result.success) {
      const descIssues = result.error.issues.filter((i) => i.path[0] === 'description');
      expect(descIssues.length).toBeGreaterThan(0);
      expect(descIssues[0].message).toMatch(/Description should be short/);
    }
  });

  it('allows missing description (optional)', () => {
    const data = { title: 'Title only' };
    const result = CreateTaskSchema.safeParse(data);
    expect(result.success).toBe(true);
    if (result.success) expect(result.data).toMatchObject({ title: 'Title only' });
  });
});
