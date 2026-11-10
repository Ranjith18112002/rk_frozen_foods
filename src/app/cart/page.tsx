
"use client";

import { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ArrowLeft,
  Send,
  User,
  Phone,
  Mail,
  MapPin,
  MessageSquare,
  Snowflake,
  Package,
} from "lucide-react";

type CartItem = {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  weight?: string;
};

type CustomerDetails = {
  name: string;
  mobile: string;
  email: string;
  address: string;
  message: string;
};

const CART_STORAGE_KEY = "rk-enquiry-cart";

const CartPage = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const [customer, setCustomer] = useState<CustomerDetails>({
    name: "",
    mobile: "",
    email: "",
    address: "",
    message: "",
  });

  // Load cart from localStorage
  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      try {
        const savedCart = localStorage.getItem(CART_STORAGE_KEY);

        if (savedCart) {
          const parsedCart: CartItem[] = JSON.parse(savedCart);

          if (Array.isArray(parsedCart)) {
            setCartItems(parsedCart);
          }
        }
      } catch {
        console.error("Unable to load enquiry cart.");
      } finally {
        setIsLoaded(true);
      }

    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

  // Save cart whenever products change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    }
  }, [cartItems, isLoaded]);

  const updateQuantity = (id: string, change: number) => {
    setCartItems((items) =>
      items
        .map((item) =>
          item.id === id
            ? {
                ...item,
                quantity: Math.max(1, item.quantity + change),
              }
            : item
        )
    );
  };

  const removeItem = (id: string) => {
    setCartItems((items) => items.filter((item) => item.id !== id));
  };

  const handleCustomerChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setCustomer({
      ...customer,
      [e.target.name]: e.target.value,
    });
  };

  const totalItems = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const estimatedTotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      alert("Please add products to your enquiry cart.");
      return;
    }

    const enquiryDetails = `
RK FROZEN FOOD - PRODUCT ENQUIRY

Customer Name: ${customer.name}
Mobile: ${customer.mobile}
Email: ${customer.email}
Delivery Address: ${customer.address}

Selected Products:
${cartItems
  .map(
    (item) =>
      `${item.name} - Quantity: ${item.quantity} ${
        item.weight ? `- ${item.weight}` : ""
      }`
  )
  .join("\n")}

Message: ${customer.message}
    `;

    console.log(enquiryDetails);

    alert(
      "Enquiry form submitted! Backend is not connected yet. Your enquiry has not been saved."
    );
  };

  if (!isLoaded) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-brand-ice">
        <p className="text-[15px] font-semibold text-brand-navy">
          Loading your enquiry cart...
        </p>
      </main>
    );
  }

  return (
    <main data-reveal className="min-h-screen bg-brand-ice px-4 py-10 sm:px-6 lg:py-14">
      <div className="mx-auto max-w-6xl">

        {/* Page Heading */}
        <div className="mb-8">
          <Link
            href="/shop"
            className="mb-5 inline-flex items-center gap-2 text-[15px] font-semibold text-brand-navy transition hover:text-brand-navy"
          >
            <ArrowLeft size={17} />
            Continue Shopping
          </Link>

          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-ice text-brand-navy">
              <ShoppingCart size={25} />
            </div>

            <div>
              <h1 className="text-3xl font-bold text-brand-navy">
                My Enquiry Cart
              </h1>

              <p className="mt-1 text-[15px] text-brand-text">
                Review your selected frozen snacks.
              </p>
            </div>
          </div>
        </div>

        {cartItems.length === 0 ? (
          /* Empty Cart */
          <div className="rounded-3xl border border-[#E5E7EB] bg-white px-5 py-16 text-center shadow-sm">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-brand-ice text-brand-navy">
              <ShoppingCart size={38} />
            </div>

            <h2 className="mt-5 text-2xl font-bold text-brand-navy">
              Your Enquiry Cart is Empty
            </h2>

            <p className="mx-auto mt-2 max-w-md text-[15px] text-brand-text">
              You haven&apos;t selected any products yet. Explore our frozen snack
              collection and add products to your enquiry cart.
            </p>

            <Link
              href="/shop"
              className="mt-7 inline-flex items-center justify-center gap-2 rounded-lg bg-brand-orange px-6 py-3 text-[15px] font-semibold text-white transition hover:bg-brand-orange-hover"
            >
              Explore Products
              <ArrowLeft className="rotate-180" size={18} />
            </Link>
          </div>
        ) : (
          <div className="grid items-start gap-8 lg:grid-cols-3">

            {/* Product List */}
            <section className="space-y-5 lg:col-span-2">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-brand-navy">
                  Selected Products
                </h2>

                <span className="rounded-full bg-brand-ice px-3 py-1 text-xs font-bold text-brand-navy">
                  {totalItems} Items
                </span>
              </div>

              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col gap-4 rounded-2xl border border-[#E5E7EB] bg-white p-4 shadow-sm sm:flex-row sm:items-center"
                >
                  {/* Product Image */}
                  <div className="relative h-28 w-full shrink-0 overflow-hidden rounded-xl bg-brand-ice sm:h-28 sm:w-32">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="(max-width: 640px) 100vw, 128px"
                      className="object-cover"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="min-w-0 flex-1">
                    <h3 className="text-lg font-bold text-brand-navy">
                      {item.name}
                    </h3>

                    {item.weight && (
                      <p className="mt-1 text-xs text-brand-text">
                        Weight: {item.weight}
                      </p>
                    )}

                    <p className="mt-2 text-[15px] font-semibold text-brand-navy">
                      ₹{item.price.toLocaleString("en-IN")}
                      <span className="font-normal text-brand-text">
                        {" "} / unit
                      </span>
                    </p>

                    {/* Quantity Controls */}
                    <div className="mt-3 flex flex-wrap items-center gap-3">
                      <div className="flex items-center rounded-lg border border-[#E5E7EB]">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, -1)}
                          aria-label={`Decrease ${item.name} quantity`}
                          className="p-2 text-[15px] font-semibold text-brand-navy hover:bg-brand-ice"
                        >
                          <Minus size={15} />
                        </button>

                        <span className="min-w-8 text-center text-[15px] font-bold text-brand-text">
                          {item.quantity}
                        </span>

                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, 1)}
                          aria-label={`Increase ${item.name} quantity`}
                          className="p-2 text-[15px] font-semibold text-brand-navy hover:bg-brand-ice"
                        >
                          <Plus size={15} />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-brand-navy transition hover:text-brand-navy"
                      >
                        <Trash2 size={14} />
                        Remove
                      </button>
                    </div>
                  </div>

                  {/* Item Total */}
                  <div className="text-left sm:text-right">
                    <p className="text-xs text-brand-text">Item Total</p>

                    <p className="mt-1 text-[15px] font-bold text-brand-navy">
                      ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>
              ))}

              {/* Continue Shopping */}
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 text-[15px] font-semibold text-brand-navy hover:text-brand-navy"
              >
                <Plus size={17} />
                Add More Products
              </Link>
            </section>

            {/* Summary */}
            <aside className="rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-sm lg:sticky lg:top-24">
              <h2 className="text-2xl font-bold text-brand-navy">
                Enquiry Summary
              </h2>

              <div className="mt-5 space-y-4 text-[15px]">
                <div className="flex justify-between text-brand-text">
                  <span>Total Products</span>
                  <span className="font-semibold text-brand-text">
                    {cartItems.length}
                  </span>
                </div>

                <div className="flex justify-between text-brand-text">
                  <span>Total Quantity</span>
                  <span className="font-semibold text-brand-text">
                    {totalItems}
                  </span>
                </div>

                <div className="border-t border-dashed border-[#E5E7EB] pt-4">
                  <div className="flex justify-between gap-3">
                    <span className="font-bold text-brand-navy">
                      Estimated Total
                    </span>

                    <span className="text-lg font-bold text-brand-navy">
                      ₹{estimatedTotal.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-5 rounded-xl bg-brand-ice p-3">
                <p className="text-xs leading-5 text-brand-text">
                  Final pricing and availability will be confirmed by our
                  team after reviewing your enquiry.
                </p>
              </div>

              <div className="mt-5 flex items-center gap-2 text-xs text-brand-navy">
                <Package size={17} />
                No online payment required
              </div>
            </aside>
          </div>
        )}

        {/* Customer Enquiry Form */}
        {cartItems.length > 0 && (
          <section className="mt-10 overflow-hidden rounded-3xl border border-[#E5E7EB] bg-white shadow-lg">

            {/* Form Header */}
            <div className="bg-brand-navy px-5 py-7 sm:px-8">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/15 text-white">
                  <Snowflake size={27} />
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-white">
                    Submit Your Enquiry
                  </h2>

                  <p className="mt-1 text-[15px] text-white">
                    Fill in your details. Our team will contact you shortly.
                  </p>
                </div>
              </div>
            </div>

            {/* Form Fields */}
            <form onSubmit={handleSubmit} className="space-y-6 p-5 sm:p-8">

              <div className="grid gap-5 sm:grid-cols-2">

                {/* Name */}
                <div>
                  <label className="mb-2 block text-[15px] font-semibold text-brand-text">
                    Full Name *
                  </label>

                  <div className="relative">
                    <User
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-navy"
                    />

                    <input
                      type="text"
                      name="name"
                      value={customer.name}
                      onChange={handleCustomerChange}
                      placeholder="Enter your name"
                      autoComplete="name"
                      required
                      className="w-full rounded-xl border border-[#E5E7EB] bg-brand-ice py-3.5 pl-11 pr-4 text-[15px] text-brand-text outline-none focus:border-brand-navy focus:ring-2 focus:ring-brand-ice"
                    />
                  </div>
                </div>

                {/* Mobile */}
                <div>
                  <label className="mb-2 block text-[15px] font-semibold text-brand-text">
                    Mobile Number *
                  </label>

                  <div className="relative">
                    <Phone
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-navy"
                    />

                    <input
                      type="tel"
                      name="mobile"
                      value={customer.mobile}
                      onChange={handleCustomerChange}
                      placeholder="10 digit mobile number"
                      pattern="[6-9][0-9]{9}"
                      maxLength={10}
                      autoComplete="tel"
                      required
                      className="w-full rounded-xl border border-[#E5E7EB] bg-brand-ice py-3.5 pl-11 pr-4 text-[15px] text-brand-text outline-none focus:border-brand-navy focus:ring-2 focus:ring-brand-ice"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="sm:col-span-2">
                  <label className="mb-2 block text-[15px] font-semibold text-brand-text">
                    Email Address *
                  </label>

                  <div className="relative">
                    <Mail
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-navy"
                    />

                    <input
                      type="email"
                      name="email"
                      value={customer.email}
                      onChange={handleCustomerChange}
                      placeholder="Enter your email address"
                      autoComplete="email"
                      required
                      className="w-full rounded-xl border border-[#E5E7EB] bg-brand-ice py-3.5 pl-11 pr-4 text-[15px] text-brand-text outline-none focus:border-brand-navy focus:ring-2 focus:ring-brand-ice"
                    />
                  </div>
                </div>

                {/* Address */}
                <div className="sm:col-span-2">
                  <label className="mb-2 block text-[15px] font-semibold text-brand-text">
                    Delivery Address *
                  </label>

                  <div className="relative">
                    <MapPin
                      size={18}
                      className="absolute left-4 top-4 text-brand-navy"
                    />

                    <textarea
                      name="address"
                      value={customer.address}
                      onChange={handleCustomerChange}
                      placeholder="Enter your complete delivery address"
                      rows={3}
                      autoComplete="street-address"
                      required
                      className="w-full resize-none rounded-xl border border-[#E5E7EB] bg-brand-ice py-3.5 pl-11 pr-4 text-[15px] text-brand-text outline-none focus:border-brand-navy focus:ring-2 focus:ring-brand-ice"
                    />
                  </div>
                </div>

                {/* Message */}
                <div className="sm:col-span-2">
                  <label className="mb-2 block text-[15px] font-semibold text-brand-text">
                    Additional Message
                  </label>

                  <div className="relative">
                    <MessageSquare
                      size={18}
                      className="absolute left-4 top-4 text-brand-navy"
                    />

                    <textarea
                      name="message"
                      value={customer.message}
                      onChange={handleCustomerChange}
                      placeholder="Any special requirements? (Optional)"
                      rows={4}
                      className="w-full resize-none rounded-xl border border-[#E5E7EB] bg-brand-ice py-3.5 pl-11 pr-4 text-[15px] text-brand-text outline-none focus:border-brand-navy focus:ring-2 focus:ring-brand-ice"
                    />
                  </div>
                </div>
              </div>

              {/* Submit */}
              <div className="border-t border-[#E5E7EB] pt-6">
                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand-orange px-6 py-4 text-[15px] font-semibold text-white shadow-md transition hover:bg-brand-orange-hover sm:w-auto"
                >
                  <Send size={18} />
                  Submit Enquiry
                </button>

                <p className="mt-3 text-xs text-brand-text">
                  By submitting, you are requesting product availability and
                  pricing. No payment will be collected here.
                </p>
              </div>
            </form>
          </section>
        )}

      </div>
    </main>
  );
};

export default CartPage;
