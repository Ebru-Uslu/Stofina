"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import styles from "./BireyselMüşteri.module.css";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const schema = yup.object({
  tckn: yup
    .string()
    .required("Lütfen T.C. Kimlik Numaranızı giriniz.")
    .matches(/^\d{11}$/, "T.C. Kimlik Numaranız 11 rakamdan oluşmalıdır."),
  ad: yup
    .string()
    .required("Lütfen adınızı yazınız.")
    .max(30, "Adınız 30 karakterden uzun olamaz.")
    .matches(/^[a-zA-ZçğıöşüÇĞİÖŞÜ\s]+$/, "Adınızda sadece harfler olabilir."),
  soyad: yup
    .string()
    .required("Lütfen soyadınızı yazınız.")
    .max(30, "Soyadınız 30 karakterden uzun olamaz.")
    .matches(/^[a-zA-ZçğıöşüÇĞİÖŞÜ\s]+$/, "Soyadınızda sadece harfler olabilir."),
  email: yup
    .string()
    .required("Lütfen geçerli bir e-posta adresi giriniz.")
    .email("Geçerli bir e-posta adresi giriniz."),
  telefon: yup
    .string()
    .required("Lütfen telefon numaranızı giriniz.")
    .matches(/^[1-9]\d{9}$/, "Telefon numaranız 10 rakamdan oluşmalı ve 0 ile başlamamalıdır."),
  adres: yup
    .string()
    .required("Lütfen adresinizi giriniz.")
    .max(400, "Adresiniz 400 karakterden uzun olamaz."),
  uygunluk: yup.boolean().oneOf([true], "Uygunluk testini onaylamanız gerekmektedir."),
  kvkk: yup.boolean().oneOf([true], "KVKK onayını vermeniz gerekmektedir."),
  mkk: yup.boolean().oneOf([true], "MKK onayını vermeniz gerekmektedir."),
}).required();

export default function Page() {
  const router = useRouter();

  // Popup state
  const [popup, setPopup] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const popupTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Users sample data + search
  const [showUsersTable, setShowUsersTable] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const users = [
    { id: 1, ad: "Ali", soyad: "Veli", telefon: "1234567890", email: "ali@example.com", adres: "Abdurrahman Nafiz Gürman mah. Gülbayır sok. no 14" },
    { id: 2, ad: "Ayşe", soyad: "Demir", telefon: "0987654321", email: "ayse@example.com", adres: "Ankara" },
    { id: 3, ad: "Mehmet", soyad: "Yılmaz", telefon: "05443332211", email: "mehmet@example.com", adres: "İzmir" }
  ];
  const filteredUsers = users.filter(user =>
    Object.values(user).some(value =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  // Popup gösterme fonksiyonu
  const showPopup = (message: string, type: "success" | "error") => {
    setPopup({ message, type });
    if (popupTimeoutRef.current) clearTimeout(popupTimeoutRef.current);
    popupTimeoutRef.current = setTimeout(() => setPopup(null), 3000);
  };

  const onSubmit = (data: any) => {
    showPopup("Müşteri kaydı başarıyla gerçekleşti!", "success");
    reset();
  };

  const onError = (errors: any) => {
    const firstErrorField = Object.keys(errors)[0];
    if (firstErrorField) {
      const message = errors[firstErrorField]?.message;
      if (message) {
        showPopup(message, "error");
      }
    }
  };

  const handleClear = () => {
    reset();
  };

  const scrollToUserList = () => {
    const el = document.getElementById("userListSection");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className={styles.container}>
      {/* TAB SWITCHER */}
      <div className={styles.tabContainer}>
        <button
          className={`${styles.tabButton} ${styles.activeTab}`}
          onClick={() => router.push("/dashboard/bireysel")}
          disabled
        >
          Bireysel
        </button>
        <button
          className={styles.tabButton}
          onClick={() => router.push("/dashboard/kurumsal")}
        >
          Kurumsal
        </button>
      </div>

      {/* ÜST BUTONLAR */}
      <div className={styles.topButtons}>
        <button type="button" className={styles.secondaryButton} onClick={() => router.back()}>
          <img src="/menu-icon/back.png" alt="Geri" className={styles.icon} />
          Geri
        </button>

        <button type="button" className={styles.secondaryButton} onClick={handleClear}>
          <img src="/menu-icon/clear.png" alt="Temizle" className={styles.icon} />
          Temizle
        </button>

        <button
          type="button"
          className={styles.secondaryButton}
          onClick={() => {
            setShowUsersTable(!showUsersTable);
            setTimeout(() => scrollToUserList(), 100);
          }}
        >
          <img src="/menu-icon/persons.png" alt="Listele" className={styles.icon} />
          Kullanıcıları Listele
        </button>
      </div>

      {/* FORM */}
      <form
        className={styles.form}
        noValidate
        onSubmit={handleSubmit(onSubmit, onError)}
      >
        <h2 className={styles.formTitle}>BİREYSEL MÜŞTERİ TANIMLAMA</h2>

        {/* TCKN */}
        <div className={styles.formGroup}>
          <label className={styles.label}>
            T.C. Kimlik No <span className={styles.required}>*</span>
          </label>
          <input
            type="text"
            maxLength={11}
            {...register("tckn")}
            className={styles.input}
          />
        </div>

        {/* Ad Soyad */}
        <div className={styles.row}>
          <div className={styles.formGroupRow}>
            <label className={styles.label}>
              Ad <span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              maxLength={30}
              {...register("ad")}
              className={styles.input}
            />
          </div>
          <div className={styles.formGroupRow}>
            <label className={styles.label}>
              Soyad <span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              maxLength={30}
              {...register("soyad")}
              className={styles.input}
            />
          </div>
        </div>

        {/* E-posta Telefon */}
        <div className={styles.row}>
          <div className={styles.formGroupRow}>
            <label className={styles.label}>
              E-posta <span className={styles.required}>*</span>
            </label>
            <input
              type="email"
              {...register("email")}
              className={styles.input}
            />
          </div>
          <div className={styles.formGroupRow}>
            <label className={styles.label}>
              Telefon <span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              maxLength={10}
              {...register("telefon")}
              className={styles.input}
            />
          </div>
        </div>

        {/* Adres */}
        <div className={styles.formGroup}>
          <label className={styles.label}>
            Adres <span className={styles.required}>*</span>
          </label>
          <textarea
            rows={3}
            maxLength={400}
            {...register("adres")}
            className={styles.textarea}
          />
        </div>

        {/* Checkboxlar */}
        <div className={styles.checkboxGroup}>
          <input type="checkbox" id="uygunluk" {...register("uygunluk")} />
          <label htmlFor="uygunluk" className={styles.uygunlukLabel}>
            UYGUNLUK TESTİ <span className={styles.required}>*</span>
          </label>
        </div>

        <div className={styles.checkboxGroup}>
          <input type="checkbox" id="kvkk" {...register("kvkk")} />
          <label htmlFor="kvkk">
            <a href="/kvkk-aydinlatma.pdf" target="_blank" rel="noopener noreferrer">
              Kişisel Verilerin Korunması Kanunu (KVKK) kapsamında hazırlanan aydınlatma metni müşteri tarafından okunmuş ve onaylanmıştır. 
              <span className={styles.required}>*</span>
            </a>
          </label>
        </div>

        <div className={styles.checkboxGroup}>
          <input type="checkbox" id="mkk" {...register("mkk")} />
          <label htmlFor="mkk">
            <a href="/mkk-onay-metni.pdf" target="_blank" rel="noopener noreferrer">
              MKK nezdinde kaydının yapılması ve bilgilerinin ilgili kurumlarla paylaşılmasına müşteri tarafından onay verilmiştir.
              <span className={styles.required}>*</span>
            </a>
          </label>
        </div>

        <button type="submit" className={styles.submitButton}>
          Kaydet
        </button>
      </form>

      {/* Popup */}
      {popup && (
        <div
          className={`${styles.popup} ${
            popup.type === "success" ? styles.popupSuccess : styles.popupError
          }`}
          role="alert"
          aria-live="assertive"
        >
          {popup.message}
        </div>
      )}

      {/* Kullanıcı Listesi */}
      {showUsersTable && (
        <div className={styles.userListContainer} id="userListSection">
          <div className={styles.userListHeader}>
            <h3 className={styles.userListTitle}>Kullanıcı Listesi</h3>
            <input
              type="text"
              value={searchTerm}
              placeholder="İsim, telefon veya e-posta ara..."
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>

          <table className={styles.userTable}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Ad</th>
                <th>Soyad</th>
                <th>Telefon</th>
                <th>E-posta</th>
                <th>Adres</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.ad}</td>
                    <td>{user.soyad}</td>
                    <td>{user.telefon}</td>
                    <td>{user.email}</td>
                    <td>{user.adres || "-"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className={styles.noData}>
                    Kullanıcı bulunamadı.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
