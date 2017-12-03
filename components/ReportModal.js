import React, { Component } from 'react';
import { Modal, Text, StyleSheet, Linking } from 'react-native';

import { Container, Content, Button } from 'native-base';
import { Item, Label, Input } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { Icon } from 'react-native-elements';

export default class ReportModal extends Component {

  render() {
    return (
      <Content contentContainerStyle={{ marginTop: 100, width: 250,marginLeft:50}}>
                  <Row style={{ flex: 1, flexWrap: 'wrap',flexDirection: 'row' }}>
                    <Text>
                      We're sorry about this.
                    </Text>
                  </Row>
                  <Row>
                    <Item stackedLabel  style={{ width: 250,marginTop:5 }}>
                      <Label>{"Why do you want to report this user?"}</Label>
                      <Input onChangeText={(text) => this.props.chatComponent.setState({ reportReason: text }) }/>
                    </Item>
                  </Row>
                  <Row>
                    <Col>
                      <Button info rounded style={{ width: 100, marginTop: 30, paddingLeft: 20 }} onPress={() => { this.props.chatComponent.setState({ openReport: false }) }}> 
                        <Text style={{ color: '#fff', textAlign: 'center' }}> Cancel </Text>
                      </Button>
                    </Col>
                    <Col>
                      <Button danger rounded style={{ width: 100, marginTop: 30, paddingLeft: 20 }} onPress={() => { this.props.chatComponent.reportChat()}}> 
                        <Text style={{ color: '#fff', textAlign: 'center' }}> Report </Text>
                      </Button>
                    </Col>
                  </Row>
              </Content>
    );
  }
}

const styles = StyleSheet.create({
 
  link: {
    color: 'blue',
    textDecorationLine:'underline',
    marginLeft:5

  }
});


// reportChat(visible) {
//   this.props.reportChat();
//   this.setState({ modalVisible: false });
//   socket.emit('report-incident', this.state.messages, "some static reason");
// }
