import "./NotFound.css";

export default function NotFound() {
  return `
    <section class="not-found-page" aria-labelledby="not-found-title">
      <div class="not-found-content">
        <div class="not-found-eyebrow">Digi</div>
        <div class="not-found-code" aria-hidden="true">404</div>
        <h1 id="not-found-title">This page doesn't exist.</h1>
        <p class="not-found-description">
          The page you're looking for may have been moved, deleted, or never existed.
        </p>
        <div class="not-found-actions">
          <a class="not-found-button" href="/#/" onclick="event.preventDefault(); history.pushState({}, '', '/#/'); window.dispatchEvent(new Event('hashchange'));">Back to Digi</a>
        </div>
      </div>
    </section>
  `;
}
