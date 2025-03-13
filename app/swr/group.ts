import useSWR, { type SWRConfiguration } from "swr";
import { type Group } from "../dashboard/group/group-context";

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

export function useGroups(accessToken: string | undefined) {
  const { data, error, mutate, isLoading } = useSWR<Group>(
    fetchCheck(!!accessToken, accessToken, "/groups/me"),
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
