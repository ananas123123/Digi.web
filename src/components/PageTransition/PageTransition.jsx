import "./PageTransition.css";

export default function PageTransition(content) {
  return `
    <main class="digi-page-transition" data-page-transition>
      ${content}
    </main>
  `;
}
