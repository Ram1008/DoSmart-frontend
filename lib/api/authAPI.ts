// api/authAPI.ts
import type { Task } from '@/types/types';

interface AuthResponse {
  token: string;
}

interface RegisterResponse {
  message: string;
  user: {
    id: string;
    username: string;
    created_at: string;
  };
}

interface LoginResponse {
  message: string;
  token: string;
}

interface UserResponse {
  tasks: Task[];
  // यदि बैकएंड में कभी /auth/me लौटाएगा, तो यहाँ और फील्ड्स जोड़ सकते हैं
}

// NOTE: replace this with your actual backend base URL
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';

/**
 * Signup Request (POST /api/auth/register)
 * Body: { username, password }
 * Response: { message, user: { id, username, created_at } }
 * Return: { username, token }
 *
 * हम signup के बाद सीधे login कर रहे हैं ताकि token मिल जाए
 */
export async function signupRequest(
  username: string,
  password: string
): Promise<{ username: string; token: string }> {
  // 1) Register API call
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) {
    const errorBody = await res.json();
    throw new Error(errorBody.error || 'Signup failed');
  }
  await res.json(); // हमें सिर्फ message देखना था, आगे login करेंगे

  // 2) तुरंत Login API call करके token ले लें
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

/**
 * Login Request (POST /api/auth/login)
 * Body: { username, password }
 * Response: { message, token }
 */
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

/**
 * Get User Info + Tasks
 * Calls GET /api/tasks with Authorization header
 * Response: { tasks: Task[] }
 */
export async function getUser(token: string): Promise<{ tasks: Task[] }> {
  const res = await fetch(`${BASE_URL}/tasks`, {
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
