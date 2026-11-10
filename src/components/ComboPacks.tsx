
"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  ShoppingCart,
  Package,
} from "lucide-react";

type CartItem = {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  weight: string;
};

const comboPacks = [
  {
    id: "snack-party-combo",
    name: "Snack Party Combo",
    description: "A mix of crowd-pleasing snacks for sharing.",
    image:
      "https://images.pexels.com/photos/37153389/pexels-photo-37153389.jpeg?auto=compress&cs=tinysrgb&w=640",
    products: ["Samosa", "Spring Rolls", "Veg Nuggets"],
    packSize: "3 Products",
    weight: "Combo Pack",
    price: 0,
    badge: "Popular Choice",
  },
  {
    id: "veg-delight-combo",
    name: "Veg Delight Combo",
    description: "A convenient selection of vegetarian favourites.",
    image:
      "https://images.pexels.com/photos/5779487/pexels-photo-5779487.jpeg?auto=compress&cs=tinysrgb&w=640",
    products: ["Veg Cutlet", "Samosa", "Veg Rolls"],
    packSize: "3 Products",
    weight: "Combo Pack",
    price: 0,
    badge: "Vegetarian",
  },
  {
    id: "non-veg-combo",
    name: "Non-Veg Combo",
    description: "A savoury selection of chicken snack favourites.",
    image:
      "https://images.pexels.com/photos/11710530/pexels-photo-11710530.jpeg?auto=compress&cs=tinysrgb&w=640",
    products: ["Chicken Nuggets", "Chicken Popcorn"],
    packSize: "2 Products",
    weight: "Combo Pack",
    price: 0,
    badge: "Customer Favourite",
  },
  {
    id: "family-party-combo",
    name: "Family Party Combo",
    description: "A variety of snacks for gatherings and family time.",
    image:
      "https://images.pexels.com/photos/14457194/pexels-photo-14457194.jpeg?auto=compress&cs=tinysrgb&w=640",
    products: ["Samosa", "Spring Rolls", "Nuggets", "Cutlet"],
    packSize: "4 Products",
    weight: "Combo Pack",
    price: 0,
    badge: "Party Special",
  },
];

const ComboPacks = () => {
  const router = useRouter();

  const handleAddToCart = (combo: (typeof comboPacks)[number]) => {
    try {
      const savedCart = localStorage.getItem("rk-enquiry-cart");

      const cart: CartItem[] = savedCart
        ? JSON.parse(savedCart)
        : [];

      const existingCombo = cart.find(
        (item) => item.id === String(combo.id)
      );

      let updatedCart: CartItem[];

      if (existingCombo) {
        updatedCart = cart.map((item) =>
          item.id === String(combo.id)
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        const newCombo: CartItem = {
          id: String(combo.id),
          name: combo.name,
          image: combo.image,
          price: combo.price,
          quantity: 1,
          weight: combo.weight,
        };

        updatedCart = [...cart, newCombo];
      }

      localStorage.setItem(
        "rk-enquiry-cart",
        JSON.stringify(updatedCart)
      );

      router.push("/cart");
    } catch (error) {
      console.error("Unable to add combo to cart:", error);
      alert("Unable to add combo. Please try again.");
    }
  };

  return (
    <section
      data-reveal
      className="bg-white px-4 py-12 sm:px-6 md:py-16 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">

        {/* Section Heading */}
        <div className="mb-9 flex flex-col items-center justify-between gap-4 text-center sm:mb-11 md:flex-row md:text-left">
          <div>
            <span className="text-xs font-medium uppercase tracking-[1.5px] text-[#65C92E]">
              Special Collections
            </span>

            <h2 className="mt-2 text-[26px] font-semibold tracking-tight text-[#111111] sm:text-[30px]">
              Popular Combo Packs
            </h2>

            <p className="mt-2 max-w-xl text-[14px] leading-6 text-[#555555] sm:text-[15px]">
              A convenient mix of favourites for sharing and entertaining.
            </p>
          </div>

          <Link
            href="/combos"
             className="group/view hidden shrink-0 items-center gap-2 rounded-lg border border-[#E5E7EB] bg-white px-4 py-2.5 text-sm font-semibold text-[#111111] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#65C92E] hover:bg-[#EFF8E9] hover:shadow-md active:scale-95 sm:inline-flex"
          >
            View All Combos
            <ArrowRight size={17} />
          </Link>
        </div>

        {/* Combo Cards */}
        <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4 lg:gap-6">
          {comboPacks.map((combo) => (
            <div
              key={combo.id}
              className="group relative min-w-0 overflow-hidden rounded-xl border border-[#E5E7EB] bg-white shadow-sm transition-all duration-300 after:absolute after:bottom-0 after:left-0 after:h-1 after:w-0 after:bg-[#65C92E] after:transition-all after:duration-300 after:ease-out hover:-translate-y-1 hover:border-[#65C92E] hover:shadow-lg hover:shadow-[#65C92E]/10 hover:after:w-full sm:rounded-2xl"
            >
              {/* Combo Image */}
              <Link
                href={`/combos/${combo.id}`}
                className="relative block aspect-[5/4] overflow-hidden bg-[#F7FAF5]"
              >
                <Image
                  src={combo.image}
                  alt={combo.name}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />

                <span className="absolute left-2 top-2 rounded-full bg-[#65C92E] px-2 py-1 text-[11px] font-medium text-[#111111] sm:left-3 sm:top-3 sm:text-xs">
                  {combo.badge}
                </span>
              </Link>

              {/* Combo Details */}
              <div className="p-2.5 sm:p-3.5 lg:p-4">

                {/* Pack Size */}
                <p className="mb-1 flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-[#477D2B] sm:text-xs">
                  <Package size={13} />
                  {combo.packSize}
                </p>

                {/* Combo Name */}
                <Link href={`/combos/${combo.id}`}>
                  <h3 className="line-clamp-2 min-h-[50px] font-medium text-[#111111] transition-colors hover:text-[#4D9F20]">
                    {combo.name}
                  </h3>
                </Link>

                {/* Description */}
                <p className="mt-1 line-clamp-2 min-h-[42px] text-[14px] leading-[21px] text-[#555555]">
                  {combo.description}
                </p>

                {/* Included Products */}
                <div className="mt-2 flex min-h-[42px] flex-wrap content-start gap-1">
                  {combo.products.map((product) => (
                    <span
                      key={product}
                      className="rounded-md bg-[#EFF8E9] px-2 py-1 text-[11px] text-[#477D2B] sm:text-xs"
                    >
                      {product}
                    </span>
                  ))}
                </div>

                {/* Add to Enquiry */}
                <div className="mt-2 border-t border-[#E5E7EB] pt-2">
                  <button
                    type="button"
                    onClick={() => handleAddToCart(combo)}
                    className="flex w-full items-center justify-center gap-1.5 rounded-md bg-brand-orange px-2 py-2 text-[13px] font-medium text-[#111111] transition-all duration-200 hover:bg-brand-orange-hover active:scale-[0.98] sm:rounded-lg sm:py-2.5 sm:text-sm"
                  >
                    <ShoppingCart size={14} />
                   Request a Quote
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ComboPacks;
