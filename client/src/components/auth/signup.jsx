import React from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { useFetch } from "../tools/useFetch";
import { useDispatch } from "react-redux";
import { Signup as SignupImage } from "../../assets/icons/images";

const Signup = ({ history }) => {
  const { request, error, loading } = useFetch();
  const { register, errors, handleSubmit } = useForm();
  const dispatch = useDispatch();
  const onSubmit = async data => {
    try {
      const respond = await request(
        "http://localhost:5000/api/user/signup",
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
      console.log(err);
    }
  };
  return (
    <div className="grid">
      <div className="grid__img">
        <SignupImage />
      </div>
      <div className="form">
        <h2 className="form__heading text-left primary">Sign up</h2>
        <div className="form__body">
          {error && <div className="invalid mb-2">{error}</div>}
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form__unit">
              <input
                name="name"
                type="text"
                ref={register({
                  required: true,
                  minLength: 6,
                  maxLength: 32
                })}
                className="form__input"
                disabled={loading}
                placeholder="Full name"
              />
              {errors.name && (
                <div className="invalid">
                  {errors.name.type === "required"
                    ? "name field is required"
                    : "name must be more than 5 and less than 32 characters"}
                </div>
              )}
            </div>
            <div className="form__unit">
              <input
                name="email"
                type="text"
                ref={register({
                  required: true,
                  pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i
                })}
                className="form__input"
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
                className="form__input"
                placeholder="Password"
                disabled={loading}
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
              className="btn btn--contained1-primary ml-0 block"
            >
              {loading ? "Loading..." : "Signup"}
            </button>
          </form>
          <div className="form__alt">
            <p>
              have an account?
              <Link to="/login" className="plink">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Signup;
