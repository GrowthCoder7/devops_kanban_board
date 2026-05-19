import React, { useState, useEffect } from 'react';
import './App.css';

interface Task {
  _id: string;
  title: string;
  description?: string;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
  createdAt?: string;
}

function App() {
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

  const updateTaskStatus = async (id: string, nextStatus: 'TODO' | 'IN_PROGRESS' | 'DONE'): Promise<void> => {
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

  // --- HTML5 Drag & Drop Logic API ---
  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('text/plain', id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); // Required to allow a drop event to fire
  };

  const handleDrop = async (e: React.DragEvent, targetStatus: 'TODO' | 'IN_PROGRESS' | 'DONE') => {
    const id = e.dataTransfer.getData('text/plain');
    if (id) {
      await updateTaskStatus(id, targetStatus);
    }
  };

  // --- Analytical Calculations ---
  const todoCount = tasks.filter(t => t.status === 'TODO').length;
  const progressCount = tasks.filter(t => t.status === 'IN_PROGRESS').length;
  const doneCount = tasks.filter(t => t.status === 'DONE').length;

  return (
    <div className="container">
      <header>
        <div>
          <h1>⚙️ Enterprise DevOps Pipeline Dashboard</h1>
          <p style={{ margin: "5px 0 0 0", opacity: 0.7, fontSize: "14px" }}>Multi-stage TypeScript Compilation Blueprint</p>
        </div>
        <span className="badge">Production Live</span>
      </header>

      {/* Analytics Dashboard Strip */}
      <div className="metrics-bar">
        <div className="metric-card">
          <span className="metric-num">{tasks.length}</span>
          <span className="metric-label">Total Scope</span>
        </div>
        <div className="metric-card border-todo">
          <span className="metric-num">{todoCount}</span>
          <span className="metric-label">Backlog</span>
        </div>
        <div className="metric-card border-progress">
          <span className="metric-num">{progressCount}</span>
          <span className="metric-label">Active Sprints</span>
        </div>
        <div className="metric-card border-done">
          <span className="metric-num">{doneCount}</span>
          <span className="metric-label">Shipped Code</span>
        </div>
      </div>

      <form onSubmit={addTask} className="task-form">
        <h3>Create Core Requirement Task</h3>
        <div className="form-inputs">
          <input 
            type="text" 
            placeholder="What needs to be engineered?..." 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
          />
          <input 
            type="text" 
            placeholder="Add technical specification context..." 
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
          />
          <button type="submit">+ Commit Task</button>
        </div>
      </form>

      {/* Kanban Drag Matrix Grid */}
      <div className="board">
        {(['TODO', 'IN_PROGRESS', 'DONE'] as const).map((statusColumn) => (
          <div 
            key={statusColumn} 
            className="column"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, statusColumn)}
          >
            <h2>
              {statusColumn === 'TODO' && '📋 Backlog'}
              {statusColumn === 'IN_PROGRESS' && '⚡ In Development'}
              {statusColumn === 'DONE' && '✅ Production Ready'}
              <span className="col-count">
                {statusColumn === 'TODO' && todoCount}
                {statusColumn === 'IN_PROGRESS' && progressCount}
                {statusColumn === 'DONE' && doneCount}
              </span>
            </h2>
            
            <div className="card-container">
              {tasks
                .filter((task) => task.status === statusColumn)
                .map((task) => (
                  <div 
                    key={task._id} 
                    className="card"
                    draggable
                    onDragStart={(e) => handleDragStart(e, task._id)}
                  >
                    <div className="drag-handle">⋮⋮</div>
                    <h3>{task.title}</h3>
                    <p>{task.description}</p>
                    <div className="actions">
                      <div className="nav-arrows">
                        {task.status !== 'TODO' && (
                          <button onClick={() => updateTaskStatus(task._id, task.status === 'DONE' ? 'IN_PROGRESS' : 'TODO')}>◀</button>
                        )}
                        {task.status !== 'DONE' && (
                          <button onClick={() => updateTaskStatus(task._id, task.status === 'TODO' ? 'IN_PROGRESS' : 'DONE')}>▶</button>
                        )}
                      </div>
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