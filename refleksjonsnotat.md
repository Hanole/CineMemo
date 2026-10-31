# Refleksjonsnotat

Jeg valgte å lage en nettside der brukeren kan utforske filmer og finne noe å se på. Jeg er veldig glad i film, så jeg syntes det var et passende tema. TMDB ga meg tilgang til både bilder, titler og mer informasjon som kunne vises på en egen detaljside for hver film.

Jeg startet med grunnstrukturen, sidene og noe mockdata før jeg koblet til API-et. Jeg brukte en felles layout med header, main og footer, og delte etter hvert løsningen opp i flere komponenter som MovieCard, MovieResults og MovieSkeleton. Jeg flyttet datainnhenting og resultatvisning til MovieResults fordi det ble mye kode på oversiktssiden. Dette gjorde koden mer oversiktlig.

En av de største utfordringene var å kombinere tekstsøk og sjangerfilter med paginering. Jeg opplevde at noen sider fikk få filmer når sjangerfilteret ble brukt på resultatene fra et tekstsøk. For å løse dette samler jeg tittelresultater fra opptil 250 søkesider før jeg filtrerer dem etter valgt sjanger. Deretter beregnes antall sider på nytt, og det filtrerte utvalget deles opp i sider med opptil 20 filmer. Ulempen er at brede kombinerte søk kan ta lengre tid, og at treff utover grensen på 250 søkesider ikke blir inkludert.

Søk, sjanger og sidetall lagres i URL-en, slik at man kan åpne siden igjen med de samme valgene. Tilbake-lenken fra detaljsiden sendte først brukeren til filmlisten uten søk og sidetall. Det løste jeg ved å sende med adressen til filmlisten når man åpner en film. Da kommer brukeren tilbake til samme søk og side.

CSS-en delte jeg opp i globals.css, loading.css og responsive.css. Det fungerte fint for størrelsen på dette prosjektet. I et større prosjekt ville jeg nok delt den opp i flere filer.

Jeg la også inn skeleton-visninger mens dataene lastes inn, og en egen feilside hvis innholdet ikke kan hentes. Filmer som ikke finnes viser en 404-side.

Jeg har lært en god del om Next.js gjennom prosjektet. Jeg synes det er et godt verktøy som gjør mye av arbeidet enklere. Jeg liker spesielt routingen, og hvordan mappestrukturen og filnavn som page.tsx og loading.tsx bestemmer hva som vises på de ulike sidene. Jeg har også sett at det kan være nyttig å dele opp koden mer når enkelte deler blir store. Med mer tid ville jeg forsøkt å gjøre kombinert søk raskere og testet flere situasjoner. Jeg ville også vært flinkere til å committe underveis, i stedet for å samle mange endringer i én commit.