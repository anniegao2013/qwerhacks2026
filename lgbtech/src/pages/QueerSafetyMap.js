import React, { useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
} from "react-simple-maps";
import { stateSafety } from "../data/stateSafety";

const geoUrl =
  "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

const getColor = (level) => {
  switch (level) {
    case "high":
      return "#4caf50"; // green
    case "medium":
      return "#ffeb3b"; // yellow
    case "low":
      return "#f44336"; // red
    default:
      return "#e0e0e0"; // gray (no data)
  }
};

const QueerSafetyMap = () => {
  const [selectedState, setSelectedState] = useState(null);

  const stateData = selectedState ? stateSafety[selectedState] : null;

  return (
    <div style={{ padding: "24px" }}>
      <h1>Queer Safety Map — United States</h1>

      <p style={{ maxWidth: "700px" }}>
        This map provides a high-level overview of LGBTQ+ safety and legal
        protections by state. Information is for educational purposes only and
        is not legal advice.
      </p>

      {/* MAP */}
      <ComposableMap projection="geoAlbersUsa" width={980} height={550}>
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const stateCode = geo.properties.name.replace(/\s+/g, "")
              const safety = stateSafety[stateCode];
              console.log(geo.properties.name);

              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={getColor(safety?.level)}
                  stroke="#ffffff"
                  style={{
                    default: { outline: "none" },
                    hover: { fill: "#90caf9", outline: "none", cursor: "pointer" },
                    pressed: { outline: "none" },
                  }}
                  onClick={() => setSelectedState(stateCode)}
                />
              );
            })
          }
        </Geographies>
      </ComposableMap>

      {/* KNOW YOUR RIGHTS */}
      <div style={{ marginTop: "24px" }}>
        <h2>Know Your Rights</h2>

        {!selectedState && (
          <p>Click on a state to view LGBTQ+ rights and protections.</p>
        )}

        {selectedState && !stateData && (
          <p>Information for this state is coming soon.</p>
        )}

        {stateData && (
          <div>
            <h3>{stateData.name}</h3>

            <p>
              <strong>Safety Level:</strong>{" "}
              {stateData.level.charAt(0).toUpperCase() +
                stateData.level.slice(1)}
            </p>

            <ul>
              {stateData.rights.map((right, index) => (
                <li key={index}>{right}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default QueerSafetyMap;