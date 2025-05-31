// types.ts
export interface Task {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  start_time: string;   // ISO 8601 UTC
  deadline: string;     // ISO 8601 UTC
  status: 'Upcoming Task' | 'Ongoing Task' | 'Failed Task' | 'Successful Task';
  created_at: string;   // ISO 8601 UTC
  updated_at: string;   // ISO 8601 UTC
}

export interface TaskInput {
  title: string;
  description?: string | null;
  start_time?: string;   // ISO 8601 UTC (यदि पसंद हो तो nullable)
  deadline: string;      // ISO 8601 UTC
  status?: 'Upcoming Task' | 'Ongoing Task' | 'Failed Task' | 'Successful Task' | undefined;
}

export interface User {
  username: string;
  password: string;
  token: string;
  tasks: Task[];
}
