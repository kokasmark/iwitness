import React, { Component } from 'react';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import "./styles.css";
import {useState} from 'react';
import ArticleMarker from './ArticleMarker';


class NewPostButton extends Component
{
    state = {
      newPost: false,
      markers: []
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
           var ntitle = document.getElementById('new-post-title').value;
           var ntext = document.getElementById('new-post-text').value;

           let newArticle = {title: 'title', text:'text',coordinates: [0,0]};
           newArticle.title = ntitle;
           newArticle.text = ntext;

           this.props.parentCallback(newArticle);
            console.log("Uploaded new article: "+newArticle.title);

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
export default NewPostButton;
  