/* Tutorial: Diagnosing manual gearbox & clutch noises (manual-gearbox cars only). */
(function (S) {
  'use strict';
  var V = function (cs, en) { return { cs: cs, en: en }; };

  S.registerTutorial({
    id: 'gearbox-noise',
    level: 2,
    only: ['skoda-octavia-rs-tdi', 'toyota-gr-yaris', 'citroen-jumper-22hdi'],
    thumb: 'gearbox-noise.overview',
    time: V('30–60 min (diagnostika)', '30–60 min (diagnosis)'),
    title: V('Zvuky manuální převodovky a spojky – diagnostika', 'Manual gearbox & clutch noises – diagnosis'),
    summary: V('Vytí ložisek, hluk vypínacího ložiska, chrastění dvouhmotu, drhnutí synchronů, vyskakování rychlosti – co je co a co dál.', 'Bearing whine, release bearing noise, dual-mass rattle, synchro crunch, jumping out of gear – what is what and what next.'),
    intro: V(
      'Zvuky převodovky se dají často rozlišit **podle toho, kdy vznikají**: na volnoběh v neutrálu, se sešlápnutou spojkou, při zátěži v určitém převodu nebo při řazení. Tento návod vás provede jednoduchými testy, které **nic nerozebírají** – pomůžou vám odhadnout příčinu a mluvit s dílnou.\n\nVždy začněte **kontrolou oleje** v převodovce.',
      'Gearbox noises can often be told apart **by when they happen**: at idle in neutral, with the clutch pressed, under load in a particular gear or when shifting. This tutorial guides you through simple tests that **take nothing apart** – they help you estimate the cause and talk to a workshop.\n\nAlways start by **checking the gearbox oil**.'
    ),
    safety: [
      { level: 'danger', text: V('Testy za jízdy dělejte jen na **bezpečném, prázdném místě** a soustřeďte se na řízení – poslouchat může spolujezdec.', 'Do driving tests only in a **safe, empty place** and concentrate on driving – let a passenger do the listening.') },
      { level: 'danger', text: V('Testy na stojícím voze: parkovací brzda, rovina, **nikdo před ani za vozem**. Nikdy pod vůz s běžícím motorem.', 'Stationary tests: parking brake on, level ground, **nobody in front of or behind the car**. Never get under the car with the engine running.') },
      { level: 'warning', text: V('Pokud rychlost vyskakuje nebo se převodovka zadírá, **nejezděte** – hrozí zablokování kol nebo ztráta pohonu.', 'If a gear jumps out or the gearbox seizes, **do not drive** – the wheels can lock or drive can be lost.') },
      { level: 'warning', text: V('Horký výfuk a převodovka – při poslechu u motoru dejte pozor na řemeny a ventilátor.', 'Hot exhaust and gearbox – when listening at the engine, keep clear of belts and the fan.') },
      { level: 'info', text: V('Tento návod je diagnostický. Oprava převodovky (ložiska, synchrony) je práce pro specializovanou dílnu.', 'This tutorial is diagnostic. Gearbox repair (bearings, synchros) is work for a specialist workshop.') }
    ],
    tools: [
      V('Mechanický stetoskop (nebo dlouhý šroubovák u ucha)', 'Mechanic\'s stethoscope (or a long screwdriver to the ear)'),
      V('Svítilna', 'Torch'),
      V('Telefon na nahrávání zvuku / videa', 'Phone to record sound / video'),
      V('Pomocník (spolujezdec)', 'A helper (passenger)'),
      V('Vybavení na kontrolu oleje (viz Oleje převodovky)', 'Oil check equipment (see Drivetrain oils)')
    ],
    parts: [V('Nic – jen diagnostika (případně převodový olej na doplnění)', 'Nothing – diagnosis only (gear oil to top up if needed)')],
    finalChecks: [
      V('Zapsali jste: kdy zvuk vzniká, v jakém převodu, při jaké rychlosti', 'You noted: when the noise occurs, in which gear, at what speed'),
      V('Nahrávka zvuku pro dílnu', 'Sound recording for the workshop'),
      V('Olej v převodovce zkontrolován / doplněn', 'Gearbox oil checked / topped up'),
      V('Vyloučena ložiska kol, klouby poloos a uložení motoru', 'Wheel bearings, CV joints and engine mounts ruled out')
    ],
    steps: [
      {
        id: 'overview', anim: 'gearbox-noise.overview',
        title: V('Co v převodovce dělá hluk', 'What makes noise in a gearbox'),
        body: V(
          '- **Ložiska hřídelí** – vytí / hučení, mění se s otáčkami\n- **Ozubená kola** – vytí jen v určitém převodu, pod zátěží nebo při brzdění motorem\n- **Synchrony** – drhnutí / skřípání při řazení\n- **Vypínací ložisko spojky** – zvuk při sešlápnuté spojce\n- **Dvouhmotový setrvačník** – chrastění na volnoběh, ťukání při vypínání motoru',
          '- **Shaft bearings** – whine / hum that changes with speed\n- **Gears** – whine only in a specific gear, under load or on overrun\n- **Synchros** – crunch / grind when shifting\n- **Clutch release bearing** – noise with the clutch pedal pressed\n- **Dual-mass flywheel** – rattle at idle, knock when switching off'
        ),
        notes: [{ level: 'info', text: V('Jeden zvuk může mít více příčin – kombinujte testy níže.', 'One noise can have several causes – combine the tests below.') }]
      },
      {
        id: 'oil', anim: 'gearbox-noise.oil',
        title: V('Nejdřív olej', 'Oil first'),
        body: V(
          'Málo oleje nebo starý olej je nejčastější a nejlevnější příčina vytí a drhnutí. Zkontrolujte hladinu u spodní hrany plnicího otvoru a stav oleje podle návodu **Oleje převodovky a diferenciálů**.',
          'Low or old oil is the most common and cheapest cause of whine and crunching. Check the level at the lower edge of the fill hole and the oil condition per the **Gearbox & differential oils** tutorial.'
        ),
        notes: [
          { level: 'warning', text: V('Kovové třísky na magnetu výpustného šroubu = vnitřní opotřebení. Další jízda poškození zhorší.', 'Metal chips on the drain plug magnet = internal wear. Further driving makes it worse.') },
          { level: 'caution', text: V('Jen olej se správnou specifikací (GL-4 vs GL-5!).', 'Only oil with the correct spec (GL-4 vs GL-5!).') }
        ]
      },
      {
        id: 'matrix', anim: 'gearbox-noise.matrix',
        title: V('Kdy zvuk vzniká? Tabulka', 'When does it happen? The table'),
        body: V(
          'Zapište si přesně, **kdy** zvuk slyšíte. Podle toho hledejte v dalších krocích:\n- neutrál + volnoběh, spojka puštěná → **vstupní ložisko** (krok 4)\n- objeví se při sešlápnutí spojky → **vypínací ložisko** (krok 5)\n- chrastění na volnoběh / ťuknutí při vypnutí → **dvouhmot** (krok 6)\n- vytí v určitém převodu → **kola / ložiska** (krok 7)\n- skřípání při řazení → **synchrony / spojka** (krok 8)',
          'Note exactly **when** you hear the noise. Then look in the following steps:\n- neutral + idle, clutch released → **input bearing** (step 4)\n- appears when pressing the clutch → **release bearing** (step 5)\n- rattle at idle / knock on switch-off → **dual-mass** (step 6)\n- whine in a specific gear → **gears / bearings** (step 7)\n- crunch when shifting → **synchros / clutch** (step 8)'
        )
      },
      {
        id: 'input', anim: 'gearbox-noise.input',
        title: V('Hučí v neutrálu a ztichne se spojkou', 'Hums in neutral and goes quiet with the clutch'),
        body: V(
          'Stojící vůz, neutrál, volnoběh: hučení / vrčení. **Sešlápnete spojku → zvuk zmizí.** Se sešlápnutou spojkou se vstupní hřídel zastaví – typicky **ložisko vstupní hřídele**. Může to být i opotřebený olej.',
          'Car stationary, neutral, idle: humming / growling. **Press the clutch → the noise goes away.** With the clutch pressed the input shaft stops – typically the **input shaft bearing**. It can also be worn-out oil.'
        ),
        notes: [{ level: 'info', text: V('Pokud se zvuk zhoršuje rychle, nečekejte – ložisko se může rozpadnout a poškodit kola.', 'If the noise gets worse quickly, do not wait – the bearing can break up and damage the gears.') }]
      },
      {
        id: 'release', anim: 'gearbox-noise.release',
        title: V('Zvuk jen se sešlápnutou spojkou', 'Noise only with the clutch pressed'),
        body: V(
          'Stojící vůz, volnoběh: zvuk se **objeví až při sešlápnutí** spojky (pískání, cvrlikání, hrčení). Typicky **vypínací ložisko** (u spojek s hydraulickým válcem i samotný válec). Mění se spolu se spojkou – neodkládejte, s opotřebeným ložiskem hrozí poškození přítlačného talíře.',
          'Car stationary, idle: the noise **appears only when you press** the clutch (squeal, chirp, rattle). Typically the **release bearing** (with a concentric slave cylinder, the cylinder itself). It is replaced together with the clutch – do not postpone, a worn bearing can damage the pressure plate.'
        )
      },
      {
        id: 'dmf', anim: 'gearbox-noise.dmf',
        title: V('Chrastění na volnoběh a ťuknutí při vypnutí', 'Rattle at idle and knock on switch-off'),
        body: V(
          'Kovové **chrastění na volnoběh**, které po sešlápnutí spojky zeslábne, a **ťuknutí / klepnutí při vypínání motoru** ukazuje na **dvouhmotový setrvačník**. Typické jsou i vibrace při rozjezdu. Dvouhmot se kontroluje vůlí po vyjmutí převodovky – viz návod **Spojka a dvouhmot**.',
          'A metallic **rattle at idle** that gets weaker when you press the clutch, and a **knock / clunk when switching off** point to the **dual-mass flywheel**. Judder when pulling away is also typical. The DMF is checked for play with the gearbox removed – see the **Clutch & dual-mass flywheel** tutorial.'
        ),
        notes: [{ level: 'warning', text: V('Rozpadlý dvouhmot může zničit startér, převodovku i blok – neodkládejte.', 'A disintegrating DMF can destroy the starter, gearbox and block – do not postpone.') }]
      },
      {
        id: 'whine', anim: 'gearbox-noise.whine',
        title: V('Vytí v určitém převodu', 'Whine in a specific gear'),
        body: V(
          'Za jízdy projeďte všechny převody stejnou rychlostí, **pod plynem** i **brzděním motorem**. Vytí jen v jednom převodu = opotřebené **ozubené kolo / ložisko** toho převodu. Vytí ve všech převodech, mění se s rychlostí jízdy = **ložisko diferenciálu nebo výstupní hřídele** – ale také ložisko kola!',
          'While driving, go through all gears at the same speed, **under power** and **on overrun**. Whine in one gear only = worn **gear / bearing** of that gear. Whine in all gears that changes with road speed = **differential or output shaft bearing** – but also a wheel bearing!'
        ),
        notes: [{ level: 'tip', text: V('Nahrajte zvuk telefonem položeným na tunelu u řadicí páky.', 'Record the sound with a phone placed on the tunnel next to the gear lever.') }]
      },
      {
        id: 'synchro', anim: 'gearbox-noise.synchro',
        title: V('Skřípání při řazení', 'Crunching when shifting'),
        body: V(
          'Skřípání při rychlém řazení určitého převodu = opotřebený **synchron** toho převodu. Pokud skřípe **zpátečka a 1. i na stojícím voze** po chvíli čekání, spojka možná **nevypíná úplně** (vzduch v hydraulice, opotřebení) – zkontrolujte kapalinu spojky / odvzdušnění.',
          'Crunching when shifting into a particular gear quickly = worn **synchro** of that gear. If **reverse and 1st crunch even when stationary** after waiting a moment, the clutch may **not be releasing fully** (air in the hydraulics, wear) – check the clutch fluid / bleed.'
        ),
        notes: [{ level: 'caution', text: V('Dočasně pomůže pomalejší řazení s krátkou pauzou v neutrálu – opravu ale neodkládejte.', 'Shifting more slowly with a short pause in neutral helps for now – but do not postpone the repair.') }]
      },
      {
        id: 'jumpout', anim: 'gearbox-noise.jumpout',
        title: V('Vyskakování rychlosti', 'Jumping out of gear'),
        body: V(
          'Rychlost sama vyskočí do neutrálu (často pod plynem nebo při brzdění motorem): opotřebené **zubové spojky / řadicí vidlice / aretace** – nebo **povolená uložení motoru** a táhla řazení. Zkontrolujte nejdřív uložení motoru a řazení (levnější).',
          'A gear pops out into neutral on its own (often under power or on overrun): worn **dog teeth / shift fork / detents** – or **loose engine mounts** and shift linkage. Check the mounts and linkage first (cheaper).'
        ),
        notes: [{ level: 'danger', text: V('Vyskakování rychlosti je nebezpečné – vůz může nečekaně ztratit brzdění motorem. Jezděte jen nezbytně.', 'Jumping out of gear is dangerous – the car can suddenly lose engine braking. Drive only when necessary.') }]
      },
      {
        id: 'ruleout', anim: 'gearbox-noise.ruleout',
        title: V('Vylučte jiné zdroje', 'Rule out other sources'),
        body: V(
          'Stejně jako převodovka hučí i **ložisko kola** (mění se v zatáčkách – zatížení), **klouby poloos** (cvakání v rejdu) a **uložení motoru** (ťukání při změně plynu). Se stetoskopem poslouchejte na skříni převodovky, u kol a u uložení.',
          'A **wheel bearing** hums just like a gearbox (changes in corners – load), **CV joints** click on full lock and **engine mounts** clunk on throttle changes. Listen with a stethoscope on the gearbox case, at the wheels and at the mounts.'
        ),
        notes: [{ level: 'danger', text: V('Se stetoskopem u běžícího motoru jen na stojícím voze, ruce a vlasy mimo řemeny.', 'Use the stethoscope at a running engine only with the car stationary, hands and hair clear of belts.') }]
      },
      {
        id: 'next', anim: 'gearbox-noise.next',
        title: V('Co dál', 'What next'),
        body: V(
          'S poznámkami a nahrávkou zajděte do **dílny specializované na převodovky**. Často se vyplatí repase převodovky (ložiska, synchrony) místo nové. Spojku, vypínací ložisko a dvouhmot měňte **společně**.',
          'Take your notes and recording to a **gearbox specialist**. Rebuilding the gearbox (bearings, synchros) is often better value than a new one. Replace the clutch, release bearing and dual-mass flywheel **together**.'
        )
      }
    ],
    vehicles: {
      'skoda-octavia-rs-tdi': {
        status: 'ok',
        specs: [
          { label: V('Převodovka', 'Gearbox'), value: V('6st. manuál 02Q', '6-speed manual 02Q') },
          { label: V('Setrvačník', 'Flywheel'), value: V('dvouhmotový (DMF)', 'dual-mass (DMF)') },
          { label: V('Olej', 'Oil'), value: V('G 052 171 (75W-90 GL-4) – ověřit', 'G 052 171 (75W-90 GL-4) – verify'), verify: true }
        ],
        notes: [
          { level: 'info', text: V('Naftový motor se 350 Nm zatěžuje dvouhmot – chrastění na volnoběh a ťuknutí při vypínání jsou u tohoto vozu častým příznakem.', 'The 350 Nm diesel loads the DMF – idle rattle and a switch-off knock are common symptoms on this car.') },
          { level: 'info', text: V('U převodovek 02Q se uvádí opotřebení ložisek (vytí v 5./6. převodu) – ověřte u specialisty.', 'Bearing wear (whine in 5th/6th) is reported on 02Q gearboxes – verify with a specialist.'), verify: true }
        ]
      },
      'toyota-gr-yaris': {
        status: 'ok',
        specs: [
          { label: V('Převodovka', 'Gearbox'), value: V('6st. manuál (iMT) + GR-FOUR', '6-speed manual (iMT) + GR-FOUR') },
          { label: V('Setrvačník', 'Flywheel'), value: V('dle TIS', 'per TIS'), verify: true }
        ],
        notes: [
          { level: 'info', text: V('U pohonu GR-FOUR může vytí pocházet i z přední / zadní diferenciálu nebo spojky pohonu – zkontrolujte jejich oleje (viz Oleje převodovky a diferenciálů).', 'On GR-FOUR a whine can also come from the front / rear differential or the drive coupling – check their oils (see Gearbox & differential oils).') },
          { level: 'warning', text: V('Po okruhové akci s přehřátým olejem se zvuky mohou objevit dočasně – přesto olej vyměňte.', 'After a track day with overheated oil, noises can appear temporarily – change the oil anyway.') }
        ]
      },
      'citroen-jumper-22hdi': {
        status: 'ok',
        specs: [
          { label: V('Převodovka', 'Gearbox'), value: V('6st. manuál (ověřit typ)', '6-speed manual (verify type)'), verify: true },
          { label: V('Setrvačník', 'Flywheel'), value: V('dvouhmot / jednohmot – ověřit', 'dual-mass / single-mass – verify'), verify: true }
        ],
        notes: [
          { level: 'info', text: V('U převodovek dodávek X250 se uvádí opotřebení ložisek (hučení / vytí, zvlášť při zatížení) – ověřte u specialisty.', 'Bearing wear (hum / whine, especially when loaded) is reported on X250 van gearboxes – verify with a specialist.'), verify: true },
          { level: 'tip', text: V('Testujte s prázdnou i naloženou dodávkou – zatížení zvuky ložisek zesiluje.', 'Test with the van empty and loaded – load makes bearing noises louder.') }
        ]
      }
    }
  });
})(window.STU);
