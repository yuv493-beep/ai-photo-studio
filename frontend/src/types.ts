export enum EditType {
  Ecommerce = 'E-Commerce',
  Catalog = 'Catalog / Lookbook',
  SocialMedia = 'Social Media',
  Advertising = 'Advertising / Campaign',
}

export const EDIT_TYPE_DETAILS: Record<EditType, { title: string; description: string }> = {
  [EditType.Ecommerce]: {
    title: 'E-Commerce',
    description: 'Clear, white/neutral background, all angles.',
  },
  [EditType.Catalog]: {
    title: 'Catalog / Lookbook',
    description: 'Storytelling, lifestyle, styled shots.',
  },
  [EditType.SocialMedia]: {
    title: 'Social Media',
    description: 'Creative, engaging, behind-the-scenes, UGC-style.',
  },
  [EditType.Advertising]: {
    title: 'Advertising / Campaign',
    description: 'High-impact, aspirational, hero visuals.',
  },
};

export enum ImageCountOption {
  Basic = 'Basic',
  Standard = 'Standard',
  Premium = 'Premium',
}

export const IMAGE_COUNT_DETAILS: Record<ImageCountOption, { title: string; count: string }> = {
  [ImageCountOption.Basic]: {
    title: 'Basic',
    count: '6 images',
  },
  [ImageCountOption.Standard]: {
    title: 'Standard',
    count: '8-10 images',
  },
  [ImageCountOption.Premium]: {
    title: 'Premium',
    count: '12-15 images',
  },
};

export interface GeneratedImage {
  src: string;
  alt: string;
}

export interface GenerationHistoryItem {
  id: string;
  timestamp: string;
  theme: string;
  images: GeneratedImage[];
  originalImageBase64: string;
}

export const productCategories = [
  'Fashion & Apparel',
  'Shoes & Footwear',
  'Jewelry & Accessories',
  'Beauty & Cosmetics',
  'Electronics & Gadgets',
  'Home & Furniture',
  'Food & Beverages',
  'Bags & Luggage',
  'Toys & Kids’ Products',
  'Sports & Fitness Gear',
  'Other',
] as const;

export type ProductCategory = typeof productCategories[number];


export enum Plan {
    Starter = 'Starter',
    Pro = 'Pro',
    Business = 'Business',
    Enterprise = 'Enterprise',
}

export const PLAN_DETAILS: Record<Plan, { name: Plan; price: string; credits: number; features: string[]; isFeatured?: boolean }> = {
    [Plan.Starter]: {
        name: Plan.Starter,
        price: 'Free',
        credits: 5,
        features: [
            '5 image generations (one-time)',
            'E-Commerce style only',
            'Standard quality output',
            'Community support'
        ],
    },
    [Plan.Pro]: {
        name: Plan.Pro,
        price: '₹1,999',
        credits: 50,
        features: [
            '50 image generations per month',
            'All image styles included',
            'High-quality output',
            'Priority email support',
            'Commercial usage rights'
        ],
        isFeatured: true,
    },
    [Plan.Business]: {
        name: Plan.Business,
        price: '₹4,999',
        credits: 200,
        features: [
            '200 image generations per month',
            'All image styles included',
            'High-quality output',
            'Team collaboration (up to 5 seats)',
            'Priority email & chat support',
            'Commercial usage rights'
        ],
    },
    [Plan.Enterprise]: {
        name: Plan.Enterprise,
        price: 'Custom',
        credits: -1, // Using -1 to represent unlimited
        features: [
            'Unlimited image generations',
            'Custom model training',
            'Advanced team collaboration',
            'Dedicated account manager',
            'API access & support',
        ],
    },
};

export interface CreditPack {
    name: string;
    credits: number;
    price: number;
    pricePerCredit: string;
    isFeatured?: boolean;
}

export const CREDIT_PACK_DETAILS: CreditPack[] = [
    {
        name: 'Refill',
        credits: 50,
        price: 500,
        pricePerCredit: '₹10 / credit'
    },
    {
        name: 'Creator',
        credits: 150,
        price: 1200,
        pricePerCredit: '₹8 / credit',
        isFeatured: true,
    },
    {
        name: 'Agency',
        credits: 500,
        price: 3000,
        pricePerCredit: '₹6 / credit'
    }
];

export interface PaymentHistoryItem {
  id: string;
  date: string; // ISO string
  description: string;
  amount: string;
}
