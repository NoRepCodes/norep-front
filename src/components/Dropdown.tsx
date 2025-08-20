import { PropsWithChildren, useState } from "react";
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
  selfBehaviour?:boolean
};
const Dropdown = ({
  children,
  title,
  // small = false,
  onPress,
  isOpen,
  isLoading,
  selfBehaviour,
}: DropdownP) => {
  const [selfOpen, setSelfOpen] = useState(false)
  const toggle = ()=>setSelfOpen(!selfOpen)
  return (
    <>
      <div className="dropdown" onClick={onPress?onPress:toggle}>
        <h6 >{title}</h6>
        {isLoading ? (
          <IconLoad />
        ) : (
          <div style={{ transform: `rotate(${isOpen ? 0 : 90}deg)` }}>
            <Ionicons name="caret-down-outline" size={36} color="black" />
          </div>
        )}
      </div>
      {(isOpen && !isLoading)||(selfBehaviour && selfOpen) ? (
        <ViewFadeStatic className="dropdown_child_ctn">
          {children}
        </ViewFadeStatic>
      ) : null}
    </>
  );
};

export default Dropdown;
