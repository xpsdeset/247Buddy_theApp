import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import { Button } from 'react-native-elements';
import { WebBrowser } from 'expo';
import { Bubbles   } from 'react-native-loader';

import socket from '../services/socket';
import renderIf from '../services/renderIf';
import data from '../services/data';  
import NotifyUnattendedVentors from '../components/NotifyUnattendedVentors';  





export default class SelectionScreen extends React.Component {


    constructor(props) {
        super(props);
        this.state = Object.assign({ 
          header: '', 
          status: 'not-paired'
        },
        data.SelectionScreenState);


        var self=this;
        data.currentState='Selection';

        data.myRole = null;

        socket.emit('cleanup');
        

          socket.on('global-info', globalInfo => {
              var header= '';
              if(globalInfo.conversationCount)
                header =`Conversations: ${globalInfo.conversationCount}`;
              
              var waitCount=globalInfo.listenerCount - globalInfo.venterCount;
              var subHeaders= '';


              if(waitCount==0)  
                subHeaders=``
              if(waitCount>=1)  
                subHeaders = `Waiting: ${waitCount} listeners`
              if(waitCount<=-1)  
                subHeaders = `Waiting: ${waitCount * -1} venters`


                this.setState({header:header,subHeaders:subHeaders})
                data.SelectionScreenState=this.state;
          })

            socket.on('room-info', info => {
                info.myRole=this.state.myRole;
                data.roomInfo=info;
                socket.off('global-info');
                data.currentState='Chat';
                if (info.connectionType != 'reconnect')
                this.props.navigation.navigate('Chat');
            });
      

    }

  findPair(role){
    this.setState({
      status:'finding-pair',
      myRole:role
    })
    data.myRole = role;
    socket.emit('find-pair', role);
  }

  render() {
    return (
      <View style={{flex: 1}} >
      <Image source={require('../assets/images/blue_bg.png')} style={styles.backgroundImage}/>
      <View style={styles.homeContainer}>
        <View style={styles.subHeaders}>
        <Text h3>{this.state.header} </Text>
        {renderIf(this.state.status != 'finding-pair',
        <Text h4>{this.state.subHeaders}</Text>
        )}
        </View>
        {renderIf(this.state.status == 'not-paired',
        <View style={styles.listenerContainer}>
            <Image source={require('../assets/images/icon-listener.png')} style={styles.selectIcon}/>
            <Button raised
            buttonStyle={{backgroundColor: '#194fb0', borderRadius: 10}} textStyle={{textAlign: 'center'}}
            title={`Listen to \n someone`}
            onPress={()=>{
              this.findPair('listener')
            }}
          />
        </View>
        )}
        {renderIf(this.state.status == 'not-paired',
          <View style={styles.venterContainer}>
          <Image source={require('../assets/images/icon-teller.png')} style={styles.selectIcon}/>
          <Button raised
            buttonStyle={{backgroundColor: '#194fb0', borderRadius: 10}} textStyle={{textAlign: 'center'}}
            title={`Express \n yourself`}
            onPress={()=>{
              this.findPair('venter')
            }}
          />
        </View>

        )}
        {renderIf(this.state.status == 'finding-pair',
          <View style={{flex:1,flexDirection:'column',alignItems: 'center' }}>
              <Text h4>Please wait while we find your buddy.. </Text>
              <Bubbles size={15} color="#3bdbb1" />
          </View>
        )}
      </View>
      <View style={styles.bottomCheckbox} >
        <NotifyUnattendedVentors  />
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
    height:250,
    top: 100,
    left: 20,
    right: 20,
    backgroundColor: '#fff',
    borderWidth: 0.5,
    zIndex:2
  },
  subHeaders:{
    position: 'absolute',
    top:20,
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
  listenerContainer:{
    marginTop:20,
    marginRight:20
  },
  venterContainer:{
    marginTop:20,
    marginLeft:20
  },
  selectIcon:{
    width: 100,
    height: 80,
    resizeMode: 'contain',
    marginBottom:2
  },
  helpLinkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
  bottomCheckbox:{
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 75,
    height: 50,
    left: 20,
    right: 20,
    backgroundColor: '#fff',
    padding: 3,
    borderWidth: 0.5
  }

});
