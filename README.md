<p align="center"><a href="https://laravel.com" target="_blank"><img src="https://raw.githubusercontent.com/laravel/art/master/logo-lockup/5%20SVG/2%20CMYK/1%20Full%20Color/laravel-logolockup-cmyk-red.svg" width="400" alt="Laravel Logo"></a></p>

<p align="center">
<a href="https://github.com/laravel/framework/actions"><img src="https://github.com/laravel/framework/workflows/tests/badge.svg" alt="Build Status"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/dt/laravel/framework" alt="Total Downloads"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/v/laravel/framework" alt="Latest Stable Version"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/l/laravel/framework" alt="License"></a>
</p>

## About Laravel

Laravel is a web application framework with expressive, elegant syntax. We believe development must be an enjoyable and creative experience to be truly fulfilling. Laravel takes the pain out of development by easing common tasks used in many web projects, such as:

- [Simple, fast routing engine](https://laravel.com/docs/routing).
- [Powerful dependency injection container](https://laravel.com/docs/container).
- Multiple back-ends for [session](https://laravel.com/docs/session) and [cache](https://laravel.com/docs/cache) storage.
- Expressive, intuitive [database ORM](https://laravel.com/docs/eloquent).
- Database agnostic [schema migrations](https://laravel.com/docs/migrations).
- [Robust background job processing](https://laravel.com/docs/queues).
- [Real-time event broadcasting](https://laravel.com/docs/broadcasting).

Laravel is accessible, powerful, and provides tools required for large, robust applications.

## Learning Laravel

Laravel has the most extensive and thorough [documentation](https://laravel.com/docs) and video tutorial library of all modern web application frameworks, making it a breeze to get started with the framework.

You may also try the [Laravel Bootcamp](https://bootcamp.laravel.com), where you will be guided through building a modern Laravel application from scratch.

If you don't feel like reading, [Laracasts](https://laracasts.com) can help. Laracasts contains thousands of video tutorials on a range of topics including Laravel, modern PHP, unit testing, and JavaScript. Boost your skills by digging into our comprehensive video library.

## Laravel Sponsors

We would like to extend our thanks to the following sponsors for funding Laravel development. If you are interested in becoming a sponsor, please visit the [Laravel Partners program](https://partners.laravel.com).

### Premium Partners

- **[Vehikl](https://vehikl.com)**
- **[Tighten Co.](https://tighten.co)**
- **[Kirschbaum Development Group](https://kirschbaumdevelopment.com)**
- **[64 Robots](https://64robots.com)**
- **[Curotec](https://www.curotec.com/services/technologies/laravel)**
- **[DevSquad](https://devsquad.com/hire-laravel-developers)**
- **[Redberry](https://redberry.international/laravel-development)**
- **[Active Logic](https://activelogic.com)**

## Contributing

Thank you for considering contributing to the Laravel framework! The contribution guide can be found in the [Laravel documentation](https://laravel.com/docs/contributions).

## Code of Conduct

In order to ensure that the Laravel community is welcoming to all, please review and abide by the [Code of Conduct](https://laravel.com/docs/contributions#code-of-conduct).

## Security Vulnerabilities

If you discover a security vulnerability within Laravel, please send an e-mail to Taylor Otwell via [taylor@laravel.com](mailto:taylor@laravel.com). All security vulnerabilities will be promptly addressed.

## License

The Laravel framework is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
<<<<<<< HEAD


Siap 🔥 ini gue buatin README lengkap & rapi buat project lu.
Tinggal copy-paste ke `README.md`.

---

# 🧠 Sequiz – AI Powered Trivia Platform

Sequz adalah aplikasi trivia berbasis Laravel yang menggunakan AI (Gemini / DeepSeek) untuk generate soal secara otomatis serta sistem OTP email untuk verifikasi user.

---

# 🚀 Installation Guide

## 1️⃣ Clone Project

```bash
git clone <repository-url>
cd sequiz-main
```

---

## 2️⃣ Install Dependencies

### Install PHP Dependencies

```bash
composer install
```

### Install Node Dependencies

```bash
npm install
```

---

## 3️⃣ Setup Environment

Copy file `.env.example` menjadi `.env`

```bash
cp .env.example .env
```

Generate application key:

```bash
php artisan key:generate
```

---

# 🗄 Database Setup

Project ini default menggunakan SQLite.

## 1️⃣ Buat File Database

Buat file kosong:

```
database/database.sqlite
```

Atau via terminal:

```bash
touch database/database.sqlite
```

Pastikan di `.env`:

```env
DB_CONNECTION=sqlite
```

---

## 2️⃣ Jalankan Migration

```bash
php artisan migrate
```

---

# ▶️ Running the Project

## Jalankan Laravel Server

```bash
php artisan serve
```

## Jalankan Vite (Frontend)

```bash
npm run dev
```

Buka di browser:

```
http://localhost:8000
```

---

# 📧 Email OTP Configuration (SMTP Gmail)

Agar OTP bisa terkirim ke email user saat registrasi, atur bagian ini di `.env`:

```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your_email@gmail.com
MAIL_PASSWORD=your_app_password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=your_email@gmail.com
MAIL_FROM_NAME="Sequz"
```

---

## 🔐 Cara Mendapatkan Gmail App Password

1. Masuk ke Google Account
2. Aktifkan **2-Step Verification**
3. Masuk ke **App Passwords**
4. Pilih:

   * App → Mail
   * Device → Other
5. Generate password
6. Gunakan password 16 digit tersebut sebagai `MAIL_PASSWORD`

⚠️ Jangan gunakan password Gmail biasa.

---

## Setelah Update `.env`

Wajib jalankan:

```bash
php artisan config:clear
php artisan cache:clear
php artisan config:cache
```

---

# 🤖 AI Trivia API Configuration

Project ini menggunakan AI untuk generate soal trivia.

## Jika Menggunakan Gemini API

Tambahkan di `.env`:

```env
GEMINI_API_KEY=your_gemini_api_key
```

Cara mendapatkan API Key:

1. Buka: [https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)
2. Generate API key
3. Copy dan paste ke `.env`

---

## Jika Menggunakan DeepSeek API (Opsional)

Tambahkan di `.env`:

```env
DEEPSEEK_API_KEY=your_deepseek_api_key
DEEPSEEK_BASE_URL=https://api.deepseek.com
```

Pastikan controller sudah disesuaikan dengan endpoint DeepSeek.

---

## Setelah Tambah API Key

Jalankan:

```bash
php artisan config:clear
php artisan cache:clear
php artisan config:cache
```

---

# ⚠️ Important Notes

* Jangan pernah commit file `.env`
* Jangan expose API key ke frontend
* Semua AI request harus melalui backend Laravel
* Pastikan queue worker berjalan jika menggunakan queue

Jika menggunakan queue:

```bash
php artisan queue:work
```

---

# 🛠 Troubleshooting

### OTP tidak terkirim?

* Pastikan SMTP sudah benar
* Gunakan App Password Gmail
* Cek folder spam
* Cek `storage/logs/laravel.log`
* MAIL_MAILER=smtp
* MAIL_SCHEME=null
* MAIL_HOST=smtp.gmail.com
* MAIL_PORT=587
* MAIL_USERNAME=user@gmail.com(ganti real)
* MAIL_PASSWORD=myaccount.google.com->search->app password->mail->copy password
* MAIL_FROM_ADDRESS="hello@example.com"
* MAIL_FROM_NAME="${APP_NAME}"



### API Key Missing?

* Pastikan API key sudah ditambahkan di `.env`
* GEMINI_API_KEY=AIza***********************
* Jalankan `php artisan config:clear`

---

# 👨‍💻 Tech Stack

* Laravel
* Vite
* SQLite
* Gmail SMTP
* Gemini / DeepSeek AI API

---
=======
"# sequiz" 
>>>>>>> aad07abf91580bae6e5505dedcb77f0cd6e15b9b
