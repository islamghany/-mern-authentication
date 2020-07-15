import React from 'react';
import {Navbar,NavbarBrand,Nav,NavItem,Button} from 'shards-react';
import {Link} from 'react-router-dom';
import {Edit} from '../assets/icons/';
import {removeAuth} from '../store/actions/auth-action';
import {useDispatch} from 'react-redux';

const App = ({user})=>{
  const dispatch = useDispatch();
	return <div className="wrapper">
	<Navbar theme="primary" className="nav">
	    <div className="nav__left"> 
	    <NavbarBrand className='nav__brand'>
      <Link exact to="/">
	     Shards React
      </Link>
	    </NavbarBrand>
	    </div>
	    <div className="nav__body">
      
	    </div>
      <div className="nav__right">
        <ul className="nav__list">
          <li className="nav__item">
            <Link className="nav__link">
               <Edit width="30px" height="30px"  />
            </Link>
          </li>
          {user && user.name ? <li className="nav__item">
            <Link className="nav__link">
              <Button pill theme='primary' className="white" onClick={()=>{
                dispatch(removeAuth());
              }}>
                sign out           
              </Button>
            </Link>
            </li>:<React.Fragment> 
            <li className="nav__item">
            <Link className="nav__link" to="/signin">
              <Button pill theme='primary'  className="mr-1 white">
                sign in           
              </Button>
            </Link>
          </li>
          <li className="nav__item">
            <Link className="nav__link" exact to="/signup">
             <Button pill theme='primary'  className="mr-1" outline>
                sign up           
              </Button>
            </Link>
          </li>
          </React.Fragment>}
        </ul>
      </div>
	   
	</Navbar>
	</div>
}
export default App;