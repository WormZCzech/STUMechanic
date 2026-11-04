/* Tutorial: 12 V battery – test, charge, replace, register. */
(function (S) {
  'use strict';
  var V = function (cs, en) { return { cs: cs, en: en }; };

  S.registerTutorial({
    id: 'battery',
    level: 1,
    thumb: 'battery.overview',
    time: V('30–60 min', '30–60 min'),
    title: V('Autobaterie 12 V: test, nabití, výměna', '12 V battery: test, charge, replace'),
    summary: V('Změřit napětí, správně nabít, vyměnit ve správném pořadí svorek a případně baterii zaregistrovat.', 'Measure the voltage, charge correctly, replace in the right terminal order and register the battery if needed.'),
    intro: V(
      'Slabá baterie je **nejčastější důvod, proč auto ráno nenastartuje** – a u moderních aut způsobuje i podivné chyby elektroniky. Naučíte se ji změřit, nabít a bezpečně vyměnit.\n\nZlaté pravidlo: **odpojit mínus první, připojit plus první.**',
      'A weak battery is **the most common reason a car will not start in the morning** – and in modern cars it also causes strange electronic faults. You will learn to measure it, charge it and replace it safely.\n\nGolden rule: **disconnect minus first, connect plus first.**'
    ),
    safety: [
      { level: 'danger', text: V('**Výbušný vodík:** baterie při nabíjení a startování uvolňuje vodík. Žádné jiskry, oheň ani cigarety. Nabíjejte ve větraném prostoru.', '**Explosive hydrogen:** batteries release hydrogen when charging and cranking. No sparks, flames or smoking. Charge in a ventilated area.') },
      { level: 'danger', text: V('**Zkrat:** kovový klíč mezi + pólem a karoserií způsobí oblouk, popáleniny a může baterii roztrhnout. Proto mínus odpojujte první a sundejte prsteny a hodinky.', '**Short circuit:** a metal spanner between the + post and the body causes an arc, burns and can burst the battery. That is why minus comes off first – and take off rings and watches.') },
      { level: 'warning', text: V('**Kyselina sírová** leptá kůži, oči i lak. Ochranné brýle a rukavice. Baterii nenaklánějte; při zasažení oplachujte vodou 15 minut a vyhledejte lékaře.', '**Sulphuric acid** burns skin, eyes and paint. Safety glasses and gloves. Do not tilt the battery; if splashed, rinse with water for 15 minutes and see a doctor.') },
      { level: 'warning', text: V('Nikdy nenabíjejte a nestartujte **zamrzlou, nafouknutou nebo prasklou** baterii – hrozí výbuch.', 'Never charge or jump a **frozen, swollen or cracked** battery – it can explode.') },
      { level: 'caution', text: V('Použijte **stejný typ** (AGM / EFB / standard) a stejné nebo podobné parametry. AGM nahraďte jen AGM.', 'Use **the same type** (AGM / EFB / standard) and the same or similar ratings. Replace AGM only with AGM.') },
      { level: 'info', text: V('Starou baterii odevzdejte ve sběrném dvoře nebo u prodejce – obsahuje olovo a kyselinu.', 'Hand in the old battery at a recycling centre or the shop – it contains lead and acid.') }
    ],
    tools: [
      V('Multimetr (digitální)', 'Digital multimeter'),
      V('Chytrá nabíječka s režimem AGM/EFB', 'Smart charger with AGM/EFB mode'),
      V('Klíče / hlavice 10 a 13 mm (dle vozu)', '10 and 13 mm spanners / sockets (depends on car)'),
      V('Kartáč na póly, vazelína na póly', 'Terminal brush, terminal grease'),
      V('Ochranné brýle, rukavice', 'Safety glasses, gloves'),
      V('Udržovač paměti (volitelně)', 'Memory saver (optional)'),
      V('Diagnostika pro registraci baterie (dle vozu)', 'Scan tool for battery registration (depends on car)')
    ],
    parts: [
      V('Nová baterie stejného typu a velikosti (dle VIN / katalogu)', 'New battery of the same type and size (by VIN / catalogue)'),
      V('Případně nové svorky / odvětrávací hadička', 'If needed new clamps / vent hose')
    ],
    finalChecks: [
      V('Baterie pevně uchycená v držáku', 'Battery firmly held in its hold-down'),
      V('Svorky dotažené, + pól zakrytý krytkou', 'Clamps tight, + post covered by its cap'),
      V('Odvětrávací hadička připojená (je-li)', 'Vent hose connected (if fitted)'),
      V('Napětí za chodu 13,8–14,7 V', 'Running voltage 13.8–14.7 V'),
      V('Okna, střešní okno, hodiny a rádio nastavené', 'Windows, sunroof, clock and radio set'),
      V('Žádné kontrolky na přístrojové desce', 'No warning lights on the dashboard')
    ],
    steps: [
      { id: 'symptoms', anim: 'battery.overview', title: V('Poznejte slabou baterii', 'Recognise a weak battery'),
        body: V('Typické příznaky:\n- motor se točí pomalu nebo jen cvakne\n- kontrolky a světla při startu pohasnou\n- start-stop přestal fungovat\n- baterie je starší než 5–6 let\n\nPozor: stejné příznaky může mít i vadný alternátor nebo startér – proto nejdřív měřte.', 'Typical signs:\n- the engine cranks slowly or only clicks\n- warning lights and lights dim when cranking\n- start-stop has stopped working\n- the battery is older than 5–6 years\n\nNote: a faulty alternator or starter can cause the same signs – so measure first.'),
        notes: [{ level: 'info', text: V('Typ a parametry najdete na štítku: kapacita (Ah), startovací proud (A EN) a technologie (AGM / EFB).', 'Type and ratings are on the label: capacity (Ah), cold cranking current (A EN) and technology (AGM / EFB).') }] },
      { id: 'locate', anim: 'battery.locate', title: V('Najděte baterii a startovací body', 'Find the battery and jump points'),
        body: V('Baterie bývá v motorovém prostoru, ale u mnoha vozů je **v kufru nebo pod podlahou**. Pak jsou v motorovém prostoru **startovací body** (+ a kostra) pro nabíjení a startování.', 'The battery is usually in the engine bay, but in many cars it is **in the boot or under the floor**. Then there are **jump-start points** (+ and ground) in the engine bay for charging and jump-starting.') },
      { id: 'test', anim: 'battery.test', title: V('Změřte klidové napětí', 'Measure the resting voltage'),
        body: V('Multimetr na rozsah 20 V DC. Červený hrot na +, černý na −. Měřte až po 2 hodinách stání (bez povrchového náboje).\n\n- **12,6–12,7 V** nabitá\n- **12,4 V** cca 75 %\n- **12,2 V** cca 50 %\n- **pod 12,0 V** vybitá nebo vadná', 'Multimeter on the 20 V DC range. Red probe on +, black on −. Measure after the car has rested 2 hours (no surface charge).\n\n- **12.6–12.7 V** charged\n- **12.4 V** approx. 75 %\n- **12.2 V** approx. 50 %\n- **below 12.0 V** flat or faulty'),
        notes: [{ level: 'tip', text: V('Nejspolehlivější je zátěžový tester baterie – změří i skutečný startovací proud (CCA).', 'The most reliable is a battery load tester – it also measures the real cranking current (CCA).') }] },
      { id: 'crank', anim: 'battery.crank', title: V('Test při startování', 'Cranking test'),
        body: V('Pomocník nastartuje, vy sledujete napětí. **Při startování by nemělo klesnout pod cca 9,6–10 V.** Po nastartování musí být 13,8–14,7 V (dobíjí alternátor).', 'A helper cranks the engine while you watch the voltage. **While cranking it should not fall below approx. 9.6–10 V.** After starting it must be 13.8–14.7 V (alternator charging).'),
        notes: [{ level: 'warning', text: V('Držte ruce, kabely multimetru a vlasy dál od řemenů a ventilátoru.', 'Keep hands, multimeter leads and hair away from belts and the fan.') }] },
      { id: 'charge', anim: 'battery.charge', title: V('Nabijte baterii chytrou nabíječkou', 'Charge with a smart charger'),
        body: V('1. Zvolte režim podle typu baterie (AGM / EFB / standard).\n2. Připojte **+ svorku**, pak **− svorku** (u baterie ve voze na kostru / startovací bod).\n3. Teprve pak nabíječku zapněte do zásuvky.\n4. Po nabití nejdřív vypněte ze zásuvky, pak odpojte svorky.', '1. Select the mode for your battery type (AGM / EFB / standard).\n2. Connect the **+ clamp**, then the **− clamp** (with the battery in the car, to ground / the jump point).\n3. Only then plug the charger into the mains.\n4. When done, unplug from the mains first, then remove the clamps.'),
        notes: [{ level: 'danger', text: V('Nabíjejte ve větraném prostoru, nikdy u otevřeného ohně. Nafouknutou nebo zamrzlou baterii nenabíjejte.', 'Charge in a ventilated area, never near an open flame. Do not charge a swollen or frozen battery.') },
          { level: 'caution', text: V('Staré „hloupé“ nabíječky bez regulace mohou AGM baterii zničit přebitím.', 'Old "dumb" chargers without regulation can destroy an AGM battery by overcharging.') }] },
      { id: 'prep', anim: 'battery.memory', title: V('Příprava před odpojením', 'Prepare before disconnecting'),
        body: V('Zjistěte kód rádia/navigace (je-li), zavřete okna, vypněte zapalování, klíč dejte mimo vůz. Počkejte několik minut, než řídicí jednotky „usnou“. Udržovač paměti přes OBD je volitelný.', 'Find the radio/navigation code (if any), close the windows, switch off the ignition and keep the key away from the car. Wait a few minutes for the control units to go to sleep. An OBD memory saver is optional.') },
      { id: 'disconnect', anim: 'battery.disconnect', title: V('Odpojte: mínus první', 'Disconnect: minus first'),
        body: V('Povolte a sundejte **svorku − (mínus)**, odložte ji stranou, aby se nemohla dotknout pólu. Teprve pak sundejte **svorku +**.', 'Loosen and remove the **− (minus) clamp** and tuck it away so it cannot touch the post. Only then remove the **+ clamp**.'),
        notes: [{ level: 'danger', text: V('Při povolování + svorky se klíčem nikdy nedotkněte karoserie – zkrat, oblouk, popáleniny.', 'When loosening the + clamp never let the spanner touch the body – short circuit, arc, burns.') }] },
      { id: 'remove', anim: 'battery.remove', title: V('Vyjměte baterii', 'Remove the battery'),
        body: V('Povolte držák baterie, odpojte odvětrávací hadičku (je-li) a baterii vyzvedněte rovně za madlo. Baterie váží 15–25 kg.', 'Undo the hold-down, disconnect the vent hose (if fitted) and lift the battery straight up by its handle. A battery weighs 15–25 kg.'),
        notes: [{ level: 'warning', text: V('Zvedejte z nohou s rovnými zády. Baterii nenaklánějte – může vytéct kyselina.', 'Lift with your legs and a straight back. Do not tilt the battery – acid may leak.') }] },
      { id: 'clean', anim: 'battery.clean', title: V('Vyčistěte svorky a podložku', 'Clean the clamps and tray'),
        body: V('Bílý nebo zelený povlak (oxidace) odstraňte kartáčem. Podložku očistěte, při zbytcích kyseliny ji omyjte roztokem jedlé sody a vody.', 'Remove white or green crust (corrosion) with a brush. Clean the tray; if there is acid residue, wash it with a baking soda and water solution.') },
      { id: 'install', anim: 'battery.install', title: V('Vložte novou baterii: plus první', 'Fit the new battery: plus first'),
        body: V('Vložte baterii, uchyťte držákem, připojte odvětrání. Připojte **svorku + jako první**, nasaďte krytku, pak **svorku −**. Dotáhněte s citem.', 'Fit the battery, secure the hold-down, connect the vent. Connect the **+ clamp first**, fit its cap, then the **− clamp**. Tighten gently.'),
        notes: [{ level: 'warning', text: V('Volná baterie se při nehodě nebo brzdění může utrhnout a zkratovat.', 'A loose battery can break free in a crash or hard braking and short-circuit.') }] },
      { id: 'register', anim: 'battery.register', title: V('Registrace baterie (je-li potřeba)', 'Register the battery (if required)'),
        body: V('Vozy s inteligentním řízením dobíjení (snímač baterie, start-stop) potřebují novou baterii „přihlásit“ diagnostikou – typ a kapacitu. Bez toho ji mohou nesprávně dobíjet.', 'Cars with smart charging control (battery sensor, start-stop) need the new battery to be registered with a scan tool – type and capacity. Without it they may charge it incorrectly.') },
      { id: 'check', anim: 'battery.check', title: V('Kontrola a nastavení po výměně', 'Check and reset after replacement'),
        body: V('Nastartujte, změřte napětí (13,8–14,7 V). Inicializujte elektrická okna (podržet tlačítko nahoru/dolů), nastavte hodiny a rádio. Krátká jízda pomůže doučit systémy (např. snímač natočení volantu).', 'Start the engine and measure the voltage (13.8–14.7 V). Initialise the power windows (hold the switch up/down), set the clock and radio. A short drive helps the systems relearn (e.g. the steering angle sensor).') }
    ],
    vehicles: {
      'mb-cl500-c216': {
        status: 'caution',
        specs: [
          { label: V('Umístění', 'Location'), value: V('kufr vpravo pod podlahou; startovací body v motorovém prostoru', 'boot, right, under the floor; jump points in the engine bay'), verify: true },
          { label: V('Typ', 'Type'), value: V('AGM (dle štítku / katalogu)', 'AGM (per label / catalogue)'), verify: true },
          { label: V('Registrace', 'Registration'), value: V('obvykle není nutná; po odpojení normalizovat okna/střechu (XENTRY / dle příručky)', 'usually not required; after disconnecting normalise windows/roof (XENTRY / per manual)'), verify: true }
        ],
        notes: [
          { level: 'warning', text: V('Vůz s ABC: po odpojení baterie a delším stání může podvozek poklesnout. Pod vůz nikdy bez stojanů.', 'ABC car: after disconnecting and standing for a long time the suspension may sink. Never get under the car without stands.') },
          { level: 'info', text: V('Ověřte ve WIS, zda vůz nemá i pomocnou baterii (některé verze).', 'Check in WIS whether the car also has an auxiliary battery (some versions).'), verify: true }
        ],
        steps: { locate: { body: V('Baterie je v kufru vpravo pod krytem podlahy. Pro měření a nabíjení můžete použít i startovací body v motorovém prostoru.', 'The battery is in the boot, right, under the floor cover. For measuring and charging you can also use the jump points in the engine bay.') } }
      },
      'volvo-xc60-b4': {
        status: 'caution',
        specs: [
          { label: V('12V baterie', '12 V battery'), value: V('AGM; umístění dle příručky / VIDA', 'AGM; location per manual / VIDA'), verify: true },
          { label: V('48V baterie', '48 V battery'), value: V('samostatný systém – tento návod se jí netýká', 'separate system – not covered by this tutorial') },
          { label: V('Registrace', 'Registration'), value: V('výměna baterie se registruje diagnostikou (VIDA)', 'battery replacement is registered with a scan tool (VIDA)'), verify: true }
        ],
        notes: [
          { level: 'warning', text: V('Pracujte jen na **12V baterii**. 48V systém (baterie, ISGM, DC/DC) má vlastní postup odpojení – viz návod „48V mild hybrid“.', 'Work only on the **12 V battery**. The 48 V system (battery, ISGM, DC/DC) has its own disconnection procedure – see the "48 V mild hybrid" tutorial.') },
          { level: 'info', text: V('Vůz může mít v kufru i pomocnou baterii / jinou konfiguraci dle roku – ověřte ve VIDA.', 'The car may also have an auxiliary battery in the boot / a different setup depending on the year – check VIDA.'), verify: true },
          { level: 'caution', text: V('Před odpojením nechte vůz „usnout“ (zamknout, klíč daleko, vyčkat dle VIDA), jinak mohou vzniknout chybové kódy.', 'Before disconnecting let the car go to sleep (lock it, key far away, wait per VIDA), otherwise fault codes may be stored.'), verify: true }
        ]
      },
      'skoda-octavia-rs-tdi': {
        status: 'ok',
        specs: [
          { label: V('Umístění', 'Location'), value: V('motorový prostor vlevo, pod krytem', 'engine bay left, under a cover') },
          { label: V('Typ', 'Type'), value: V('dle štítku (standard / EFB u start-stop verzí)', 'per label (standard / EFB on start-stop versions)'), verify: true },
          { label: V('Kódování', 'Coding'), value: V('u vozů se správou energie kódování baterie (VCDS, řídicí jednotka 61) – ověřit', 'on cars with energy management, battery coding (VCDS, control unit 61) – verify'), verify: true }
        ],
        notes: [{ level: 'info', text: V('Na + pólu bývá pojistkový držák – při sundávání svorky dejte pozor na kabely.', 'A fuse holder often sits on the + post – mind the cables when removing the clamp.'), verify: true }]
      },
      'toyota-gr-yaris': {
        status: 'ok',
        specs: [
          { label: V('Umístění', 'Location'), value: V('kufr (kvůli rozložení hmotnosti)', 'boot (for weight distribution)'), verify: true },
          { label: V('Typ / velikost', 'Type / size'), value: V('dle štítku / katalogu Toyota', 'per label / Toyota catalogue'), verify: true },
          { label: V('Registrace', 'Registration'), value: V('obvykle není nutná', 'usually not required'), verify: true }
        ],
        notes: [{ level: 'info', text: V('Po odpojení inicializujte automatické stahování oken (podržet spínač) a zkontrolujte nastavení hodin.', 'After disconnecting re-initialise the auto windows (hold the switch) and check the clock.') }],
        steps: { locate: { body: V('Baterie je v kufru (ověřte pod podlahou). Pro startování z jiného vozu použijte startovací body v motorovém prostoru, pokud jsou – viz uživatelská příručka.', 'The battery is in the boot (check under the floor). For jump-starting use the jump points in the engine bay if fitted – see the owner\'s manual.'), notes: [{ level: 'info', text: V('Umístění ověřte – nechceme hádat.', 'Verify the location – we do not want to guess.'), verify: true }] } }
      },
      'citroen-jumper-22hdi': {
        status: 'ok',
        specs: [
          { label: V('Umístění', 'Location'), value: V('pod podlahou kabiny u řidiče (pod krytem) – ověřit', 'under the cab floor, driver side (under a cover) – verify'), verify: true },
          { label: V('Kapacita', 'Capacity'), value: V('větší dieselová baterie (cca 90–110 Ah) – dle štítku', 'larger diesel battery (approx. 90–110 Ah) – per label'), verify: true }
        ],
        notes: [
          { level: 'warning', text: V('Velká baterie je těžká (přes 25 kg). Pracujte ve dvou nebo s popruhem.', 'A big battery is heavy (over 25 kg). Work with a helper or use a strap.') },
          { level: 'info', text: V('Diesel potřebuje silnou baterii (žhavení + vysoká komprese) – slabou baterii poznáte v zimě jako první.', 'A diesel needs a strong battery (glow plugs + high compression) – a weak battery shows up first in winter.') }
        ]
      }
    }
  });
})(window.STU);
