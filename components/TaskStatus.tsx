"use client";
import { useState } from 'react';
import TaskBucket from './TaskBucket';
import React from "react";
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { Task } from '@/types/types';



interface TaskStatusProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}

const TaskStatus: React.FC<TaskStatusProps> = ({ tasks, setTasks }) => {

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;
    
    if (source.droppableId === destination.droppableId) return;

    const taskToUpdate = tasks.find(task => task.id === draggableId);
    if (!taskToUpdate) return;

    const statusMap: Record<string, Task['status']> = {
      upcoming: "Upcoming Task",
      ongoing: "Ongoing Task",
      failure: "Failed Task",
      success: "Successful Task"
    };

    const updatedTask: Task = {
      ...taskToUpdate,
      status: statusMap[destination.droppableId]
    };

    setTasks(tasks.map(task => 
      task.id === draggableId ? updatedTask : task
    ));
  };

  const categorizedTasks = {
    
    upcoming: tasks.filter(task => new Date(task.start_time) > new Date() && task.status === 'Upcoming Task'),
    ongoing: tasks.filter(task => new Date(task.start_time) <= new Date() && task.status === 'Ongoing Task'),
    success: tasks.filter(task => task.status === 'Successful Task'),
    failure: tasks.filter(task => task.status === 'Failed Task'),
  };
  return (
     <DragDropContext onDragEnd={handleDragEnd}>
          <div className="flex flex-col md:flex-row md:justify-between gap-4 p-4">
            <TaskBucket
              title="Upcoming Tasks"
              tasks={categorizedTasks.upcoming}
              droppableId="upcoming"
              color="yellow"
            />
            <TaskBucket
              title="Ongoing Tasks"
              tasks={categorizedTasks.ongoing}
              droppableId="ongoing"
              color="blue"
            />
            <TaskBucket
              title="Failed Tasks"
              tasks={categorizedTasks.failure}
              droppableId="failure"
              color="red"
            />
            <TaskBucket
              title="Success Tasks"
              tasks={categorizedTasks.success}
              droppableId="success"
              color="green"
            />
          </div>
        </DragDropContext>
  );
};

export default TaskStatus;
