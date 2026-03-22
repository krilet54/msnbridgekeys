const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");
const modal = document.querySelector("[data-modal]");
const modalTitle = document.getElementById("modal-title");
const toast = document.querySelector("[data-toast]");
const counters = document.querySelectorAll(".counter");
const youtubeIframes = document.querySelectorAll("iframe[data-youtube-id]");
const modalViews = document.querySelectorAll("[data-modal-view]");
const legalHashes = new Set(["privacy-policy", "terms-conditions"]);
const locationMap = document.querySelector("[data-location-map]");
const locationSummary = document.querySelector("[data-location-summary]");
const locationTriggers = document.querySelectorAll("[data-location-trigger]");
const locationResetButton = document.querySelector("[data-location-reset]");
const mediaTransitionCards = document.querySelectorAll("[data-media-transition-card]");
const projectLocation = "MSN ONE, Plot No 1, NEOPOLIS, Kokapet, Hyderabad, Telangana 500075";
const homeSectionVideoDurationMs = 3000;
const homeSectionVideoPlaybackRate = 2;

if (navToggle && siteNav) {
  navToggle.addEventListener("click", () => {
    const expanded = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", String(!expanded));
    siteNav.classList.toggle("is-open", !expanded);
  });

  siteNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navToggle.setAttribute("aria-expanded", "false");
      siteNav.classList.remove("is-open");
    });
  });
}

const navLinks = siteNav ? [...siteNav.querySelectorAll("a")] : [];
const navHoverBar = siteNav ? siteNav.querySelector(".nav-hover-bar") : null;
let activeNavIndex = -1;

const moveNavHoverBar = (link, index) => {
  if (!siteNav || !navHoverBar || !link || window.innerWidth <= 820) return;

  const navRect = siteNav.getBoundingClientRect();
  const linkRect = link.getBoundingClientRect();
  const nextOrigin = activeNavIndex === -1 || index >= activeNavIndex ? "left" : "right";

  siteNav.style.setProperty("--nav-hover-left", `${linkRect.left - navRect.left}px`);
  siteNav.style.setProperty("--nav-hover-width", `${linkRect.width}px`);
  siteNav.style.setProperty("--nav-hover-origin", nextOrigin);
  siteNav.style.setProperty("--nav-hover-scale-x", "1");
  activeNavIndex = index;
};

const resetNavHoverBar = () => {
  if (!siteNav || !navHoverBar || window.innerWidth <= 820) return;
  siteNav.style.setProperty("--nav-hover-scale-x", "0");
  activeNavIndex = -1;
};

if (siteNav && navLinks.length && navHoverBar) {
  navLinks.forEach((link, index) => {
    link.addEventListener("mouseenter", () => {
      navLinks.forEach((item) => item.classList.remove("is-hovered"));
      link.classList.add("is-hovered");
      moveNavHoverBar(link, index);
    });

    link.addEventListener("focus", () => {
      navLinks.forEach((item) => item.classList.remove("is-hovered"));
      link.classList.add("is-hovered");
      moveNavHoverBar(link, index);
    });

    link.addEventListener("mouseleave", () => {
      link.classList.remove("is-hovered");
    });

    link.addEventListener("blur", () => {
      link.classList.remove("is-hovered");
    });
  });

  siteNav.addEventListener("mouseleave", resetNavHoverBar);

  window.addEventListener("resize", () => {
    if (window.innerWidth <= 820) {
      resetNavHoverBar();
      navLinks.forEach((link) => link.classList.remove("is-hovered"));
    }
  });
}

const showToast = () => {
  if (!toast) return;
  toast.hidden = false;
  window.clearTimeout(showToast.timeoutId);
  showToast.timeoutId = window.setTimeout(() => {
    toast.hidden = true;
  }, 2600);
};

const setModalView = (viewName) => {
  if (!modalViews.length) return;

  modalViews.forEach((view) => {
    view.hidden = view.dataset.modalView !== viewName;
  });

  if (modalTitle && viewName === "lead") {
    modalTitle.textContent = "Schedule Site Visit";
  }
};

const clearLegalHash = () => {
  if (!legalHashes.has(window.location.hash.replace("#", ""))) return;
  history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
};

const openModal = (viewName = "lead", updateHash = false) => {
  if (!modal) return;
  setModalView(viewName);
  modal.hidden = false;
  document.body.classList.add("modal-open");

  if (viewName === "lead" && !updateHash) {
    clearLegalHash();
  }

  if (updateHash && legalHashes.has(viewName) && window.location.hash !== `#${viewName}`) {
    window.location.hash = viewName;
  }
};

const closeModal = () => {
  if (!modal) return;
  modal.hidden = true;
  document.body.classList.remove("modal-open");
  clearLegalHash();
};

document.querySelectorAll("[data-open-modal]").forEach((button) => {
  button.addEventListener("click", () => openModal("lead"));
});

document.querySelectorAll("[data-close-modal]").forEach((button) => {
  button.addEventListener("click", closeModal);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeModal();
  }
});

const syncModalWithHash = () => {
  const hash = window.location.hash.replace("#", "");
  if (!legalHashes.has(hash)) return;
  openModal(hash);
};

window.addEventListener("hashchange", syncModalWithHash);
syncModalWithHash();

document.querySelectorAll("[data-demo-form]").forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    form.reset();
    closeModal();
    showToast();
  });
});

youtubeIframes.forEach((iframe) => {
  const videoId = iframe.dataset.youtubeId;
  const start = iframe.dataset.youtubeStart || "0";
  const isHttp = window.location.protocol === "http:" || window.location.protocol === "https:";

  if (!isHttp) {
    const fallback = document.createElement("a");
    fallback.className = "video-fallback";
    fallback.href = `https://www.youtube.com/watch?v=${videoId}&t=${start}s`;
    fallback.target = "_blank";
    fallback.rel = "noreferrer";
    fallback.textContent = "Open video on YouTube";
    iframe.replaceWith(fallback);
    return;
  }

  iframe.src = `https://www.youtube.com/embed/${videoId}?start=${start}&rel=0&playsinline=1&origin=${encodeURIComponent(window.location.origin)}`;
});

const formatCounter = (value, target) => {
  if (Number.isInteger(target)) {
    return Math.round(value).toLocaleString();
  }

  return value.toFixed(1);
};

const animateCounter = (element) => {
  const target = Number(element.dataset.counter || "0");
  // Original counter animation length before the home section video was added: 1600ms.
  // Keep this synced to the video runtime while the video is present.
  const duration = homeSectionVideoDurationMs;
  const start = performance.now();

  const frame = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = progress < 0.5
      ? 4 * progress * progress * progress
      : 1 - Math.pow(-2 * progress + 2, 3) / 2;
    const current = target * eased;
    element.textContent = formatCounter(current, target);

    if (progress < 1) {
      window.requestAnimationFrame(frame);
    } else {
      element.textContent = formatCounter(target, target);
    }
  };

  window.requestAnimationFrame(frame);
};

const counterObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    animateCounter(entry.target);
    observer.unobserve(entry.target);
  });
}, { threshold: 0.4 });

counters.forEach((counter) => counterObserver.observe(counter));

mediaTransitionCards.forEach((card) => {
  const video = card.querySelector("[data-media-transition-video]");
  if (!video) return;

  video.playbackRate = homeSectionVideoPlaybackRate;

  video.addEventListener("loadedmetadata", () => {
    const playbackWindowSeconds = homeSectionVideoDurationMs / 1000;
    const targetStartTime = Math.max(video.duration - playbackWindowSeconds, 0);

    if (video.duration > playbackWindowSeconds) {
      video.currentTime = targetStartTime;
    }
  }, { once: true });

  video.addEventListener("ended", () => {
    card.classList.add("is-video-complete");
  }, { once: true });
});

if (locationMap && locationTriggers.length) {
  const buildProjectOnlyMapUrl = () => {
    const params = new URLSearchParams({
      q: projectLocation,
      t: "m",
      z: "16",
      output: "embed",
      iwloc: "near"
    });

    return `https://maps.google.com/maps?${params.toString()}`;
  };

  const buildLocationMapUrl = (destination) => {
    const params = new URLSearchParams({
      output: "embed",
      saddr: projectLocation,
      daddr: destination,
      z: "13"
    });

    return `https://maps.google.com/maps?${params.toString()}`;
  };

  const updateLocationMap = (trigger) => {
    const destination = trigger.dataset.destination;
    const label = trigger.dataset.label;
    const distance = trigger.dataset.distance;

    if (!destination || !label || !distance) return;

    locationMap.src = buildLocationMapUrl(destination);
    locationMap.title = `${projectLocation} to ${label}`;

    if (locationSummary) {
      locationSummary.innerHTML = `Showing route from <strong>MSN ONE, Neopolis</strong> to <strong>${label}</strong> at an approximate distance of <strong>${distance}</strong>.`;
    }

    locationTriggers.forEach((item) => {
      item.classList.toggle("is-active", item === trigger);
    });
  };

  const showProjectOnlyLocation = () => {
    locationMap.src = buildProjectOnlyMapUrl();
    locationMap.title = projectLocation;

    if (locationSummary) {
      locationSummary.innerHTML = `Showing the exact project location for <strong>MSN ONE, Neopolis</strong>.`;
    }

    locationTriggers.forEach((item) => {
      item.classList.remove("is-active");
    });
  };

  locationTriggers.forEach((trigger) => {
    trigger.addEventListener("click", () => {
      updateLocationMap(trigger);
    });
  });

  if (locationResetButton) {
    locationResetButton.addEventListener("click", showProjectOnlyLocation);
  }

  showProjectOnlyLocation();
}
