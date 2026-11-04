/* Tutorial: Steering wheel removal / replacement (airbag). */
(function (S) {
  'use strict';
  var V = function (cs, en) { return { cs: cs, en: en }; };

  S.registerTutorial({
    id: 'steering-wheel',
    level: 2,
    status: 'caution',
    thumb: 'steer.airbagCarry',
    time: V('1–2 hod.', '1–2 h'),
    title: V('Výměna volantu (airbag)', 'Steering wheel replacement (airbag)'),
    summary: V('Demontáž a montáž volantu s airbagem: originální výměna, přečalounění, sportovní volant (jen okruh).', 'Removing and refitting a wheel with airbag: OEM swap, re-trim, aftermarket wheel (track only).'),
    intro: V(
      'Volant sám je jednoduchý díl – **nebezpečný je airbag**. Pyrotechnická patrona se může při chybě odpálit silou, která zlomí ruku nebo poraní obličej. Postupujte přesně a bez spěchu.\n\nNávod pokrývá tři situace:\n- **originální / výměnný volant s airbagem** (opotřebená kůže, vyhřívání, pádla)\n- **přečalounění** – volant jen sundáte a vrátíte\n- **sportovní volant bez airbagu** – **jen pro okruh**, na silnici v ČR nelegální',
      'The wheel itself is a simple part – **the airbag is the danger**. If handled wrongly, the pyrotechnic charge can fire with enough force to break an arm or injure your face. Work precisely and without rushing.\n\nThe tutorial covers three cases:\n- **OEM / replacement wheel with airbag** (worn leather, heating, paddles)\n- **re-trim** – you only remove and refit the wheel\n- **aftermarket wheel without airbag** – **track only**, not road legal in CZ'
    ),
    safety: [
      { level: 'danger', text: V('**Před sahnutím na airbag odpojte minus pól baterie a vyčkejte předepsanou dobu** (kondenzátor řídicí jednotky drží energii pro odpálení). Pokud dobu neznáte, čekejte **alespoň 10 minut**.', '**Disconnect the battery negative and wait the specified time before touching the airbag** (the control unit capacitor stores firing energy). If you do not know the time, wait **at least 10 minutes**.') },
      { level: 'danger', text: V('**Airbag nikdy neměřte multimetrem** ani na konektor nesahejte nářadím – měřicí proud ho může odpálit.', '**Never measure the airbag with a multimeter** or probe the connector with tools – the test current can fire it.') },
      { level: 'danger', text: V('Airbag noste **krytem od těla** a ukládejte **krytem nahoru** na stůl, mimo dosah dětí, tepla a jisker. Nic na něj nepokládejte.', 'Carry the airbag with **the cover facing away from you** and store it **cover facing up** on a bench, away from children, heat and sparks. Put nothing on it.') },
      { level: 'warning', text: V('**Spadlý, poškozený nebo starý airbag nepoužívejte.** Použitý / vadný airbag je pyrotechnika – likvidaci svěřte autorizovanému servisu.', '**Never reuse a dropped, damaged or old airbag.** A used / faulty airbag is pyrotechnics – leave disposal to an authorised workshop.') },
      { level: 'warning', text: V('Před prací se dotkněte kovové části karoserie (vybití statické elektřiny). Nepracujte v syntetickém oblečení na koberci.', 'Touch bare metal on the body before working (discharge static). Do not work in synthetic clothing on carpet.') },
      { level: 'warning', text: V('Šroub volantu je často **pružný (na jedno použití)** – vždy nový. Nedotažený volant = ztráta řízení.', 'The wheel bolt is often a **stretch bolt (single use)** – always fit a new one. A loose wheel = loss of steering.') },
      { level: 'caution', text: V('Spirální kabel (clock spring) se při sundaném volantu **nesmí protočit** – přetrhne se a airbag pak nefunguje.', 'The clock spring must **not rotate** while the wheel is off – it tears and the airbag then fails.') },
      { level: 'info', text: V('Pokud si nejste jistí, svěřte práci servisu. Chyba u airbagu se neprojeví hned – až při nehodě.', 'If you are unsure, leave the job to a workshop. An airbag mistake does not show straight away – only in a crash.') }
    ],
    tools: [
      V('Klíče na baterii (obvykle 10 mm)', 'Battery spanner (usually 10 mm)'),
      V('Izolační páska / návlek na odpojený pól', 'Insulating tape / cover for the disconnected terminal'),
      V('Torx bity (T30 apod.) nebo plochý šroubovák dle vozu', 'Torx bits (T30 etc.) or flat screwdriver depending on car'),
      V('Hlavice / bit na šroub volantu (vícezub XZN, Torx nebo šestihran)', 'Socket / bit for the wheel bolt (XZN triple-square, Torx or hex)'),
      V('Momentový klíč (+ úhloměr pro dotažení úhlem)', 'Torque wrench (+ angle gauge for angle torque)'),
      V('Fix / lakový popisovač na značky', 'Marker / paint pen for alignment marks'),
      V('Lepicí páska (zajištění spirálního kabelu)', 'Adhesive tape (to lock the clock spring)'),
      V('Diagnostika pro váš vůz (kalibrace snímače úhlu natočení, chyby airbagu)', 'Scan tool for your car (steering angle calibration, airbag codes)')
    ],
    parts: [
      V('Nový šroub volantu (pokud je pružný / dle příručky)', 'New wheel bolt (if stretch type / per manual)'),
      V('Volant / airbag / potah dle typu práce (originál nebo homologovaný)', 'Wheel / airbag / cover depending on the job (OEM or homologated)'),
      V('U sportovního volantu: náboj (adaptér) a rychloupínák určený pro váš vůz', 'For an aftermarket wheel: hub adapter and quick release made for your car')
    ],
    finalChecks: [
      V('Kontrolka airbagu po zapnutí zapalování zhasne', 'The airbag light goes out after switching the ignition on'),
      V('Volant je rovně při jízdě rovně', 'The wheel is straight when driving straight'),
      V('Šroub volantu dotažený momentem (+ úhlem), nový', 'Wheel bolt torqued (+ angle), new'),
      V('Klakson, tlačítka, pádla, tempomat a vyhřívání fungují', 'Horn, buttons, paddles, cruise control and heating work'),
      V('Snímač úhlu natočení kalibrován, žádná kontrolka ESP', 'Steering angle sensor calibrated, no ESP light'),
      V('Žádné chyby v paměti airbagu a ESP', 'No fault codes in the airbag and ESP memory'),
      V('Starý airbag předán k ekologické likvidaci (je-li vyměněn)', 'Old airbag handed in for proper disposal (if replaced)')
    ],
    steps: [
      {
        id: 'plan', anim: 'steer.trackOnly',
        title: V('Rozhodněte, jaký volant a proč', 'Decide which wheel and why'),
        body: V(
          '- **Originální / výměnný volant s airbagem:** volant musí pasovat na váš sloupek, konektory a výbavu (vyhřívání, pádla, tlačítka). Airbag kupujte jen nový nebo ověřený z autorizovaného zdroje.\n- **Přečalounění:** volant jen sundáte, airbag uložíte a po návratu z čalounictví vrátíte.\n- **Sportovní volant bez airbagu:** **jen pro okruh**. Na silnici je vůz bez airbagu řidiče nelegální, neprojde STK a pojišťovna nemusí plnit.',
          '- **OEM / replacement wheel with airbag:** the wheel must fit your column, connectors and equipment (heating, paddles, buttons). Buy the airbag only new or verified from an authorised source.\n- **Re-trim:** you only remove the wheel, store the airbag and refit everything once the upholsterer is done.\n- **Aftermarket wheel without airbag:** **track only**. On the road a car without a driver airbag is illegal, fails STK and insurance may not pay.'
        ),
        notes: [
          { level: 'danger', text: V('Airbagy z bazarů a „renovované“ airbagy jsou častým zdrojem selhání nebo zranění. Nekupujte je.', 'Second-hand and "refurbished" airbags are a frequent cause of failure or injury. Do not buy them.') },
          { level: 'info', text: V('Rezistor místo airbagu jen schová kontrolku – airbag ale nefunguje a na silnici je to nelegální.', 'A resistor instead of the airbag only hides the warning light – the airbag still does not work and it is illegal on the road.') }
        ]
      },
      {
        id: 'center', anim: 'steer.center',
        title: V('Kola rovně, volant v nulové poloze', 'Wheels straight, wheel centred'),
        body: V(
          'Vozem popojeďte rovně a zastavte s **koly přesně rovně**. Volant musí být ve vodorovné poloze. Vytáhněte klíč (zamkne se řízení) nebo jinak zajistěte, aby se volant neotočil.\n\nNa volant a horní kryt sloupku si dejte **značku** fixou nebo páskou.',
          'Drive straight and stop with the **wheels exactly straight**. The steering wheel must be level. Remove the key (the steering locks) or otherwise make sure the wheel cannot turn.\n\nPut a **mark** on the wheel and the upper column cover with a marker or tape.'
        ),
        notes: [
          { level: 'caution', text: V('Pokud volant sejmete s koly natočenými, budete mít po montáži křivý volant a chybu snímače úhlu natočení.', 'If you remove the wheel with the road wheels turned, it will be crooked after refitting and the steering angle sensor will fault.') }
        ]
      },
      {
        id: 'battery', anim: 'steer.battery',
        title: V('Odpojte baterii a počkejte', 'Disconnect the battery and wait'),
        body: V(
          'Vypněte zapalování a všechny spotřebiče. **Odpojte minus pól baterie**, kabel zaizolujte a odložte tak, aby se nemohl dotknout pólu.\n\nPak **počkejte předepsanou dobu** (dle dílenské příručky – pokud ji neznáte, raději 10 minut). Během čekání můžete připravit nářadí.',
          'Switch off the ignition and all consumers. **Disconnect the battery negative**, insulate the cable and place it so it cannot touch the terminal.\n\nThen **wait the specified time** (per workshop manual – if you do not know it, better 10 minutes). Prepare your tools while you wait.'
        ),
        notes: [
          { level: 'danger', text: V('Bez odpojení baterie a vyčkání **na airbag nesahejte**.', 'Do **not touch the airbag** before disconnecting the battery and waiting.') },
          { level: 'info', text: V('Po odpojení baterie může být nutné znovu nastavit okna, rádio, hodiny – připravte si PIN rádia.', 'After disconnecting the battery, windows, radio and clock may need resetting – have the radio PIN ready.') }
        ]
      },
      {
        id: 'release', anim: 'steer.airbagRelease',
        title: V('Uvolněte airbag z volantu', 'Release the airbag from the wheel'),
        body: V(
          'Airbag je ve volantu držen buď **pružinovými sponami** (uvolní se šroubovákem otvory na zadní straně volantu), nebo **šrouby Torx** zezadu. Postup podle vašeho vozu najdete v poznámce níže.\n\nAirbag opatrně vyklopte k sobě – **je stále připojený kabely**, netahejte.',
          'The airbag is held in the wheel either by **spring clips** (released with a screwdriver through holes on the back of the wheel) or by **Torx screws** from behind. The method for your car is in the note below.\n\nTilt the airbag carefully towards you – **it is still connected by wires**, do not pull.'
        ),
        notes: [
          { level: 'warning', text: V('Při práci neklečte ani nesedejte **před** airbagem – držte se bokem k volantu.', 'Never kneel or sit **in front of** the airbag – stay to the side of the wheel.') }
        ]
      },
      {
        id: 'connector', anim: 'steer.connector',
        title: V('Odpojte konektory airbagu', 'Unplug the airbag connectors'),
        body: V(
          'Konektor airbagu (obvykle **žlutý / oranžový**) má **zajišťovací páčku**. Páčku nejdřív odjistěte, pak konektor vytáhněte rovně. Odpojte i klakson a případné další konektory.\n\nKonektory mohou mít více stupňů (dvoustupňový airbag) – zapamatujte si nebo vyfoťte, co kam patří.',
          'The airbag connector (usually **yellow / orange**) has a **locking tab**. Release the tab first, then pull the connector straight out. Also unplug the horn and any other connectors.\n\nThere may be several plugs (two-stage airbag) – remember or photograph which goes where.'
        ),
        notes: [
          { level: 'danger', text: V('Nikdy netahejte za kabel a nestrkejte nic do konektoru.', 'Never pull by the wire and never push anything into the connector.') }
        ]
      },
      {
        id: 'store', anim: 'steer.airbagCarry',
        title: V('Bezpečně uložte airbag', 'Store the airbag safely'),
        body: V(
          'Airbag odneste **krytem od těla** a položte **krytem nahoru** na čistý stůl mimo dosah dětí, zvířat, tepla, jisker a vlhka. Nic na něj nepokládejte a nenechávejte ho ve voze.',
          'Carry the airbag with **the cover facing away from your body** and lay it **cover facing up** on a clean bench away from children, animals, heat, sparks and moisture. Put nothing on it and do not leave it in the car.'
        ),
        notes: [
          { level: 'danger', text: V('Položený krytem dolů by se při nechtěném odpálení vymrštil jako projektil.', 'Laid face down, it would launch like a projectile if it fired accidentally.') }
        ]
      },
      {
        id: 'bolt', anim: 'steer.bolt',
        title: V('Označte polohu a povolte šroub volantu', 'Mark the position and loosen the wheel bolt'),
        body: V(
          'Udělejte **značku na hřídeli a na náboji volantu**. Šroub volantu povolte, ale nechte ho **zašroubovaný na několik závitů** – volant při stahování nevyskočí proti obličeji.',
          'Make a **mark on the shaft and on the wheel hub**. Loosen the wheel bolt but leave it **screwed in a few threads** – the wheel cannot jump towards your face when it comes loose.'
        ),
        notes: [
          { level: 'caution', text: V('Šroub drží velkým momentem. Volant přidržte, nespoléhejte jen na zámek řízení – můžete ho poškodit.', 'The bolt is very tight. Hold the wheel, do not rely only on the steering lock – you can damage it.') }
        ]
      },
      {
        id: 'pull', anim: 'steer.puller',
        title: V('Stáhněte volant', 'Pull the wheel off'),
        body: V(
          'Volant uchopte oběma rukama a **kolébavým pohybem** ho stahujte k sobě, až se uvolní z drážkování. Pak šroub vyšroubujte a volant sundejte. Kabely veďte opatrně skrz otvor.\n\nPokud volant nejde, použijte **stahovák volantu**.',
          'Grip the wheel with both hands and pull it towards you **with a rocking motion** until it comes off the splines. Then remove the bolt and lift the wheel off. Guide the wires carefully through the opening.\n\nIf the wheel will not come off, use a **steering wheel puller**.'
        ),
        notes: [
          { level: 'danger', text: V('**Netlučte do volantu ani hřídele kladivem.** Bezpečnostní sloupek je deformační – poškodí se a při nehodě nebude chránit.', '**Never hammer the wheel or shaft.** The safety column is collapsible – it gets damaged and will not protect you in a crash.') }
        ]
      },
      {
        id: 'clockspring', anim: 'steer.clockspring',
        title: V('Zajistěte spirální kabel', 'Lock the clock spring'),
        body: V(
          'Pod volantem je **spirální kabel (clock spring)**. Jakmile volant sundáte, přelepte jeho otočnou část páskou ke krytu, aby se **nemohla protočit**. Nehýbejte koly ani volantem, dokud není volant zpět.',
          'Under the wheel is the **clock spring (spiral cable)**. As soon as the wheel is off, tape its rotating part to the housing so it **cannot rotate**. Do not move the road wheels or steering until the wheel is back.'
        ),
        notes: [
          { level: 'warning', text: V('Protočený spirální kabel se při prvním plném rejdu přetrhne – rozsvítí se kontrolka airbagu a airbag nefunguje.', 'A rotated clock spring tears at the first full lock – the airbag light comes on and the airbag will not work.') }
        ]
      },
      {
        id: 'aftermarket', anim: 'steer.trackOnly',
        title: V('Jen sportovní volant: náboj a rychloupínák', 'Aftermarket wheel only: hub and quick release'),
        body: V(
          'Tento krok platí **jen pro okruhový volant bez airbagu**:\n- použijte **náboj (adaptér) určený přesně pro váš vůz** od renomovaného výrobce\n- rychloupínák kvalitní, certifikovaný, s pojistkou proti samovolnému uvolnění\n- elektroniku (klakson, spirální kabel, snímač úhlu natočení) zapojte dle návodu výrobce náboje\n\nPřed jízdou po silnici **vraťte originální volant s airbagem**.',
          'This step applies **only to a track wheel without an airbag**:\n- use a **hub adapter made exactly for your car** from a reputable maker\n- a quality, certified quick release with a positive lock against self-release\n- connect the electronics (horn, clock spring, steering angle sensor) per the hub maker\'s instructions\n\nBefore driving on public roads, **refit the original wheel with the airbag**.'
        ),
        notes: [
          { level: 'danger', text: V('Vůz bez airbagu řidiče je na silnici **nelegální a nebezpečný** – při nárazu hrozí smrtelné zranění hlavy o volant.', 'A car without a driver airbag is **illegal and dangerous** on the road – in a crash fatal head injuries against the wheel are possible.') },
          { level: 'warning', text: V('Airbag ze sportovního volantu uschovejte bezpečně (viz uložení airbagu) – na okruhu ho ve voze nevozte volně.', 'Store the airbag removed for the track wheel safely (see storing the airbag) – never carry it loose in the car.') }
        ]
      },
      {
        id: 'refit', anim: 'steer.refit',
        title: V('Nasaďte volant a dotáhněte nový šroub', 'Fit the wheel and torque a new bolt'),
        body: V(
          'Ověřte, že kola stojí rovně a spirální kabel se nepohnul. Pásku odstraňte, kabely protáhněte otvorem a volant nasaďte **podle značek** na drážkování. Kolíky / unášeče spirálního kabelu musí zapadnout.\n\nZašroubujte **nový šroub** a dotáhněte předepsaným momentem (a úhlem).',
          'Check the road wheels are straight and the clock spring did not move. Remove the tape, route the wires through the opening and fit the wheel **using the marks** on the splines. The clock spring drive pins must engage.\n\nFit a **new bolt** and tighten to the specified torque (and angle).'
        ),
        specs: [{ label: V('Šroub volantu', 'Wheel bolt'), value: V('dle příručky (často moment + úhel, nový šroub)', 'per manual (often torque + angle, new bolt)') }],
        notes: [
          { level: 'danger', text: V('Šroub volantu je bezpečnostní spoj. Nikdy ho nenechávejte dotažený „od ruky“.', 'The wheel bolt is a safety-critical joint. Never leave it just hand-tight.') },
          { level: 'caution', text: V('Žádný kabel nesmí být přiskřípnutý mezi volantem a sloupkem.', 'No wire may be pinched between the wheel and the column.') }
        ]
      },
      {
        id: 'airbagOn', anim: 'steer.connector',
        title: V('Připojte a nasaďte airbag', 'Connect and fit the airbag'),
        body: V(
          'Airbag přineste **krytem od těla**. Připojte konektory airbagu a klaksonu – **musí slyšitelně zacvaknout** a zajišťovací páčka musí být zajištěná. Airbag zatlačte do volantu, až spony zacvaknou (nebo zašroubujte Torx šrouby předepsaným momentem).',
          'Bring the airbag **cover facing away from you**. Connect the airbag and horn plugs – they **must click audibly** and the locking tab must be locked. Press the airbag into the wheel until the clips click (or tighten the Torx screws to spec).'
        ),
        notes: [
          { level: 'warning', text: V('Nezajištěný konektor airbagu = při nehodě airbag nevystřelí. Zkontrolujte dvakrát.', 'An unlocked airbag connector = the airbag will not fire in a crash. Check twice.') }
        ]
      },
      {
        id: 'reconnect', anim: 'steer.test',
        title: V('Připojte baterii a zkontrolujte kontrolku', 'Reconnect the battery and check the light'),
        body: V(
          '**Nikdo nesmí sedět ve voze.** Zapalování vypnuté, připojte minus pól baterie. Pak zapněte zapalování **z boku vozu** (ne s obličejem nad volantem). Kontrolka airbagu se rozsvítí a během několika sekund **musí zhasnout**.',
          '**Nobody may sit in the car.** With the ignition off, reconnect the battery negative. Then switch the ignition on **from the side of the car** (not leaning over the wheel). The airbag light comes on and **must go out** within a few seconds.'
        ),
        notes: [
          { level: 'danger', text: V('Pokud kontrolka airbagu svítí dál nebo bliká, **nejezděte** – airbag nemusí fungovat. Načtěte chyby diagnostikou.', 'If the airbag light stays on or flashes, **do not drive** – the airbag may not work. Read the fault codes with a scan tool.') }
        ]
      },
      {
        id: 'calibrate', anim: 'steer.calibrate',
        title: V('Kalibrace a funkční zkouška', 'Calibration and function test'),
        body: V(
          'Pokud vůz po montáži hlásí chybu ESP / řízení, proveďte diagnostikou **kalibraci snímače úhlu natočení** (vůz stojí, kola rovně). Vymažte chyby a zkontrolujte, že se nevracejí.\n\nVyzkoušejte klakson, všechna tlačítka, pádla, tempomat a vyhřívání. Při první jízdě ověřte, že je volant rovně.',
          'If the car reports an ESP / steering fault after fitting, run the **steering angle sensor calibration** with a scan tool (car stationary, wheels straight). Clear the codes and check they do not return.\n\nTest the horn, all buttons, paddles, cruise control and heating. On the first drive check that the wheel is straight.'
        ),
        notes: [
          { level: 'warning', text: V('Bez kalibrace nemusí správně fungovat ESP a asistenční systémy.', 'Without calibration, ESP and driver assists may not work correctly.') }
        ]
      }
    ],
    vehicles: {
      'skoda-octavia-rs-tdi': {
        status: 'caution',
        specs: [
          { label: V('Uchycení airbagu', 'Airbag mounting'), value: V('pružinové spony – uvolnění šroubovákem otvory vzadu', 'spring clips – released with a screwdriver through rear holes'), verify: true },
          { label: V('Šroub volantu', 'Wheel bolt'), value: V('vícezub (XZN), nový šroub · 30 Nm + 90°', 'triple-square (XZN), new bolt · 30 Nm + 90°'), verify: true },
          { label: V('Kalibrace', 'Calibration'), value: V('základní nastavení snímače úhlu natočení (VCDS / ODIS)', 'steering angle sensor basic setting (VCDS / ODIS)'), verify: true }
        ],
        notes: [
          { level: 'info', text: V('RS mívá volant s pádly / multifunkcí – při výměně ověřte kompatibilitu konektorů a kódování ve VCDS.', 'The RS often has a multifunction / paddle wheel – when swapping, check connector compatibility and coding in VCDS.'), verify: true }
        ],
        steps: {
          release: { body: V('Volant otočte o 90° doprava, šroubovákem zasuňte do otvoru na zadní straně a zatlačte, aby se uvolnila pružinová spona. Opakujte po otočení o 180°. U některých volantů je třetí otvor dole (6 h).', 'Turn the wheel 90° right, insert a screwdriver into the hole on the back and push to release the spring clip. Repeat after turning 180°. Some wheels have a third hole at the bottom (6 o\'clock).'), notes: [{ level: 'info', text: V('Přesnou polohu otvorů a hloubku zasunutí ověřte v ELSA.', 'Verify the exact hole positions and insertion depth in ELSA.'), verify: true }] },
          battery: { notes: [{ level: 'info', text: V('Baterie je v motorovém prostoru vlevo.', 'The battery is on the left in the engine bay.') }] },
          refit: { specs: [{ label: V('Šroub volantu', 'Wheel bolt'), value: V('nový · 30 Nm + 90°', 'new · 30 Nm + 90°'), verify: true }] },
          calibrate: { body: V('V VCDS / ODIS: řídicí jednotka ABS/ESP → základní nastavení snímače úhlu natočení (G85). Kola rovně, motor běží dle postupu.', 'In VCDS / ODIS: ABS/ESP control unit → basic setting of the steering angle sensor (G85). Wheels straight, engine running per procedure.'), notes: [{ level: 'info', text: V('Přesný postup ověřte pro váš software.', 'Verify the exact procedure for your software.'), verify: true }] }
        }
      },
      'mb-cl500-c216': {
        status: 'caution',
        specs: [
          { label: V('Uchycení airbagu', 'Airbag mounting'), value: V('šrouby Torx zezadu volantu', 'Torx screws on the back of the wheel'), verify: true },
          { label: V('Šroub volantu', 'Wheel bolt'), value: V('moment dle WIS, nový šroub', 'torque per WIS, new bolt'), verify: true },
          { label: V('Doba čekání', 'Waiting time'), value: V('dle WIS (raději ≥ 10 min)', 'per WIS (ideally ≥ 10 min)'), verify: true },
          { label: V('Kalibrace', 'Calibration'), value: V('snímač úhlu natočení přes XENTRY', 'steering angle sensor via XENTRY'), verify: true }
        ],
        notes: [
          { level: 'warning', text: V('Sloupek řízení je elektricky stavitelný. **Před odpojením baterie** ho vysuňte a zvedněte do polohy, kde se vám dobře pracuje.', 'The steering column is electrically adjustable. **Before disconnecting the battery**, extend and raise it to a comfortable working position.') },
          { level: 'info', text: V('Hlavní baterie je v zavazadlovém prostoru. Odpojte ji tam (nebo dle WIS v místě odpojení).', 'The main battery is in the trunk. Disconnect it there (or at the disconnect point per WIS).'), verify: true },
          { level: 'caution', text: V('Volant nese tlačítka řazení a multifunkci. Neoriginální volant se nemusí spárovat – ověřte kódování.', 'The wheel carries shift buttons and multifunction controls. A non-original wheel may not pair – check coding.'), verify: true }
        ],
        steps: {
          center: { notes: [{ level: 'warning', text: V('Nejdřív nastavte elektrický sloupek, pak teprve odpojujte baterii.', 'Adjust the electric column first, only then disconnect the battery.') }] },
          release: { body: V('Na zadní straně volantu povolte šrouby Torx (obvykle po stranách) a airbag opatrně vyklopte.', 'On the back of the wheel undo the Torx screws (usually on the sides) and tilt the airbag out carefully.'), notes: [{ level: 'info', text: V('Velikost Torx a počet šroubů ověřte ve WIS.', 'Verify the Torx size and number of screws in WIS.'), verify: true }] }
        }
      },
      'volvo-xc60-b4': {
        status: 'caution',
        specs: [
          { label: V('Uchycení airbagu', 'Airbag mounting'), value: V('spony – uvolnění otvory vzadu', 'clips – released through rear holes'), verify: true },
          { label: V('Volant', 'Wheel'), value: V('kapacitní snímání rukou (Pilot Assist), vyhřívání, tlačítka', 'capacitive hands-on detection (Pilot Assist), heating, buttons') },
          { label: V('Po výměně', 'After replacement'), value: V('konfigurace / kalibrace ve VIDA', 'configuration / calibration in VIDA'), verify: true }
        ],
        notes: [
          { level: 'warning', text: V('Odpojte **12V systém dle postupu VIDA**. 48V systém se volantu netýká – nic na něm neodpojujte a nezkratujte.', 'Disconnect the **12 V system per the VIDA procedure**. The 48 V system is not involved – do not disconnect or short anything on it.'), verify: true },
          { level: 'warning', text: V('Volant obsahuje **snímač držení rukou** pro Pilot Assist. Poškozený snímač nebo neoriginální volant = asistenty nefungují a hlásí chybu.', 'The wheel contains a **hands-on sensor** for Pilot Assist. A damaged sensor or non-original wheel = assists stop working and report faults.') },
          { level: 'info', text: V('Doba čekání po odpojení: dle VIDA (raději ≥ 10 min).', 'Waiting time after disconnecting: per VIDA (ideally ≥ 10 min).'), verify: true }
        ],
        steps: {
          aftermarket: { notes: [{ level: 'warning', text: V('Na tomto voze sportovní volant vyřadí Pilot Assist, udržování v pruhu a další systémy a vyvolá řadu chyb. Silně nedoporučujeme.', 'On this car an aftermarket wheel disables Pilot Assist, lane keeping and other systems and causes many faults. Strongly not recommended.') }] },
          calibrate: { body: V('Po výměně volantu nebo modulu proveďte ve VIDA konfiguraci a kalibraci (snímač úhlu natočení, případně snímání rukou).', 'After replacing the wheel or module, run configuration and calibration in VIDA (steering angle sensor, hands-on detection if applicable).'), notes: [{ level: 'info', text: V('Přesné kroky ověřte ve VIDA pro váš VIN.', 'Verify the exact steps in VIDA for your VIN.'), verify: true }] }
        }
      },
      'toyota-gr-yaris': {
        status: 'caution',
        specs: [
          { label: V('Uchycení airbagu', 'Airbag mounting'), value: V('šrouby Torx (T30) zezadu volantu', 'Torx (T30) screws on the back of the wheel'), verify: true },
          { label: V('Doba čekání', 'Waiting time'), value: V('min. 90 s dle TIS (raději ≥ 10 min)', 'min. 90 s per TIS (ideally ≥ 10 min)'), verify: true },
          { label: V('Šroub volantu', 'Wheel bolt'), value: V('moment dle TIS', 'torque per TIS'), verify: true },
          { label: V('Kalibrace', 'Calibration'), value: V('nulový bod snímače úhlu natočení (Techstream)', 'steering angle sensor zero point (Techstream)'), verify: true }
        ],
        notes: [
          { level: 'info', text: V('Pro okruh jsou k dispozici náboje a rychloupínáky – vybírejte jen kvalitní díly určené pro GR Yaris a na silnici vraťte originál.', 'Hubs and quick releases are available for track use – choose only quality parts made for the GR Yaris and refit the original for the road.') }
        ],
        steps: {
          release: { body: V('Na zadní straně volantu povolte šrouby Torx (po stranách) a airbag opatrně vyklopte.', 'On the back of the wheel undo the Torx screws (on the sides) and tilt the airbag out carefully.') },
          calibrate: { body: V('Po montáži proveďte v Techstream kalibraci nulového bodu snímače úhlu natočení / VSC (vůz na rovině, kola rovně).', 'After fitting, run the steering angle sensor / VSC zero-point calibration in Techstream (car level, wheels straight).') }
        }
      },
      'citroen-jumper-22hdi': {
        status: 'caution',
        specs: [
          { label: V('Airbag řidiče', 'Driver airbag'), value: V('Ano (dle výbavy)', 'Yes (per equipment)'), verify: true },
          { label: V('Uvolnění airbagu', 'Airbag release'), value: V('Šrouby zezadu nebo spony – ověřit v příručce', 'Screws from behind or clips – verify in the manual'), verify: true },
          { label: V('Čekací doba po odpojení baterie', 'Wait time after battery disconnect'), value: V('dle příručky Citroën (raději ≥ 10 min)', 'per Citroën manual (ideally ≥ 10 min)'), verify: true },
          { label: V('Šroub volantu', 'Wheel bolt'), value: V('Moment a výměna šroubu dle dílenské příručky', 'Torque and bolt replacement per workshop manual'), verify: true },
          { label: V('Kalibrace snímače úhlu', 'Angle sensor calibration'), value: V('Je-li vůz s ESP – diagnostika (např. Diagbox)', 'If the van has ESP – scan tool (e.g. Diagbox)'), verify: true }
        ],
        notes: [
          { level: 'warning', text: V('**Způsob uchycení airbagu nehádejte.** U vozů PSA bývají Torx šrouby zezadu volantu, jinde pružinové spony – ověřte v dílenské příručce pro váš VIN, než začnete páčit.', '**Do not guess how the airbag is held.** PSA vehicles often use Torx screws behind the wheel, others spring clips – verify in the workshop manual for your VIN before prying.'), verify: true },
          { level: 'info', text: V('Umístění baterie ověřte (u X250 bývá pod podlahou kabiny u řidiče nebo v motorovém prostoru). Odpojte minus pól a izolujte ho.', 'Verify where the battery is (on the X250 often under the cab floor at the driver\'s seat or in the engine bay). Disconnect the negative terminal and insulate it.'), verify: true },
          { level: 'caution', text: V('Sportovní / závodní volant bez airbagu nedává u užitkového vozu smysl a na silnici je nelegální.', 'A sport / racing wheel without an airbag makes no sense on a commercial van and is illegal on the road.') }
        ],
        tools: [V('Sada Torx (pro případné šrouby airbagu – ověřit velikost)', 'Torx set (for possible airbag screws – verify size)')],
        steps: {
          release: { notes: [{ level: 'warning', text: V('Jumper: nejprve ověřte, zda jsou na zadní straně volantu šrouby nebo otvory pro spony. Nepoužívejte sílu.', 'Jumper: first check whether the back of the wheel has screws or clip holes. Do not use force.'), verify: true }] },
          bolt: { specs: [{ label: V('Šroub volantu', 'Wheel bolt'), value: V('moment dle příručky', 'torque per manual'), verify: true }] },
          calibrate: { body: V('Má-li váš Jumper ESP, po montáži proveďte kalibraci snímače úhlu natočení volantu diagnostikou (např. Diagbox). Bez ESP se kalibrace obvykle neprovádí – ověřte.', 'If your Jumper has ESP, calibrate the steering angle sensor with a scan tool (e.g. Diagbox) after fitting. Without ESP calibration is usually not needed – verify.'), verify: true },
          aftermarket: { notes: [{ level: 'info', text: V('Pro užitkový Jumper tento krok přeskočte – sportovní volant bez airbagu se nedoporučuje.', 'Skip this step for the Jumper commercial van – an aftermarket wheel without an airbag is not recommended.') }] }
        }
      }
    }
  });
})(window.STU);
