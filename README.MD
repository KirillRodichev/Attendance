# Attendance App
<img src="https://github.com/KirillRodichev/ReadmeResources/blob/master/Attendance/live-screen/gif.gif" width="250" />

The app was meant to be another routine coursework, but ...

### Goals
At the very beginning the main goal was to create a mobile app, that keeps track of stundents' attendance, so that they can't cheat it.

To achieve this, the **following conditions** were necessary

- To provide app with **biometric authentication**
- To consider **request time** of classroom entering
- To consider **location** of same request

### Base technologies

- React (w/ Hooks) & React Native 
- Redux (w/ react-redux & redux-thunk)
- Expo dev tools
- Firebase database & auth

### How it works

1. A student registers in the app selecting himself from a provided list of students
2. When he enters the app, it requests biometric data
3. In the case of a successful authorization the app fetches relevant schedule from a database and displays it (any lesson has location, start and end props)
4. The student can try to enter any displayed lesson
5. He succeeds if only the time and location of request matches the lesson's data
6. Entered lessons goes to another tab and disappears from the current one. The entering time stores in the database

### Screenshots

|  |  |  |
|    :---:      |    :---:      |    :---:      |
| ![](https://github.com/KirillRodichev/ReadmeResources/blob/master/Attendance/images/3.jpg)   | ![](https://github.com/KirillRodichev/ReadmeResources/blob/master/Attendance/images/5.jpg)     | ![](https://github.com/KirillRodichev/ReadmeResources/blob/master/Attendance/images/6.jpg)    |
| ![](https://github.com/KirillRodichev/ReadmeResources/blob/master/Attendance/images/7.jpg)   | ![](https://github.com/KirillRodichev/ReadmeResources/blob/master/Attendance/images/8.jpg)     | ![](https://github.com/KirillRodichev/ReadmeResources/blob/master/Attendance/images/9.jpg)    |
| ![](https://github.com/KirillRodichev/ReadmeResources/blob/master/Attendance/images/10.jpg)  | ![](https://github.com/KirillRodichev/ReadmeResources/blob/master/Attendance/images/1.jpg)     | ![](https://github.com/KirillRodichev/ReadmeResources/blob/master/Attendance/images/2.jpg)    |

 
