#import <Foundation/Foundation.h>
#include "GoogleSignInController.h"

extern "C" {
    void _SignIn_GoogleSignIn() {
        [[GoogleSignInController sharedInstance] signIn];
    }
    
    void _SignOut_GoogleSignIn() {
        [[GoogleSignInController sharedInstance] signOut];
    }
}
