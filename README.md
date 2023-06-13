# ProiectTW

Savin Miruna, Tudurache Teodora-Otilia



Structura:
- client : nu prea mai e nimic acolo, doar html-uri si css uri care tb mutate
- public : css, scripts si imagini pe care frontendul e posibil sa le ceara cand incarca html-urile
- views : html + ejs (template de html)
- frontend server : cand pornesti asta si intri pe o pagina practic "porneste" aplicatia, adica mereu cand vrei sa schimbi o pagina se face request la frontend server, care aduce html-urile, css-urie, imaginile etc.
- pe urma pt a se incarca datele, clientul face request si la backend (Main Server) care aduce datele necesate pt a popula aplicatia. orice request care tine de business logic se duce la Main Server
- authentication : microserviciul de autentificare: el genereaza tokeni (JWT) pentru utilizatori si ii pune in cookies. tot aici se da refresh la tokeni si se invalideaza tokenii cand userul face logout
- helpers: autentificarea tokenilor din cookierurile care sunt atasate in requesturile de la client (browserul automat ataseaza cookieurile astea nu tb tu sa faci nmc);
- routes : am schimbat oleaca arthitectura in main server, adica in loc sa dea handle la request in functie de tip (get, post....) le da un reroute in functie de "serviciul" care se ocupa de ele(books, users, etc);
- in routes o sa vezi ca requesturile sunt wrapped intr-o functie care autentifica tokenul dar la inceput cat faci api-ul poti sa pui funcitile ca atare si ignora asta de autentificare pt ca mai mult te complici.
