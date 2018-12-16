import * as fetch from 'isomorphic-fetch';
import * as React from 'react';
import {auth} from "../firebase";
import {BACKEND_HOST_URL} from "../environment";
import {addMinutes, getUnixTime} from 'date-fns'

import {LoginRequest, LoginResponse} from "../rpc/session/service_pb";
import {DefaultSession} from "../rpc/session/service";
import {TwirpError} from "../rpc/twirp";

const jwtDecode = require('jwt-decode');

const ID_TOKEN_KEY = "id_token";
const ACCESS_TOKEN_KEY = "access_token";
const ID_TOKEN_REFRESH_LIMIT_MINUTES = 40; // 期限切れ40分前で更新する
const ACCESS_TOKEN_REFRESH_LIMIT_MINUTES = 5; // 期限切れ5分前で更新する

const defaultContext = {
    authStatusReported: false,
    isSignedIn: false,
    idToken: "",
    accessToken: "",
    checkRefreshIDTokenPromise: () => new Promise(() => ""),
    checkRefreshAccessTokenPromise: () => new Promise(() => ""),
};

export const AuthContext = React.createContext(defaultContext);

interface IProps {
    children: any,
}

interface IState {
    authStatusReported: boolean,
    isSignedIn: boolean,
    idToken: string,
    idTokenExp: number,
    accessToken: string,
    accessTokenExp: number,
}


export default class AuthProvider extends React.Component<IProps, IState> {
    constructor(props: any) {
        super(props);
        this.state = {
            authStatusReported: false,
            isSignedIn: false,
            idToken: "",
            idTokenExp: 0,
            accessToken: "",
            accessTokenExp: 0,
        };
    }

    componentDidMount() {
        console.log("AuthProvider componentDidMount");

        auth.onAuthStateChanged((user) => {
            if (user) {
                // login, get id_token, then get access token.
                const idToken = this.getIDToken();
                const accessToken = this.getAccessToken();
                const accessTokenExp = this.getTokenExp(accessToken);

                // // check refresh token only IDToken
                // const idTokenExp = this.getTokenExp(idToken);
                // if (this.needsIDTokenRefresh(idTokenExp)) {
                //     // get or refresh IDToken
                //     console.log("IDToken 新規 or 期限切れまで残り少ないので、更新します");
                //
                //     this.fetchIDToken()
                //         .then((newIDToken: string) => {
                //             console.log("fetchIDToken.then idToken: " + newIDToken);
                //             this.setState({
                //                 authStatusReported: true, isSignedIn: true,
                //                 idToken: newIDToken, idTokenExp: this.getTokenExp(newIDToken),
                //             });
                //         })
                //         .catch((err: Error) => {
                //             // get IDToken failed
                //             console.log("fetchIDToken.catch err: " + err);
                //             this.setState({
                //                 authStatusReported: true, isSignedIn: false,
                //                 idToken: "", idTokenExp: 0,
                //             });
                //         })
                // } else {
                //     // localStorage IDToken available
                //     console.log("IDToken まだ期限切れまで時間があります");
                //
                //     this.setState({
                //         authStatusReported: true, isSignedIn: true,
                //         idToken: idToken, idTokenExp: idTokenExp,
                //     });
                // }

                // TODO: getIDTokenが内部でRefresh機構をもっているので
                // getIDToken(this.needsIDTokenRefresh(idTokenExp)); ができる
                // 意味は、期限切れ間近なら強制更新
                // つまり、localStorageに保存するのは期限切れ日時だけでいい
                // アクセストークンいる？

                // check refresh token
                if (this.needsAccessTokenRefresh(accessTokenExp)) {
                    // get or refresh AccessToken
                    console.log("AccessToken 新規 or 期限切れまで残り少ないので、更新します");

                    this.fetchAccessToken(idToken)
                        .then((newAccessToken: string) => {
                            // console.log("fetchAccessToken.then accessToken: " + newAccessToken);
                            this.setState({
                                authStatusReported: true, isSignedIn: true,
                                accessToken: newAccessToken, accessTokenExp: this.getTokenExp(newAccessToken),
                            });
                        })
                        .catch((err: Error) => {
                            // get IDToken or AccessToken failed
                            // console.log("fetchAccessToken.catch err: " + err);
                            this.setState({
                                authStatusReported: true, isSignedIn: false,
                                accessToken: "", accessTokenExp: 0,
                            });
                        })
                } else {
                    // localStorage AccessToken available
                    console.log("AccessToken まだ期限切れまで時間があります");

                    this.setState({
                        authStatusReported: true, isSignedIn: true,
                        idToken: idToken, idTokenExp: this.getTokenExp(idToken),
                        accessToken: accessToken, accessTokenExp: accessTokenExp
                    });
                }

            } else {
                // not login, should go to login page
                localStorage.removeItem(ID_TOKEN_KEY);
                localStorage.removeItem(ACCESS_TOKEN_KEY);

                this.setState({
                    authStatusReported: true, isSignedIn: false,
                    idToken: "", idTokenExp: 0,
                    accessToken: "", accessTokenExp: 0
                });
            }
        });
    }

    private getIDToken(): string {
        const idToken = localStorage.getItem(ID_TOKEN_KEY)
        // console.log("localStorage idToken: " + idToken);
        return idToken;
    }

    private getAccessToken(): string {
        const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
        // console.log("localStorage accessToken: " + accessToken);
        return accessToken;
    }

    // getTokenExp 都度decodeするのを避ける
    private getTokenExp(token: string): number {
        let exp = 0;
        if (token && token !== "") {
            // TODO: try-except
            const decoded = jwtDecode(token);
            exp = decoded["exp"];
        }
        return exp;
    }

    // needsIDTokenRefresh IDTokenの期限切れチェック (RefreshTokenのように使われる)
    private needsIDTokenRefresh(idTokenExp: number): boolean {
        if (idTokenExp !== 0) {
            const checkDate = getUnixTime(addMinutes(new Date(), ID_TOKEN_REFRESH_LIMIT_MINUTES));
            if (checkDate < idTokenExp) {
                // localStorage IDToken available
                return false;
            }
        }
        // no token or close to expire token, should refresh token
        return true;
    }

    // needsAccessTokenRefresh AccessTokenの期限切れチェック
    private needsAccessTokenRefresh(accessTokenExp: number): boolean {
        if (accessTokenExp !== 0) {
            const checkDate = getUnixTime(addMinutes(new Date(), ACCESS_TOKEN_REFRESH_LIMIT_MINUTES));
            if (checkDate < accessTokenExp) {
                // localStorage AccessToken available
                return false;
            }
        }
        // no token or close to expire token, should refresh token
        return true;
    }

    private fetchIDToken(): Promise<string | Error> {
        console.warn("fetchIDToken start");

        if (!auth.currentUser) {
            return Promise.reject(new Error("currentUser is empty"));
        }

        // TODO: refact
        //  const idTokenExp = this.getTokenExp(idToken);
        //  auth.currentUser.getIdToken(this.needsIDTokenRefresh(idTokenExp))
        return auth.currentUser.getIdToken(true)
            .then((idToken: string) => {
                console.log("getIdToken.then idToken: " + idToken);

                localStorage.setItem(ID_TOKEN_KEY, idToken);
                return Promise.resolve(idToken);
            })
            .catch((err: Error) => {
                // get IDToken failed
                console.error("getIdToken.catch err: ", err);
                return Promise.reject(err); // do not stop reject
            });
    }

    // fetchAccessToken 有効なID Tokenから有効なAccess Tokenを取得する
    private fetchAccessToken(idToken: string): Promise<string | Error> {
        console.warn("fetchAccessToken start");

        const idTokenExp = this.getTokenExp(idToken);

        const checkRefreshIDTokenPromise = new Promise((resolve, reject) => {
            if (this.needsIDTokenRefresh(idTokenExp)) {
                // get or refresh IDToken
                console.log("IDToken 新規 or 期限切れまで残り少ないので、更新します");

                // not return
                this.fetchIDToken()
                    .then((newIDToken: string) => {
                        // get or refresh IDToken
                        // console.warn("fetchIDToken.then idToken: " + newIDToken);
                        // update state
                        this.setState({
                            idToken: newIDToken, idTokenExp: this.getTokenExp(newIDToken),
                        });
                        resolve(newIDToken);
                    })
                    .catch((err: string) => {
                        // get IDToken failed
                        console.warn("fetchIDToken.catch err: " + err);
                        this.setState({
                            idToken: "", idTokenExp: 0,
                        });
                        reject(err)
                    });
            } else {
                // localStorage IDToken available
                console.log("IDToken まだ期限切れまで時間があります");
                // update state
                this.setState({
                    idToken: idToken, idTokenExp: idTokenExp,
                });
                resolve(idToken);
            }
        });

        return checkRefreshIDTokenPromise
            .then((idToken: string) => {
                const session = new DefaultSession(BACKEND_HOST_URL, fetch, idToken);

                return session.login(new LoginRequest())
                    .then((resp: LoginResponse.AsObject) => {
                        // console.log("Auth response:\n");
                        // console.log(resp);

                        const {token: accessToken} = resp;
                        // console.log("fetch.then accessToken: " + accessToken);

                        localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
                        return Promise.resolve(accessToken);
                    })
                    .catch((err: TwirpError) => {
                        // get AccessToken failed
                        console.error('fetch.catch err: ', err);
                        return Promise.reject(err); // do not stop reject
                    });

                // return fetch(BACKEND_HOST_URL + '/auth', {
                //     method: 'POST',
                //     headers: {
                //         'Content-Type': 'application/json'
                //     },
                //     body: JSON.stringify({
                //         id_token: idToken,
                //     }),
                // })
                //     .then((response) => {
                //         if (response.status >= 400) {
                //             // do not throw
                //             return Promise.reject(new Error("Bad response from server"));
                //         }
                //         return response.json();
                //     })
                //     .then((json) => {
                //         const {token: accessToken} = json;
                //
                //         // console.log("fetch.then accessToken: " + accessToken);
                //
                //         localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
                //         return Promise.resolve(accessToken);
                //     })
                //     .catch((err: Error) => {
                //         // get AccessToken failed
                //         console.error('fetch.catch err: ', err);
                //         return Promise.reject(err); // do not stop reject
                //     })
            })
            .catch((err: Error) => {
                // get IDToken failed、TODO: ここのcatchでAccessToken failedを受け取ってしまう？
                console.error('checkRefreshIDTokenPromise.catch err: ', err);
                return Promise.reject(err); // do not stop reject
            })
    }

    public render() {
        const {authStatusReported, isSignedIn, idToken, idTokenExp, accessToken, accessTokenExp} = this.state;

        const checkRefreshIDTokenPromise = () => {
            console.warn("provider checkRefreshIDTokenPromise start");

            return new Promise((resolve, reject) => {
                if (this.needsIDTokenRefresh(idTokenExp)) {
                    // get or refresh IDToken
                    console.log("IDToken 新規 or 期限切れまで残り少ないので、更新します");

                    // not return
                    this.fetchIDToken()
                        .then((newIDToken: string) => {
                            // get or refresh IDToken
                            // console.warn("fetchIDToken.then idToken: " + newIDToken);
                            // update state
                            this.setState({
                                idToken: newIDToken, idTokenExp: this.getTokenExp(newIDToken),
                            });
                            resolve(newIDToken);
                        })
                        .catch((err: Error) => {
                            // get IDToken failed, 再ログイン要求
                            console.warn("fetchIDToken.catch err: " + err);
                            this.setState({
                                idToken: "", idTokenExp: 0,
                            });
                            reject(err)

                            // TODO: ここで再ログイン要求用state追加？
                        });
                } else {
                    // localStorage IDToken available
                    console.log("IDToken まだ期限切れまで時間があります");
                    // not update state
                    resolve(idToken);
                }
            });
        };

        const checkRefreshAccessTokenPromise = () => {
            console.warn("provider checkRefreshAccessTokenPromise start");

            return new Promise((resolve, reject) => {
                if (this.needsAccessTokenRefresh(accessTokenExp)) {
                    // get or refresh AccessToken
                    console.log("AccessToken 新規 or 期限切れまで残り少ないので、更新します");

                    // not return
                    this.fetchAccessToken(idToken)
                        .then((newAccessToken: string) => {
                            // get or refresh AccessToken、TODO: ここに入ってはいけない文字が入る
                            // console.warn("fetchAccessToken.then accessToken: " + newAccessToken);
                            // update state
                            this.setState({
                                accessToken: newAccessToken, accessTokenExp: this.getTokenExp(newAccessToken),
                            });
                            resolve(newAccessToken);
                        })
                        .catch((err: Error) => {
                            // get AccessToken failed, ID Tokenがだめなら再ログイン要求
                            console.log("fetchAccessToken.catch err: " + err);
                            this.setState({
                                accessToken: "", accessTokenExp: 0,
                            });
                            reject(err)

                            // TODO: ここで再ログイン要求用state追加？
                        })
                } else {
                    // localStorage AccessToken available
                    console.log("AccessToken まだ期限切れまで時間があります");
                    // not update state
                    resolve(accessToken);
                }
            });
        };

        return (
            <AuthContext.Provider value={{
                authStatusReported, isSignedIn,
                accessToken, idToken,
                checkRefreshIDTokenPromise, checkRefreshAccessTokenPromise
            }}>
                {this.state.authStatusReported && this.props.children}
            </AuthContext.Provider>
        );
    }
}