using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class ManageScroll : MonoBehaviour {
    public static string Logs = "";
    private string oldLogs = "";
    private ScrollRect scrollRect;
    private Text textLog;

    void Start() {
        scrollRect = this.gameObject.GetComponent<ScrollRect>();
        textLog = scrollRect.content.GetComponentInChildren<Text>();
    }

    void Update() {
        if (scrollRect != null && Logs != oldLogs) {
            // update
            textLog.text = Logs;
            // jump bottom
            StartCoroutine(DelayMethod(5, () => { scrollRect.verticalNormalizedPosition = 0; }));
            oldLogs = Logs;
        }
    }

    public static void Log(string logText) {
        Logs += (logText + "\n");
        Debug.Log(logText);
    }

    private IEnumerator DelayMethod(int delayFrameCount, Action action) {
        for (var i = 0; i < delayFrameCount; i++) {
            yield return null;
        }
        action();
    }
}
