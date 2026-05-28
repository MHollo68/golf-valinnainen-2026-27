# ⛳ Golfvalinnaisryhmät – Toimintakalenteri 2026–2027

Yhteinen toimintakalenteri golfvalinnaisryhmille (8 lk & 9 lk).  
Kokoontuminen: **keskiviikkoisin klo 13:15–15:00**

---

## 🚀 Käyttöönotto Netlifyssä (ilmainen, ~5 min)

### Vaihtoehto A – Suoraan selaimesta (helpoin)

1. Mene osoitteeseen **https://app.netlify.com**
2. Kirjaudu tai luo ilmainen tili
3. Vedä tämä **koko kansio** sivuston "Add new site" → "Deploy manually" -kohtaan
4. Netlify antaa osoitteen muodossa `https://random-name.netlify.app`
5. Voit vaihtaa osoitteen: Site settings → Domain management → Change site name

### Vaihtoehto B – GitHub-kautta (suositeltava, päivitykset helpompi)

1. Luo GitHub-tili ja uusi repository
2. Lataa tiedostot repositoryyn
3. Netlifyssä: "Add new site" → "Import from Git" → valitse repository
4. Build settings jää tyhjäksi (staattinen sivu)
5. Deploy!

---

## 👥 Yhteiskäyttö

Kun sivu on Netlifyssä:
- **Jaa URL** kaikille ohjaajille
- Kaikki voivat muokata samaa kalenteria
- Tiedot tallentuvat **Netlify Blobsiin** (pilveen) automaattisesti
- Varmuuskopio tallentuu myös selaimeen (localStorage)

---

## 📁 Tiedostorakenne

```
golf-kalenteri/
├── index.html                  ← Kalenteri-sovellus
├── netlify.toml                ← Netlify-asetukset
├── package.json                ← Riippuvuudet
└── netlify/
    └── functions/
        └── calendar.js         ← Tietojen tallennus pilveen
```

---

## ✏️ Muokkaus

Avaa `index.html` tekstieditorissa. Kaikki sisältö on yhdessä tiedostossa.
