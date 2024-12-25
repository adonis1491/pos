// Separate file for fallback image management
const fallbackImages = {
  'Hot Coffee': 'https://images.unsplash.com/photo-1509785307050-d4066910ec1e?auto=format&fit=crop&w=400',
  'Cold Coffee': 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=400',
  'Frappuccino': 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=400',
  'Bakery': 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=400',
  'Tea': 'https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?auto=format&fit=crop&w=400'
};

export const getFallbackImage = (category: string): string => {
  return fallbackImages[category] || fallbackImages['Hot Coffee'];
};