import React, { Component } from 'react';
import {Button, Row,Content,Text,Input,Item,Label} from 'native-base';
import { Icon } from 'react-native-elements';
import { Alert, View, StyleSheet,Modal } from 'react-native';
import socket from '../services/socket';
import data from '../services/data';
import renderIf from '../services/renderIf';

export default class ChatMenu extends Component {

  constructor(props) {
    super(props);
    this.state = { reportModalVisible:true };
    this.newChat = this.newChat.bind(this);
    this.openReport = this.openReport.bind(this);
  }

  newChat(){
    Alert.alert(
      '247Buddy',
      'Are you sure you want leave this conversation?',
      [
        { text: 'No' },
        { text: 'Yes', onPress: (() => {
          this.props.turnOffChatMenu()
        }).bind(this)}
      ]
    )
  }
  openReport(){
    this.props.toggleChatMenu(false)
    this.props.chatComponent.setState({ openReport: true })

  }
  
  render() {
    return (
      <View style={{ flex: 1, marginTop: 75, marginRight: 5, padding: 7, backgroundColor: '#eaedf2', position: 'absolute', right: 1, borderColor: '#e5e3e0', borderWidth: 0.5, borderRadius:10 }}>
        <Button iconLeft small rounded onPress={this.newChat} style={styles.button}>
            <Icon name='add' style={styles.icon} color="white" />
          </Button>
          <Button iconLeft small danger rounded style={styles.button} onPress={this.openReport}>
            <Icon name='user-times' style={styles.icon} type="font-awesome" color="#fff" />
          </Button>
              {/* {renderIf(
                data.roomInfo && data.roomInfo.myRole == 'venter',
                <Button iconLeft small warning rounded style={styles.button}>
                  <Icon name='delete' style={styles.icon} color="white" />
                </Button>
              )}
               */}
      </View>
    );
  }
}



const styles = StyleSheet.create({
  button: {
    width: 35,
    marginBottom:5
  },
  icon: {
    marginLeft:5
  }

});


