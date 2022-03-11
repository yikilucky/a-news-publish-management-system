import {createStore} from 'redux'
import reducers from './reducers'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web

//redux 持久化,将redux保存到本地
const persistConfig = {
    key: 'redux-persist',
    storage,
    whitelist: ['scrollReducer']
  }
  const persistedReducer = persistReducer(persistConfig, reducers)
export  let store = createStore(persistedReducer)
export  let persistor = persistStore(store)
  
