import { useEffect, useState } from "react";
import Dropdown from "../Dropdown";
import { CategFields, EvnFields, WodFields } from "../../types/event";
import { TeamType } from "../../types/table.t";
// import { toggleUpdating } from "../../api/api_event";
import { CheckBox, InputBase, InputSelect, Line } from "../Input";
import Table from "../results/Table";
import useScreen from "../../hooks/useSize";

const EvnTable = ({
  // defaultOpen,
  event,
  wods,
  setWodInfo,
  setTeamInfo,
  // setEvent,
}: {
  defaultOpen?: boolean;
  event: EvnFields;
  wods: WodFields[];
  setWodInfo: React.Dispatch<React.SetStateAction<WodFields | undefined>>;
  setTeamInfo: React.Dispatch<React.SetStateAction<TeamType | undefined>>;
  setEvent: React.Dispatch<React.SetStateAction<EvnFields | undefined>>;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const onPress = () => setIsOpen(!isOpen);
  const [searchBar, setSearchBar] = useState("");
  const oc = (e: any) => setSearchBar(e.target.value);
  const [loading, setLoading] = useState(false);

  const [category, setCategory] = useState<CategFields>(event.categories[0]);
  const ocCateg = (t: any) => {
    setCategory(
      event.categories.find((c) => c.name === t) ?? event.categories[0]
    );
  };

  useEffect(() => {
    ocCateg(category.name);
  }, [event]);

  const toggleShowTable = async () => {
    if(false) console.log(setLoading);
    // console.log(category._id,category.name,category.updating);
    // if (!category._id) return null;
    // setLoading(true);
    // const { status, data } = await toggleUpdating(
    //   category._id,
    //   !category.updating
    // );
    // setLoading(false);
    // if (status === 200) {
    //   console.log(data);
    //   setEvent(() => {
    //     setCategory(
    //       data.categories.find((c: any) => c.name === category.name) ??
    //         data.categories[0]
    //     );
    //     return data;
    //   });
    // }
  };
  const {ww} = useScreen()
  return (
    <Dropdown title="TABLA" {...{ onPress, isOpen }}>
      <div
        style={{
          display: "flex",
          width: "100%",
          gap: 12,
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <div style={{ width: "100%", maxWidth: ww<=800?360:240 }}>
          <InputSelect
            value={category.name}
            onChange={ocCateg}
            options={event.categories.map((c) => c.name)}
            label="Categoria"
          />
        </div>
        <div style={{ width: "100%", maxWidth: ww<=800?360:240 }}>
          <InputBase
            value={searchBar}
            onChange={oc}
            label="Buscar Equipo..."
            ph="Ej: Team Exodus"
          />
        </div>
        <div style={{ alignSelf: "flex-end", marginBottom: 6 }}>
          <CheckBox
            value={!category.updating}
            onChange={toggleShowTable}
            label="Mostrar Resultados"
            loading={loading}
          />
        </div>
      </div>
      <Line />
      <Table
        {...{
          category,
          wods,
          kg: false,
          searchBar,
          setWodInfo,
          setTeamInfo,
          admin: true,
        }}
      />
    </Dropdown>
  );
};

export default EvnTable;
