/* Tutorial: Shock absorber / MacPherson strut & coil spring replacement. */
(function (S) {
  'use strict';
  var V = function (cs, en) { return { cs: cs, en: en }; };
  var GENERIC_STEPS = ['parts', 'lift', 'disconnect', 'lowerBolts', 'topNuts', 'compress', 'topMount', 'assemble', 'release', 'refit', 'align'];
  function skipAll() { var o = {}; GENERIC_STEPS.forEach(function (id) { o[id] = { skip: true }; }); return o; }

  S.registerTutorial({
    id: 'struts-springs',
    level: 2,
    thumb: 'struts-springs.compress',
    time: V('3–5 hod. na nápravu', '3–5 h per axle'),
    title: V('Výměna tlumičů a pružin (vzpěra McPherson)', 'Replacing shock absorbers and springs (MacPherson strut)'),
    summary: V('Tlumiče v páru, stahovák pružin, horní uložení, dotažení v jízdní výšce, geometrie.', 'Dampers in pairs, spring compressor, top mount, tightening at ride height, alignment.'),
    intro: V(
      'Opotřebené tlumiče prodlužují brzdnou dráhu a zhoršují ovladatelnost. Výměna je dobře zvládnutelná, ale **stažená pružina je jedna z nejnebezpečnějších věcí v dílně** – uchovává obrovskou energii. S nekvalitním nebo špatně nasazeným stahovákem může pružina vystřelit a zabít.\n\nNávod popisuje **přední vzpěru McPherson** s vinutou pružinou. Zvolte svůj vůz – u CL 500 (ABC) a XC60 (vzduchový podvozek) je postup úplně jiný.',
      'Worn dampers lengthen braking distance and ruin handling. The job is manageable, but **a compressed spring is one of the most dangerous things in a garage** – it stores enormous energy. With a cheap or badly fitted compressor the spring can fly out and kill.\n\nThe tutorial covers a **front MacPherson strut** with a coil spring. Select your car – the CL 500 (ABC) and XC60 (air suspension) need a completely different procedure.'
    ),
    safety: [
      { level: 'danger', text: V('**Stahovák pružin:** jen kvalitní, certifikovaný stahovák dimenzovaný na vaši pružinu. Háky vždy proti sobě, na co nejvíce závitů, zajišťovací pojistky zavřené. Stahovat střídavě a ručně – **nikdy rázovým utahovákem**. Nikdy nestůjte v ose pružiny.', '**Spring compressor:** only a quality, certified compressor rated for your spring. Hooks always opposite each other, on as many coils as possible, safety latches closed. Compress alternately by hand – **never with an impact gun**. Never stand in line with the spring.') },
      { level: 'danger', text: V('**Prostřední matici pístnice nikdy nepovolujte, dokud pružina není stažená** – horní miska a uložení by vystřelily.', '**Never undo the centre rod nut until the spring is compressed** – the top seat and mount would shoot off.') },
      { level: 'danger', text: V('Vůz zvedejte jen podle návodu **„Bezpečné zvednutí vozu“** – stojany pod karoserii, ne pod rameno, které budete demontovat.', 'Lift the car only per **"Safely lifting the car"** – stands under the body, not under the arm you will remove.') },
      { level: 'warning', text: V('Tlumiče a pružiny se mění **vždy v páru na nápravě** (levá + pravá), stejný typ a výrobce. Jinak bude vůz při brzdění a v zatáčkách nevyvážený.', 'Dampers and springs are always replaced **in pairs per axle** (left + right), same type and brand. Otherwise the car is unbalanced when braking and cornering.') },
      { level: 'warning', text: V('Plynový tlumič je pod tlakem – nevrtat, neohřívat, nevyhazovat do ohně. Starý tlumič odevzdejte jako kovový odpad / zpětný odběr.', 'A gas damper is pressurised – do not drill, heat or burn it. Hand old dampers in for metal recycling / take-back.') },
      { level: 'caution', text: V('Šrouby spojující vzpěru s těhlicí často nastavují odklon kola a bývají na jedno použití. Před povolením označte polohu, použijte nové šrouby. **Po výměně vždy geometrie.**', 'The strut-to-knuckle bolts often set camber and are frequently single-use. Mark the position before undoing, use new bolts. **Always do an alignment afterwards.**') },
      { level: 'info', text: V('Pryžová uložení (silentbloky, uložení stabilizátoru) se dotahují **v jízdní výšce** – jinak se pryž zkroutí a brzy praskne.', 'Rubber bushings (arm, anti-roll bar) are tightened **at ride height** – otherwise the rubber twists and soon cracks.') }
    ],
    tools: [
      V('Vše z návodu „Bezpečné zvednutí vozu“', 'Everything from "Safely lifting the car"'),
      V('Certifikovaný stahovák pružin (2 svěrky) nebo stolní stahovák', 'Certified spring compressor (2 clamps) or a bench compressor'),
      V('Sada klíčů na tlumiče (nástavec s průchodem na pístnici + imbus/Torx kontra)', 'Strut nut socket set (pass-through socket + hex/Torx counter-hold)'),
      V('Ráčna, prodloužená páka, momentový klíč (20–250 Nm)', 'Ratchet, breaker bar, torque wrench (20–250 Nm)'),
      V('Rozpěrák těhlice / klín (pro sevřené uchycení vzpěry)', 'Knuckle spreader / wedge (for pinch-type strut mounts)'),
      V('Zvedák pod rameno (pro dotažení v jízdní výšce)', 'Jack under the arm (for tightening at ride height)'),
      V('Fix / barva na označení polohy', 'Marker / paint to mark positions'),
      V('Odrezovač, drátěný kartáč', 'Penetrating oil, wire brush'),
      V('Ochranné brýle, rukavice', 'Safety glasses, gloves')
    ],
    parts: [
      V('2× tlumič (vzpěra) na nápravu', '2× damper (strut) per axle'),
      V('Pružiny (pokud jsou prasklé, sedlé nebo vůz ujel >150 000 km) – v páru', 'Springs (if broken, sagged or the car did >150,000 km) – in pairs'),
      V('Horní uložení s ložiskem, dorazy, prachovky (doporučeno)', 'Top mounts with bearings, bump stops, dust boots (recommended)'),
      V('Nové šrouby vzpěra–těhlice a samojistné matice', 'New strut-to-knuckle bolts and self-locking nuts'),
      V('Spojovací tyče stabilizátoru (často se mění zároveň)', 'Anti-roll bar drop links (often replaced at the same time)')
    ],
    finalChecks: [
      V('Všechny šrouby dotaženy předepsaným momentem (silentbloky v jízdní výšce)', 'All bolts torqued to spec (bushings at ride height)'),
      V('Brzdová hadice a kabel ABS uchycené, nikde nedrhnou', 'Brake hose and ABS wire clipped in, not rubbing anywhere'),
      V('Seřízená geometrie (protokol z dílny)', 'Wheel alignment done (printout from the workshop)'),
      V('Zkušební jízda: žádné klepání, vůz netáhne', 'Test drive: no knocking, no pulling'),
      V('Po 100 km znovu zkontrolovat momenty kol', 'Re-check wheel torque after 100 km')
    ],
    steps: [
      {
        id: 'symptoms', anim: 'struts-springs.symptoms',
        title: V('Poznejte vadný tlumič', 'Recognise a worn damper'),
        body: V(
          '- Vůz se po nerovnosti **houpe** víc než 1–2×, „plave“ na dálnici\n- Při brzdění se příď výrazně noří, v zatáčce se vůz naklání\n- **Olej na tělese tlumiče**\n- Klepání přes nerovnosti, nerovnoměrně „zubatě“ ojetá pneumatika\n\nTest: silně zatlačte na roh vozu a pusťte – zdravý tlumič zastaví pohyb do 1–2 kmitů.',
          '- The car **bounces** more than 1–2 times after a bump, floats on the motorway\n- The nose dives hard under braking, the car leans in bends\n- **Oil on the damper body**\n- Knocking over bumps, cupped / scalloped tyre wear\n\nTest: push down hard on a corner and let go – a healthy damper stops the movement within 1–2 oscillations.'
        ),
        notes: [{ level: 'info', text: V('Klepání častěji způsobuje spojovací tyč stabilizátoru než tlumič – viz návod „Opotřebení podvozku“.', 'Knocking is more often caused by an anti-roll bar drop link than by the damper – see the "Suspension wear" tutorial.') }]
      },
      {
        id: 'parts', anim: 'struts-springs.parts',
        title: V('Připravte díly – vždy v páru', 'Get the parts – always in pairs'),
        body: V('Objednejte tlumiče podle VIN (sportovní / standardní podvozek se liší). Zvažte kompletní „hotové vzpěry“ s pružinou a uložením – odpadá práce se stahovákem.', 'Order dampers by VIN (sport / standard suspension differ). Consider complete pre-assembled struts with spring and mount – no compressor work needed.'),
        notes: [{ level: 'tip', text: V('Hotová vzpěra (quick-strut) je pro začátečníka nejbezpečnější varianta.', 'A complete pre-assembled strut is the safest option for a beginner.') }]
      },
      {
        id: 'lift', anim: 'struts-springs.lift',
        title: V('Zvedněte vůz a sundejte kolo', 'Lift the car and remove the wheel'),
        body: V('Povolte šrouby kola na zemi, zvedněte vůz podle návodu **„Bezpečné zvednutí vozu“**, stojany pod karoserii a sundejte kolo.', 'Loosen the wheel bolts on the ground, lift the car per **"Safely lifting the car"**, stands under the body, remove the wheel.'),
        notes: [{ level: 'danger', text: V('Stojany nesmí stát pod ramenem ani těhlicí, se kterou budete hýbat.', 'The stands must not be under an arm or knuckle you will move.') }]
      },
      {
        id: 'disconnect', anim: 'struts-springs.disconnect',
        title: V('Odpojte hadici, ABS a spojovací tyč', 'Disconnect the hose, ABS and drop link'),
        body: V('Uvolněte držák brzdové hadice a kabel ABS ze vzpěry. Povolte matici spojovací tyče stabilizátoru – čep kontrujte imbusem/Torxem.', 'Release the brake-hose bracket and ABS wire from the strut. Undo the anti-roll bar drop-link nut – counter-hold the stud with hex/Torx.'),
        notes: [
          { level: 'warning', text: V('Brzdovou hadici nerozpojujte – jen vyndejte z držáku. Nesmí se natáhnout ani zkroutit.', 'Do not open the brake hose – only unclip it from the bracket. It must not stretch or twist.') },
          { level: 'tip', text: V('Zrezlé spoje nastříkejte odrezovačem den předem.', 'Spray rusty joints with penetrating oil the day before.') }
        ]
      },
      {
        id: 'lowerBolts', anim: 'struts-springs.lowerBolts',
        title: V('Povolte spodní šrouby vzpěry', 'Undo the lower strut bolts'),
        body: V('**Označte polohu vzpěry na těhlici** (ovlivňuje odklon). Vyšroubujte šrouby vzpěra–těhlice nebo povolte svěrný šroub a těhlici rozepřete. Těhlici podepřete, aby nespadla a nenatáhla hnací hřídel.', '**Mark the strut position on the knuckle** (it affects camber). Remove the strut-to-knuckle bolts, or loosen the pinch bolt and spread the knuckle. Support the knuckle so it does not drop and overextend the drive shaft.'),
        specs: [{ label: V('Utahovací moment', 'Torque'), value: V('dle příručky (často + úhel, nové šrouby)', 'per manual (often + angle, new bolts)'), verify: true }],
        notes: [{ level: 'warning', text: V('Těhlici nenechte viset – hnací hřídel by mohla vyjet z převodovky nebo se poškodí kloub.', 'Do not let the knuckle hang – the drive shaft may pull out of the gearbox or the joint gets damaged.') }]
      },
      {
        id: 'topNuts', anim: 'struts-springs.topNuts',
        title: V('Horní matice a vyjmutí vzpěry', 'Top nuts and strut removal'),
        body: V('V motorovém prostoru povolte matice horního uložení (obvykle 3). **Vzpěru přidržujte** – po povolení poslední matice spadne. Prostřední matici pístnice nechte na místě!', 'In the engine bay undo the top-mount nuts (usually 3). **Hold the strut** – it drops when the last nut comes off. Leave the centre rod nut in place!'),
        notes: [{ level: 'danger', text: V('Prostřední matice drží staženou pružinu. Povolit jen ve stahováku!', 'The centre nut holds the spring under load. Undo only in a compressor!') }]
      },
      {
        id: 'compress', anim: 'struts-springs.compress',
        title: V('Stáhněte pružinu', 'Compress the spring'),
        body: V('Vzpěru upněte do svěráku za spodní držák (ne za tělo tlumiče). Nasaďte obě svěrky stahováku proti sobě, na co nejvíce závitů. Stahujte střídavě po pár otáčkách, dokud se pružina neuvolní z horní misky.', 'Clamp the strut in a vice by the lower bracket (not the damper body). Fit both compressor clamps opposite each other on as many coils as possible. Compress alternately a few turns at a time until the spring is free of the upper seat.'),
        notes: [
          { level: 'danger', text: V('Žádný rázový utahovák, žádné prodlužování páky trubkou, žádné provizorní stahováky z řetězů. Při jakémkoli praskání nebo sklouzávání háku okamžitě přestat.', 'No impact gun, no extension pipes, no home-made chain compressors. Stop immediately at any cracking noise or hook slipping.') },
          { level: 'warning', text: V('Ochranné brýle, tělo mimo osu pružiny.', 'Safety glasses, body out of line with the spring.') }
        ]
      },
      {
        id: 'topMount', anim: 'struts-springs.topMount',
        title: V('Rozeberte horní část vzpěry', 'Dismantle the top of the strut'),
        body: V('Povolte prostřední matici pístnice (kontra imbusem v pístnici). Sundejte uložení, ložisko a horní misku. Pružinu se stahovákem opatrně sundejte a odložte – **stahovák nechte nasazený**.', 'Undo the centre rod nut (counter-hold the rod with a hex key). Remove the mount, bearing and upper seat. Lift the compressed spring off carefully and set it down – **leave the compressor fitted**.'),
        specs: [{ label: V('Matice pístnice', 'Rod nut'), value: V('dle příručky', 'per manual'), verify: true }]
      },
      {
        id: 'assemble', anim: 'struts-springs.assemble',
        title: V('Složte vzpěru s novým tlumičem', 'Build up the strut on the new damper'),
        body: V('Na nový tlumič nasaďte doraz a prachovku, pružinu tak, aby **konec závitu dosedl do dorazu ve spodní misce**, pak horní misku, ložisko a uložení podle značek. Matici pístnice zatím jen našroubujte.', 'Fit the bump stop and boot to the new damper, then the spring so that **its end sits against the stop in the lower seat**, then the upper seat, bearing and mount aligned to the marks. Thread the rod nut on for now.'),
        notes: [{ level: 'caution', text: V('Pístnici nového tlumiče nepoškrábejte kleštěmi – zničí se těsnění.', 'Do not scratch the new damper rod with pliers – it destroys the seal.') }]
      },
      {
        id: 'release', anim: 'struts-springs.release',
        title: V('Povolte stahovák a dotáhněte matici', 'Release the compressor and torque the nut'),
        body: V('Stahovák povolujte střídavě a pomalu, pružina musí sednout do obou misek. Pak matici pístnice dotáhněte momentovým klíčem (kontra v pístnici).', 'Release the compressor alternately and slowly, the spring must seat in both seats. Then torque the rod nut (counter-hold the rod).'),
        specs: [{ label: V('Matice pístnice', 'Rod nut'), value: V('dle příručky', 'per manual'), verify: true }],
        notes: [{ level: 'danger', text: V('Pokud pružina nesedí v dorazech, znovu stáhnout a opravit – nikdy nepovolovat „na sílu“.', 'If the spring is not seated in its stops, compress again and correct – never release by force.') }]
      },
      {
        id: 'refit', anim: 'struts-springs.refit',
        title: V('Namontujte vzpěru zpět', 'Refit the strut'),
        body: V('Vzpěru vložte nahoru, horní matice našroubujte rukou. Spodní šrouby nasaďte podle značek, připojte spojovací tyč, hadici a ABS. Šrouby dotáhněte momentem; pryžová uložení až **v jízdní výšce** (zvedák pod rameno nebo vůz na kolech).', 'Fit the strut up into the tower, thread the top nuts by hand. Fit the lower bolts to the marks, reconnect the drop link, hose and ABS. Torque the bolts; rubber bushings only **at ride height** (jack under the arm or car on its wheels).'),
        specs: [{ label: V('Momenty', 'Torques'), value: V('dle příručky', 'per manual'), verify: true }],
        notes: [{ level: 'warning', text: V('Druhou stranu nápravy proveďte stejně – vždy v páru.', 'Do the other side of the axle the same way – always in pairs.') }]
      },
      {
        id: 'align', anim: 'struts-springs.align',
        title: V('Geometrie a zkušební jízda', 'Alignment and test drive'),
        body: V('Po výměně vzpěr se změní odklon a sbíhavost – **nechte seřídit geometrii**. Pak zkušební jízda: žádné klepání, vůz netáhne, volant rovně.', 'Replacing struts changes camber and toe – **have the alignment done**. Then a test drive: no knocking, no pulling, steering wheel straight.'),
        notes: [{ level: 'info', text: V('Viz návod „Geometrie kol – základy“.', 'See the "Wheel alignment basics" tutorial.') }]
      }
    ],
    vehicles: {
      'mb-cl500-c216': {
        status: 'pro',
        title: V('Tlumiče a pružiny: CL 500 má ABC (hydraulické vzpěry)', 'Dampers & springs: the CL 500 has ABC (hydraulic struts)'),
        intro: V('Váš CL 500 má **Active Body Control** – místo klasických tlumičů jsou hydraulické vzpěry s pružinou, napájené tlakem až cca 200 bar. Postup se stahovákem z tohoto návodu **nepoužívejte**. Najdete zde jen základní informace; podrobnosti v návodu **„ABC hydraulika“**.', 'Your CL 500 has **Active Body Control** – instead of conventional dampers it has hydraulic spring struts fed with up to approx. 200 bar. **Do not** use the compressor procedure from this tutorial. Only basic information is shown here; details are in the **"ABC hydraulics"** tutorial.'),
        time: V('dílna', 'workshop'),
        specs: [
          { label: V('Systém', 'System'), value: V('ABC – hydraulické vzpěry s pružinami', 'ABC – hydraulic struts with springs'), verify: true },
          { label: V('Tlak v systému', 'System pressure'), value: V('cca 200 bar', 'approx. 200 bar'), verify: true }
        ],
        notes: [{ level: 'danger', text: V('Hydraulika ABC pod tlakem může zranit (vstřik kapaliny pod kůži). Před povolením vedení odtlakovat dle WIS.', 'Pressurised ABC hydraulics can injure (fluid injection under the skin). Depressurise per WIS before opening any line.'), verify: true }],
        replaceTools: true, replaceFinalChecks: true,
        tools: [V('XENTRY / diagnostika s podporou ABC', 'XENTRY / scan tool with ABC support'), V('Nářadí dle WIS', 'Tools per WIS')],
        parts: [V('Vzpěry ABC dle VIN (WIS)', 'ABC struts by VIN (WIS)')],
        finalChecks: [V('Kalibrace výšky ABC diagnostikou', 'ABC level calibration with a scan tool'), V('Žádný únik kapaliny', 'No fluid leaks')],
        steps: skipAll(),
        extraSteps: [{ after: 'symptoms', step: {
          id: 'abcInfo', anim: 'struts-springs.special',
          title: V('ABC: co je jinak', 'ABC: what is different'),
          body: V('Vzpěry ABC obsahují pružinu i hydraulický válec. Výměna vyžaduje odtlakování systému, správné tlakové spojky a kalibraci výšky v XENTRY. Pokračujte návodem **„ABC hydraulika“** nebo svěřte práci specializované dílně.', 'ABC struts contain both a spring and a hydraulic cylinder. Replacing them requires depressurising the system, correct pressure fittings and a level calibration in XENTRY. Continue with the **"ABC hydraulics"** tutorial or leave it to a specialist.'),
          notes: [{ level: 'danger', text: V('Nikdy nepovolujte hydraulické vedení ABC pod tlakem.', 'Never open an ABC hydraulic line under pressure.') }]
        } }]
      },
      'volvo-xc60-b4': {
        status: 'pro',
        title: V('Tlumiče: XC60 má vzduchové odpružení', 'Dampers: the XC60 has air suspension'),
        intro: V('Váš XC60 má **vzduchové odpružení** – místo vinutých pružin jsou vzduchové měchy (u vzpěr integrované). Postup se stahovákem **nepoužívejte**. Základní informace najdete zde, podrobnosti v návodu **„Vzduchový podvozek“**.', 'Your XC60 has **air suspension** – air springs instead of coil springs (integrated in the struts). **Do not** use the compressor procedure. Basic information is here, details in the **"Air suspension"** tutorial.'),
        time: V('dílna / zkušení', 'workshop / experienced'),
        specs: [{ label: V('Systém', 'System'), value: V('Vzduchové měchy + adaptivní tlumiče (dle výbavy)', 'Air springs + adaptive dampers (depending on spec)'), verify: true }],
        notes: [{ level: 'danger', text: V('Vzduchové vzpěry jsou pod tlakem. Odtlakovat a vypnout regulaci výšky přes VIDA, teprve pak povolovat.', 'Air struts are pressurised. Depressurise and disable level control via VIDA before undoing anything.'), verify: true }],
        replaceTools: true, replaceFinalChecks: true,
        tools: [V('VIDA / kompatibilní diagnostika', 'VIDA / compatible scan tool'), V('Nářadí dle VIDA', 'Tools per VIDA')],
        parts: [V('Vzduchové vzpěry / měchy dle VIN', 'Air struts / springs by VIN')],
        finalChecks: [V('Kalibrace výšky a ADAS (VIDA)', 'Level and ADAS calibration (VIDA)'), V('Test těsnosti po 24 h (vůz neklesá)', 'Leak test after 24 h (car does not sag)')],
        steps: skipAll(),
        extraSteps: [{ after: 'symptoms', step: {
          id: 'airInfo', anim: 'struts-springs.special',
          title: V('Vzduchový podvozek: co je jinak', 'Air suspension: what is different'),
          body: V('Vzduchová vzpěra obsahuje měch i tlumič. Výměna vyžaduje odtlakování, správné vzduchové spojky a kalibraci výšky ve VIDA. Pokračujte návodem **„Vzduchový podvozek“**.', 'An air strut contains the air spring and the damper. Replacing it requires depressurising, correct air fittings and a level calibration in VIDA. Continue with the **"Air suspension"** tutorial.'),
          notes: [{ level: 'danger', text: V('Před zvednutím vozu vypnout regulaci výšky (režim zvedání).', 'Disable level control (jacking mode) before lifting the car.'), verify: true }]
        } }]
      },
      'skoda-octavia-rs-tdi': {
        status: 'caution',
        specs: [
          { label: V('Vpředu', 'Front'), value: V('McPherson s vinutou pružinou', 'MacPherson with coil spring') },
          { label: V('Vzadu', 'Rear'), value: V('Víceprvková náprava – pružina a tlumič zvlášť (bez stahováku)', 'Multi-link axle – spring and damper separate (no compressor needed)'), verify: true },
          { label: V('Momenty', 'Torques'), value: V('dle ELSA (často nové šrouby, moment + úhel)', 'per ELSA (often new bolts, torque + angle)'), verify: true }
        ],
        notes: [
          { level: 'info', text: V('RS má sportovní podvozek – objednávejte tlumiče podle VIN / kódu podvozku (PR kód).', 'The RS has sport suspension – order dampers by VIN / suspension PR code.'), verify: true },
          { level: 'tip', text: V('Zadní tlumič se mění bez stahováku: podepřít rameno zvedákem, povolit 2 šrouby.', 'The rear damper changes without a compressor: support the arm with a jack, undo 2 bolts.'), verify: true }
        ],
        steps: {
          lowerBolts: { body: V('Na Octavii je vzpěra v těhlici uchycena **svěrným šroubem** – povolte ho a těhlici rozepřete rozpěrákem (VW nářadí 3424 nebo ekvivalent).', 'On the Octavia the strut sits in the knuckle with a **pinch bolt** – undo it and spread the knuckle with a spreader (VW tool 3424 or equivalent).'), notes: [{ level: 'info', text: V('Typ uchycení ověřte v ELSA.', 'Verify the mounting type in ELSA.'), verify: true }] }
        }
      },
      'toyota-gr-yaris': {
        status: 'caution',
        specs: [
          { label: V('Vpředu', 'Front'), value: V('McPherson', 'MacPherson') },
          { label: V('Vzadu', 'Rear'), value: V('Dvojitá lichoběžníková náprava (ověřit typ tlumiče)', 'Double-wishbone axle (verify damper type)'), verify: true },
          { label: V('Momenty', 'Torques'), value: V('dle TIS', 'per TIS'), verify: true }
        ],
        notes: [
          { level: 'info', text: V('Verze Circuit / s balíčkem mohou mít jiné tlumiče – objednávat dle VIN.', 'Circuit-pack versions may have different dampers – order by VIN.'), verify: true },
          { level: 'caution', text: V('Nastavitelné (coilover) podvozky: výšku a tuhost nastavit symetricky, pak geometrie.', 'Adjustable coilovers: set height and damping symmetrically, then alignment.') }
        ]
      },
      'citroen-jumper-22hdi': {
        status: 'caution',
        specs: [
          { label: V('Vpředu', 'Front'), value: V('McPherson – velmi tuhá pružina (těžký vůz)', 'MacPherson – very stiff spring (heavy vehicle)') },
          { label: V('Vzadu', 'Rear'), value: V('Listová pera + samostatné tlumiče', 'Leaf springs + separate dampers'), verify: true },
          { label: V('Momenty', 'Torques'), value: V('dle příručky PSA/Fiat', 'per PSA/Fiat manual'), verify: true }
        ],
        notes: [
          { level: 'danger', text: V('Přední pružiny dodávky jsou velmi tuhé – stahovák musí být dimenzován na užitkové vozy. Zvažte hotové vzpěry.', 'Van front springs are very stiff – the compressor must be rated for commercial vehicles. Consider complete struts.') },
          { level: 'warning', text: V('Hever a stojany min. 3 t, náklad vyložit.', 'Jack and stands rated at least 3 t, unload the cargo.') }
        ],
        extraSteps: [{ after: 'refit', step: {
          id: 'jmpRear', anim: 'struts-springs.leaf',
          title: V('Zadní náprava Jumperu: tlumiče a listová pera', 'Jumper rear axle: dampers and leaf springs'),
          body: V('Zadní tlumiče se mění jednoduše – nápravu podepřete zvedákem, povolte horní a spodní šroub, vyměňte. **Listová pera a třmeny (U-šrouby)** jsou pod velkým napětím a bývají zarezlé – tuto práci svěřte dílně.', 'The rear dampers are easy – support the axle with a jack, undo the top and bottom bolt, swap. **Leaf springs and U-bolts** are under high load and usually seized – leave that to a workshop.'),
          notes: [
            { level: 'danger', text: V('Nikdy nepovolujte třmeny listových per, když náprava visí bez podepření.', 'Never undo the leaf-spring U-bolts with the axle hanging unsupported.') },
            { level: 'info', text: V('Uspořádání zadní nápravy ověřte na voze / v příručce.', 'Verify the rear axle layout on the van / in the manual.'), verify: true }
          ]
        } }]
      }
    }
  });
})(window.STU);
