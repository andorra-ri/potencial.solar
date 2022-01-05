![potencial solar](https://user-images.githubusercontent.com/12972543/148255889-b0fac770-7ab0-4d39-8cb9-8c574bcc572c.jpg)

[![Netlify Status](https://api.netlify.com/api/v1/badges/84ece09d-3a84-42dc-bdf4-e60e05d33b6a/deploy-status)](https://app.netlify.com/sites/solarpvad/deploys)

Visualiztació del potencial energètic, la rendibilitat econòmica i els beneficis mediambientals d’hipotètiques instal·lacions d’energia solar en les cobertes dels edificis d'Andorra.

La irradiació útil mitjana i geometria dels edificis es llegeix d'un dataset allotjat a Carto mitjançant la seva SQL API, i es mapeja sobre Mapbox GL. Tots els càlculs derivats i operacions espacials es realitzen in situ al browser de l'usuari.

## Contribuir

Clonar el repositori i instal·lar dependències

```bash
git clone https://github.com/obsa-and/solarpvad.git
cd solarpvad
npm install
```

Crear fitxer `.env` amb els tokens d'accés a Carto i Mapbox

```env
VITE_MAPBOX_TOKEN=
VITE_CARTO_TOKEN=
```

Llençar entorn de desenvolupament

```bash
npm run dev
```
