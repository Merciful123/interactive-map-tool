import React, { useEffect, useRef, useState } from "react";
import "ol/ol.css";  
import Map from "ol/Map";  
import View from "ol/View"; 
import TileLayer from "ol/layer/Tile";  
import OSM from "ol/source/OSM"; 
import { Draw } from "ol/interaction";  
import { getLength, getArea } from "ol/sphere";  
import VectorSource from "ol/source/Vector";  
import { Style, Stroke, Fill, Circle } from "ol/style";  

const MapComponent: React.FC = () => {
  // Reference for the map container
  const mapRef = useRef<HTMLDivElement>(null);

  // State variables for map instance, draw type, and dimension
  const [map, setMap] = useState<Map | null>(null);
  const [drawType, setDrawType] = useState<"Point" | "LineString" | "Polygon">(
    "Point"
  );
  const [dimension, setDimension] = useState<string>("");

  // Effect hook to initialize map and draw interaction
  useEffect(() => {
    let mapInstance: Map;

    if (mapRef.current) {
      // Create a vector source
      const source = new VectorSource();

      // Create a map instance
      mapInstance = new Map({
        target: mapRef.current, // Specify the target element for the map
        layers: [
          // Add a tile layer with OpenStreetMap as the source
          new TileLayer({
            source: new OSM(),
          }),
        ],
        view: new View({
          center: [0, 0], // Set the initial center of the map
          zoom: 2, // Set the initial zoom level of the map
        }),
      });

      // Set the map instance to state
      setMap(mapInstance);

      // Draw interaction for drawing features
      const drawInteraction = new Draw({
        source: source,
        type: drawType,
        style: new Style({
          image: new Circle({
            radius: 5,
            fill: new Fill({ color: "rgba(255, 0, 0, 0.5)" }),
            stroke: new Stroke({ color: "red", width: 1 }),
          }),
          stroke: new Stroke({
            color: "blue",
            width: 2,
          }),
          fill: new Fill({
            color: "rgba(0, 0, 255, 0.1)",
          }),
        }),
      });
      mapInstance.addInteraction(drawInteraction);

      // Event listener for drawend event
      drawInteraction.on("drawend", (event) => {
        const feature = event.feature;
        const geometry = feature.getGeometry();
        if (geometry) {
          let calculatedDimension = "";

          // Calculate dimension based on draw type
          if (drawType === "Point") {
            calculatedDimension = "Point";
          } else if (drawType === "LineString") {
            const length = getLength(geometry);
            calculatedDimension = `Line length: ${length.toFixed(2)} meters`;
          } else if (drawType === "Polygon") {
            const area = getArea(geometry);
            calculatedDimension = `Polygon area: ${area.toFixed(
              2
            )} square meters`;
          }

          // Set dimension to state and add feature to source
          setDimension(calculatedDimension);
          source.addFeature(feature);
        }
      });
    }

    // Clean up function
    return () => {
      if (mapInstance) {
        mapInstance.dispose();
      }
    };
  }, [drawType]);

  // Event handler for draw type change
  const handleDrawTypeChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setDrawType(event.target.value as "Point" | "LineString" | "Polygon");
  };

  // Event handler for reload button
  const handleReload = () => {
    window.location.reload();
  };

  // JSX for the component
  return (
    <div>
      <div className="p-2">
        <div className="flex justify-center p-2 mt-0">
          {/* Logo image */}
          <img
            src="https://static.wixstatic.com/media/0f2602_180dd934e3024369b8520918b8cb0358~mv2.png/v1/fill/w_199,h_59,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/New%20logo.png"
            alt="logo-img"
          />
        </div>

        {/* Instructions */}
        <h2 className="text-center font-weight-600">
          Select draw type and start drawing by first click on the map, when you
          finish drawing click once again where you left to get dimension.
        </h2>

        {/* Reload button */}
        <div>
          <button
            className="p-2 bg-purple-400 rounded-md"
            onClick={handleReload}
          >
            Reload
          </button>
        </div>

        {/* Draw type selector */}
        <label htmlFor="drawType">Draw Type:</label>
        <select id="drawType" value={drawType} onChange={handleDrawTypeChange}>
          <option value="Point">Point</option>
          <option value="LineString">Line</option>
          <option value="Polygon">Polygon</option>
        </select>
      </div>

      {/* Display dimension */}
      <p className="bg-yellow-400 inline mt-1 mb-2 p-2 border-radius rounded-md">
        Dimension: <span className="font-bold">{dimension}</span>
      </p>

      {/* Map container */}
      <div
        ref={mapRef}
        className="map-container"
        style={{ width: "90vw", height: "80vh" }}
      />
    </div>
  );
};

export default MapComponent;
