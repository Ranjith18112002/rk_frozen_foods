import categories from "../../shared/categories.json";

export type ProductType = "veg" | "non-veg";

export type Product = {
  id: number;
  name: string;
  category: string;
  type: ProductType;
  weight: string;
  price: number;
  description: string;
  image: string;
};

const categoryImage = (slug: string) =>
  categories.find((category) => category.slug === slug)?.image ?? "";

export const products: Product[] = [
  {
    id: 1,
    name: "Vegetable Samosas",
    category: "samosas-rolls",
    type: "veg",
    weight: "500g",
    price: 120,
    description: "Crisp pastry filled with a spiced vegetable mix.",
    image: categoryImage("samosas-rolls"),
  },
  {
    id: 2,
    name: "Chicken Rolls",
    category: "samosas-rolls",
    type: "non-veg",
    weight: "500g",
    price: 280,
    description: "Savoury chicken rolls, ready to cook from frozen.",
    image: categoryImage("samosas-rolls"),
  },
  {
    id: 3,
    name: "Vegetable Tikkis",
    category: "kebabs-tikkis",
    type: "veg",
    weight: "500g",
    price: 150,
    description: "Golden potato and vegetable tikkis for easy snacking.",
    image: categoryImage("kebabs-tikkis"),
  },
  {
    id: 4,
    name: "Chicken Kebabs",
    category: "kebabs-tikkis",
    type: "non-veg",
    weight: "500g",
    price: 350,
    description: "Seasoned chicken kebabs, ready for the grill or pan.",
    image: categoryImage("kebabs-tikkis"),
  },
  {
    id: 5,
    name: "Chicken Nuggets",
    category: "nuggets-popcorn",
    type: "non-veg",
    weight: "500g",
    price: 220,
    description: "Crispy chicken nuggets, ready to cook from frozen.",
    image: categoryImage("nuggets-popcorn"),
  },
  {
    id: 6,
    name: "Frozen French Fries",
    category: "fries-potato",
    type: "veg",
    weight: "500g",
    price: 150,
    description: "Crispy golden fries for a quick and easy snack.",
    image: categoryImage("fries-potato"),
  },
  {
    id: 7,
    name: "Aloo Parathas",
    category: "parathas-breads",
    type: "veg",
    weight: "500g",
    price: 180,
    description: "Stuffed parathas ready to heat on a pan.",
    image: categoryImage("parathas-breads"),
  },
  {
    id: 8,
    name: "Vegetable Momos",
    category: "momos-dumplings",
    type: "veg",
    weight: "500g",
    price: 240,
    description: "Vegetable-filled dumplings, ready to steam or pan-fry.",
    image: categoryImage("momos-dumplings"),
  },
  {
    id: 9,
    name: "Chicken Burger Patties",
    category: "patties-cutlets",
    type: "non-veg",
    weight: "500g",
    price: 320,
    description: "Juicy chicken patties for burgers and quick meals.",
    image: categoryImage("patties-cutlets"),
  },
  {
    id: 10,
    name: "Ready-to-Cook Vegetable Meal",
    category: "ready-to-cook",
    type: "veg",
    weight: "500g",
    price: 250,
    description: "A convenient frozen meal, ready in minutes.",
    image: categoryImage("ready-to-cook"),
  },
];
