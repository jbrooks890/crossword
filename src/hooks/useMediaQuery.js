export default function useMediaQuery(
  str = "mobile",
  requestList = false,
  isQuery = false
) {
  const mobile = 480; //px
  let query;

  switch (str) {
    case "mobile":
      query = `(max-width: ${mobile}px)`;
      break;
    case "tablet":
      break;
    case "desktop":
      break;
    case "hover":
      query = "(hover:hover)";
      break;
    default:
      query = isQuery ? str : null;
  }

  return requestList
    ? window.matchMedia(query)
    : window.matchMedia(query).matches;
}
