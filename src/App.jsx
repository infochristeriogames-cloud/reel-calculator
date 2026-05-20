import { useState, useEffect } from "react";

export default function App() {
  // =====================
  // 🌙 DARK MODE
  // =====================
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  // =====================
  // 🔐 AUTH
  // =====================
  const [isAdmin, setIsAdmin] = useState(false);
  const [password, setPassword] = useState("");

  // =====================
  // 📦 MATERIALS
  // =====================
  const [materials, setMaterials] = useState(() => {
    const saved = localStorage.getItem("materials");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("materials", JSON.stringify(materials));
  }, [materials]);

  // =====================
  // 🧮 CALCULATOR
  // =====================
  const [selected, setSelected] = useState("");
  const [weight, setWeight] = useState("");
  const [result, setResult] = useState("");

  // =====================
  // 🎨 STYLES
  // =====================
  const styles = {
    page: {
      background: darkMode ? "#121212" : "#ffffff",
      color: darkMode ? "#ffffff" : "#000000",
      minHeight: "100vh",
      padding: "20px",
    },
    input: {
      background: darkMode ? "#1e1e1e" : "#f2f2f2",
      color: darkMode ? "#fff" : "#000",
      border: "1px solid #555",
      padding: "6px",
      margin: "5px",
    },
    topBar: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "15px",
    },
  };

  // =====================
  // 🔐 LOGIN
  // =====================
  function handleLogin() {
    if (password === "admin123") {
      setIsAdmin(true);
      setPassword("");
    } else {
      alert("Wrong password");
    }
  }

  function handleLogout() {
    setIsAdmin(false);
  }

  // =====================
  // 🧮 CALCULATE
  // =====================
  function calculate() {
    const mat = materials.find((m) => m.name === selected);
    if (!mat) return;

    setResult(Number(weight) * mat.factor);
  }

  // =====================
  // 🧑‍💻 ADMIN PANEL
  // =====================
  function AdminPanel() {
    const [newName, setNewName] = useState("");
    const [newFactor, setNewFactor] = useState("");

    function addMaterial() {
      if (!newName || !newFactor) return;

      setMaterials([
        ...materials,
        {
          name: newName,
          factor: parseFloat(newFactor),
        },
      ]);

      setNewName("");
      setNewFactor("");
    }

    function deleteMaterial(index) {
      setMaterials(materials.filter((_, i) => i !== index));
    }

    return (
      <div>
        <h2>Admin Panel 🔧</h2>

        <button onClick={handleLogout}>Logout</button>

        <hr />

        <h3>Add Material</h3>

        <input
          style={styles.input}
          placeholder="Material name"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />

        <input
          style={styles.input}
          type="number"
          placeholder="Factor (m/kg)"
          value={newFactor}
          onChange={(e) => setNewFactor(e.target.value)}
        />

        <button onClick={addMaterial}>Add</button>

        <hr />

        <h3>Materials</h3>

        {materials.length === 0 && <p>No materials yet</p>}

        {materials.map((m, i) => (
          <div key={i}>
            {m.name} — {m.factor}
            <button onClick={() => deleteMaterial(i)}> ❌ </button>
          </div>
        ))}
      </div>
    );
  }

  // =====================
  // 🧮 MAIN APP
  // =====================
  function MainApp() {
    return (
      <div>
        <h1>Reel / Materials Calculator</h1>

        <select onChange={(e) => setSelected(e.target.value)}>
          <option value="">Select material</option>
          {materials.map((m, i) => (
            <option key={i} value={m.name}>
              {m.name}
            </option>
          ))}
        </select>

        <br /><br />

        <input
          style={styles.input}
          type="number"
          placeholder="Weight"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
        />

        <button onClick={calculate}>Calculate</button>

        {result && <h3>Length: {result} m</h3>}
      </div>
    );
  }

  // =====================
  // 🔐 TOP BAR (GLOBAL DARK MODE)
  // =====================
  const TopBar = () => (
    <div style={styles.topBar}>
      <h3>Reel Calculator</h3>

      <button onClick={() => setDarkMode(!darkMode)}>
        {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
      </button>
    </div>
  );

  // =====================
  // 🔐 LOGIN SCREEN
  // =====================
  if (!isAdmin) {
    return (
      <div style={styles.page}>
        <TopBar />

        <h2>Admin Login</h2>

        <input
          style={styles.input}
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={handleLogin}>Login</button>

        <hr />

        <MainApp />
      </div>
    );
  }

  // =====================
  // 🧑‍💻 FULL VIEW
  // =====================
  return (
    <div style={styles.page}>
      <TopBar />

      <AdminPanel />
      <hr />
      <MainApp />
    </div>
  );
}