using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class ManageButtonGetIDToken : MonoBehaviour {
    private Text label;

    void Start() {
        label = this.gameObject.GetComponentInChildren<Text>();
        label.text = "GetIDToken";
    }

    public void OnClickButton() {
        ManageScroll.Log(DateTime.Now.ToString("tthh時mm分ss秒fffミリ秒") + ": GetIDToken");
        FirebaseAuthPlugIn.CallPlugin(OnEndOfGetIDToken);
    }
    
    private void OnEndOfGetIDToken(string token, string err) {
        string t = token ?? "";
        string e = err ?? "";
        ManageScroll.Log(DateTime.Now.ToString("tthh時mm分ss秒fffミリ秒") + ": OnEndOfGetIDToken");
        
        if (t != "" && e == "") {
            // SingIn済み
            ManageScroll.Log("token: " + t);
        }

        if (e != "") {
            ManageScroll.Log("err: " + e);
        }
    }
}
