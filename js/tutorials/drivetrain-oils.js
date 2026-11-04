/* Tutorial: Gearbox, transfer case & differential oils. */
(function (S) {
  'use strict';
  var V = function (cs, en) { return { cs: cs, en: en }; };

  S.registerTutorial({
    id: 'drivetrain-oils',
    level: 2,
    status: 'ok',
    thumb: 'drive.diffs',
    time: V('1–3 h', '1–3 h'),
    title: V('Výměna oleje v převodovce a diferenciálech', 'Gearbox & differential oil change'),
    summary: V('Manuál, automat, rozdělovací převodovka, diferenciály. Správná norma, plnicí šroub napřed, správná hladina.', 'Manual, automatic, transfer case, differentials. Correct spec, fill plug first, correct level.'),
    intro: V(
      'Převodovky a diferenciály mají vlastní olej, který stárne – i když výrobce píše „náplň na celou životnost“. Výměna je levná prevence proti drahým opravám.\n\n**Manuální převodovky a diferenciály** se plní plnicím otvorem až po jeho spodní hranu. **Automatické převodovky** mají přesný postup kontroly hladiny při určité teplotě – ten bez diagnostiky nehádejte.',
      'Gearboxes and differentials have their own oil that ages – even when the manufacturer says "lifetime fill". Changing it is cheap prevention against expensive repairs.\n\n**Manual gearboxes and differentials** are filled through the fill hole up to its lower edge. **Automatic transmissions** have an exact level-check procedure at a set temperature – do not guess it without a scan tool.'
    ),
    safety: [
      { level: 'danger', text: V('Pod vůz jen na stojanech (viz **Bezpečné zvednutí vozu**). Pro správnou hladinu musí vůz stát **vodorovně** – zvedněte obě nápravy na stejnou výšku.', 'Only under the car on stands (see **Safely lifting the car**). For a correct level the car must be **level** – lift both axles to the same height.') },
      { level: 'warning', text: V('**Vždy nejdřív povolte PLNICÍ šroub.** Když vypustíte olej a plnicí šroub nepůjde povolit, vůz nemůžete naplnit a nesmíte s ním jet.', '**Always loosen the FILL plug first.** If you drain the oil and the fill plug will not come out, you cannot refill and must not drive.') },
      { level: 'warning', text: V('Použijte **jen olej s normou výrobce**. Nesprávný typ (např. GL-5 místo GL-4, jiné ATF) může poškodit synchrony, lamely nebo spojku pohonu 4×4.', 'Use **only oil meeting the maker\'s spec**. The wrong type (e.g. GL-5 instead of GL-4, a different ATF) can damage synchros, clutch packs or the AWD coupling.') },
      { level: 'warning', text: V('Teplý olej může pálit, převodový olej silně zapáchá (sirné přísady). Rukavice, brýle, větrání.', 'Warm oil can burn; gear oil smells strongly (sulphur additives). Gloves, glasses, ventilation.') },
      { level: 'info', text: V('Starý olej odevzdejte na sběrném dvoře – nikdy do kanálu.', 'Take old oil to a recycling centre – never into a drain.') }
    ],
    tools: [
      V('Hever + 4 stojany (vůz vodorovně)', 'Jack + 4 axle stands (car level)'),
      V('Záchytná vana', 'Drain pan'),
      V('Klíče na zátky (často vnitřní šestihran / čtyřhran / Torx)', 'Plug keys (often hex / square / Torx)'),
      V('Ruční pumpa na převodový olej s hadičkou', 'Hand pump for gear oil with hose'),
      V('Momentový klíč', 'Torque wrench'),
      V('Diagnostika (pro automat)', 'Scan tool (for automatics)'),
      V('Rukavice, brýle, hadry, čistič', 'Gloves, glasses, rags, cleaner')
    ],
    parts: [
      V('Převodový olej / ATF přesně dle normy výrobce', 'Gear oil / ATF exactly to the maker\'s spec'),
      V('Nová těsnění nebo nové zátky', 'New seals or new plugs'),
      V('Filtr a těsnění vany (u automatu, je-li)', 'Filter and pan gasket (automatics, if applicable)')
    ],
    finalChecks: [
      V('Plnicí i vypouštěcí zátky dotaženy momentem, nové těsnění', 'Fill and drain plugs torqued, new seals'),
      V('Hladina správně (spodní hrana otvoru / postup výrobce u automatu)', 'Level correct (lower edge of hole / maker\'s procedure for automatics)'),
      V('Žádné úniky po zkušební jízdě', 'No leaks after the test drive'),
      V('Řazení hladké, bez hluku a vytí', 'Smooth shifting, no noise or whine'),
      V('Datum, km a použitý olej zapsány', 'Date, mileage and oil used recorded')
    ],
    steps: [
      {
        id: 'why', anim: 'drive.diffs',
        title: V('Které jednotky mají vlastní olej', 'Which units have their own oil'),
        body: V(
          'Podle pohonu má vůz jednu až čtyři olejové náplně:\n- **převodovka** (u předokolky často i s diferenciálem ve společné skříni),\n- **automatická převodovka** (ATF),\n- **úhlový převod / rozdělovací převodovka** (4×4),\n- **zadní diferenciál**, případně **spojka pohonu 4×4**.\n\nKaždá má vlastní normu, množství a interval. Zjistěte je pro svůj VIN dřív, než koupíte olej.',
          'Depending on the drivetrain a car has one to four oil fills:\n- **gearbox** (on FWD cars often with the differential in the same case),\n- **automatic transmission** (ATF),\n- **angle gear / transfer case** (AWD),\n- **rear differential**, possibly an **AWD coupling**.\n\nEach has its own spec, capacity and interval. Find them for your VIN before buying oil.'
        ),
        notes: [
          { level: 'tip', text: V('„Náplň na celou životnost“ obvykle znamená životnost do konce záruky. Výměna po 100–120 tis. km je rozumná prevence.', '"Lifetime fill" usually means the life of the warranty. A change every 100–120k km is sensible prevention.') }
        ]
      },
      {
        id: 'spec', anim: 'drive.gl',
        title: V('Kupte správný olej – norma, ne „lepší číslo“', 'Buy the right oil – the spec, not a "better number"'),
        body: V(
          '- **Manuální převodovky:** často GL-4 nebo specifický olej výrobce (např. VW G 052 …).\n- **Diferenciály:** často GL-5, u samosvorných (LSD) někdy se speciální přísadou.\n- **Automaty:** jen ATF s přesným schválením (Mercedes, Volvo, Aisin…).\n\nGL-5 v převodovce předepsané pro GL-4 může poškodit synchronizační kroužky z barevného kovu. Více neznamená lépe.',
          '- **Manual gearboxes:** often GL-4 or a specific maker oil (e.g. VW G 052 …).\n- **Differentials:** often GL-5, limited-slip (LSD) units sometimes with a special additive.\n- **Automatics:** only ATF with the exact approval (Mercedes, Volvo, Aisin…).\n\nGL-5 in a gearbox specified for GL-4 can damage yellow-metal synchro rings. More is not better.'
        ),
        notes: [
          { level: 'warning', text: V('ATF různých specifikací nemíchejte. Nevhodné ATF způsobuje prokluz a tvrdé řazení.', 'Do not mix ATFs from different specs. The wrong ATF causes slip and harsh shifts.') }
        ]
      },
      {
        id: 'lift', anim: 'lift.stands',
        title: V('Zvedněte vůz vodorovně na 4 stojany', 'Lift the car level onto 4 stands'),
        body: V(
          'Hladina se měří u plnicího otvoru, proto musí vůz stát **vodorovně** – obě nápravy na stejné výšce, nebo na zvedáku. Postup viz **Bezpečné zvednutí vozu**.\n\nOlej je lepší vypouštět **teplý** (po 10–15 min jízdy), ale ne horký.',
          'The level is measured at the fill hole, so the car must be **level** – both axles at the same height, or on a lift. See **Safely lifting the car**.\n\nIt is better to drain **warm** oil (after a 10–15 min drive), but not hot.'
        ),
        notes: [
          { level: 'danger', text: V('Proveďte test stability – budete pod vozem pracovat s klíči a silou.', 'Do the stability test – you will be working under the car with wrenches and force.') }
        ]
      },
      {
        id: 'fillFirst', anim: 'drive.fillFirst',
        title: V('NEJDŘÍV povolte plnicí šroub', 'FIRST loosen the fill plug'),
        body: V(
          'Najděte **plnicí** (výše na boku skříně) a **vypouštěcí** (dole) zátku. Okolí očistěte. Pak **nejdřív povolte plnicí zátku** – teprve když jde ven, povolte vypouštěcí.',
          'Locate the **fill** plug (higher on the side of the case) and the **drain** plug (at the bottom). Clean around them. Then **loosen the fill plug first** – only when it comes out, loosen the drain plug.'
        ),
        notes: [
          { level: 'danger', text: V('Pokud plnicí zátka nejde povolit, **nevypouštějte**. Vůz bez oleje v převodovce/diferenciálu se během pár kilometrů zničí.', 'If the fill plug will not come out, **do not drain**. A car with no oil in the gearbox/diff destroys it within a few kilometres.') },
          { level: 'caution', text: V('Zátky mívají vnitřní šestihran / čtyřhran – použijte celý nástrojový nástavec, ať zátku nezakulatíte.', 'Plugs often have an internal hex / square – use a full-depth bit so you do not round the plug.') }
        ]
      },
      {
        id: 'drain', anim: 'drive.drain',
        title: V('Vypusťte starý olej', 'Drain the old oil'),
        body: V(
          'Pod vypouštěcí zátku dejte vanu a zátku vyšroubujte. Nechte olej vytéct (převodový olej je hustý – i 15–20 min).\n\nProhlédněte magnet na zátce: jemná šedá pasta je normální, **kousky kovu, třísky nebo zuby** znamenají vážné opotřebení.',
          'Put the pan under the drain plug and remove it. Let the oil drain (gear oil is thick – up to 15–20 min).\n\nInspect the magnet on the plug: a fine grey paste is normal, **chunks, chips or tooth fragments** mean serious wear.'
        ),
        notes: [
          { level: 'warning', text: V('Kovové kousky na magnetu = poraďte se se servisem dřív, než převodovku naplníte a budete jezdit dál.', 'Metal chunks on the magnet = consult a workshop before refilling and driving on.') }
        ]
      },
      {
        id: 'seal', anim: 'drive.seal',
        title: V('Vypouštěcí zátka s novým těsněním', 'Refit the drain plug with a new seal'),
        body: V(
          'Očistěte zátku i magnet, nasaďte **nové těsnění** (nebo novou zátku, pokud je jednorázová), zašroubujte rukou a dotáhněte momentovým klíčem.',
          'Clean the plug and magnet, fit a **new seal** (or a new plug if it is single-use), thread it in by hand and tighten with a torque wrench.'
        ),
        specs: [{ label: V('Moment zátky', 'Plug torque'), value: V('dle příručky', 'per manual') }],
        notes: [
          { level: 'warning', text: V('Skříně jsou často z hliníku – přetažením strhnete závit (velmi drahá oprava).', 'Cases are often aluminium – over-tightening strips the thread (very expensive repair).') }
        ]
      },
      {
        id: 'fill', anim: 'drive.pump',
        title: V('Naplňte olej plnicím otvorem', 'Fill the oil through the fill hole'),
        body: V(
          'Hadičku ruční pumpy zasuňte do plnicího otvoru a pumpujte, **dokud olej nezačne vytékat** z otvoru zpět. Zapisujte si, kolik jste nalili – mělo by to odpovídat předepsanému množství.',
          'Insert the hand pump hose into the fill hole and pump **until oil starts running back out** of the hole. Note how much you put in – it should roughly match the specified capacity.'
        ),
        notes: [
          { level: 'caution', text: V('Pokud vejde výrazně méně, než kolik má mít, zkontrolujte, že vůz stojí vodorovně a že jste plnili správnou jednotku.', 'If much less goes in than specified, check that the car is level and that you filled the correct unit.') }
        ]
      },
      {
        id: 'level', anim: 'drive.level',
        title: V('Hladina a plnicí zátka', 'Level and fill plug'),
        body: V(
          'U většiny manuálů a diferenciálů je správná hladina **na spodní hraně plnicího otvoru**. Nechte přebytek odkapat, zkontrolujte prstem (ohnutým dolů), že olej sahá k hraně. Pak zašroubujte plnicí zátku s novým těsněním momentem.',
          'On most manuals and differentials the correct level is **at the lower edge of the fill hole**. Let the excess drip out, check with a finger (bent down) that the oil reaches the edge. Then refit the fill plug with a new seal to torque.'
        ),
        notes: [
          { level: 'info', text: V('Některé převodovky mají jiný postup (hladina pod hranou, měrka). Vždy podle příručky.', 'Some gearboxes use a different method (level below the edge, a dipstick). Always follow the manual.'), verify: true }
        ]
      },
      {
        id: 'auto', anim: 'drive.atfTemp',
        title: V('Automatická převodovka: jen podle postupu výrobce', 'Automatic transmission: only per the maker\'s procedure'),
        body: V(
          'U automatů se hladina měří **při běžícím motoru, v P a v přesném teplotním okně ATF**, které čtete diagnostikou. Typicky se olej plní, motor běží, a přebytek vyteče přepadovou trubkou – teprve pak se zašroubuje zátka.\n\n- **Částečná výměna:** vypuštění z vany (+ filtr) vymění jen část ATF; opakováním se podíl nového oleje zvyšuje.\n- **Proplach přístrojem** dělejte jen ve specializovaném servisu.',
          'On automatics the level is checked **with the engine running, in P and in an exact ATF temperature window** read with a scan tool. Typically you fill, the engine runs, and excess drains through the overflow tube – only then the plug goes back in.\n\n- **Partial change:** draining the pan (+ filter) replaces only part of the ATF; repeating raises the share of new oil.\n- **Machine flushing** only at a specialist.'
        ),
        notes: [
          { level: 'danger', text: V('Motor běží a vůz je na stojanech: nikdo nesedí za volantem, zatažená parkovací brzda, P, nesahejte k hnacím hřídelům ani výfuku.', 'The engine is running with the car on stands: nobody at the wheel, parking brake on, P, keep away from driveshafts and exhaust.') },
          { level: 'warning', text: V('Hladinu ATF nikdy nehádejte – přeplnění i nedostatek poškodí převodovku. Bez diagnostiky a znalosti postupu nechte práci servisu.', 'Never guess the ATF level – both over- and underfilling damage the gearbox. Without a scan tool and the procedure, leave it to a workshop.') },
          { level: 'caution', text: V('U staré, nikdy neměněné ATF se o výměně poraďte – změna stavu oleje může u opotřebené převodovky odhalit skryté problémy.', 'For old, never-changed ATF, get advice first – changing the fluid on a worn gearbox can reveal hidden problems.') }
        ]
      },
      {
        id: 'test', anim: 'drive.test',
        title: V('Zkušební jízda a kontrola', 'Test drive and check'),
        body: V(
          'Spusťte vůz, ujeďte 10–20 km a vyzkoušejte řazení všech stupňů (u 4×4 i zatáčky na parkovišti pomalu). Pak zkontrolujte zátky – musí být suché.',
          'Lower the car, drive 10–20 km and try all gears (with AWD also slow turns in a car park). Then check the plugs – they must be dry.'
        ),
        notes: [
          { level: 'tip', text: V('Na štítek si zapište datum, km a typ oleje a nalepte ho do motorového prostoru.', 'Write the date, mileage and oil type on a sticker and put it in the engine bay.') }
        ]
      }
    ],
    vehicles: {
      'skoda-octavia-rs-tdi': {
        status: 'ok',
        specs: [
          { label: V('Převodovka', 'Gearbox'), value: V('6st. manuál 02Q (s diferenciálem, společný olej)', '6-speed manual 02Q (with differential, shared oil)') },
          { label: V('Olej', 'Oil'), value: V('VW G 052 171 (75W-90, GL-4)', 'VW G 052 171 (75W-90, GL-4)'), verify: true },
          { label: V('Množství', 'Capacity'), value: V('cca 2,0–2,3 l', 'approx. 2.0–2.3 L'), verify: true },
          { label: V('Plnění', 'Filling'), value: V('plnicí otvor na boku skříně', 'fill hole on the side of the case'), verify: true }
        ],
        notes: [
          { level: 'info', text: V('Některé verze 02Q nemají vypouštěcí zátku – olej se pak odsává plnicím otvorem nebo vypouští dle ELSA. Ověřte pro svůj kód převodovky.', 'Some 02Q versions have no drain plug – the oil is then extracted through the fill hole or drained per ELSA. Verify for your gearbox code.'), verify: true },
          { level: 'tip', text: V('Ideální chvíle na výměnu oleje je při výměně spojky – převodovka je venku.', 'The ideal time to change the oil is during a clutch job – the gearbox is out.') }
        ],
        steps: {
          auto: { skip: true },
          fill: { specs: [{ label: V('Množství', 'Capacity'), value: V('cca 2,0–2,3 l', 'approx. 2.0–2.3 L'), verify: true }] },
          seal: { specs: [{ label: V('Moment zátek', 'Plug torque'), value: V('dle ELSA (cca 30 Nm)', 'per ELSA (approx. 30 Nm)'), verify: true }] }
        }
      },
      'citroen-jumper-22hdi': {
        status: 'ok',
        specs: [
          { label: V('Převodovka', 'Gearbox'), value: V('6st. manuál, přední náhon (diferenciál ve skříni, společný olej)', '6-speed manual, FWD (differential in the case, shared oil)') },
          { label: V('Zadní náprava', 'Rear axle'), value: V('tuhá, bez diferenciálu – bez oleje', 'beam axle, no differential – no oil') },
          { label: V('Olej', 'Oil'), value: V('dle dílenské dokumentace / štítku (typicky 75W-80 / 75W-90 GL-4 – ověřit)', 'per workshop documentation / label (typically 75W-80 / 75W-90 GL-4 – verify)'), verify: true },
          { label: V('Množství', 'Capacity'), value: V('cca 2,5–3 l', 'approx. 2.5–3 L'), verify: true },
          { label: V('Zátky', 'Plugs'), value: V('plnicí na boku skříně, vypouštěcí dole – umístění ověřte', 'fill on the side of the case, drain at the bottom – verify locations'), verify: true }
        ],
        notes: [
          { level: 'warning', text: V('Těžké vozidlo: zvedejte jen heverem a stojany s nosností min. 3 t a vozidlo musí stát **vodorovně** – jinak hladinu změříte špatně.', 'Heavy vehicle: lift only with a jack and stands rated at least 3 t, and the van must stand **level** – otherwise you will measure the level wrong.') },
          { level: 'info', text: V('Jumper X250 je technicky shodný s Fiat Ducato / Peugeot Boxer – olej a množství ověřte podle kódu převodovky (štítek na skříni / VIN).', 'The Jumper X250 is technically identical to the Fiat Ducato / Peugeot Boxer – verify the oil and capacity by gearbox code (label on the case / VIN).'), verify: true },
          { level: 'tip', text: V('U dodávky s častými rozjezdy s nákladem se vyplatí olej převodovky měnit preventivně (např. každých 100 000 km), i když výrobce interval neuvádí.', 'For a van with frequent loaded starts it pays to change the gearbox oil preventively (e.g. every 100,000 km), even if the maker gives no interval.') }
        ],
        steps: {
          auto: { skip: true },
          fill: { specs: [{ label: V('Množství', 'Capacity'), value: V('cca 2,5–3 l', 'approx. 2.5–3 L'), verify: true }] },
          seal: { specs: [{ label: V('Moment zátek', 'Plug torque'), value: V('dle dílenské dokumentace', 'per workshop documentation'), verify: true }] }
        }
      },
      'toyota-gr-yaris': {
        status: 'ok',
        specs: [
          { label: V('Jednotky', 'Units'), value: V('6MT s předním diferenciálem · rozdělovací převodovka · zadní diferenciál se spojkou', '6MT with front differential · transfer case · rear differential with coupling') },
          { label: V('Olej 6MT', '6MT oil'), value: V('dle TIS (originální MT olej Toyota)', 'per TIS (Toyota genuine MT oil)'), verify: true },
          { label: V('Rozdělovací převodovka', 'Transfer case'), value: V('dle TIS', 'per TIS'), verify: true },
          { label: V('Zadní diferenciál', 'Rear differential'), value: V('dle TIS (u LSD/Torsen specifický olej)', 'per TIS (LSD/Torsen needs a specific oil)'), verify: true },
          { label: V('Množství', 'Capacities'), value: V('každá jednotka jinak – dle TIS', 'different for each unit – per TIS'), verify: true }
        ],
        notes: [
          { level: 'warning', text: V('Postup (plnicí napřed → vypustit → naplnit → hladina) opakujte **pro každou jednotku zvlášť** a s jejím olejem. Neplete si oleje.', 'Repeat the procedure (fill first → drain → fill → level) **for each unit separately** with its own oil. Do not mix up the oils.') },
          { level: 'info', text: V('Při okruhovém ježdění měňte oleje převodovky a diferenciálů mnohem častěji (např. po sezóně) – teplota je extrémní.', 'With track use change gearbox and differential oils much more often (e.g. after each season) – temperatures are extreme.') }
        ],
        steps: {
          auto: { skip: true },
          lift: { body: V('Vůz je nízký – nízkoprofilový hever a stojany. Musí stát vodorovně, všechna 4 kola nad zemí ve stejné výšce.', 'The car is low – low-profile jack and stands. It must stand level, all 4 wheels off the ground at the same height.') }
        }
      },
      'volvo-xc60-b4': {
        status: 'caution',
        specs: [
          { label: V('Automat', 'Automatic'), value: V('Aisin AWF8G45, ATF dle specifikace Volvo', 'Aisin AWF8G45, ATF per Volvo spec'), verify: true },
          { label: V('Kontrola ATF', 'ATF check'), value: V('teplotní okno + přepad, diagnostika VIDA', 'temperature window + overflow, VIDA scan tool'), verify: true },
          { label: V('Úhlový převod (PTU)', 'Angle gear (PTU)'), value: V('vlastní olej – dle VIDA', 'own oil – per VIDA'), verify: true },
          { label: V('Zadní RDU + spojka AWD', 'Rear RDU + AWD coupling'), value: V('vlastní olej(e) – dle VIDA', 'own oil(s) – per VIDA'), verify: true }
        ],
        notes: [
          { level: 'warning', text: V('**Vzduchový podvozek:** před zvedáním zapněte režim pro zvedání / vypněte regulaci výšky. Pro správnou hladinu musí být vůz vodorovně – viz návod na zvedání.', '**Air suspension:** activate jacking mode / disable level control before lifting. The car must be level for a correct reading – see the lifting tutorial.') },
          { level: 'info', text: V('Kroky s plnicí zátkou platí pro úhlový převod a zadní diferenciál. Automat má vlastní postup (krok „Automatická převodovka“).', 'The fill-plug steps apply to the angle gear and rear differential. The automatic has its own procedure (the "Automatic transmission" step).') },
          { level: 'info', text: V('Spojka AWD v zadní jednotce může mít vlastní olej a filtr / servisní interval – ověřte ve VIDA.', 'The AWD coupling in the rear unit may have its own oil and filter / service interval – verify in VIDA.'), verify: true }
        ],
        steps: {
          auto: { body: V('ATF Aisin AWF8G45 se kontroluje podle postupu ve VIDA: motor běží, P, vůz vodorovně, teplota ATF v předepsaném okně (čtená ve VIDA), přebytek vyteče kontrolním otvorem. Bez VIDA nebo kompatibilního testeru tuto část nedělejte.', 'Aisin AWF8G45 ATF is checked per the VIDA procedure: engine running, P, car level, ATF temperature in the specified window (read in VIDA), excess drains through the check hole. Do not do this part without VIDA or a compatible tester.'), notes: [{ level: 'info', text: V('Přesné teplotní okno a množství ověřte ve VIDA pro svůj VIN.', 'Verify the exact temperature window and capacity in VIDA for your VIN.'), verify: true }] }
        }
      },
      'mb-cl500-c216': {
        status: 'caution',
        specs: [
          { label: V('Automat', 'Automatic'), value: V('7G-Tronic 722.9', '7G-Tronic 722.9') },
          { label: V('ATF', 'ATF'), value: V('MB 236.14 / 236.15 (dle data výroby)', 'MB 236.14 / 236.15 (depends on build date)'), verify: true },
          { label: V('Množství', 'Capacity'), value: V('celkem cca 9 l, výměna s vanou cca 5–7 l', 'approx. 9 L total, pan change approx. 5–7 L'), verify: true },
          { label: V('Kontrola hladiny', 'Level check'), value: V('při cca 80 °C ATF (XENTRY) + speciální měrka', 'at approx. 80 °C ATF (XENTRY) + special dipstick tool'), verify: true },
          { label: V('Zadní diferenciál', 'Rear differential'), value: V('olej MB 235.x – dle WIS', 'MB 235.x oil – per WIS'), verify: true }
        ],
        notes: [
          { level: 'warning', text: V('**ABC podvozek:** nikdy nespoléhejte na hydrauliku podvozku, jen stojany pod zvedacími body – viz návod na zvedání.', '**ABC suspension:** never rely on the suspension hydraulics, only stands under the jacking points – see the lifting tutorial.') },
          { level: 'info', text: V('Kroky s plnicí zátkou platí pro zadní diferenciál. Automat má vlastní postup (krok „Automatická převodovka“ a výměna vany s filtrem).', 'The fill-plug steps apply to the rear differential. The automatic has its own procedure (the "Automatic transmission" step and the pan & filter change).') }
        ],
        tools: [V('XENTRY / tester s podporou MB (teplota ATF)', 'XENTRY / tester with MB support (ATF temperature)'), V('Měrka ATF pro 722.9 (speciální nářadí)', 'ATF dipstick tool for 722.9 (special tool)')],
        parts: [
          V('ATF MB 236.14 / 236.15 (cca 7–8 l)', 'ATF MB 236.14 / 236.15 (approx. 7–8 L)'),
          V('Filtr ATF + těsnění vany 722.9', 'ATF filter + pan gasket 722.9'),
          V('Nové šrouby vany / vypouštěcí zátka + těsnění', 'New pan bolts / drain plug + seal'),
          V('Olej zadního diferenciálu dle WIS', 'Rear differential oil per WIS')
        ],
        steps: {
          auto: { body: V('7G-Tronic nemá klasickou měrku. Po naplnění se hladina kontroluje **speciální měrkou** při běžícím motoru, v P a při teplotě ATF cca **80 °C** odečtené v XENTRY. Bez XENTRY / kompatibilního testeru tuto část nedělejte.', 'The 7G-Tronic has no conventional dipstick. After filling, the level is checked with a **special dipstick tool** with the engine running, in P and at an ATF temperature of approx. **80 °C** read in XENTRY. Do not do this part without XENTRY / a compatible tester.'), specs: [{ label: V('Teplota ATF', 'ATF temperature'), value: V('cca 80 °C', 'approx. 80 °C'), verify: true }] }
        },
        extraSteps: [
          {
            after: 'auto',
            step: {
              id: 'mb-pan', anim: 'drive.drain',
              title: V('7G-Tronic: vypuštění, vana a filtr', '7G-Tronic: drain, pan and filter'),
              body: V(
                '1. Vypusťte ATF vypouštěcí zátkou vany.\n2. Povolte šrouby vany, vanu opatrně sundejte (zůstane v ní olej).\n3. Vyměňte filtr ATF a těsnění vany, vyčistěte vanu a magnety.\n4. Vanu namontujte s novými šrouby / momentem dle WIS.\n5. Naplňte ATF a kontrolujte hladinu při 80 °C (viz předchozí krok).',
                '1. Drain the ATF through the pan drain plug.\n2. Undo the pan bolts and lower the pan carefully (it still holds oil).\n3. Replace the ATF filter and pan gasket, clean the pan and magnets.\n4. Refit the pan with new bolts / torque per WIS.\n5. Fill with ATF and check the level at 80 °C (see previous step).'
              ),
              notes: [
                { level: 'caution', text: V('Vana je plastová / tenkostěnná – šrouby dotahujte malým momentem do kříže dle WIS, jinak praskne nebo bude netěsnit.', 'The pan is plastic / thin-walled – tighten the bolts to a low torque in a star pattern per WIS, otherwise it cracks or leaks.'), verify: true },
                { level: 'info', text: V('Výměnou vany se vymění jen část ATF (měnič zůstane plný). Pro vyšší podíl nového oleje se výměna opakuje.', 'A pan change replaces only part of the ATF (the converter stays full). Repeat the change for a higher share of new fluid.') }
              ]
            }
          }
        ]
      }
    }
  });
})(window.STU);
