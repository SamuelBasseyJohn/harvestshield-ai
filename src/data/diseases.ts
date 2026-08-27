import { Disease } from '../types';

/**
 * Reference set covering the crops that matter most to Nigerian smallholders.
 * This is the library content and also the label space the classifier will
 * eventually map onto, so ids stay stable.
 */
export const DISEASES: Disease[] = [
  {
    id: 'cassava-mosaic',
    name: 'Cassava Mosaic Disease',
    crop: 'Cassava',
    abbreviation: 'CMD',
    severity: 'high',
    summary:
      'A whitefly-transmitted viral disease and the single largest cause of cassava yield loss across West Africa.',
    symptoms: [
      'Yellow and pale-green chlorotic mottling across the leaf blade',
      'Leaves distorted, twisted or reduced in size',
      'Stunted plants with visibly thin stems',
      'Severely reduced root formation at harvest',
    ],
    spreads:
      'Spread by whitefly (Bemisia tabaci) and by planting infected stem cuttings.',
    indicators: ['Chlorotic mottling', 'Leaf distortion', 'Reduced blade size'],
  },
  {
    id: 'cassava-brown-streak',
    name: 'Cassava Brown Streak Disease',
    crop: 'Cassava',
    abbreviation: 'CBSD',
    severity: 'high',
    summary:
      'A viral disease that damages the storage root itself, often with only mild symptoms visible on the leaves.',
    symptoms: [
      'Yellow chlorosis along secondary and tertiary leaf veins',
      'Brown streaks on young green stems',
      'Dry, corky necrosis inside the tuber',
    ],
    spreads: 'Transmitted by whitefly and by infected cuttings.',
    indicators: ['Vein chlorosis', 'Stem streaking'],
  },
  {
    id: 'cassava-bacterial-blight',
    name: 'Cassava Bacterial Blight',
    crop: 'Cassava',
    abbreviation: 'CBB',
    severity: 'moderate',
    summary:
      'A bacterial infection that spreads quickly in the wet season and can cause complete defoliation.',
    symptoms: [
      'Angular water-soaked spots between leaf veins',
      'Blighting and wilting of leaves',
      'Gum exudate on stems and petioles',
    ],
    spreads: 'Rain splash, contaminated tools and infected cuttings.',
    indicators: ['Angular leaf spots', 'Wilting'],
  },
  {
    id: 'maize-leaf-blight',
    name: 'Northern Corn Leaf Blight',
    crop: 'Maize',
    severity: 'moderate',
    summary:
      'A fungal disease producing long grey-green lesions that reduce photosynthetic area before grain fill.',
    symptoms: [
      'Cigar-shaped grey-green lesions running along the leaf',
      'Lesions turning tan and coalescing',
      'Lower leaves affected first',
    ],
    spreads: 'Fungal spores carried by wind and rain from crop residue.',
    indicators: ['Elongated lesions', 'Tan necrosis'],
  },
  {
    id: 'maize-streak',
    name: 'Maize Streak Virus',
    crop: 'Maize',
    abbreviation: 'MSV',
    severity: 'high',
    summary:
      'A leafhopper-transmitted virus that leaves distinctive pale streaks running the length of the leaf.',
    symptoms: [
      'Narrow, broken chlorotic streaks parallel to the veins',
      'Severe stunting when infection is early',
      'Poor or absent cob formation',
    ],
    spreads: 'Transmitted by Cicadulina leafhoppers.',
    indicators: ['Parallel chlorotic streaks', 'Stunting'],
  },
  {
    id: 'tomato-late-blight',
    name: 'Tomato Late Blight',
    crop: 'Tomato',
    severity: 'high',
    summary:
      'An aggressive oomycete disease that can destroy a tomato field within days under humid conditions.',
    symptoms: [
      'Dark water-soaked patches on leaves and stems',
      'White fungal growth on the leaf underside',
      'Firm brown lesions on fruit',
    ],
    spreads: 'Airborne sporangia, favoured by cool, wet, humid weather.',
    indicators: ['Water-soaked lesions', 'Leaf collapse'],
  },
  {
    id: 'tomato-leaf-curl',
    name: 'Tomato Yellow Leaf Curl',
    crop: 'Tomato',
    abbreviation: 'TYLCV',
    severity: 'high',
    summary:
      'A whitefly-borne virus causing upward curling and severe yield suppression in young plants.',
    symptoms: [
      'Upward curling and cupping of leaflets',
      'Yellowing of leaf margins',
      'Flower drop and stunted growth',
    ],
    spreads: 'Transmitted persistently by whitefly.',
    indicators: ['Upward leaf curl', 'Marginal yellowing'],
  },
  {
    id: 'cocoa-black-pod',
    name: 'Cocoa Black Pod',
    crop: 'Cocoa',
    severity: 'high',
    summary:
      'The most damaging cocoa disease in Nigeria, driven by Phytophthora species during the rains.',
    symptoms: [
      'Small brown spots on pods that spread rapidly',
      'Entire pod turning black and hard',
      'Dark lesions on leaves and stems near infected pods',
    ],
    spreads: 'Rain splash, ants and infected debris on the orchard floor.',
    indicators: ['Dark spreading lesions', 'Pod blackening'],
  },
  {
    id: 'yam-anthracnose',
    name: 'Yam Anthracnose',
    crop: 'Yam',
    severity: 'moderate',
    summary:
      'A fungal leaf and stem blight that reduces tuber size by cutting the vine canopy short.',
    symptoms: [
      'Dark brown to black sunken leaf spots',
      'Shot-holing as spot centres fall out',
      'Dieback of vines from the tip',
    ],
    spreads: 'Colletotrichum spores dispersed by rain splash.',
    indicators: ['Sunken dark spots', 'Vine dieback'],
  },
  {
    id: 'healthy',
    name: 'No disease detected',
    crop: 'Any',
    severity: 'low',
    summary: 'Leaf tissue is consistent with a healthy plant for this crop.',
    symptoms: [],
    spreads: '',
    indicators: ['Even pigmentation', 'Intact leaf margin', 'Regular vein pattern'],
  },
];

export const diseaseById = (id: string) => DISEASES.find(d => d.id === id);

export const CROPS = ['Cassava', 'Maize', 'Tomato', 'Cocoa', 'Yam'] as const;

export const libraryDiseases = DISEASES.filter(d => d.id !== 'healthy');
