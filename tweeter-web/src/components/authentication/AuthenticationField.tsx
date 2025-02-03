import { KeyboardEventHandler, useState } from "react";

interface AuthenticationFieldProps {
  // 用户按下 Enter 键时要触发的函数，可选
  alias: string;
  password: string;
  onAliasChange: (val: string) => void;
  onPasswordChange: (val: string) => void;
  onEnter?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

const AuthenticationField: React.FC<AuthenticationFieldProps> = ({ alias,
  password,
  onAliasChange,
  onPasswordChange,
  onEnter}) =>
{
    return (
        <>
        <div className="form-floating">
        <input
          type="text"
          className="form-control"
          size={50}
          id="aliasInput"
          placeholder="name@example.com"
          onKeyDown={(e) => 
          {
            if (e.key === "Enter" && onEnter) {
              onEnter(e);
            }
          }
          }
          onChange={(event) => onAliasChange(event.target.value)}
        />
        <label htmlFor="aliasInput">Alias</label>
      </div>
      <div className="form-floating">
        <input
          type="password"
          className="form-control"
          id="passwordInput"
          placeholder="Password"
          onKeyDown={(e) => {
            if (e.key === "Enter" && onEnter) {
              onEnter(e);
            }
          }}
          onChange={(event) => onPasswordChange(event.target.value)}
        />
        <label htmlFor="passwordInput">Password</label>
      </div>
        </>
        
    );
}

export default AuthenticationField;