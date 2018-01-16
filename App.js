import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { AppLoading, Asset, Font } from 'expo';
import { Ionicons } from '@expo/vector-icons';
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import Tos from './components/Tos'
import ReportModal from './components/ReportModal'
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
          banned:false
        };

        
        socket.on('bannedUser', data => {
          self.setState({
            banned: true
          })

        });

        
        
        this.navigateTo = this.navigateTo.bind(this);
        this.toggleChatMenu = this.toggleChatMenu.bind(this);
        this.turnOffChatMenu = this.turnOffChatMenu.bind(this);
        this.openMainMenu = this.openMainMenu.bind(this);

    }

  componentDidMount() {
  }

  navigateTo(routeName){
    return this.navigator.dispatch(NavigationActions.navigate({ routeName }))
  }
 
  openMainMenu() {
    this.sideBar.openDrawer()
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
          <StatusBar ref={(ref) => this.StatusBar = ref}/>
          <Sidebar openMainMenu={this.state.openMainMenu} navigateTo={this.navigateTo} ref={(ref) => this.sideBar = ref} >
            <Tos/>
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
