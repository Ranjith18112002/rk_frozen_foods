"use client";

import { Snowflake, Clock, Phone } from "lucide-react";

const TopBar = () => {
  const messages = [
    {
      icon: Snowflake,
      text: "Premium Quality Frozen Snacks",
    },
    {
      icon: Clock,
      text: "24/7 Customer Support",
    },
    {
      icon: Phone,
      text: "+91 12345 67890",
      href: "tel:+911234567890",
    },
  ];

  return (
    <div className="w-full overflow-hidden bg-[#65C92E] text-[#111111]">
      <div className="flex min-h-[38px] items-center overflow-hidden">
        <div className="flex w-max animate-marquee items-center gap-10 whitespace-nowrap px-5 sm:gap-14 sm:px-8">

          {messages.map((item, index) => {
            const Icon = item.icon;

            const content = (
              <div className="flex items-center gap-2 text-xs font-medium">
                <Icon size={16} strokeWidth={2.2} />
                <span>{item.text}</span>
              </div>
            );

            return item.href ? (
              <a
                key={index}
                href={item.href}
                className="transition-opacity hover:opacity-70"
              >
                {content}
              </a>
            ) : (
              <div key={index}>{content}</div>
            );
          })}

        </div>
      </div>
    </div>
  );
};

export default TopBar;