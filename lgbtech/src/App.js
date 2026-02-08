import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

/* ===================== Navbar ===================== */
const Navbar = () => (
  <nav style={styles.nav}>
    <Link style={styles.navLink} to="/">Home</Link>
    <Link style={styles.navLink} to="/scholarships">Scholarships</Link>
    <Link style={styles.navLink} to="/resume-feedback">Resume Feedback</Link>
  </nav>
);

/* ===================== Home ===================== */
const Home = () => {
  const defaultCompanies = [
    {
      name: "Accenture",
      applyLink: "https://www.accenture.com/us-en/careers",
      flagged: false,
    },
    {
      name: "Apple",
      applyLink: "https://www.apple.com/careers/",
      flagged: false,
    },
    {
      name: "Google",
      applyLink: "https://careers.google.com/",
      flagged: false,
    },
    {
      name: "IBM",
      applyLink: "https://www.ibm.com/employment/",
      flagged: false,
    },
  ];

  const [companies, setCompanies] = useState([]);
  const [newName, setNewName] = useState("");
  const [newLink, setNewLink] = useState("");

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

  const addCompany = () => {
    if (!newName.trim() || !newLink.trim()) return;

    if (companies.some(c => c.name.toLowerCase() === newName.toLowerCase())) {
      alert("Company already exists");
      return;
    }

    setCompanies([
      { name: newName.trim(), applyLink: newLink.trim(), flagged: false },
      ...companies,
    ]);

    setNewName("");
    setNewLink("");
  };

  const flagCompany = (index) => {
    const updated = [...companies];
    updated[index].flagged = true;
    const item = updated.splice(index, 1)[0];
    setCompanies([...updated, item]);
  };

  const unflagCompany = (index) => {
    const updated = [...companies];
    updated[index].flagged = false;
    const item = updated.splice(index, 1)[0];
    setCompanies([item, ...updated]);
  };

  return (
    <div style={styles.container}>
      <h1>Company List</h1>

      {/* Add Company Form */}
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

      {/* Company List */}
      <div style={styles.verticalList}>
        {companies.map((company, index) => (
          <div
            key={company.name}
            style={{
              ...styles.card,
              opacity: company.flagged ? 0.5 : 1,
              backgroundColor: company.flagged ? "#f2f2f2" : "#fff",
            }}
          >
            <div style={styles.cardContent}>
              <div>
                <h2>{company.name}</h2>
                <a href={company.applyLink} target="_blank" rel="noreferrer">
                  Apply
                </a>
              </div>

              {company.flagged ? (
                <button
                  style={{ ...styles.button, background: "#4caf50" }}
                  onClick={() => unflagCompany(index)}
                >
                  Unflag
                </button>
              ) : (
                <button
                  style={{ ...styles.button, background: "#ff4d4d" }}
                  onClick={() => flagCompany(index)}
                >
                  Flag as Non-LGBTQ Friendly
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ===================== Pages ===================== */
const Scholarships = () => (
  <div style={styles.container}>
    <h1>Scholarships</h1>
    <p>Scholarship resources coming soon.</p>
  </div>
);

const ResumeFeedback = () => (
  <div style={styles.container}>
    <h1>Resume Feedback</h1>
    <p>Upload your resume for feedback.</p>
  </div>
);

/* ===================== App ===================== */
export default function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/scholarships" element={<Scholarships />} />
        <Route path="/resume-feedback" element={<ResumeFeedback />} />
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
  button: {
    color: "#fff",
    border: "none",
    padding: "8px 12px",
    borderRadius: "6px",
    cursor: "pointer",
  },
};
