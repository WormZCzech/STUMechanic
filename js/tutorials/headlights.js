/* Tutorial: Headlights – bulb replacement, whole unit replacement, aiming. */
(function (S) {
  'use strict';
  var V = function (cs, en) { return { cs: cs, en: en }; };

  var LED_STEP = {
    id: 'led', anim: 'lights.ledUnit',
    title: V('LED světlomet: žárovky se nemění', 'LED headlight: no bulbs to change'),
    body: V(
      'Váš vůz má **LED světlomety** – nemají vyměnitelné žárovky. Když nesvítí některá funkce, postupujte takto:\n\n1. Zkontrolujte pojistky a konektor světla.\n2. Přečtěte chybové kódy diagnostikou (modul světel).\n3. Teprve pak měňte **celé světlo** (nebo samostatný LED modul / řídicí jednotku, pokud je výrobce dodává zvlášť).',
      'Your car has **LED headlights** – they have no replaceable bulbs. If a function is out, do this:\n\n1. Check the fuses and the lamp connector.\n2. Read fault codes with a scan tool (lighting module).\n3. Only then replace the **whole lamp** (or a separate LED module / control unit if the manufacturer supplies it separately).'
    ),
    notes: [
      { level: 'caution', text: V('LED světlomet je drahý díl. Než ho objednáte, nechte potvrdit závadu diagnostikou – často je vinen konektor, pojistka nebo kabel.', 'An LED headlight is an expensive part. Before ordering one, confirm the fault with diagnostics – often a connector, fuse or wire is to blame.') },
      { level: 'info', text: V('Kondenzace (mlha) uvnitř LED světla po mytí bývá normální a zmizí po pár minutách svícení. Kapky vody nebo stojící voda normální nejsou.', 'Condensation (mist) inside an LED lamp after washing can be normal and disappears after a few minutes of use. Water droplets or standing water are not normal.') }
    ]
  };

  S.registerTutorial({
    id: 'headlights',
    level: 1,
    thumb: 'lights.bulbSwap',
    time: V('15 min – 3 h (dle práce)', '15 min – 3 h (depends on job)'),
    title: V('Přední světlomety: žárovky, výměna světla, seřízení', 'Headlights: bulbs, unit replacement, aiming'),
    summary: V('Výměna žárovky (halogen / xenon), demontáž celého světla, základní nastavení a seřízení podle stěny.', 'Bulb replacement (halogen / xenon), removing the whole lamp, basic setting and aiming against a wall.'),
    intro: V(
      'Tento návod pokrývá tři práce: **výměnu žárovky**, **výměnu celého světlometu** a **seřízení světel**. Kroky, které pro vaši práci nepotřebujete, přeskočte.\n\nPozor: **xenonová světla pracují při zapalování s napětím cca 25 000 V**. Špatně seřízená světla oslňují protijedoucí řidiče a neprojdou STK.',
      'This tutorial covers three jobs: **bulb replacement**, **replacing the whole headlight** and **headlight aiming**. Skip the steps you do not need for your job.\n\nCaution: **xenon lamps ignite at approx. 25,000 V**. Badly aimed headlights dazzle oncoming drivers and fail the MOT (STK).'
    ),
    safety: [
      { level: 'danger', text: V('**Xenon:** zapalovač výbojky vytváří impuls cca **25 kV**. Před prací: světla VYP, zapalování VYP, klíč mimo vůz, konektor výbojky odpojit. Nikdy nezapínejte světla s vyjmutou výbojkou nebo otevřeným krytem.', '**Xenon:** the bulb ignitor produces a pulse of approx. **25 kV**. Before working: lights OFF, ignition OFF, key out of the car, unplug the bulb connector. Never switch the lights on with the bulb removed or the cover open.') },
      { level: 'warning', text: V('Žárovky po svícení pálí (halogen přes 200 °C). Nechte je vychladnout aspoň 5–10 minut.', 'Bulbs are very hot after use (halogen over 200 °C). Let them cool for at least 5–10 minutes.') },
      { level: 'warning', text: V('Xenonová výbojka vyzařuje UV a obsahuje **rtuť** – do zapnutého světla se nedívejte, rozbitou výbojku nesahejte holýma rukama a odevzdejte ji jako nebezpečný odpad.', 'A xenon bulb emits UV and contains **mercury** – do not look into a lit lamp, do not handle a broken bulb with bare hands and dispose of it as hazardous waste.') },
      { level: 'caution', text: V('Sklo žárovky nechytejte prsty – mastnota způsobí přehřátí a prasknutí (halogen) nebo zkrátí životnost (xenon). Rukavice, držet za patici.', 'Never touch the bulb glass with your fingers – skin oil causes overheating and cracking (halogen) or shortens life (xenon). Gloves, hold it by the base.') },
      { level: 'caution', text: V('LED „žárovky“ do halogenových nebo xenonových světlometů nejsou homologované pro silniční provoz (pokud nemají schválení přímo pro dané světlo) – STK je neuzná a mohou oslňovat.', 'LED retrofit "bulbs" in halogen or xenon headlights are not road-legal unless approved for that exact lamp – they fail the STK and can dazzle others.'), verify: true },
      { level: 'info', text: V('Žárovky měňte **v páru** (obě strany) – zvlášť u xenonu se stará a nová výbojka liší barvou světla.', 'Replace bulbs **in pairs** (both sides) – especially with xenon, an old and new bulb have a different light colour.') }
    ],
    tools: [
      V('Nitrilové rukavice (čisté)', 'Nitrile gloves (clean)'),
      V('Sada šroubováků a Torx bitů', 'Screwdriver and Torx bit set'),
      V('Ráčna s hlavicemi 7–13 mm', 'Ratchet with 7–13 mm sockets'),
      V('Plastové páčidlo na spony', 'Plastic trim / clip tool'),
      V('Čelovka nebo svítilna', 'Head torch or flashlight'),
      V('Měřicí pásmo + lepicí páska (seřízení)', 'Tape measure + masking tape (aiming)'),
      V('Diagnostika se základním nastavením světel (xenon/LED)', 'Scan tool with headlight basic setting (xenon/LED)')
    ],
    parts: [
      V('Žárovka / výbojka dle typu (2 ks – výměna v páru)', 'Bulb by type (2 pcs – replace in pairs)'),
      V('Při výměně celého světla: nový světlomet, příp. nové spony / šrouby', 'For whole-unit replacement: new headlight, possibly new clips / bolts'),
      V('Těsnění zadního krytu (pokud je poškozené)', 'Rear cover seal (if damaged)')
    ],
    finalChecks: [
      V('Všechny funkce svítí: potkávací, dálková, obrysová / denní, blinkry (příp. AFS)', 'All functions work: low, high, position / DRL, indicators (and AFS)'),
      V('Na přístrojové desce žádná kontrolka poruchy světel', 'No lighting fault warning on the dashboard'),
      V('Zadní kryty světel dobře zavřené (voda!)', 'Lamp rear covers properly closed (water!)'),
      V('Světla seřízená – neoslňují', 'Headlights aimed – not dazzling'),
      V('Stará xenonová výbojka odevzdána jako nebezpečný odpad', 'Old xenon bulb disposed of as hazardous waste'),
      V('Při pochybnostech kontrola seřízení na STK / v servisu (regloskop)', 'If in doubt, have the aim checked at an STK / garage (beam setter)')
    ],
    steps: [
      {
        id: 'identify', anim: 'lights.types',
        title: V('Zjistěte typ světlometu a žárovky', 'Identify the headlight and bulb type'),
        body: V(
          'Typ najdete v uživatelské příručce, na štítku světla nebo na staré žárovce:\n- **Halogen:** H7, H1, H4, H11… (12 V, obyčejná výměna)\n- **Xenon:** D1S, D2S, D3S, D4S… (vysoké napětí!)\n- **LED:** většinou bez vyměnitelných žárovek – mění se celé světlo nebo modul.',
          'You find the type in the owner\'s manual, on the lamp label or on the old bulb:\n- **Halogen:** H7, H1, H4, H11… (12 V, simple swap)\n- **Xenon:** D1S, D2S, D3S, D4S… (high voltage!)\n- **LED:** usually no replaceable bulbs – the whole lamp or module is replaced.'
        ),
        notes: [
          { level: 'caution', text: V('Kupujte žárovky se značkou **E** (homologace) od známých výrobců. Levné výbojky mívají špatnou barvu a krátkou životnost.', 'Buy bulbs with an **E-mark** (approval) from known brands. Cheap xenon bulbs often have the wrong colour and a short life.') }
        ]
      },
      {
        id: 'prepare', anim: 'lights.xenonHv',
        title: V('Bezpečně vypněte a připravte', 'Switch off safely and prepare'),
        body: V(
          '1. Přepínač světel na **0 / VYP** (ne AUTO).\n2. Zapalování vypněte, klíč (i Keyless) dejte z dosahu vozu.\n3. Nechte světla vychladnout 5–10 minut.\n4. Nasaďte rukavice.',
          '1. Light switch to **0 / OFF** (not AUTO).\n2. Switch the ignition off, keep the key (incl. keyless) out of range.\n3. Let the lamps cool for 5–10 minutes.\n4. Put on gloves.'
        ),
        notes: [
          { level: 'danger', text: V('U xenonu nikdy neměřte ani nesahejte do konektoru výbojky nebo zapalovače za zapnutých světel. Impuls 25 kV prorazí i izolaci nářadí.', 'With xenon, never probe or touch the bulb or ignitor connector with the lights on. A 25 kV pulse breaks through tool insulation too.') },
          { level: 'info', text: V('Režim AUTO nebo denní svícení se mohou samy zapnout – proto VYP a klíč mimo vůz.', 'AUTO mode or daytime running lights can switch on by themselves – hence OFF and the key away from the car.') }
        ]
      },
      {
        id: 'access', anim: 'lights.access',
        title: V('Získejte přístup k zadní části světla', 'Get access to the back of the lamp'),
        body: V(
          'Otevřete kapotu a zajistěte ji. U některých vozů je za světlem baterie, vzduchový filtr nebo nádržka ostřikovačů – někdy je jednodušší je dočasně vyndat. Jinde se jde přes **otvor v podběhu** (natočte kolo a odklopte krytku).',
          'Open the bonnet and secure it. On some cars the battery, air box or washer reservoir sits behind the lamp – sometimes it is easier to remove them temporarily. Elsewhere access is through a **flap in the wheel-arch liner** (turn the wheel and open the flap).'
        ),
        notes: [
          { level: 'caution', text: V('Pozor na ostré hrany plechů v motorovém prostoru – rukavice.', 'Watch out for sharp sheet-metal edges in the engine bay – gloves.') }
        ]
      },
      {
        id: 'bulb', anim: 'lights.bulbSwap',
        title: V('Vyměňte žárovku', 'Replace the bulb'),
        body: V(
          '1. Sundejte zadní kryt (otočit proti směru hodin nebo uvolnit spony).\n2. Odpojte konektor (u xenonu zapalovač – obvykle pootočit a vytáhnout).\n3. Uvolněte pojistnou sponu / bajonet a žárovku **rovně** vytáhněte.\n4. Novou žárovku vložte rovně, aby výstupky seděly v drážkách, a zajistěte.\n5. Připojte konektor a zavřete kryt.',
          '1. Remove the rear cover (twist anticlockwise or release the clips).\n2. Unplug the connector (with xenon the ignitor – usually twist and pull).\n3. Release the retaining clip / bayonet and pull the bulb out **straight**.\n4. Insert the new bulb straight so the tabs sit in their slots, then lock it.\n5. Reconnect and close the cover.'
        ),
        notes: [
          { level: 'warning', text: V('Žárovka musí sedět přesně v drážkách. Pootočená žárovka svítí špatným směrem a oslňuje.', 'The bulb must sit exactly in its slots. A twisted bulb shines in the wrong direction and dazzles.') },
          { level: 'caution', text: V('Pojistné drátěné spony se snadno ohnou nebo spadnou do světla. Pracujte pomalu.', 'Wire retaining clips bend easily or drop into the lamp. Work slowly.') },
          { level: 'tip', text: V('Novou žárovku nejdřív vyzkoušejte (rozsviťte) **se zavřeným krytem**, teprve pak skládejte zbytek.', 'Test the new bulb (switch on) **with the cover closed** before reassembling the rest.') }
        ]
      },
      {
        id: 'unitOut', anim: 'lights.unitOut',
        title: V('Výměna celého světlometu: demontáž', 'Whole headlight replacement: removal'),
        body: V(
          'Celé světlo se mění při prasklém krytu, vodě uvnitř, vadném LED / xenon modulu nebo zlomených úchytech.\n\n1. Zjistěte v dílenské příručce, zda je nutné sundat **nárazník / masku** (u mnoha moderních aut ano).\n2. Povolte všechny šrouby světla – některé jsou skryté pod nárazníkem nebo v podběhu.\n3. Vyfoťte si polohu šroubů a vedení kabelů.',
          'The whole lamp is replaced for a cracked lens, water inside, a faulty LED / xenon module or broken mounts.\n\n1. Check the workshop manual whether the **bumper / grille** must come off (on many modern cars it must).\n2. Undo all lamp bolts – some are hidden under the bumper or in the wheel arch.\n3. Photograph the bolt positions and cable routing.'
        ),
        notes: [
          { level: 'caution', text: V('Nárazník sundávejte ve dvou – při pádu se poškrábe nebo utrhnou kabely senzorů / ostřikovačů.', 'Remove the bumper with two people – if it drops it gets scratched or tears off sensor / washer wiring.') },
          { level: 'info', text: V('Spony nárazníku jsou často na jedno použití. Mějte náhradní.', 'Bumper clips are often single-use. Have spares ready.') }
        ]
      },
      {
        id: 'connector', anim: 'lights.connector',
        title: V('Odpojte konektory a hadičky', 'Disconnect connectors and hoses'),
        body: V(
          'Světlo opatrně vysuňte, aby se uvolnily kabely. Odsuňte pojistku konektoru, zmáčkněte západku a tahejte **za konektor**. U ostřikovačů světel odpojte hadičku (připravte hadr – vyteče kapalina).',
          'Slide the lamp out carefully to free the wiring. Slide back the connector lock, press the latch and pull **by the connector**. With headlight washers, disconnect the hose (have a rag ready – fluid will drip).'
        ),
        notes: [
          { level: 'caution', text: V('Starý plastový konektor bývá křehký. Netahejte za kabely – utrhnete piny a oprava je drahá.', 'Old plastic connectors are brittle. Never pull the wires – you will rip out the pins and repairs are costly.') }
        ]
      },
      {
        id: 'unitIn', anim: 'lights.unitOut',
        title: V('Montáž nového světla a kontrola spár', 'Fit the new lamp and check the gaps'),
        body: V(
          'Přeneste ze starého světla díly, které v novém nejsou (krytky, výbojky, moduly – dle dodávky). Světlo nasaďte, připojte konektory a **lehce** našroubujte. Nastavte rovnoměrnou spáru ke kapotě, blatníku a nárazníku a teprve pak šrouby dotáhněte.',
          'Transfer parts from the old lamp that the new one does not include (caps, bulbs, modules – depends on delivery). Fit the lamp, connect it and screw it in **loosely**. Set even gaps to the bonnet, wing and bumper, then tighten the bolts.'
        ),
        notes: [
          { level: 'caution', text: V('Šrouby do plastových úchytů nepřetahujte – úchyty praskají.', 'Do not over-tighten bolts into plastic mounts – the tabs crack.') }
        ]
      },
      {
        id: 'test', anim: 'lights.frontTest',
        title: V('Funkční test', 'Function test'),
        body: V(
          'Zapněte zapalování a vyzkoušejte: potkávací, dálková, obrysová / denní svícení, blinkry, výstražná světla, mlhovky a natáčení (AFS), pokud je máte. Zkontrolujte přístrojovou desku – nesmí hlásit poruchu.',
          'Switch on the ignition and test: low beam, high beam, position / DRL, indicators, hazards, fog lights and swivel (AFS) if fitted. Check the dashboard – there must be no fault warning.'
        ),
        notes: [
          { level: 'info', text: V('Xenon potřebuje pár sekund na plný jas a barvu – to je normální.', 'Xenon needs a few seconds to reach full brightness and colour – that is normal.') }
        ]
      },
      {
        id: 'basic', anim: 'lights.basicSetting',
        title: V('Základní nastavení regulace (xenon / LED)', 'Range control basic setting (xenon / LED)'),
        body: V(
          'Xenonová a LED světla mají **automatickou regulaci sklonu**. Po výměně světla, motorku regulace nebo snímače výšky karoserie je nutné diagnostikou provést **základní nastavení** – řídicí jednotka si uloží výchozí polohu. Teprve pak seřiďte šrouby.',
          'Xenon and LED headlights have **automatic range (levelling) control**. After replacing a lamp, levelling motor or body-height sensor, a **basic setting** must be done with a scan tool – the control unit stores the zero position. Only then adjust the screws.'
        ),
        notes: [
          { level: 'warning', text: V('Bez základního nastavení může světlo svítit příliš vysoko a oslňovat, i když ho ručně seřídíte.', 'Without the basic setting the lamp may shine too high and dazzle, even after manual aiming.') }
        ]
      },
      {
        id: 'aimPrep', anim: 'lights.aimWall',
        title: V('Seřízení: připravte vůz a stěnu', 'Aiming: prepare the car and wall'),
        body: V(
          '1. Vůz na **rovnou plochu** kolmo ke stěně, vzdálenost světel od stěny **10 m**.\n2. Správné tlaky v pneumatikách, nádrž cca do poloviny, na místě řidiče osoba (cca 75 kg).\n3. Na stěně označte páskou výšku středu světel **H** a osy obou světel.\n4. Na světle najděte předepsaný sklon (štítek, např. **1,0 %** = pokles 10 cm na 10 m).\n5. Ruční ovládání sklonu (kolečko) nastavte na **0**.',
          '1. Car on **level ground**, square to a wall, lamps **10 m** from the wall.\n2. Correct tyre pressures, tank about half full, a person in the driver\'s seat (approx. 75 kg).\n3. Mark the lamp centre height **H** and both lamp centre lines on the wall with tape.\n4. Find the specified drop on the lamp (label, e.g. **1.0 %** = 10 cm drop over 10 m).\n5. Set the manual range control (thumbwheel) to **0**.'
        ),
        notes: [
          { level: 'info', text: V('Domácí seřízení je orientační. Přesné seřízení udělá STK nebo servis regloskopem – doporučujeme po každé výměně světla.', 'Home aiming is approximate. An STK or garage does exact aiming with a beam setter – recommended after every lamp replacement.') }
        ]
      },
      {
        id: 'aim', anim: 'lights.aimScrews',
        title: V('Seřiďte světla šrouby', 'Adjust the lamps with the screws'),
        body: V(
          'Rozsviťte potkávací světla. Druhé světlo zakryjte (kabát, karton). Seřizovacím šroubem pro **výšku** nastavte vodorovnou hranu světla na značku H minus předepsaný pokles. Zlom hrany (asymetrie) má být na ose světla. Opakujte pro druhé světlo.',
          'Switch on the low beam. Cover the other lamp (coat, cardboard). Use the **height** adjuster to set the horizontal cut-off line to mark H minus the specified drop. The kink of the cut-off (asymmetry) should sit on the lamp centre line. Repeat for the other lamp.'
        ),
        notes: [
          { level: 'warning', text: V('Šrouby otáčejte malými kroky a bez síly. Plastové převody uvnitř světla se snadno strhnou.', 'Turn the adjusters in small steps and without force. The plastic gears inside the lamp strip easily.') },
          { level: 'tip', text: V('Zakrytou lampu nenechávejte dlouho svítit pod kartonem – horké světlo může karton propálit (halogen).', 'Do not leave a covered lamp on for long under cardboard – a hot halogen lamp can scorch it.') }
        ]
      }
    ],
    vehicles: {
      'skoda-octavia-rs-tdi': {
        status: 'caution',
        specs: [
          { label: V('Typ světel', 'Lamp type'), value: V('Bi-xenon s AFS (natáčení)', 'Bi-xenon with AFS (swivel)') },
          { label: V('Výbojka', 'Xenon bulb'), value: 'D1S', verify: true },
          { label: V('Blinkr ve světle', 'Indicator in lamp'), value: 'PY21W', verify: true },
          { label: V('Ostřikovače světel', 'Headlight washers'), value: V('ano (povinné u xenonu)', 'yes (mandatory with xenon)') },
          { label: V('Základní nastavení', 'Basic setting'), value: V('VCDS / diagnostika – adresa regulace sklonu světel (55)', 'VCDS / scan tool – headlight range address (55)'), verify: true }
        ],
        notes: [
          { level: 'warning', text: V('Xenonová světla: zapalovač + předřadník (ballast) pod světlem. Před prací vždy odpojte konektor a dodržujte postup z bezpečnostních upozornění.', 'Xenon lamps: ignitor + ballast under the lamp. Always unplug the connector before working and follow the safety notes.') },
          { level: 'info', text: V('Bi-xenon = jedna výbojka pro potkávací i dálková (clonka). Natáčení AFS zajišťuje motorek ve světle – po výměně světla nutné základní nastavení.', 'Bi-xenon = one bulb for low and high beam (shutter). AFS swivel is done by a motor inside the lamp – a basic setting is required after replacing the lamp.') }
        ],
        tools: [V('VCDS / OBDeleven (základní nastavení světel)', 'VCDS / OBDeleven (headlight basic setting)')],
        parts: [V('Výbojka D1S 2 ks (ověřit typ na staré výbojce)', 'D1S xenon bulb ×2 (verify type on the old bulb)'), V('Případně nový světlomet bi-xenon AFS (správná strana, správná verze)', 'If needed, a new bi-xenon AFS headlight (correct side and version)')],
        steps: {
          access: { body: V('Přístup k výbojce je zezadu světla přes víčko. Prostor je těsný – na levé straně může překážet vzduchový filtr / sání, na pravé nádržka nebo baterie (ověřte). Často je snazší vyndat celé světlo.', 'The xenon bulb is reached from the back of the lamp via a cap. Space is tight – on one side the air box / intake may be in the way, on the other the reservoir or battery (verify). It is often easier to remove the whole lamp.'), notes: [{ level: 'info', text: V('Postup zpřístupnění ověřte v ELSA pro váš VIN.', 'Verify the access procedure in ELSA for your VIN.'), verify: true }] },
          unitOut: { notes: [{ level: 'info', text: V('U Octavie II facelift se světlomet obvykle vyndavá po demontáži předního nárazníku (ověřit). Šrouby: nahoře u zámku kapoty a pod nárazníkem.', 'On the Octavia II facelift the headlight is usually removed after taking off the front bumper (verify). Bolts: at the top near the bonnet lock and under the bumper.'), verify: true }] },
          basic: { specs: [{ label: V('Nástroj', 'Tool'), value: V('VCDS: 55 – Regulace sklonu → Základní nastavení', 'VCDS: 55 – Headlight range → Basic settings'), verify: true }] }
        }
      },
      'mb-cl500-c216': {
        status: 'caution',
        specs: [
          { label: V('Typ světel', 'Lamp type'), value: V('Bi-xenon (případně s aktivním natáčením)', 'Bi-xenon (possibly with active cornering)'), verify: true },
          { label: V('Výbojka', 'Xenon bulb'), value: 'D1S', verify: true },
          { label: V('Základní nastavení', 'Basic setting'), value: V('XENTRY / DAS – kalibrace regulace sklonu', 'XENTRY / DAS – range control calibration'), verify: true }
        ],
        notes: [
          { level: 'warning', text: V('Xenonový systém s vysokým napětím – dodržujte bezpečnostní postup (vypnout, klíč pryč, odpojit konektor).', 'High-voltage xenon system – follow the safety procedure (switch off, key away, unplug connector).') },
          { level: 'info', text: V('Typ výbojky, přítomnost aktivních světel (natáčení) a postup přístupu ověřte ve WIS pro váš VIN. Prostor v motorovém prostoru V8 je velmi stísněný.', 'Verify the bulb type, presence of active (cornering) lights and access procedure in WIS for your VIN. Space in the V8 engine bay is very tight.'), verify: true }
        ],
        tools: [V('XENTRY / kompatibilní diagnostika', 'XENTRY / compatible scan tool')],
        steps: {
          access: { notes: [{ level: 'caution', text: V('Přístup ke krytu výbojky může vyžadovat demontáž krytů nebo části sání. Netlačte na plastové díly V8 násilím.', 'Reaching the bulb cover may require removing covers or part of the intake. Do not force the V8\'s plastic parts.'), verify: true }] },
          basic: { specs: [{ label: V('Nástroj', 'Tool'), value: 'XENTRY / DAS', verify: true }] }
        }
      },
      'volvo-xc60-b4': {
        status: 'caution',
        specs: [
          { label: V('Typ světel', 'Lamp type'), value: V('Full LED („Thorovo kladivo“) – bez vyměnitelných žárovek', 'Full LED ("Thor\'s hammer") – no replaceable bulbs'), verify: true },
          { label: V('Regulace sklonu', 'Range control'), value: V('automatická (+ vzduchové odpružení)', 'automatic (+ air suspension)') },
          { label: V('Kalibrace', 'Calibration'), value: V('VIDA / diagnostika', 'VIDA / scan tool'), verify: true }
        ],
        notes: [
          { level: 'warning', text: V('Výměna světla obvykle vyžaduje **demontáž předního nárazníku**, ve kterém je **radar** a senzory. Po zásahu do nárazníku může být nutná **kalibrace ADAS** (radar, kamera).', 'Replacing a lamp usually requires **removing the front bumper**, which houses the **radar** and sensors. After bumper work an **ADAS calibration** (radar, camera) may be required.'), verify: true },
          { level: 'warning', text: V('Vůz má **vzduchové odpružení**: při seřizování světel musí být v normální výšce (ne v režimu zvedání / nakládání) a po kalibraci světel nesmí být výška měněna.', 'The car has **air suspension**: when aiming, it must be at normal ride height (not in jacking / loading mode), and the height must not change during calibration.') },
          { level: 'info', text: V('LED světla nemají vyměnitelné žárovky. Před objednáním světla nechte diagnostikou potvrdit závadu.', 'The LED lamps have no replaceable bulbs. Confirm the fault with diagnostics before ordering a lamp.') }
        ],
        tools: [V('VIDA nebo diagnostika s kalibrací světel Volvo', 'VIDA or scan tool with Volvo headlight calibration')],
        parts: [V('Nový LED světlomet (správná strana a verze dle VIN)', 'New LED headlight (correct side and version per VIN)'), V('Nové spony nárazníku', 'New bumper clips')],
        steps: {
          bulb: { skip: true },
          access: { body: V('U LED světla nepotřebujete přístup k zadnímu krytu. Pro výměnu celého světla pokračujte demontáží nárazníku.', 'With LED lamps you do not need the rear cover. For a whole-lamp replacement continue with bumper removal.') },
          unitOut: { notes: [{ level: 'caution', text: V('Konektory radaru a parkovacích senzorů v nárazníku odpojujte opatrně. Po montáži zkontrolujte, že nehlásí chybu.', 'Disconnect the radar and parking sensor connectors in the bumper carefully. Check for no faults after refitting.') }] },
          basic: { specs: [{ label: V('Nástroj', 'Tool'), value: 'VIDA', verify: true }] },
          aimPrep: { notes: [{ level: 'warning', text: V('Vzduchový podvozek v normální výšce, motor v chodu nebo dle postupu VIDA. Seřízení raději ověřte v servisu.', 'Air suspension at normal height, engine running or per VIDA procedure. Better have the aim confirmed at a workshop.'), verify: true }] }
        },
        extraSteps: [{ after: 'access', step: LED_STEP }]
      },
      'toyota-gr-yaris': {
        status: 'ok',
        specs: [
          { label: V('Typ světel', 'Lamp type'), value: V('LED – bez vyměnitelných žárovek', 'LED – no replaceable bulbs'), verify: true },
          { label: V('Kalibrace / inicializace', 'Calibration / initialisation'), value: V('Techstream (dle výbavy)', 'Techstream (depends on equipment)'), verify: true }
        ],
        notes: [
          { level: 'info', text: V('LED světla bez vyměnitelných žárovek. Výměna světla pravděpodobně vyžaduje demontáž předního nárazníku – ověřte v TIS.', 'LED lamps with no replaceable bulbs. Replacing a lamp probably requires removing the front bumper – verify in TIS.'), verify: true },
          { level: 'caution', text: V('Nárazník a spoiler jsou nízko a snadno se poškodí – pracujte na rovině, nárazník pokládejte na měkkou podložku.', 'The bumper and splitter are low and easily damaged – work on level ground, rest the bumper on a soft surface.') }
        ],
        tools: [V('Techstream / kompatibilní diagnostika (je-li potřeba)', 'Techstream / compatible scan tool (if needed)')],
        parts: [V('Nový LED světlomet (správná strana dle VIN)', 'New LED headlight (correct side per VIN)'), V('Nové spony nárazníku', 'New bumper clips')],
        steps: {
          bulb: { skip: true },
          access: { body: V('U LED světla není co měnit zezadu. Pro výměnu celého světla pokračujte demontáží nárazníku.', 'With LED lamps there is nothing to change from the back. For a whole-lamp replacement continue with bumper removal.') },
          basic: { specs: [{ label: V('Nástroj', 'Tool'), value: 'Techstream', verify: true }] }
        },
        extraSteps: [{ after: 'access', step: LED_STEP }]
      },
      'citroen-jumper-22hdi': {
        status: 'ok',
        specs: [
          { label: V('Typ světel', 'Lamp type'), value: V('Halogenové žárovky (typ dle VIN / katalogu, např. H7 + H1 nebo H4)', 'Halogen bulbs (type per VIN / catalogue, e.g. H7 + H1 or H4)'), verify: true },
          { label: V('Přístup k žárovkám', 'Bulb access'), value: V('Zezadu světla z motorového prostoru (krytka)', 'From behind the lamp in the engine bay (cover)'), verify: true },
          { label: V('Regulace sklonu', 'Beam-height control'), value: V('Ruční kolečko na palubní desce (0 = prázdný vůz)', 'Manual wheel on the dashboard (0 = empty van)'), verify: true },
          { label: V('Výměna celého světla', 'Whole-unit replacement'), value: V('Pravděpodobně nutná demontáž masky / nárazníku', 'Probably requires removing the grille / bumper'), verify: true }
        ],
        notes: [
          { level: 'warning', text: V('**Typ žárovky nehádejte** – u Jumperu X250 se liší podle výbavy. Ověřte na staré žárovce nebo v katalogu dílů podle VIN.', '**Do not guess the bulb type** – it differs by equipment on the X250 Jumper. Check the old bulb or the parts catalogue by VIN.'), verify: true },
          { level: 'info', text: V('Dodávka má ruční kolečko regulace sklonu světel. Při seřizování musí být vůz **prázdný a kolečko na 0**. Při jízdě s nákladem kolečko nastavte podle zatížení – jinak oslňujete.', 'The van has a manual headlight range wheel. When aiming, the van must be **empty with the wheel at 0**. When driving loaded, set the wheel for the load – otherwise you dazzle others.'), verify: true },
          { level: 'tip', text: V('Užitkový vůz svítí hodně hodin – žárovky měňte vždy v páru a pár náhradních vozte ve voze.', 'A commercial van runs its lights for many hours – always replace bulbs in pairs and keep a spare pair in the van.') }
        ],
        tools: [V('Šroubováky / Torx na krytky, masku a nárazník (ověřit typy)', 'Screwdrivers / Torx for covers, grille and bumper (verify sizes)')],
        steps: {
          bulb: {
            body: V('Krytku zezadu světla sejměte z motorového prostoru, odpojte konektor, uvolněte pružinový držák a žárovku vyjměte. Prostor u baterie / vzduchového filtru bývá těsný – přesný postup ověřte.', 'Remove the cover behind the lamp from the engine bay, unplug the connector, release the spring clip and take the bulb out. Space near the battery / air filter can be tight – verify the exact procedure.'),
            notes: [{ level: 'caution', text: V('Pokud k žárovce nedosáhnete, nelámejte plastové díly – u některých verzí je nutné uvolnit další díly (ověřit).', 'If you cannot reach the bulb, do not break plastic parts – some versions require removing extra parts (verify).'), verify: true }]
          },
          unitOut: { notes: [{ level: 'info', text: V('Jumper: světlomet je pravděpodobně přišroubován za maskou / nárazníkem – postup ověřte v dílenské příručce.', 'Jumper: the headlight is probably bolted behind the grille / bumper – verify the procedure in the workshop manual.'), verify: true }] },
          basic: { skip: true },
          aimPrep: { notes: [{ level: 'warning', text: V('Vůz **vyložený**, kolečko sklonu na 0, tlaky v pneumatikách podle štítku ve dveřích (zadní bývá vyšší).', 'Van **unloaded**, range wheel at 0, tyre pressures per the door-pillar label (rear is often higher).'), verify: true }] }
        },
        extraSteps: [{
          after: 'test',
          step: {
            id: 'jumperRange', anim: 'lights.basicSetting',
            title: V('Regulace sklonu: ruční kolečko', 'Range control: manual wheel'),
            body: V('Jumper s halogeny nemá automatickou regulaci, kterou by bylo nutné nastavovat diagnostikou. Kolečko regulace sklonu na palubní desce dejte na **0** (prázdný vůz) a pokračujte seřízením na stěně.\n\nPři jízdě s nákladem kolečko nastavte podle zatížení (vyšší číslo = světla níž).', 'A Jumper with halogen lamps has no automatic range control that needs a scan tool. Set the range wheel on the dashboard to **0** (empty van) and continue with aiming against a wall.\n\nWhen driving loaded, set the wheel for the load (higher number = beams lower).'),
            notes: [
              { level: 'info', text: V('Pokud má váš vůz jinou výbavu (např. xenony s automatikou), postup se liší – ověřte.', 'If your van has different equipment (e.g. xenons with auto levelling), the procedure differs – verify.'), verify: true },
              { level: 'warning', text: V('Kolečko na nesprávné pozici = oslňování protijedoucích nebo špatný výhled.', 'Wheel in the wrong position = dazzling oncoming traffic or poor visibility.') }
            ]
          }
        }]
      }
    }
  });
})(window.STU);
