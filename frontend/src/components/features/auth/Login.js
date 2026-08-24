import React from "react";
import useLoginLogic from "./Login.logic";
import LoginView from "./Login.jsx";

const Login = (props) => {
  const logic = useLoginLogic(props);
  return <LoginView {...props} {...logic} />;
};

export default Login;
