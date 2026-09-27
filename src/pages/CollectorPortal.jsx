import React, { useContext, useState, useEffect } from "react";
import { StateContext } from "../context/StateContext";
import LicenseViewer from "../components/LicenseViewer";
import { MapContainer, TileLayer, Marker, Circle } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { 
  Search, 
  SlidersHorizontal, 
  Map as MapIcon, 
  List, 
  Navigation,
  CheckCircle,
  Clock,
  Phone,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Award,
  HelpCircle,
  Languages,
  LogOut,
  History,
  ShoppingBag,
  RefreshCw,
  Check,
  Trash2,
  Camera,
  MapPin,
  Scale,
  Package,
  Building2,
  Tractor,
  Sprout,
  ShieldCheck,
  Sparkles,
  Info,
  ChevronRight,
  ExternalLink
} from "lucide-react";

const createMarkerIcon = (weight, status) => {
  let bgColor = "var(--color-primary)";
  if (status === "Reserved") bgColor = "var(--color-accent)";
  if (status === "In Transit") bgColor = "#1976D2";

  return L.divIcon({
    className: "custom-pin",
    html: `
      <div style="
        background-color: ${bgColor}; 
        color: white; 
        width: 32px; 
        height: 32px; 
        border-radius: 8px; 
        display: flex; 
        align-items: center; 
        justify-content: center; 
        font-weight: 700; 
        font-size: 11px; 
        border: 2px solid white; 
        box-shadow: 0 3px 8px rgba(0,0,0,0.22);
      ">
        ${Math.round(weight)}k
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16]
  });
};

export default function CollectorPortal({ activeTab, setActiveTab }) {
  const {
    schools,
    wastePosts,
    producePosts,
    history,
    notifications,
    markAsRead,
    markAllAsRead,
    selectedCollectorId,
    collectors,
    setIsLoggedIn,
    reserveWaste,
    startTransit,
    completePickup,
    cancelReservation,
    forceSimulateTimeout,
    getFilteredWastePosts,
    updateCollectorOnboarding,
    isDarkMode,
    setIsDarkMode,
    addToast,
    language,
    setLanguage,
    t,
    syncPasscode,
    setSyncPasscode,
    uploadStateToCloud,
    downloadStateFromCloud,
    uploadProducePost,
    cancelProducePost
  } = useContext(StateContext);

  const collector = (collectors && collectors.find(c => c.id === selectedCollectorId)) || collectors?.[0] || {
    id: "col-1",
    name: "Kavin Kumar (Organic Livestock & Pig Farm)",
    collectorType: "Farmer",
    vehicle: "Mahindra Bolero Pickup (1.2 Ton)",
    radius: 15,
    latitude: 11.0015,
    longitude: 76.9650,
    phone: "+91 98421 99001"
  };

  // Search & filter states
  const [searchName, setSearchName] = useState("");
  const [minWeight, setMinWeight] = useState("");
  const [maxDistance, setMaxDistance] = useState("");
  const [viewMode, setViewMode] = useState("list"); // "list" | "map"
  const [showFilters, setShowFilters] = useState(false);
  const [selectedPostForBottomSheet, setSelectedPostForBottomSheet] = useState(null);
  
  // Confirmation state for reservation
  const [showReserveConfirmationPost, setShowReserveConfirmationPost] = useState(null);

  // Simulated Loading state for Skeletons
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Sub pages for settings
  const [activeSettingsSubPage, setActiveSettingsSubPage] = useState("menu"); // "menu" | "settings" | "help"

  // Active reservation timer states
  const [timerSeconds, setTimerSeconds] = useState({});

  // Help ticket
  const [ticketMsg, setTicketMsg] = useState("");

  // Produce Listings states
  const [showProduceModal, setShowProduceModal] = useState(false);
  const [produceForm, setProduceForm] = useState({
    title: "Tomatoes (Fresh Harvest)",
    quantity: "25",
    price: "0",
    deliveryEstimate: "Tomorrow Morning",
    description: "",
    imageUrl: ""
  });

  // Profile data state
  const [profileData, setProfileData] = useState({
    collectorType: collector.collectorType || "Farmer",
    radius: collector.radius || 15,
    vehicle: collector.vehicle || "Mahindra Bolero Pickup (1.2 Ton)"
  });

  // Keep timers running for active reservations (30 min timeout rule)
  useEffect(() => {
    const active = wastePosts.filter(p => p.collectorId === collector.id && (p.status === "Reserved" || p.status === "In Transit"));
    if (active.length === 0) return;

    const interval = setInterval(() => {
      const newTimers = {};
      active.forEach(post => {
        const created = new Date(post.reservedAt || post.createdAt).getTime();
        const now = Date.now();
        const elapsed = Math.floor((now - created) / 1000);
        const remaining = Math.max(0, 1800 - elapsed); // 30 mins
        newTimers[post.id] = remaining;

        if (remaining <= 0 && post.status === "Reserved") {
          forceSimulateTimeout(post.id);
        }
      });
      setTimerSeconds(newTimers);
    }, 1000);

    return () => clearInterval(interval);
  }, [wastePosts, collector.id, forceSimulateTimeout]);

  const formatTimer = (secs) => {
    if (secs === undefined) return "30:00";
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const getDistanceToPost = (post) => {
    const school = schools.find(s => s.id === post.schoolId);
    if (!school) return 0;
    const dist = Math.sqrt((school.latitude - collector.latitude) ** 2 + (school.longitude - collector.longitude) ** 2) * 111.32;
    return dist.toFixed(1);
  };

  const handleProfileSave = (e) => {
    e.preventDefault();
    updateCollectorOnboarding(
      collector.id,
      profileData.collectorType,
      profileData.radius,
      profileData.vehicle
    );
    addToast("Collector profile updated successfully!", "success");
  };

  const handleTicketSubmit = (e) => {
    e.preventDefault();
    if (!ticketMsg.trim()) return;
    addToast("Support ticket filed successfully! Dispatch team notified.", "success");
    setTicketMsg("");
  };

  // Pull to refresh simulation
  const handlePullToRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      addToast("Nearby listings refreshed!", "success");
    }, 800);
  };

  // Filters logic
  const filteredPosts = getFilteredWastePosts({ searchName, minWeight, maxDistance }, collector.id);

  // Active pick-ups for current collector
  const activePickups = wastePosts.filter(p => p.collectorId === collector.id && (p.status === "Reserved" || p.status === "In Transit" || p.status === "Awaiting School Confirmation"));

  // Historical calculations
  const collectorHistory = history.filter(h => h.collectorId === collector.id);
  const totalWeightCollected = collectorHistory.reduce((sum, h) => sum + h.estimatedWeight, 0);
  const uniqueBusinessesVisited = new Set(collectorHistory.map(h => h.schoolId)).size;

  const collectorNotifications = notifications.filter(n => n.role === "collector" && n.targetId === collector.id);
  const myProducePosts = (producePosts || []).filter(p => p.collectorId === collector.id);

  return (
    <div style={styles.container} className="page-enter">
      {/* 1. DEDICATED HOME TAB (HERO PICKUPS & STREAMLINED LOGISTICS) */}
      {activeTab === "home" && (
        <div style={styles.scrollable}>
          
          {/* Deliberate Farmer & Logistics Profile Card */}
          <div className="card" style={styles.logisticsHeaderCard}>
            <div style={styles.logisticsHeaderTop}>
              <div style={styles.logisticsProfileInfo}>
                <div style={styles.farmerBadgeIcon}>
                  <Tractor size={18} color="var(--color-primary)" />
                </div>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <h2 style={styles.farmerNameTitle}>{collector.name.split("(")[0].trim()}</h2>
                    <span style={styles.verifiedPill}>Verified Buyer</span>
                  </div>
                  <p style={styles.logisticsSubRole}>
                    {collector.collectorType || "Farmer"} • Livestock & Compost Dispatch
                  </p>
                </div>
              </div>
              <div style={styles.statusIndicatorGroup}>
                <span style={styles.livePulseDot} />
                <span style={styles.statusLiveText}>Radar Active ({collector.radius || 15} km)</span>
              </div>
            </div>

            <div style={styles.logisticsMetaBar}>
              <div style={styles.metaChipItem}>
                <MapPin size={12} color="var(--color-text-secondary)" />
                <span>Coimbatore Hub</span>
              </div>
              <div style={styles.metaDivider} />
              <div style={styles.metaChipItem}>
                <Tractor size={12} color="var(--color-text-secondary)" />
                <span>{collector.vehicle || "Mahindra Bolero (1.2T)"}</span>
              </div>
            </div>
          </div>

          {/* Compact, Informative KPI Row (25-30% shorter, rich metadata) */}
          <div style={styles.kpiGrid}>
            <div className="card" style={styles.kpiCard}>
              <div style={styles.kpiTopRow}>
                <span style={styles.kpiLabel}>FOOD DIVERTED</span>
                <div style={styles.kpiIconBadge}>
                  <TrendingUp size={13} color="var(--color-primary)" />
                </div>
              </div>
              <div style={styles.kpiValueRow}>
                <h4 style={styles.kpiValueNumber} className="tabular-nums">
                  {totalWeightCollected.toLocaleString()} <span style={styles.kpiUnit}>kg</span>
                </h4>
              </div>
              <span style={styles.kpiTrendPositive}>+24.5 kg this week</span>
            </div>

            <div className="card" style={styles.kpiCard}>
              <div style={styles.kpiTopRow}>
                <span style={styles.kpiLabel}>BUSINESSES VISITED</span>
                <div style={styles.kpiIconBadge}>
                  <Building2 size={13} color="var(--color-primary)" />
                </div>
              </div>
              <div style={styles.kpiValueRow}>
                <h4 style={styles.kpiValueNumber} className="tabular-nums">
                  {uniqueBusinessesVisited} <span style={styles.kpiUnit}>sellers</span>
                </h4>
              </div>
              <span style={styles.kpiSubLabel}>Across Coimbatore</span>
            </div>

            <div 
              className="card card-interactive" 
              style={{ ...styles.kpiCard, borderLeft: activePickups.length > 0 ? "3px solid var(--color-primary)" : "1px solid var(--color-border-subtle)" }}
              onClick={() => setActiveTab("active")}
            >
              <div style={styles.kpiTopRow}>
                <span style={styles.kpiLabel}>ACTIVE ROUTE</span>
                <div style={styles.kpiIconBadge}>
                  <Navigation size={13} color={activePickups.length > 0 ? "var(--color-primary)" : "var(--color-text-muted)"} />
                </div>
              </div>
              <div style={styles.kpiValueRow}>
                <h4 style={{ ...styles.kpiValueNumber, color: activePickups.length > 0 ? "var(--color-primary)" : "var(--color-text-secondary)" }} className="tabular-nums">
                  {activePickups.length} <span style={styles.kpiUnit}>in transit</span>
                </h4>
              </div>
              <span style={styles.kpiActionLink}>
                {activePickups.length > 0 ? "View live radar →" : "No active route"}
              </span>
            </div>
          </div>

          {/* HERO SECTION: Available Nearby Pickups (Visually Primary) */}
          <div style={styles.heroSectionContainer}>
            <div style={styles.heroHeaderRow}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <h3 style={styles.heroSectionTitle}>Available Nearby Pickups</h3>
                <span style={styles.heroCountBadge}>{filteredPosts.length} ready</span>
              </div>
              <button 
                onClick={handlePullToRefresh} 
                style={styles.refreshActionBtn} 
                disabled={isRefreshing}
                title="Refresh listings"
              >
                <RefreshCw size={13} style={{ transform: isRefreshing ? "rotate(360deg)" : "none", transition: "transform 600ms linear" }} />
                <span>Refresh</span>
              </button>
            </div>

            {/* List of High-Hierarchy Pickup Cards */}
            <div style={styles.pickupCardsList}>
              {filteredPosts.map(post => {
                const distanceKm = getDistanceToPost(post);
                const sellerObj = schools.find(s => s.id === post.schoolId);
                const categoryLabel = sellerObj?.categoryLabel || "Commercial Seller";

                return (
                  <div key={post.id} className="card card-interactive" style={styles.pickupCard}>
                    {/* Top Row: Business Name + Category + Availability Badge */}
                    <div style={styles.pickupCardTop}>
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "2px" }}>
                          <h4 style={styles.pickupBusinessName}>{post.schoolName}</h4>
                        </div>
                        <span style={styles.pickupCategoryTag}>{categoryLabel}</span>
                      </div>
                      <span className="badge badge-available">
                        <Check size={11} style={{ marginRight: "3px" }} /> Available
                      </span>
                    </div>

                    {/* Information Hierarchy Row: Distance, Weight, Timestamp */}
                    <div style={styles.pickupMetaRow}>
                      <div style={styles.pickupMetaItem}>
                        <MapPin size={13} color="var(--color-text-secondary)" />
                        <span><strong>{distanceKm} km</strong> away</span>
                      </div>
                      <div style={styles.pickupMetaItem}>
                        <Scale size={13} color="var(--color-primary)" />
                        <span style={{ color: "var(--color-primary)", fontWeight: 700 }}>{post.estimatedWeight} kg payload</span>
                      </div>
                      <div style={styles.pickupMetaItem}>
                        <Clock size={13} color="var(--color-text-muted)" />
                        <span style={{ color: "var(--color-text-muted)" }}>Ready now</span>
                      </div>
                    </div>

                    {/* Surplus Content / Reason Tag */}
                    <div style={styles.pickupReasonStrip}>
                      <Package size={13} color="var(--color-text-secondary)" style={{ flexShrink: 0, marginTop: "1px" }} />
                      <span style={styles.pickupReasonText}>
                        <strong>Surplus Stream:</strong> {post.reason}
                      </span>
                    </div>

                    {/* Primary Action Button */}
                    <div style={styles.pickupActionRow}>
                      <button 
                        onClick={() => setShowReserveConfirmationPost(post)}
                        className="btn-primary" 
                        style={styles.reserveBtn}
                      >
                        <span>Reserve Pickup ({post.estimatedWeight} kg)</span>
                        <ArrowRight size={14} style={{ marginLeft: "6px" }} />
                      </button>
                    </div>
                  </div>
                );
              })}

              {filteredPosts.length === 0 && (
                <div className="card" style={styles.emptyPickupStateCard}>
                  <div style={styles.emptyIconCircle}>
                    <Sprout size={22} color="var(--color-primary)" />
                  </div>
                  <h4 style={styles.emptyTitle}>All Nearby Surplus Picked Up</h4>
                  <p style={styles.emptySub}>
                    Nearby restaurants, floral mandis, and markets in your 15km operating zone have no unreserved listings.
                  </p>
                  <button onClick={handlePullToRefresh} className="btn-secondary" style={{ width: "auto", minHeight: "36px", marginTop: "10px" }}>
                    <RefreshCw size={13} style={{ marginRight: "6px" }} /> Check for New Dispatches
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Compact, Purposeful Farmer Excess Produce Section */}
          <div style={styles.produceSectionContainer}>
            <div style={styles.produceHeaderRow}>
              <div>
                <h3 style={styles.produceSectionTitle}>My Excess Produce & Farm Feed</h3>
                <p style={styles.produceSectionSub}>List harvested surplus for rapid routing to community kitchens</p>
              </div>
              <button 
                onClick={() => setShowProduceModal(true)} 
                className="btn-primary" 
                style={styles.listProduceTriggerBtn}
              >
                <span>+ List Produce</span>
              </button>
            </div>

            {/* Produce Listings or Compact Purposeful Empty State */}
            {myProducePosts.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {myProducePosts.map(p => (
                  <div key={p.id} className="card" style={styles.produceListingCard}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                        <div style={styles.produceThumbBox}>
                          <Package size={18} color="var(--color-primary)" />
                        </div>
                        <div>
                          <h4 style={styles.produceItemTitle}>{p.title} • {p.quantity} kg</h4>
                          <span style={styles.produceItemPrice}>
                            {parseFloat(p.price) > 0 ? `₹${p.price}/kg` : "Free Feed"} • {p.deliveryEstimate}
                          </span>
                        </div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <span className={`badge ${p.status === "Claimed" ? "badge-collected" : "badge-reserved"}`}>
                          {p.status || "Available"}
                        </span>
                        <button 
                          onClick={() => cancelProducePost(p.id)}
                          style={styles.cancelProduceBtn}
                          title="Remove listing"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="card" style={styles.compactEmptyProduceCard}>
                <div style={styles.compactEmptyLeft}>
                  <div style={styles.sproutBadgeIcon}>
                    <Sprout size={18} color="var(--color-primary)" />
                  </div>
                  <div>
                    <h4 style={styles.compactEmptyTitle}>No active farm produce listed</h4>
                    <p style={styles.compactEmptyDesc}>
                      List surplus harvest or crop feed for zero-commission dispatch to verified community buyers.
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowProduceModal(true)}
                  className="btn-secondary" 
                  style={styles.compactEmptyActionBtn}
                >
                  + List Crop
                </button>
              </div>
            )}
          </div>

        </div>
      )}

      {/* 2. MAP / DISCOVERY RADAR TAB */}
      {activeTab === "nearby" && (
        <div style={styles.mapTabLayout}>
          {/* Integrated Logistics Search & Filter Bar */}
          <div className="card" style={styles.mapControlCard}>
            <div style={styles.mapSearchRow}>
              <div style={styles.searchInputGroup}>
                <Search size={15} color="var(--color-text-secondary)" style={{ marginLeft: "10px" }} />
                <input 
                  type="text" 
                  placeholder="Search sellers & commercial hubs..." 
                  className="form-input" 
                  style={styles.mapSearchInputField}
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                />
              </div>

              <button 
                onClick={() => setShowFilters(!showFilters)} 
                style={{
                  ...styles.mapFilterToggleBtn,
                  borderColor: showFilters ? "var(--color-primary)" : "var(--color-border)",
                  backgroundColor: showFilters ? "var(--color-primary-light)" : "#FFFFFF",
                  color: showFilters ? "var(--color-primary)" : "var(--color-text-primary)"
                }}
                title="Filter radius & weight"
              >
                <SlidersHorizontal size={14} />
              </button>

              <button 
                onClick={() => setViewMode(viewMode === "list" ? "map" : "list")} 
                style={styles.mapViewModeBtn}
                title="Toggle list/map view"
              >
                {viewMode === "list" ? <MapIcon size={14} /> : <List size={14} />}
              </button>
            </div>

            {showFilters && (
              <div style={styles.filterDrawerContent}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                  <div>
                    <label style={styles.filterLabelSmall}>Min Payload (kg)</label>
                    <input 
                      type="number" 
                      placeholder="e.g. 20" 
                      className="form-input" 
                      style={{ minHeight: "34px", fontSize: "0.75rem" }}
                      value={minWeight}
                      onChange={(e) => setMinWeight(e.target.value)}
                    />
                  </div>
                  <div>
                    <label style={styles.filterLabelSmall}>Max Distance (km)</label>
                    <input 
                      type="number" 
                      placeholder="e.g. 15" 
                      className="form-input" 
                      style={{ minHeight: "34px", fontSize: "0.75rem" }}
                      value={maxDistance}
                      onChange={(e) => setMaxDistance(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Map Area */}
          <div style={styles.mapContainerFrame}>
            {viewMode === "map" ? (
              <div style={{ height: "100%", width: "100%", position: "relative" }}>
                <MapContainer 
                  center={[collector.latitude, collector.longitude]} 
                  zoom={13} 
                  style={{ height: "100%", width: "100%", borderRadius: "12px" }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="&copy; OpenStreetMap contributors"
                  />
                  
                  {/* Collector Origin Marker */}
                  <Marker 
                    position={[collector.latitude, collector.longitude]}
                    icon={L.divIcon({
                      className: "col-pin",
                      html: `
                        <div style="background-color: var(--color-primary); color: white; width: 34px; height: 34px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 14px; border: 2px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.3);">
                          🚜
                        </div>
                      `,
                      iconSize: [34, 34],
                      iconAnchor: [17, 17]
                    })}
                  />
                  
                  {/* Operating Radius Circle */}
                  <Circle 
                    center={[collector.latitude, collector.longitude]}
                    radius={(collector.radius || 15) * 1000}
                    pathOptions={{ color: "var(--color-primary)", fillColor: "var(--color-primary)", fillOpacity: 0.06, weight: 1.5, dashArray: "4, 4" }}
                  />

                  {/* Generator Pins */}
                  {filteredPosts.map(post => {
                    const school = schools.find(s => s.id === post.schoolId);
                    if (!school) return null;
                    return (
                      <Marker
                        key={post.id}
                        position={[school.latitude, school.longitude]}
                        icon={createMarkerIcon(post.estimatedWeight, post.status)}
                        eventHandlers={{
                          click: () => setSelectedPostForBottomSheet(post)
                        }}
                      />
                    );
                  })}
                </MapContainer>

                {/* Interactive Marker Preview Card */}
                {selectedPostForBottomSheet && (
                  <div className="card" style={styles.mapMarkerPreviewCard}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                      <div>
                        <h4 style={{ fontSize: "0.88rem", fontWeight: 700 }}>{selectedPostForBottomSheet.schoolName}</h4>
                        <span style={{ fontSize: "0.68rem", color: "var(--color-text-secondary)" }}>
                          {getDistanceToPost(selectedPostForBottomSheet)} km away • {selectedPostForBottomSheet.estimatedWeight} kg
                        </span>
                      </div>
                      <button 
                        onClick={() => setSelectedPostForBottomSheet(null)}
                        style={{ border: "none", background: "none", fontSize: "0.75rem", cursor: "pointer", color: "var(--color-text-muted)" }}
                      >
                        ✕
                      </button>
                    </div>

                    <p style={{ fontSize: "0.72rem", color: "var(--color-text-secondary)", marginBottom: "10px" }}>
                      <strong>Surplus:</strong> {selectedPostForBottomSheet.reason}
                    </p>

                    <div style={{ display: "flex", gap: "8px" }}>
                      <a 
                        href={`https://www.google.com/maps/dir/?api=1&destination=${schools.find(s => s.id === selectedPostForBottomSheet.schoolId)?.latitude},${schools.find(s => s.id === selectedPostForBottomSheet.schoolId)?.longitude}`}
                        target="_blank"
                        rel="noreferrer"
                        className="btn-secondary" 
                        style={{ flex: 1, minHeight: "34px", fontSize: "0.72rem", padding: "0 8px", textDecoration: "none", display: "flex", alignItems: "center", justifyContent: "center", gap: "4px" }}
                      >
                        <ExternalLink size={12} /> Directions
                      </a>
                      <button 
                        onClick={() => {
                          setShowReserveConfirmationPost(selectedPostForBottomSheet);
                          setSelectedPostForBottomSheet(null);
                        }}
                        className="btn-primary" 
                        style={{ flex: 1, minHeight: "34px", fontSize: "0.72rem", padding: "0 8px" }}
                      >
                        Reserve Now
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {filteredPosts.map(post => (
                  <div key={post.id} className="card" style={{ padding: "12px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                      <h4 style={{ fontSize: "0.85rem" }}>{post.schoolName}</h4>
                      <span className="badge badge-available">Available</span>
                    </div>
                    <p style={{ fontSize: "0.72rem", color: "var(--color-text-secondary)", marginBottom: "8px" }}>
                      📍 {getDistanceToPost(post)} km away | Weight: <strong>{post.estimatedWeight} kg</strong> | Stream: {post.reason}
                    </p>
                    <button 
                      onClick={() => setShowReserveConfirmationPost(post)}
                      className="btn-primary" 
                      style={{ minHeight: "34px", fontSize: "0.75rem" }}
                    >
                      Reserve Pickup
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. ACTIVE PICKUPS WORKFLOW TAB */}
      {activeTab === "active" && (
        <div style={styles.scrollable}>
          <div style={styles.activeSectionHeader}>
            <div>
              <h3 style={styles.activeTitle}>Active Logistics Route</h3>
              <p style={styles.activeSubtitle}>Live dispatch tracking & collection verification</p>
            </div>
            <span className="badge badge-intransit">{activePickups.length} In Progress</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginTop: "12px" }}>
            {activePickups.map(post => {
              const distanceKm = getDistanceToPost(post);
              const remainingSecs = timerSeconds[post.id];
              const school = schools.find(s => s.id === post.schoolId);

              return (
                <div key={post.id} className="card" style={styles.activePickupCard}>
                  {/* Top Status Strip */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                    <div>
                      <h4 style={{ fontSize: "0.92rem", fontWeight: 700 }}>{post.schoolName}</h4>
                      <span style={{ fontSize: "0.68rem", color: "var(--color-text-secondary)" }}>
                        {distanceKm} km away • {post.estimatedWeight} kg organic load
                      </span>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <span className={`badge ${post.status === "In Transit" ? "badge-intransit" : "badge-reserved"}`}>
                        {post.status}
                      </span>
                      {remainingSecs !== undefined && post.status === "Reserved" && (
                        <span style={styles.timerBadge} className="tabular-nums">
                          ⏱ {formatTimer(remainingSecs)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Dispatch Workflow Stepper */}
                  <div style={styles.stepperContainer}>
                    <div style={{ ...styles.stepItem, color: "var(--color-primary)", fontWeight: 700 }}>
                      <span style={styles.stepNumberActive}>1</span>
                      <span>Reserved</span>
                    </div>
                    <div style={styles.stepConnector} />
                    <div style={{ ...styles.stepItem, color: post.status === "In Transit" || post.status === "Awaiting School Confirmation" ? "var(--color-primary)" : "var(--color-text-muted)", fontWeight: post.status === "In Transit" ? 700 : 500 }}>
                      <span style={post.status === "In Transit" || post.status === "Awaiting School Confirmation" ? styles.stepNumberActive : styles.stepNumberInactive}>2</span>
                      <span>In Transit</span>
                    </div>
                    <div style={styles.stepConnector} />
                    <div style={{ ...styles.stepItem, color: post.status === "Awaiting School Confirmation" ? "var(--color-primary)" : "var(--color-text-muted)" }}>
                      <span style={post.status === "Awaiting School Confirmation" ? styles.stepNumberActive : styles.stepNumberInactive}>3</span>
                      <span>Confirmed</span>
                    </div>
                  </div>

                  {/* Action Buttons based on Status */}
                  <div style={{ display: "flex", gap: "8px", marginTop: "14px" }}>
                    {post.status === "Reserved" && (
                      <>
                        <button 
                          onClick={() => cancelReservation(post.id)}
                          className="btn-secondary" 
                          style={{ flex: 1, minHeight: "38px", fontSize: "0.75rem", color: "var(--color-error)" }}
                        >
                          Cancel
                        </button>
                        <button 
                          onClick={() => startTransit(post.id, collector.id, collector.name)}
                          className="btn-primary" 
                          style={{ flex: 2, minHeight: "38px", fontSize: "0.78rem" }}
                        >
                          <Navigation size={14} style={{ marginRight: "6px" }} /> Start Transit (GPS)
                        </button>
                      </>
                    )}

                    {post.status === "In Transit" && (
                      <>
                        {school && (
                          <a 
                            href={`https://www.google.com/maps/dir/?api=1&destination=${school.latitude},${school.longitude}`}
                            target="_blank" 
                            rel="noreferrer" 
                            className="btn-secondary" 
                            style={{ flex: 1, minHeight: "38px", fontSize: "0.75rem", textDecoration: "none", display: "flex", alignItems: "center", justifyContent: "center", gap: "4px" }}
                          >
                            <ExternalLink size={13} /> Maps
                          </a>
                        )}
                        <button 
                          onClick={() => completePickup(post.id)} 
                          className="btn-primary" 
                          style={{ flex: 2, minHeight: "38px", fontSize: "0.78rem" }}
                        >
                          <CheckCircle size={14} style={{ marginRight: "6px" }} /> Confirm Arrival & Load
                        </button>
                      </>
                    )}

                    {post.status === "Awaiting School Confirmation" && (
                      <div style={styles.awaitingBanner}>
                        <Clock size={14} color="var(--color-primary)" />
                        <span>Awaiting seller handover verification check.</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {activePickups.length === 0 && (
              <div className="card" style={styles.emptyActiveCard}>
                <div style={styles.emptyIconCircle}>
                  <Navigation size={22} color="var(--color-primary)" />
                </div>
                <h4 style={styles.emptyTitle}>No Active Route in Progress</h4>
                <p style={styles.emptySub}>
                  Browse available surplus listings on the home dashboard or discovery radar to reserve your next collection.
                </p>
                <button 
                  onClick={() => setActiveTab("home")} 
                  className="btn-primary" 
                  style={{ width: "auto", minHeight: "36px", marginTop: "10px" }}
                >
                  Explore Nearby Surplus
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 4. NOTIFICATIONS TAB */}
      {activeTab === "notifications" && (
        <div style={styles.scrollable}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
            <div>
              <h3 style={{ fontSize: "1rem", fontWeight: 700 }}>Dispatch Notifications</h3>
              <p style={{ fontSize: "0.68rem", color: "var(--color-text-secondary)" }}>Live updates for Coimbatore routes</p>
            </div>
            {collectorNotifications.some(n => !n.read) && (
              <button
                onClick={markAllAsRead}
                style={{
                  fontSize: "0.7rem",
                  fontWeight: 600,
                  padding: "4px 10px",
                  borderRadius: "6px",
                  backgroundColor: "#FFFFFF",
                  color: "var(--color-primary)",
                  border: "1px solid var(--color-border)",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  cursor: "pointer"
                }}
              >
                <Check size={13} /> Mark all read
              </button>
            )}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {collectorNotifications.map(notif => (
              <div 
                key={notif.id} 
                className="card" 
                style={{ 
                  borderLeft: `3px solid ${notif.read ? "var(--color-border)" : "var(--color-primary)"}`, 
                  padding: "12px",
                  backgroundColor: notif.read ? "#FAFAFA" : "#FFFFFF"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "3px" }}>
                  <strong style={{ fontSize: "0.82rem" }}>{notif.title}</strong>
                  <span style={{ fontSize: "0.65rem", color: "var(--color-text-muted)" }}>
                    {new Date(notif.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
                <p style={{ fontSize: "0.74rem", color: "var(--color-text-secondary)", marginBottom: "6px" }}>{notif.message}</p>
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  {!notif.read && (
                    <button
                      onClick={() => markAsRead(notif.id)}
                      style={{
                        fontSize: "0.65rem",
                        fontWeight: 600,
                        padding: "2px 8px",
                        backgroundColor: "var(--color-primary)",
                        color: "#FFFFFF",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "4px"
                      }}
                    >
                      <Check size={11} /> Mark read
                    </button>
                  )}
                </div>
              </div>
            ))}
            {collectorNotifications.length === 0 && (
              <div className="card" style={styles.emptyNotificationsCard}>
                <p style={{ fontSize: "0.75rem", color: "var(--color-text-secondary)" }}>No new dispatch notifications.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 5. PROFILE & SETTINGS TAB */}
      {activeTab === "profile" && (
        <div style={styles.scrollable}>
          <div style={styles.subSettingsHeader}>
            {[
              { id: "menu", label: "Collector Details" },
              { id: "settings", label: t("profile") },
              { id: "help", label: "Support FAQs" }
            ].map(sub => (
              <button
                key={sub.id}
                onClick={() => setActiveSettingsSubPage(sub.id)}
                style={{
                  ...styles.subSettingsBtn,
                  borderBottom: activeSettingsSubPage === sub.id ? "2px solid var(--color-primary)" : "none",
                  color: activeSettingsSubPage === sub.id ? "var(--color-primary)" : "var(--color-text-secondary)",
                  fontWeight: activeSettingsSubPage === sub.id ? "700" : "500"
                }}
              >
                {sub.label}
              </button>
            ))}
          </div>

          {activeSettingsSubPage === "menu" && (
            <>
              <form onSubmit={handleProfileSave} className="card" style={{ marginTop: "12px" }}>
                <div className="form-group">
                  <label className="form-label">Collector Name</label>
                  <input type="text" className="form-input" value={collector.name} disabled />
                </div>
                <div className="form-group">
                  <label className="form-label">Collector Category</label>
                  <select 
                    className="form-input"
                    value={profileData.collectorType}
                    onChange={(e) => setProfileData(p => ({ ...p, collectorType: e.target.value }))}
                  >
                    <option value="Farmer">Farmer / Livestock Owner</option>
                    <option value="Compost Company">Compost Facility</option>
                    <option value="Vermicompost Site">Vermicompost Unit</option>
                    <option value="Organic Buyer">Organic Resource Buyer</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Operating Travel Radius (km)</label>
                  <input 
                    type="number" 
                    className="form-input" 
                    value={profileData.radius}
                    onChange={(e) => setProfileData(p => ({ ...p, radius: e.target.value }))}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Vehicle Type</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={profileData.vehicle}
                    onChange={(e) => setProfileData(p => ({ ...p, vehicle: e.target.value }))}
                  />
                </div>
                <button type="submit" className="btn-primary" style={{ marginTop: "8px" }}>
                  Save Profile Configuration
                </button>
              </form>
            </>
          )}

          {activeSettingsSubPage === "settings" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "12px" }}>
              <div className="card" style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <span style={{ fontSize: "0.85rem", fontWeight: 600 }}>{t("darkTheme")}</span>
                    <p style={{ fontSize: "0.68rem", color: "var(--color-text-secondary)" }}>Toggle dark interface layout colors.</p>
                  </div>
                  <button 
                    onClick={() => setIsDarkMode(!isDarkMode)}
                    style={{
                      padding: "4px 10px",
                      borderRadius: "6px",
                      fontSize: "0.7rem",
                      fontWeight: 700,
                      backgroundColor: isDarkMode ? "var(--color-primary)" : "var(--color-border)",
                      color: isDarkMode ? "#FFFFFF" : "var(--color-text-secondary)"
                    }}
                  >
                    {isDarkMode ? "ACTIVE" : "INACTIVE"}
                  </button>
                </div>

                <div style={{ borderTop: "1px solid var(--color-border)", paddingTop: "12px" }}>
                  <span style={{ fontSize: "0.85rem", fontWeight: 600 }}>{t("language")}</span>
                  <select 
                    className="form-input" 
                    style={{ marginTop: "6px", minHeight: "36px", fontSize: "0.75rem" }}
                    value={language}
                    onChange={(e) => {
                      setLanguage(e.target.value);
                      addToast("Language updated successfully!", "success");
                    }}
                  >
                    <option value="en">English</option>
                    <option value="ta">Tamil (தமிழ்)</option>
                    <option value="kn">Kannada (ಕನ್ನಡ)</option>
                    <option value="hi">Hindi (हिन्दी)</option>
                  </select>
                </div>
              </div>

              <LicenseViewer />
            </div>
          )}

          {activeSettingsSubPage === "help" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "12px" }}>
              <div className="card">
                <h4 style={{ fontSize: "0.88rem", fontWeight: 700, marginBottom: "8px" }}>Logistics FAQs</h4>
                <div style={styles.faqItem}>
                  <span style={styles.faqQuestion}>Q: Why is there a 1-active-route limit?</span>
                  <p style={styles.faqAnswer}>
                    To prevent slot hoarding and ensure fresh feed/compost material, collectors are restricted to one active reservation route at a time.
                  </p>
                </div>
                <div style={{ ...styles.faqItem, marginTop: "8px" }}>
                  <span style={styles.faqQuestion}>Q: What is the 30-minute collector timeout?</span>
                  <p style={styles.faqAnswer}>
                    Once a collector reserves a seller listing, they must start transit within 30 minutes, or the listing is automatically unlocked for others.
                  </p>
                </div>
              </div>

              <form onSubmit={handleTicketSubmit} className="card">
                <h4 style={{ fontSize: "0.88rem", fontWeight: 700, marginBottom: "6px" }}>Contact Dispatch Support</h4>
                <p style={{ fontSize: "0.68rem", color: "var(--color-text-secondary)", marginBottom: "10px" }}>
                  Encountered gate closed, weight mismatch, or shop closed? File a quick report.
                </p>
                <div className="form-group">
                  <textarea 
                    placeholder="Describe your issue..." 
                    className="form-input" 
                    style={{ minHeight: "70px", resize: "none", fontSize: "0.75rem" }}
                    value={ticketMsg}
                    onChange={(e) => setTicketMsg(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="btn-primary" style={{ minHeight: "36px", marginTop: "4px" }}>
                  Submit Report
                </button>
              </form>
            </div>
          )}
        </div>
      )}

      {/* 6. RESERVATION CONFIRMATION MODAL */}
      {showReserveConfirmationPost && (
        <div style={styles.modalOverlay}>
          <div className="card page-enter" style={styles.confirmModal}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
              <div style={styles.modalIconBadge}>
                <Package size={16} color="var(--color-primary)" />
              </div>
              <h3 style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--color-text-primary)" }}>
                Confirm Surplus Reservation
              </h3>
            </div>
            
            <p style={{ fontSize: "0.72rem", color: "var(--color-text-secondary)", marginBottom: "12px", lineHeight: "1.4" }}>
              You will have 30 minutes to start transit toward the generator site.
            </p>

            <div style={styles.modalSummaryBox}>
              <div style={styles.modalSummaryRow}>
                <span style={{ color: "var(--color-text-secondary)" }}>Seller:</span>
                <strong style={{ color: "var(--color-text-primary)" }}>{showReserveConfirmationPost.schoolName}</strong>
              </div>
              <div style={styles.modalSummaryRow}>
                <span style={{ color: "var(--color-text-secondary)" }}>Organic Load:</span>
                <strong style={{ color: "var(--color-primary)" }}>{showReserveConfirmationPost.estimatedWeight} kg</strong>
              </div>
              <div style={styles.modalSummaryRow}>
                <span style={{ color: "var(--color-text-secondary)" }}>Distance:</span>
                <strong style={{ color: "var(--color-text-primary)" }}>{getDistanceToPost(showReserveConfirmationPost)} km away</strong>
              </div>
              <div style={styles.modalSummaryRow}>
                <span style={{ color: "var(--color-text-secondary)" }}>Stream:</span>
                <span style={{ color: "var(--color-text-primary)", fontStyle: "italic" }}>{showReserveConfirmationPost.reason}</span>
              </div>
            </div>

            <div style={{ display: "flex", gap: "8px" }}>
              <button 
                onClick={() => setShowReserveConfirmationPost(null)} 
                className="btn-secondary" 
                style={{ flex: 1, minHeight: "38px", fontSize: "0.75rem" }}
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  reserveWaste(showReserveConfirmationPost.id, collector.id);
                  setShowReserveConfirmationPost(null);
                  setActiveTab("active");
                }} 
                className="btn-primary" 
                style={{ flex: 1.5, minHeight: "38px", fontSize: "0.75rem" }}
              >
                Confirm & Start Route
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. FARMER PRODUCE LISTING MODAL */}
      {showProduceModal && (
        <div style={styles.modalOverlay}>
          <div className="card page-enter" style={{ ...styles.confirmModal, maxWidth: "420px", padding: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
              <div style={styles.modalIconBadge}>
                <Sprout size={16} color="var(--color-primary)" />
              </div>
              <h3 style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--color-text-primary)" }}>
                List Excess Farm Produce
              </h3>
            </div>
            <p style={{ fontSize: "0.7rem", color: "var(--color-text-secondary)", marginBottom: "12px" }}>
              List fresh vegetables, grain surplus, or harvest crops for instant routing.
            </p>

            <form onSubmit={(e) => {
              e.preventDefault();
              const finalTitle = produceForm.title === "Custom" ? (produceForm.customTitle || "Produce") : produceForm.title;
              const finalDelivery = produceForm.deliveryEstimate === "Custom" ? (produceForm.customDelivery || "Immediate") : produceForm.deliveryEstimate;
              
              uploadProducePost(
                collector.id,
                finalTitle,
                produceForm.quantity,
                produceForm.price,
                finalDelivery,
                produceForm.description,
                produceForm.imageUrl
              );
              setShowProduceModal(false);
              setProduceForm({ title: "Tomatoes (Fresh Harvest)", quantity: "25", price: "0", deliveryEstimate: "Tomorrow Morning", description: "", imageUrl: "" });
            }}>
              <div className="form-group" style={{ marginBottom: "10px" }}>
                <label className="form-label" style={{ fontSize: "0.7rem" }}>Select Crop / Item</label>
                <select 
                  className="form-input" 
                  style={{ minHeight: "36px", fontSize: "0.75rem" }}
                  value={produceForm.title}
                  onChange={(e) => setProduceForm(p => ({ ...p, title: e.target.value }))}
                >
                  <option value="Tomatoes (Fresh Harvest)">Tomatoes (Fresh Harvest)</option>
                  <option value="Spinach & Keerai Leaves">Spinach & Keerai Leaves</option>
                  <option value="Banana Crop & Stems">Banana Crop & Stems</option>
                  <option value="Pumpkin & Gourds">Pumpkin & Gourds</option>
                  <option value="Potatoes & Tuber Surplus">Potatoes & Tuber Surplus</option>
                  <option value="Carrots & Root Veg">Carrots & Root Veg</option>
                  <option value="Organic Dairy / Cattle Feed">Organic Dairy / Cattle Feed</option>
                  <option value="Custom">Other Custom Crop...</option>
                </select>
              </div>

              {produceForm.title === "Custom" && (
                <div className="form-group" style={{ marginBottom: "10px" }}>
                  <label className="form-label" style={{ fontSize: "0.7rem" }}>Custom Item Name</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    style={{ minHeight: "36px", fontSize: "0.75rem" }}
                    placeholder="e.g. Fresh Drumsticks"
                    value={produceForm.customTitle || ""}
                    onChange={(e) => setProduceForm(p => ({ ...p, customTitle: e.target.value }))}
                    required
                  />
                </div>
              )}

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "10px" }}>
                <div className="form-group">
                  <label className="form-label" style={{ fontSize: "0.7rem" }}>Quantity (kg)</label>
                  <input 
                    type="number" 
                    min="1" 
                    className="form-input" 
                    style={{ minHeight: "36px", fontSize: "0.75rem" }}
                    value={produceForm.quantity}
                    onChange={(e) => setProduceForm(p => ({ ...p, quantity: e.target.value }))}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" style={{ fontSize: "0.7rem" }}>Price per kg (₹)</label>
                  <input 
                    type="number" 
                    min="0" 
                    className="form-input" 
                    style={{ minHeight: "36px", fontSize: "0.75rem" }}
                    placeholder="0 for Free Feed"
                    value={produceForm.price}
                    onChange={(e) => setProduceForm(p => ({ ...p, price: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: "12px" }}>
                <label className="form-label" style={{ fontSize: "0.7rem" }}>Availability / Handover</label>
                <select 
                  className="form-input" 
                  style={{ minHeight: "36px", fontSize: "0.75rem" }}
                  value={produceForm.deliveryEstimate}
                  onChange={(e) => setProduceForm(p => ({ ...p, deliveryEstimate: e.target.value }))}
                >
                  <option value="Immediate (Ready for Pickup)">Immediate (Ready for Pickup)</option>
                  <option value="Today Evening (5:00 PM)">Today Evening (5:00 PM)</option>
                  <option value="Tomorrow Morning (7:00 AM)">Tomorrow Morning (7:00 AM)</option>
                </select>
              </div>

              <div style={{ display: "flex", gap: "8px" }}>
                <button 
                  type="button"
                  onClick={() => setShowProduceModal(false)} 
                  className="btn-secondary" 
                  style={{ flex: 1, minHeight: "36px", fontSize: "0.75rem" }}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn-primary" 
                  style={{ flex: 1.5, minHeight: "36px", fontSize: "0.75rem" }}
                >
                  Publish Listing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: "12px",
    display: "flex",
    flexDirection: "column",
    width: "100%",
    position: "relative"
  },
  scrollable: {
    display: "flex",
    flexDirection: "column",
    width: "100%"
  },
  /* Intentional Logistics Header */
  logisticsHeaderCard: {
    padding: "12px 14px",
    marginBottom: "10px",
    backgroundColor: "#FFFFFF",
    border: "1px solid var(--color-border-subtle)"
  },
  logisticsHeaderTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start"
  },
  logisticsProfileInfo: {
    display: "flex",
    alignItems: "center",
    gap: "10px"
  },
  farmerBadgeIcon: {
    width: "36px",
    height: "36px",
    borderRadius: "8px",
    backgroundColor: "var(--color-primary-light)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0
  },
  farmerNameTitle: {
    fontSize: "0.98rem",
    fontWeight: 700,
    color: "var(--color-text-primary)"
  },
  verifiedPill: {
    fontSize: "0.6rem",
    fontWeight: 700,
    backgroundColor: "rgba(46, 125, 50, 0.1)",
    color: "var(--color-primary)",
    padding: "2px 6px",
    borderRadius: "4px"
  },
  logisticsSubRole: {
    fontSize: "0.68rem",
    color: "var(--color-text-secondary)",
    marginTop: "1px"
  },
  statusIndicatorGroup: {
    display: "flex",
    alignItems: "center",
    gap: "5px",
    backgroundColor: "var(--color-primary-light)",
    padding: "3px 8px",
    borderRadius: "6px"
  },
  livePulseDot: {
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    backgroundColor: "var(--color-primary)"
  },
  statusLiveText: {
    fontSize: "0.62rem",
    fontWeight: 600,
    color: "var(--color-primary)"
  },
  logisticsMetaBar: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginTop: "10px",
    paddingTop: "8px",
    borderTop: "1px dashed var(--color-border-subtle)",
    fontSize: "0.68rem",
    color: "var(--color-text-secondary)"
  },
  metaChipItem: {
    display: "flex",
    alignItems: "center",
    gap: "4px"
  },
  metaDivider: {
    width: "1px",
    height: "10px",
    backgroundColor: "var(--color-border)"
  },

  /* Compact KPI Row */
  kpiGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "8px",
    marginBottom: "14px"
  },
  kpiCard: {
    padding: "10px 10px",
    backgroundColor: "#FFFFFF",
    border: "1px solid var(--color-border-subtle)"
  },
  kpiTopRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "4px"
  },
  kpiLabel: {
    fontSize: "0.58rem",
    fontWeight: 700,
    color: "var(--color-text-muted)",
    letterSpacing: "0.02em"
  },
  kpiIconBadge: {
    width: "20px",
    height: "20px",
    borderRadius: "4px",
    backgroundColor: "var(--color-primary-light)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  kpiValueRow: {
    marginBottom: "2px"
  },
  kpiValueNumber: {
    fontSize: "1.05rem",
    fontWeight: 700,
    color: "var(--color-primary)",
    lineHeight: 1.1
  },
  kpiUnit: {
    fontSize: "0.68rem",
    fontWeight: 500,
    color: "var(--color-text-secondary)"
  },
  kpiTrendPositive: {
    fontSize: "0.6rem",
    fontWeight: 600,
    color: "var(--color-primary)"
  },
  kpiSubLabel: {
    fontSize: "0.6rem",
    color: "var(--color-text-muted)"
  },
  kpiActionLink: {
    fontSize: "0.6rem",
    fontWeight: 600,
    color: "var(--color-primary)"
  },

  /* Hero Section: Available Nearby Pickups */
  heroSectionContainer: {
    marginBottom: "16px"
  },
  heroHeaderRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "10px"
  },
  heroSectionTitle: {
    fontSize: "0.92rem",
    fontWeight: 700,
    color: "var(--color-text-primary)"
  },
  heroCountBadge: {
    fontSize: "0.62rem",
    fontWeight: 700,
    backgroundColor: "var(--color-primary)",
    color: "#FFFFFF",
    padding: "2px 7px",
    borderRadius: "10px"
  },
  refreshActionBtn: {
    minHeight: "28px",
    padding: "0 10px",
    fontSize: "0.68rem",
    fontWeight: 600,
    borderRadius: "6px",
    backgroundColor: "#FFFFFF",
    border: "1px solid var(--color-border)",
    color: "var(--color-text-secondary)",
    display: "inline-flex",
    alignItems: "center",
    gap: "5px",
    cursor: "pointer"
  },
  pickupCardsList: {
    display: "flex",
    flexDirection: "column",
    gap: "10px"
  },
  pickupCard: {
    padding: "12px 14px",
    backgroundColor: "#FFFFFF",
    border: "1px solid var(--color-border-subtle)"
  },
  pickupCardTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "8px"
  },
  pickupBusinessName: {
    fontSize: "0.9rem",
    fontWeight: 700,
    color: "var(--color-text-primary)"
  },
  pickupCategoryTag: {
    fontSize: "0.65rem",
    fontWeight: 600,
    color: "var(--color-text-muted)"
  },
  pickupMetaRow: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "6px 10px",
    borderRadius: "6px",
    backgroundColor: "var(--color-background)",
    fontSize: "0.7rem",
    marginBottom: "8px"
  },
  pickupMetaItem: {
    display: "flex",
    alignItems: "center",
    gap: "4px"
  },
  pickupReasonStrip: {
    display: "flex",
    alignItems: "flex-start",
    gap: "6px",
    fontSize: "0.72rem",
    color: "var(--color-text-secondary)",
    marginBottom: "10px"
  },
  pickupReasonText: {
    lineHeight: 1.35
  },
  pickupActionRow: {
    display: "flex",
    justifyContent: "flex-end"
  },
  reserveBtn: {
    minHeight: "36px",
    fontSize: "0.78rem",
    padding: "0 16px",
    borderRadius: "6px"
  },

  /* Empty State for Pickups */
  emptyPickupStateCard: {
    padding: "24px 16px",
    textAlign: "center",
    alignItems: "center",
    justifyContent: "center",
    border: "1px dashed var(--color-border)"
  },
  emptyIconCircle: {
    width: "44px",
    height: "44px",
    borderRadius: "50%",
    backgroundColor: "var(--color-primary-light)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "8px"
  },
  emptyTitle: {
    fontSize: "0.88rem",
    fontWeight: 700,
    marginBottom: "4px"
  },
  emptySub: {
    fontSize: "0.72rem",
    color: "var(--color-text-secondary)",
    maxWidth: "300px",
    lineHeight: 1.4
  },

  /* Farmer Produce Section */
  produceSectionContainer: {
    marginTop: "6px",
    paddingTop: "14px",
    borderTop: "1px solid var(--color-border-subtle)"
  },
  produceHeaderRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "10px"
  },
  produceSectionTitle: {
    fontSize: "0.88rem",
    fontWeight: 700
  },
  produceSectionSub: {
    fontSize: "0.65rem",
    color: "var(--color-text-secondary)"
  },
  listProduceTriggerBtn: {
    minHeight: "30px",
    padding: "0 12px",
    fontSize: "0.72rem",
    borderRadius: "6px",
    width: "auto"
  },
  produceListingCard: {
    padding: "10px 12px",
    border: "1px solid var(--color-border-subtle)"
  },
  produceThumbBox: {
    width: "32px",
    height: "32px",
    borderRadius: "6px",
    backgroundColor: "var(--color-primary-light)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  produceItemTitle: {
    fontSize: "0.8rem",
    fontWeight: 700
  },
  produceItemPrice: {
    fontSize: "0.68rem",
    color: "var(--color-text-secondary)"
  },
  cancelProduceBtn: {
    border: "none",
    background: "none",
    color: "var(--color-error)",
    cursor: "pointer",
    padding: "4px"
  },

  /* Compact Empty Produce Card */
  compactEmptyProduceCard: {
    padding: "12px 14px",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    border: "1px dashed var(--color-border)"
  },
  compactEmptyLeft: {
    display: "flex",
    alignItems: "center",
    gap: "10px"
  },
  sproutBadgeIcon: {
    width: "32px",
    height: "32px",
    borderRadius: "6px",
    backgroundColor: "var(--color-primary-light)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0
  },
  compactEmptyTitle: {
    fontSize: "0.78rem",
    fontWeight: 700
  },
  compactEmptyDesc: {
    fontSize: "0.66rem",
    color: "var(--color-text-secondary)",
    lineHeight: 1.3
  },
  compactEmptyActionBtn: {
    minHeight: "30px",
    padding: "0 10px",
    fontSize: "0.7rem",
    borderRadius: "6px",
    width: "auto",
    flexShrink: 0
  },

  /* Map Discovery Styles */
  mapTabLayout: {
    display: "flex",
    flexDirection: "column",
    height: "calc(100vh - 120px)",
    width: "100%"
  },
  mapControlCard: {
    padding: "8px 10px",
    marginBottom: "8px"
  },
  mapSearchRow: {
    display: "flex",
    alignItems: "center",
    gap: "6px"
  },
  searchInputGroup: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    backgroundColor: "var(--color-background)",
    borderRadius: "6px",
    border: "1px solid var(--color-border)"
  },
  mapSearchInputField: {
    border: "none",
    backgroundColor: "transparent",
    minHeight: "34px",
    fontSize: "0.75rem",
    padding: "0 8px"
  },
  mapFilterToggleBtn: {
    width: "34px",
    height: "34px",
    minHeight: "34px",
    borderRadius: "6px",
    border: "1px solid var(--color-border)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer"
  },
  mapViewModeBtn: {
    width: "34px",
    height: "34px",
    minHeight: "34px",
    borderRadius: "6px",
    border: "1px solid var(--color-border)",
    backgroundColor: "#FFFFFF",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer"
  },
  filterDrawerContent: {
    marginTop: "8px",
    paddingTop: "8px",
    borderTop: "1px solid var(--color-border-subtle)"
  },
  filterLabelSmall: {
    fontSize: "0.62rem",
    fontWeight: 600,
    color: "var(--color-text-secondary)",
    display: "block",
    marginBottom: "2px"
  },
  mapContainerFrame: {
    flex: 1,
    borderRadius: "12px",
    overflow: "hidden",
    position: "relative"
  },
  mapMarkerPreviewCard: {
    position: "absolute",
    bottom: "12px",
    left: "12px",
    right: "12px",
    zIndex: 1000,
    padding: "12px 14px",
    boxShadow: "var(--shadow-lg)"
  },

  /* Active Pickups View */
  activeSectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "10px"
  },
  activeTitle: {
    fontSize: "0.98rem",
    fontWeight: 700
  },
  activeSubtitle: {
    fontSize: "0.68rem",
    color: "var(--color-text-secondary)"
  },
  activePickupCard: {
    padding: "14px",
    border: "1px solid var(--color-border-subtle)"
  },
  timerBadge: {
    display: "block",
    fontSize: "0.68rem",
    fontWeight: 700,
    color: "var(--color-accent)",
    marginTop: "2px"
  },
  stepperContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "8px 10px",
    borderRadius: "6px",
    backgroundColor: "var(--color-background)",
    fontSize: "0.68rem"
  },
  stepItem: {
    display: "flex",
    alignItems: "center",
    gap: "4px"
  },
  stepNumberActive: {
    width: "18px",
    height: "18px",
    borderRadius: "50%",
    backgroundColor: "var(--color-primary)",
    color: "#FFFFFF",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "0.6rem",
    fontWeight: 700
  },
  stepNumberInactive: {
    width: "18px",
    height: "18px",
    borderRadius: "50%",
    backgroundColor: "var(--color-border)",
    color: "#FFFFFF",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "0.6rem",
    fontWeight: 700
  },
  stepConnector: {
    flex: 1,
    height: "1px",
    backgroundColor: "var(--color-border)",
    margin: "0 6px"
  },
  awaitingBanner: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontSize: "0.72rem",
    color: "var(--color-primary)",
    fontStyle: "italic",
    padding: "8px",
    backgroundColor: "var(--color-primary-light)",
    borderRadius: "6px",
    width: "100%"
  },
  emptyActiveCard: {
    padding: "28px 16px",
    textAlign: "center",
    alignItems: "center",
    border: "1px dashed var(--color-border)"
  },
  emptyNotificationsCard: {
    padding: "20px",
    textAlign: "center",
    border: "1px dashed var(--color-border)"
  },

  /* Profile & Settings Sub Tabs */
  subSettingsHeader: {
    display: "flex",
    borderBottom: "1px solid var(--color-border)",
    marginBottom: "8px"
  },
  subSettingsBtn: {
    flex: 1,
    minHeight: "36px",
    fontSize: "0.75rem",
    cursor: "pointer"
  },
  faqItem: {
    padding: "8px 0",
    borderBottom: "1px dashed var(--color-border-subtle)"
  },
  faqQuestion: {
    fontSize: "0.75rem",
    fontWeight: 700,
    color: "var(--color-text-primary)"
  },
  faqAnswer: {
    fontSize: "0.7rem",
    color: "var(--color-text-secondary)",
    marginTop: "2px",
    lineHeight: 1.35
  },

  /* Modals */
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(23, 35, 32, 0.45)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
    padding: "16px"
  },
  confirmModal: {
    maxWidth: "380px",
    width: "100%",
    padding: "16px",
    boxShadow: "var(--shadow-lg)"
  },
  modalIconBadge: {
    width: "28px",
    height: "28px",
    borderRadius: "6px",
    backgroundColor: "var(--color-primary-light)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  modalSummaryBox: {
    border: "1px dashed var(--color-border)",
    borderRadius: "8px",
    padding: "10px",
    marginBottom: "14px",
    backgroundColor: "var(--color-background)",
    display: "flex",
    flexDirection: "column",
    gap: "6px"
  },
  modalSummaryRow: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "0.72rem"
  }
};
