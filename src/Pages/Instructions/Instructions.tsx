import React from 'react';
import styles from './Instructions.module.css';
import TGameNamesForPoints from '../../interfaces/gameNamesForPoints';

interface InstructionsProps {
  openPage: (name: TGameNamesForPoints | 'control-panel' | 'instructions' | '') => void
}

const Instructions: React.FC<InstructionsProps> = ({openPage}: InstructionsProps) => {
  return (
    <div className={styles.instructionsContainer}>
      <div className={styles.instructionsContentWrapper}>
        <h1 className={styles.instructionsTitle}>
          Uputstva
        </h1>
        <div className={styles.instructionsSection}>
          <p className={styles.instructionsParagraph}>
            <strong>Slagalica</strong> je digitalna verzija popularnog televizijskog kviza koji se već decenijama prikazuje u Srbiji i regionu. 
            Emisija je poznata po tome što testira znanje, logiku, snalažljivost i brzinu razmišljanja kroz niz različitih i uzbudljivih igara.
          </p>
          <p className={styles.instructionsParagraph}>
            Ova verzija Slagalice omogućava igračima da kroz zabavan i izazovan format vježbaju različite vrste vještina — od jezičkih i matematičkih, do geografskih i logičkih.
          </p>
          <p className={styles.instructionsParagraph}>
            U okviru ove aplikacije dostupno je <strong>10 različitih igara</strong>. Svaka igra donosi novi tip izazova, osmišljen tako da aktivira različite oblike razmišljanja i snalažljivosti. 
            Neke igre su vremenski ograničene, dok druge zahtijevaju precizno povezivanje pojmova, brzo računanje ili bogato opšte znanje.
          </p>
        </div>
        <SlagalicaSection />
        <MojBrojSection />
        <SpajalicaSection />
        <ParoviSection />
        <DesnoLijevoSection />
        <SefSection />
        <ZidSection />
        <PutOkoSvijetaSection />
        <AsocijacijeSection />
        <PremetaljkaSection />
        <button onClick={() => openPage('control-panel')}>Vrati se nazad</button>
      </div>
    </div>
  );
};

const SlagalicaSection: React.FC = () => (
    <div className={styles.instructionsSection}>
      <h2 className={styles.subTitle}>Slagalica</h2>
      <p className={styles.instructionsParagraph}>
        Slagalica je klasična igra slaganja riječi u kojoj je cilj od ponuđenih slova sastaviti najdužu moguću riječ. 
        Ova igra testira igračevo znanje jezika, brzinu razmišljanja i sposobnost kombinovanja slova.
      </p>
      <p className={styles.instructionsParagraph}>
        Na početku igre, prikazuje se 12 nasumično odabranih slova. Igrač ima <strong>90 sekundi</strong> da unese riječ koja koristi ta slova.
        Slova se mogu koristiti samo onoliko puta koliko se pojavljuju u ponuđenom skupu.
      </p>
      <p className={styles.instructionsParagraph}>
        <strong>Pravila bodovanja:</strong><br />
        <ul>
          <li>Za svako ispravno slovo u riječi, igrač dobija <strong>2 poena</strong>. </li>
          <li>Ako je unijeta riječ duža od riječi koju je kompjuter pronašao kao najdužu, igrač dobija dodatni <strong>bonus od 6 poena</strong>.</li>
        </ul>
      </p>
    </div>
)

const MojBrojSection: React.FC = () => {
  return (
    <div className={styles.instructionsSection}>
      <h2 className={styles.subTitle}> Moj Broj</h2>
      <p className={styles.instructionsParagraph}>
        Moj Broj je matematička igra u kojoj je cilj doći do zadatog broja koristeći ponuđene brojeve i osnovne matematičke operacije:
        sabiranje, oduzimanje, množenje i dijeljenje.
      </p>
      <p className={styles.instructionsParagraph}>
        Na početku igre igraču se nasumično dodijeli 6 brojeva i jedan ciljani broj. Koristeći ponuđene brojeve, igrač pokušava
        da izračuna ciljani broj ili što bliži mogući rezultat, u vremenskom roku od <strong>90 sekundi</strong>.
      </p>
      <p className={styles.instructionsParagraph}>
        Svaki broj iz ponude može se koristiti najviše jednom. Do rezultata se može doći bilo kojom kombinacijom dozvoljenih operacija,
        poštujući matematička pravila i redoslijed izvođenja.
      </p>
      <p className={styles.instructionsParagraph}>
        <strong>Bodovanje:</strong>
      </p>
      <ul className={styles.instructionsParagraph}>
        <li><strong>30 poena</strong> za tačno pogođen broj</li>
        <li><strong>20 poena</strong> ako je razlika ≤ 5</li>
        <li><strong>10 poena</strong> ako je razlika ≤ 10</li>
        <li><strong>5 poena</strong> ako je razlika ≤ 20</li>
        <li><strong>0 poena</strong> u svim ostalim slučajevima</li>
      </ul>
    </div>
  );
};

const SpajalicaSection: React.FC = () => {
  return (
    <div className={styles.instructionsSection}>
      <h2 className={styles.subTitle}>Spajalica</h2>
      <p className={styles.instructionsParagraph}>
        Spajalica je igra u kojoj je cilj da igrač poveže pojmove iz dvije kolone tako da zajedno čine logičke parove.
        U svakoj igri prikazuje se po 8 pojmova sa lijeve i 8 pojmova sa desne strane.
      </p>
      <p className={styles.instructionsParagraph}>
        Igrač treba da pronađe i spoji svih 8 tačnih parova u vremenskom roku od <strong>90 sekundi</strong>.
        Pojmovi mogu biti povezani tematski, značenjski, gramatički ili na osnovu opšteg znanja.
      </p>
      <p className={styles.instructionsParagraph}>
        <strong>Bodovanje:</strong>
      </p>
      <ul className={styles.instructionsParagraph}>
        <li><strong>4 poena</strong> za svaki tačno spojen par</li>
      </ul>
      <p className={styles.instructionsParagraph}>
        <strong>Ukoliko tekst u nekom polju nije vidljiv, desni klik na polje ako ste na računaru ili pritisnite i zadržite ako ste na mobilnom telefonu, kako bi se prikazao sav tekst!</strong>
      </p>
    </div>
  );
};

const ParoviSection: React.FC = () => {
  return (
    <div className={styles.instructionsSection}>
      <h2 className={styles.subTitle}>Parovi</h2>
      <p className={styles.instructionsParagraph}>
        Parovi je jednostavna memorijska igra u kojoj je cilj pronaći svih <strong>8 parova sličica</strong>.
        Igrač na početku igre ima <strong>12 pokušaja</strong> da otkrije sve parove.
      </p>
      <p className={styles.instructionsParagraph}>
        U svakom pokušaju igrač otkriva dvije sličice:
      </p>
      <ul className={styles.instructionsParagraph}>
        <li>Ako su sličice iste, smatra se da je pronađen par i one ostaju otkrivene. Igrač ne gubi pokušaj i osvaja <strong>2 poena</strong>.</li>
        <li>Ako sličice nisu iste, smatra se da par nije pronađen. Sličice se ponovo skrivaju i igrač gubi jedan pokušaj.</li>
      </ul>
      <p className={styles.instructionsParagraph}>
        Igra završava na jedan od sljedeća dva načina:
      </p>
      <ul className={styles.instructionsParagraph}>
        <li>Igrač pronađe svih 8 parova – u tom slučaju dobija <strong>bonus po 1 poen</strong> za svaki neiskorišteni pokušaj.</li>
        <li>Igraču ponestane pokušaja – u tom slučaju ne dobija bonus, već samo poene za parove koje je uspio pronaći.</li>
      </ul>
    </div>
  );
};

const DesnoLijevoSection: React.FC = () => {
  return (
    <div className={styles.instructionsSection}>
      <h2 className={styles.subTitle}>Desno – Lijevo</h2>
      <p className={styles.instructionsParagraph}>
        Desno – Lijevo je igra u kojoj se od igrača traži da prepozna i odabere pojmove koji pripadaju zadatoj grupi. 
        Na početku igre prikazuje se <strong>tema (opis grupe pojmova)</strong> i ukupno <strong>14 pojmova</strong>, od kojih tačno <strong>7 pripada grupi</strong>, dok <strong>7 ne pripada</strong>.
      </p>
      <p className={styles.instructionsParagraph}>
        Igrač ima <strong>50 sekundi</strong> da pažljivo pročita pojmove i odabere one koje smatra ispravnima.
      </p>
      <p className={styles.instructionsParagraph}>
        Bodovanje se vrši na sljedeći način:
      </p>
      <ul className={styles.instructionsParagraph}>
        <li>Za svaki tačno odabran pojam igrač dobija <strong>2 poena</strong>.</li>
        <li>Ako igrač tačno identifikuje svih 7 pojmova, dobija <strong>bonus od 1 poena</strong>.</li>
      </ul>
      <p className={styles.instructionsParagraph}>
        <strong>Ukoliko tekst u nekom polju nije vidljiv, desni klik na polje ako ste na računaru ili pritisnite i zadržite ako ste na mobilnom telefonu, kako bi se prikazao sav tekst!</strong>
      </p>
    </div>
  );
};

const SefSection: React.FC = () => {
  return (
    <div className={styles.instructionsSection}>
      <h2 className={styles.subTitle}>Sef</h2>
      <p className={styles.instructionsParagraph}>
        Sef je igra logičkog zaključivanja u kojoj je cilj otkriti četvorocifrenu kombinaciju brojeva. Svaki broj u kombinaciji je iz skupa brojeva od 1 do 6, a brojevi se mogu ponavljati.
      </p>
      <p className={styles.instructionsParagraph}>
        Kombinacija brojeva je nasumično generisana i redoslijed brojeva u kombinaciji je važan. Igrač unosi svoje pokušaje da otkrije kombinaciju, a nakon svakog pokušaja dobija povratnu informaciju o tome:
      </p>
      <ul className={styles.instructionsParagraph}>
        <li>koliko brojeva je na tačnoj poziciji,</li>
        <li>i koliko brojeva se nalaze u kombinaciji, ali na pogrešnoj poziciji.</li>
      </ul>
      <p className={styles.instructionsParagraph}>
        Za pogađanje kombinacije igrač ima <strong>90 sekundi</strong>.
      </p>
      <p className={styles.instructionsParagraph}>
        Svaki put kada igrač potvrdi unesenu kombinaciju, prikazuju se četiri indikatora koji pomažu u analizi pokušaja:
      </p>
      <ul className={styles.instructionsParagraph}>
        <li><strong>Crveni indikator</strong> označava broj koji je na pravoj poziciji,</li>
        <li><strong>Žuti indikator</strong> označava broj koji se nalazi u kombinaciji, ali nije na pravom mjestu,</li>
        <li><strong>Sivi indikator</strong> označava broj koji se ne nalazi u kombinaciji.</li>
      </ul>
      <p className={styles.instructionsParagraph}>
        Bodovanje se vrši na sljedeći način:
      </p>
      <ul className={styles.instructionsParagraph}>
        <li><strong>15 poena</strong> za tačno pogođenu kombinaciju,</li>
        <li><strong>5 poena</strong> za svaki neiskorišteni pokušaj koji je ostao nakon što je kombinacija pogođena.</li>
      </ul>
    </div>
  );
};

const ZidSection: React.FC = () => {
  return (
    <div className={styles.instructionsSection}>
      <h2 className={styles.subTitle}>Zid</h2>
      <p className={styles.instructionsParagraph}>
        Zid je igra opažanja i znanja u kojoj se iza 12 cigli krije poznata ličnost. Cilj igre je otkriti o kojoj ličnosti je riječ tako što igrač postepeno ruši cigle odgovarajući na pitanja.
      </p>
      <p className={styles.instructionsParagraph}>
        Na svakoj cigli se nalazi jedno pitanje sa 4 ponuđena odgovora. Igrač klikom na ciglu otkriva pitanje, a zatim bira odgovor:
      </p>
      <ul className={styles.instructionsParagraph}>
        <li>Ako je odgovor tačan, cigla se ruši, otkriva se dio slike i igrač dobija <strong>3 poena</strong>.</li>
        <li>Ako je odgovor netačan, cigla postaje blokirana i igrač gubi <strong>1 poen</strong>.</li>
      </ul>
      <p className={styles.instructionsParagraph}>
        Igra se završava na jedan od dva načina:
      </p>
      <ul className={styles.instructionsParagraph}>
        <li>Ako igrač tačno pogodi o kojoj ličnosti se radi,</li>
        <li>Ili ako su sve cigle ili srušene ili blokirane.</li>
      </ul>
      <p className={styles.instructionsParagraph}>
        Ukoliko igrač pogodi ko se krije iza zida, osim sakupljenih poena, dobija i <strong>bonus od 4 poena za svaku preostalu ciglu koja nije srušena niti blokirana</strong>.
      </p>
      <p className={styles.instructionsParagraph}>
        Ako ne pogodi, zadržava samo poene osvojene rušenjem cigli.
      </p>
      <p className={styles.instructionsParagraph}>
        Za igru igrač ima <strong>180 sekundi</strong>.
      </p>
    </div>
  );
};

const PutOkoSvijetaSection: React.FC = () => {
  return (
    <div className={styles.instructionsSection}>
      <h2 className={styles.subTitle}>Put oko svijeta</h2>
      <p className={styles.instructionsParagraph}>
        Put oko svijeta je igra znanja u kojoj igrač ima zadatak da prepozna države na osnovu njihovih zastava.
      </p>
      <p className={styles.instructionsParagraph}>
        U svakoj rundi prikazuje se jedna zastava, a igrač može izabrati između dvije opcije:
      </p>
      <ul className={styles.instructionsParagraph}>
        <li>Pokušati pogoditi naziv države među <strong>4 ponuđena odgovora</strong>,</li>
        <li>Ili preskočiti trenutnu zastavu i preći na narednu.</li>
      </ul>
      <p className={styles.instructionsParagraph}>
        Sistem bodovanja funkcioniše na sljedeći način:
      </p>
      <ul className={styles.instructionsParagraph}>
        <li>Tačan odgovor donosi <strong>4 poena</strong>.</li>
        <li>Netačan odgovor oduzima <strong>2 poena</strong>.</li>
        <li>Preskakanje ne donosi niti oduzima poene.</li>
      </ul>
      <p className={styles.instructionsParagraph}>
        Igra traje ima tačno <strong>10 rundi</strong>. 
      </p>
      <p className={styles.instructionsParagraph}>
        Ukupno vrijeme predviđeno za igru je <strong>150 sekundi</strong>.
      </p>
    </div>
  );
};

const AsocijacijeSection: React.FC = () => {
  return (
    <div className={styles.instructionsSection}>
      <h2 className={styles.subTitle}>Asocijacije</h2>
      <p className={styles.instructionsParagraph}>
        U igri Asocijacije cilj je da se otkriju četiri pojma, kao i konačno rješenje koje povezuje sve prethodne pojmove.
      </p>
      <p className={styles.instructionsParagraph}>
        Tabla je podijeljena na četiri kolone, a svaka kolona sadrži četiri polja sa pojmovima. Igrač može redom otkrivati polja kako bi pronašao zajedničku nit koja povezuje pojmove u koloni.
      </p>
      <p className={styles.instructionsParagraph}>
        Kada igrač smatra da zna rješenje određene kolone, može ga unijeti ručno. Isto važi i za konačno rješenje koje povezuje sve četiri kolone.
      </p>
      <p className={styles.instructionsParagraph}>
        Bodovanje u igri funkcioniše na sljedeći način:
      </p>
      <ul className={styles.instructionsParagraph}>
        <li>Tačno rješenje jedne kolone donosi <strong>5 poena</strong> i bonus <strong>po 1 poen</strong> za svako neoktriveno polje u koloni.</li>
        <li>Tačno konačno rješenje donosi dodatnih <strong>12 poena</strong>, bonus <strong>6 poena</strong> za svako neoktriveno rješenje kolone i bonus <strong>po 1 poen</strong> za svako neoktriveno polje u kolonama.</li>
      </ul>
      <p className={styles.instructionsParagraph}>
        Ukupno vrijeme predviđeno za igru je <strong>180 sekundi</strong>.
      </p>
      <p className={styles.instructionsParagraph}>
        <strong>Ukoliko tekst u nekom polju nije vidljiv, desni klik na polje ako ste na računaru ili pritisnite i zadržite ako ste na mobilnom telefonu, kako bi se prikazao sav tekst!</strong>
      </p>
    </div>
  );
};

const PremetaljkaSection: React.FC = () => {
  return (
    <div className={styles.instructionsSection}>
      <h2 className={styles.subTitle}>Premetaljka</h2>
      <p className={styles.instructionsParagraph}>
        U igri Premetaljka igraču se prikazuju tri riječi čija su slova nasumično ispremetana. Cilj igre je da igrač pravilno premetne slova kako bi otkrio originalne riječi.
      </p>
      <p className={styles.instructionsParagraph}>
        Kada igrač uspješno pogodi riječ, slova te riječi pozelenjuju, čime se potvrđuje tačan odgovor.
      </p>
      <p className={styles.instructionsParagraph}>
        Za svako tačno pronađeno slovo igrač dobija <strong>1 poen</strong>.
      </p>
      <p className={styles.instructionsParagraph}>
        Ukupno vrijeme predviđeno za ovu igru je <strong>180 sekundi</strong>.
      </p>
    </div>
  );
};


export default Instructions;
