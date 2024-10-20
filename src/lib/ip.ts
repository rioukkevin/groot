export const getIp = async () => {
  const response = await fetch("/api/ip");
  const ip = await response.text();
  return ip;
};
