import React from 'react';
import './App.css';

import * as Mam from 'mam.client.js';
import * as IOTA from 'iota.lib.js';
const Curl = require('curl.lib.js');

class App extends React.Component {

    publishMamMessage() {

        var iota = new IOTA({
            host: 'https://node02.iotatoken.nl',
            port: 443
        });

        Curl.init();
        Curl.overrideAttachToTangle(iota);

        const state = Mam.init(iota);
        const message = Mam.create(state, 'FOO9BAR9MESSAGE');

        console.log('publishing message to tangle, please hold');
        console.log('local PoW may take a while');

        Mam.attach(message.payload, message.address);
    }

    render() {
        return (
            <div>
                <h1>MAM publish example</h1>
                <button onClick={this.publishMamMessage}>Go!</button>
            </div>
        );

    }
}
export default App;
