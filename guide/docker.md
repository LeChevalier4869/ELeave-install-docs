# ติดตั้งด้วย Docker

ยก **MySQL 8 + backend + frontend** ขึ้นทั้งชุด โดยไม่ต้องติดตั้ง Node/MySQL ในเครื่องเอง
เหมาะกับการทดสอบ "ติดตั้งครั้งแรก" ซ้ำ ๆ (ล้างแล้วเริ่มใหม่ได้ด้วยคำสั่งเดียว)

**ไฟล์ที่เกี่ยวข้อง:** `backend/Dockerfile`, `frontend/Dockerfile`, `backend/docker-compose.yml`

## สิ่งที่ต้องมี
- **Docker Desktop** (Windows/Mac) หรือ Docker Engine + Compose plugin (Linux) — เช็ค `docker --version`
- **ซอร์สโค้ด** ทั้ง 2 repo (compose build จากซอร์ส ยังไม่ได้ใช้ image สำเร็จรูป)

clone ให้อยู่ในโฟลเดอร์ชื่อ `backend`/`frontend`:

```bash
git clone https://github.com/LeChevalier4869/-Backend-Faculty-of-Engineering-Leave-System.git backend
git clone https://github.com/LeChevalier4869/-Frontend-Faculty-of-Engineering-Leave-System.git frontend
```
(รายละเอียดเพิ่มเติม: [เตรียมโปรเจกต์](./#prepare))

## ภาพรวม service

| service | port (host) | หน้าที่ |
|---------|-------------|---------|
| frontend (nginx) | 8080 | เว็บ (Vite build) |
| backend (Node) | 8000 | API + Prisma |
| db (mysql:8) | – (ภายใน 3306) | ฐานข้อมูล (volume แยก) |

::: info
compose override `DATABASE_URL` / `NODE_ENV` / `FRONTEND_URL` ให้ชี้ db container → ทดสอบติดตั้งใหม่ได้โดย**ไม่แตะ DB จริงใน `.env`**
:::

## ขั้นตอน (รันในโฟลเดอร์ `backend`)

```bash
cp .env.example .env      # เติมค่า secret จริง (OAuth/JWT/Cloudinary/email)

docker compose build
docker compose up -d db                                    # รอจน (healthy) — ดูด้วย docker compose ps
docker compose run --rm backend npm run setup              # migrate + generate + seed
docker compose run --rm backend npm run create-super-admin -- --email you@rmuti.ac.th
docker compose up -d                                       # ยกทั้ง stack
```
เปิด <http://localhost:8080> (health: <http://localhost:8000/health>)

::: tip Checkpoint
`docker compose ps` เห็น db/backend/frontend รันอยู่ และเปิดเว็บเห็นหน้า Login
:::

จากนั้นทำต่อที่ **[การใช้งานครั้งแรก](./first-use)** (นำเข้าผู้ใช้ + มอบบทบาท) เหมือนกับแบบ Native

## ล้างเริ่มใหม่ (จำลองติดตั้งเครื่องใหม่)

```bash
docker compose down -v    # -v = ลบ volume DB ด้วย → เริ่มจากศูนย์จริง ๆ
```

## ขึ้น production จริง — สิ่งที่ต้องเปลี่ยน

- `NODE_ENV=production` (ต้องมี **HTTPS** เพราะ session cookie เป็น secure)
- build frontend ด้วยโดเมน backend จริง:
  ```bash
  docker build --build-arg VITE_BACKEND_URL=https://api.example.ac.th -t eleave-frontend ../frontend
  ```
- `DATABASE_URL` ชี้ DB จริง (แนะนำ managed MySQL แยกจาก container)
- **registry workflow:** build → `docker push` → บน server เปลี่ยน `build:` เป็น `image:` ใน compose (server ไม่ต้องมี source)

## หมายเหตุสำหรับ Kubernetes (ถ้า ops ใช้)

- `GET /health` ใช้เป็น liveness/readiness probe ได้เลย
- รัน migration เป็น **Job/initContainer ครั้งเดียว** ไม่ใช่ให้ทุก replica รัน
- `uploads/` เขียนลง disk → single-server ใช้ volume; **multi-replica ต้องใช้ object storage** (รูปโปรไฟล์ production ใช้ Cloudinary อยู่แล้ว)
- secrets ส่งผ่าน env/Secret ไม่ฝังใน image
