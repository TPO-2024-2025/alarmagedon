
## 📃 Napredno upravljanje varnosti pametnega doma

## 💁  Skupina 19: Anej Tomplak, Enej Smole, Ena Zorič, Nikola Kokotović

## 1 Uvod

### 1.1 Opis poročila


Namen tega poročila je predstaviti trenutno stanje razvoja našega sistema za pametno varovanje doma. Poročilo zajema dosežke iz trenutne iteracije, kjer smo se osredotočili predvsem na zasnovo in načrtovanje arhitekture sistema, ki vključuje vse ključne funkcionalnosti, potrebne za varno, zanesljivo in uporabniku prijazno uporabo.

V poročilu je najprej predstavljen **pregled ciljev in rezultatov trenutne iteracije**, vključno s pomembnejšimi **spremembami v zasnovi sistema**. Sledi podroben opis sistema, kjer smo s pomočjo **razrednih diagramov**, **sekvenčnih diagramov** in različnih **arhitekturnih pogledov** (logični, procesni, razvojni) modelirali strukturo sistema. Uporabljeni so bili standardi modeliranja (UML in PlantUML), kar omogoča boljšo preglednost in nadaljnjo razširljivost sistema.

Poročilo služi kot osnova za implementacijo v naslednjih fazah projekta, saj zajema vse ključne komponente, njihove povezave ter predvidene tokove podatkov in dogodkov v sistemu.


### 1.2 Poudarki
 

V tej iteraciji smo se osredotočili na načrtovanje in zasnovo arhitekture sistema. Glavni cilj je bil določiti strukturo komponent, njihove povezave in funkcionalnosti, ki jih bo sistem nudil končnim uporabnikom. Med najpomembnejšimi dosežki te faze so:

- izdelava podrobnega opisa sistema in ključnih funkcionalnosti spletne aplikacije,
- razvoj razrednih diagramov za vse glavne funkcionalnosti (registracija, prijava, upravljanje sistema ipd.),
- modeliranje zaporedij interakcij s pomočjo sekvenčnih diagramov,
- uporaba arhitekturnih pogledov (logični, procesni, razvojni, fizični) po modelu 4+1,
- priprava paketnih diagramov in predstavitev komunikacije med komponentami,
- določitev ključnih vlog, entitet in vmesnikov.

Na ta način smo ustvarili trdne temelje za naslednje faze razvoja sistema, kjer bomo izvedli implementacijo načrtovanih komponent.

---

### 1.3 Spremembe


| Datum      | Opis                                                   | Motivacija                                                                                                                                  | Posledica spremembe                                                                                                          |
|------------|--------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------|
| 15. 4. 2025 | Prenos identifikacije obraza v spletno aplikacijo      | Po analizi zahtev in tehničnih možnosti smo ugotovili, da je smiselneje, da funkcionalnost za identifikacijo obraza prestavimo iz Android aplikacije v spletno aplikacijo. | Odpravljena potreba po Android aplikaciji za identifikacijo obraza, poenostavljena arhitektura sistema in centralizacija avtorizacije. Zaradi tega smo posodobili cilje projekta, spremenili sprejemne teste in prilagodili diagram primerov uporabe , ki zdaj odraža enotno spletno rešitev. |
| 8.4.2025 | Izključitev android aplikacije iz načrta | Ugotovili smo, da je android aplikacija nekoliko nesmiselna, zato smo se odločili, ker bomo identifikacijo obraza implementirali direktno v spletno aplikacijo, kar je bil glavni razlog, da smo želeli implementirati android aplikacijo. | Identifikacija obraza se bo izvajala v spletni aplikaciji.
| 8.4.2025 | Odprava administratorske uporabniške vloge | Ker bo spletna aplikacija omogočala registracijo, kjer bo uporabnik določil svoje uporabniško ime in geslo, torej ne potrebujemo administratorja, ki bo dodajal/brisal uprabnike. | Uporabniška vloga ne vključuje administratorja. Spremenjen use case diagram.
| 8.4.2025 | Odstranitev funkcionalnosti ročnega preizkusa sistema | Poenostavitev sistema in zmanjšanje kompleksnosti. Funkcionalnost ročnega testiranja ni predstavljala ključne dodane vrednosti za uporabnika. | Use case "Ročni preizkus sistema" je bil odstranjen. Posodobljen use case diagram in ustrezni sprejemni testi. |



## 2 Potrebe naročnika (nespremenjeno)


Naročnik si želi pametni varnostni sistem, ki bo uporabniku omogočal popoln nadzor nad varnostjo doma, z minimalnim vložkom napora in brez potrebe po zunanjih varnostnih službah. Pričakuje rešitev, ki bo delovala zanesljivo, samodejno prilagajala varnostne nastavitve glede na kontekst uporabe (doma, odsotnost, izklop), ter omogočala hitro in pregledno obveščanje o zaznanih varnostnih incidentih. Pomembno je, da sistem zagotavlja visoko raven zasebnosti in varnosti podatkov, vključno z lokalno obdelavo informacij in možnostjo avtentikacije z obraznim prepoznavanjem. <br> Želja naročnika je, da je sistem modularen, enostaven za namestitev ter uporaben tudi za najemnike ali druge gospodinjstva brez tehničnega predznanja. Poudarek je na uporabniški izkušnji, kar pomeni, da rabi biti sistem intuitiven, odziven in enostaven za integracijo z obstoječimi pametnimi napravami. 


### 2.1 Skupine nefunkcionalnih zahtev (strukturiran prikaz)

- **Nefunkcionalne zahteve**
  - **Zahteve izdelka**
    - Zahteve učinkovitosti
      - Zahteve uporabnosti
        - Intuitivnost vmesnika
        - Prilagodljivost obveščanja
        - Odzivnost vmesnika
      - Hitrost odziva
    - Zahteve zanesljivosti
      - Zanesljivost zaznavanja
      - Razpoložljivost (24/7)
    - Prostorske zahteve *(če dodate npr. o omejitvah prostora senzorjev)*
    - Varnostne zahteve
      - Varnost prijave (geslo, 2FA, obraz)
      - Dnevniška evidenca
      - Uporabniške pravice
  - **Organizacijske zahteve**
    - Zahteve okolja
      - Razvojno okolje (Home Assistant, Python, SQLite)
    - Operativne zahteve
      - Uporaba Git repozitorija
      - Dokumentacija
    - Razvojne zahteve
      - Scrum, iteracije, testiranje
      - Dodeljevanje vlog in nalog
  - **Zunanje zahteve**
    - Zakonske zahteve
      - Skladnost z GDPR
    - Etične zahteve
      - Lokalna obdelava podatkov
      - Privolitev za obdelavo obraza
    - Varnostne zahteve
    - Dostopnost
      - Podpora za tehnično manj vešče uporabnike


Nefunkcionalne zahteve projekta varnostnega sistema za pametne domove lahko razdelimo v tri glavne skupine:

####  Zahteve izdelka

Te zahteve določajo lastnosti, ki jih mora imeti končni izdelek z vidika delovanja, uporabnosti in kakovosti:

1. **Zanesljivost**: Sistem mora pravilno zaznati vsaj 95 % varnostnih dogodkov, z manj kot 5 % lažnih alarmov.

2. **Hitrost odziva**: Ob zaznavi varnostne grožnje mora sistem uporabniku poslati opozorilo v manj kot 5 sekundah.

3. **Uporabnost**: Vmesnik mora biti intuitiven in enostaven za uporabo – vsaj 90 % uporabnikov mora oceniti sistem kot uporabniku prijazen.

4. **Razširljivost**: Uporabnik mora imeti možnost samostojno dodajati ali odstranjevati senzorje in module brez potrebe po tehnični pomoči.

5. **Varnost prijave**: Sistem mora podpirati vsaj dve od naslednjih metod prijave: geslo, dvostopenjska avtentikacija ali prepoznavanje obraza.

6. **Razpoložljivost**: Sistem mora delovati 24/7 brez prekinitve, tudi ob občasni nedostopnosti interneta (lokalno shranjevanje dogodkov).

7. **Odzivnost vmesnika**: Vmesnik (mobilna ali spletna aplikacija) se mora naložiti in odzvati v manj kot 2 sekundah pri običajni povezavi.

8. **Prilagodljivost obveščanja**: Uporabnik mora imeti možnost izbire med več obveščevalnimi kanali (mobilna aplikacija, e-pošta, glasovni asistent).

9. **Dnevniška evidenca**: Sistem mora hraniti časovno označeno evidenco vseh dogodkov in uporabniških dejanj za kasnejši pregled ali analizo.


####  Organizacijske zahteve

Te zahteve izhajajo iz načina razvoja in uporabljenih tehnologij v ekipi:

1. **Standardi**: Uporaba dobrih praks razvoja z uporabo Git repozitorija (npr. GitHub), z dokumentiranjem sprememb.

2. **Razvojno okolje**: Sistem mora biti zasnovan z uporabo odprtokodne platforme Home Assistant, jezika Python ter SQLite za shranjevanje podatkov.

3. **Testiranje**: Implementacija avtomatskih in ročnih testov mora biti vključena v vsako iteracijo projekta.

4. **Sodelovanje v ekipi**: Razvoj mora potekati po načelih agilnega razvoja (Scrum), z delitvijo dela med člane in sprotnim usklajevanjem.

####  Zunanje zahteve

Zahteve, ki jih določajo zunanji dejavniki:

1. **Zakonodaja**: Sistem mora biti skladen z zakonodajo EU glede varovanja osebnih podatkov (GDPR), zlasti pri obdelavi slik in zaznav obraza.

2. **Etika**: Podatki uporabnikov se ne smejo pošiljati v oblak brez njihove privolitve; sistem mora omogočati delovanje tudi brez interneta.

3. **Dostopnost**: Uporaba mora biti omogočena tudi za tehnično manj vešče uporabnike, kot so starejši ali otroci.

## 3 Cilji projekta
  
Projekt naslavlja naročnikove težave pri upravljanju varnostnega sistema in zagotavljanju hitrih obvestil v primeru zaznanih varnostnih incidentov. Cilj sistema je povečati varnost uporabnikov, omogočiti enostavno upravljanje ter zagotoviti zanesljivo obveščanje.

Koristi projekta:

Povečana varnost – Sistem omogoča hitrejše odzivanje na sumljive dogodke.

Udobje – Uporabnik lahko varnostni sistem upravlja preko mobilne ali spletne aplikacije.

Zanesljivost – Centralno vozlišče skrbi za neprekinjeno delovanje sistema.

Avtomatizacija – Samodejno upravljanje sistema glede na uporabnikove nastavitve.

### 3.1 Slovar pojmov

 - Spletna aplikacija – Python program, ki nadzira delovanje varnostnega sistema in komunicira s senzorji, alarmom in home assistant-om.

 - Uporabnik – Oseba, ki uporablja varnostni sistem.

 - Senzor gibanja – Naprava, ki zazna gibanje v prostoru in pošlje signal spletni aplikaciji.

 - Senzor zvoka - Naprava, ki zazna zvok v prostoru in pošlje signal spletni aplikaciji

 - Identifikacija obraza – Biometrična metoda preverjanja uporabnikove identitete.

 - Varnostna koda – Geslo, ki ga uporabnik vnese za izklop sistema.

 - Alarm – Signalna naprava, ki se sproži ob nepooblaščenem vstopu.

 - Obvestilo – Sporočilo, poslano uporabniku preko e-maila in vidno na spletni aplikaciji.
  
 - Način varovanja Doma – Sistem je vklopljen, vendar so nekateri senzorji izključeni (npr. notranji senzorji).

 - Način varovanja Odsoten – Sistem je v celoti vklopljen, vsi senzorji so aktivni.

 - Način varovanja Izklop – Sistem ne nadzoruje objekta, senzorji so izključeni.


### 3.2 Uporabniške vloge

Navaden uporabnik – Lahko vklopi/izklopi sistem ter prejema obvestila o zaznanem gibanju.

### 3.3 Primeri uporabe

---


1. **Prijava v Spletno aplikacijo** 

Cilj uporabnika: Uporabnik želi dostopati do varnostnega sistema preko spletne aplikacije.

Osnovni tok:

  1. Uporabnik odpre spletno aplikacijo.

  2. Sistem zahteva prijavo z vnosom varnostne kode.

  3. Uporabnik uspešno opravi prijavo.

  4. Prikaže se glavni meni aplikacije.

Alternativni tok:

 - Neuspešna prijava - Če varnostna koda ni pravilna, sistem zavrne dostop in omogoči ponovni poskus. 

Stopnja prioritete: must have

---


2. **Deaktivacija varnostnega sistema preko spletne aplikacije**

Cilj uporabnika: Uporabnik želi deaktivirati varnostni sistem pred vstopom v objekt preko spletne aplikacije.

Osnovni tok:  

  1. Uporabnik odpre spletno aplikacijo.

  2. Izbere možnost „Izklopi varnostni sistem“.

  3. Spletna aplikacija potrdi aktivacijo sistema in posodobi nastavitve v home assistant-u.
   
  4. Uporabnik prejme potrditev o uspešnem izklopu.

Alternativni tok:

 - Neuspešna aktivacija – Če ni internetne povezave, sistem prikaže obvestilo o napaki.

 - Neuspešna prijava - Če varnostna koda ni pravilno, sistem zavrne dostop in omogoči ponovni poskus.

Stopnja prioritete: must have

---

3. **Detekcija gibanja in sprožitev alarma**

Cilj uporabnika: Sistem zazna gibanje ali zvok in začne postopek sprožitve alarma.

Osnovni tok:

  1. Senzor zazna gibanje ali zvok.

  2. Sistem prične odštevati 1 minuto.

  3. Če uporabnik ne deaktivira alarma, se alarm sproži.

  4. Pokliče se Pošiljanje obvestil in pošlje uporabniku obvestilo o sprožitvi alarma (include).

Alternativni tok:

 - Preklic alarma – Uporabnik preko spletne aplikacije izvede identifikacijo in prekliče alarm.

Stopnja prioritete: must have

---

4. **Spreminjanje nastavitev načina varovanja preko spletne aplikacije**
    
Cilj uporabnika: Uporabnik želi spremeniti način varovanja (Doma, Odsoten, Izklop) v spletni aplikaciji.

Osnovni tok:

  1. Uporabnik odpre spletno aplikacijo.

  2. Izbere možnost "Nastavitve varovanja".

  3. Izbere želeni način varovanja (Doma, Odsoten, Izklop).

  4. Spletna aplikacija potrdi spremembo načina varovanja in posodobi nastavitve v home assistant-u.

  5. Uporabnik prejme potrditev o uspešni spremembi.

Alternativni tok:

 - Neuspešna sprememba – Če ni internetne povezave, sistem prikaže obvestilo o napaki.

 - Neuspešna prijava – Če varnostna koda ni pravilna, sistem zavrne dostop in omogoči ponovni poskus.

Stopnja prioritete: must have

---


5.  **Pregled zgodovine dogodkov**
    
Cilj: Uporabnik želi preveriti zgodovino dogodkov v sistemu.

Osnovni tok:

  1. Uporabnik odpre aplikacijo (spletna).

  2. Izbere možnost "Zgodovina dogodkov".

  3. Pregleda seznam vseh dogodkov (prijave, sproženi alarmi, spremembe nastavitev itd.).

Alternativni tok:

– Ni alternativnega toka; funkcija je dostopna vsem prijavljenim uporabnikom.

Stopnja prioritete: should have



---


### 3.4 Sprejemni testi


| #  | Testirana funkcija              | Začetno stanje                              | Vhod                              | Pričakovan rezultat                                |
|----|----------------------------------|---------------------------------------------|-----------------------------------|-----------------------------------------------------|
| 1  | Prijava v spletno aplikacijo     | Brskalnik odprt, uporabnik ni prijavljen    | Pravilno geslo                    | Uspešna prijava, prikaz glavnega menija            |
| 2  | Prijava v spletno aplikacijo     | Brskalnik odprt, uporabnik ni prijavljen    | Prazna polja                      | Sporočilo o manjkajočih podatkih                   |
| 3  | Detekcija gibanja ali zvoka      | Sistem aktiviran v načinu "Odsoten"         | Gibanje pred senzorjem ali zvok  | Obvestilo uporabniku, 1-minutni odštevalnik        |
| 4  | Sprožitev alarma                 | Detekcija gibanja ali zvoka, 1 minuta brez odziva | -                          | Alarm se sproži, obvestilo uporabniku              |
| 5  | Sprememba načina varovanja       | Uporabnik prijavljen                         | Izbira "Izklop"                   | Potrditev spremembe, sistem deaktiviran            |
| 6  | Zgodovina dogodkov               | Uporabnik prijavljen                         | Klik na "Zgodovina dogodkov"      | Prikaz zgodovine vseh dogodkov                     |



**diagram primerov uporabe** ([Use Case Diagram](https://plantuml.com/use-case-diagram), izvorna koda :bar_chart: [PlantUML](./gradivo/plantuml/DPU.puml))

  ![DPU](https://teaching.lavbic.net/plantuml/png/TLB1Rjf04BtlLupWqXw8IaMK24L8AGMrbweAIYyeXy4Ud85bnvfT6vMg7zCVwIt_bRKTa0dWmqgUz-QzjplZr-noLDp0x1bJsRBBO8dMa_47v5vLjbDnOHP-Mm8dka5x3l-16uAn5CgaP_jvHz3_r8A-eKktoY6GEx5zaCAbOr572hUj-bTQOc73mV1U-IXE2syCFvjsc2I8Vi5adMcZRqMXQpbx3WjRjFqVFINewJmtKoBN3aj9G9VPK_fqCfsC9yO43l7nVg4wyS4nUFQ1Dl0X5o-fBEoAd7mqnj8oG13GoWLIrYZCuemPFkQYk72y7WBwAbqKZvvcE2Et4rrnNT__GBTaiHICqNqqwBntxy0VOo1-HNDNw3nG5X75X5SO9rrIXb3iZR5JEm-EMtvgv9O89VWy6Ze1p6qaHmbf6gwF6sQvqeRT2jqgRXFwW2K7AXlkxGbNNlvNCA35k7WDAoxHSGPv-SUsKPH5IJwmVMFsZvdVTsih-P7OpVlxK7oi57PPd4l9Zjw41kQlCOVdxSsxIkbJRrI7CV60gtctMg6dgwhMXo7StR5BR97IQ1GPrS1wzLZdtNfzwkR19U3w4d1p2RYz1CJevXK0)

## 4 Opis sistema

### 4.1 Pregled sistema

Kot opisano v dnevniku sprememb smo se odločili, da bo naš sistem sestavljen le iz spletne aplikacije, saj smo ugotovili, da je bolj smiselno, da identifikacijo obraza implementiramo v spletno aplikacijo. Torej kot povzeto v osnutku sistema bo naša spletna aplikacija vsebovala naslednje funkcionalnosti: 

 - registracija uporabnika
 
 - prijava uporabnika

 - deaktivacija sistema

 - spreminjanje nastavitev varnostnega sistema

 - pregled zgodovine dogodkov 

 - ročni preizkus sistema

V našem primeru risanje kontekstnega diagrama ni smiselno, saj naš sistem ne komunicira z zunanjimi storitvami. Sodeluje le z našo podatkovno bazo za zapis dogodkov in prijavo uporabnikov.

Bolj podrobno pa je naš sistem opisan na spodnjih diagramih.

### 4.2 Osrednji arhitekturni pogledi


#### 4.2.1 Razredni diagrami

V spodnjih diagramih razredov so prikazani razredi, ki jih bomo uporabili v našem sistemu.

![RD](https://teaching.lavbic.net/plantuml/png/fLZDRkCs4BxhAOZD8GcoHXSe5krXQy29lRk1upXLqXny2IYBTMXHea3AsbqdUOE-H5-af-vxbNyIVoGbMVHYYCFXp3T3pZUaUOQB4ZAOWpM1d8E7281JkCusZEwAz8mIoi2NUrmX8PymHhzeKKA4ZX1DqPzmHweRzBMQ4BmfSbHKO2r-48kUedkS8h36R4rG51s25UI45Zn388VYDugqopUhnUYAuIsiuHi0ELWjximGVFYGI1YGVHkFnU3pP3oM04Sb9LlqHqaPJ0hCCtgUerRy2GalShJPvSbrXefbmk0UDX9ZMWnFIlrvT2m7lDNKOp6PmVqbB666XEJ9HHkZ3UOLWsknle7ioi3_0wv62uZ9S1IkDucMEUENyL_2T4zP0Qy8vUis0byw608LODRe6XL2UOkjP48WovtnTGMBBReMi50EhVXAuPhI3KqpMakaCfvbAl1gcng-54vf2hUXK6agNu5Y83lV9vX11G8Q484HXG5bhjGS1ozP6a2J93rwVd_Ff-tdBUCLR4SND6jtJErhoP2e6AnJPO6i4eQvJOS7HuNPe563LuFvCVTDFZtl9cUDVpFq4RmY4MUGzzfTrJIqBKLT-oUwb55QmotSIXsDD5Wt6ZsE7LlUjk9yHrGwp55kww0xysny2ieagt0jpfjtN7K9ObM3LECx1BSvuWNES8lbTZI7EMBQ_UsT7lH4B0bAUb14q5YRqw9Yb21PYOt1kSUcSuTCrrfRgFi7PTSXf8tX8X43gX73LwB2gWmrSIdPTPSnXH_Si5lM4EizWmM-f3NQm72kPWK-dzflDrLjD4vwvZOzRYmFndqYt8Uef5bFvfhk8S9vbmU7qiP3XkCEASAM3bF5TUgpW8JkDV6OP1gHEMcUJ1MWIJdtIjNZCsgfSxLmH6gv9sagmyZIa5vJbqRTD3aKEBSCE9GMdChVkYbuuh0Exs6SlKzs4coI8hBRhk2-W3KAi5Z-cxVqzpoIrm5mseTGablIq01LK-7HMIOruXKcr61fno4UGnUoVipEQnxKnrMs-R0gIih95hS60yUBtszkZ4_vEHp-2UmZfR3C3a4Czu98BN_4erDHARhYQQrSnNUkIFWGDpnSVGkYQy-GrrdrCGkgKWbbx0D5QcI-XgsR9mViPvgZ2UTOLcDbq7eo5wvRlRt5sgbf4vlTevTBv_bwLR6wvQuaRh4hZVw5XeVxERPlqisKsxnZftVxcncKxzfhrN6dKyT1etwDiRZRfEDEZuvTseajxVJjvJ3bc0trGh0K4hSKCcpr1MC-3yGU3mH6XwWWzpZ0i-uTWoOJhcpeS2iTy83t6Q6bkAeKRy7EVgOqXq-w-gz4OzuBcbNVvgQ02-0zCDmNsMWqjdUAA7pu1DFsyY7bFeiuasQLxksHRV9IV6l5ddfGv1A-txYZdYUDzXFepNlLGllp0MFwN0vEg_Crw2B8Hw0aTTedn-3qW0SpsrRL8J1sd4TC484hxeRlBsgy-jBsyDkPda055htSlc1yeuwmPvjzGOVijIdP6Zjpsg29jtzIGnXOwFK6WKH65GMzKQiwQNTpOib1gpqt5wPCHTJq_EPeT9ug2fPvEUY_T107Hv_YsUmI9Et_EiSHV_b_7-y9SZ1z__7zx6VD6MVjXSEwY6VJ7tVWtLmEFawcfzDVfOlUnPIbY9c5YauFthtxPN9s9XSGj4552XZUt5T2z_4tuOi9gX0Von9py2Y5O3Mxc5rEnCTo3rD1ZqpTVCIcLRY4e8aM73NleUz_PnZK-i5sR6p4qzc_VmtQi0618q8tWiv_oiJDWiWNNsFXT7Onk5vpEJWgpSON6EJY895syM8vZUNgc2RjqhT0mEGKVFy70PoNHDuyAYnl100I3CJoWeOJjIeZO8_uOoGIgDFu7m00)

#### 4.2.1.1 Registracija v sistem

![RD](https://teaching.lavbic.net/plantuml/png/bLHBRjim4Dth58DaKGUfq015q2vI0xQbVE3O3jJM2syCoc9bMXGfaBBJEiaDUebUfAlcNXtgHybjK7H3a8-SUJEFZzG94nbH98KL9rh3WmCm9AiaLd8hef7aKi7zckKKyO5Iyhw4Gevd4FBe5xBb-IVwDHzm5ekKYXnME53bF3bh5b5OCRNYr75UmO9eBeLEAAG4HySfAOyM4pUWCTEv8Yks8KT0D2mcopO6S74Hceg8-jRlu-9wqE-RMjrCyWtzd4b5Gi5q8czIsi1N50cRrOGmRXRnDWq_9bJCGaNsf4RQR8YTgjQwTsAGJB64xASa8mb5vCcqD4-f5YnXJIzpTqnIgiecvijoqItUb7sA_GkcoAOeeiusbY9NabEriGd7xft24dPbnl6oMc7ALNaQZtSLsVuXHbpfO5h0O5RBbLITwRKYWatbZiRaS6-d1BlnxBpeNvOLDoMsUXxRdji5FbJq8T9RyMtQ3bQ84P2zef4L8d27k7id8v8dSbTm1SisX8neF9RN6kEjcmrcA2ASRWvv2z2uejDDu5xBb0wqnkid8g-8EbYRgMF5WiygQBKjQwGTSOikxr3qFTaLxwE-MYQWuyR3jt3Xkdth1CTwmk1TJLgRLLHvEuwz9WFFBTpDrMdRr3YiV5n-5rH3xohm_Ic4pPznukX__ocT1t7idL-U-szBGKQDQIn5u7l_Jz1v7iUN0s_elJSKVmsMAgAg2ZJt2STdP-y6ev49u3Ic8WB5udMEPny_89T2XN0oovY6HmF2mh_rfmESpFOasb1GXNtHbJdB2DJTGgz-dSy_4WQxyliugN84dl_h-uivR4FGup964xr9LCgu-N_g34F_ziNuqhBGoofl20QfZ2XlWYSpBp3HWGoRqDU0PMe9ppyfi3JZrFpmp5WQ26U0uK8URkp0s0RiStbqKC1Injy0)

#### 4.2.1.2 Prijava v sistem

![RD](https://teaching.lavbic.net/plantuml/png/bLHBRjim4Dth58DcKGUjqG15q2vI0xQbVE0a3fJM2sy2ofegj2XI81MbTP8Rz1AzI5VDlJeKzR6I1aKtWlZ8cJVp-3WcvJ9dccMm4imOkFC09coL9bhTo7YgXD9mUyqB97oijRfrK2Je344-VcKtelYCtugnu8dCK1QmeWzgxy6xvZ72YkkLGCzx3KjcX98cHSWOVJtFKRvQdWqlD5-pahq2Pc1vTbKluU0WicKm_NqqeiNnU3Io1Gvp9TRu9LUQHPARL9rasC97I2nsbTnaqMMASXvfjc4DKgUcvPlS_GvsxSAq9zsQDbEsEMSvIv6G1zl08aCZUShRoXV36SjGkxeNLsxHh_gkISurMrS4JRQPaeLM0lMwIpZhAJ7R4cBbJjFnlXGtprH8QW6e1InHymiLiw9geiCkdtTBFBoHDAtXKaj-udV_bHpADT1Ml2N1h9DWkzwxcY8YYgVCDcqFgxG9sKPZtEaI3YUqwpfHPSKLNcr3n4YkuqKZENd1Rl2NADgynoh3iJ7S54mMTU8UjfsvPy4gVwTOmrJBtPFoWLgwK2LkM5czXEPQkOGG4-BHR4M8jstzuN3K6S3hh63nVkzRctMKkmMlkmuBBpguT_n9lxQ-IUrVDnJGmE0e389pYDh9iEkPVq-EtaFOyVSFzuFtxdwdhJiwYZ3m_v-Wzons3iV-nFzeAVuQh7ICkWwq5maxUtiVnjEf3H2Oe8n1y-IweBFtduXBaqJqCy-vWNiBmZ8u3Sx7z3FVi7YDe2kValqAdZDekeL1yoeVVwOSIZSsTkiSeH_y_l5YZguX60YLa7_UfJhZmiwT9iCaE7qntdaL1dbj3iaXKp6ADlXixeSsEbHH6_eMg4oZuF4N0izoWNQEqy2YO2OuKBXKJpTAiBQ1xftSUoIWa_4F)

#### 4.2.1.3 Deaktivacija varnostnega sistema

![RD](https://teaching.lavbic.net/plantuml/png/bLHBRjim4Dth58Da4GUfq015q2vI0xAbD8NZE92BBhm9HXBhqA98WPILnarkq4lq8bqrzoefMfBb3ufk26eqRzwyuIDLIdcE4ZE86Ie5Fno00SRfN8ebJuQ22GcF3xGWEkv9AHvjA68wHuTyyWsNhFX2lXSUetEU4Lv0h1SYdHVdWIO4OYfZHXpd16QecE0g9P2XNXt7KXxDnkuj9YiXETuneM8y0bGm6zztet1v6PccK3xr-_hZskltJRkkI0cFYSTGPbH_dysNMJH9SachKEzKTx91LGLhXkhZOE5Si0Nvx3VR6v5YJ1TOaqnpIRHYEYsGBuWbEe6l6L6SfhGX7UsJDzfL5mjUIC4OaTqsi5RcScHYPMKPEjs6Q7JEnXsbemsXeqRd8GgQc9Ljw5FRsdHi5KcgcgdQ9DtFb6PBPe2Y-eNr849SIPAqSmZTQv4HJocgTD6YQYsyxyHqJzeyj7WwC86pKl9M_yj6wLPjsAZTLsf7gQigXRRbEr6I5PQLNRldu-pne-lsTyxH6UrDszAvcsMIQaCQThjfBMgvR7Iq6TokhB7TmFQ8BQWX6gojRny0eg3tAGo2MuYQL-3KKVz-9JftwDY_kBe8tjcP3XlFjHHXuFy_GSUynrUUF_0_68gzO24J8jT0S_XmV7x-tXiE3O2HEU49I3f_A7JkyqVD9KiqcqbE5JoR8Co2c-3Mqvl92fC50LdPMPHGq1oXLWkzPIuaHfo-_aefbFRodwvhX7xmv-V16gqWw34nfoc-JRNFcNazwWg3uEOWtleRUhb8i4X5oIba8Y6i0OydVcZGeOWQw1lGRIe1hxy9q2ndvfONLA868wEWuLni_oWhIq7heMT73z2EyIy0)

#### 4.2.1.4 Detekcija gibanja ali zvoka, sprožitev alarma, in obveščanje uporabnika

![RD](https://teaching.lavbic.net/plantuml/png/bLNBRjD05DtxAqRjWbJ50WaXM9H8RXqUQjCMfsoogQxZ8HrxxB5c70EX_04_mO-mWl_YpYD-9Q6miSPtvfvpxcj6PQmeGK9E5XoK8byzGavXaIsbM1N9cU12aazthA9e3wGKdwmfvdW6JI7z22jUtT3FLS3PiiXfKP45VgZqldbtBA5amUI2Ky-p-0VpgJzZ-GhzMGepMgo5JE60W2BpwUts3ZavYRKIa5_6OwFEBmLFwRiGbyVBLHu7MSLg9Y6rBgCZlL5Abi6QNK89cK3JDyzxHCv5KKd1gKnP8-VSjsv6mVcj_K7IXJsBXv7svEHjC1uRSfReRorL1Nh1HMRaQavLIehnira5HKgj3X4dbA_IEQmBgAaLqZ0776JkYCtwGTu1dLYp9cF28C20uYgkgQeO5uwc-HzIkSmcK6Ki54kHP2O-p6CCDPi2unzA8I4kCAyknKBnb3M00-Bf-viRnwcN-oCxXbtrgsKnA5u4QqcJjd2HVmfhk3QAHMseejkk2Jcm3rdrPH2TXazmcPemQTOIwYXxOKJ-Mv7JG2c6vIugHzApTLawvLAsVJMP3xemPgLCPypGa-RGaTIcTYF5jJzjnPdoTlvdNQo1QXUPq-l-jl8nQEK5g5qWyreCWBJb7y7wFhv_FsvXEbIT4OpQ4ToLr_tZvvBR2w4TiAWPiFse3u3rHodgZT80TDyqvRqnidrzBMgwnhj1hsteNdiD-Vvus723NNTpR5aRTUsE1UkEYERSkBlyx6B4Ktt3rWnOJZteMtiMq4MsUzDAG1QjpHjCiJtIzCmZqesihO4zzhUzOU16xUPsqaTslZz6bdk0x1D95HczYIQJIn8tx-IHfnv-HtilsM7u_FNpoJFR0sVDrTXIH9Fm_mbwT-pXwo0y3LzgYftEGYPKEaVJjOTFdxu8piwq0wTBMYH4ikLTXMVlNo6Nh44lhagcoBqsaldaOd8PuE9g3KbAYJHtD1QjOYMGJRHaj78z__j7naYTKuNjV-Gmed3ow_jUZ3OWCk9YYLFp9CFBb2C0so2SJYxs-jl19AFI5RvW9CT6uetpz2gCj7SauiRrCK6PIf3VFobXUSdrgrxX2uNEm1b1zq8CDsep8gHjxNiF4sZJ-0S0)

#### 4.2.1.5 Spreminjanje nastavitev načina varovanja

![RD](https://teaching.lavbic.net/plantuml/png/dLHDJzj04BtxLupWqA0I5Qb2vK0ZER4fLI0WqrCkQ6nFayNhNMjtOue9_w1_ed-af_A_Eexp8OVGghrOcpVxvhsTVHkR2LMWmHmIYTR2emVGnoIR63rJwK1BRU1-AXmnxXkZxniebho7eO2-uaowB_JD-L9CL4xAGS8VCjwJDnKfGI9C8idpti0OhTJAPWGvyjVp6iczyMLtX6cbZS9hgMs2Uu0MnfUtRHHEJ-FQ59g7Nez_dFkzNcstgpDI2TquL7Tq8woZ71b-EvdbyUSg5WON9LoMEWViZDqCjN96Ip9tOkrakCl8yAMFfE4okUt4RdkmXI6UYMYPMpc8i3AKRjIZxhdEoRTMr7tSGZowRM4iniCLxk4_TRbKcfrsrXvQjQM75lP73_0egapgGjwHEeJPPfdg79-QSr_haYei5vbeZzRRSUdTRk_55NZ3dTksXbNtRmFRqsn8xUGmgR-CMVCco4BdKnI68uZN3-F0itz_EAsyxWV7PyVX-sO2WtL-DX9H6FoxG2k8-sT-q0zEQecTP6rICajYVMsmVtJqmHyCQeAa2QaKZ9XC7U-TVsGjKsAzk2g4XNaDmZYy24S-BwugJFcopIB1kWGd2eJLQQ4pAxJ1M8dd7vc0CYUhH7Qmx145uQ_lh_RO70WwKaz4Xkyoaml93SIgGp-yU9NV91CwXKxHPRfK0dATaboJBw-2g6P7EbvJ3u5jMWtFFmb4NiZwwJZ-ts0oIW5CLtgxK2wY1PiipJqUO3F6tm00)

#### 4.2.1.6 Pregled zgodovine dogodkov

![RD](https://teaching.lavbic.net/plantuml/png/bLJ1Rfj04Btp5QFa44SfQgGgQW-f9Mn8KpcEBLJru4iqXgspPjb5kvYqrFc3_aH_fAVclpeBDW7RKTiBsXrcvZtU6yOaN6QeCOL8e37mtG4OO9Gij5h9UAY4ql1mptD6SKzhzL27ve9oAEIpBxWI-IVsDVS4NyYKoHmYUZ3jF3htF6OGSHq9vZWdC4CZb3G9WnJfwJWrvD5ixDvYN2ejSIgKYV08qC1iVDUDmkNbt992_QtVfykrr-zRkgvAc8pOLFC4IryjL9oeWk9dYrKwdyIPvbMG9RrJujG2tOItQ9jh5wO2o9HOiez-S_oiJOxDROZcODzPeNPxsz1-_uheLBEum2KkRKxDTAVETTVzLY-hw4Z9N2l1z98t14Q7n1pjQndLjLJSLJEk5EJsA56eibOlOSI9gAgMdhDnpVC4GYo9_ZE7q1rWYLCLOqvUL0p2ktQ806b8UDwIsBwmg6U5bYtCnrRJjc5XowzkAnxRPx7rAEhO4-wv4-wOyo_DmdrZmhOlKrMm4ejgwhl2EmV6sdNxUmOveuDfNHNtasnETqHilhCZVjsfdRGPo7e9C0Ez3s4GtCAysGIdZldxfkXCzh5_SNKHlAa7PDWCspD46FZ_3z2PskChpn_uxop4mMAbOwOtXNQ-uVZy_Aqt7De2mHPCng3vuZwdtFLxmj85siCaumRMDWYpu2QuzUWmAJ5UCj3Le9E4ESyGjbyBlLMcDCubV_gPS2XIPYHFJZSzGZ_u_UF57iyV13sX5hJ3NYSwvO8Qy6s7GN3pOdqzhj3BDkPA3YdPAfhYySGFRNMevatfAo2QHi7JBmOypGIpUvjhf68K7AXSgjqN1Lohb85d3AUVWTRysY41Qnd_0000)


#### 4.2.2 Diagrami zaporedja

V spodnjih diagramih sta prikazana osnovni in alternativni tok. Kot vidite je to prikazano kot alt(alternative), torej če je rezultat true se izvede osnovni tok, drugače alternativni tok. Večina jih vsebuje samo osnovni tok.

1. **Registracija uporabnika**

**diagram zaporedja za registracijo uporabnika** (izvorna koda :bar_chart: [PlantUML](./gradivo/plantuml/DZ0.puml))

![DZ](https://teaching.lavbic.net/plantuml/png/dLLBRjim4Dtp55El722wG1S5sbM38AcHe5vqDugcDlKX1P8I2jsXXyX5kghlrH4bMzJ7SToTDE8ylZVpPlJ1xQaWA7EKIknbGl1JQnVhNq8uwNA29zf9wmo-o1IXAhN1MCaCXS0NfmryFqQ4E3r2z0bMFnwYC7Nr4UwQc0n1eGz_bBOEp1ba1fOrEffZY5a4ekMxDeQH6YXrdaA3KFE5_9AWotGjBbCTdOVraTpXDTCW2xg57TbStm951ShyHYmHO-3xY7caMBUGeTeJeCtqNG3NWGtwXto-ONYPOPU6QZ9oumdJ-cPs-2dwWWrkUa531kZOEfqkLt-I9AQ1hlOXZzeeoKARAdVeH4BdiGJc3chAEP5JkafB0Q1B1pOZ9Gsgb9YUuJIE0xoxzMNN-brLnDZsli6_lybHDk1YY7l92bdEdnHwF5WzCqQVlJf7QrAKzjflFeCRurDcdRp7WapFFSPQFazJGalqXttyYDV7FDnsWEiLfnvh1hKTGGslnxuEhBhsUBXHxS8ERzycjcILcSmGBnHAAX4UywAl4tvC7tYCrjqiXNgd7WIuxEXIEvD8HxKOivjZzUPbhm4Rz-YrhbgBRL_c7jHaCCwqS_FRhzLoISqR5V-g2_fiBJiUbPiiDb2wfjrecuzvZvEx5enZr_HWXZObl3pITi-TaO-UwcdyEmzUksLqN9DrCkUnWCgMT7Zr6_1qL8fpAuA3emLUsQ9To3nWfG_hLWxbba3Hmg9yXynsn1wnn4p_ZpIVsVvBMYk8yMIU_afXUFQp_WS0)

2. **Prijava z vnosom uporabniškega imena in gesla**

**diagram zaporedja za prijavo z uporabniškim imenom in geslom** (izvorna koda :bar_chart: [PlantUML](./gradivo/plantuml/DZ1.puml))

![DZ](https://teaching.lavbic.net/plantuml/png/jLL1Rjim4Bpp5TkS4g3-G0y5KlJGmcXWrEYbjtMqTMX9N46aXK9_o2FyaPpYVvKKPKManDOEqfCeYZES7Is7xym3bGHLWLA91vaH_68s6_ujX96c85ZLSeSDGWDQQaCbjB2lkCQDaiT3BakG9Ics3mLRqWMNGk2zuHf-zAjo8OOXB3x2rSzlYvxqwWF8TaCrGSd79yNQdBPp7B91Gy5o8SPli9YmLRNCiOMAYnr2QqLRph5SscAd5qzoKVnLtLduK9EbM8QAtEZwHA9p_bhIU-_LpQZCvRZAPLHao4WDrNB56PgShc_2rNRnzyKdRD5_v-O5OMtf84D1-TZc22NYYQcGfbOIQchtXK4ZCafp2ImCx7L5nuErhhT404oLV-6IRhNhD5J6svVnvaMwxq677UyMeXnnF9TGFwKDovWGnwBdEj2EvD1JQ7yGmAH5xFiTPYtN2bS5wti7vSo2GVbfjaUIZuVdHuv4ZOz3foVu597sMqUpVPDE12YqMpuDhWJSonbgRyO5vArSaxBJE_AkN0Y-BR0kNmVzp5lESezDmwVzvxeaqFowjfkeqjGgBEt3KpVdTjxvgaTclQrcTCJy7nIlxNX7QtyKtrHuHtpf8PyN7aMhqptkhNG60gGIDMLqrl7EE1qJ9_IcScQu93r3HByyDqDIbsyVO7GAC9e6s4oKKA79GYjyVXnoMVupRPtzTnQKyqpC9WHsw_tV2kiUnMegS4bbuWy0)


2.1 **Prijava z identifikacijo obraza**

**diagram zaporedja za prijavo v sistem z identifikacijo obraza** (izvorna koda :bar_chart: [PlantUML](./gradivo/plantuml/DZ1_1.puml))

![DZ](https://teaching.lavbic.net/plantuml/png/jPR1ZjCm48RlVegX9pZq1JWWBUA05B5KH73WDcbcMJU99t9CXF8EFCI-o9xeUs4xsTPs4j6kbbDTs_ytlyUUQL-PUse8sXgb4lUo9BXZDWN_4i98KnFij3nWZp20NLH6tiaAz_B0m8N60ON0lM4DNrlMM2XP2N4QmlOTRBv_saw8pLkGGq6QeE7Ze-BE06poYjI4sZYKxD5Gf18Y_EQPMO3iBE2prxz-4m2oK9-byWmRqaxTQbbWB_CroBJHCwQnHtmx8vm1gV7WzP7yj4cSXx1D7N29ff8UWqz9BMc94fb8yz1h5HyZPCG7EISZXRIQUj8n9ytUb-rxkx3pjhbVYdoEc-mLwSI2WoaT0xgxiPxjF4TdIPa2QmC_kvQE3ygB74a0p7r_v8Pkkavs1fKPBx_aGaun2TmADKuRHejL3fpEBL_60ZO-nWoScfwLptWuUIembso0MNdOxxTO3gmLxchkzaxAfHM36gVPrZiV7_xyviHKM7RUJxIKGAVGoUnKOJC32ct8nrDM8dQsW1wJSGLya3afEtsWCIjNYczgrCtpf1_u1vVLg5sNpz-VBvpGy_EUtSnLHuF2ndwCwFxIbtUvwo1PB-iP7PZ_W-FSZW-KZwNueiOz-DeYNpQ-q5Z3jxNU0m7MEkjQealFNSXq2bxnkzPdR9UfS9YgV8RFBkqXIwtFSQS6HayDZEODB8r0TKUWwFGB4VsDmN_sN7S9jzXYnGlDTiMctp_UMNpweBckjLrIfVWB)


3. **Deaktivacija varnostnega sistema**

**diagram zaporedja za deaktivacijo varnostnega sistema** (izvorna koda :bar_chart: [PlantUML](./gradivo/plantuml/DZ2.puml))

![DZ](https://teaching.lavbic.net/plantuml/png/ZPHBZjim343tEWN7gnION60M1LfaqK7G8fYWc-xeY4qOnw8XCKBXE_HANNNkDShVTkHfTm9blKTIb1zqGpL1iqDsPiEMuAU8blBB66NT4Sm8A-M8AzuYHFHEWZfQ8mGEIZKQWoiL3zyRyLWwheovBc7w4OeVNwVVqBRY7Ivs4bPOF06t9Nc2Mbx_77XGsAxbJ2uEv1HJoa6CoGIFmlczRxslo-UsP8zBHRV5vSamkNZJXfFYGqSup_ZczxeHNsXywghZeut6R3bWuhrClqXDdyAX3UZqlt6tv8U4bFimT4hzNjL842ibGpYwhhSy0iZKteXwoqhnd7PTaacPlfVSM1y-OuiBiQYLn4IsQRcToLeiLPFyoFIxq3jlXe6pv0nC_7tGDE0CJc9o7QCztELBqrbV-dYZE4nrHGQsZn1zK7c4lxynv0uDwelUyLNSRrbNFIZYNzSm8FLxCZhKkLSxEXkvXpWAyLnX2r962iex1BcCzvOSrIVstlIold-CtTtCl-4D)


4. **Detekcija gibanja ali zvoka in sprožitev alarma**

**diagram zaporedja za detekcijo gibanja ali zvoka in sprožitev alarma** (izvorna koda :bar_chart: [PlantUML](./gradivo/plantuml/DZ3.puml))

![DZ](https://teaching.lavbic.net/plantuml/png/ZLHBRjim4Dth55Ej722-W1S5KdXHm0ZQskackt749cF9f23IGg4xv12zI5V9lJhyY29b9uqt7exUlFdF9_CaZWBQ1aaMJrG9-AMKsQlVHM78D0BMmeZwWGu8ZxH7oV_O40ozgX58WcuxzVgNZEXPZzqHYwB5pj03jIWDbDlbJiX1TIMW1Y_E0L_LKTneJTgmmk4oJGxVf7oRIuIRvOqDn0ESEF_-RTyBRQXH7XEVyy1otFPDt1SSyBkgqDIgTz1KCGUlrQEgHErmGPv3flXz-0Ks1h0srADhX7PPiz1seeRR7tTt1K1vVxlSqV7KECmkG4fOVhOfMr2vyYJKuS5_Nr1rnQRuOAcDY41B5qHdF-zHGXI2OOjAdFE8HlD0qK0lpnAJ51Wk5GDLBxfnAe1_NeG11pdEcm3tPHmwVWXPEUk21QxDw3JG10eEEujv1Qrw_TCS23GzIcmcktpOYknfQSAGhK3jAz6S3lSsk5uihYQASGwBpPlU-qxIpjXyTgmIHsJxcQlKbtPGq1xh9-3bMK3K-M8AoVL8dFfvNxcj72YEWt9gwp9fTjWDiFNricK815D_CQ2YtMWMJ1AlhJ9TPKz1FWqN_AIflc6LXJTbcAxM2YgM3c6B5kNPBIgpXBEjXEnfcGFD2axQzDWHprZF3lo69ZJhg0gIIoTQI-JUzGHKNNFJjL7Nt3ZKCtYUXXsEn5LIXSbP7ku72ZXBTpOeyPXPUyrx4HMpAPckdkU8x_Dkj1rlR4-tICtFLdMubrJFXkxT7ipYEZ8Fd2BHVxFB8jicH6D3LP9A9Dgc2MuJZhCgNQpozftwV6JA9tDtpMABBjslaI6r3vVd_9ISEqxCyfkNV0Xq_m00)


5. **Spreminjanje nastavitev načina varovanja**

**diagram zaporedja za spreminjanje načina varovanja** (izvorna koda :bar_chart: [PlantUML](./gradivo/plantuml/DZ4.puml))

![DZ](https://teaching.lavbic.net/plantuml/png/pLPBZjim3Dtx5AnN6JIvG1S5fkYYHT31e44ttT4nEv4_eY4fHf4xv4fTfVSg_OdZZpnD1cWnG1OABRtt-2IHUkDsb1CK6IeTx5HCy8FPHVmp29no6S6cC9GhdQ1E23HQXwLoLChmT5GQeKJ3fNp48C2jOmFV2ZOOQPK6GJU4rNi8ltzPFM1yOAFnCMExnV0Tg4D4XY3dtxyqMmUXhUWeZt1A45O4gaH7Fgp04uFL76zXL8e7UDhd4PTmm4g8CZmbNN1isLNQbg3vTDIgdREiCDfFTrUcgemdBRYMmf-XiAsdP5LYdsl2ZQj8Diewod4X8Wpg1zmgVTUpSu8WP6k_cnwoPi-qggd8I-M54xIlgq-SqxsriWYrkmxiedkyN7Z6eKRrbATWop572cnD1BPXabESkTP_2BkT2GC03tIDl24jUGaafg9BB4-Wj09OXnEIbNt1xUm6h_qphz6PkBfjCZicFyepmkupD7bps0iZrxQMXLLmBAgPsK0ruzibTHW1PPOw2mSd-aORBURS-GWbDAT0xIGZsHCsQlUAp6t4_N-3BpNY9UwcMRAN3NgLnxKMwDJkttjAEfuj7Pw2r-71kLrHCCITbAMvylS13_Z8CRgKIq6EPPXyv2UEALrucg7yGdWBi-Lm05UdD8Yqf2s1yEsjaqOarrEwODn41tZdcK5lV7RvWj8-2q35IoYDtCmbd8veVOj6-PP6QiEPU6XXH-t9uc_xCe8QkxA-uQ4mqoPUyjhWg2JhL8R0vpQNaAQytTrz_otLJs3QdVjVFK-XFm00)


6. **Pregled zgodovine dogodkov**

**diagram zaporedja za pregled zgodovine dogodkov** (izvorna koda :bar_chart: [PlantUML](./gradivo/plantuml/DZ5.puml))

![DZ](https://teaching.lavbic.net/plantuml/png/hPJ1JiCm38RlUGhJ4pli1NRWWBXDe0c9osxkOeRNDgwoh49vXxqI9tWlqdOhNPUL8N6hdFoVxTzkRjmR5GHbZcpK6sk2Ln6NohjIZbrEiB2qpac3NukMYWs1bl2PIQKKhfnOU2d5OceuKwhxXEaT9Cl7wHDgBzRW8fVj2fCPi4_94XJozM5awo0fB_AJciyLEegXb8e4cxJpywm6yv2G3sZgWUSHxZoAVPxUeyU5Q7HrSJEehE675dWxwI475mDm487fXJAtv0qMFmPh6gD6ohpaUcavmxu1VVByIcj7uVvGFFRMu-fjQ2IK_MMYeaFQXrQtVBnbtKu29_ypsm3NaZAKegsazQOUlSEHILyzw1ZspyDkFJruq1_oUD4zJVY3SmUVUu8DWQ_aSs-u6mQSN1saMrPIfznjNOMM8zfOlaPqocr2tMeDUl7W0p5uOBXWa7B56omu0FfM3V5aTBk_FvK7UhUA7JfcafBIXNFI5MvmKtVLj3Bc4S3PbfzQbENXnE0vTjoZtrqwyDUx8bqSsNKil4KNvISsj1hJjXMwhrLZpWBKtZR-ngyblpmh0zNm-1i0)


#### 4.3 Logični pogled

1. **Logični pogled MVC arhitekture z uporabo paketnega diargama** (izvorna koda :bar_chart: [PlantUML](./gradivo/plantuml/logicni.puml))

![DZ](https://teaching.lavbic.net/plantuml/png/TLB1ZjD03BtdAwozS2eI1wv8xHO4sbrQrEqUg7fm4pTrCnb7pZImGNm27y6_m7ynawIxIUXUHfxttjZF7fSPsm8LSoWmpZ2bbNiq14gnGviQYiedGK9xF1btJz_Tr71gSx8EOd-GzbHJLVbsBKOKvgZPp9nepDuVECuibIMyUVrsJ7uGwreFEp799VR5v8OjkSU2GDGT93AqT-04bDE3WuH3JomsSknyzhk7QrXYHiuop1dJa6023wXMoe2jk7IKHr4t5hXQYXz7SWK_8e3DKlc8bPV9Jh6c68g6tGPkaNWA-yXIASHGgEpP3AYrqX7jaIvnd-hCI05eKFC1iIgKShRjmzAXEvLuGVOrbKGgjWY9-32Jgiz-ngGMzMHXvE_lFxz6ZZd36gGGhs4pQiQZrhSOgZVz3vxEcreyzlEpDyeRpTbOphfXhWjHt5dsFzcD0MxyFwiOqYRbDAGQOUSoGtJH6POHFZ2zQ3tt57rpTvAG6JdBdcsq7q3MbtdsGQrWzUMM7SryykOwOyd9XKqPUcjk7wVmtlfL94TD_LUmBdFI8rc_2r9HZHL17fOcB2b7ctR_jZ2Pl8FDUO9RY7fnGpN-0zu53NX-_9_wYVW7)

2. **Logični pogled nivojske arhitekture z uporabo paketnega diargama** (izvorna koda :bar_chart: [PlantUML](./gradivo/plantuml/logicni_vecnivojski.puml))

![DZ](https://teaching.lavbic.net/plantuml/png/RPF1RjD048RlVefHBb1B5NSEI4QfQ4MXGKagX7gPs4EoyNhNsfqOOiGZz25ub_9UdLq7MEDSBEtyiplV_3DcnPhWdfuUMusU3GAwdMAg-U0GEdJ6IfIs25vvfWQppDVAjEYmWHRB6hUqvAEyuQXaD5jDIO9MXlZO4bZ7Evi85Nt5W-OLVUT2gwrfo32KyY6NPIzWuQZoZ9tYZWGfecMdQZ0xfyu0FQnlu4S6K4h0XpIrnyuei1k7FPMpLABMzWOxD7iQT1pBqaS5bTtQghPT8dt4ghSkLhM_VpqzohMVWRXejQgnL7jVJtYdMgGj5eiKj-XO-XyIKvXrwx3J-qXw1kXkKv6MHgPTf1SFhNMuCIhUZS0BwxKDxZHM7aZC7SKZw8Ux-TLjYhh-yrfIhT3eckIy92D69O5vOATwXDwHPwNj2Uc-PuVxk70J3wTQH9k_JRcMEnUw7QRQsWfvxDNoqwsiDcoYJx7abuEHP7LQRlMltdy2lBos3K7XmnaDNyJgLvzNQVdh0eQk8GoIZxEH50qwgxp7XkHdcqWtTWNlaEaR7lyEhQCUEu96jhF5cbZ8F3Rs8fFTlxny4vVgDUHvZpiM8_8y2v6WI48GMYShrYVnORf1Qj2ezg3Z0kRvWydpY4GisKDMo1VBGx8FNgiyXrSFHeuRSdB8H1o_wQYN_nmvAHXSYoJo0-bWCOTvIK8GqXv4u8C77psLiKhACm00)


### 4.4 Procesni pogled

Procesni pogled prikazuje potek delovanja sistema v času, od zaznave dogodka do odziva sistema.

**Procesni pogled z uporabo paketnega diargama** (izvorna koda :bar_chart: [PlantUML](./gradivo/plantuml/procesni.puml))
![DZ](https://teaching.lavbic.net/plantuml/png/NP8nSkCm34LxdGAJoYwtjOeqgREUoRXn1qMm0ea6E2J5GgChx25yaQtMzrgGScOtgQG1Fpxn7xYUl0RiXAUrYGb3QWx7m2DcX0oHOw8hx0QAJW4TWm_aTP5oh5t01VTjmnVOdQAd-qtG1BNvUG_fWmHsFUuRWCEBngGUUeNBBDCxZwrLBnec-zZnc_bUMKQKaK3mpoysgun1irNmKmiu8ClMSGmqEEfX6RJNp4BcRR-Jvg8cwJTtSf5W9rI7EAgDnc2LQA7LRh5KQlTvdBXjh8alJRE-aImQHbwRmncth0DtPP2AOCawsKZcTh-vqUnu47JmJf82Eg7h_E0sjyNCEqeM1htZ2IquhXNOQmq9Jp_xg8da2N1Ad4c-WpkRJXYqlzyIvShd1nYgEL49MgnUgFPMSviGm_KxVlCvsN9BTX_q_flDwg6ijFw3j2sZQ3P1-y3z2AjTffWAj_dptSmFuCRk2-qpTkIe6DNDqFIFy9Stf_ul)

### 4.5 Razvojni pogled

Razvojni pogled prikazuje, iz katerih komponent je sistem sestavljen in kako so te povezane v statični strukturi.

**Razvojni pogled z uporabo paketnega diargama** (izvorna koda :bar_chart: [PlantUML](./gradivo/plantuml/razvojni.puml))

![DZ](https://teaching.lavbic.net/plantuml/png/VLF1Rfn03Btp5HOzT7l89LKFbIAaJIAKI5LBjKelLGy6738BZD4CYnIgVam_flzLix0iR0OuCiz-xzdFDbUwGeCb95nMh4dNk_gr83YKnRLdnrT3IOqwauVV7i0j9dbc-A3JEoxOmBlmK_Wv3BiNDYcPuU_suzsr_FqpwQDqJUOPawK-ns-nZrT90MO4_bF51cEj_ltD5JGbMQros8I6fRzEF_XmSsCFiNsrDPL1S2JxkQiAgZK2LeNACL5x_2MmqNSGp1WYjWKt0Yyu4pXiEh6BlPygWqsnHxsNqGtQScuk2GJv5TDMJ661faJ7-xSufG8R14jQW7joDOaCLTpg3iQnmNRLoUx5TBgQexYAKwn56MmYCbQ91vtGmho-Vr4rGIpjnx8rdaUPVMQwmPAxNsz8GQPYqO8I1cWRpbrJUE2IO6ixWQXhs4QF3kRtS4_FIgkEyHG2RhnpnlmVGpB4WTZWqOOFQE7-TdYULbmG3rsF-8Uj0pzXE2ti2ExDdWf4QiGDjTWGg5PMyYQAlkVCvzLLi1okbP9vobQ0ZhYjeD_cRcQjwc-6-fiXqCFOPT7g70vl-LewalDQN36_G5nSK_TwNfFpbkQGgVgK9ogzaQHtxZm6RxRb0RYOSc-axP6EZ7jhHx9Kz1y0)

#### 4.6 Fizični pogled

1. **Fizični pogled z uporabo paketnega diargama** (izvorna koda :bar_chart: [PlantUML](./gradivo/plantuml/fizicni.puml))

![DZ](https://teaching.lavbic.net/plantuml/png/VLDBRjim5Dph50_Ur4LXTsy41jmqXHVzE9NQHOKYU9QUvMTHf41HGkmYHyWXUf6iadkL4cr4jbbl28XlXfmP3GqRGV29T_pyA1bAbGbAOGG_KKjL6RjLSMMe288gPrcYnW9IMc4jJ4JtPYOuamL90ubTIFTGWYMPRKcWj5ch87W3Nx7KsE04VfHAurBooz-SGUFpOorHICu3gLA2GM-C81q9XelhjmFu4m0uqBSGti47NUKTqqq0K1jUOM9Wm3Ab-_7Q56BGJUAm56Ga0fQ2SqnuWx_XwYgibzMsDJYTTh0-3qQZgPTdaG_1mv6bsM5g0u3AQ7fvUZNa7yBmeqfoqdjRhzAnBCVbTd2ontTQrJRYiv5TwKvJeZB9XfNi01OHzwv542gp7-UM3xSvipwA0_MlluprwRd0ECvneL8qkMfiu4lSuJx0yFOp6-fsO2XK-y_LMMoDg-muNRRvnE5QeznGqowsr-xOrl-rAaebRLsT_nvj_yEzHAVpbssgt1mUnGJcgY2OLUqdIhDNUxm9mrr7Gc3xGZBTLUXCVABaYhDQOvVO5brju_aCRgIntWrvf7j8paAVjWzODVRTYWc4NDIYqm0LoPtIrkaXPS_eL6VLOOmwr33-SXj5iAYNWgirQO_88uQJTyBn7NDc0oRGOfoRXMfeXmq5tbVztwxPC-PHj7Z__IQC0Z_YGWCis_Nm4lL4SdVVFm00)




## 5 Trenutno stanje sistema


#### Ugotovitve po pregledu Home Assistant okolja

Z bolj poglobljenim pregledom zmožnosti sistema **Home Assistant** smo ugotovili naslednje:

- Ključne funkcionalnosti, kot so **zaslonske maske**, **prijava/registracija**, **nadzorna plošča**, **upravljanje alarmov** in **podpora za senzorje**, so že vnaprej vključene.
- To nam omogoča, da se v nadaljnjih iteracijah osredotočimo le na **manjkajoče** ali **prilagojene** komponente, namesto da bi te funkcionalnosti razvijali od začetka.

### Namen te iteracije

Cilj te iteracije je bil **ugotoviti, katere obstoječe funkcionalnosti lahko uporabimo**, ter **določiti, katere je treba dodatno razviti ali prilagoditi**.

Zato v tej fazi **ni bilo potrebe po pisanju nove kode**, temveč smo se osredotočili na analizo obstoječega sistema in možnosti integracije.

### Trenutno stanje implementacije

Iz prejšnje iteracije že imamo implementirane naslednje komponente:

- Skripta za dodajanje **testnih (mock) senzorjev** in **alarmov**.
- **Simulacija dogodkov** preko **MQTT brokerja**.
- **SQLite baza** za lokalno beleženje dogodkov.
- Skripta za **pošiljanje e-poštnih obvestil** ob zaznavi dogodka.

Orodja že vključujejo več funkcionalnosti, kot jih trenutno potrebujemo, saj **Home Assistant prevzame velik del logike sistema**.  
V naslednji iteraciji bomo te skripte **optimizirali** glede na dejanske potrebe.

> Skupaj trenutno implementacija obsega **721 vrstic kode**.

### Testiranje

- Vse skripte so bile testirane **ročno**, brez avtomatiziranih postopkov.
- **Enotskih testov še nismo uvedli**, saj je bila ta iteracija namenjena predvsem **analizi sistema Home Assistant** in **razumevanju njegove obstoječe arhitekture**.
- V prihodnji iteraciji bomo testiranje razširili z **uvajanjem enotskih testov**, kar bo omogočilo **večjo zanesljivost** in **ponovljivost preverjanja funkcionalnosti**.
---
![Ganttov diagram](https://teaching.lavbic.net/plantuml/png/ZPR1Zk8u48RlVegIvh2CD22I0A7tDAtPmxPsHptIxEobrOSYAMX3OYFRPDLv1zwA1vkAEmbPcao88eIiSdtbgh_A-MmT6hT1vPnmqcK4_v39fR8x2GfFH-E4uFzgZmPpM66osnXzKEaNdMa37zR-4HcgpG4t13OJUoELimcognHbzYh4VvGgiYc-0Xg29DEMKk5U3kPoBPo6y_5qDfu68EtbOXY_MvnVi-Gtx2pMgz4uUDjVnKqfI0KV5hFLVBquKtzjKBq31k6Ynq1yCtfBYGEVRGjl6y9nE1NYwHiRSzBs1Wjw1hJmT3zzXWmj6yuuXwzMYF4OWWb8HmOJkKKOZtbZPNR1Mw_l-15F3-LA6WHPbhB0scdGE0szKq2LDl6Wyz3VB10lWl36FQuvt4t6QwdU7N9IhWgeYJiSG0GrGdZJFW2hYODNMuAzAQWzTGE91Y3X6HBz8a4fPLWW8xWoEwTeWxNWctpD6avqdHETERDUpX-qbirf4fbjgMY83MP-C-OXvNJBjKngVpgdBIUdg82ku0EeRUrpSRFFxyJhFWsKPdg3bz75ZQVvTK-pSnBYtYGyfYbkhp1W5CIJQFBn6LvmloVbVPxxrSi-V2VxnrKcTxhmAVZny3iyMgKB9I6d5nPEINaT-d8W2V4vz6L_wDuvTv9ojAcZAE5FJZtSMolPdt8rxsw0jpppxlh5hwjw-Agki6ma7qnlzlsuAhYaCaCem11cYd8u7T4U6bV1pQw-o_oGlHtPaYgrOVKsNWOxlTFgGJZSXjggWzinY5DAUJkosbwFUp2TPW-Y8G5UG60KJsPNrLTT1bvzqQNwAb_MSV_v4jshr6YP0kvPadv6LLXC-GALbPNJnku82bPzMyfsh0JWhx_B4tN6Ij0xLxWut4qvvIk4W-NHWloJIcI9dfCt7o1rUhUoxIErDVhnzU-6eGiOVVttooSew7JSLnGbFy5Qbl9qLF9Z4q4xXnOzvPjtGbZqXy1TeLEzyZbtB6y_hMr22WqNfg75GvfST6Zn3GUMPS4JQoiBZ_k_Cjlfiko1TSPBiEo7rTAyXeBHV3A_gi_g5LwWitVZiOr-fnKNWnLPCg6zeTj94lHCzA0pfyBfK4lLa6geQwDFnshmZC95RzmXVmmz_QKL9TMHsOEgBuQSgliW2dftHe4Gdpai_wtw4m00 "Ganttov diagram")
**Ganttov diagram** (izvorna koda :bar_chart: [PlantUML](./gradivo/plantuml/Gantt2.puml))

---

![PERT diagram](https://teaching.lavbic.net/plantuml/png/hLRTRjis5BxdKnmq5ziAkpFruvyi292c2nQWHGPatKtJ2zgYNTeKQP2qjgdj8-Ijyc0xaYX6IUHWHdPXw-YG-hxpJzgDK5jcM0vpjjYiZDwfx5nBRS0PfYmkSUM8v4i7JeCHgoyECc7umWcjY5qmoM7qPah8YNN_I7vAh6EElnDiLM5-9G3C6FrNBG6y5uetw7E9TAZxJhwJav_zjyG6QwuhcFghju_iEkBJPRhCgXLjCcwyDhruE_tr7D7kCJA-P3lf_k1_kpCfLYf7Ls21VzmGyWCCXqEWRq3WArk8DQiKZVdmwdV3iwqHMyCA_WgOXRCH72sNVCp7lqXquZXZPeDxu1XEl7xWdwVV01Bu1YFyuVD6uVle_hrbk2pdmZ0GPIaArb3G6grnR-2V5LhKV0dZ3ff_xzYxacXEfZUxoitA8Mzuz0mg8i2qW-hV0wfa2erKQmvRK_0GAeySFuECA4177UXMSUz_nYKh62BhDTyunLSC5BkxDSw78za37tiae747FsXQWdTyALhh5qAkUT5IUVpqPVYN6SPPBCN2S-YShp501GW5ha1lrBhX6R-CvvgZKCU9PrAls2Cl9dlGKmy3j9lWe6aR8DhJ05TpAJQwg3txU7aCLrRfGWd8-HUiYPBd3ViKZYukBcRdJQuQSU2VmSSgzH7jMj5g0bkDZjs0lRdonfJm6uOKpgmLk4kvXd3s7mWhP8YwlHSqeR9r5TGwNNDM-dh6q7ka5s5VpGjCcP0C2Z2SISLpkBjbTkTPwF_2SYtodMmYPRagjS42zmJHymIHHuAeEr22vac3QgjsReCqc0UUjxCgRacUpiEdb1EF3N6tr8EcBSPuNp5cjZgDwdITgSneaG7ROe7Mm-X6OSUnBCTkhxOvRUo6Gu6zqkOrEMHsKsyKnDtu1qs8F_PZplCvWvtbmmMp7C_5-jHh8vGUp5gb84wxhAscPVtuuNrB8sxKZn_-F1_0KfJYxbQ90HJyxdOhcNLA_EID61zYnAIbJEXZ8nBwe7bqfkTrEXoMUZswBHwip63YFF7a4EB8Cq3IhO-WULAIeYnm6Av5KJC_gClf8RnJJm1fr-6WQUiosLENmPwDLfW1F23BZBMd8vqTbF_KSyAusvL1qvgorGKlyL9Ic_7fzMSOVZhoo8EvbjdduIdULGXUL_eMAC5BHjz2HF2UqBSG4ppc-nQIUg6IqY2D2HxQVPid14_RePV6GPhqRfuIF5Rw5cRrGkt7w5v4dsRzpg9JEDA7GQOTkTzR6bTnxeuXKaswtgqO01mi3MBQo7tRC2RK-rxBu_vj60tQ7muwhMnA7jhK7o2A4QAzmS1A8Vy2 "PERT diagram")

**Graf PERT** (izvorna koda :bar_chart: [PlantUML](./gradivo/plantuml/PERT2.puml))

## 6 Vodenje projekta

### 6.1 Dnevnik sprememb

Tukaj so zapisane vse spremembe do trenutne iteracije sistema.


| Datum     | Opis                        | Motivacija                                                                                 | Posledica spremembe                                                                                                  |
|-----------|-----------------------------|---------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------|
| 24.3.2025 | Popravljen opis projekta     | Po prvotnem opisu so nekateri deli projekta delovali preveč splošno ali nedosledno povezani z glavno idejo. Da bi izboljšali razumevanje ciljev in strukture projekta, smo se odločili za prenovo uvodnega opisa ter jasnejše definiranje osnovnega koncepta in pristopa. | Opis projekta je zdaj strukturiran in usklajen z ostalimi deli dokumentacije, kar omogoča boljšo usklajenost članov ekipe in lažje razumevanje projekta za zunanje bralce. |
| 28.3.2025 | Popravljene uporabniške zgodbe | Prvotne uporabniške zgodbe so bile ponekod nepopolne, preveč splošne ali nedovolj povezane s cilji uporabnikov. Zaradi tega ni bilo jasno, kako sistem neposredno odgovarja na potrebe uporabnikov. Popravili smo jih tako, da so bolj realistične in vsebujejo več testov sprejemljivosti. | Izboljšane zgodbe omogočajo boljše načrtovanje funkcionalnosti in testov, hkrati pa pomagajo razumeti konkretne potrebe uporabnikov in kako jih bomo naslovili v sistemu. |
| 28.3.2025 | Popravljena tveganja          | Pri analizi tveganj smo ugotovili, da so bila nekatera tveganja opisana preveč površinsko ali premalo jasno kategorizirana. Da bi zagotovili učinkovitejše upravljanje tveganj, smo jih natančneje razčlenili, jim dodali oceno vpliva in verjetnosti, ter jih razvrstili glede na stopnjo resnosti. | Prenovljena tabela tveganj omogoča boljšo pripravo na možne zaplete pri izvedbi projekta, saj jasno pokaže, katera tveganja so najbolj kritična in katera strategija jih lahko reši. |
| 8.4.2025 | Izključitev android aplikacije iz načrta | Ugotovili smo, da je android aplikacija nekoliko nesmiselna, zato smo se odločili, ker bomo identifikacijo obraza implementirali direktno v spletno aplikacijo, kar je bil glavni razlog, da smo želeli implementirati android aplikacijo. | Identifikacija obraza se bo izvajala v spletni aplikaciji.
| 8.4.2025 | Odprava administratorske uporabniške vloge | Ker bo spletna aplikacija omogočala registracijo, kjer bo uporabnik določil svoje uporabniško ime in geslo, torej ne potrebujemo administratorja, ki bo dodajal/brisal uprabnike. | Uporabniška vloga ne vključuje administratorja. Spremenjen use case diagram.
| 27.4.2025 | Odstranitev funkcionalnosti ročnega preizkusa sistema | Poenostavitev sistema in zmanjšanje kompleksnosti. Funkcionalnost ročnega testiranja ni predstavljala ključne dodane vrednosti za uporabnika. | Use case "Ročni preizkus sistema" je bil odstranjen. Posodobljen use case diagram in ustrezni sprejemni testi. |


### 6.2 Cilji za naslednjo iteracijo

V naslednji iteraciji bomo osredotočeni na dokončanje ključnih tehničnih komponent in njihovo povezovanje v delujoč sistem. Naši glavni cilji so:

- **Vzpostaviti funkcionalno integracijo s Home Assistant**, vključno z zaznavanjem dogodkov in posredovanjem stanja v aplikacijo.
- **Dokončati sistem za obveščanje v realnem času**, ki bo uporabnika obvestil ob sprožitvi alarma (npr. e-pošta, potisna sporočila).
- **Razširiti uporabniški vmesnik** tako, da bo podpiral vse načrtovane funkcionalnosti (prijava, sprememba stanja, zgodovina dogodkov, upravljanje uporabnikov).
- **Preveriti in izboljšati povezavo med komponentami** – od senzorjev prek Home Assistanta do podatkovne baze in uporabniškega vmesnika.
- **Izvesti začetne funkcionalne teste** (sprejemne teste), s poudarkom na preverjanju delovanja ključnih funkcij.
- **Izvesti simulacijo delovanja senzorjev**, če fizična naprava ne bo na voljo.

---

### 6.3 Načrt za preostanek semestra

Za uspešno zaključitev projekta moramo do konca semestra dokončati naslednje naloge:

1. **Povezati vse komponente v celoto** – Home Assistant, Python strežnik, podatkovna baza in uporabniški vmesniki (spletni in mobilni).
2. **Implementirati vse preostale funkcionalnosti**:
   - Pošiljanje obvestil v realnem času
   - Pregled zgodovine dogodkov
   - Dodajanje in brisanje uporabnikov
   - Sprememba načina varovanja (Doma, Odsoten, Izklop)
3. **Izvesti celovito testiranje sistema** – funkcionalno testiranje, testiranje uporabniške izkušnje in stabilnosti.
4. **Dokončati tehnično in uporabniško dokumentacijo**, vključno z opisi komponent, diagrami in navodili za uporabo.
5. **Pripraviti končno predstavitev** – delujoč prototip sistema in strukturirano predstavitev rešitev, ki smo jih razvili.

### 6.2 Projektni načrt

- Posodobljen Ganttov diagram in graf PERT.


## 7 Ekipa

Ker je naša ekipa sestavljena iz štirih članov, moramo delo skrbno razdeliti in dobro sodelovati, da uspemo pravočasno pripraviti vse potrebne komponente sistema. V tej iteraciji smo se osredotočili predvsem na strukturiranje arhitekture, opis ključnih funkcionalnosti ter izdelavo modelov, ki predstavljajo logiko in potek interakcij znotraj sistema.

Delo smo razdelili na več tehničnih in konceptualnih področij: pripravili smo podroben opis spletne aplikacije, razvili razredne in sekvenčne diagrame, ter oblikovali arhitekturne poglede po modelu 4+1. Poseben poudarek smo namenili tudi komunikaciji med komponentami in določanju ključnih entitet in vlog, ki jih sistem uporablja.

Čeprav je bilo to delo večinoma usmerjeno v modeliranje, smo morali sproti usklajevati pojme, vizualno logiko diagramov in način povezovanja med različnimi pogledi. Vsak član je sodeloval pri več tematskih sklopih, pri čemer smo si sproti pomagali, popravljali napake in usklajevali dokumentacijo. Vsi smo prispevali tudi k pisanju poročila, kar je zahtevalo natančno uskladitev vseh modelov in konceptov.


| Tema                                                                                         | Anej | Enej | Ena | Nikola |
|----------------------------------------------------------------------------------------------|:----:|:----:|:---:|:------:|
| Izdelava podrobnega opisa sistema in ključnih funkcionalnosti spletne aplikacije             | 33% |    | 33% |    34%    |
| Razvoj razrednih diagramov za vse glavne funkcionalnosti (registracija, prijava, upravljanje)|   17%   | 16%   |  17%   |  50%     |
| Modeliranje zaporedij interakcij s pomočjo sekvenčnih diagramov                              |  25% |  25%    | 25% |   25%     |
| Uporaba arhitekturnih pogledov (logični, procesni, razvojni, fizični) po modelu 4+1          |    |  50%  | 50%    |      |
| Priprava paketnih diagramov in predstavitev komunikacije med komponentami                    |   50%    |    |     |  50%     |
| Določitev ključnih vlog, entitet in vmesnikov                                                |  35%  |      | 20%  |    45%    |
| Izdelava poročila                                                                            | 20%  | 35%  | 35%      | 10%      | 


Z usklajenim delom smo dosegli jasno strukturiran opis sistema, pripravili ustrezne diagrame in arhitekturne poglede, ki bodo močna podlaga za naslednje korake razvoja.

## 8 Refleksija


### Kaj je šlo po pričakovanjih?

V tej iteraciji smo uspešno dosegli več načrtovanih ciljev, predvsem na področju arhitekturnega načrtovanja, usklajevanja dela v ekipi ter priprave dokumentacije. Sodelovanje med člani je bilo dobro, naloge so bile razdeljene pregledno in večinoma pravočasno izvedene. Pripravili smo razredne in sekvenčne diagrame, definirali arhitekturne poglede po modelu 4+1 in oblikovali strukturo podatkovne baze ter komunikacijo med komponentami. Povezovanje vsebine poročila z diagrami je bilo konsistentno in je prispevalo k boljši preglednosti sistema kot celote. Dobro smo si razdelili delo in delovali enotno kot skupina, k temu pa je pripomoglo to, da smo se redno sestajali, se pravočasno lotili dela ter hodili na konzultacije.


### Kaj ni šlo po pričakovanjih?

Težave so se pojavile pri tehnični integraciji s Home Assistant. Čeprav smo v prejšnji iteraciji vzpostavili osnovno okolje, se je pri nadaljnji implementaciji izkazalo, da komunikacija med Home Assistant in našim strežnikom ni delovala zanesljivo. Poleg tega nam ni uspelo implementirati sistema za obveščanje v realnem času, saj nismo imeli stabilnega vira dogodkov, ki bi sprožil alarm. Zaradi tega tudi testiranje funkcionalnosti in povezovanje s podatkovno bazo ni bilo izvedljivo v celoti.

Pomemben premik, ki se je izkazal za smiselno odločitev, je bil prehod iz Android aplikacije na spletno aplikacijo. Namesto da bi porabili čas za odpravljanje težav pri mobilnem razvoju in konfiguraciji okolij, smo se odločili za razvoj spletne aplikacije kot osrednjega uporabniškega vmesnika. Ta odločitev nam je omogočila hitrejši razvoj, lažje testiranje in enostavnejšo integracijo z sistemom. Na ta način smo ohranili funkcionalnost sistema, obenem pa zmanjšali tveganje za zamudo pri implementaciji.

### Kakšne težave so se pojavile pri ciljih, ki jih niste dosegli?

Največja težava je bila tehnična kompleksnost okolja Home Assistant. Kljub dostopni dokumentaciji smo naleteli na težave z nastavitvijo dogodkov, dostopom do API-ja in prenosom podatkov v naš Python strežnik. Pojavile so se tudi težave z Docker okoljem, zaradi česar ni bilo mogoče stabilno poganjati sistema na vseh napravah v ekipi. Ker zaznavanje dogodkov ni delovalo, nismo mogli aktivirati obvestil ali preveriti zapisov v podatkovno bazo.

### Kako nameravate premagati te težave?

V naslednji fazi bomo ločili razvoj na več manjših korakov. Vsako komponento (Home Assistant, obvestila, baza, API) bomo najprej testirali ločeno, preden jih bomo povezali v celoto. Posebej se bomo osredotočili na razumevanje strukture Home Assistant dogodkov in preverili delovanje osnovnih senzorjev (simuliranih ali fizičnih). V pomoč si bomo vzeli uradno dokumentacijo, odprtokodne primere na GitHubu in po potrebi poiskali nasvet v skupnosti. Prav tako bomo poenotili razvojno okolje, da zmanjšamo razlike med posameznimi računalniki.

### Kaj boste naredili drugače v naslednji iteraciji?

V naslednji iteraciji bomo čim prej začeli z dejansko implementacijo in ne bomo čakali na popolno specifikacijo vseh komponent. Namesto da bi vse načrtovali vnaprej, bomo izbrali strategijo sprotnega povezovanja in testiranja posameznih funkcionalnosti. Več pozornosti bomo namenili preverjanju napak že med razvojem in bolj dosledno beležili spremembe v kodi in konfiguraciji. Cilj je, da ob koncu naslednje iteracije že deluje povezava med vsemi komponentami v realnem času.

