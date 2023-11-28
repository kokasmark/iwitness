import React, { useLayoutEffect } from "react";
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from "react-simple-maps";
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form';
import Carousel from 'react-bootstrap/Carousel';
import "./styles.css";
import { useState, useRef, useEffect } from 'react';
import ArticleMarker from "./ArticleMarker";
import NewPostButton from "./NewPostButton";
import {getUserToken, userInit} from "./User";

import logo from "./assets/icon_logo_dark.png";



class App extends React.Component {
  constructor(props) {
    super(props)
  }
  state = {
    mapWidth: 800,
    mapHeight: 600,
    markers: [],
    newPost: false,
    userCoordinates: [],
    articlesToday: 0,
    openFilters: false,
    filter: 'all',
    zoom: 1,
    mapCenter: [0,0],
    mapScaleFactor: 1,
    blur: false,
    isMobile: false
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
    this.setState({zoom: 1});
    var element = document.getElementById("zoom");
    element.scrollIntoView({behavior: "smooth", block: "center"});
    console.log('To Map!');

  }
  scrollToTitle = () =>{
    this.setState({zoom: 1, mapCenter: [0,0]});
    var element = document.getElementById("title-label");
    element.scrollIntoView({behavior: "smooth", block: "center"});
    console.log('To Title!');
  }
  scrollToArticle = () =>{
    this.setState({zoom: 1});
    var element = document.getElementById("article");
    element.scrollIntoView({behavior: "smooth", block: "center"});
    console.log('To Article!');
  }
  cancelPost = () =>{
    this.setState({newPost: false, blur: false})
    document.getElementById('new-post-panel').style.visibility ='hidden';
  }
  zoomLocal = () =>{
    this.setState({mapCenter: this.state.userCoordinates, zoom: 20, mapScaleFactor:20});
  }
  loadMarkers = (self) =>{
    var requestOptions = {
      method: 'GET',
      redirect: 'follow'
    };
    
    fetch("https://iwitness--markkokas.repl.co/data", requestOptions)
      .then(response => response.text())
      .then(function succes(result){
          const markers = JSON.parse(result);
          for(var i = 0; i < markers.length; i++){
            var parsed = markers[i];
            var newMarker = {title: parsed['title'], text: parsed['text'], coordinates: parsed['coordinates'], createdAt: parsed['createdAt'], author: parsed['author'], votes: parsed['votes'], id: parsed['id']}
            self.setState({
              markers: [...self.state.markers, newMarker],
              articlesToday: self.state.articlesToday+1
            });
          }
      })
      .catch(error => console.log('error', error));
  }
  componentDidMount(){
    userInit();
    this.loadMarkers(this);
    this.setState({isMobile: window.innerWidth < 768});
  }
  render() {
    return (
      <div>
      {this.state.isMobile == false && <div className="desktop-view">
        <div onLoad={this.geoLocation(this)}>
          <div className="title-label" id="title-label">
            <Card style={{ height: 315 }}>
              <Card.Body>
                <Card.Header className="text-center h1"><img src={logo} className="center" style={{height: 100, width: 500}}/></Card.Header>
                <Card.Text className="text-center" style={{fontSize:19}}>iWitness is a dynamic platform that empowers users to share and explore real-time events through the eyes of eyewitnesses. Capture the essence of local happenings, breaking news, and unique perspectives, all on an interactive map-driven interface.</Card.Text>
                <Button onClick={this.scrollToMap} className="w-100 text-center" style={{position:'relative',top:-20, height: 40, padding:0, marginTop: 10}}>Go see todays news</Button>
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
            scale: 125,
            center: this.state.mapCenter,
          }} style={this.state.blur == true ? {filter: 'blur(3px)'}:{}}>
            <ZoomableGroup id="zoom" width={this.state.mapWidth} height={this.state.mapHeight} center={this.state.mapCenter} zoom={this.state.zoom} maxZoom={50} translateExtent={[
              [0, -this.state.mapHeight/4],
              [this.state.mapWidth, this.state.mapHeight]
            ]} onMove={({ k }) => this.setState({mapScaleFactor: k})}>
              <Geographies geography="/features.json">
                {({ geographies }) =>
                  geographies.map((geo) => (
                    <Geography key={geo.rsmKey} geography={geo} />
                  ))
                }
              </Geographies>
              <g id='marker-container'>
                {this.state.markers.sort((a, b) => (1+(0.1*a.votes[0])+(-0.1*a.votes[1]))  > (1+(0.1*b.votes[0])+(-0.1*b.votes[1]))  ? 1 : -1).map((marker) =>
                  <ArticleMarker key={marker.title}
                    coordinates={marker.coordinates} articledata={{ title: marker.title, text: marker.text }} createdAt={marker.createdAt} author={marker.author}
                    votes={marker.votes} id={marker.id} parent={this} />
                )}
              </g>
            </ZoomableGroup>
          </ComposableMap>

          <Container className="fixed-top" style={{height: 100}}>
            <Navbar expand="lg" style={{ borderRadius: '0px 0px 10px 10px', backgroundColor: 'white' }}>
              <Container>
                <img src={logo} className="center clickable interactive" onClick={this.scrollToTitle} style={{height: 50, width: 250, position: 'relative', right: 50}}/>
                <Navbar.Brand className="center" style={{position:'relative',right:-100}}>{this.state.articlesToday} Articles posted today</Navbar.Brand>
                <Button style={{position: 'relative', right:-160}} onClick={() => this.setState({openFilters: !this.state.openFilters})} className="interactive">Filters</Button>
                <NewPostButton parentCallback={this.handleCallback} parent={this} className="interactive"/>
              </Container>
            </Navbar>

            {this.state.newPost && <h1 style={{color: 'white' ,position: 'relative', top: 200, right: -500}}>New Post</h1>}
            <div className="fixed-center" id='new-post-panel' style={{width: 300, height: 400, backgroundColor: 'white', borderRadius: '10px',position: 'relative', top: 200, right: -500,visibility: 'hidden' }}>
              <Form.Control autocomplete="off" size="lg" type="text" placeholder="Title" id='new-post-title' />
              <Form.Control autocomplete="off" size="sm" cols="30" rows="50" type="text" placeholder="Descibe what you see" id='new-post-text' />
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
              </ComposableMap>
              <p style={{color: 'red'}} className="text-center clickable interactive" onClick={this.cancelPost}>Cancel</p>
            </div>
            {this.state.openFilters && <div className="text-center" style={{ width: 200, height: 220, backgroundColor: 'white', borderRadius: '0px 0px 10px 10px', position: 'relative', left: 990,top:-400}}>
              <Button style={{margin: 5,backgroundColor: 'orange', border:'none', color: this.state.filter == 'top' ? 'white' : 'black'}} onClick={() => {this.setState({filter: 'top'});this.setState({mapCenter: [0,0], zoom: 1, mapScaleFactor:1});}}>Top</Button>
              <Button style={{margin: 5,backgroundColor: 'red', border:'none', color: this.state.filter == 'controversial' ? 'white' : 'black'}} onClick={() => {this.setState({filter: 'controversial'});this.setState({mapCenter: [0,0], zoom: 1, mapScaleFactor:1});}}>Controversial</Button>
              <Button style={{margin: 5, border:'none', color: this.state.filter == 'new' ? 'white' : 'black' }} onClick={() => {this.setState({filter: 'new'});this.setState({mapCenter: [0,0], zoom: 1, mapScaleFactor:1});}}>New</Button>
              <Button style={{margin: 5, border: 'none', color: this.state.filter == 'all' ? 'white' : 'black'}} onClick={() => {this.setState({filter: 'all'});this.setState({mapCenter: [0,0], zoom: 1, mapScaleFactor:1});}}>All</Button>
              <Button style={{margin: 5, border: 'none', color: this.state.filter == 'local' ? 'white' : 'black'}} onClick={() => {this.setState({filter: 'local'}); this.zoomLocal();}}>Local</Button>
            </div>}
          </Container>
        
          <p className="fixed-bottom" style={{fontSize: 10, color: 'white'}}>Designed and developed by Kokas Márk - {getUserToken()}</p>
        </div>
      </div>}


      {/*MOBILE VIEW*/}


      {this.state.isMobile == true && 
        <div>
          {this.state.newPost == false && <ComposableMap id="map" projectionConfig={{
            scale: 500,
            center: this.state.userCoordinates,
          }} style={this.state.blur == true ? {filter: 'blur(3px)'}:{position: 'relative', top: 300,transform: 'scale(2.0)'}}>
            <ZoomableGroup id="zoom" width={this.state.mapWidth * 2} height={this.state.mapHeight*2} center={this.state.userCoordinates} zoom={this.state.zoom} maxZoom={50} translateExtent={[
              [-this.state.mapWidth*2, -this.state.mapHeight/4],
              [this.state.mapWidth*2, this.state.mapHeight*4]
            ]} onMove={({ k }) => this.setState({mapScaleFactor: k})}>
              <Geographies geography="/features.json">
                {({ geographies }) =>
                  geographies.map((geo) => (
                    <Geography key={geo.rsmKey} geography={geo} />
                  ))
                }
              </Geographies>
              <g id='marker-container'>
                {this.state.markers.sort((a, b) => (1+(0.1*a.votes[0])+(-0.1*a.votes[1]))  > (1+(0.1*b.votes[0])+(-0.1*b.votes[1]))  ? 1 : -1).map((marker) =>
                  <ArticleMarker key={marker.title}
                    coordinates={marker.coordinates} articledata={{ title: marker.title, text: marker.text }} createdAt={marker.createdAt} author={marker.author}
                    votes={marker.votes} id={marker.id} parent={this} />
                )}
              </g>
            </ZoomableGroup>
          </ComposableMap>}

          <Container className="fixed-top" style={{height: 100}}>
            <Navbar expand="lg" style={{ borderRadius: '0px 0px 10px 10px', backgroundColor: 'white' }}>
              <Container style={{height: 75}}>
                <img src={logo} className="center clickable interactive" onClick={this.scrollToTitle} style={{height: 50, width: 250, position: 'relative', right:90, top:-5}}/>
                <Navbar.Brand className="center" style={{position:'relative',fontSize:20,right: 10, top: -15}}>{this.state.articlesToday} Articles posted today</Navbar.Brand>
                <Button style={{position: 'relative', right:0, top: -10, height: 40, textAlign: 'center', padding: 1}} onClick={() => this.setState({openFilters: !this.state.openFilters})} className="interactive">Filters</Button>
                <div style={{position: 'relative', right:-220, top: -100, height: 40}}><NewPostButton parentCallback={this.handleCallback} parent={this} className="interactive"/></div>    
              </Container>
            </Navbar>

            <div className="fixed-center" id='new-post-panel' style={{width: 300, height: 400, backgroundColor: 'white', borderRadius: '10px',position: 'relative', top: 25, right: -30,visibility: 'hidden' }}>
              <Form.Control autocomplete="off" size="lg" type="text" placeholder="Title" id='new-post-title' />
              <Form.Control autocomplete="off" size="sm" cols="30" rows="50" type="text" placeholder="Descibe what you see" id='new-post-text' />
              <Form.Control type="file" />
              <ComposableMap projectionConfig={{
                scale: 4250,
                center: this.state.userCoordinates
              }}>

                <Geographies geography="/features.json">
                  {({ geographies }) =>
                    geographies.map((geo) => (
                      <Geography key={geo.rsmKey} geography={geo} />
                    ))
                  }
                </Geographies>
              </ComposableMap>
              <p style={{color: 'red'}} className="text-center clickable interactive" onClick={this.cancelPost}>Cancel</p>
            </div>
            {this.state.openFilters && <div className="text-center" style={{ width: 200, height: 220, backgroundColor: 'white', borderRadius: '0px 0px 10px 10px', position: 'relative', right:-175,top:-425, transform: "scale(0.8)"}}>
              <Button style={{margin: 5,backgroundColor: 'orange', border:'none', color: this.state.filter == 'top' ? 'white' : 'black'}} onClick={() => {this.setState({filter: 'top'});this.setState({mapCenter: [0,0], zoom: 1, mapScaleFactor:1});}}>Top</Button>
              <Button style={{margin: 5,backgroundColor: 'red', border:'none', color: this.state.filter == 'controversial' ? 'white' : 'black'}} onClick={() => {this.setState({filter: 'controversial'});this.setState({mapCenter: [0,0], zoom: 1, mapScaleFactor:1});}}>Controversial</Button>
              <Button style={{margin: 5, border:'none', color: this.state.filter == 'new' ? 'white' : 'black' }} onClick={() => {this.setState({filter: 'new'});this.setState({mapCenter: [0,0], zoom: 1, mapScaleFactor:1});}}>New</Button>
              <Button style={{margin: 5, border: 'none', color: this.state.filter == 'all' ? 'white' : 'black'}} onClick={() => {this.setState({filter: 'all'});this.setState({mapCenter: [0,0], zoom: 1, mapScaleFactor:1});}}>All</Button>
              <Button style={{margin: 5, border: 'none', color: this.state.filter == 'local' ? 'white' : 'black'}} onClick={() => {this.setState({filter: 'local'}); this.zoomLocal();}}>Local</Button>
            </div>}
          </Container>

          
          </div>
        }
      </div>
    );
  }
}
export default App;
