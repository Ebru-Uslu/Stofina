"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import styles from "./UserForm.module.css";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

// ✅ Validasyon şeması
const schema = yup.object({
  ad: yup
    .string()
    .required("Ad alanı zorunludur.")
    .max(30, "Ad 30 karakterden uzun olamaz.")
    .matches(/^[a-zA-ZçğıöşüÇĞİÖŞÜ\s]+$/, "Ad sadece harflerden oluşmalıdır."),
  soyad: yup
    .string()
    .required("Soyad alanı zorunludur.")
    .max(30, "Soyad 30 karakterden uzun olamaz.")
    .matches(/^[a-zA-ZçğıöşüÇĞİÖŞÜ\s]+$/, "Soyad sadece harflerden oluşmalıdır."),
  telefon: yup
    .string()
    .required("Telefon alanı zorunludur.")
    .matches(/^[1-9]\d{9}$/, "Telefon 10 rakam olmalı ve 0 ile başlamamalı."),
  email: yup
    .string()
    .required("E-posta alanı zorunludur.")
    .email("Geçerli bir e-posta giriniz."),
  kullaniciAdi: yup
    .string()
    .required("Kullanıcı adı zorunludur.")
    .min(3, "Kullanıcı adı en az 3 karakter olmalı."),
  unvan: yup.string().required("Ünvan seçimi zorunludur."),
  yetki: yup.string().required("Yetki seçimi zorunludur."),
}).required();

export default function Page() {
  const router = useRouter();

  const [showUsersTable, setShowUsersTable] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // ✅ Tabloya scroll için ref
  const tableRef = useRef<HTMLDivElement | null>(null);

  // ✅ Popup için state & timeout
  const [popup, setPopup] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const popupTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // ✅ Örnek kullanıcılar
  const users = [
    { id: 1, ad: "Ali", soyad: "Veli", telefon: "1234567890", email: "ali@example.com", kullaniciAdi: "ali123", unvan: "Mühendis", yetki: "Admin" },
    { id: 2, ad: "Ayşe", soyad: "Demir", telefon: "0987654321", email: "ayse@example.com", kullaniciAdi: "ayseD", unvan: "Uzman", yetki: "Kullanıcı" },
    { id: 3, ad: "Mehmet", soyad: "Yılmaz", telefon: "05443332211", email: "mehmet@example.com", kullaniciAdi: "mehmetY", unvan: "Yönetici", yetki: "Manager" }
  ];

  const filteredUsers = users.filter(user =>
    Object.values(user).some(value =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // ✅ React Hook Form kullanımı
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  // ✅ Popup gösterme fonksiyonu
  const showPopup = (message: string, type: "success" | "error") => {
    setPopup({ message, type });
    if (popupTimeoutRef.current) clearTimeout(popupTimeoutRef.current);
    popupTimeoutRef.current = setTimeout(() => setPopup(null), 3000);
  };

  // ✅ Form başarılı gönderim
  const onSubmit = (data: any) => {
    showPopup("Form başarıyla gönderildi!", "success");
    reset();
  };

  // ✅ Form hata yakalama
  const onError = (errors: any) => {
    const firstErrorField = Object.keys(errors)[0];
    if (firstErrorField) {
      const message = errors[firstErrorField]?.message;
      if (message) {
        showPopup(message, "error");
      }
    }
  };

  // ✅ Form temizleme
  const handleClear = () => {
    reset();
  };

  return (
    <div className={styles.container}>

      {/* 🔝 ÜST BUTONLAR */}
      <div className={styles.topButtons}>
        <button type="button" className={styles.secondaryButton} onClick={() => router.back()}>
          <img src="/menu-icon/back.png" alt="Geri" className={styles.icon} />
          Geri
        </button>

        <button type="button" className={styles.secondaryButton} onClick={handleClear}>
          <img src="/menu-icon/clear.png" alt="Temizle" className={styles.icon} />
          Temizle
        </button>

        {/* ✅ Listele butonuna scroll ekledik */}
        <button
          type="button"
          className={styles.secondaryButton}
          onClick={() => {
            setShowUsersTable(true);
            setTimeout(() => {
              tableRef.current?.scrollIntoView({ behavior: "smooth" });
            }, 100);
          }}
        >
          <img src="/menu-icon/persons.png" alt="Listele" className={styles.icon} />
          Kullanıcıları Listele
        </button>
      </div>

      {/* 📄 FORM */}
      <form
        className={styles.form}
        onSubmit={handleSubmit(onSubmit, onError)}
        noValidate
      >
        <h2 className={styles.formTitle}>KULLANICI TANIMLAMA</h2>

        {/* Ad Soyad */}
        <div className={styles.row}>
          <div className={styles.formGroupRow}>
            <label className={styles.label}>
              Ad <span className={styles.required}>*</span>
            </label>
            <input
              type="text"
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
              {...register("soyad")}
              className={styles.input}
            />
          </div>
        </div>

        {/* Kullanıcı Adı */}
        <div className={styles.formGroup}>
          <label className={styles.label}>
            Kullanıcı Adı <span className={styles.required}>*</span>
          </label>
          <input
            type="text"
            {...register("kullaniciAdi")}
            className={styles.input}
          />
        </div>

        {/* E-posta ve Telefon */}
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
              Telefon Numarası <span className={styles.required}>*</span>
            </label>
            <input
              type="tel"
              {...register("telefon")}
              className={styles.input}
            />
          </div>
        </div>

        {/* Ünvan */}
        <div className={styles.formGroup}>
          <label className={styles.label}>
            Ünvan <span className={styles.required}>*</span>
          </label>
          <select {...register("unvan")} className={styles.select} defaultValue="">
            <option value="" disabled>Ünvan Seçiniz</option>
            <option value="muhendis">Mühendis</option>
            <option value="uzman">Uzman</option>
            <option value="yonetici">Yönetici</option>
          </select>
        </div>

        {/* Yetki */}
        <div className={styles.formGroup}>
          <label className={styles.label}>
            Yetki <span className={styles.required}>*</span>
          </label>
          <select {...register("yetki")} className={styles.select} defaultValue="">
            <option value="" disabled>Yetki Seçiniz</option>
            <option value="admin">Admin</option>
            <option value="user">Kullanıcı</option>
            <option value="manager">Yönetici</option>
          </select>
        </div>

        <button type="submit" className={styles.submitButton}>Kaydet</button>
      </form>

      {/* 🔔 Popup Mesajı */}
      {popup && (
        <div
          className={`${styles.popup} ${popup.type === "success" ? styles.popupSuccess : styles.popupError}`}
          role="alert"
          aria-live="assertive"
        >
          {popup.message}
        </div>
      )}

      {/* 📋 Kullanıcı Listesi */}
      {showUsersTable && (
        <div ref={tableRef} className={styles.userListContainer}>
          <div className={styles.userListHeader}>
            <h3 className={styles.userListTitle}>Kullanıcı Listesi</h3>
            <input
              type="text"
              placeholder="Ara..."
              className={styles.searchInput}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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
                <th>Kullanıcı Adı</th>
                <th>Ünvan</th>
                <th>Yetki</th>
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
                    <td>{user.kullaniciAdi}</td>
                    <td>{user.unvan}</td>
                    <td>{user.yetki}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className={styles.noData}>Kullanıcı bulunamadı.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
