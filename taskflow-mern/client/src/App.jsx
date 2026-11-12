import { useEffect, useMemo, useState } from "react";

const API = `${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}/tasks`;

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadTasks() {
    try {
      setError("");
      const response = await fetch(API);
      if (!response.ok) throw new Error("Could not load tasks. Is the backend running?");
      setTasks(await response.json());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadTasks(); }, []);

  async function addTask(event) {
    event.preventDefault();
    if (!title.trim()) return;
    try {
      const response = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Could not add task.");
      setTasks(current => [data, ...current]);
      setTitle("");
      setDescription("");
      setError("");
    } catch (err) {
      setError(err.message);
    }
  }

  async function toggleTask(task) {
    try {
      const response = await fetch(`${API}/${task._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !task.completed })
      });
      const updated = await response.json();
      if (!response.ok) throw new Error(updated.message || "Update failed.");
      setTasks(current => current.map(item => item._id === task._id ? updated : item));
    } catch (err) { setError(err.message); }
  }

  async function deleteTask(id) {
    try {
      const response = await fetch(`${API}/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Could not delete task.");
      setTasks(current => current.filter(task => task._id !== id));
    } catch (err) { setError(err.message); }
  }

  const visibleTasks = useMemo(() => tasks.filter(task => {
    if (filter === "active") return !task.completed;
    if (filter === "completed") return task.completed;
    return true;
  }), [tasks, filter]);

  const completedCount = tasks.filter(task => task.completed).length;

  return (
    <main className="page">
      <header className="topbar">
        <a className="brand" href="#"><span className="brand-icon">✓</span> TaskFlow</a>
        <span className="top-note">Your day, organized.</span>
      </header>

      <section className="hero">
        <p className="eyebrow">PERSONAL PRODUCTIVITY</p>
        <h1>Make space for<br /><span>what matters.</span></h1>
        <p className="subtitle">A simple place to plan your work and track your progress.</p>
      </section>

      <section className="dashboard">
        <div className="stats">
          <div className="stat-card"><span>Total tasks</span><strong>{tasks.length}</strong></div>
          <div className="stat-card"><span>Completed</span><strong>{completedCount}</strong></div>
          <div className="stat-card"><span>Remaining</span><strong>{tasks.length - completedCount}</strong></div>
        </div>

        <form className="add-card" onSubmit={addTask}>
          <h2>Add a new task</h2>
          <input value={title} onChange={e => setTitle(e.target.value)}
            placeholder="What do you need to do?" maxLength="120" required />
          <textarea value={description} onChange={e => setDescription(e.target.value)}
            placeholder="Add a note (optional)" rows="2" />
          <button className="primary-btn" type="submit">+ Add task</button>
        </form>

        <section className="tasks-card">
          <div className="tasks-heading">
            <div><h2>Your tasks</h2><p>Keep moving, one task at a time.</p></div>
            <div className="filters" aria-label="Filter tasks">
              {["all", "active", "completed"].map(item =>
                <button key={item} type="button"
                  className={filter === item ? "filter active-filter" : "filter"}
                  onClick={() => setFilter(item)}>{item[0].toUpperCase() + item.slice(1)}</button>
              )}
            </div>
          </div>

          {error && <p className="error">{error}</p>}
          {loading ? <p className="empty">Loading tasks...</p> :
            visibleTasks.length === 0 ? <div className="empty">
              <span className="empty-icon">✦</span>
              <strong>No tasks here yet</strong>
              <span>Add a task above to get started.</span>
            </div> :
            <div className="task-list">
              {visibleTasks.map(task => <article className="task" key={task._id}>
                <button className={task.completed ? "check checked" : "check"}
                  onClick={() => toggleTask(task)} aria-label="Toggle task completion">
                  {task.completed ? "✓" : ""}
                </button>
                <div className="task-copy">
                  <h3 className={task.completed ? "done" : ""}>{task.title}</h3>
                  {task.description && <p>{task.description}</p>}
                  <small>{new Date(task.createdAt).toLocaleDateString()}</small>
                </div>
                <button className="delete-btn" onClick={() => deleteTask(task._id)}
                  aria-label={`Delete ${task.title}`}>Delete</button>
              </article>)}
            </div>
          }
        </section>
      </section>
      <footer>Built with React, Node.js, Express & MongoDB · TaskFlow</footer>
    </main>
  );
}
