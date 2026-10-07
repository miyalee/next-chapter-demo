import {
  OCCUPATIONS,
  CITY_DATA,
  CHARTS_BY_OCCUPATION,
  ICON_PATHS,
} from "./data.js";
import { occupationLabel } from "./flow.js";
import { ASSETS } from "./assets.js";

/* Pure HTML components. Stable IDs and data-design-name describe Figma frame boundaries. */
function escapeHtml(value) {
  return String(value).replace(
    /[&<>"']/g,
    (character) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        character
      ],
  );
}

function renderIcon(name) {
  return `<svg class="icon" viewBox="0 0 20 20" aria-hidden="true">${ICON_PATHS[name]}</svg>`;
}

export function memberInitials(member) {
  if (/^Family Member \d+$/.test(member.name))
    return "M" + member.name.split(" ").at(-1);
  return (
    member.name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase() || "FM"
  );
}

function renderAvatar(member, small = false) {
  const className = `avatar${small ? " small avatar--small" : ""}`;
  const name = escapeHtml(member.name);
  const metadata = `data-avatar-for="${member.id}" data-design-name="Avatar/${name}"`;
  return member.avatar
    ? `<img class="${className}" src="${ASSETS[member.avatar]}" alt="${name}" ${metadata}>`
    : `<span class="${className} avatar--initials" role="img" aria-label="${name}" data-tone="${member.order % 4}" ${metadata}>${escapeHtml(memberInitials(member))}</span>`;
}

function familyContext(state) {
  const people =
    state.members.length === 1
      ? "Maya"
      : state.members.length === 2
        ? `Maya & ${state.members[1].name}`
        : `Maya + ${state.members.length - 1} family members`;
  return `${people} · ${state.cities.length} cities`;
}

export function renderHeaderContext(state) {
  return `<div class="avatar-group" data-design-name="FamilyAvatars">${state.members.map((member) => renderAvatar(member, true)).join("")}</div>
    <span class="context-label">${escapeHtml(familyContext(state))}</span>`;
}

function renderApplicationHeader(state) {
  return `<header id="application-header" class="application-header" data-component="ApplicationHeader" data-design-name="ApplicationHeader">
    <div class="application-header__inner">
      <button class="brand" data-action="edit-analysis" aria-label="Back to analysis setup" data-design-name="Brand">
        <span class="brand-symbol">${renderIcon("spark")}</span>
        <span><strong>Next Chapter</strong><small>A destination for your family.</small></span>
      </button>
      <div class="application-header__actions" data-design-name="HeaderActions">
        <div id="header-family-context" class="header-context" data-design-name="FamilyContext">${renderHeaderContext(state)}</div>
        <button class="button button--primary toolbar-button" data-action="edit-analysis" data-design-name="EditAnalysisButton">
          ${renderIcon("edit")} Edit analysis
        </button>
      </div>
    </div>
  </header>`;
}

function renderOccupationOptions(occupation) {
  return OCCUPATIONS.map(
    (item) =>
      `<option value="${item.id}" ${item.id === occupation ? "selected" : ""}>${item.label}</option>`,
  ).join("");
}

export function memberAvailability(member) {
  return CHARTS_BY_OCCUPATION[member.occupation]
    ? ""
    : `${occupationLabel(member.occupation)} charts are not available yet.`;
}

function renderFamilyMemberCard(member, index) {
  const name = escapeHtml(member.name);
  return `<section id="family-member-${member.id}" class="card family-member-card" data-member-id="${member.id}" data-component="FamilyMemberCard" data-design-name="FamilyMemberCard/${name}">
    <div class="family-member-card__header" data-design-name="MemberIdentity">
      ${renderAvatar(member)}
      <div class="family-member-card__identity">
        ${index === 0 ? `<h2>${name}</h2>` : `<input class="family-member-card__name" value="${name}" data-member-name="${member.id}" maxlength="36" aria-label="Family member name" data-design-name="MemberName">`}
        <p>${index === 0 ? "Your career" : member.avatar === "alex" ? "Your partner’s career" : "Family member’s career"}</p>
      </div>
      ${index === 0 ? "" : `<button class="button button--text family-member-card__remove" data-action="remove-member" data-member-id="${member.id}" aria-label="Remove ${name}" data-design-name="RemoveMemberButton">${renderIcon("close")}</button>`}
    </div>
    <label for="occupation-${member.id}">Occupation</label>
    <select id="occupation-${member.id}" class="field" data-member-occupation="${member.id}" data-component="OccupationSelect" data-design-name="OccupationSelect/${name}">
      ${renderOccupationOptions(member.occupation)}
    </select>
    <p id="availability-${member.id}" class="family-member-card__availability" data-design-name="DataAvailability">${escapeHtml(memberAvailability(member))}</p>
  </section>`;
}

function renderAddFamilyMemberCard() {
  return `<button id="add-family-member-card" class="add-family-member-card" data-action="add-member" data-component="AddFamilyMemberCard" data-design-name="AddFamilyMemberCard">
    <span class="add-family-member-card__icon">${renderIcon("plus")}</span>
    <strong>Add Another Family Member to this analysis</strong>
    <small>Explore one destination for your family.</small>
  </button>`;
}

function renderCitySelection(state) {
  return `<section id="city-selection-section" class="card city-selection-section" data-component="CitySelectionSection" data-design-name="CitySelectionSection">
    <div class="city-selection-section__header" data-design-name="SectionHeader">
      <h2>Cities to explore</h2>
      <div class="city-selection-section__actions">
        <span class="tiny" id="city-count">${state.cities.length} selected</span>
        <button class="button button--text" data-action="toggle-cities" data-design-name="SelectAllCitiesButton">${state.cities.length === 8 ? "Clear all" : "Select all"}</button>
      </div>
    </div>
    <div class="city-selection-grid" data-design-name="CityOptions">
      ${CITY_DATA.map(
        (
          city,
        ) => `<label class="city-selection-option" data-design-name="CityOption/${escapeHtml(city.name)}">
        <input type="checkbox" data-city="${escapeHtml(city.name)}" ${state.cities.includes(city.name) ? "checked" : ""}>
        <span>${city.name}</span>
      </label>`,
      ).join("")}
    </div>
    <div class="error" id="setup-error" role="alert"></div>
  </section>`;
}

export function renderSetupScreen(state) {
  const mode =
    state.members.length === 1
      ? "Single career"
      : state.members.length === 2
        ? "Two members"
        : `${state.members.length} family members`;
  return `<article id="screen-setup" class="demo-screen demo-screen--setup" data-screen="setup" data-design-name="SetupScreen">
    ${renderApplicationHeader(state)}
    <main class="setup-screen__content" data-design-name="SetupContent">
      <div class="screen-heading" data-design-name="ScreenHeading">
        <div><h1>Start your next chapter.</h1><p>Choose who you’re analysing and where you’d like to move.</p></div>
        <span id="family-mode-label" class="pill">${mode}</span>
      </div>
      <section id="family-members-section" class="family-members-grid" style="--member-columns:${state.members.length === 1 ? 2 : 3}" aria-label="Family members" data-component="FamilyMembersSection" data-design-name="FamilyMembersSection">
        ${state.members.map(renderFamilyMemberCard).join("")}
        ${renderAddFamilyMemberCard()}
      </section>
      ${renderCitySelection(state)}
      <div class="setup-actions" data-design-name="SetupActions">
        <p id="setup-family-summary">${state.members.length === 1 ? "Maya · a guided look at your career options." : `${state.members.length} family members · one shared destination.`}</p>
        <button class="button button--primary" data-action="start-analysis" data-design-name="StartAnalysisButton">Start analysis ${renderIcon("arrow")}</button>
      </div>
    </main>
  </article>`;
}

function renderCareerOwners(ownerIds, members) {
  return `<div class="career-owner-list" data-component="CareerOwnerList" data-design-name="CareerOwners">
    ${ownerIds
      .map((id, index) => {
        const member = members.find((person) => person.id === id);
        return `${index ? '<span class="career-owner-divider"></span>' : ""}<div class="career-owner" data-design-name="CareerOwner/${escapeHtml(member.name)}">
        ${renderAvatar(member)}<div><strong>${escapeHtml(member.name)}</strong><span class="career">${occupationLabel(member.occupation)}</span></div>
      </div>`;
      })
      .join("")}
  </div>`;
}

function renderStepProgress(state, steps) {
  return `<nav id="step-progress" class="step-progress" aria-label="Analysis steps" data-component="StepProgress" data-design-name="StepProgress">
    <div class="step-progress__header"><h2>${state.members.length === 1 ? "Maya’s career journey" : "Your family’s shared journey"}</h2><p class="tabular-number">Step ${state.stepIndex + 1} of ${steps.length}</p></div>
    <div class="step-progress__viewport"><div class="step-progress__list" style="--count:${steps.length}">
      ${steps
        .map(
          (
            step,
            index,
          ) => `<button class="step-progress__item ${index === state.stepIndex ? "is-current" : index < state.stepIndex ? "is-before" : ""}" data-step-id="${step.id}" ${index === state.stepIndex ? 'aria-current="step"' : ""} aria-label="Step ${index + 1}: ${escapeHtml(step.shortLabel)}" data-design-name="ProgressStep/${step.id}">
        <span class="step-progress__number">${index < state.stepIndex ? renderIcon("check") : index + 1}</span><span>${escapeHtml(step.shortLabel)}</span>
      </button>`,
        )
        .join("")}
    </div></div>
  </nav>`;
}

function renderChartPanel(step, state) {
  return `<section id="chart-panel" class="card chart-panel" aria-label="Chart" data-component="ChartPanel" data-design-name="ChartPanel">
    <div class="chart-panel__header" data-design-name="ChartHeader"><div>${renderCareerOwners(step.owners, state.members)}<h1 id="step-title" tabindex="-1">${escapeHtml(step.title)}</h1></div></div>
    <div class="chart-panel__image-container" data-design-name="ChartImageContainer"><img class="chart-image ${step.portrait ? "chart-image--portrait" : ""}" src="${ASSETS[step.chart]}" alt="${escapeHtml(step.caption)}" draggable="false" data-design-name="ChartImage/${step.chart}"></div>
    <div class="chart-panel__caption" data-design-name="ChartCaption"><span>${escapeHtml(step.caption)} · Stage 3, Figure ${step.chart.replace("fig", "").replace(/(nurse|ict)$/, "")}</span><span>Original eight-city reference</span></div>
  </section>`;
}

function renderInsightPanel(step) {
  return `<aside id="insight-panel" class="card insight-panel ${step.recommendation ? "insight-panel--recommendation" : ""}" aria-label="Explanation" data-component="InsightPanel" data-design-name="InsightPanel">
    <div class="insight-panel__header">${renderIcon("spark")} ${step.recommendation ? "Your next step" : "What this means for you"}</div>
    <section class="insight-panel__section" data-design-name="EvidenceSection"><div class="label">${step.recommendation ? "Recommendation" : "What the data says"}</div><h3>${escapeHtml(step.heading)}</h3><p>${escapeHtml(step.evidence)}</p></section>
    <section class="insight-panel__section" data-design-name="MeaningSection"><div class="label">${step.recommendation ? "Why it fits" : "What it means"}</div><p>${escapeHtml(step.meaning)}</p></section>
    <section class="insight-panel__section" data-design-name="NextQuestionSection"><div class="label">${step.recommendation ? "From insight to action" : "Next question"}</div><p>${escapeHtml(step.nextQuestion)}</p></section>
  </aside>`;
}

function renderBottomNavigation(state, steps) {
  const last = state.stepIndex === steps.length - 1;
  return `<footer id="bottom-navigation" class="bottom-navigation" data-component="BottomNavigation" data-design-name="BottomNavigation"><div class="bottom-navigation__inner">
    <button class="button" data-action="previous-step" ${state.stepIndex === 0 ? "disabled" : ""} data-design-name="PreviousStepButton">${renderIcon("back")} Previous</button>
    <div class="bottom-navigation__next">
      <div class="bottom-navigation__hint">${last ? "Your analysis is complete" : "Up next"}<strong>${last ? "Your next chapter" : escapeHtml(steps[state.stepIndex + 1].shortLabel)}</strong></div>
      ${last ? `<button class="button button--primary export-report-button" type="button" aria-disabled="true" title="Demo button" data-design-name="ExportReportButton">${renderIcon("download")} Export report</button>` : `<button class="button button--primary" data-action="next-step" data-design-name="NextStepButton">Next ${renderIcon("arrow")}</button>`}
    </div>
  </div></footer>`;
}

export function renderAnalysisScreen(state, steps) {
  const step = steps[state.stepIndex];
  return `<article id="screen-analysis-${step.id}" class="demo-screen demo-screen--analysis" data-screen="${step.id}" data-design-name="${step.screenName}">
    ${renderApplicationHeader(state)}
    <main class="analysis-screen__content" data-design-name="AnalysisContent">
      ${renderStepProgress(state, steps)}
      <div class="analysis-layout" data-design-name="AnalysisLayout">${renderChartPanel(step, state)}${renderInsightPanel(step)}</div>
    </main>
    ${renderBottomNavigation(state, steps)}
  </article>`;
}
