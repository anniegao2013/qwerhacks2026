import React, { useEffect, useState } from "react";

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

  // Normalize contact links so they always open correctly
  const normalizeLink = (link) => {
    if (!link) return "#";

    if (
      link.startsWith("http://") ||
      link.startsWith("https://") ||
      link.startsWith("mailto:")
    ) {
      return link;
    }

    if (link.includes("@")) {
      return `mailto:${link}`;
    }

    return `https://${link}`;
  };

  // Filter mentors by industry OR topics
  const filteredMentors = mentors.filter((m) => {
    const query = search.toLowerCase();
    const industry = (m["Industry"] || "").toLowerCase();
    const topics = (m["Topics / Expertise"] || "").toLowerCase();

    return industry.includes(query) || topics.includes(query);
  });

  return (
    <div style={{ padding: "24px", maxWidth: "1000px", margin: "0 auto" }}>
      <h1>Queer Mentor Directory</h1>
      <p>
        Browse and connect with LGBTQ+ mentors by industry or areas of expertise.
      </p>

      <input
        type="text"
        placeholder="Search by industry or topic (e.g. tech, interviews, healthcare)"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          width: "100%",
          padding: "12px",
          marginBottom: "24px",
          borderRadius: "6px",
          border: "1px solid #ccc",
          fontSize: "16px",
        }}
      />

      {loading && <p>Loading mentors...</p>}

      {!loading && filteredMentors.length === 0 && (
        <p>No mentors match your search. Try a different keyword.</p>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "16px",
        }}
      >
        {filteredMentors.map((m, i) => (
          <div
            key={i}
            style={{
              border: "1px solid #ddd",
              borderRadius: "10px",
              padding: "16px",
              background: "#fafafa",
            }}
          >
            <h2>{m["Name"]}</h2>

            <p>
              <strong>Industry:</strong> {m["Industry"] || "—"}
            </p>

            <p>
              <strong>Topics:</strong> {m["Topics / Expertise"] || "—"}
            </p>

            <a
              href={normalizeLink(m["Contact"])}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-block",
                marginTop: "12px",
                color: "#0066cc",
                textDecoration: "none",
                fontWeight: "bold",
              }}
            >
              Connect →
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MentorMatch;
