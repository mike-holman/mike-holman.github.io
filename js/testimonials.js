const testimonialRail = document.querySelector("#testimonial-rail");
const previousTestimonialsButton = document.querySelector("[data-testimonial-previous]");
const nextTestimonialsButton = document.querySelector("[data-testimonial-next]");
const autoplayTestimonialsButton = document.querySelector("[data-testimonial-toggle]");
const pauseTestimonialsIcon = document.querySelector("[data-testimonial-pause]");
const playTestimonialsIcon = document.querySelector("[data-testimonial-play]");
const testimonialSection = document.querySelector(".testimonial-section");
const testimonialControls = document.querySelector(".testimonial-controls");
const testimonialCards = [...(testimonialRail?.querySelectorAll(".testimonial-card") ?? [])];
const reducedMotionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
const autoplayInterval = 5000;

if (
    !testimonialRail ||
    !previousTestimonialsButton ||
    !nextTestimonialsButton ||
    !autoplayTestimonialsButton ||
    !pauseTestimonialsIcon ||
    !playTestimonialsIcon ||
    !testimonialSection ||
    !testimonialControls ||
    testimonialCards.length === 0
) {
    throw new Error("The testimonial rail is missing required markup.");
}

function scrollTestimonials(direction) {
    const firstCard = testimonialCards[0];
    const cardWidth = firstCard.getBoundingClientRect().width;
    const gap = Number.parseFloat(getComputedStyle(testimonialRail).columnGap) || 0;
    const maxScroll = testimonialRail.scrollWidth - testimonialRail.clientWidth;
    const behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth";

    if (direction > 0 && maxScroll - testimonialRail.scrollLeft <= 2) {
        testimonialRail.scrollTo({ left: 0, behavior });
        return;
    }

    if (direction < 0 && testimonialRail.scrollLeft <= 2) {
        testimonialRail.scrollTo({ left: maxScroll, behavior });
        return;
    }

    testimonialRail.scrollBy({ left: direction * (cardWidth + gap), behavior });
}

let autoplayEnabled = !reducedMotionPreference.matches;
let autoplayTimer = null;

function updateAutoplay() {
    const shouldPauseForFocus = testimonialSection.contains(document.activeElement) &&
        document.activeElement !== autoplayTestimonialsButton;
    const shouldRun = autoplayEnabled &&
        !document.hidden &&
        !testimonialRail.matches(":hover") &&
        !testimonialControls.matches(":hover") &&
        !shouldPauseForFocus;

    autoplayTestimonialsButton.setAttribute(
        "aria-label",
        autoplayEnabled ? "Pause automatic testimonials" : "Play automatic testimonials"
    );
    pauseTestimonialsIcon.hidden = !autoplayEnabled;
    playTestimonialsIcon.hidden = autoplayEnabled;

    if (shouldRun && autoplayTimer === null) {
        autoplayTimer = window.setInterval(() => scrollTestimonials(1), autoplayInterval);
    } else if (!shouldRun && autoplayTimer !== null) {
        window.clearInterval(autoplayTimer);
        autoplayTimer = null;
    }
}

previousTestimonialsButton.addEventListener("click", () => scrollTestimonials(-1));
nextTestimonialsButton.addEventListener("click", () => scrollTestimonials(1));
autoplayTestimonialsButton.addEventListener("click", () => {
    autoplayEnabled = !autoplayEnabled;
    updateAutoplay();

    if (autoplayEnabled) {
        scrollTestimonials(1);
    }
});

testimonialRail.addEventListener("mouseenter", updateAutoplay);
testimonialRail.addEventListener("mouseleave", updateAutoplay);
testimonialControls.addEventListener("mouseenter", updateAutoplay);
testimonialControls.addEventListener("mouseleave", updateAutoplay);
testimonialSection.addEventListener("focusin", updateAutoplay);
testimonialSection.addEventListener("focusout", () => window.setTimeout(updateAutoplay, 0));
document.addEventListener("visibilitychange", updateAutoplay);
reducedMotionPreference.addEventListener("change", (event) => {
    if (event.matches) {
        autoplayEnabled = false;
    }

    updateAutoplay();
});

window.addEventListener("pageshow", () => {
    testimonialRail.scrollTo({ left: 0, behavior: "instant" });
    updateAutoplay();
});

updateAutoplay();
