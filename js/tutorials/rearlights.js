/* Tutorial: Rear lights – bulb replacement and whole lamp replacement. */
(function (S) {
  'use strict';
  var V = function (cs, en) { return { cs: cs, en: en }; };

  var LED_REAR = {
    id: 'led', anim: 'lights.ledUnit',
    title: V('LED zadní světla: žárovky se nemění', 'LED rear lamps: no bulbs to change'),
    body: V(
      'Zadní světla vašeho vozu jsou **LED** – bez vyměnitelných žárovek. Při poruše:\n\n1. Zkontrolujte pojistku a konektor (zelenkavá koroze = vlhkost).\n2. Přečtěte chybové kódy diagnostikou.\n3. Teprve pak měňte **celé světlo**.',
      'Your car\'s rear lamps are **LED** – no replaceable bulbs. If something is out:\n\n1. Check the fuse and the connector (greenish corrosion = moisture).\n2. Read fault codes with a scan tool.\n3. Only then replace the **whole lamp**.'
    ),
    notes: [
      { level: 'warning', text: V('Nesvítící brzdové světlo je vážná bezpečnostní závada – vůz za vámi nepozná, že brzdíte. Opravte co nejdříve.', 'A failed brake light is a serious safety defect – the car behind cannot see you braking. Fix it as soon as possible.') }
    ]
  };

  S.registerTutorial({
    id: 'rearlights',
    level: 1,
    thumb: 'lights.test',
    time: V('10 min – 1 h', '10 min – 1 h'),
    title: V('Zadní světla: žárovky a výměna světla', 'Rear lights: bulbs and lamp replacement'),
    summary: V('Výměna žárovek v držáku, demontáž celého zadního světla, kontrola těsnění a test všech funkcí.', 'Replacing bulbs in the carrier, removing the whole rear lamp, checking the seal and testing all functions.'),
    intro: V(
      'Zadní světla jsou jednoduchá práce, ale **brzdová světla a blinkry jsou bezpečnostní prvky**. Po každém zásahu vyzkoušejte všechny funkce s pomocníkem.',
      'Rear lights are an easy job, but **brake lights and indicators are safety items**. After any work, test every function with a helper.'
    ),
    safety: [
      { level: 'warning', text: V('Nefunkční brzdová světla nebo blinkry = vysoké riziko nehody zezadu. S vadným brzdovým světlem nejezděte.', 'Faulty brake lights or indicators = high risk of a rear-end crash. Do not drive with a failed brake light.') },
      { level: 'caution', text: V('Před výměnou vypněte světla a zapalování – zabráníte zkratu a spálení pojistky.', 'Switch off the lights and ignition before replacing bulbs – prevents shorts and blown fuses.') },
      { level: 'caution', text: V('Používejte **přesně** předepsaný typ a příkon žárovky. Jiný příkon nebo LED náhrada vyvolá chybu kontroly žárovek (CAN-bus), rychlé blikání blinkru nebo neprojde STK.', 'Use **exactly** the specified bulb type and wattage. A different wattage or LED substitute triggers a bulb-check fault (CAN-bus), fast indicator flashing or an STK failure.') },
      { level: 'caution', text: V('Plastové matice a úchyty světel nepřetahujte – světlo praskne a začne zatékat.', 'Do not over-tighten the plastic nuts and mounts – the lamp cracks and starts leaking.') },
      { level: 'info', text: V('Žárovka v horkém světle pálí – nechte vychladnout pár minut.', 'A bulb in a hot lamp burns – let it cool for a few minutes.') }
    ],
    tools: [
      V('Rukavice', 'Gloves'),
      V('Plastové páčidlo na obložení', 'Plastic trim tool'),
      V('Ráčna s hlavicemi 8–10 mm (matice světla)', 'Ratchet with 8–10 mm sockets (lamp nuts)'),
      V('Šroubovák / Torx', 'Screwdriver / Torx'),
      V('Svítilna', 'Flashlight'),
      V('Pomocník (test brzdových světel)', 'Helper (to check brake lights)')
    ],
    parts: [
      V('Žárovky dle typu (P21W, P21/5W, PY21W, W5W… – dle vozu)', 'Bulbs by type (P21W, P21/5W, PY21W, W5W… – per car)'),
      V('Při výměně celého světla: nové světlo, příp. těsnění', 'For lamp replacement: new lamp, seal if needed')
    ],
    finalChecks: [
      V('Brzdová světla (obě + třetí) svítí', 'Brake lights (both + third) work'),
      V('Blinkry vlevo / vpravo blikají normální rychlostí', 'Left / right indicators flash at normal speed'),
      V('Obrysová světla, couvání, zadní mlhovka a osvětlení SPZ svítí', 'Tail lights, reverse, rear fog and plate light work'),
      V('Na přístrojové desce není hlášena porucha žárovky', 'No bulb fault message on the dashboard'),
      V('Těsnění v pořádku, obložení kufru zpět a dobře zacvaklé', 'Seal OK, boot trim back and clipped in'),
      V('Po prvním dešti / mytí zkontrolovat vlhkost ve světle a v kufru', 'After the first rain / car wash check for moisture in the lamp and boot')
    ],
    steps: [
      {
        id: 'identify', anim: 'lights.rearBulbs',
        title: V('Zjistěte typ žárovek nebo LED', 'Identify bulb types or LED'),
        body: V(
          'Typy žárovek najdete v uživatelské příručce (kapitola výměna žárovek) nebo přímo na staré žárovce. Moderní vozy mají často zadní světla **LED** – tam se mění celé světlo.',
          'You will find bulb types in the owner\'s manual (bulb replacement chapter) or printed on the old bulb. Modern cars often have **LED** rear lamps – then the whole lamp is replaced.'
        ),
        notes: [
          { level: 'tip', text: V('Starou žárovku vezměte s sebou do obchodu – vyhnete se záměně P21W a P21/5W.', 'Take the old bulb to the shop – avoids mixing up P21W and P21/5W.') }
        ]
      },
      {
        id: 'find', anim: 'lights.test',
        title: V('Najděte, co přesně nesvítí', 'Find exactly what is out'),
        body: V(
          'S pomocníkem projděte všechny funkce: brzda, blinkry, couvání, mlhovka, obrysová. Když nemáte pomocníka, couvněte ke garážovým vratům nebo výloze a sledujte odraz.\n\nNesvítí-li **víc funkcí najednou** nebo **obě strany**, příčinou bude spíš pojistka, spínač brzdových světel nebo konektor než žárovka.',
          'With a helper, go through all functions: brake, indicators, reverse, fog, tail. Without a helper, reverse up to a garage door or shop window and watch the reflection.\n\nIf **several functions** or **both sides** are out, the cause is more likely a fuse, brake light switch or connector than a bulb.'
        ),
        notes: [
          { level: 'info', text: V('Rychlé blikání blinkru obvykle znamená prasklou žárovku blinkru na té straně.', 'Fast indicator flashing usually means a blown indicator bulb on that side.') }
        ]
      },
      {
        id: 'access', anim: 'lights.rearCarrier',
        title: V('Otevřete přístup v kufru', 'Open the access in the boot'),
        body: V(
          'Ve většině vozů je za světlem **krytka nebo odklopný díl v bočním obložení kufru**. Někdy je nutné povolit spony a odtáhnout celé obložení. Pak stiskněte západky **držáku žárovek** a vytáhněte ho.',
          'In most cars there is a **cover or flap in the boot side trim** behind the lamp. Sometimes the trim clips have to be released and the whole trim pulled back. Then press the **bulb carrier** latches and pull it out.'
        ),
        notes: [
          { level: 'caution', text: V('Plastové spony obložení jsou křehké, zvlášť v zimě. Páčte plastovým nástrojem u spony, ne za okraj.', 'Plastic trim clips are brittle, especially in winter. Pry with a plastic tool next to the clip, not at the edge.') }
        ]
      },
      {
        id: 'bulb', anim: 'lights.bayonet',
        title: V('Vyměňte žárovku', 'Replace the bulb'),
        body: V(
          '**Bajonet (P21W, PY21W, P21/5W):** zatlačte a pootočte proti směru hodin, vytáhněte. Novou zasuňte, zatlačte a pootočte.\n\n**Zasouvací (W5W, W16W):** vytáhněte rovně, novou zasuňte rovně.\n\nZkontrolujte kontakty v objímce – zelenou korozi opatrně očistěte.',
          '**Bayonet (P21W, PY21W, P21/5W):** push in and twist anticlockwise, pull out. Insert the new one, push and twist.\n\n**Wedge (W5W, W16W):** pull straight out, push the new one straight in.\n\nCheck the socket contacts – carefully clean any green corrosion.'
        ),
        notes: [
          { level: 'warning', text: V('P21/5W (obrys + brzda) má piny v různé výšce. Pokud jde zasunout jen s násilím, je otočená špatně – při násilí se zkratují vlákna a brzdové světlo svítí trvale.', 'P21/5W (tail + brake) has offset pins. If it only goes in with force, it is the wrong way round – forcing it shorts the filaments and the brake light stays on.') },
          { level: 'caution', text: V('Oranžové blinkry používají žárovky **PY21W** (oranžové sklo). Čirá žárovka v čirém krytu = nelegální bílý blinkr.', 'Amber indicators use **PY21W** bulbs (amber glass). A clear bulb behind a clear lens = illegal white indicator.') }
        ]
      },
      {
        id: 'unitOut', anim: 'lights.rearUnit',
        title: V('Výměna celého světla: demontáž', 'Whole lamp replacement: removal'),
        body: V(
          'Světlo měňte při prasklém krytu, vodě uvnitř nebo vadném LED světle.\n\n1. Z kufru povolte **matice** (obvykle 2–4, často 8 nebo 10 mm).\n2. Odpojte konektor.\n3. Světlo opatrně vytáhněte **směrem dozadu z vozu** – často je drží ještě kulové čepy nebo spony, tahejte rovnoměrně.',
          'Replace the lamp for a cracked lens, water inside or a faulty LED lamp.\n\n1. From inside the boot undo the **nuts** (usually 2–4, often 8 or 10 mm).\n2. Unplug the connector.\n3. Pull the lamp carefully **out towards the rear of the car** – ball studs or clips often hold it too, pull evenly.'
        ),
        notes: [
          { level: 'caution', text: V('Pod světlo dejte hadr nebo pásku na lak – hrana světla a šroubovák snadno poškrábou nárazník.', 'Put a rag or masking tape under the lamp – the lamp edge and a screwdriver easily scratch the bumper.') }
        ]
      },
      {
        id: 'connector', anim: 'lights.connector',
        title: V('Konektor: pojistka, západka, kontakty', 'Connector: lock, latch, contacts'),
        body: V(
          'Odsuňte pojistku, zmáčkněte západku a vytáhněte **za tělo konektoru**. Prohlédněte piny – zelená koroze nebo voda v konektoru je častá příčina blikání a výpadků.',
          'Slide the lock, press the latch and pull **by the connector body**. Inspect the pins – green corrosion or water in the connector is a common cause of flickering and failures.'
        ),
        notes: [
          { level: 'tip', text: V('Na očištěné kontakty můžete dát trochu kontaktního spreje nebo dielektrické vazelíny – chrání proti vlhkosti.', 'You can put a little contact spray or dielectric grease on cleaned contacts – it protects against moisture.') }
        ]
      },
      {
        id: 'seal', anim: 'lights.seal',
        title: V('Zkontrolujte těsnění', 'Check the seal'),
        body: V(
          'Těsnění mezi světlem a karoserií musí být celé, čisté a nepřekroucené. Poškozené vyměňte. Zkontrolujte i odvětrávací krytky na světle – musí být na místě.',
          'The seal between the lamp and the body must be intact, clean and not twisted. Replace it if damaged. Also check the vent caps on the lamp – they must be in place.'
        ),
        notes: [
          { level: 'warning', text: V('Zatékající světlo časem zničí konektory, kabeláž a způsobí korozi v kufru (a v blatníku).', 'A leaking lamp eventually destroys connectors and wiring and causes corrosion in the boot (and wheel arch).') }
        ]
      },
      {
        id: 'unitIn', anim: 'lights.rearUnit',
        title: V('Montáž světla', 'Fit the lamp'),
        body: V(
          'Připojte konektor **před** nasazením světla. Světlo nasaďte do vodítek / kulových čepů, zatlačte, rovnoměrně dotáhněte matice **jen s citem** (pokud není moment v příručce, ručně „do dorazu“). Zkontrolujte rovnoměrnou spáru.',
          'Connect the plug **before** fitting the lamp. Locate the lamp on its guides / ball studs, push home and tighten the nuts evenly **with feel only** (if no torque is given in the manual, hand-snug). Check the gap is even.'
        ),
        notes: [
          { level: 'caution', text: V('Přetažená matice praskne závit v plastu nebo pouzdro světla.', 'An over-tightened nut cracks the plastic thread or lamp housing.') }
        ]
      },
      {
        id: 'test', anim: 'lights.test',
        title: V('Test všech funkcí s pomocníkem', 'Test all functions with a helper'),
        body: V(
          'Zapalování zapněte a projděte všechny funkce: brzda (+ třetí brzdové světlo), blinkry obě strany, výstražná světla, couvání, zadní mlhovka, obrysová světla a osvětlení SPZ. Zkontrolujte přístrojovou desku – žádné hlášení poruchy.',
          'Switch on the ignition and go through every function: brake (+ third brake light), indicators both sides, hazards, reverse, rear fog, tail lights and plate light. Check the dashboard – no fault message.'
        ),
        notes: [
          { level: 'warning', text: V('Pokud brzdové světlo svítí trvale i bez brzdění, máte otočenou P21/5W nebo vadný spínač – nejezděte, dokud to neopravíte.', 'If a brake light stays on without braking, a P21/5W is reversed or the switch is faulty – do not drive until fixed.') }
        ]
      }
    ],
    vehicles: {
      'skoda-octavia-rs-tdi': {
        status: 'ok',
        specs: [
          { label: V('Karoserie', 'Body style'), value: V('Liftback', 'Liftback') },
          { label: V('Zadní světlo', 'Rear lamp'), value: V('dělené: část v boku karoserie + část ve víku kufru', 'split: body-side part + tailgate part'), verify: true },
          { label: V('Brzda / obrys', 'Brake / tail'), value: 'P21/5W', verify: true },
          { label: V('Blinkr', 'Indicator'), value: 'PY21W', verify: true },
          { label: V('Couvání / mlhovka', 'Reverse / fog'), value: 'P21W', verify: true },
          { label: V('Osvětlení SPZ', 'Plate light'), value: 'W5W', verify: true }
        ],
        notes: [
          { level: 'info', text: V('Váš vůz je **liftback**. Prohlédněte si světlo: pokud má část i ve víku kufru, má každá část vlastní držák žárovek (boční díl – přístup z obložení kufru, díl ve víku – přístup z vnitřního obložení víka). Ověřte na voze.', 'Your car is a **liftback**. Look at the lamp: if part of it sits in the tailgate, each part has its own bulb carrier (body part – access from the boot side trim, tailgate part – access from the tailgate inner trim). Verify on the car.'), verify: true },
          { level: 'info', text: V('Octavia combi má jiné uspořádání světel – díly a postup pro combi nekupujte.', 'The Octavia estate (combi) has a different lamp layout – do not buy combi parts or follow combi procedures.') },
          { level: 'caution', text: V('Některé verze RS mají část zadních světel LED – typy žárovek ověřte na staré žárovce / v ELSA.', 'Some RS versions have LED sections in the rear lamps – verify bulb types on the old bulb / in ELSA.'), verify: true }
        ],
        tools: [V('Plastové páčidlo na obložení víka kufru', 'Plastic trim tool for the tailgate inner trim')],
        steps: {
          access: {
            body: V('**Boční díl (v karoserii):** odklopte krytku v bočním obložení kufru za světlem, stiskněte západky držáku a vytáhněte ho.\n\n**Díl ve víku kufru (pokud ho vaše světlo má):** otevřete víko, sundejte krytku / vnitřní obložení víka v oblasti světla a vytáhněte držák.', '**Body-side part:** open the flap in the boot side trim behind the lamp, press the carrier latches and pull it out.\n\n**Tailgate part (if your lamp has one):** open the tailgate, remove the cover / inner tailgate trim near the lamp and pull out the carrier.'),
            notes: [{ level: 'caution', text: V('Kabely do víka kufru vedou přes pružnou průchodku v pantu – při práci za ně netahejte, časem se lámou.', 'The tailgate wiring runs through a flexible boot in the hinge area – do not pull on it, the wires break over time.') }]
          },
          unitOut: { notes: [{ level: 'info', text: V('Boční díl drží matice zevnitř kufru, díl ve víku matice pod vnitřním obložením víka (ověřit).', 'The body part is held by nuts from inside the boot, the tailgate part by nuts under the tailgate inner trim (verify).'), verify: true }] }
        }
      },
      'mb-cl500-c216': {
        status: 'ok',
        specs: [
          { label: V('Zadní světla', 'Rear lamps'), value: V('převážně LED (některé funkce mohou mít žárovky)', 'mostly LED (some functions may use bulbs)'), verify: true }
        ],
        notes: [
          { level: 'info', text: V('Které funkce mají žárovky (např. couvání, blinkr) a které jsou LED, ověřte ve WIS nebo pohledem na držák – nechceme hádat.', 'Check in WIS or by looking at the carrier which functions use bulbs (e.g. reverse, indicator) and which are LED – we do not want to guess.'), verify: true },
          { level: 'caution', text: V('Obložení kufru CL je kvalitní a drahé – spony uvolňujte opatrně, mějte náhradní.', 'The CL boot trim is high quality and expensive – release the clips carefully and have spares.') }
        ]
      },
      'volvo-xc60-b4': {
        status: 'ok',
        specs: [
          { label: V('Zadní světla', 'Rear lamps'), value: V('Full LED – bez vyměnitelných žárovek', 'Full LED – no replaceable bulbs'), verify: true }
        ],
        notes: [
          { level: 'info', text: V('LED zadní světla se mění jako celek. Před objednáním nechte závadu potvrdit diagnostikou (VIDA).', 'The LED rear lamps are replaced as a unit. Confirm the fault with diagnostics (VIDA) before ordering.') },
          { level: 'info', text: V('Zda je část světla i ve víku kufru, ověřte na voze / ve VIDA.', 'Verify on the car / in VIDA whether part of the lamp sits in the tailgate.'), verify: true }
        ],
        parts: [V('Nové LED zadní světlo (správná strana a verze dle VIN)', 'New LED rear lamp (correct side and version per VIN)')],
        steps: { bulb: { skip: true } },
        extraSteps: [{ after: 'access', step: LED_REAR }]
      },
      'toyota-gr-yaris': {
        status: 'ok',
        specs: [
          { label: V('Zadní světla', 'Rear lamps'), value: V('LED – bez vyměnitelných žárovek (ověřit, zda couvání / mlhovka nejsou žárovky)', 'LED – no replaceable bulbs (verify whether reverse / fog use bulbs)'), verify: true }
        ],
        notes: [
          { level: 'info', text: V('Facelift 2024 má nová zadní světla. Postup demontáže a typy ověřte v TIS.', 'The 2024 facelift has new rear lamps. Verify the removal procedure and types in TIS.'), verify: true }
        ],
        parts: [V('Nové LED zadní světlo (správná strana a verze dle VIN)', 'New LED rear lamp (correct side and version per VIN)')],
        steps: { bulb: { skip: true } },
        extraSteps: [{ after: 'access', step: LED_REAR }]
      },
      'citroen-jumper-22hdi': {
        status: 'ok',
        specs: [
          { label: V('Zadní světla', 'Rear lamps'), value: V('Vysoké svislé sdružené svítilny v rozích karoserie', 'Tall vertical combination lamps in the rear body corners') },
          { label: V('Demontáž', 'Removal'), value: V('Obvykle zvenku po otevření zadních dveří (šrouby)', 'Usually from outside with the rear doors open (screws)'), verify: true },
          { label: V('Žárovky', 'Bulbs'), value: V('Typy dle katalogu (např. P21/5W, PY21W, P21W)', 'Types per catalogue (e.g. P21/5W, PY21W, P21W)'), verify: true },
          { label: V('3. brzdové světlo', '3rd brake light'), value: V('Nahoře nad zadními dveřmi', 'At the top above the rear doors'), verify: true },
          { label: V('Osvětlení SPZ', 'Plate lights'), value: V('V zadním nárazníku / nad SPZ', 'In the rear bumper / above the plate'), verify: true }
        ],
        notes: [
          { level: 'info', text: V('U furgonu Jumper se zadní světla obvykle nevyndávají zevnitř z nákladového prostoru, ale **zvenku**: otevřete zadní dveře, povolte šrouby ve sloupku a světlo vytáhněte. Ověřte na voze.', 'On the Jumper panel van the rear lamps are usually removed **from outside**, not from the cargo area: open the rear doors, undo the screws in the pillar and pull the lamp out. Verify on the van.'), verify: true },
          { level: 'warning', text: V('3. brzdové světlo je vysoko nad dveřmi – použijte stabilní štafle, ne bednu nebo nárazník.', 'The 3rd brake light is high above the doors – use a stable step ladder, not a crate or the bumper.') },
          { level: 'caution', text: V('Těsnění světel a průchodky kabelů u dodávek často propouští vodu – zkontrolujte, zda v nákladovém prostoru / sloupku není vlhko.', 'Lamp seals and cable grommets on vans often leak – check the cargo area / pillar for moisture.') }
        ],
        tools: [V('Štafle (pro 3. brzdové světlo)', 'Step ladder (for the 3rd brake light)')],
        steps: {
          find: { body: V('Otevřete zadní dveře – ve sloupku vedle světla najdete šrouby, které světlo drží (ověřte počet a typ).', 'Open the rear doors – in the pillar next to the lamp you will find the screws holding it (verify number and type).'), notes: [{ level: 'info', text: V('Zadní dveře zajistěte, aby se při práci nezavřely (vítr).', 'Secure the rear doors so they cannot close while you work (wind).') }] },
          access: { body: V('Povolte šrouby, světlo opatrně vytáhněte dozadu a odpojte konektor. Držák žárovek se pak vyndá ze zadní strany světla.', 'Undo the screws, pull the lamp carefully backwards and unplug the connector. The bulb carrier then comes out from the back of the lamp.'), notes: [{ level: 'caution', text: V('Šrouby nepřetahujte – plastové světlo praskne a dovnitř zatéká.', 'Do not overtighten the screws – the plastic lamp cracks and water gets in.') }] }
        }
      }
    }
  });
})(window.STU);
