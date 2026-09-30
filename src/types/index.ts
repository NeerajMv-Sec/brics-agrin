export interface BricsNode {
  id: string;
  country: string;
  parent_country?: string;
  iso: string;
  region: string;
  flag: string;
  coordinates: { lat: number; lon: number };
  soil_type: string;
  primary_crops: string[];
  climate_zone: string;
  priority_challenge: string;
  partner_institute: string;
  elevation_m: number;
}

export interface NodeTelemetry {
  satellite: {
    ndvi: number;
    ndvi_status: string;
    ndwi: number;
    ndwi_status: string;
    surface_temperature_c: number;
    canopy_cover_pct: number;
    sensor: string;
    last_pass: string;
  };
  soil: {
    ph: number;
    organic_carbon_pct: number;
    nitrogen_kg_ha: number;
    phosphorus_kg_ha: number;
    potassium_kg_ha: number;
    moisture_pct: number;
    microbial_activity_score: number;
    bulk_density_g_cm3: number;
  };
  weather: {
    temp_c: number;
    humidity_pct: number;
    forecast_summary: string;
    rainfall_7d_mm: number;
    wind_kmh: number;
    evapotranspiration_mm_day: number;
    solar_radiation_mj_m2: number;
  };
}

export interface RegenerativeSoilAction {
  practice: string;
  dosage_or_method: string;
  expected_carbon_gain: string;
}

export interface AdvisoryResult {
  executive_summary: string;
  recommended_crop_rotation: string[];
  regenerative_soil_actions: RegenerativeSoilAction[];
  water_and_climate_strategy: string;
  bio_inputs_and_compost_recipe: string;
  cross_border_brics_model_match: string;
  estimated_carbon_offset_tco2e: number;
}

export interface CropDisease {
  id: string;
  crop: string;
  disease_name: string;
  pathogen_type: string;
  sample_image_url: string;
  visual_symptoms: string;
  severity: "Low" | "Moderate" | "High" | "Critical";
  regenerative_biological_treatment: string;
  preventive_soil_action: string;
  brics_indigenous_knowledge_note: string;
}

export interface DiagnosisResult {
  disease_name: string;
  confidence_pct: number;
  severity_level: "Low" | "Moderate" | "High" | "Critical";
  pathogen_type: string;
  diagnostic_markers: string[];
  immediate_regenerative_remedy: string;
  preventive_soil_and_canopy_protocol: string;
  brics_indigenous_knowledge_note: string;
}

export interface RegenerativeModel {
  model_id: string;
  title: string;
  origin_country: string;
  partner_institute: string;
  applicable_regions: string[];
  carbon_sequestration_potential: string;
  water_efficiency_gain: string;
  core_principles: string[];
  soil_recovery_trajectory: string;
  status: string;
  synced_at?: string;
}
