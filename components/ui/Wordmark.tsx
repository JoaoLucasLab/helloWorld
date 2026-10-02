// The ApplyFlow wordmark: "apply" bold, "flow" regular, and a blue dot.
// Colors come from the surrounding .brand context (dark sidebar or light auth pages).
export function Wordmark() {
  return (
    <span className="wordmark" role="img" aria-label="ApplyFlow">
      <span aria-hidden="true">apply</span>
      <span aria-hidden="true" className="wordmark-flow">flow</span>
      <span aria-hidden="true" className="wordmark-dot" />
    </span>
  );
}
