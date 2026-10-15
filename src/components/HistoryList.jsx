import { formatDate } from "../lib/dates";

function HistoryList({ history, onEdit }) {
  return (
    <>
      <h2 className="section-title">Ajalugu</h2>

      <section className="history">
        {history.length === 0 ? (
          <p className="history-empty">Ajalugu on tühi.</p>
        ) : (
          history.map((entry) => (
            <div key={entry.id} className="history-row">
              <span>{formatDate(entry.mowing_date)}</span>

              <div className="history-actions">
                <strong>Korter {entry.apartment}</strong>

                <button type="button" className="btn-edit" onClick={() => onEdit(entry)}>
                  Muuda
                </button>
              </div>
            </div>
          ))
        )}
      </section>
    </>
  );
}

export default HistoryList;
