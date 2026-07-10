import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ShippingAddress {
	firstName: string;
	lastName: string;
	email: string;
	phone: string;
	address1: string;
	address2?: string;
	city: string;
	state: string;
	zipCode: string;
	country: string;
}

export interface BillingAddress extends ShippingAddress {
	sameAsShipping: boolean;
}

export interface PaymentInfo {
	cardNumber: string;
	expiryMonth: string;
	expiryYear: string;
	cvv: string;
	cardholderName: string;
}

export interface CheckoutState {
	currentStep: number;
	shippingAddress: Partial<ShippingAddress>;
	billingAddress: Partial<BillingAddress>;
	paymentInfo: Partial<PaymentInfo>;
	shippingMethod: string;
	orderNotes: string;
	agreedToTerms: boolean;
	completed: boolean;
	setStep: (step: number) => void;
	updateShippingAddress: (address: Partial<ShippingAddress>) => void;
	updateBillingAddress: (address: Partial<BillingAddress>) => void;
	updatePaymentInfo: (payment: Partial<PaymentInfo>) => void;
	setShippingMethod: (method: string) => void;
	setOrderNotes: (notes: string) => void;
	setAgreedToTerms: (agreed: boolean) => void;
	completeCheckout: () => void;
	reset: () => void;
}

const initialState = {
	currentStep: 1,
	shippingAddress: {},
	billingAddress: { sameAsShipping: true },
	paymentInfo: {},
	shippingMethod: 'standard',
	orderNotes: '',
	agreedToTerms: false,
	completed: false
};

export const useCheckoutStore = create<CheckoutState>()(
	persist(
		(set) => ({
			...initialState,

			setStep: (step) => set({ currentStep: step }),

			updateShippingAddress: (address) =>
				set((state) => ({ shippingAddress: { ...state.shippingAddress, ...address } })),

			updateBillingAddress: (address) =>
				set((state) => ({ billingAddress: { ...state.billingAddress, ...address } })),

			updatePaymentInfo: (payment) =>
				set((state) => ({ paymentInfo: { ...state.paymentInfo, ...payment } })),

			setShippingMethod: (method) => set({ shippingMethod: method }),

			setOrderNotes: (notes) => set({ orderNotes: notes }),

			setAgreedToTerms: (agreed) => set({ agreedToTerms: agreed }),

			completeCheckout: () => set({ completed: true }),

			reset: () => set(initialState)
		}),
		{ name: 'keycraft-checkout' }
	)
);
