import { Constants } from 'expo';
import { Platform } from 'react-native'

export default function(){
    return `${Platform.OS} ${Platform.Version} ${Constants.deviceName} ${Constants.deviceId}`
}

