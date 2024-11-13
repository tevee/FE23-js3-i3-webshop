import { faker } from '@faker-js/faker';
import { ClothingProduct } from '../types/types';

function createClothingProduct(): ClothingProduct {
    const categories: string[] = ['Men', 'Women', 'Unisex'];
    const sizes: string[] = ['S', 'M', 'L', 'XL', 'XXL'];
    const clothingTypes: string[] = ['T-shirt', 'Jeans', 'Sweater', 'Jacket', 'Shirt', 'Dress', 'Shorts', 'Coat', 'Blouse', 'Hoodie'];

    const id = faker.string.nanoid();
    const clothingType = clothingTypes[Math.floor(Math.random() * clothingTypes.length)];
    const brand = faker.company.name();
    const name = `${brand} ${clothingType}`;
    const category: string = categories[Math.floor(Math.random() * categories.length)];
    const size: string = sizes[Math.floor(Math.random() * sizes.length)];
    const price: string = `${faker.commerce.price({min: 200, max: 1000, dec: 0})}`;
    const valuta: string = 'SEK';
    const description: string = `${faker.commerce.productAdjective()} and stylish, perfect for everyday wear. Made from high-quality fabric.`;
    const imgUrl: string = faker.image.urlLoremFlickr({ width: 600, height: 400, category: `${clothingType}` });
    const quantity = 1;
    
    return {
      id,
      name,
      category,
      size,
      price,
      valuta,
      description,
      clothingType,
      imgUrl,
      quantity
    };
}

export default Array.from({length: 10}, createClothingProduct);