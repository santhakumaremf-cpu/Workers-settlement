# Worker Settlement Generator — திருவள்ளுவர் டெக்ஸ்டைல்ஸ்

Excel upload → ஒவ்வொரு தொழிலாளிக்கும் தமிழ் ஒப்பந்தம் (ID Act 1947, Sec 18(1)) + சர்வ அடக்க ரசீது → **PDF / Word (.docx)**.

Document generator ஒரு single-file browser app (`Worker_Settlement_Corrected.html`). Excel data browser-லேயே process ஆகும்; worker/Excel data server-க்கு அனுப்பப்படாது. Render-ல் உள்ள சிறிய sync API, Content Edit Mode-ல் Save செய்த template wording-ஐ மட்டும் பல device-களுக்காக சேமிக்கும்.

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

## 🚀 Render: Content cloud sync

The app can run as a static site, but a static site cannot store shared changes. `Content Save` now saves the edited template to a small API service; `Saved Content Load` reads that shared template on any device. Excel worker data is **not** sent to the API. Anyone with the public app link can load the shared wording; only someone with the Render sync password can save or reset it.

### Existing Static Site

Keep the existing Static Site and its URL. Make sure it deploys this repository and the branch containing the latest `Worker_Settlement_Corrected.html` changes, with **Publish Directory** `.`. `render.yaml` describes the Static Site; `render-api.yaml` describes the separate API service.

### Create the sync API

1. Push the latest repo changes to GitHub.
2. Render Dashboard → **New + → Blueprint**; select `santhakumaremf-cpu/Workers-settlement` and the branch containing these changes.
3. Set **Blueprint path** to `render-api.yaml` (keep `render.yaml` for the existing Static Site), then apply it. This creates the `workers-settlement-sync-api` Node service and a 1 GB persistent disk. Render's `starter` service/disk may incur charges.
4. In the new API service, open **Environment** and reveal/copy `TEMPLATE_SYNC_PASSWORD`. Keep it private. The app asks for it when saving or resetting the shared template.
5. The front end expects `https://workers-settlement-sync-api.onrender.com`. If Render shows a different API URL, update `TEMPLATE_CLOUD_API_URL` in `Worker_Settlement_Corrected.html` to that URL plus `/api/template`, then redeploy the Static Site.

If the app's domain changes, update `ALLOWED_ORIGINS` on the API service to the app's exact origin (for example, `https://workers-settlement-zdku.onrender.com`).

## 🖥️ Local use

`index.html`-ஐ double-click செய்தாலே இயங்கும் (Chrome / Edge 131+ recommended). Local/file use அல்லது GitHub Pages-ல் Content Save அந்த browser/device-ல் மட்டும் இருக்கும்; எல்லா device-களுக்கான cloud sync-க்கு Render app + sync API தேவை.

Currently `index.html` redirects to `Worker_Settlement_Corrected.html`. Multi-sheet version file is ready — upload as `index.html` via GitHub web UI (file ~1 MB with offline XLSX, or ~260 KB with CDN XLSX).

## 📁 Files

```
index.html                          ← app entry
Worker_Settlement_Corrected.html    ← full browser app
document-template-from-web.html     ← latest agreement + receipt (from Web-workers-settlement)
server.mjs                          ← Render shared-template API
render.yaml                         ← Render Static Site Blueprint
render-api.yaml                    ← Render API service + persistent disk
package.json / package-lock.json   ← minimal Node runtime metadata
.github/workflows/
.nojekyll
samples/
```

## ⚠️ Notes

- Shared edited template wording Render persistent disk-ல் சேமிக்கப்படும்; cloud save/reset-க்கு `TEMPLATE_SYNC_PASSWORD` தேவை.
- Common details, name fixes, paper size போன்ற பிற settings browser localStorage-ல் இருக்கும்; அவை தானாக device-கள் இடையே sync ஆகாது.
- Excel worker data API-க்கு அனுப்பப்படாது.
- Print: Paper size = app selection, Margins = Default.
- Word font = Latha.
