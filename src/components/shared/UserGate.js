import "../../styles/UserGate.css";
import { useEffect, useRef, useState } from "react";
import { ReactComponent as XWORD_LOGO } from "../../assets/icons/xword-logo-2.svg";
import axios, { axiosPrivate } from "../../apis/axios";
import { useAuth } from "../contexts/AuthContextProvider";
import { Link, useLocation, useNavigate, useNvigate } from "react-router-dom";
import useAxios from "../../hooks/useAxios";
import Password from "./form/Password";
import TextField from "./form/TextField";
import FieldSet from "./form/FieldSet";
import Checkbox from "./form/Checkbox";

export default function UserGate({ isLogin, inline }) {
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
  const [loginMode, setLoginMode] = useState(
    isLogin || location?.path?.contains("/login")
  );
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
  const { auth, setUser, persist, setPersist } = useAuth();
  const errorMsg = useRef();

  const navigate = useNavigate();

  const [response, error, loading, fetch] = useAxios();

  const UNAME_REGEX = /^[a-zA-Z][a-zA-Z0-9-_]{3,23}$/;
  const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

  const criteria = {
    username:
      "Must be between 3-23 characters. No spaces or special characters.",
    password:
      "Must be between 8-24 characters. Must include alphanumeric characters and an allowed special character (!@#$%)", // TODO
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
    loginMode ? logIn() : registerUser();
  };

  // <><><><><><><><> LOGIN <><><><><><><><>

  const logIn = async () => {
    // console.log(`%cLOG IN!`, "color:lime");
    const { username, password } = userGateForm;
    try {
      const response = await axiosPrivate.post("/login", {
        username,
        password,
      });
      const { accessToken } = response.data;

      loginErr && setLoginErr("");

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

  // <><><><><><><><> VALIDATE REGISTRATION <><><><><><><><>

  const validateRegistration = () => {
    const keys = Object.keys(userGateForm);
    const { username, firstName, lastName, email, password, confirmPassword } =
      userGateForm;
    const errors = {};

    keys.forEach(key => {
      if (criteria[key] && !userGateForm[key]) errors[key] = "required field";

      switch (key) {
        case "username":
          // query database for a matching username
          if (!username) {
            errors.username = "Username required";
          }
          if (!UNAME_REGEX.test(username)) errors.username = "Invalid username";
          break;
        case "firstName":
          if (!firstName) errors.firstName = "Required field";
          break;
        case "lastName":
          if (!lastName) errors.lastName = "Required field";
          break;
        case "email":
          if (!EMAIL_REGEX.test(email)) errors.email = "Invalid email address";
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

    console.log(!Object.keys(errors).length);
    return !Object.keys(errors).length;
  };

  // <><><><><><><><> RESET FORM <><><><><><><><>

  const resetForm = (entries = {}) =>
    setUserGateForm({
      username: "",
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      ...entries,
    });

  // <><><><><><><><> REGISTER (USER) <><><><><><><><>

  const registerUser = async () => {
    // console.log(`%cREGISTER USER!`, "color:coral");
    if (validateRegistration()) {
      try {
        await fetch({
          instance: axios,
          method: "POST",
          url: "/users",
          username,
          password,
          firstName,
          lastName,
          email,
        });
        setFormValidation({});
        setLoginMode(true);
        resetForm(username);
      } catch (err) {
        console.log(err);
      }
    }
  };

  const togglePersist = () => setPersist(prev => !prev);

  useEffect(() => localStorage.setItem("persist", persist), [persist]);

  const registrationForm = {
    username: {
      type: "text",
      placeholder: !loginMode ? "jane_doe01" : "",
      forLogin: true,
      criteria:
        "Must be between 3-23 characters. No spaces or special characters.",
    },
    name: {
      type: "set",
      fields: {
        firstName: {
          type: "text",
          placeholder: "Jane",
          forLogin: false,
          criteria: "",
        },
        lastName: {
          type: "text",
          placeholder: "Doe",
          forLogin: false,
          criteria: "",
        },
      },
    },

    email: {
      type: "text",
      placeholder: "janedoe@domain.com",
      forLogin: false,
      criteria: "Enter a valid email",
    },
    password: {
      type: "password",
      placeholder: "",
      forLogin: true,
      criteria:
        "Must be between 8-24 characters. Must include alphanumeric characters and an allowed special character (!@#$%)",
    },
    confirmPassword: {
      type: "password",
      placeholder: "",
      forLogin: false,
      criteria: "Passwords must match",
    },
  };

  // <><><><><><><><> RENDER EACH (FIELD) <><><><><><><><>

  const renderEach = (field, entry, i) => {
    const { type } = entry;
    const specs = {
      ...entry,
      field,
      required: Boolean(criteria),
      label: field.replace(/([A-Z])/g, " $1").toLowerCase(),
      validation: !loginMode && Boolean(Object.keys(formValidation).length),
      isValid: !formValidation[field],
      value: userGateForm[field],
      onChange: e => handleInput(e),
    };

    switch (type) {
      case "password":
        return <Password key={i} {...specs} />;
        break;
      case "set":
        return (
          <FieldSet key={i} {...specs} fields={renderFields(entry.fields)} />
        );
        break;
      default:
        return <TextField key={i} {...specs} />;
        break;
    }
  };

  // <><><><><><><><> RENDER FIELDS <><><><><><><><>

  const renderFields = fields =>
    Object.keys(fields).map((entry, i) => renderEach(entry, fields[entry], i));

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

      {/* ==========/ FORM FIELDS \========== */}

      {renderFields(
        loginMode
          ? Object.fromEntries(
              Object.entries(registrationForm).filter(
                ([field, entry]) => entry.forLogin
              )
            )
          : registrationForm
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
          Not a member? <a onClick={() => setLoginMode(false)}>Sign up</a>.
        </p>
      ) : (
        <p className="register-user">
          Have an account? <a onClick={() => setLoginMode(true)}>Log in</a>.
        </p>
      )}
    </form>
  );
}
