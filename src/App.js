import React from "react";
import { ComposableMap, Geographies, Geography,Marker,ZoomableGroup } from "react-simple-maps";
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form';
import "./styles.css";
import {useState} from 'react';
import ArticleMarker from "./ArticleMarker";
import NewPostButton from "./NewPostButton";



function App(){
  const [markers, setMarkers] = useState([<ArticleMarker coordinates={[0,0]} articledata={{title: '1st',text:'article!'}}/>]);
  const mapWidth = 800;
  const mapHeight = 600;

  return(
  <div>
     <ComposableMap  projectionConfig={{
        scale: 100,
        center: [0, 0],
      }}>
    <ZoomableGroup id="zoom"  width={mapWidth} height={mapHeight} center={[0, 0]} zoom={1} maxZoom={50} translateExtent={[
          [0, -mapHeight],
          [mapWidth, mapHeight]
        ]}>
      <Geographies geography="/features.json">
        {({ geographies }) =>
          geographies.map((geo) => (
            <Geography key={geo.rsmKey} geography={geo}/>
          ))
        }
      </Geographies>
        <g id='marker-container'>
          {markers}
        </g>
      </ZoomableGroup>
    </ComposableMap>

    <Container className="fixed-top">
      <Navbar expand="lg" className="bg-body-tertiary">
        <Container>
          <Navbar.Brand className="center">Iwitness</Navbar.Brand>
          <NewPostButton/>
        </Container>
      </Navbar>
     
     <div id='new-post-panel' style={{width: 300, height: 400, backgroundColor: 'white', borderRadius:'0px 0px 10px 10px',position: 'relative', left: 990, visibility: 'hidden'}}>
        <Form.Control size="lg" type="text" placeholder="Title" id='new-post-title'/>
        <Form.Control size="sm" cols="30" rows="50" type="text" placeholder="Descibe what you see" id='new-post-text'/>
        <Form.Control type="file" />
      </div>
    </Container>

   
    <div className="article-container"></div>
  </div>
  );
}
export default App;
