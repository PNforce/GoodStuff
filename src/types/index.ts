export interface BookCollections {
  finance: string[];
  tech: string[];
  life: string[];
  survival: string[];
  uncategorized?: string[];
}

export interface HeroData {
  title: {
    prefix: string;
    highlight: string;
  };
  searchPlaceholders: string[];
  founder: {
    quote: string;
    quoteHighlight: string;
    image: string;
    label: string;
  };
}

export interface ArticlePreview {
  category: string;
  title: string;
  excerpt: string;
}

export interface NewsletterData {
  label: string;
  title: string;
  description: string;
}

export interface CaseStudyData {
  label: string;
  title: string;
  description: string;
}

export interface BentoGridData {
  header: {
    title: string;
    description: string;
    version: string;
  };
  blocks: {
    techHero: ArticlePreview;
    finance: ArticlePreview;
    life: ArticlePreview;
    survival: ArticlePreview;
    newsletter: NewsletterData;
    caseStudy: CaseStudyData;
  };
}

export interface LibraryData {
  title: string;
  subtitle: string;
}

export interface ProductData {
  id: string;
  title: string;
  subtitle: string;
  link: string;
  type: 'business' | 'life';
}

export interface BridgeData {
  problem: {
    title: string[];
    description: string[];
  };
  products: ProductData[];
}

export interface SiteData {
  books: BookCollections;
  hero: HeroData;
  bentoGrid: BentoGridData;
  library: LibraryData;
  bridge: BridgeData;
}

export interface SiteContent {
  siteName: string;
  version: string;
  hero: {
    titlePrefix: string;
    titleHighlight: string;
    searchPlaceholders: string[];
    founder: {
      quote: string;
      quoteHighlight: string;
      image: string;
      label: string;
    };
  };
  library: {
    title: string;
    subtitle: string;
  };
}

export interface CatalogCategory {
  id: string;
  label: string;
  order: number;
}

export interface CatalogBook {
  slug: string;
  title: string;
  category: string;
  summary: string;
  cover: string;
  bookJson: string;
  published: boolean;
  order: number;
  updatedAt: string;
}

export interface CatalogContent {
  version: string;
  categories: CatalogCategory[];
  books: CatalogBook[];
}

export interface AffiliateLink {
  label: string;
  url: string;
}

export interface ChapterContent {
  slug: string;
  title: string;
  summary: string;
  md: string;
  order: number;
  published: boolean;
}

export interface BookContent {
  slug: string;
  title: string;
  category: string;
  summary: string;
  cover: string;
  updatedAt: string;
  affiliateLinks: AffiliateLink[];
  chapters: ChapterContent[];
}

export interface HomeContent {
  site: SiteContent;
  catalog: CatalogContent;
  books: CatalogBook[];
}

export interface Article {
  slug: string;
  title: string;
  category: string;
  summary: string;
  content: string;
  seriesId: string;
  order: number;
  coverImage: string;
}
