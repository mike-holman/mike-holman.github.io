const workFilters = document.querySelector(".work-filters");
const workCards = [...document.querySelectorAll(".work-directory-grid .project-card")];
const workFilterStatus = document.querySelector("#work-filter-status");

workFilters.addEventListener("click", event => {
    const filterButton = event.target.closest("[data-filter]");
    if (!filterButton) return;

    const selectedFilter = filterButton.dataset.filter;
    let visibleCount = 0;

    workFilters.querySelectorAll("[data-filter]").forEach(button => {
        const isSelected = button === filterButton;
        button.classList.toggle("is-active", isSelected);
        button.setAttribute("aria-pressed", String(isSelected));
    });

    workCards.forEach(card => {
        const categories = card.dataset.categories.split(/\s+/);
        const isVisible = selectedFilter === "all" || categories.includes(selectedFilter);
        card.hidden = !isVisible;
        if (isVisible) visibleCount += 1;
    });

    workFilterStatus.textContent = `Showing ${visibleCount} ${visibleCount === 1 ? "project" : "projects"}.`;
});
