
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Arun Kumar",
    role: "Restaurant Owner",
    review:
      "Good quality frozen products and proper packaging. The products are useful for our restaurant needs.",
  },
  {
    id: 2,
    name: "Priya S",
    role: "Regular Customer",
    review:
      "Good product variety and helpful customer support. Overall, a pleasant shopping experience.",
  },
  {
    id: 3,
    name: "Mohammed Ali",
    role: "Wholesale Buyer",
    review:
      "The bulk order enquiry process is simple and convenient. Happy with the product range.",
  },
];

const Testimonials = () => {
  return (
    <section
      data-reveal
      className="relative overflow-hidden bg-[#F7FAF5] px-4 py-12 sm:px-6 md:py-16 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">
        {/* Section Heading */}
        <div className="mb-9 text-center sm:mb-12">
          <span className="text-xs font-medium uppercase tracking-[1.5px] text-[#65C92E]">
            Customer Feedback
          </span>

          <h2 className="mt-2 text-[26px] font-semibold tracking-tight text-[#111111] sm:text-[30px]">
            What Our Customers Say
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-[14px] leading-6 text-[#555555] sm:text-[15px] sm:leading-7">
            We value our customers and always aim to provide quality frozen
            food products and reliable service.
          </p>
        </div>

        {/* Testimonial Cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((item, index) => (
            <div
              key={item.id}
              style={{ animationDelay: `${index * 120}ms` }}
              className="group relative overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-[#65C92E] hover:shadow-xl hover:shadow-[#65C92E]/10 sm:p-7"
            >
              {/* Quote Icon */}
              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-[#EFF8E9] text-[#65C92E] transition-all duration-300 group-hover:bg-[#65C92E] group-hover:text-white">
                <Quote size={22} strokeWidth={2} />
              </div>

              {/* Star Rating */}
              <div className="mb-4 flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={16}
                    className="fill-[#65C92E] text-[#65C92E]"
                  />
                ))}
              </div>

              {/* Review */}
              <p className="min-h-24 text-[14px] leading-7 text-[#555555] sm:text-[15px]">
                &quot;{item.review}&quot;
              </p>

              {/* Customer Details */}
              <div className="mt-6 border-t border-[#E5E7EB] pt-5">
                <h3 className="text-[16px] font-semibold text-[#111111]">
                  {item.name}
                </h3>

                <p className="mt-1 text-[13px] text-[#777777]">
                  {item.role}
                </p>
              </div>

              {/* Bottom Green Hover Border */}
              <div className="absolute bottom-0 left-0 h-1 w-0 bg-[#65C92E] transition-all duration-300 ease-out group-hover:w-full" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
