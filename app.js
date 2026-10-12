"use strict";

// Only the current choices are kept. Reloading starts a new check.
const state = { incident: null, answers: {}, index: 0 };
const app = document.getElementById("app");

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, character => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[character]);
}

function sourceLink(key) {
  const [name, url] = SOURCES[key];
  return ` <a class="source-ref" href="${url}" target="_blank" rel="noopener noreferrer" aria-label="Quelle: ${escapeHtml(name)}">[Quelle]</a>`;
}

function progress(label, fraction) {
  const percentage = Math.round(fraction * 100);
  return `<div class="stepbar"><span>${label}</span><span>${percentage} %</span></div>
    <div class="progress" aria-hidden="true"><span style="width:${percentage}%"></span></div>`;
}

function show(markup) {
  app.innerHTML = `<div class="app-inner">${markup}</div>`;
}

function renderStart() {
  state.incident = null;
  state.answers = {};
  state.index = 0;

  const cards = INCIDENTS.map(incident => `
    <button class="choice" data-incident="${incident.id}">
      <span class="icon" aria-hidden="true">${incident.icon}</span>
      <span><strong>${incident.title}</strong><small>${incident.hint}</small></span>
    </button>`).join("");

  show(`${progress("Schritt 1: Vorfall wählen", 0)}
    <h2 class="section-title">Wobei brauchen Sie Hilfe?</h2>
    <p class="section-copy">Wählen Sie den Vorfall, der am besten passt. Weitere Einzelheiten fragen wir anschließend ab.</p>
    <div class="cards">${cards}</div>`);
}

function currentQuestions() {
  if (state.incident.id === "link") {
    if (state.answers.linkAction === "entered") return ["linkAction", "service", "reuse", "personal"];
    if (state.answers.linkAction === "file") return ["linkAction", "malwareActive", "personal"];
  }
  return state.incident.qs;
}

function renderQuestion() {
  const questionIds = currentQuestions();
  const question = QUESTIONS[questionIds[state.index]];
  const fraction = (state.index + 1) / (questionIds.length + 1);
  const options = question.options.map(([value, label]) => `
    <button class="choice" data-answer="${value}">
      <span class="icon" aria-hidden="true">→</span><strong>${label}</strong>
    </button>`).join("");

  show(`${progress(`Schritt ${state.index + 2} von ${questionIds.length + 2}`, fraction)}
    <p class="eyebrow">${state.incident.title}</p>
    <h2 class="section-title">${question.title}</h2>
    <p class="section-copy">Wählen Sie die passendste Antwort. Bei Unsicherheit ist „Unbekannt“ in Ordnung.</p>
    <div class="question-options">${options}</div>
    <div class="actions">
      <button class="btn secondary" data-back>Zurück</button>
      <button class="btn secondary" data-restart>Anderen Vorfall wählen</button>
    </div>`);
}

function renderList(items) {
  return `<ol>${items.map(item => `<li>${escapeHtml(item.text)}${sourceLink(item.src)}</li>`).join("")}</ol>`;
}

function renderSources(keys) {
  const entries = [...keys].filter(key => SOURCES[key]);
  return `<ul class="source-list">${entries.map(key => {
    const [name, url, description] = SOURCES[key];
    return `<li><a href="${url}" target="_blank" rel="noopener noreferrer">${escapeHtml(name)}</a><small>${escapeHtml(description)}</small></li>`;
  }).join("")}</ul>`;
}

function renderResult() {
  const plan = buildPlan(state.incident, state.answers);
  const usedSources = new Set(
    [plan.now, plan.external, plan.follow, plan.document, plan.privacy]
      .flat().map(item => item.src)
  );

  show(`${progress("Ihre Orientierung", 1)}
    <p class="eyebrow">${state.incident.title}</p>
    <h2 class="section-title">Ihr nächster Schritt</h2>
    <p class="section-copy">Beginnen Sie mit „Jetzt“. Vorstand oder Gemeindeleitung kann die Schritte koordinieren; eine eigene IT-Abteilung ist nicht nötig.</p>
    <div class="result-intro"><strong>Wichtig</strong><p>Diese Hinweise beruhen auf Ihren groben Angaben. Wenn sich der Sachverhalt ändert, prüfen Sie die Lage und mögliche Meldepflichten erneut.</p></div>
    <div class="result-grid">
      <section class="result-box now"><h3>1 · Jetzt</h3>${renderList(plan.now)}</section>
      <section class="result-box alert"><h3>2 · Wen extern informieren?</h3>${renderList(plan.external)}</section>
      <section class="result-box"><h3>3 · Danach</h3>${renderList(plan.follow)}</section>
      <section class="result-box"><h3>4 · Dokumentation</h3>${renderList(plan.document)}</section>
      <section class="result-box privacy"><h3>5 · Datenschutz prüfen</h3>${renderList(plan.privacy)}</section>
    </div>
    <details><summary>Quellen zu dieser Orientierung</summary>${renderSources(usedSources)}</details>
    <div class="actions">
      <button class="btn" data-print>Checkliste drucken / als PDF speichern</button>
      <button class="btn secondary" data-back>Antwort ändern</button>
      <button class="btn secondary" data-restart>Neuen Vorfall prüfen</button>
    </div>`);
}

function focusCurrentStep() {
  app.scrollIntoView({ behavior: "smooth", block: "start" });
  const heading = app.querySelector("h2");
  heading.setAttribute("tabindex", "-1");
  heading.focus({ preventScroll: true });
}

app.addEventListener("click", event => {
  const button = event.target.closest("button");
  if (!button) return;

  if (button.dataset.incident) {
    state.incident = INCIDENTS.find(incident => incident.id === button.dataset.incident);
    state.answers = {};
    state.index = 0;
    renderQuestion();
  } else if (button.dataset.answer) {
    state.answers[currentQuestions()[state.index]] = button.dataset.answer;
    state.index += 1;
    if (state.index < currentQuestions().length) renderQuestion();
    else renderResult();
  } else if (button.hasAttribute("data-back")) {
    if (state.index === 0) {
      renderStart();
    } else {
      state.index -= 1;
      delete state.answers[currentQuestions()[state.index]];
      renderQuestion();
    }
  } else if (button.hasAttribute("data-restart")) {
    renderStart();
  } else if (button.hasAttribute("data-print")) {
    window.print();
    return;
  } else {
    return;
  }

  focusCurrentStep();
});

document.getElementById("all-sources").innerHTML = renderSources(Object.keys(SOURCES));
renderStart();
