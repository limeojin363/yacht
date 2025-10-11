import styled from "@emotion/styled";
import { useAuth } from "../../../../auth";
import { useState } from "react";
import Header from "../../../../components/layouts/WithHeader";

const SignupPage = () => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
    passwordConfirm: "",
  });
  const { signup } = useAuth();

  return (
    <S.Root>
      <Header />
      Signup
      <S.Form
        onSubmit={(e) => {
          e.preventDefault();
          if (credentials.password !== credentials.passwordConfirm) {
            alert("Passwords do not match!");
            return;
          }
          signup(credentials);
        }}
      >
        <S.TextField
          type="text"
          placeholder="Username"
          value={credentials.username}
          onChange={(e) =>
            setCredentials({ ...credentials, username: e.target.value })
          }
        />
        <S.TextField
          type="password"
          placeholder="Password"
          value={credentials.password}
          onChange={(e) =>
            setCredentials({ ...credentials, password: e.target.value })
          }
        />
        <S.TextField
          type="password"
          placeholder="Password-confirm"
          value={credentials.passwordConfirm}
          onChange={(e) =>
            setCredentials({ ...credentials, passwordConfirm: e.target.value })
          }
        />
        <S.LoginButton type="submit">Signup</S.LoginButton>
      </S.Form>
    </S.Root>
  );
};

const S = {
  Root: styled.div``,
  Form: styled.form`
    display: flex;
    flex-direction: column;
    gap: 10px;
  `,
  TextField: styled.input``,
  LoginButton: styled.button``,
};

export default SignupPage;
