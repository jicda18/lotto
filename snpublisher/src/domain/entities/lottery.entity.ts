export interface Lottery {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
  location: string | null;
  createdAt: Date;
  deletedAt: Date | null;
}
