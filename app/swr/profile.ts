import { type User } from "next-auth";
import { type DAYS } from "@/app/shared/constants";

import useSWR, { type SWRConfiguration } from "swr";

export type Campus = {
  id: string;
  name: string;
  description: string;
};
export interface Timeslot {
  id: string;
  from: string;
  to: string;
  reliability: number;
  flexibility: number;
}
export interface Degree {
  id: string;
  programName: string;
  programCode: string;
  degreeTypeCode: string;
  degreeTypeName: string;
}
export interface DegreeType {
  code: string;
  name: string;
}
export interface Program {
  code: string;
  name: string;
}
export interface Standing {
  id: string;
  name: string;
}
export type Day = (typeof DAYS)[number];
export interface Profile extends User {
  name: string;
  id: string;
  email: string;
  image: string;
  bio: string;
  standing: Standing;
  degree: Degree;
  firstLogin: boolean;
  roles: string[];
  campusChoices: Campus[];
  preferredTimes: Record<Day, Timeslot[]>;
}
const defaultOptions: SWRConfiguration = {
  onErrorRetry: (error, key, _config, _revalidate, { retryCount }) => {
    // Never retry on 404.
    if (error.status === 404) return;

    // Only retry up to 2 times.
    if (retryCount >= 2) return;
  },
};

const fetcher = async (url: string, token: string) => {
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  if (!response.ok)
    throw Error(
      `Failed to fetch ${url}: ${response.status} ${response.statusText}`
    );
  return await response.json();
};

function fetchCheck(
  condition: boolean,
  accessToken: string | undefined,
  subpath: string = ""
) {
  return condition
    ? [`${process.env.NEXT_PUBLIC_API_URL!}${subpath}`, accessToken]
    : null;
}

export function useSelfProfile(accessToken: string | undefined) {
  const { data, error, isLoading } = useSWR<User>(
    fetchCheck(!!accessToken, accessToken, "/profile/me"),
    ([url, accessToken]: [url: string, accessToken: string]) =>
      fetcher(url, accessToken),
    defaultOptions
  );

  return {
    data,
    error,
    isLoading,
  };
}

export function useStandings(accessToken: string | undefined) {
  const { data, error, isLoading } = useSWR<Array<Standing>>(
    fetchCheck(!!accessToken, accessToken, "/standing"),
    ([url, accessToken]: [url: string, accessToken: string]) =>
      fetcher(url, accessToken),
    defaultOptions
  );

  return {
    data,
    error,
    isLoading,
  };
}

export function useDegreeTypes(accessToken: string | undefined) {
  const { data, error, isLoading } = useSWR<Array<DegreeType>>(
    fetchCheck(!!accessToken, accessToken, "/degree-type"),
    ([url, accessToken]: [url: string, accessToken: string]) =>
      fetcher(url, accessToken),
    defaultOptions
  );

  return {
    data,
    error,
    isLoading,
  };
}

export function usePrograms(accessToken?: string, degreeType?: string) {
  const { data, error, isLoading } = useSWR<Array<Program>>(
    fetchCheck(
      !!accessToken && !!degreeType,
      accessToken,
      `/program?degreeType=${encodeURIComponent(degreeType!)}`
    ),
    ([url, accessToken]: [url: string, accessToken: string]) =>
      fetcher(url, accessToken),
    defaultOptions
  );

  return {
    data,
    error,
    isLoading,
  };
}

export function useProgram(accessToken?: string, programCode?: string) {
  const { data, error, isLoading } = useSWR<Program>(
    fetchCheck(
      !!accessToken && !!programCode,
      accessToken,
      `/program/${encodeURIComponent(programCode!)}`
    ),
    ([url, accessToken]: [url: string, accessToken: string]) =>
      fetcher(url, accessToken),
    defaultOptions
  );

  return {
    data,
    error,
    isLoading,
  };
}

export function useCampus(accessToken?: string, campusId?: string) {
  const { data, error, isLoading } = useSWR<Campus>(
    fetchCheck(
      !!accessToken && !!campusId,
      accessToken,
      `/campus/${encodeURIComponent(campusId!)}`
    ),
    ([url, accessToken]: [url: string, accessToken: string]) =>
      fetcher(url, accessToken),
    defaultOptions
  );

  return {
    data,
    error,
    isLoading,
  };
}

export function useStanding(accessToken?: string, standingId?: string) {
  const { data, error, isLoading } = useSWR<Standing>(
    fetchCheck(
      !!accessToken && !!standingId,
      accessToken,
      `/standing/${encodeURIComponent(standingId!)}`
    ),
    ([url, accessToken]: [url: string, accessToken: string]) =>
      fetcher(url, accessToken),
    defaultOptions
  );
  return {
    data,
    error,
    isLoading,
  };
}

export function useCampuses(accessToken?: string) {
  const { data, error, isLoading } = useSWR<Array<Campus>>(
    fetchCheck(!!accessToken, accessToken, `/campus`),
    ([url, accessToken]: [url: string, accessToken: string]) =>
      fetcher(url, accessToken),
    defaultOptions
  );

  return {
    data: !!data
      ? (data.reduce(
          (acc, campus) => ({ ...acc, [campus.id]: campus }),
          {}
        ) as Record<string, Campus>)
      : ({} as Record<string, Campus>),
    error,
    isLoading,
  };
}
