// File: src/components/Collections.jsx
import React from 'react';

const Collections = ({ siteData, isMobile, handleMouseMove, handleMouseLeave }) => {
  return (
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
  );
};

export default Collections;
