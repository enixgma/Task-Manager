const API_URL = "http://localhost:5000/api/tasks";

// Get all tasks
export const getTasks = async () => {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error("Failed to fetch tasks");
    return await res.json();
  } catch (error) {
    console.error("getTasks error:", error);
    return []; 
  }
};

// Create task
export const createTask = async (task) => {
  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(task),
    });
    if (!res.ok) throw new Error("Failed to create task");
    return await res.json();
  } catch (error) {
    console.error("createTask error:", error);
    return null;
  }
};

// Update task
export const updateTask = async (id, task) => {
  try {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(task),
    });
    if (!res.ok) throw new Error("Failed to update task");
    return await res.json();
  } catch (error) {
    console.error("updateTask error:", error);
    return null;
  }
};

// Delete task
export const deleteTask = async (id) => {
  try {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete task");
    return await res.json();
  } catch (error) {
    console.error("deleteTask error:", error);
    return null;
  }
};

// Toggle status
export const toggleStatus = async (id, currentStatus, fetchTasks) => {
  try {
    let newStatus;
    if (currentStatus === "pending") newStatus = "completed";
    else if (currentStatus === "completed") newStatus = "pending";
    else newStatus = currentStatus; 

    await fetch(`${API_URL}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });

    if (fetchTasks) await fetchTasks(); 
  } catch (error) {
    console.error("toggleStatus error:", error);
  }
};
