const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");
const modal = document.querySelector("[data-modal]");
const modalTitle = document.getElementById("modal-title");
const toast = document.querySelector("[data-toast]");
const counters = document.querySelectorAll(".counter");
const youtubeIframes = document.querySelectorAll("iframe[data-youtube-id]");
const modalViews = document.querySelectorAll("[data-modal-view]");
const homeSection = document.getElementById("home");
const legalHashes = new Set(["privacy-policy", "terms-conditions"]);
const locationMap = document.querySelector("[data-location-map]");
const locationSummary = document.querySelector("[data-location-summary]");
const locationTriggers = document.querySelectorAll("[data-location-trigger]");
const locationResetButton = document.querySelector("[data-location-reset]");
const mediaTransitionCards = document.querySelectorAll("[data-media-transition-card]");
const heroBanner = document.querySelector(".hero-banner");
const mobileRevealTargets = document.querySelectorAll(".enquiry-stat, .stat-card, #amenities .amenity-card");
const formSubmitEndpoint = "https://formsubmit.co/ajax/abhinav787@gmail.com";
const projectLocation = "MSN ONE, Plot No 1, NEOPOLIS, Kokapet, Hyderabad, Telangana 500075";
const homeSectionVideoDurationMs = 3000;
const homeSectionVideoPlaybackRate = 2;
const defaultModalTitle = "Schedule Site Visit";
const thankYouPagePath = "thank-you.html";
const toastDurationMs = 3200;
let mobileCenterPopTicking = false;
let mobileCenterPopRafId = 0;
let mobileCenterPopActiveUntil = 0;
let activeModalTriggerLabel = defaultModalTitle;

if ("scrollRestoration" in window.history) {
  window.history.scrollRestoration = "manual";
}

window.addEventListener("load", () => {
  window.scrollTo(0, 0);
});

const syncHeroBannerSource = () => {
  if (!heroBanner) return;

  const mobileSrc = heroBanner.dataset.mobileSrc;
  const desktopSrc = heroBanner.dataset.desktopSrc;

  if (!mobileSrc || !desktopSrc) return;

  const nextSrc = window.matchMedia("(max-width: 767px)").matches ? mobileSrc : desktopSrc;
  const currentSrc = heroBanner.getAttribute("src");

  if (currentSrc === nextSrc) return;

  heroBanner.pause();
  heroBanner.setAttribute("src", nextSrc);
  heroBanner.load();

  const playPromise = heroBanner.play();
  if (playPromise && typeof playPromise.catch === "function") {
    playPromise.catch(() => {});
  }
};

syncHeroBannerSource();

const heroBannerMediaQuery = window.matchMedia("(max-width: 767px)");
if (typeof heroBannerMediaQuery.addEventListener === "function") {
  heroBannerMediaQuery.addEventListener("change", syncHeroBannerSource);
} else if (typeof heroBannerMediaQuery.addListener === "function") {
  heroBannerMediaQuery.addListener(syncHeroBannerSource);
}

const updateMobileCenteredCard = () => {
  if (!mobileRevealTargets.length) return;

  const isMobile = window.matchMedia("(max-width: 767px)").matches;

  if (!isMobile) {
    document.body.classList.remove("mobile-scroll-reveal-ready");
    mobileRevealTargets.forEach((element) => {
      element.classList.remove("is-centered");
    });
    return;
  }

  document.body.classList.add("mobile-scroll-reveal-ready");
  const viewportCenter = window.innerHeight * 0.5;
  let nearestElement = null;
  let nearestDistance = Number.POSITIVE_INFINITY;

  mobileRevealTargets.forEach((element) => {
    const rect = element.getBoundingClientRect();
    const elementCenter = rect.top + rect.height / 2;
    const distance = Math.abs(elementCenter - viewportCenter);

    if (distance < nearestDistance) {
      nearestDistance = distance;
      nearestElement = element;
    }
  });

  mobileRevealTargets.forEach((element) => {
    element.classList.toggle("is-centered", element === nearestElement);
  });
};

const requestMobileCenteredCardUpdate = () => {
  if (mobileCenterPopTicking) return;
  mobileCenterPopTicking = true;

  window.requestAnimationFrame(() => {
    mobileCenterPopTicking = false;
    updateMobileCenteredCard();
  });
};

const startMobileCenterPopTracking = () => {
  mobileCenterPopActiveUntil = performance.now() + 420;

  if (mobileCenterPopRafId) return;

  const tick = () => {
    requestMobileCenteredCardUpdate();

    if (performance.now() < mobileCenterPopActiveUntil) {
      mobileCenterPopRafId = window.requestAnimationFrame(tick);
      return;
    }

    mobileCenterPopRafId = 0;
  };

  mobileCenterPopRafId = window.requestAnimationFrame(tick);
};

updateMobileCenteredCard();
window.addEventListener("scroll", startMobileCenterPopTracking, { passive: true });
window.addEventListener("touchmove", startMobileCenterPopTracking, { passive: true });
window.addEventListener("wheel", startMobileCenterPopTracking, { passive: true });
window.addEventListener("resize", requestMobileCenteredCardUpdate);

if (typeof heroBannerMediaQuery.addEventListener === "function") {
  heroBannerMediaQuery.addEventListener("change", updateMobileCenteredCard);
} else if (typeof heroBannerMediaQuery.addListener === "function") {
  heroBannerMediaQuery.addListener(updateMobileCenteredCard);
}

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

const showToast = (message = "Thanks! Your details have been sent.", state = "success") => {
  if (!toast) return;
  toast.textContent = message;
  toast.dataset.state = state;
  toast.hidden = false;
  window.clearTimeout(showToast.timeoutId);
  showToast.timeoutId = window.setTimeout(() => {
    toast.hidden = true;
  }, toastDurationMs);
};

const getButtonLabel = (button) => {
  const textLabel = button.textContent.replace(/\s+/g, " ").trim();
  return textLabel || button.getAttribute("aria-label") || defaultModalTitle;
};

const formatSubmissionTime = () => new Date().toLocaleString("en-IN", {
  dateStyle: "medium",
  timeStyle: "short",
});

const getThankYouPageUrl = () => new URL(thankYouPagePath, window.location.href).toString();

const getFormHeading = (form) => {
  if (modal && modal.contains(form) && modalTitle) {
    return modalTitle.textContent.trim();
  }

  const heading = form.parentElement?.querySelector("h2, h3");
  return heading ? heading.textContent.trim() : form.dataset.formName || "Website Enquiry Form";
};

const buildSubmissionPayload = (form) => {
  const formData = new FormData(form);
  const formName = form.dataset.formName || "Website Enquiry Form";
  const pageUrl = window.location.href;
  const emailValue = `${formData.get("email") || ""}`.trim();
  const payload = new URLSearchParams();

  payload.set("name", `${formData.get("name") || ""}`.trim());
  payload.set("phone", `${formData.get("phone") || ""}`.trim());
  payload.set("email", emailValue);
  payload.set("_subject", `New One by MSN Realty enquiry - ${formName}`);
  payload.set("_template", "table");
  payload.set("_replyto", emailValue);
  payload.set("_url", pageUrl);
  payload.set("Form Name", formName);
  payload.set("Form Heading", getFormHeading(form));
  payload.set("CTA Source", modal && modal.contains(form) ? activeModalTriggerLabel : formName);
  payload.set("Page URL", pageUrl);
  payload.set("Submitted At", formatSubmissionTime());

  return payload;
};

const setFormSubmittingState = (form, isSubmitting) => {
  const submitButton = form.querySelector('button[type="submit"]');
  if (!submitButton) return;

  if (!submitButton.dataset.defaultLabel) {
    submitButton.dataset.defaultLabel = submitButton.textContent.trim();
  }

  submitButton.disabled = isSubmitting;
  submitButton.textContent = isSubmitting ? "Sending..." : submitButton.dataset.defaultLabel;
};

const setModalView = (viewName, titleText = defaultModalTitle) => {
  if (!modalViews.length) return;

  modalViews.forEach((view) => {
    view.hidden = view.dataset.modalView !== viewName;
  });

  if (modalTitle && viewName === "lead") {
    modalTitle.textContent = titleText;
  }
};

const clearLegalHash = () => {
  if (!legalHashes.has(window.location.hash.replace("#", ""))) return;
  history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
};

const openModal = (viewName = "lead", updateHash = false, titleText = defaultModalTitle) => {
  if (!modal) return;
  setModalView(viewName, titleText);
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
  button.addEventListener("click", () => {
    activeModalTriggerLabel = getButtonLabel(button);
    openModal("lead", false, button.dataset.modalTitle || defaultModalTitle);
  });
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
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    try {
      setFormSubmittingState(form, true);

      const response = await fetch(formSubmitEndpoint, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        },
        body: buildSubmissionPayload(form).toString(),
      });
      const result = await response.json().catch(() => null);

      if (!response.ok || (result && result.success === false)) {
        throw new Error("Form submission failed");
      }

      form.reset();
      if (modal && modal.contains(form)) {
        closeModal();
      }
      window.location.assign(getThankYouPageUrl());
    } catch (error) {
      showToast("Submission failed. Please try again in a moment.", "error");
    } finally {
      setFormSubmittingState(form, false);
    }
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
  if (element.dataset.counterAnimated === "true") return;
  element.dataset.counterAnimated = "true";

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

const startHomeSectionExperience = () => {
  counters.forEach((counter) => animateCounter(counter));

  mediaTransitionCards.forEach((card) => {
    const video = card.querySelector("[data-media-transition-video]");
    if (!video || video.dataset.hasStarted === "true") return;

    video.dataset.hasStarted = "true";
    const playbackWindowSeconds = homeSectionVideoDurationMs / 1000;
    const targetStartTime = Math.max(video.duration - playbackWindowSeconds, 0);

    if (Number.isFinite(video.duration) && video.duration > playbackWindowSeconds) {
      video.currentTime = targetStartTime;
    }

    const playPromise = video.play();

    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(() => {
        video.controls = true;
      });
    }
  });
};

if (homeSection) {
  const homeSectionObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      startHomeSectionExperience();
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.35 });

  homeSectionObserver.observe(homeSection);
} else {
  startHomeSectionExperience();
}

mediaTransitionCards.forEach((card) => {
  const video = card.querySelector("[data-media-transition-video]");
  if (!video) return;

  video.playbackRate = homeSectionVideoPlaybackRate;
  video.pause();

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
