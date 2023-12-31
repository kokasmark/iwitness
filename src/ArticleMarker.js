import React, { Component } from 'react';
import { ComposableMap, Geographies, Geography,Marker,ZoomableGroup } from "react-simple-maps";
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import "./styles.css";
import {useState} from 'react';
import {getDistance} from 'geolib';
import {getUserToken} from "./User";

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
      createdAt: 0,
      author: '',
      id: 0
    }
    static getDerivedStateFromProps(props,state) {
      return {coordinates: props.coordinates, articledata: props.articledata, createdAt: props.createdAt, author: props.author, votes: props.votes, id: props.id};
    }
    succes = (position) =>{
      var dist = getDistance(this.state.coordinates,{latitude: position.coords.latitude, longitude: position.coords.longitude})/1000;
          if(dist < 5){
              if(this.state.author != '' && this.state.author != getUserToken()){
              this.setState({
                expanded: !this.state.expanded,
                userCanInteract: true
              });
            }
            else{
              console.log(this.state.author,"...",getUserToken())
              this.setState({
                expanded: !this.state.expanded,
                userCanInteract: false
              });
            }
            this.props.parent.scrollToArticle();
          }
          else{
            this.setState({
              expanded: !this.state.expanded,
              userCanInteract: false
            });
            this.props.parent.scrollToArticle();
          }   
          
        }
    expand = (t) => {
      if(t.state.expanded == false){
        this.props.parent.setState({currentArticle: this})
        navigator.geolocation.getCurrentPosition(this.succes, function error(err){
          console.warn(err);
        },{enableHighAccuracy: false,//TODO: NEED TO WORK ON HIGH ACCURACY FOR TESTING PURPOSES I LEFT IT ON LOW ACCURACY
          timeout: 5000,
          maximumAge: Infinity});
      }else{
        this.props.parent.setState({currentArticle: undefined})
        this.setState({
          expanded: !this.state.expanded,
          userCanInteract: false
        });
        this.props.parent.scrollToMap();
      }
      
    }
    approve = () =>{
      if(this.state.significance < 20){
      this.setState({significance: this.state.significance+0.1})
      }
      this.setState({votes: [this.state.votes[0]+1, this.state.votes[1]]})
      this.updateMarker(1)
    }
    disapprove = () =>{
      if(this.state.significance-0.1 > 0.1){
        this.setState({significance: this.state.significance-0.1})
        }
        this.setState({votes: [this.state.votes[0], this.state.votes[1]+1]})
        this.updateMarker(-1)
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
      if(this.props.parent.state.filter == 'local'){
        return true;//For now we doing it like this
      }
    }
    updateMarker = (change) =>{
      const self = this;
      var updatedVotes = this.state.votes;
      if(change === 1){
        updatedVotes[0] += 1;
      }
      else{
        updatedVotes[1] += 1;
      }
      fetch("https://iwitness--markkokas.repl.co/updateMarker", {
        method: "POST",
        body: JSON.stringify({
          votes: updatedVotes,
          id: this.state.id
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8"
        }
      
      });
    }
    show = () =>{
      return this.state.expanded && (this.props.parent.state.currentArticle === this);
    }
    render(){
        return (
            <Marker className="marker-click" key={"test"} coordinates={this.state.coordinates} onClick={() => this.expand(this)} onMouseOver={()=>this.setState({hover: true})} onMouseLeave={()=>this.setState({hover: false})}>
                {this.filterMarker() &&<circle className="marker-child" r={(((1+(0.1*this.state.votes[0])+(-0.1*this.state.votes[1])) > 0.1 ? (1+(0.1*this.state.votes[0])+(-0.1*this.state.votes[1])) : 0.1)/this.props.parent.state.mapScaleFactor) * this.props.parent.state.isMobile == true ? 2:1} fill="#F00" stroke="#fff" strokeWidth={1/this.props.parent.state.mapScaleFactor} articledata ="title"/>}               
                {this.show() && <foreignObject width="300" height="500" id="article" className="marker-article">
                {this.filterMarker() && <Card className="text-center fixed-center" style={this.props.parent.state.isMobile == false ? {width: 150, height: 250}: {width: 150, height: 250, position: 'relative', right: -110, top: 20, transform: 'scale(0.8)'}}>
                    <Card.Body>
                    <Card.Title style={{fontSize: 20}} id="article-title">{this.state.articledata.title}</Card.Title>
                    <Card.Img variant="top" src="holder.js/100px180" style={{width:100, height: 100}}/>
                    <Card.Text style={{fontSize: 5,height:100, maxHeight: 100}} id="article-text">
                    {this.state.articledata.text}
                    </Card.Text>
                    <div style={{position:'relative',top: -100}}>

                    {this.state.userCanInteract && <Card.Img style={{width: 25, height: 25, margin: 5}} src={icon_approve} onClick={this.approve}/>}
                    <Card.Img style={{width: 25, height: 25, margin: 5}} src={icon_comment}/>
                    {this.state.userCanInteract && <Card.Img style={{width: 25, height: 25, margin: 5}} src={icon_disapprove} onClick={this.disapprove}/>}
                  
                    <p style={{fontSize: 5, position:'relative', top:0,color: this.state.userCanInteract == true ? 'green' : 'red'}}>{this.state.userCanInteract== true ? 'You can interact with this post' : 'You cannot interact with this post'}</p>
                    </div>
                    </Card.Body>
                </Card>}
                </foreignObject>}
            </Marker>
      );
        }

}
  