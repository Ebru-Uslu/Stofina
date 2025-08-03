"use client";
import React from 'react'
import styles from './StyleOrderTracking.module.css'
import { useRouter } from "next/navigation";
import AutoCompleteCustomerSearch from '@/components/common/AutoCompleteCustomerSearch';
import OrderTrackingTable from '@/components/order-tracking/OrderTrackingTable';

const OrderTracking = () => {
    const router = useRouter();
    return (
        <div>
            <div className=' flex items-start'>
                <button type="button" className={styles.secondaryButton} onClick={() => router.back()}>
                    <img src="/menu-icon/back.png" alt="Geri" className={styles.icon} />
                    Geri
                </button>

                <AutoCompleteCustomerSearch />
            </div>
            <div>
                <OrderTrackingTable />
            </div>

        </div>
    )
}

export default OrderTracking