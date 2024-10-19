import { FC, useMemo, useState } from "react";
import { WindowChildrenProps } from "@/modules/Window";
import { useNewsData } from "./data";
import { useScopedI18n } from "@/lib/locales/client";
import { motion, AnimatePresence } from "framer-motion";

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
    <motion.div
      className="flex size-full flex-col gap-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        className="flex items-center justify-end gap-4"
        initial={{ x: 20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as SortOrder)}
          className="block w-full rounded-lg border border-neutral-600/50 bg-neutral-700 p-2 text-sm text-neutral-200 focus:border-neutral-600"
        >
          <option value={SortOrder.MostRecent}>{t("mostRecent")}</option>
          <option value={SortOrder.Oldest}>{t("oldest")}</option>
        </select>
      </motion.div>
      <motion.div
        className="flex size-full flex-col items-center gap-4 overflow-y-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <AnimatePresence>
          {sortedData.map((newItem, index) => (
            <motion.div
              key={newItem.title}
              className="flex w-full flex-col gap-2 rounded-lg border border-neutral-600/50 p-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
            >
              <h2 className="text-lg font-bold text-neutral-300">
                {newItem.title}
              </h2>
              <p className="text-neutral-200">{newItem.description}</p>
              <p className="text-sm text-neutral-600">
                {new Date(newItem.date).toLocaleDateString()}
              </p>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};
