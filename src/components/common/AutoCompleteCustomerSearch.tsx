"use client"
import { useDispatchCustom } from '@/hooks/useDispatchCustom';
import { SliceCustomer } from '@/slice/CustomerSlice';
import { Customer } from '@/types/customer';
import React from 'react'
import { useState, useEffect } from "react";
import Image from 'next/image';
import { customerType } from '@/constants/customerType';

//TODO: Type klasöründe tanımlanacak


const mockCustomers: Customer[] = [
    {
        id: 1,
        name: 'Ahmet Yılmaz',
        email: 'ahmet.yilmaz@example.com',
        createdAt: new Date('2024-01-10T09:00:00Z'),
        updatedAt: new Date('2024-06-15T12:00:00Z'),
        accountNumber: 'TR12345678901',
        tckn: '12345678901',
        customerType: customerType.BIREYSEL,
    },
    {
        id: 2,
        name: 'Zeynep Korkmaz',
        email: 'zeynep.korkmaz@example.com',
        createdAt: new Date('2024-02-11T10:30:00Z'),
        updatedAt: new Date('2024-06-20T09:15:00Z'),
        accountNumber: 'TR98765432109',
        tckn: '10987654321',
        customerType: customerType.KURUMSAL,
    },
    {
        id: 3,
        name: 'Mehmet Demir',
        email: 'mehmet.demir@example.com',
        createdAt: new Date('2024-03-12T11:15:00Z'),
        updatedAt: new Date('2024-06-18T14:20:00Z'),
        accountNumber: 'TR11223344556',
        tckn: '56789012345',
        customerType: customerType.BIREYSEL,
    },
    {
        id: 4,
        name: 'Elif Yıldız',
        email: 'elif.yildiz@example.com',
        createdAt: new Date('2024-04-13T12:45:00Z'),
        updatedAt: new Date('2024-06-25T16:00:00Z'),
        accountNumber: 'TR45678912365',
        tckn: '65432109876',
        customerType: customerType.KURUMSAL,
    },
    {
        id: 5,
        name: 'Burcu Aydın',
        email: 'burcu.aydin@example.com',
        createdAt: new Date('2024-01-22T09:00:00Z'),
        updatedAt: new Date('2024-07-01T10:00:00Z'),
        accountNumber: 'TR32165498745',
        tckn: '34567890123',
        customerType: customerType.BIREYSEL,
    },
    {
        id: 6,
        name: 'Emre Şahin',
        email: 'emre.sahin@example.com',
        createdAt: new Date('2024-02-28T15:30:00Z'),
        updatedAt: new Date('2024-07-10T09:45:00Z'),
        accountNumber: 'TR15935748623',
        tckn: '23456789012',
        customerType: customerType.KURUMSAL,
    },
    {
        id: 7,
        name: 'Cem Kara',
        email: 'cem.kara@example.com',
        createdAt: new Date('2024-03-05T08:15:00Z'),
        updatedAt: new Date('2024-07-12T11:30:00Z'),
        accountNumber: 'TR75395145601',
        tckn: '87654321098',
        customerType: customerType.BIREYSEL,
    },
    {
        id: 8,
        name: 'Fatma Koç',
        email: 'fatma.koc@example.com',
        createdAt: new Date('2024-04-19T14:00:00Z'),
        updatedAt: new Date('2024-07-15T13:00:00Z'),
        accountNumber: 'TR14725836911',
        tckn: '54321098765',
        customerType: customerType.KURUMSAL,
    },
    {
        id: 9,
        name: 'Hakan Tuncel',
        email: 'hakan.tuncel@example.com',
        createdAt: new Date('2024-05-21T10:10:00Z'),
        updatedAt: new Date('2024-07-20T12:30:00Z'),
        accountNumber: 'TR36925814777',
        tckn: '32109876543',
        customerType: customerType.BIREYSEL,
    },
    {
        id: 10,
        name: 'Leyla Özkan',
        email: 'leyla.ozkan@example.com',
        createdAt: new Date('2024-06-01T09:00:00Z'),
        updatedAt: new Date('2024-07-22T14:45:00Z'),
        accountNumber: 'TR95175345688',
        tckn: '21098765432',
        customerType: customerType.BIREYSEL,
    },
];

const AutoCompleteCustomerSearch = () => {
    const dispatch = useDispatchCustom();

    // Customer type selection state
    const [selectedType, setSelectedType] = useState<string>(customerType.BIREYSEL);
    const [query, setQuery] = useState('');
    const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);

    const [showDropdown, setShowDropdown] = useState(false);


    useEffect(() => { // arama yaparken 
        if (query.length < 2) {
            setFilteredCustomers([]);
            setShowDropdown(false);
            return;
        }
        const filteredCustomersByType = mockCustomers.filter((c) => c.customerType === selectedType);
        const filtered = filteredCustomersByType.filter((c) => // arama yaparken müşteri filtreleme
            c.name.toLowerCase().includes(query.toLowerCase()) ||
            c.accountNumber.includes(query)

        );

        setFilteredCustomers(filtered);
        setShowDropdown(true);
    }, [query, selectedType]);

    const handleCustomerSelect = (customer: Customer) => { // müşteri seçildiğinde
        dispatch(SliceCustomer.actions.setSelectedCustomer(customer));
        setQuery('Müşteri Adı/Ticaret Unvanı: ' + customer.name);
        setShowDropdown(false);
        setFilteredCustomers([]);
    };

    const handleClearInput = () => { // arama kutusunu temizlediğinde
        setQuery('');
        dispatch(SliceCustomer.actions.setSelectedCustomer(null));
        setShowDropdown(false);
        setFilteredCustomers([]);
    };

    return (
        <div className=" min-w-4xl ">
            <div className="max-w-3xl mx-auto">
                {/* Customer Type Toggle */}
                <div className="mb-6">
                    <div className="relative inline-flex bg-gray-100 rounded-lg p-1 w-full max-w-md ">
                        <button
                            type="button"
                            onClick={() => setSelectedType(customerType.BIREYSEL)}
                            className={`flex-1 cursor-pointer px-4 py-2 text-sm font-semibold rounded-md transition-all duration-200 flex items-center justify-center gap-2 ${selectedType === customerType.BIREYSEL
                                ? 'bg-white text-[#813FB4] shadow-sm border border-gray-200'
                                : 'text-gray-600 hover:text-gray-800'
                                }`}
                        >
                            <Image
                                src="/assets/icons/user.png"
                                alt="User"
                                width={16}
                                height={16}
                                className="w-4 h-4"
                            />  Bireysel</button>

                        <button
                            type="button"
                            onClick={() => setSelectedType(customerType.KURUMSAL)}
                            className={`flex-1 cursor-pointer px-4 py-2 text-sm font-semibold rounded-md transition-all duration-200 flex items-center justify-center gap-2 ${selectedType === customerType.KURUMSAL
                                ? 'bg-white font-bold text-[#813FB4] shadow-sm border border-gray-200'
                                : 'text-gray-600 hover:text-gray-800'
                                }`}
                        >
                            <Image
                                src="/assets/icons/corporation.png"
                                alt="Corporation"
                                width={16}
                                height={16}
                                className="w-4 h-4"
                            />Kurumsal</button>
                    </div>
                </div>

                <div className="relative">
                    <div className="relative">
                        <svg className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${customerType ? 'text-gray-400' : 'text-gray-300'
                            }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input // arama kutusu
                            type="text"
                            placeholder={customerType ? "İsim veya hesap numarası girin." : "Önce müşteri tipi seçin..."}
                            value={query}
                            disabled={!customerType}
                            onChange={(e) => {
                                setQuery(e.target.value);
                                dispatch(SliceCustomer.actions.setSelectedCustomer(null))
                            }}
                            className={`w-full pl-10 pr-10 py-1.5 rounded-md border transition-all duration-200 text-sm ${customerType
                                ? 'border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#813FB4] bg-white text-gray-900'
                                : 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
                                }`}
                        />
                        {query && ( // arama kutusunu temizle butonu
                            <button
                                onClick={handleClearInput}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                                type="button"
                            >
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        )}
                    </div>

                    {showDropdown && filteredCustomers.length > 0 && ( // dropdown menü
                        <ul className="absolute z-10 w-full mt-2 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                            {filteredCustomers.map((customer, index) => (
                                <li
                                    key={customer.id}
                                    className={`px-4 py-2 hover:bg-blue-100 cursor-pointer text-sm ${index % 2 === 0 ? 'bg-[#813FB4]/10' : 'bg-white'}`}
                                    onClick={() => handleCustomerSelect(customer)}
                                >
                                    <div className="grid grid-cols-4 ">
                                        <div className="flex col-span-2 gap-2">
                                            <span className="font-semibold text-gray-900 text-sm">Müşteri Adı / Ticaret Unvanı:</span>
                                            <span className="text-gray-700 truncate">{customer.name}</span>
                                        </div>

                                        <div className="flex gap-2">
                                            <span className="font-semibold text-gray-900 text-sm">Hesap No:</span>
                                            <span className="text-gray-700">{customer.accountNumber}</span>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
}

export default AutoCompleteCustomerSearch