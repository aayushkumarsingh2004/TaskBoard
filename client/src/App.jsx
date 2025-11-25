import { useState, useEffect } from 'react'
import './App.css'

// ⚠️ This is the link to your Live Cloud Backend
const API_BASE = "https://taskboard-stzp.onrender.com";

function App() {
  const [tasks, setTasks] = useState([])
  const [newTask, setNewTask] = useState("")

  // 1. FETCH DATA
  useEffect(() => {
    fetch(`${API_BASE}/tasks`)
      .then(response => response.json())
      .then(data => setTasks(data))
      .catch(error => console.error("Error fetching tasks:", error));
  }, []);

  // 2. ADD TASK
  const addTask = () => {
    if (newTask === "") return;
    const taskObject = { id: Date.now(), title: newTask, status: "To Do" };

    fetch(`${API_BASE}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(taskObject)
    })
    .then(response => response.json())
    .then(data => {
      setTasks([...tasks, data]); 
      setNewTask("");
    });
  }

  // 3. DELETE TASK
  const deleteTask = (id) => {
    // Update UI immediately
    setTasks(tasks.filter(task => task.id !== id));

    // Tell Server to delete
    fetch(`${API_BASE}/tasks/${id}`, {
      method: 'DELETE',
    });
  }

  // 4. DRAG AND DROP
  const handleDragStart = (e, taskId) => {
    e.dataTransfer.setData("taskId", taskId);
  }

  const handleDragOver = (e) => e.preventDefault();

  const handleDrop = (e, newStatus) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("taskId");
    
    const updatedTasks = tasks.map(task => {
      if (task.id.toString() === taskId.toString()) {
        return { ...task, status: newStatus };
      }
      return task;
    });
    setTasks(updatedTasks);

    fetch(`${API_BASE}/tasks/${taskId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    });
  }

  // Helper to render a card
  const renderCard = (task) => (
    <div 
      key={task.id} 
      className="card" 
      draggable 
      onDragStart={(e) => handleDragStart(e, task.id)}
    >
      <span>{task.title}</span>
      <span 
        className="delete-btn" 
        onClick={() => deleteTask(task.id)}
      >
        ❌
      </span>
    </div>
  );

  return (
    <div className="app-container">
      <h1>My Full Stack Board</h1>
      
      <div className="controls">
        <input 
          type="text" 
          placeholder="Type a new task..." 
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)} 
        />
        <button onClick={addTask}>Add +</button>
      </div>

      <div className="board">
        <div className="column" onDragOver={handleDragOver} onDrop={(e) => handleDrop(e, "To Do")}>
          <h3>To Do</h3>
          {tasks.filter(task => task.status === "To Do").map(task => renderCard(task))}
        </div>

        <div className="column" onDragOver={handleDragOver} onDrop={(e) => handleDrop(e, "Doing")}>
          <h3>Doing</h3>
          {tasks.filter(task => task.status === "Doing").map(task => renderCard(task))}
        </div>

        <div className="column" onDragOver={handleDragOver} onDrop={(e) => handleDrop(e, "Done")}>
          <h3>Done</h3>
          {tasks.filter(task => task.status === "Done").map(task => renderCard(task))}
        </div>
      </div>
    </div>
  )
}

export default App