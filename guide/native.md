# ติดตั้งแบบ Native

ติดตั้งลงเครื่องจริงทีละขั้น — เหมาะกับการทำความเข้าใจระบบทั้งหมด
(ต้องการติดตั้งเร็วโดยไม่ลง Node/MySQL เอง? ดู [ติดตั้งด้วย Docker](./docker))

::: tip ยังไม่ได้ดาวน์โหลดโค้ด?
clone ทั้ง 2 repo ให้อยู่ในโฟลเดอร์ `backend`/`frontend` วางข้างกันก่อน — ดู [เตรียมโปรเจกต์](./#prepare)
:::

## Phase 0 — ติดตั้งเครื่องมือพื้นฐาน

ต้องมี 3 อย่าง:

| เครื่องมือ | เวอร์ชัน | ตรวจสอบ |
|-----------|---------|---------|
| **Git** | ล่าสุด | `git --version` |
| **Node.js** | 18 ขึ้นไป (แนะนำ LTS 20+) | `node -v` และ `npm -v` |
| **MySQL Server** | 8.0+ | `mysql --version` |

**ติดตั้ง MySQL 8:**
1. ดาวน์โหลด **MySQL Installer** จาก <https://dev.mysql.com/downloads/installer/>
2. ติดตั้งแบบ *Server only* (หรือ *Custom* → เลือก MySQL Server 8.x)
3. ตั้ง **root password** และจดจำไว้ · เลือก authentication แบบ *Strong Password Encryption*
4. ปล่อย port เป็น **3306**
5. ถ้าพิมพ์ `mysql` แล้วไม่เจอ ให้เพิ่ม `C:\Program Files\MySQL\MySQL Server 8.0\bin` เข้า PATH

::: tip Checkpoint
`node -v`, `git --version`, `mysql --version` ต้องขึ้นครบทั้งสาม
:::

## Phase 1 — สร้างฐานข้อมูลเปล่า

เปิด terminal แล้วเข้า MySQL:
```powershell
mysql -u root -p
```
ใส่ root password จากนั้นรันใน mysql prompt:
```sql
CREATE DATABASE eleave CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
SHOW DATABASES;   -- ต้องเห็น eleave
EXIT;
```

::: info 💡 utf8mb4 สำคัญมาก
ทำให้ภาษาไทยไม่เพี้ยน — อย่าลืมตั้ง charset ตอนสร้าง database
:::

::: tip Checkpoint
เห็น database `eleave` ใน `SHOW DATABASES;`
:::

## Phase 2 — ตั้งค่า Backend

**2.1 ติดตั้ง dependencies** (รันในโฟลเดอร์ `backend`):
```bash
cd backend
npm install
```

**2.2 สร้างไฟล์ `.env`** — คัดลอกจาก `.env.example` แล้วแก้เป็นชุดขั้นต่ำที่รันได้:
```dotenv
DATABASE_URL="mysql://root:ใส่รหัสroot@localhost:3306/eleave"
NODE_ENV="development"
PORT=8000
BACKEND_URL="http://localhost:8000"
FRONTEND_URL="http://localhost:5173"

JWT_SECRET="<สุ่ม>"
JWT_ACCESS_SECRET="<สุ่ม>"
JWT_REFRESH_SECRET="<สุ่ม>"
JWT_EXPIRESIN="1d"
SESSION_SECRET="<สุ่ม>"

# Google OAuth — เว้นว่างไว้ก่อน จะเติมใน Phase 6
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""

# ผู้ดูแลคนแรก — เว้นว่าง (จะใช้ CLI ใน Phase 4 แทน)
BOOTSTRAP_SUPER_ADMIN_EMAIL=""
```

**สุ่มค่า secret** (รัน 4 ครั้ง เอาไปใส่ `JWT_SECRET` / `JWT_ACCESS_SECRET` / `JWT_REFRESH_SECRET` / `SESSION_SECRET`):
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

::: warning รหัส root มีอักขระพิเศษ
ถ้ารหัส root มี `@ # : / ?` ต้อง URL-encode ใน `DATABASE_URL` เช่น `@`→`%40`, `#`→`%23`
ทางง่าย: ตั้งรหัส root เป็นตัวอักษร+ตัวเลขล้วน
:::

::: info key ที่ไม่ต้องใส่ตอนทดสอบ
ระบบ boot ได้โดยไม่ต้องมี: Email (`EMAIL_*`, `OAUTH_*_RMUTI`), `CLOUDINARY_SECRET`, `SHADOW_DATABASE_URL` (ใช้เฉพาะ `prisma migrate dev` ไม่ใช่ `setup`)
:::

::: tip Checkpoint
มีไฟล์ `backend/.env` ครบทุก key ด้านบน
:::

## Phase 3 — สร้าง schema + ข้อมูลหลัก

```bash
npm run setup
```
เท่ากับ `prisma migrate deploy` + `prisma generate` + `seed`
จะสร้าง: **8 roles · 1 องค์กร · 16 แผนก · 5 ประเภทบุคคล · 13 ประเภทการลา · 75 rank · settings**
(**ไม่** สร้าง user / ยอดวันลา / คำขอลา — ปกติ)

**ตรวจผลด้วย Prisma Studio** (GUI ดูตารางในเบราว์เซอร์):
```bash
npx prisma studio
```
เปิด <http://localhost:5555> → ดูตาราง `Role` (8 แถว), `LeaveType` (13), `Department` (16) แล้วปิดด้วย `Ctrl+C`

::: tip Checkpoint
จบด้วย `✅ Seed completed successfully!` และตารางมีข้อมูล
:::

::: danger 🐞 error 1064 ... RENAME INDEX
ฐานข้อมูลเป็น MariaDB < 10.5 → ต้องเปลี่ยนเป็น MySQL 8 / MariaDB 10.5+
:::

## Phase 4 — สร้างผู้ดูแลคนแรก

ใช้ **อีเมล Google จริง** ที่คุณจะล็อกอิน (Gmail ส่วนตัวก็ได้):
```bash
npm run create-super-admin -- --email อีเมลคุณ@gmail.com --first ชื่อ --last สกุล --prefix นาย
```
- ดูก่อนเขียนจริง: เติม `--dry-run`
- รันซ้ำได้ ไม่เพิ่ม role ซ้ำ (idempotent)

::: tip Checkpoint
ขึ้น `✅ ตั้งค่า SUPER_ADMIN ให้ ... เรียบร้อย · roles ปัจจุบัน: USER, ADMIN, SUPER_ADMIN`
:::

## Phase 5 — รัน Backend + Frontend

**5.1 Backend** (เปิด terminal ที่ 1 ค้างไว้):
```bash
cd backend
npm start
```
รอเห็น `Server is running on port 8000`

**5.2 Frontend** (terminal ที่ 2):
```bash
cd frontend
npm install
```
สร้าง `frontend/.env`:
```dotenv
VITE_BACKEND_URL=http://localhost:8000
```

::: info 💡
ตอนรันบน `localhost` ระบบตั้ง API เป็น `http://localhost:8000` ให้อัตโนมัติ — ค่านี้มีผลเฉพาะตอน deploy โดเมนจริง
:::

รัน:
```bash
npm run dev
```
เปิด <http://localhost:5173>

::: tip Checkpoint
เห็น**หน้า Login** ("เข้าสู่ระบบด้วย Google") — ยังกดเข้าไม่ได้จนกว่าจะทำ Phase 6
:::

## Phase 6 — ตั้งค่า Google OAuth ให้ล็อกอินได้จริง

ระบบล็อกอินด้วย Google เท่านั้น จึงต้องสร้าง OAuth Client บน Google Cloud (ทำครั้งเดียว)

**6.1 สร้างโปรเจกต์ + OAuth Client**
1. เข้า <https://console.cloud.google.com/> → สร้างโปรเจกต์ใหม่ (หรือใช้ที่มีอยู่)
2. เมนู **APIs & Services → OAuth consent screen**
   - เลือก **External** → กรอกชื่อแอป, อีเมลติดต่อ
   - ในหัวข้อ **Test users** เพิ่มอีเมล Google ที่คุณจะล็อกอิน (อีเมลเดียวกับ Phase 4)
3. เมนู **APIs & Services → Credentials → Create Credentials → OAuth client ID**
   - Application type: **Web application**
   - **Authorized JavaScript origins:** `http://localhost:5173`
   - **Authorized redirect URIs:** `http://localhost:8000/auth/google/callback` *(ต้องตรงเป๊ะ)*
4. กด Create แล้ว **คัดลอก Client ID และ Client Secret**

**6.2 ใส่ค่าใน `backend/.env`**
```dotenv
GOOGLE_CLIENT_ID="เลขที่คัดลอกมา.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="ค่าที่คัดลอกมา"
```

**6.3 รีสตาร์ท backend** (ที่ terminal ที่ 1 กด `Ctrl+C` แล้ว `npm start` ใหม่)

**6.4 ล็อกอิน** — เปิด <http://localhost:5173> → กด **เข้าสู่ระบบด้วย Google** → เลือกบัญชี Gmail ที่ตั้งไว้ Phase 4
ระบบจะผูกบัญชี Google เข้ากับผู้ใช้ SUPER_ADMIN ให้อัตโนมัติในการล็อกอินครั้งแรก

::: tip Checkpoint
เข้าสู่แดชบอร์ดได้ และเห็นเมนู "ผู้ดูแลระบบ / ผู้ดูแลระดับสูง" ที่แถบซ้าย
:::

::: danger 🐞 ปัญหาที่เจอบ่อยตอน login
- **redirect_uri_mismatch** = redirect URI ใน Google Console ไม่ตรงกับ `http://localhost:8000/auth/google/callback` (ตรวจ http/https, พอร์ต, ตัวสะกด)
- **Access blocked / app not verified** = ยังไม่ได้เพิ่มอีเมลของคุณใน **Test users** ของ consent screen
:::

---

ระบบรันได้แล้ว 🎉 — ทำต่อที่ **[การใช้งานครั้งแรก](./first-use)** เพื่อนำเข้าผู้ใช้และมอบบทบาทผู้อนุมัติ
