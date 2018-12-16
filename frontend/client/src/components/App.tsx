import * as React from 'react';
import './App.css';

// import logo from '../logo.svg';
const logo = require("../logo.svg");

import AuthProvider from "./AuthProvider";

import Auth from "./Auth";

import Haberdasher from "./Haberdasher";
import HelloWorld from "./HelloWorld";

class App extends React.Component {
    public render() {
        return (
            <AuthProvider>
                <div className="App">
                    <header className="App-header">
                        <img src={logo} className="App-logo" alt="logo"/>
                        <h1 className="App-title">Welcome to React</h1>
                    </header>
                    <p className="App-intro">
                        To get started, edit <code>src/App.tsx</code> and save to reload.
                    </p>

                    <Auth/>

                    <div className="App-requests">
                        <HelloWorld/>
                        <Haberdasher/>
                    </div>
                </div>
            </AuthProvider>
        );
    }
}

export default App;
