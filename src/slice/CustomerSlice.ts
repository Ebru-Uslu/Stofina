
import { Customer } from '@/types/customer';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CustomerSlice {
    isLoading: boolean;
    customers: Customer[]; // Customer bilgisi null olabilir, çünkü müşteri henüz eklenmemiş olabilir
    selectedCustomer: Customer | null;

}

const initialState: CustomerSlice = {
    isLoading: false,
    customers: [], // Başlangıçta müşteri bilgisi yok
    selectedCustomer: null,

};

export const SliceCustomer = createSlice({
    name: 'customer',
    initialState,
    reducers: {
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        setCustomer: (state, action: PayloadAction<Customer[]>) => {
            state.customers = action.payload; // Müşteri bilgisi güncelleniyor
        },
        setSelectedCustomer: (state, action: PayloadAction<Customer | null>) => {
            state.selectedCustomer = action.payload; // Seçili müşteri bilgisi güncelleniyor
        },

    },
});

export const { setLoading, setCustomer, setSelectedCustomer } = SliceCustomer.actions;
export const { actions, reducer } = SliceCustomer;
export default SliceCustomer.reducer;
