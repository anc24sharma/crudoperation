import React, { useState, useEffect } from 'react';
import { Task } from './types';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import UserDropdown from './components/UserDropdown';
import { ClipboardList } from 'lucide-react';

function App() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  const [editingTask, setEditingTask] = useState<Task | undefined>();

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const handleAddTask = (newTask: Omit<Task, 'id'>) => {
    if (editingTask) {
      setTasks(
        tasks.map((task) =>
          task.id === editingTask.id
            ? { ...task, ...newTask }
            : task
        )
      );
      setEditingTask(undefined);
    } else {
      const task: Task = {
        ...newTask,
        id: Date.now().toString(),
      };
      setTasks([...tasks, task]);
    }
  };

  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const handleStatusChange = (id: string, status: Task['status']) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, status } : task
      )
    );
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <ClipboardList className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Task Manager</h1>
          </div>
          <UserDropdown />
        </div>
        
        <div className="space-y-8">
          <TaskForm 
            onSubmit={handleAddTask}
            editingTask={editingTask}
          />
          
          <TaskList
            tasks={tasks}
            onDelete={handleDeleteTask}
            onStatusChange={handleStatusChange}
            onEdit={handleEditTask}
          />
        </div>
      </div>
    </div>
  );
}

export default App;