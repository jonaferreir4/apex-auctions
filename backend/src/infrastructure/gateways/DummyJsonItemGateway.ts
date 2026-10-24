import axios from 'axios';
import { ExternalItem, IExternalItemGateway } from '../../application/ports/IExternalItemGateway';

const FALLBACK_ITEMS: ExternalItem[] = [
  {
    id: 'art-001',
    title: 'Pintura Óleo sobre Tela: "Noite Estrelada no Vale"',
    description: 'Obra de arte impressionista original em moldura de madeira nobre talhada à mão.',
    imageUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&auto=format&fit=crop&q=80',
    category: 'Obras de Arte',
    suggestedPrice: 2500,
    attributes: { artista: 'Émile Laurent', ano: 1924, tecnica: 'Óleo sobre Tela', dimensoes: '80x60cm' }
  },
  {
    id: 'watch-002',
    title: 'Relógio Cronógrafo Suíço Vintage 1968',
    description: 'Peça de alta relojoaria com mecanismo mecânico automático em ouro 18k e pulseira em couro legítimo.',
    imageUrl: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&auto=format&fit=crop&q=80',
    category: 'Relógios & Joias',
    suggestedPrice: 4800,
    attributes: { marca: 'Geneva Horology', calibre: 'Cal. 321', material: 'Ouro 18k', estojoOriginal: 'Sim' }
  },
  {
    id: 'car-003',
    title: 'Miniatura Rara Shelby Cobra 427 S/C (1:18)',
    description: 'Edição limitada comemorativa de colecionador com certificado de autenticidade numerado.',
    imageUrl: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&auto=format&fit=crop&q=80',
    category: 'Colecionáveis',
    suggestedPrice: 850,
    attributes: { escala: '1:18', edicao: '342/1000', acabamento: 'Pintura Guardsman Blue' }
  },
  {
    id: 'book-004',
    title: 'Primeira Edição: Dom Casmurro (1899)',
    description: 'Exemplar histórico encadernado em couro com carimbo de primeira tiragem da Livraria Garnier.',
    imageUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&auto=format&fit=crop&q=80',
    category: 'Livros Raros',
    suggestedPrice: 3200,
    attributes: { autor: 'Machado de Assis', anoPublicacao: 1899, conservacao: 'Excelente' }
  },
  {
    id: 'music-005',
    title: 'Vinil The Dark Side of the Moon - Edição Japonesa Original',
    description: 'Prensagem audiófila com OBI intacto, encarte duplo e pôsteres promocionais originais de 1973.',
    imageUrl: 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?w=800&auto=format&fit=crop&q=80',
    category: 'Discos & Música',
    suggestedPrice: 1100,
    attributes: { selo: 'Harvest / Toshiba-EMI', rotulo: 'EMS-80324', estadoMidia: 'Mint' }
  }
];

export class DummyJsonItemGateway implements IExternalItemGateway {
  private apiUrl = 'https://dummyjson.com/products';

  async searchItems(query?: string): Promise<ExternalItem[]> {
    try {
      const url = query && query.trim() !== ''
        ? `${this.apiUrl}/search?q=${encodeURIComponent(query)}&limit=16`
        : `${this.apiUrl}?limit=16`;

      const response = await axios.get(url, { timeout: 4000 });
      const products = response.data?.products || [];

      if (products.length === 0) {
        return this.filterFallbackItems(query);
      }

      return products.map((item: any) => ({
        id: `ext-${item.id}`,
        title: item.title,
        description: item.description,
        imageUrl: item.thumbnail || (item.images && item.images[0]) || FALLBACK_ITEMS[0].imageUrl,
        category: item.category || 'Geral',
        suggestedPrice: Math.round(item.price * 5.2),
        attributes: {
          brand: item.brand || 'Colecionador',
          rating: item.rating,
          stock: item.stock,
          tags: item.tags || []
        }
      }));
    } catch {
      return this.filterFallbackItems(query);
    }
  }

  async getItemById(id: string): Promise<ExternalItem | null> {
    const fallback = FALLBACK_ITEMS.find(item => item.id === id);
    if (fallback) return fallback;

    if (id.startsWith('ext-')) {
      const rawId = id.replace('ext-', '');
      try {
        const response = await axios.get(`${this.apiUrl}/${rawId}`, { timeout: 4000 });
        const item = response.data;
        return {
          id: `ext-${item.id}`,
          title: item.title,
          description: item.description,
          imageUrl: item.thumbnail || (item.images && item.images[0]) || FALLBACK_ITEMS[0].imageUrl,
          category: item.category || 'Geral',
          suggestedPrice: Math.round(item.price * 5.2),
          attributes: {
            brand: item.brand,
            rating: item.rating,
            stock: item.stock
          }
        };
      } catch {
        return null;
      }
    }

    return null;
  }

  private filterFallbackItems(query?: string): ExternalItem[] {
    if (!query || query.trim() === '') {
      return FALLBACK_ITEMS;
    }
    const q = query.toLowerCase();
    return FALLBACK_ITEMS.filter(
      item =>
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
    );
  }
}
