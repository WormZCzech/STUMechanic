/* Tutorial: Clutch kit + dual-mass flywheel replacement (manual gearbox) – incl. guidance for automatics. */
(function (S) {
  'use strict';
  var V = function (cs, en) { return { cs: cs, en: en }; };

  var CLUTCH_STEPS = ['symptoms', 'dmf', 'prep', 'lift', 'ancillary', 'support', 'gearboxOut', 'inspect', 'dmfFit', 'disc', 'plate', 'gearboxIn', 'bleed', 'test'];
  function skipAll() {
    var o = {};
    CLUTCH_STEPS.forEach(function (id) { o[id] = { skip: true }; });
    return o;
  }

  /** Extra steps for cars with an automatic transmission (no pedal clutch). */
  function autoSteps(car) {
    var mb = car === 'mb';
    var tool = mb ? 'XENTRY / DAS' : 'VIDA';
    return [
      {
        after: 'symptoms',
        step: {
          id: 'auto-what', anim: 'clutch.auto',
          title: V('Váš vůz má automat – spojku s pedálem nemá', 'Your car is automatic – there is no pedal clutch'),
          body: mb
            ? V('Převodovka **7G-Tronic (722.9)** má místo spojky **hydrodynamický měnič** s přemosťovací spojkou a uvnitř převodovky lamelové spojky ovládané hydraulikou a elektronikou. Nic z toho se nemění „po kusech“ jako spojka u manuálu.\n\nTento návod vám proto ukáže, **co můžete zkontrolovat sami** a kdy jet do specializovaného servisu.',
                'The **7G-Tronic (722.9)** gearbox uses a **torque converter** with a lock-up clutch instead of a pedal clutch, plus internal multi-plate clutches controlled by hydraulics and electronics. None of these are replaced "piece by piece" like a manual clutch.\n\nSo this tutorial shows **what you can check yourself** and when to go to a specialist.')
            : V('8st. automat **Aisin (AWF8G45)** má místo spojky **hydrodynamický měnič** s přemosťovací spojkou a uvnitř lamelové spojky ovládané elektronikou. Nic z toho se nemění „po kusech“ jako spojka u manuálu.\n\nTento návod vám proto ukáže, **co můžete zkontrolovat sami** a kdy jet do specializovaného servisu.',
                'The 8-speed **Aisin (AWF8G45)** automatic uses a **torque converter** with a lock-up clutch instead of a pedal clutch, plus internal clutch packs controlled electronically. None of these are replaced "piece by piece" like a manual clutch.\n\nSo this tutorial shows **what you can check yourself** and when to go to a specialist.'),
          notes: [
            { level: 'info', text: V('Výměna měniče nebo oprava převodovky vyžaduje vyjmutí převodovky (desítky kg) a specializované vybavení.', 'Replacing the torque converter or repairing the gearbox requires removing the transmission (tens of kg) and specialist equipment.') }
          ]
        }
      },
      {
        after: 'symptoms',
        step: {
          id: 'auto-symptoms', anim: 'clutch.symptoms',
          title: V('Příznaky problému automatu', 'Symptoms of an automatic transmission problem'),
          body: V(
            '- **Prokluz:** otáčky vyskočí, vůz nezrychluje (hlavně při řazení).\n- **Tvrdé nebo opožděné řazení**, kopnutí při zařazení D/R.\n- **Cukání / vibrace** kolem 60–90 km/h (přemosťovací spojka měniče).\n- Nouzový režim (jen jeden převodový stupeň), varovná hláška na displeji.\n- Tmavý, spáleně páchnoucí olej ATF.',
            '- **Slipping:** revs flare, the car does not accelerate (especially during shifts).\n- **Harsh or delayed shifts**, a jolt when selecting D/R.\n- **Shudder / vibration** around 60–90 km/h (torque converter lock-up clutch).\n- Limp mode (stuck in one gear), a warning message on the display.\n- Dark, burnt-smelling ATF.'
          ),
          notes: [
            { level: 'warning', text: V('V nouzovém režimu jezděte jen pomalu a nejkratší cestou do servisu. Pokračování v jízdě s prokluzující převodovkou ji rychle dorazí.', 'In limp mode drive only slowly and by the shortest route to a workshop. Driving on with a slipping gearbox finishes it off quickly.') }
          ]
        }
      },
      {
        after: 'symptoms',
        step: {
          id: 'auto-scan', anim: 'clutch.auto',
          title: V('Přečtěte chybové kódy a teplotu ATF', 'Read fault codes and ATF temperature'),
          body: V(
            'Připojte diagnostiku (' + tool + ' nebo tester se specifickou podporou značky). Přečtěte chyby řídicí jednotky převodovky, ne jen motoru. Podívejte se na živá data: teplotu ATF, prokluz měniče, otáčky turbíny.\n\nChyby si **vyfoťte a zapište**, než cokoli mažete – servis je bude potřebovat.',
            'Connect a scan tool (' + tool + ' or a tester with brand-specific support). Read the transmission control unit faults, not only the engine. Look at live data: ATF temperature, converter slip, turbine speed.\n\n**Photograph and write down** the faults before clearing anything – the workshop will need them.'
          ),
          notes: mb ? [
            { level: 'info', text: V('U 7G-Tronic jsou známé závady elektrohydraulické jednotky / vodivé desky (snímače otáček). Typické chyby se týkají snímačů otáček Y3/8n1–n3 – ověřte u specialisty.', 'The 7G-Tronic is known for valve body / conductor plate failures (speed sensors). Typical faults relate to speed sensors Y3/8n1–n3 – verify with a specialist.'), verify: true }
          ] : [
            { level: 'info', text: V('Volvo může mít pro převodovku aktualizace softwaru – zeptejte se servisu, než budete cokoli měnit.', 'Volvo may have software updates for the transmission – ask the dealer before replacing anything.') }
          ]
        }
      },
      {
        after: 'symptoms',
        step: {
          id: 'auto-fluid', anim: 'drive.atfTemp',
          title: V('Stav a hladina ATF', 'ATF condition and level'),
          body: V(
            'Většina problémů automatu začíná u oleje. Stav a hladinu ATF kontrolujte **jen podle postupu výrobce** (teplotní okno, běžící motor, diagnostika) – viz návod **Oleje převodovky a diferenciálů**.\n\nVýměna ATF (částečná, s filtrem) je rozumná prevence – ne zázračná oprava už poškozené převodovky.',
            'Most automatic transmission problems start with the fluid. Check ATF condition and level **only per the manufacturer\'s procedure** (temperature window, engine running, scan tool) – see the **Gearbox & differential oils** tutorial.\n\nAn ATF change (partial, with filter) is sensible prevention – not a miracle cure for an already damaged gearbox.'
          ),
          notes: [
            { level: 'caution', text: V('Nedolévejte ATF „od oka“ – přeplnění i nedostatek způsobují pěnění, prokluz a přehřátí.', 'Do not top up ATF by guesswork – both over- and underfilling cause foaming, slip and overheating.') }
          ]
        }
      },
      {
        after: 'symptoms',
        step: {
          id: 'auto-adapt', anim: 'clutch.auto',
          title: V('Adaptace převodovky', 'Transmission adaptation'),
          body: V(
            'Řídicí jednotka si „učí“ tlaky a časování řazení. Po výměně ATF nebo opravě se adaptace často **resetuje diagnostikou (' + tool + ')** a pak se provede **adaptační jízda** podle předpisu (plynulé řazení všech stupňů za tepla).\n\nReset adaptace bez důvodu může řazení dočasně zhoršit – dělejte ho jen podle postupu výrobce.',
            'The control unit "learns" shift pressures and timing. After an ATF change or repair the adaptation is often **reset with a scan tool (' + tool + ')**, followed by an **adaptation drive** per the procedure (smooth shifts through all gears when warm).\n\nResetting adaptation without a reason can temporarily make shifts worse – only do it per the manufacturer\'s procedure.'
          ),
          notes: [
            { level: 'info', text: V('Přesný postup adaptační jízdy ověřte v ' + (mb ? 'WIS/XENTRY' : 'VIDA') + '.', 'Verify the exact adaptation drive procedure in ' + (mb ? 'WIS/XENTRY' : 'VIDA') + '.'), verify: true }
          ]
        }
      },
      {
        after: 'symptoms',
        step: {
          id: 'auto-workshop', anim: 'clutch.layout',
          title: V('Kdy do specializovaného servisu', 'When to go to a transmission specialist'),
          body: V(
            '- Chyby převodovky se vracejí i po výměně ATF.\n- Prokluz, cukání měniče nebo nouzový režim.\n- Kovové částice nebo spálený zápach v ATF.\n\nPožádejte o **diagnostiku před opravou**, rozpis prací a fotky vyjmutých dílů.',
            '- Transmission faults return even after an ATF change.\n- Slip, converter shudder or limp mode.\n- Metal particles or a burnt smell in the ATF.\n\nAsk for a **diagnosis before repair**, an itemised quote and photos of removed parts.'
          ),
          notes: []
        }
      }
    ];
  }

  var AUTO_TOOLS = [
    V('Diagnostika se specifickou podporou značky', 'Scan tool with brand-specific support'),
    V('Hever + stojany (pro kontrolu úniků)', 'Jack + axle stands (for leak check)'),
    V('Baterka, rukavice', 'Torch, gloves')
  ];
  var AUTO_FINAL = [
    V('Chybové kódy zapsány / vyfoceny', 'Fault codes written down / photographed'),
    V('Stav ATF ověřen podle postupu výrobce', 'ATF condition checked per the manufacturer\'s procedure'),
    V('Žádné úniky pod převodovkou', 'No leaks under the transmission')
  ];
  var AUTO_INTRO_CS = 'Váš vůz má **automatickou převodovku** – nemá spojkový pedál ani klasickou spojku, kterou by šlo vyměnit. Návod vám místo toho ukáže, **jak poznat problém automatu**, co zkontrolovat sami a kdy jet do specializovaného servisu.';
  var AUTO_INTRO_EN = 'Your car has an **automatic transmission** – there is no clutch pedal and no conventional clutch to replace. Instead this tutorial shows **how to recognise an automatic transmission problem**, what to check yourself and when to see a specialist.';

  S.registerTutorial({
    id: 'clutch',
    level: 3,
    status: 'pro',
    thumb: 'clutch.layout',
    time: V('8–12 h (první výměna i déle)', '8–12 h (first time even longer)'),
    title: V('Výměna spojky a dvouhmotového setrvačníku', 'Clutch kit & dual-mass flywheel replacement'),
    summary: V('Vyjmutí převodovky, nová spojka, DMF, vypínací ložisko. Těžká práce se zvedákem převodovky.', 'Gearbox removal, new clutch, DMF, release bearing. Heavy work with a gearbox jack.'),
    intro: V(
      'Výměna spojky znamená **vyjmout převodovku** (u běžného auta 40–50 kg) zpod vozu. Je to jedna z nejtěžších prací pro domácí dílnu: potřebujete pevné stojany, **zvedák převodovky**, **podpěru motoru**, momentový klíč s úhloměrem a pomocníka.\n\nPostup níže je obecný pro **příčně uložený motor s manuální převodovkou** (přední pohon). Přesné pořadí demontáže se liší podle vozu – vždy mějte po ruce dílenskou příručku.',
      'Replacing a clutch means **removing the gearbox** (40–50 kg on a typical car) from under the car. It is one of the hardest jobs for a home garage: you need solid stands, a **gearbox jack**, an **engine support bar**, a torque wrench with an angle gauge and a helper.\n\nThe procedure below is generic for a **transverse engine with a manual gearbox** (front-wheel drive). The exact removal order differs per car – always have the workshop manual at hand.'
    ),
    safety: [
      { level: 'danger', text: V('**Nikdy nebuďte pod převodovkou, která není podepřená zvedákem.** Převodovka může po povolení posledního šroubu nebo uložení spadnout. Hmotnost 40–50 kg způsobí vážný úraz.', '**Never be under a gearbox that is not supported by a jack.** The gearbox can drop when the last bolt or mount is released. 40–50 kg causes serious injury.') },
      { level: 'danger', text: V('Před povolením uložení motoru/převodovky musí být **motor podepřený** (podpěra přes blatníky nebo zvedák pod motorem s dřevěnou podložkou).', 'Before releasing any engine/gearbox mount the **engine must be supported** (support bar across the wings, or a jack under the engine with a wooden pad).') },
      { level: 'danger', text: V('Vůz musí stát na **4 stojanech** dostatečně vysoko a projít testem stability. Při vyjímání převodovky se na vůz působí silou – stojany kontrolujte znovu.', 'The car must stand on **4 axle stands**, high enough, and pass the stability test. Removing the gearbox puts force on the car – re-check the stands.') },
      { level: 'warning', text: V('Prach ze spojky nevyfukujte stlačeným vzduchem a nevdechujte (starší díly mohou obsahovat azbest). Použijte čistič brzd a respirátor P2/P3.', 'Do not blow clutch dust with compressed air and do not inhale it (older parts may contain asbestos). Use brake cleaner and a P2/P3 mask.') },
      { level: 'warning', text: V('Šrouby setrvačníku a často i talíře jsou **pružné šrouby na jedno použití** (moment + úhel). Vždy nové.', 'Flywheel bolts and often pressure plate bolts are **single-use stretch bolts** (torque + angle). Always new ones.') },
      { level: 'caution', text: V('Třecí plochy (lamela, setrvačník, talíř) nesmí přijít do styku s olejem ani tukem. Ruce čisté, plochy odmastit.', 'Friction surfaces (disc, flywheel, plate) must not touch oil or grease. Keep hands clean, degrease the surfaces.') },
      { level: 'caution', text: V('Odpojte baterii – pracujete u startéru a kabeláže.', 'Disconnect the battery – you will work near the starter and wiring.') }
    ],
    tools: [
      V('4× podpěrný stojan + pojízdný hever', '4× axle stands + trolley jack'),
      V('Zvedák převodovky (lze půjčit)', 'Transmission jack (can be rented)'),
      V('Podpěra motoru přes blatníky', 'Engine support bar across the wings'),
      V('Momentový klíč + úhloměr', 'Torque wrench + angle gauge'),
      V('Sada hlavic, Torx, XZN (vícezub), prodloužení, kloub', 'Socket set, Torx, XZN (triple square), extensions, universal joint'),
      V('Středicí trn spojky (bývá v sadě)', 'Clutch alignment tool (often in the kit)'),
      V('Přípravek pro SAC talíř (pokud je SAC)', 'SAC compression tool (if the plate is SAC)'),
      V('Aretace setrvačníku', 'Flywheel locking tool'),
      V('Odvzdušňovací hadička + láhev', 'Bleed hose + bottle'),
      V('Čistič brzd, hadry, respirátor P2/P3, brýle', 'Brake cleaner, rags, P2/P3 mask, glasses')
    ],
    parts: [
      V('Spojková sada: přítlačný talíř, lamela, vypínací ložisko', 'Clutch kit: pressure plate, disc, release bearing'),
      V('Dvouhmotový setrvačník (DMF) – je-li opotřebený', 'Dual-mass flywheel (DMF) – if worn'),
      V('Nové šrouby setrvačníku a talíře', 'New flywheel and pressure plate bolts'),
      V('Hydraulický vypínač (CSC) – doporučeno měnit', 'Concentric slave cylinder (CSC) – recommended'),
      V('Těsnicí kroužky / šrouby poloos dle příručky', 'Driveshaft seals / bolts per manual'),
      V('Brzdová / spojková kapalina dle specifikace', 'Brake / clutch fluid per spec'),
      V('Převodový olej (dobrá příležitost k výměně)', 'Gear oil (good opportunity to change it)'),
      V('Mazivo na drážky hřídele (dodává se se sadou)', 'Spline grease (usually supplied with the kit)')
    ],
    finalChecks: [
      V('Všechny šrouby převodovky, uložení a poloos dotaženy momentem', 'All gearbox, mount and driveshaft bolts torqued'),
      V('Hydraulika odvzdušněná, pedál pevný, kapalina mezi MIN a MAX', 'Hydraulics bled, pedal firm, fluid between MIN and MAX'),
      V('Převodový olej zkontrolován / doplněn', 'Gear oil checked / topped up'),
      V('Startér, kostřicí kabely a konektory připojené', 'Starter, earth straps and connectors reconnected'),
      V('Všechny rychlosti a zpátečka řadí čistě (na místě se zapnutým motorem)', 'All gears and reverse select cleanly (stationary, engine running)'),
      V('Podpěra motoru, zvedák a nářadí odklizeno', 'Engine support, jack and tools removed'),
      V('Prvních ~500 km šetrně, po 50 km kontrola šroubů a úniků', 'First ~500 km gently, check bolts and leaks after 50 km')
    ],
    steps: [
      {
        id: 'symptoms', anim: 'clutch.symptoms',
        title: V('Poznejte opotřebenou spojku', 'Recognise a worn clutch'),
        body: V(
          '- **Prokluz:** při zrychlení na vyšší rychlostní stupeň rostou otáčky, ale vůz nezrychluje.\n- **Záběr vysoko** u konce zdvihu pedálu.\n- **Cukání** při rozjezdu.\n- **Klepání / rachot na volnoběh**, který zmizí po sešlápnutí pedálu → často DMF.\n- Pískání nebo hukot při sešlápnutém pedálu → vypínací ložisko.',
          '- **Slip:** accelerating in a higher gear, the revs rise but the car does not speed up.\n- **High bite point** near the top of the pedal travel.\n- **Judder** on take-off.\n- **Knocking / rattle at idle** that disappears when the pedal is pressed → often the DMF.\n- Squeal or hum with the pedal pressed → release bearing.'
        ),
        notes: [
          { level: 'tip', text: V('Test prokluzu: 4. rychlost, cca 50 km/h, plný plyn. Pokud otáčky „utečou“ rychleji než rychlost, spojka prokluzuje. Dělejte jen bezpečně, mimo provoz.', 'Slip test: 4th gear, approx. 50 km/h, full throttle. If the revs run away faster than the speed, the clutch slips. Only do it safely, away from traffic.') },
          { level: 'info', text: V('Než koupíte díly, vylučte jiné příčiny (vadná hydraulika, seřízení, motorové uložení).', 'Before buying parts, rule out other causes (faulty hydraulics, adjustment, engine mounts).') }
        ]
      },
      {
        id: 'dmf', anim: 'clutch.dmfCheck',
        title: V('Rozhodněte o dvouhmotovém setrvačníku (DMF)', 'Decide about the dual-mass flywheel (DMF)'),
        body: V(
          'DMF tlumí vibrace motoru, ale opotřebovává se. Po vyjmutí převodovky zkontrolujte:\n1. **Volné protočení** sekundární části proti primární (vůle) – limity uvádí výrobce DMF (LuK, Sachs) v tabulce pro daný díl.\n2. **Naklopení** sekundární části (axiální vůle).\n3. Stopy **oleje**, mazacího tuku z DMF, **modré skvrny** a praskliny na třecí ploše.\n\nPři vysokém nájezdu nebo hraničních hodnotách se DMF mění spolu se spojkou – druhá demontáž převodovky je dražší než díl.',
          'The DMF damps engine vibration but it wears. With the gearbox removed, check:\n1. **Free rotation** of the secondary mass against the primary (play) – limits are given by the DMF maker (LuK, Sachs) in a table for that part.\n2. **Rocking** of the secondary mass (axial play).\n3. Traces of **oil**, grease leaking from the DMF, **blue spots** and cracks on the friction face.\n\nAt high mileage or borderline values replace the DMF together with the clutch – removing the gearbox twice costs more than the part.'
        ),
        notes: [
          { level: 'warning', text: V('DMF se **nesmí přebrušovat** (soustružit) – na rozdíl od jednohmotového setrvačníku. Poškozený DMF = nový díl.', 'A DMF **must not be resurfaced** (machined) – unlike a solid flywheel. A damaged DMF = a new part.') },
          { level: 'caution', text: V('Přestavba na jednohmotový setrvačník (SMF) mění vibrace a hluk a může zatěžovat převodovku. Rozhodněte se informovaně.', 'Converting to a single-mass flywheel (SMF) changes vibration and noise and can stress the gearbox. Decide with full information.') }
        ]
      },
      {
        id: 'prep', anim: 'clutch.layout',
        title: V('Plán a díly', 'Plan and parts'),
        body: V(
          'Seženete kompletní sadu podle **VIN / kódu převodovky**: talíř, lamelu, vypínací ložisko nebo hydraulický vypínač (CSC), případně DMF a **nové šrouby**.\n\nPřečtěte si postup v dílenské příručce, připravte místo na odkládání dílů (krabice se štítky), zajistěte si pomocníka a počítejte s celým víkendem.',
          'Get a complete kit for your **VIN / gearbox code**: pressure plate, disc, release bearing or concentric slave cylinder (CSC), the DMF if needed, and **new bolts**.\n\nRead the procedure in the workshop manual, prepare space for removed parts (labelled boxes), get a helper and plan a whole weekend.'
        ),
        notes: [
          { level: 'tip', text: V('Vše foťte: vedení kabelů, polohu konektorů, délky šroubů. Šrouby dávejte do sáčků se štítkem.', 'Photograph everything: cable routing, connector positions, bolt lengths. Put bolts in labelled bags.') },
          { level: 'info', text: V('Zjistěte, zda je přítlačný talíř typu **SAC** (samostavitelný) – potřebujete pak speciální přípravek.', 'Find out whether the pressure plate is a **SAC** (self-adjusting) type – you will then need a special tool.') }
        ]
      },
      {
        id: 'lift', anim: 'lift.stands',
        title: V('Zvedněte vůz na 4 stojany', 'Lift the car onto 4 stands'),
        body: V(
          'Podle návodu **Bezpečné zvednutí vozu** dejte vůz na **4 stojany** – vysoko, aby se pod ním dalo pohodlně pracovat a vytáhnout převodovku na zvedáku. Sundejte přední kola.\n\nOdpojte **mínus pól baterie**.',
          'Following the **Safely lifting the car** tutorial, put the car on **4 stands** – high enough to work comfortably and roll the gearbox out on a jack. Remove the front wheels.\n\nDisconnect the **battery negative terminal**.'
        ),
        notes: [
          { level: 'danger', text: V('Test stability (zatřesení) proveďte před každým vlezením pod vůz, zvlášť po povolení těžkých dílů.', 'Do the stability (shake) test before every time you get under the car, especially after releasing heavy parts.') }
        ]
      },
      {
        id: 'ancillary', anim: 'clutch.ancillary',
        title: V('Demontujte příslušenství kolem převodovky', 'Remove the ancillaries around the gearbox'),
        body: V(
          'Typicky (pořadí dle příručky):\n- baterie a držák baterie, vzduchový filtr / sání,\n- lanka řazení a konektory (zpátečka, snímače),\n- **vedení spojky** – hadici zaškrtit, aby nevytekla kapalina,\n- startér, kostřicí kabely,\n- poloosy (vnitřní klouby od převodovky), kryty pod motorem,\n- případně část výfuku nebo pomocný rám.',
          'Typically (order per manual):\n- battery and battery tray, airbox / intake,\n- shift cables and connectors (reverse switch, sensors),\n- **clutch line** – clamp the hose so the fluid does not drain,\n- starter motor, earth straps,\n- driveshafts (inner joints from the gearbox), undertrays,\n- possibly part of the exhaust or the subframe.'
        ),
        notes: [
          { level: 'warning', text: V('Poloosy nenechávejte viset na vnějším kloubu – zavěste je drátem. Převěšený kloub poškodí manžetu.', 'Do not let driveshafts hang on the outer joint – tie them up with wire. An over-bent joint damages the boot.') },
          { level: 'caution', text: V('Brzdová/spojková kapalina ničí lak – kapky hned opláchněte vodou.', 'Brake/clutch fluid damages paint – rinse drips with water immediately.') }
        ]
      },
      {
        id: 'support', anim: 'clutch.support',
        title: V('Podepřete motor a převodovku', 'Support the engine and gearbox'),
        body: V(
          '1. Nasaďte **podpěru motoru** přes blatníky a zavěste motor za závěsné oko – lehce napněte.\n2. Pod převodovku dejte **zvedák převodovky** a převodovku k němu připoutejte.\n3. Teprve pak povolte **uložení převodovky** (a případně pomocný rám dle příručky).',
          '1. Fit the **engine support bar** across the wings and hook the engine by its lifting eye – take up the slack.\n2. Put the **transmission jack** under the gearbox and strap the gearbox to it.\n3. Only then release the **gearbox mount** (and the subframe if the manual says so).'
        ),
        notes: [
          { level: 'danger', text: V('Hever s malou miskou není zvedák převodovky – převodovka z něj snadno sklouzne. Použijte zvedák s plošinou a popruhem.', 'A jack with a small saddle is not a transmission jack – the gearbox slides off easily. Use a jack with a platform and a strap.') }
        ]
      },
      {
        id: 'gearboxOut', anim: 'clutch.gearboxOut',
        title: V('Vyjměte převodovku', 'Remove the gearbox'),
        body: V(
          'Povolte šrouby zvonu převodovky (poslední dva držte do chvíle, kdy je vše ostatní volné). Převodovku **odtahujte rovně v ose**, až se vstupní hřídel vysune z lamely, pak ji pomalu spusťte.\n\nPomocník hlídá kabely a hadice, aby se nic nezachytilo.',
          'Undo the bellhousing bolts (keep the last two in until everything else is free). Pull the gearbox **straight back along its axis** until the input shaft comes out of the disc, then lower it slowly.\n\nA helper watches cables and hoses so nothing snags.'
        ),
        specs: [{ label: V('Hmotnost převodovky', 'Gearbox weight'), value: V('cca 40–50 kg', 'approx. 40–50 kg'), verify: true }],
        notes: [
          { level: 'danger', text: V('Převodovka nesmí viset na vstupní hřídeli v lamele – ohnete hřídel a hrozí pád. Vždy na zvedáku.', 'The gearbox must not hang on its input shaft in the disc – it bends the shaft and can fall. Always on the jack.') },
          { level: 'warning', text: V('Po vyjmutí převodovky z ní vyteče trochu oleje (otvory po poloosách) – připravte vanu.', 'Some oil runs out of the gearbox once removed (driveshaft openings) – have a drain pan ready.') }
        ]
      },
      {
        id: 'inspect', anim: 'clutch.inspect',
        title: V('Demontujte spojku a zkontrolujte okolí', 'Remove the clutch and inspect the surroundings'),
        body: V(
          'Šrouby přítlačného talíře povolujte **postupně do kříže** (po 1–2 otáčkách), ať se talíř nezkroutí. Sundejte talíř a lamelu, pak DMF (zajistěte ho aretací proti protáčení).\n\nZkontrolujte:\n- **gufero klikové hřídele** – teče-li olej, vyměňte ho teď,\n- drážky vstupního hřídele a vodítko ložiska,\n- stav setrvačníku (viz DMF krok),\n- hydraulický vypínač (CSC) – stopy kapaliny.',
          'Loosen the pressure plate bolts **gradually in a star pattern** (1–2 turns at a time) so the plate does not distort. Remove the plate and disc, then the DMF (lock it against turning).\n\nInspect:\n- **rear crankshaft seal** – if it leaks oil, replace it now,\n- input shaft splines and the bearing guide,\n- flywheel condition (see the DMF step),\n- concentric slave cylinder (CSC) – traces of fluid.'
        ),
        notes: [
          { level: 'warning', text: V('Olej na nové lamele = prokluz a nová výměna. Netěsné gufero kliky vyměňte vždy, když je přístupné.', 'Oil on a new disc = slip and another replacement. Always replace a leaking crank seal while it is accessible.') }
        ]
      },
      {
        id: 'dmfFit', anim: 'clutch.dmfBolts',
        title: V('Namontujte setrvačník s novými šrouby', 'Fit the flywheel with new bolts'),
        body: V(
          'Očistěte dosedací plochu na klice. Nasaďte (nový) setrvačník, zašroubujte **nové šrouby** rukou a dotáhněte je **do kříže** předepsaným momentem a pak **úhlem** (úhloměr). Setrvačník přitom držte aretací.',
          'Clean the crankshaft flange. Fit the (new) flywheel, thread in **new bolts** by hand and tighten them **in a star pattern** to the specified torque and then **angle** (angle gauge). Hold the flywheel with the locking tool.'
        ),
        specs: [{ label: V('Šrouby setrvačníku', 'Flywheel bolts'), value: V('moment + úhel dle příručky', 'torque + angle per manual') }],
        notes: [
          { level: 'warning', text: V('Pružné šrouby nikdy nepoužívejte znovu – mohou se utrhnout a setrvačník se uvolní při vysokých otáčkách.', 'Never reuse stretch bolts – they can snap and the flywheel comes loose at high revs.') },
          { level: 'caution', text: V('Třecí plochu setrvačníku odmastěte čističem brzd (nový DMF bývá nakonzervovaný).', 'Degrease the flywheel friction face with brake cleaner (a new DMF is usually coated with protective oil).') }
        ]
      },
      {
        id: 'disc', anim: 'clutch.align',
        title: V('Nasaďte lamelu a vystřeďte ji trnem', 'Fit the disc and centre it with the tool'),
        body: V(
          'Lamelu přiložte **správnou stranou** – nápis „Getriebeseite / Gearbox side“ (nebo podle návodu) směřuje k převodovce. Středicím trnem ji vystřeďte do ložiska/otvoru v klice.\n\nDrážky náboje lamely lehce namažte dodaným mazivem a přebytek setřete.',
          'Fit the disc **the right way round** – the "Getriebeseite / Gearbox side" marking (or per instructions) faces the gearbox. Centre it with the alignment tool into the pilot in the crankshaft.\n\nApply a thin film of the supplied grease to the disc hub splines and wipe off the excess.'
        ),
        notes: [
          { level: 'warning', text: V('Obráceně nasazená lamela = spojka nevypíná nebo se zničí. Kontrolujte dvakrát.', 'A disc fitted the wrong way round = the clutch will not release or will be destroyed. Check twice.') },
          { level: 'caution', text: V('Příliš mnoho maziva na drážkách se odstředí na obložení a způsobí prokluz.', 'Too much spline grease is flung onto the lining and causes slip.') }
        ]
      },
      {
        id: 'plate', anim: 'clutch.plateBolts',
        title: V('Přišroubujte přítlačný talíř', 'Bolt on the pressure plate'),
        body: V(
          'Talíř nasaďte na kolíky setrvačníku. Šrouby dotahujte **postupně do kříže** po 1–2 otáčkách, aby se talíř stáhl rovnoměrně. Pak dotáhněte předepsaným momentem a vyndejte středicí trn – musí jít ven volně.',
          'Fit the plate onto the flywheel dowels. Tighten the bolts **gradually in a star pattern**, 1–2 turns at a time, so the plate pulls down evenly. Then tighten to the specified torque and remove the alignment tool – it must slide out freely.'
        ),
        specs: [{ label: V('Šrouby talíře', 'Pressure plate bolts'), value: V('dle příručky', 'per manual') }],
        notes: [
          { level: 'warning', text: V('**SAC talíř** (samostavitelný) se musí montovat podle návodu výrobce, často se speciálním přípravkem. Bez něj se nastavovací mechanismus přestaví a spojka nebude fungovat.', 'A **SAC plate** (self-adjusting) must be fitted per the maker\'s instructions, often with a special tool. Without it the adjuster mechanism shifts and the clutch will not work.') },
          { level: 'tip', text: V('Středicí trn musí po dotažení jít ven lehce. Pokud drhne, lamela není vystředěná – povolte a opakujte.', 'The alignment tool must slide out easily after tightening. If it binds, the disc is not centred – loosen and repeat.') }
        ]
      },
      {
        id: 'gearboxIn', anim: 'clutch.gearboxIn',
        title: V('Nasaďte převodovku zpět', 'Refit the gearbox'),
        body: V(
          'Vyměňte vypínací ložisko / hydraulický vypínač (CSC). Převodovku na zvedáku zvedněte do osy motoru a **zasuňte rovně** – hřídel do drážek lamely (pomůže pootočení hřídele přes zařazenou rychlost). Zvon musí dosednout na kolíky **bez šroubů**.\n\nPak zašroubujte šrouby zvonu, uložení, startér, poloosy a vše ostatní v opačném pořadí, s předepsanými momenty.',
          'Replace the release bearing / concentric slave cylinder (CSC). Raise the gearbox on the jack to the engine axis and **slide it in straight** – the shaft into the disc splines (turning the shaft via a selected gear helps). The bellhousing must seat on the dowels **without the bolts**.\n\nThen fit the bellhousing bolts, mount, starter, driveshafts and everything else in reverse order, at the specified torques.'
        ),
        notes: [
          { level: 'danger', text: V('Nikdy nepřitahujte převodovku k motoru šrouby zvonu – praskne zvon nebo se zničí lamela. Když nedosedá, něco není vystředěné.', 'Never pull the gearbox to the engine with the bellhousing bolts – the bellhousing cracks or the disc is ruined. If it will not seat, something is not aligned.') },
          { level: 'warning', text: V('Uložení motoru a převodovky dotahujte až ve finální poloze a předepsaným momentem; často jsou to šrouby na jedno použití.', 'Tighten engine and gearbox mounts only in their final position and to the specified torque; they are often single-use bolts.') }
        ]
      },
      {
        id: 'bleed', anim: 'clutch.bleed',
        title: V('Odvzdušněte hydrauliku spojky', 'Bleed the clutch hydraulics'),
        body: V(
          'Povolte zaškrcení hadice. Doplňte kapalinu, pomocník sešlápne pedál a drží, vy povolíte odvzdušňovací šroub, pak zavřete a pedál se uvolní. Opakujte, dokud nevychází kapalina **bez bublin**. Zkontrolujte převodový olej a doplňte ho.',
          'Remove the hose clamp. Top up the fluid; a helper presses and holds the pedal, you open the bleed nipple, then close it and the pedal is released. Repeat until the fluid comes out **without bubbles**. Check and top up the gear oil.'
        ),
        notes: [
          { level: 'warning', text: V('Hladina v nádržce nesmí klesnout pod MIN – nasajete vzduch a začnete znovu. Pokud je nádržka společná s brzdami, nasátý vzduch může zasáhnout i brzdy!', 'The reservoir level must not drop below MIN – you will draw in air and start again. If the reservoir is shared with the brakes, air can reach the brakes too!') },
          { level: 'info', text: V('U některých vozů je nutné odvzdušnění tlakovým přístrojem nebo diagnostikou – viz příručka.', 'Some cars need pressure bleeding or a scan-tool procedure – see the manual.') }
        ]
      },
      {
        id: 'test', anim: 'clutch.test',
        title: V('Zkouška a záběh', 'Test and bedding in'),
        body: V(
          '1. Na místě se stojícím vozem a běžícím motorem: sešlápněte spojku a zkuste zařadit všechny rychlosti a zpátečku – bez drhnutí.\n2. Zkontrolujte bod záběru – zhruba v polovině zdvihu.\n3. Spusťte vůz, dotáhněte kola momentem, krátká zkušební jízda.\n4. Prvních ~500 km jezděte šetrně: bez prudkých rozjezdů a dlouhého prokluzování.',
          '1. Stationary with the engine running: press the clutch and select all gears and reverse – no grinding.\n2. Check the bite point – roughly mid-travel.\n3. Lower the car, torque the wheels, short test drive.\n4. For the first ~500 km drive gently: no hard launches and no long slipping.'
        ),
        notes: [
          { level: 'warning', text: V('Pokud vůz po nastartování „jede“ i se sešlápnutou spojkou, ihned vypněte – spojka nevypíná (vzduch, lamela, talíř).', 'If the car creeps with the clutch pressed after starting, switch off immediately – the clutch is not releasing (air, disc, plate).') }
        ]
      }
    ],
    vehicles: {
      'skoda-octavia-rs-tdi': {
        status: 'pro',
        time: V('8–12 h', '8–12 h'),
        specs: [
          { label: V('Převodovka', 'Gearbox'), value: V('6st. manuál 02Q, příčně uložená', '6-speed manual 02Q, transverse') },
          { label: V('Setrvačník', 'Flywheel'), value: V('Dvouhmotový (DMF)', 'Dual-mass (DMF)') },
          { label: V('Ovládání spojky', 'Clutch release'), value: V('Hydraulický vypínač CSC (uvnitř zvonu)', 'Concentric slave cylinder CSC (inside the bellhousing)'), verify: true },
          { label: V('Kapalina spojky', 'Clutch fluid'), value: V('DOT 4 – společná nádržka s brzdami', 'DOT 4 – shared reservoir with the brakes') },
          { label: V('Šrouby DMF', 'DMF bolts'), value: V('nové, 60 Nm + 90°', 'new, 60 Nm + 90°'), verify: true },
          { label: V('Šrouby přítlačného talíře', 'Pressure plate bolts'), value: '20 Nm', verify: true },
          { label: V('Šrouby zvonu M12', 'Bellhousing bolts M12'), value: '80 Nm', verify: true },
          { label: V('Hmotnost převodovky', 'Gearbox weight'), value: V('cca 45 kg', 'approx. 45 kg'), verify: true }
        ],
        notes: [
          { level: 'warning', text: V('Při rozpojení vedení spojky klesá kapalina v **brzdové** nádržce. Hadici zaškrťte a po práci odvzdušněte; zkontrolujte, že brzdový pedál je tvrdý.', 'When the clutch line is opened, the fluid in the **brake** reservoir drops. Clamp the hose and bleed afterwards; check the brake pedal is firm.') },
          { level: 'info', text: V('CSC (hydraulický vypínač) doporučujeme měnit vždy se spojkou – je uvnitř zvonu a jeho únik by znamenal novou demontáž převodovky.', 'We recommend always replacing the CSC with the clutch – it sits inside the bellhousing and a leak would mean removing the gearbox again.') },
          { level: 'info', text: V('Zjistěte, zda vaše sada obsahuje SAC talíř (LuK/Sachs) – pak je nutný přípravek pro SAC.', 'Check whether your kit has a SAC pressure plate (LuK/Sachs) – the SAC tool is then required.'), verify: true }
        ],
        tools: [
          V('Hlavice XZN (vícezub) M10/M12 pro poloosy a setrvačník', 'XZN (triple square) M10/M12 bits for driveshafts and flywheel'),
          V('Podpěra motoru (VAG typ 10-222 nebo kompatibilní)', 'Engine support (VAG type 10-222 or compatible)')
        ],
        parts: [
          V('Spojková sada pro 02Q / CEGA (dle VIN)', 'Clutch kit for 02Q / CEGA (by VIN)'),
          V('DMF (LuK / Sachs dle VIN)', 'DMF (LuK / Sachs by VIN)'),
          V('Nové šrouby DMF a talíře', 'New DMF and pressure plate bolts'),
          V('Hydraulický vypínač CSC', 'Concentric slave cylinder (CSC)'),
          V('Brzdová kapalina DOT 4', 'Brake fluid DOT 4'),
          V('Převodový olej G 052 171 (cca 2,3 l)', 'Gear oil G 052 171 (approx. 2.3 L)'),
          V('Šrouby poloos / uložení dle ELSA (jednorázové)', 'Driveshaft / mount bolts per ELSA (single-use)')
        ],
        steps: {
          ancillary: { body: V('U Octavie II s 2.0 TDI se typicky demontuje: baterie a držák baterie (pod ním řídicí jednotka), vzduchový filtr, lanka řazení na převodovce, startér, poloosy od příruby převodovky a uložení převodovky vlevo. Postup demontáže pomocného rámu / kyvné vzpěry ověřte v ELSA.', 'On an Octavia II 2.0 TDI you typically remove: battery and battery tray (with the ECU underneath), airbox, shift cables on the gearbox, starter, driveshafts from the gearbox flanges and the left gearbox mount. Verify in ELSA whether the subframe / pendulum mount must be lowered.'), notes: [{ level: 'info', text: V('Přesný rozsah demontáže (pomocný rám, výfuk) ověřte v ELSA pro váš VIN.', 'Verify the exact removal scope (subframe, exhaust) in ELSA for your VIN.'), verify: true }] },
          dmfFit: { specs: [{ label: V('Šrouby DMF', 'DMF bolts'), value: V('nové, 60 Nm + 90°', 'new, 60 Nm + 90°'), verify: true }] },
          plate: { specs: [{ label: V('Šrouby talíře', 'Pressure plate bolts'), value: '20 Nm', verify: true }] },
          gearboxIn: { specs: [{ label: V('Šrouby zvonu M12', 'Bellhousing bolts M12'), value: '80 Nm', verify: true }] },
          bleed: { body: V('Odvzdušňovací šroub je na převodovce (vedení k CSC). Kapalina se bere ze společné brzdové nádržky. Po odvzdušnění spojky zkontrolujte i brzdový pedál.', 'The bleed nipple is on the gearbox (line to the CSC). Fluid comes from the shared brake reservoir. After bleeding the clutch, check the brake pedal too.'), verify: true }
        },
        extraSteps: [
          {
            after: 'plate',
            step: {
              id: 'oct-sac', anim: 'clutch.sac',
              title: V('Samostavitelný talíř (SAC) – pokud ho máte', 'Self-adjusting plate (SAC) – if fitted'),
              body: V(
                'Pokud je v sadě **SAC talíř**, postupujte přesně podle návodu výrobce (LuK / Sachs). Typicky se talíř montuje s **přípravkem**, který stlačí pera a drží nastavovací kroužek. Nový SAC talíř může být z výroby předem zajištěný – pojistku odstraňte až dle návodu.\n\nPokud je talíř bez SAC, tento krok přeskočte.',
                'If the kit contains a **SAC plate**, follow the maker\'s instructions (LuK / Sachs) exactly. Typically the plate is fitted with a **tool** that compresses the fingers and holds the adjuster ring. A new SAC plate may be pre-locked at the factory – remove the lock only as instructed.\n\nIf the plate is not SAC, skip this step.'
              ),
              notes: [
                { level: 'warning', text: V('Použitý SAC talíř nelze bez přípravku vrátit do výchozí polohy – při znovupoužití se spojka může „zaseknout“ v rozepnutém stavu.', 'A used SAC plate cannot be reset without the tool – when reused the clutch may stay partly disengaged.'), verify: true }
              ]
            }
          }
        ]
      },
      'citroen-jumper-22hdi': {
        status: 'pro',
        title: V('Výměna spojky a setrvačníku', 'Clutch kit & flywheel replacement'),
        time: V('8–14 h', '8–14 h'),
        specs: [
          { label: V('Převodovka', 'Gearbox'), value: V('6st. manuál, příčně uložená, přední náhon', '6-speed manual, transverse, front-wheel drive') },
          { label: V('Setrvačník', 'Flywheel'), value: V('dvouhmotový (DMF) nebo jednohmotový – ověřte podle VIN / dílu', 'dual-mass (DMF) or single-mass – verify by VIN / part'), verify: true },
          { label: V('Ovládání spojky', 'Clutch release'), value: V('hydraulické (pracovní válec / CSC – ověřte)', 'hydraulic (slave cylinder / CSC – verify)'), verify: true },
          { label: V('Kapalina spojky', 'Clutch fluid'), value: V('DOT 4 – obvykle společná nádržka s brzdami', 'DOT 4 – usually shared reservoir with the brakes'), verify: true },
          { label: V('Hmotnost převodovky', 'Gearbox weight'), value: V('cca 50–60 kg (víc než u osobního auta)', 'approx. 50–60 kg (more than a car)'), verify: true },
          { label: V('Utahovací momenty', 'Torques'), value: V('dle dílenské dokumentace PSA / Fiat – nehádat', 'per PSA / Fiat workshop documentation – do not guess'), verify: true }
        ],
        notes: [
          { level: 'danger', text: V('**Těžká převodovka a těžké vozidlo:** zvedák převodovky s nosností pro ~60 kg a zajišťovacím řetězem je povinný. Dodávku zvedejte jen na stojany s nosností min. 3 t každý a vyložte náklad.', '**Heavy gearbox, heavy vehicle:** a transmission jack rated for ~60 kg with a safety chain is mandatory. Lift the van only onto stands rated at least 3 t each and unload the cargo.') },
          { level: 'warning', text: V('Spojka u dodávky trpí rozjezdy s nákladem a do kopce – opotřebení bývá rychlejší než u osobního auta. Měňte celou sadu (lamela, přítlačný talíř, ložisko / CSC) a zkontrolujte setrvačník.', 'A van clutch suffers from loaded and uphill starts – it often wears faster than in a car. Replace the full kit (disc, pressure plate, bearing / CSC) and check the flywheel.') },
          { level: 'info', text: V('Jumper X250 je technicky shodný s Fiat Ducato / Peugeot Boxer – dílenská dokumentace a díly se často sdílejí. Díly vybírejte podle VIN.', 'The Jumper X250 is technically identical to the Fiat Ducato / Peugeot Boxer – workshop documentation and parts are often shared. Choose parts by VIN.') }
        ],
        tools: [
          V('Zvedák převodovky s nosností ≥ 60 kg + řetěz', 'Transmission jack rated ≥ 60 kg + chain'),
          V('Podpěra motoru přes blatníky (pro dodávku dostatečně dlouhá)', 'Engine support bar across the wings (long enough for a van)'),
          V('Stojany s nosností min. 3 t každý', 'Axle stands rated at least 3 t each')
        ],
        parts: [
          V('Spojková sada dle VIN (lamela, talíř, ložisko / CSC)', 'Clutch kit by VIN (disc, plate, bearing / CSC)'),
          V('Setrvačník (DMF / SMF) dle VIN – pokud je opotřebený', 'Flywheel (DMF / SMF) by VIN – if worn'),
          V('Nové šrouby setrvačníku a talíře', 'New flywheel and pressure plate bolts'),
          V('Brzdová kapalina DOT 4', 'Brake fluid DOT 4'),
          V('Převodový olej dle specifikace (ověřit)', 'Gear oil to spec (verify)')
        ],
        steps: {
          lift: { notes: [{ level: 'danger', text: V('Dodávka váží až 4 t: hever a stojany min. 3 t, rovný beton, náklad vyložit. Viz návod Bezpečné zvednutí vozu.', 'The van weighs up to 4 t: jack and stands at least 3 t, level concrete, cargo unloaded. See the Safely lifting the car tutorial.') }] },
          ancillary: { body: V('U Jumperu X250 se typicky demontuje: baterie, vzduchové potrubí, lanka řazení, startér, poloosy z převodovky a uložení převodovky; podle verze i část pomocného rámu / výfuku. Rozsah ověřte v dílenské dokumentaci pro váš VIN.', 'On a Jumper X250 you typically remove: battery, air ducting, shift cables, starter, driveshafts from the gearbox and the gearbox mount; depending on version also part of the subframe / exhaust. Verify the scope in the workshop documentation for your VIN.'), notes: [{ level: 'info', text: V('Přesný rozsah demontáže se liší podle verze – ověřte.', 'The exact removal scope differs by version – verify.'), verify: true }] },
          gearboxOut: { notes: [{ level: 'danger', text: V('Převodovka je těžší než u osobního auta – nikdy ji nedržte rukama ani nohama pod ní. Jen na zvedáku s řetězem.', 'The gearbox is heavier than in a car – never hold it by hand or with your feet under it. Only on a jack with a chain.') }] },
          dmf: { notes: [{ level: 'info', text: V('Pokud má váš Jumper jednohmotový setrvačník, kontrolu vůle DMF přeskočte a zkontrolujte jen třecí plochu (rýhy, modré skvrny, praskliny).', 'If your Jumper has a single-mass flywheel, skip the DMF play check and only inspect the friction face (scoring, blue spots, cracks).'), verify: true }] },
          bleed: { body: V('Po montáži odvzdušněte hydrauliku spojky podle dílenské dokumentace (umístění odvzdušňovacího šroubu ověřte). Pokud je nádržka společná s brzdami, zkontrolujte i brzdový pedál.', 'After fitting, bleed the clutch hydraulics per the workshop documentation (verify the bleed nipple location). If the reservoir is shared with the brakes, check the brake pedal too.'), verify: true }
        }
      },
      'toyota-gr-yaris': {
        status: 'pro',
        time: V('12–20 h (AWD – výrazně složitější)', '12–20 h (AWD – much more complex)'),
        specs: [
          { label: V('Převodovka', 'Gearbox'), value: V('6st. manuál (iMT) + rozdělovací převodovka GR-FOUR', '6-speed manual (iMT) + GR-FOUR transfer case') },
          { label: V('Setrvačník', 'Flywheel'), value: V('dle TIS – ověřte typ (DMF/SMF)', 'per TIS – verify type (DMF/SMF)'), verify: true },
          { label: V('Momenty', 'Torques'), value: V('dle TIS – nehádat', 'per TIS – do not guess'), verify: true }
        ],
        notes: [
          { level: 'warning', text: V('Pohon všech kol: kromě poloos je nutné demontovat **kloubový hřídel**, rozdělovací převodovku nebo její části a tepelné kryty výfuku. Postup je výrazně složitější než u předokolky – držte se přesně TIS.', 'All-wheel drive: besides the driveshafts you must remove the **propshaft**, the transfer case or parts of it and exhaust heat shields. The procedure is much more complex than a FWD car – follow TIS exactly.'), verify: true },
          { level: 'info', text: V('Okruhové ježdění zkracuje životnost spojky. Sportovní spojky (sintrované / keramické) mají ostřejší záběr a víc hluku – pro silnici je vhodnější organické obložení.', 'Track driving shortens clutch life. Sport clutches (sintered / ceramic) have a sharper bite and more noise – organic linings suit road use better.') },
          { level: 'info', text: V('Po výměně spojky může být nutné kalibrovat snímač pedálu spojky / funkci iMT diagnostikou (Techstream).', 'After a clutch change the clutch pedal sensor / iMT function may need calibration with a scan tool (Techstream).'), verify: true }
        ],
        tools: [V('Diagnostika s podporou Toyota (Techstream / kompatibilní)', 'Scan tool with Toyota support (Techstream / compatible)'), V('Nízkoprofilový zvedák převodovky', 'Low-profile transmission jack')],
        steps: {
          ancillary: { body: V('Navíc oproti obecnému postupu: kloubový hřídel k zadní nápravě (označte polohu přírub), rozdělovací převodovka / převod k ní, tepelné kryty a část výfuku. Pořadí ověřte v TIS.', 'In addition to the generic procedure: the propshaft to the rear axle (mark the flange positions), the transfer case / its drive, heat shields and part of the exhaust. Verify the order in TIS.'), notes: [{ level: 'caution', text: V('Kloubový hřídel musí jít zpět ve stejné poloze vůči přírubám – jinak vibrace.', 'The propshaft must go back in the same position relative to the flanges – otherwise vibration.') }] }
        }
      },
      'mb-cl500-c216': {
        status: 'ok',
        title: V('Automat: spojka s pedálem není – co zkontrolovat místo ní', 'Automatic: no clutch to replace – what to check instead'),
        summary: V('7G-Tronic nemá spojkový pedál. Příznaky problémů, diagnostika, ATF a adaptace.', 'The 7G-Tronic has no clutch pedal. Symptoms, diagnostics, ATF and adaptation.'),
        intro: V(AUTO_INTRO_CS, AUTO_INTRO_EN),
        time: V('30–60 min (diagnostika)', '30–60 min (diagnosis)'),
        replaceTools: true,
        replaceSafety: true,
        safety: [
          { level: 'warning', text: V('Diagnostiku a kontrolu ATF provádějte na rovině, se zataženou parkovací brzdou a v poloze **P**. Při práci s běžícím motorem nikdy nestůjte před ani za vozem.', 'Do diagnosis and ATF checks on level ground, parking brake on and in **P**. With the engine running never stand in front of or behind the car.') },
          { level: 'warning', text: V('ATF a převodovka mohou mít přes 80 °C – rukavice, brýle.', 'ATF and the transmission can be above 80 °C – gloves, glasses.') },
          { level: 'caution', text: V('Adaptace a resety převodovky dělejte jen diagnostikou určenou pro vůz – špatný reset zhorší řazení.', 'Only do transmission adaptations and resets with a scan tool made for the car – a wrong reset makes shifting worse.') }
        ],
        replaceFinalChecks: true,
        tools: AUTO_TOOLS,
        parts: [V('Nic – jen diagnostika a kontrola', 'Nothing – diagnostics and checks only')],
        finalChecks: AUTO_FINAL,
        specs: [
          { label: V('Převodovka', 'Transmission'), value: V('7G-Tronic (722.9), 7st. automat s měničem', '7G-Tronic (722.9), 7-speed automatic with torque converter') },
          { label: V('Diagnostika', 'Diagnostics'), value: 'XENTRY / DAS' }
        ],
        notes: [
          { level: 'info', text: V('Tento vůz nemá spojku ovládanou pedálem. Kroky výměny spojky se pro něj nezobrazují.', 'This car has no pedal-operated clutch. The clutch replacement steps are not shown for it.') },
          { level: 'warning', text: V('Při zvedání respektujte ABC podvozek – viz návod na zvedání.', 'Respect the ABC suspension when lifting – see the lifting tutorial.') }
        ],
        steps: skipAll(),
        extraSteps: autoSteps('mb')
      },
      'volvo-xc60-b4': {
        status: 'ok',
        title: V('Automat: spojka s pedálem není – co zkontrolovat místo ní', 'Automatic: no clutch to replace – what to check instead'),
        summary: V('8st. automat Aisin nemá spojkový pedál. Příznaky, diagnostika, ATF a adaptace.', 'The 8-speed Aisin automatic has no clutch pedal. Symptoms, diagnostics, ATF and adaptation.'),
        intro: V(AUTO_INTRO_CS, AUTO_INTRO_EN),
        time: V('30–60 min (diagnostika)', '30–60 min (diagnosis)'),
        replaceTools: true,
        replaceSafety: true,
        safety: [
          { level: 'warning', text: V('Diagnostiku a kontrolu ATF provádějte na rovině, se zataženou parkovací brzdou a v poloze **P**. Při práci s běžícím motorem nikdy nestůjte před ani za vozem.', 'Do diagnosis and ATF checks on level ground, parking brake on and in **P**. With the engine running never stand in front of or behind the car.') },
          { level: 'warning', text: V('ATF a převodovka mohou mít přes 80 °C – rukavice, brýle.', 'ATF and the transmission can be above 80 °C – gloves, glasses.') },
          { level: 'caution', text: V('Adaptace a resety převodovky dělejte jen diagnostikou určenou pro vůz – špatný reset zhorší řazení.', 'Only do transmission adaptations and resets with a scan tool made for the car – a wrong reset makes shifting worse.') }
        ],
        replaceFinalChecks: true,
        tools: AUTO_TOOLS,
        parts: [V('Nic – jen diagnostika a kontrola', 'Nothing – diagnostics and checks only')],
        finalChecks: AUTO_FINAL,
        specs: [
          { label: V('Převodovka', 'Transmission'), value: V('8st. automat Aisin AWF8G45 s měničem', '8-speed Aisin AWF8G45 automatic with torque converter'), verify: true },
          { label: V('Diagnostika', 'Diagnostics'), value: 'VIDA' }
        ],
        notes: [
          { level: 'info', text: V('Tento vůz nemá spojku ovládanou pedálem. Kroky výměny spojky se pro něj nezobrazují.', 'This car has no pedal-operated clutch. The clutch replacement steps are not shown for it.') },
          { level: 'warning', text: V('Vzduchový podvozek: před zvedáním zapněte režim pro zvedání / vypněte regulaci výšky – viz návod na zvedání.', 'Air suspension: activate jacking mode / disable level control before lifting – see the lifting tutorial.') }
        ],
        steps: skipAll(),
        extraSteps: autoSteps('volvo')
      }
    }
  });
})(window.STU);
