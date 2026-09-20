# Fardin Faruk — Portfolio

Personal portfolio site for **Fardin Faruk** (Jr. SQA Engineer).  
Built with HTML, Tailwind CSS (CDN), and vanilla JavaScript. Ready for **GitHub Pages**.

## Local preview

Open `index.html` in a browser, or from this folder:

```bash
python3 -m http.server 8080
```

Then visit `http://localhost:8080`.

## Configure

Edit [`js/config.js`](js/config.js):

| Key | Purpose |
|-----|---------|
| `GOOGLE_SCRIPT_URL` | Web App URL from Google Apps Script (contact form) |
| `FACEBOOK_URL` | Your Facebook profile URL |
| `LINKEDIN_URL` | LinkedIn (pre-filled) |
| `GITHUB_URL` | GitHub (pre-filled) |
| `EMAIL` / `PHONE` | Shown on the Contact section |

Replace `assets/profile.jpg` anytime with your preferred photo.

## Contact form → Google Sheet

1. Create a Google Sheet.
2. **Extensions → Apps Script**, paste the code from [`google-apps-script/Code.gs`](google-apps-script/Code.gs).
3. **Deploy → New deployment → Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**
4. Copy the Web App URL into `js/config.js` as `GOOGLE_SCRIPT_URL`.
5. Submit a test message from the site; a `Messages` sheet tab will appear with the rows.

## Deploy on GitHub Pages

1. Create a new repository on GitHub (e.g. `Fardin957.github.io` or `portfolio`).
2. Push this folder to the `main` branch:

```bash
git init
git add .
git commit -m "Add portfolio site"
git branch -M main
git remote add origin https://github.com/Fardin957/<REPO_NAME>.git
git push -u origin main
```

3. Repo **Settings → Pages → Build and deployment**
   - Source: **Deploy from a branch**
   - Branch: `main` / folder `/ (root)`
4. After a minute, open:
   - `https://Fardin957.github.io/<REPO_NAME>/`  
   - or `https://Fardin957.github.io/` if the repo is named `Fardin957.github.io`

## Sections

- **Home** — name, role, photo  
- **About** — experience & education  
- **Skills** — from CV  
- **Projects** — ZiCharge, FastPay, Card Selling + sample GitHub works  
- **Contact** — form to Google Sheets  
- **Footer** — Facebook, LinkedIn, GitHub  

## License

Personal portfolio — use and modify freely for your own site.
