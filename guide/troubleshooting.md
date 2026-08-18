# แก้ปัญหา & อ้างอิง .env

## แก้ปัญหาที่พบบ่อย

| อาการ | สาเหตุ / วิธีแก้ |
|-------|-----------------|
| `npm run setup` error **1064 RENAME INDEX** | DB เป็น MariaDB < 10.5 → ใช้ MySQL 8 / MariaDB 10.5+ |
| เชื่อม DB ไม่ได้ (`P1001` / `ECONNREFUSED`) | MySQL ไม่ได้รัน, host/port/รหัสผิด, หรือรหัสมีอักขระพิเศษไม่ได้ URL-encode |
| ภาษาไทยเพี้ยนใน DB | database ไม่ได้ตั้ง `utf8mb4` → สร้าง database ใหม่ด้วย charset ที่ถูก |
| `Port 8000 already in use` | มีโปรเซสอื่นใช้พอร์ต → ปิด หรือเปลี่ยน `PORT` |
| `redirect_uri_mismatch` ตอน login | redirect URI ใน Google Console ไม่ตรง `http://localhost:8000/auth/google/callback` |
| Google ขึ้น "Access blocked" | ยังไม่เพิ่มอีเมลใน **Test users** ของ OAuth consent screen |
| ยื่นลาแล้วขึ้น "ไม่พบผู้ตรวจสอบในระบบ" | ยังไม่ได้มอบบทบาท `VERIFIER` (ดู [การใช้งานครั้งแรก](./first-use)) |
| server ไม่ start (Cloudinary) | ขาด `CLOUDINARY_SECRET` — ระบบต้องมีค่านี้ตอน boot |

## อ้างอิง: ตัวแปร .env (Backend)

| กลุ่ม | Key | จำเป็น? |
|------|-----|--------|
| Database | `DATABASE_URL` | ✅ จำเป็น |
| Server | `PORT`, `NODE_ENV`, `BACKEND_URL`, `FRONTEND_URL` | ✅ จำเป็น |
| JWT/Session | `JWT_SECRET`, `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`, `JWT_EXPIRESIN`, `SESSION_SECRET` | ✅ จำเป็น |
| Login | `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` | ✅ จำเป็นเพื่อ login |
| Bootstrap | `BOOTSTRAP_SUPER_ADMIN_EMAIL` (+ `PREFIX`/`FIRSTNAME`/`LASTNAME`) | ทางเลือก (หรือใช้ CLI) |
| Email แจ้งเตือน | `EMAIL_*`, `OAUTH_*_RMUTI` | ทางเลือก |
| อัปโหลดไฟล์ | `CLOUDINARY_SECRET` | ต้องมีตอน boot |
| Migrate dev | `SHADOW_DATABASE_URL` | เฉพาะ `prisma migrate dev` |

**Frontend:** `VITE_BACKEND_URL` (มีผลเฉพาะเมื่อไม่ได้รันบน localhost — Vite ฝังค่าตอน build)

::: tip
ตั้งค่า Google OAuth แบบละเอียด (redirect URIs ต่อ environment, callback อัตโนมัติ) ดูที่ Phase 6 ใน [ติดตั้งแบบ Native](./native#phase-6-ตั้งค่า-google-oauth-ให้ล็อกอินได้จริง)
:::
