using UnityEngine;
using System.Runtime.InteropServices;

public class GoogleSignInPlugIn { 
	[DllImport("__Internal")]
	private static extern void _SignIn_GoogleSignIn();

	[DllImport("__Internal")]
	private static extern void _SignOut_GoogleSignIn();

	public static void SignIn() {
		if (Application.platform != RuntimePlatform.OSXEditor) {
			_SignIn_GoogleSignIn();
		} else {
			Debug.Log("SignIn not supported");
		}
	}

    public static void SignOut() {
		if (Application.platform != RuntimePlatform.OSXEditor) {
			_SignOut_GoogleSignIn();
		} else {
			Debug.Log("SignOut not supported");
		}
	}
}