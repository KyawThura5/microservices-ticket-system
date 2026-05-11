import { useState } from "react";

export default function AuthPanel({ onLogin, onRegister, loading, error, info, onClose }) {
  const [mode, setMode] = useState("login");
  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const [registerForm, setRegisterForm] = useState({
    username: "",
    password: "",
    name: "",
    email: "",
    address: "",
    phoneNumber: "",
  });

  const submitLogin = async (event) => {
    event.preventDefault();
    await onLogin(loginForm);
  };

  const submitRegister = async (event) => {
    event.preventDefault();
    await onRegister(registerForm);
  };

  return (
    <div className="auth-modal">
      <div className="auth-modal__overlay" onClick={onClose}></div>
      <section className="auth-modal__card">
        <div className="auth-modal__header">
          <div>
            <p className="eyebrow">Ticket System</p>
            <h1>{mode === "login" ? "Sign In" : "Create Customer Account"}</h1>
          </div>
          <button className="auth-modal__close" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>
        <div className="auth__switch">
          <button type="button" className={`btn btn--tiny ${mode === "login" ? "btn--primary" : ""}`} onClick={() => setMode("login")}>
            Login
          </button>
          <button type="button" className={`btn btn--tiny ${mode === "register" ? "btn--primary" : ""}`} onClick={() => setMode("register")}>
            Register
          </button>
        </div>

        {mode === "login" ? (
          <form className="form-grid" onSubmit={submitLogin}>
            <label>
              <span>Username</span>
              <input
                name="username"
                value={loginForm.username}
                onChange={(event) => setLoginForm((prev) => ({ ...prev, username: event.target.value }))}
                required
              />
            </label>
            <label>
              <span>Password</span>
              <input
                type="password"
                name="password"
                value={loginForm.password}
                onChange={(event) => setLoginForm((prev) => ({ ...prev, password: event.target.value }))}
                required
              />
            </label>
            <button className="btn btn--primary" disabled={loading} type="submit">
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>
        ) : (
          <form className="form-grid" onSubmit={submitRegister}>
            <label>
              <span>Username</span>
              <input name="username" value={registerForm.username} onChange={(event) => setRegisterForm((prev) => ({ ...prev, username: event.target.value }))} required />
            </label>
            <label>
              <span>Password</span>
              <input type="password" name="password" minLength={8} value={registerForm.password} onChange={(event) => setRegisterForm((prev) => ({ ...prev, password: event.target.value }))} required />
            </label>
            <label>
              <span>Name</span>
              <input name="name" value={registerForm.name} onChange={(event) => setRegisterForm((prev) => ({ ...prev, name: event.target.value }))} required />
            </label>
            <label>
              <span>Email</span>
              <input type="email" name="email" value={registerForm.email} onChange={(event) => setRegisterForm((prev) => ({ ...prev, email: event.target.value }))} required />
            </label>
            <label>
              <span>Address</span>
              <input name="address" value={registerForm.address} onChange={(event) => setRegisterForm((prev) => ({ ...prev, address: event.target.value }))} required />
            </label>
            <label>
              <span>Phone Number</span>
              <input name="phoneNumber" value={registerForm.phoneNumber} onChange={(event) => setRegisterForm((prev) => ({ ...prev, phoneNumber: event.target.value }))} required />
            </label>
            <button className="btn btn--primary" disabled={loading} type="submit">
              {loading ? "Creating..." : "Create account"}
            </button>
          </form>
        )}

        {error ? <p className="error">{error}</p> : null}
        {info ? <p className="note">{info}</p> : null}
      </section>
    </div>
  );
}
