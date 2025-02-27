import "./Login.css";
import "bootstrap/dist/css/bootstrap.css";
import { useContext } from "react";
import { UserInfoContext } from "../../userInfo/UserInfoProvider";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthenticationFormLayout from "../AuthenticationFormLayout";
import { AuthToken, FakeData, User } from "tweeter-shared";
import useToastListener from "../../toaster/ToastListenerHook";
import AuthenticationField from "../AuthenticationField";
import { LoginPresenter} from "../../../presenters/LoginPresenter";
import useUserInfo from "../../userInfo/UserInfoHook";
import { AuthenticationView } from "../../../presenters/AuthenticationPresenter";

interface Props {
  originalUrl?: string; 
  presenter?: LoginPresenter;
}

const Login = (props: Props) => {
  const [alias, setAlias] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false); 

  const { updateUserInfo } = useUserInfo();
  const { displayErrorMessage } = useToastListener();

  const checkSubmitButtonStatus = (): boolean => {
    return !alias || !password;
  };

  const loginOnEnter = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key == "Enter" && !checkSubmitButtonStatus()) {
      doLogin();
    }
  };

  const listener: AuthenticationView= {
    displayErrorMessage: displayErrorMessage,
    setIsLoading: setIsLoading,
    updateUserInfo: updateUserInfo
  }

  const [loginPresenter] = useState(props.presenter ?? new LoginPresenter(listener))

  const doLogin = () => {
    loginPresenter.loadUser(
      alias,
      password,
      rememberMe,
      props.originalUrl
    );
  };

  const inputFieldGenerator = () => {
    return (
      <>
        <AuthenticationField onEnter={loginOnEnter} onPasswordChange={setPassword} onAliasChange={setAlias} />
      </>
    );
  };

  const switchAuthenticationMethodGenerator = () => {
    return (
      <div className="mb-3">
        Not registered? <Link to="/register">Register</Link>
      </div>
    );
  };

  return (
    <AuthenticationFormLayout
      headingText="Please Sign In"
      submitButtonLabel="Sign in"
      oAuthHeading="Sign in with:"
      inputFieldGenerator={inputFieldGenerator}
      switchAuthenticationMethodGenerator={switchAuthenticationMethodGenerator}
      setRememberMe={setRememberMe}
      submitButtonDisabled={checkSubmitButtonStatus}
      isLoading={isLoading}
      submit={doLogin}
    />
  );
};
export default Login;
