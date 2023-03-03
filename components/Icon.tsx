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
      className="relative m-2 cursor-pointer rounded-full p-2 duration-100 hover:rotate-12 hover:scale-110 hover:fill-primary"
    >
      {isHover && (
        <div className="absolute bottom-[150%] z-20 -m-[40%] -rotate-12 rounded bg-darky p-2 text-sm text-white">
          {label}
        </div>
      )}
      <Ico size={ICON_SIZE} className="fill-inherit" onClick={onClick} />
    </div>
  );
};
