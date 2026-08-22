const toast = document.querySelector("#live-toast");
const showToastButton = document.querySelector("#show-toast");
const closeToastButton = document.querySelector("#close-toast");
const dialogBackdrop = document.querySelector("#dialog-backdrop");
const openDialogButton = document.querySelector("#open-dialog");
const closeDialogButtons = document.querySelectorAll("#close-dialog, .close-dialog-button");
const contextButton = document.querySelector("#context-button");
const contextMenu = document.querySelector("#context-menu");
const progressButton = document.querySelector("#advance-progress");
const progressValue = document.querySelector("#progress-value");
const progressBar = document.querySelector("#progress-bar");
const themeToggle = document.querySelector("#theme-toggle");
const themeIcon = themeToggle.querySelector("i");
const settingsWindow = document.querySelector("#settings-window");
const settingsForm = document.querySelector("#settings-form");
const settingsTabs = document.querySelectorAll("[data-settings-tab]");
const settingsPanes = document.querySelectorAll("[data-settings-pane]");
const settingsPositionButtons = document.querySelectorAll("[data-settings-position]");
const settingsScale = document.querySelector("#settings-scale");
const settingsScaleValue = document.querySelector("#settings-scale-value");
const settingsStatus = document.querySelector("#settings-status");
const settingsSaveButton = document.querySelector("#settings-save");
const settingsMinimizeButton = document.querySelector("#settings-minimize");
const settingsMaximizeButton = document.querySelector("#settings-maximize");
const settingsCloseButton = document.querySelector("#settings-close");
const settingsReopenButton = document.querySelector("#settings-reopen");

let toastCloseTimer;
let toastRemoveTimer;
let settingsSaveTimer;
let settingsWindowTimer;
let progress = 72;
let darkMode = document.documentElement.dataset.theme === "dark";

function updateThemeButton() {
  themeToggle.ariaPressed = String(darkMode);
  themeToggle.ariaLabel = `Switch to ${darkMode ? "light" : "dark"} mode`;
  themeIcon.className = `fa-solid ${darkMode ? "fa-sun" : "fa-moon"}`;
}

function toggleTheme() {
  darkMode = !darkMode;
  const theme = darkMode ? "dark" : "light";
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
  localStorage.setItem("w10-theme", theme);
  updateThemeButton();
}

function finishToastClose() {
  toast.hidden = true;
  toast.classList.remove("is-closing");
}

function closeToast() {
  if (toast.hidden) return;

  clearTimeout(toastCloseTimer);
  clearTimeout(toastRemoveTimer);
  toast.classList.add("is-closing");
  toastRemoveTimer = setTimeout(finishToastClose, 280);
}

function startToast() {
  toast.hidden = false;
  toast.classList.remove("is-closing");
  void toast.offsetWidth;
  toastCloseTimer = setTimeout(closeToast, 4300);
}

function showToast() {
  clearTimeout(toastCloseTimer);
  clearTimeout(toastRemoveTimer);

  if (!toast.hidden) {
    toast.classList.add("is-closing");
    toastRemoveTimer = setTimeout(() => {
      finishToastClose();
      requestAnimationFrame(startToast);
    }, 280);
    return;
  }

  startToast();
}

function closeDialog() {
  dialogBackdrop.hidden = true;
  document.body.style.overflow = "";
}

function showSettingsPane(name) {
  settingsTabs.forEach((tab) => {
    const active = tab.dataset.settingsTab === name;
    tab.classList.toggle("active", active);
    tab.ariaSelected = String(active);
  });

  settingsPanes.forEach((pane) => {
    const active = pane.dataset.settingsPane === name;
    pane.hidden = !active;
    pane.classList.remove("active");
    if (active) {
      void pane.offsetWidth;
      pane.classList.add("active");
    }
  });
}

function updateSettingsScale() {
  settingsScaleValue.value = `${settingsScale.value}%`;
}

function showSettingsStatus(type, text, icon) {
  settingsStatus.classList.remove("is-saved", "is-reset");
  settingsStatus.innerHTML = `<i class="fa-solid ${icon}"></i>${text}`;
  void settingsStatus.offsetWidth;
  settingsStatus.classList.add(type);
}

showToastButton.addEventListener("click", showToast);
closeToastButton.addEventListener("click", closeToast);

openDialogButton.addEventListener("click", () => {
  dialogBackdrop.hidden = false;
  document.body.style.overflow = "hidden";
});

closeDialogButtons.forEach((button) => button.addEventListener("click", closeDialog));

dialogBackdrop.addEventListener("click", (event) => {
  if (event.target === dialogBackdrop) closeDialog();
});

contextButton.addEventListener("click", () => {
  contextMenu.hidden = !contextMenu.hidden;
  contextButton.ariaExpanded = String(!contextMenu.hidden);
});

themeToggle.addEventListener("click", toggleTheme);
updateThemeButton();

settingsTabs.forEach((tab) => {
  tab.addEventListener("click", () => showSettingsPane(tab.dataset.settingsTab));
});

settingsPositionButtons.forEach((button) => {
  button.addEventListener("click", () => {
    settingsPositionButtons.forEach((item) => item.classList.toggle("active", item === button));
  });
});

settingsScale.addEventListener("input", updateSettingsScale);

settingsForm.addEventListener("submit", (event) => {
  event.preventDefault();
  clearTimeout(settingsSaveTimer);
  settingsSaveButton.classList.add("is-saved");
  settingsSaveButton.innerHTML = '<i class="fa-solid fa-check"></i>Saved';
  showSettingsStatus("is-saved", "Preferences saved for this demo", "fa-circle-check");

  settingsSaveTimer = setTimeout(() => {
    settingsSaveButton.classList.remove("is-saved");
    settingsSaveButton.innerHTML = '<i class="fa-solid fa-floppy-disk"></i>Save preferences';
  }, 1800);
});

settingsForm.addEventListener("reset", () => {
  clearTimeout(settingsSaveTimer);
  requestAnimationFrame(() => {
    updateSettingsScale();
    settingsPositionButtons.forEach((button, index) => button.classList.toggle("active", index === 0));
    settingsSaveButton.classList.remove("is-saved");
    settingsSaveButton.innerHTML = '<i class="fa-solid fa-floppy-disk"></i>Save preferences';
    showSettingsStatus("is-reset", "Defaults restored", "fa-rotate-left");
  });
});

settingsMinimizeButton.addEventListener("click", () => {
  const minimized = settingsWindow.classList.toggle("is-minimized");
  settingsMinimizeButton.ariaPressed = String(minimized);
  settingsMinimizeButton.ariaLabel = minimized ? "Restore settings" : "Minimize settings";
  settingsMinimizeButton.querySelector("i").className = `fa-solid ${minimized ? "fa-window-restore" : "fa-minus"}`;
});

settingsMaximizeButton.addEventListener("click", () => {
  const maximized = settingsWindow.classList.toggle("is-maximized");
  settingsMaximizeButton.ariaPressed = String(maximized);
  settingsMaximizeButton.ariaLabel = maximized ? "Restore settings size" : "Maximize settings";
  settingsMaximizeButton.querySelector("i").className = `${maximized ? "fa-solid fa-window-restore" : "fa-regular fa-square"}`;
});

settingsCloseButton.addEventListener("click", () => {
  clearTimeout(settingsWindowTimer);
  settingsWindow.classList.add("is-closing");
  settingsWindowTimer = setTimeout(() => {
    settingsWindow.hidden = true;
    settingsWindow.classList.remove("is-closing");
    settingsReopenButton.hidden = false;
  }, 180);
});

settingsReopenButton.addEventListener("click", () => {
  settingsReopenButton.hidden = true;
  settingsWindow.hidden = false;
  settingsWindow.classList.remove("is-minimized", "is-reopening");
  settingsMinimizeButton.ariaPressed = "false";
  settingsMinimizeButton.ariaLabel = "Minimize settings";
  settingsMinimizeButton.querySelector("i").className = "fa-solid fa-minus";
  void settingsWindow.offsetWidth;
  settingsWindow.classList.add("is-reopening");
});

progressButton.addEventListener("click", () => {
  progress = progress >= 100 ? 20 : Math.min(progress + 14, 100);
  progressValue.textContent = `${progress}%`;
  progressBar.style.width = `${progress}%`;
  progressButton.innerHTML = `${progress >= 100 ? "Restart" : "Advance progress"} <i class="fa-solid fa-arrow-right"></i>`;
});

document.querySelector(".sidebar nav").addEventListener("click", (event) => {
  const item = event.target.closest(".nav-item");
  if (item) {
    document.querySelector(".nav-item.active")?.classList.remove("active");
    item.classList.add("active");
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;

  closeToast();
  closeDialog();
  contextMenu.hidden = true;
  contextButton.ariaExpanded = "false";
});
