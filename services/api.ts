import { Product } from '@/algorithms/types';

const API_URL = 'https://api.mercadolibre.com/sites/MLB/search';

// Fallback mock data caso a API falhe
const mockProducts: Product[] = [
  { id: '1', title: 'Notebook Dell Inspiron 15', price: 3499.99, sold_quantity: 150, available_quantity: 25 },
  { id: '2', title: 'Notebook Lenovo IdeaPad 3', price: 2899.00, sold_quantity: 320, available_quantity: 40 },
  { id: '3', title: 'MacBook Air M2', price: 9999.00, sold_quantity: 85, available_quantity: 12 },
  { id: '4', title: 'Notebook ASUS Vivobook', price: 2599.99, sold_quantity: 200, available_quantity: 55 },
  { id: '5', title: 'HP Pavilion Gaming', price: 4299.00, sold_quantity: 110, available_quantity: 18 },
  { id: '6', title: 'Acer Aspire 5', price: 2199.00, sold_quantity: 450, available_quantity: 80 },
  { id: '7', title: 'Samsung Book', price: 2799.99, sold_quantity: 95, available_quantity: 30 },
  { id: '8', title: 'Notebook Positivo Motion', price: 1599.00, sold_quantity: 600, available_quantity: 100 },
  { id: '9', title: 'MacBook Pro 14 M3', price: 18999.00, sold_quantity: 42, available_quantity: 8 },
  { id: '10', title: 'Notebook Vaio FE14', price: 3199.00, sold_quantity: 75, available_quantity: 22 },
  { id: '11', title: 'Dell G15 Gaming', price: 5499.00, sold_quantity: 130, available_quantity: 15 },
  { id: '12', title: 'Lenovo Legion 5', price: 6999.00, sold_quantity: 88, available_quantity: 10 },
  { id: '13', title: 'ASUS ROG Strix', price: 8499.00, sold_quantity: 55, available_quantity: 7 },
  { id: '14', title: 'HP Envy x360', price: 4599.00, sold_quantity: 140, available_quantity: 28 },
  { id: '15', title: 'Acer Nitro 5', price: 4199.00, sold_quantity: 220, available_quantity: 35 },
  { id: '16', title: 'MSI Modern 14', price: 3799.00, sold_quantity: 65, available_quantity: 20 },
  { id: '17', title: 'Notebook Multilaser Legacy', price: 1299.00, sold_quantity: 800, available_quantity: 150 },
  { id: '18', title: 'ThinkPad E14', price: 4899.00, sold_quantity: 95, available_quantity: 14 },
  { id: '19', title: 'MacBook Pro 16 M3 Max', price: 29999.00, sold_quantity: 18, available_quantity: 3 },
  { id: '20', title: 'Surface Laptop 5', price: 7499.00, sold_quantity: 48, available_quantity: 9 },
  { id: '21', title: 'Notebook Compaq Presario', price: 1899.00, sold_quantity: 350, available_quantity: 60 },
  { id: '22', title: 'ASUS Zenbook 14', price: 5999.00, sold_quantity: 72, available_quantity: 16 },
  { id: '23', title: 'HP Victus Gaming', price: 4799.00, sold_quantity: 105, available_quantity: 19 },
  { id: '24', title: 'Lenovo Yoga 7i', price: 5499.00, sold_quantity: 62, available_quantity: 11 },
  { id: '25', title: 'Dell XPS 13', price: 8999.00, sold_quantity: 38, available_quantity: 6 },
  { id: '26', title: 'Notebook Samsung Galaxy Book3', price: 4299.00, sold_quantity: 82, available_quantity: 17 },
  { id: '27', title: 'Acer Swift 3', price: 3599.00, sold_quantity: 115, available_quantity: 24 },
  { id: '28', title: 'HP 250 G9', price: 2299.00, sold_quantity: 280, available_quantity: 45 },
  { id: '29', title: 'Lenovo V15', price: 2099.00, sold_quantity: 195, available_quantity: 38 },
  { id: '30', title: 'ASUS TUF Gaming', price: 5299.00, sold_quantity: 160, available_quantity: 21 },
];

export async function fetchProducts(query: string = 'notebook', limit: number = 50): Promise<Product[]> {
  try {
    const response = await fetch(`${API_URL}?q=${encodeURIComponent(query)}&limit=${limit}`);
    
    if (!response.ok) {
      throw new Error('Falha na API');
    }

    const data = await response.json();
    
    const products: Product[] = data.results.map((item: Record<string, unknown>) => ({
      id: item.id as string,
      title: item.title as string,
      price: item.price as number,
      sold_quantity: (item.sold_quantity as number) || 0,
      available_quantity: (item.available_quantity as number) || 0,
    }));

    return products;
  } catch (error) {
    console.warn('Usando dados mock devido a falha na API:', error);
    return mockProducts.slice(0, limit);
  }
}
