import { FC, useState } from "react";

interface IProps {
  Ico: any;
  k: string;
  label: string;
  isSelected?: boolean;
  onClick: () => void;
}

const ICON_SIZE = 26;

export const Icon: FC<IProps> = (props) => {
  const { Ico, k, label, isSelected, onClick } = props;

  const [isHover, setIsHover] = useState(false);

  return (
    <div
      key={k}
      style={{
        fill: isSelected ? "white" : "inherit",
        backgroundColor: isSelected ? "#CA3C25" : "transparent",
      }}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      className="relative m-2 cursor-pointer hover:fill-primary hover:scale-110 hover:rotate-12 duration-100 p-2 rounded-full"
    >
      {isHover && (
        <div className="absolute z-20 bg-darky text-white p-2 bottom-[150%] -rotate-12 rounded -m-[40%] text-sm">
          {label}
        </div>
      )}
      <Ico size={ICON_SIZE} className="fill-inherit" onClick={onClick} />
    </div>
  );
};
