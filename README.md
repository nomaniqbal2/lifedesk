# NomanLifeDesk (PWA)

Folder ki files: `index.html`, `manifest.json`, `service-worker.js`, `icons/`.
Ye sab ek hi folder mein rehni chahiye.

## 1) Free hosting par daalo (HTTPS zaroori hai)
GitHub Pages (sab se aasaan):
1. github.com par free account banao, naya repository banao (naam: `lifedesk`, Public).
2. "Add file > Upload files" se **folder ke andar ki saari files** (icons folder samet) upload karo, Commit karo.
3. Repository > Settings > Pages > Source: "Deploy from a branch", branch `main`, folder `/ (root)`, Save.
4. 1-2 minute baad link milega: `https://USERNAME.github.io/lifedesk/`

Netlify ya Cloudflare Pages bhi chalte hain (folder drag-drop / upload).
Hamesha **isi ek link** se app kholo aur install karo, kyunke data har address ka alag hota hai.

## 2) Install karo
- Android Chrome: link kholo > menu (3 dots) > "Install app" / "Add to Home screen".
- PC Chrome/Edge: address bar ke right mein install icon > Install.
- iPhone Safari: Share > "Add to Home Screen".
App ke andar Settings > "Install this app" button bhi hai.

## 3) Google Drive backup on karna (free, ads nahi)
1. console.cloud.google.com > new project banao.
2. "APIs & Services > Library" mein **Google Drive API** Enable karo.
3. "OAuth consent screen" (ya Google Auth Platform): User type **External**, app name `NomanLifeDesk`, apna email daalo. Test users mein apna Gmail add karo.
4. "Credentials > Create credentials > OAuth client ID": type **Web application**.
   "Authorized JavaScript origins" mein sirf apna origin daalo, jaise `https://USERNAME.github.io` (path `/lifedesk` nahi likhna).
5. Jo **Client ID** mile (`xxxx.apps.googleusercontent.com`) use `index.html` mein is line mein paste karo:
   `var GDC={clientId:''};`  ->  `var GDC={clientId:'YAHAN-PASTE'};`
6. File dobara upload karo, `service-worker.js` mein `VERSION = 'v1'` ko `'v2'` kar do (taake update aaye).
7. App > Settings > "Backup to Drive now". Backup aap ke Drive ke hidden app folder mein jata hai, sirf ye app usay dekh sakti hai.

Note: Auto backup app kholne par chalta hai (agar pichla backup 6 ghante se purana ho). Google ka token 1 ghante ka hota hai, is liye kabhi browser sign-in popup rok sakta hai. Us waqt "Backup to Drive now" dabao.

## 4) APK chahiye to
Hosting ke baad **pwabuilder.com** par apna link daalo > Android package download karo.

## Update kaise karo
`index.html` badlo, upload karo, `service-worker.js` mein VERSION barhao (v2, v3...).
