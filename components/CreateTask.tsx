'use client';

import React, { useState } from 'react';
import QuickTask from './QuickTask';
import CustomTask from './CustomTask';
import type { Task, TaskInput } from '@/types/types';
import { useAppSelector } from '@/lib/hooks';
import { createTask as apiCreateTask } from '@/lib/api/taskAPI';

interface CreateTaskProps {
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}

const CreateTask: React.FC<CreateTaskProps> = ({setTasks }) => {
  const [quickTask, setQuickTask] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { token } = useAppSelector((state) => state.auth);

  const handleQuickSubmit = async (textInput: string) => {
    if (!token) return;

    try {
      // Call API with { type: 'simple', textInput }
      const created: Task = await apiCreateTask(token, { type: 'simple', textInput });
      setTasks((prev) => [created, ...prev]);
    } catch (err) {
      if (err instanceof Error) {
        console.error('Error creating quick task:', err.message);
      } else {
        console.error('Error creating quick task:', err);
      }
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

    const customPayload: TaskInput = {
      title: payload.title,
      description: payload.description,
      start_time: payload.start_time,
      deadline: payload.deadline
    };

    try {
      const created: Task = await apiCreateTask(token, { type: 'custom', ...customPayload });
      setTasks((prev) => [created, ...prev]);
    } catch (err) {
      if (err instanceof Error) {
        console.error('Error creating custom task:', err.message);
      } else {
        console.error('Error creating custom task:', err);
      }
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
