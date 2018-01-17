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
                message:'Connecting...',
                color:colors.info
            }

            this.turnOffOldMessage = this.turnOffOldMessage.bind(this);
            var pairTimeout;
            
            
            async function connected() {
                socket.emit('set-ip', whoAmI.whoAmI())
                socket.emit('set-device-token', await whoAmI.getToken())

                self.setState({
                    visible: true,
                    message: 'Connected',
                    color: colors.info
                })
                self.props.toggleGlass(false);
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
                notification.showToast('Report incident recorded')
            })

            socket.on('user-blocked',()=>{
                notification.showToast('User has been blocked')
            })

            

            

            socket.on('reconnecting', (attemptNumber) => {
                self.setState({
                    visible: true,
                    message: 'Connecting...',
                    color: colors.info
                })
                this.props.toggleGlass(true); 
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
              notification.showToast('You are not allowed to access 247Buddy.')
          });

          socket.on('404', data => {
              notification.showToast('Sorry something went wrong.')
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
            notification.showToast('Sorry something went wrong.')
            //     {
            //         notification(msg);
            //         playHelloSound();
            //     }


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