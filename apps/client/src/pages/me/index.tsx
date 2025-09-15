import styled from "@emotion/styled";

const getMyInfo = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

const MePage = () => {
  const myInfo = getMyInfo();
  if (myInfo) {
    return (
      <S.Root>
        <h1>My Info</h1>
        <p>Username: {myInfo.username}</p>
        <p>Authority Level: {myInfo.authority_level}</p>
        <p>Game Connected: {myInfo.g_connected ? "Yes" : "No"}</p>
      </S.Root>
    );
  }
  return <S.Root>
    <h1>No user info available.</h1>
  </S.Root>;
};

const S = {
  Root: styled.div`
    /* FILL HERE */
  `,
};

export default MePage;
