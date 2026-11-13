const themeToggle = document.querySelector(".theme-toggle");
const themeIcon = themeToggle.querySelector(".theme-icon");
const mobileMenuToggle = document.querySelector(".mobile-menu-toggle");
const mainNavigation = document.querySelector("#main-navigation");
const heroTitleTrigger = document.querySelector(".hero-title-trigger");
const heroSoundEffect = document.querySelector("#hero-sound-effect");
const themePreferenceKey = "mike-holman-theme";

document.documentElement.classList.add("js");

if (heroTitleTrigger && heroSoundEffect) {
    heroTitleTrigger.addEventListener("click", () => {
        heroSoundEffect.currentTime = 0;
        heroSoundEffect.play().catch((error) => {
            console.warn("Unable to play the hero sound effect.", error);
        });
    });
}

let savedTheme = null;

try {
    savedTheme = window.localStorage.getItem(themePreferenceKey);
} catch (error) {
    console.warn("Unable to read the saved theme preference.", error);
}

function setTheme(theme) {
    const isDark = theme === "dark";
    document.documentElement.dataset.theme = isDark ? "dark" : "light";
    themeIcon.src = isDark ? themeIcon.dataset.darkSrc : themeIcon.dataset.lightSrc;
    themeToggle.setAttribute("aria-pressed", String(isDark));
}

setTheme(savedTheme === "light" ? "light" : "dark");

themeToggle.addEventListener("click", () => {
    const theme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    setTheme(theme);

    try {
        window.localStorage.setItem(themePreferenceKey, theme);
    } catch (error) {
        console.warn("Unable to save the theme preference.", error);
    }
});

if (mobileMenuToggle && mainNavigation) {
    function setMenuOpen(isOpen) {
        mobileMenuToggle.setAttribute("aria-expanded", String(isOpen));
        mobileMenuToggle.setAttribute("aria-label", `${isOpen ? "Close" : "Open"} navigation`);
        mainNavigation.classList.toggle("is-open", isOpen);
    }

    mobileMenuToggle.addEventListener("click", () => {
        setMenuOpen(mobileMenuToggle.getAttribute("aria-expanded") !== "true");
    });

    mainNavigation.addEventListener("click", (event) => {
        if (event.target instanceof Element && event.target.closest("a")) {
            setMenuOpen(false);
        }
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && mobileMenuToggle.getAttribute("aria-expanded") === "true") {
            setMenuOpen(false);
            mobileMenuToggle.focus();
        }
    });
}
