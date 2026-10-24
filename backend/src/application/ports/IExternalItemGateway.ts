export interface ExternalItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  suggestedPrice: number;
  attributes: Record<string, unknown>;
}

export interface IExternalItemGateway {
  searchItems(query?: string): Promise<ExternalItem[]>;
  getItemById(id: string): Promise<ExternalItem | null>;
}
