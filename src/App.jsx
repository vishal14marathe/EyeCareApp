import React, { useState, useEffect } from 'react';
// import glassImg from './assets/glassImg.webp';
import glassImg from './assets/glassImgNew.png'
import glass4 from './assets/glass4.gif'
import Admin from './admin/admin'
import { subscribeToLandingPageData, addBooking } from './servises/storageServises'
import eyecarelogo from './assets/eyecarelogo.png';

function App() {
  const [activeTab, setActiveTab] = useState('all');
  const [loading, setLoading] = useState(true);
  const [isClosing, setIsClosing] = useState(false);
  const [activeNav, setActiveNav] = useState('');
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [siteData, setSiteData] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const unsubscribe = subscribeToLandingPageData((data) => {
      if (data) {
        setSiteData(data);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  const navigate = (path) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
  };

  useEffect(() => {
    // Phase 1: Slide up after 1.5 seconds
    const timer = setTimeout(() => {
      setIsClosing(true);
    }, 1500);

    // Phase 2: Unmount after 2.5 seconds total
    const unmountTimer = setTimeout(() => {
      setLoading(false);
    }, 2500);

    return () => {
      clearTimeout(timer);
      clearTimeout(unmountTimer);
    };
  }, []);

  useEffect(() => {
    if (!loading) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
          }
        });
      }, { threshold: 0.1 });

      const elements = document.querySelectorAll('.reveal');
      elements.forEach(el => observer.observe(el));

      return () => elements.forEach(el => observer.unobserve(el));
    }
  }, [loading, currentPath]);

  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (centerY - y) / 15;
    const rotateY = (x - centerX) / 15;
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  };

  const handleMouseLeave = (e) => {
    e.currentTarget.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
  };

  const handleHeroMouseMove = (e) => {
    const container = e.currentTarget;
    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const percentX = (x - centerX) / centerX;
    const percentY = (y - centerY) / centerY;

    const card = container.querySelector('.tilt-card');
    if (card) {
      card.style.transform = `perspective(1000px) rotateX(${percentY * -25}deg) rotateY(${percentX * 25}deg)`;
    }

    const img = container.querySelector('.tilt-card img');
    if (img) {
      img.style.filter = `drop-shadow(${percentX * -30}px ${percentY * -30}px 40px rgba(0,0,0,0.15))`;
    }

    const reflection = container.querySelector('.lens-reflection');
    if (reflection) {
      reflection.style.transform = `translate(${percentX * -50}px, ${percentY * -50}px)`;
    }
  };

  const handleHeroMouseLeave = (e) => {
    const container = e.currentTarget;
    const card = container.querySelector('.tilt-card');
    if (card) card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';

    const img = container.querySelector('.tilt-card img');
    if (img) img.style.filter = 'drop-shadow(0 20px 30px rgba(0,0,0,0.15))';

    const reflection = container.querySelector('.lens-reflection');
    if (reflection) reflection.style.transform = 'translate(0px, 0px)';
  };

  if (loading) {
    return (
      <div style={{
        position: 'fixed',
        top: 0, left: 0, width: '100vw', height: '100vh',
        background: 'linear-gradient(-45deg, #f0f4f8, #e6f0fa, #ffffff, #f0f4f8)',
        backgroundSize: '400% 400%',
        animation: 'gradientBG 10s ease infinite',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        zIndex: 1000,
        overflow: 'hidden',
        transition: 'transform 1s cubic-bezier(0.77, 0, 0.175, 1)',
        transform: isClosing ? 'translateY(-100%)' : 'translateY(0)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        color: '#0f172a',
        fontFamily: 'var(--font-heading)'
      }}>
        {/* Aurora Background Effect */}
        <div style={{ position: 'absolute', width: '300px', height: '300px', background: 'rgba(255, 0, 127, 0.15)', filter: 'blur(80px)', borderRadius: '50%', top: '20%', left: '10%', zIndex: 0 }}></div>
        <div style={{ position: 'absolute', width: '400px', height: '400px', background: 'rgba(0, 255, 255, 0.15)', filter: 'blur(100px)', borderRadius: '50%', bottom: '20%', right: '10%', zIndex: 0 }}></div>
        <div style={{ position: 'absolute', width: '300px', height: '300px', background: 'rgba(124, 58, 237, 0.15)', filter: 'blur(80px)', borderRadius: '50%', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 0 }}></div>

        {/* Content (Centered) */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          zIndex: 1 // Ensure content is above the background effects
        }}>
          <div style={{ marginBottom: '0.5rem', animation: 'fadeInScale 1s ease-out' }}>
            <img src={eyecarelogo} alt="Logo" style={{ width: '100px', height: '100px', objectFit: 'contain' }} />
          </div>
          <div style={{ animation: 'fadeSlideUp 1s ease-out 0.3s both', textAlign: 'center' }}>
            <div style={{ fontSize: isMobile ? '2rem' : '3rem', fontWeight: 800, letterSpacing: '0.05em', color: '#0f172a', fontFamily: 'var(--font-heading)' }}>Tanishka</div>
            <div style={{ fontSize: isMobile ? '0.875rem' : '1.25rem', color: 'var(--text-secondary)', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: '0.25rem' }}>Eye Care Optical</div>
          </div>
          <div style={{
            width: '40px',
            height: '40px',
            border: '2px solid rgba(0,0,0,0.05)',
            borderTopColor: 'var(--accent-blue)',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            marginTop: '3rem'
          }}></div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', overflowX: 'hidden' }}>
      {/* Background Glows */}
      <div style={{
        position: 'absolute',
        width: '400px',
        height: '400px',
        background: 'radial-gradient(circle, rgba(0, 255, 255, 0.15) 0%, rgba(0, 255, 255, 0) 70%)',
        top: '-100px',
        right: '-100px',
        zIndex: 0,
        pointerEvents: 'none'
      }}></div>
      <div style={{
        position: 'absolute',
        width: '600px',
        height: '600px',
        background: 'radial-gradient(circle, rgba(124, 58, 237, 0.08) 0%, rgba(124, 58, 237, 0) 70%)',
        bottom: '20%',
        left: '-200px',
        zIndex: 0,
        pointerEvents: 'none'
      }}></div>

      {currentPath === '/' || currentPath === '' ? (
        <>
          {/* Navigation */}
          <nav className="glass" style={{
            position: 'fixed',
            width: '90%',
            top: isMobile ? '0.5rem' : '1.5rem',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 100,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: isMobile ? '0.25rem 1rem' : '0.5rem 2rem',
            borderRadius: 'var(--radius-full)',
            boxShadow: 'var(--shadow-cinematic)',
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)'
          }}>
            <div
              style={{ display: 'flex', flexDirection: 'column', cursor: 'pointer' }}
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                setActiveNav('');
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <img src={eyecarelogo} alt="Logo" style={{ width: '45px', height: '43px', objectFit: 'contain' }} />
                <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.25rem' }}>Tanishka</span>
              </div>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', letterSpacing: '0.05em', marginTop: '0.1rem', marginLeft: '16px' }}>Eye Care Optical</span>
            </div>

            {!isMobile && (
              <div className="nav-links" style={{ display: 'flex', gap: '2rem', fontWeight: 500, fontSize: '0.875rem' }}>
                {['About', 'Collections', 'Virtual Try-On', 'Services'].map((item) => (
                  <a
                    key={item}
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveNav(item);
                      const id = item.toLowerCase().replace(' ', '-');
                      const element = document.getElementById(id);
                      if (element) {
                        element.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                    style={{
                      color: activeNav === item ? 'var(--accent-blue)' : 'var(--text-secondary)',
                      transition: 'color 0.3s ease',
                      position: 'relative',
                      cursor: 'pointer'
                    }}
                  >
                    {item}
                    {activeNav === item && (
                      <span style={{
                        position: 'absolute',
                        bottom: '-4px',
                        left: 0,
                        width: '100%',
                        height: '2px',
                        backgroundColor: 'var(--accent-blue)',
                        borderRadius: 'var(--radius-full)'
                      }} />
                    )}
                  </a>
                ))}
              </div>
            )}

            {isMobile ? (
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} style={{ padding: '0.5rem', color: 'var(--text-primary)' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
              </button>
            ) : (
              <div className="nav-buttons" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <button className="btn btn-primary" style={{ padding: '0.5rem 1rem' }} onClick={() => navigate('/booktest')}>Book Test</button>
              </div>
            )}

            {/* Mobile Dropdown Menu */}
            {isMobile && mobileMenuOpen && (
              <div style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                width: '100%',
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                borderRadius: 'var(--radius-xl)',
                boxShadow: 'var(--shadow-lg)',
                padding: '1rem',
                marginTop: '0.5rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
                zIndex: 99
              }}>
                {['About', 'Collections', 'Virtual Try-On', 'Services'].map((item) => (
                  <a
                    key={item}
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveNav(item);
                      setMobileMenuOpen(false); // Close menu
                      const id = item.toLowerCase().replace(' ', '-');
                      const element = document.getElementById(id);
                      if (element) {
                        element.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                    style={{
                      color: activeNav === item ? 'var(--accent-blue)' : 'var(--text-secondary)',
                      fontWeight: 500,
                      fontSize: '1rem',
                      padding: '0.75rem 1rem',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: activeNav === item ? 'rgba(37, 99, 235, 0.05)' : 'transparent',
                      transition: 'background-color 0.2s ease'
                    }}
                  >
                    {item}
                  </a>
                ))}
              </div>
            )}
          </nav>

          {/* Hero Section */}
          <section className="section-padding reveal" style={{ position: 'relative', overflow: 'hidden' }}>
            <div className="container grid grid-cols-2" style={{ alignItems: 'center', gap: isMobile ? '2rem' : '4rem', minHeight: isMobile ? 'auto' : '80vh', paddingTop: isMobile ? '6rem' : '8rem' }}>
              <div style={{ zIndex: 1 }}>
                <span style={{ fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--accent-blue)' }}>Clinical Precision & Luxury</span>
                <h1 className="hero-title" style={{ marginTop: '1rem', marginBottom: '1.5rem', lineHeight: '1.1' }}>
                  {siteData?.heroTitle || "Define Your Vision with"} <span className="text-gradient">{siteData?.heroSubtitle || "Clinical Excellence."}</span>
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.125rem', marginBottom: '2.5rem', maxWidth: '500px' }}>
                  {siteData?.heroDescription || "Experience the pinnacle of optical engineering paired with high-fashion aesthetics. Precision lenses met with avant-garde design."}
                </p>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button className="btn btn-primary" style={{ padding: '0.75rem 2rem' }} onClick={() => { const el = document.getElementById('collections'); if (el) el.scrollIntoView({ behavior: 'smooth' }); }}>Explore Collection</button>
                  <button className="btn btn-secondary" style={{ padding: '0.75rem 2rem' }} onClick={() => navigate('/booktest')}>Book Eye Test</button>
                </div>
              </div>

              <div
                style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                onMouseMove={handleHeroMouseMove}
                onMouseLeave={handleHeroMouseLeave}
              >
                {/* Outer Wrapper for Entrance Animation */}
                <div className="animate-slide-in" style={{ position: 'relative', zIndex: 2 }}>
                  {/* Middle Wrapper for Floating */}
                  <div className="floating">
                    {/* Inner Wrapper for Tilt */}
                    <div
                      className="tilt-card"
                      style={{ position: 'relative', transition: 'transform 0.1s ease', overflow: 'hidden' }}
                    >
                      <img
                        src={glassImg}
                        alt="Luxury Glasses"
                        style={{
                          width: '100%',
                          maxWidth: '500px',
                          filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.15))',
                          mixBlendMode: 'multiply',
                          transition: 'filter 0.1s ease, transform 0.3s ease'
                        }}
                      />
                      {/* Lens Reflection Stunt */}
                      <div
                        className="lens-reflection"
                        style={{
                          position: 'absolute',
                          top: '-50%',
                          left: '-50%',
                          width: '200%',
                          height: '200%',
                          background: 'linear-gradient(45deg, transparent 45%, rgba(255,255,255,0.8) 50%, transparent 55%)',
                          mixBlendMode: 'overlay',
                          pointerEvents: 'none',
                          transition: 'transform 0.1s ease'
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
                {/* Rings removed as requested */}
              </div>
            </div>
          </section>

          {/* About Us */}
          <section id="about" className="reveal" style={{ backgroundColor: '#ffffff', padding: isMobile ? '2rem 0' : '4rem 0 6rem 0' }}>
            <div className="container">
              <div className="grid grid-cols-2" style={{ gap: '4rem', alignItems: 'center' }}>
                {/* Left Column: Text */}
                <div>
                  <span style={{ fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--accent-blue)' }}>About Us</span>
                  <h2 style={{ fontSize: '3rem', marginTop: '1rem', marginBottom: '1.5rem', fontFamily: 'var(--font-heading)' }}>{siteData?.aboutTitle || "Crafting the Future of Vision"}</h2>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: '1.8', marginBottom: '2rem' }}>
                    {siteData?.aboutDescription1 || "At Visionary Elite, we believe that eyewear is not just a medical necessity, but a statement of identity. For over a decade, we have been at the intersection of clinical precision and luxury aesthetics, crafting bespoke optical solutions for the discerning individual."}
                  </p>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: '1.8', marginBottom: '3rem' }}>
                    {siteData?.aboutDescription2 || "Our team of world-class optometrists and master artisans work in harmony to ensure that every frame we deliver provides unparalleled clarity and unmatched style."}
                  </p>
                  <div style={{ display: 'flex', gap: '3rem' }}>
                    <div>
                      <h3 style={{ fontSize: '2.5rem', color: 'var(--accent-blue)', fontFamily: 'var(--font-heading)' }}>{siteData?.stat1Value || "10+"}</h3>
                      <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{siteData?.stat1Label || "Years of Innovation"}</p>
                    </div>
                    <div>
                      <h3 style={{ fontSize: '2.5rem', color: 'var(--accent-blue)', fontFamily: 'var(--font-heading)' }}>{siteData?.stat2Value || "50k+"}</h3>
                      <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{siteData?.stat2Label || "Happy Eyes"}</p>
                    </div>
                    <div>
                      <h3 style={{ fontSize: '2.5rem', color: 'var(--accent-blue)', fontFamily: 'var(--font-heading)' }}>{siteData?.stat3Value || "100%"}</h3>
                      <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{siteData?.stat3Label || "Precision Guarantee"}</p>
                    </div>
                  </div>
                </div>

                {/* Right Column: Visual */}
                <div style={{ position: 'relative' }}>
                  <div style={{
                    width: '100%',
                    height: isMobile ? '300px' : '500px',
                    backgroundColor: '#f8f9fa',
                    borderRadius: 'var(--radius-2xl)',
                    overflow: 'hidden',
                    boxShadow: 'var(--shadow-cinematic)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <img
                      src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=800&q=80"
                      alt="About Us"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                  {/* Glassmorphism accent card */}
                  <div className="glass" style={{
                    position: 'absolute',
                    bottom: '2rem',
                    left: '-2rem',
                    padding: '2rem 2rem 2rem 3.5rem',
                    borderRadius: 'var(--radius-xl)',
                    maxWidth: '250px',
                    boxShadow: 'var(--shadow-lg)'
                  }}>
                    <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>"{siteData?.quoteText || "The best way to predict the future is to create it."}"</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>- {siteData?.quoteAuthor || "Visionary Elite Team"}</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Featured Collections */}
          <section id="collections" className="section-padding reveal" style={{ backgroundColor: '#ffffff' }}>
            <div className="container">
              <div className="flex justify-between items-center" style={{ marginBottom: '3rem' }}>
                <div>
                  <h2 style={{ fontSize: '2.5rem' }}>{siteData?.collectionsTitle || "Featured Collections"}</h2>
                  <p style={{ color: 'var(--text-secondary)' }}>Curated masterpieces from around the globe.</p>
                </div>
                <button className="btn btn-secondary">View All &rarr;</button>
              </div>

              <div className="grid grid-cols-4" style={{ gap: '2rem' }}>
                {(siteData?.collections || [
                  { id: 1, name: "MELLER", description: "Made in Spain", image: "/model_sunglasses.png" },
                  { id: 2, name: "LE PETIT", description: "Made in Paris", image: "/model_glasses_gold.png" },
                  { id: 3, name: "JOHN JACOBS", description: "Made in India", image: "/glasses_banner.png" }
                ]).map((item) => (
                  <div
                    key={item.id}
                    className="tilt-card"
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                    style={{
                      borderRadius: 'var(--radius-2xl)',
                      overflow: 'hidden',
                      boxShadow: 'var(--shadow-lg)',
                      position: 'relative',
                      height: isMobile ? '300px' : '400px'
                    }}
                  >
                    <img src={item.image || "/model_sunglasses.png"} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      padding: '2rem',
                      background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
                      color: '#fff'
                    }}>
                      <h3 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>{item.name}</h3>
                      <p style={{ fontSize: '0.875rem', opacity: 0.8 }}>{item.description}</p>
                    </div>
                    <button style={{
                      position: 'absolute',
                      top: '1rem',
                      right: '1rem',
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(255,255,255,0.2)',
                      backdropFilter: 'blur(4px)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff'
                    }}>
                      +
                    </button>
                  </div>
                ))}

                {/* Card 4 (Static) */}
                <div
                  className="tilt-card"
                  onMouseMove={handleMouseMove}
                  onMouseLeave={handleMouseLeave}
                  style={{
                    borderRadius: 'var(--radius-2xl)',
                    overflow: 'hidden',
                    boxShadow: 'var(--shadow-lg)',
                    position: 'relative',
                    height: '400px'
                  }}
                >
                  <div style={{
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    color: '#fff',
                    padding: '2rem'
                  }}>
                    <span style={{ fontSize: '0.875rem', color: 'var(--accent-cyan)', marginBottom: '1rem' }}>MORE BRANDS</span>
                    <h3 style={{ fontSize: '1.75rem', textAlign: 'center', marginBottom: '1rem' }}>OWNDAYS COLLECTION</h3>
                    <p style={{ textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-muted)' }}>Explore over 50+ premium brands curated for you.</p>
                    <button className="btn btn-futuristic" style={{ marginTop: '2rem' }}>Explore All</button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* AI Virtual Try-On */}
          <section id="virtual-try-on" className="section-padding reveal" style={{ position: 'relative' }}>
            <div className="container grid grid-cols-2" style={{ alignItems: 'center', gap: '4rem' }}>

              <div style={{ position: 'relative', marginBottom: isMobile ? '3rem' : '5rem' }}>
                <div
                  style={{
                    borderRadius: 'var(--radius-2xl)',
                    overflow: 'hidden',
                    boxShadow: 'var(--shadow-cinematic)',
                    position: 'relative'
                  }}
                >
                  <img src="/face_mapping_3d.png" alt="3D Facial Scan" style={{ width: '100%' }} />
                  <div className="scan-line"></div>

                  {/* Holographic Overlays */}
                  <div style={{
                    position: 'absolute',
                    top: '10%',
                    left: '10%',
                    padding: '0.5rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.75rem',
                    fontWeight: 700
                  }} className="glass-dark">
                    LIVE FACIAL MESH: ACTIVE
                  </div>

                  <div style={{
                    position: 'absolute',
                    bottom: '10%',
                    right: '10%',
                    padding: '0.5rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.75rem',
                    fontWeight: 700
                  }} className="glass-dark">
                    98.4% FIT ACCURACY
                  </div>
                </div>

                {/* Tech details */}
                <div className="glass" style={{
                  position: 'absolute',
                  bottom: isMobile ? '-1rem' : '-2rem',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: isMobile ? '90%' : '80%',
                  padding: isMobile ? '0.75rem' : '1.5rem',
                  borderRadius: 'var(--radius-xl)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  boxShadow: 'var(--shadow-lg)'
                }}>
                  <div>
                    <p style={{ fontSize: isMobile ? '0.6rem' : '0.75rem', color: 'var(--text-secondary)' }}>MAPPING</p>
                    <p style={{ fontSize: isMobile ? '1rem' : '1.25rem', fontWeight: 700, color: 'var(--accent-blue)' }}>1,024</p>
                  </div>
                  <div style={{ borderLeft: '1px solid rgba(0,0,0,0.1)', paddingLeft: isMobile ? '0.5rem' : '1.5rem' }}>
                    <p style={{ fontSize: isMobile ? '0.6rem' : '0.75rem', color: 'var(--text-secondary)' }}>LATENCY</p>
                    <p style={{ fontSize: isMobile ? '1rem' : '1.25rem', fontWeight: 700, color: '#10b981' }}>12ms</p>
                  </div>
                  <div style={{ borderLeft: '1px solid rgba(0,0,0,0.1)', paddingLeft: isMobile ? '0.5rem' : '1.5rem' }}>
                    <p style={{ fontSize: isMobile ? '0.6rem' : '0.75rem', color: 'var(--text-secondary)' }}>STATUS</p>
                    <p style={{ fontSize: isMobile ? '1rem' : '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>READY</p>
                  </div>
                </div>
              </div>

              <div>
                <span style={{ fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--accent-cyan)' }}>Next-Gen Technology</span>
                <h2 style={{ fontSize: '3rem', marginTop: '1rem', marginBottom: '1.5rem' }}>
                  {siteData?.virtualTryOnTitle || "Your Face, Your Stage."}
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.125rem', marginBottom: '2rem' }}>
                  {siteData?.virtualTryOnDescription || "Experience our proprietary AI-driven Virtual Try-On. Precisely mapped to your facial structure for a perfect virtual fit."}
                </p>

                <div style={{ marginBottom: '2.5rem' }}>
                  <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                    <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: 'rgba(0, 255, 255, 0.2)', display: 'flex', alignItems: 'center', justifyCenter: 'center', color: 'var(--accent-blue)' }}>✓</div>
                    <div>
                      <h4 style={{ fontSize: '1.125rem', marginBottom: '0.25rem' }}>{siteData?.vtoFeature1Title || "Precision 3D Mapping"}</h4>
                      <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{siteData?.vtoFeature1Desc || "Millimeter-perfect alignment with your unique features."}</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: 'rgba(0, 255, 255, 0.2)', display: 'flex', alignItems: 'center', justifyCenter: 'center', color: 'var(--accent-blue)' }}>✓</div>
                    <div>
                      <h4 style={{ fontSize: '1.125rem', marginBottom: '0.25rem' }}>{siteData?.vtoFeature2Title || "Real-time Lens Refraction"}</h4>
                      <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{siteData?.vtoFeature2Desc || "Simulates how light passes through your prescription lenses."}</p>
                    </div>
                  </div>
                </div>

                <button className="btn btn-futuristic" style={{ padding: '1rem 2.5rem' }}>Launch Virtual Try-On</button>
              </div>

            </div>
          </section>

          {/* Services */}
          <section id="services" className="section-padding reveal" style={{ backgroundColor: 'var(--bg-secondary)' }}>
            <div className="container">
              <div style={{ textAlign: 'center', marginBottom: isMobile ? '1.5rem' : '4rem' }}>
                <span style={{ fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--accent-blue)' }}>Expert Care</span>
                <h2 style={{ fontSize: '2.5rem', marginTop: '0.5rem' }}>{siteData?.servicesTitle || "Clinical Excellence Delivered."}</h2>
              </div>

              <div className="grid grid-cols-3" style={{ gap: '2rem' }}>
                {(siteData?.services || [
                  { id: 1, title: "Advanced Eye Test", description: "Comprehensive diagnostics using state-of-the-art AI imaging technology." },
                  { id: 2, title: "Custom Lens Crafting", description: "Lenses tailored specifically to your prescription and lifestyle needs." },
                  { id: 3, title: "Style Consultation", description: "Personal styling to find the perfect frames that match your facial structure." }
                ]).map((item) => (
                  <div key={item.id} className="glass" style={{ padding: isMobile ? '1.5rem' : '3rem 2rem', borderRadius: 'var(--radius-xl)', textAlign: 'center', transition: 'var(--transition-normal)' }}>
                    <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: 'rgba(37, 99, 235, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem auto', color: 'var(--accent-blue)' }}>
                      {item.id === 1 ? (
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg>
                      ) : item.id === 2 ? (
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2z"></path><polyline points="11 12 12 12 15 12"></polyline></svg>
                      ) : (
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                      )}
                    </div>
                    <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>{item.title}</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '2rem' }}>{item.description}</p>
                    <button style={{ color: 'var(--accent-blue)', fontWeight: 600, fontSize: '0.875rem' }}>Learn More &rarr;</button>
                  </div>
                ))}
              </div>
            </div>
          </section>





          {/* Footer */}
          <footer style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-secondary)', padding: '5rem 0', borderTop: '1px solid rgba(0,0,0,0.05)' }}>
            <div className="container grid grid-cols-4" style={{ gap: '3rem' }}>
              <div>
                <div style={{ display: 'flex', flexDirection: 'column', color: '#0f172a', marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <img src={eyecarelogo} alt="Logo" style={{ width: '45px', height: '43px', objectFit: 'contain' }} />
                    <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.25rem' }}>Tanishka</span>
                  </div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', letterSpacing: '0.05em', marginTop: '0.1rem', marginLeft: '16px' }}>Eye Care Optical</span>
                </div>
                <p style={{ fontSize: '0.875rem', lineHeight: '1.6' }}>
                  Setting the standard for luxury eyewear through clinical innovation and timeless design.
                </p>
              </div>

              <div>
                <h4 style={{ color: '#0f172a', marginBottom: '1.5rem', fontSize: '1rem' }}>Discover</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem' }}>
                  <a href="#">New Arrivals</a>
                  <a href="#">Best Sellers</a>
                  <a href="#">Virtual Try-On</a>
                  <a href="#">Store Locator</a>
                </div>
              </div>

              <div>
                <h4 style={{ color: '#0f172a', marginBottom: '1.5rem', fontSize: '1rem' }}>Support</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem' }}>
                  <a href="#">Contact Us</a>
                  <a href="#">FAQs</a>
                  <a href="#">Shipping & Returns</a>
                  <a href="#">Care Guide</a>
                  <a href="#" onClick={(e) => { e.preventDefault(); navigate('/admin/register'); }} style={{ color: 'var(--accent-blue)', fontWeight: 600 }}>Admin Panel</a>
                </div>
              </div>

              <div>
                <h4 style={{ color: '#0f172a', marginBottom: '1.5rem', fontSize: '1rem' }}>Stay Connected</h4>
                <p style={{ fontSize: '0.875rem', marginBottom: '1.5rem' }}>Subscribe to receive updates on new collections and exclusive offers.</p>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    type="email"
                    placeholder="Email address"
                    style={{
                      flex: 1,
                      padding: '0.75rem 1rem',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid rgba(0,0,0,0.1)',
                      backgroundColor: '#f8f9fa',
                      color: '#0f172a',
                      fontSize: '0.875rem'
                    }}
                  />
                  <button className="btn btn-primary" style={{ padding: '0.75rem 1.5rem' }}>Join</button>
                </div>
              </div>
            </div>

            <div className="container" style={{ marginTop: '5rem', paddingTop: '2rem', borderTop: '1px solid rgba(0,0,0,0.05)', textAlign: 'center', fontSize: '0.75rem' }}>
              <p>&copy; 2026 Tanishka Eye Care Optical. All Rights Reserved.</p>
            </div>
          </footer>
        </>
      ) : currentPath === '/booktest' ? (
        <BookTestPage navigate={navigate} />
      ) : currentPath.startsWith('/admin') ? (
        <Admin currentPath={currentPath} navigate={navigate} />
      ) : (
        <div style={{ padding: '10rem 2rem', textAlign: 'center' }}>
          <h2 style={{ fontSize: '3rem', marginBottom: '1rem' }}>404 Not Found</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>The page you are looking for does not exist.</p>
          <button onClick={() => navigate('/')} className="btn btn-primary">Go Home</button>
        </div>
      )}
    </div>
  );
}

const BookTestPage = ({ navigate }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await addBooking(formData);
      setIsSuccess(true);
      setFormData({ name: '', email: '', phone: '' });
    } catch (error) {
      alert("Error booking test. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ padding: '10rem 2rem', textAlign: 'center' }}>
      <h2 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Book Eye Test</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Schedule your comprehensive eye examination with our specialists.</p>

      {isSuccess ? (
        <div style={{ maxWidth: '400px', margin: '0 auto', background: '#ecfdf5', padding: '2rem', borderRadius: 'var(--radius-xl)', color: '#047857' }}>
          <h3 style={{ marginBottom: '0.5rem' }}>Booking Successful!</h3>
          <p>We will contact you shortly to confirm your appointment.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ maxWidth: '400px', margin: '0 auto', background: '#fff', padding: '2rem', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-lg)' }}>
          <input
            type="text"
            placeholder="Your Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            style={{ width: '100%', padding: '0.75rem', marginBottom: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(0,0,0,0.1)' }}
          />
          <input
            type="email"
            placeholder="Your Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
            style={{ width: '100%', padding: '0.75rem', marginBottom: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(0,0,0,0.1)' }}
          />
          <input
            type="tel"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            required
            style={{ width: '100%', padding: '0.75rem', marginBottom: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(0,0,0,0.1)' }}
          />
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit Booking'}
          </button>
        </form>
      )}

      <button onClick={() => navigate('/')} className="btn btn-secondary" style={{ marginTop: '2rem' }}>Back to Home</button>
    </div>
  );
};

export default App;
