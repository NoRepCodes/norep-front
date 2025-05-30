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
    <div className="flex-col w-60 hidden md:flex">
      <div className="flex flex-col bg-primary border-l-1 border-b-1 border-black">
        <View style={{ padding: "24px 12px" }}>
          <p style={{ fontSize: 24, fontFamily: "Anton" }}>CATEGORIAS</p>
        </View>
        <div className="flex flex-col relative">
          <div
            onClick={() => setOpen(!open)}
            className="flex justify-between items-center pointer border-t-1 border-black px-3 py-4 "
          >
            <p>{category.name}</p>
            <Ionicons name="caret-down-outline" />
          </div>
          {!open ? null : (
            <div
              className="flex flex-col absolute bg-primary -left-[1px] border-l-1 border-black box-border"
              style={{
                width: "calc(100% + 1px)",
                top: "calc(100% + 1px)",
              }}
            >
              {categories.map((c) => (
                <p
                  className="pointer px-3 py-4 border-b-1 border-black"
                  onClick={() => {
                    setCategory(c);
                    setOpen(false);
                  }}
                  key={c._id}
                >
                  {c.name}
                </p>
              ))}
            </div>
          )}
        </div>
        <div
          className="pointer border-t-1 border-black px-3 py-4 flex flex-row justify-between items-center"
          style={{ backgroundColor: isKg ? v.four : v.prime }}
          onClick={() => setIsKg(!isKg)}
        >
          <h6 style={{ color: !isKg ? v.four : v.prime }}>
            {!isKg ? "Lbs" : "Kgs"}
          </h6>
          {!isKg ? (
            <SwitchLeftIcon size={24} />
          ) : (
            <SwitchRightIcon size={24} color={v.prime} />
          )}
        </div>
      </div>
    </div>
  );
};

export default AsideBanner;
