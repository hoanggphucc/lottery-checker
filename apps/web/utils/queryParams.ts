import queryString from "query-string";

interface UrlQueryParams {
  params: string;
  key: string;
  value: string | null;
  pathname: string;
}

export const formUrlQuery = ({
  params,
  key,
  value,
  pathname,
}: UrlQueryParams) => {
  const currentUrl = queryString.parse(params);

  currentUrl[key] = value as string;

  return `${pathname}?${queryString.stringify(currentUrl)}`;
};
