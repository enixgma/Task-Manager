const API_URL = "http://localhost:5000/api/tasks";

// Get all tasks
export const getTasks = async () => {
  const res = await fetch(API_URL);
  return await res.json();
};

// Create task
export const createTask = async (task) => {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(task),
  });
  return await res.json();
};

// Update task
export const updateTask = async (id, task) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(task),
  });
  return await res.json();
};

// Delete task
export const deleteTask = async (id) => {
  const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  return await res.json();
};
const toggleStatus = async (id, currentStatus) => {
  let newStatus;
  if (currentStatus === 'pending') newStatus = 'completed';
  else if (currentStatus === 'completed') newStatus = 'pending';
  else newStatus = currentStatus; // keep in-progress as is

  await fetch(`/api/tasks/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: newStatus }),
  });

  fetchTasks(); // re-fetch tasks to update UI
};
