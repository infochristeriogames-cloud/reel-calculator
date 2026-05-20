import { useEffect, useState } from "react";
import { supabase } from "/supabase.js";
import { supabase } from "src/supabase.js";

export default function App() {
  const [materials, setMaterials] = useState([]);

  const [name, setName] = useState("");
  const [weight, setWeight] = useState("");
  const [unit, setUnit] = useState("kg");

  // 📥 Load materials from Supabase
  async function loadMaterials() {
    const { data, error } = await supabase
      .from("materials")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Load error:", error);
      return;
    }

    setMaterials(data);
  }

  // 🚀 Load on first render
  useEffect(() => {
    loadMaterials();
  }, []);

  // ➕ Add material
  async function addMaterial() {
    if (!name || !weight) return;

    const { data, error } = await supabase
      .from("materials")
      .insert([
        {
          name,
          weight: parseFloat(weight),
          unit,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Add error:", error);
      return;
    }

    setMaterials((prev) => [data, ...prev]);

    setName("");
    setWeight("");
  }

  // ❌ Delete material
  async function deleteMaterial(id) {
    const { error } = await supabase
      .from("materials")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Delete error:", error);
      return;
    }

    setMaterials((prev) => prev.filter((m) => m.id !== id));
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Materials</h1>

      {/* Inputs */}
      <input
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        placeholder="Weight"
        type="number"
        value={weight}
        onChange={(e) => setWeight(e.target.value)}
      />

      <select value={unit} onChange={(e) => setUnit(e.target.value)}>
        <option value="kg">kg</option>
        <option value="g">g</option>
        <option value="lb">lb</option>
      </select>

      <button onClick={addMaterial}>Add</button>

      {/* List */}
      <ul>
        {materials.map((m) => (
          <li key={m.id}>
            {m.name} — {m.weight} {m.unit}
            <button onClick={() => deleteMaterial(m.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
