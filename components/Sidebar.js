import React, { Component } from 'react';
import {Drawer} from 'native-base';
import { Icon } from 'react-native-elements';
import socket from '../services/socket';
import data from '../services/data';
import renderIf from '../services/renderIf';
import SideBarContent from './SideBarContent';

export default class SideBar extends Component {

    constructor(props) {
        super(props);
        this.state = {};
    
        this.openDrawer = this.openDrawer.bind(this);
        this.closeDrawer = this.closeDrawer.bind(this);
    }

    openDrawer() {
        this.drawer._root.open()
    }

    closeDrawer() {
      this.drawer._root.close()
    }

  render() {
    return (
      <Drawer 
        ref={(ref) => { this.drawer = ref; }}
        content={<SideBarContent parent={this.props} closeDrawer={this.closeDrawer} />}
        styles={{ leftDrawerWidth:50}}
        >
        {this.props.children}
      </Drawer>
    );
  }
}