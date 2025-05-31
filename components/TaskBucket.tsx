"use client";
import React from 'react';
import { Droppable } from '@hello-pangea/dnd';
import TaskCard from './TaskCard';
import { Task } from '@/types/types';

interface TaskBucketProps {
  title: string;
  tasks: Task[];
  droppableId: string;
  color: 'blue' | 'yellow' | 'green' | 'red';
}

const TaskBucket: React.FC<TaskBucketProps> = ({ title, tasks, droppableId, color }) => {
  const getColorClasses = () => {
    switch (color) {
      case 'blue':
        return 'border-blue-600 bg-gradient-to-br from-blue-50 to-blue-100';
      case 'yellow':
        return 'border-yellow-600 bg-gradient-to-br from-yellow-50 to-yellow-100';
      case 'green':
        return 'border-green-600 bg-gradient-to-br from-green-50 to-green-100';
      case 'red':
        return 'border-red-600 bg-gradient-to-br from-red-50 to-red-100';
      default:
        return 'border-gray-600 bg-gradient-to-br from-gray-50 to-gray-100';
    }
  };

  const getHeaderColor = () => {
    switch (color) {
      case 'blue':
        return 'text-blue-700 bg-blue-600';
      case 'yellow':
        return 'text-yellow-700 bg-yellow-600';
      case 'green':
        return 'text-green-700 bg-green-600';
      case 'red':
        return 'text-red-700 bg-red-600';
      default:
        return 'text-gray-700 bg-gray-600';
    }
  };

  return (
    <div className={`rounded-lg border-2 ${getColorClasses()} max-w-[350px]`}>
      <div className={`${getHeaderColor()} text-white px-4 py-3 rounded-t-md font-semibold flex items-center justify-between`}>
        <span>{title}</span>
        <span className="bg-white bg-opacity-20 px-2 py-1 rounded-full text-sm">
          {tasks.length}
        </span>
      </div>
      
      <Droppable droppableId={droppableId}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`
              p-4 min-h-[150px] md:min-w-[220px] transition-colors duration-200
              ${snapshot.isDraggingOver ? 'bg-opacity-80' : ''}
            `}
          >
            {tasks.map((task, index) => (
              <TaskCard key={task.id} task={task} index={index} />
            ))}
            {provided.placeholder}
            
            {tasks.length === 0 && (
              <div className="text-center text-gray-500 mt-8">
                <div className="text-4xl mb-2">📝</div>
                <p>No tasks yet</p>
              </div>
            )}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default TaskBucket;
