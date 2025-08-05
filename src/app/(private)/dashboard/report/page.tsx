"use client";
import SystemDateCard from '@/components/report/SystemDateCard';
import React, { useState } from 'react'
import styles from '@/theme/common.module.css'
import { useRouter } from 'next/navigation';
import ReportStatusCard from '@/components/report/ReportStatusCard';
import EndOfDayReportCard from '@/components/report/EndOfDayReportCard';

const Page = () => {
    const router = useRouter();
    const [reportReady, setReportReady] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [systemDate, setSystemDate] = useState(new Date());

    const handleEndOfDayClick = () => {
        setIsLoading(true);
        // 3 saniye delay ekle
        setTimeout(() => {
            setReportReady(true);
            setIsLoading(false);
        }, 3000);
    };

    const handleConfirmReport = () => {
        // Sistem tarihini sonraki güne ilerlet
        const nextDay = new Date(systemDate);
        nextDay.setDate(nextDay.getDate() + 1);
        setSystemDate(nextDay);

        // Rapor durumunu sıfırla
        setReportReady(false);

    };

    const handlePrintReport = () => {
        // Open the PDF in a new tab
        window.open('/assets/pdf/gun_sonu_rapor.pdf', '_blank');
    };

    return (
        <div>
            <div className=' flex items-start mb-6'> {/* Geri butonu */}
                <button type="button" className={styles.secondaryButton} onClick={() => router.back()}>
                    <img src="/menu-icon/back.png" alt="Geri" className={styles.icon} />
                    Geri
                </button>
            </div>
            <div className='flex gap-6 items-center'>
                <div> {/* Sistem tarihi ve rapor durumu */}
                    <div className='mb-6'>
                        <SystemDateCard
                            systemDate={systemDate}
                            currentDate={new Date()}
                            onEndOfDayClick={handleEndOfDayClick}
                        />
                    </div>

                    {isLoading ? (
                        <ReportStatusCard status="Bekleniyor" />
                    ) : !reportReady ? (
                        <ReportStatusCard status="Henüz Alınmadı" />
                    ) : (
                        <ReportStatusCard
                            status="Hazır"
                            onCloseReport={() => setReportReady(false)}
                        />
                    )}
                </div>
                <div className='w-full'>
                    {reportReady && (
                        <div className="flex justify-center w-full">
                            <EndOfDayReportCard
                                date={systemDate.toLocaleDateString()}
                                time={new Date().toLocaleTimeString()}
                                type="GÜN SONU"
                                statusMessage="Gün içi emirler borsa emir defteriyle uyumluluğu kontrol edildi. Tarih kapanış saatinden sonraki gün için hazırlandı."
                                onConfirm={handleConfirmReport}
                                onPrint={handlePrintReport}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Page