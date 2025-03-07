import dayjs from "dayjs";
import objectSupport from "dayjs/plugin/objectSupport";
import { TIME_REGEX } from "../profile/shared/constants";
import type { Timeslot } from "../swr/profile";
dayjs.extend(objectSupport);

/**
 * Normalizes times shown in timeslot to 12-hour clock format.
 * @param timeslot A timeslot with `from` and `to` times written in 24-hour clock format
 * @returns A timeslot with `from` and `to` times written in 12-hour clock format.
 */
export function normalizeTimeslot(timeslot: Timeslot) {
  const { from, to, ...rest } = timeslot;
  if (from.match(TIME_REGEX)) {
    // If timeslots already formatted correctly, no need to reformat
    return {
      ...rest,
      from,
      to,
    };
  }

  return {
    ...rest,
    from: dayjs({
      hour: from.split(":")[0],
      minute: from.split(":")[1],
    }).format("hh:mm A"),
    to: dayjs({
      hour: to.split(":")[0],
      minute: to.split(":")[1],
    }).format("hh:mm A"),
  };
}
