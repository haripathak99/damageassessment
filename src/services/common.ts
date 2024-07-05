export const fetchData = (payload: RequestInit) =>
  fetch("https://", payload).then((response) => response.json());
