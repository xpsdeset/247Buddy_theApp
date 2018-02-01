import React from 'react';
import { Platform, StyleSheet, View, Text, AsyncStorage } from 'react-native';
import { AppLoading, Asset, Font } from 'expo';
import { Ionicons } from '@expo/vector-icons';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Tos from './components/Tos';
import AccountKit from './components/AccountKit';
import ReportModal from './components/ReportModal';
import  SelectionScreen  from './screens/SelectionScreen';
import ChatScreen  from './screens/ChatScreen';
import SettingsScreen  from './screens/SettingsScreen';
import StatusBar from './components/StatusBar';
import { Root,Content } from "native-base";
import { StackNavigator } from "react-navigation";
import socket from './services/socket';
import data from './services/data';
import { NavigationActions } from 'react-navigation';


console.disableYellowBox = true;

const AppNavigator = StackNavigator(
  {
    Selection: { 
      screen: SelectionScreen, 
      navigationOptions: ({ navigation, screenProps }) => ({
        header: <Header openMainMenu={screenProps.openMainMenu} />
      }),
    },
    Chat: { 
      screen: ChatScreen, 
      navigationOptions: ({ navigation, screenProps }) => ({
        header: <Header openMainMenu={screenProps.openMainMenu} toggleChatMenu={screenProps.toggleChatMenu} openChatMenu={screenProps.openChatMenu}/>
      }),

    },
    Settings: { 
      screen: SettingsScreen,
      navigationOptions: ({ navigation, screenProps }) => ({
        headerTitle: 'Settings'
      }),

    },
  },
  {
    initialRouteName:'Selection',
    navigationOptions: {
      gesturesEnabled: false
    }
  }
);



export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          openChatMenu: false,
          verifyed: false,
          openGlass:true,
          banned:false
        };

        var self=this;

        AsyncStorage.getItem('247Buddy.user_id').then(data => {
          if(data)
            self.setState({ verifyed: true });
        }) 

        
        socket.on('bannedUser', data => {
          self.setState({
            banned: true
          })

        });

        
        
        this.navigateTo = this.navigateTo.bind(this);
        this.toggleChatMenu = this.toggleChatMenu.bind(this);
        this.turnOffChatMenu = this.turnOffChatMenu.bind(this);
        this.openMainMenu = this.openMainMenu.bind(this);
        this.toggleGlass = this.toggleGlass.bind(this);
        this.verifyed = this.verifyed.bind(this);

    }

  componentDidMount() {
  }

  navigateTo(routeName){
    return this.navigator.dispatch(NavigationActions.navigate({ routeName }))
  }
 
  openMainMenu() {
    this.sideBar.openDrawer()
  }
 
  verifyed(data) {
    this.setState({verifyed:true})
    AsyncStorage.setItem('247Buddy.user_id', data.user_id+"")
  }

  toggleGlass(openGlass) {
    this.setState({ openGlass })
  }


    toggleChatMenu(openChatMenu) {
      this.setState({ openChatMenu})
    }

    turnOffChatMenu(reason) {
      if (reason && reason.blocked){
        socket.emit('block-user');
      }
      this.setState({
        openChatMenu: false
      })
      data.ChatScreenState = {};
      data.SelectionScreenState = {};
      this.StatusBar.turnOffOldMessage();
      this.navigateTo('Selection')
      
    }

  render() {
    if (!this.state.isLoadingComplete && !this.props.skipLoadingScreen) {
      return (
        <AppLoading
          startAsync={this._loadResourcesAsync}
          onError={this._handleLoadingError}
          onFinish={this._handleFinishLoading}
        />
      );
    } else {
      return (
       <Root>
         <StatusBar ref={(ref) => this.StatusBar = ref} toggleGlass={this.toggleGlass}/>
         {!this.state.verifyed?
          <AccountKit verifyed={this.verifyed} />:
          <View style={{ flex: 1}} >
          <Sidebar openMainMenu={this.state.openMainMenu} navigateTo={this.navigateTo} ref={(ref) => this.sideBar = ref} >
            <Tos/>
            {!this.state.openGlass ? null:
            <View style={styles.glass} >
              <Text style={styles.msg}>
                If it takes longer for you to connect.{"\n"} 
                Maybe your network is down or our server are not reachable.{"\n"} 
                You can report a bug to help us serve you better.{"\n"} 
                Feel free to find your buddy from our website 247Buddy.net.
                </Text>
            </View>}
            {this.state.banned?null: 
            <AppNavigator ref={navigatorRef => this.navigator = navigatorRef} 
            screenProps={{ 
              openMainMenu: this.openMainMenu, 
              toggleChatMenu: this.toggleChatMenu,
              openChatMenu: this.state.openChatMenu,
              turnOffChatMenu: this.turnOffChatMenu
              }}/>
            }  
          </Sidebar>
          </View>
          }
      </Root>
      );
    }
  }

  _loadResourcesAsync = async () => {
    return Promise.all([
      Asset.loadAsync([
        require('./assets/images/icon-listener.png'),
        require('./assets/images/icon-teller.png')
      ]),
      Font.loadAsync(
        // This is the font that we are using for our tab bar
        // We include SpaceMono because we use it in HomeScreen.js. Feel free
        // to remove this if you are not using it in your app
        { 
          ...Ionicons.font,
          'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),
          Roboto: require("native-base/Fonts/Roboto.ttf"),
          Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf"),
          Ionicons: require("@expo/vector-icons/fonts/Ionicons.ttf") 
        },
        
      ),
    ]);
  };

  _handleLoadingError = error => {
    // In this case, you might want to report the error to your error
    // reporting service, for example Sentry
    console.warn(error);
  };

  _handleFinishLoading = () => {
    this.setState({ isLoadingComplete: true });
  };
}


const styles = StyleSheet.create({
    msg:{
      fontSize:12
    },
    glass: {
    flex: 1,
    position:'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex:5,
    top:0,
    bottom:0,
    left:0,
    right:0,
    paddingTop:350,
    backgroundColor:'#fff',
    opacity:0.7
  }});
