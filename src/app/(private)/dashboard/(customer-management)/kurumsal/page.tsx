"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import styles from "./KurumsalMüşteri.module.css";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const schema = yup.object({
  ticaretUnvani: yup
    .string()
    .required("Ticaret unvanı boş bırakılamaz.")
    .min(3, "Ticaret unvanı en az 3 karakter olmalıdır.")
    .max(100, "Ticaret unvanı en fazla 100 karakter olabilir."),

  ticaretSicilNo: yup
    .string()
    .required("Ticaret sicil numarası boş bırakılamaz.")
    .matches(/^[1-9]\d{4,9}$/, "Ticaret sicil numarası 5–10 haneli olmalı ve 0 ile başlamamalıdır."),

  vergiNo: yup
    .string()
    .required("Vergi numarası boş bırakılamaz.")
    .matches(/^\d{10}$/, "Vergi numarası 10 haneli olmalıdır."),

  vergiDairesi: yup
    .string()
    .required("Vergi dairesi boş bırakılamaz.")
    .min(5, "Vergi dairesi adı en az 5 karakter olmalıdır.")
    .max(100, "Vergi dairesi adı en fazla 100 karakter olabilir."),

  yasalAdres: yup
    .string()
    .required("Yasal adres boş bırakılamaz.")
    .min(10, "Yasal adres en az 10 karakter olmalıdır.")
    .max(300, "Yasal adres en fazla 300 karakter olabilir."),

  yetkili: yup
    .string()
    .required("Yetkili adı boş bırakılamaz.")
    .matches(/^[a-zA-ZçğıöşüÇĞİÖŞÜ\s]{3,50}$/, "Yetkili adı yalnızca harf ve boşluk içerebilir (3–50 karakter)."),

  yetkiliTckn: yup
    .string()
    .required("Yetkili TCKN boş bırakılamaz.")
    .matches(/^[1-9]\d{10}$/, "Yetkili TCKN 11 haneli ve 0 ile başlamamalıdır."),

  yetkiliTelefon: yup
    .string()
    .required("Yetkili telefon numarası boş bırakılamaz.")
    .matches(/^[5]\d{9}$/, "Telefon numarası 5 ile başlamalı ve 10 haneli olmalıdır."),

  yetkiliEmail: yup
    .string()
    .required("Yetkili e-posta boş bırakılamaz.")
    .matches(/^[^\sçÇğĞıİöÖşŞüÜ]+@[^\sçÇğĞıİöÖşŞüÜ]+\.[^\sçÇğĞıİöÖşŞüÜ]+$/, "Geçerli bir e-posta adresi giriniz."),

  uygunluk: yup.boolean().oneOf([true], "Uygunluk testini onaylamanız gerekmektedir."),
  mkk: yup.boolean().oneOf([true], "MKK onayını vermeniz gerekmektedir."),
  kvkk: yup.boolean().oneOf([true], "KVKK onayını vermeniz gerekmektedir."),

  yetkiliOps: yup
    .string()
    .nullable()
    .transform((value) => (value === "" ? null : value))
    .matches(/^[a-zA-ZçğıöşüÇĞİÖŞÜ\s]{3,50}$/, "Yetkili adı yalnızca harf ve boşluk içerebilir.")
    .notRequired(),

  yetkiliTcknOps: yup
    .string()
    .nullable()
    .transform((value) => (value === "" ? null : value))
    .matches(/^[1-9]\d{10}$/, "Yetkili TCKN 11 haneli ve 0 ile başlamamalıdır.")
    .notRequired(),

  yetkiliTelefonOps: yup
    .string()
    .nullable()
    .transform((value) => (value === "" ? null : value))
    .matches(/^[5]\d{9}$/, "Telefon numarası 5 ile başlamalı ve 10 haneli olmalıdır.")
    .notRequired(),

  yetkiliEmailOps: yup
    .string()
    .nullable()
    .transform((value) => (value === "" ? null : value))
    .matches(/^[^\sçÇğĞıİöÖşŞüÜ]+@[^\sçÇğĞıİöÖşŞüÜ]+\.[^\sçÇğĞıİöÖşŞüÜ]+$/, "Geçerli bir e-posta adresi giriniz.")
    .notRequired(),
}).required();

export default function Page() {
  const router = useRouter();

  // ✅ Popup state
  const [popup, setPopup] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const popupTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [showUsersTable, setShowUsersTable] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const corporateUsers = [
    {
      id: 1,
      ticaretUnvani: "OpenAI Yazılım A.Ş.",
      vkn: "1234567890",
      yetkili: "Ali Veli",
      yetkiliTelefon: "5321112233",
      yetkiliEmail: "ali@openai.com"
    },
    {
      id: 2,
      ticaretUnvani: "Biblioteca Teknoloji Ltd.",
      vkn: "9876543210",
      yetkili: "Ayşe Demir",
      yetkiliTelefon: "5332223344",
      yetkiliEmail: "ayse@biblioteca.com"
    }
  ];

 const filteredUsers = corporateUsers.filter(user =>
    Object.values(user).some(value =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // ✅ React Hook Form setup
  const { register, handleSubmit, reset } = useForm({
    resolver: yupResolver(schema),
  });

  // ✅ Popup gösterme
  const showPopup = (message: string, type: "success" | "error") => {
    setPopup({ message, type });
    if (popupTimeoutRef.current) clearTimeout(popupTimeoutRef.current);
    popupTimeoutRef.current = setTimeout(() => setPopup(null), 3000);
  };

  const onSubmit = (data: any) => {
    showPopup("Kurumsal müşteri kaydı başarıyla gerçekleşti!", "success");
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
    const el = document.getElementById("corporateUserList");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };
  
  return (
    <div className={styles.container}>
      {/* TAB BUTTONS */}
      <div className={styles.tabContainer}>
        <button className={styles.tabButton} onClick={() => router.push("/dashboard/bireysel")}>Bireysel</button>
        <button className={`${styles.tabButton} ${styles.activeTab}`} onClick={() => router.push("/dashboard/kurumsal")}>Kurumsal</button>
      </div>

      {/* TOP BUTTONS */}
      <div className={styles.topButtons}>
        <button type="button" className={styles.secondaryButton} onClick={() => router.back()}>
          <img src="/menu-icon/back.png" alt="Geri" className={styles.icon} /> Geri
        </button>

        <button type="button" className={styles.secondaryButton} onClick={handleClear}>
          <img src="/menu-icon/clear.png" alt="Temizle" className={styles.icon} /> Temizle
        </button>

        <button
          type="button"
          className={styles.secondaryButton}
          onClick={() => {
            setShowUsersTable(!showUsersTable);
            setTimeout(() => scrollToUserList(), 100);
          }}
        >
          <img src="/menu-icon/persons.png" alt="Listele" className={styles.icon} /> Kullanıcıları Listele
        </button>
      </div>

      {/* ✅ FORM */}
      <form className={styles.form} noValidate onSubmit={handleSubmit(onSubmit, onError)}>
        <h2 className={styles.formTitle}>KURUMSAL MÜŞTERİ TANIMLAMA</h2>

        {/* 1. SATIR */}
        <div className={styles.row}>
          <div className={styles.formGroupRow}>
            <label className={styles.label}>Ticaret Unvanı *</label>
            <input {...register("ticaretUnvani")} className={styles.input} />
          </div>
          <div className={styles.formGroupRow}>
            <label className={styles.label}>Ticaret Sicil No *</label>
            <input {...register("ticaretSicilNo")} className={styles.input} />
          </div>
        </div>

        {/* 2. SATIR */}
        <div className={styles.row}>
          <div className={styles.formGroupRow}>
            <label className={styles.label}>Vergi No (VKN) *</label>
            <input {...register("vergiNo")} className={styles.input} />
          </div>
          <div className={styles.formGroupRow}>
            <label className={styles.label}>Vergi Dairesi *</label>
            <input {...register("vergiDairesi")} className={styles.input} />
          </div>
        </div>

        {/* 3. SATIR */}
        <div className={styles.row}>
          <div className={styles.formGroupRow}>
            <label className={styles.label}>Yetkili *</label>
            <input {...register("yetkili")} className={styles.input} />
          </div>
          <div className={styles.formGroupRow}>
            <label className={styles.label}>Yetkili (Opsiyonel)</label>
            <input {...register("yetkiliOps")} className={styles.input} />
          </div>
        </div>

        {/* 4. SATIR */}
        <div className={styles.row}>
          <div className={styles.formGroupRow}>
            <label className={styles.label}>Yetkili TCKN *</label>
            <input maxLength={11} {...register("yetkiliTckn")} className={styles.input} />
          </div>
          <div className={styles.formGroupRow}>
            <label className={styles.label}>Yetkili TCKN (Opsiyonel)</label>
            <input maxLength={11} {...register("yetkiliTcknOps")} className={styles.input} />
          </div>
        </div>

        {/* 5. SATIR */}
        <div className={styles.row}>
          <div className={styles.formGroupRow}>
            <label className={styles.label}>Yetkili Telefon *</label>
            <input maxLength={10} {...register("yetkiliTelefon")} className={styles.input} />
          </div>
          <div className={styles.formGroupRow}>
            <label className={styles.label}>Yetkili Telefon (Opsiyonel)</label>
            <input maxLength={10} {...register("yetkiliTelefonOps")} className={styles.input} />
          </div>
        </div>

        {/* 6. SATIR */}
        <div className={styles.row}>
          <div className={styles.formGroupRow}>
            <label className={styles.label}>Yetkili E-posta *</label>
            <input type="email" {...register("yetkiliEmail")} className={styles.input} />
          </div>
          <div className={styles.formGroupRow}>
            <label className={styles.label}>Yetkili E-posta (Opsiyonel)</label>
            <input type="email" {...register("yetkiliEmailOps")} className={styles.input} />
          </div>
        </div>

        {/* YASAL ADRES */}
        <div className={styles.formGroup}>
          <label className={styles.label}>Yasal Adres *</label>
          <textarea rows={3} {...register("yasalAdres")} className={styles.textarea} />
        </div>

        {/* ✅ CHECKBOXLAR */}
        <div className={styles.checkboxGroup}>
          <input type="checkbox" id="uygunluk" {...register("uygunluk")} />
          <label htmlFor="uygunluk">UYGUNLUK TESTİ <span className={styles.required}>*</span></label>
        </div>

        <div className={styles.checkboxGroup}>
          <input type="checkbox" id="mkk" {...register("mkk")} />
          <label htmlFor="mkk">MKK nezdinde kaydının yapılması ve bilgilerinin ilgili kurumlarla paylaşılmasına müşteri tarafından onay verilmiştir. <span className={styles.required}>*</span></label>
        </div>

        <div className={styles.checkboxGroup}>
          <input type="checkbox" id="kvkk" {...register("kvkk")} />
          <label htmlFor="kvkk">Kişisel Verilerin Korunması Kanunu (KVKK) kapsamında hazırlanan aydınlatma metnini okudum, anladım ve onaylıyorum. <span className={styles.required}>*</span></label>
        </div>

        <button type="submit" className={styles.submitButton}>Kaydet</button>
      </form>

      {/* ✅ POPUP */}
      {popup && (
        <div className={`${styles.popup} ${popup.type === "success" ? styles.popupSuccess : styles.popupError}`}>
          {popup.message}
        </div>
      )}
  
      {showUsersTable && (
        <div className={styles.userListContainer} id="corporateUserList">
          <div className={styles.userListHeader}>
            <h3 className={styles.userListTitle}>Kurumsal Müşteri Listesi</h3>
            <input
              type="text"
              value={searchTerm}
              placeholder="Ticaret unvanı, yetkili veya VKN ara..."
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>

          <table className={styles.userTable}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Ticaret Unvanı</th>
                <th>VKN</th>
                <th>Yetkili</th>
                <th>Yetkili Telefon</th>
                <th>Yetkili E-posta</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.ticaretUnvani}</td>
                    <td>{user.vkn}</td>
                    <td>{user.yetkili}</td>
                    <td>{user.yetkiliTelefon}</td>
                    <td>{user.yetkiliEmail}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className={styles.noData}>
                    Müşteri bulunamadı.
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
