(() => {
  const searchInput = document.getElementById("searchInput");
  if (!searchInput) return;

  const isLayoutPage = document.body.classList.contains("layout-page");

  function buildLayoutUrl(value) {
    const query = String(value || "").trim();
    if (!query) return "layout.html";
    return `layout.html?q=${encodeURIComponent(query)}`;
  }

  searchInput.addEventListener("keydown", (event) => {
    if (event.key !== "Enter") return;
    event.preventDefault();
    if (!isLayoutPage) {
      window.location.href = buildLayoutUrl(searchInput.value);
    }
  });
})();
