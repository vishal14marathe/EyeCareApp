// File: src/components/Hero.jsx
import React from 'react';
import glassImg from '../assets/glassImgNew.png';

const Hero = ({ siteData, isMobile, handleHeroMouseMove, handleHeroMouseLeave, navigate }) => {
  return (
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
        </div>
      </div>
    </section>
  );
};

export default Hero;
