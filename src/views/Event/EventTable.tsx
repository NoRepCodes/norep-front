import { useState } from "react";
import { CategFields, EvnFields, WodFields } from "../../types/event";
import { TeamType } from "../../types/table.t";
import { CategLbs } from "./InscriptionDetails";
import Table from "../../components/results/Table";

const EventTable = ({
  event,
  wods,
  setWodInfo,
  setTeamInfo,
  isKg, setIsKg
}: {
  event: EvnFields;
  wods: WodFields[];
  setWodInfo: SetWodInfo;
  setTeamInfo: SetTeamInfo;
  isKg:boolean;
  setIsKg:SetKg
}) => {
  const [category, setCategory] = useState<CategFields>(event.categories[0]);
  // const [isKg, setIsKg] = useState(false);
  const [searchBar, setSearchBar] = useState("");

  return (
    <div className="flex flex-col w-full relative overflow-hidden">
      <input
        onChange={(e) => {
          setSearchBar(e.target.value);
        }}
        value={searchBar}
        placeholder="Buscar Equipo..."
        className="w-full border-1 border-t-0 text-xs px-3 min-h-8.5 md:border-l-0 md:hidden"
      />
      <div className="border-x-1 md:border-l-0 md:hidden z-1200" >
        <CategLbs
          categories={event.categories}
          {...{ category, setCategory, isKg, setIsKg }}
        />
      </div>
      <Table
        {...{ category, wods, kg:isKg, searchBar, setWodInfo, setTeamInfo }}
      />
    </div>
  );
};


export default EventTable;
type SetWodInfo = React.Dispatch<React.SetStateAction<WodFields | undefined>>;
type SetTeamInfo = React.Dispatch<React.SetStateAction<TeamType | undefined>>;
type SetKg = React.Dispatch<React.SetStateAction<boolean >>;
