import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase/firebse";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";
import {
  getLandingPageData,
  updateLandingPageData,
  uploadImage,
  addCollection,
  updateCollection,
  deleteCollection,
  addService,
  updateService,
  deleteService,
} from "../servises/storageServises";
import { doc, setDoc } from "firebase/firestore";

const Admin = ({ currentPath, navigate }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [activeSection, setActiveSection] = useState("home");
  const [newCol, setNewCol] = useState({ name: "", desc: "", img: "" });
  const [editingId, setEditingId] = useState(null);
  const [newService, setNewService] = useState({ title: "", desc: "" });
  const [editingServiceId, setEditingServiceId] = useState(null);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3000);
  };

  // Dashboard state (Form data)
  const [formData, setFormData] = useState({
    heroTitle: "VISIONARY ELITE",
    heroSubtitle: "The Future of Vision, Redefined.",
    heroDescription: "Experience the pinnacle of optical engineering paired with high-fashion aesthetics. Precision lenses met with avant-garde design.",
    aboutTitle: "Crafting the Future of Vision",
    aboutDescription1: "At Visionary Elite, we believe that eyewear is not just a medical necessity, but a statement of identity.",
    collectionsTitle: "The Collections",
    virtualTryOnTitle: "Virtual Try-On",
    servicesTitle: "Our Services",
    collections: [
      { id: 1, name: "MELLER", description: "Made in Spain", image: "" },
      { id: 2, name: "LE PETIT", description: "Made in Paris", image: "" },
      { id: 3, name: "JOHN JACOBS", description: "Made in India", image: "" }
    ],
    services: [
      { id: 1, title: "Advanced Eye Test", description: "Comprehensive diagnostics using state-of-the-art AI imaging technology." },
      { id: 2, title: "Custom Lens Crafting", description: "Lenses tailored specifically to your prescription and lifestyle needs." },
      { id: 3, title: "Style Consultation", description: "Personal styling to find the perfect frames that match your facial structure." }
    ],
    virtualTryOnDescription: "Experience our proprietary AI-driven Virtual Try-On. Precisely mapped to your facial structure for a perfect virtual fit.",
    vtoFeature1Title: "Precision 3D Mapping",
    vtoFeature1Desc: "Millimeter-perfect alignment with your unique features.",
    vtoFeature2Title: "Real-time Lens Refraction",
    vtoFeature2Desc: "Simulates how light passes through your prescription lenses.",
    aboutDescription2: "Our team of world-class optometrists and master artisans work in harmony to ensure that every frame we deliver provides unparalleled clarity and unmatched style.",
    stat1Value: "10+",
    stat1Label: "Years of Innovation",
    stat2Value: "50k+",
    stat2Label: "Happy Eyes",
    stat3Value: "100%",
    stat3Label: "Precision Guarantee",
    quoteText: "The best way to predict the future is to create it.",
    quoteAuthor: "Visionary Elite Team"
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser && currentPath !== "/admin/dashboard") {
        navigate("/admin/dashboard");
      } else if (!currentUser && (currentPath === "/admin" || currentPath === "/admin/")) {
        navigate("/admin/login");
      }
    });
    return () => unsubscribe();
  }, [currentPath]);

  useEffect(() => {
    if (user && currentPath === "/admin/dashboard") {
      fetchData();
    }
  }, [user, currentPath]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await getLandingPageData();
      if (data) {
        setFormData(prev => ({ ...prev, ...data }));
      }
    } catch (err) {
      setError("Failed to fetch data.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      await updateProfile(userCredential.user, { displayName: name });

      await setDoc(doc(db, "users", userCredential.user.uid), {
        name: name,
        email: email,
        role: "admin",
      });

      alert("Registration successful! Please login.");
      navigate("/admin/login");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/admin/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/admin/login");
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await updateLandingPageData(formData);
      alert("Data updated successfully!");
    } catch (err) {
      setError("Failed to update data.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setLoading(true);
    try {
      const url = await uploadImage(file);
      setNewCol(prev => ({ ...prev, img: url }));
      alert("Image uploaded successfully!");
    } catch (err) {
      alert("Failed to upload image.");
    } finally {
      setLoading(false);
    }
  };

  // Styles
  const fullScreenFlex = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    backgroundColor: "#f6f6f7",
  };

  const glassStyle = {
    background: "#fff",
    borderRadius: "1rem",
    padding: "2.5rem",
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
    color: "#0f172a",
    maxWidth: "400px",
    width: "90%",
    border: "1px solid #e1e3e5",
  };

  const inputStyle = {
    width: "100%",
    padding: "0.75rem",
    marginBottom: "1rem",
    borderRadius: "0.5rem",
    border: "1px solid #d2d5d8",
    backgroundColor: "#fff",
    fontSize: "0.875rem",
  };

  const btnStyle = {
    width: "100%",
    padding: "0.75rem",
    backgroundColor: "#2c6ecb",
    color: "#fff",
    borderRadius: "0.5rem",
    border: "none",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "0.875rem",
  };

  // Dashboard Specific Styles (Shopify-like)
  const dashboardLayout = {
    display: "flex",
    minHeight: "100vh",
    backgroundColor: "#f6f6f7",
  };

  const sidebarStyle = {
    width: "240px",
    backgroundColor: "#e5e7eb", // Light gray
    padding: "2rem 1rem",
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
    position: isMobile ? 'fixed' : 'static',
    left: isMobile ? (sidebarOpen ? 0 : '-240px') : 0,
    top: 0,
    height: '100vh',
    zIndex: 1000,
    transition: 'left 0.3s ease',
    boxShadow: isMobile && sidebarOpen ? '0 0 15px rgba(0,0,0,0.1)' : 'none'
  };

  const sidebarLink = {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    padding: "0.75rem 1rem",
    borderRadius: "0.5rem",
    color: "#202223",
    textDecoration: "none",
    fontSize: "0.875rem",
    fontWeight: "500",
    cursor: "pointer",
  };

  const mainContentStyle = {
    flex: 1,
    display: "flex",
    flexDirection: "column",
  };

  const headerStyle = {
    backgroundColor: "#fff",
    padding: isMobile ? "1rem" : "1rem 2rem",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "1px solid #e1e3e5",
  };

  const contentArea = {
    padding: isMobile ? "1rem" : "2rem",
    flex: 1,
    overflowY: "auto",
  };

  const cardStyle = {
    backgroundColor: "#fff",
    padding: isMobile ? "1.5rem 1rem" : "2rem",
    borderRadius: "0.5rem",
    border: "1px solid #e1e3e5",
    marginBottom: "2rem",
  };

  // Render Register
  if (currentPath === "/admin/register") {
    return (
      <div style={fullScreenFlex}>
        <div style={glassStyle}>
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <h2
              style={{
                fontSize: "1.75rem",
                fontWeight: "700",
                color: "#202223",
              }}
            >
              Admin Register
            </h2>
            <p
              style={{
                color: "#6d7175",
                fontSize: "0.875rem",
                marginTop: "0.5rem",
              }}
            >
              Create an account to manage your store.
            </p>
          </div>
          {error && (
            <p
              style={{
                color: "#e51c24",
                marginBottom: "1rem",
                fontSize: "0.875rem",
              }}
            >
              {error}
            </p>
          )}
          <form onSubmit={handleRegister}>
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={inputStyle}
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={inputStyle}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={inputStyle}
              required
            />
            <button type="submit" style={btnStyle} disabled={loading}>
              {loading ? "Creating..." : "Register"}
            </button>
          </form>
          <p
            style={{
              marginTop: "1.5rem",
              textAlign: "center",
              fontSize: "0.875rem",
              color: "#6d7175",
            }}
          >
            Already have an account?{" "}
            <span
              style={{ color: "#2c6ecb", cursor: "pointer", fontWeight: "600" }}
              onClick={() => navigate("/admin/login")}
            >
              Login
            </span>
          </p>
        </div>
      </div>
    );
  }

  // Render Login
  if (currentPath === "/admin/login") {
    return (
      <div style={fullScreenFlex}>
        <div style={glassStyle}>
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <h2
              style={{
                fontSize: "1.75rem",
                fontWeight: "700",
                color: "#202223",
              }}
            >
              Admin Login
            </h2>
            <p
              style={{
                color: "#6d7175",
                fontSize: "0.875rem",
                marginTop: "0.5rem",
              }}
            >
              Welcome back! Please enter your details.
            </p>
          </div>
          {error && (
            <p
              style={{
                color: "#e51c24",
                marginBottom: "1rem",
                fontSize: "0.875rem",
              }}
            >
              {error}
            </p>
          )}
          <form onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={inputStyle}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={inputStyle}
              required
            />
            <button type="submit" style={btnStyle} disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
          <p
            style={{
              marginTop: "1.5rem",
              textAlign: "center",
              fontSize: "0.875rem",
              color: "#6d7175",
            }}
          >
            Don't have an account?{" "}
            <span
              style={{ color: "#2c6ecb", cursor: "pointer", fontWeight: "600" }}
              onClick={() => navigate("/admin/register")}
            >
              Register
            </span>
          </p>
        </div>
      </div>
    );
  }

  // Render Dashboard
  if (currentPath === "/admin/dashboard") {
    if (!user) {
      return (
        <div style={fullScreenFlex}>
          <p>Checking authentication...</p>
        </div>
      );
    }

    return (
      <div style={dashboardLayout}>
        {/* Sidebar Overlay */}
        {isMobile && sidebarOpen && (
          <div 
            style={{
              position: 'fixed',
              top: 0, left: 0, width: '100vw', height: '100vh',
              backgroundColor: 'rgba(0,0,0,0.3)',
              zIndex: 999
            }}
            onClick={() => setSidebarOpen(false)}
          />
        )}
        {/* Sidebar */}
        <div style={sidebarStyle}>
          <div
            style={{
              padding: "0 1rem 2rem 1rem",
              fontWeight: "700",
              fontSize: "1.25rem",
              color: "#202223",
            }}
          >
            Visionary Elite
          </div>
          <div
            style={{
              ...sidebarLink,
              backgroundColor: activeSection === 'home' ? "#fff" : "transparent",
              color: activeSection === 'home' ? "#2c6ecb" : "#202223",
            }}
            onClick={() => { setActiveSection('home'); if (isMobile) setSidebarOpen(false); }}
          >
            <span>🏠</span> Home
          </div>
          <div
            style={{
              ...sidebarLink,
              backgroundColor: activeSection === 'collections' ? "#fff" : "transparent",
              color: activeSection === 'collections' ? "#2c6ecb" : "#202223",
            }}
            onClick={() => { setActiveSection('collections'); if (isMobile) setSidebarOpen(false); }}
          >
            <span>🛍️</span> Collections
          </div>
          <div
            style={{
              ...sidebarLink,
              backgroundColor: activeSection === 'virtual-try-on' ? "#fff" : "transparent",
              color: activeSection === 'virtual-try-on' ? "#2c6ecb" : "#202223",
            }}
            onClick={() => { setActiveSection('virtual-try-on'); if (isMobile) setSidebarOpen(false); }}
          >
            <span>🕶️</span> Virtual Try-On
          </div>
          <div
            style={{
              ...sidebarLink,
              backgroundColor: activeSection === 'services' ? "#fff" : "transparent",
              color: activeSection === 'services' ? "#2c6ecb" : "#202223",
            }}
            onClick={() => { setActiveSection('services'); if (isMobile) setSidebarOpen(false); }}
          >
            <span>🛠️</span> Services
          </div>
          <div
            style={{
              ...sidebarLink,
              backgroundColor: activeSection === 'about' ? "#fff" : "transparent",
              color: activeSection === 'about' ? "#2c6ecb" : "#202223",
            }}
            onClick={() => { setActiveSection('about'); if (isMobile) setSidebarOpen(false); }}
          >
            <span>ℹ️</span> About
          </div>
          <div
            style={{ ...sidebarLink, marginTop: "auto", color: "#e51c24" }}
            onClick={handleLogout}
          >
            <span>🚪</span> Logout
          </div>
        </div>

        {/* Main Content */}
        <div style={mainContentStyle}>
          {/* Header */}
          <div style={headerStyle}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {isMobile && (
                <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ padding: '0.5rem', color: '#202223', display: 'flex', alignItems: 'center' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
                </button>
              )}
              <div
                style={{ fontWeight: "600", fontSize: "1rem", color: "#202223" }}
              >
                Dashboard
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <span style={{ 
                fontSize: "0.875rem", 
                color: "#6d7175",
                maxWidth: isMobile ? '120px' : 'none',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}>
                {user.email}
              </span>
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  backgroundColor: "#2c6ecb",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.875rem",
                  fontWeight: "bold",
                }}
              >
                {user.displayName
                  ? user.displayName.charAt(0).toUpperCase()
                  : "A"}
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div style={contentArea}>
            <div style={{ marginBottom: "2rem" }}>
              <h1
                style={{
                  fontSize: "2rem",
                  fontWeight: "700",
                  color: "#202223",
                }}
              >
                Hi, {user.displayName || "Welcome"} !
              </h1>
              <p style={{ color: "#6d7175", marginTop: "0.5rem" }}>
                You're off to a great start.
              </p>
            </div>

            {/* Banner / Form */}
            <div style={cardStyle}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "600", marginBottom: "1.5rem", color: "#202223" }}>
                {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)} Section Content
              </h3>
              {error && <p style={{ color: "#e51c24", marginBottom: "1rem" }}>{error}</p>}

              <form onSubmit={handleUpdate}>
                {activeSection === 'home' && (
                  <>
                    <div style={{ marginBottom: "1.5rem" }}>
                      <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", marginBottom: "0.5rem", color: "#202223" }}>Hero Title</label>
                      <input type="text" name="heroTitle" value={formData.heroTitle} onChange={handleInputChange} style={inputStyle} />
                    </div>
                    <div style={{ marginBottom: "1.5rem" }}>
                      <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", marginBottom: "0.5rem", color: "#202223" }}>Hero Subtitle</label>
                      <input type="text" name="heroSubtitle" value={formData.heroSubtitle} onChange={handleInputChange} style={inputStyle} />
                    </div>
                    <div style={{ marginBottom: "1.5rem" }}>
                      <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", marginBottom: "0.5rem", color: "#202223" }}>Hero Description</label>
                      <textarea name="heroDescription" value={formData.heroDescription} onChange={handleInputChange} style={{ ...inputStyle, height: "100px" }} />
                    </div>
                  </>
                )}

                {activeSection === 'collections' && (
                  <>
                    <div style={{ marginBottom: "1.5rem" }}>
                      <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", marginBottom: "0.5rem", color: "#202223" }}>Collections Title</label>
                      <input type="text" name="collectionsTitle" value={formData.collectionsTitle} onChange={handleInputChange} style={inputStyle} />
                    </div>

                    <h4 style={{ marginBottom: '1rem', color: '#202223', fontWeight: '600' }}>Manage Collections</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                      {formData.collections && formData.collections.map((item) => (
                        <div key={item.id} style={{ 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'center', 
                          padding: '1rem', 
                          backgroundColor: '#f6f6f7', 
                          borderRadius: '0.5rem', 
                          border: '1px solid #e1e3e5',
                          flexWrap: isMobile ? 'wrap' : 'nowrap',
                          gap: isMobile ? '1rem' : '0.5rem'
                        }}>
                          <div>
                            <div style={{ fontWeight: '600', color: '#202223' }}>{item.name}</div>
                            <div style={{ fontSize: '0.875rem', color: '#6d7175' }}>{item.description}</div>
                          </div>
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button 
                              type="button" 
                              onClick={() => {
                                setEditingId(item.id);
                                setNewCol({ name: item.name, desc: item.description, img: item.image || "" });
                              }} 
                              style={{ ...btnStyle, width: 'auto', padding: '0.5rem 1rem', backgroundColor: '#2c6ecb' }}
                            >
                              Edit
                            </button>
                            <button 
                              type="button" 
                              onClick={async () => {
                                await deleteCollection(item.id);
                                const updated = formData.collections.filter(c => c.id !== item.id);
                                setFormData({...formData, collections: updated});
                                showToast("Collection deleted from database!");
                              }} 
                              style={{ ...btnStyle, width: 'auto', padding: '0.5rem 1rem', backgroundColor: '#e51c24' }}
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <h4 style={{ marginBottom: '1rem', color: '#202223', fontWeight: '600' }}>{editingId ? "Edit Collection" : "Add New Collection"}</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      <input type="text" placeholder="Collection Name (e.g. MELLER)" value={newCol.name} onChange={(e) => setNewCol({...newCol, name: e.target.value})} style={inputStyle} />
                      <input type="text" placeholder="Description (e.g. Made in Spain)" value={newCol.desc} onChange={(e) => setNewCol({...newCol, desc: e.target.value})} style={inputStyle} />
                      <input type="text" placeholder="Image URL (optional)" value={newCol.img} onChange={(e) => setNewCol({...newCol, img: e.target.value})} style={inputStyle} />
                      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#202223' }}>Or Upload Image:</label>
                        <input type="file" onChange={handleFileUpload} style={{ fontSize: '0.875rem' }} />
                      </div>
                      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                        <button 
                          type="button" 
                          onClick={async () => {
                            if (newCol.name && newCol.desc) {
                              if (editingId) {
                                // Update existing
                                await updateCollection(editingId, { name: newCol.name, description: newCol.desc, image: newCol.img });
                                const updated = formData.collections.map(c => 
                                  c.id === editingId ? { ...c, name: newCol.name, description: newCol.desc, image: newCol.img } : c
                                );
                                setFormData({...formData, collections: updated});
                                setEditingId(null);
                                showToast("Collection updated in database!");
                              } else {
                                // Add new
                                const newItem = {
                                  id: Date.now(),
                                  name: newCol.name,
                                  description: newCol.desc,
                                  image: newCol.img
                                };
                                await addCollection(newItem);
                                setFormData({...formData, collections: [...(formData.collections || []), newItem]});
                                showToast("Collection added to database!");
                              }
                              setNewCol({ name: "", desc: "", img: "" });
                            } else {
                              showToast("Please fill in Name and Description!", "error");
                            }
                          }} 
                          style={{ ...btnStyle, width: 'auto', padding: '0.75rem 1.5rem' }}
                        >
                          {editingId ? "Update Collection" : "Add Collection"}
                        </button>
                        {editingId && (
                          <button 
                            type="button" 
                            onClick={() => {
                              setEditingId(null);
                              setNewCol({ name: "", desc: "", img: "" });
                            }} 
                            style={{ ...btnStyle, width: 'auto', padding: '0.75rem 1.5rem', backgroundColor: '#6d7175' }}
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  </>
                )}

                {activeSection === 'virtual-try-on' && (
                  <>
                    <div style={{ marginBottom: "1.5rem" }}>
                      <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", marginBottom: "0.5rem", color: "#202223" }}>Virtual Try-On Title</label>
                      <input type="text" name="virtualTryOnTitle" value={formData.virtualTryOnTitle} onChange={handleInputChange} style={inputStyle} />
                    </div>
                    <div style={{ marginBottom: "1.5rem" }}>
                      <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", marginBottom: "0.5rem", color: "#202223" }}>Description</label>
                      <textarea name="virtualTryOnDescription" value={formData.virtualTryOnDescription} onChange={handleInputChange} style={{ ...inputStyle, height: "80px" }} />
                    </div>
                    
                    <h4 style={{ marginBottom: '1rem', color: '#202223', fontWeight: '600' }}>Feature 1</h4>
                    <div style={{ marginBottom: "1.5rem" }}>
                      <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", marginBottom: "0.5rem", color: "#202223" }}>Feature 1 Title</label>
                      <input type="text" name="vtoFeature1Title" value={formData.vtoFeature1Title} onChange={handleInputChange} style={inputStyle} />
                    </div>
                    <div style={{ marginBottom: "1.5rem" }}>
                      <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", marginBottom: "0.5rem", color: "#202223" }}>Feature 1 Description</label>
                      <input type="text" name="vtoFeature1Desc" value={formData.vtoFeature1Desc} onChange={handleInputChange} style={inputStyle} />
                    </div>

                    <h4 style={{ marginBottom: '1rem', color: '#202223', fontWeight: '600' }}>Feature 2</h4>
                    <div style={{ marginBottom: "1.5rem" }}>
                      <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", marginBottom: "0.5rem", color: "#202223" }}>Feature 2 Title</label>
                      <input type="text" name="vtoFeature2Title" value={formData.vtoFeature2Title} onChange={handleInputChange} style={inputStyle} />
                    </div>
                    <div style={{ marginBottom: "1.5rem" }}>
                      <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", marginBottom: "0.5rem", color: "#202223" }}>Feature 2 Description</label>
                      <input type="text" name="vtoFeature2Desc" value={formData.vtoFeature2Desc} onChange={handleInputChange} style={inputStyle} />
                    </div>
                  </>
                )}

                {activeSection === 'services' && (
                  <>
                    <div style={{ marginBottom: "1.5rem" }}>
                      <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", marginBottom: "0.5rem", color: "#202223" }}>Services Title</label>
                      <input type="text" name="servicesTitle" value={formData.servicesTitle} onChange={handleInputChange} style={inputStyle} />
                    </div>

                    <h4 style={{ marginBottom: '1rem', color: '#202223', fontWeight: '600' }}>Manage Services</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                      {formData.services && formData.services.map((item) => (
                        <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', backgroundColor: '#f6f6f7', borderRadius: '0.5rem', border: '1px solid #e1e3e5' }}>
                          <div>
                            <div style={{ fontWeight: '600', color: '#202223' }}>{item.title}</div>
                            <div style={{ fontSize: '0.875rem', color: '#6d7175' }}>{item.description}</div>
                          </div>
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button 
                              type="button" 
                              onClick={() => {
                                setEditingServiceId(item.id);
                                setNewService({ title: item.title, desc: item.description });
                              }} 
                              style={{ ...btnStyle, width: 'auto', padding: '0.5rem 1rem', backgroundColor: '#2c6ecb' }}
                            >
                              Edit
                            </button>
                            <button 
                              type="button" 
                              onClick={async () => {
                                await deleteService(item.id);
                                const updated = formData.services.filter(s => s.id !== item.id);
                                setFormData({...formData, services: updated});
                                showToast("Service deleted from database!");
                              }} 
                              style={{ ...btnStyle, width: 'auto', padding: '0.5rem 1rem', backgroundColor: '#e51c24' }}
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <h4 style={{ marginBottom: '1rem', color: '#202223', fontWeight: '600' }}>{editingServiceId ? "Edit Service" : "Add New Service"}</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      <input type="text" placeholder="Service Title (e.g. Advanced Eye Test)" value={newService.title} onChange={(e) => setNewService({...newService, title: e.target.value})} style={inputStyle} />
                      <textarea placeholder="Description" value={newService.desc} onChange={(e) => setNewService({...newService, desc: e.target.value})} style={{ ...inputStyle, height: '80px' }} />
                      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                        <button 
                          type="button" 
                          onClick={async () => {
                            if (newService.title && newService.desc) {
                              if (editingServiceId) {
                                // Update existing
                                await updateService(editingServiceId, { title: newService.title, description: newService.desc });
                                const updated = formData.services.map(s => 
                                  s.id === editingServiceId ? { ...s, title: newService.title, description: newService.desc } : s
                                );
                                setFormData({...formData, services: updated});
                                setEditingServiceId(null);
                                showToast("Service updated in database!");
                              } else {
                                // Add new
                                const newItem = {
                                  id: Date.now(),
                                  title: newService.title,
                                  description: newService.desc
                                };
                                await addService(newItem);
                                setFormData({...formData, services: [...(formData.services || []), newItem]});
                                showToast("Service added to database!");
                              }
                                setNewService({ title: "", desc: "" });
                              } else {
                                showToast("Please fill in Title and Description!", "error");
                              }
                          }} 
                          style={{ ...btnStyle, width: 'auto', padding: '0.75rem 1.5rem' }}
                        >
                          {editingServiceId ? "Update Service" : "Add Service"}
                        </button>
                        {editingServiceId && (
                          <button 
                            type="button" 
                            onClick={() => {
                              setEditingServiceId(null);
                              setNewService({ title: "", desc: "" });
                            }} 
                            style={{ ...btnStyle, width: 'auto', padding: '0.75rem 1.5rem', backgroundColor: '#6d7175' }}
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  </>
                )}

                {activeSection === 'about' && (
                  <>
                    <div style={{ marginBottom: "1.5rem" }}>
                      <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", marginBottom: "0.5rem", color: "#202223" }}>About Title</label>
                      <input type="text" name="aboutTitle" value={formData.aboutTitle} onChange={handleInputChange} style={inputStyle} />
                    </div>
                    <div style={{ marginBottom: "1.5rem" }}>
                      <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", marginBottom: "0.5rem", color: "#202223" }}>Description Paragraph 1</label>
                      <textarea name="aboutDescription1" value={formData.aboutDescription1} onChange={handleInputChange} style={{ ...inputStyle, height: "100px" }} />
                    </div>
                    <div style={{ marginBottom: "1.5rem" }}>
                      <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", marginBottom: "0.5rem", color: "#202223" }}>Description Paragraph 2</label>
                      <textarea name="aboutDescription2" value={formData.aboutDescription2} onChange={handleInputChange} style={{ ...inputStyle, height: "100px" }} />
                    </div>

                    <h4 style={{ marginBottom: '1rem', color: '#202223', fontWeight: '600' }}>Statistics</h4>
                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                      <div style={{ flex: 1 }}>
                        <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", marginBottom: "0.5rem", color: "#202223" }}>Stat 1 Value</label>
                        <input type="text" name="stat1Value" value={formData.stat1Value} onChange={handleInputChange} style={inputStyle} />
                      </div>
                      <div style={{ flex: 2 }}>
                        <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", marginBottom: "0.5rem", color: "#202223" }}>Stat 1 Label</label>
                        <input type="text" name="stat1Label" value={formData.stat1Label} onChange={handleInputChange} style={inputStyle} />
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                      <div style={{ flex: 1 }}>
                        <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", marginBottom: "0.5rem", color: "#202223" }}>Stat 2 Value</label>
                        <input type="text" name="stat2Value" value={formData.stat2Value} onChange={handleInputChange} style={inputStyle} />
                      </div>
                      <div style={{ flex: 2 }}>
                        <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", marginBottom: "0.5rem", color: "#202223" }}>Stat 2 Label</label>
                        <input type="text" name="stat2Label" value={formData.stat2Label} onChange={handleInputChange} style={inputStyle} />
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                      <div style={{ flex: 1 }}>
                        <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", marginBottom: "0.5rem", color: "#202223" }}>Stat 3 Value</label>
                        <input type="text" name="stat3Value" value={formData.stat3Value} onChange={handleInputChange} style={inputStyle} />
                      </div>
                      <div style={{ flex: 2 }}>
                        <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", marginBottom: "0.5rem", color: "#202223" }}>Stat 3 Label</label>
                        <input type="text" name="stat3Label" value={formData.stat3Label} onChange={handleInputChange} style={inputStyle} />
                      </div>
                    </div>

                    <h4 style={{ marginBottom: '1rem', color: '#202223', fontWeight: '600' }}>Quote</h4>
                    <div style={{ marginBottom: "1.5rem" }}>
                      <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", marginBottom: "0.5rem", color: "#202223" }}>Quote Text</label>
                      <input type="text" name="quoteText" value={formData.quoteText} onChange={handleInputChange} style={inputStyle} />
                    </div>
                    <div style={{ marginBottom: "1.5rem" }}>
                      <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", marginBottom: "0.5rem", color: "#202223" }}>Quote Author</label>
                      <input type="text" name="quoteAuthor" value={formData.quoteAuthor} onChange={handleInputChange} style={inputStyle} />
                    </div>
                  </>
                )}

                <button type="submit" style={{ ...btnStyle, width: "auto", padding: "0.75rem 2rem" }} disabled={loading}>
                  {loading ? "Updating..." : "Save Changes"}
                </button>
              </form>
            </div>
          </div>
        </div>
        {toast.show && (
          <div style={{
            position: 'fixed',
            top: '1rem',
            right: '1rem',
            padding: '1rem 1.5rem',
            backgroundColor: toast.type === 'success' ? '#202223' : '#e51c24',
            color: '#fff',
            borderRadius: '0.5rem',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            zIndex: 1000,
            animation: 'fadeIn 0.3s ease'
          }}>
            {toast.message}
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={fullScreenFlex}>
      <p>404 Page Not Found in Admin</p>
      <button onClick={() => navigate("/")} style={{ marginLeft: "1rem" }}>
        Go to Store
      </button>
    </div>
  );
};

export default Admin;
