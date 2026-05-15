import Hero from '../components/Hero';
import Marquee from '../components/Marquee';
import FeaturedProducts from '../components/FeaturedProducts';
import PromoBanners from '../components/PromoBanners';
import Features from '../components/Features';
import Testimonials from '../components/Testimonials';
import Newsletter from '../components/Newsletter';

const Home = ({ searchQuery }) => {
  return (
    <>
      <Hero />
      <Marquee />
      <FeaturedProducts searchQuery={searchQuery} />
      <PromoBanners />
      <Features />
      <Testimonials />
      <Newsletter />
    </>
  );
};

export default Home;
