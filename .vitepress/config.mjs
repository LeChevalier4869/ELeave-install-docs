import { defineConfig } from "vitepress";

export default defineConfig({
  lang: "th-TH",
  title: "คู่มือติดตั้ง eLeave",
  description:
    "คู่มือติดตั้งระบบลาออนไลน์ คณะวิศวกรรมศาสตร์ มทร.อีสาน วิทยาเขตขอนแก่น — ทั้งแบบ Native และ Docker",
  // ชื่อ repo สำหรับ GitHub Pages (https://<user>.github.io/ELeave-install-docs/)
  base: "/ELeave-install-docs/",
  cleanUrls: true,
  lastUpdated: true,
  srcExclude: ["README.md"], // README เป็นของ repo ไม่ใช่หน้าเว็บ
  // URL ตัวอย่าง localhost ในคู่มือไม่ใช่ลิงก์เสีย — ไม่ต้องเช็ค
  ignoreDeadLinks: "localhostLinks",

  head: [
    ["link", { rel: "preconnect", href: "https://fonts.googleapis.com" }],
    ["link", { rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: "" }],
    [
      "link",
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Kanit:wght@400;500;600;700&family=Sarabun:wght@400;500;600;700&display=swap",
      },
    ],
  ],

  themeConfig: {
    nav: [
      { text: "หน้าแรก", link: "/" },
      { text: "คู่มือติดตั้ง", link: "/guide/" },
    ],

    sidebar: {
      "/guide/": [
        {
          text: "คู่มือติดตั้ง",
          items: [
            { text: "ภาพรวม & ข้อควรระวัง", link: "/guide/" },
            { text: "ติดตั้งแบบ Native", link: "/guide/native" },
            { text: "ติดตั้งด้วย Docker", link: "/guide/docker" },
            { text: "การใช้งานครั้งแรก", link: "/guide/first-use" },
            { text: "แก้ปัญหา & อ้างอิง .env", link: "/guide/troubleshooting" },
          ],
        },
      ],
    },

    footer: {
      message: "คู่มือติดตั้งระบบลาออนไลน์ eLeave",
      copyright: "© มหาวิทยาลัยเทคโนโลยีราชมงคลอีสาน วิทยาเขตขอนแก่น",
    },

    outline: { level: [2, 3], label: "ในหน้านี้" },
    docFooter: { prev: "ก่อนหน้า", next: "ถัดไป" },
    darkModeSwitchLabel: "โหมดสี",
    lightModeSwitchTitle: "สลับเป็นโหมดสว่าง",
    darkModeSwitchTitle: "สลับเป็นโหมดมืด",
    sidebarMenuLabel: "เมนู",
    returnToTopLabel: "กลับขึ้นบน",
    lastUpdatedText: "อัปเดตล่าสุด",
  },
});
