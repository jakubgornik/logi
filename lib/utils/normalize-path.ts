export function normalizePath(pathname: string): string {
  const isId = (segment: string) => {
    return /^\d+$/.test(segment) || segment.length > 15;
  };

  return (
    "/" +
    pathname
      .split("/")
      .filter((segment) => segment !== "")
      .map((segment) => (isId(segment) ? "[id]" : segment))
      .join("/")
  );
}
