
import Link from "next/link";
import Image from "next/image";
import {
  MessageCircle,
  MapPin,
  Phone,
  Mail,
  ArrowRight,
  Navigation,
} from "lucide-react";

const Footer = () => {
  const businessAddress = "Chennai, Tamil Nadu, India";

  const mapUrl = `https://maps.google.com/maps?q=${encodeURIComponent(
    businessAddress
  )}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    businessAddress
  )}`;

  const headingClass =
    "mb-4 text-[17px] font-semibold text-white";

  const linkClass =
    "text-[14px] text-white/80 transition-colors duration-200 hover:text-[#65C92E]";

  return (
    <footer data-reveal className="bg-[#111111] text-white">
      {/* Main Footer */}
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-6 py-9 sm:grid-cols-2 lg:grid-cols-4 lg:gap-7 lg:px-8">

        {/* Company Details */}
        <div>
          <Link href="/" className="inline-flex items-center gap-3">
            <Image
              src="/rklogo.jpeg"
              alt="RK Frozen Food"
              width={70}
              height={70}
              className="h-14 w-14 rounded-lg bg-white p-1 object-contain"
            />

            <span className="text-lg font-semibold tracking-wide">
              RK FROZEN FOOD
            </span>
          </Link>

          <p className="mt-3 max-w-xs text-[14px] leading-6 text-white/75">
            Frozen favourites for convenient meals, sharing and snacking.
          </p>

          {/* Social Media */}
          <div className="mt-5 flex gap-3">
            <a
              href="#"
              aria-label="Facebook"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-[14px] font-bold transition-all duration-300 hover:bg-[#65C92E] hover:text-[#111111]"
            >
              f
            </a>

            <a
              href="#"
              aria-label="Instagram"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition-all duration-300 hover:bg-[#65C92E] hover:text-[#111111]"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="17"
                height="17"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </a>

            <a
              href="#"
              aria-label="WhatsApp"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition-all duration-300 hover:bg-[#65C92E] hover:text-[#111111]"
            >
              <MessageCircle size={17} />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className={headingClass}>Quick Links</h3>

          <ul className="space-y-2.5">
            <li>
              <Link href="/" className={linkClass}>Home</Link>
            </li>
            <li>
              <Link href="/about" className={linkClass}>About Us</Link>
            </li>
            <li>
              <Link href="/shop" className={linkClass}>Products</Link>
            </li>
            <li>
              <Link href="/categories" className={linkClass}>Categories</Link>
            </li>
            <li>
              <Link href="/contact" className={linkClass}>Contact Us</Link>
            </li>
          </ul>
        </div>

        {/* Contact Details */}
        <div>
          <h3 className={headingClass}>Contact Us</h3>

          <ul className="space-y-3.5">
            <li className="flex items-start gap-2.5">
              <MapPin
                size={17}
                className="mt-1 shrink-0 text-[#65C92E]"
              />
              <span className="text-[14px] leading-6 text-white/80">
                {businessAddress}
              </span>
            </li>

            <li className="flex items-center gap-2.5">
              <Phone
                size={17}
                className="shrink-0 text-[#65C92E]"
              />
              <a href="tel:1234567890" className={linkClass}>
                1234567890
              </a>
            </li>

            <li className="flex items-start gap-2.5">
              <Mail
                size={17}
                className="mt-1 shrink-0 text-[#65C92E]"
              />
              <a
                href="mailto:your-email@example.com"
                className="break-all text-[14px] text-white/80 transition-colors hover:text-[#65C92E]"
              >
                your-email@example.com
              </a>
            </li>
          </ul>

          <Link
            href="/contact"
            className="mt-3 inline-flex items-center gap-2 rounded-lg border border-[#65C92E] px-3.5 py-2 text-[14px] font-semibold text-[#65C92E] transition-all duration-300 hover:bg-[#65C92E] hover:text-[#111111]"
          >
            Send Enquiry
            <ArrowRight size={16} />
          </Link>
        </div>

        {/* Google Map */}
        <div>
          <h3 className={headingClass}>Find Our Location</h3>

          <div className="h-[175px] w-full overflow-hidden rounded-xl border border-white/15">
            <iframe
              title="RK Frozen Food Google Map Location"
              src={mapUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>

          <Link
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-2 rounded-lg border border-[#65C92E] px-3.5 py-2 text-[14px] font-semibold text-[#65C92E] transition-all duration-300 hover:bg-[#65C92E] hover:text-[#111111]"
          >
            <Navigation size={16} />
            Get Directions
          </Link>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-6 py-4 text-center sm:flex-row lg:px-8">
          <p className="text-[13px] text-white/65">
            © {new Date().getFullYear()} RK Frozen Food. All Rights Reserved.
          </p>

          <p className="text-[13px] text-white/65">
            Stay Fresh... Stay Healthy...
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
