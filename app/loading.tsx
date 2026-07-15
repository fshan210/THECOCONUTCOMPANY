export default function Loading() {
  return (
    <div className="co-page-loading" role="status" aria-live="polite" aria-label="Loading .CO experience">
      <div className="co-coconut-loader" aria-hidden="true">
        <span />
      </div>
      <p>Gathering the good stuff</p>
    </div>
  );
}
