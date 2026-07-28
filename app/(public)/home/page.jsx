'use client';

import UserNavbar from '../../../components/user/home/UserNavbar';
import HeroSection from '../../../components/user/home/HeroSection';
import StatsStrip from '../../../components/user/home/StatsStrip';
import BrowseCategories from '../../../components/user/home/BrowseCategories';
import FeaturedCataloguesSection from '../../../components/user/home/FeaturedCataloguesSection';
import AllCataloguesSection from '../../../components/user/home/AllCataloguesSection';
import RecommendationsSection from '../../../components/user/home/RecommendationsSection';
import FeaturedBrandsSection from '../../../components/user/home/FeaturedBrandsSection';
import UserTestimonialsSection from '../../../components/user/home/UserTestimonialsSection';
import HomeCTASection from '../../../components/user/home/HomeCTASection';
import SiteFooter from '../../../components/footer/SiteFooter';

import { useCatalogues } from '../../../hooks/useCatalogues';
import { getCatalogueImage } from '../../../utils/imageHelpers';
import api from '../../../utils/axios';
import { useEffect, useMemo, useState } from 'react';

const defaultReviewStats = {
  activeItems: 0,
  totalItems: 0,
};

const toNumber = (value) => {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
};

const recommendationsData = [
  {
    type: 'photography',
    title: 'Photography Equipment',
    label: 'Based on your interest in electronics',
    description: 'Cameras, lenses, and studio gear from your favorite brands.',
    itemsLabel: '73 items  •  4.7',
  },
  {
    type: 'audio',
    title: 'Audio & Headphones',
    label: 'Trending in your area',
    description: 'Wireless headphones, speakers, and audio accessories.',
    itemsLabel: '91 items  •  4.8',
  },
  {
    type: 'eco',
    title: 'Eco-Friendly Products',
    label: 'Matches your preferences',
    description: 'Sustainable and eco-conscious products selected for you.',
    itemsLabel: '58 items  •  4.9',
  },
];

const brandsData = ['Apple', 'Google', 'Microsoft', 'Amazon', 'Samsung', 'Spotify'];

const testimonialsData = [
  {
    name: 'Sarah Johnson',
    role: 'Fashion Enthusiast',
    quote:
      '"CatalogHub has completely transformed how I discover products. The curated collections are spot-on and I find amazing items I would never have seen otherwise!"',
    initials: 'SJ',
  },
  {
    name: 'Michael Chen',
    role: 'Tech Professional',
    quote:
      '"The variety of catalogues is incredible! From electronics to home decor, everything is organized perfectly."',
    initials: 'MC',
  },
  {
    name: 'Emily Rodriguez',
    role: 'Interior Designer',
    quote:
      '"The curated collections make finding exactly what I need a breeze. The checkout process is smooth and hassle-free too!"',
    initials: 'ER',
  },
];

export default function UserHomePage() {
  const { data: cataloguesData, isLoading } = useCatalogues();

  const activeCataloguesCount = cataloguesData?.data?.length ?? 0;

  const [reviewStats, setReviewStats] = useState(defaultReviewStats);

  // ✅ FETCH item-review-stats API
  useEffect(() => {
    const fetchReviewStats = async () => {
      try {
        const res = await api.get('/api/v1/item-review-stats');

        if (res.data?.success) {
          const stats = res.data.data || {};

          setReviewStats({
            activeItems: toNumber(stats.activeItems),
            totalItems: toNumber(stats.totalItems),
          });
        }
      } catch (error) {
        console.error('Error fetching review stats:', error);
      }
    };

    fetchReviewStats();
  }, []);

  const activeItemsCount = toNumber(reviewStats.activeItems);
  const totalItemsCount = toNumber(reviewStats.totalItems);

  const statsData = [
    {
      type: 'catalogues',
      label: 'Active Catalogues',
      value: activeCataloguesCount.toLocaleString(),
      caption: '',
    },
    {
      type: 'products',
      label: 'Active Products',
      value: activeItemsCount.toLocaleString(),
      caption: '',
    },
    {
      type: 'products',
      label: 'Total Products',
      value: totalItemsCount.toLocaleString(),
      caption: '',
    },
  ];

  const ctaStats = [
    { label: 'Catalogues', value: activeCataloguesCount.toLocaleString() },
    { label: 'Active Products', value: activeItemsCount.toLocaleString() },
    { label: 'Total Products', value: totalItemsCount.toLocaleString() },
  ];

  // ✅ Featured catalogues
  const featuredCatalogues = useMemo(() => {
    if (!cataloguesData?.data?.length) return [];

    return cataloguesData.data.slice(0, 3).map((cat) => ({
      category: cat.type || '',
      title: cat.catalogueName || cat.name || 'Untitled Catalogue',
      description: cat.description,
      itemsLabel: `${cat.itemsCount} items`,
      slug: cat.uuid,
      image: getCatalogueImage(cat),
    }));
  }, [cataloguesData]);

  const allCatalogues = useMemo(() => {
    if (!cataloguesData?.data?.length) return [];

    return cataloguesData.data.map((cat) => ({
      category: cat.type || '',
      title: cat.catalogueName || cat.name || 'Untitled Catalogue',
      description: cat.description,
      itemsLabel: `${cat.itemsCount} items`,
      slug: cat.uuid,
      image: getCatalogueImage(cat),
    }));
  }, [cataloguesData]);

  return (
    <>
      <UserNavbar />
      <main className="min-h-screen bg-[#FFF8ED]">
        <HeroSection />
        {/* <StatsStrip stats={statsData} /> */}
        <BrowseCategories catalogues={cataloguesData?.data || []} />
        <FeaturedCataloguesSection
          title="Featured Catalogues"
          subtitle="Hand-picked collections curated for you"
          viewAllLabel="View All"
          items={featuredCatalogues}
        />
        <AllCataloguesSection
          title="All Catalogues"
          subtitle={
            isLoading
              ? 'Loading catalogues...'
              : `Showing ${allCatalogues.length} catalogues`
          }
          items={allCatalogues}
        />
        {/* <RecommendationsSection
          heading="Curated Recommendations"
          subtitle="Personalized suggestions based on your browsing history"
          recommendations={recommendationsData}
        /> */}
        {/* <FeaturedBrandsSection
          heading="Featured Brands"
          subtitle="Trusted by millions of customers worldwide"
          brands={brandsData}
        /> */}
        <UserTestimonialsSection
          heading="What Our Users Say"
          subtitle="Join thousands of satisfied customers"
        />
        <HomeCTASection stats={ctaStats} />
      </main>
      <SiteFooter
        quickLinks={['Home', 'Catalogues', 'Categories', 'Brands', 'About Us']}
        supportLinks={[
          'Help Center',
          'Contact Us',
          'FAQs',
          'Shipping Info',
          'Returns',
        ]}
        legalLinks={[
          'Privacy Policy',
          'Terms of Service',
          'Cookie Policy',
          'Disclaimer',
          'Licenses',
        ]}
        socialLinks={[
          ['Facebook', '#'],
          ['Twitter', '#'],
          ['LinkedIn', '#'],
          ['Instagram', '#'],
        ]}
        copyright="© 2026 chocotraill. All rights reserved."
      />
    </>
  );
}
