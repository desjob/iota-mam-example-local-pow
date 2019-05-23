import React from 'react';
import './App.css';

import * as Converter from '@iota/converter';
import * as Mam from '@iota/mam';
import curlTransaction from 'curl-transaction-core';
import curlImpl from 'curl-transaction-webgl2-impl';



const curl = curlTransaction({ curlImpl });
const localAttachToTangle = async function(trunkTransaction, branchTransaction, minWeightMagnitude, trytesArray) {

    var trytes = await curl.curl({ trunkTransaction, branchTransaction, minWeightMagnitude, trytesArray }).then((processedTrytes) => {
        return processedTrytes
    }).catch((error) => {
        throw error;
    });

    return trytes;
};


class App extends React.Component {

    constructor() {

        super();

        this.state = {
            status: 'ready',
            status2: 'ready',
            root: '',
            message: 'test 1234'
        }
    }


    publishMamMessage() {

        this.setState({status: 'working'});

        const mamConfig = {
            provider: "https://nodes.devnet.iota.org:443",
            attachToTangle: localAttachToTangle
        };

        const mamState = Mam.init(mamConfig);
        const message = Mam.create(mamState, Converter.asciiToTrytes(this.state.message));

        Mam.attach(message.payload, message.address, 3, 9)
            .then(res => this.messageIsPublished(res, message))
            .catch(err => console.log(err));

    }

    messageIsPublished(bundle, message) {

        this.setState({status: JSON.stringify(bundle), root: message.root});
    }

    receiveMessage() {

        this.setState({status2: 'working'});

        const mamConfig = {
            provider: "https://nodes.devnet.iota.org:443",
            attachToTangle: localAttachToTangle
        };

        const mamState = Mam.init(mamConfig);

        Mam.fetch(this.state.root, 'public')
            .then(res => this.setState({status2: 'recieved: ' + Converter.trytesToAscii(res.messages[0])}))
            .catch(err => console.log(err));

    }

    setRoot(root) {

        this.setState({root: root});
    }

    setMessage(message) {

        this.setState({message: message});
    }

    render() {
        return (
            <div>
                <h1>IOTA Masked Authenticated Messaging example (using local WebGL PoW)</h1>
                <input type="text" onChange={this.setMessage.bind(this)} value={this.state.message}/>
                <button onClick={this.publishMamMessage.bind(this)}>Publish!</button>
                <p>status: <br/>{this.state.status}</p>

                <hr/>
                <input type="text" onChange={this.setRoot.bind(this)} value={this.state.root}/>
                <button onClick={this.receiveMessage.bind(this)}>Receive!</button>
                <p>status: <br/>{this.state.status2}</p>
            </div>
        );

    }
}

export default App;
