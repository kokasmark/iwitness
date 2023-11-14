import React from "react";
import ReactDOM from "react-dom";
import { ComposableMap, Geographies, Geography,Marker,ZoomableGroup } from "react-simple-maps";

import "./styles.css";

const App = () => (
  <div>
    <ComposableMap>
    <ZoomableGroup center={[0, 0]} zoom={1} maxZoom={50}>
      <Geographies geography="/features.json">
        {({ geographies }) =>
          geographies.map((geo) => (
            <Geography key={geo.rsmKey} geography={geo} />
          ))
        }
      </Geographies>
      <Marker key={"test"} coordinates={[-55.2038, 5.852]}>
          <circle r={10} fill="#F00" stroke="#fff" strokeWidth={2} />
          <text style={{textAlign: 'center'}}>News!!</text>
        </Marker>
        </ZoomableGroup>
    </ComposableMap>
  </div>
);

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
