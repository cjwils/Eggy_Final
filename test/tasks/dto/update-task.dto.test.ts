// tests/tasks/dto/update-task.dto.spec.ts
import { z } from 'zod';
import { UpdateTaskSchema } from '../../../src/tasks/dto/update-task.dto';
import { CreateTaskSchema } from '../../../src/tasks/dto/create-task.dto';

describe('UpdateTaskDto (Zod schema)', () => {
  it('accepts a full valid payload (same rules as create + optional done)', () => {
    const data = {
      title: 'Updated title',
      description: 'Updated description',
      done: true,
    };
    const result = UpdateTaskSchema.safeParse(data);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toMatchObject(data);
    }
  });

  it('accepts partial payloads (all fields optional)', () => {
    const cases = [
      { title: 'Only title' },
      { description: 'Only desc' },
      { done: false },
      {}, // empty update should be allowed because schema is .partial()
    ];

    for (const data of cases) {
      const result = UpdateTaskSchema.safeParse(data);
      expect(result.success).toBe(true);
    }
  });

  it('rejects when title (if present) is longer than 80 characters', () => {
    const data = { title: 'a'.repeat(81) };
    const result = UpdateTaskSchema.safeParse(data);
    expect(result.success).toBe(false);
    if (!result.success) {
      const titleIssues = result.error.issues.filter((i) => i.path[0] === 'title');
      expect(titleIssues.length).toBeGreaterThan(0);
      expect(titleIssues[0].message).toMatch(/Keep the title under 80 characters/);
    }
  });

  it('rejects when description (if present) is longer than 200 characters', () => {
    const data = { description: 'x'.repeat(201) };
    const result = UpdateTaskSchema.safeParse(data);
    expect(result.success).toBe(false);
    if (!result.success) {
      const descIssues = result.error.issues.filter((i) => i.path[0] === 'description');
      expect(descIssues.length).toBeGreaterThan(0);
      expect(descIssues[0].message).toMatch(/Description should be short/);
    }
  });

  it('rejects when done (if present) is not boolean', () => {
    const data = { done: 'not-a-boolean' };
    const result = UpdateTaskSchema.safeParse(data);
    expect(result.success).toBe(false);
    if (!result.success) {
      const doneIssues = result.error.issues.filter((i) => i.path[0] === 'done');
      expect(doneIssues.length).toBeGreaterThan(0);
      // Default zod message for boolean mismatch exists, check presence
      expect(doneIssues[0].message.length).toBeGreaterThan(0);
    }
  });

  it('behaves consistently with CreateTaskSchema for shared fields', () => {
    // ensure create and update share the same constraints for title/description
    const badCreate = { title: 'a'.repeat(81) };
    const badUpdate = { title: 'a'.repeat(81) };

    const r1 = CreateTaskSchema.safeParse(badCreate);
    const r2 = UpdateTaskSchema.safeParse(badUpdate);
    expect(r1.success).toBe(false);
    expect(r2.success).toBe(false);

    // both should contain a title-related issue
    if (!r1.success) {
      const titleIssues1 = r1.error.issues.filter((i) => i.path[0] === 'title');
      expect(titleIssues1.length).toBeGreaterThan(0);
    }
    if (!r2.success) {
      const titleIssues2 = r2.error.issues.filter((i) => i.path[0] === 'title');
      expect(titleIssues2.length).toBeGreaterThan(0);
    }
  });
});
