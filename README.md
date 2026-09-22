# Worker Settlement Generator — திருவள்ளுவர் டெக்ஸ்டைல்ஸ்

Excel upload → ஒவ்வொரு தொழிலாளிக்கும் தமிழ் ஒப்பந்தம் (ID Act 1947, Sec 18(1)) + சர்வ அடக்க ரசீது → **PDF / Word (.docx)**.

Single-file web app (`index.html`). Server இல்லை, database இல்லை — browser-ல் மட்டுமே இயங்கும்.
Excel data எங்கும் upload ஆகாது (privacy safe).

## 🌐 Live (GitHub Pages)

```
https://<username>.github.io/<repo-name>/
```

Also: https://workers-settlement.vercel.app

## ✨ Features

| | |
|---|---|
| 📂 Excel upload | Header-பெயர் வைத்து columns கண்டுபிடிக்கும் (order மாறினாலும் OK); multi-line Father/Husband & Address cell support |
| 📑 **Multi-sheet Excel** | Excel-ல் பல sheets இருந்தால் **Sheet dropdown**-ல் ஒவ்வொன்றையும் தனித்தனியாக select செய்து print / export செய்யலாம் |
| 🔤 English → Tamil | பெயர்/ஊர் automatic transliteration (~2000-word dictionary) + ✏️ user-editable பெயர் திருத்தங்கள் |
| 🖨️ Print / PDF | A4 / Legal / Letter; ஒவ்வொரு sheet-லும் "பக்கம் N / மொத்தம்" |
| 📝 Word export | இந்த தொழிலாளி (.docx) அல்லது எல்லோருக்கும் ஒரே ZIP |
| 📝 பொது விவரங்கள் | நிர்வாக பிரதிநிதிகள், ஒப்பந்த தேதி, சாட்சிகள் — ஒரு முறை type செய்தால் போதும் |
| ✏️ Content Edit Mode | Document wording-ஐ நேரடியாக மாற்றி Save |
| ⚙️ Settings Backup / Restore | Settings-ஐ .json-ஆக எடுத்து வேறு computer-ல் Restore |

## 📄 Document content (synced from Web-workers-settlement)

Latest agreement + receipt wording is in:

- **`document-template-from-web.html`**

This matches the document used in the React app (`Web-workers-settlement`).
Copy the HTML inside the two `<div class="a4-page">` blocks into `Worker_Settlement_Corrected.html` if you want the main offline file updated too.

## 🚀 Deploy to GitHub Pages (one time)

1. GitHub-ல் **New repository** (எ.கா. `worker-settlement`) — Public.
2. இந்த folder-ஐ push செய்யவும்:
   ```bash
   git init
   git add .
   git commit -m "Worker Settlement Generator"
   git branch -M main
   git remote add origin https://github.com/<username>/<repo-name>.git
   git push -u origin main
   ```
3. Repo → **Settings → Pages → Build and deployment → Source: “GitHub Actions”**.
4. **Actions** tab-ல் "Deploy to GitHub Pages" workflow முடிந்ததும் (~1 நிமிடம்)
   `https://<username>.github.io/<repo-name>/` தயார்.

அடுத்த முறை `index.html` மாற்றி push செய்தால் தானாக update ஆகும்.

> Git இல்லாமல்: GitHub repo page → **Add file → Upload files** → இந்த folder-ல் உள்ள எல்லா files-ஐயும் drag & drop → Commit.

## 🖥️ Local use

`index.html`-ஐ double-click செய்தாலே இயங்கும் (Chrome / Edge 131+ recommended).

Currently `index.html` redirects to `Worker_Settlement_Corrected.html`. Multi-sheet version file is ready — upload as `index.html` via GitHub web UI (file ~1 MB with offline XLSX, or ~260 KB with CDN XLSX).

## 📁 Files

```
index.html                          ← app entry
Worker_Settlement_Corrected.html    ← full offline app
document-template-from-web.html     ← latest agreement + receipt (from Web-workers-settlement)
.github/workflows/
.nojekyll
samples/
```

## ⚠️ Notes

- Settings browser localStorage-ல் சேமிக்கப்படும்.
- Print: Paper size = app selection, Margins = Default.
- Word font = Latha.
