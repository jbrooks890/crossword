import "../../styles/UserGate.css";
import { useEffect, useRef, useState } from "react";
import Password from "../frags/Password";
import { ReactComponent as XWORD_LOGO } from "../../assets/icons/xword-logo-2.svg";
import apiUrl from "../../config";
import axios from "axios";
import { useAuth } from "../contexts/AuthContextProvider";
import Checkbox from "../frags/Checkbox";
import { Link, useLocation, useNavigate, useNvigate } from "react-router-dom";

export default function UserGate({ isLogin, inline }) {
  const [loginMode, toggleLoginMode] = useState(isLogin);
  const [userGateForm, setUserGateForm] = useState({
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "", // TODO
    confirmPassword: "",
  });
  const { username, firstName, lastName, email, password, confirmPassword } =
    userGateForm;

  const [formValidation, setFormValidation] = useState({});
  const [loginErr, setLoginErr] = useState("");
  const LOGIN_URL = `${apiUrl}/login`;
  const SIGNUP_URL = `${apiUrl}/users`;
  const { auth, setUser, persist, setPersist } = useAuth();
  const errorMsg = useRef();

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const UNAME_REGEX = /^[a-zA-Z][a-zA-Z0-9-_]{3,23}$/;
  const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

  const criteria = {
    username:
      "Must be between 3-23 characters. No spaces or special characters.",
    password:
      "Must be between 8-24 characters. Must include alphanumeric characters and an allowed special character (!@#$%)", // TODO
    firstName: "",
    lastName: "",
    email: "",
  };

  // useEffect(() => console.log(userGateForm), [userGateForm]);
  useEffect(() => setLoginErr(""), [username, password, loginMode]);

  useEffect(() => {
    errorMsg.current.style.maxHeight =
      !inline &&
      loginErr &&
      errorMsg.current.getBoundingClientRect().height + "px";
  }, [loginErr]);

  const handleInput = e =>
    setUserGateForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

  const handleSubmit = e => {
    e.preventDefault();
    loginMode ? logIn() : validateRegistration();
  };

  const logIn = async () => {
    const { username, password } = userGateForm;
    try {
      const response = await axios({
        url: LOGIN_URL,
        method: "POST",
        data: { username, password },
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      const { accessToken } = response.data;
      console.log(response.data); // TODO: remove in prod

      loginErr && setLoginErr("");

      // setAuth({ username, accessToken });
      setUser(accessToken);
      setUserGateForm(prev => ({ ...prev, username: "", password: "" }));

      navigate(from, { replace: true });
    } catch (err) {
      if (!err?.response) {
        setLoginErr("No Server Response");
      } else if (err.response?.status) {
        let message = () => {
          switch (err.response.status) {
            case 400:
              return "Invalid username or password";
              break;
            case 401:
              return "Unauthorized";
              break;
            default:
              return "Login failed";
              break;
          }
        };
        setLoginErr(message());
      }
    }
  };

  const validateRegistration = () => {
    const keys = Object.keys(userGateForm);
    const { username, firstName, lastName, email, password, confirmPassword } =
      userGateForm;
    const errors = {};

    keys.forEach(key => {
      switch (key) {
        case "username":
          // query database for a matching username
          if (!username) {
            errors.username = "Username required.";
          }
          break;
        case "firstName":
          if (!firstName) errors.firstName = "Required field";
          break;
        case "lastName":
          if (!lastName) errors.lastName = "Required field";
          break;
        case "email":
          console.log(EMAIL_REGEX.test(email));
          break;
        case "password":
          if (password.length < 8) {
            errors.password = "Password must be at least 8 characters";
          }
          if (password.length > 24) {
            errors.password = "Password cannot be more than 24 characters";
          }
          if (!PWD_REGEX.test(password)) {
            errors.password = "Invalid user password";
          }
          break;
        case "confirmPassword":
          if (confirmPassword !== password)
            errors.confirmPassword = "Passwords do not match.";
          break;
      }
    });
    console.log("errors:", errors);
    if (Object.keys(errors).length) setFormValidation(errors);
  };

  const togglePersist = () => setPersist(prev => !prev);

  useEffect(() => localStorage.setItem("persist", persist), [persist]);

  // --------------------------------
  // :::::::::::: RENDER ::::::::::::

  return (
    <form
      id="user-gate"
      className={`flex col ${loginMode ? "sign-in" : "sign-up"}`}
      spellCheck="false"
      onSubmit={e => handleSubmit(e)}
    >
      {!inline && (
        <h2 className="logo">
          <XWORD_LOGO />
        </h2>
      )}
      {!inline && (
        <p
          ref={errorMsg}
          className={`error violation ${loginErr ? "show" : "hide"}`}
        >
          {loginErr}
        </p>
      )}
      {/* ------- USERNAME ------- */}
      <label
        htmlFor="username"
        data-label={loginMode ? "username / email" : "username"}
        className={`required`}
      >
        <input
          name="username"
          type="text"
          onChange={e => handleInput(e)}
          autoComplete={loginMode ? "off" : "on"}
          value={username}
        />
      </label>

      {!loginMode && (
        <div className="name-section wrapper flex ">
          {/* ------- FIRST NAME ------- */}
          <label
            htmlFor="firstName"
            data-label="first name"
            className={`required`}
          >
            <input
              name="firstName"
              type="text"
              onChange={e => handleInput(e)}
              value={firstName}
            />
          </label>

          {/* ------- LAST NAME ------- */}
          <label
            htmlFor="lastName"
            data-label="last name"
            className={`required`}
          >
            <input
              name="lastName"
              type="text"
              onChange={e => handleInput(e)}
              value={lastName}
            />
          </label>
        </div>
      )}

      {/* ------- EMAIL ------- */}
      {!loginMode && (
        <label htmlFor="email" data-label="email">
          <input
            type="email"
            name="email"
            placeholder="janedoe@domain.com"
            onChange={e => handleInput(e)}
            value={email}
          />
        </label>
      )}
      {/* ------- PASSWORD ------- */}
      <Password
        label={"password"}
        handleInput={e => handleInput(e)}
        value={password}
      />

      {/* ------- CONFIRM PASSWORD ------- */}
      {!loginMode && (
        <Password
          label={"confirmPassword"}
          handleInput={e => handleInput(e)}
          value={confirmPassword}
        />
      )}

      {/* ------- REMEMBER ME CHECKBOX ------- */}

      {loginMode && (
        <Checkbox
          id="persist"
          classList={["persist-check", "flex", "start", "middle"]}
          label="Remember this device"
          onChange={togglePersist}
          def={persist}
        />
      )}

      {/* ------- GO: SIGN-IN/UP ------- */}

      <button type="submit" onMouseUp={e => e.currentTarget.blur()}>
        <h2>{loginMode ? "Login" : "Sign up"}</h2>
      </button>

      {/* ------- REGISTER USER ------- */}
      {loginMode ? (
        <p className="register-user">
          Not a member? <a onClick={() => toggleLoginMode(false)}>Sign up</a>.
        </p>
      ) : (
        <p className="register-user">
          Have an account? <a onClick={() => toggleLoginMode(true)}>Log in</a>.
        </p>
      )}
    </form>
  );
}
