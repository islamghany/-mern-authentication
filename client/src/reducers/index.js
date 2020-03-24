import {combineReducers} from 'redux';
import CurrentUserReducer from './user-reducer'
const rootReducer= combineReducers({
	currentUser:CurrentUserReducer
})
export default rootReducer