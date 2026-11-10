
import {
  ShieldCheck,
  Snowflake,
  PackageCheck,
  Headset,
  CheckCircle,
  Sparkles,
} from "lucide-react";

const features = [
  {
    id: 1,
    icon: ShieldCheck,
    number: "01",
    title: "Premium Quality",
    description:
      "Carefully selected frozen snacks with excellent quality, taste and freshness.",
  },
  {
    id: 2,
    icon: Snowflake,
    number: "02",
    title: "Freshness Guaranteed",
    description:
      "Proper frozen storage helps preserve product freshness, taste and quality.",
  },
  {
    id: 3,
    icon: PackageCheck,
    number: "03",
    title: "Hygienic Packaging",
    description:
      "Clean and secure packaging to support safe handling and convenient storage.",
  },
  {
    id: 4,
    icon: Headset,
    number: "04",
    title: "Customer Support",
    description:
      "Our friendly team is ready to help with product enquiries and bulk orders.",
  },
];

const WhyChooseUs = () => {
  return (
   <section data-reveal className="relative overflow-hidden bg-white pt-4 pb-10 md:pt-6 md:pb-14">

      {/* Background Decoration */}
      <div className="pointer-events-none absolute -left-28 top-20 h-72 w-72 rounded-full bg-brand-ice blur-3xl opacity-70" />
      <div className="pointer-events-none absolute -right-28 bottom-10 h-72 w-72 rounded-full bg-brand-ice blur-3xl opacity-70" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Section Heading */}
        <div className="mx-auto mb-14 max-w-3xl text-center">

      
          <h2 className="text-2xl font-bold leading-tight text-brand-navy">
            Why Customers Choose{" "}
            <span className="text-brand-navy">
              RK Frozen Food
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-[15px] leading-7 text-brand-text">
            Find carefully selected frozen favourites, convenient options
            and helpful service for your next order.
          </p>

          <div className="mx-auto mt-6 h-1 w-16 rounded-full bg-brand-orange" />

        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">

          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.id}
                className="group relative overflow-hidden rounded-2xl border border-[#E5E7EB] bg-brand-ice p-7 transition-all duration-300 hover:-translate-y-2 hover:border-[#65C92E] hover:bg-white hover:shadow-xl hover:shadow-gray-100/70"
              >

                {/* Top Accent */}
                <div className="absolute left-0 top-0 h-1 w-0 bg-brand-orange transition-all duration-300 group-hover:w-full" />

                {/* Number */}
                <div className="absolute right-6 top-5 text-4xl font-extrabold text-brand-ice transition group-hover:text-white">
                  {feature.number}
                </div>

                {/* Icon */}
                <div className="relative mb-7 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-ice text-brand-navy transition-all duration-300 group-hover:bg-brand-orange-hover group-hover:text-white group-hover:shadow-lg group-hover:shadow-gray-200">
                  <Icon size={30} strokeWidth={1.8} />
                </div>

                {/* Title */}
                <h3 className="relative text-lg font-bold text-brand-navy">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="mt-3 text-[15px] leading-7 text-brand-text">
                  {feature.description}
                </p>

                {/* Bottom Icon */}
                <div className="mt-6 flex items-center gap-2 text-[15px] font-semibold text-brand-navy">
                  <span>Made for Everyday</span>
                  <CheckCircle size={16} />
                </div>

              </div>
            );
          })}

        </div>

        {/* Bottom CTA Banner */}
       

      </div>

    </section>
  );
};

export default WhyChooseUs;
