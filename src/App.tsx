import { useEffect, useState } from "react";
import { disciplines } from "./data";

const companies = [
  "Google",
  "Meta",
  "Amazon",
  "OpenAI",
  "Netflix",
  "Stripe",
  "Airbnb",
  "Figma",
];

type SessionFeedback = {
  overallScore: number;
  readiness: string;
  strengths: string[];
  misses: string[];
  nextStep: string;
};

const readinessBands = [
  { threshold: 85, label: "Final-round ready" },
  { threshold: 70, label: "Strong with a few weak spots" },
  { threshold: 55, label: "Promising, but needs more structure" },
  { threshold: 0, label: "Early draft - keep iterating" },
];

function formatTimer(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function scoreAnswer(answer: string, rubric: string[], focus: string): SessionFeedback {
  const normalized = answer.trim().toLowerCase();
  const wordCount = normalized.split(/\s+/).filter(Boolean).length;
  const signals = new Set(
    normalized.match(/[a-z]+/g)?.filter((word) => word.length > 3) ?? [],
  );
  const structureWords = ["first", "then", "because", "tradeoff", "risk", "metric", "user"];
  const structureScore = structureWords.reduce(
    (count, word) => count + (signals.has(word) ? 1 : 0),
    0,
  );
  const focusWords =
    focus
      .toLowerCase()
      .match(/[a-z]+/g)
      ?.filter((word) => word.length > 4)
      .slice(0, 3) ?? [];
  const focusScore = focusWords.reduce(
    (count, word) => count + (signals.has(word) ? 1 : 0),
    0,
  );

  let overallScore = 34;
  overallScore += Math.min(wordCount, 220) * 0.14;
  overallScore += structureScore * 6;
  overallScore += focusScore * 8;
  overallScore = Math.max(28, Math.min(96, Math.round(overallScore)));

  const readiness =
    readinessBands.find((band) => overallScore >= band.threshold)?.label ??
    readinessBands[readinessBands.length - 1].label;

  const strengths: string[] = [];
  const misses: string[] = [];

  if (wordCount >= 110) {
    strengths.push("Your answer had enough detail to feel interview-ready instead of rushed.");
  } else {
    misses.push("Add more depth so the interviewer can see your reasoning, not just your conclusion.");
  }

  if (structureScore >= 3) {
    strengths.push("You used structured language that makes it easier to follow your thinking.");
  } else {
    misses.push("Use signposts like first, then, risk, and tradeoff to make the answer easier to track.");
  }

  if (focusScore >= 1) {
    strengths.push(`You touched the round's focus area around ${focusWords.join(", ")}.`);
  } else {
    misses.push(`Anchor the answer more directly to this round's focus: ${focus}.`);
  }

  const uncoveredRubric = rubric.find((item) => {
    const keywords =
      item
        .toLowerCase()
        .match(/[a-z]+/g)
        ?.filter((word) => word.length > 4) ?? [];

    return !keywords.some((word) => signals.has(word));
  });

  if (uncoveredRubric) {
    misses.push(`You can improve against this rubric item: ${uncoveredRubric}.`);
  } else {
    strengths.push("You touched all of the visible rubric themes at least once.");
  }

  return {
    overallScore,
    readiness,
    strengths: strengths.slice(0, 3),
    misses: misses.slice(0, 3),
    nextStep:
      wordCount >= 110
        ? "Run the round again and tighten the opening 30 seconds so the structure lands even faster."
        : "Try a second draft with a crisp opening, two tradeoffs, and a concrete closing recommendation.",
  };
}

function App() {
  const [selectedId, setSelectedId] = useState(disciplines[0].id);
  const [activeStage, setActiveStage] = useState(0);
  const [answer, setAnswer] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(disciplines[0].interviewStages[0].minutes * 60);
  const [feedback, setFeedback] = useState<SessionFeedback | null>(null);

  const selectedDiscipline =
    disciplines.find((discipline) => discipline.id === selectedId) ?? disciplines[0];
  const stage = selectedDiscipline.interviewStages[activeStage] ?? selectedDiscipline.interviewStages[0];
  const totalSeconds = stage.minutes * 60;
  const wordCount = answer.trim().split(/\s+/).filter(Boolean).length;
  const stageProgress = Math.min(100, Math.max(0, ((totalSeconds - timeLeft) / totalSeconds) * 100));
  const strongestSignal = feedback?.strengths[0] ?? selectedDiscipline.challenge.signal;

  useEffect(() => {
    setAnswer("");
    setFeedback(null);
    setIsRunning(false);
    setTimeLeft(stage.minutes * 60);
  }, [selectedId, activeStage, stage.minutes]);

  useEffect(() => {
    if (!isRunning) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setTimeLeft((current) => {
        if (current <= 1) {
          window.clearInterval(timer);
          setIsRunning(false);
          return 0;
        }

        return current - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [isRunning]);

  return (
    <div className="page-shell">
      <header className="topbar">
        <div className="brand-lockup">
          <span className="brand-mark" aria-hidden="true">
            S
          </span>
          <div>
            <p className="eyebrow">Signal Interview Lab</p>
            <p className="microcopy">Prep like the final loop already matters.</p>
          </div>
        </div>
        <nav className="topnav" aria-label="Primary">
          <a href="#pathways">Pathways</a>
          <a href="#simulator">Simulator</a>
          <a href="#blueprint">Blueprint</a>
        </nav>
      </header>

      <main>
        <section className="hero-section">
          <div className="hero-copy">
            <p className="eyebrow">Interactive prep for top-tier interview loops</p>
            <h1>
              Pick a discipline, follow a pathway, and train for interviews that feel
              real.
            </h1>
            <p className="hero-text">
              A guided prep environment for coding challenges, product cases, design
              exercises, and high-signal mock interviews tailored to the roles top
              companies actually hire for.
            </p>
            <div className="hero-actions">
              <a href="#pathways" className="primary-link">
                Explore pathways
              </a>
              <a href="#simulator" className="secondary-link">
                Open the simulator
              </a>
            </div>
          </div>

          <div className="hero-panel">
            <div className="signal-card">
              <p className="panel-label">Target companies</p>
              <div className="company-grid">
                {companies.map((company) => (
                  <span key={company}>{company}</span>
                ))}
              </div>
            </div>
            <div className="signal-card challenge-preview">
              <p className="panel-label">Live challenge preview</p>
              <h2>{selectedDiscipline.challenge.title}</h2>
              <p>{selectedDiscipline.challenge.prompt}</p>
              <div className="challenge-meta">
                <span>{selectedDiscipline.challenge.difficulty}</span>
                <span>{selectedDiscipline.challenge.signal}</span>
              </div>
            </div>
          </div>
        </section>

        <section className="pathway-section" id="pathways">
          <div className="section-heading">
            <p className="eyebrow">Major disciplines</p>
            <h2>Choose the interview path that matches how you want to get hired.</h2>
          </div>

          <div className="discipline-tabs" role="tablist" aria-label="Interview disciplines">
            {disciplines.map((discipline) => {
              const selected = discipline.id === selectedDiscipline.id;

              return (
                <button
                  key={discipline.id}
                  type="button"
                  className={`discipline-tab ${selected ? "selected" : ""}`}
                  onClick={() => {
                    setSelectedId(discipline.id);
                    setActiveStage(0);
                  }}
                  aria-pressed={selected}
                >
                  <span className="tab-name">{discipline.name}</span>
                  <span className="tab-tag">{discipline.tag}</span>
                </button>
              );
            })}
          </div>

          <div className="pathway-layout">
            <article className="pathway-story">
              <p className="pathway-kicker">{selectedDiscipline.name}</p>
              <h3>{selectedDiscipline.summary}</h3>
              <div className="inline-list">
                {selectedDiscipline.companyFit.map((company) => (
                  <span key={company}>{company}</span>
                ))}
              </div>
            </article>

            <div className="pathway-columns">
              <div>
                <p className="panel-label">Preparation tracks</p>
                <ul className="detail-list">
                  {selectedDiscipline.preparationTracks.map((track) => (
                    <li key={track}>{track}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="panel-label">Interview sequence</p>
                <ul className="detail-list">
                  {selectedDiscipline.interviewStages.map((item) => (
                    <li key={item.name}>
                      <strong>{item.name}</strong> · {item.duration}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="simulator-section" id="simulator">
          <div className="section-heading">
            <p className="eyebrow">Interview simulator</p>
            <h2>Step through the loop and run a real mock interview round.</h2>
          </div>

          <div className="simulator-layout">
            <aside className="stage-rail" aria-label="Interview stages">
              {selectedDiscipline.interviewStages.map((item, index) => {
                const selected = index === activeStage;

                return (
                  <button
                    key={item.name}
                    type="button"
                    className={`stage-button ${selected ? "selected" : ""}`}
                    onClick={() => setActiveStage(index)}
                  >
                    <span>{item.name}</span>
                    <small>{item.duration}</small>
                  </button>
                );
              })}
            </aside>

            <div className="simulator-panel">
              <p className="panel-label">Current round</p>
              <h3>{stage.name}</h3>
              <p className="simulator-focus">{stage.focus}</p>

              <div className="session-toolbar">
                <div>
                  <p className="panel-label">Timer</p>
                  <p className="timer-readout">{formatTimer(timeLeft)}</p>
                </div>
                <div>
                  <p className="panel-label">Draft length</p>
                  <p className="metric-readout">{wordCount} words</p>
                </div>
                <div>
                  <p className="panel-label">Strongest signal</p>
                  <p className="metric-readout">{strongestSignal}</p>
                </div>
              </div>
              <div className="progress-shell" aria-hidden="true">
                <span style={{ width: `${stageProgress}%` }} />
              </div>

              <div className="prompt-block">
                <p className="panel-label">Practice prompt</p>
                <p>{selectedDiscipline.challenge.prompt}</p>
                <p className="starter-note">{selectedDiscipline.challenge.starter}</p>
              </div>

              <div className="response-grid">
                <div>
                  <p className="panel-label">What great candidates show</p>
                  <ul className="detail-list compact">
                    <li>Structured thinking before they jump into the answer</li>
                    <li>Clear tradeoff language when constraints conflict</li>
                    <li>A calm explanation that makes the interviewer trust them</li>
                  </ul>
                </div>
                <div>
                  <p className="panel-label">Follow-up pressure test</p>
                  <ul className="detail-list compact">
                    {stage.followUps.map((followUp) => (
                      <li key={followUp}>{followUp}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="workspace-grid">
                <div className="workspace-card">
                  <div className="workspace-heading">
                    <div>
                      <p className="panel-label">Your answer</p>
                      <h4>Mock interview workspace</h4>
                    </div>
                    <div className="workspace-actions">
                      <button
                        type="button"
                        className="secondary-button"
                        onClick={() => setIsRunning((current) => !current)}
                      >
                        {isRunning ? "Pause timer" : "Start timer"}
                      </button>
                      <button
                        type="button"
                        className="secondary-button"
                        onClick={() => {
                          setIsRunning(false);
                          setTimeLeft(totalSeconds);
                        }}
                      >
                        Reset round
                      </button>
                    </div>
                  </div>
                  <textarea
                    className="answer-box"
                    value={answer}
                    onChange={(event) => setAnswer(event.target.value)}
                    placeholder="Write your answer as if the interviewer is listening. Structure it, state assumptions, and explain the tradeoffs you choose."
                  />
                  <div className="workspace-footer">
                    <p className="helper-copy">
                      Treat this like a live round: answer aloud, then refine what you
                      wrote until it feels concise and confident.
                    </p>
                    <button
                      type="button"
                      className="primary-button"
                      onClick={() => setFeedback(scoreAnswer(answer, stage.rubric, stage.focus))}
                    >
                      Score my answer
                    </button>
                  </div>
                </div>

                <div className="workspace-card rubric-card">
                  <p className="panel-label">Round rubric</p>
                  <h4>The interviewer is listening for these signals</h4>
                  <ul className="detail-list compact">
                    {stage.rubric.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {feedback ? (
                <div className="feedback-panel">
                  <div className="score-badge">
                    <span>{feedback.overallScore}</span>
                    <small>/ 100</small>
                  </div>
                  <div className="feedback-copy">
                    <p className="panel-label">Session feedback</p>
                    <h4>{feedback.readiness}</h4>
                    <p className="starter-note">{feedback.nextStep}</p>
                  </div>
                  <div className="feedback-columns">
                    <div>
                      <p className="panel-label">Strengths</p>
                      <ul className="detail-list compact">
                        {feedback.strengths.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="panel-label">Improve next</p>
                      <ul className="detail-list compact">
                        {feedback.misses.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </section>

        <section className="blueprint-section" id="blueprint">
          <div className="section-heading">
            <p className="eyebrow">Product blueprint</p>
            <h2>Built to grow from a polished concept into a full interview platform.</h2>
          </div>

          <div className="blueprint-grid">
            <div>
              <p className="panel-label">Phase 1</p>
              <h3>Interactive discipline selection</h3>
              <p>
                Users choose a target role and immediately see the prep tracks,
                companies, and interview stages that fit.
              </p>
            </div>
            <div>
              <p className="panel-label">Phase 2</p>
              <h3>Challenge and feedback engine</h3>
              <p>
                Timed rounds, structured answer capture, live rubrics, and
                scorecards turn practice into something users can repeat and improve.
              </p>
            </div>
            <div>
              <p className="panel-label">Phase 3</p>
              <h3>Personalized company tracks</h3>
              <p>
                Layer in company-specific loops, question banks, and progress maps
                for users targeting a shortlist of dream roles.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
