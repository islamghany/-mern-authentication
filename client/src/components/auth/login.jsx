import React from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { useFetch } from "../tools/useFetch";
import { useDispatch } from "react-redux";
import { Login as LoginImage } from "../../assets/icons/images";

const Login = ({ history }) => {
  const { request, error, loading } = useFetch();
  const { register, errors, handleSubmit } = useForm();
  const dispatch = useDispatch();
  const onSubmit = async data => {
    try {
      const respond = await request(
        "http://localhost:5000/api/user/login",
        "post",
        data
      );
      const expiration = new Date(new Date().getTime() + 1000 * 3600 * 24 * 30);
      localStorage.setItem(
        "currentUser",
        JSON.stringify({
          ...respond.data,
          expiration: expiration.toISOString()
        })
      );
      dispatch({
        type: "LOGIN",
        payload: {
          ...respond.data,
          expiration: expiration.toISOString()
        }
      });
      history.push("/");
    } catch (err) {
      console.log(error, err);
    }
  };

  return (
    <div className="grid">
      <div className="grid__img">
        <LoginImage />
      </div>
      <div className="form">
        <h2 className="form__heading text-left primary">
          Hello,
          <br />
          Welcome Back
        </h2>
        <div className="form__body">
          {error && <div className="invalid mb-2">{error}</div>}
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form__unit">
              <input
                name="email"
                type="text"
                ref={register({
                  required: true,
                  pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i
                })}
                className="form__input bb-0"
                placeholder="Email"
                disabled={loading}
              />
              {errors.email && (
                <div className="invalid">
                  {errors.email.type === "required"
                    ? "Email field is required"
                    : "Invalid Email"}
                </div>
              )}
            </div>
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
            <div className="form__forget">
              <p>
                <Link to="/reset">Forget Password?</Link>
              </p>
            </div>
            <button
              disabled={loading}
              className="btn btn--contained1-primary ml-0 block"
            >
              {loading ? "Loading..." : "Login"}
            </button>
          </form>
          <div className="form__alt">
            <p>
              dont have an account ?
              <Link className="plink" to="/signup">
                signup
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Login;
