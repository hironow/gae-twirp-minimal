import * as React from 'react';
import {auth, authUI, uiConfig} from "../firebase";
import {AuthContext} from "./AuthProvider";

interface IProps {
    isSignedIn: boolean,
}

class BaseAuth extends React.Component<IProps> {
    authContainer = React.createRef<HTMLDivElement>();

    componentDidMount() {
        const {isSignedIn} = this.props;
        if (!isSignedIn) {
            this.showAuthUI();
        }
    }

    componentWillUnmount() {
        authUI.reset();
    }

    private showAuthUI() {
        const node = this.authContainer.current;
        if (node) {
            authUI.start(node, uiConfig);
        }
    }

    private signOut() {
        auth.signOut().then(() => {
            console.log("Sign out successful");

            // re-login form
            this.showAuthUI();

        }, (err) => {
            console.error("signOut() err: ", err);
        });
    }

    public render() {
        const {isSignedIn} = this.props;
        status = "";
        if (isSignedIn) {
            status = "You are Sign in";
        } else {
            status = "Please Sign in";
        }

        return (
            <div>
                <p>{status}</p>

                {/* this block use all time. */}
                <div ref={this.authContainer}/>

                {isSignedIn && <button onClick={() => this.signOut()}>sign out</button>}
            </div>
        );
    }
}

const Auth = () => (
    <AuthContext.Consumer>
        {({isSignedIn}) =>
            <BaseAuth isSignedIn={isSignedIn}/>
        }
    </AuthContext.Consumer>
);

export default Auth;