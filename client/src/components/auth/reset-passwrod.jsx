import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { useFetch } from "../tools/useFetch";
import LoadingPage from "../tools/loading-page";
import { ForgetPassword } from "../../assets/icons/images";

import axios from "axios";
const ResetPassword = props => {
  const [emailSent, setEmailSent] = useState(null);
  const { request, error, loading } = useFetch();
  const [valid, setValid] = useState("pre");
  const { register, errors, handleSubmit } = useForm();
  const [userId, setUserId] = useState({});
  const onSubmit = async data => {
    try {
      const respond = await request(
        "http://localhost:5000/api/user/reset/resetPassword",
        "post",
        { password: data.password, userId }
      );
      setEmailSent(true);
    } catch (err) {
      console.log(err);
    }
  };
  const handleToken = async token => {
    try {
      const respond = await axios.get(
        `http://localhost:5000/api/user/reset/${token}`
      );
      console.log(respond.data);
      const { resetTokenExpiration } = respond.data;
      if (new Date(resetTokenExpiration) > new Date()) {
        setValid("ok");
      } else {
        setValid("end");
      }
      setUserId(respond.data.userId);
    } catch (err) {
      console.log(err);
      props.history.push("");
    }
  };
  useEffect(() => {
    const id = props.match.params.id;
    console.log(id);
    handleToken(id);
  }, []);
  if (valid === "pre") {
    return <LoadingPage />;
  } else if (valid === "ok") {
    return (
      <div className="grid">
        <div className="grid__img">
          <ForgetPassword />
        </div>
        <div className="form">
          <h2 className="form__heading text-left primary">Reset Password</h2>
          <div className="form__body">
            {error && <div className="invalid mb-2">{error}</div>}
            {!emailSent ? (
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="form__unit">
                  <input
                    name="password"
                    type="password"
                    ref={register({
                      required: true,
                      minLength: 6
                    })}
                    className="form__input bt-0"
                    disabled={loading}
                    placeholder="Password"
                  />
                  {errors.password && (
                    <div className="invalid">
                      {errors.password.type === "required"
                        ? "Password field is required"
                        : "Password is too short"}
                    </div>
                  )}
                </div>

                <button
                  disabled={loading}
                  className="btn btn--contained1-primary ml-0"
                >
                  {loading ? "Loading..." : "submit"}
                </button>
              </form>
            ) : (
              <div className="form__alt">
                <p>
                  <Link to="/login" className="plink">
                    go back
                  </Link>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="form__body">
      <h4>your session has ended, please try again later</h4>
      <Link to="/reset">
        <button className="btn btn--contained1-white">reset password</button>
      </Link>
    </div>
  );
};
export default ResetPassword;
