import React, { useState, useEffect } from 'react';
import './App.css';

// 1. Upgraded robust interface mapping enterprise issue schemas
interface Task {
  _id: string;
  title: string;
  description?: string;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  storyPoints: number;
  createdAt?: string;
}

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [priority, setPriority] = useState<'LOW' | 'MEDIUM' | 'HIGH'>('MEDIUM');
  const [storyPoints, setStoryPoints] = useState<number>(1);

  // Search and Filter States
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedPriorityFilter, setSelectedPriorityFilter] = useState<string>('ALL');

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
    
    // Injecting the new complex payload properties
    await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        title, 
        description, 
        priority, 
        storyPoints: Number(storyPoints) 
      }),
    });
    
    setTitle('');
    setDescription('');
    setPriority('MEDIUM');
    setStoryPoints(1);
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

  // HTML5 Native Drag & Drop Core Engine
  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('text/plain', id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent, targetStatus: 'TODO' | 'IN_PROGRESS' | 'DONE') => {
    const id = e.dataTransfer.getData('text/plain');
    if (id) {
      await updateTaskStatus(id, targetStatus);
    }
  };

  // --- Real-time Dynamic Data Transformation Matrix ---
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = 
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesPriority = 
      selectedPriorityFilter === 'ALL' || task.priority === selectedPriorityFilter;
    
    return matchesSearch && matchesPriority;
  });

  // --- Agile Velocity Aggregate Computations ---
  const totalBacklogPoints = tasks.filter(t => t.status === 'TODO').reduce((acc, curr) => acc + (curr.storyPoints || 0), 0);
  const totalProgressPoints = tasks.filter(t => t.status === 'IN_PROGRESS').reduce((acc, curr) => acc + (curr.storyPoints || 0), 0);
  const velocityShippedPoints = tasks.filter(t => t.status === 'DONE').reduce((acc, curr) => acc + (curr.storyPoints || 0), 0);

  return (
    <div className="app-viewport">
      <div className="dashboard-container">
        
        {/* Navigation / Header Brand Bar */}
        <header className="brand-header">
          <div className="brand-meta">
            <span className="platform-logo">◤</span>
            <div>
              <h1>LINEAR_DEVOPS_BOARD</h1>
              <p className="sub-title">System Runtime Execution Framework Matrix</p>
            </div>
          </div>
          <div className="status-cluster">
            <span className="pulse-indicator"></span>
            <span className="version-tag">v2.1.0-Production</span>
          </div>
        </header>

        {/* Global Control & Metrics Strip */}
        <section className="analytics-control-panel">
          <div className="metrics-grid">
            <div className="metric-tile text-todo">
              <span className="tile-label">Backlog Weight</span>
              <span className="tile-value">{totalBacklogPoints} <span className="unit">pts</span></span>
            </div>
            <div className="metric-tile text-progress">
              <span className="tile-label">Active Sprint Load</span>
              <span className="tile-value">{totalProgressPoints} <span className="unit">pts</span></span>
            </div>
            <div className="metric-tile text-done">
              <span className="tile-label">Velocity Shipped</span>
              <span className="tile-value">+{velocityShippedPoints} <span className="unit">pts</span></span>
            </div>
          </div>

          {/* Runtime Search & Filter Engine Component */}
          <div className="filter-toolbar">
            <div className="search-wrapper">
              <span className="search-icon">🔍</span>
              <input 
                type="text" 
                placeholder="Search issues by title or parameter spec..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="filter-group">
              <label>Priority Filter:</label>
              <select 
                value={selectedPriorityFilter} 
                onChange={(e) => setSelectedPriorityFilter(e.target.value)}
              >
                <option value="ALL">ALL LEVELS</option>
                <option value="HIGH">CRITICAL HIGH</option>
                <option value="MEDIUM">MEDIUM SCOPE</option>
                <option value="LOW">LOW PRIORITY</option>
              </select>
            </div>
          </div>
        </section>

        {/* Task Creation Matrix Console */}
        <section className="console-section">
          <form onSubmit={addTask} className="interactive-console-form">
            <div className="main-fields">
              <input 
                type="text" 
                className="input-primary"
                placeholder="Issue title (e.g., compile system runtime types...)" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
              />
              <input 
                type="text" 
                className="input-secondary"
                placeholder="Detailed description block..." 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
              />
            </div>
            
            <div className="metadata-fields">
              <div className="selector-block">
                <label>PRIORITY</label>
                <select value={priority} onChange={(e) => setPriority(e.target.value as any)}>
                  <option value="LOW">LOW</option>
                  <option value="MEDIUM">MEDIUM</option>
                  <option value="HIGH">HIGH</option>
                </select>
              </div>

              <div className="selector-block">
                <label>STORY_POINTS</label>
                <select value={storyPoints} onChange={(e) => setStoryPoints(Number(e.target.value))}>
                  <option value={1}>1 SP</option>
                  <option value={2}>2 SP</option>
                  <option value={3}>3 SP</option>
                  <option value={5}>5 SP</option>
                  <option value={8}>8 SP</option>
                </select>
              </div>

              <button type="submit" className="btn-submit-issue">Execute Issue Deploy ◤</button>
            </div>
          </form>
        </section>

        {/* Dynamic Kanban Matrix Structural Layout Grid */}
        <main className="kanban-matrix-grid">
          {(['TODO', 'IN_PROGRESS', 'DONE'] as const).map((columnKey) => {
            // Filter and sort tasks dynamically by Priority and Story Points
            const columnTasks = filteredTasks
              .filter(t => t.status === columnKey)
              .sort((a, b) => {
                const priorityWeights = { HIGH: 3, MEDIUM: 2, LOW: 1 };
                const weightA = priorityWeights[a.priority] || 2;
                const weightB = priorityWeights[b.priority] || 2;

                // Sort 1: Priority Tier Descending (High -> Medium -> Low)
                if (weightA !== weightB) {
                  return weightB - weightA;
                }
                // Sort 2: Story Points Descending (Highest point effort floats up)
                return b.storyPoints - a.storyPoints;
              });

            const columnSPTotal = columnTasks.reduce((acc, curr) => acc + (curr.storyPoints || 0), 0);
            
            return (
              <div 
                key={columnKey} 
                className={`matrix-column column-${columnKey.toLowerCase()}`}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, columnKey)}
              >
                <div className="column-header">
                  <div className="column-title-cluster">
                    <span className="column-dot"></span>
                    <h2>
                      {columnKey === 'TODO' && 'BACKLOG_BUFFER'}
                      {columnKey === 'IN_PROGRESS' && 'ACTIVE_SPRINT'}
                      {columnKey === 'DONE' && 'PROD_STABLE'}
                    </h2>
                    <span className="column-counter-badge">{columnTasks.length}</span>
                  </div>
                  <span className="column-weight-badge">{columnSPTotal} SP</span>
                </div>

                <div className="cards-scroll-container">
                  {columnTasks.map((task) => (
                    <div 
                      key={task._id} 
                      className={`issue-card border-${task.priority.toLowerCase()}`}
                      draggable
                      onDragStart={(e) => handleDragStart(e, task._id)}
                    >
                      <div className="card-top-row">
                        <span className={`priority-tag tag-${task.priority.toLowerCase()}`}>
                          {task.priority}
                        </span>
                        <span className="points-indicator">{task.storyPoints || 1} SP</span>
                      </div>

                      <h3 className="card-title">{task.title}</h3>
                      {task.description && <p className="card-description">{task.description}</p>}

                      <div className="card-action-footer">
                        <div className="manual-nav-arrows">
                          {task.status !== 'TODO' && (
                            <button className="nav-arrow-btn" onClick={() => updateTaskStatus(task._id, task.status === 'DONE' ? 'IN_PROGRESS' : 'TODO')}>◀</button>
                          )}
                          {task.status !== 'DONE' && (
                            <button className="nav-arrow-btn" onClick={() => updateTaskStatus(task._id, task.status === 'TODO' ? 'IN_PROGRESS' : 'DONE')}>▶</button>
                          )}
                        </div>
                        <button className="issue-delete-btn" onClick={() => deleteTask(task._id)}>✕ Remove</button>
                      </div>
                    </div>
                  ))}

                  {columnTasks.length === 0 && (
                    <div className="empty-column-placeholder">
                      <span className="placeholder-icon">🫙</span>
                      <p>No Active Line Items</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </main>

      </div>
    </div>
  );
}

export default App;