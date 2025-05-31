'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const customTaskSchema = z.object({
  title: z.string().nonempty('Title is required'),
  description: z.string().nonempty('Description is required'),
  startDate: z.string().nonempty('Start date is required'),
  startTime: z.string().nonempty('Start time is required'),
  deadline: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), {
      message: 'Deadline must be a valid ISO timestamp',
    })
});

type CustomTaskFormData = z.infer<typeof customTaskSchema>;

interface CustomTaskProps {
  onClose: () => void;
  onCreateCustom: (payload: {
    type: 'custom';
    title: string;
    description: string;
    start_time: string;
    deadline: string;
  }) => void;
}

const CustomTask: React.FC<CustomTaskProps> = ({ onClose, onCreateCustom }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CustomTaskFormData>({
    resolver: zodResolver(customTaskSchema),
    defaultValues: {
      title: '',
      description: '',
      startDate: '',
      startTime: '',
      deadline: '',
    },
  });

  const onSubmit = (data: CustomTaskFormData) => {
    // Combine date + time into ISO
    const start_time = new Date(`${data.startDate}T${data.startTime}`).toISOString();
    const payload = {
      type: 'custom' as const,
      title: data.title,
      description: data.description,
      start_time,
      deadline: new Date(data.deadline).toISOString(),
    };
    onCreateCustom(payload);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
        <h3 className="text-xl font-semibold mb-4">Create Custom Task</h3>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Title</label>
            <input
              type="text"
              {...register('title')}
              className="mt-1 w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium">Description</label>
            <textarea
              {...register('description')}
              className="mt-1 w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Start Date</label>
              <input
                type="date"
                {...register('startDate')}
                className="mt-1 w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.startDate && (
                <p className="text-red-500 text-sm mt-1">{errors.startDate.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium">Start Time</label>
              <input
                type="time"
                {...register('startTime')}
                className="mt-1 w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.startTime && (
                <p className="text-red-500 text-sm mt-1">{errors.startTime.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium">Deadline</label>
            <input
              type="datetime-local"
              {...register('deadline')}
              className="mt-1 w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.deadline && (
              <p className="text-red-500 text-sm mt-1">{errors.deadline.message}</p>
            )}
          </div>

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomTask;
