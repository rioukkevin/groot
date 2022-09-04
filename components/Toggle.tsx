import { FC, useState } from "react";

interface IProps {
  onChecked: (value: boolean) => void;
  label?: string;
}

export const Toggle: FC<IProps> = (props) => {
  const { onChecked, label } = props;

  const [toggled, setToggled] = useState(false);

  const handleChange = (e: any) => {
    setToggled(e.target.checked);
    onChecked(e.target.checked);
  };

  return (
    <label
      htmlFor="red-toggle"
      className="relative mr-5 inline-flex cursor-pointer items-center"
    >
      <input
        type="checkbox"
        id="red-toggle"
        className="peer sr-only"
        checked={toggled}
        onChange={handleChange}
      />
      <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:top-0.5 after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:ring-0 dark:bg-gray-700"></div>
      <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-900">
        {label}
      </span>
    </label>
  );
};
