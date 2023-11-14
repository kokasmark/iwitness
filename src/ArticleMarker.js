import React, { Component } from 'react';
import { ComposableMap, Geographies, Geography,Marker,ZoomableGroup } from "react-simple-maps";
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import "./styles.css";
import {useState} from 'react';

import icon_approve from './assets/icon_approve.png';
import icon_disapprove from './assets/icon_disapprove.png';
import icon_comment from './assets/icon_comment.png';

export default class ArticleMarker extends Component
{
    state = {
      coordinates: '',
      articledata: '',
      expanded: false
    }
    static getDerivedStateFromProps(props,state) {
      return {coordinates: props.coordinates, articledata: props.articledata};
    }
    expand = () => {
        this.setState({
            coordinates: this.state.coordinates,
            expanded: !this.state.expanded
          })
    }
    render(){
        return (
            <Marker className="marker-click" key={"test"} coordinates={this.state.coordinates} onClick={this.expand}>
                <circle className="marker-child" r={10} fill="#F00" stroke="#fff" strokeWidth={1} articledata ="title"/>
                {this.state.expanded && <foreignObject width="300" height="500" id="article" className="marker-article">
                <Card className="text-center" style={{width: 150, height: 250}}>
                    <Card.Body>
                    <Card.Title id="article-title">{this.state.articledata.title}</Card.Title>
                    <Card.Img variant="top" src="holder.js/100px180" />
                    <Card.Text id="article-text">
                    {this.state.articledata.text}
                    </Card.Text>
                    <div style={{position:'relative',top: 70}}>
                    <Card.Img style={{width: 25, height: 25, margin: 5}} src={icon_approve}/>
                    <Card.Img style={{width: 25, height: 25, margin: 5}} src={icon_comment}/>
                    <Card.Img style={{width: 25, height: 25, margin: 5}} src={icon_disapprove}/>
                    </div>
                    </Card.Body>
                </Card>
                </foreignObject>}
            </Marker>
      );
        }

}
  