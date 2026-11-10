
import HeroSlider from "./HeroSlider";
import CategorySection from "./CategorySection";
import Products from "./Products";
import WhyChooseUs from "./WhyChooseUs";
import Testimonials from "./Testimonials";
import ComboPacks from "./ComboPacks";

const ComponentPages = () => {
  return (
    <div>
      <HeroSlider />
      <CategorySection />
      <Products />
      <ComboPacks/>
      <WhyChooseUs />
      <Testimonials />
    </div>
  );
};

export default ComponentPages;
