import styled from "@emotion/styled";
import { useAuth } from "../../../../auth";
import { useState } from "react";
import Header from "../../../../components/layouts/WithHeader";

const LoginPage = () => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const { login } = useAuth();

  return (
    <S.Root>
      <Header />
      Login
      <S.Form
        onSubmit={(e) => {
          e.preventDefault();
          login(credentials);
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
        <S.LoginButton type="submit">Login</S.LoginButton>
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

export default LoginPage;
