import { motion, AnimatePresence } from "framer-motion";
import { Loader } from "lucide-react";
import { FC, useMemo, useState } from "react";

import { useScopedI18n } from "@/lib/locales/client";

import { useSubscribeToNews } from "../../appwrite";

import { useNewsData } from "./data";

export const NewsWindow: FC = () => {
  const [emailInput, setEmailInput] = useState("");
  const [hasBeenSubscribed, setHasBeenSubscribed] = useState(false);
  const { subscribeEmail, error, isLoading } = useSubscribeToNews();

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

  const handleSubscribe = async () => {
    await subscribeEmail(emailInput);
    setHasBeenSubscribed(true);
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSubscribe();
    }
  };

  return (
    <motion.div
      className="relative flex size-full flex-col gap-4"
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
              <p className="text-sm text-neutral-400">
                {new Date(newItem.date).toLocaleDateString()}
              </p>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="flex h-[56px] w-full items-center gap-2"
      >
        {hasBeenSubscribed && !error && (
          <p className="w-full text-center text-base font-bold text-neutral-300">
            {t("subscribed")}
          </p>
        )}
        {error?.length && (
          <p className="w-full text-center text-base text-red-500">{error}</p>
        )}
        {!hasBeenSubscribed && !error ? (
          <div className="relative flex grow items-center gap-2">
            <input
              type="email"
              id="emailInput"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              onKeyUp={handleKeyUp}
              disabled={hasBeenSubscribed}
              placeholder={t("emailPlaceholder")}
              className="h-11 w-full rounded-lg border border-neutral-600/50 bg-neutral-700 p-2 text-sm text-neutral-200"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSubscribe}
              className="flex h-10 w-24 items-center justify-center rounded-lg bg-neutral-600 px-4 py-1 text-sm text-white"
            >
              {isLoading ? <Loader className="animate-spin" /> : t("subscribe")}
            </motion.button>
          </div>
        ) : (
          <></>
        )}
      </motion.div>
    </motion.div>
  );
};
