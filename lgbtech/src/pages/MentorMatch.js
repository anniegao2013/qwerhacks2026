import React, { useEffect, useState } from "react";

const rainbowGradient =
  "linear-gradient(90deg, #e40303, #ff8c00, #ffed00, #008026, #004dff, #750787)";

const MentorMatch = () => {
  const [mentors, setMentors] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const SHEET_API_URL = "https://api.sheetbest.com/sheets/d44f71d5-6c8c-4c03-aa04-42f263f8f6e0";

  useEffect(() => {
    const fetchMentors = async () => {
      try {
        const res = await fetch(SHEET_API_URL);
        const data = await res.json();
        setMentors(data);
      } catch (err) {
        console.error("Failed to fetch mentors:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMentors();
  }, []);

  const normalizeLink = (link) => {
    if (!link) return "#";
    if (
      link.startsWith("http://") ||
      link.startsWith("https://") ||
      link.startsWith("mailto:")
    )
      return link;
    if (link.includes("@")) return `mailto:${link}`;
    return `https://${link}`;
  };

  const filteredMentors = mentors.filter((m) => {
    const query = search.toLowerCase();
    return (
      (m["Industry"] || "").toLowerCase().includes(query) ||
      (m["Topics / Expertise"] || "").toLowerCase().includes(query)
    );
  });

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "32px 24px",
        background: "#f7f7fb",
      }}
    >
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        {/* Header */}
        <h1 style={{ fontSize: "36px", marginBottom: "8px" }}>
          Queer Mentor Directory
        </h1>
        <div
          style={{
            height: "6px",
            width: "180px",
            background: rainbowGradient,
            borderRadius: "4px",
            marginBottom: "16px",
          }}
        />
        <p style={{ color: "#555", marginBottom: "32px" }}>
          Connect with LGBTQ+ mentors by industry and lived experience.
        </p>

        {/* Search */}
        <input
          type="text"
          placeholder="Search by industry or topic"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: "100%",
            padding: "14px 16px",
            borderRadius: "10px",
            border: "1px solid #ddd",
            fontSize: "16px",
            marginBottom: "32px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
          }}
        />

        {loading && <p>Loading mentors...</p>}

        {!loading && filteredMentors.length === 0 && (
          <p>No mentors match your search.</p>
        )}

        {/* Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "24px",
          }}
        >
          {filteredMentors.map((m, i) => (
            <div
              key={i}
              style={{
                background: "#fff",
                borderRadius: "16px",
                padding: "20px",
                boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-6px)";
                e.currentTarget.style.boxShadow =
                  "0 16px 40px rgba(0,0,0,0.12)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 10px 30px rgba(0,0,0,0.08)";
              }}
            >
              <h2 style={{ marginBottom: "6px" }}>
                {m["Name"] || "Anonymous Mentor"}
              </h2>

              <p style={{ margin: "8px 0", color: "#444" }}>
                <strong>Industry:</strong> {m["Industry"] || "—"}
              </p>

              <p style={{ margin: "8px 0", color: "#444" }}>
                <strong>Topics:</strong> {m["Topics / Expertise"] || "—"}
              </p>

              <a
                href={normalizeLink(m["Contact"])}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-block",
                  marginTop: "16px",
                  padding: "10px 18px",
                  borderRadius: "999px",
                  background: rainbowGradient,
                  color: "#fff",
                  fontWeight: "600",
                  textDecoration: "none",
                  fontSize: "14px",
                }}
              >
                Connect 🌈
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MentorMatch;