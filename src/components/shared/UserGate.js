import "../../styles/UserGate.css";
import { useEffect, useRef, useState } from "react";
import { ReactComponent as XWORD_LOGO } from "../../assets/icons/xword-logo-2.svg";
import axios, { axiosPrivate } from "../../apis/axios";
import { useAuth } from "../contexts/AuthContextProvider";
import { useLocation, useNavigate } from "react-router-dom";
import useAxios from "../../hooks/useAxios";
import Password from "./form/Password";
import TextField from "./form/TextField";
import FieldSet from "./form/FieldSet";
import Checkbox from "./form/Checkbox";

export default function UserGate({ isLogin, inline }) {
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
  const [loginMode, setLoginMode] = useState(
    isLogin || location?.pathname?.includes("/login")
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

  const registrationForm = {
    username: {
      type: "text",
      placeholder: !loginMode ? "jane_doe01" : "",
      forLogin: true,
      required: true,
      criteria: "3-23 characters; no spaces or special characters",
    },
    name: {
      type: "set",
      fields: {
        firstName: {
          type: "text",
          placeholder: "Jane",
          forLogin: false,
          required: false,
          criteria: "",
        },
        lastName: {
          type: "text",
          placeholder: "Doe",
          forLogin: false,
          required: false,
          criteria: "",
        },
      },
    },
    email: {
      type: "text",
      placeholder: "janedoe@domain.com",
      forLogin: false,
      required: true,
      criteria: "",
    },
    password: {
      type: "password",
      placeholder: "",
      forLogin: true,
      required: true,
      criteria:
        "8-24 characters; alphanumeric characters; allowed special characters (!@#$%)",
    },
    confirmPassword: {
      type: "password",
      placeholder: "",
      forLogin: false,
      required: true,
      criteria: "",
    },
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
        console.error(err);
        setLoginErr(message());
      }
    }
  };

  // <><><><><><><><> CHECK USERNAME AVAILABILITY <><><><><><><><>

  const claimUname = async () => {
    const response = await axios.get(`/users/${username}`);
    const { user } = response.data;
    return user ? true : false;
  };

  // <><><><><><><><> VALIDATE <><><><><><><><>

  const validate = async field => {
    const { username, email, password, confirmPassword } = userGateForm;
    const errors = [];

    switch (field) {
      case "username":
        if (!UNAME_REGEX.test(username)) errors.push("enter a valid username");
        // query database for a matching username
        const available = await claimUname();
        available && errors.push(`'${username}' is unavailable`);
        break;
      case "email":
        if (!EMAIL_REGEX.test(email))
          errors.push("enter a valid email address");
        // TODO: 'A USER WITH THIS EMAIL ADDRESS ALREADY EXISTS'
        break;
      case "password":
        if (!PWD_REGEX.test(password)) {
          errors.push("enter a valid password");
        }
        if (password.length < 8) {
          errors.push("password too short");
        }
        if (password.length > 24) {
          errors.push("password too long");
        }
        break;
      case "confirmPassword":
        if (confirmPassword !== password) errors.push("passwords do not match");
        break;
    }

    return errors.length ? errors : null;
  };

  // <><><><><><><><> VALIDATE FIELD <><><><><><><><>

  const validateField = async field => {
    // console.log(`%cVALIDATION!!`, "color:lime");
    const errors = await validate(field);
    setFormValidation(prev =>
      errors?.length
        ? { ...prev, [field]: errors }
        : Object.fromEntries(
            Object.entries(prev).filter(entry => entry[0] !== field)
          )
    );
  };

  // <><><><><><><><> VALIDATE REGISTRATION <><><><><><><><>

  const validateRegistration = async () => {
    const fields = Object.keys(userGateForm).filter(
      field => registrationForm[field]?.required
    );
    const errors = {};

    for (const field of fields) {
      if (!userGateForm[field]) {
        errors[field] = ["required field"];
        continue;
      }
      const validated = await validate(field);
      if (validated) errors[field] = validated;
    }

    // console.log("errors:", errors);
    if (Object.keys(errors).length)
      setFormValidation({ ...errors, attempted: true });

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
    if (await validateRegistration()) {
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

  // console.log(registrationForm);

  // <><><><><><><><> RENDER EACH (FIELD) <><><><><><><><>

  const renderEach = (field, entry, i) => {
    const { type } = entry;
    const specs = {
      ...entry,
      field,
      label: field.replace(/([A-Z])/g, " $1").toLowerCase(),
      value: userGateForm[field],
      validation: !loginMode && Boolean(Object.keys(formValidation).length),
      error: formValidation[field],
      validator: () =>
        formValidation?.attempted &&
        field === "username" &&
        validateField(field),
      onChange: e => {
        handleInput(e);
        formValidation?.attempted &&
          field !== "username" &&
          validateField(field);
      },
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
                entry => entry[1].forLogin
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
