import { useContext, useEffect, useState } from "react";
import { CategFields, EvnFields } from "../../types/event";
import { Btn, ReactCSS, Text, v, View } from "../../components/UI";
import { ViewFadeStatic } from "../../components/AnimatedLayouts";
import Context from "../../helpers/UserContext";
import {
  Ionicons,
  // SwitchLeftIcon,
  // SwitchRightIcon,
} from "../../components/Icons";
import { InfoItem, InfoLabel } from "../../components/Info";
import { BtnSecondary } from "../../components/Input";
import AsideBanner from "./AsideBanner";
import useScreen from "../../hooks/useSize";

// const scale = 1;

const InscriptionDetail = ({
  event,
  setPage,
}: {
  event: EvnFields;
  setPage: (x: number) => void;
}) => {
  const { userData } = useContext(Context);
  const [category, setCategory] = useState(event.categories[0]);

  if (!category) return null;
  const { filter, slots, price } = category;
  const { amount, limit, age_max, age_min, female, male } = filter ?? {};

  const [isKg, setIsKg] = useState(false);
  const { ww } = useScreen();
  const [scale, setScale] = useState(1);
  useEffect(() => {
    if (ww > 1024 && scale === 1) setScale(1.2);
    else if (ww < 1024 && scale == 1.2) setScale(1);
  }, [ww]);

  return (
    <div className="flex-col flex w-full md:flex-row">
      <AsideBanner
        categories={event.categories}
        {...{ category, setCategory, isKg, setIsKg, ww }}
      />
      <div className="flex flex-col flex-1 -mt-[1px] border-black border-[1px] pb-6">
        <InfoBanner />
        <div className="flex flex-col md:hidden">
          <CategLbs
            categories={event.categories}
            {...{ category, setCategory, isKg, setIsKg }}
          />
        </div>
        {/** INFO  */}
        <div className="flex flex-col w-full px-4 gap-3 lg:flex-row lg:gap-6 lg:px-10">
          <div className="flex flex-col gap-3 flex-1">
            <InfoLabel label="Detalles de Inscripcion" />
            <InfoItem
              {...{ scale }}
              Icon={Ionicons}
              icon_name="barbell"
              label="Nombre:"
              value={category.name}
            />
            <InfoItem
              {...{ scale }}
              Icon={Ionicons}
              icon_name="clipboard"
              label="Modalidad:"
              value={(amount ?? 1) <= 1 ? "Individual" : "Equipos"}
            />
            {!age_min && !age_max ? null : (
              <InfoItem
                {...{ scale }}
                Icon={Ionicons}
                icon_name="body"
                label="Edades:"
                value={
                  age_min + " - " + (age_max === 99 ? "Sin límite" : age_max)
                }
              />
            )}
            {!male && !female ? null : (
              <InfoItem
                {...{ scale }}
                Icon={Ionicons}
                icon_name="male-female"
                label="Participantes Requeridos:"
                value={getGender(male, female)}
              />
            )}

            <InfoItem
              {...{ scale }}
              Icon={Ionicons}
              icon_name="ticket"
              label="Cupos Disponibles:"
              value={((limit ?? 0) - (slots ?? 0)).toString() + " / " + limit}
            />
            <InfoItem
              {...{ scale }}
              Icon={Ionicons}
              icon_name="calendar"
              label="Inicio de Inscripciones:"
              value={event.register_time.since}
            />
            <InfoItem
              {...{ scale }}
              Icon={Ionicons}
              icon_name="calendar-number"
              label="Cierre de Inscripciones:"
              value={event.register_time.until}
            />
          </div>
          <div className="flex flex-col gap-3 flex-1">
            <InfoLabel label="Detalles de Pago" />
            <InfoItem
              {...{ scale }}
              Icon={Ionicons}
              icon_name="card"
              label="Costo:"
              value={`$${price}`}
            />
            <InfoItem
              {...{ scale }}
              Icon={Ionicons}
              icon_name="pricetags"
              label="Cuotas:"
              value={`${event.dues}`}
            />
            <InfoItem
              {...{ scale }}
              Icon={Ionicons}
              icon_name="information-circle"
              label="Detalles:"
              multiline
              value={event.details}
            />
          </div>
          <View style={{ marginTop: 24 }} />
          {userData ? (
            <>
              <BtnSecondary
                bg={v.prime}
                color="#181818"
                text="Inscribirse"
                onPress={() => setPage(3)}
                // fs={12}
              />
              <BtnSecondary
                bg="#181818"
                color={v.prime}
                text="Pagar Couta"
                onPress={() => setPage(4)}
                // fs={12}
              />
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default InscriptionDetail;

export const CategLbs = ({
  categories,
  category,
  setCategory,
  isKg,
  setIsKg,
}: {
  categories: CategFields[];
  category: CategFields;
  setCategory: React.Dispatch<React.SetStateAction<CategFields>>;
  isKg?: boolean;
  setIsKg?: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [open, setOpen] = useState(false);
  const toggle = () => setOpen(!open);
  const select = (categ: CategFields) => {
    setCategory(categ);
    setOpen(false);
  };
  return (
    <View style={st.categ_lbs}>
      {open ? (
        <ViewFadeStatic style={st.absolute_categ_ctn}>
          {categories.map((c, i) => (
            <Btn
              style={{
                ...st.categ_ctn,
                padding: "12px 0px",
                borderBottomWidth: i === categories.length - 1 ? 0 : 1,
              }}
              onPress={() => {
                select(c);
              }}
              key={c._id}
            >
              <Text style={{ fontSize: 10 }}>{c.name}</Text>
            </Btn>
          ))}
        </ViewFadeStatic>
      ) : null}
      <Btn style={st.categ_ctn} onPress={toggle}>
        <Text style={{ fontSize: 10 }}>{category.name}</Text>
        <Ionicons name="caret-down-outline" size={24} color="black" />
      </Btn>
      {setIsKg ? <BtnKgs {...{ isKg, setIsKg }} /> : null}
    </View>
  );
};

const BtnKgs = ({
  isKg,
  setIsKg,
}: {
  isKg?: boolean;
  setIsKg: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <Btn
      style={{ ...st.lbs_ctn, backgroundColor: isKg ? "#181818" : v.prime }}
      onPress={() => {
        setIsKg(!isKg);
      }}
    >
      <Text style={{ ...st.lbs, color: isKg ? v.prime : "#181818" }}>
        {isKg ? "Kgs" : "Lbs"}
      </Text>
      {isKg ? (
        <svg
          width="24"
          height="24"
          xmlns="http://www.w3.org/2000/svg"
          fillRule="evenodd"
          clipRule="evenodd"
        >
          <path d="M18 18h-12c-3.311 0-6-2.689-6-6s2.689-6 6-6h12.039c3.293.021 5.961 2.701 5.961 6 0 3.311-2.688 6-6 6zm-12-10c2.208 0 4 1.792 4 4s-1.792 4-4 4-4-1.792-4-4 1.792-4 4-4z" />
        </svg>
      ) : (
        <svg
          width="24"
          height="24"
          xmlns="http://www.w3.org/2000/svg"
          fillRule="evenodd"
          clipRule="evenodd"
        >
          <path d="M6 18h12c3.311 0 6-2.689 6-6s-2.689-6-6-6h-12.039c-3.293.021-5.961 2.701-5.961 6 0 3.311 2.688 6 6 6zm0-10h12c2.208 0 4 1.792 4 4s-1.792 4-4 4h-12c-2.208 0-4-1.792-4-4 0-2.199 1.778-3.986 3.974-4h.026zm12 1c-1.656 0-3 1.344-3 3s1.344 3 3 3 3-1.344 3-3-1.344-3-3-3z" />
        </svg>
      )}
    </Btn>
  );
};

export const InfoBanner = () => {
  return (
    <div className="flex flex-row bg-primary px-4 py-2 w-full gap-1.5 items-center border-b-1 border-black">
      <Ionicons name="information-circle-outline" size={18} color="black" />
      <p className="text-[10px] flex-1 flex-wrap lg:text-xs ">
        Todos los usuarios deberán estar registrados antes de crear el equipo
      </p>
    </div>
  );
};

const st: ReactCSS = {
  categ_lbs: {
    // marginLeft:1,
    flexDirection: "row",
    backgroundColor: v.prime,
    borderColor: "#181818",
    border: "1px solid #181818",
    borderRight: 0,
    borderLeft: 0,
    borderTop: 0,
    height: 42,
  },
  categ_ctn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flex: 14,
    padding: "6px 12px",
  },
  lbs_ctn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flex: 5,
    padding: "6px 12px",
    borderColor: "#181818",
    border: "1px solid #181818",
    borderTop: 0,
    borderRight: 0,
    borderBottom: 0,
  },
  lbs: { fontFamily: "Anton", marginTop: -4, fontSize: 12 },
  absolute_categ_ctn: {
    backgroundColor: v.prime,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    width: "100%",
    position: "absolute",
    zIndex: 200,
    top: "100%",
  },
};

const getGender = (male?: number, female?: number) => {
  let m = male === 0 || male === undefined ? undefined : `${male} M`;
  let f = female === 0 || female === undefined ? undefined : `${female} F`;
  if (!m) return f;
  else if (!f) return m;
  else return `${f} - ${f}`;
};
