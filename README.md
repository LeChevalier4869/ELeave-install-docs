# ELeave — คู่มือติดตั้ง (เว็บไซต์)

เว็บไซต์คู่มือติดตั้งระบบลาออนไลน์ **eLeave** (คณะวิศวกรรมศาสตร์ มทร.อีสาน วิทยาเขตขอนแก่น)
สร้างด้วย [VitePress](https://vitepress.dev) — เนื้อหา static ล้วน ไม่ผูกกับระบบหลัก

## รันในเครื่อง (พัฒนา)
```bash
npm install
npm run dev        # เปิด http://localhost:5173
```

## build
```bash
npm run build      # ผลลัพธ์ที่ .vitepress/dist
npm run preview    # ดูผล build ก่อน deploy
```

## Deploy (GitHub Pages)
1. Push ขึ้น branch `main`
2. ที่ repo → **Settings → Pages → Build and deployment → Source: GitHub Actions**
3. workflow `.github/workflows/deploy.yml` จะ build + deploy อัตโนมัติทุกครั้งที่ push
4. เว็บอยู่ที่ `https://<username>.github.io/ELeave-install-docs/`

> หมายเหตุ: `base` ใน `.vitepress/config.mjs` ตั้งเป็น `/ELeave-install-docs/` ให้ตรงกับชื่อ repo — ถ้าเปลี่ยนชื่อ repo ต้องแก้ค่านี้ด้วย

## โครงเนื้อหา
```
index.md                      หน้าแรก (landing)
guide/
  index.md                    ภาพรวม & ข้อควรระวัง
  native.md                   ติดตั้งแบบ Native (Phase 0–6)
  docker.md                   ติดตั้งด้วย Docker
  first-use.md                การใช้งานครั้งแรก
  troubleshooting.md          แก้ปัญหา & อ้างอิง .env
```

เนื้อหาพอร์ตจาก `backend/docs/INSTALL.md` ของโปรเจกต์หลัก — เมื่ออัปเดตขั้นตอนติดตั้ง ควรอัปเดตทั้งสองที่ให้ตรงกัน
