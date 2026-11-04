/* Tutorial: Wheel alignment basics – toe, camber, caster, home toe check, when a shop is required. */
(function (S) {
  'use strict';
  var V = function (cs, en) { return { cs: cs, en: en }; };

  S.registerTutorial({
    id: 'alignment',
    level: 2,
    thumb: 'alignment.strings',
    time: V('1–2 hod. (kontrola)', '1–2 h (check)'),
    title: V('Geometrie kol – základy a kontrola sbíhavosti', 'Wheel alignment basics and toe check'),
    summary: V('Sbíhavost, odklon, záklon. Příznaky, kontrola provázkem doma a kdy musí do dílny.', 'Toe, camber, caster. Symptoms, a string-line check at home and when a workshop is required.'),
    intro: V(
      'Geometrie určuje, jak kola stojí vůči vozu a silnici. Špatná geometrie **ničí pneumatiky**, vůz táhne do strany a zhoršuje se stabilita při brzdění.\n\nDoma můžete **orientačně zkontrolovat sbíhavost** metodou s provázkem. Přesné seřízení po opravě podvozku ale patří na **měřicí stav v dílně**.',
      'Alignment defines how the wheels sit relative to the car and the road. Bad alignment **destroys tyres**, makes the car pull and worsens braking stability.\n\nAt home you can **roughly check toe** with the string-line method. Precise adjustment after suspension work belongs on an **alignment rig in a workshop**.'
    ),
    safety: [
      { level: 'warning', text: V('Seřizování řízení „od oka“ může vůz udělat nestabilním. Domácí úprava sbíhavosti slouží **jen k bezpečnému dojetí do dílny**.', 'Adjusting the steering by eye can make the car unstable. A home toe adjustment is **only to get safely to a workshop**.') },
      { level: 'warning', text: V('Kontramatice tyčí řízení musí být po jakékoli úpravě dotažené momentem. Povolená tyč se může za jízdy protočit.', 'Tie-rod lock nuts must be torqued after any adjustment. A loose rod can turn while driving.') },
      { level: 'caution', text: V('Nejdřív vylučte jiné příčiny: tlaky pneu, vůle v podvozku, ohnuté díly, brzdy. Geometrie na opotřebeném podvozku nevydrží.', 'First rule out other causes: tyre pressures, suspension play, bent parts, brakes. An alignment on worn suspension will not last.') },
      { level: 'info', text: V('Vozy s kamerami a radarem (asistenti) potřebují po geometrii často **kalibraci ADAS**.', 'Cars with cameras and radar (driver assists) often need an **ADAS calibration** after an alignment.') }
    ],
    tools: [
      V('Rovná podlaha (garáž)', 'A level floor (garage)'),
      V('Pneuměřič a kompresor', 'Tyre gauge and compressor'),
      V('2–4 stojánky (cihly / stativy), pevný provázek nebo vlasec', '2–4 stands (bricks / tripods), strong string or fishing line'),
      V('Svinovací metr, ocelové pravítko', 'Tape measure, steel ruler'),
      V('Klíče na kontramatice tyčí řízení (jen při úpravě)', 'Spanners for tie-rod lock nuts (only when adjusting)'),
      V('Papír a tužka', 'Paper and pencil')
    ],
    parts: [V('Nic – jen měření', 'Nothing – measuring only')],
    finalChecks: [
      V('Kontramatice dotažené, manžety řízení nezkroucené', 'Lock nuts tight, rack boots not twisted'),
      V('Volant rovně při jízdě rovně', 'Steering wheel straight when driving straight'),
      V('Vůz netáhne na rovné silnici', 'No pull on a flat road'),
      V('Po opravě podvozku: protokol z měřicího stavu', 'After suspension work: printout from an alignment rig')
    ],
    steps: [
      {
        id: 'angles', anim: 'alignment.angles',
        title: V('Sbíhavost, odklon, záklon', 'Toe, camber, caster'),
        body: V(
          '- **Sbíhavost (toe):** kola při pohledu shora mírně k sobě / od sebe. Nejčastěji se rozladí a nejvíc ojíždí pneu.\n- **Odklon (camber):** naklonění kola zepředu. Ovlivňuje ojetí vnitřní / vnější hrany.\n- **Záklon (caster):** sklon osy řízení ze strany – vrací volant do přímého směru.',
          '- **Toe:** wheels seen from above point slightly in / out. Most often out of spec and the biggest tyre killer.\n- **Camber:** wheel tilt seen from the front. Affects inner / outer edge wear.\n- **Caster:** steering-axis tilt seen from the side – returns the steering to centre.'
        )
      },
      {
        id: 'symptoms', anim: 'alignment.symptoms',
        title: V('Příznaky špatné geometrie', 'Symptoms of bad alignment'),
        body: V('- Ojetá vnitřní / vnější hrana pneumatiky, „pilovité“ ojetí\n- Vůz táhne do strany, volant není rovně\n- Pískání pneumatik v zatáčkách\n\nTáhne jen při brzdění? Spíše **brzdy**. Táhne po nárazu do obrubníku? Může být **ohnutý díl**.', '- Worn inner / outer tyre edge, feathered wear\n- The car pulls, the steering wheel is off-centre\n- Tyres squeal in bends\n\nPulls only when braking? More likely **brakes**. Pulls after hitting a kerb? Possibly a **bent part**.'),
        notes: [{ level: 'warning', text: V('Po nárazu kolem do obrubníku zkontrolujte ráfek, pneu a podvozek – ohnutá ramena nebo tyče řízení se nesmí rovnat.', 'After hitting a kerb check the rim, tyre and suspension – bent arms or tie rods must never be straightened.') }]
      },
      {
        id: 'shop', anim: 'alignment.shop',
        title: V('Kdy MUSÍ do dílny', 'When it MUST go to a workshop'),
        body: V('Po výměně **čepů řízení, tyčí řízení, ramen, vzpěr / tlumičů, nápravy** nebo po nehodě vždy nechte geometrii změřit a seřídit na měřicím stavu. Doma zjistíte jen hrubou chybu sbíhavosti.', 'After replacing **tie-rod ends, tie rods, arms, struts / dampers, an axle** or after an accident always have the alignment measured and set on a rig. At home you only find a gross toe error.')
      },
      {
        id: 'prep', anim: 'alignment.prep',
        title: V('Příprava vozu', 'Prepare the car'),
        body: V('Rovná podlaha, tlaky pneumatik podle štítku, vůz nezatížený (nebo dle postupu výrobce), kola rovně, volant na střed. Popojeďte pár metrů rovně, ať se podvozek „usadí“.', 'Level floor, tyre pressures per the placard, car unladen (or per the maker\'s procedure), wheels straight, steering centred. Roll a few metres straight so the suspension settles.')
      },
      {
        id: 'strings', anim: 'alignment.strings',
        title: V('Napněte provázky kolem vozu', 'Set up strings around the car'),
        body: V('Po obou stranách vozu napněte provázek ve výšce středu kol, rovnoběžně s vozem. Vzdálenost od středu předního a zadního náboje musí být stejná – pak je provázek rovnoběžný s osou vozu.', 'Run a string on both sides at hub-centre height, parallel to the car. The distance to the front and rear hub centres must be equal – then the string is parallel to the car\'s centreline.'),
        notes: [{ level: 'tip', text: V('Přední a zadní rozchod se liší – rovnoběžnost proto nastavujte podle středů nábojů, ne podle pneumatik.', 'Front and rear track differ – set parallelism by the hub centres, not the tyres.') }]
      },
      {
        id: 'measure', anim: 'alignment.measure',
        title: V('Změřte vzdálenost k ráfku', 'Measure to the rim'),
        body: V('Na každém předním kole změřte vzdálenost od provázku k **přední (A)** a **zadní (B)** hraně ráfku ve výšce středu. Měřte na ráfku, ne na pneumatice.', 'On each front wheel measure from the string to the **front (A)** and **rear (B)** rim edge at hub height. Measure on the rim, not the tyre.')
      },
      {
        id: 'calc', anim: 'alignment.calc',
        title: V('Vyhodnoťte sbíhavost', 'Work out the toe'),
        body: V('B − A > 0 = **sbíhavost** (toe-in), A > B = **rozbíhavost** (toe-out). Součet obou stran porovnejte s hodnotou výrobce (obvykle v desetinách milimetru až pár milimetrech, nebo ve stupních).', 'B − A > 0 = **toe-in**, A > B = **toe-out**. Compare the sum of both sides with the maker\'s value (usually tenths of a millimetre to a few millimetres, or in degrees).'),
        specs: [{ label: V('Hodnota sbíhavosti', 'Toe value'), value: V('dle tabulky výrobce', 'per the maker\'s table'), verify: true }],
        notes: [{ level: 'info', text: V('Domácí měření má přesnost asi ±1 mm – stačí k odhalení hrubé chyby.', 'Home measurement is accurate to about ±1 mm – enough to find a gross error.') }]
      },
      {
        id: 'adjust', anim: 'alignment.adjust',
        title: V('Úprava sbíhavosti (jen nouzově)', 'Adjusting toe (emergency only)'),
        body: V('Povolte kontramatici tyče řízení a tyčí otočte po malých krocích, **na obou stranách stejně**, aby volant zůstal rovně. Kontramatici dotáhněte, manžetu řízení nezkruťte. Pak co nejdřív na měřicí stav.', 'Loosen the tie-rod lock nut and turn the rod in small steps, **equally on both sides** so the steering wheel stays straight. Tighten the lock nut, do not twist the rack boot. Then get to an alignment rig as soon as possible.'),
        specs: [{ label: V('Kontramatice', 'Lock nut'), value: V('dle příručky', 'per manual'), verify: true }],
        notes: [{ level: 'warning', text: V('Odklon a záklon doma neupravujte.', 'Do not adjust camber or caster at home.') }]
      },
      {
        id: 'test', anim: 'alignment.test',
        title: V('Zkušební jízda', 'Test drive'),
        body: V('Na rovné silnici: vůz jede rovně, volant je rovně a v zatáčce se sám vrací. Po pár týdnech zkontrolujte, zda se pneumatiky neojíždějí nerovnoměrně.', 'On a flat road: the car runs straight, the steering wheel is centred and self-centres after a bend. After a few weeks check the tyres for uneven wear.')
      }
    ],
    vehicles: {
      'mb-cl500-c216': {
        status: 'caution',
        specs: [
          { label: V('Výška při měření', 'Height when measuring'), value: V('ABC v normální úrovni, postup dle WIS', 'ABC at normal level, procedure per WIS'), verify: true },
          { label: V('Seřízení', 'Adjustment'), value: V('Víceprvková náprava – excentry, jen na měřicím stavu', 'Multi-link axle – eccentrics, only on an alignment rig'), verify: true }
        ],
        notes: [{ level: 'warning', text: V('Před měřením nechte ABC ustálit (motor běží / vůz chvíli stojí dle WIS). Měření ve špatné výšce dá chybné hodnoty.', 'Let the ABC settle before measuring (engine running / car standing per WIS). Measuring at the wrong height gives wrong values.'), verify: true }]
      },
      'volvo-xc60-b4': {
        status: 'caution',
        specs: [
          { label: V('Výška při měření', 'Height when measuring'), value: V('Vzduchový podvozek v normální výšce (VIDA)', 'Air suspension at normal height (VIDA)'), verify: true },
          { label: V('Po geometrii', 'After alignment'), value: V('Kalibrace kamery a radaru (VIDA)', 'Camera and radar calibration (VIDA)') }
        ],
        notes: [
          { level: 'danger', text: V('Po seřízení geometrie musí následovat **kalibrace ADAS** – jinak nemusí správně fungovat nouzové brzdění a asistent jízdy v pruhu.', 'An alignment must be followed by an **ADAS calibration** – otherwise emergency braking and lane assist may not work correctly.') }
        ],
        extraSteps: [{ after: 'test', step: {
          id: 'adas', anim: 'alignment.adas',
          title: V('Kalibrace ADAS (XC60)', 'ADAS calibration (XC60)'),
          body: V('Kamera za čelním sklem a radar vpředu se kalibrují podle osy jízdy vozu. Po geometrii (a po výměně skla / nárazníku) nechte provést kalibraci ve VIDA na kalibračním stanovišti.', 'The windscreen camera and front radar are calibrated to the car\'s thrust line. After an alignment (and after a windscreen / bumper replacement) have them calibrated in VIDA at a calibration station.'),
          notes: [{ level: 'warning', text: V('Svítí hlášení o nedostupném asistentovi? Kalibrace nebyla provedena.', 'Driver-assist unavailable message? The calibration was not done.') }]
        } }]
      },
      'skoda-octavia-rs-tdi': {
        status: 'ok',
        specs: [
          { label: V('Seřiditelné', 'Adjustable'), value: V('Vpředu sbíhavost (tyče řízení); vzadu dle nápravy – ověřit', 'Front toe (tie rods); rear depending on axle – verify'), verify: true },
          { label: V('Hodnoty', 'Values'), value: V('dle ELSA (RS podvozek)', 'per ELSA (RS suspension)'), verify: true }
        ]
      },
      'toyota-gr-yaris': {
        status: 'ok',
        specs: [{ label: V('Hodnoty', 'Values'), value: V('dle TIS (sériové); okruhové nastavení dle zkušeností', 'per TIS (stock); track settings by experience'), verify: true }],
        notes: [{ level: 'info', text: V('Okruhová geometrie (víc záporného odklonu) zrychluje ojetí vnitřních hran na silnici.', 'Track alignment (more negative camber) speeds up inner-edge wear on the road.') }]
      },
      'citroen-jumper-22hdi': {
        status: 'ok',
        specs: [{ label: V('Hodnoty', 'Values'), value: V('dle příručky PSA/Fiat (nezatížený vůz)', 'per PSA/Fiat manual (unladen)'), verify: true }],
        notes: [{ level: 'info', text: V('Dlouhý rozvor: provázek musí být dost dlouhý a pevně napnutý. Měřte s prázdným nákladovým prostorem.', 'Long wheelbase: the string must be long enough and taut. Measure with the cargo area empty.') }]
      }
    }
  });
})(window.STU);
