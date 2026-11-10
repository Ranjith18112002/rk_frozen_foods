


"use client";

import categories from "../../../shared/categories.json";
import { useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  Snowflake,
  Package,
} from "lucide-react";

const companyDetails = {
  name: "RK FROZEN FOOD",
  address: "Chennai, Tamil Nadu, India",
  phone: "1234567890",
  email: "your-email@example.com",
  hours: "Monday - Saturday: 9:00 AM - 6:00 PM",
};

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    product: "",
    quantity: "",
    location: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setIsSubmitting(true);

    const whatsappNumber = "911234567890";

    const message = `
New Product Enquiry - RK Frozen Food

Name: ${formData.name}
Phone: ${formData.phone}
Email: ${formData.email}
Product: ${formData.product}
Quantity: ${formData.quantity}
Delivery Location: ${formData.location}
Message: ${formData.message}
    `;

    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
      message
    )}`;

    window.open(whatsappUrl, "_blank");
    setIsSubmitting(false);
  };

  return (
    <main className="min-h-screen bg-brand-ice">
      {/* Page Heading */}
      <section data-reveal className="bg-brand-navy px-4 py-14 text-center text-white sm:py-16">
        <div className="mx-auto max-w-7xl">
         

          <h1 className="text-3xl font-bold">
            Contact Us
          </h1>

          <p className="mx-auto mt-3 max-w-xl text-[15px] text-white">
            Contact our team for product information, pricing and bulk orders.
          </p>

          <div className="breadcrumb mt-5 flex items-center justify-center gap-2 text-[13px] text-white">
            <Link href="/" className="text-[13px] transition hover:text-white">
              Home
            </Link>
            <span>/</span>
            <span className="text-white">Contact Us</span>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section data-reveal className="px-4 py-12 sm:py-16">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-10">

          {/* Company Details */}
          <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-7">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand-ice text-brand-navy">
                <Snowflake size={27} />
              </span>

              <h2 className="mt-4 text-2xl font-bold text-brand-navy">
                Company Details
              </h2>

              <p className="mt-2 text-[15px] leading-6 text-brand-text">
                Ask us about products, pricing, bulk orders or business supply.
              </p>
            </div>

            <div className="space-y-6">
              {/* Company Name */}
              <div className="flex gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-ice text-brand-navy">
                  <Package size={21} />
                </div>

                <div>
                  <h3 className="text-lg font-bold text-brand-text">
                    Company Name
                  </h3>
                  <p className="mt-1 text-[15px] text-brand-text">
                    {companyDetails.name}
                  </p>
                </div>
              </div>

              {/* Address */}
              <div className="flex gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-ice text-brand-navy">
                  <MapPin size={21} />
                </div>

                <div>
                  <h3 className="text-lg font-bold text-brand-text">
                    Business Address
                  </h3>
                  <p className="mt-1 text-[15px] text-brand-text">
                    {companyDetails.address}
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-ice text-brand-navy">
                  <Phone size={21} />
                </div>

                <div>
                  <h3 className="text-lg font-bold text-brand-text">
                    Phone Number
                  </h3>
                  <a
                    href={`tel:${companyDetails.phone}`}
                    className="mt-1 block text-[15px] text-brand-text transition hover:text-brand-navy"
                  >
                    {companyDetails.phone}
                  </a>
                </div>
              </div>

              {/* Email */}
              <div className="flex gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-ice text-brand-navy">
                  <Mail size={21} />
                </div>

                <div>
                  <h3 className="text-lg font-bold text-brand-text">
                    Email Address
                  </h3>
                  <a
                    href={`mailto:${companyDetails.email}`}
                    className="mt-1 block break-all text-[15px] text-brand-text transition hover:text-brand-navy"
                  >
                    {companyDetails.email}
                  </a>
                </div>
              </div>

              {/* Business Hours */}
              <div className="flex gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-ice text-brand-navy">
                  <Clock size={21} />
                </div>

                <div>
                  <h3 className="text-lg font-bold text-brand-text">
                    Business Hours
                  </h3>
                  <p className="mt-1 text-[15px] text-brand-text">
                    {companyDetails.hours}
                  </p>
                </div>
              </div>
            </div>

         
          </div>

          {/* Enquiry Form */}
          <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-7">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand-ice text-brand-navy">
                <Send size={24} />
              </span>

              <h2 className="mt-4 text-2xl font-bold text-brand-navy">
                Send Your Enquiry
              </h2>

              <p className="mt-2 text-[15px] leading-6 text-brand-text">
                Fill in the details below. Our team will contact
                you regarding your enquiry.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name and Phone */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="name"
                    className="mb-2 block text-[15px] font-medium text-brand-text"
                  >
                    Full Name *
                  </label>

                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-[15px] outline-none transition focus:border-brand-navy focus:ring-2 focus:ring-brand-ice"
                  />
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="mb-2 block text-[15px] font-medium text-brand-text"
                  >
                    Mobile Number *
                  </label>

                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter mobile number"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-[15px] outline-none transition focus:border-brand-navy focus:ring-2 focus:ring-brand-ice"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-[15px] font-medium text-brand-text"
                >
                  Email Address *
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-[15px] outline-none transition focus:border-brand-navy focus:ring-2 focus:ring-brand-ice"
                />
              </div>

              {/* Product and Quantity */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="product"
                    className="mb-2 block text-[15px] font-medium text-brand-text"
                  >
                    Product Category *
                  </label>

                  <select
                    id="product"
                    name="product"
                    required
                    value={formData.product}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-[15px] outline-none transition focus:border-brand-navy focus:ring-2 focus:ring-brand-ice"
                  >
                    <option value="">Select Product</option>
                    {categories.map((category) => (
                      <option key={category.slug} value={category.slug}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="quantity"
                    className="mb-2 block text-[15px] font-medium text-brand-text"
                  >
                    Required Quantity *
                  </label>

                  <input
                    id="quantity"
                    name="quantity"
                    type="text"
                    required
                    value={formData.quantity}
                    onChange={handleChange}
                    placeholder="Example: 20 KG"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-[15px] outline-none transition focus:border-brand-navy focus:ring-2 focus:ring-brand-ice"
                  />
                </div>
              </div>

              {/* Location */}
              <div>
                <label
                  htmlFor="location"
                  className="mb-2 block text-[15px] font-medium text-brand-text"
                >
                  Delivery Location *
                </label>

                <input
                  id="location"
                  name="location"
                  type="text"
                  required
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Enter your delivery location"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-[15px] outline-none transition focus:border-brand-navy focus:ring-2 focus:ring-brand-ice"
                />
              </div>

              {/* Message */}
              <div>
                <label
                  htmlFor="message"
                  className="mb-2 block text-[15px] font-medium text-brand-text"
                >
                  Your Message
                </label>

                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Write your enquiry here..."
                  className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 text-[15px] outline-none transition focus:border-brand-navy focus:ring-2 focus:ring-brand-ice"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand-orange px-6 py-3.5 text-[15px] font-semibold text-white transition hover:bg-brand-orange-hover disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Send size={18} />
                {isSubmitting ? "Sending..." : "Send Enquiry"}
              </button>

              <p className="text-center text-xs text-brand-text">
                Your enquiry will open in WhatsApp for sending.
              </p>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ContactPage;
