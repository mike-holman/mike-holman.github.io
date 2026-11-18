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

document.querySelectorAll(".case-study-video-frame[data-youtube-video]").forEach((videoFrame) => {
    const videoTrigger = videoFrame.querySelector(".case-study-video-trigger");

    if (!videoTrigger) {
        console.warn("Unable to initialize the YouTube video because its play button is missing.");
        return;
    }

    videoTrigger.addEventListener("click", () => {
        const videoId = videoFrame.dataset.youtubeVideo;

        if (!videoId || !/^[\w-]{11}$/.test(videoId)) {
            console.warn("Unable to play the video because its YouTube ID is invalid.");
            return;
        }

        const player = document.createElement("iframe");
        player.src = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&playsinline=1&rel=0`;
        player.title = "Charter Spectrum UI refresh video";
        player.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
        player.allowFullscreen = true;
        player.referrerPolicy = "strict-origin-when-cross-origin";

        videoFrame.replaceChildren(player);
    });
});

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
