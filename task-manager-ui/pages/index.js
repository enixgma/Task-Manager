import { useEffect, useState } from "react";
import { getTasks, createTask, updateTask, deleteTask } from "../services/api";
import styles from "./task.module.css";

export default function Home() {
  const [tasks, setTasks] = useState([]);
  const [displayedTasks, setDisplayedTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [keyword, setKeyword] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Fetch all tasks
  const fetchTasks = async () => {
    const data = await getTasks();
    setTasks(data);
    setDisplayedTasks(data);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Add task
  const handleCreate = async () => {
    if (!title || !description) return;
    await createTask({ title, description, status: "pending" });
    setTitle("");
    setDescription("");
    fetchTasks();
  };

  // Update status
  const handleUpdateStatus = async (task) => {
    const nextStatus =
      task.status === "pending"
        ? "in-progress"
        : task.status === "in-progress"
        ? "completed"
        : "pending";
    await updateTask(task._id, { status: nextStatus });
    fetchTasks();
  };

  // Delete task
  const handleDelete = async (id) => {
    await deleteTask(id);
    fetchTasks();
  };

  // Apply search + filter
  const handleApply = () => {
    let filtered = tasks;

    if (keyword) {
      filtered = filtered.filter(
        (task) =>
          task.title.toLowerCase().includes(keyword.toLowerCase()) ||
          task.description.toLowerCase().includes(keyword.toLowerCase())
      );
    }

    if (statusFilter) {
      filtered = filtered.filter((task) => task.status === statusFilter);
    }

    setDisplayedTasks(filtered);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Task Manager</h1>

      {/* Add Task */}
      <div className={styles.formGroup}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button onClick={handleCreate}>Add</button>
      </div>

      {/* Search & Filter */}
      <div className={styles.formGroup}>
        <input
          type="text"
          placeholder="Search tasks..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="in-progress">In-Progress</option>
          <option value="completed">Completed</option>
        </select>
        <button onClick={handleApply}>Apply</button>
      </div>

      {/* Task List */}
      <div className={styles.taskGrid}>
        {displayedTasks.length === 0 && <p className="text-gray-400">No tasks found.</p>}
        {displayedTasks.map((task) => (
          <div key={task._id} className={styles.taskCard}>
            <div>
              <h2 className={task.status === "completed" ? "line-through" : ""}>
                {task.title}
              </h2>
              <p>{task.description}</p>
            </div>

            {/* Full width status */}
            <span className={`status ${task.status} ${styles.fullWidthStatus}`}>
              {task.status}
            </span>

            {/* Buttons */}
            <div className={styles.taskButtons}>
              <button onClick={() => handleUpdateStatus(task)}>Update Status</button>
              <button
                className={styles.deleteBtn}
                onClick={() => handleDelete(task._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
