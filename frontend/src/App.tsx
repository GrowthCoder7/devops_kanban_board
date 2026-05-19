import React, { useState, useEffect } from 'react';
import './App.css';

// Define the TypeScript schema for our MongoDB Task data
interface Task {
  _id: string;
  title: string;
  description?: string;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
  createdAt?: string;
  updatedAt?: string;
}

function App() {
  // Strongly type our state hooks
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');

  const API_URL = '/api/tasks';

  const fetchTasks = async (): Promise<void> => {
    try {
      const res = await fetch(API_URL);
      const data: Task[] = await res.json();
      setTasks(data);
    } catch (err) {
      console.error('Error fetching tasks:', err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const addTask = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (!title) return alert('Task title is required');
    
    await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description }),
    });
    setTitle('');
    setDescription('');
    fetchTasks();
  };

  const moveTask = async (id: string, currentStatus: 'TODO' | 'IN_PROGRESS' | 'DONE'): Promise<void> => {
    const nextStatus: 'TODO' | 'IN_PROGRESS' | 'DONE' = currentStatus === 'TODO' ? 'IN_PROGRESS' : 'DONE';
    await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: nextStatus }),
    });
    fetchTasks();
  };

  const deleteTask = async (id: string): Promise<void> => {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    fetchTasks();
  };

  return (
    <div className="container">
      <header>
        <h1>⚛️ TypeScript DevOps Kanban</h1>
        <span className="badge">Production Live</span>
      </header>

      <form onSubmit={addTask} className="task-form">
        <h3>Create New Task</h3>
        <input 
          type="text" 
          placeholder="Task Title..." 
          value={title} 
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)} 
        />
        <input 
          type="text" 
          placeholder="Task Description..." 
          value={description} 
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDescription(e.target.value)} 
        />
        <button type="submit">Add Task</button>
      </form>

      <div className="board">
        {(['TODO', 'IN_PROGRESS', 'DONE'] as const).map((statusColumn) => (
          <div key={statusColumn} className="column">
            <h2>{statusColumn.replace('_', ' ')}</h2>
            <div className="card-container">
              {tasks
                .filter((task) => task.status === statusColumn)
                .map((task) => (
                  <div key={task._id} className="card">
                    <h3>{task.title}</h3>
                    <p>{task.description}</p>
                    <div className="actions">
                      {task.status !== 'DONE' && (
                        <button onClick={() => moveTask(task._id, task.status)}>➡ Move</button>
                      )}
                      <button className="delete-btn" onClick={() => deleteTask(task._id)}>🗑</button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;