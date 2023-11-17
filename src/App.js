import React from "react";
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from "react-simple-maps";
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form';
import "./styles.css";
import { useState, useRef } from 'react';
import ArticleMarker from "./ArticleMarker";
import NewPostButton from "./NewPostButton";


class App extends React.Component {
  constructor(props) {
    super(props)
  }
  state = {
    mapWidth: 800,
    mapHeight: 600,
    markers: [{ title: 'The first article!', text: 'This is no, news just a milestone for this website!', coordinates: [0, 0] }],
    userCoordinates: [],
    articlesToday: 1,
    openFilters: false,
    filters: {byVote: 0}
  };


  handleCallback = (childData) => {
    var newMarker = childData;
    newMarker.coordinates = this.state.userCoordinates;
    this.setState({
      markers: [...this.state.markers, newMarker],
      articlesToday: this.state.articlesToday+1
    });
  };
  geoLocation = (t) => {
    navigator.geolocation.getCurrentPosition(function (position) {
      t.setState({ userCoordinates: [position.coords.longitude, position.coords.latitude] });
    });
  }

  scrollToMap = () =>{
    var element = document.getElementById("map");
    element.scrollIntoView({behavior: "smooth", block: "center"});
  }
  scrollToTitle = () =>{
    var element = document.getElementById("title-label");
    element.scrollIntoView({behavior: "smooth", block: "center"});
  }

  cancelPost = () =>{
        document.getElementById('new-post-panel').style.visibility ='hidden';
  }

  render() {
    return (
      <div onLoad={this.geoLocation(this)}>
        <div className="title-label" id="title-label" onLoad={this.scrollToTitle}>
          <Card style={{ height: 300 }}>
            <Card.Body>
              <Card.Header className="text-center h1">Iwitness</Card.Header>
              <Card.Text className="text-center">iWitness is a dynamic platform that empowers users to share and explore real-time events through the eyes of eyewitnesses. Capture the essence of local happenings, breaking news, and unique perspectives, all on an interactive map-driven interface.</Card.Text>
              <Button onClick={this.scrollToMap} className="w-100">Go see todays news</Button>
            </Card.Body>
          </Card>
        </div>
        <br/>
        <div className="title-label">
          <Card style={{ height: 300 }}>
            <Card.Body>
              <Card.Header className="text-center h1">How it works</Card.Header>
              <Card.Text className="text-center">iWitness enables users to share location-based articles, represented as markers on the map. Those within a 1km radius can vote to approve or disapprove, while users outside this range can comment but not vote, preventing the spread of misinformation. The size of the marker increases with more local approvals</Card.Text>
            </Card.Body>
          </Card>
        </div>
        <ComposableMap id="map" projectionConfig={{
          scale: 100,
          center: [0, 0],
        }}>
          <ZoomableGroup id="zoom" width={this.state.mapWidth} height={this.state.mapHeight} center={[0, 0]} zoom={1} maxZoom={50} translateExtent={[
            [0, -this.state.mapHeight],
            [this.state.mapWidth, this.state.mapHeight]
          ]}>
            <Geographies geography="/features.json">
              {({ geographies }) =>
                geographies.map((geo) => (
                  <Geography key={geo.rsmKey} geography={geo} />
                ))
              }
            </Geographies>
            <g id='marker-container'>
              {this.state.markers.map((marker) =>

                <ArticleMarker key={marker.title}
                  coordinates={marker.coordinates} articledata={{ title: marker.title, text: marker.text }} />
              )}
            </g>
          </ZoomableGroup>
        </ComposableMap>

        <Container className="fixed-top" style={{ height: 100 }}>
          <Navbar expand="lg" className="bg-body-tertiary" style={{ borderRadius: '0px 0px 10px 10px' }}>
            <Container>
              <Navbar.Brand className="center clickable" onClick={this.scrollToTitle}>iWitness</Navbar.Brand>
              <Navbar.Brand className="center" style={{position:'relative',right:-150}}>{this.state.articlesToday} Articles posted today</Navbar.Brand>
              <Button style={{position: 'relative', right:-200}} onClick={() => this.setState({openFilters: !this.state.openFilters})}>Filters</Button>
              <NewPostButton parentCallback={this.handleCallback}/>
            </Container>
          </Navbar>

          <div id='new-post-panel' style={{ width: 300, height: 400, backgroundColor: 'white', borderRadius: '0px 0px 10px 10px', position: 'relative', left: 990, visibility: 'hidden' }}>
            <Form.Control size="lg" type="text" placeholder="Title" id='new-post-title' />
            <Form.Control size="sm" cols="30" rows="50" type="text" placeholder="Descibe what you see" id='new-post-text' />
            <Form.Control type="file" />
            <ComposableMap projectionConfig={{
              scale: 5000,
              center: this.state.userCoordinates
            }}>

              <Geographies geography="/features.json">
                {({ geographies }) =>
                  geographies.map((geo) => (
                    <Geography key={geo.rsmKey} geography={geo} />
                  ))
                }
              </Geographies>
              <Marker key={"new Post Position"} coordinates={this.state.userCoordinates}>
                <circle r={20} fill="#F00" stroke="#fff" strokeWidth={1} />
              </Marker>
            </ComposableMap>
            <p style={{color: 'red'}} className="text-center clickable" onClick={this.cancelPost}>Cancel</p>
          </div>
          {this.state.openFilters && <div className="text-center" style={{ width: 200, height: 200, backgroundColor: 'white', borderRadius: '0px 0px 10px 10px', position: 'relative', left: 990,top:-400}}>
            <Button style={{margin: 5,backgroundColor: 'orange', border:'none'}}>Top</Button>
            <Button style={{margin: 5,backgroundColor: 'red', border:'none'}}>Controversial</Button>
            <Button style={{margin: 5, border:'none'}}>New</Button>
          </div>}
        </Container>

        <p className="fixed-bottom" style={{fontSize: 10, color: 'white'}}>Designed and developed by Kokas Márk</p>
      </div>
    );
  }
}
export default App;
