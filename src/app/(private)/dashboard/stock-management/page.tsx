"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./StockForm.module.css";

export default function Page() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    ad: "",
    soyad: "",
    telefon: "",
    email: "",
    kullaniciAdi: "",
    unvan: "",
    yetki: ""
  });

  const [showUsersTable, setShowUsersTable] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Örnek kullanıcılar
  const users = [
    { id: 1, ad: "Ali", soyad: "Veli", telefon: "1234567890", email: "ali@example.com", kullaniciAdi: "ali123", unvan: "Mühendis", yetki: "Admin" },
    { id: 2, ad: "Ayşe", soyad: "Demir", telefon: "0987654321", email: "ayse@example.com", kullaniciAdi: "ayseD", unvan: "Uzman", yetki: "Kullanıcı" },
    { id: 3, ad: "Mehmet", soyad: "Yılmaz", telefon: "05443332211", email: "mehmet@example.com", kullaniciAdi: "mehmetY", unvan: "Yönetici", yetki: "Manager" }
  ];

  // Arama filtrelemesi
  const filteredUsers = users.filter(user =>
    Object.values(user).some(value =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleClear = () => {
    setFormData({
      ad: "",
      soyad: "",
      telefon: "",
      email: "",
      kullaniciAdi: "",
      unvan: "",
      yetki: ""
    });
  };

  return (
    <div className={styles.container}>

      {/* 🔘 ÜST BUTONLAR */}
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
          onClick={() => setShowUsersTable(!showUsersTable)}
        >
          <img src="/menu-icon/persons.png" alt="Listele" className={styles.icon} />
          Kullanıcıları Listele
        </button>
      </div>

      {/* 📄 FORM */}
      <form
        className={styles.form}
        onSubmit={(e) => {
          e.preventDefault();
          alert("Form gönderildi!");
        }}
      >
        <h2 className={styles.formTitle}>Kullanıcı Tanımlama</h2>

        {/* Ad ve Soyad yan yana */}
        <div className={styles.row}>
          <div className={styles.formGroupRow}>
            <label className={styles.label}>Ad</label>
            <input type="text" name="ad" className={styles.input} value={formData.ad} onChange={handleChange} required />
          </div>
          <div className={styles.formGroupRow}>
            <label className={styles.label}>Soyad</label>
            <input type="text" name="soyad" className={styles.input} value={formData.soyad} onChange={handleChange} required />
          </div>
        </div>

        {/* Kullanıcı Adı */}
        <div className={styles.formGroup}>
          <label className={styles.label}>Kullanıcı Adı</label>
          <input type="text" name="kullaniciAdi" className={styles.input} value={formData.kullaniciAdi} onChange={handleChange} required />
        </div>

        {/* E-posta ve Telefon yan yana */}
        <div className={styles.row}>
          <div className={styles.formGroupRow}>
            <label className={styles.label}>E-posta</label>
            <input type="email" name="email" className={styles.input} value={formData.email} onChange={handleChange} required />
          </div>
          <div className={styles.formGroupRow}>
            <label className={styles.label}>Telefon Numarası</label>
            <input type="tel" name="telefon" className={styles.input} value={formData.telefon} onChange={handleChange} required />
          </div>
        </div>

        {/* Ünvan */}
        <div className={styles.formGroup}>
          <label className={styles.label}>Ünvan</label>
          <select name="unvan" className={styles.select} value={formData.unvan} onChange={handleChange} required>
            <option value="" disabled>Ünvan Seçiniz</option>
            <option value="muhendis">Mühendis</option>
            <option value="uzman">Uzman</option>
            <option value="yonetici">Yönetici</option>
          </select>
        </div>

        {/* Yetki */}
        <div className={styles.formGroup}>
          <label className={styles.label}>Yetki</label>
          <select name="yetki" className={styles.select} value={formData.yetki} onChange={handleChange} required>
            <option value="" disabled>Yetki Seçiniz</option>
            <option value="admin">Admin</option>
            <option value="user">Kullanıcı</option>
            <option value="manager">Yönetici</option>
          </select>
        </div>

        <button type="submit" className={styles.submitButton}>Kaydet</button>
      </form>

      {/* 📋 Kullanıcı Listesi Bölümü */}
      {showUsersTable && (
        <div className={styles.userListContainer}>
          {/* ✅ Başlık ve Arama */}
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

          {/* ✅ Tablo */}
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
                filteredUsers.map(user => (
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
