import React, { Component } from 'react';
import {Container,Content,List, ListItem, Text, Icon, Left, Body, Right, Switch } from 'native-base';
export default class ListIconExample extends Component {
  render() {
    return (
        <Container style={{backgroundColor:'#fff'}} >
        <Content>
          <List>
             <ListItem>
              <Body>
                <Text>Notify me if there are unattended venters on hold</Text>
              </Body>
              <Right>
                <Switch value={false} />
              </Right>
            </ListItem>
          </List>
        </Content>
      </Container>
    );
  }
}