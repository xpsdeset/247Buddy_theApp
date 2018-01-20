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

notifications.showToast = function (msg, position) {
    Toast.show({
        text: msg,
        position: position || 'bottom',
        buttonText: 'Okay',
        duration:7000
    })
}

export default notifications;