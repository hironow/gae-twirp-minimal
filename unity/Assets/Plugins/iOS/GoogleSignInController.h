#import <Foundation/Foundation.h>

@interface GoogleSignInController : NSObject

+ (GoogleSignInController *)sharedInstance;

- (void)signIn;
- (void)signOut;

@end
