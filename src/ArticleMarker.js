import React, { Component } from 'react';
import { ComposableMap, Geographies, Geography,Marker,ZoomableGroup } from "react-simple-maps";
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import "./styles.css";
import {useState} from 'react';
import {getDistance} from 'geolib';

import icon_approve from './assets/icon_approve.png';
import icon_disapprove from './assets/icon_disapprove.png';
import icon_comment from './assets/icon_comment.png';

export default class ArticleMarker extends Component
{
    state = {
      coordinates: '',
      articledata: '',
      expanded: false,
      significance: 1,
      votes: [0,0],
      userCanInteract: false,
      hover: false,
      createdAt: 0
    }
    static getDerivedStateFromProps(props,state) {
      return {coordinates: props.coordinates, articledata: props.articledata, createdAt: props.createdAt};
    }
    succes = (position) =>{
      var dist = getDistance(this.state.coordinates,{latitude: position.coords.latitude, longitude: position.coords.longitude})/1000;
          if(dist < 1){
            this.setState({
              expanded: !this.state.expanded,
              userCanInteract: true
            });
            this.props.parent.scrollToArticle();
            console.log('Can interact!');
          }
          else{
            this.setState({
              expanded: !this.state.expanded,
              userCanInteract: false
            });
            this.props.parent.scrollToArticle();
            console.log('Cant interact!');
          }    }
    expand = (t) => {
      if(t.state.expanded == false){
        navigator.geolocation.getCurrentPosition(this.succes, function error(err){
          console.warn(err);
        },{enableHighAccuracy: false,//TODO: NEED TO WORK ON HIGH ACCURACY FOR TESTING PURPOSES I LEFT IT ON LOW ACCURACY
          timeout: 5000,
          maximumAge: Infinity});
      }else{
        this.props.parent.scrollToMap();
        this.setState({
          expanded: !this.state.expanded,
          userCanInteract: false
        });
      }
      
    }
    approve = () =>{
      if(this.state.significance < 20){
      this.setState({significance: this.state.significance+0.1})
      }
      this.setState({votes: [this.state.votes[0]+1, this.state.votes[1]]})
    }
    disapprove = () =>{
      if(this.state.significance-0.1 > 0.1){
        this.setState({significance: this.state.significance-0.1})
        }
        this.setState({votes: [this.state.votes[0], this.state.votes[1]+1]})
    }
    filterMarker = () =>{
      if(this.props.parent.state.filter == 'all'){
        return true;
      }
      if(this.props.parent.state.filter == 'new'){
        var time = new Date().getTime() - this.state.createdAt;
        if(time < 3600000){//1 hour old article
          return true;
        }
        else{
          return false;
        }
      }
      if(this.props.parent.state.filter == 'controversial'){
        if(this.state.votes[0] != 0 && this.state.votes[1] != 0){
          var a = (this.state.votes[0]+1) / (this.state.votes[1]+1);
          if(a > 0.75 && a < 1.25){
            return true;
          }
          else{
            return false;
          }
        }else{
          return false;
        }
      }
    }
    render(){
        return (
            <Marker className="marker-click" key={"test"} coordinates={this.state.coordinates} onClick={() => this.expand(this)} onMouseOver={()=>this.setState({hover: true})} onMouseLeave={()=>this.setState({hover: false})}>
                {this.filterMarker() &&<circle className="marker-child" r={this.state.significance} fill="#F00" stroke="#fff" strokeWidth={1} articledata ="title"/>}
                {this.state.hover && <foreignObject width="100" height="50"><p style={{fontSize:5, color: 'white'}}>{this.state.articledata.title}</p></foreignObject>}
                {this.state.expanded && <foreignObject width="300" height="500" id="article" className="marker-article">
                {this.filterMarker() && <Card className="text-center" style={{width: 150, height: 250}}>
                    <Card.Body>
                    <Card.Title style={{fontSize: 20}} id="article-title">{this.state.articledata.title}</Card.Title>
                    <Card.Img variant="top" src="holder.js/100px180" />
                    <Card.Text style={{fontSize: 5,height:100, maxHeight: 100}} id="article-text">
                    {this.state.articledata.text}
                    </Card.Text>
                    <div style={{position:'relative',top: -30}}>

                    {this.state.userCanInteract && <Card.Img style={{width: 25, height: 25, margin: 5}} src={icon_approve} onClick={this.approve}/>}
                    <Card.Img style={{width: 25, height: 25, margin: 5}} src={icon_comment}/>
                    {this.state.userCanInteract && <Card.Img style={{width: 25, height: 25, margin: 5}} src={icon_disapprove} onClick={this.disapprove}/>}
                  
                    <p style={{fontSize: 5, position:'relative', top:0,color: this.state.userCanInteract == true ? 'green' : 'red'}}>{this.state.userCanInteract== true ? 'You can interact with this post' : 'You cannot interact with this post(must be in close proximity)'}</p>
                    </div>
                    </Card.Body>
                </Card>}
                </foreignObject>}
            </Marker>
      );
        }

}
  