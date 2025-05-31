// lib/api/tasksAPI.ts
import type { Task, TaskInput } from '@/types/types';

// NEXT_PUBLIC_API_BASE_URL को .env.local / .env में सेट करें, जैसे:
// NEXT_PUBLIC_API_BASE_URL=http://localhost:4000/api
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';

/**
 * Fetch all tasks for the authenticated user.
 * GET /api/tasks
 */
export async function fetchTasks(token: string): Promise<Task[]> {
  const res = await fetch(`${BASE_URL}/task/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(errorBody.error || 'Failed to fetch tasks');
  }
  const data = (await res.json()) as { tasks: Task[] };
  return data.tasks || [];
}

/**
 * Create a new task for the authenticated user.
 * POST /api/tasks
 *
 * अब यह फ़ंक्शन दो प्रकार की बॉडी स्वीकारेगा:
 * 1) Simple Type:  { type: 'simple', textInput: string }
 * 2) Custom Type:  { type: 'custom', title: string, description?: string, start_time?: string, deadline: string }
 *
 * @param token    JWT token string
 * @param payload  Simple or Custom task payload
 * @returns        Promise resolving to the newly created Task
 */
export async function createTask(
  token: string,
  payload: 
    | { type: 'simple'; textInput: string }
    | ({ type: 'custom' } & TaskInput)
): Promise<Task> {
  const res = await fetch(`${BASE_URL}/tasks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(errorBody.error || 'Failed to create task');
  }
  const data = (await res.json()) as { task: Task };
  return data.task;
}

/**
 * Update an existing task (complete replace of provided fields).
 * PUT /api/tasks/:id
 */
export async function updateTask(
  token: string,
  taskId: string,
  updatedFields: Partial<Omit<Task, 'id' | 'user_id' | 'created_at' | 'updated_at'>>
): Promise<Task> {
  const res = await fetch(`${BASE_URL}/tasks/${taskId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(updatedFields),
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(errorBody.error || 'Failed to update task');
  }

  const data = (await res.json()) as { task: Task };
  return data.task;
}

/**
 * Update only the status of a task.
 * PATCH /api/tasks/:id/status
 */
export async function updateTaskStatus(
  token: string,
  taskId: string,
  newStatus: string
): Promise<Task> {
  const res = await fetch(`${BASE_URL}/tasks/${taskId}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status: newStatus }),
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(errorBody.error || 'Failed to update task status');
  }

  const data = (await res.json()) as { task: Task };
  return data.task;
}

/**
 * Delete a task.
 * DELETE /api/tasks/:id
 */
export async function deleteTask(
  token: string,
  taskId: string
): Promise<{ message: string }> {
  const res = await fetch(`${BASE_URL}/tasks/${taskId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(errorBody.error || 'Failed to delete task');
  }

  return (await res.json()) as { message: string };
}
