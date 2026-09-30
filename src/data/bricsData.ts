export type { BricsNode, NodeTelemetry, RegenerativeModel, CropDisease } from '../types/index.ts';
import { BricsNode, NodeTelemetry, RegenerativeModel, CropDisease } from '../types/index.ts';

export const BRICS_NODES: BricsNode[] = [
  {
    id: "in-deccan",
    country: "India",
    parent_country: "India",
    iso: "IND",
    region: "Deccan Plateau (Maharashtra / Karnataka)",
    flag: "🇮🇳",
    coordinates: { lat: 18.5204, lon: 73.8567 },
    soil_type: "Black Cotton Soil (Vertisol)",
    primary_crops: ["Pigeon Pea", "Sorghum", "Cotton", "Millets", "Chickpea"],
    climate_zone: "Semi-Arid Tropical",
    priority_challenge: "Groundwater depletion, hardpan formation, and post-monsoon topsoil erosion",
    partner_institute: "ICAR (Indian Council of Agricultural Research)",
    elevation_m: 560
  },
  {
    id: "in-punjab",
    country: "India",
    parent_country: "India",
    iso: "IND",
    region: "Punjab (Indo-Gangetic Plain)",
    flag: "🇮🇳",
    coordinates: { lat: 30.9010, lon: 75.8573 },
    soil_type: "Alluvial Soil (Inceptisol)",
    primary_crops: ["Wheat", "Rice", "Mustard"],
    climate_zone: "Semi-Arid Subtropical",
    priority_challenge: "Groundwater depletion from paddy-wheat cycle; stubble burning and late-summer heat stress",
    partner_institute: "Punjab Agricultural University (PAU)",
    elevation_m: 247
  },
  {
    id: "in-bengal",
    country: "India",
    parent_country: "India",
    iso: "IND",
    region: "West Bengal (Lower Gangetic Delta)",
    flag: "🇮🇳",
    coordinates: { lat: 22.9868, lon: 87.8550 },
    soil_type: "Clay Loam (Inceptisol)",
    primary_crops: ["Rice", "Jute", "Tea"],
    climate_zone: "Humid Subtropical",
    priority_challenge: "Cyclone salinity ingress and monsoon waterlogging",
    partner_institute: "Bidhan Chandra Krishi Viswavidyalaya (BCKV)",
    elevation_m: 9
  },
  {
    id: "in-tamilnadu",
    country: "India",
    parent_country: "India",
    iso: "IND",
    region: "Tamil Nadu (Cauvery Delta)",
    flag: "🇮🇳",
    coordinates: { lat: 10.7905, lon: 79.1378 },
    soil_type: "Red Loam / Alluvial",
    primary_crops: ["Rice", "Sugarcane", "Cotton"],
    climate_zone: "Tropical Wet-and-Dry",
    priority_challenge: "Inter-state water sharing and tank-irrigation silting",
    partner_institute: "Tamil Nadu Agricultural University (TNAU)",
    elevation_m: 78
  },
  {
    id: "in-kerala",
    country: "India",
    parent_country: "India",
    iso: "IND",
    region: "Kerala (Malabar Coast)",
    flag: "🇮🇳",
    coordinates: { lat: 10.8505, lon: 76.2711 },
    soil_type: "Laterite (Oxisol)",
    primary_crops: ["Coconut", "Rubber", "Black Pepper"],
    climate_zone: "Tropical Monsoon",
    priority_challenge: "Slope erosion and laterite nutrient fixation",
    partner_institute: "Kerala Agricultural University (KAU)",
    elevation_m: 12
  },
  {
    id: "br-cerrado",
    country: "Brazil",
    iso: "BRA",
    region: "Cerrado Savannah (Mato Grosso)",
    flag: "🇧🇷",
    coordinates: { lat: -12.6819, lon: -56.9211 },
    soil_type: "Acidic Oxisol / Red-Yellow Latosol",
    primary_crops: ["Soybean", "Maize", "Urochloa Pasture", "Cassava", "Dryland Rice"],
    climate_zone: "Tropical Wet-and-Dry",
    priority_challenge: "High soil acidity, severe phosphorus fixation, and intense mid-summer heat spells",
    partner_institute: "EMBRAPA (Brazilian Agricultural Research Corporation)",
    elevation_m: 410
  },
  {
    id: "za-highveld",
    country: "South Africa",
    iso: "ZAF",
    region: "Free State / Highveld Basin",
    flag: "🇿🇦",
    coordinates: { lat: -28.4541, lon: 26.7968 },
    soil_type: "Sandy Clay Loam (Arenosol / Luvisol)",
    primary_crops: ["Sunflower", "White Maize", "Cowpea", "Sorghum", "Groundnut"],
    climate_zone: "Subtropical Highland Dryland",
    priority_challenge: "Recurrent multi-year drought, windblown sand erosion, and critical SOC deficit (<0.4%)",
    partner_institute: "ARC (Agricultural Research Council South Africa)",
    elevation_m: 1420
  },
  {
    id: "cn-yellow-river",
    country: "China",
    iso: "CHN",
    region: "Loess Plateau (Shaanxi / Shanxi)",
    flag: "🇨🇳",
    coordinates: { lat: 35.8617, lon: 109.1102 },
    soil_type: "Silt Loam (Loessial Entisol)",
    primary_crops: ["Winter Wheat", "Proso Millet", "Apple Orchards", "Soybean", "Alfalfa"],
    climate_zone: "Temperate Continental Monsoon",
    priority_challenge: "Severe gully runoff erosion, low organic matter holding, and sudden frost events",
    partner_institute: "NWAFU / Chinese Academy of Agricultural Sciences",
    elevation_m: 1100
  },
  {
    id: "ru-chernozem",
    country: "Russia",
    iso: "RUS",
    region: "Central Black Earth Belt (Voronezh)",
    flag: "🇷🇺",
    coordinates: { lat: 51.6720, lon: 39.1843 },
    soil_type: "Deep Chernozem (Black Earth)",
    primary_crops: ["Spring Barley", "Sunflower", "Sugar Beet", "Spring Wheat", "Peas"],
    climate_zone: "Humid Continental",
    priority_challenge: "Heavy machinery subsoil compaction, brief warm growing window, and spring thaw rill erosion",
    partner_institute: "Vavilov All-Russian Institute of Plant Genetic Resources",
    elevation_m: 154
  },
  {
    id: "et-highlands",
    country: "Ethiopia",
    iso: "ETH",
    region: "Oromia / Amhara Highlands",
    flag: "🇪🇹",
    coordinates: { lat: 9.1450, lon: 40.4897 },
    soil_type: "Deep Nitisol / Eutric Cambisol",
    primary_crops: ["Teff", "Faba Bean", "Highland Sorghum", "Chickpea", "Barley"],
    climate_zone: "Highland Subtropical (Woina Dega)",
    priority_challenge: "Steep hillside nutrient leaching, soil crusting, and extreme micro-climate rain variance",
    partner_institute: "EIAR (Ethiopian Institute of Agricultural Research)",
    elevation_m: 2350
  }
];

export const TELEMETRY_BY_NODE: Record<string, NodeTelemetry> = {
  "in-deccan": {
    satellite: {
      ndvi: 0.42,
      ndvi_status: "Moderate Vegetative Vigor",
      ndwi: -0.15,
      ndwi_status: "Moderate Water Stress Detected",
      surface_temperature_c: 34.2,
      canopy_cover_pct: 58,
      sensor: "Sentinel-2 MultiSpectral + Landsat-9 TIRS",
      last_pass: "3 hours ago (ESA Copernicus Constellation)"
    },
    soil: {
      ph: 7.9,
      organic_carbon_pct: 0.44,
      nitrogen_kg_ha: 182,
      phosphorus_kg_ha: 14,
      potassium_kg_ha: 310,
      moisture_pct: 19.5,
      microbial_activity_score: 52,
      bulk_density_g_cm3: 1.48
    },
    weather: {
      temp_c: 31.8,
      humidity_pct: 46,
      forecast_summary: "7-day dry spell ahead with 15% probability of isolated evening showers",
      rainfall_7d_mm: 4.5,
      wind_kmh: 14.2,
      evapotranspiration_mm_day: 5.8,
      solar_radiation_mj_m2: 21.4
    }
  },
  "in-punjab": {
    satellite: {
      ndvi: 0.62,
      ndvi_status: "Intense Agricultural Canopy",
      ndwi: 0.04,
      ndwi_status: "Adequate Irrigation Buffer",
      surface_temperature_c: 28.4,
      canopy_cover_pct: 75,
      sensor: "Sentinel-2 MultiSpectral + Landsat-9",
      last_pass: "2 hours ago (Copernicus Constellation)"
    },
    soil: {
      ph: 7.6,
      organic_carbon_pct: 0.55,
      nitrogen_kg_ha: 140,
      phosphorus_kg_ha: 22,
      potassium_kg_ha: 280,
      moisture_pct: 26.5,
      microbial_activity_score: 48,
      bulk_density_g_cm3: 1.42
    },
    weather: {
      temp_c: 27.5,
      humidity_pct: 54,
      forecast_summary: "Clear skies with dry northwesterly winds and rising afternoon temperature",
      rainfall_7d_mm: 1.2,
      wind_kmh: 12.0,
      evapotranspiration_mm_day: 5.2,
      solar_radiation_mj_m2: 22.8
    }
  },
  "in-bengal": {
    satellite: {
      ndvi: 0.58,
      ndvi_status: "Dense Wetland Biomass",
      ndwi: 0.22,
      ndwi_status: "Saturated Subsoil Hydric Profile",
      surface_temperature_c: 30.1,
      canopy_cover_pct: 70,
      sensor: "Sentinel-2 MultiSpectral + Resourcesat-2",
      last_pass: "4 hours ago (ISRO Ground Station)"
    },
    soil: {
      ph: 6.5,
      organic_carbon_pct: 0.88,
      nitrogen_kg_ha: 225,
      phosphorus_kg_ha: 16,
      potassium_kg_ha: 210,
      moisture_pct: 34.0,
      microbial_activity_score: 72,
      bulk_density_g_cm3: 1.25
    },
    weather: {
      temp_c: 30.8,
      humidity_pct: 82,
      forecast_summary: "High humidity with recurring pre-monsoon convective thunderstorms and squalls",
      rainfall_7d_mm: 38.5,
      wind_kmh: 18.0,
      evapotranspiration_mm_day: 4.0,
      solar_radiation_mj_m2: 17.6
    }
  },
  "in-tamilnadu": {
    satellite: {
      ndvi: 0.45,
      ndvi_status: "Moderate Deltaic Vegetation",
      ndwi: -0.10,
      ndwi_status: "Marginal Hydric Stress",
      surface_temperature_c: 33.6,
      canopy_cover_pct: 52,
      sensor: "Sentinel-2 MultiSpectral + Cartosat",
      last_pass: "3 hours ago (NRSC Ground Feed)"
    },
    soil: {
      ph: 7.2,
      organic_carbon_pct: 0.49,
      nitrogen_kg_ha: 170,
      phosphorus_kg_ha: 15,
      potassium_kg_ha: 260,
      moisture_pct: 18.2,
      microbial_activity_score: 55,
      bulk_density_g_cm3: 1.45
    },
    weather: {
      temp_c: 33.0,
      humidity_pct: 62,
      forecast_summary: "Hot and humid maritime breeze with isolated deltaic evening drizzle",
      rainfall_7d_mm: 6.0,
      wind_kmh: 15.5,
      evapotranspiration_mm_day: 5.9,
      solar_radiation_mj_m2: 23.2
    }
  },
  "in-kerala": {
    satellite: {
      ndvi: 0.76,
      ndvi_status: "High Density Multi-Tier Canopy",
      ndwi: 0.31,
      ndwi_status: "Abundant Moisture Reservoir",
      surface_temperature_c: 27.2,
      canopy_cover_pct: 88,
      sensor: "Sentinel-2 MultiSpectral + Landsat-8",
      last_pass: "1 hour ago (Copernicus Constellation)"
    },
    soil: {
      ph: 5.3,
      organic_carbon_pct: 1.45,
      nitrogen_kg_ha: 240,
      phosphorus_kg_ha: 7,
      potassium_kg_ha: 165,
      moisture_pct: 36.8,
      microbial_activity_score: 84,
      bulk_density_g_cm3: 1.18
    },
    weather: {
      temp_c: 27.8,
      humidity_pct: 88,
      forecast_summary: "Heavy coastal orographic showers with coastal mist and cloud cover",
      rainfall_7d_mm: 68.0,
      wind_kmh: 11.2,
      evapotranspiration_mm_day: 3.4,
      solar_radiation_mj_m2: 15.8
    }
  },
  "br-cerrado": {
    satellite: {
      ndvi: 0.68,
      ndvi_status: "Vigorous Biomass Density",
      ndwi: 0.12,
      ndwi_status: "Adequate Moisture Buffer",
      surface_temperature_c: 29.5,
      canopy_cover_pct: 82,
      sensor: "Sentinel-2 MultiSpectral + CBERS-4A",
      last_pass: "5 hours ago (INPE / ESA Joint Task)"
    },
    soil: {
      ph: 5.2,
      organic_carbon_pct: 1.25,
      nitrogen_kg_ha: 210,
      phosphorus_kg_ha: 8,
      potassium_kg_ha: 140,
      moisture_pct: 28.0,
      microbial_activity_score: 71,
      bulk_density_g_cm3: 1.22
    },
    weather: {
      temp_c: 28.0,
      humidity_pct: 74,
      forecast_summary: "Scattered convective afternoon thunderstorms with high relative humidity",
      rainfall_7d_mm: 42.0,
      wind_kmh: 9.5,
      evapotranspiration_mm_day: 4.2,
      solar_radiation_mj_m2: 18.9
    }
  },
  "za-highveld": {
    satellite: {
      ndvi: 0.35,
      ndvi_status: "Sparse Vegetative Index (Drought Vulnerable)",
      ndwi: -0.28,
      ndwi_status: "Severe Subsoil Hydric Deficit",
      surface_temperature_c: 32.1,
      canopy_cover_pct: 39,
      sensor: "Sentinel-2 MultiSpectral + MODIS Terra",
      last_pass: "2 hours ago (SANSA Ground Station)"
    },
    soil: {
      ph: 6.3,
      organic_carbon_pct: 0.38,
      nitrogen_kg_ha: 130,
      phosphorus_kg_ha: 11,
      potassium_kg_ha: 195,
      moisture_pct: 13.2,
      microbial_activity_score: 38,
      bulk_density_g_cm3: 1.55
    },
    weather: {
      temp_c: 29.4,
      humidity_pct: 33,
      forecast_summary: "Prolonged dry heatwave with strong desorbing gusts and zero expected precip",
      rainfall_7d_mm: 0.0,
      wind_kmh: 22.0,
      evapotranspiration_mm_day: 6.9,
      solar_radiation_mj_m2: 24.1
    }
  },
  "cn-yellow-river": {
    satellite: {
      ndvi: 0.51,
      ndvi_status: "Moderate Canopy Density",
      ndwi: -0.05,
      ndwi_status: "Marginal Moisture Balance",
      surface_temperature_c: 21.0,
      canopy_cover_pct: 64,
      sensor: "Sentinel-2 MultiSpectral + Gaofen-6",
      last_pass: "4 hours ago (CNSA Earth Observation)"
    },
    soil: {
      ph: 8.1,
      organic_carbon_pct: 0.72,
      nitrogen_kg_ha: 165,
      phosphorus_kg_ha: 18,
      potassium_kg_ha: 240,
      moisture_pct: 22.4,
      microbial_activity_score: 60,
      bulk_density_g_cm3: 1.36
    },
    weather: {
      temp_c: 19.5,
      humidity_pct: 52,
      forecast_summary: "Cooling front approaching; dry northern breeze with intermittent cloud cover",
      rainfall_7d_mm: 8.0,
      wind_kmh: 16.0,
      evapotranspiration_mm_day: 3.7,
      solar_radiation_mj_m2: 16.5
    }
  },
  "ru-chernozem": {
    satellite: {
      ndvi: 0.59,
      ndvi_status: "Healthy Early Germination",
      ndwi: 0.08,
      ndwi_status: "Optimal Soil Satiation",
      surface_temperature_c: 17.8,
      canopy_cover_pct: 71,
      sensor: "Sentinel-2 MultiSpectral + Meteor-M",
      last_pass: "6 hours ago (Roscosmos Center)"
    },
    soil: {
      ph: 6.8,
      organic_carbon_pct: 3.80,
      nitrogen_kg_ha: 290,
      phosphorus_kg_ha: 35,
      potassium_kg_ha: 380,
      moisture_pct: 31.5,
      microbial_activity_score: 88,
      bulk_density_g_cm3: 1.15
    },
    weather: {
      temp_c: 16.2,
      humidity_pct: 68,
      forecast_summary: "Mild continental conditions with light nocturnal frost risk in low depressions",
      rainfall_7d_mm: 18.0,
      wind_kmh: 11.0,
      evapotranspiration_mm_day: 2.9,
      solar_radiation_mj_m2: 15.2
    }
  },
  "et-highlands": {
    satellite: {
      ndvi: 0.48,
      ndvi_status: "Moderate Vegetative Cover (Terraced Plots)",
      ndwi: -0.02,
      ndwi_status: "Equilibrium Moisture",
      surface_temperature_c: 23.4,
      canopy_cover_pct: 54,
      sensor: "Sentinel-2 MultiSpectral + Landsat-8",
      last_pass: "1 hour ago (RCMRD Regional Center)"
    },
    soil: {
      ph: 5.8,
      organic_carbon_pct: 1.10,
      nitrogen_kg_ha: 155,
      phosphorus_kg_ha: 9,
      potassium_kg_ha: 175,
      moisture_pct: 24.1,
      microbial_activity_score: 64,
      bulk_density_g_cm3: 1.28
    },
    weather: {
      temp_c: 22.0,
      humidity_pct: 58,
      forecast_summary: "Bimodal light Belg rains concluding; transition to sunny highland afternoons",
      rainfall_7d_mm: 14.0,
      wind_kmh: 12.5,
      evapotranspiration_mm_day: 4.1,
      solar_radiation_mj_m2: 20.3
    }
  }
};

export const INITIAL_REGENERATIVE_MODELS: RegenerativeModel[] = [
  {
    model_id: "MOD-BRICS-2025-01",
    title: "Biochar-Enriched Legume Agroforestry Rotation",
    origin_country: "India",
    partner_institute: "ICAR & AgriN Deccan Node",
    applicable_regions: ["Semi-Arid Vertisols", "Degraded Loam", "Subtropical Highlands"],
    carbon_sequestration_potential: "2.4 tCO2e/ha/year",
    water_efficiency_gain: "+34%",
    core_principles: [
      "Intercropping deep-root pigeon pea with sorghum (2:1 geometry) for natural nitrogen fixation and biopore aeration",
      "Pyrolyzed agricultural residue biochar application at 1.5 t/ha to permanently rebuild cation exchange capacity",
      "No-till mulching retaining minimum 75% crop residue carpet to suppress weed emergence and soil sun baking"
    ],
    soil_recovery_trajectory: "Increases soil organic carbon by 0.25% within 18 months; eliminates synthetic urea dependency by 45%.",
    status: "Verified Digital Public Good (Interoperable Schema v2.1)"
  },
  {
    model_id: "MOD-BRICS-2025-02",
    title: "Integrated Crop-Livestock-Forestry (ILPF) System",
    origin_country: "Brazil",
    partner_institute: "EMBRAPA & AgriN Cerrado Station",
    applicable_regions: ["Acidic Oxisols", "Tropical Savannahs", "Eroded Pastures"],
    carbon_sequestration_potential: "3.8 tCO2e/ha/year",
    water_efficiency_gain: "+28%",
    core_principles: [
      "Alley cropping with native nitrogen-fixing legume trees (Gliricidia sepium) spaced at 20m intervals",
      "Rotational high-density grazing on deep-root Urochloa brizantha pasture between annual grain crop cycles",
      "Silicate rock dust (stonemeal remineralization) top-dressing to remediate phosphorus-fixing soils without acid runoff"
    ],
    soil_recovery_trajectory: "Buffers acidic pH towards 6.2; triples rhizosphere mycorrhizal colonization in 2 cropping seasons.",
    status: "Verified Digital Public Good (Interoperable Schema v2.1)"
  },
  {
    model_id: "MOD-BRICS-2025-03",
    title: "Conservation Loess Micro-Ridge & Hairy Vetch Cover",
    origin_country: "China",
    partner_institute: "NWAFU / AgriN Yellow River Node",
    applicable_regions: ["Loessial Entisols", "Sloping Silt Soils", "Cold Arid Valleys"],
    carbon_sequestration_potential: "1.9 tCO2e/ha/year",
    water_efficiency_gain: "+42%",
    core_principles: [
      "Biodegradable straw check-dams and micro-terraced contour ridges halting slope gravity runoff",
      "Winter hairy vetch cover crop to prevent early spring windblown topsoil stripping",
      "Targeted microbial consortia inoculation (Azotobacter + Bacillus amyloliquefaciens) during seed planting"
    ],
    soil_recovery_trajectory: "Reduces sediment runoff loss by 88% and restores microbial respiration rates to virgin soil baselines.",
    status: "Verified Digital Public Good (Interoperable Schema v2.1)"
  },
  {
    model_id: "MOD-BRICS-2025-04",
    title: "Multi-Strata Drought Shield & Millets Poly-Culture",
    origin_country: "South Africa",
    partner_institute: "ARC / AgriN Highveld Node",
    applicable_regions: ["Sandy Arenosols", "Drought-Stressed Plains", "Rain-fed Marginal Lands"],
    carbon_sequestration_potential: "1.7 tCO2e/ha/year",
    water_efficiency_gain: "+39%",
    core_principles: [
      "Polyculture sowing of Pearl Millet, Cowpea, and Sorghum with staggered root depth and harvest timelines",
      "Sub-surface bio-swales lined with vetiver grass root barriers to capture sporadic downpours and recharge aquifers",
      "Foliar compost tea spray containing endemic Trichoderma strains for plant root heat-shock resilience"
    ],
    soil_recovery_trajectory: "Maintains plant-available subsoil moisture 14 days longer into dry spells; elevates crop brix sugar levels.",
    status: "Verified Digital Public Good (Interoperable Schema v2.1)"
  },
  {
    model_id: "MOD-BRICS-2025-05",
    title: "Deep Mulch Cold-Shield & Spring Humus Priming",
    origin_country: "Russia",
    partner_institute: "Vavilov Institute & Chernozem Hub",
    applicable_regions: ["Deep Chernozem", "Cold Continental Plains", "Silt Clay Basins"],
    carbon_sequestration_potential: "2.8 tCO2e/ha/year",
    water_efficiency_gain: "+22%",
    core_principles: [
      "Heavy sunflower stalk chopping and winter snow-trapping stubble to recharge deep water tables upon spring melt",
      "Strip-tillage replacing deep moldboard plowing to prevent oxidation of historical black earth humus layers",
      "Liquid humic acid and mycorrhizal fungal booster injections during spring barley drilling"
    ],
    soil_recovery_trajectory: "Reverses machinery subsoil compaction; preserves 3.8% native organic carbon profile.",
    status: "Verified Digital Public Good (Interoperable Schema v2.1)"
  },
  {
    model_id: "MOD-BRICS-2025-06",
    title: "Terraced Agroforestry & Teff-Legume Fanya Juu",
    origin_country: "Ethiopia",
    partner_institute: "EIAR & Oromia Agricultural Research Center",
    applicable_regions: ["Highland Nitisols", "Steep Terraced Slopes", "Eroded Hillside Basins"],
    carbon_sequestration_potential: "2.6 tCO2e/ha/year",
    water_efficiency_gain: "+36%",
    core_principles: [
      "Fanya Juu contour earth berms planted with Desho grass and Sesbania trees to arrest torrential erosion",
      "Teff sown in alternating contour strips with nitrogen-dense Faba Beans and Highland Chickpeas",
      "Bokashi fermented organic compost pits utilizing enset and crop residues for rapid topsoil enrichment"
    ],
    soil_recovery_trajectory: "Eliminates hillside nutrient wash-out; restores volcanic soil cation balance within two seasons.",
    status: "Verified Digital Public Good (Interoperable Schema v2.1)"
  }
];

export const CROP_DISEASES: CropDisease[] = [
  {
    id: "DIS-001",
    crop: "Rice / Paddy",
    disease_name: "Rice Blast (Magnaporthe oryzae)",
    pathogen_type: "Fungal (Airborne & Seed-borne)",
    sample_image_url: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80",
    visual_symptoms: "Spindle-shaped elliptical lesions with gray or whitish centers and dark reddish-brown borders on leaf blades and neck node.",
    severity: "High",
    regenerative_biological_treatment: "Spray fermented botanical extract (Panchagavya 3%) mixed with Pseudomonas fluorescens bio-agent (10g/L). Immediately halt synthetic urea which triggers succulent susceptible growth.",
    preventive_soil_action: "Incorporate silica-rich pyrolyzed rice husk ash into the soil to fortify plant leaf epidermis against fungal appressoria penetration.",
    brics_indigenous_knowledge_note: "Indian Natural Farming (ZBNF): Agniastra botanical decoction prepared with neem leaves, green chillies, garlic, and fermented cow urine acts as a natural broad-spectrum anti-blast defense."
  },
  {
    id: "DIS-002",
    crop: "Soybean",
    disease_name: "Asian Soybean Rust (Phakopsora pachyrhizi)",
    pathogen_type: "Fungal (Windborne Spores)",
    sample_image_url: "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=600&q=80",
    visual_symptoms: "Pinpoint brown to reddish-brown lesions with raised pustules (uredinia) clustered heavily on the underside (abaxial) of lower canopy leaves.",
    severity: "Critical",
    regenerative_biological_treatment: "Early proactive canopy spray of Bacillus subtilis (1x10^9 CFU/ml) coupled with cold-pressed neem kernel oil nano-emulsion (5 ml/L) to inhibit spore germination.",
    preventive_soil_action: "Adopt strip-cropping with pearl millet or sorghum to create physical vegetative windbreaks that interrupt continuous spore lodging corridors.",
    brics_indigenous_knowledge_note: "Brazil EMBRAPA Biological Protocol: Inoculation of phyllosphere with beneficial Trichoderma asperellum strains suppresses rust pustule formation by competing for host surface nutrients."
  },
  {
    id: "DIS-003",
    crop: "Tomato / Potato",
    disease_name: "Late Blight (Phytophthora infestans)",
    pathogen_type: "Oomycete (Water Mold)",
    sample_image_url: "https://images.unsplash.com/photo-1592417817098-8f3d6ef23995?auto=format&fit=crop&w=600&q=80",
    visual_symptoms: "Water-soaked irregular pale green to dark brown oily lesions on leaf margins, expanding rapidly with a delicate downy white fungal bloom on undersides in cool humid weather.",
    severity: "High",
    regenerative_biological_treatment: "Apply bio-copper octanoate solution combined with aerated compost tea (ACT). Spray equisetum (horsetail herb) silica decoction every 5 days during cloudy humid windows.",
    preventive_soil_action: "Build high ridge earthing-up and apply a dense straw mulch barrier to prevent swimming zoospores from splashing from topsoil into potato tuber zones.",
    brics_indigenous_knowledge_note: "South African Permaculture Method: Sour whey spray (lactic acid bacteria 1:10 water dilution) lowers leaf cuticle pH to 4.5, neutralizing Phytophthora zoospore attachment."
  },
  {
    id: "DIS-004",
    crop: "Wheat",
    disease_name: "Wheat Stripe Rust / Yellow Rust (Puccinia striiformis)",
    pathogen_type: "Fungal (Macrocyclic Rust)",
    sample_image_url: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=600&q=80",
    visual_symptoms: "Parallel bright yellow-orange powdery pustules forming distinct continuous stripes along leaf veins, resulting in chlorotic leaf drying.",
    severity: "Moderate",
    regenerative_biological_treatment: "Foliar inoculation with Trichoderma harzianum suspension (5g/L) alongside fermented sour buttermilk spray (1:8 ratio) to degrade fungal chitin walls.",
    preventive_soil_action: "Seed priming with zinc-solubilizing biofertilizer and mycorrhizal inoculants (Glomus intraradices) to fortify vascular immunity before emergence.",
    brics_indigenous_knowledge_note: "China Loess Plateau Indigenous Practice: Interplanting with Chinese chives (Allium tuberosum) or wild allium borders produces sulfurous volatiles that disrupt airborne rust spore orientation."
  },
  {
    id: "DIS-005",
    crop: "Maize / Corn",
    disease_name: "Fall Armyworm Damage (Spodoptera frugiperda)",
    pathogen_type: "Pest Larvae (Noctuid Moth)",
    sample_image_url: "https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=600&q=80",
    visual_symptoms: "Ragged 'window-pane' feeding holes in the leaf whorl accompanied by coarse sawdust-like frass pellets; central shoot defoliation.",
    severity: "Critical",
    regenerative_biological_treatment: "Biological parasitoid release (Trichogramma pretiosum wasps, 50,000/ha). Apply entomopathogenic fungus Metarhizium rileyi or Bacillus thuringiensis (Bt subsp. kurstaki) directly into the leaf whorl.",
    preventive_soil_action: "Implement Push-Pull agroecology: intercrop maize with silverleaf desmodium (repels female moths and fixes nitrogen) and surround field borders with Napier grass as a trap plant.",
    brics_indigenous_knowledge_note: "Ethiopian Push-Pull Habitat System (ICIPE / EIAR): Planting Desmodium intortum between rows suppresses Armyworm infestation by 83% while eliminating Striga weed naturally."
  }
];
