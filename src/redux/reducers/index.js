import {combineReducers} from 'redux'
import scrollReducer from './scrollReducer'
import loadingReducer from './loadingReducer'
export default combineReducers({
    scrollReducer,
    loadingReducer
})
