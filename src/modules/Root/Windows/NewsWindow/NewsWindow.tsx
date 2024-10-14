import { FC, useMemo, useState } from "react";
import { WindowChildrenProps } from "@/modules/Window";
import { useNewsData } from "./data";
import { useScopedI18n } from "@/lib/locales/client";

export const NewsWindow: FC<WindowChildrenProps> = () => {
  const data = useNewsData();
  const t = useScopedI18n("news");

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
      <h1 className="text-3xl font-bold">{t("title")}</h1>
      <div className="flex items-center justify-end gap-4">
        <label className="whitespace-nowrap text-sm text-neutral-200">
          {t("sortBy")}
        </label>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as SortOrder)}
          className="block w-full rounded-lg border border-neutral-600/50 bg-neutral-700 p-2 text-sm text-neutral-200 focus:border-neutral-600"
        >
          <option selected value={SortOrder.MostRecent}>
            {t("mostRecent")}
          </option>
          <option value={SortOrder.Oldest}>{t("oldest")}</option>
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
