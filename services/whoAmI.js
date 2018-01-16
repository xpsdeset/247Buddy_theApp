import { Platform } from 'react-native'
import { Constants, Permissions, Notifications } from 'expo';

var whoAmI= {};
whoAmI.whoAmI= function (){
    return `${Platform.OS} ${Platform.Version} ${Constants.deviceName} ${Constants.deviceId}`
}


whoAmI.getToken = async function ()  {
    const { status: existingStatus } = await Permissions.getAsync(
        Permissions.NOTIFICATIONS
    );
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
        const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
        finalStatus = status;
    }

    if (finalStatus !== 'granted') {
        return;
    }

    return await Notifications.getExpoPushTokenAsync();


};

export default whoAmI;