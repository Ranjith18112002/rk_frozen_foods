
import Link from "next/link";
import Image from "next/image";
import {
  Snowflake,
  ArrowRight,
  CheckCircle,
} from "lucide-react";

const AboutPage = () => {
  return (
    <main className="bg-white">

      {/* HERO SECTION */}
      <section data-reveal className="relative overflow-hidden bg-brand-navy px-6 py-20 text-center sm:py-24">

        <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-white/5" />
        <div className="absolute -bottom-28 -right-10 h-80 w-80 rounded-full bg-white/5" />

        <div className="relative mx-auto max-w-4xl">

         

          <h1 className="text-3xl font-bold text-white">
            Freshness You Can Trust,
            <span className="block text-brand-ice">
              Quality You Deserve
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-[15px] leading-8 text-white">
            Discover convenient frozen snacks for home, food service and
            everyday occasions. We make it easy to find favourites for your
            table or business.
          </p>

          <Link
            href="/shop"
            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-brand-orange px-7 py-3 text-[15px] font-semibold text-white transition hover:-translate-y-1 hover:bg-brand-orange-hover"
          >
            Explore Products
            <ArrowRight size={18} />
          </Link>

        </div>
      </section>

      {/* WHO WE ARE */}
      <section data-reveal className="py-16 md:py-24">

        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 lg:grid-cols-2 lg:px-8">

          {/* Image */}
          <div className="relative">

            <div className="relative h-[320px] overflow-hidden rounded-3xl bg-brand-ice sm:h-[430px]">

              <Image
                src="https://images.pexels.com/photos/11679687/pexels-photo-11679687.jpeg?auto=compress&cs=tinysrgb&w=1200"
                alt="Worker managing food packaging in a production facility"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />

            </div>

            <div className="absolute -bottom-5 right-5 rounded-2xl bg-white p-5 shadow-xl sm:right-8">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-ice text-brand-navy">
                  <Snowflake size={27} />
                </div>

                <div>
                  <p className="text-[15px] font-bold text-brand-navy">
                    Quality First
                  </p>
                  <p className="text-xs text-brand-text">
                    Thoughtfully Selected
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* Content */}
          <div className="pt-5 lg:pt-0">

            <p className="mb-3 text-xs font-bold uppercase tracking-[2px] text-brand-navy">
              Who We Are
            </p>

            <h2 className="text-2xl font-bold leading-tight text-brand-navy">
              Your Trusted Frozen Snack Partner
            </h2>

            <p className="mt-6 text-[15px] leading-8 text-brand-text">
              RK Frozen Food brings together frozen snacks for homes,
              restaurants and businesses. Our range is designed to make
              everyday meals and snack times more convenient.
            </p>

            <p className="mt-4 text-[15px] leading-8 text-brand-text">
              Whether you are shopping for your family or sourcing for your
              business, our team is here to help you find the right products.
            </p>

            <div className="mt-7 space-y-4">

              {[
                "Quality-focused product selection",
                "Careful frozen snack handling",
                "Convenient product enquiries",
                "Friendly customer assistance",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <CheckCircle
                    size={19}
                    className="shrink-0 text-brand-navy"
                  />
                  <span className="text-[15px] font-medium text-brand-text">
                    {item}
                  </span>
                </div>
              ))}

            </div>

          </div>

        </div>
      </section>
    </main>
  );
};

export default AboutPage;
