import React, { Component } from 'react';
import {Image, StyleSheet} from 'react-native';
import data from '../services/data';

import { Container,Left, Body, Right, Button,  Title } from 'native-base';
import { Header,Icon } from 'react-native-elements';


export default class HeaderSection extends Component {

 constructor(props) {
        super(props);
        this.state = {
          openChatMenu:false
        };
        this.toggleChatMenu = this.toggleChatMenu.bind(this);
        this.componentWillReceiveProps = this.componentWillReceiveProps.bind(this);
    }

    

    toggleChatMenu(){
        this.setState({ openChatMenu: !this.state.openChatMenu }, () => {
          this.props.toggleChatMenu(this.state.openChatMenu)
        })
    }

    componentWillReceiveProps(nextProps) {
      if(!nextProps.openChatMenu)
      this.setState({
        openChatMenu: false
      });
    }

  render() {
    return (
      
      <Header
        leftComponent={{ 
          icon: 'menu', onPress: this.props.openMainMenu , color:'#fff'
        }}
        centerComponent={
            <Image source={require('../assets/images/logo_without_text.png')} style={styles.logo} />
        }
        rightComponent={
              this.props.toggleChatMenu?
            { icon: this.state.openChatMenu ? 'close' : 'more-horiz', onPress: this.toggleChatMenu , color:'#fff'}:null
          }
        outerContainerStyles={{ backgroundColor: '#194fb0' }}
        
      />
    );
  }
}


const styles = StyleSheet.create({
  logo:{
    flex: 1,
    top:12,
    width: 50,
    height: 50,
  }
});


