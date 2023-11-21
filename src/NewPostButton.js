import React, { Component } from 'react';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import "./styles.css";
import {useState} from 'react';
import ArticleMarker from './ArticleMarker';


class NewPostButton extends Component
{
    state = {
      markers: []
    }
    static getDerivedStateFromProps(props,state) {
      return {coordinates: props.coordinates, articledata: props.articledata};
    }
    click = () => {
      this.props.parent.setState({blur: true});
      document.getElementById('new-post-title').style.borderColor = 'white';
      document.getElementById('new-post-text').style.borderColor = 'white';
        if(!this.props.parent.state.newPost){
            this.props.parent.setState({newPost: true})
            document.getElementById('new-post-panel').style.visibility = 'visible';
        }else{
           var container = document.getElementById('marker-container');
           var ntitle = document.getElementById('new-post-title').value;
           var ntext = document.getElementById('new-post-text').value;

           let newArticle = {title: 'title', text:'text',coordinates: [0,0], createdAt: new Date().getTime()};
           newArticle.title = ntitle;
           newArticle.text = ntext;
          var goodToPublish = true;
           if(newArticle.title == ""){
              document.getElementById('new-post-title').style.borderColor = 'red';
              goodToPublish = false;
           }
           if(newArticle.text == ""){
              document.getElementById('new-post-text').style.borderColor = 'red';
              goodToPublish = false;
           }
           if(goodToPublish){
            this.props.parentCallback(newArticle);
            console.log("Uploaded new article: "+newArticle.title + " at "+ newArticle.createdAt);
            fetch("http://localhost:5000/", {
              method: "POST",
              body: JSON.stringify({
                articleTitle: newArticle.title,
                articleText: newArticle.text,
                coordinates: newArticle.coordinates,
                createdAt: newArticle.createdAt
              }),
              headers: {
                "Content-type": "application/json; charset=UTF-8"
              }
            });
            this.props.parent.setState({newPost: false,blur: false})
            this.props.parent.scrollToMap();
           document.getElementById('new-post-panel').style.visibility = 'hidden';

           document.getElementById('new-post-title').value = "";
           document.getElementById('new-post-text').value = "";
           }
        }
    }
    render(){
        return (
            <Button id='post-button' variant="primary" onClick={this.click}>{this.props.parent.state.newPost == true ? 'Upload Post' : 'New Post'}</Button>
      );
    }

}
export default NewPostButton;
  