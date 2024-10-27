"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { v4 as uuidv4 } from "uuid";

interface UserContextType {
  username: string | null;
  userId: string | null;
  setUsername: (username: string) => void;
  setUserId: (userId: string) => void;
}

const ChatUserContext = createContext<UserContextType | undefined>(undefined);

export const ChatUserProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [username, setUsername] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    if (localStorage) {
      setUsername(localStorage.getItem("username") || null);
      setUserId(localStorage.getItem("userId") || null);
    }
  }, []);

  useEffect(() => {
    if (username) {
      localStorage.setItem("username", username);
    }
  }, [username]);

  useEffect(() => {
    if (userId) {
      localStorage.setItem("userId", userId);
    }
  }, [userId]);

  const updateUsername = (newUsername: string) => {
    setUsername(newUsername);
    localStorage.setItem("username", newUsername);
  };

  const updateUserId = (newUserId: string) => {
    setUserId(newUserId);
    localStorage.setItem("userId", newUserId);
  };

  return (
    <ChatUserContext.Provider
      value={{
        username,
        userId,
        setUsername: updateUsername,
        setUserId: updateUserId,
      }}
    >
      {children}
    </ChatUserContext.Provider>
  );
};

export const useChatUserContext = (): UserContextType => {
  const context = useContext(ChatUserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

export const useSetupChatUser = () => {
  const { setUsername, setUserId, userId } = useChatUserContext();

  const setupUser = (newUsername: string) => {
    setUsername(newUsername);
    if (!userId) {
      setUserId(uuidv4());
    }
  };

  return setupUser;
};

export const useChatUser = () => {
  const { username, userId } = useChatUserContext();

  return {
    username,
    userId,
    isSetup: !!username && !!userId,
  };
};
