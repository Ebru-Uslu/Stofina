'use client';

import { useDispatchCustom } from '@/hooks/useDispatchCustom';
import { SliceGlobalModal } from '@/slice/common/sliceGlobalModal';
import { useSelectorCustom } from '@/store';
import { mockOrders, Order } from '@/types/order';
import { useEffect, useMemo, useState } from 'react';



export default function OrderTrackingTable() {
    const dispatch = useDispatchCustom();
    const [search, setSearch] = useState('');
    const [orderTypeFilter, setOrderTypeFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const selectedCustomer = useSelectorCustom((state) => state.customer.selectedCustomer);

    const filteredOrders = useMemo(() => {
        return mockOrders
            .filter((order) =>  // arama yaparken emir filtreleme
                `${order.symbol} ${order.orderNo}`
                    .toLowerCase()
                    .includes(search.toLowerCase())
            )
            .filter((order) => !orderTypeFilter || order.orderType === orderTypeFilter)
            .filter((order) => !statusFilter || order.status === statusFilter)
    }, [search, orderTypeFilter, statusFilter]);

    const handleCancelOrder = (order: Order) => {
        console.log('Cancel order:', order);
        dispatch(SliceGlobalModal.actions.openModal({
            modalType: "warning",
            message: selectedCustomer?.accountNumber + " hesap numaralı " + selectedCustomer?.firstName + " müşterisine ait " + order.orderNo + " numaralı emir işlemini iptal etmeyi onaylıyor musunuz? ",
            multipleButtons: true
        }))
    };
    if (!selectedCustomer) {
        return <></>
    }
    return (
        <div className="p-6 bg-white ">
            <h1 className="text-2xl font-bold mb-6">Emir Takip Tablosu</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 text-sm">
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Emir Ara</label>
                    <input
                        type="text"
                        placeholder="Emir No ya da Hisse Senedi Koduna Göre"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="border border-gray-300 px-4 py-2 rounded-md w-full"
                    /></div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">İşlem Türü</label>
                    <select
                        value={orderTypeFilter}
                        onChange={(e) => setOrderTypeFilter(e.target.value)}
                        className="border border-gray-300 px-4 py-2 rounded-md w-full"
                    >
                        <option value="">Tümü</option>
                        <option value="LIMIT">Limit</option>
                        <option value="MARKET">Market</option>
                        <option value="STOP">Stop</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Emir Tipi</label>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="border border-gray-300 px-4 py-2 rounded-md w-full"
                    >
                        <option value="">Tümü</option>
                        <option value="GERÇEKLEŞTİ">Gerçekleşti</option>
                        <option value="KISMİ">Kısmi</option>
                        <option value="BEKLİYOR">Bekliyor</option>
                        <option value="İPTAL">İptal</option>
                    </select>
                </div>

            </div>

            <table className="min-w-full border border-gray-300 rounded-md overflow-hidden text-sm">
                <thead className="bg-gray-100">
                    <tr className="text-left">
                        <th className="p-2">Emir No</th>
                        <th className="p-2">Hisse Senedi</th>
                        <th className="p-2">İşlem Türü</th>
                        <th className="p-2">Emir Tipi</th>
                        <th className="p-2">Fiyat </th>
                        <th className="p-2">Adet</th>
                        <th className="p-2">Gerçekleşen Adet</th>
                        <th className="p-2">Gerçekleşen Fiyat</th>
                        <th className="p-2">Emir Durum</th>
                        <th className="p-2">Tarih</th>
                        <th className="p-2">İşlem</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredOrders.map((order, index) => (
                        <tr key={order.orderNo} className={`hover:bg-gray-50 ${index % 2 === 0 ? 'bg-[#813FB4]/10' : 'bg-white'}`}>
                            <td className="p-2">{order.orderNo}</td>
                            <td className="p-2">{order.symbol}</td>
                            <td className="p-2">{order.orderSide}</td>
                            <td className="p-2">{order.orderType}</td>
                            <td className="p-2">{order.price.toFixed(2) + " TL"}</td>
                            <td className="p-2">{order.quantity}</td>
                            <td className="p-2">{order.filledQuantity}</td>
                            <td className="p-2">{order.filledPrice.toFixed(2) + " TL"}</td>
                            <td className="p-2">
                                <span className={
                                    order.status === 'GERÇEKLEŞTİ' ? 'font-bold text-green-600' :
                                        order.status === 'KISMİ' ? 'font-bold text-blue-600' :
                                            order.status === 'BEKLİYOR' ? 'font-bold text-yellow-600' :
                                                order.status === 'İPTAL' ? 'font-bold text-red-600' : ''
                                }>
                                    {order.status}
                                </span>
                            </td>
                            <td className="p-2">{new Date(order.createdAt).toLocaleString()}</td>
                            <td className="p-2">
                                {(order.status === 'BEKLİYOR' || order.status === 'KISMİ') ? (
                                    <button onClick={() => handleCancelOrder(order)} className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded">
                                        İptal Et
                                    </button>
                                ) : (
                                    <button
                                        className="bg-gray-300 text-gray-500 px-2 py-1 rounded cursor-not-allowed"
                                        disabled
                                    >
                                        İptal Et
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
