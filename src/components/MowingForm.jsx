import { useEffect, useRef } from "react";
import { APARTMENTS } from "../lib/apartment";
import { getTodayDate } from "../lib/dates";

function MowingForm({
  isEditing,
  apartment,
  date,
  isSaving,
  onApartmentChange,
  onDateChange,
  onSubmit,
  onCancel,
}) {
  const formRef = useRef(null);

  // Bring the whole form into view when it opens (important when editing an
  // entry far down the history list on a phone).
  useEffect(() => {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return (
    <form ref={formRef} className="form" onSubmit={onSubmit}>
      <h2>{isEditing ? "Muuda niitmist" : "Lisa niitmine"}</h2>

      <label htmlFor="apartment" className="form-label">
        Korter
      </label>

      <select
        id="apartment"
        className="form-input"
        value={apartment}
        onChange={(event) => onApartmentChange(Number(event.target.value))}
      >
        {APARTMENTS.map((number) => (
          <option key={number} value={number}>
            Korter {number}
          </option>
        ))}
      </select>

      <label htmlFor="mowing-date" className="form-label">
        Kuupäev
      </label>

      <input
        id="mowing-date"
        className="form-input form-input--last"
        type="date"
        value={date}
        max={getTodayDate()}
        onChange={(event) => onDateChange(event.target.value)}
        required
      />

      <div className="form-actions">
        <button type="button" className="btn-cancel" disabled={isSaving} onClick={onCancel}>
          Tühista
        </button>

        <button type="submit" className="btn-save" disabled={isSaving}>
          {isSaving ? "Salvestan..." : "Salvesta"}
        </button>
      </div>
    </form>
  );
}

export default MowingForm;
