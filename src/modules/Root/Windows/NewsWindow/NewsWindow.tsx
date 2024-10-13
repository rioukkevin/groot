import { FC, useMemo, useState } from "react";
import { data } from "./data";
import { WindowChildrenProps } from "@/modules/Window";

export const NewsWindow: FC<WindowChildrenProps> = () => {
  enum SortOrder {
    MostRecent = "mostRecent",
    Oldest = "oldest",
  }

  const [sortBy, setSortBy] = useState<SortOrder>(SortOrder.MostRecent);

  const sortedData = useMemo(() => {
    return data.sort((a, b) => {
      return sortBy === SortOrder.MostRecent
        ? b.date.localeCompare(a.date)
        : a.date.localeCompare(b.date);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortBy]);

  return (
    <div className="flex size-full flex-col gap-4">
      <h1 className="text-3xl font-bold">News</h1>
      <div className="flex items-center justify-end gap-4">
        <label className="whitespace-nowrap text-sm text-neutral-200">
          Sort by:
        </label>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as SortOrder)}
          className="block w-full rounded-lg border border-neutral-600/50 bg-neutral-700 p-2 text-sm text-neutral-200 focus:border-neutral-600"
        >
          <option selected value={SortOrder.MostRecent}>
            Most recent
          </option>
          <option value={SortOrder.Oldest}>Oldest</option>
        </select>
      </div>
      <div className="flex size-full flex-col items-center gap-4 overflow-y-auto">
        {sortedData.map((newItem) => (
          <div
            key={newItem.title}
            className="flex w-full flex-col gap-2 rounded-lg border border-neutral-600/50 p-4"
          >
            <h2 className="text-lg font-bold">{newItem.title}</h2>
            <p>{newItem.description}</p>
            <p className="text-sm text-neutral-500">
              {new Date(newItem.date).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
