import React from "react";
import { FaEye, FaEyeSlash, FaShip } from "react-icons/fa";
import cotecmarLogo from "../../../assets/images/cotecmar-logo.png";
import "./Login.css";

const LoginView = ({
  email,
  setEmail,
  password,
  setPassword,
  showPassword,
  setShowPassword,
  rememberMe,
  setRememberMe,
  error,
  loading,
  handleSubmit,
}) => {
  return (
    <div className="login-container">
      <div className="login-card" role="region" aria-label="Iniciar sesión">
        <div className="login-brand">
          <img src={cotecmarLogo} alt="COTECMAR" className="login-brand__logo" />
          <div className="login-brand__tag">
            <FaShip /> <span>Portal RV360</span>
          </div>
        </div>

        <header className="login-header">
          <h1>Iniciar sesión</h1>
          <p>Introduce tus credenciales para continuar.</p>
        </header>

        <form onSubmit={handleSubmit} className="login-form" noValidate>
          <div className="login-field">
            <label htmlFor="email">Correo electrónico</label>
            <div className="login-field__wrap">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="correo@cotecmar.com"
                autoFocus
                required
              />
            </div>
          </div>

          <div className="login-field">
            <label htmlFor="password">Contraseña</label>
            <div className="login-field__wrap">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                className="login-field__toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                tabIndex="-1"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <div className="login-form__row">
            <label className="remember-row">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(event) => setRememberMe(event.target.checked)}
              />
              <span>Recordarme</span>
            </label>
            <a
              className="login-forgot"
              href="#/"
              onClick={(e) => e.preventDefault()}
            >
              ¿Olvidaste tu contraseña?
            </a>
          </div>

          {error && (
            <div className="login-error" role="alert">
              <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                <path
                  fill="currentColor"
                  d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"
                />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <button type="submit" className="btn-login" disabled={loading}>
            {loading ? (
              <>
                <span className="btn-login__spinner" aria-hidden="true" />
                Verificando…
              </>
            ) : (
              "Ingresar"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginView;
