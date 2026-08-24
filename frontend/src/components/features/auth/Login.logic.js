import { useState } from "react";
import authService from "../../../services/AuthService";

export default function useLoginLogic({ onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await authService.login(email, password);
      if (result.success) {
        onLoginSuccess(result.user);
      } else {
        setError(result.error);
        setPassword("");
      }
    } catch (err) {
      setError("Error al iniciar sesion");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return {
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
  };
}
