import type { Task } from '@/types/types';

interface LoginResponse {
  message: string;
  token: string;
}

interface UserResponse {
  tasks: Task[];
}

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';

export async function signupRequest(
  username: string,
  password: string
): Promise<{ username: string; token: string }> {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) {
    const errorBody = await res.json();
    throw new Error(errorBody.error || 'Signup failed');
  }
  await res.json(); 
  
  const loginRes = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  if (!loginRes.ok) {
    const errorBody = await loginRes.json();
    throw new Error(errorBody.error || 'Login after signup failed');
  }
  const loginData: LoginResponse = await loginRes.json();
  return { username, token: loginData.token };
}

export async function loginRequest(
  username: string,
  password: string
): Promise<{ username: string; token: string }> {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) {
    const errorBody = await res.json();
    throw new Error(errorBody.error || 'Login failed');
  }
  const data: LoginResponse = await res.json();
  return { username, token: data.token };
}

export async function getUser(token: string): Promise<{ tasks: Task[] }> {
  const res = await fetch(`${BASE_URL}/task`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    const errorBody = await res.json();
    throw new Error(errorBody.error || 'Fetch user (tasks) failed');
  }
  const data: UserResponse = await res.json();
  return { tasks: data.tasks || [] };
}
