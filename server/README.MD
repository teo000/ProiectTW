OK deci cum functioneaza:
- in mainServer.js se uita la ce fel de request are si in fct de asta o sa apeleze functiile din controllers(momentan avem doar user controller)
- in databaseConnection am un connection pool cu conexiuni la baza de date
- in repositories se fac operatiile CRUD (create, read = get,update, delete); in fiecare operatie, iau o conexiune din databaseConnection.pool si fac un query.
- in models : am obiectele cu care lucram (momentan doar useR)
- in controllers: controllerele o sa apeleze functiile din repositories si in functie de rezultat o sa genereze un raspuns pe care il trimit serverului pt ca fi trimis la client
- ex de functionare: GET /users/getAll -> in mainServer.js apelez functia getAllusers din controller; in controller se apeleaza mai departe o fct getAllusers din repository-> next,repository face
un query la baza de date  si returneaza o lista de useri. (returneaza acesti useri ca objects, nu ca obiecte de tipul User din UserModel dar e irelevant);

PENTRU BAZA DE DATE
- te conectezi din webstorm sau vscode la baza ta de date
- creezi tabelul de books asa cum scrie in script
- dai import la csv in tabel si vezi sa fie un match bun pe coloane(sa mapeze bine coloanele din tabel la alea din csv)
- rulezi restul scriptului si it should work
