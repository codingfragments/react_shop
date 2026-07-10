import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
	id: number;
	name: string;
	slug: string;
	category_slug: string;
	price: number;
	quantity: number;
	image_path?: string;
	in_stock: boolean;
	stock_quantity: number;
}

interface CartState {
	items: CartItem[];
	total: number;
	itemCount: number;
	addItem: (product: Omit<CartItem, 'quantity'>, quantity?: number) => void;
	updateQuantity: (productId: number, quantity: number) => void;
	removeItem: (productId: number) => void;
	clearCart: () => void;
	isInCart: (productId: number) => boolean;
	getItemQuantity: (productId: number) => number;
}

function calculateTotals(items: CartItem[]): Pick<CartState, 'total' | 'itemCount'> {
	const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
	const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
	return { total, itemCount };
}

export const useCartStore = create<CartState>()(
	persist(
		(set, get) => ({
			items: [],
			total: 0,
			itemCount: 0,

			addItem: (product, quantity = 1) => {
				set((state) => {
					const items = [...state.items];
					const existingItemIndex = items.findIndex((item) => item.id === product.id);

					if (existingItemIndex >= 0) {
						const existingItem = items[existingItemIndex];
						const newQuantity = Math.min(existingItem.quantity + quantity, product.stock_quantity);
						items[existingItemIndex] = { ...existingItem, quantity: newQuantity };
					} else {
						const newQuantity = Math.min(quantity, product.stock_quantity);
						items.push({ ...product, quantity: newQuantity });
					}

					return { items, ...calculateTotals(items) };
				});
			},

			updateQuantity: (productId, quantity) => {
				set((state) => {
					const items = [...state.items];
					const itemIndex = items.findIndex((item) => item.id === productId);
					if (itemIndex >= 0) {
						const item = items[itemIndex];
						const newQuantity = Math.max(0, Math.min(quantity, item.stock_quantity));

						if (newQuantity === 0) {
							items.splice(itemIndex, 1);
						} else {
							items[itemIndex] = { ...item, quantity: newQuantity };
						}
					}

					return { items, ...calculateTotals(items) };
				});
			},

			removeItem: (productId) => {
				set((state) => {
					const items = state.items.filter((item) => item.id !== productId);
					return { items, ...calculateTotals(items) };
				});
			},

			clearCart: () => {
				set({ items: [], total: 0, itemCount: 0 });
			},

			isInCart: (productId) => {
				return get().items.some((item) => item.id === productId);
			},

			getItemQuantity: (productId) => {
				const item = get().items.find((item) => item.id === productId);
				return item?.quantity || 0;
			}
		}),
		{
			name: 'keycraft-cart',
			partialize: (state) => ({ items: state.items, total: state.total, itemCount: state.itemCount })
		}
	)
);
