import { 
  Restaurant, InsertRestaurant,
  MenuItem, InsertMenuItem,
  Order, InsertOrder,
  CATEGORIES
} from "@shared/schema";

export interface IStorage {
  // Restaurants
  getRestaurants(): Promise<Restaurant[]>;
  getRestaurantById(id: number): Promise<Restaurant | undefined>;
  createRestaurant(restaurant: InsertRestaurant): Promise<Restaurant>;
  
  // Menu Items
  getMenuItems(restaurantId: number): Promise<MenuItem[]>;
  getMenuItem(id: number): Promise<MenuItem | undefined>;
  createMenuItem(item: InsertMenuItem): Promise<MenuItem>;
  
  // Orders
  createOrder(order: InsertOrder): Promise<Order>;
  getOrder(id: number): Promise<Order | undefined>;
}

export class MemStorage implements IStorage {
  private restaurants: Map<number, Restaurant>;
  private menuItems: Map<number, MenuItem>;
  private orders: Map<number, Order>;
  private currentIds: {
    restaurant: number;
    menuItem: number;
    order: number;
  };

  constructor() {
    this.restaurants = new Map();
    this.menuItems = new Map();
    this.orders = new Map();
    this.currentIds = {
      restaurant: 1,
      menuItem: 1,
      order: 1
    };

    // Seed initial data
    this.seedData();
  }

  private seedData() {
    const restaurantImages = [
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4",
      "https://images.unsplash.com/photo-1497644083578-611b798c60f3",
      "https://images.unsplash.com/photo-1514933651103-005eec06c04b",
      "https://images.unsplash.com/photo-1494346480775-936a9f0d0877",
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0",
      "https://images.unsplash.com/photo-1474898856510-884a2c0be546"
    ];

    const foodImages = [
      "https://images.unsplash.com/photo-1563897539633-7374c276c212",
      "https://images.unsplash.com/photo-1564844536311-de546a28c87d",
      "https://images.unsplash.com/photo-1492683962492-deef0ec456c0",
      "https://images.unsplash.com/photo-1432139555190-58524dae6a55",
      "https://images.unsplash.com/photo-1560963805-6c64417e3413",
      "https://images.unsplash.com/photo-1560963689-02e82017fb3c"
    ];

    // Seed restaurants
    CATEGORIES.forEach((category, i) => {
      const restaurant: Restaurant = {
        id: i + 1,
        name: `${category} Place`,
        category,
        image: restaurantImages[i],
        rating: 4 + Math.random()
      };
      this.restaurants.set(restaurant.id, restaurant);
      this.currentIds.restaurant = i + 2;

      // Seed menu items for each restaurant
      for (let j = 0; j < 4; j++) {
        const menuItem: MenuItem = {
          id: (i * 4) + j + 1,
          restaurantId: restaurant.id,
          name: `${category} Dish ${j + 1}`,
          description: "A delicious dish made with fresh ingredients",
          price: 10 + Math.floor(Math.random() * 20),
          image: foodImages[Math.floor(Math.random() * foodImages.length)]
        };
        this.menuItems.set(menuItem.id, menuItem);
        this.currentIds.menuItem = menuItem.id + 1;
      }
    });
  }

  // Restaurant methods
  async getRestaurants(): Promise<Restaurant[]> {
    return Array.from(this.restaurants.values());
  }

  async getRestaurantById(id: number): Promise<Restaurant | undefined> {
    return this.restaurants.get(id);
  }

  async createRestaurant(restaurant: InsertRestaurant): Promise<Restaurant> {
    const id = this.currentIds.restaurant++;
    const newRestaurant = { ...restaurant, id };
    this.restaurants.set(id, newRestaurant);
    return newRestaurant;
  }

  // Menu Item methods
  async getMenuItems(restaurantId: number): Promise<MenuItem[]> {
    return Array.from(this.menuItems.values())
      .filter(item => item.restaurantId === restaurantId);
  }

  async getMenuItem(id: number): Promise<MenuItem | undefined> {
    return this.menuItems.get(id);
  }

  async createMenuItem(item: InsertMenuItem): Promise<MenuItem> {
    const id = this.currentIds.menuItem++;
    const newItem = { ...item, id };
    this.menuItems.set(id, newItem);
    return newItem;
  }

  // Order methods
  async createOrder(order: InsertOrder): Promise<Order> {
    const id = this.currentIds.order++;
    const newOrder = { ...order, id };
    this.orders.set(id, newOrder);
    return newOrder;
  }

  async getOrder(id: number): Promise<Order | undefined> {
    return this.orders.get(id);
  }
}

export const storage = new MemStorage();
