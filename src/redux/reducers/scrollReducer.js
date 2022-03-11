const initState=false;
export default function scrollReducer(preState=initState,action){
    const {type}=action
    switch (type) {
        case "on": return true;
        case "off": return false;
        default :return preState
    }
}