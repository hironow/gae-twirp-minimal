import * as fetch from 'isomorphic-fetch';
import * as React from 'react';

import {Hat, Size} from "../rpc/haberdasher/service_pb";
import {DefaultHaberdasher} from "../rpc/haberdasher/service";
import {TwirpError} from "../rpc/twirp";

import {AuthContext} from "./AuthProvider";
import {BACKEND_HOST_URL} from "../environment";

import "./Haberdasher.css";

const jwtDecode = require('jwt-decode');


interface IProps {
    isSignedIn: boolean,
    idToken: string,
    accessToken: string,
    checkRefreshAccessTokenPromise: () => Promise<{}>,
}

interface IState {
    result: object,
    error: object,
}

const getRandomInt = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1) + min);
};

class BaseHaberdasher extends React.Component<IProps, IState> {
    constructor(props: any) {
        super(props);
        this.state = {
            result: {},
            error: {},
        };
    }

    private fetchMakeHat() {
        const {checkRefreshAccessTokenPromise} = this.props;

        // fetch with check refresh token
        checkRefreshAccessTokenPromise().then((accessToken: string) => {
            // access tokenの更新があった場合を考慮
            const haberdasher = new DefaultHaberdasher(BACKEND_HOST_URL, fetch, accessToken);

            let size = new Size();
            size.setInches(getRandomInt(1, 1000));

            haberdasher.makeHat(size)
                .then((hat: Hat.AsObject) => {
                    console.log("Example makeHat response:\n");
                    console.log(hat);

                    this.setState({result: hat, error: {}});
                })
                .catch((err: TwirpError) => {
                    console.log("Example makeHat error:\n");
                    console.error(err);

                    this.setState({result: {}, error: err});

                    if (err.code === "permission_denied") {
                        alert("permission_denied, please retry!");
                    }
                });
        }).catch((err) => {
            // ここまで到達を確認
            console.warn("checkRefreshAccessTokenPromise.catch err: " + err);
            alert("checkRefreshAccessTokenPromise.carch err: " + err);
        });
    }

    private fetchMakeHat2() {
        const {checkRefreshAccessTokenPromise} = this.props;

        // fetch with check refresh token
        checkRefreshAccessTokenPromise().then((accessToken: string) => {
            // access tokenの更新があった場合を考慮
            const haberdasher = new DefaultHaberdasher(BACKEND_HOST_URL, fetch, accessToken);

            let size = new Size();
            size.setInches(-1);

            haberdasher.makeHat(size)
                .then((hat: Hat.AsObject) => {
                    console.log("Example makeHat response:\n");
                    console.log(hat);

                    this.setState({result: hat, error: {}});
                })
                .catch((err: TwirpError) => {
                    console.log("Example makeHat error:\n");
                    console.error(err);

                    this.setState({result: {}, error: err});

                    if (err.code === "permission_denied") {
                        alert("permission_denied, please retry!");
                    }
                });
        }).catch((err) => {
            // TODO: ここまで到達する？
            console.warn("checkRefreshAccessTokenPromise.catch err: " + err);
            alert("checkRefreshAccessTokenPromise.carch err: " + err);
        });
    }

    public render() {
        let {isSignedIn, idToken, accessToken} = this.props;
        const {result, error} = this.state;

        let decoded = "";
        if (accessToken !== "") {
            decoded = jwtDecode(accessToken);
        }

        let decoded2 = "";
        if (idToken !== "") {
            decoded2 = jwtDecode(idToken);
        }

        // debug
        // isSignedIn = true;

        return (
            <div className="Haberdasher">
                <strong>Haberdasher</strong>
                {isSignedIn ? (
                    <div>
                        <button onClick={() => this.fetchMakeHat()}>Request (random)</button>
                        <button onClick={() => this.fetchMakeHat2()}>Request (-1)</button>

                        <p>result</p>
                        <pre>{JSON.stringify(result, null, 2)}</pre>
                        <p>error</p>
                        <pre>{JSON.stringify(error, null, 2)}</pre>

                        <p>SignedIn: {isSignedIn ? "true" : "false"}</p>
                        <p>Access Token: <code>{accessToken}</code></p>
                        <pre>{JSON.stringify(decoded, null, 2)}</pre>

                        <p>ID Token: <code>{idToken}</code></p>
                        <pre>{JSON.stringify(decoded2, null, 2)}</pre>
                    </div>
                ) : (
                    <div>
                        <p>need login</p>
                    </div>
                )}
            </div>
        );
    }
}

const Haberdasher = () => (
    <AuthContext.Consumer>
        {({isSignedIn, idToken, accessToken, checkRefreshAccessTokenPromise}) =>
            <BaseHaberdasher isSignedIn={isSignedIn} idToken={idToken} accessToken={accessToken}
                             checkRefreshAccessTokenPromise={checkRefreshAccessTokenPromise}/>
        }
    </AuthContext.Consumer>
);

export default Haberdasher;