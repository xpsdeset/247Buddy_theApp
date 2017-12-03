import React, { Component } from 'react';
import { Content, CheckBox, Text, Grid, Col } from 'native-base';
import { Permissions, Notifications } from 'expo';
import socket from '../services/socket';

import { AsyncStorage } from 'react-native';

export default class NotifyUnattendedVentors extends Component {

    state={
        notifyMe:false
    }
    
    constructor(props){
        super(props);
        this.changeNotifyMe = this.changeNotifyMe.bind(this);
        this.componentWillMount = this.componentWillMount.bind(this);
        AsyncStorage.getItem('247Buddy.register-listener').then(notifyMe=>{
            this.setState({ notifyMe: notifyMe=='true' })
        })
    }
    changeNotifyMe(){
        this.setState({ notifyMe:!this.state.notifyMe},()=>{
            socket.emit('register-listener', this.state.notifyMe)
            AsyncStorage.setItem('247Buddy.register-listener', this.state.notifyMe+"")
        })  
        

    }

    componentWillMount = async () => {
        // Android remote notification permissions are granted during the app
        // install, so this will only ask on iOS
        let { status } = await Permissions.askAsync(Permissions.REMOTE_NOTIFICATIONS);

        // Stop here if the user did not grant permissions
        if (status !== 'granted') {
            return;
        }

        // Get the token that uniquely identifies this device
        let token = await Notifications.getExpoPushTokenAsync();

        socket.emit('set-device-token', token)

        // POST the token to our backend so we can use it to send pushes from there
        // return fetch(PUSH_ENDPOINT, {
        //     method: 'POST',
        //     headers: {
        //         Accept: 'application/json',
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify({
        //         token: {
        //             value: token,
        //         },
        //     }),
        // });
    };

  render() {
    return (
        <Content>
        <Grid>
            <Col style={{ width: 20, marginRight: 20, marginTop: 5 }} >
            <CheckBox checked={this.state.notifyMe} onPress={this.changeNotifyMe} />
            </Col> 
            <Col><Text>Notify me, if there are any unattended venters on hold</Text></Col> 
        </Grid>
        </Content>
    );
  }
}