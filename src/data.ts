export type InterviewStage = {
  name: string;
  focus: string;
  duration: string;
  minutes: number;
  followUps: string[];
  rubric: string[];
};

export type Challenge = {
  title: string;
  prompt: string;
  difficulty: string;
  signal: string;
  starter: string;
};

export type Discipline = {
  id: string;
  name: string;
  tag: string;
  summary: string;
  companyFit: string[];
  preparationTracks: string[];
  interviewStages: InterviewStage[];
  challenge: Challenge;
};

export const disciplines: Discipline[] = [
  {
    id: "software",
    name: "Software Engineering",
    tag: "DSA + systems + communication",
    summary:
      "Build fluency across coding rounds, system design, behavioral storytelling, and leadership principles.",
    companyFit: ["Google", "Meta", "Amazon", "Microsoft"],
    preparationTracks: [
      "Data structures sprints",
      "System design whiteboards",
      "Behavioral answer coaching",
    ],
    interviewStages: [
      {
        name: "Coding Screen",
        focus: "Algorithms, edge cases, and implementation clarity",
        duration: "45 min",
        minutes: 45,
        followUps: [
          "How would your approach change if the feed updates continuously while results are being calculated?",
          "Which edge cases would you test before shipping this solution?",
          "What data structure lets you keep the top K efficiently as scores change?",
        ],
        rubric: [
          "Explains a clear algorithm before diving into syntax",
          "Names tradeoffs around time, space, and correctness",
          "Surfaces edge cases and validates assumptions",
        ],
      },
      {
        name: "System Design",
        focus: "Tradeoffs, scale, and communication under pressure",
        duration: "60 min",
        minutes: 60,
        followUps: [
          "Where would you place ranking logic to keep latency low without making the system rigid?",
          "How would you design for graceful degradation if engagement features fail?",
          "What would you cache, and how would you invalidate it safely?",
        ],
        rubric: [
          "Frames the system with users, APIs, storage, and bottlenecks",
          "Chooses sensible tradeoffs instead of hand-waving scale",
          "Communicates sequencing and constraints calmly",
        ],
      },
      {
        name: "Leadership Round",
        focus: "Ownership, conflict, and decision quality",
        duration: "45 min",
        minutes: 45,
        followUps: [
          "Describe a time you had to push back on a strong stakeholder with incomplete data.",
          "How do you recover trust after a rollout goes sideways?",
          "What signals tell you a team is optimizing locally instead of for the product?",
        ],
        rubric: [
          "Uses structured storytelling with context, action, and result",
          "Shows ownership without sounding defensive",
          "Connects the story to team impact and learning",
        ],
      },
    ],
    challenge: {
      title: "Realtime Feed Ranking",
      prompt:
        "Design a function that returns the top K ranked posts while balancing recency, engagement, and author diversity.",
      difficulty: "Advanced",
      signal: "Tests priority queues, custom scoring, and explanation quality.",
      starter:
        "Start by naming the inputs, defining the ranking signal, and deciding what you need to optimize first: correctness, speed, or explainability.",
    },
  },
  {
    id: "data",
    name: "Data Science",
    tag: "analytics + experimentation + modeling",
    summary:
      "Practice case framing, metrics design, SQL problem solving, machine learning tradeoffs, and executive communication.",
    companyFit: ["Airbnb", "Netflix", "Uber", "LinkedIn"],
    preparationTracks: [
      "SQL and product analytics drills",
      "Experiment interpretation labs",
      "Model selection frameworks",
    ],
    interviewStages: [
      {
        name: "Analytics Case",
        focus: "Metrics, hypotheses, and business framing",
        duration: "40 min",
        minutes: 40,
        followUps: [
          "What leading and lagging metrics would you pair here?",
          "How would you separate correlation from an actual churn driver?",
          "What user segments deserve their own analysis path?",
        ],
        rubric: [
          "Frames the business problem before jumping into analysis",
          "Chooses metrics that connect behavior to outcomes",
          "Builds a sequence of hypotheses and tests",
        ],
      },
      {
        name: "Technical Modeling",
        focus: "Feature choices, validation, and model risk",
        duration: "50 min",
        minutes: 50,
        followUps: [
          "Which features risk leakage, and how would you audit for it?",
          "How would you choose between interpretability and raw lift?",
          "What does success look like after deployment, not just offline validation?",
        ],
        rubric: [
          "Connects modeling choices to the business decision",
          "Shows awareness of bias, leakage, and monitoring",
          "Uses evaluation methods that fit the problem shape",
        ],
      },
      {
        name: "Executive Readout",
        focus: "Translating data into decisions",
        duration: "30 min",
        minutes: 30,
        followUps: [
          "If leadership only funds one intervention, which would you recommend first?",
          "How would you explain uncertainty without sounding unprepared?",
          "What action would you stop the team from taking based on the data?",
        ],
        rubric: [
          "Communicates recommendations with clarity and restraint",
          "Explains confidence and uncertainty cleanly",
          "Moves from analysis to action",
        ],
      },
    ],
    challenge: {
      title: "Subscription Churn Rescue",
      prompt:
        "Propose an analysis plan to detect churn drivers, prioritize interventions, and measure long-term improvement.",
      difficulty: "Strategic",
      signal: "Tests experiment design, causal thinking, and business judgment.",
      starter:
        "Start by defining churn precisely, then map the funnel moments where user behavior begins to diverge.",
    },
  },
  {
    id: "product",
    name: "Product Management",
    tag: "strategy + execution + influence",
    summary:
      "Train on product sense, analytical reasoning, roadmap tradeoffs, and stakeholder management for high-bar PM loops.",
    companyFit: ["Stripe", "Notion", "OpenAI", "Figma"],
    preparationTracks: [
      "Product sense prompts",
      "Execution and prioritization games",
      "Stakeholder scenario rehearsals",
    ],
    interviewStages: [
      {
        name: "Product Sense",
        focus: "User empathy, problem framing, and product taste",
        duration: "45 min",
        minutes: 45,
        followUps: [
          "Who is the first user you would design this for, and who are you explicitly not serving yet?",
          "What job is this product replacing today?",
          "How would you know if the first release created new user behavior instead of shallow curiosity?",
        ],
        rubric: [
          "Starts with users and sharp problem framing",
          "Balances ambition with a credible first release",
          "Defines success with behavior-based metrics",
        ],
      },
      {
        name: "Execution",
        focus: "Goals, metrics, and tradeoff management",
        duration: "45 min",
        minutes: 45,
        followUps: [
          "Which dependency is most likely to slow this down, and how would you de-risk it?",
          "What would you cut if the team lost 30 percent of its bandwidth?",
          "How do you handle disagreement between design polish and launch speed?",
        ],
        rubric: [
          "Breaks goals into measurable decisions and milestones",
          "Shows principled prioritization under constraint",
          "Handles tradeoffs without losing the product thesis",
        ],
      },
      {
        name: "Cross-Functional Round",
        focus: "Influence without authority",
        duration: "40 min",
        minutes: 40,
        followUps: [
          "How would you align engineering and GTM if they define success differently?",
          "Tell me about a time you changed a stakeholder's mind without escalating.",
          "Where do you insist on clarity before the team starts building?",
        ],
        rubric: [
          "Demonstrates influence through alignment, not force",
          "Uses communication to unblock ambiguity",
          "Keeps the team centered on user value",
        ],
      },
    ],
    challenge: {
      title: "Launch a Creator Workspace",
      prompt:
        "Define the north-star metric, first-release scope, and launch risks for a collaborative creator planning tool.",
      difficulty: "High leverage",
      signal: "Tests prioritization, strategy, and articulation.",
      starter:
        "Start with who the creator is, what painful workflow you are replacing, and why they should care now.",
    },
  },
  {
    id: "design",
    name: "Product Design",
    tag: "craft + systems + storytelling",
    summary:
      "Prepare for portfolio presentations, whiteboard challenges, critique sessions, and collaboration-heavy interviews.",
    companyFit: ["Apple", "Figma", "Dropbox", "Shopify"],
    preparationTracks: [
      "Portfolio story shaping",
      "Whiteboard challenge walkthroughs",
      "Critique and collaboration drills",
    ],
    interviewStages: [
      {
        name: "Portfolio Review",
        focus: "Narrative, craft, and outcome clarity",
        duration: "45 min",
        minutes: 45,
        followUps: [
          "Which decision in this project best shows your taste under constraint?",
          "What changed because of your work, not just because the project shipped?",
          "How do you explain a messy process without losing the story?",
        ],
        rubric: [
          "Tells a cohesive story from problem to outcome",
          "Explains design choices and iteration rationale",
          "Connects craft to measurable impact",
        ],
      },
      {
        name: "Design Exercise",
        focus: "Interaction design and iteration speed",
        duration: "60 min",
        minutes: 60,
        followUps: [
          "What assumption would you validate first before polishing the UI?",
          "How would this experience adapt for returning users?",
          "What constraints would force a different design system choice?",
        ],
        rubric: [
          "Starts with the user journey before the interface",
          "Balances speed, clarity, and extensibility",
          "Talks through iteration rather than presenting a frozen answer",
        ],
      },
      {
        name: "Collaboration Panel",
        focus: "Feedback handling and cross-functional partnership",
        duration: "45 min",
        minutes: 45,
        followUps: [
          "Describe a time engineering feedback changed your design in a good way.",
          "How do you handle critique that conflicts with your own judgment?",
          "What makes a handoff trustworthy to the rest of the team?",
        ],
        rubric: [
          "Shows maturity in critique and collaboration",
          "Demonstrates systems thinking, not just screens",
          "Communicates clearly with non-design partners",
        ],
      },
    ],
    challenge: {
      title: "Redesign Onboarding Drop-Off",
      prompt:
        "Create a response plan for a mobile onboarding flow with high abandonment after account creation.",
      difficulty: "Portfolio-ready",
      signal: "Tests framing, systems thinking, and communication.",
      starter:
        "Start by identifying where user intent collapses, what evidence you need, and which design moves are reversible.",
    },
  },
];
