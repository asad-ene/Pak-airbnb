export type SearchParams = {
  destinationSlug: string;
  destinationName: string;
  checkIn: string;
  checkOut: string;
  guests: number;
};

export const defaultSearchParams = (): SearchParams => {
  const today = new Date();
  const checkIn = new Date(today);
  checkIn.setDate(checkIn.getDate() + 7);
  const checkOut = new Date(checkIn);
  checkOut.setDate(checkOut.getDate() + 3);

  return {
    destinationSlug: "",
    destinationName: "",
    checkIn: checkIn.toISOString().split("T")[0],
    checkOut: checkOut.toISOString().split("T")[0],
    guests: 2,
  };
};

export function isSearchComplete(params: SearchParams): boolean {
  return Boolean(
    params.destinationSlug &&
      params.checkIn &&
      params.checkOut &&
      params.guests > 0
  );
}
