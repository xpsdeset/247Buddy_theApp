import React, { Component } from 'react';
import { StyleSheet, WebView } from 'react-native';


// Needed for fix "Setting onMessage on a WebView overrides existing values of window.postMessage, but a previous value was defined."
const patchPostMessageFunction = function () {
    var originalPostMessage = window.postMessage;

    var patchedPostMessage = function (message, targetOrigin, transfer) {
        originalPostMessage(message, targetOrigin, transfer);
    };

    patchedPostMessage.toString = function () {
        return String(Object.hasOwnProperty).replace('hasOwnProperty', 'postMessage');
    };

    window.postMessage = patchedPostMessage;
};

const patchPostMessageJsCode = '(' + String(patchPostMessageFunction) + ')();';


export default class WebViewTest extends Component {

    constructor(props) {
        super(props);
    }
    onMessage(m) {
        console.log(m.nativeEvent.data);
    }

    render() {
        return (
            <WebView ref={(wv) => { this.webView = wv; }}
                    source={{ uri: 'http://192.168.0.101:8080/' }}
                    injectedJavaScript={patchPostMessageJsCode} 
                    onMessage={m => this.onMessage(m)}  
                    pointerEvents={"none"}
                    style={styles.webView}
                    />
        );
    }
}


const styles = StyleSheet.create({
    webView: {
        marginTop: 50
    }
});

