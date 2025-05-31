
'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import CreateTask from '@/components/CreateTask';
import TaskStatus from '@/components/TaskStatus';
import { Task } from '@/types/types';
import { fetchTasks } from '@/lib/api/taskAPI';

const Home: React.FC = () => {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);

  const load = async (token: string | null) => {
      try {
        if(token){
          const fetched = await fetchTasks(token);
          setTasks(fetched);
        }else{
          router.replace('/login');
        }
      } catch (err) {
        if (err instanceof Error) {
          console.error('Error fetching tasks:', err.message);
        } else {
          console.error('Error fetching tasks:', err);
        }
        router.replace('/login');
      }
    };

  useEffect(() => {
    const token = typeof window !== "undefined" ? window.localStorage.getItem("token") : null;
    load(token);
  }, []);

  return (
    <div className="w-full h-full px-2 md:px-10 py-4">
      <section className="md:col-span-4">
        <CreateTask setTasks={setTasks} />
        <TaskStatus tasks={tasks} setTasks={setTasks} />
      </section>
    </div>
  );
};

export default Home;
