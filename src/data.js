/* Reference data and content. New occupations remain selectable without invented charts. */
export const OCCUPATIONS = [
  { id: "nurse", label: "Nursing", supported: true },
  { id: "ict", label: "ICT", supported: true },
  { id: "teacher", label: "Teacher", supported: false },
  { id: "accountant", label: "Accountant", supported: false },
  { id: "engineer", label: "Engineer", supported: false },
  { id: "doctor", label: "Doctor", supported: false },
  { id: "pharmacist", label: "Pharmacist", supported: false },
  { id: "social-worker", label: "Social Worker", supported: false },
  { id: "architect", label: "Architect", supported: false },
  { id: "marketing", label: "Marketing Specialist", supported: false },
];

export const CITY_DATA = [
  {
    name: "Brisbane",
    ict: [39.3, 41.5, 82.8],
    nurse: [51.5, 28.7, 100],
    household: 54.5,
  },
  {
    name: "Sydney",
    ict: [100, 0.6, 59.7],
    nurse: [82.7, 0, 89.8],
    household: 53.4,
  },
  {
    name: "Melbourne",
    ict: [69.9, 0, 65.3],
    nurse: [100, 10.1, 75.2],
    household: 45.1,
  },
  {
    name: "Perth",
    ict: [17.3, 41.7, 75.3],
    nurse: [30.5, 75.7, 61],
    household: 44.8,
  },
  {
    name: "Adelaide",
    ict: [12, 100, 30.1],
    nurse: [36.4, 100, 36.1],
    household: 47.4,
  },
  {
    name: "Gold Coast",
    ict: [0.4, 84.4, 58.1],
    nurse: [2.9, 42.2, 51.6],
    household: 32.3,
  },
  {
    name: "Canberra & ACT",
    ict: [23.2, 27, 100],
    nurse: [0, 62.1, 0],
    household: 20.7,
  },
  {
    name: "Newcastle & Hunter",
    ict: [0, 31.9, 0],
    nurse: [5.6, 73.3, 47.5],
    household: 10.6,
  },
];

export const CAREER_INSIGHTS = {
  nurse: {
    market: {
      title: "Your nursing opportunities are more widely spread.",
      heading: "More freedom to move",
      what: "Melbourne has 26.02% of nursing demand, Sydney 22.20% and Brisbane 15.32%. Sydney and Melbourne together account for 48.22%.",
      meaning:
        "Nursing is less concentrated in the largest cities than ICT. You can consider a wider range of places without relying on one dominant market.",
      next: "Market size shows today’s opportunities. Now look at how demand has changed.",
    },
    trend: {
      title: "Look beyond the number of jobs today.",
      heading: "Size can hide the direction",
      what: "Nursing demand increased across several candidate cities from 2015 to 2025. Large markets dominate this shared-scale trend chart.",
      meaning:
        "A smaller city may be growing strongly even if its line looks modest beside Sydney or Melbourne.",
      next: "Compare each city with its own 2019 baseline to make that change clearer.",
    },
    history: {
      title: "Compare each city against its own starting point.",
      heading: "A fairer view of change",
      what: "With 2019 = 100, the 2025 nursing index is 127.1 in Sydney, 154.6 in Brisbane, 199.9 in Perth and 223.3 in Adelaide.",
      meaning:
        "All four are above their own 2019 nursing-demand levels. Brisbane’s demand is 54.6% higher than its baseline.",
      next: "Growth is encouraging. Check how consistent that demand has been.",
    },
    stability: {
      title: "Growth is only part of your career security.",
      heading: "Growth and stability differ",
      what: "Brisbane combines 54.6% nursing growth with a relative stability score of 100. Adelaide grows faster, at 123.3%, but scores 36.1 for stability.",
      meaning:
        "The fastest-growing market is not always the steadiest. Brisbane offers a useful balance for a move that values security.",
      next: "Use this balance to shape your next step.",
    },
  },
  ict: {
    market: {
      title: "ICT opportunities concentrate in a few big cities.",
      heading: "A narrower set of large markets",
      what: "Sydney has 36.37% of ICT demand, Melbourne 25.69% and Brisbane 14.80%. Sydney and Melbourne together account for 62.06%.",
      meaning:
        "The larger markets offer much more current hiring demand. Moving away from them means weighing a smaller market against other strengths.",
      next: "Are the biggest markets also the strongest over time?",
    },
    trend: {
      title: "The biggest market can still be losing momentum.",
      heading: "Demand has changed",
      what: "ICT demand rose into 2021–2022 and then fell toward 2025. Sydney and Melbourne remain the largest markets in absolute terms.",
      meaning:
        "The number of available roles and the direction of demand are different questions. Look beyond the size of the lines.",
      next: "Use each city’s own 2019 level as a common baseline.",
    },
    history: {
      title: "The baseline makes the ICT contraction visible.",
      heading: "Size is not the same as resilience",
      what: "With 2019 = 100, the 2025 ICT index is 54.5 in Sydney, 54.3 in Melbourne and 67.4 in both Brisbane and Perth.",
      meaning:
        "All four remain below their 2019 demand. Brisbane’s decline is smaller than Sydney’s, despite having a smaller current market.",
      next: "Check which contracting markets have been more consistent.",
    },
    stability: {
      title: "A contracting market can still be steadier.",
      heading: "Consider the trade-off",
      what: "Brisbane’s ICT demand declines 32.6% from 2019, with a stability score of 82.8. Sydney declines 45.5%, with a stability score of 59.7.",
      meaning:
        "Brisbane offers greater historical consistency. Sydney offers a much larger current market. The choice depends on the trade-off you can accept.",
      next: "Bring this evidence into your final decision.",
    },
  },
};

export const CHARTS_BY_OCCUPATION = {
  nurse: {
    market: "fig7",
    trend: "fig8nurse",
    history: "fig10",
    stability: "fig12",
  },
  ict: {
    market: "fig6",
    trend: "fig8ict",
    history: "fig9",
    stability: "fig11",
  },
};

export const ICON_PATHS = {
  spark:
    '<path d="m10 2 2.2 5.8L18 10l-5.8 2.2L10 18l-2.2-5.8L2 10l5.8-2.2Z"/>',
  arrow: '<path d="M4 10h12m-5-5 5 5-5 5"/>',
  back: '<path d="M16 10H4m5-5-5 5 5 5"/>',
  plus: '<path d="M10 4v12M4 10h12"/>',
  close: '<path d="m5 5 10 10M5 15 15 5"/>',
  download: '<path d="M10 2v11m-4-4 4 4 4-4M3 13v4h14v-4"/>',
  check: '<path d="m4 10 4 4 8-8"/>',
  edit: '<path d="m12 3 5 5M3 17l4-1L18 5l-3-3L4 13Z"/>',
  chevron: '<path d="m5 7 5 5 5-5"/>',
};
