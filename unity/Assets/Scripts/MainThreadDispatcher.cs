using System;
using System.Collections;
using System.Collections.Generic;
using System.Runtime.CompilerServices;
using System.Threading.Tasks;
using UnityEngine;

public static class Awaitable {
    public static Task<T> Create<T>(Func<TaskCompletionSource<T>, IEnumerator> creation) {
        var tcs = new TaskCompletionSource<T>();

        // コルーチンを生成
        var coroutine = creation(tcs);

        MainThreadDispatcher.Instance.RegisterCoroutine(coroutine);

        return tcs.Task;
    }
}

public class MainThreadDispatcher : MonoBehaviour {
    private static MainThreadDispatcher instance;

    public static MainThreadDispatcher Instance {
        get {
            if (instance == null) {
                // 雑に
                instance = GameObject.FindObjectOfType<MainThreadDispatcher>();
            }
            return instance;
        }
    }

    /// <summary>
    /// 登録されたコルーチンを実行する
    /// </summary>
    /// <param name="coroutine">対象のコルーチン</param>
    public void RegisterCoroutine(IEnumerator coroutine) {
        StartCoroutine(coroutine);
    }
}

