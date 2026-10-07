import "./styles.css";
import { CITY_DATA, OCCUPATIONS } from "./data.js";
import { createAnalysisSteps } from "./flow.js";
import {
  memberInitials,
  memberAvailability,
  renderHeaderContext,
  renderSetupScreen,
  renderAnalysisScreen,
} from "./components.js";

/* State, events and direct screen routes. Components remain pure render functions. */
const appRoot = document.getElementById("app-root");

function createInitialState() {
  return {
    screen: "setup",
    stepIndex: 0,
    members: [
      {
        id: "member-1",
        name: "Maya",
        occupation: "nurse",
        avatar: "maya",
        order: 0,
      },
    ],
    nextMemberNumber: 2,
    cities: CITY_DATA.map((city) => city.name),
  };
}

const state = createInitialState();

function appendFamilyMember() {
  const number = state.nextMemberNumber++;
  const firstAdditionalMember = state.members.length === 1;
  const member = {
    id: `member-${number}`,
    name: firstAdditionalMember ? "Alex" : `Family Member ${number}`,
    occupation: firstAdditionalMember
      ? state.members[0].occupation === "ict"
        ? "nurse"
        : "ict"
      : number % 2 === 1
        ? "nurse"
        : "ict",
    avatar: firstAdditionalMember ? "alex" : null,
    order: number - 1,
  };
  state.members.push(member);
  return member;
}

function currentSteps() {
  return createAnalysisSteps(state);
}

function renderApp() {
  const steps = currentSteps();
  state.stepIndex = Math.min(state.stepIndex, steps.length - 1);
  appRoot.innerHTML =
    state.screen === "setup"
      ? renderSetupScreen(state)
      : renderAnalysisScreen(state, steps);
  document.title =
    state.screen === "setup"
      ? "Next Chapter · Start your analysis"
      : `${steps[state.stepIndex].shortLabel} · Next Chapter`;
}

function updateScreenRoute() {
  const url = new URL(window.location.href);
  url.searchParams.set("members", String(state.members.length));
  url.hash =
    state.screen === "setup"
      ? "/setup"
      : `/analysis/${currentSteps()[state.stepIndex].id}`;
  window.history.replaceState(null, "", url);
}

function focusCurrentStep() {
  document.getElementById("step-title")?.focus({ preventScroll: true });
  const active = appRoot.querySelector(".step-progress__item.is-current");
  const viewport = appRoot.querySelector(".step-progress__viewport");
  if (!active || !viewport) return;
  const activeBounds = active.getBoundingClientRect();
  const viewportBounds = viewport.getBoundingClientRect();
  if (
    activeBounds.left < viewportBounds.left ||
    activeBounds.right > viewportBounds.right
  ) {
    viewport.scrollLeft +=
      activeBounds.left -
      viewportBounds.left -
      viewport.clientWidth / 2 +
      active.offsetWidth / 2;
  }
}

function navigateToStep(index) {
  state.stepIndex = Math.max(0, Math.min(currentSteps().length - 1, index));
  state.screen = "analysis";
  renderApp();
  updateScreenRoute();
  window.scrollTo({ top: 0, behavior: "instant" });
  focusCurrentStep();
}

function editAnalysis() {
  state.screen = "setup";
  state.stepIndex = 0;
  renderApp();
  updateScreenRoute();
  window.scrollTo({ top: 0, behavior: "instant" });
}

function synchronizeSetupMetadata() {
  const header = document.getElementById("header-family-context");
  if (header) header.innerHTML = renderHeaderContext(state);
  state.members.forEach((member) => {
    const card = document.getElementById(`family-member-${member.id}`);
    if (!card) return;
    card.dataset.designName = `FamilyMemberCard/${member.name}`;
    const avatar = card.querySelector("[data-avatar-for]");
    if (avatar && !member.avatar) {
      avatar.textContent = memberInitials(member);
      avatar.setAttribute("aria-label", member.name);
      avatar.dataset.designName = `Avatar/${member.name}`;
    }
    const availability = document.getElementById(`availability-${member.id}`);
    if (availability) availability.textContent = memberAvailability(member);
  });
  const count = document.getElementById("city-count");
  if (count) count.textContent = `${state.cities.length} selected`;
  const toggle = appRoot.querySelector('[data-action="toggle-cities"]');
  if (toggle)
    toggle.textContent =
      state.cities.length === CITY_DATA.length ? "Clear all" : "Select all";
  const error = document.getElementById("setup-error");
  if (error) error.textContent = "";
}

appRoot.addEventListener("click", (event) => {
  const stepButton = event.target.closest("[data-step-id]");
  if (stepButton) {
    navigateToStep(
      currentSteps().findIndex((step) => step.id === stepButton.dataset.stepId),
    );
    return;
  }
  const button = event.target.closest("[data-action]");
  if (!button || button.disabled) return;
  switch (button.dataset.action) {
    case "edit-analysis":
      editAnalysis();
      break;
    case "add-member": {
      const member = appendFamilyMember();
      renderApp();
      updateScreenRoute();
      document
        .getElementById(`occupation-${member.id}`)
        ?.focus({ preventScroll: true });
      break;
    }
    case "remove-member":
      state.members = state.members.filter(
        (member, index) => index === 0 || member.id !== button.dataset.memberId,
      );
      renderApp();
      updateScreenRoute();
      document
        .getElementById("add-family-member-card")
        ?.focus({ preventScroll: true });
      break;
    case "toggle-cities":
      state.cities =
        state.cities.length === CITY_DATA.length
          ? []
          : CITY_DATA.map((city) => city.name);
      renderApp();
      break;
    case "start-analysis":
      if (!state.cities.length) {
        document.getElementById("setup-error").textContent =
          "Choose at least one city to begin.";
        return;
      }
      navigateToStep(0);
      break;
    case "previous-step":
      navigateToStep(state.stepIndex - 1);
      break;
    case "next-step":
      navigateToStep(state.stepIndex + 1);
      break;
  }
});

appRoot.addEventListener("change", (event) => {
  const input = event.target;
  if (input.dataset.memberOccupation) {
    const member = state.members.find(
      (person) => person.id === input.dataset.memberOccupation,
    );
    if (
      member &&
      OCCUPATIONS.some((occupation) => occupation.id === input.value)
    )
      member.occupation = input.value;
  } else if (input.dataset.memberName) {
    const member = state.members.find(
      (person) => person.id === input.dataset.memberName,
    );
    if (member)
      member.name = input.value.trim() || `Family Member ${member.order + 1}`;
    input.value = member.name;
  } else if (input.dataset.city) {
    state.cities = state.cities.filter((name) => name !== input.dataset.city);
    if (input.checked) state.cities.push(input.dataset.city);
  }
  synchronizeSetupMetadata();
});

function initializeRoute() {
  const url = new URL(window.location.href);
  const count = Math.min(
    20,
    Math.max(1, Number(url.searchParams.get("members")) || 1),
  );
  while (state.members.length < count) appendFamilyMember();
  const careers = url.searchParams.get("careers")?.split(",") || [];
  state.members.forEach((member, index) => {
    if (OCCUPATIONS.some((occupation) => occupation.id === careers[index]))
      member.occupation = careers[index];
  });
  const stepId = url.hash.replace("#/analysis/", "");
  const index = currentSteps().findIndex((step) => step.id === stepId);
  if (index >= 0) {
    state.screen = "analysis";
    state.stepIndex = index;
  }
  renderApp();
  if (state.screen === "analysis") focusCurrentStep();
}

window.addEventListener("hashchange", () => {
  const route = window.location.hash;
  if (route === "#/setup" || !route) editAnalysis();
  else {
    const index = currentSteps().findIndex(
      (step) => `#/analysis/${step.id}` === route,
    );
    if (index >= 0) navigateToStep(index);
  }
});

// A small capture API keeps static exports independent of DOM implementation details.
window.NextChapterDemo = {
  getState: () => structuredClone(state),
  getSteps: () => structuredClone(currentSteps()),
  navigateToStep,
  editAnalysis,
};

initializeRoute();
