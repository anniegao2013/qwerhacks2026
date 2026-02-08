import React, { useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
} from "react-simple-maps";
import { stateSafety } from "../data/stateSafety";

const geoUrl =
  "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

const rainbowGradient =
  "linear-gradient(90deg, #e40303, #ff8c00, #ffed00, #008026, #004dff, #750787)";

const getColor = (level) => {
  switch (level) {
    case "high":
      return "#6fcf97"; // soft green
    case "medium":
      return "#f2c94c"; // soft yellow
    case "low":
      return "#eb5757"; // soft red
    default:
      return "#e0e0e0";
  }
};

const QueerSafetyMap = () => {
  const [selectedState, setSelectedState] = useState(null);

  const stateData = selectedState ? stateSafety[selectedState] : null;

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "32px 24px",
        background: "#f7f7fb",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Header */}
        <h1 style={{ fontSize: "36px", marginBottom: "8px" }}>
          Queer Safety Map — United States
        </h1>
        <div
          style={{
            height: "6px",
            width: "220px",
            background: rainbowGradient,
            borderRadius: "4px",
            marginBottom: "16px",
          }}
        />
        <p style={{ maxWidth: "750px", color: "#555", marginBottom: "32px" }}>
          A high-level overview of LGBTQ+ safety and legal protections by state.
          This information is for educational purposes only and is not legal
          advice.
        </p>

        {/* Map + Info Layout */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr",
            gap: "32px",
            alignItems: "start",
          }}
        >
          {/* MAP */}
          <div
            style={{
              background: "#fff",
              borderRadius: "16px",
              padding: "16px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
            }}
          >
            <ComposableMap projection="geoAlbersUsa" width={980} height={550}>
              <Geographies geography={geoUrl}>
                {({ geographies }) =>
                  geographies.map((geo) => {
                    const stateCode = geo.properties.name.replace(/\s+/g, "");
                    const safety = stateSafety[stateCode];

                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        fill={getColor(safety?.level)}
                        stroke="#ffffff"
                        style={{
                          default: { outline: "none" },
                          hover: {
                            fill: "#90caf9",
                            outline: "none",
                            cursor: "pointer",
                          },
                          pressed: { outline: "none" },
                        }}
                        onClick={() => setSelectedState(stateCode)}
                      />
                    );
                  })
                }
              </Geographies>
            </ComposableMap>
          </div>

          {/* KNOW YOUR RIGHTS */}
          <div
            style={{
              background: "#fff",
              borderRadius: "16px",
              padding: "20px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
              minHeight: "300px",
            }}
          >
            <h2 style={{ marginBottom: "8px" }}>Know Your Rights</h2>
            <div
              style={{
                height: "4px",
                width: "120px",
                background: rainbowGradient,
                borderRadius: "4px",
                marginBottom: "16px",
              }}
            />

            {!selectedState && (
              <p style={{ color: "#666" }}>
                Click on a state to view LGBTQ+ rights and protections.
              </p>
            )}

            {selectedState && !stateData && (
              <p style={{ color: "#666" }}>
                Information for this state is coming soon.
              </p>
            )}

            {stateData && (
              <div>
                <h3 style={{ marginBottom: "8px" }}>{stateData.name}</h3>

                <p style={{ marginBottom: "12px" }}>
                  <strong>Safety Level:</strong>{" "}
                  <span
                    style={{
                      fontWeight: "600",
                      color:
                        stateData.level === "high"
                          ? "#2e7d32"
                          : stateData.level === "medium"
                          ? "#b28704"
                          : "#c62828",
                    }}
                  >
                    {stateData.level.charAt(0).toUpperCase() +
                      stateData.level.slice(1)}
                  </span>
                </p>

                <ul style={{ paddingLeft: "20px", color: "#444" }}>
                  {stateData.rights.map((right, index) => (
                    <li key={index} style={{ marginBottom: "6px" }}>
                      {right}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QueerSafetyMap;