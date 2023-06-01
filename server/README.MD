OK deci cum functioneaza:
- in server.js se uita la ce fel de request are si in fct de asta o sa apeleze functiile din controllers(momentan avem doar user controller)
- in queries se fac queryurile la baza de date, o sa schimb oleaca structura sa fac cu user repository, book repository etc in loc sa fie toate queriurile amestecate in acelasi loc
- in models: momentan in usermodel pe langa clasa de tip user am si niste functii care apeleaza queriurile din queries (o sa tb sa mai fac niste schimbari ca am obs acum probleme)
- in controllers: controllerele o sa apeleze functiile din repositories si in functie de rezultat o sa genereze un raspuns pe care il trimit serverului pt ca fi trimis la client
- ex de functionare: GET /users/getAll -> in server.js apelez functia getAllusers din controller; in controller se apeleaza mai departe o fct getAllusers din user model (ideal ar fi tb
 sa fie in user repository functia nu in user model) -> next,usermodel apeleaza un query din queries care efectiv face un select si returneaza o lista de useri. however nu returneaza o lista
 de obiecte de tip User, ci o lista de obiecte de tip Object for some reason dar vad eu cum rezolv, nu ne incurca prea tare.
