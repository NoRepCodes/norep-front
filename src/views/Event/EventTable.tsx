import { useState } from "react";
import { CategFields, EvnFields, WodFields } from "../../types/event";
import { TeamType } from "../../types/table.t";
import { ReactCSS, View } from "../../components/UI";
import { InputBase } from "../../components/Input";
import { CategLbs } from "./InscriptionDetails";

const EventTable = ({
  event,
  wods,
  setWodInfo,
  setTeamInfo,
}: {
  event: EvnFields;
  wods: WodFields[];
  setWodInfo: SetWodInfo;
  setTeamInfo: SetTeamInfo;
}) => {
  const [category, setCategory] = useState<CategFields>(event.categories[0]);
  const [isKg, setIsKg] = useState(false);
  const [searchBar, setSearchBar] = useState("");

  return (
    <>
        <input
          onChange={(e) => {
            setSearchBar(e.target.value);
          }}
          value={searchBar}
          placeholder="Buscar Equipo..."
          style={st.searchBar}
        />
      <CategLbs
        categories={event.categories}
        {...{ category, setCategory, isKg, setIsKg }}
      />
      <View style={{ marginTop: -1 }} />
      {/* <Table
        {...{ category, wods, isKg, searchBar, setWodInfo, setTeamInfo }}
      /> */}
    </>
  );
};

const st: ReactCSS = {
  searchBar: {
    width: "calc(100vw - 24px)",
    border: "1px solid #181818",
    borderTop:0,
    fontSize: 10,
    padding: "0px 12px",
    minHeight: 38,
    boxSizing:'border-box'
  },
  header: {
    flexDirection: "row",
    padding: "16px 12px",
    borderBottomWidth: 1,
  },
  box: {
    borderWidth: 1,
    flex: 1,
    width: "calc(100vw - 24px)",
    alignSelf: "flex-start",
    flexDirection: "row",
  },
  text: {
    width: 80,
    fontSize: 10,
  },
  results_ctn: {
    paddingRight: 100,
    width: "100%",
  },
};

export default EventTable;
type SetWodInfo = React.Dispatch<React.SetStateAction<WodFields | undefined>>;
type SetTeamInfo = React.Dispatch<React.SetStateAction<TeamType | undefined>>;

