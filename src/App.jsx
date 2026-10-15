import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import { getRememberedApartment, rememberApartment } from "./lib/apartment";
import { getTodayDate } from "./lib/dates";
import MowingCard from "./components/MowingCard";
import MowingForm from "./components/MowingForm";
import HistoryList from "./components/HistoryList";

async function fetchHistory() {
  const { data, error } = await supabase
    .from("mowing_entries")
    .select("id, apartment, mowing_date, created_at")
    .order("mowing_date", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return data ?? [];
}

function App() {
  const [history, setHistory] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [selectedApartment, setSelectedApartment] = useState(getRememberedApartment);
  const [selectedDate, setSelectedDate] = useState(getTodayDate);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [loadFailed, setLoadFailed] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  // Loads the history on start and again whenever reloadKey changes.
  useEffect(() => {
    let ignore = false;

    fetchHistory()
      .then((data) => {
        if (ignore) return;
        setHistory(data);
        setLoadFailed(false);
        setErrorMessage("");
      })
      .catch((error) => {
        if (ignore) return;
        // Keep whatever we already had on screen instead of wiping the list.
        console.error(error);
        setLoadFailed(true);
        setErrorMessage("Niitmisandmete laadimine ebaõnnestus.");
      })
      .finally(() => {
        if (!ignore) setIsLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [reloadKey]);

  function reloadHistory() {
    setReloadKey((key) => key + 1);
  }

  function retryLoad() {
    setIsLoading(true);
    reloadHistory();
  }

  function resetForm() {
    setEditingId(null);
    setSelectedApartment(getRememberedApartment());
    setSelectedDate(getTodayDate());
  }

  function openNewForm() {
    resetForm();
    setShowForm(true);
  }

  function handleEdit(entry) {
    setEditingId(entry.id);
    setSelectedApartment(entry.apartment);
    setSelectedDate(entry.mowing_date);
    setShowForm(true);
  }

  function handleCancel() {
    resetForm();
    setShowForm(false);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setIsSaving(true);
    setErrorMessage("");

    const isEditing = editingId !== null;
    const entry = {
      apartment: Number(selectedApartment),
      mowing_date: selectedDate,
    };
    let saved = false;

    try {
      const table = supabase.from("mowing_entries");
      const { error } = isEditing
        ? await table.update(entry).eq("id", editingId)
        : await table.insert(entry);

      if (error) {
        throw error;
      }

      // Only remember the apartment for new entries: when editing, you might be
      // correcting somebody else's entry.
      if (!isEditing) {
        rememberApartment(entry.apartment);
      }

      saved = true;
    } catch (error) {
      console.error(error);
      setErrorMessage("Niitmise salvestamine ebaõnnestus.");
    } finally {
      setIsSaving(false);
    }

    if (saved) {
      resetForm();
      setShowForm(false);
      reloadHistory();
    }
  }

  const showRetry = loadFailed && history.length === 0;

  return (
    <main className="app">
      <div className="app-inner">
        <h1 className="app-title">🌱 Murulogi</h1>

        {errorMessage && (
          <div className="error-banner" role="alert">
            {errorMessage}
          </div>
        )}

        {isLoading ? (
          <div className="loading">Laadin...</div>
        ) : showRetry ? (
          <section className="card card--empty">
            <button type="button" className="btn-primary" onClick={retryLoad}>
              Proovi uuesti
            </button>
          </section>
        ) : (
          <>
            <MowingCard latestMowing={history[0]} onAdd={openNewForm} />

            {showForm && (
              <MowingForm
                key={editingId ?? "new"}
                isEditing={editingId !== null}
                apartment={selectedApartment}
                date={selectedDate}
                isSaving={isSaving}
                onApartmentChange={setSelectedApartment}
                onDateChange={setSelectedDate}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
              />
            )}

            <HistoryList history={history} onEdit={handleEdit} />
          </>
        )}
      </div>
    </main>
  );
}

export default App;
