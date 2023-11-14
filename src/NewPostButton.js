import React, { Component } from 'react';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import "./styles.css";
import {useState} from 'react';
import ArticleMarker from './ArticleMarker';

export default class NewPostButton extends Component
{
    state = {
      newPost: false
    }
    static getDerivedStateFromProps(props,state) {
      return {coordinates: props.coordinates, articledata: props.articledata};
    }
    click = () => {
        if(!this.state.newPost){
            this.setState({newPost: true})
            document.getElementById('new-post-panel').style.visibility = 'visible';
        }else{
           var container = document.getElementById('marker-container');
           var ntitle = document.getElementById('new-post-title').text;
           var ntext = document.getElementById('new-post-text').text;
           var newArticle = <ArticleMarker coordinates={[0,0]} articledata={{title: {ntitle},text:{ntext}}}/>
           
           this.setState({newPost: false})
           document.getElementById('new-post-panel').style.visibility = 'hidden';
        }
    }
    render(){
        return (
            <Button id='post-button' variant="primary" onClick={this.click}>{this.state.newPost == true ? 'Upload Post' : 'New Post'}</Button>
      );
    }

}
  