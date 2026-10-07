import {
  OCCUPATIONS,
  CITY_DATA,
  CAREER_INSIGHTS,
  CHARTS_BY_OCCUPATION,
} from "./data.js";

/* Analysis steps are data objects, independent of DOM rendering. */
export function occupationLabel(id) {
  return OCCUPATIONS.find((occupation) => occupation.id === id)?.label || id;
}

function groupSupportedMembers(members) {
  const groups = new Map();
  members.forEach((member) => {
    if (!CHARTS_BY_OCCUPATION[member.occupation]) return;
    if (!groups.has(member.occupation)) groups.set(member.occupation, []);
    groups.get(member.occupation).push(member);
  });
  return [...groups].map(([occupation, people]) => ({ occupation, people }));
}

function missingOccupations(members) {
  return [
    ...new Set(
      members
        .filter((member) => !CHARTS_BY_OCCUPATION[member.occupation])
        .map((member) => occupationLabel(member.occupation)),
    ),
  ];
}

function availabilitySummary(members) {
  const missing = missingOccupations(members);
  return missing.length
    ? `${missing.join(", ")} charts are not available in this demo and are not included in the career comparison.`
    : "";
}

function selectRecommendation(state, groups) {
  const cities = CITY_DATA.filter((city) => state.cities.includes(city.name));
  if (!cities.length) return CITY_DATA[0];
  if (state.cities.includes("Brisbane"))
    return cities.find((city) => city.name === "Brisbane");
  if (!groups.length) return cities[0];
  if (groups.length === 2)
    return cities.sort((a, b) => b.household - a.household)[0];
  const occupation = groups[0].occupation;
  const total = (city) =>
    city[occupation].reduce((sum, value) => sum + value, 0);
  return cities.sort((a, b) => total(b) - total(a))[0];
}

function createCareerStep(group, phase) {
  const copy = CAREER_INSIGHTS[group.occupation][phase];
  const label = occupationLabel(group.occupation);
  const phaseLabels = {
    market: "Market",
    trend: "Trend",
    history: "History",
    stability: "Stability",
  };
  const captions = {
    market: "2025 demand share",
    trend: "2015–2025 demand trend",
    history: "Demand index · 2019 = 100",
    stability: "Growth: 2025 vs 2019 · Stability: 2010–2025",
  };
  return {
    id: `${group.occupation}-${phase}`,
    screenName: `Analysis/${label}/${phaseLabels[phase]}`,
    owners: group.people.map((member) => member.id),
    shortLabel:
      group.people.length === 1
        ? `${group.people[0].name} · ${phase}`
        : `${label} · ${phase}`,
    title: copy.title,
    chart: CHARTS_BY_OCCUPATION[group.occupation][phase],
    portrait: phase === "stability",
    heading: copy.heading,
    evidence: copy.what,
    meaning: copy.meaning,
    nextQuestion: copy.next,
    caption: captions[phase],
  };
}

function createHouseholdSteps(ownerIds) {
  return [
    {
      id: "career-match",
      screenName: "Analysis/Household/CareerMatch",
      owners: ownerIds,
      shortLabel: "Career match",
      title: "Find a city that works for your family.",
      chart: "fig13",
      portrait: true,
      heading: "Protect the weaker career",
      evidence:
        "In the baseline household comparison, Brisbane scores 54.5 and Sydney 53.4. The household score is the lower of the Nursing and ICT career scores.",
      meaning:
        "A strong result for one career cannot hide a weak result for the other. Family members with the same occupation share the same labour-market evidence.",
      nextQuestion:
        "Their scores are close. Look at the strengths behind the numbers.",
      caption: "Nursing and ICT sustainability · baseline",
    },
    {
      id: "score-breakdown",
      screenName: "Analysis/Household/ScoreBreakdown",
      owners: ownerIds,
      shortLabel: "Score breakdown",
      title: "Similar scores can come from different strengths.",
      chart: "fig14",
      heading: "Understand what you are choosing",
      evidence:
        "Sydney’s ICT size score is 100. Brisbane’s ICT and nursing stability scores are 82.8 and 100, while its markets are smaller.",
      meaning:
        "Sydney relies more on its large current market. Brisbane offers a more balanced mix of size, growth and historical consistency.",
      nextQuestion:
        "Check whether that conclusion survives different assumptions.",
      caption: "Relative size, growth and stability scores",
    },
    {
      id: "test-assumptions",
      screenName: "Analysis/Household/TestAssumptions",
      owners: ownerIds,
      shortLabel: "Test assumptions",
      title: "No city wins under every assumption.",
      chart: "fig15",
      heading: "A recommendation needs context",
      evidence:
        "The supplied table shows ten scenarios, S0–S9. Adelaide ranks first in five; Sydney’s rank varies from 1 to 7.",
      meaning:
        "Changing the emphasis or measurement can change the ranking. Treat the baseline as a useful decision frame, rather than a guaranteed answer.",
      nextQuestion: "Focus the comparison on Brisbane and Sydney.",
      caption: "City ranks across 10 supplied scenarios",
    },
    {
      id: "compare-finalists",
      screenName: "Analysis/Household/CompareFinalists",
      owners: ownerIds,
      shortLabel: "Compare finalists",
      title: "Brisbane keeps the edge in most tested scenarios.",
      chart: "fig16",
      portrait: true,
      heading: "A close result, tested further",
      evidence:
        "Brisbane leads Sydney in seven of the ten supplied head-to-head scenarios. Sydney leads in three.",
      meaning:
        "Brisbane’s case is its consistency across reasonable assumptions. Sydney remains a close alternative, especially when market size matters most.",
      nextQuestion: "Use the evidence to choose a city to explore together.",
      caption: "Brisbane vs Sydney · S0–S9",
    },
  ];
}

function createRecommendationStep(state, groups) {
  const city = selectRecommendation(state, groups);
  const brisbane = city.name === "Brisbane";
  let evidence;
  let meaning;
  if (groups.length === 2) {
    evidence = brisbane
      ? "Brisbane leads the baseline Nursing–ICT household analysis with a score of 54.5. Sydney remains close at 53.4."
      : `${city.name} has the highest published Nursing–ICT household score among your selected cities (${city.household.toFixed(1)}).`;
    meaning =
      "It balances nursing security with ICT opportunities, giving the covered careers a shared starting point to investigate.";
  } else if (groups.length === 1) {
    const label = occupationLabel(groups[0].occupation);
    evidence = brisbane
      ? `Brisbane offers ${groups[0].occupation === "nurse" ? "54.6% nursing growth and the highest relative nursing stability score" : "greater ICT consistency than Sydney, with a stability score of 82.8"}. It is a useful city to investigate for your next move.`
      : `${city.name} leads the equal-priority ${label} score among your selected cities.`;
    meaning =
      "This story recommendation brings growth and consistency into your decision. It is a starting point to investigate, rather than a guarantee of a job.";
  } else {
    evidence = `${city.name} remains the sample destination in this story demo. Career charts are not available for your selected occupations, so this is not a scored career recommendation.`;
    meaning =
      "Add occupation-specific evidence before using this example to make a relocation decision.";
  }
  const scope = availabilitySummary(state.members);
  return {
    id: "recommendation",
    screenName: "Analysis/Recommendation",
    owners: state.members.map((member) => member.id),
    shortLabel: "Recommendation",
    title: `Your next chapter: ${city.name}.`,
    chart: groups.length === 2 ? "fig17" : "fig5",
    recommendation: true,
    heading: `${city.name} is your starting point`,
    evidence,
    meaning: scope ? `${meaning} ${scope}` : meaning,
    nextQuestion: `Explore employers in ${city.name}, then check housing, registration and visa requirements before committing.`,
    caption:
      groups.length === 2
        ? "Final Nursing–ICT household ranking · original baseline map"
        : `Your next destination · ${city.name}`,
  };
}

export function createAnalysisSteps(state) {
  const groups = groupSupportedMembers(state.members);
  const supportedIds = groups.flatMap((group) =>
    group.people.map((member) => member.id),
  );
  const scope = availabilitySummary(state.members);
  const overview = {
    id: "candidate-cities",
    screenName: "Analysis/CandidateCities",
    owners: state.members.map((member) => member.id),
    shortLabel: "Candidate cities",
    title: "Start with your possible destinations.",
    chart: "fig5",
    heading: "A place for your next chapter",
    evidence: `You have selected ${state.cities.length} ${state.cities.length === 1 ? "city" : "cities"} from the eight candidate urban areas. The map shows the original geographic overview.`,
    meaning: `${state.members.length > 1 ? "Your family needs one shared destination. The same city may offer different opportunities for each occupation." : "Your career’s market size, demand history and stability will help you look closer."}${scope ? " " + scope : ""}`,
    nextQuestion: groups.length
      ? "Start with where hiring demand is concentrated."
      : "Review the sample destination, then add evidence for your selected occupations.",
    caption: "Eight candidate urban areas",
  };
  const steps = [overview];
  if (groups.length === 2) {
    steps.push(...groups.map((group) => createCareerStep(group, "market")));
    steps.push({
      id: "demand-trends",
      screenName: "Analysis/Shared/DemandTrends",
      owners: supportedIds,
      shortLabel: "Demand trends",
      title: "Today’s market size does not tell the whole story.",
      chart: "fig8",
      portrait: true,
      heading: "Two occupations, different trajectories",
      evidence:
        "From 2015 to 2025, ICT and nursing hiring demand follow different paths. The biggest markets dominate the shared vertical scale.",
      meaning:
        "A city can remain large while demand declines. A smaller market can grow strongly without looking dramatic on this chart.",
      nextQuestion: "Compare each career against its own 2019 baseline.",
      caption: "ICT and nursing · 2015–2025",
    });
    steps.push(...groups.map((group) => createCareerStep(group, "history")));
    steps.push(...groups.map((group) => createCareerStep(group, "stability")));
    steps[steps.length - 1].nextQuestion =
      "Which city can support the covered careers at the same time?";
    steps.push(...createHouseholdSteps(supportedIds));
  } else if (groups.length === 1) {
    steps.push(
      ...["market", "trend", "history", "stability"].map((phase) =>
        createCareerStep(groups[0], phase),
      ),
    );
  }
  steps.push(createRecommendationStep(state, groups));
  return steps;
}
