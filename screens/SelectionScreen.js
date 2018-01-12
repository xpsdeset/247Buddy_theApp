import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  AsyncStorage,
  Linking,
  View
} from 'react-native';

import { WebBrowser } from 'expo';
import { Bubbles } from 'react-native-loader';

import socket from '../services/socket';
import renderIf from '../services/renderIf';
import data from '../services/data';
import notification from '../services/notification';

import { Button, Content, CheckBox } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';





export default class SelectionScreen extends React.Component {


  constructor(props) {
    super(props);
    this.state = Object.assign({
      header: '',
      status: 'not-paired',
      notifyMe: false
    },
      data.SelectionScreenState);


    var self = this;
    data.currentState = 'Selection';

    data.myRole = null;

    socket.emit('cleanup');

    this.addMeToQueue = this.addMeToQueue.bind(this);

    this.changeNotifyMe = this.changeNotifyMe.bind(this);

    AsyncStorage.getItem('247Buddy.register-listener').then(notifyMe => {
      this.setState({ notifyMe: notifyMe == 'true' })
    })




    socket.on('room-info', info => {
      info.myRole = this.state.myRole;
      data.roomInfo = info;
      socket.off('global-info');
      data.currentState = 'Chat';
      if (info.connectionType != 'reconnect')
        this.props.navigation.navigate('Chat');
    });


  }

  findPair(role) {
    this.setState({
      status: 'finding-pair',
      myRole: role
    })
    data.myRole = role;
    socket.emit('find-pair', role);
  }

  changeNotifyMe() {
    this.setState({ notifyMe: !this.state.notifyMe }, () => {
      socket.emit('register-listener', this.state.notifyMe)
      var msg = "";
      if (this.state.notifyMe)
        msg = "You will be notified if someone wants to be heard";
      else
        msg = "You will not be distrubed.";
      notification.showToast(msg)

      AsyncStorage.setItem('247Buddy.register-listener', this.state.notifyMe + "")
    })
  }


  addMeToQueue() {
    socket.emit('register-venter');
    msg = "You will be notified when your buddy is here";
    notification.showToast(msg);
  }


  render() {
    return (
      <View style={{ flex: 1 }} >
        <Image source={require('../assets/images/blue_bg.png')} style={styles.backgroundImage} />
        <View style={styles.homeContainer}>
          {renderIf(this.state.status == 'not-paired',

            <Content>
              <Grid>
                <Row>
                  <Button primary full
                    onPress={() => { this.addMeToQueue() }}
                    style={[styles.selectButton, styles.venterButton]}
                  >
                    <Image source={require('../assets/images/teller-display-icon.png')} style={styles.venterIcon} />
                    <Text style={styles.selectButtonText} >Find My Buddy</Text>
                  </Button>
                </Row>
                <Row>
                  <Button full large
                    style={[styles.selectButton, styles.listenerButton]}
                  >
                    <Image source={require('../assets/images/icon-listener.png')} style={styles.listenerIcon} />
                    <Text>I am available to listen</Text>
                    <CheckBox checked={this.state.notifyMe} onPress={this.changeNotifyMe} />
                  </Button>
                </Row>
                <Row>
                  <TouchableOpacity style={[styles.donateBox]}
                    onPress={() => { Linking.openURL('https://247buddy.net/api/direct_donate') }}  >
                    <Image source={require('../assets/images/donate.png')} style={styles.donateIcon} />
                  </TouchableOpacity>
                </Row>
              </Grid>
            </Content>
          )}
        </View>
      </View>
    );
  }


}

const styles = StyleSheet.create({
  homeContainer: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'absolute',
    height: 300,
    top: 100,
    left: 20,
    right: 20,
    zIndex: 2
  },
  subHeaders: {
    position: 'absolute',
    top: 45,
    left: 125,
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'stretch', // or 'stretch'
    width: null,
    height: null
  },
  listenerButton: {
    marginTop: 30,
    backgroundColor: '#fff',
    borderWidth: 0.5,
    width: 250,
    height: 55,
    marginLeft: 20,
  },
  venterButton: {
    height: 100,
    width: 250,
    borderRadius: 5,
    marginLeft: 20
  },
  venterIcon: {
    width: 95,
    height: 75,
    resizeMode: 'contain',
    marginBottom: 2,
    marginLeft: -10,
    marginRight: 5
  },
  listenerIcon: {
    width: 50,
    height: 45,
    resizeMode: 'contain',
    marginBottom: 2,
    marginLeft: -5,
    marginRight: 5
  },
  donateIcon: {
    width: 200,
    height: 100,
    resizeMode: 'contain',
  },
  donateBox: {
    marginLeft: 50,
    marginTop: -20
  },

  selectButtonText: {
    fontSize: 18,
    color: '#fff',
  }

});
