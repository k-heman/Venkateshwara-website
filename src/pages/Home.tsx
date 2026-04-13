import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Clock, ShieldAlert, Bed, Sofa, CheckCircle, Package } from 'lucide-react';
import { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard';

import { getProducts } from '../services/db';
import type { Product } from '../services/db';

function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const navigate = useNavigate();

  const handleLinkClick = (e: React.MouseEvent, path: string) => {
    e.preventDefault();
    navigate(path);
  };

  useEffect(() => {
    getProducts()
      .then(data => {
        // Filter to only show products selected by the admin
        const homeProducts = data.filter(p => p.showOnHome === true);
        setFeaturedProducts(homeProducts);
      })
      .catch(err => console.error(err));
  }, []);

  const categories = [
    { name: 'Beeruva', icon: <Package size={32} /> },
    { name: 'Dressing Tables', icon: <Sofa size={32} /> },
    { name: 'Mattresses', icon: <Bed size={32} /> },
    { name: 'Gas Stoves', icon: <CheckCircle size={32} /> },
    { name: 'Air Coolers', icon: <ShieldCheck size={32} /> },
    { name: 'Refrigerators', icon: <Package size={32} /> },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section
        className="section flex-center"
        style={{
          minHeight: '85vh',
          background: 'linear-gradient(140deg, rgba(92, 23, 39, 0.72) 0%, rgba(26, 10, 15, 0.62) 60%, rgba(201, 146, 42, 0.18) 100%), url("/homepage-bg.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          color: 'white',
          padding: '2rem',
          display: 'flex',
          justifyContent: 'flex-start',
          alignItems: 'center',
          position: 'relative'
        }}
      >
        <div className="container animate-fade-in" style={{ maxWidth: '1280px', width: '100%', textAlign: 'left', zIndex: 10 }}>
          <div style={{ maxWidth: '750px' }}>
            <p className="mb-4" style={{
              fontWeight: 700,
              letterSpacing: '0.12em',
              fontSize: '0.85rem',
              marginBottom: '1.25rem',
              color: 'var(--color-accent)',
              textTransform: 'uppercase',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.6rem',
              background: 'rgba(255,255,255,0.10)',
              backdropFilter: 'blur(8px)',
              padding: '0.45rem 1.1rem',
              borderRadius: '999px',
              border: '1px solid rgba(255,255,255,0.18)',
            }}>
              <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: 'var(--color-accent)' }} />
              Est. 20+ Years&nbsp;·&nbsp;Srivenkateshwara Enterprises Legacy
            </p>
            <h1 className="hero-title mb-6">
              Sri Venkateshwara <br className="mobile-only" />
              Enterprises —&nbsp;<br className="mobile-only" />
              <span style={{ color: 'var(--color-accent)' }}>Your Home,<br className="mobile-only" /> Our Pride</span>
            </h1>
            <p className="hero-description mb-8 delay-100">
              Trusted for over 20 years, we proudly serve families across the region as <strong style={{ color: '#fff' }}>Srivenkateshwara Enterprises</strong> — bringing you branded home appliances, furniture &amp; more, with unmatched after-sales care.
            </p>
            <div className="flex flex-wrap delay-200" style={{ gap: '1.25rem', opacity: 0, animation: 'fadeIn 0.5s ease 0.2s forwards' }}>
              <button
                onClick={(e) => handleLinkClick(e, '/products')}
                className="btn btn-primary hero-btn"
              >
                Explore Products
              </button>
              <button
                onClick={(e) => handleLinkClick(e, '/contact')}
                className="btn hero-btn-outline"
              >
                Contact Us
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="section bg-light" style={{ padding: '5rem 0', background: 'var(--color-bg-light)' }}>
        <div className="container">
          <div className="flex-between mb-8" style={{ marginBottom: '3rem' }}>
            <h2 className="heading-lg">Featured Products</h2>
            <button
              onClick={(e) => handleLinkClick(e, '/products')}
              className="btn btn-outline"
            >
              View All
            </button>
          </div>

          {featuredProducts.length > 0 ? (
            <div className="product-grid">
              {featuredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center p-8 text-muted">No featured products updated yet.</div>
          )}
        </div>
      </section>

      {/* Categories Review */}
      <section className="section bg-light" style={{ padding: '5rem 0' }}>
        <div className="container">
          <div className="text-center mb-10" style={{ marginBottom: '3rem' }}>
            <h2 className="heading-lg" style={{ marginBottom: '1rem' }}>Shop by Category</h2>
            <p className="text-muted max-w-2xl mx-auto" style={{ maxWidth: '600px', margin: '0 auto' }}>Find precisely what you're looking for by browsing our premium collections.</p>
          </div>

          <div className="grid grid-cols-2 md-grid-cols-3" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1.5rem' }}>
            {categories.map((cat, i) => (
              <Link to={`/products?category=${encodeURIComponent(cat.name)}`} key={i} className="card flex-col flex-center text-center" style={{ padding: '2rem 1rem', textDecoration: 'none' }}>
                <div className="mb-4" style={{ color: 'var(--color-primary)', marginBottom: '1rem' }}>{cat.icon}</div>
                <h3 className="heading-sm" style={{ fontSize: '1rem' }}>{cat.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="section bg-light" style={{ padding: '3rem 0', background: 'white', borderBottom: '1px solid #f1f5f9' }}>
        <div className="container grid grid-cols-1 md-grid-cols-3" style={{ gap: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
          {[
            { title: 'Branded Products', icon: <ShieldCheck size={40} className="text-primary mb-4" />, desc: '100% genuine, original brands — sourced and verified by Srivenkateshwara Enterprises.' },
            { title: 'Built to Last', icon: <Clock size={40} className="text-primary mb-4" />, desc: 'Every product is tested for longevity, reliability and everyday family use.' },
            { title: 'Trusted Service', icon: <ShieldAlert size={40} className="text-primary mb-4" />, desc: 'Dedicated after-sales support — the legacy of 20+ years, continued.' }
          ].map((feature, i) => (
            <div key={i} className="flex-col flex-center text-center card" style={{ padding: '2rem' }}>
              <div style={{ padding: '1rem', background: 'rgba(124, 33, 52, 0.07)', borderRadius: '50%', marginBottom: '1rem', color: 'var(--color-primary)' }}>
                {feature.icon}
              </div>
              <h3 className="heading-sm" style={{ marginBottom: '0.5rem' }}>{feature.title}</h3>
              <p className="text-muted">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}

export default Home;
