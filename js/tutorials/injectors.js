/* Tutorial: Injector diagnostics (diesel Common Rail) + petrol notes. */
(function (S) {
  'use strict';
  var V = function (cs, en) { return { cs: cs, en: en }; };
  var DIESEL_ONLY = ['leakoff', 'washer', 'remove', 'seat', 'coding'];
  function skip(ids) { var o = {}; ids.forEach(function (i) { o[i] = { skip: true }; }); return o; }

  function petrol(car, port) {
    var steps = skip(DIESEL_ONLY);
    steps.balance = {
      title: V('Diagnostika: palivové korekce a vynechávání', 'Diagnosis: fuel trims and misfires'),
      body: V('U benzínového motoru se stav vstřikovačů posuzuje podle **palivových korekcí** (krátkodobé / dlouhodobé, po bankách) a **počítadel vynechávání** jednotlivých válců. Velká kladná korekce na jedné bance nebo vynechávání stále na stejném válci může ukazovat na vstřikovač – ale i na netěsnost sání, cívku nebo svíčku.', 'On a petrol engine injector health is judged from the **fuel trims** (short / long term, per bank) and the **misfire counters** of each cylinder. A large positive trim on one bank or misfires always on the same cylinder can point to an injector – but also to an intake leak, a coil or a plug.')
    };
    return {
      status: 'pro',
      title: V('Vstřikovače (benzín): diagnostika', 'Injectors (petrol): diagnosis'),
      summary: V('Benzínové vstřikovače: jak poznat problém, proč výměnu svěřit dílně.', 'Petrol injectors: how to spot a problem, why to leave replacement to a workshop.'),
      intro: port
        ? V('Váš ' + car + ' má **nepřímý vstřik do sání** (nízký tlak). Vstřikovače bývají velmi odolné. Dieselové kroky (přepadový test, měděné podložky, kódování) se ho netýkají – ponecháváme diagnostiku.', 'Your ' + car + ' has **port injection into the intake** (low pressure). The injectors are usually very durable. The diesel steps (leak-off test, copper washers, coding) do not apply – we keep the diagnosis.')
        : V('Váš ' + car + ' má **přímý vstřik benzínu** (vysoký tlak, stovky barů). Výměna vstřikovače vyžaduje speciální těsnění a nástroje – **práce pro dílnu**. Ponecháváme bezpečnost a diagnostiku.', 'Your ' + car + ' has **petrol direct injection** (high pressure, hundreds of bar). Replacing an injector needs special seals and tools – **a workshop job**. We keep safety and diagnosis.'),
      notes: [{ level: 'info', text: port ? V('Systém vstřiku ověřte podle VIN (WIS).', 'Verify the injection system by VIN (WIS).') : V('Typ vstřiku (přímý / kombinovaný s nepřímým) ověřte v dílenské příručce.', 'Verify the injection type (direct / combined with port) in the workshop manual.'), verify: true }],
      specs: [{ label: V('Vstřikování', 'Injection'), value: port ? V('nepřímé (do sání)', 'port (into the intake)') : V('přímé (+ případně nepřímé)', 'direct (+ possibly port)'), verify: true }],
      steps: steps,
      extraSteps: [{ after: 'symptoms', step: {
        id: 'petrol', anim: 'injectors.petrol',
        title: V('Jak vstřikuje váš motor', 'How your engine injects'),
        body: port ? V('Vstřikovač stříká do sacího kanálu před ventil. Tlak paliva je nízký (jednotky barů).', 'The injector sprays into the intake port ahead of the valve. Fuel pressure is low (a few bar).') : V('Vstřikovač stříká přímo do válce. Vysokotlaké čerpadlo vytváří tlak stovek barů – stejné riziko jako u dieselu.', 'The injector sprays directly into the cylinder. A high-pressure pump creates hundreds of bar – the same risk as with a diesel.'),
        notes: port ? [] : [{ level: 'danger', text: V('Vysokotlaké palivové vedení přímého vstřiku neotvírejte – i benzín pod tlakem pronikne kůží a hrozí požár.', 'Do not open direct-injection high-pressure lines – petrol under pressure also penetrates skin and is a fire risk.') }]
      } }]
    };
  }

  S.registerTutorial({
    id: 'injectors',
    level: 2,
    thumb: 'injectors.overview',
    time: V('1–2 h diagnostika, výměna dle motoru', '1–2 h diagnosis, replacement depends on engine'),
    title: V('Vstřikovače: diagnostika a výměna (diesel)', 'Injectors: diagnosis and replacement (diesel)'),
    summary: V('Korekční hodnoty, přepadový test, netěsná podložka, výměna a kódování vstřikovače.', 'Correction values, leak-off test, leaking washer, replacing and coding an injector.'),
    intro: V(
      'Vadný vstřikovač u dieselu způsobuje kouř, klepání, nerovnoměrný chod, horší start a zanáší filtr DPF. Než ho vyměníte (je drahý), **ověřte, že je opravdu vadný**: korekční hodnoty v diagnostice, přepadový test a kontrola těsnosti podložky.\n\nVýměna je u některých motorů jednoduchá, u jiných vstřikovač **zapeče** a vytažení je práce pro specialistu. Vysokotlaká strana je **životu nebezpečná**.',
      'A faulty diesel injector causes smoke, knocking, rough running, poor starting and clogs the DPF. Before replacing one (they are expensive), **prove it is really faulty**: correction values in the scan tool, a leak-off test and checking the washer for leaks.\n\nOn some engines the swap is easy, on others the injector **seizes** in the head and removal is specialist work. The high-pressure side is **life-threatening**.'
    ),
    safety: [
      { level: 'danger', text: V('**Vysoký tlak (až ~2000 bar):** paprsek nafty pronikne kůží, způsobí otravu a může vést k amputaci. Netěsnost nikdy nehledejte rukou, vysokotlaká vedení neotevírejte za chodu ani hned po vypnutí.', '**High pressure (up to ~2000 bar):** a diesel jet penetrates skin, causes poisoning and can lead to amputation. Never feel for leaks with your hand, never open high-pressure lines while running or right after switch-off.') },
      { level: 'danger', text: V('Žádný oheň ani jiskry; nafta na horkém motoru může vzplanout.', 'No flames or sparks; diesel on a hot engine can ignite.') },
      { level: 'warning', text: V('Při práci na vstřikovačích je **absolutní čistota** povinná – zaslepte každý otevřený otvor.', '**Absolute cleanliness** is mandatory when working on injectors – cap every open port.') },
      { level: 'warning', text: V('Vysokotlaké trubky jsou často **na jedno použití** (deformují se při dotažení) – řiďte se příručkou.', 'High-pressure pipes are often **single-use** (they deform when tightened) – follow the manual.') },
      { level: 'caution', text: V('Nepáčte a nebijte zapečený vstřikovač – praskne nebo poškodí hlavu.', 'Do not pry or hammer a seized injector – it breaks or damages the head.') }
    ],
    tools: [
      V('Diagnostika s měřenými hodnotami a kódováním vstřikovačů', 'Scan tool with measured values and injector coding'),
      V('Sada odměrek pro přepadový test', 'Leak-off (back-flow) test kit'),
      V('Klíč na vysokotlaké trubky (otevřený očkový / „flare“)', 'Flare-nut spanner for high-pressure pipes'),
      V('Vytahovák vstřikovačů (posuvné kladivo / speciální)', 'Injector puller (slide hammer / special)'),
      V('Kartáček / fréza na čištění sedla', 'Seat cleaning brush / cutter'),
      V('Krytky na zaslepení, momentový klíč', 'Blanking caps, torque wrench'),
      V('Rukavice, brýle', 'Gloves, glasses')
    ],
    parts: [
      V('Měděné podložky vstřikovačů (vždy nové)', 'Injector copper washers (always new)'),
      V('Upínací šrouby / třmeny dle příručky', 'Clamp bolts / brackets per manual'),
      V('Vysokotlaké trubky (pokud jsou na jedno použití)', 'High-pressure pipes (if single-use)'),
      V('O-kroužky / spojky přepadů', 'Leak-off O-rings / connectors'),
      V('Nový / repasovaný vstřikovač podle VIN (jen ověřeně vadný)', 'New / reconditioned injector by VIN (only proven faulty)')
    ],
    finalChecks: [
      V('Žádná netěsnost (pohledem, papírem – ne rukou!)', 'No leaks (visually, with paper – not with your hand!)'),
      V('Kód nového vstřikovače zadaný do řídicí jednotky', 'New injector code entered into the ECU'),
      V('Korekční hodnoty v limitu, žádné chyby', 'Correction values within limits, no faults'),
      V('Po 50–100 km zkontrolovat těsnost podložek', 'Re-check the washers after 50–100 km')
    ],
    steps: [
      { id: 'overview', anim: 'injectors.overview',
        title: V('Jak funguje systém Common Rail', 'How Common Rail works'),
        body: V('Vysokotlaké čerpadlo plní **rail** (zásobník) palivem pod tlakem. Řídicí jednotka otevírá **vstřikovače** v přesných dávkách. Přebytečná nafta se vrací **přepadovým vedením** do nádrže.', 'The high-pressure pump fills the **rail** (accumulator) with pressurised fuel. The ECU opens the **injectors** in precise doses. Surplus diesel returns to the tank through the **leak-off line**.') },
      { id: 'hp', anim: 'injectors.hpDanger',
        title: V('Bezpečnost: vysoký tlak', 'Safety: high pressure'),
        body: V('Po vypnutí motoru tlak v railu klesá, ale ne vždy hned. Před povolením jakéhokoli spoje na vysokotlaké straně počkejte dle příručky (často několik minut) a spoj obalte hadrem.', 'After switch-off rail pressure drops, but not always instantly. Before loosening anything on the high-pressure side wait as the manual says (often several minutes) and wrap the joint in a rag.'),
        notes: [{ level: 'danger', text: V('Poranění vstřikem paliva = okamžitě na chirurgii, i když vypadá jako malá tečka.', 'A fuel injection injury = go to surgery immediately, even if it looks like a tiny dot.') }] },
      { id: 'symptoms', anim: 'injectors.symptoms',
        title: V('Příznaky vadného vstřikovače', 'Symptoms of a faulty injector'),
        body: V('- nerovnoměrný volnoběh, „cukání“\n- klepání (tvrdý chod) jednoho válce\n- černý nebo bílý kouř\n- horší studený start, vyšší spotřeba\n- časté regenerace DPF, ředění oleje naftou', '- rough idle, "shaking"\n- knocking (hard running) on one cylinder\n- black or white smoke\n- poor cold start, higher fuel use\n- frequent DPF regenerations, oil diluted with diesel'),
        notes: [{ level: 'info', text: V('Stejné příznaky může mít netěsnost sání, EGR, turbo nebo žhavení – proto diagnostika.', 'The same symptoms can come from an intake leak, EGR, turbo or glow plugs – hence the diagnosis.') }] },
      { id: 'balance', anim: 'injectors.balance',
        title: V('Korekční (balanční) hodnoty', 'Correction (balance) values'),
        body: V('V diagnostice otevřete měřené hodnoty motoru – **korekce množství vstřiku** jednotlivých válců. Měřte na zahřátém motoru na volnoběh. Válec výrazně mimo limit je podezřelý.', 'In the scan tool open the engine measured values – **injection quantity correction** per cylinder. Measure with a warm engine at idle. A cylinder well outside the limit is suspect.'),
        specs: [{ label: V('Limit korekce', 'Correction limit'), value: V('dle příručky / diagnostiky', 'per manual / scan tool'), verify: true }] },
      { id: 'leakoff', anim: 'injectors.leakoff',
        title: V('Přepadový (zpětný) test', 'Leak-off (back-flow) test'),
        body: V('Odpojte přepadová vedení a nasaďte odměrky. Podle postupu výrobce nechte motor běžet / startovat. Porovnejte množství: vstřikovač s výrazně větším přepadem je vadný.', 'Disconnect the leak-off lines and fit the measuring tubes. Run / crank the engine per the manufacturer procedure. Compare the amounts: an injector with a much larger return is faulty.'),
        notes: [{ level: 'caution', text: V('U piezo vstřikovačů jsou přepady malé a limity jiné – ověřte postup pro váš motor.', 'Piezo injectors have small returns and different limits – verify the procedure for your engine.'), verify: true }] },
      { id: 'washer', anim: 'injectors.washer',
        title: V('Netěsná podložka (spaliny u vstřikovače)', 'Leaking washer (exhaust gas at the injector)'),
        body: V('Zkontrolujte okolí vstřikovačů: **černý dehet**, karbon, syčivý zvuk („chuffing“) při chodu = netěsná měděná podložka. Spaliny pak vstřikovač „zapečou“ v hlavě.', 'Check around the injectors: **black tar**, carbon, a hissing sound ("chuffing") while running = leaking copper washer. The exhaust gas then bakes the injector into the head.') },
      { id: 'remove', anim: 'injectors.remove',
        title: V('Demontáž vstřikovače (přehled)', 'Removing an injector (overview)'),
        body: V('1. Studený motor, vyčistit okolí, odpojit konektor a přepad.\n2. Povolit vysokotlakou trubku (kontra klíč), ihned zaslepit.\n3. Povolit upínací třmen.\n4. Vstřikovač vytáhnout rovně – u zapečeného použít speciální vytahovák.', '1. Cold engine, clean the area, unplug the connector and leak-off.\n2. Undo the high-pressure pipe (counter-hold), cap it at once.\n3. Undo the clamp.\n4. Pull the injector straight out – use a special puller if it is seized.'),
        notes: [{ level: 'danger', text: V('Zapečený vstřikovač nepáčit – ulomený vstřikovač znamená demontáž hlavy.', 'Do not lever a seized injector – a snapped injector means removing the head.') }] },
      { id: 'seat', anim: 'injectors.seat',
        title: V('Čištění sedla a nová podložka', 'Clean the seat and fit a new washer'),
        body: V('Sedlo vyčistěte kartáčkem / frézou, nečistoty odsajte. Nasaďte **novou** měděnou podložku a nové O-kroužky. Vstřikovač vložte rovně, upínací šroub dotáhněte momentem.', 'Clean the seat with a brush / cutter and vacuum out the debris. Fit a **new** copper washer and new O-rings. Insert the injector straight and torque the clamp bolt.'),
        specs: [{ label: V('Moment upínacího šroubu', 'Clamp bolt torque'), value: V('dle příručky (často moment + úhel)', 'per manual (often torque + angle)'), verify: true }] },
      { id: 'coding', anim: 'injectors.coding',
        title: V('Kódování vstřikovače', 'Coding the injector'),
        body: V('Každý vstřikovač má na hlavě **kód** (korekční data). Po výměně ho zadejte do řídicí jednotky (IMA / C2I / QR – dle výrobce), jinak motor nevstřikuje přesně.', 'Each injector carries a **code** on its head (correction data). After a swap enter it into the ECU (IMA / C2I / QR – per manufacturer), otherwise the engine does not inject accurately.'),
        notes: [{ level: 'info', text: V('Ne každý motor kódování vyžaduje – ověřte v dílenské příručce.', 'Not every engine requires coding – verify in the workshop manual.'), verify: true }] },
      { id: 'test', anim: 'injectors.test',
        title: V('Odvzdušnění, start, kontrola', 'Prime, start, check'),
        body: V('Odvzdušněte palivový systém (viz návod Palivový filtr), nastartujte, zkontrolujte těsnost **pohledem nebo papírem** a korekční hodnoty. Vymažte chyby a proveďte zkušební jízdu.', 'Prime the fuel system (see the Fuel filter tutorial), start up, check for leaks **visually or with paper** and the correction values. Clear faults and do a test drive.') }
    ],
    vehicles: {
      'mb-cl500-c216': petrol('CL 500', true),
      'volvo-xc60-b4': (function () { var o = petrol('XC60 B4', false); o.notes.push({ level: 'warning', text: V('48V mild hybrid – při práci v motorovém prostoru dbejte na kabeláž 48 V a startér-generátor.', '48 V mild hybrid – mind the 48 V wiring and starter-generator when working in the engine bay.') }); return o; })(),
      'toyota-gr-yaris': (function () { var o = petrol('GR Yaris', false); o.notes.push({ level: 'info', text: V('G16E-GTS používá kombinaci přímého a nepřímého vstřiku (D-4ST) – ověřit.', 'The G16E-GTS uses combined direct and port injection (D-4ST) – verify.'), verify: true }); return o; })(),
      'skoda-octavia-rs-tdi': {
        status: 'caution',
        specs: [
          { label: V('Typ vstřikovačů', 'Injector type'), value: V('piezo (CR) – ověřit podle kódu motoru', 'piezo (CR) – verify by engine code'), verify: true },
          { label: V('Kódování', 'Coding'), value: V('VCDS (IMA / adaptace) – dle verze', 'VCDS (IMA / adaptation) – per version'), verify: true },
          { label: V('Tlak systému', 'System pressure'), value: V('až cca 1800 bar', 'up to approx. 1800 bar'), verify: true }
        ],
        notes: [{ level: 'info', text: V('Korekční hodnoty najdete v VCDS v měřených hodnotách motoru (skupiny / UDS dle verze).', 'Find the correction values in VCDS under engine measured values (groups / UDS depending on version).'), verify: true }]
      },
      'citroen-jumper-22hdi': {
        status: 'caution',
        specs: [
          { label: V('Typ vstřikovačů', 'Injector type'), value: V('dle VIN (verze 100/120 k)', 'per VIN (100/120 hp version)'), verify: true },
          { label: V('Kódování', 'Coding'), value: V('Diagbox (C2I / IMA) – ověřit', 'Diagbox (C2I / IMA) – verify'), verify: true }
        ],
        notes: [
          { level: 'warning', text: V('Diesely HDi jsou známé netěsnými podložkami vstřikovačů („black death“ – černý dehet). Kontrolujte pravidelně, zapečený vstřikovač je drahá oprava.', 'HDi diesels are known for leaking injector washers ("black death" – black tar). Check regularly; a seized injector is an expensive repair.') }
        ]
      }
    }
  });
})(window.STU);
