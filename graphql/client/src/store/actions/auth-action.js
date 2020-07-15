import {isAuth,signout,authenticate} from '../../helpers/auth';

export const getAuth = ()=>{
	return dispatch=>{
		const auth = isAuth();
		if(auth && auth.name){
			dispatch({
				type:'SIGNING_IN',
				payload:auth
			})
		}else{
			dispatch({
				type:'SIGNING_OUT'
			})
		}
	}
}

export const setAuth = (data)=>{
     return dispatch=>{
     	authenticate(data,()=>{
     		dispatch({
     			type:'SIGNING_IN',
				payload:isAuth()
     		})
     	})
     }
}
export const removeAuth=()=>{
	 return dispatch=>{
     	signout(()=>{
     		dispatch({
     			type:'SIGNING_OUT',
     		})
     	})
     }
}