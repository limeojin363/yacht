import styled from "@emotion/styled";
import { useQuery } from "@tanstack/react-query";
import { GetGameList } from "../../apis/services/game/getGameList";
import { useState } from "react";
import { GetUserList } from "../../apis/services/user/getUserList";

const useGameList = () => {
  const { data, isPending } = useQuery({
    queryKey: ["gameList"],
    queryFn: async () => {
      try {
        const res = await GetGameList();
        const data = await res.json();
        if (data.games.length > 0 && !data.games[0].infoForAdmin) {
          throw new Error("No infoForAdmin in game");
        }
        return data;
      } catch (error) {
        console.log(error);
        return null;
      }
    },
    initialData: null,
  });

  return { data, isPending };
};

const useUserList = () => {
  const { data, isPending } = useQuery({
    queryKey: ["userList"],
    queryFn: async () => {
      const res = await GetUserList();
      const data = await res.json();
      return data;
    },
  });

  return { data, isPending };
};

const GameListView = () => {
  const { data } = useGameList();

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Game List</h2>
      <ul>
        {data.games.map((game) => (
          <li key={game.id}>{JSON.stringify(game)}</li>
        ))}
      </ul>
    </div>
  );
};

const UserListView = () => {
  const { data } = useUserList();

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>User List</h2>
      <ul>
        {data.users.map((user) => (
          <li key={user.id}>User ID: {user.id}</li>
        ))}
      </ul>
    </div>
  );
};

const AdminPage = () => {
  const [selected, select] = useState<"GAME" | "USER">("GAME");

  return (
    <S.Root>
      <button onClick={() => select("GAME")}>Game List</button>
      <button onClick={() => select("USER")}>User List</button>
      {selected === "GAME" ? <GameListView /> : <UserListView />}
    </S.Root>
  );
};

const S = {
  Root: styled.div`
    /* FILL HERE */
  `,
};

export default AdminPage;
