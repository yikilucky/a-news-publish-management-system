const initState=false;
export default function scrollReducer(preState=initState,action){
    const {type}=action
    switch (type) {
        //名字不要和其他reducer一样
        case "onLoading": return true;
        case "offLoading": return false;
        default :return preState
    }
}