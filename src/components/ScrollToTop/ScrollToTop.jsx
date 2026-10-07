export default function ScrollToTop() {
  const reset = () => {
    window.scrollTo(0, 0);
  };

  window.addEventListener("hashchange", reset);
  window.addEventListener("popstate", reset);

  return reset;
}
