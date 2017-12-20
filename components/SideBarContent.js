import React, { Component } from 'react';
import { Image, StyleSheet, Text, Linking } from 'react-native';
import { Icon } from 'react-native-elements';
import { Content, List, ListItem, Button  } from 'native-base';
export default class SideBarContent extends Component {

  constructor(props) {
    super(props);
    this.state = {};

  }

  
  render() {
    var self=this;
    return (
      <Content style={{ backgroundColor: '#fff', padding: 20, paddingTop: 50}}>
        <Button iconLeft small transparent onPress={this.props.closeDrawer} style={{position:'absolute',right:5,top:-5 }}>
            <Icon name='close' />
        </Button>
        <Image source={require('../assets/images/logo.png')} style={styles.logo} />
        <List style={styles.submenu}>
          {/* <ListItem onPress={() => 
            {
              self.props.parent.toggleMainMenu(false)
              self.props.parent.navigateTo('Settings')
            }} >
            <Text>Settings</Text>
          </ListItem> */}
          <ListItem onPress={() => Linking.openURL('https://247buddy.net/tos')}>
            <Text> Terms </Text>
          </ListItem>
          <ListItem onPress={() => Linking.openURL('https://247buddy.net/faq')}>
            <Text> Faq </Text>
          </ListItem>
          <ListItem onPress={() => Linking.openURL('https://247buddy.net/privacy-policy')}>
            <Text> Privacy Policy </Text>
          </ListItem>
          <ListItem onPress={() => Linking.openURL('https://247buddy.net/')}>
            <Text>About us</Text>
          </ListItem>
          <ListItem onPress={() => Linking.openURL('https://www.reddit.com/r/247buddy/')}>
            <Text>Report a bug</Text>
          </ListItem>
        </List>
      </Content>
    );
  }
}



const styles = StyleSheet.create({
  submenu:{
    marginTop: 50,
  },
  logo: {
    width: 105,
    height: 120,
  }
});
