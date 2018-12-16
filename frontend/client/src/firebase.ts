import * as firebase from 'firebase/app';
import 'firebase/auth';

import * as firebaseui from 'firebaseui';
import 'firebaseui/dist/firebaseui.css';

import config from './config';


const uiConfig = {
    callbacks: {
        signInSuccessWithAuthResult: () => false, // Do not redirect.
    },
    signInFlow: 'popup',
    signInSuccessUrl: '/',
    signInOptions: [
        // Leave the lines as is for the providers you want to offer your users.
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        // firebase.auth.FacebookAuthProvider.PROVIDER_ID,
        // firebase.auth.TwitterAuthProvider.PROVIDER_ID,
        // firebase.auth.GithubAuthProvider.PROVIDER_ID,
        firebase.auth.EmailAuthProvider.PROVIDER_ID
    ],
    // Terms of service url
    // tosUrl: 'https://www.google.com',
    // Privacy policy url.
    // privacyPolicyUrl: 'https://www.google.com',
};

if (!firebase.apps.length) {
    firebase.initializeApp(config);
}

const auth = firebase.auth();
const authUI = firebaseui.auth.AuthUI.getInstance()
    || new firebaseui.auth.AuthUI(auth);

export {
    auth,
    authUI,
    uiConfig,
};