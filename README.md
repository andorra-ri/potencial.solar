![potencial solar](https://user-images.githubusercontent.com/12972543/148255889-b0fac770-7ab0-4d39-8cb9-8c574bcc572c.jpg)

[![Netlify Status](https://api.netlify.com/api/v1/badges/84ece09d-3a84-42dc-bdf4-e60e05d33b6a/deploy-status)](https://app.netlify.com/sites/solarpvad/deploys)

Visualització del potencial energètic, la rendibilitat econòmica i els beneficis mediambientals d’hipotètiques instal·lacions d’energia solar en les cobertes dels edificis d'Andorra.

La irradiació útil mitjana i geometria dels edificis es llegeix d'un dataset allotjat a Carto mitjançant la seva SQL API, i es mapeja sobre Mapbox GL. Tots els càlculs derivats i operacions espacials es realitzen in situ al browser de l'usuari.

## Dades

Totes les dades són allotjades a [Supabase](https://supabase.com), en una base de dades PostgreSQL amb el plugin PostGIS. Supabase permet l'accés a través d'una API que mapeja directament la PostgreSQL a una resposta JSON, sense necessitat de crear cap proxy o middleware. Permet també la connexió directa des de software GIS.

## Contribuir

Clonar el repositori i instal·lar dependències

```bash
git clone https://github.com/andorra-ri/potencial.solar.git
cd potencial.solar
npm install
```

Crear fitxer `.env` amb els tokens d'accés a Supabase i Mapbox

```env
VITE_MAPBOX_TOKEN=
VITE_SUPABASE_URL=
VITE_SUPABASE_TOKEN=
```

Llençar entorn de desenvolupament

```bash
npm run dev
```

## Desplegament

El projecte es desplega automàticament a Netlify cada vegada que es fa un push a la branca principal. :tada:

S'han de [configurar les variables d'entorn](https://docs.netlify.com/environment-variables/get-started/#update-variables-with-the-netlify-ui) amb els nous tokens només si aquests han canviat.
