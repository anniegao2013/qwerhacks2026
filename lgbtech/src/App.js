import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import QueerSafetyMap from "./pages/QueerSafetyMap";
import MentorMatch from "./pages/MentorMatch";

/* ===================== Theme ===================== */
const rainbowGradient =
  "linear-gradient(90deg, #e40303, #ff8c00, #ffed00, #008026, #004dff, #750787)";

/* ===================== Navbar ===================== */
const Navbar = () => (
  <nav style={styles.nav}>
    <div style={styles.navBrand}>LGBTech</div>
    <div style={styles.navLinks}>
      <Link style={styles.navLink} to="/">Home</Link>
      <Link style={styles.navLink} to="/map">Safety Map</Link>
      <Link style={styles.navLink} to="/mentors">Mentor Match</Link>
      <Link style={styles.navLink} to="/scholarships">Scholarships</Link>
    </div>
  </nav>
);

/* ===================== Home ===================== */

const defaultCompanies = [
    { name: "Accenture", applyLink: "https://www.accenture.com/us-en/careers", positive: 0, negative: 0 },
    { name: "Apple", applyLink: "https://www.apple.com/careers/", positive: 0, negative: 0 },
    { name: "Google", applyLink: "https://careers.google.com/", positive: 0, negative: 0 },
    { name: "IBM", applyLink: "https://www.ibm.com/employment/", positive: 0, negative: 0 },
  ];
const Home = () => {
//   const defaultCompanies = [
//     { name: "Accenture", applyLink: "https://www.accenture.com/us-en/careers", positive: 0, negative: 0 },
//     { name: "Apple", applyLink: "https://www.apple.com/careers/", positive: 0, negative: 0 },
//     { name: "Google", applyLink: "https://careers.google.com/", positive: 0, negative: 0 },
//     { name: "IBM", applyLink: "https://www.ibm.com/employment/", positive: 0, negative: 0 },
//   ];

  const [companies, setCompanies] = useState([]);
  const [newName, setNewName] = useState("");
  const [newLink, setNewLink] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("companies");
    setCompanies(saved ? JSON.parse(saved) : defaultCompanies);
  }, []);

  useEffect(() => {
    if (companies.length) {
      localStorage.setItem("companies", JSON.stringify(companies));
    }
  }, [companies]);

  const getPercent = (c) => {
    const total = c.positive + c.negative;
    return total === 0 ? 0 : Math.round((c.positive / total) * 100);
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
    <div style={styles.page}>
      <div style={styles.header}>
        <h1>LGBTech</h1>
        <div style={styles.gradientBar} />
        <p>Helping queer young adults find inclusive tech career pathways</p>
      </div>

      {/* Add Company */}
      <div style={styles.card}>
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
        <button style={styles.primaryButton} onClick={addCompany}>
          Add Company
        </button>
      </div>

      {/* Search */}
      <input
        style={styles.searchInput}
        placeholder="Search companies..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Companies */}
      <div style={styles.list}>
        {filteredCompanies.map((company, index) => (
          <div key={company.name} style={styles.card}>
            <div style={styles.row}>
              <div>
                <h2>{company.name}</h2>
                <a href={company.applyLink} target="_blank" rel="noreferrer">
                  Apply →
                </a>
                <p style={styles.percent}>
                  Queer-Friendly: {getPercent(company)}%
                </p>
              </div>

              <div style={styles.voteButtons}>
                <button
                  style={{ ...styles.button, background: "#4caf50" }}
                  onClick={() => vote(index, "positive")}
                >
                  👍
                </button>
                <button
                  style={{ ...styles.button, background: "#f44336" }}
                  onClick={() => vote(index, "negative")}
                >
                  👎
                </button>
              </div>
            </div>
          </div>
        ))}
        {filteredCompanies.length === 0 && <p>No results found.</p>}
      </div>
    </div>
  );
};

/* ===================== Scholarships ===================== */
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

  const [goingToApply, setGoingToApply] = useState({});

  useEffect(() => {
    setGoingToApply(JSON.parse(localStorage.getItem("scholarshipApps") || "{}"));
  }, []);

  useEffect(() => {
    localStorage.setItem("scholarshipApps", JSON.stringify(goingToApply));
  }, [goingToApply]);

  return (
    <div style={styles.page}>
      <h1>Scholarships</h1>
      <div style={styles.gradientBar} />

      <div style={styles.list}>
        {scholarships.map((s) => (
          <div key={s.id} style={styles.card}>
            <h2>{s.title}</h2>
            <p><strong>Eligibility:</strong> {s.eligibility}</p>
            <p><strong>Deadline:</strong> {new Date(s.deadline).toLocaleDateString()}</p>
            <a href={s.link} target="_blank" rel="noreferrer">Apply</a>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ===================== App ===================== */
export default function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/map" element={<QueerSafetyMap />} />
        <Route path="/mentors" element={<MentorMatch />} />
        <Route path="/scholarships" element={<Scholarships />} />
      </Routes>
    </Router>
  );
}

/* ===================== Styles ===================== */
const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    padding: "14px 24px",
    background: "#111",
    color: "#fff",
    alignItems: "center",
  },
  navBrand: {
    fontWeight: "800",
    fontSize: "20px",
  },
  navLinks: {
    display: "flex",
    gap: "20px",
  },
  navLink: {
    color: "#fff",
    textDecoration: "none",
    fontWeight: "600",
  },
  page: {
    padding: "32px 24px",
    background: "#f7f7fb",
    minHeight: "100vh",
  },
  header: {
    marginBottom: "32px",
  },
  gradientBar: {
    height: "6px",
    width: "220px",
    background: rainbowGradient,
    borderRadius: "6px",
    margin: "8px 0 16px",
  },
  card: {
    background: "#fff",
    borderRadius: "16px",
    padding: "20px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
  },
  list: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "10px",
  },
  searchInput: {
    maxWidth: "400px",
    padding: "10px",
    margin: "24px 0",
  },
  primaryButton: {
    background: "#111",
    color: "#fff",
    padding: "10px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
  button: {
    color: "#fff",
    border: "none",
    padding: "10px",
    borderRadius: "8px",
    cursor: "pointer",
  },
  voteButtons: {
    display: "flex",
    gap: "10px",
  },
  percent: {
    marginTop: "8px",
    fontWeight: "600",
  },
};
