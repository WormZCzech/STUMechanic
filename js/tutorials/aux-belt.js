/* Tutorial: Auxiliary (poly-V / serpentine) belt, tensioner and idlers. 3D scenes: js/3d/scenes/aux-belt.js */
(function (S) {
  'use strict';
  var V = function (cs, en) { return { cs: cs, en: en }; };

  S.registerTutorial({
    id: 'aux-belt',
    level: 2,
    thumb: 'aux-belt.overview',
    time: V('45–120 min', '45–120 min'),
    title: V('Drážkový řemen příslušenství, napínák a kladky', 'Auxiliary (poly-V) belt, tensioner and idlers'),
    summary: V('Kontrola, výměna drážkového řemene, napínáku a kladek. Pískání, praskliny a volnoběžka alternátoru.', 'Inspecting and replacing the poly-V belt, tensioner and idlers. Squeal, cracks and the alternator decoupler.'),
    intro: V(
      'Drážkový (víceklínový) řemen pohání **alternátor, kompresor klimatizace, čerpadlo posilovače** a u některých motorů i **vodní pumpu**. Když praskne, přestane se nabíjet baterie, může ztuhnout řízení a motor se může přehřát. Pokud řemen přeskočí nebo se zamotá, může poškodit i **rozvody**.\n\nTento návod se týká řemene příslušenství, **ne rozvodového řemene** – ten má vlastní návod „Výměna rozvodů“.',
      'The poly-V (serpentine) belt drives the **alternator, A/C compressor, power-steering pump** and on some engines the **water pump**. If it snaps, the battery stops charging, steering can go heavy and the engine can overheat. If it jumps off or shreds, it can even damage the **timing drive**.\n\nThis tutorial covers the auxiliary belt, **not the timing belt** – that one has its own "Timing belt replacement" tutorial.'
    ),
    safety: [
      { level: 'danger', text: V('Pracujte jen s **vypnutým motorem, klíčem mimo dosah a odpojenou baterií**. Řemen běžícího motoru vtáhne prsty, rukavice, vlasy i oblečení.', 'Work only with the **engine off, key out of range and battery disconnected**. A running belt pulls in fingers, gloves, hair and clothing.') },
      { level: 'warning', text: V('Napínák má velmi silnou pružinu. Povolujte ho plynule správným klíčem a nikdy ho nenechte „cvaknout“ zpět – může zlomit prsty i napínák.', 'The tensioner has a very strong spring. Release it smoothly with the correct tool and never let it snap back – it can break fingers and the tensioner.') },
      { level: 'warning', text: V('Motor jen **vychladlý** – výfukové svody, turbo a chladič mohou mít přes 100 °C.', 'Engine **cold** only – exhaust manifold, turbo and radiator can exceed 100 °C.') },
      { level: 'caution', text: V('Motor protáčejte jen **ve směru otáčení** klíčem na šroubu řemenice klikového hřídele, nikdy startérem s rukama u řemene.', 'Turn the engine only **in its running direction** with a wrench on the crank pulley bolt, never with the starter while your hands are near the belt.') },
      { level: 'info', text: V('U napříč uložených motorů bývá přístup přes pravý podběh – vůz zvedejte podle návodu „Bezpečné zvednutí vozu“.', 'On transverse engines access is often through the right wheel arch – lift the car following the "Safely lifting the car" tutorial.') }
    ],
    tools: [
      V('Klíč na napínák (plochý „serpentine“ klíč nebo ráčna s nástavcem)', 'Tensioner tool (flat serpentine tool or ratchet with extension)'),
      V('Aretační kolík / vrták správného průměru', 'Locking pin / drill bit of the right diameter'),
      V('Svítilna, zrcátko', 'Torch, inspection mirror'),
      V('Mobil s fotoaparátem (vedení řemene!)', 'Phone camera (belt routing!)'),
      V('Momentový klíč', 'Torque wrench'),
      V('Rukavice, brýle', 'Gloves, glasses')
    ],
    parts: [
      V('Drážkový řemen dle VIN (počet žeber a délka)', 'Poly-V belt by VIN (number of ribs and length)'),
      V('Napínák a vodicí kladky – doporučeno měnit spolu s řemenem', 'Tensioner and idlers – recommended to replace with the belt'),
      V('Volnoběžka alternátoru (OAP/OAD), je-li vadná', 'Alternator decoupler pulley (OAP/OAD) if faulty')
    ],
    finalChecks: [
      V('Řemen sedí ve všech drážkách na každé řemenici', 'Belt sits in all grooves on every pulley'),
      V('Ukazatel napínáku v toleranci, aretační kolík vyndaný', 'Tensioner pointer within tolerance, locking pin removed'),
      V('Žádné nářadí v motorovém prostoru, baterie připojená', 'No tools in the engine bay, battery reconnected'),
      V('Kontrolka dobíjení po nastartování zhasla', 'Charging warning light went out after start'),
      V('Řemen nepíská ani při zapnuté klimatizaci a natočeném volantu', 'Belt does not squeal even with A/C on and steering at full lock'),
      V('Po 50–100 km řemen znovu zkontrolovat', 'Re-check the belt after 50–100 km')
    ],
    steps: [
      {
        id: 'why', anim: 'aux-belt.overview',
        title: V('Co řemen dělá a kdy ho měnit', 'What the belt does and when to replace it'),
        body: V('Měňte řemen podle servisního plánu nebo dřív, pokud:\n- **píská** (hlavně za studena, při zapnuté klimatizaci nebo při natočení volantu),\n- má **příčné trhliny**, lesklá (sklovitá) žebra, roztřepené okraje,\n- **kmitá** nebo napínák výrazně poskakuje.\n\nNapínák a kladky se opotřebí podobně rychle jako řemen – je rozumné je měnit společně.',
          'Replace the belt per the service schedule or earlier if it:\n- **squeals** (especially when cold, with A/C on or at full steering lock),\n- has **cross cracks**, shiny (glazed) ribs or frayed edges,\n- **flutters** or the tensioner bounces noticeably.\n\nTensioners and idlers wear about as fast as the belt – it makes sense to replace them together.'),
        notes: [{ level: 'info', text: V('Uspořádání řemenic v animaci je schematické. Skutečné vedení najdete na štítku pod kapotou nebo v dílenské příručce.', 'The pulley layout in the animation is schematic. The real routing is on the label under the bonnet or in the workshop manual.') }]
      },
      {
        id: 'prep', anim: 'aux-belt.prep',
        title: V('Příprava: studený motor, baterie, přístup', 'Preparation: cold engine, battery, access'),
        body: V('1. Nechte motor vychladnout.\n2. Vypněte zapalování, klíč dejte mimo dosah vozu.\n3. Odpojte **minus pól baterie**.\n4. Zajistěte si přístup: kryt motoru, případně pravý podběh (kolo dolů, plastový kryt podběhu).',
          '1. Let the engine cool down.\n2. Switch the ignition off and keep the key out of range of the car.\n3. Disconnect the **battery negative**.\n4. Get access: engine cover, possibly the right wheel arch (wheel off, plastic arch liner).'),
        notes: [{ level: 'warning', text: V('Při práci z podběhu musí vůz stát na stojanech – viz návod Bezpečné zvednutí vozu.', 'When working through the wheel arch the car must be on stands – see Safely lifting the car.') }]
      },
      {
        id: 'inspect', anim: 'aux-belt.inspect',
        title: V('Prohlédněte řemen', 'Inspect the belt'),
        body: V('Prohlédněte **žebrovou stranu** po celé délce – motor pootáčejte klíčem po kouscích. Hledejte příčné trhliny, chybějící kousky žeber, lesklé plochy a roztřepené boky. Zkontrolujte i řemenice – rez nebo vyběhané drážky zkracují životnost nového řemene.',
          'Inspect the **ribbed side** along its full length – turn the engine bit by bit with a wrench. Look for cross cracks, missing rib chunks, glazed areas and frayed edges. Check the pulleys too – rust or worn grooves shorten the life of a new belt.'),
        notes: [{ level: 'tip', text: V('Olej nebo chladicí kapalina na řemeni = najděte a opravte únik dřív, než dáte nový řemen.', 'Oil or coolant on the belt = find and fix the leak before fitting a new belt.') }]
      },
      {
        id: 'photo', anim: 'aux-belt.photo',
        title: V('Vyfoťte vedení řemene', 'Photograph the belt routing'),
        body: V('Než cokoli povolíte, **vyfoťte vedení řemene** z více úhlů nebo si ho nakreslete. Zapamatujte si, které řemenice běží po žebrové a které po hladké (zadní) straně řemene.',
          'Before releasing anything, **photograph the routing** from several angles or sketch it. Note which pulleys run on the ribbed and which on the smooth (back) side of the belt.')
      },
      {
        id: 'release', anim: 'aux-belt.release',
        title: V('Povolte napínák a zajistěte ho', 'Release and lock the tensioner'),
        body: V('Nasaďte klíč na šestihran / čtyřhran napínáku a plynule ho otočte ve směru povolení. Když se otvory srovnají, zajistěte napínák **aretačním kolíkem nebo vrtákem**.',
          'Fit the tool on the tensioner hex / square and turn it smoothly in the release direction. When the holes line up, lock the tensioner with a **locking pin or drill bit**.'),
        notes: [
          { level: 'warning', text: V('Klíč držte pevně a ruku mějte mimo dráhu ramene – při sklouznutí napínák udeří.', 'Hold the tool firmly and keep your hand out of the arm\'s path – if it slips the tensioner strikes back.') },
          { level: 'caution', text: V('Nepoužívejte prodlužovací trubku – zlomíte rameno napínáku.', 'Do not use an extension pipe – you will break the tensioner arm.') }
        ]
      },
      {
        id: 'remove', anim: 'aux-belt.remove',
        title: V('Sundejte starý řemen', 'Remove the old belt'),
        body: V('Řemen stáhněte nejdřív z **hladké, snadno dostupné kladky**, pak z ostatních řemenic. Pokud napínák měníte, teprve teď ho povolte (pomalu!) a odšroubujte.',
          'Slip the belt off a **smooth, easy-to-reach idler** first, then off the other pulleys. If you are replacing the tensioner, only now release it (slowly!) and unbolt it.')
      },
      {
        id: 'pulleys', anim: 'aux-belt.pulleys',
        title: V('Zkontrolujte kladky a napínák', 'Check the idlers and tensioner'),
        body: V('Protočte rukou každou vodicí kladku i kladku napínáku. Musí se točit **tiše, hladce a bez vůle**. Zkuste s nimi viklat – žádná vůle. Napínák nesmí drhnout ani se zasekávat a jeho tlumení musí být plynulé.',
          'Spin every idler and the tensioner pulley by hand. They must turn **quietly, smoothly and without play**. Try to rock them – no play. The tensioner must not stick or bind and its damping must be smooth.'),
        notes: [{ level: 'tip', text: V('Při výměně řemene je výhodné měnit napínák i kladky – práce je stejná a ušetříte druhou demontáž.', 'When replacing the belt it pays to replace the tensioner and idlers – same labour, no second job later.') }]
      },
      {
        id: 'decoupler', anim: 'aux-belt.decoupler',
        title: V('Volnoběžka alternátoru', 'Alternator decoupler pulley'),
        body: V('Mnoho alternátorů má **volnoběžnou řemenici** (OAP/OAD). Bez řemene: jedním směrem musí řemenice unášet hřídel, druhým se volně protáčet. Drží v obou směrech, drhne nebo je hlučná = vadná – způsobuje kmitání řemene a hluk.',
          'Many alternators have a **decoupler (freewheel) pulley** (OAP/OAD). With the belt off: in one direction it must drive the shaft, in the other it must freewheel. Locks both ways, feels rough or noisy = faulty – it makes the belt flutter and rattle.'),
        notes: [{ level: 'caution', text: V('Výměna volnoběžky vyžaduje speciální nástavec (drážkový/Torx) – nepovolujte ji kleštěmi.', 'Replacing the decoupler needs a special spline/Torx bit – never undo it with pliers.') }]
      },
      {
        id: 'fit', anim: 'aux-belt.fit',
        title: V('Nasaďte nový řemen', 'Fit the new belt'),
        body: V('Podle fotky veďte řemen přes všechny řemenice, **naposledy přes hladkou kladku**. Na každé řemenici zkontrolujte, že **žebra přesně sedí v drážkách** – posunutí o jedno žebro řemen rychle zničí.',
          'Route the belt over all pulleys following your photo, **the smooth idler last**. On every pulley check the **ribs sit exactly in the grooves** – being one rib off destroys the belt quickly.')
      },
      {
        id: 'tension', anim: 'aux-belt.tension',
        title: V('Napněte řemen', 'Tension the belt'),
        body: V('Klíčem napínák mírně přitáhněte, vyndejte kolík a **pomalu** ho přiložte na řemen. U napínáků s ukazatelem musí být značka v toleranci. Pak protočte motor klíčem dvakrát ve směru otáčení a znovu zkontrolujte usazení řemene.',
          'Take the load with the tool, pull the pin and let the tensioner onto the belt **slowly**. On tensioners with a pointer the mark must be within tolerance. Then turn the engine twice by hand in its running direction and check the belt seating again.'),
        specs: [{ label: V('Šrouby napínáku / kladek', 'Tensioner / idler bolts'), value: V('dle příručky', 'per manual') }]
      },
      {
        id: 'test', anim: 'aux-belt.test',
        title: V('Zkušební chod', 'Test run'),
        body: V('Odklidte nářadí, připojte baterii a nastartujte. Sledujte řemen **z bezpečné vzdálenosti**: musí běžet rovně, napínák se smí jen mírně chvět. Zapněte klimatizaci a natočte volant – řemen nesmí pískat. Kontrolka dobíjení musí zhasnout.',
          'Clear the tools, reconnect the battery and start the engine. Watch the belt **from a safe distance**: it must run straight, the tensioner may only flutter slightly. Switch on the A/C and turn the steering – the belt must not squeal. The charging light must go out.'),
        notes: [{ level: 'danger', text: V('Při běžícím motoru nesahejte do motorového prostoru a mějte svázané vlasy a volné oblečení.', 'With the engine running, keep your hands out of the engine bay and tie back hair and loose clothing.') }]
      }
    ],
    vehicles: {
      'mb-cl500-c216': {
        status: 'caution',
        specs: [
          { label: V('Pohon řemenem', 'Belt-driven'), value: V('alternátor, kompresor A/C, tandemové čerpadlo (posilovač + ABC), vodní pumpa', 'alternator, A/C compressor, tandem pump (steering + ABC), water pump'), verify: true },
          { label: V('Řemen', 'Belt'), value: V('drážkový, délka a počet žeber dle VIN', 'poly-V, length and ribs by VIN') },
          { label: V('Napínák', 'Tensioner'), value: V('automatický, vpředu na motoru', 'automatic, at the engine front'), verify: true }
        ],
        notes: [
          { level: 'danger', text: V('Řemen pohání i **čerpadlo ABC** – bez řemene motor nestartujte, podvozek ABC by klesl a hrozí poškození čerpadla.', 'The belt also drives the **ABC pump** – never run the engine without the belt, the ABC suspension would drop and the pump could be damaged.'), verify: true },
          { level: 'info', text: V('Dlouhý řemen V8 s mnoha řemenicemi – fotka vedení je nutnost. Kladky na M273 bývají po letech hlučné.', 'Long V8 belt with many pulleys – a routing photo is essential. Idlers on the M273 often get noisy with age.') }
        ]
      },
      'volvo-xc60-b4': {
        status: 'pro',
        specs: [
          { label: V('Pohon řemenem', 'Belt-driven'), value: V('48V startér-generátor (ISGM), kompresor A/C', '48V starter-generator (ISGM), A/C compressor'), verify: true },
          { label: V('Napínák', 'Tensioner'), value: V('speciální napínák pro ISGM (vysoká síla) – nářadí dle VIDA', 'special ISGM tensioner (high force) – tool per VIDA'), verify: true }
        ],
        notes: [
          { level: 'danger', text: V('Řemen u mild hybridu **startuje motor** přes 48V startér-generátor. Při připojeném 48V systému se motor může roztočit (start-stop). Před prací odpojte **12V i 48V systém dle VIDA**.', 'On the mild hybrid the belt **starts the engine** via the 48V starter-generator. With the 48V system connected the engine can crank (start-stop). Before working disconnect **both 12V and 48V per VIDA**.') },
          { level: 'warning', text: V('Napínák ISGM má mnohem vyšší sílu než běžný napínák – používejte předepsané nářadí, ne improvizaci.', 'The ISGM tensioner is much stronger than a normal one – use the specified tool, no improvising.'), verify: true }
        ],
        tools: [V('Volvo nářadí pro napínák ISGM (dle VIDA)', 'Volvo ISGM tensioner tool (per VIDA)')],
        extraSteps: [
          { after: 'prep', step: { id: 'isg', anim: 'aux-belt.isg',
            title: V('48V systém: odpojit dle VIDA', '48V system: disconnect per VIDA'),
            body: V('Postupujte přesně podle VIDA: odpojení 12V baterie a 48V systému (servisní odpojení / konektor), vyčkání předepsané doby. Teprve pak sahejte na řemen nebo startér-generátor.', 'Follow VIDA exactly: disconnect the 12V battery and the 48V system (service disconnect / connector), wait the specified time. Only then touch the belt or the starter-generator.'),
            notes: [{ level: 'danger', text: V('Vodiče 48V nezkratujte nářadím – vysoký proud = oblouk a popáleniny.', 'Never short 48V cables with tools – high current = arcing and burns.') }] } }
        ]
      },
      'skoda-octavia-rs-tdi': {
        status: 'ok',
        specs: [
          { label: V('Pohon řemenem', 'Belt-driven'), value: V('alternátor (s volnoběžkou), kompresor A/C', 'alternator (with decoupler), A/C compressor'), verify: true },
          { label: V('Přístup', 'Access'), value: V('shora a z pravého podběhu', 'from above and the right wheel arch'), verify: true }
        ],
        notes: [
          { level: 'info', text: V('Při výměně rozvodů se drážkový řemen sundává také – je ideální ho vyměnit současně.', 'The aux belt has to come off for the timing belt job anyway – an ideal time to replace it.') },
          { level: 'tip', text: V('Vadná volnoběžka alternátoru je u TDI častá příčina kmitání řemene a hluku na volnoběh.', 'A faulty alternator decoupler is a common cause of belt flutter and idle noise on TDIs.') }
        ]
      },
      'toyota-gr-yaris': {
        status: 'ok',
        specs: [
          { label: V('Pohon řemenem', 'Belt-driven'), value: V('alternátor, kompresor A/C (ověřit, zda i vodní pumpa)', 'alternator, A/C compressor (verify whether also the water pump)'), verify: true },
          { label: V('Přístup', 'Access'), value: V('stísněný prostor – postup dle TIS', 'tight bay – procedure per TIS'), verify: true }
        ],
        notes: [{ level: 'info', text: V('Po okruhovém ježdění kontrolujte řemen častěji – teplo a vysoké otáčky ho zatěžují.', 'After track days check the belt more often – heat and high revs stress it.') }]
      },
      'citroen-jumper-22hdi': {
        status: 'ok',
        specs: [
          { label: V('Pohon řemenem', 'Belt-driven'), value: V('alternátor, kompresor A/C (je-li), čerpadlo posilovače (ověřit)', 'alternator, A/C compressor (if fitted), power-steering pump (verify)'), verify: true },
          { label: V('Přístup', 'Access'), value: V('obvykle z pravého podběhu (kolo a kryt podběhu dolů)', 'usually through the right wheel arch (wheel and arch liner off)'), verify: true }
        ],
        notes: [
          { level: 'warning', text: V('Těžká dodávka: zvedejte heverem a stojany s nosností min. 3 t (viz návod Bezpečné zvednutí vozu).', 'Heavy van: lift with a jack and stands rated at least 3 t (see Safely lifting the car).') },
          { level: 'info', text: V('Vedení se liší podle výbavy (s / bez klimatizace) – řemen objednejte podle VIN a vyfoťte původní vedení.', 'Routing differs by equipment (with / without A/C) – order the belt by VIN and photograph the original routing.') }
        ]
      }
    }
  });
})(window.STU);
