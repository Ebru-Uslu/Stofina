"use client";

import { useState } from "react";
import styles from "./KıymetTransferi.module.css";
import SimpleCustomerSearch from "@/components/common/SimpleCustomerSearch";
import TransferSection from '@/components/common/TransferSection';

const mockAccounts = ["Hesap 1", "Hesap 2", "Hesap 3"];

export default function TransferPage() {
  const [transferType, setTransferType] = useState("NAKIT");
  const [transferCategory, setTransferCategory] = useState("HESAPLAR_ARASI");
  const [senderAccount, setSenderAccount] = useState("");
  const [receiverAccounts, setReceiverAccounts] = useState<string[]>([]);

  const handleSenderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = e.target.value;
    setSenderAccount(selected);
    setReceiverAccounts(mockAccounts.filter((acc) => acc !== selected));
  };

  return (
    <div className={styles.container}>

      {/* Sayfa Başlığı */}
      <h2 className={styles.pageTitle}>KIYMET VE PARA TRANSFERİ</h2>

      {/* Müşteri Arama Alanı */}
      <div className={styles.customerSearchWrapper}>
        <SimpleCustomerSearch />
      </div>

      <div className={styles.content}>
        {/* SOL BLOK */}
        <div className={styles.formSection}>
          {/* Transfer Türü */}
          <TransferSection />

          {/* Transfer Tipi */}
          <div className={styles.formGroup}>
            <label>Transfer Tipi</label>
            <select
              value={transferType}
              onChange={(e) => setTransferType(e.target.value)}
            >
              <option value="NAKIT">Nakit</option>
              <option value="HISSE">Hisse Senedi</option>
            </select>
          </div>

          {/* Dinamik Alanlar */}
          {transferType === "NAKIT" ? (
            <div className={styles.formGroup}>
              <label>Adet</label>
              <input type="number" placeholder="Adet giriniz" />
            </div>
          ) : (
            <>
              <div className={styles.formGroup}>
                <label>Hisse Kodu</label>
                <input type="text" placeholder="Hisse kodu giriniz." />
              </div>
              <div className={styles.formGroup}>
                <label>Adet</label>
                <input type="number" />
              </div>
              <div className={styles.formGroup}>
                <label>Tutar</label>
                <input type="number" />
              </div>
            </>
          )}
        </div>

        {/* SAĞ BLOK */}
        <div className={styles.accountSection}>
          <div className={styles.formGroup}>
            <label>Gönderici Hesap</label>
            <select value={senderAccount} onChange={handleSenderChange}>
              <option>Seçiniz</option>
              {mockAccounts.map((acc, idx) => (
                <option key={idx} value={acc}>
                  {acc}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label>Alıcı Hesap</label>
            <select>
              <option>Seçiniz</option>
              {receiverAccounts.map((acc, idx) => (
                <option key={idx} value={acc}>
                  {acc}
                </option>
              ))}
            </select>
          </div>

          <button className={styles.submitButton}>Transferi Başlat</button>
        </div>
      </div>
    </div>
  );
}
