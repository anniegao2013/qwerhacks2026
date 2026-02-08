import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import QueerSafetyMap from "./pages/QueerSafetyMap";

/* ===================== Navbar ===================== */
const Navbar = () => (
  <nav style={styles.nav}>
    <Link style={styles.navLink} to="/">Home</Link>
    <Link style={styles.navLink} to="/resume-feedback">Resume Feedback</Link>
    <Link style={styles.navLink} to="/map">Queer Safety Map</Link>
    <Link style={styles.navLink} to="/scholarships">Scholarships</Link>
  </nav>
);

/* ===================== Home ===================== */
const Home = () => {
  const defaultCompanies = [
    { name: "Accenture", applyLink: "https://www.accenture.com/us-en/careers", positive: 0, negative: 0 },
    { name: "Apple", applyLink: "https://www.apple.com/careers/", positive: 0, negative: 0 },
    { name: "Google", applyLink: "https://careers.google.com/", positive: 0, negative: 0 },
    { name: "IBM", applyLink: "https://www.ibm.com/employment/", positive: 0, negative: 0 },
  ];

  const [companies, setCompanies] = useState([]);
  const [newName, setNewName] = useState("");
  const [newLink, setNewLink] = useState("");
  const [search, setSearch] = useState("");

  /* Load from localStorage */
  useEffect(() => {
    const saved = localStorage.getItem("companies");
    setCompanies(saved ? JSON.parse(saved) : defaultCompanies);
  }, []);

  /* Save to localStorage */
  useEffect(() => {
    if (companies.length) {
      localStorage.setItem("companies", JSON.stringify(companies));
    }
  }, [companies]);

  const getPercent = (c) => {
    const total = c.positive + c.negative;
    if (total === 0) return 0;
    return Math.round((c.positive / total) * 100);
  };

  const sortCompanies = (list) =>
    [...list].sort((a, b) => getPercent(b) - getPercent(a));

  const vote = (index, type) => {
    const updated = [...companies];
    updated[index][type] += 1;
    setCompanies(sortCompanies(updated));
  };

  const addCompany = () => {
    if (!newName.trim() || !newLink.trim()) return;

    if (companies.some(c => c.name.toLowerCase() === newName.toLowerCase())) {
      alert("Company already exists");
      return;
    }

    setCompanies(sortCompanies([
      { name: newName.trim(), applyLink: newLink.trim(), positive: 0, negative: 0 },
      ...companies,
    ]));

    setNewName("");
    setNewLink("");
  };

  const filteredCompanies = companies.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={styles.container}>
      <h1>LGBTech</h1>
      <h5>Helping queer young adults find inclusive tech career pathways</h5>

      {/* Add Company */}
      <div style={styles.addForm}>
        <h3>Add a Company</h3>
        <input
          style={styles.input}
          placeholder="Company name"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <input
          style={styles.input}
          placeholder="Apply link"
          value={newLink}
          onChange={(e) => setNewLink(e.target.value)}
        />
        <button style={styles.addButton} onClick={addCompany}>
          Add Company
        </button>
      </div>

      <h2>Companies</h2>

      {/* Search */}
      <input
        style={styles.searchInput}
        placeholder="Search company..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Company List */}
      <div style={styles.verticalList}>
        {filteredCompanies.map((company, index) => {
          const percent = getPercent(company);
          return (
            <div key={company.name} style={styles.card}>
              <div style={styles.cardContent}>
                <div>
                  <h2>{company.name}</h2>
                  <a href={company.applyLink} target="_blank" rel="noreferrer">
                    Apply
                  </a>
                  <p style={styles.percent}>
                    Queer-Friendly: {percent}% ({company.positive + company.negative} votes)
                  </p>
                </div>

                <div style={styles.voteButtons}>
                  <button
                    style={{ ...styles.button, background: "#4caf50" }}
                    onClick={() => vote(companies.indexOf(company), "positive")}
                  >
                    👍 Positive
                  </button>
                  <button
                    style={{ ...styles.button, background: "#f44336" }}
                    onClick={() => vote(companies.indexOf(company), "negative")}
                  >
                    👎 Negative
                  </button>
                </div>
              </div>
            </div>
          );
        })}
        {filteredCompanies.length === 0 && (
          <p>No companies match your search.</p>
        )}
      </div>
    </div>
  );
};

/* ===================== Pages ===================== */
const Scholarships = () => {
  const scholarships = [
    {
      id: "la-lgbt",
      title: "LA LGBT Youth Scholarship Program",
      eligibility:
        "LGBTQ+ students living in LA County pursuing secondary education",
      deadline: "2026-03-27",
      link: "https://lalgbtcenter.org/services/scholarships/",
    },
    {
      id: "out-to-innovate",
      title: "Out to Innovate Scholarship",
      eligibility:
        "LGBTQ+ undergraduates and graduates pursuing STEM degrees",
      deadline: "2026-07-07",
      link: "https://www.outtoinnovate.org/scholarships",
    },
    {
      id: "markowski-leach",
      title: "Markowski-Leach Scholarship",
      eligibility:
        "LGBTQ+ full-time students enrolled at a California university",
      deadline: "2026-03-31",
      link: "https://mlscholarships.org/",
    },
    {
      id: "league-foundation",
      title: "LEAGUE Foundation Scholarship",
      eligibility:
        "Graduating high school seniors who support the LGBTQ+ community",
      deadline: "2026-04-15",
      link: "https://www.leaguefoundation.org/index.php/application",
    },
  ];

  const [goingToApply, setGoingToApply] = React.useState({});

  // Load saved state
  React.useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("scholarshipApps") || "{}");
    setGoingToApply(saved);
  }, []);

  // Save state
  React.useEffect(() => {
    localStorage.setItem("scholarshipApps", JSON.stringify(goingToApply));
  }, [goingToApply]);

  const toggleApply = (id) => {
    setGoingToApply((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Compute next upcoming deadline
  const upcomingDeadlines = scholarships
    .filter((s) => goingToApply[s.id])
    .map((s) => new Date(s.deadline))
    .sort((a, b) => a - b);

  const nextDeadline =
    upcomingDeadlines.length > 0
      ? upcomingDeadlines[0].toLocaleDateString()
      : null;

  return (
    <div style={styles.container}>
      {nextDeadline && (
        <div style={styles.notification}>
          📅 Next scholarship deadline: <strong>{nextDeadline}</strong>
        </div>
      )}

      <h1>Scholarships</h1>

      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {scholarships.map((s) => (
          <div key={s.id} style={styles.card}>
            <div style={styles.cardContent}>
              <div>
                <h2>{s.title}</h2>
                <p>
                  <strong>Eligibility:</strong> {s.eligibility}
                </p>
                <p>
                  <strong>Deadline:</strong>{" "}
                  {new Date(s.deadline).toLocaleDateString()}
                </p>
                <a href={s.link} target="_blank" rel="noreferrer">
                  Apply Here
                </a>
              </div>

              <button
                style={{
                  ...styles.button,
                  background: goingToApply[s.id] ? "#4caf50" : "#333",
                }}
                onClick={() => toggleApply(s.id)}
              >
                {goingToApply[s.id] ? "✓ Added" : "+"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ResumeFeedback = () => (
  <div style={styles.container}>
    <h1>Resume Feedback</h1>
    <p>Upload your resume for feedback.</p>
  </div>
);

const Map = QueerSafetyMap;

/* ===================== App ===================== */
export default function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/scholarships" element={<Scholarships />} />
        <Route path="/resume-feedback" element={<ResumeFeedback />} />
        <Route path="/map" element={<Map />} />
      </Routes>
    </Router>
  );
}

/* ===================== Styles ===================== */
const styles = {
  nav: {
    display: "flex",
    gap: "20px",
    padding: "12px",
    background: "#333",
  },
  navLink: {
    color: "#fff",
    textDecoration: "none",
    fontWeight: "bold",
  },
  container: {
    padding: "20px",
  },
  searchInput: {
    width: "100%",
    maxWidth: "400px",
    padding: "8px",
    marginBottom: "16px",
  },
  addForm: {
    maxWidth: "500px",
    border: "1px solid #ddd",
    borderRadius: "12px",
    padding: "16px",
    marginBottom: "24px",
  },
  input: {
    width: "100%",
    padding: "8px",
    marginBottom: "10px",
  },
  addButton: {
    background: "#333",
    color: "#fff",
    border: "none",
    padding: "8px 14px",
    borderRadius: "6px",
    cursor: "pointer",
  },
  verticalList: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  card: {
    border: "1px solid #ccc",
    borderRadius: "12px",
    padding: "16px",
  },
  cardContent: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  percent: {
    marginTop: "6px",
    fontWeight: "bold",
  },
  voteButtons: {
    display: "flex",
    gap: "10px",
  },
  button: {
    color: "#fff",
    border: "none",
    padding: "8px 12px",
    borderRadius: "6px",
    cursor: "pointer",
  },
  notification: {
  background: "#fff3cd",
  border: "1px solid #ffeeba",
  padding: "12px",
  borderRadius: "8px",
  marginBottom: "16px",
  fontWeight: "bold",
 },
};
