export function getSearchParam(
  name: string,
  searchParams = window.location.search
) {
  const params = new URLSearchParams(searchParams);
  return params.get(name);
}

export default getSearchParam;
