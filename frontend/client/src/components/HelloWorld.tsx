import * as fetch from 'isomorphic-fetch';
import * as React from 'react';

import {HelloReq, HelloResp} from "../rpc/helloworld/service_pb";
import {DefaultHelloWorld} from "../rpc/helloworld/service";
import {TwirpError} from "../rpc/twirp";
import {BACKEND_HOST_URL} from "../environment";

import "./HelloWorld.css";


interface IState {
    result: object,
    error: object,
}

class HelloWorld extends React.Component<{}, IState> {
    constructor(props: any) {
        super(props);
        this.state = {
            result: {},
            error: {},
        };
    }

    private fetch() {
        const helloWorld = new DefaultHelloWorld(BACKEND_HOST_URL, fetch, "");

        let req = new HelloReq();
        req.setSubject("dummy user");

        helloWorld.hello(req)
            .then((resp: HelloResp.AsObject) => {
                console.log("Example hello response:\n");
                console.log(resp);

                this.setState({result: resp, error: {}});
            })
            .catch((err: TwirpError) => {
                console.log("Example hello error:\n");
                console.error(err);

                this.setState({result: {}, error: err});

                if (err.code === "permission_denied") {
                    alert("permission_denied, please retry!");
                }
            });
    }

    public render() {
        const {result, error} = this.state;

        return (
            <div className="HelloWorld">
                <strong>HelloWorld (NoAuth)</strong>
                <div>
                    <button onClick={() => this.fetch()}>Request</button>

                    <p>result</p>
                    <pre>{JSON.stringify(result, null, 2)}</pre>
                    <p>error</p>
                    <pre>{JSON.stringify(error, null, 2)}</pre>

                </div>
            </div>
        );
    }
}

export default HelloWorld;