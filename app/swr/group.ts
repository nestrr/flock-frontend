import useSWR, { type SWRConfiguration } from "swr";
import { type Group as GroupType } from "../dashboard/new-group/group-context";
import { type Profile } from "./profile";

const defaultOptions: SWRConfiguration = {
  onErrorRetry: (error, key, _config, _revalidate, { retryCount }) => {
    // Never retry on 404.
    if (error.status === 404) return;

    // Only retry up to 2 times.
    if (retryCount >= 2) return;
  },
  revalidateIfStale: false,
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
export type Group = Omit<GroupType, "creatorId"> & {
  adminId: string;
  id: string;
};
export function useSelfGroups(accessToken: string | undefined, status: string) {
  const { data, error, mutate, isLoading } = useSWR<Group[]>(
    fetchCheck(
      !!accessToken && !!status,
      accessToken,
      `/group/me?status=${status}`
    ),
    ([url, accessToken]: [url: string, accessToken: string]) =>
      fetcher(url, accessToken),
    defaultOptions
  );
  return {
    data,
    mutate,
    error,
    isLoading,
  };
}
export function useGroupMembers(
  accessToken: string | undefined,
  groupId: string
) {
  const { data, error, mutate, isLoading } = useSWR<Profile[]>(
    fetchCheck(
      !!accessToken && !!groupId,
      accessToken,
      `/group-member/${groupId}`
    ),
    ([url, accessToken]: [url: string, accessToken: string]) =>
      fetcher(url, accessToken),
    defaultOptions
  );

  return {
    data,
    mutate,
    error,
    isLoading,
  };
}

export type Invite = {
  personId: string;
  groupId: string;
  email: string;
  name: string;
  image: string;
  status: string;
};
export function useInvites(accessToken: string | undefined, groupId: string) {
  const { data, error, mutate, isLoading } = useSWR<Invite[]>(
    fetchCheck(
      !!accessToken && !!groupId,
      accessToken,
      `/group-invite/${groupId}`
    ),
    ([url, accessToken]: [url: string, accessToken: string]) =>
      fetcher(url, accessToken),
    defaultOptions
  );

  return {
    data,
    mutate,
    error,
    isLoading,
  };
}
