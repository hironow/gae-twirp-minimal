using System;
using System.Collections;
using System.Collections.Generic;
using Pj.Protobuf.HaberdasherService;
using UnityEngine;
using UnityEngine.UI;
using Pj.Protobuf.Session;
using Pj.Protobuf.SessionService;
using Pj.Protobuf.Haberdasher;
using Pj.Protobuf.HaberdasherService;

public class ManageButtonFetch2 : MonoBehaviour {
    private Text label;

    void Start() {
        label = this.gameObject.GetComponentInChildren<Text>();
        label.text = "Fetch(Auth)";
    }
    
    private async void OnEndOfFetch(string token, string err) {
        string t = token ?? "";
        string e = err ?? "";
        ManageScroll.Log(DateTime.Now.ToString("tthh時mm分ss秒fffミリ秒") + ": OnEndOfGetIDToken");
        
        if (t != "" && e == "") {
            // SingIn済み
            ManageScroll.Log("token: " + t);
            
            // Fetch実行 TODO: エラーキャッチ
            var session = new DefaultSession(Manager.HostName, token);
       
            LoginRequest req = new LoginRequest();

            var awaitableCoroutine = Awaitable.Create<LoginResponse>(tcs => session.Login(req, tcs));
            var result = await awaitableCoroutine;
    
            ManageScroll.Log("result: " + result);

            if (result.Token != "") {
                var accessToken = result.Token;
                ManageScroll.Log("accessToken: " + accessToken);
                
                // Fetch実行 TODO: エラーキャッチ
                var haberdasher = new DefaultHaberdasher(Manager.HostName, accessToken);

                Size req2 = new Size();
                req2.Inches = UnityEngine.Random.Range(1, 1001);

                var awaitableCoroutine2 = Awaitable.Create<Hat>(tcs => haberdasher.MakeHat(req2, tcs));
                var result2 = await awaitableCoroutine2;
    
                ManageScroll.Log("result: " + result2);
            }
        }

        if (e != "") {
            ManageScroll.Log("err: " + e);
        }  
    }

    public void OnClickButton() {
        ManageScroll.Log(DateTime.Now.ToString("tthh時mm分ss秒fffミリ秒") + ": Fetch");
        FirebaseAuthPlugIn.CallPlugin(OnEndOfFetch);
    }
}
