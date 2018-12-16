using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using Pj.Protobuf.HelloWorld;
using Pj.Protobuf.HelloWorldService;

public class ManageButtonFetch : MonoBehaviour {
    private Text label;

    void Start() {
        label = this.gameObject.GetComponentInChildren<Text>();
        label.text = "Fetch(NoAuth)";
    }
    
//    private async void OnEndOfFetch(string token, string err) {
//        string t = token ?? "";
//        string e = err ?? "";
//        ManageScroll.Log(DateTime.Now.ToString("tthh時mm分ss秒fffミリ秒") + ": OnEndOfGetIDToken");
//        
//        if (t != "" && e == "") {
//            // SingIn済み
//            ManageScroll.Log("token: " + t);
//            
//            // Fetch実行 TODO: エラーキャッチ
//            var helloWorld = new DefaultHelloWorld(Manager.HostName, token);
//       
//            string user = "hoge";
//            HelloReq req = new HelloReq();
//            req.Subject = user;
//
//            var awaitableCoroutine = Awaitable.Create<HelloResp>(tcs => helloWorld.Hello(req, tcs));
//            var result = await awaitableCoroutine;
//    
//            ManageScroll.Log("result: " + result);
//        }
//
//        if (e != "") {
//            ManageScroll.Log("err: " + e);
//        }  
//    }

    public async void OnClickButton() {
        ManageScroll.Log(DateTime.Now.ToString("tthh時mm分ss秒fffミリ秒") + ": Fetch");
        // 認証必要なし
        // FirebaseAuthPlugIn.CallPlugin(OnEndOfFetch);
        
        // Fetch実行 TODO: エラーキャッチ
        var helloWorld = new DefaultHelloWorld(Manager.HostName, "");
       
        HelloReq req = new HelloReq();
        req.Subject = "dummy user";

        var awaitableCoroutine = Awaitable.Create<HelloResp>(tcs => helloWorld.Hello(req, tcs));
        var result = await awaitableCoroutine;
    
        ManageScroll.Log("result: " + result);
    }
}
