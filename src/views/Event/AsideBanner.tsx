import { useState } from "react";
import {
  Ionicons,
  SwitchLeftIcon,
  SwitchRightIcon,
} from "../../components/Icons";
import { v } from "../../components/UI";
import { CategFields } from "../../types/event";
import arw from '../../images/arw.jpg'

const AsideBanner = ({
  categories,
  category,
  setCategory,
  isKg,
  setIsKg,
}: {
  categories: CategFields[];
  category: CategFields|undefined;
  setCategory: React.Dispatch<React.SetStateAction<CategFields|undefined>>;
  isKg: boolean;
  setIsKg: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex-col min-w-[241px] hidden md:flex 2xl:min-w-[301px]">
      <div className="flex flex-col bg-primary border-x-1 border-b-1 border-black">
        <div className="px-3 py-6">
          <p style={{ fontSize: 24, fontFamily: "Anton" }}>CATEGORIAS</p>
        </div>
        <div className="flex flex-col relative">
          <div
            onClick={() => setOpen(!open)}
            className="flex justify-between items-center pointer border-t-1 border-black px-3 py-4 cursor-pointer"
          >
            <p>{category?category.name:''}</p>
            <Ionicons name="caret-down-outline" />
          </div>
          {!open ? null : (
            <div
              className="flex flex-col absolute bg-primary -left-[1px] border-l-1 border-black box-border cursor-pointer "
              style={{
                width: "calc(100% + 1px)",
                top: "calc(100% + 1px)",
              }}
            >
              {categories.map((c) => (
                <p
                  className="pointer px-3 py-4 border-b-1 border-r-1 border-black hover:bg-dark hover:text-primary"
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
          className="pointer border-t-1 border-black px-3 py-4 flex flex-row justify-between items-center cursor-pointer"
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
      <div className="w-[241px] mt-10 2xl:w-[301px]">
        <img src={arw} alt="arawak" />
      </div>
    </div>
  );
};

export default AsideBanner;
