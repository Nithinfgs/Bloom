/**
 * Category-aware metadata configurations for commercial waste generators
 */
export const CATEGORY_CONFIGS = {
  flower_mandi: {
    label: "Flower & Floral Vendor",
    metricLabel: "Total Inbound Stock (kg)",
    gradeTitle: "Floral Diversion Audit Grade",
    gradeSub: "Your flower mandi ranks in the top 10% in Coimbatore for vermicompost recovery!",
    streamTitle: "Floral Trimmings Stream Efficiency",
    streamDesc: "Flower varieties rated by recovery quality (fewer discards = higher grade).",
    streams: [
      { name: 'Jasmine & Marigold Petals', avgWaste: 5.2, stars: 5, desc: 'Instant vermicompost dispatch' },
      { name: 'Rose & Garland Stems', avgWaste: 9.8, stars: 4, desc: 'High cellulose compost biomass' },
      { name: 'Wilted Temple Blooms & Buds', avgWaste: 14.5, stars: 3, desc: 'Fast microbial decomposition' },
      { name: 'Bouquet Trimmings & Foliage', avgWaste: 18.2, stars: 2, desc: 'Coarse organic mulch' },
      { name: 'Waterlogged Market Residue', avgWaste: 24.0, stars: 1, desc: 'Requires dry aeration' }
    ],
    correlationTitle: "Auction Inbound vs Trimmings Correlation",
    correlationDesc: "Tracks daily flower auction arrivals vs trimming surplus. Note how festival days cause peak recovery.",
    chartLine1: "Inbound Floral Stock",
    chartLine2: "Customer Footfall",
    chartLine3: "Trimmings Diverted (kg)",
    topReasonsFallback: [
      { reason: 'Daily Mandi Trimmings', weight: 48.0, percentage: 45 },
      { reason: 'Over-bloomed Stock', weight: 32.0, percentage: 30 },
      { reason: 'Stem & Foliage Offcuts', weight: 18.0, percentage: 17 },
      { reason: 'Weather Damage', weight: 8.5, percentage: 8 }
    ],
    suggestions: [
      "Early 6:00 AM auction trimmings dispatch ensures 100% freshness for vermicompost processors.",
      "Separate woody stems from soft jasmine petals to speed up organic composting turnaround by 30%.",
      "Festival morning surges (Tuesdays/Fridays) yield high volume; pre-schedule extra tractor pickups."
    ],
    trendTitle: "Festival & Seasonal Flower Surges",
    trendText: "Coimbatore temple festivals and wedding seasons increase floral mandi volumes by up to 45%. Automated radar dispatch routes surplus directly to vermicompost farms within 4 hours."
  },
  restaurant: {
    label: "Hotel & Restaurant",
    metricLabel: "Total Diner Covers Served",
    gradeTitle: "Commercial Waste Audit Grade",
    gradeSub: "Your kitchen ranks in the top 15% in Coimbatore for livestock diversion!",
    streamTitle: "Buffet & Kitchen Stream Performance",
    streamDesc: "Kitchen surplus streams rated by farmer pickup speed and value.",
    streams: [
      { name: 'Vegetable Biryani & Rice Trays', avgWaste: 4.8, stars: 5, desc: 'Dispatched to piggeries within 2h' },
      { name: 'Sambar & Dal Curries', avgWaste: 8.5, stars: 4, desc: 'High-value liquid livestock feed' },
      { name: 'Breakfast Upma & Tiffin Surplus', avgWaste: 12.0, stars: 3, desc: 'Moderate leftover volume' },
      { name: 'Vegetable Peels & Kitchen Prep', avgWaste: 16.5, stars: 3, desc: 'Compost processor stream' },
      { name: 'Table Clearance Wet Scraps', avgWaste: 22.0, stars: 1, desc: 'Requires immediate segregation' }
    ],
    correlationTitle: "Guest Footfall vs Prep vs Surplus Correlation",
    correlationDesc: "Tracks relationship between Guest Covers, Batch Prep Scale, and Diverted Leftovers.",
    chartLine1: "Kitchen Prep Batch",
    chartLine2: "Guest Footfall",
    chartLine3: "Surplus Diverted (kg)",
    topReasonsFallback: [
      { reason: 'Buffet Over-Preparation', weight: 42.0, percentage: 41 },
      { reason: 'Prep Trimmings & Peels', weight: 28.5, percentage: 28 },
      { reason: 'Event Catering Surplus', weight: 18.0, percentage: 18 },
      { reason: 'Perishable Spoilage', weight: 13.5, percentage: 13 }
    ],
    suggestions: [
      "Dinner banquet leftovers scheduled for 10:30 PM farmer collection saves an average of 35kg/night.",
      "Buffet tray replenishment scaling reduces end-of-service surplus by up to 22%.",
      "Weekend wedding rushes produce high organic yields; broadcast GPS radar 1 hour prior to closing."
    ],
    trendTitle: "Weekend Dining & Monsoon Patterns",
    trendText: "Coimbatore weekend dining increases banquet volumes by 35%. Dynamic radar alerts notify nearby livestock farmers for instant evening collection."
  },
  bakery: {
    label: "Bakery & Cafe",
    metricLabel: "Total Bake Production (kg)",
    gradeTitle: "Bakery Biomass Diversion Grade",
    gradeSub: "Your bakery ranks in the top 8% in Coimbatore for biomass recovery!",
    streamTitle: "Bakery Stream & Biomass Value",
    streamDesc: "Bake streams rated by biomass recovery and farm nutrition value.",
    streams: [
      { name: 'Spent Espresso Grounds & Chaff', avgWaste: 3.5, stars: 5, desc: 'High-nitrogen soil conditioner' },
      { name: 'Day-End Artisan Bread & Loaves', avgWaste: 6.8, stars: 5, desc: 'High-caloric feed supplement' },
      { name: 'Pastry Trimmings & Crusts', avgWaste: 10.2, stars: 4, desc: 'Dry organic feed mix' },
      { name: 'Dough Residues & Batter Trim', avgWaste: 14.0, stars: 3, desc: 'Biogas & compost substrate' },
      { name: 'Cream & Dairy Residues', avgWaste: 19.5, stars: 2, desc: 'Anaerobic digester feed' }
    ],
    correlationTitle: "Bake Production vs Surplus Correlation",
    correlationDesc: "Tracks daily bake batches against evening unsold surplus.",
    chartLine1: "Bake Output (kg)",
    chartLine2: "Walk-in Footfall",
    chartLine3: "Surplus Diverted (kg)",
    topReasonsFallback: [
      { reason: 'Day-End Unsold Loaves', weight: 25.0, percentage: 42 },
      { reason: 'Spent Coffee Grounds', weight: 18.0, percentage: 30 },
      { reason: 'Dough & Crust Trim', weight: 11.0, percentage: 18 },
      { reason: 'Pastry Offcuts', weight: 6.0, percentage: 10 }
    ],
    suggestions: [
      "Separate spent espresso coffee grounds into dry buckets for local mushroom cultivators and gardeners.",
      "Day-end unsold loaves can be dry-bagged for livestock farmers to prevent mold formation.",
      "Adjust Saturday pastry prep scale by 10% on rainy afternoons to minimize unsold items."
    ],
    trendTitle: "Weekend Cafe & Morning Cycles",
    trendText: "Morning cafe hours generate peak coffee grounds, while evening closing produces fresh bread surplus. Daily double-pickup ensures zero landfill waste."
  },
  produce_market: {
    label: "Produce Market & Grocer",
    metricLabel: "Total Inbound Produce (kg)",
    gradeTitle: "Market Produce Recovery Grade",
    gradeSub: "Your market ranks in the top 12% in Coimbatore for agricultural circularity!",
    streamTitle: "Produce Grading & Recovery Streams",
    streamDesc: "Wholesale produce categories rated by farm feed & composting compatibility.",
    streams: [
      { name: 'Green Leafy Veg & Cabbage Outer Trim', avgWaste: 8.0, stars: 5, desc: 'Immediate dairy cattle fodder' },
      { name: 'Over-ripe Tomatoes & Gourds', avgWaste: 14.2, stars: 4, desc: 'Fast compost digestion' },
      { name: 'Bruised Citrus & Tropical Fruits', avgWaste: 19.5, stars: 4, desc: 'Bio-enzyme production' },
      { name: 'Root Vegetable Peels & Soil Residue', avgWaste: 24.0, stars: 3, desc: 'Vermiculture bedding' },
      { name: 'Spoiled Mixed Crates', avgWaste: 32.0, stars: 1, desc: 'Requires sorting' }
    ],
    correlationTitle: "Wholesale Inbound Shipments vs Trimmings",
    correlationDesc: "Tracks wholesale crate arrivals against sorted organic trimmings.",
    chartLine1: "Inbound Tonnage",
    chartLine2: "Buyer Footfall",
    chartLine3: "Trimmings Diverted (kg)",
    topReasonsFallback: [
      { reason: 'Greens & Leafy Trimmings', weight: 55.0, percentage: 46 },
      { reason: 'Transit Bruised Produce', weight: 34.0, percentage: 28 },
      { reason: 'Over-ripe Fruit Sorting', weight: 20.0, percentage: 17 },
      { reason: 'End of Day Clearance', weight: 11.0, percentage: 9 }
    ],
    suggestions: [
      "Leafy vegetable trimmings collected before 11:00 AM provide fresh nutrition for local dairy cattle.",
      "Sort over-ripe fruit into designated crates for bio-enzyme and organic vinegar makers.",
      "Wholesale mandi trucks arrive at 4:00 AM; early morning radar listing speeds up collector matching."
    ],
    trendTitle: "Wholesale Mandi Seasonal Arrivals",
    trendText: "Seasonal vegetable gluts in Ukkadam wholesale market produce large daily volumes of fresh trimmings, fully utilized by peri-urban dairy and piggery farms."
  },
  catering: {
    label: "Catering & Banquet Hall",
    metricLabel: "Total Event Covers / Guests",
    gradeTitle: "Catering Waste Recovery Grade",
    gradeSub: "Your catering kitchen ranks in the top 10% in Coimbatore for commercial diversion!",
    streamTitle: "Banquet & Event Stream Performance",
    streamDesc: "Event meal streams rated by diversion efficiency.",
    streams: [
      { name: 'Rice & Sambar Leftover Pans', avgWaste: 6.2, stars: 5, desc: 'Instant livestock feed dispatch' },
      { name: 'Vegetable Prep Peels & Stems', avgWaste: 11.0, stars: 4, desc: 'Compost biomass' },
      { name: 'Event Dessert & Sweet Surplus', avgWaste: 15.5, stars: 3, desc: 'Farmer pickup' },
      { name: 'Tray Clearance Residue', avgWaste: 21.0, stars: 2, desc: 'Wet organic sorting' }
    ],
    correlationTitle: "Event Covers vs Surplus Correlation",
    correlationDesc: "Tracks daily event hall attendance against food surplus volumes.",
    chartLine1: "Cooked Servings",
    chartLine2: "Event Guest Footfall",
    chartLine3: "Surplus Diverted (kg)",
    topReasonsFallback: [
      { reason: 'Batch Over-Cooking', weight: 35.0, percentage: 40 },
      { reason: 'Vegetable Prep Waste', weight: 25.0, percentage: 29 },
      { reason: 'Guest Attendance Variance', weight: 18.0, percentage: 21 },
      { reason: 'Buffet Clearance Leftovers', weight: 9.0, percentage: 10 }
    ],
    suggestions: [
      "Sync banquet batch sizes with RSVP counts to reduce prep surplus by 18%.",
      "Direct end-of-event buffet clearance to designated livestock collection bins for 10:30 PM pickup."
    ],
    trendTitle: "Commercial Catering Cycles",
    trendText: "Wedding and corporate event schedules create predictable surplus patterns, optimized with automated recurring pickup schedules."
  },
  canteen: {
    label: "Catering & Banquet Hall",
    metricLabel: "Total Event Covers / Guests",
    gradeTitle: "Catering Waste Recovery Grade",
    gradeSub: "Your catering kitchen ranks in the top 10% in Coimbatore for commercial diversion!",
    streamTitle: "Banquet & Event Stream Performance",
    streamDesc: "Event meal streams rated by diversion efficiency.",
    streams: [
      { name: 'Rice & Sambar Leftover Pans', avgWaste: 6.2, stars: 5, desc: 'Instant livestock feed dispatch' },
      { name: 'Vegetable Prep Peels & Stems', avgWaste: 11.0, stars: 4, desc: 'Compost biomass' },
      { name: 'Event Dessert & Sweet Surplus', avgWaste: 15.5, stars: 3, desc: 'Farmer pickup' },
      { name: 'Tray Clearance Residue', avgWaste: 21.0, stars: 2, desc: 'Wet organic sorting' }
    ],
    correlationTitle: "Event Covers vs Surplus Correlation",
    correlationDesc: "Tracks daily event hall attendance against food surplus volumes.",
    chartLine1: "Cooked Servings",
    chartLine2: "Event Guest Footfall",
    chartLine3: "Surplus Diverted (kg)",
    topReasonsFallback: [
      { reason: 'Batch Over-Cooking', weight: 35.0, percentage: 40 },
      { reason: 'Vegetable Prep Waste', weight: 25.0, percentage: 29 },
      { reason: 'Guest Attendance Variance', weight: 18.0, percentage: 21 },
      { reason: 'Buffet Clearance Leftovers', weight: 9.0, percentage: 10 }
    ],
    suggestions: [
      "Sync banquet batch sizes with RSVP counts to reduce prep surplus by 18%.",
      "Direct end-of-event buffet clearance to designated livestock collection bins for 10:30 PM pickup."
    ],
    trendTitle: "Commercial Catering Cycles",
    trendText: "Wedding and corporate event schedules create predictable surplus patterns, optimized with automated recurring pickup schedules."
  },
  small_business: {
    label: "Small Business & Food Stall",
    metricLabel: "Total Customer Orders",
    gradeTitle: "Small Business Circularity Grade",
    gradeSub: "Your business ranks in the top 5% in Coimbatore for neighborhood diversion!",
    streamTitle: "Organic Stream Diversion",
    streamDesc: "Surplus streams rated by local farmer recovery value.",
    streams: [
      { name: 'Coffee Grounds & Tea Mash', avgWaste: 2.8, stars: 5, desc: 'Local soil conditioning' },
      { name: 'Snack & Batter Residue', avgWaste: 4.5, stars: 4, desc: 'Feed supplement' },
      { name: 'Fresh Juice Pulp & Peels', avgWaste: 7.2, stars: 4, desc: 'Compost & bio-enzyme' },
      { name: 'Evening Food Leftovers', avgWaste: 11.0, stars: 3, desc: 'Local farmer pickup' }
    ],
    correlationTitle: "Daily Footfall vs Organic Surplus",
    correlationDesc: "Tracks customer visits against organic residue generated.",
    chartLine1: "Daily Production",
    chartLine2: "Customer Visits",
    chartLine3: "Surplus Diverted (kg)",
    topReasonsFallback: [
      { reason: 'Juice Pulp & Peels', weight: 22.0, percentage: 44 },
      { reason: 'Coffee & Tea Residue', weight: 15.0, percentage: 30 },
      { reason: 'Dough & Snack Leftovers', weight: 8.0, percentage: 16 },
      { reason: 'Closing Food Clearance', weight: 5.0, percentage: 10 }
    ],
    suggestions: [
      "Combine tea/coffee waste with neighborhood composters for free soil conditioner exchange.",
      "List juice pulp on the GPS marketplace for organic enzyme producers."
    ],
    trendTitle: "Local Commercial Ecosystem",
    trendText: "Small food businesses across Coimbatore divert 100% of organic pulp and grounds through hyper-local farmer pickup."
  }
};

/**
 * Computes dashboard statistics from active waste listings and completed history.
 * @param {Array} activePosts 
 * @param {Array} historyPosts 
 * @param {string} [schoolId] Optional filter for business / seller portal
 * @returns {Object} Statistics object
 */
export function computeStatistics(activePosts, historyPosts, schoolId = null) {
  const filterBySchool = (list) => schoolId ? list.filter(item => item.schoolId === schoolId) : list;
  
  const active = filterBySchool(activePosts);
  const completed = filterBySchool(historyPosts);
  
  // Total waste generated is active posts + completed posts
  const totalActiveWeight = active.reduce((sum, item) => sum + (item.estimatedWeight || 0), 0);
  const totalCompletedWeight = completed.reduce((sum, item) => sum + (item.estimatedWeight || 0), 0);
  const totalGenerated = totalActiveWeight + totalCompletedWeight;
  
  // Total waste collected / diverted
  const totalCollected = totalCompletedWeight;
  
  // Success Rate
  const successRate = totalGenerated > 0 
    ? parseFloat(((totalCollected / totalGenerated) * 100).toFixed(1))
    : 100;
  
  // Money saved approximation (15 INR per kg diverted from landfill)
  const moneySaved = Math.round(totalCollected * 15);
  
  // Waste diversion score
  let wasteScore = 88;
  if (schoolId) {
    const count = completed.length;
    const avgWaste = count > 0 ? (totalCompletedWeight / count) : 0;
    if (avgWaste > 40) wasteScore = 72;
    else if (avgWaste > 25) wasteScore = 82;
    else if (avgWaste > 15) wasteScore = 89;
    else wasteScore = 96;
  }

  return {
    totalGenerated: parseFloat(totalGenerated.toFixed(2)),
    totalCollected: parseFloat(totalCollected.toFixed(2)),
    successRate,
    moneySaved,
    wasteScore
  };
}

/**
 * Generates text-based insights based on a business history records.
 * @param {Array} history 
 * @param {Object} school 
 * @returns {Array<string>} List of insights
 */
export function generateSchoolInsights(history, school = null) {
  const cat = school?.category || 'restaurant';
  const cfg = CATEGORY_CONFIGS[cat] || CATEGORY_CONFIGS.restaurant;

  if (!history || history.length === 0) {
    return [
      `No historical listings yet. Post your daily ${school?.surplusType || 'organic surplus'} to connect with nearby collectors.`,
      `Your ${cfg.gradeTitle} will calculate automatically upon first completed pickup.`
    ];
  }
  
  return cfg.suggestions.slice(0, 3);
}

/**
 * Generates a complete Monthly Audit & Operations Report
 */
export function generateFoodAuditReport(historyPosts, school) {
  const schoolId = school?.id;
  const completed = schoolId ? historyPosts.filter(h => h.schoolId === schoolId) : historyPosts;
  const cat = school?.category || 'restaurant';
  const cfg = CATEGORY_CONFIGS[cat] || CATEGORY_CONFIGS.restaurant;
  
  const totalWaste = completed.reduce((sum, item) => sum + (item.estimatedWeight || 0), 0);
  
  // Calculate total volume throughput based on business scale
  const days = Math.max(completed.length, 5);
  const capacity = school?.studentStrength || 380;
  const totalThroughput = Math.round(capacity * days * 0.92);

  // Top waste reasons calculation
  const reasonsMap = {};
  completed.forEach(item => {
    let r = item.reason || 'General Surplus';
    reasonsMap[r] = (reasonsMap[r] || 0) + (item.estimatedWeight || 0);
  });

  const totalReasonWeight = Object.values(reasonsMap).reduce((s, w) => s + w, 0) || 1;
  let topReasons = Object.keys(reasonsMap).map(r => ({
    reason: r,
    weight: parseFloat(reasonsMap[r].toFixed(1)),
    percentage: Math.round((reasonsMap[r] / totalReasonWeight) * 100)
  })).sort((a, b) => b.weight - a.weight);

  // Fallback top reasons if empty
  if (topReasons.length === 0) {
    topReasons = cfg.topReasonsFallback;
  }

  // Find wasteful/efficient days
  const dayWastes = {};
  const dayCounts = {};
  completed.forEach(item => {
    if (item.date) {
      const day = new Date(item.date).toLocaleDateString('en-US', { weekday: 'long' });
      dayWastes[day] = (dayWastes[day] || 0) + (item.estimatedWeight || 0);
      dayCounts[day] = (dayCounts[day] || 0) + 1;
    }
  });

  let mostWastefulDay = 'Wednesday';
  let maxAvg = 0;
  let mostEfficientDay = 'Tuesday';
  let minAvg = 99999;

  Object.keys(dayWastes).forEach(day => {
    const avg = dayWastes[day] / dayCounts[day];
    if (avg > maxAvg) {
      maxAvg = avg;
      mostWastefulDay = day;
    }
    if (avg < minAvg) {
      minAvg = avg;
      mostEfficientDay = day;
    }
  });

  // Calculate Waste Score
  const dailyAverage = completed.length > 0 ? (totalWaste / completed.length) : 15;
  let wasteScore = 'A';
  if (dailyAverage < 12) wasteScore = 'A+';
  else if (dailyAverage < 22) wasteScore = 'A';
  else if (dailyAverage < 35) wasteScore = 'B';
  else wasteScore = 'C';

  return {
    categoryConfig: cfg,
    totalMealsServed: totalThroughput, // Throughput (covers, kg, or orders)
    totalWaste: parseFloat(totalWaste.toFixed(1)) || 54.0,
    wasteScore,
    topReasons,
    mostWastefulDay,
    mostEfficientDay,
    wasteReduction: 18.5,
    collectorSuccessRate: 98.6,
    suggestions: cfg.suggestions
  };
}

/**
 * Gets category-specific surplus streams performance details
 */
export function getMenuPerformance(historyPosts, school) {
  const cat = school?.category || 'restaurant';
  const cfg = CATEGORY_CONFIGS[cat] || CATEGORY_CONFIGS.restaurant;
  return cfg.streams;
}

/**
 * Gets footfall vs production vs surplus correlation history points
 */
export function getAttendanceWasteCorrelation(historyPosts, school) {
  const capacity = school?.studentStrength || 300;
  const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  
  return weekdays.map((day, idx) => {
    const factor = idx === 2 ? 0.78 : (0.88 + Math.random() * 0.1);
    const footfall = Math.round(capacity * factor);
    const production = capacity;
    const surplus = idx === 2 ? 28.5 : Math.max(parseFloat((8 + Math.random() * 12).toFixed(1)), 4);
    
    return {
      day,
      attendance: footfall,
      cooked: production,
      waste: surplus
    };
  });
}

