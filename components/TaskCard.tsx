'use client';

import React, { useState } from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { editTask, removeTask } from '@/lib/features/tasks/tasksSlice';
import type { Task } from '@/types/types';
import { format } from 'date-fns';

interface TaskCardProps {
  task: Task;
  index: number;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, index }) => {
  const dispatch = useAppDispatch();
  const { token } = useAppSelector((state) => state.auth);
  const [isEditing, setIsEditing] = useState(false);
  const [currentTask, setCurrentTask] = useState<Task>(task);
  const [error, setError] = useState<string | null>(null);

  const formatDateTime = (iso: string) => {
    try {
      return format(new Date(iso), 'PPpp');
    } catch {
      return iso;
    }
  };

  const handleDelete = () => {
    if (!token) return;
    dispatch(removeTask({ token, taskId: task.id }));
  };

  const handleEditSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    const { title, description, status, deadline } = currentTask;
    const updatedFields: Partial<Omit<Task, 'id' | 'user_id' | 'created_at' | 'updated_at'>> = {
      title: title.trim(),
      description: description?.trim() || null,
      status,
      deadline,
    };

    try {
      const response = await dispatch(
        editTask({ token, taskId: task.id, updatedFields })
      ).unwrap();
      setCurrentTask(response);
      setIsEditing(false);
    } catch (err) {
      setError(
        err && typeof err === 'object' && 'message' in err
          ? String((err as { message: unknown }).message)
          : 'An error occurred'
      );
    }
  };

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          className={`bg-white rounded-md shadow p-4 mb-4 transition-opacity ${
            snapshot.isDragging ? 'opacity-75' : 'opacity-100'
          }`}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          {isEditing ? (
            <form onSubmit={handleEditSave} className="space-y-3">
              {error && <p className="text-red-500 text-sm">{error}</p>}

              <div>
                <label className="block text-sm font-medium">Title</label>
                <input
                  type="text"
                  value={currentTask.title}
                  onChange={(e) =>
                    setCurrentTask({ ...currentTask, title: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Description</label>
                <textarea
                  value={currentTask.description ?? ''}
                  onChange={(e) =>
                    setCurrentTask({ ...currentTask, description: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Deadline</label>
                <input
                  type="datetime-local"
                  value={new Date(currentTask.deadline).toISOString().slice(0, 16)}
                  onChange={(e) =>
                    setCurrentTask({
                      ...currentTask,
                      deadline: new Date(e.target.value).toISOString(),
                    })
                  }
                  className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Status</label>
                <select
                  value={currentTask.status}
                  onChange={(e) =>
                    setCurrentTask({
                      ...currentTask,
                      status: e.target.value as Task['status'],
                    })
                  }
                  className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Ongoing Task">Ongoing Task</option>
                  <option value="Successful Task">Successful Task</option>
                  <option value="Failed Task">Failed Task</option>
                  <option value="Upcoming Task">Upcoming Task</option>
                </select>
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setCurrentTask(task); // reset to original on cancel
                  }}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-2">
              <div className="flex justify-between items-start">
                <h4 className="text-lg font-semibold">{currentTask.title}</h4>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-blue-600 hover:text-blue-800"
                    title="Edit"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={handleDelete}
                    className="text-red-600 hover:text-red-800"
                    title="Delete"
                  >
                    🗑️
                  </button>
                </div>
              </div>

              {currentTask.description && (
                <p className="text-gray-600 text-sm">{currentTask.description}</p>
              )}

              <p className="text-gray-500 text-xs">
                <strong>Start: </strong>
                {formatDateTime(currentTask.start_time)}
              </p>
              <p className="text-gray-500 text-xs">
                <strong>Deadline: </strong>
                {formatDateTime(currentTask.deadline)}
              </p>
              <span
                className={`inline-block px-2 py-1 text-xs font-semibold rounded ${
                  currentTask.status === 'Successful Task'
                    ? 'bg-green-100 text-green-800'
                    : currentTask.status === 'Failed Task'
                    ? 'bg-red-100 text-red-800'
                    : currentTask.status === 'Upcoming Task'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}
              >
                {currentTask.status}
              </span>
            </div>
          )}
        </div>
      )}
    </Draggable>
  );
};

export default TaskCard;
