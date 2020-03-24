import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { useFetch } from "../tools/useFetch";
import { ForgetPassword } from "../../assets/icons/images";

const Reset = () => {
  const [emailSent, setEmailSent] = useState(null);
  const { request, error, loading } = useFetch();
  const { register, errors, handleSubmit } = useForm();
  const onSubmit = async data => {
    try {
      const respond = await request(
        "http://localhost:5000/api/user/reset",
        "post",
        data
      );
      setEmailSent(true);
    } catch (err) {
      console.log(err);
    }
  };
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
              <button
                disabled={loading}
                className="btn btn--contained1-primary ml-0 block"
              >
                {loading ? "Loading..." : "submit"}
              </button>
            </form>
          ) : (
            <h4>
              a link was sent to your email, follow instructions in the email to
              get back your account
            </h4>
          )}
          <div className="form__alt">
            <p>
              <Link to="/login" className="plink">
                go back
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Reset;
