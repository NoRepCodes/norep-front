import { PropsWithChildren } from "react";
import "../sass/dropdown.sass";
import { IconLoad, Ionicons } from "./Icons";
import { ViewFadeStatic } from "./AnimatedLayouts";
type DropdownP = PropsWithChildren & {
  defaultOpen?: boolean;
  title: string;
  small?: boolean;
  onPress?: () => void;
  isLoading?: boolean;
  isOpen: boolean;
};
const Dropdown = ({
  children,
  title,
  small = false,
  onPress,
  isOpen,
  isLoading,
}: DropdownP) => {
  return (
    <>
      <div className="dropdown" onClick={onPress}>
        <h6>{title}</h6>
        {isLoading ? (
          <IconLoad />
        ) : (
          <div style={{ transform: `rotate(${isOpen ? 0 : 90}deg)` }}>
            <Ionicons name="caret-down-outline" size={36} color="black" />
          </div>
        )}
      </div>
      {isOpen && !isLoading ? (
        <ViewFadeStatic className="dropdown_child_ctn">
          {children}
        </ViewFadeStatic>
      ) : null}
    </>
  );
};

export default Dropdown;
