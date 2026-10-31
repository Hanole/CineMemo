# CINEMEMO

CineMemo er en nettside for personenr som ønsker å utforske filmer og finne noe å se på.

På nettsiden kan brukeren:
- Utforske populære filmer.
- Søke etter filmtittel og filtrere etter sjanger.
- Bla mellom resultatsidene.
- Åpne en film for å se flere detaljer som handling, regissør, skuespillere, spilletid og sjangre.
- Gå tilbake til filmlisten med samme søk, sjanger og sidetall.

Prosjektet bruker Next.js, TypeScript og vanlig CSS.

Data som filmenes informasjon og bilder hentes fra The Movie Database (TMDB): https://www.themoviedb.org/

## Installasjon og oppstart

Du trenger node.js og npm.
1. Last ned eller clone prosjektet, og åpen mappen i terminalen.
2. Installer ved å kjøre ```npm install```
3. Opprett en fil som heter `.env.local`i root-mappen.
4. Legg deretter inn din egen TMDB-token.
```env
TMDB_API_KEY=her_legges_din_egen_api_token
```
5. Start deretter serveren ved å kjøre ```npm run dev```
6. Åpne localhost:3000 i nettleseren.

### TMDB Token
Min egen token følger ikke med i prosjektet.

For å kjøre nettsiden må du opprette en bruker TMDB og registrere API-tilgang gjennom API-delen i kontoinnstillingene. Kopier verdien som heter «API Read Access Token», og legg den i `.env.local` som vist over.

Det er variabelen API Read Access Token som skal hentes ut.

## Kjente begrensninger

### Kombinert tekstsøk og sjangerfiltrering
Dersom man kombinerer tekstsøk og sjangerfilter henter nettsiden opptil 250 sider fra TMDB. Filmene samles og filtreres etter valgt sjanger før resultatet deles opp i sider med 20 filmer. Dersom man gjør vage søk, for eksempel "the" eller "of", kan det derfor ta lengre tid. En loading-state(skeleton) vises mens resultatet lastes inn.

Hvis søket har mer enn 250 sider, blir resultatene utovver dette ikke inkluddert.

### Andre begrensninger

Noen filmer mangler plakat, dato eller annen info.ø Nettsiden viser da alternativ tekst når det mangler opplysninger. 

Nettsiden er avhengig av at TMDB er oppe og går, samt at token er gyldig.

Dersom du søker etter `test-error` utløses det en test-side for feilhåndtering.

## Styling

CSS ble fordelt på tre filer.
- `global.css`: denne gjelder for det grunnleggende på sidene og i komponentene.
- `loading.css`: for loading/skeletons
- `responsive.css`: for den responsive delen, for ulike oppløsninger.
