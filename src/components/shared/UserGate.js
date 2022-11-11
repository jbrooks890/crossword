import "../../styles/UserGate.css";
import { useEffect, useRef, useState } from "react";
import Password from "../frags/Password";
import { ReactComponent as XWORD_LOGO } from "../../assets/icons/xword-logo-2.svg";
import apiUrl from "../../config";
import axios from "axios";

export default function UserGate({ inline }) {
  const [existingUser, toggleExistingUser] = useState(true);
  const [userGateForm, setUserGateForm] = useState({
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "", // TODO
    confirmPassword: "",
  });
  const [formValidation, setFormValidation] = useState({});
  const LOGIN_URL = `${apiUrl}/login`;
  const SIGNUP_URL = `${apiUrl}/users`;

  // useEffect(() => console.log(userGateForm), [userGateForm]);

  const handleInput = e =>
    setUserGateForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

  const handleSubmit = e => {
    e.preventDefault();
    existingUser ? logIn() : validateRegistration();
  };

  const logIn = async () => {
    const { username, password } = userGateForm;
    const response = await axios({
      url: LOGIN_URL,
      method: "POST",
      data: { username, password },
    });

    console.log(response);
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
          // console.log("email", email.match(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i));
          break;
        case "password":
          if (password.length < 8) {
            errors.password = "Password must be at least 8 characters";
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

  const ShowPassword = ({ target }) => (
    <button
      className="show-password flex center"
      onClick={e => {
        e.preventDefault();
        target.current.classList.toggle("showing");
      }}
    >
      <svg>
        <use href="#eye-con" />
      </svg>
    </button>
  );

  return (
    <form
      id="user-gate"
      className={`flex col ${existingUser ? "sign-in" : "sign-up"}`}
      onSubmit={e => handleSubmit(e)}
    >
      {!inline && (
        <h2 className="logo">
          <XWORD_LOGO />
        </h2>
      )}
      {/* ------- USERNAME ------- */}
      <label
        htmlFor="username"
        data-label={existingUser ? "username / email" : "username"}
        className={`required`}
      >
        <input name="username" type="text" onChange={e => handleInput(e)} />
      </label>

      {!existingUser && (
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
            />
          </label>

          {/* ------- LAST NAME ------- */}
          <label
            htmlFor="lastName"
            data-label="last name"
            className={`required`}
          >
            <input name="lastName" type="text" onChange={e => handleInput(e)} />
          </label>
        </div>
      )}

      {/* ------- EMAIL ------- */}
      {!existingUser && (
        <label htmlFor="email" data-label="email">
          <input
            type="email"
            name="email"
            placeholder="janedoe@domain.com"
            onChange={e => handleInput(e)}
          />
        </label>
      )}
      {/* ------- PASSWORD ------- */}
      <Password label={"password"} handleInput={e => handleInput(e)} />

      {/* ------- CONFIRM PASSWORD ------- */}
      {!existingUser && (
        <Password label={"confirmPassword"} handleInput={e => handleInput(e)} />
      )}

      {/* ------- GO: SIGN-IN/UP ------- */}

      <button type="submit" onMouseUp={e => e.currentTarget.blur()}>
        <h2>{existingUser ? "Login" : "Sign up"}</h2>
      </button>

      {/* ------- REGISTER USER ------- */}
      {existingUser ? (
        <p className="register-user">
          Not a member? <a onClick={() => toggleExistingUser(false)}>Sign up</a>
          .
        </p>
      ) : (
        <p className="register-user">
          Have an account?{" "}
          <a onClick={() => toggleExistingUser(true)}>Log in</a>.
        </p>
      )}
    </form>
  );
}
