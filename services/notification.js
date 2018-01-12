import { Audio, Notifications , Permissions} from 'expo';
import { Alert } from 'react-native';
import { Toast } from 'native-base';

let notifications={};

// export default function(msg){
//     Notifications.presentLocalNotificationAsync({
//         title:'247Buddy',
//         body: msg
//     })
// }

// // const soundObject = new Audio.Sound();


// export function playHelloSound(){
//     // soundObject.playAsync();
// }
// // Expo.Notifications.addListener()

notifications.showToast= function (msg) {
    Toast.show({
        text: msg,
        position: 'bottom',
        buttonText: 'Okay',
        duration:5000
    })
}

export default notifications;