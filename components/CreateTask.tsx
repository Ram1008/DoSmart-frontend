'use client';

import React, { useState } from 'react';
import QuickTask from './QuickTask';
import CustomTask from './CustomTask';
import type { Task, TaskInput } from '@/types/types';
import { useAppSelector } from '@/lib/hooks';
import { createTask as apiCreateTask } from '@/lib/api/taskAPI';

interface CreateTaskProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}

const CreateTask: React.FC<CreateTaskProps> = ({ tasks, setTasks }) => {
  const [quickTask, setQuickTask] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { token } = useAppSelector((state) => state.auth);

  // Handler for quick (simple) tasks
  const handleQuickSubmit = async (textInput: string) => {
    if (!token) return;

    try {
      // Call API with { type: 'simple', textInput }
      const created: Task = await apiCreateTask(token, { type: 'simple', textInput });
      setTasks((prev) => [created, ...prev]);
    } catch (err: any) {
      console.error('Error creating quick task:', err.message);
    }
  };

  // Handler for custom tasks
  const handleCreateCustom = async (payload: {
    type: 'custom';
    title: string;
    description: string;
    start_time: string;
    deadline: string;
  }) => {
    if (!token) return;

    // Build TaskInput for API (TaskInput = { title, description?, start_time?, deadline, status? })
    // Map status to TaskInput status type
    

    const customPayload: TaskInput = {
      title: payload.title,
      description: payload.description,
      start_time: payload.start_time,
      deadline: payload.deadline
    };

    try {
      // Call API with { type: 'custom', ...customPayload }
      const created: Task = await apiCreateTask(token, { type: 'custom', ...customPayload });
      setTasks((prev) => [created, ...prev]);
    } catch (err: any) {
      console.error('Error creating custom task:', err.message);
    }
  };

  return (
    <div>
      <QuickTask
        quickTask={quickTask}
        setQuickTask={setQuickTask}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        onQuickSubmit={handleQuickSubmit}
      />

      {isModalOpen && (
        <CustomTask
          onClose={() => setIsModalOpen(false)}
          onCreateCustom={handleCreateCustom}
        />
      )}
    </div>
  );
};

export default CreateTask;
