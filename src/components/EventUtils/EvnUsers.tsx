import { useEffect, useState } from "react";
import { getAllEventUsers } from "../../api/api_admin";
import { MsgT } from "../../helpers/UserContext";
import Dropdown from "../Dropdown";
import { InputBase, Line } from "../Input";
import useScreen from "../../hooks/useSize";
import { ViewFadeStatic } from "../AnimatedLayouts";
import { useNavigate } from "react-router-dom";
import { Ionicons } from "../Icons";

type UserListT = {
  _id: string;
  name: string;
  phone: string;
  card_id: string;
};

const EvnUsers = ({
  event_id,
  setMsg,
}: {
  event_id: string;
  setMsg: React.Dispatch<React.SetStateAction<MsgT>>;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchBar, setSearchBar] = useState("");
  const oc = (v: any) => setSearchBar(v);

  if(false) console.log(loading);

  const [userList, setUserList] = useState<UserListT[] | undefined>(undefined);

  useEffect(() => {}, [searchBar]);

  const onPress = async () => {
    if (!isOpen && !userList) {
      setLoading(true);
      const { status, data } = await getAllEventUsers(event_id);
      setLoading(false);
      if (status === 200) {
        setIsOpen(true);
        setUserList(data);
      } else setMsg({ type: "error", text: data.msg });
    } else setIsOpen(!isOpen);
  };
  const { ww } = useScreen();
  return (
    <Dropdown title="USUARIOS" {...{ isOpen, onPress }}>
      <div style={{ width: "100%", maxWidth: ww < 800 ? 360 : 280 }}>
        <InputBase
          onChange={oc}
          value={searchBar}
          label="Nombre"
          ph="Ej: Jane Doe"
        />
      </div>
      <Line />
      {ww > 600 ? (
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            paddingLeft: 16,
            gap: 12,
          }}
        >
          <p style={{ width: 160, fontWeight: "bold" }}>Nombre</p>
          <p style={{ width: 160, fontWeight: "bold" }}>Número</p>
          <p style={{ width: 160, fontWeight: "bold" }}>Nro.Identidad</p>
        </div>
      ) : null}
      <ViewFadeStatic style={{ minHeight: 300 }}>
        {userList?.map((user, i) => {
          if (searchBar && searchBar.length > 0) {
            let regex = new RegExp(searchBar, "i");
            if (regex.test(user.name))
              return <UserCard {...{ user, i }} key={i} />;
            else return null;
          }
          return <UserCard {...{ user, i }} key={i} />;
        })}
      </ViewFadeStatic>
    </Dropdown>
  );
};

export default EvnUsers;

const UserCard = ({ user, i }: { user: UserListT; i: number }) => {
  const navigate = useNavigate();
  const gotoUser = (_id: string) => {
    //   navigate("Profile", { _id });
  };

  if(false) console.log(navigate);
  const { ww } = useScreen();
  return (
    <ViewFadeStatic
      key={i}
      onClick={() => gotoUser(user._id)}
      style={{
        display: "flex",
        border: "1px solid black",
        padding: 16,
        alignItems: "center",
        cursor: "pointer",
      }}
    >
      <div
        style={{
          width: "100%",
          display: "flex",
          gap: 12,
          flexDirection: "row",
        }}
      >
        <p style={{ minWidth: 160 }}>{user.name}</p>
        {ww > 600 ? <p style={{ minWidth: 160 }}>{user.phone}</p> : null}
        {ww > 600 ? <p>{user.card_id}</p> : null}
      </div>
      <Ionicons name="open-outline" size={24} color="black" />
    </ViewFadeStatic>
  );
};
