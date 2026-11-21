function dateFromToday(days) {
  var d = new Date();
  d.setDate(d.getDate() + days);
  var month = String(d.getMonth() + 1).padStart(2, "0");
  var day = String(d.getDate()).padStart(2, "0");
  return d.getFullYear() + "-" + month + "-" + day;
}

var events = [
  {
    id: 1,
    title: "Freshers Society Orientation",
    category: "society",
    date: dateFromToday(1),
    time: "11:00",
    location: "Main Auditorium",
    description:
      "Meet the campus societies in one place. Each society will present what it does and how new members can join.",
  },
  {
    id: 2,
    title: "Intro to Cybersecurity Seminar",
    category: "seminar",
    date: dateFromToday(2),
    time: "14:00",
    location: "Seminar Hall 2, AB1",
    description:
      "A beginner-friendly talk on common online threats, password safety and how to start a career in cybersecurity.",
  },
  {
    id: 3,
    title: "Inter-Section Coding Contest",
    category: "competition",
    date: dateFromToday(3),
    time: "10:00",
    location: "Computer Lab 3",
    description:
      "Teams of two solve programming problems against the clock. Prizes for the top three teams.",
  },
  {
    id: 4,
    title: "Chai and Game Night",
    category: "social",
    date: dateFromToday(5),
    time: "19:00",
    location: "Lawn (AB1)",
    description:
      "Relax after classes with board games, card games and tea. Everyone is welcome, bring a friend.",
  },
  {
    id: 5,
    title: "Resume Writing Workshop",
    category: "seminar",
    date: dateFromToday(6),
    time: "13:00",
    location: "Room C-20",
    description:
      "Learn how to build a clear, professional resume. A guest speaker from industry will give live feedback.",
  },
  {
    id: 6,
    title: "Capture The Flag (CTF) Challenge",
    category: "competition",
    date: dateFromToday(9),
    time: "09:30",
    location: "Computer Lab 1",
    description:
      "Solve puzzles in cryptography, web and forensics to capture hidden flags. Open to all sections.",
  },
  {
    id: 7,
    title: "Debating Society Open Trials",
    category: "society",
    date: dateFromToday(12),
    time: "15:00",
    location: "Room A-1",
    description:
      "Try out for the debating society. No experience needed, just bring an opinion and some confidence.",
  },
  {
    id: 8,
    title: "Campus Photography Walk",
    category: "social",
    date: dateFromToday(15),
    time: "16:30",
    location: "Main Gate",
    description:
      "A relaxed walk around campus to take photos together. Phone cameras are completely fine.",
  },
  {
    id: 9,
    title: "Banking and Fintech Career Talk",
    category: "seminar",
    date: dateFromToday(20),
    time: "12:00",
    location: "Main Auditorium",
    description:
      "Representatives from a local bank talk about internships, graduate programs and skills they look for.",
  },
  {
    id: 10,
    title: "Robotics Society Demo Day",
    category: "society",
    date: dateFromToday(25),
    time: "11:30",
    location: "EE Building Lobby",
    description:
      "See the robots built this semester and learn how to join the next project team.",
  },
];

events.sort(function (a, b) {
  return (a.date + a.time).localeCompare(b.date + b.time);
});

function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function formatDate(isoDate, time) {
  var parts = isoDate.split("-");
  var d = new Date(parts[0], parts[1] - 1, parts[2]);
  var text = d.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  if (time) {
    var t = time.split(":");
    var hour = Number(t[0]);
    var suffix = hour >= 12 ? "PM" : "AM";
    hour = hour % 12 === 0 ? 12 : hour % 12;
    text += ", " + hour + ":" + t[1] + " " + suffix;
  }
  return text;
}

function findEvent(id) {
  for (var i = 0; i < events.length; i++) {
    if (events[i].id === id) {
      return events[i];
    }
  }
  return null;
}

var STORAGE_KEY = "unipulse-saved";

function getSaved() {
  try {
    var data = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(data) ? data : [];
  } catch (e) {
    return [];
  }
}

function setSaved(list) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch (e) {}
}

function isSaved(id) {
  return getSaved().indexOf(id) !== -1;
}

function toggleSaved(id) {
  var list = getSaved();
  var index = list.indexOf(id);
  if (index === -1) {
    list.push(id);
  } else {
    list.splice(index, 1);
  }
  setSaved(list);
}

var eventsList = document.getElementById("events");
var upcomingList = document.getElementById("upcoming");
var searchInput = document.getElementById("search");
var filterSelect = document.getElementById("filter");
var noResults = document.getElementById("no-results");
var browseSection = document.getElementById("browse");
var detailsSection = document.getElementById("details");
var detailsClose = document.getElementById("details-close");
var currentEventId = null;
var saveButton = null;
var sortSelect = null;
var resultCount = null;

var categoryIcons = {
  society: "\uD83D\uDC65",
  competition: "\uD83C\uDFC6",
  seminar: "\uD83C\uDFA4",
  social: "\uD83C\uDF89",
};

function createCard(ev) {
  var li = document.createElement("li");
  li.tabIndex = 0;
  li.setAttribute("role", "button");
  li.setAttribute("data-category", ev.category);

  var tag = document.createElement("span");
  tag.className = "badge";
  tag.textContent = categoryIcons[ev.category] + " " + capitalize(ev.category);

  var title = document.createElement("h3");
  title.textContent = ev.title;

  var meta = document.createElement("p");
  meta.textContent =
    capitalize(ev.category) + " | " + formatDate(ev.date, ev.time);

  var place = document.createElement("p");
  place.textContent = "Location: " + ev.location;

  li.appendChild(tag);
  li.appendChild(title);
  li.appendChild(meta);
  li.appendChild(place);

  if (isSaved(ev.id)) {
    var badge = document.createElement("small");
    badge.textContent = "\u2605 Saved";
    li.appendChild(badge);
  }

  li.addEventListener("click", function () {
    showDetails(ev.id);
  });
  li.addEventListener("keydown", function (e) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      showDetails(ev.id);
    }
  });

  return li;
}

function renderList(list, container) {
  container.innerHTML = "";
  list.forEach(function (ev) {
    container.appendChild(createCard(ev));
  });
}

function getFilteredEvents() {
  var query = searchInput ? searchInput.value.trim().toLowerCase() : "";
  var category = filterSelect ? filterSelect.value : "all";
  var saved = getSaved();

  var results = events.filter(function (ev) {
    var matchesName = ev.title.toLowerCase().indexOf(query) !== -1;
    var matchesCategory;
    if (category === "all") {
      matchesCategory = true;
    } else if (category === "saved") {
      matchesCategory = saved.indexOf(ev.id) !== -1;
    } else {
      matchesCategory = ev.category === category;
    }
    return matchesName && matchesCategory;
  });

  if (sortSelect && sortSelect.value === "name") {
    results.sort(function (a, b) {
      return a.title.localeCompare(b.title);
    });
  }
  return results;
}

function updateBrowse() {
  if (!eventsList) {
    return;
  }
  var results = getFilteredEvents();
  renderList(results, eventsList);

  if (resultCount) {
    resultCount.textContent =
      "Showing " + results.length + " of " + events.length + " events";
  }

  if (noResults) {
    var onlySaved = filterSelect && filterSelect.value === "saved";
    noResults.textContent =
      onlySaved && results.length === 0 && !searchInput.value.trim()
        ? "You have not saved any events yet."
        : "No events found.";
    noResults.hidden = results.length > 0;
  }
}

function updateUpcoming() {
  if (!upcomingList) {
    return;
  }
  var today = dateFromToday(0);
  var weekEnd = dateFromToday(7);

  var thisWeek = events.filter(function (ev) {
    return ev.date >= today && ev.date <= weekEnd;
  });

  if (thisWeek.length === 0) {
    thisWeek = events
      .filter(function (ev) {
        return ev.date >= today;
      })
      .slice(0, 3);
  }
  renderList(thisWeek, upcomingList);
}

function refreshLists() {
  updateBrowse();
  updateUpcoming();
}

if (filterSelect) {
  var savedOption = document.createElement("option");
  savedOption.value = "saved";
  savedOption.textContent = "Saved events";
  filterSelect.appendChild(savedOption);
  filterSelect.addEventListener("change", updateBrowse);

  var sortLabel = document.createElement("label");
  sortLabel.htmlFor = "sort";
  sortLabel.textContent = "Sort by:";

  sortSelect = document.createElement("select");
  sortSelect.id = "sort";
  sortSelect.innerHTML =
    '<option value="date">Date (soonest first)</option>' +
    '<option value="name">Name (A to Z)</option>';
  sortSelect.addEventListener("change", updateBrowse);

  filterSelect.insertAdjacentElement("afterend", sortSelect);
  filterSelect.insertAdjacentElement("afterend", sortLabel);
}

if (eventsList) {
  resultCount = document.createElement("p");
  resultCount.id = "result-count";
  resultCount.setAttribute("aria-live", "polite");
  eventsList.parentNode.insertBefore(resultCount, eventsList);
}
if (searchInput) {
  searchInput.addEventListener("input", updateBrowse);
}

function updateSaveButton() {
  if (!saveButton || currentEventId === null) {
    return;
  }
  var saved = isSaved(currentEventId);
  saveButton.textContent = saved ? "Remove from Saved" : "Save Event";
  saveButton.setAttribute("aria-pressed", saved ? "true" : "false");
}

function showDetails(id) {
  var ev = findEvent(id);
  if (!ev || !detailsSection) {
    return;
  }
  currentEventId = id;

  document.getElementById("details-title").textContent = ev.title;
  document.getElementById("details-category").textContent = capitalize(
    ev.category,
  );
  document.getElementById("details-date").textContent = formatDate(
    ev.date,
    ev.time,
  );
  document.getElementById("details-location").textContent = ev.location;
  document.getElementById("details-desc").textContent = ev.description;

  if (!saveButton) {
    saveButton = document.createElement("button");
    saveButton.type = "button";
    saveButton.id = "details-save";
    saveButton.style.marginRight = "10px";
    saveButton.addEventListener("click", function () {
      toggleSaved(currentEventId);
      updateSaveButton();
      refreshLists();
    });
    detailsClose.parentNode.insertBefore(saveButton, detailsClose);
  }
  updateSaveButton();

  if (browseSection) {
    browseSection.hidden = true;
  }
  detailsSection.hidden = false;
  detailsSection.scrollIntoView({ behavior: "smooth", block: "start" });
}

function closeDetails() {
  if (!detailsSection) {
    return;
  }
  detailsSection.hidden = true;
  currentEventId = null;
  if (browseSection) {
    browseSection.hidden = false;
    browseSection.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  refreshLists();
}

if (detailsClose) {
  detailsClose.addEventListener("click", closeDetails);
}

function showSavedView() {
  if (!filterSelect) {
    return;
  }
  filterSelect.value = "saved";
  if (searchInput) {
    searchInput.value = "";
  }
  if (detailsSection && !detailsSection.hidden) {
    closeDetails();
  } else {
    updateBrowse();
    if (browseSection) {
      browseSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }
}

function handleHash() {
  var hash = window.location.hash;
  if (hash === "#saved") {
    showSavedView();
  } else if (hash === "#browse" && detailsSection && !detailsSection.hidden) {
    closeDetails();
  }
}

window.addEventListener("hashchange", handleHash);

var savedLink = document.getElementById("saved-link");
if (savedLink) {
  savedLink.addEventListener("click", function () {
    showSavedView();
  });
}

var postForm = document.getElementById("post-form");

if (postForm) {
  var successMessage = document.getElementById("success");
  var fieldIds = [
    "organizer-type",
    "org-name",
    "name",
    "email",
    "title",
    "category",
    "date",
    "time",
    "location",
    "description",
  ];

  var orgNameLabel = document.querySelector('label[for="org-name"]');
  var orgTypeSelect = document.getElementById("organizer-type");
  var dateInput = document.getElementById("date");

  dateInput.min = dateFromToday(0);

  function setError(id, message) {
    var field = document.getElementById(id);
    var errorBox = document.getElementById(id + "-error");
    errorBox.textContent = message;
    if (message) {
      field.classList.add("invalid");
      field.setAttribute("aria-invalid", "true");
    } else {
      field.classList.remove("invalid");
      field.removeAttribute("aria-invalid");
    }
  }

  function getValue(id) {
    return document.getElementById(id).value.trim();
  }

  function checkField(id) {
    var value = getValue(id);
    var message = "";

    switch (id) {
      case "organizer-type":
        if (value === "") {
          message = "Please choose who is hosting.";
        }
        break;
      case "org-name":
        if (orgTypeSelect.value !== "student") {
          if (value === "") {
            message = "Please enter the society or organization name.";
          } else if (value.length < 2) {
            message = "Name must be at least 2 characters.";
          }
        }
        break;
      case "name":
        if (value === "") {
          message = "Please enter a contact name.";
        } else if (value.length < 2) {
          message = "Name must be at least 2 characters.";
        }
        break;
      case "email":
        if (value === "") {
          message = "Please enter a contact email.";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          message = "Please enter a valid email, e.g. name@example.com.";
        }
        break;
      case "title":
        if (value === "") {
          message = "Please enter an event title.";
        } else if (value.length < 3) {
          message = "Title must be at least 3 characters.";
        }
        break;
      case "category":
        if (value === "") {
          message = "Please choose a category.";
        }
        break;
      case "date":
        if (value === "") {
          message = "Please pick a date.";
        } else if (value < dateFromToday(0)) {
          message = "The date cannot be in the past.";
        }
        break;
      case "time":
        if (value === "") {
          message = "Please pick a time.";
        }
        break;
      case "location":
        if (value === "") {
          message = "Please enter a location.";
        }
        break;
      case "description":
        if (value === "") {
          message = "Please describe your event.";
        } else if (value.length < 10) {
          message = "Description must be at least 10 characters.";
        }
        break;
    }

    setError(id, message);
    return message === "";
  }

  fieldIds.forEach(function (id) {
    var field = document.getElementById(id);
    var eventName =
      field.tagName === "SELECT" ||
      field.type === "date" ||
      field.type === "time"
        ? "change"
        : "input";
    field.addEventListener(eventName, function () {
      if (field.classList.contains("invalid")) {
        checkField(id);
      }
      successMessage.hidden = true;
    });
  });

  orgTypeSelect.addEventListener("change", function () {
    orgNameLabel.textContent =
      orgTypeSelect.value === "student"
        ? "Society/organization name (optional)"
        : "Society/organization name";
    if (document.getElementById("org-name").classList.contains("invalid")) {
      checkField("org-name");
    }
  });

  postForm.addEventListener("submit", function (e) {
    e.preventDefault();
    var allValid = true;
    var firstInvalid = null;

    fieldIds.forEach(function (id) {
      if (!checkField(id)) {
        allValid = false;
        if (!firstInvalid) {
          firstInvalid = document.getElementById(id);
        }
      }
    });

    if (!allValid) {
      successMessage.hidden = true;
      firstInvalid.focus();
      return;
    }

    postForm.reset();
    orgNameLabel.textContent = "Society/organization name";
    successMessage.hidden = false;
    successMessage.scrollIntoView({ behavior: "smooth", block: "nearest" });
  });
}

var navBar = document.getElementById("nav");
var headerBar = document.querySelector("header");

if (navBar && headerBar) {
  var menuToggle = document.createElement("button");
  menuToggle.type = "button";
  menuToggle.id = "menu-toggle";
  menuToggle.textContent = "\u2630 Menu";
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-controls", "nav");
  headerBar.insertBefore(menuToggle, navBar);

  function setMenu(open) {
    navBar.classList.toggle("open", open);
    menuToggle.setAttribute("aria-expanded", open ? "true" : "false");
    menuToggle.textContent = open ? "\u2715 Close" : "\u2630 Menu";
  }

  menuToggle.addEventListener("click", function () {
    setMenu(!navBar.classList.contains("open"));
  });

  navBar.addEventListener("click", function (e) {
    if (e.target.tagName === "A") {
      setMenu(false);
    }
  });
}

refreshLists();
handleHash();
