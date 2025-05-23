import { useState } from "react";
import {
  Ionicons,
  SwitchLeftIcon,
  SwitchRightIcon,
} from "../../components/Icons";
import { v, View } from "../../components/UI";
import { CategFields } from "../../types/event";

const AsideBanner = ({
  categories,
  category,
  setCategory,
  isKg,
  setIsKg,
}: {
  categories: CategFields[];
  category: CategFields;
  setCategory: React.Dispatch<React.SetStateAction<CategFields>>;
  isKg: boolean;
  setIsKg: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <View style={{ display: "flex", width: 240 }}>
      <View
        style={{
          backgroundColor: v.prime,
          borderLeft: "1px solid black",
          borderBottom: "1px solid black",
        }}
      >
        <View style={{ padding: "24px 12px" }}>
          <p style={{ fontSize: 24, fontFamily: "Anton" }}>CATEGORIAS</p>
        </View>
        <View
          style={{
            position: "relative",
          }}
        >
          <View
            onClick={() => {
              setOpen(!open);
            }}
            style={{
              cursor: "pointer",
              borderTop: "1px solid black",
              padding: "16px 12px",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <p>{category.name}</p>
            <Ionicons name="caret-down-outline" />
          </View>
          {!open ? null : (
            <View
              style={{
                position: "absolute",
                backgroundColor: v.prime,
                top: "calc(100% + 1px)",
                left: -1,
                width: "calc(100% + 1px)",
                borderLeft: "1px solid #181818",
                boxSizing: "border-box",
              }}
            >
              {categories.map((c) => (
                <p style={{
                    cursor:'pointer',
                    padding:'16px 12px',
                    borderBottom:'1px solid #181818'
                }} key={c._id}>{c.name}</p>
              ))}
            </View>
          )}
        </View>
        <View
          style={{
            cursor: "pointer",
            borderTop: "1px solid black",
            padding: "16px 12px",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: isKg ? v.four : v.prime,
          }}
          onClick={() => {
            setIsKg(!isKg);
          }}
        >
          <h6 style={{ color: !isKg ? v.four : v.prime }}>
            {!isKg ? "Lbs" : "Kgs"}
          </h6>
          {!isKg ? (
            <SwitchLeftIcon size={24} />
          ) : (
            <SwitchRightIcon size={24} color={v.prime} />
          )}
        </View>
      </View>
    </View>
  );
};

export default AsideBanner;
