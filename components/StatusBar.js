import StatusBarAlert from 'react-native-statusbar-alert';
import React from 'react';
import { Text } from 'react-native';
import socket from '../services/socket';
import data from '../services/data';
import notification, { playHelloSound } from '../services/notification';
import whoAmI from '../services/whoAmI';


var colors={
    info:'#dff0d8',
    warn:'#faf2cc',
    error:'#a94442'
}

export default class Element extends React.Component {
        constructor(props) {
            super(props);
            var self=this;

            this.state={
                visible:true,
                partnerDisconnected:false,
                message:'Connecting to 247Buddy server...',
                color:colors.info
            }

            this.turnOffOldMessage = this.turnOffOldMessage.bind(this);
            var pairTimeout;
            
            
            function connected() {
                socket.emit('set-ip', whoAmI())
                self.setState({
                    visible: true,
                    message: 'Connected to 247Buddy server',
                    color: colors.info
                })
                setTimeout(function () {
                    self.setState({
                        visible: false
                    })
                }, 1500);
                
            }

            setTimeout(function () {
                if (socket.connected)
                {
                    connected();
                }
            }, 1500);

            socket.on('connect', connected)

            socket.on('incident-recorded',()=>{
                self.setState({
                    visible: true,
                    message: 'Report incident recorded',
                    color: colors.info
                })
                setTimeout(function () {
                    self.setState({
                        visible: false
                    })
                }, 1500);
            })

            socket.on('user-blocked',()=>{
                self.setState({
                    visible: true,
                    message: 'User has been blocked',
                    color: colors.info
                })
                setTimeout(function () {
                    self.setState({
                        visible: false
                    })
                }, 1500);
            })

            

            

            socket.on('reconnecting', (attemptNumber) => {
                self.setState({
                    visible: true,
                    message: 'Connecting to 247Buddy server',
                    color: colors.info
                })
            });


            //socket.on('connect_error', (err) => {
            //     console.log(err)
            // })


          socket.on('disconnect', ()=>{
              self.setState({
                  visible:true,
                  message: 'Cannot connect to 247Buddy server'
                })
          });

          socket.on('partner-disconnected', info => {
                clearTimeout(pairTimeout);
                self.setState({
                  visible:true,
                  partnerDisconnected:true,
                  message: '',
                  color:colors.error
                })
        });

          socket.on('bannedUser', data => {
              self.setState({
                  visible: true,
                  message: 'You are not allowed to access 247Buddy.',
                  color: colors.error
              })

          });

          socket.on('404', data => {
              self.setState({
                  visible: true,
                  message: 'Sorry something went wrong.',
                  color: colors.error
              })
          });


        socket.on('reconnect', (attemptNumber) => {
            if(data.currentState=="Chat")
            socket.emit('reconnect-to-room', data.roomInfo.roomId);

            if (data.currentState == 'Selection' && data.myRole)
            socket.emit('find-pair', data.myRole);
        });

        
        socket.on('room-info', info => {
            var msg='Hey your buddy is here. say Hello!!!';
            if (info.connectionType == 'reconnect')
                msg='Hey your buddy is back';
            // else
            //     {
            //         notification(msg);
            //         playHelloSound();
            //     }

            self.setState({
                visible:true,
                message: msg,
                color:colors.info,
                partnerDisconnected: false
            })

            pairTimeout=setTimeout(function() {
                self.setState({
                visible:false
                })
            }, 4000); 

        });

        }

        turnOffOldMessage(){
            if (this.state.partnerDisconnected)
                this.setState({
                    visible: false,
                    partnerDisconnected: false,
                    message: ''
                })

        }

        render() {
            return ( 
                <StatusBarAlert visible={this.state.visible || this.state.partnerDisconnected} height={50} backgroundColor={this.state.partnerDisconnected ? colors.error: this.state.color} color = "white" >
                    <Text>{this.state.message}</Text>
                    { this.state.partnerDisconnected ? <Text>You partner has disconnected</Text>:null }
                  </StatusBarAlert>  
 

            )
        }       
}