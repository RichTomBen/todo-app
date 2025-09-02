import { useState, useEffect } from "react";

function App() {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("tasks");
    return saved ? JSON.parse(saved) : [];
  });
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [filter, setFilter] = useState("all");

  // 🌙 THEME STATE
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("theme");
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem("theme", JSON.stringify(darkMode));
  }, [darkMode]);

  const addTask = () => {
    if (task.trim() === "") return;
    setTasks([...tasks, { id: Date.now(), text: task, completed: false }]);
    setTask("");
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  const toggleComplete = (id) => {
    setTasks(
      tasks.map((t) =>
        t.id === id ? { ...t, completed: !t.completed } : t
      )
    );
  };

  const startEditing = (id, currentText) => {
    setEditingId(id);
    setEditingText(currentText);
  };

  const saveEdit = (id) => {
    setTasks(
      tasks.map((t) =>
        t.id === id ? { ...t, text: editingText } : t
      )
    );
    setEditingId(null);
    setEditingText("");
  };

  const clearCompleted = () => {
    setTasks(tasks.filter((t) => !t.completed));
  };

  const filteredTasks = tasks.filter((t) => {
    if (filter === "active") return !t.completed;
    if (filter === "completed") return t.completed;
    return true;
  });

  // 🎨 THEME COLORS
  const colors = {
    background: darkMode ? "#1e1e1e" : "#f5f5f5",
    text: darkMode ? "#ffffff" : "#000000",
    buttonBg: darkMode ? "#333333" : "#e0e0e0",
    buttonHover: darkMode ? "#555555" : "#cccccc",
    inputBg: darkMode ? "#2a2a2a" : "#ffffff",
    inputBorder: darkMode ? "#555555" : "#999999",
  };

  const buttonStyle = {
    padding: "8px 14px",
    borderRadius: "6px",
    border: "none",
    cursor: "pointer",
    marginLeft: "6px",
    backgroundColor: colors.buttonBg,
    color: colors.text,
    transition: "all 0.2s ease, transform 0.15s ease", // smoother
    transform: "scale(1)", // default scale
  };

  // 🖌️ Hover effect (with scale)
  const applyHover = (e, hover) => {
    e.currentTarget.style.backgroundColor = hover
      ? colors.buttonHover
      : colors.buttonBg;
    e.currentTarget.style.transform = hover ? "scale(1.07)" : "scale(1)";
  };

  return (
    <div
      style={{
        textAlign: "center",
        minHeight: "100vh",
        padding: "20px",
        backgroundColor: colors.background,
        color: colors.text,
        transition: "all 0.3s ease",
      }}
    >
      <h1>My To-Do App</h1>

      {/* 🌙 THEME TOGGLE */}
      <button
        onClick={() => setDarkMode(!darkMode)}
        style={{
          ...buttonStyle,
          marginBottom: "20px",
        }}
        onMouseEnter={(e) => applyHover(e, true)}
        onMouseLeave={(e) => applyHover(e, false)}
      >
        {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
      </button>

      <div>
        <input
          type="text"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="Enter a task"
          style={{
            padding: "8px",
            borderRadius: "4px",
            border: `1px solid ${colors.inputBorder}`,
            marginRight: "10px",
            backgroundColor: colors.inputBg,
            color: colors.text,

          }}
        />
        <button
          onClick={addTask}
          style={buttonStyle}
          onMouseEnter={(e) => applyHover(e, true)}
          onMouseLeave={(e) => applyHover(e, false)}
        >
          Add
        </button>
      </div>

      <div style={{ margin: "20px" }}>
        <button
          onClick={() => setFilter("all")}
          style={{
            ...buttonStyle,
            fontWeight: filter === "all" ? "bold" : "normal",
          }}
          onMouseEnter={(e) => applyHover(e, true)}
          onMouseLeave={(e) => applyHover(e, false)}
        >
          All
        </button>
        <button
          onClick={() => setFilter("active")}
          style={{
            ...buttonStyle,
            fontWeight: filter === "active" ? "bold" : "normal",
          }}
          onMouseEnter={(e) => applyHover(e, true)}
          onMouseLeave={(e) => applyHover(e, false)}
        >
          Active
        </button>
        <button
          onClick={() => setFilter("completed")}
          style={{
            ...buttonStyle,
            fontWeight: filter === "completed" ? "bold" : "normal",
          }}
          onMouseEnter={(e) => applyHover(e, true)}
          onMouseLeave={(e) => applyHover(e, false)}
        >
          Completed
        </button>

        <button
          onClick={clearCompleted}
          style={{
            ...buttonStyle,
            marginLeft: "20px",
            color: "red",
          }}
          onMouseEnter={(e) => applyHover(e, true)}
          onMouseLeave={(e) => applyHover(e, false)}
        >
          Clear Completed
        </button>
      </div>

      <ul style={{ listStyle: "none", padding: 0 }}>
        <div style={{ marginTop: "20px" }}>
          <strong>{tasks.filter((t) => !t.completed).length}</strong>{" "}
          {tasks.filter((t) => !t.completed).length === 1 ? "task" : "tasks"} left
        </div>
        {filteredTasks.map((t) => (
          <li key={t.id} style={{ margin: "10px 0" }}>
            <input
              type="checkbox"
              checked={t.completed}
              onChange={() => toggleComplete(t.id)}
            />

            {editingId === t.id ? (
              <>
                <input
                  type="text"
                  value={editingText}
                  onChange={(e) => setEditingText(e.target.value)}
                  style={{
                    marginLeft: "10px",
                    padding: "6px",
                    borderRadius: "4px",
                    border: `1px solid ${colors.inputBorder}`,
                    backgroundColor: colors.inputBg,
                    color: colors.text,
                  }}
                />
                <button
                  onClick={() => saveEdit(t.id)}
                  style={{ ...buttonStyle, color: "lightgreen" }}
                  onMouseEnter={(e) => applyHover(e, true)}
                  onMouseLeave={(e) => applyHover(e, false)}
                >
                  Save
                </button>
              </>
            ) : (
              <>
                <span
                  style={{
                    textDecoration: t.completed ? "line-through" : "none",
                    marginLeft: "10px",
                  }}
                >
                  {t.text}
                </span>
                <button
                  onClick={() => startEditing(t.id, t.text)}
                  style={{ ...buttonStyle, color: "dodgerblue" }}
                  onMouseEnter={(e) => applyHover(e, true)}
                  onMouseLeave={(e) => applyHover(e, false)}
                >
                  Edit
                </button>
              </>
            )}

            <button
              onClick={() => deleteTask(t.id)}
              style={{ ...buttonStyle, color: "red" }}
              onMouseEnter={(e) => applyHover(e, true)}
              onMouseLeave={(e) => applyHover(e, false)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
