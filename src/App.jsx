import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";


function App() {
  const [history, setHistory] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [selectedApartment, setSelectedApartment] = useState(1);
  const [selectedDate, setSelectedDate] = useState(
    getTodayDate()
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    loadHistory();
  }, []);

  function getTodayDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  async function loadHistory() {
    setIsLoading(true);
    setErrorMessage("");

    const { data, error } = await supabase
      .from("mowing_entries")
      .select("id, apartment, mowing_date, created_at")
      .order("mowing_date", { ascending: false })
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      setErrorMessage("Niitmisandmete laadimine ebaõnnestus.");
      setHistory([]);
    } else {
      setHistory(data ?? []);
    }

    setIsLoading(false);
  }

  async function addMowing(event) {
    event.preventDefault();
    setIsSaving(true);
    setErrorMessage("");

    let error;

if (editingId) {
  ({ error } = await supabase
    .from("mowing_entries")
    .update({
      apartment: Number(selectedApartment),
      mowing_date: selectedDate,
    })
    .eq("id", editingId));
} else {
  ({ error } = await supabase
    .from("mowing_entries")
    .insert({
      apartment: Number(selectedApartment),
      mowing_date: selectedDate,
    }));
}

    if (error) {
      console.error(error);
      setErrorMessage("Niitmise salvestamine ebaõnnestus.");
      setIsSaving(false);
      return;
    }

    setShowForm(false);
    setEditingId(null);
    setSelectedApartment(1);
    setSelectedDate(getTodayDate());
    setIsSaving(false);

    await loadHistory();
  }

  function calculateDaysAgo(date) {
    const mowingDate = new Date(`${date}T00:00:00`);
    const today = new Date();

    today.setHours(0, 0, 0, 0);

    return Math.round(
      (today.getTime() - mowingDate.getTime()) /
        (1000 * 60 * 60 * 24)
    );
  }

  function formatDaysAgo(date) {
    const daysAgo = calculateDaysAgo(date);

    if (daysAgo === 0) {
      return "Täna";
    }

    if (daysAgo === 1) {
      return "1 päev tagasi";
    }

    return `${daysAgo} päeva tagasi`;
  }
function handleEdit(entry) {
  setEditingId(entry.id);
  setSelectedApartment(entry.apartment);
  setSelectedDate(entry.mowing_date);
  setShowForm(true);

  setTimeout(() => {
    document.getElementById("mowing-form")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, 100);
}

function handleCancel() {
  setShowForm(false);
  setEditingId(null);
  setSelectedDate(new Date().toLocaleDateString("en-CA"));
}
  function formatDate(date) {
    return new Intl.DateTimeFormat("et-EE").format(
      new Date(`${date}T00:00:00`)
    );
  }

  const latestMowing = history[0];

  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundColor: "#f4f7f2",
        padding: "24px 16px",
        boxSizing: "border-box",
        fontFamily: "Arial, sans-serif",
        color: "#1f2933",
      }}
    >
      <div
        style={{
          maxWidth: "420px",
          margin: "0 auto",
        }}
      >
        <h1
          style={{
            margin: "8px 0 32px",
            textAlign: "center",
            fontSize: "32px",
          }}
        >
          🌱 Murulogi
        </h1>

        {errorMessage && (
          <div
            style={{
              padding: "12px",
              marginBottom: "18px",
              border: "1px solid #ef9a9a",
              borderRadius: "10px",
              backgroundColor: "#ffebee",
              color: "#b71c1c",
            }}
          >
            {errorMessage}
          </div>
        )}

        {isLoading ? (
          <div
            style={{
              padding: "24px",
              textAlign: "center",
            }}
          >
            Laadin...
          </div>
        ) : latestMowing ? (
          <>
            <h2
              style={{
                fontSize: "18px",
                marginBottom: "10px",
              }}
            >
              Viimane niitmine
            </h2>

            <section
              style={{
                padding: "24px",
                marginBottom: "28px",
                borderRadius: "18px",
                backgroundColor: "white",
                boxShadow: "0 6px 20px rgba(0, 0, 0, 0.08)",
              }}
            >
              <div
                style={{
                  fontSize: "22px",
                  fontWeight: "700",
                  marginBottom: "10px",
                }}
              >
                Korter {latestMowing.apartment}
              </div>

              <div
                style={{
                  fontSize: "34px",
                  fontWeight: "800",
                  color: "#2e7d32",
                  marginBottom: "6px",
                }}
              >
                {formatDaysAgo(latestMowing.mowing_date)}
              </div>

              <div style={{ color: "#667085" }}>
                {formatDate(latestMowing.mowing_date)}
              </div>

              <button
                type="button"
                onClick={() => {
  setEditingId(null);
  setSelectedDate(new Date().toLocaleDateString("en-CA"));
  setShowForm(true);
}}
                style={{
                  width: "100%",
                  marginTop: "22px",
                  padding: "13px 16px",
                  border: "none",
                  borderRadius: "10px",
                  backgroundColor: "#2e7d32",
                  color: "white",
                  fontSize: "16px",
                  fontWeight: "700",
                  cursor: "pointer",
                }}
              >
                Lisa niitmine
              </button>
            </section>
          </>
        ) : (
          <section
            style={{
              padding: "24px",
              marginBottom: "28px",
              textAlign: "center",
              borderRadius: "18px",
              backgroundColor: "white",
            }}
          >
            <p>Niitmisi pole veel lisatud.</p>

            <button
              type="button"
              onClick={() => setShowForm(true)}
              style={{
                padding: "13px 18px",
                border: "none",
                borderRadius: "10px",
                backgroundColor: "#2e7d32",
                color: "white",
                fontSize: "16px",
                fontWeight: "700",
                cursor: "pointer",
              }}
            >
              Lisa esimene niitmine
            </button>
          </section>
        )}

        {showForm && (
          <form
            onSubmit={addMowing}
            style={{
              padding: "22px",
              marginBottom: "28px",
              borderRadius: "18px",
              backgroundColor: "white",
              boxShadow: "0 6px 20px rgba(0, 0, 0, 0.08)",
            }}
          >
            <h2 style={{ marginTop: 0 }}>
  {editingId !== null ? "Muuda niitmist" : "Lisa niitmine"}
</h2>

            <label
              htmlFor="apartment"
              style={{
                display: "block",
                marginBottom: "6px",
                fontWeight: "700",
              }}
            >
              Korter
            </label>

            <select
              id="apartment"
              value={selectedApartment}
              onChange={(event) =>
                setSelectedApartment(event.target.value)
              }
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "11px",
                marginBottom: "18px",
                border: "1px solid #cfd8cc",
                borderRadius: "8px",
                fontSize: "16px",
              }}
            >
              {[1, 2, 3, 4, 5, 6].map((apartment) => (
                <option key={apartment} value={apartment}>
                  Korter {apartment}
                </option>
              ))}
            </select>

            <label
              htmlFor="mowing-date"
              style={{
                display: "block",
                marginBottom: "6px",
                fontWeight: "700",
              }}
            >
              Kuupäev
            </label>

            <input
              id="mowing-date"
              type="date"
              value={selectedDate}
              max={getTodayDate()}
              onChange={(event) =>
                setSelectedDate(event.target.value)
              }
              required
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "11px",
                marginBottom: "20px",
                border: "1px solid #cfd8cc",
                borderRadius: "8px",
                fontSize: "16px",
              }}
            />

            <div
              id="mowing-form"
              style={{
                display: "flex",
                gap: "10px",
              }}
            >
              <button
                type="button"
                disabled={isSaving}
                onClick={handleCancel}
                style={{
                  flex: 1,
                  padding: "12px",
                  border: "1px solid #b8c2b5",
                  borderRadius: "9px",
                  backgroundColor: "white",
                  cursor: "pointer",
                }}
              >
                Tühista
              </button>

              <button
                type="submit"
                disabled={isSaving}
                style={{
                  flex: 1,
                  padding: "12px",
                  border: "none",
                  borderRadius: "9px",
                  backgroundColor: "#2e7d32",
                  color: "white",
                  fontWeight: "700",
                  cursor: isSaving ? "not-allowed" : "pointer",
                  opacity: isSaving ? 0.7 : 1,
                }}
              >
                {isSaving ? "Salvestan..." : "Salvesta"}
              </button>
            </div>
          </form>
        )}

        <h2
          style={{
            fontSize: "18px",
            marginBottom: "10px",
          }}
        >
          Ajalugu
        </h2>

        <section
          style={{
            overflow: "hidden",
            borderRadius: "18px",
            backgroundColor: "white",
            boxShadow: "0 6px 20px rgba(0, 0, 0, 0.06)",
          }}
        >
          {history.length === 0 ? (
            <p
              style={{
                padding: "20px",
                textAlign: "center",
                color: "#667085",
              }}
            >
              Ajalugu on tühi.
            </p>
          ) : (
            history.map((entry, index) => (
              <div
  key={entry.id}
  style={{
    display: "flex",
    justifyContent: "space-between",
    padding: "15px 18px",
    borderBottom:
      index < history.length - 1
        ? "1px solid #edf0eb"
        : "none",
  }}
>
  <div>
    <span>{formatDate(entry.mowing_date)}</span>
  </div>

  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: "10px",
    }}
  >
    <strong>Korter {entry.apartment}</strong>

    <button
  type="button"
  onClick={() => handleEdit(entry)}
  style={{
    backgroundColor: "#e8f3e8",
    color: "#2f6b3b",
    border: "1px solid #c5dfc7",
    borderRadius: "8px",
    padding: "7px 12px",
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer",
  }}
>
  Muuda
</button>
  </div>
</div>
            ))
          )}
        </section>
      </div>
    </main>
  );
}

export default App;