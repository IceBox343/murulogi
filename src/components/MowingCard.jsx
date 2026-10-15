import { formatDate, formatDaysAgo } from "../lib/dates";

function MowingCard({ latestMowing, onAdd }) {
  if (!latestMowing) {
    return (
      <section className="card card--empty">
        <p>Niitmisi pole veel lisatud.</p>

        <button type="button" className="btn-primary" onClick={onAdd}>
          Lisa esimene niitmine
        </button>
      </section>
    );
  }

  return (
    <>
      <h2 className="section-title">Viimane niitmine</h2>

      <section className="card">
        <div className="card-apartment">Korter {latestMowing.apartment}</div>
        <div className="card-days">{formatDaysAgo(latestMowing.mowing_date)}</div>
        <div className="card-date">{formatDate(latestMowing.mowing_date)}</div>

        <button type="button" className="btn-primary btn-block" onClick={onAdd}>
          Lisa niitmine
        </button>
      </section>
    </>
  );
}

export default MowingCard;
