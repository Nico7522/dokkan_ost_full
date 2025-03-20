export interface Card {
  id: number;
  name: string;
  class: string;
  type: string;
  thumb: number;
  isLegendary: boolean;
}

export interface CardDetails extends Card {
  entranceBgmId: number | null;
  asBgmId: number | null;
}
