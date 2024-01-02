import { useSnapshot } from "valtio";
import state from "../store";
import { TabProps } from "../types/types";

const Tab = ({ tab, isFiltered, isActiveTab, handleClick }: TabProps) => {
  const snap = useSnapshot(state);

  const ActiveStyles =
    isFiltered && isActiveTab
      ? {
          backgroundColor: snap.color,
          opacity: 0.5,
        }
      : { backgroundColor: "transparent", opacity: 1 };

  return (
    <div
      key={tab.name}
      className={`tab-btn ${
        isFiltered ? "rounded-full glassmorhism" : `rounded-4`
      }`}
      onClick={handleClick}
      style={ActiveStyles}
    >
      <img
        src={tab.icon}
        alt={tab.name}
        className={
          isFiltered ? "w-2/3 h-2/3" : "w-11/12 h-11/12" + " object-contain"
        }
      />
    </div>
  );
};

export default Tab;
