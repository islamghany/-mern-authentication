import React,{useEffect} from 'react';
import Navbar from './components/Navbar';
import Loadable from 'react-loadable';
import LoadingPage from './components/loading/loading-page.js'
import {BrowserRouter,Route,Switch} from 'react-router-dom';
import {useDispatch,useSelector} from 'react-redux'
import {getAuth} from './store/actions/auth-action.js'

const AsyncSignin = Loadable({
  loader: () => import('./views/auth/Signin'),
  loading: LoadingPage,
});
const AsyncSignup = Loadable({
  loader: () => import('./views/auth/Signup'),
  loading: LoadingPage,
});
const AsyncRestPassword = Loadable({
  loader: () => import('./views/auth/ResetPassword.js'),
  loading: LoadingPage,
});
const AsyncResetPasswordFin = Loadable({
  loader: () => import('./views/auth/ResetPasswordFin'),
  loading: LoadingPage,
});
const AsyncActivateEmail = Loadable({
  loader: () => import('./views/auth/ActivateEmail'),
  loading: LoadingPage,
});
const AsyncHome = Loadable({
  loader: () => import('./views/home'),
  loading: LoadingPage,
});



const App = ()=>{
  const dispatch=useDispatch();
  const auth = useSelector(state=>state.auth);
  useEffect(()=>{
     dispatch(getAuth());
  },[])
  if(auth.loading) return null;
	return <BrowserRouter>
	   <div className='container-page'> 
	   <Navbar user={auth} />
       <Switch>
       <Route exact path="/signup" component={AsyncSignup} />
       <Route exact  path="/signin" component={AsyncSignin} />
       <Route  path="/reset-password" component={AsyncRestPassword} />
       <Route  path="/auth/reset-password/:token" component={AsyncResetPasswordFin} />
       <Route path="/auth/activate-account/:token" component={AsyncActivateEmail} />
	     <Route  path="/" component={AsyncHome} />
	   </Switch>
	   </div>
	</BrowserRouter>
}
export default App;