import { Audio, Notifications , Permissions} from 'expo';
import { Alert } from 'react-native';


export default function(msg){
    Notifications.presentLocalNotificationAsync({
        title:'247Buddy',
        body: msg
    })
}

// const soundObject = new Audio.Sound();


export function playHelloSound(){
    // soundObject.playAsync();
}
// Expo.Notifications.addListener()