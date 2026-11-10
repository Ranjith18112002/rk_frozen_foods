"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import categories from "../../shared/categories.json";
import { products, type Product } from "@/data/products";
import { ArrowRight, Snowflake, ShoppingCart } from "lucide-react";

type CartItem = {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  weight: string;
};

const categoryImages: Record<string, string> = {
  "samosas-rolls":
    "https://images.pexels.com/photos/37153389/pexels-photo-37153389.jpeg?auto=compress&cs=tinysrgb&w=640",
  "kebabs-tikkis":
    "https://images.pexels.com/photos/31249644/pexels-photo-31249644.jpeg?auto=compress&cs=tinysrgb&w=640",
  "nuggets-popcorn":
    "https://images.pexels.com/photos/11710530/pexels-photo-11710530.jpeg?auto=compress&cs=tinysrgb&w=640",
  "fries-potato":
    "https://images.pexels.com/photos/5779487/pexels-photo-5779487.jpeg?auto=compress&cs=tinysrgb&w=640",
  "parathas-breads":
    "https://images.pexels.com/photos/40262799/pexels-photo-40262799.jpeg?auto=compress&cs=tinysrgb&w=640",
  "momos-dumplings":
    "https://images.pexels.com/photos/18803174/pexels-photo-18803174.jpeg?auto=compress&cs=tinysrgb&w=640",
  "patties-cutlets":
    "https://images.pexels.com/photos/36007383/pexels-photo-36007383.jpeg?auto=compress&cs=tinysrgb&w=640",
  "ready-to-cook":
    "https://images.pexels.com/photos/36388454/pexels-photo-36388454.jpeg?auto=compress&cs=tinysrgb&w=640",
};

/**
 * Scroll reveal: element screen la varum bodhu fade-up aagum (oru thadava mattum).
 * delay = stagger ku (ms)
 */
const Reveal = ({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // Old browser la IntersectionObserver illa na direct ah kaattum
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: visible ? `${delay}ms` : "0ms" }}
      className={`transition-all duration-700 ease-out motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none ${
        visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
      } ${className}`}
    >
      {children}
    </div>
  );
};

const Products = () => {
  const router = useRouter();

  const handleAddToCart = (product: Product) => {
    try {
      const image = categoryImages[product.category] ?? product.image;
      const savedCart = localStorage.getItem("rk-enquiry-cart");

      const cart: CartItem[] = savedCart ? JSON.parse(savedCart) : [];

      const existingProduct = cart.find(
        (item) => item.id === String(product.id)
      );

      let updatedCart: CartItem[];

      if (existingProduct) {
        updatedCart = cart.map((item) =>
          item.id === String(product.id)
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        const newProduct: CartItem = {
          id: String(product.id),
          name: product.name,
          image,
          price: product.price,
          quantity: 1,
          weight: product.weight,
        };

        updatedCart = [...cart, newProduct];
      }

      localStorage.setItem("rk-enquiry-cart", JSON.stringify(updatedCart));

      router.push("/cart");
    } catch (error) {
      console.error("Unable to add product to cart:", error);
      alert("Unable to add product. Please try again.");
    }
  };

  return (
    <section data-reveal className="bg-brand-ice py-10 sm:py-12 lg:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <Reveal>
          <div className="mb-6 flex flex-col justify-between gap-4 sm:mb-8 sm:flex-row sm:items-center">
            <div>
              <div className="mb-2 flex items-center gap-2 text-[11px] font-medium uppercase tracking-[1.5px] text-brand-navy">
                {/* Snowflake slow ah suthum */}
                <Snowflake
                  size={16}
                  className="animate-[spin_8s_linear_infinite] motion-reduce:animate-none"
                />
                RK Frozen Food
              </div>

              <h2 className="text-[26px] font-semibold tracking-tight text-brand-navy sm:text-[30px]">
                Featured Products
              </h2>

              <p className="mt-2 max-w-xl text-[14px] leading-6 text-brand-text sm:text-[15px]">
                Everyday frozen favourites, ready to cook and share.
              </p>
            </div>

            <Link
              href="/shop"
              className="group/view hidden shrink-0 items-center gap-2 rounded-lg border border-[#E5E7EB] bg-white px-4 py-2.5 text-sm font-semibold text-[#111111] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#65C92E] hover:bg-[#EFF8E9] hover:shadow-md active:scale-95 sm:inline-flex"
            >
              View All Products
              <ArrowRight
                size={16}
                className="transition-transform duration-300 group-hover/view:translate-x-1"
              />
            </Link>
          </div>
        </Reveal>

        {/* Products Grid */}
        <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
          {products.map((product, index) => (
            // Outer wrapper = reveal animation, inner card = hover animation
            // (rendu um separate, so transform conflict aagaadhu)
            <Reveal
              key={product.id}
              delay={(index % 4) * 100}
              className="min-w-0"
            >
              <div className="product-card group relative h-full min-w-0 overflow-hidden rounded-xl border border-[#E5E7EB] bg-white shadow-sm transition-all duration-300 after:absolute after:bottom-0 after:left-0 after:h-1 after:w-0 after:bg-[#65C92E] after:transition-all after:duration-300 after:ease-out hover:-translate-y-1 hover:border-[#65C92E] hover:shadow-lg hover:shadow-[#65C92E]/10 hover:after:w-full sm:rounded-2xl">
                {/* Product Image */}
                <Link
                  href={`/shop?q=${encodeURIComponent(product.name)}`}
                  className="relative block aspect-[5/4] overflow-hidden bg-brand-ice"
                >
                  <Image
                    src={categoryImages[product.category] ?? product.image}
                    alt={product.name}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </Link>

                {/* Product Details */}
                <div className="p-2.5 sm:p-3.5 lg:p-4">
                  {/* Category and Weight */}
                  <p className="mb-1 text-[11px] font-medium uppercase tracking-wide text-brand-navy sm:text-xs">
                    {
                      categories.find(
                        (category) => category.slug === product.category
                      )?.name
                    }{" "}
                    <span className="text-gray-400">·</span> {product.weight}
                  </p>

                  {/* Product Name */}
                  <Link href={`/shop?q=${encodeURIComponent(product.name)}`}>
                    <h3 className="line-clamp-2 min-h-[50px] font-medium text-brand-navy transition-colors hover:text-brand-orange">
                      {product.name}
                    </h3>
                  </Link>

                  {/* Veg / Non-Veg */}
                  <span className="mt-1.5 inline-flex items-center gap-1.5 text-[11px] font-normal text-brand-text sm:text-xs">
                    <span
                      aria-hidden="true"
                      className={`h-2 w-2 rounded-full ${
                        product.type === "veg" ? "bg-green-600" : "bg-red-600"
                      }`}
                    />
                    {product.type === "veg" ? "Veg" : "Non-Veg"}
                  </span>

                  {/* Description */}
                  <p className="mt-1 line-clamp-2 min-h-[42px] text-[14px] font-normal leading-[21px] text-brand-text">
                    {product.description}
                  </p>

                  {/* Price (card hover la konjam perusa aagum) */}
                  <p className="mt-1.5 origin-left text-[16px] font-medium text-brand-navy transition-transform duration-300 group-hover:scale-105 sm:text-[18px]">
                    ₹{product.price}
                  </p>

                  {/* Add to Cart Button */}
                  <div className="mt-2 border-t border-[#E5E7EB] pt-2">
                    <button
                      type="button"
                      onClick={() => handleAddToCart(product)}
                      className="group/btn relative flex w-full items-center justify-center gap-1.5 overflow-hidden rounded-md bg-brand-orange px-2 py-2 text-[13px] font-medium text-[#111111] transition-all duration-200 before:absolute before:inset-y-0 before:-left-full before:w-full before:-skew-x-12 before:bg-white/40 before:transition-transform before:duration-700 hover:bg-brand-orange-hover hover:before:translate-x-[200%] active:scale-[0.97] sm:rounded-lg sm:py-2.5 sm:text-sm"
                    >
                      <ShoppingCart
                        size={14}
                        className="relative transition-transform duration-300 group-hover/btn:-rotate-12 group-hover/btn:scale-110"
                      />
                      <span className="relative">Request a Quote</span>
                    </button>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Products;