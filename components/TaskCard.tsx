// components/TaskCard.tsx
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
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description ?? '');
  const [status, setStatus] = useState(task.status);
  const [deadline, setDeadline] = useState(task.deadline);
  const [error, setError] = useState<string | null>(null);

  // Format date/time for display
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

    // Build updatedFields partial
    const updatedFields: Partial<Omit<Task, 'id' | 'user_id' | 'created_at' | 'updated_at'>> = {
      title: title.trim(),
      description: description.trim() || null,
      status,
      deadline,
    };

    try {
      await dispatch(editTask({ token, taskId: task.id, updatedFields })).unwrap();
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
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Deadline</label>
                <input
                  type="datetime-local"
                  value={new Date(deadline).toISOString().slice(0, 16)}
                  onChange={(e) => setDeadline(new Date(e.target.value).toISOString())}
                  className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as Task['status'])}
                  className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="ongoing">Ongoing Task</option>
                  <option value="success">Successful Task</option>
                  <option value="failure">Failed Task</option>
                </select>
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                onClick={(e) => handleEditSave(e)}
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
                <h4 className="text-lg font-semibold">{task.title}</h4>
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

              {task.description && (
                <p className="text-gray-600 text-sm">{task.description}</p>
              )}

              <p className="text-gray-500 text-xs">
                <strong>Start: </strong>
                {formatDateTime(task.start_time)}
              </p>
              <p className="text-gray-500 text-xs">
                <strong>Deadline: </strong>
                {formatDateTime(task.deadline)}
              </p>
              <p
                className={`inline-block px-2 py-1 text-xs font-semibold rounded ${
                  task.status === 'Successful Task'
                    ? 'bg-green-100 text-green-800'
                    : task.status === 'Failed Task'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}
              >
                {task.status === 'Ongoing Task'
                  ? 'Ongoing Task'
                  : task.status === 'Successful Task'
                  ? 'Successful Task'
                  : 'Failed Task'}
              </p>
            </div>
          )}
        </div>
      )}
    </Draggable>
  );
};

export default TaskCard;
