# Worker Settlement Generator — திருவள்ளுவர் டெக்ஸ்டைல்ஸ்

Excel upload → ஒவ்வொரு தொழிலாளிக்கும் தமிழ் ஒப்பந்தம் (ID Act 1947, Sec 18(1)) + சர்வ அடக்க ரசீது → **PDF / Word (.docx)**.

Single-file web app (`index.html`). Server இல்லை, database இல்லை — browser-ல் மட்டுமே இயங்கும்.
Excel data எங்கும் upload ஆகாது (privacy safe).

## 🌐 Live (GitHub Pages)

```
https://<username>.github.io/<repo-name>/
```

## ✨ Features

| | |
|---|---|
| 📂 Excel upload | Header-பெயர் வைத்து columns கண்டுபிடிக்கும் (order மாறினாலும் OK); multi-line Father/Husband & Address cell support |
| 🔤 English → Tamil | பெயர்/ஊர் automatic transliteration (~2000-word dictionary) + ✏️ user-editable பெயர் திருத்தங்கள் |
| 🖨️ Print / PDF | A4 / Legal / Letter; ஒவ்வொரு sheet-லும் "பக்கம் N / மொத்தம்" |
| 📝 Word export | இந்த தொழிலாளி (.docx) அல்லது எல்லோருக்கும் ஒரே ZIP |
| 📝 பொது விவரங்கள் | நிர்வாக பிரதிநிதிகள், ஒப்பந்த தேதி, சாட்சிகள் — ஒரு முறை type செய்தால் போதும் |
| ✏️ Content Edit Mode | Document wording-ஐ நேரடியாக மாற்றி Save |
| ⚙️ Settings Backup / Restore | Settings-ஐ .json-ஆக எடுத்து வேறு computer-ல் Restore |

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

> Git இல்லாமல்: GitHub repo page → **Add file → Upload files** → இந்த folder-ல் உள்ள எல்லா files-ஐயும் drag & drop → Commit. (`.github/workflows/deploy.yml`, `.nojekyll` உட்பட.)

## 🖥️ Local use

`index.html`-ஐ double-click செய்தாலே இயங்கும் (Chrome / Edge 131+ recommended — page number footer-க்கு).

## 📁 Files

```
index.html                       ← the whole app
.github/workflows/deploy.yml     ← auto-deploy to GitHub Pages
.nojekyll                        ← serve files as-is
samples/
  Sample_Worker_Settlement_Data.xlsx   sample Excel (app-ல் Download button-லும் உள்ளது)
  Test_Real_Layout.xlsx                real layout test file
  Sample_Print_A4.pdf / _Legal.pdf     PDF output samples
  Sample_Word_*.docx                   Word output samples
```

## ⚠️ Notes

- Settings (பொது விவரங்கள், பெயர் திருத்தங்கள், Content Edit, Paper Size) browser-ன் localStorage-ல் சேமிக்கப்படும் — அதே browser-ல் மட்டும். வேறு computer-க்கு **⚙️ Settings Backup → 📤 Restore** பயன்படுத்தவும்.
- Print dialog: **Paper size** = app-ல் தேர்ந்தெடுத்த அதே size, **Margins** = Default.
- Word file font = Latha (Windows default Tamil font).
