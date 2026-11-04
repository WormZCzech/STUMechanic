/* Tutorial: Alternator & starter – diagnosis and replacement. */
(function (S) {
  'use strict';
  var V = function (cs, en) { return { cs: cs, en: en }; };

  S.registerTutorial({
    id: 'alternator-starter',
    level: 2,
    thumb: 'alternator-starter.belt',
    time: V('1–4 hod. (dle vozu)', '1–4 h (depends on the car)'),
    title: V('Alternátor a startér: diagnostika a výměna', 'Alternator & starter: diagnosis and replacement'),
    summary: V('Změřit dobíjení a startování, rozlišit baterii / alternátor / startér a bezpečně je vyměnit.', 'Measure charging and cranking, tell battery / alternator / starter apart and replace them safely.'),
    intro: V(
      'Alternátor dobíjí baterii za jízdy, startér roztáčí motor. Když jeden z nich selže, vypadá to často jako „vadná baterie“. **Nejdřív měřte, pak měňte** – ušetříte za zbytečné díly.',
      'The alternator charges the battery while driving, the starter cranks the engine. When one fails it often looks like a "bad battery". **Measure first, replace second** – you will save on unnecessary parts.'
    ),
    safety: [
      { level: 'danger', text: V('**Kabel B+ na alternátoru a startéru je stále pod napětím** a často bez pojistky. Před jakoukoli prací odpojte mínus baterie.', '**The B+ cable on the alternator and starter is always live** and often unfused. Disconnect the battery minus before any work.') },
      { level: 'danger', text: V('Startér a alternátor se mění na **studeném motoru na stojanech** – nikdy pod vozem jen na heveru.', 'Replace the starter and alternator on a **cold engine with the car on stands** – never under a car on a jack alone.') },
      { level: 'warning', text: V('Měření za chodu motoru: ruce, vlasy, oblečení a kabely dál od řemenů a ventilátoru.', 'Measuring with the engine running: keep hands, hair, clothes and leads away from belts and the fan.') },
      { level: 'warning', text: V('Startér (3–7 kg) a alternátor (5–8 kg) jsou těžké – při povolení posledního šroubu je podepřete.', 'The starter (3–7 kg) and alternator (5–8 kg) are heavy – support them when removing the last bolt.') },
      { level: 'caution', text: V('Kupujte díl podle VIN / kódu motoru – liší se proud alternátoru (A), řemenice i konektory.', 'Buy the part by VIN / engine code – alternator current (A), pulley and connectors differ.') }
    ],
    tools: [V('Multimetr', 'Multimeter'), V('Sada hlavic a ráčna, prodloužení', 'Socket set, ratchet, extensions'), V('Klíč na napínák řemene', 'Belt tensioner tool'), V('Momentový klíč', 'Torque wrench'), V('Hever + stojany (startér zespodu)', 'Jack + stands (starter from below)'), V('Rukavice, brýle', 'Gloves, glasses')],
    parts: [V('Alternátor nebo startér (dle VIN)', 'Alternator or starter (by VIN)'), V('Drážkový řemen (doporučeno při výměně alternátoru)', 'Poly-V belt (recommended when replacing the alternator)'), V('Případně napínák', 'Tensioner if needed')],
    finalChecks: [
      V('Matice B+ dotažená, krytka nasazená', 'B+ nut tight, cap fitted'),
      V('Konektory zacvaknuté', 'Connectors clicked in'),
      V('Řemen správně veden a napnut', 'Belt routed and tensioned correctly'),
      V('Napětí za chodu 13,8–14,7 V, kontrolka baterie nesvítí', 'Running voltage 13.8–14.7 V, battery light off'),
      V('Startování svižné, bez drnčení', 'Cranking brisk, no grinding')
    ],
    steps: [
      { id: 'symptoms', anim: 'alternator-starter.symptoms', title: V('Příznaky: baterie, alternátor nebo startér?', 'Symptoms: battery, alternator or starter?'),
        body: V('**Alternátor:** svítí kontrolka baterie za jízdy, slabnou světla, auto se vybíjí, pískání ložiska.\n\n**Startér:** jen cvaknutí, drnčení, pomalé nebo žádné protočení **i s dobrou baterií**.\n\n**Baterie:** pomalé protočení po stání, hlavně v zimě, ale po nastartování vše funguje.', '**Alternator:** battery light while driving, dimming lights, the car keeps going flat, bearing whine.\n\n**Starter:** just a click, grinding, slow or no cranking **even with a good battery**.\n\n**Battery:** slow cranking after standing, especially in winter, but everything works once running.') },
      { id: 'voltage', anim: 'alternator-starter.voltage', title: V('Změřte dobíjení', 'Measure charging'),
        body: V('Motor běží. Napětí na baterii **13,8–14,7 V**. Zapněte světla, ventilátor a vyhřívání skla – mělo by zůstat **nad cca 13,5 V**. Pod 13 V = nedobíjí; nad 15 V = vadný regulátor (ničí baterii).', 'Engine running. Battery voltage **13.8–14.7 V**. Switch on the lights, blower and rear heater – it should stay **above approx. 13.5 V**. Below 13 V = not charging; above 15 V = faulty regulator (kills the battery).'),
        notes: [{ level: 'info', text: V('Vozy s inteligentním dobíjením mohou napětí měnit (12,5–15 V) podle stavu baterie – výsledek posuzujte s diagnostikou.', 'Cars with smart charging may vary the voltage (12.5–15 V) with battery state – judge the result with a scan tool.') }] },
      { id: 'belt', anim: 'alternator-starter.belt', title: V('Zkontrolujte řemen', 'Check the belt'),
        body: V('**Motor vypnutý.** Prasklý, lesklý (prokluzující) nebo volný řemen způsobí nedobíjení a pískání. Zkontrolujte i napínák a kladky – nesmí drhnout ani mít vůli.', '**Engine off.** A cracked, glazed (slipping) or loose belt causes no-charge and squealing. Also check the tensioner and idlers – they must not grind or have play.') },
      { id: 'crankTest', anim: 'alternator-starter.crankTest', title: V('Test startéru', 'Starter test'),
        body: V('S nabitou baterií měřte napětí při startování. Pokud napětí drží kolem 10 V, ale motor se netočí, vina je na straně **startéru, jeho kabelu, kostření nebo relé**. Pokud napětí spadne hluboko (pod 9 V), je problém baterie nebo spoje.', 'With a charged battery measure the voltage while cranking. If it holds around 10 V but the engine does not turn, the fault is the **starter, its cable, ground or relay**. If it drops deep (below 9 V), the battery or connections are the problem.'),
        notes: [{ level: 'tip', text: V('Zkontrolujte i kostřicí pásek motor–karoserie – zkorodovaný způsobí stejné příznaky.', 'Also check the engine-to-body ground strap – a corroded one causes the same symptoms.') }] },
      { id: 'bplus', anim: 'alternator-starter.bplus', title: V('Odpojte baterii', 'Disconnect the battery'),
        body: V('Zapalování vypnout, klíč pryč, **odpojit mínus baterie** (viz návod Autobaterie). Teprve pak sundejte krytku a matici kabelu B+.', 'Ignition off, key away, **disconnect the battery minus** (see the Battery tutorial). Only then remove the cap and the B+ cable nut.'),
        notes: [{ level: 'danger', text: V('Klíč na B+ při připojené baterii + dotyk kostry = oblouk, roztavený klíč, popáleniny.', 'A spanner on B+ with the battery connected + touching ground = arc, molten spanner, burns.') }] },
      { id: 'altOut', anim: 'alternator-starter.altOut', title: V('Vyjměte alternátor', 'Remove the alternator'),
        body: V('1. Vyfoťte vedení řemene.\n2. Povolte napínák a sundejte řemen.\n3. Odpojte konektor a kabel B+.\n4. Povolte upevňovací šrouby, alternátor podepřete a vyjměte.', '1. Photograph the belt routing.\n2. Release the tensioner and remove the belt.\n3. Unplug the connector and the B+ cable.\n4. Undo the mounting bolts, support the alternator and lift it out.'),
        notes: [{ level: 'warning', text: V('Napínák povolujte pomalu a držte klíč pevně – pružina je silná.', 'Release the tensioner slowly and hold the tool firmly – the spring is strong.') }] },
      { id: 'starterOut', anim: 'alternator-starter.starterOut', title: V('Vyjměte startér', 'Remove the starter'),
        body: V('Startér je na přírubě převodovky. Často je přístupný zespodu – vůz na stojanech (viz návod Bezpečné zvednutí). Odpojte silový kabel a ovládací vodič, povolte šrouby a startér vysuňte.', 'The starter sits on the gearbox flange. It is often reached from below – car on stands (see the Safe lifting tutorial). Disconnect the main cable and the control wire, undo the bolts and slide the starter out.'),
        notes: [{ level: 'warning', text: V('Pod vozem: startér při povolení posledního šroubu může spadnout – držte ho, chraňte obličej.', 'Under the car: the starter can drop when the last bolt comes out – hold it, protect your face.') }] },
      { id: 'fit', anim: 'alternator-starter.fit', title: V('Montáž nového dílu', 'Fit the new part'),
        body: V('Montáž v opačném pořadí. Šrouby a **matici B+ dotáhněte předepsaným momentem** (měkký závit – nepřetáhnout), konektory zacvakněte. Řemen nasaďte podle fotky a napínák pomalu povolte.', 'Fit in reverse order. Tighten the bolts and the **B+ nut to the specified torque** (soft thread – do not over-tighten), click the connectors in. Fit the belt per your photo and release the tensioner slowly.') },
      { id: 'verify', anim: 'alternator-starter.verify', title: V('Kontrola', 'Check'),
        body: V('Připojte baterii (plus první). Nastartujte – startování svižné, bez drnčení. Změřte 13,8–14,7 V. Kontrolka baterie musí zhasnout.', 'Reconnect the battery (plus first). Start the engine – brisk cranking, no grinding. Measure 13.8–14.7 V. The battery light must go out.') }
    ],
    vehicles: {
      'mb-cl500-c216': {
        status: 'caution',
        specs: [
          { label: V('Alternátor', 'Alternator'), value: V('dle VIN (vysoký proud kvůli výbavě)', 'by VIN (high output due to equipment)'), verify: true },
          { label: V('Startér', 'Starter'), value: V('V8 – přístup omezený, postup dle WIS', 'V8 – limited access, procedure per WIS'), verify: true },
          { label: V('Baterie', 'Battery'), value: V('v kufru – odpojit tam', 'in the boot – disconnect it there'), verify: true }
        ],
        notes: [{ level: 'warning', text: V('Výměna startéru u V8 může vyžadovat demontáž dalších dílů – nejdřív si projděte WIS.', 'Replacing the starter on the V8 may require removing other parts – check WIS first.'), verify: true }]
      },
      'volvo-xc60-b4': {
        status: 'pro',
        specs: [
          { label: V('Startér-generátor', 'Starter-generator'), value: V('ISGM – 48V díl na řemenu (místo klasického alternátoru)', 'ISGM – 48 V belt-driven part (instead of a conventional alternator)') },
          { label: V('12V startér', '12 V starter'), value: V('zda je samostatný 12V startér, ověřte ve VIDA', 'whether there is a separate 12 V starter, check VIDA'), verify: true }
        ],
        notes: [
          { level: 'danger', text: V('ISGM je součástí 48V systému. Před prací odpojte 12V **i 48V** systém přesně podle VIDA (viz návod 48V mild hybrid). Doporučeno pro dílnu – návod není zablokován.', 'The ISGM is part of the 48 V system. Before working disconnect the 12 V **and 48 V** system exactly per VIDA (see the 48 V mild hybrid tutorial). Workshop recommended – nothing is locked.') },
          { level: 'info', text: V('Po výměně ISGM je obvykle nutná kalibrace / programování ve VIDA.', 'After replacing the ISGM calibration / programming in VIDA is usually required.'), verify: true }
        ],
        extraSteps: [{ after: 'bplus', step: { id: 'volvo48', anim: 'mhev-48v.disconnect', title: V('Odpojte 48V systém (VIDA)', 'Disconnect the 48 V system (VIDA)'), body: V('ISGM visí na 48V. Postupujte podle VIDA: 12V mínus, pak 48V odpojení, ověření beznapěťového stavu (živý–mrtvý–živý). Viz návod „48V mild hybrid“.', 'The ISGM runs on 48 V. Follow VIDA: 12 V minus, then 48 V disconnection, prove dead (live–dead–live). See the "48 V mild hybrid" tutorial.'), notes: [{ level: 'danger', text: V('48V zkrat = stovky ampér, oblouk a popáleniny.', '48 V short = hundreds of amps, arc and burns.') }] } }]
      },
      'skoda-octavia-rs-tdi': {
        status: 'caution',
        specs: [
          { label: V('Alternátor', 'Alternator'), value: V('vpředu na motoru, přístup shora/zespodu – dle ELSA', 'front of the engine, access from above/below – per ELSA'), verify: true },
          { label: V('Startér', 'Starter'), value: V('na přírubě převodovky – dle ELSA', 'on the gearbox flange – per ELSA'), verify: true }
        ],
        notes: [{ level: 'info', text: V('U některých verzí je na alternátoru volnoběžná řemenice (OAP) – ta se opotřebí a způsobuje drnčení; měňte ji s alternátorem.', 'Some versions have an overrunning pulley (OAP) on the alternator – it wears and rattles; replace it with the alternator.'), verify: true }]
      },
      'toyota-gr-yaris': {
        status: 'caution',
        specs: [
          { label: V('Alternátor / startér', 'Alternator / starter'), value: V('přístup a postup dle TIS', 'access and procedure per TIS'), verify: true },
          { label: V('Baterie', 'Battery'), value: V('v kufru – odpojit tam', 'in the boot – disconnect it there'), verify: true }
        ]
      },
      'citroen-jumper-22hdi': {
        status: 'caution',
        specs: [
          { label: V('Alternátor / startér', 'Alternator / starter'), value: V('dle VIN (výbava, klimatizace) – postup PSA / Fiat dokumentace', 'by VIN (equipment, A/C) – procedure per PSA / Fiat documentation'), verify: true }
        ],
        notes: [{ level: 'info', text: V('Dodávka je vysoká – na startér i alternátor se často dostanete zespodu bez zvedání, ale bezpečněji na rampě / stojanech (min. 3 t).', 'The van is tall – you can often reach the starter and alternator from below without lifting, but it is safer on a ramp / stands (min. 3 t).') }]
      }
    }
  });
})(window.STU);
