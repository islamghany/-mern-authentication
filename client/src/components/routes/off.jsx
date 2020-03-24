import React from "react";
import Login from "../auth/login";
import Singup from "../auth/signup";
import Reset from "../auth/reset";
import ResetPassword from "../auth/reset-passwrod";

import { Redirect, Route, Switch } from "react-router-dom";

const Off = () => {
  return (
    <div className="wrapper">
      <Switch>
        <Route exact path="/login" component={Login} />
        <Route exact path="/signup" component={Singup} />
        <Route exact path="/reset" component={Reset} />
        <Route exact path="/reset/:id" component={ResetPassword} />
        <Redirect from="*" to="/login" />
      </Switch>
    </div>
  );
};
export default Off;
