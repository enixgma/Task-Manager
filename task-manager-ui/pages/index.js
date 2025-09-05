import { useEffect, useState } from "react";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} from "../services/api";
import styles from "./task.module.css";

const capitalizeWords = (str) =>
  str.replace(/\b\w/g, (char) => char.toUpperCase());

export default function Home() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("pending");
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    const res = await getTasks();
    setTasks(res);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      alert("Task cannot be empty!");
      return;
    }

    if (editId) {
      await updateTask(editId, { title: title.trim(), status });
      setEditId(null);
    } else {
      await createTask({ title: title.trim(), status });
    }

    setTitle("");
    setStatus("pending");
    loadTasks();
  };

  const handleEdit = (task) => {
    setTitle(task.title);
    setStatus(task.status);
    setEditId(task._id);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      await deleteTask(id);
      loadTasks();
    }
  };

  const counts = {
    pending: tasks.filter((t) => t.status === "pending").length,
    inProgress: tasks.filter((t) => t.status === "in progress").length,
    completed: tasks.filter((t) => t.status === "completed").length,
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesFilter = filter === "all" || task.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>
        <h2>Task Manager</h2>
        <ul>
          <li>
            <a href="#dashboard">Dashboard</a>
          </li>
          <li>
            <a href="#tasks">Tasks</a>
          </li>
        </ul>
      </aside>

      <main className={styles.mainContent}>
        <section id="dashboard" className={styles.dashboard}>
          <div className={`${styles.card} ${styles.pending}`}>
            Pending: {counts.pending}
          </div>
          <div className={`${styles.card} ${styles.inProgress}`}>
            In Progress: {counts.inProgress}
          </div>
          <div className={`${styles.card} ${styles.completed}`}>
            Completed: {counts.completed}
          </div>
        </section>

        <section id="tasks" className={styles.tasksSection}>
          <form onSubmit={handleSubmit} className={styles.formGroup}>
            <input
              type="text"
              placeholder="Enter task..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="pending">Pending</option>
              <option value="in progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
            <button type="submit">
              {editId ? "Update Task" : "Add Task"}
            </button>
          </form>

          <div className={styles.searchFilter}>
            <input
              type="text"
              placeholder="Search tasks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <select value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="in progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
            <button type="button">Search</button>
          </div>

          <div className={styles.taskTableWrapper}>
            <table className={styles.taskTable}>
              <thead>
                <tr>
                  <th>Task</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTasks.length > 0 ? (
                  filteredTasks.map((task) => (
                    <tr key={task._id}>
                      <td>{task.title}</td>
                      <td>
                        <span
                          className={`${styles.status} ${
                            styles[task.status.replace(" ", "")]
                          }`}
                        >
                          {capitalizeWords(task.status)}
                        </span>
                      </td>
                      <td>
                        <button onClick={() => handleEdit(task)}>Edit</button>
                        <button onClick={() => handleDelete(task._id)}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className={styles.noTasks}>
                      No tasks available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
