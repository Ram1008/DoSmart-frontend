import type { Task, TaskInput } from '@/types/types';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';

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

export async function createTask(
  token: string,
  payload: 
    | { type: 'simple'; textInput: string }
    | ({ type: 'custom' } & TaskInput)
): Promise<Task> {
  const res = await fetch(`${BASE_URL}/task`, {
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

export async function updateTask(
  token: string,
  taskId: string,
  updatedFields: Partial<Omit<Task, 'id' | 'user_id' | 'created_at' | 'updated_at'>>
): Promise<Task> {
  const res = await fetch(`${BASE_URL}/task/${taskId}`, {
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

export async function updateTaskStatus(
  token: string,
  taskId: string,
  newStatus: string
): Promise<Task> {
  const res = await fetch(`${BASE_URL}/task/${taskId}/status`, {
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

export async function deleteTask(
  token: string,
  taskId: string
): Promise<{ message: string }> {
  const res = await fetch(`${BASE_URL}/task/${taskId}`, {
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
  const response = (await res.json()) || 'Task deleted successfully';
  return response.message;
}
