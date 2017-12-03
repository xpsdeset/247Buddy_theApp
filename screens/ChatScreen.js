import React from 'react';
import _ from 'lodash';
import { Platform,  StyleSheet,  Text,  View, Image } from 'react-native';
import {GiftedChat, Actions, Bubble} from 'react-native-gifted-chat';
import { Bubbles } from 'react-native-loader';
import socket from '../services/socket';
import data from '../services/data';
import ChatMenu from '../components/ChatMenu';
import ReportModal from '../components/ReportModal';
import notification from '../services/notification';
import KeyboardSpacer from 'react-native-keyboard-spacer';

export default class ChatScreen extends React.Component {
  constructor(props) {
    super(props);

     this.state = Object.assign({ 
          messages: [],
          isTyping: false,
          openReport: false
        },
        data.ChatScreenState);
    

    var avatar={
      listener:require('../assets/images/listener-display-icon.png'),
      venter:require('../assets/images/teller-display-icon.png')
    }

    
    var self=this;
    this._isMounted = false;
    this.onSend = this.onSend.bind(this);
    this.renderBubble = this.renderBubble.bind(this);
    this.renderFooter = this.renderFooter.bind(this);
    this.detectTyping = this.detectTyping.bind(this);
    this.reportChat = this.reportChat.bind(this);
    
    this.startTyping = _.debounce(function(){ 
      socket.emit('is-typing', true);
    }, 500, { 'leading': true, 'trailing': false })

    this.stopTyping = _.debounce(function(){ 
      socket.emit('is-typing', false);   
    }, 500)

     socket.on('partner-typing', info => {
        if (data.roomInfo.myRole != info.role)
          self.setState({isTyping:info.isTyping})
      });

      socket.on('message-from-room', message => {
        // if(data.roomInfo.myRole != message.role)
          // notification(message.text)

          self.setState((previousState) => {
              return {
                  messages: GiftedChat.append(previousState.messages, {
                      _id: Math.round(Math.random() * 1000000),
                      createdAt: new Date(),
                      text: message.text,
                      user: {
                          _id: message.role,
                          avatar: avatar[message.role]
                      },
                      message: message
                  }),
              };
        });
        data.ChatScreenState=this.state;
    });


  }

  // componentWillMount() {
  //   this._isMounted = true;
   
  // }

  // componentWillUnmount() {
  //   this._isMounted = false;
  // }


  reportChat(){
    socket.emit('report-incident', this.state.messages.map(d => d.message), this.state.reportReason);
    this.setState({ openReport: false, reportReason:'' })
  }

  onSend(messages = []) {
    socket.emit('message-to-room', messages[0].text)
  }

  detectTyping(text) {
    this.startTyping() 
    this.stopTyping(); 
  }

  



  renderBubble(props) {
    return (
      <Bubble
        {...props}
        textStyle={{
          left: {
            color: '#000'
          },       
          right: {
            color: '#000'
          }          
        }}
        wrapperStyle={{
          left: {
            backgroundColor: '#d0f8ee'
          },
          right: {
            backgroundColor: '#3bdbb1'
          }
        }}
      />
    );
  }


  renderFooter(props) {
      return (
        <View style={styles.footerContainer}>
          {this.state.isTyping ? <Bubbles size={5} color="#3bdbb1" /> : null }    
        </View>
      );
  }

  render() {
    return (
      <View style={{flex: 1}} >
      <Image source={require('../assets/images/white_bg.png')} style={styles.backgroundImage}/>
      {this.state.openReport?
      <ReportModal chatComponent={this} />:
      <GiftedChat
        messages={this.state.messages}
        onSend={this.onSend}
        onInputTextChanged={this.detectTyping}
        user={{
          _id: data.roomInfo.myRole, // sent messages should have same user._id
        }}
        renderBubble={this.renderBubble}
        renderFooter={this.renderFooter}
      />
    }
      {this.props.screenProps.openChatMenu ? <ChatMenu 
        turnOffChatMenu={this.props.screenProps.turnOffChatMenu}  
        toggleChatMenu={this.props.screenProps.toggleChatMenu}  
        chatComponent={this}
        />
        :null}
      {Platform.OS === 'android' ? <KeyboardSpacer /> : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  footerContainer: {
    marginTop: 5,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10,
    backgroundColor:'rgba(255, 255, 255, .4)',
    height:20
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'stretch', // or 'stretch'
    width: null,
    height: null,
    position:'absolute',
    top:0,
    bottom:0,
    left:0,
    right:0
  },  
});