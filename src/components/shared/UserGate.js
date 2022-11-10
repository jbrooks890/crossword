import "../../styles/UserGate.css";
import { useRef, useState } from "react";
import Password from "../frags/Password";
import { ReactComponent as XWORD_LOGO } from "../../assets/icons/xword-logo-2.svg";

export default function UserGate({ inline }) {
  const [existingUser, toggleExistingUser] = useState(true);
  const [userGateForm, setUserGateForm] = useState({
    userName: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "", // TODO
    confirmPassword: "",
  });
  const [formValidation, setFormValidation] = useState({});

  const handleInput = e =>
    setUserGateForm(prev => ({
      ...prev,
      [e.name]: e.target.value,
    }));

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
    >
      {!inline && (
        <h2 className="logo">
          <XWORD_LOGO />
        </h2>
      )}
      {/* ------- USERNAME ------- */}
      <label
        htmlFor="userName"
        data-label={existingUser ? "username / email" : "username"}
        className={`required`}
      >
        <input id="userName" type="text" />
      </label>

      {/* ------- EMAIL ------- */}
      {!existingUser && (
        <label htmlFor="email" data-label="email">
          <input type="email" id="email" />
        </label>
      )}
      {/* ------- PASSWORD ------- */}
      <Password label={"password"} onChange={handleInput} />

      {/* ------- CONFIRM PASSWORD ------- */}
      {!existingUser && <Password label={"confirmPassword"} />}

      {/* ------- GO: SIGN-IN/UP ------- */}

      <button type="submit">
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
