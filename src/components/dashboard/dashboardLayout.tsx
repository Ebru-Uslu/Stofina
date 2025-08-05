"use client";
import { Quicksand } from "next/font/google";
import styles from "./DashboardLayout.module.css";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

const quicksand = Quicksand({ subsets: ["latin"], weight: ["400", "600", "700"] });

const menuItems = [
  { label: "Kontrol Paneli", href: "#", icon: "/menu-icon/trade.png" },
  { label: "Hisse Alım Satımı", href: "#", icon: "/menu-icon/trade.png" },
  { label: "Hisse Senetleri", href: "#", icon: "/menu-icon/stock.png" },
  { label: "Hisse Senedi Tanımlama", href: "/dashboard/stock-management", icon: "/menu-icon/add_stock.png" },
  { label: "Müşteri Tanımlama", href: "/dashboard/bireysel", icon: "/menu-icon/add_customer.png" },
  { label: "Müşteri Portföy", href: "/dashboard/customer-portfolio", icon: "/menu-icon/basket.png" },
  { label: "Müşteri Hesap Yönetimi", href: "/dashboard/customer-management", icon: "/menu-icon/wallet.png" },
  { label: "Bakiye ve Stok Yönetimi", href: "/dashboard/stock-management", icon: "/menu-icon/balance.png" },
  { label: "Emir Takip", href: "/dashboard/order-tracking", icon: "/menu-icon/order.png" },
  { label: "Raporlama", href: "/dashboard/report", icon: "/menu-icon/report.png" },
  { label: "Kullanıcı Yönetimi", href: "/dashboard/user-management", icon: "/menu-icon/portfolio.png" },
  { label: "Ayarlar", href: "#", icon: "/menu-icon/setting.png" },
];


export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  // Başlangıçta null, client açıldığında dolacak
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [searchTerm, setSearchTerm] = useState("");


  const path = usePathname();

  useEffect(() => {
    setCurrentTime(new Date()); // ilk değer
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const filteredItems = menuItems.filter((item) =>
    item.label.toLowerCase().startsWith(searchTerm.toLowerCase())
  );

  return (
    <div className={`${styles.container} ${quicksand.className}`}>
      {/* ✅ ÜST HEADER */}
      <header className={styles.header}>
        <img src="/logo.png" alt="Logo" className={styles.logo} />
        <h1 className="text-xl font-semibold mr-20 mt-1">STOFINA Refleks</h1>

        {/* Kullanıcı Bilgisi */}
        <div className={styles.userBubble}>
          <img src="/account.png" alt="Account" className={styles.userIcon} />
          <span className="font-medium">İrem Türen</span>
        </div>

        {/* 📆 Tarih & Saat */}
        <div className={styles.dateTimeBox}>
          <p className={styles.date}>
            {currentTime
              ? currentTime.toLocaleDateString("tr-TR", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })
              : "Yükleniyor..."}
          </p>
          <p className={styles.time}>
            {currentTime ? currentTime.toLocaleTimeString("tr-TR") : "--:--:--"}
          </p>
        </div>
      </header>

      {/* HEADER ALTINDAKİ ANA ALAN */}
      <div className="flex flex-1 pt-20">
        {/* SOL YAN MENÜ */}
        <aside className={styles.sidebar}>
          <div className={styles.searchContainer}>
            <input
              type="text"
              placeholder="Ara..."
              className={styles.searchInput}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoComplete="off"
            />
            {searchTerm && (
              <nav className={styles.nav} style={{ marginTop: "27.5px" }}>
                {filteredItems.length > 0 ? (
                  filteredItems.map((item) => {
                    const isActive = path.endsWith(item.href) // örn: "/dashboard/order-tracking"
                    return (
                      <a key={item.label} href={item.href} className={`${path.endsWith(item.href) ? 'bg-[#813FB4]/10' : ''}`}>
                        <img src={item.icon} alt={item.label} className="w-6 h-6" />
                        {item.label}
                      </a>
                    )
                  })
                ) : (
                  <p className="text-center text-gray-500 p-2">Sonuç bulunamadı</p>
                )}
              </nav>
            )}
          </div>

          {!searchTerm && (
            <nav className={styles.nav}>
              {menuItems.map((item) => {
                return (
                  <a key={item.label} href={item.href} className={`${path.endsWith(item.href) ? 'bg-[#813FB4]/30 ' : ''}`}>
                    <img src={item.icon} alt={item.label} className="w-6 h-6" />
                    {item.label}
                  </a>
                )
              })}
            </nav>
          )}

          <div>
            <button className={styles.logoutButton}>
              <img src="/logout.png" alt="Çıkış" className="w-6 h-6 ml-1" />
              Çıkış
            </button>
          </div>
        </aside>

        {/* ANA İÇERİK */}
        <main className={styles.main}>{children}</main>
      </div>
    </div>
  );
}
