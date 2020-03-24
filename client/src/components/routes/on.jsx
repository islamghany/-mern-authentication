import React from "react";
import { useDispatch } from "react-redux";
import { useFetch } from "../../shared/hooks/useFetch";
const On = () => {
  const { request, error, loading } = useFetch();

  const dispatch = useDispatch();
  const logout = async () => {
    try {
      localStorage.removeItem("currentUser");
      dispatch({
        type: "LOGOUT"
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <nav className="nav">
        <div className="wrapper">
          <div className="nav__container">
            <div className="nav__left">
              <h3 className="mr-2 primary">You are logged in</h3>
            </div>
            <div className="nav__right">
              <button
                disabled={loading}
                className="btn btn--outlined1-primary"
                onClick={logout}
              >
                Log out
              </button>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};
export default On;
