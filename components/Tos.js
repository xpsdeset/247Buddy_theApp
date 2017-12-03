import React, { Component } from 'react';
import { Modal, Text, View, Image, StyleSheet, Linking, AsyncStorage } from 'react-native';

import { Container, Header, Content, Button } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';

import { loadNotification } from '../services/notification';

export default class Tos extends Component {

  
  constructor() {
    super();
    var self=this;
    this.state={
      modalVisible:true
    }

    AsyncStorage.getItem('247Buddy.tos').then(data=>{
      self.setState({ modalVisible: data != "yes" });
    }) 
    



  }



  acceptTos(visible) {
    AsyncStorage.setItem('247Buddy.tos', "yes")
    this.setState({ modalVisible: false });
    
  }

  render() {
    return (
        <Modal
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={()=>{}}
          >
        <Content contentContainerStyle={{alignItems: 'center'}}>
          <Row style={{marginTop:100}} >
            <Image source={require('../assets/images/logo.png')} style={{
              width: 135,
              height: 150,
              
            }} />
          </Row>
          <Row style={{ flex: 1, flexWrap: 'wrap', width: 250, marginTop: 50, flexDirection: 'row' }}>
            <Text>
              By clicking below button, you agree to 247Buddy’s{" "}
              <Text style={styles.link} onPress={() => Linking.openURL('https://247buddy.net/privacy-policy')}>Privacy policy</Text>
              {"\n"}Please make sure you have read our {" "}
              <Text style={styles.link} onPress={() => Linking.openURL('https://247buddy.net/tos')}>Do's and don'ts</Text>
              {"\n"}You are talking to a human being, please be gentle.
            </Text>
          </Row>
          <Row>
            <Button primary rounded style={{ width: 100, marginTop: 50, paddingLeft: 20 }} onPress={() => { this.acceptTos()}}> 
              <Text style={{ color: '#fff', textAlign: 'center' }}> I Agree </Text>
            </Button>
          </Row>
        </Content>
        </Modal>
    );
  }
}

const styles = StyleSheet.create({
 
  link: {
    color: 'blue',
    textDecorationLine:'underline',
    marginLeft:5

  }
});
