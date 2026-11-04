/* Tutorial: Spark plugs (petrol) – with a glow-plug variant for the diesel Octavia. */
(function (S) {
  'use strict';
  var V = function (cs, en) { return { cs: cs, en: en }; };

  var SPARK_STEPS = ['prep', 'cover', 'coil', 'blow', 'remove', 'read', 'gap', 'thread', 'torque', 'coils', 'test'];
  function skipSpark() {
    var o = {};
    SPARK_STEPS.forEach(function (id) { o[id] = { skip: true }; });
    return o;
  }

  S.registerTutorial({
    id: 'spark-plugs',
    level: 1,
    thumb: 'plugs.socket',
    time: V('45–90 min', '45–90 min'),
    title: V('Výměna zapalovacích svíček', 'Spark plug replacement'),
    summary: V('Cívky ven, šachty vyfoukat, svíčky rukou a momentem. Jak číst staré svíčky.', 'Coils out, blow out the wells, plugs in by hand and to torque. How to read old plugs.'),
    intro: V(
      'Zapalovací svíčky zapalují směs v benzínovém motoru. Opotřebené svíčky způsobují vynechávání, vyšší spotřebu a mohou poškodit katalyzátor nebo cívky.\n\nNejvětší rizika: **stržený závit v hliníkové hlavě** a **nečistota spadlá do válce**. Obojí se dá snadno předejít – pracujte pomalu a podle kroků.',
      'Spark plugs ignite the mixture in a petrol engine. Worn plugs cause misfires and higher consumption and can damage the catalytic converter or coils.\n\nThe biggest risks: **a stripped thread in the aluminium head** and **dirt falling into the cylinder**. Both are easy to avoid – work slowly and follow the steps.'
    ),
    safety: [
      { level: 'warning', text: V('Pracujte jen na **studeném motoru**. Horký motor pálí a závit v teplé hliníkové hlavě se snadno strhne.', 'Work only on a **cold engine**. A hot engine burns and the thread in a warm aluminium head strips easily.') },
      { level: 'warning', text: V('Zapalovací systém vytváří desítky tisíc voltů. Nikdy nestartujte s odpojenou nebo vytaženou cívkou a nesahejte na cívky za chodu.', 'The ignition system produces tens of thousands of volts. Never crank with a coil unplugged or pulled out and never touch coils while the engine runs.') },
      { level: 'caution', text: V('Před povolením svíčky **vyfoukejte šachtu** stlačeným vzduchem – písek ve válci poškrábe válec. Ochranné brýle!', '**Blow out the plug well** with compressed air before loosening the plug – grit in the cylinder scores the bore. Safety glasses!') },
      { level: 'caution', text: V('Měňte vždy jednu svíčku po druhé a cívky si označte – nic nepřehodíte a do otevřené díry nic nespadne.', 'Always do one plug at a time and label the coils – you mix nothing up and nothing falls into an open hole.') },
      { level: 'info', text: V('Použijte jen svíčky se **správným tepelným rozsahem a typem** dle výrobce (katalog dle VIN). „Lepší“ svíčka jiného typu motoru škodí.', 'Use only plugs of the **correct heat range and type** per the manufacturer (catalogue by VIN). A "better" plug of a different type harms the engine.') }
    ],
    tools: [
      V('Ráčna 3/8" + prodloužení (různé délky)', '3/8" ratchet + extensions (various lengths)'),
      V('Hlavice na svíčky s gumovou vložkou nebo magnetem (14 / 16 mm dle svíčky)', 'Spark plug socket with rubber insert or magnet (14 / 16 mm per plug)'),
      V('Momentový klíč (rozsah cca 5–40 Nm)', 'Torque wrench (range approx. 5–40 Nm)'),
      V('Stlačený vzduch / ruční pumpička', 'Compressed air / hand blower'),
      V('Kousek pryžové hadičky (zašroubování rukou)', 'Short piece of rubber hose (threading by hand)'),
      V('Spárová měrka (jen kontrola)', 'Feeler gauge (checking only)'),
      V('Fix / páska na označení cívek', 'Marker / tape to label the coils'),
      V('Ochranné brýle', 'Safety glasses')
    ],
    parts: [
      V('Sada svíček dle katalogu výrobce (počet = počet válců, u twin-spark 2×)', 'Plug set per manufacturer catalogue (count = cylinders, 2× for twin spark)'),
      V('Dielektrická vazelína na pryžové koncovky cívek (volitelně)', 'Dielectric grease for coil boots (optional)')
    ],
    finalChecks: [
      V('Všechny svíčky dotaženy momentem', 'All plugs tightened to torque'),
      V('Všechny cívky dosednuté a konektory zacvaknuté', 'All coils seated and connectors clicked'),
      V('Kryt motoru zpět, žádné nářadí v motorovém prostoru', 'Engine cover back on, no tools in the engine bay'),
      V('Volnoběh klidný, kontrolka motoru nesvítí ani nebliká', 'Smooth idle, engine light neither on nor flashing'),
      V('Datum a km výměny zapsány', 'Date and mileage of replacement recorded')
    ],
    steps: [
      {
        id: 'prep', anim: 'plugs.overview',
        title: V('Pochopte systém a připravte díly', 'Understand the system and get the parts'),
        body: V(
          'Každý válec má **zapalovací cívku** nasazenou přímo na svíčce. Svíčka je zašroubovaná do hliníkové hlavy válců a její špička je ve spalovacím prostoru.\n\nKupte svíčky podle VIN / kódu motoru. Nechte motor **vychladnout** (ideálně přes noc).',
          'Each cylinder has an **ignition coil** sitting directly on the plug. The plug is screwed into the aluminium cylinder head and its tip sits in the combustion chamber.\n\nBuy plugs by VIN / engine code. Let the engine **cool down** (ideally overnight).'
        ),
        notes: [
          { level: 'tip', text: V('Vyfoťte si motorový prostor před demontáží – usnadní zpětnou montáž hadic a kabelů.', 'Take photos of the engine bay before taking things apart – it makes refitting hoses and wires easier.') }
        ]
      },
      {
        id: 'cover', anim: 'plugs.cover',
        title: V('Sundejte kryt motoru', 'Remove the engine cover'),
        body: V(
          'Kryt motoru většinou drží na pryžových čepech – táhněte **rovně nahoru** oběma rukama. Pokud je přišroubovaný, povolte šrouby.\n\nOdpojení 12V baterie není u svíček obvykle nutné, ale je to bezpečnější varianta, pokud pracujete poblíž kabeláže.',
          'The engine cover usually sits on rubber studs – pull **straight up** with both hands. If it is screwed on, undo the screws.\n\nDisconnecting the 12 V battery is usually not required for plugs, but it is the safer option if you work near wiring.'
        ),
        notes: [
          { level: 'caution', text: V('Netahejte za kryt jedním rohem – plastové úchyty praskají, hlavně v zimě.', 'Do not pull the cover by one corner – plastic mounts crack, especially in winter.') }
        ]
      },
      {
        id: 'coil', anim: 'plugs.coilOut',
        title: V('Odpojte a vytáhněte cívku', 'Unplug and pull out the coil'),
        body: V(
          '1. Cívku označte číslem válce.\n2. Stiskněte **pojistku konektoru** a konektor stáhněte – nikdy netahejte za kabely.\n3. Povolte případný šroubek cívky.\n4. Cívku vytáhněte **rovně nahoru**, lehce pootočte, pokud drží.',
          '1. Label the coil with its cylinder number.\n2. Press the **connector lock** and pull the connector off – never pull by the wires.\n3. Undo the coil bolt if there is one.\n4. Pull the coil **straight up**, twisting slightly if it sticks.'
        ),
        notes: [
          { level: 'caution', text: V('Plastové zámky konektorů jsou po letech křehké. Pokud praskne, konektor se může za jízdy uvolnit – náhradní zámek / konektor objednejte.', 'Plastic connector locks get brittle with age. If one cracks, the connector can come loose while driving – order a replacement lock / connector.') }
        ]
      },
      {
        id: 'blow', anim: 'plugs.blowOut',
        title: V('Vyfoukejte šachtu svíčky', 'Blow out the plug well'),
        body: V(
          'Než svíčku povolíte, **vyfoukejte šachtu** stlačeným vzduchem. Všechno, co v ní je (písek, listí, šroubky), by po vytažení svíčky spadlo přímo do válce.',
          'Before loosening the plug, **blow out the well** with compressed air. Anything in it (grit, leaves, small screws) would drop straight into the cylinder once the plug is out.'
        ),
        notes: [
          { level: 'warning', text: V('Ochranné brýle – nečistoty vyletí proti obličeji.', 'Safety glasses – debris flies towards your face.') },
          { level: 'caution', text: V('Olej v šachtě svíčky = netěsné těsnění víka ventilů. Zapište si to a řešte (olej ničí koncovky cívek).', 'Oil in the plug well = leaking valve cover gasket. Note it and fix it (oil destroys coil boots).') }
        ]
      },
      {
        id: 'remove', anim: 'plugs.socket',
        title: V('Vyšroubujte starou svíčku', 'Unscrew the old plug'),
        body: V(
          'Hlavici na svíčky s gumovou vložkou nasaďte s prodloužením **rovně** na svíčku. Povolte proti směru hodinových ručiček plynulým tahem. Jakmile se uvolní, dokončete rukou.',
          'Fit the spark plug socket with rubber insert on an extension **straight** onto the plug. Loosen counter-clockwise with a steady pull. Once it breaks free, finish by hand.'
        ),
        notes: [
          { level: 'warning', text: V('Pokud svíčka jde ztuha celou cestu nebo „skřípe“, zastavte. Zašroubujte ji o kus zpět, nechte motor vychladnout, použijte trochu uvolňovače a povolujte po malých krocích tam a zpět. Vytržený závit = oprava hlavy.', 'If the plug is tight all the way or "squeaks", stop. Screw it back in a bit, let the engine cool, use a little penetrating oil and work it out in small back-and-forth steps. A pulled thread = head repair.') },
          { level: 'caution', text: V('Nepoužívejte kloubové prodloužení s velkou silou – hlavice se vzpříčí a ulomíte izolátor svíčky.', 'Do not apply big force through a universal joint – the socket tilts and you snap the plug insulator.') }
        ]
      },
      {
        id: 'read', anim: 'plugs.read',
        title: V('Prohlédněte staré svíčky', 'Inspect the old plugs'),
        body: V(
          'Stará svíčka je diagnostický nástroj. Porovnejte všechny svíčky mezi sebou:\n- **Hnědošedá, suchá** – normální stav.\n- **Černá, sazovitá** – bohatá směs / krátké jízdy.\n- **Mokrá od oleje** – olej ve válci (kroužky, ventily, turbo).\n- **Bílá, natavená** – přehřívání (chudá směs, špatný typ svíčky). Do servisu!',
          'An old plug is a diagnostic tool. Compare all plugs with each other:\n- **Tan / grey, dry** – normal.\n- **Black, sooty** – rich mixture / short trips.\n- **Oil-wet** – oil in the cylinder (rings, valves, turbo).\n- **White, blistered** – overheating (lean mixture, wrong plug type). See a workshop!'
        ),
        notes: [
          { level: 'warning', text: V('Jedna svíčka výrazně jiná než ostatní ukazuje na problém konkrétního válce (vstřikovač, cívka, komprese).', 'One plug clearly different from the others points to a problem in that cylinder (injector, coil, compression).') }
        ]
      },
      {
        id: 'gap', anim: 'plugs.gap',
        title: V('Zkontrolujte novou svíčku', 'Check the new plug'),
        body: V(
          'Ověřte, že číslo svíčky odpovídá katalogu. Mezeru elektrod jen **zkontrolujte** spárovou měrkou. Moderní iridiové a platinové svíčky jsou nastavené z výroby.',
          'Make sure the plug number matches the catalogue. Only **check** the electrode gap with a feeler gauge. Modern iridium and platinum plugs come pre-gapped.'
        ),
        notes: [
          { level: 'warning', text: V('U iridiových/platinových svíček nikdy nepáčte měrkou mezi elektrodami – tenká elektroda se ulomí a spadne do válce.', 'Never lever a gauge between the electrodes of iridium/platinum plugs – the fine electrode breaks off and drops into the cylinder.') },
          { level: 'caution', text: V('Spadlá svíčka (i z výšky stolu) může mít prasklý izolátor nebo změněnou mezeru – nepoužívat.', 'A dropped plug (even from table height) may have a cracked insulator or changed gap – do not use it.') }
        ]
      },
      {
        id: 'thread', anim: 'plugs.thread',
        title: V('Zašroubujte svíčku rukou', 'Thread the plug in by hand'),
        body: V(
          'Nasaďte na horní část svíčky kousek **pryžové hadičky** a svíčku zašroubujte rukou. Pokud by šla šikmo, hadička proklouzne místo strhnutí závitu.\n\nSvíčka musí jít **lehce až na doraz**. Ráčnu použijte až potom.',
          'Push a short piece of **rubber hose** over the top of the plug and thread it in by hand. If it goes in crooked, the hose slips instead of stripping the thread.\n\nThe plug must turn **easily all the way to the seat**. Only then use the ratchet.'
        ),
        notes: [
          { level: 'danger', text: V('Nikdy nezačínejte svíčku ráčnou nebo rázovým utahovákem. Šikmo zašroubovaná svíčka zničí závit v hlavě – oprava stojí tisíce až desítky tisíc Kč.', 'Never start a plug with a ratchet or impact gun. A cross-threaded plug ruins the head thread – the repair costs a fortune.') },
          { level: 'info', text: V('Pastu proti zadření (anti-seize) používejte jen, pokud ji výrobce svíčky povoluje – mění utahovací moment a moderní svíčky mají povrchovou úpravu.', 'Only use anti-seize if the plug manufacturer allows it – it changes the torque and modern plugs are already coated.') }
        ]
      },
      {
        id: 'torque', anim: 'plugs.torque',
        title: V('Dotáhněte momentovým klíčem', 'Tighten with a torque wrench'),
        body: V(
          'Svíčky dotahujte **momentovým klíčem** na hodnotu dle výrobce motoru / svíčky. Příliš volná svíčka se přehřívá, příliš utažená strhne závit.',
          'Tighten the plugs **with a torque wrench** to the value given by the engine / plug manufacturer. A loose plug overheats, an over-tight one strips the thread.'
        ),
        specs: [{ label: V('Utahovací moment svíček', 'Spark plug torque'), value: V('dle příručky / výrobce svíčky', 'per manual / plug manufacturer') }],
        notes: [
          { level: 'caution', text: V('Moment platí pro čistý, suchý závit. Nemažte závit olejem.', 'The torque applies to a clean, dry thread. Do not oil the thread.') }
        ]
      },
      {
        id: 'coils', anim: 'plugs.coilIn',
        title: V('Nasaďte cívky a konektory', 'Refit the coils and connectors'),
        body: V(
          'Cívku nasaďte na **stejný válec**, ze kterého byla. Zatlačte, až koncovka dosedne na svíčku, utáhněte případný šroubek a zacvakněte konektor. **Každý konektor zkontrolujte tahem.**',
          'Fit each coil to the **same cylinder** it came from. Push until the boot seats on the plug, tighten the bolt if fitted and click the connector in. **Tug-test every connector.**'
        ),
        notes: [
          { level: 'tip', text: V('Tenká vrstva dielektrické vazelíny uvnitř pryžové koncovky usnadní příští demontáž a chrání proti vlhkosti.', 'A thin film of dielectric grease inside the rubber boot makes the next removal easier and keeps moisture out.') }
        ]
      },
      {
        id: 'test', anim: 'plugs.test',
        title: V('Nastartujte a zkontrolujte chod', 'Start up and check'),
        body: V(
          'Nasaďte kryt motoru, nastartujte. Motor musí běžet klidně, kontrolka motoru nesmí svítit ani blikat. Pokud máte diagnostiku, podívejte se na **počítadla vynechávání** jednotlivých válců.',
          'Refit the engine cover and start up. The engine must run smoothly, the engine light must neither stay on nor flash. If you have a scan tool, look at the **misfire counters** of each cylinder.'
        ),
        notes: [
          { level: 'danger', text: V('**Blikající** kontrolka motoru = silné vynechávání. Okamžitě vypněte – nespálené palivo zničí katalyzátor a hrozí požár. Zkontrolujte konektory a cívky.', 'A **flashing** engine light = severe misfire. Switch off immediately – unburnt fuel destroys the catalytic converter and can cause a fire. Check connectors and coils.') }
        ]
      }
    ],
    vehicles: {
      'mb-cl500-c216': {
        status: 'caution',
        time: V('3–5 h', '3–5 h'),
        specs: [
          { label: V('Systém', 'System'), value: V('Twin-spark: 2 svíčky na válec = 16 svíček', 'Twin spark: 2 plugs per cylinder = 16 plugs') },
          { label: V('Typ svíček', 'Plug type'), value: V('dle katalogu MB (EPC) pro váš VIN', 'per MB catalogue (EPC) for your VIN'), verify: true },
          { label: V('Utahovací moment', 'Torque'), value: V('≈ 25 Nm', '≈ 25 Nm'), verify: true },
          { label: V('Interval', 'Interval'), value: V('dle servisního plánu ASSYST', 'per ASSYST service plan'), verify: true }
        ],
        notes: [
          { level: 'warning', text: V('V8 s 16 svíčkami je časově náročná práce. Některé svíčky (zadní válce u přepážky) jsou špatně přístupné – může být nutné demontovat sání vzduchu / skříň filtru. Ověřte ve WIS.', 'A V8 with 16 plugs is time-consuming. Some plugs (rear cylinders at the bulkhead) are hard to reach – the air intake / filter housing may have to come off. Verify in WIS.'), verify: true },
          { level: 'info', text: V('Cívky M273 zapalují obě svíčky válce – druhá svíčka bývá napojená krátkým VN kabelem. Kabely se nesmí přehodit.', 'The M273 coils fire both plugs of a cylinder – the second plug is usually fed by a short HT lead. The leads must not be swapped.'), verify: true }
        ],
        tools: [V('Dlouhá a kloubová prodloužení (zadní svíčky)', 'Long and universal extensions (rear plugs)'), V('Krabička s 8 přihrádkami na označené díly', 'Box with 8 compartments for labelled parts')],
        extraSteps: [
          { after: 'prep', step: {
            id: 'mbTwin', anim: 'plugs.twinSpark',
            title: V('Twin-spark: plán práce na 16 svíček', 'Twin spark: plan for 16 plugs'),
            body: V('Pracujte **jeden válec po druhém** (obě svíčky válce, pak další válec). Nejdřív jedna řada válců, pak druhá. Mezitím si zapisujte, co je hotové.', 'Work **one cylinder at a time** (both plugs of the cylinder, then the next cylinder). First one bank, then the other. Tick off what is done as you go.'),
            notes: [{ level: 'caution', text: V('Zapomenutá nedotažená svíčka = únik spalin, propálení závitu. Odškrtávejte si každou svíčku.', 'A forgotten loose plug = combustion gas leak, burnt thread. Tick off every single plug.') }]
          } }
        ],
        steps: {
          torque: { specs: [{ label: V('Utahovací moment', 'Torque'), value: '≈ 25 Nm', verify: true }] },
          cover: { body: V('Sundejte kryt(y) motoru. Pro přístup k zadním svíčkám může být nutné demontovat díly sání – ověřte postup ve WIS.', 'Remove the engine cover(s). Intake parts may have to come off to reach the rear plugs – check the procedure in WIS.') }
        },
        finalChecks: [V('Všech 16 svíček odškrtnuto jako dotažené', 'All 16 plugs ticked off as tightened')]
      },
      'volvo-xc60-b4': {
        status: 'ok',
        specs: [
          { label: V('Počet svíček', 'Number of plugs'), value: '4' },
          { label: V('Typ svíček', 'Plug type'), value: V('dle katalogu Volvo pro váš VIN', 'per Volvo catalogue for your VIN'), verify: true },
          { label: V('Utahovací moment', 'Torque'), value: V('dle VIDA', 'per VIDA'), verify: true },
          { label: V('Interval', 'Interval'), value: V('dle servisního plánu Volvo', 'per Volvo service schedule'), verify: true }
        ],
        notes: [
          { level: 'warning', text: V('V motorovém prostoru vede **48V kabeláž** startér-generátoru (ISGM). Na svíčky se obvykle odpojovat nemusí, ale kabely nepoškozujte, nepřiskřípněte a nepokládejte na ně kovové nářadí.', '**48 V wiring** for the starter-generator (ISGM) runs through the engine bay. You usually do not need to disconnect it for plugs, but do not damage or pinch the cables or lay metal tools on them.') },
          { level: 'info', text: V('Pokud je vůz zamčený/uspaný, některé systémy se při otevření kapoty probudí. Mějte klíč daleko od vozu, aby se motor nemohl spustit (např. vzdálené předehřívání).', 'If the car is locked/asleep, some systems wake when the bonnet is opened. Keep the key away from the car so the engine cannot start (e.g. remote pre-conditioning).'), verify: true }
        ],
        steps: {
          torque: { specs: [{ label: V('Utahovací moment', 'Torque'), value: V('dle VIDA', 'per VIDA'), verify: true }] }
        }
      },
      'toyota-gr-yaris': {
        status: 'ok',
        specs: [
          { label: V('Počet svíček', 'Number of plugs'), value: V('3 (tříválec)', '3 (three-cylinder)') },
          { label: V('Typ svíček', 'Plug type'), value: V('iridium, tepelný rozsah přesně dle Toyota', 'iridium, heat range exactly per Toyota'), verify: true },
          { label: V('Utahovací moment', 'Torque'), value: V('dle TIS', 'per TIS'), verify: true },
          { label: V('Mezera', 'Gap'), value: V('z výroby – neupravovat', 'pre-gapped – do not adjust'), verify: true }
        ],
        notes: [
          { level: 'warning', text: V('Vysoce přeplňovaný motor je citlivý na **tepelný rozsah** svíčky. Teplejší svíčka může způsobit detonační spalování a poškození pístu. Používejte jen předepsaný typ (při úpravách výkonu dle tuneru).', 'The highly boosted engine is sensitive to plug **heat range**. A hotter plug can cause knock and piston damage. Use only the specified type (for tuned engines per the tuner).') },
          { level: 'info', text: V('Pro přístup může být nutné sundat kryt motoru, případně díly sání / mezichladiče – ověřte v TIS.', 'Access may require removing the engine cover and possibly intake / intercooler parts – verify in TIS.'), verify: true },
          { level: 'tip', text: V('Při okruhovém provozu kontrolujte svíčky častěji – jejich vzhled prozradí, jestli motor neběží chudě.', 'With track use, check the plugs more often – their appearance tells you if the engine runs lean.') }
        ],
        steps: {
          torque: { specs: [{ label: V('Utahovací moment', 'Torque'), value: V('dle TIS', 'per TIS'), verify: true }] }
        }
      },
      'skoda-octavia-rs-tdi': {
        status: 'caution',
        title: V('Výměna žhavicích svíček (diesel)', 'Glow plug replacement (diesel)'),
        summary: V('Diesel nemá zapalovací svíčky. Test, citlivá demontáž a co dělat, když svíčka nejde ven.', 'A diesel has no spark plugs. Testing, careful removal and what to do if a plug will not come out.'),
        time: V('1–2 h (pokud nic nezatuhne)', '1–2 h (if nothing seizes)'),
        intro: V(
          'Váš 2.0 TDI je **diesel** – nemá zapalovací svíčky. Místo nich má **žhavicí svíčky**, které předehřívají spalovací prostor při studeném startu.\n\nHlavní riziko: žhavicí svíčky v hliníkové hlavě **zatuhnou** a při násilí se **ulomí**. Vytahování ulomené svíčky je práce pro specialistu (někdy i demontáž hlavy). Proto: **test před výměnou, trpělivost a žádná hrubá síla.**',
          'Your 2.0 TDI is a **diesel** – it has no spark plugs. Instead it has **glow plugs**, which preheat the combustion chamber on a cold start.\n\nThe main risk: glow plugs **seize** in the aluminium head and **snap** if forced. Extracting a snapped plug is specialist work (sometimes head removal). So: **test before replacing, be patient and use no brute force.**'
        ),
        specs: [
          { label: V('Počet žhavicích svíček', 'Number of glow plugs'), value: '4' },
          { label: V('Typ', 'Type'), value: V('dle katalogu (kód motoru CEGA)', 'per catalogue (engine code CEGA)'), verify: true },
          { label: V('Hlavice', 'Socket'), value: V('dlouhá tenkostěnná 10 mm', 'long thin-wall 10 mm'), verify: true },
          { label: V('Utahovací moment', 'Torque'), value: '≈ 15 Nm', verify: true },
          { label: V('Odpor dobré svíčky', 'Good plug resistance'), value: V('typicky pod 2 Ω (za studena)', 'typically below 2 Ω (cold)'), verify: true }
        ],
        notes: [
          { level: 'danger', text: V('Hned vedle žhavicích svíček jsou **vstřikovače a vysokotlaká vedení Common Rail**. Vysokotlaká vedení neotevírejte a nepoužívejte je jako opěru pro nářadí.', 'Right next to the glow plugs are the **Common Rail injectors and high-pressure lines**. Do not open the high-pressure lines or use them to lever tools against.') },
          { level: 'warning', text: V('Pokud svíčka nejde povolit přiměřenou silou, **přestaňte**. Ulomená svíčka = drahá oprava. Raději nechte vadnou svíčku v motoru a jeďte ke specialistovi.', 'If a plug will not loosen with reasonable force, **stop**. A snapped plug = expensive repair. Better leave the faulty plug in and go to a specialist.') }
        ],
        replaceTools: true,
        tools: [
          V('Multimetr (měření odporu)', 'Multimeter (resistance)'),
          V('Dlouhá tenkostěnná hlavice na žhavicí svíčky', 'Long thin-wall glow plug socket'),
          V('Krátká rukojeť / ráčna 1/4" (cit pro sílu)', 'Short handle / 1/4" ratchet (feel for force)'),
          V('Momentový klíč (rozsah cca 5–25 Nm)', 'Torque wrench (range approx. 5–25 Nm)'),
          V('Uvolňovač (penetrační olej)', 'Penetrating oil'),
          V('Stlačený vzduch', 'Compressed air'),
          V('Diagnostika (VCDS / OBDeleven) – volitelně', 'Scan tool (VCDS / OBDeleven) – optional')
        ],
        parts: [
          V('Žhavicí svíčky dle katalogu pro kód motoru (měnit vadné, ideálně všechny 4)', 'Glow plugs per catalogue for the engine code (replace faulty ones, ideally all 4)')
        ],
        replaceFinalChecks: true,
        finalChecks: [
          V('Všechny žhavicí svíčky dotaženy momentem', 'All glow plugs tightened to torque'),
          V('Všechny konektory nasazené', 'All connectors fitted'),
          V('Vysokotlaká vedení nedotčená a suchá', 'High-pressure lines untouched and dry'),
          V('Paměť závad bez chyb žhavení', 'Fault memory without glow plug faults'),
          V('Studený start druhý den ráno bez problémů', 'Cold start the next morning without problems')
        ],
        steps: skipSpark(),
        extraSteps: [
          { after: 'prep', step: {
            id: 'gSymptoms', anim: 'plugs.glowLight',
            title: V('Poznejte vadné žhavicí svíčky', 'Recognise faulty glow plugs'),
            body: V('Typické příznaky:\n- těžký start za studena (hlavně pod 0 °C)\n- bílý / modrý kouř a nerovný chod hned po startu\n- kontrolka žhavení bliká za jízdy\n- chybové kódy žhavení (P0670–P0684 a výrobcové kódy)\n\nNejdřív přečtěte paměť závad (návod **Diagnostika**).', 'Typical symptoms:\n- hard cold start (especially below 0 °C)\n- white / blue smoke and rough running just after start\n- glow light flashing while driving\n- glow plug fault codes (P0670–P0684 and manufacturer codes)\n\nRead the fault memory first (see the **Diagnostics** tutorial).'),
            notes: [{ level: 'info', text: V('Těžký start může mít i jiné příčiny (baterie, startér, vstřikovače, tlak paliva). Neměňte díly naslepo.', 'A hard start can have other causes (battery, starter, injectors, fuel pressure). Do not replace parts blindly.') }]
          } },
          { after: 'prep', step: {
            id: 'gTest', anim: 'plugs.glowTest',
            title: V('Otestujte žhavicí svíčky', 'Test the glow plugs'),
            body: V('Sundejte kryt motoru a konektory žhavicích svíček. Multimetrem změřte **odpor** mezi svorkou svíčky a kostrou motoru. Vadná svíčka má nekonečný nebo výrazně vyšší odpor než ostatní.', 'Remove the engine cover and the glow plug connectors. Measure the **resistance** between the plug terminal and engine ground with a multimeter. A faulty plug shows infinite or clearly higher resistance than the others.'),
            specs: [{ label: V('Odpor dobré svíčky', 'Good plug resistance'), value: V('typicky pod 2 Ω', 'typically below 2 Ω'), verify: true }],
            notes: [{ level: 'caution', text: V('Odpojte konektor jen za koncovku, ne za kabel. Měřte se zapalováním vypnutým.', 'Unplug the connector by the plug body, not the wire. Measure with the ignition off.') }]
          } },
          { after: 'prep', step: {
            id: 'gPrep', anim: 'plugs.penetrate',
            title: V('Den předem: uvolňovač', 'The day before: penetrating oil'),
            body: V('Na závity svíček nastříkejte uvolňovač a nechte ho působit přes noc. Před demontáží šachty **vyfoukejte** stlačeným vzduchem.\n\nMnoho mechaniků povoluje žhavicí svíčky na **zahřátém** motoru (ne horkém) – hliník se roztáhne víc než ocel. Ověřte doporučení v ELSA.', 'Spray penetrating oil on the plug threads and let it soak overnight. **Blow out** the wells with compressed air before removal.\n\nMany mechanics loosen glow plugs on a **warm** (not hot) engine – aluminium expands more than steel. Check the recommendation in ELSA.'),
            notes: [{ level: 'warning', text: V('Na zahřátém motoru pracujte v rukavicích – výfukové potrubí a turbo pálí.', 'Wear gloves on a warm engine – the exhaust manifold and turbo burn.'), verify: true }]
          } },
          { after: 'prep', step: {
            id: 'gLoosen', anim: 'plugs.glow',
            title: V('Povolte žhavicí svíčku citlivě', 'Loosen the glow plug gently'),
            body: V('Nasaďte dlouhou hlavici **rovně**, použijte **krátkou rukojeť** (cítíte sílu). Povolujte plynule. Když se svíčka pohne, vytočte ji – pokud jde ztuha, točte střídavě kousek tam a zpět s uvolňovačem.', 'Fit the long socket **straight** and use a **short handle** (so you feel the force). Loosen smoothly. Once it moves, unscrew it – if it is stiff, work it back and forth a little with penetrating oil.'),
            notes: [
              { level: 'danger', text: V('Žádné prodlužovací páky a rázové utahováky! Pokud svíčka nepovolí přiměřenou silou (řádově do ~25–30 Nm), **zastavte**.', 'No breaker bars or impact guns! If the plug does not move with reasonable force (roughly up to ~25–30 Nm), **stop**.'), verify: true }
            ]
          } },
          { after: 'prep', step: {
            id: 'gStuck', anim: 'plugs.glowSnap',
            title: V('Když svíčka nejde: zastavte', 'If the plug will not move: stop'),
            body: V('Zatuhlou svíčku nechte znovu nasáknout uvolňovačem, zkuste zahřátý motor. Pokud ani pak nejde, **nechte ji v motoru** a obraťte se na specialistu na vyjímání žhavicích svíček (speciální sady, ohřev, vyvrtání).', 'Soak a seized plug again with penetrating oil and try with a warm engine. If it still will not move, **leave it in the engine** and go to a glow plug extraction specialist (special kits, heating, drilling out).'),
            notes: [{ level: 'warning', text: V('Ulomená špička svíčky může spadnout do válce – pak hrozí poškození pístu. Po ulomení motor nestartujte.', 'A snapped plug tip can drop into the cylinder – risking piston damage. Do not start the engine after a plug snaps.') }]
          } },
          { after: 'prep', step: {
            id: 'gThread', anim: 'plugs.thread',
            title: V('Novou svíčku zašroubujte rukou', 'Thread the new plug in by hand'),
            body: V('Očistěte šachtu, novou svíčku zašroubujte **rukou až na doraz**. Pastu na závit použijte jen dle návodu výrobce svíčky.', 'Clean the well and thread the new plug in **by hand until it seats**. Use thread paste only per the plug manufacturer\'s instructions.')
          } },
          { after: 'prep', step: {
            id: 'gTorque', anim: 'plugs.torque',
            title: V('Dotáhněte nízkým momentem', 'Tighten to the low torque'),
            body: V('Žhavicí svíčky se dotahují **malým momentem**. Použijte momentový klíč s malým rozsahem. Nasaďte konektory a kryt motoru.', 'Glow plugs are tightened to a **low torque**. Use a small-range torque wrench. Refit the connectors and the engine cover.'),
            specs: [{ label: V('Utahovací moment', 'Torque'), value: '≈ 15 Nm', verify: true }],
            notes: [{ level: 'caution', text: V('Přetažená svíčka se příště ještě hůř povoluje a může prasknout.', 'An over-tightened plug is even harder to remove next time and can crack.') }]
          } },
          { after: 'prep', step: {
            id: 'gTest2', anim: 'plugs.test',
            title: V('Vymažte závady a otestujte start', 'Clear faults and test the start'),
            body: V('Po opravě vymažte uložené chyby žhavení (diagnostika), nastartujte a zkontrolujte, že se chyba nevrací. Skutečný test je **studený start** další den ráno.', 'After the repair clear the stored glow plug faults (scan tool), start the engine and check the fault does not return. The real test is a **cold start** the next morning.')
          } }
        ]
      }
    }
  });
})(window.STU);
