import { useContext, useEffect, useState } from "react";
import { InputBase } from "../../components/Input";
import { IconLoad, Ionicons } from "../../components/Icons";
import { userSearchDB } from "../../api/api_admin";
import Context from "../../helpers/UserContext";
import { UserCard } from "../../components/EventUtils/EvnUsers";
import { ViewFadeStatic } from "../../components/AnimatedLayouts";
import useScreen from "../../hooks/useSize";
//md:flex-row md:items-end md:justify-between

type UserListT = {
  _id: string;
  name: string;
  phone: string;
  card_id: string;
};

type InfoT = {
  users: UserListT[];
  page: number;
  pageSize: number;
  totalCount: number;
  reached: number;
};
const default_info = {
  users: [],
  page: 0,
  pageSize: 0,
  totalCount: 0,
  reached: 0,
};
export const UsersDB = () => {
  const { setMsg } = useContext(Context);
  const [searchBar, setSearchBar] = useState("");
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState<InfoT>({
    users: [],
    page: 1,
    pageSize: 0,
    totalCount: 0,
    reached: 0,
  });

  useEffect(() => {
    setInfo(default_info);
    let st = setTimeout(async () => {
      setLoading(true);
      const { data, status } = await userSearchDB(searchBar, 1);
      setLoading(false);
      if (status === 200) {
        // console.log(data);
        setInfo({ ...data });
      } else
        setMsg({
          text: data.msg,
          type: "error",
        });
    }, 1000);
    return () => {
      clearTimeout(st);
      setLoading(false);
    };
  }, [searchBar]);

  const { ww } = useScreen();

  const numPress = async (num: number) => {
    setLoading(true);
    const { data, status } = await userSearchDB(searchBar, num);
    setLoading(false);
    if (status === 200) {
      // console.log(data);
      setInfo({ ...data });
    } else
      setMsg({
        text: data.msg,
        type: "error",
      });
  };

  return (
    <div className="flex flex-col min-h-[80vh] py-6 px-6 gap-6">
      <h6 className="!text-neutral-950 text-5xl ">USUARIOS</h6>
      <div className="flex w-full flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="min-w-75 max-w-80 md:max-w-70 md:min-w-[20%]">
          <InputBase
            onChange={setSearchBar}
            value={searchBar}
            label="Nombre o C.I del usuario"
            ph="Buscar..."
          />
        </div>
        <Pagination {...{ info, numPress }} />
        <div className="font-medium text-neutral-600 font-Roboto mb-3 md:w-[20%] md:text-end">
          {loading ? null : (
            <p>
              {(info.page - 1) * info.pageSize +1} - {info.reached} de{" "}
              {info.totalCount}
            </p>
          )}
        </div>
      </div>
      {loading ? (
        <div className="self-center">
          <IconLoad />
        </div>
      ) : (
        <>
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
            {info.users.map((user, i) => (
              <UserCard {...{ user, i }} key={i} />
            ))}
          </ViewFadeStatic>
        </>
      )}
    </div>
  );
};

const Pagination = ({
  info,
  numPress,
}: {
  info: InfoT;
  numPress: (num: number) => void;
}) => {
  const { reached, totalCount, pageSize, page } = info;
  return (
    <div className="w-full py-1 flex items-center justify-between max-w-80 md:self-center md:mt-4 md:max-w-90">
      <div onClick={() => numPress(1)} className="cursor-pointer">
        <DoubleArrowLeft />
      </div>

      <div
        onClick={() => (page - 1 > 0 ? numPress(page - 1) : null)}
        className="w-6 h-6"
      >
        {page - 1 > 0 ? <Ionicons name="chevron-back" /> : null}
      </div>
      <Dots cond={page - 3 > 0} />
      <NumBlock {...{ numPress }} num={page - 2} cond={page - 2 > 0} />
      <NumBlock {...{ numPress }} num={page - 1} cond={page - 1 > 0} />
      <NumBlock {...{ numPress }} num={page} active cond={true} />
      <NumBlock
        {...{ numPress }}
        num={page + 1}
        cond={totalCount - reached > 0}
      />
      <NumBlock
        {...{ numPress }}
        num={page + 2}
        cond={totalCount - reached > pageSize + 1}
      />
      <Dots cond={totalCount - reached > pageSize * 2 + 1} />
      <div
        className="w-6 h-6"
        onClick={() => (totalCount - reached > 0 ? numPress(page + 1) : null)}
      >
        {totalCount - reached > 0 ? <Ionicons name="chevron-forward" /> : null}
      </div>

      <div onClick={() => numPress(Math.ceil(totalCount / pageSize))}>
        <DoubleArrowRight />
      </div>
    </div>
  );
};
const NumBlock = ({
  num,
  active,
  numPress,
  cond,
}: {
  num: number;
  active?: boolean;
  numPress: (num: number) => void;
  cond: boolean;
}) => {
  const ctn = {
    isActive:
      "bg-neutral-900 text-white w-6 h-6 flex items-center justify-center rounded-[2px] cursor-pointer",
    base: "w-6 h-6 flex items-center justify-center rounded-[2px] cursor-pointer",
  };
  return (
    <div
      className={active ? ctn.isActive : ctn.base}
      onClick={() => (cond ? numPress(num) : null)}
    >
      {cond ? <p className="font-Roboto font-medium">{num}</p> : null}
    </div>
  );
};

const DoubleArrowLeft = () => {
  return (
    <div className="flex w-6 h-6 relative overflow-hidden">
      <div className="absolute -ml-1">
        <Ionicons name="chevron-back" />
      </div>
      <div className="absolute ml-1">
        <Ionicons name="chevron-back" />
      </div>
    </div>
  );
};
const DoubleArrowRight = () => {
  return (
    <div className="flex w-6 h-6 relative overflow-hidden">
      <div className="absolute -ml-1">
        <Ionicons name="chevron-forward" />
      </div>
      <div className="absolute ml-1">
        <Ionicons name="chevron-forward" />
      </div>
    </div>
  );
};

const Dots = ({ cond }: { cond: boolean }) => (
  <div className="w-6 h-6 flex items-center justify-center rounded-[2px] cursor-default">
    {cond ? <p className="font-Roboto font-medium">...</p> : null}
  </div>
);
