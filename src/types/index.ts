export interface BlogPost {
  id: string;
  title: string;
  author: string;
  publishDate: string; // "YYYY-MM-DD"
  status: 'Published' | 'Draft';
  excerpt: string;
  content: string; // Can be markdown or simple text
  imageUrl: string;
  tags: string[];
}

export type Currency = 'PHP' | 'USD' | 'EUR';
