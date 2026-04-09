export interface ItineraryEntry {
  day_number: number;
  date: string;
  time: string;
  place_name: string;
  category: string;
  sub_category: string;
  description: string;
  cost_amount: number;
  cost_currency: string;
  rating: number;
  notes: string;
  highlight: boolean;
}

export interface ItineraryDay {
  day_number: number;
  date: string;
  entries: ItineraryEntry[];
  total_cost: number;
  highlights: ItineraryEntry[];
}
