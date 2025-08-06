"use client";
import AutoCompleteCustomerSearch from '@/components/common/AutoCompleteCustomerSearch'
import React from 'react'
import styles from '@/theme/common.module.css'
import { useRouter } from 'next/navigation'
import CustomerPortfolio from '@/components/customer-portfolio/CustomerPortfolio'
import { useTranslation } from 'react-i18next'
const Page = () => {
    const router = useRouter();
    const { t } = useTranslation();
    return (
        <div>
            <div className=' flex items-start mb-14'>
                <button type="button" className={styles.secondaryButton} onClick={() => router.back()}>
                    <img src="/menu-icon/back.png" alt={t('report.back')} className={styles.icon} />
                    {t('common.back')}
                </button>

                <AutoCompleteCustomerSearch />
            </div>
            <div>
                <CustomerPortfolio />
            </div>
        </div>
    )
}

export default Page