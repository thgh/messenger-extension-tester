# messenger-extension-tester
Debug & test Messenger Extensions locally

## [Demo](https://rawgit.com/thgh/messenger-extension-tester/master/tester.html)

## Installation

1. Add [tester.html](tester.html) to the project you want to test.
2. Add the snippet below
    - AFTER assigning `extAsyncInit`
    - BEFORE loading `MessengerExtensions.js`

```
// Inject Messenger extension tester
try { window.MessengerExtensions = window.top.MessengerExtensions } catch (e) {}
```


