export const to12Hour = (timestamp: string) => {
  const [hours, minutes] = timestamp.split(":");
  const date = new Date();
  date.setHours(parseInt(hours));
  date.setMinutes(parseInt(minutes));
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

export const toDate = (timestamp: string) => {
  const [hours, minutes] = timestamp.split(":");
  const date = new Date();
  date.setHours(parseInt(hours));
  date.setMinutes(parseInt(minutes));
  return date;
};
