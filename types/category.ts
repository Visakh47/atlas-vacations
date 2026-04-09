export interface Category {
  category_id: string;
  category_name: string;
  emoji: string;
  hex_color: string;
}

export interface SubCategory {
  parent_category_id: string;
  sub_category_id: string;
  sub_category_name: string;
  emoji: string;
}
