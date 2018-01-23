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
import TimerCountdown from '../components/TimerCountdown';
import ConnectButtons from '../components/ConnectButtons';
import TimerMixin from 'react-timer-mixin';



export default class SelectionScreen extends React.Component {


  constructor(props) {
    super(props);
    this.state = Object.assign({
      header: '',
      status: 'not-paired',
      expiryTime: 0,
      findingPair: false,
      pairFound:false,
      notifyMe: false
    });
      
    // data.SelectionScreenState;


    var self = this;
    data.currentState = 'Selection';

    data.myRole = null;

    socket.emit('cleanup');

    this.addMeToQueue = this.addMeToQueue.bind(this);
    this.changeNotifyMe = this.changeNotifyMe.bind(this);
    this.timerExpired = this.timerExpired.bind(this);
    this.findPair = this.findPair.bind(this);

    AsyncStorage.getItem('247Buddy.register-listener').then(notifyMe => {
      this.setState({ notifyMe: notifyMe == 'true' })
    })


    socket.on('room-info', info => {
      clearTimeout(this.timer);
      info.myRole = this.state.myRole;
      this.setState({pairFound:true})
      console.log(info)
      data.roomInfo = info;
      // socket.off('global-info');
      data.currentState = 'Chat';
      if (info.connectionType != 'reconnect')
        this.props.navigation.navigate('Chat');
    });


  }
  componentWillUnmount() {
    clearTimeout(this.timer);
  }
  findPair(role) {
    if(role == 'listener')
      {
        notification.showToast('Please wait,\n Waiting for your buddy to respond')
        this.timer = setTimeout(() => {
          notification.showToast('Your buddy may be already be paired or didn\'t respond\n Sorry.')
          socket.emit('cleanup');
        }, 30*1000);
    }

    if(role == 'venter')
    {
        this.setState({
        status: 'finding-pair',
        expiryTime: 3 * 60 * 1000
      })
    }
    this.setState({
      myRole: role
    })

    data.roomInfo.myRole = role;
    socket.emit('find-pair', role);
  }

  changeNotifyMe() {
    this.setState({ notifyMe: !this.state.notifyMe }, () => {
      socket.emit('register-listener', this.state.notifyMe)
      var msg = "";
      if (this.state.notifyMe)
        msg = "You will be notified if someone wants to be heard";
      else
        msg = "You will not be disturbed.";
      notification.showToast(msg)

      AsyncStorage.setItem('247Buddy.register-listener', this.state.notifyMe + "")
    })
  }


  addMeToQueue() {
    if (this.state.findingPair)
      return
    msg = "You will be notified when your buddy is here";
    notification.showToast(msg);
    this.findPair('venter');
    this.setState({ findingPair: true })
  }

  timerExpired() {
    if (this.state.pairFound)
      return

    msg = "Sorry we were not able to find a buddy for you at the moment, please try again";
    notification.showToast(msg);
    this.setState({ findingPair: false, expiryTime:0 })
    socket.emit('cleanup');
  }


  render() {
    return (
      <View style={{ flex: 1 }} >
        <Image source={require('../assets/images/blue_bg.png')} style={styles.backgroundImage} />
        <View style={styles.homeContainer}>
          <View style={styles.infoBox}>
            <ConnectButtons findPair={this.findPair} disable={this.state.findingPair} />
          </View>
          <Content>
            <Grid>
              <Row>
                <Button primary full onPress={() => { this.addMeToQueue() }} style={[styles.selectButton, styles.venterButton]} >
                  <Image source={require('../assets/images/teller-display-icon.png')} style={styles.venterIcon} />
                  {!this.state.findingPair ?
                  <Text style={styles.noFindText} > Find My Buddy </Text> :
                  <Text style={styles.findingText} > Finding your Buddy </Text> 
                  }
                  
                  <TimerCountdown
                    initialSecondsRemaining={this.state.expiryTime}
                    onTimeElapsed={() => this.timerExpired()}
                    allowFontScaling={true}
                    style={styles.timer}
                  />                 
                </Button>
              </Row>
              <Row>
                <Button full large style={[styles.selectButton, styles.listenerButton]}>
                  <Image source={require('../assets/images/icon-listener.png')} style={styles.listenerIcon} />
                  <Text>Available to listen</Text>
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
        </View>
      </View>
    );
  }


}

const styles = StyleSheet.create({
  homeContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
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
  infoBox: {
    flex: 1,
    position: 'absolute',
    zIndex: 5
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
    width: 90,
    height: 70,
    resizeMode: 'contain',
    position:'absolute',
    left:5 
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
    position: 'relative',
    top: -35,
    left: -50
  },
  donateBox: {
    width: 100,
    marginTop: 10,
    marginLeft: 90,
    height: 30
  },
  noFindText: {
    fontSize: 20,
    color: '#fff',
    position:'absolute',
    left:95
  },
  findingText:{
    fontSize: 17,
    position:'absolute',
    left:95,
    top:30,
    color: '#fff'
  },
  timer:{
    position:'absolute',
    top:55,
    left:100,
    fontSize: 16,
    color: '#fff',
    
  },

});
