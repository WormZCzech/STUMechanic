/* Tutorial: Timing belt replacement (výměna rozvodů) – incl. chain-engine guidance. */
(function (S) {
  'use strict';
  var V = function (cs, en) { return { cs: cs, en: en }; };

  /* Generic belt steps – chain cars skip all of them and get chain-specific extra steps. */
  var BELT_STEPS = ['why', 'prep', 'drain', 'access', 'tdc', 'lock', 'remove', 'replace', 'belt', 'tension', 'rotate', 'refill', 'test'];
  function skipAll() {
    var o = {};
    BELT_STEPS.forEach(function (id) { o[id] = { skip: true }; });
    return o;
  }

  /** Chain-engine extra steps. car: 'mb' | 'gr' */
  function chainSteps(car) {
    var mb = car === 'mb';
    return [
      {
        after: 'why',
        step: {
          id: 'chain-what', anim: 'timing.chain',
          title: V('Váš motor má rozvodový řetěz, ne řemen', 'Your engine has a timing chain, not a belt'),
          body: mb
            ? V('Motor **M273 (V8)** pohání čtyři vačkové hřídele řetězem. Řetěz nemá předepsaný interval výměny – je navržen na životnost motoru. Přesto se časem **natahuje** a opotřebovávají se vodicí lišty, napínák a ozubená kola.\n\nŘetěz je mazán motorovým olejem a hydraulický napínák je olejem napájen. **Kvalita a hladina oleje přímo rozhoduje o životnosti rozvodů.**',
              'The **M273 (V8)** drives four camshafts by chain. The chain has no scheduled replacement interval – it is designed to last the life of the engine. Still, over time it **stretches** and the guide rails, tensioner and sprockets wear.\n\nThe chain is lubricated by engine oil and the hydraulic tensioner is fed by oil. **Oil quality and level directly decide how long the timing drive lasts.**')
            : V('Motor **G16E-GTS** má rozvodový řetěz bez předepsaného intervalu výměny. Je navržen na životnost motoru, ale jako každý řetěz se při zanedbané údržbě oleje může natáhnout a opotřebovat vodítka a napínák.\n\nU vysoce namáhaného turbomotoru (a zvlášť při jízdách na okruhu) je **čistý olej správné specifikace** to nejdůležitější, co pro rozvody můžete udělat.',
              'The **G16E-GTS** has a timing chain with no scheduled replacement interval. It is designed for the life of the engine, but like any chain it can stretch and wear its guides and tensioner if oil maintenance is neglected.\n\nOn a highly stressed turbo engine (especially with track use) **clean oil of the correct spec** is the most important thing you can do for the timing drive.'),
          notes: [
            { level: 'info', text: V('Výměna řetězu není běžná servisní operace. Tento návod vám pomůže **poznat problém včas** a rozhodnout se, kdy jet do servisu.', 'Chain replacement is not a routine service job. This tutorial helps you **spot a problem early** and decide when to go to a workshop.') },
            { level: 'danger', text: V('I motor s řetězem je **kolizní**: přeskočení nebo přetržení řetězu zničí ventily a písty stejně jako u řemenu.', 'A chain engine is also an **interference** engine: a jumped or snapped chain destroys valves and pistons just like a belt.') }
          ]
        }
      },
      {
        after: 'why',
        step: {
          id: 'chain-symptoms', anim: 'timing.chain',
          title: V('Příznaky nataženého řetězu', 'Symptoms of a stretched chain'),
          body: mb
            ? V('- **Chrastění 1–3 s po studeném startu** (napínák ještě nemá tlak oleje)\n- Rozsvícená kontrolka motoru s kódy **P0016–P0019** (nesoulad vačka/klika)\n- Nerovnoměrný volnoběh, ztráta výkonu, škubání\n- Kovové šelesty z přední části motoru\n\nU **raných motorů M273 (cca do roku výroby 2006/2007)** se navíc vyskytovalo opotřebení vloženého ozubeného kola (idler gear) – ozubení se „ohladí“ a řetěz může přeskočit. Ověřte číslo motoru u servisu Mercedes.',
              '- **Rattle for 1–3 s after a cold start** (the tensioner has no oil pressure yet)\n- Check-engine light with codes **P0016–P0019** (cam/crank correlation)\n- Rough idle, loss of power, hesitation\n- Metallic noises from the front of the engine\n\n**Early M273 engines (approx. built up to 2006/2007)** also suffered from idler gear wear – the gear teeth wear down and the chain can jump. Check your engine number with a Mercedes dealer.')
            : V('- **Chrastění po studeném startu** nebo při změně otáček\n- Kontrolka motoru s kódy typu **P0016 / P0017** (nesoulad vačka/klika)\n- Nerovnoměrný chod, ztráta výkonu\n- Zvýšená spotřeba nebo tmavý, rychle degradovaný olej (nepřímý signál)',
              '- **Rattle after a cold start** or when revs change\n- Check-engine light with codes such as **P0016 / P0017** (cam/crank correlation)\n- Rough running, loss of power\n- Increased oil consumption or dark, quickly degraded oil (indirect sign)'),
          notes: mb
            ? [
              { level: 'warning', text: V('Pokud slyšíte chrastění nebo svítí P0016–P0019, **nejezděte vysoké otáčky** a nechte vůz co nejdříve diagnostikovat. Přeskočení řetězu = zničený motor.', 'If you hear rattling or have P0016–P0019, **avoid high revs** and get the car diagnosed as soon as possible. A jumped chain = a destroyed engine.') },
              { level: 'info', text: V('Rozsah výrobních čísel motorů s problémovým kolem ověřte u Mercedes-Benz – údaje se v různých zdrojích liší.', 'Verify the range of affected engine numbers with Mercedes-Benz – sources differ.'), verify: true }
            ]
            : [
              { level: 'warning', text: V('Při chrastění nebo chybě vačkových hřídelů nejezděte naplno ani na okruh, dokud vůz neprojde diagnostikou.', 'With rattling or a camshaft fault, do not drive hard or on track until the car has been diagnosed.') }
            ]
        }
      },
      {
        after: 'why',
        step: {
          id: 'chain-diag', anim: 'timing.diag',
          title: V('Diagnostika: hodnoty polohy vaček', 'Diagnosis: camshaft position values'),
          body: mb
            ? V('1. Připojte **XENTRY/DAS** (nebo kvalitní diagnostiku s podporou Mercedes).\n2. Přečtěte paměť závad motorové jednotky (ME 9.7).\n3. Ve skutečných hodnotách najděte **úhly vačkových hřídelů vůči klice** (camshaft adaptation / position) pro všechny 4 vačky.\n4. Porovnejte s limity ve WIS. Hodnoty blízko limitu nebo mimo něj = natažený řetěz / opotřebená kola.',
              '1. Connect **XENTRY/DAS** (or a quality scan tool with Mercedes support).\n2. Read the engine ECU fault memory (ME 9.7).\n3. In live data find the **camshaft-to-crankshaft angles** (camshaft adaptation / position) for all 4 cams.\n4. Compare with the limits in WIS. Values close to or beyond the limit = stretched chain / worn gears.')
            : V('1. Připojte diagnostiku (**Toyota Techstream** nebo OBD tester se živými daty).\n2. Přečtěte chyby motoru.\n3. Ve skutečných hodnotách sledujte **odchylku VVT** (cíl vs. skutečnost) pro sání i výfuk při volnoběhu po zahřátí.\n4. Trvalá odchylka nebo chyby P0016/P0017 = do servisu Toyota.',
              '1. Connect a scan tool (**Toyota Techstream** or an OBD tool with live data).\n2. Read engine fault codes.\n3. In live data watch the **VVT deviation** (target vs. actual) for intake and exhaust at warm idle.\n4. Persistent deviation or codes P0016/P0017 = go to a Toyota workshop.'),
          notes: [
            { level: 'info', text: V('Přesné názvy parametrů a limitní hodnoty se liší podle verze software – ověřte v dílenské dokumentaci.', 'Exact parameter names and limits differ by software version – verify in the workshop documentation.'), verify: true },
            { level: 'tip', text: V('Zapište si hodnoty a datum. Porovnáním po 10–20 tisících km uvidíte, jestli se řetěz natahuje.', 'Write down the values and the date. Comparing them after 10–20 thousand km shows whether the chain is stretching.') }
          ]
        }
      },
      {
        after: 'why',
        step: {
          id: 'chain-prevent', anim: 'timing.chain',
          title: V('Prevence: olej je nejlepší ochrana řetězu', 'Prevention: oil is the best chain protection'),
          body: mb
            ? V('- Olej se schválením **MB 229.5**, správná viskozita\n- Interval výměny raději **zkrátit** (např. každých 10–15 tis. km nebo 1× ročně), zvlášť při krátkých jízdách\n- Hladinu oleje kontrolujte pravidelně – V8 může olej spotřebovávat\n- Po studeném startu nevytáčejte motor, dokud nemá provozní teplotu',
              '- Oil approved to **MB 229.5**, correct viscosity\n- Better **shorten** the change interval (e.g. every 10–15 thousand km or once a year), especially with short trips\n- Check the oil level regularly – the V8 can consume oil\n- After a cold start do not rev the engine hard until it is warm')
            : V('- Olej **dle uživatelské příručky** (viskozita podle provozu)\n- Při jízdách na okruhu měňte olej výrazně častěji\n- Hladinu kontrolujte před každou ostřejší jízdou – turbo a vysoké otáčky olej spotřebovávají\n- Motor nevytáčejte, dokud olej nemá provozní teplotu',
              '- Oil **as specified in the owner\'s manual** (viscosity depending on use)\n- With track use change the oil much more often\n- Check the level before every spirited drive – turbo and high revs consume oil\n- Do not rev the engine hard until the oil is at operating temperature'),
          notes: mb
            ? [{ level: 'info', text: V('Doporučený kratší interval je praktická rada, ne předpis výrobce.', 'The shorter interval is practical advice, not a manufacturer requirement.') }]
            : [{ level: 'info', text: V('Doporučenou viskozitu a interval pro sportovní provoz ověřte v uživatelské příručce GR Yaris.', 'Verify the recommended viscosity and interval for sporty use in the GR Yaris owner\'s manual.'), verify: true }]
        }
      },
      {
        after: 'why',
        step: {
          id: 'chain-workshop', anim: 'timing.lock',
          title: V('Když je řetěz natažený: co čekat od servisu', 'If the chain is stretched: what to expect from the workshop'),
          body: mb
            ? V('Výměna rozvodů M273 je **dílenská práce**:\n- Nový řetěz se obvykle natáhne přes stará kola pomocí starého řetězu a **nýtuje** se speciálním přípravkem, nebo se demontuje přední víko motoru.\n- Mění se vodicí lišty, napínák, často kola vačkových hřídelů.\n- Pokud je opotřebené **vložené ozubené kolo** (rané motory), bývá nutná demontáž motoru z vozu.\n- Potřebné jsou aretační přípravky vaček, přípravek na nýtování článku a XENTRY pro adaptace.\n\nPožadujte nové originální díly a fotodokumentaci starých dílů.',
              'Replacing the M273 timing drive is **workshop work**:\n- The new chain is usually pulled through using the old chain and **riveted** with a special tool, or the engine front cover is removed.\n- Guide rails, tensioner and often camshaft sprockets are replaced.\n- If the **idler gear** is worn (early engines), removing the engine from the car is often necessary.\n- Cam locking tools, a chain-link riveting tool and XENTRY for adaptations are required.\n\nAsk for new genuine parts and photos of the old parts.')
            : V('Pokud diagnostika potvrdí natažený řetěz nebo vadný napínák, jde o práci pro **servis Toyota** nebo zkušenou dílnu se znalostí G16E – demontáž předního víka motoru, aretační přípravky, nové těsnění a adaptace přes Techstream.\n\nU vozu v záruce nic nerozebírejte sami – kontaktujte autorizovaný servis.',
              'If diagnosis confirms a stretched chain or faulty tensioner, it is a job for a **Toyota dealer** or an experienced shop familiar with the G16E – front cover removal, locking tools, new sealing and adaptations via Techstream.\n\nIf the car is under warranty, do not take anything apart yourself – contact an authorised dealer.'),
          notes: [
            { level: 'warning', text: V('Nikdy neotáčejte vačkami ani klikou motoru s povoleným nebo sundaným řetězem – ventily narazí do pístů.', 'Never turn the camshafts or crankshaft with the chain loose or removed – valves will hit the pistons.') },
            { level: 'info', text: V('Návod tento krok nezakazuje – jen jde o rozsáhlou práci, kde chyba = nový motor. Postup vždy podle WIS/TIS.', 'Nothing is locked here – it is simply a big job where a mistake means a new engine. Always follow WIS/TIS.') }
          ]
        }
      }
    ];
  }

  S.registerTutorial({
    id: 'timing-belt',
    level: 2,
    status: 'caution',
    thumb: 'timing.overview',
    time: V('4–8 h', '4–8 h'),
    title: V('Výměna rozvodů (rozvodový řemen + vodní pumpa)', 'Timing belt replacement (belt + water pump)'),
    summary: V('Nejdražší chyba v kutilské dílně. Aretace, horní úvrať, napínák a kontrola – krok za krokem.', 'The most expensive mistake in a home garage. Locking tools, TDC, tensioner and checks – step by step.'),
    intro: V(
      'Rozvodový řemen synchronizuje klikový hřídel (písty) s vačkovým hřídelem (ventily). U většiny moderních motorů jde o **kolizní motor** – když řemen praskne nebo přeskočí o jediný zub, ventily narazí do pístů a motor je zničený.\n\nTato práce je zvládnutelná doma, ale vyžaduje **přesné aretační nářadí pro váš motor, momentový klíč s úhloměrem a klid**. Pokud si v kterémkoli kroku nejste jistí, zastavte se.',
      'The timing belt keeps the crankshaft (pistons) in sync with the camshaft (valves). Most modern engines are **interference engines** – if the belt snaps or jumps a single tooth, the valves hit the pistons and the engine is destroyed.\n\nThis job is doable at home, but needs **the exact locking tools for your engine, a torque wrench with an angle gauge, and patience**. If you are unsure at any step, stop.'
    ),
    safety: [
      { level: 'danger', text: V('**Kolizní motor:** Chybné časování o jediný zub může zničit ventily a písty. Nikdy nespoléhejte jen na značky – vždy použijte aretační nářadí určené pro váš kód motoru.', '**Interference engine:** Timing off by a single tooth can destroy valves and pistons. Never rely on marks alone – always use the locking tools made for your engine code.') },
      { level: 'danger', text: V('Před demontáží držáku motoru musí být motor **podepřen** (traverza přes blatníky nebo hever s podložkou pod vanou dle příručky). Nikdy nemějte ruce mezi motorem a karoserií, když je motor jen na heveru.', 'Before removing an engine mount the engine must be **supported** (support bar across the wings, or a jack with a pad under the sump as per manual). Never put your hands between the engine and the body while the engine sits only on a jack.') },
      { level: 'warning', text: V('Pracujte jen na **studeném motoru**. Chladicí kapalina a díly motoru mohou mít přes 100 °C, chladicí soustava je pod tlakem.', 'Work only on a **cold engine**. Coolant and engine parts can be above 100 °C and the cooling system is under pressure.') },
      { level: 'warning', text: V('**Odpojte baterii** (záporný pól). Zabráníte nechtěnému protočení startérem a spuštění ventilátoru chladiče, který se může roztočit i s vypnutým zapalováním.', '**Disconnect the battery** (negative terminal). This prevents accidental cranking by the starter and the radiator fan starting – it can run even with the ignition off.') },
      { level: 'warning', text: V('Chladicí kapalina je **jedovatá** a sladká – láká děti a zvířata. Zachyťte ji do nádoby, rozlitou hned utřete a odevzdejte do sběru.', 'Coolant is **toxic** and tastes sweet – it attracts children and pets. Catch it in a container, wipe up spills at once and take it to a collection point.') },
      { level: 'caution', text: V('Motor otáčejte **jen ve směru chodu** (obvykle po směru hod. ručiček při pohledu na řemenici) a jen za šroub klikového hřídele. Nikdy za šroub vačky, nikdy pozpátku.', 'Turn the engine **only in its running direction** (usually clockwise looking at the pulley) and only by the crankshaft bolt. Never by the camshaft bolt, never backwards.') },
      { level: 'caution', text: V('Mnoho šroubů (řemenice, napínák, držák motoru) jsou **pružné šrouby na jedno použití** dotahované momentem + úhlem. Vždy je vyměňte za nové.', 'Many bolts (pulley, tensioner, engine mount) are **single-use stretch bolts** tightened to torque + angle. Always replace them with new ones.') }
    ],
    tools: [
      V('Aretační sada pro váš kód motoru (klika, vačka, případně další kola)', 'Locking tool kit for your engine code (crank, cam, other sprockets if needed)'),
      V('Momentový klíč + úhloměr pro dotahování na úhel', 'Torque wrench + angle gauge'),
      V('Přidržovač řemenic / ozubených kol (kontra)', 'Pulley / sprocket holding tool'),
      V('Podpěra motoru (traverza) nebo hever s dřevěnou podložkou', 'Engine support bar, or a jack with a wooden pad'),
      V('Sada hlavic, Torx, imbus, prodloužení, kloub', 'Socket set, Torx, Allen, extensions, universal joint'),
      V('Klíč na napínák drážkového řemene', 'Accessory belt tensioner tool'),
      V('Vana na chladicí kapalinu, plnicí nálevka', 'Coolant drain pan, filling funnel'),
      V('Fix / barva na značky, svítilna, zrcátko', 'Paint marker, torch, inspection mirror'),
      V('Hever a podpěrné stojany (viz návod Zvedání)', 'Jack and axle stands (see the Lifting tutorial)')
    ],
    parts: [
      V('Sada rozvodů: řemen, napínák, vodicí kladky, šrouby', 'Timing kit: belt, tensioner, idlers, bolts'),
      V('Vodní pumpa s těsněním', 'Water pump with gasket / seal'),
      V('Nové pružné šrouby (řemenice, držák motoru – dle příručky)', 'New stretch bolts (pulley, engine mount – per manual)'),
      V('Chladicí kapalina dle specifikace', 'Coolant to specification'),
      V('Drážkový (příslušenský) řemen – doporučeno měnit současně', 'Accessory (poly-V) belt – recommended to replace at the same time')
    ],
    finalChecks: [
      V('Po nastartování žádná kontrolka motoru', 'No engine warning light after start-up'),
      V('Žádné neobvyklé zvuky (pískání, chrastění, klepání) při volnoběhu ani po studeném startu', 'No unusual noises (whine, rattle, knocking) at idle or after a cold start'),
      V('Žádné úniky (chladicí kapalina, olej) po zahřátí', 'No leaks (coolant, oil) after warm-up'),
      V('Hladina chladicí kapaliny zkontrolována po vychladnutí a doplněna (byla-li soustava otevřena)', 'Coolant level checked after cooling down and topped up (if the system was opened)'),
      V('Všechna aretační nářadí vyndána a spočítána', 'All locking tools removed and counted'),
      V('Datum a stav km zapsány do servisní knížky (nebo štítek pod kapotu)', 'Date and mileage recorded in the service book (or a sticker under the bonnet)'),
      V('Po 50–100 km znovu kontrola hladin a úniků', 'Re-check levels and leaks after 50–100 km')
    ],
    steps: [
      {
        id: 'why', anim: 'timing.interference',
        title: V('Proč a kdy měnit rozvody', 'Why and when to replace the timing belt'),
        body: V(
          'Řemen stárne **kilometry i časem** (guma tvrdne a praská). Výrobce udává interval typicky **90 000–240 000 km nebo 4–10 let** – podle toho, co nastane dřív.\n\nIhned měňte, pokud:\n- neznáte historii vozu (koupený ojetý bez dokladu),\n- řemen je nasáklý olejem nebo chladicí kapalinou,\n- vidíte praskliny, roztřepené okraje nebo chybějící zuby,\n- uniká kapalina z vodní pumpy nebo slyšíte pískání/hučení ložisek kladek.',
          'The belt ages with **both mileage and time** (rubber hardens and cracks). Manufacturers typically specify **90,000–240,000 km or 4–10 years** – whichever comes first.\n\nReplace immediately if:\n- you do not know the car\'s history (bought used without records),\n- the belt is soaked in oil or coolant,\n- you see cracks, frayed edges or missing teeth,\n- the water pump leaks or you hear whining/humming from idler bearings.'
        ),
        notes: [
          { level: 'danger', text: V('Interval nikdy nepřekračujte. Oprava motoru po přetržení řemenu stojí zpravidla víc než celá výměna rozvodů několikrát.', 'Never exceed the interval. Repairing an engine after a belt failure usually costs several times more than the timing job itself.') },
          { level: 'info', text: V('Přesný interval najdete v servisní knížce nebo dílenské příručce pro váš VIN / kód motoru.', 'The exact interval is in the service book or the workshop manual for your VIN / engine code.') }
        ]
      },
      {
        id: 'prep', anim: 'timing.overview',
        title: V('Příprava: díly, nářadí, baterie', 'Preparation: parts, tools, battery'),
        body: V(
          '1. Objednejte **kompletní sadu** rozvodů pro váš kód motoru (ne jen řemen) + vodní pumpu + nové šrouby.\n2. Připravte aretační nářadí a vytiskněte si postup z dílenské příručky.\n3. Vůz postavte na rovinu, motor musí být **studený**.\n4. **Odpojte záporný pól baterie.**\n5. Vyfoťte si motorový prostor – kabely, hadice, vedení řemenů.',
          '1. Order a **complete timing kit** for your engine code (not just the belt) + water pump + new bolts.\n2. Get the locking tools ready and print the procedure from the workshop manual.\n3. Park on level ground, the engine must be **cold**.\n4. **Disconnect the battery negative terminal.**\n5. Photograph the engine bay – cables, hoses, belt routing.'
        ),
        notes: [
          { level: 'warning', text: V('Porovnejte nové díly se starými (počet zubů, šířka řemene, tvar napínáku) ještě před demontáží.', 'Compare new parts with the old ones (tooth count, belt width, tensioner shape) before you start dismantling.') },
          { level: 'tip', text: V('Vyhraďte si celý den. Spěch je u rozvodů největší nepřítel.', 'Set aside a full day. Rushing is the worst enemy of a timing job.') }
        ]
      },
      {
        id: 'drain', anim: 'timing.drain',
        title: V('Vypusťte chladicí kapalinu', 'Drain the coolant'),
        body: V(
          'Protože budete měnit vodní pumpu, je třeba vypustit chladicí kapalinu (nebo aspoň tolik, aby hladina byla pod pumpou).\n\n1. Na **studeném** motoru pomalu povolte víčko expanzní nádržky.\n2. Pod chladič dejte vanu.\n3. Povolte vypouštěcí šroub nebo stáhněte spodní hadici chladiče.',
          'Since you will replace the water pump, the coolant must be drained (or at least lowered below the pump).\n\n1. On a **cold** engine slowly loosen the expansion tank cap.\n2. Place a pan under the radiator.\n3. Open the drain plug or pull off the lower radiator hose.'
        ),
        notes: [
          { level: 'warning', text: V('Víčko nikdy neotvírejte na teplém motoru – horká kapalina pod tlakem vystříkne.', 'Never open the cap on a warm engine – hot coolant under pressure will spray out.') },
          { level: 'caution', text: V('Kapalinu znovu nepoužívejte, pokud je stará nebo znečištěná. Různé typy (např. G12 vs. G13) nemíchejte bez ověření kompatibility.', 'Do not reuse old or contaminated coolant. Do not mix types (e.g. G12 vs. G13) without verifying compatibility.') }
        ]
      },
      {
        id: 'access', anim: 'timing.support',
        title: V('Přístup: kryty, drážkový řemen, držák motoru', 'Access: covers, accessory belt, engine mount'),
        body: V(
          '1. Sundejte kryt motoru a díly, které překáží (vzduchový filtr, nádržka – dle vozu).\n2. Povolte napínák **drážkového řemene** a řemen sundejte (vyfoťte si vedení).\n3. Zvedněte pravou přední stranu vozu a sundejte kolo a plastový podběh (viz návod Zvedání).\n4. **Podepřete motor** traverzou nebo zespodu.\n5. Povolte a demontujte držák motoru na straně rozvodů.\n6. Sundejte řemenici klikového hřídele a kryty rozvodů.',
          '1. Remove the engine cover and parts in the way (air filter, tank – depending on car).\n2. Release the **accessory belt** tensioner and remove the belt (photograph the routing).\n3. Raise the front right side, remove the wheel and plastic wheel-arch liner (see the Lifting tutorial).\n4. **Support the engine** with a support bar or from below.\n5. Loosen and remove the engine mount on the timing side.\n6. Remove the crankshaft pulley and the timing covers.'
        ),
        notes: [
          { level: 'danger', text: V('Motor podepřete **dříve**, než povolíte držák. Bez podpěry motor poklesne a může vám přiskřípnout ruku.', 'Support the engine **before** you loosen the mount. Without support the engine drops and can trap your hand.') },
          { level: 'caution', text: V('Šroub řemenice klikového hřídele bývá utažen velmi velkým momentem. Povolujte ho s **přidržovačem řemenice** – nikdy neopírejte sílu o aretační kolík.', 'The crankshaft pulley bolt is usually extremely tight. Loosen it with a **pulley holding tool** – never react the force against the locking pin.') }
        ]
      },
      {
        id: 'tdc', anim: 'timing.tdc',
        title: V('Natočte motor do horní úvrati válce 1', 'Turn the engine to TDC of cylinder 1'),
        body: V(
          'Za šroub klikového hřídele otáčejte motorem **pomalu ve směru chodu** (po směru hod. ručiček), dokud značka na klikovém kole a značka(y) na vačkovém kole nesouhlasí se značkami na motoru = **horní úvrať (OT) válce 1**.\n\nKdyž značku přejedete, **nevracejte se zpět** – otočte klikou ještě o dvě celé otáčky a najeďte znovu.',
          'Using the crankshaft bolt, turn the engine **slowly in its running direction** (clockwise) until the crank sprocket mark and the cam sprocket mark(s) line up with the marks on the engine = **top dead centre (TDC) of cylinder 1**.\n\nIf you overshoot, **do not turn back** – turn the crank two more full turns and approach again.'
        ),
        notes: [
          { level: 'warning', text: V('Vačkové kolo se otáčí poloviční rychlostí. Klika se značkou nahoře neznamená nutně OT válce 1 – musí souhlasit i vačka.', 'The cam sprocket turns at half speed. The crank mark at the top does not necessarily mean TDC of cylinder 1 – the cam must match too.') },
          { level: 'tip', text: V('Vyndání zapalovacích svíček (u benzínu) usnadní protáčení motoru.', 'Removing the spark plugs (petrol engines) makes turning the engine easier.') }
        ]
      },
      {
        id: 'lock', anim: 'timing.lock',
        title: V('Zajistěte kliku a vačky aretací', 'Lock the crankshaft and camshaft(s)'),
        body: V(
          'Nasaďte **aretační nářadí** pro váš motor: kolík nebo přípravek do vačkového kola (případně dalších kol) a aretaci klikového hřídele.\n\nNářadí musí jít nasadit **lehce, bez násilí**. Když nejde, motor není přesně v OT – vraťte se o krok zpět (dvě otáčky vpřed a znovu).\n\nNavíc si barvou udělejte značky na kolech a krytech jako druhou kontrolu.',
          'Fit the **locking tools** for your engine: a pin or fixture into the cam sprocket (and other sprockets if required) and the crankshaft lock.\n\nThe tools must go in **easily, without force**. If they do not, the engine is not exactly at TDC – go back a step (two turns forward and try again).\n\nAlso make paint marks on sprockets and housings as a second check.'
        ),
        notes: [
          { level: 'danger', text: V('Od této chvíle až do nasazení nového řemene **neotáčejte klikou ani vačkou**. Bez řemene může i malé pootočení způsobit kontakt ventilu s pístem.', 'From now until the new belt is fitted **do not turn the crank or cam**. Without a belt even a small turn can make a valve touch a piston.') },
          { level: 'caution', text: V('Aretace slouží jen k zajištění polohy, ne jako kontra pro povolování šroubů.', 'Locking tools only hold position – they are not a counter-hold for loosening bolts.') }
        ]
      },
      {
        id: 'remove', anim: 'timing.release',
        title: V('Povolte napínák a sundejte starý řemen', 'Release the tensioner and remove the old belt'),
        body: V(
          '1. Pokud budete starý řemen zkoumat, šipkou si označte směr otáčení.\n2. Povolte matici napínáku a napínák uvolněte (dle typu otočením excentru nebo stlačením a zajištěním kolíkem).\n3. Sundejte řemen – nejdřív z kladek, nakonec z klikového kola.\n4. Zkontrolujte, že aretace jsou stále na místě.',
          '1. If you want to inspect the old belt, mark the running direction with an arrow.\n2. Loosen the tensioner nut and release the tensioner (by turning the eccentric or compressing it and locking with a pin, depending on type).\n3. Remove the belt – first from the idlers, finally from the crank sprocket.\n4. Check that the locking tools are still in place.'
        ),
        notes: [
          { level: 'caution', text: V('Prohlédněte starý řemen: olej nebo kapalina na řemenu = najděte a odstraňte únik (gufera, pumpa), jinak zničí i nový řemen.', 'Inspect the old belt: oil or coolant on it = find and fix the leak (seals, pump), otherwise it will ruin the new belt too.') }
        ]
      },
      {
        id: 'replace', anim: 'timing.replace',
        title: V('Vyměňte napínák, kladky a vodní pumpu', 'Replace tensioner, idlers and water pump'),
        body: V(
          '1. Vyšroubujte napínák a vodicí kladky.\n2. Vyšroubujte vodní pumpu (zbytek kapaliny vyteče), očistěte dosedací plochu – **bez škrábání do hliníku**.\n3. Namontujte novou pumpu s novým těsněním a dotáhněte šrouby předepsaným momentem do kříže.\n4. Namontujte nové kladky a napínák (napínák zatím jen volně, dle příručky).',
          '1. Unbolt the tensioner and idlers.\n2. Unbolt the water pump (remaining coolant will run out) and clean the mating surface – **without scratching the aluminium**.\n3. Fit the new pump with a new gasket and torque the bolts to spec in a cross pattern.\n4. Fit the new idlers and tensioner (tensioner loosely for now, as per manual).'
        ),
        notes: [
          { level: 'warning', text: V('Nepoužívejte silikon navíc k těsnění pumpy, pokud to výrobce neuvádí – přebytek se dostane do chladicí soustavy.', 'Do not add sealant to the pump gasket unless the manufacturer says so – excess ends up in the cooling system.') },
          { level: 'caution', text: V('Napínák musí správně zapadnout zarážkou do drážky / otvoru v bloku motoru – jinak se při chodu otočí.', 'The tensioner must engage its lug into the slot / hole in the engine block – otherwise it rotates when the engine runs.') }
        ]
      },
      {
        id: 'belt', anim: 'timing.beltOn',
        title: V('Nasaďte nový řemen ve správném pořadí', 'Fit the new belt in the correct order'),
        body: V(
          'Řemen nasazujte s **šipkou ve směru otáčení** v pořadí: **klikové kolo → vodicí kladka → vačkové kolo (a další kola) → vodní pumpa → napínák** (přesné pořadí dle příručky).\n\nTažná strana (od kliky k vačce) musí být **napnutá bez vůle**, veškerá vůle musí zůstat na straně napínáku.',
          'Fit the belt with the **arrow in the running direction** in this order: **crank sprocket → idler → cam sprocket (and other sprockets) → water pump → tensioner** (exact order per manual).\n\nThe drive side (crank to cam) must be **taut without slack**; all slack must be on the tensioner side.'
        ),
        notes: [
          { level: 'warning', text: V('Řemen nelámejte, nepřehýbejte a nepáčte šroubovákem přes hranu kola – poškodíte kordová vlákna a řemen může později prasknout.', 'Do not kink, fold or lever the belt over a sprocket edge with a screwdriver – you will damage the cords and the belt may snap later.') },
          { level: 'caution', text: V('Po nasazení ověřte, že aretace stále sedí a žádné kolo se nepootočilo o zub.', 'After fitting, verify the locking tools still fit and no sprocket has moved by a tooth.') }
        ]
      },
      {
        id: 'tension', anim: 'timing.tensioner',
        title: V('Napněte řemen a dotáhněte šrouby', 'Tension the belt and tighten the bolts'),
        body: V(
          '1. Klíčem otáčejte excentrem napínáku (směr dle příručky), dokud **ukazatel nebude uprostřed okénka** / proti značce.\n2. Napínák podržte a matici dotáhněte předepsaným momentem (často + úhel).\n3. Pokud motor používá kola s podélnými otvory, dotáhněte šrouby vačkového kola s **přidržovačem** dle příručky.\n4. Všechny pružné šrouby jsou nové a dotažené momentem + úhlem.',
          '1. Turn the tensioner eccentric with a key (direction per manual) until **the pointer sits in the middle of the window** / against the mark.\n2. Hold the tensioner and tighten the nut to the specified torque (often + angle).\n3. If the engine uses slotted sprocket holes, tighten the cam sprocket bolts with a **holding tool** as per manual.\n4. All stretch bolts are new and tightened to torque + angle.'
        ),
        notes: [
          { level: 'warning', text: V('Moc volný řemen přeskočí, moc napnutý zničí ložiska a pumpu. Používejte jen ukazatel napínáku – „odhad palcem“ u automatických napínáků neplatí.', 'A loose belt jumps teeth, an over-tight one kills bearings and the pump. Use only the tensioner pointer – the "thumb test" does not apply to automatic tensioners.') },
          { level: 'caution', text: V('Úhel dotažení měřte úhloměrem, ne odhadem.', 'Measure the angle with an angle gauge, not by eye.') }
        ]
      },
      {
        id: 'rotate', anim: 'timing.rotate2',
        title: V('Vyndejte aretace a protočte motor 2× rukou', 'Remove the locks and turn the engine 2× by hand'),
        body: V(
          '1. Vyndejte **všechna** aretační nářadí.\n2. Klikou otočte rukou **2 celé otáčky ve směru chodu** až zpět do OT.\n3. Aretace musí jít znovu **lehce nasadit** a ukazatel napínáku musí být stále v okénku.\n4. Pokud aretace nejde nasadit nebo se značky liší o zub: **povolte, nasaďte řemen znovu**.',
          '1. Remove **all** locking tools.\n2. Turn the crank by hand **2 full turns in the running direction** back to TDC.\n3. The locks must **slide in easily** again and the tensioner pointer must still be in its window.\n4. If a lock will not go in or the marks are off by a tooth: **loosen and refit the belt**.'
        ),
        notes: [
          { level: 'danger', text: V('Pokud při protáčení ucítíte **jakýkoli tvrdý odpor**, okamžitě přestaňte – může jít o kontakt ventilu s pístem. Nikdy nepřetáčejte silou.', 'If you feel **any hard resistance** while turning, stop immediately – it may be a valve touching a piston. Never force it.') },
          { level: 'danger', text: V('Motor **nestartujte**, dokud kontrola po 2 otáčkách nesedí na 100 %.', '**Do not start** the engine until the check after 2 turns is 100 % correct.') }
        ]
      },
      {
        id: 'refill', anim: 'timing.coolant',
        title: V('Montáž zpět a doplnění chladicí kapaliny', 'Reassemble and refill the coolant'),
        body: V(
          '1. Namontujte kryty rozvodů, řemenici kliky (nové šrouby, moment + úhel), držák motoru (nové šrouby dle příručky) a teprve pak odstraňte podpěru motoru.\n2. Nasaďte drážkový řemen dle fotky.\n3. Zavřete vypouštěcí šroub, naplňte chladicí kapalinu předepsané specifikace a **odvzdušněte** soustavu dle příručky.\n4. Připojte baterii.',
          '1. Refit the timing covers, crank pulley (new bolts, torque + angle), engine mount (new bolts as per manual) and only then remove the engine support.\n2. Refit the accessory belt according to your photo.\n3. Close the drain plug, fill coolant of the specified type and **bleed** the system as per manual.\n4. Reconnect the battery.'
        ),
        notes: [
          { level: 'warning', text: V('Vzduch v chladicí soustavě způsobí přehřátí motoru. Odvzdušnění nepodceňujte.', 'Air in the cooling system causes overheating. Do not skimp on bleeding.') },
          { level: 'info', text: V('Po připojení baterie může být nutné inicializovat okna, nastavit hodiny a provést adaptace (dle vozu).', 'After reconnecting the battery you may need to initialise windows, set the clock and run adaptations (depending on car).') }
        ]
      },
      {
        id: 'test', anim: 'timing.overview',
        title: V('Zkušební start a kontrola', 'Test start and checks'),
        body: V(
          '1. Nastartujte a nechte běžet na volnoběh. Poslouchejte – **žádné pískání, klepání ani chrastění**.\n2. Sledujte teplotu a kontrolky. Zapněte topení na max. – teplý vzduch = soustava je odvzdušněná.\n3. Po vychladnutí zkontrolujte a doplňte hladinu chladicí kapaliny.\n4. Zapište datum a km výměny.',
          '1. Start the engine and let it idle. Listen – **no whining, knocking or rattling**.\n2. Watch the temperature and warning lights. Set the heater to max – warm air = the system is bled.\n3. After cooling down check and top up the coolant level.\n4. Record the date and mileage of the job.'
        ),
        notes: [
          { level: 'warning', text: V('Při jakémkoli neobvyklém zvuku nebo kontrolce motor okamžitě vypněte a zkontrolujte časování.', 'With any unusual noise or warning light, switch off immediately and check the timing.') },
          { level: 'caution', text: V('Pozor na točící se řemeny a ventilátor – volné oblečení, vlasy a ruce mimo.', 'Beware of moving belts and the fan – keep loose clothing, hair and hands away.') }
        ]
      }
    ],
    vehicles: {
      'skoda-octavia-rs-tdi': {
        status: 'caution',
        specs: [
          { label: V('Motor', 'Engine'), value: V('2.0 TDI CR, kód CEGA (125 kW)', '2.0 TDI CR, code CEGA (125 kW)'), verify: true },
          { label: V('Interval rozvodů', 'Timing belt interval'), value: V('cca 210 000 km (ověřte v servisní knížce / ELSA)', 'approx. 210,000 km (check service book / ELSA)'), verify: true },
          { label: V('Řemen pohání', 'Belt drives'), value: V('vačkový hřídel, VT čerpadlo paliva, vodní pumpu', 'camshaft, high-pressure fuel pump, water pump'), verify: true },
          { label: V('Aretace kliky', 'Crankshaft lock'), value: 'T10050', verify: true },
          { label: V('Aretace vačky a VT čerpadla', 'Cam and HP pump locks'), value: V('aretační kolíky – čísla nářadí dle ELSA', 'locking pins – tool numbers per ELSA'), verify: true },
          { label: V('Napínák – matice', 'Tensioner nut'), value: V('20 Nm + 45°', '20 Nm + 45°'), verify: true },
          { label: V('Řemenice kliky (tlumič)', 'Crank pulley (damper)'), value: V('10 Nm + 90°, nové šrouby', '10 Nm + 90°, new bolts'), verify: true },
          { label: V('Chladicí kapalina', 'Coolant'), value: V('G13, celkem cca 7–8 l', 'G13, approx. 7–8 L total'), verify: true }
        ],
        notes: [
          { level: 'warning', text: V('**Common Rail:** Na vysokotlaké vedení paliva nesahejte. Pokud musíte uvolnit VT čerpadlo nebo vedení, postupujte dle ELSA a použijte nová vedení – tlak až cca 1800 bar.', '**Common Rail:** Leave the high-pressure fuel lines alone. If you must loosen the HP pump or lines, follow ELSA and use new lines – pressure up to approx. 1800 bar.'), verify: true },
          { level: 'info', text: V('Hodnoty momentů a čísla nářadí v této aplikaci berte jako orientační – motor CEGA má v ELSA vlastní postup. Vytiskněte si ho.', 'Treat the torques and tool numbers here as a guide – the CEGA engine has its own procedure in ELSA. Print it.') }
        ],
        tools: [
          V('Aretace klikového hřídele T10050 (nebo ekvivalent)', 'Crankshaft locking tool T10050 (or equivalent)'),
          V('Aretační kolík vačkového kola a kolík kola VT čerpadla (sada pro 2.0 TDI CR)', 'Cam sprocket locking pin and HP pump sprocket pin (2.0 TDI CR kit)'),
          V('Podpěra motoru (traverza) přes blatníky', 'Engine support bar across the wings'),
          V('Přidržovač kola vačky / řemenice', 'Cam sprocket / pulley holding tool')
        ],
        parts: [
          V('Sada rozvodů pro 2.0 TDI CR (řemen, napínák, kladky, šrouby)', 'Timing kit for 2.0 TDI CR (belt, tensioner, idlers, bolts)'),
          V('Vodní pumpa s těsněním (často součást sady)', 'Water pump with seal (often part of the kit)'),
          V('Nové šrouby tlumiče kliky a pravého držáku motoru', 'New crank damper bolts and right engine mount bolts'),
          V('Chladicí kapalina G13 (koncentrát + destilovaná voda)', 'G13 coolant (concentrate + distilled water)'),
          V('Drážkový řemen (doporučeno)', 'Accessory belt (recommended)')
        ],
        steps: {
          access: {
            body: V('U Octavie RS TDI: sundejte kryt motoru, uvolněte expanzní nádržku a odložte ji stranou, sundejte drážkový řemen (napínák povolte klíčem), podepřete motor traverzou a demontujte **pravý držák motoru**. Pak tlumič kliky a horní / střední / spodní kryt rozvodů.', 'On the Octavia RS TDI: remove the engine cover, unclip the expansion tank and move it aside, remove the accessory belt (release the tensioner with a wrench), support the engine with a bar and remove the **right engine mount**. Then the crank damper and the upper / middle / lower timing covers.'),
            notes: [{ level: 'caution', text: V('Pořadí demontáže a montáže krytů ověřte v ELSA – některé šrouby jsou skryté za držákem.', 'Verify the removal / refit order of the covers in ELSA – some bolts are hidden behind the mount.'), verify: true }]
          },
          lock: {
            notes: [{ level: 'warning', text: V('U CR motoru se aretuje **klika, vačkové kolo i kolo VT čerpadla**. Všechny tři aretace musí jít nasadit bez násilí.', 'On the CR engine the **crank, cam sprocket and HP pump sprocket** are all locked. All three tools must fit without force.'), verify: true }]
          },
          remove: {
            notes: [{ level: 'info', text: V('U tohoto motoru se kola s podélnými otvory (vačka) při výměně povolují, aby se mohla v rámci otvorů natočit – náboj zůstává zaaretovaný. Postup ověřte v ELSA.', 'On this engine the slotted sprockets (cam) are loosened during the job so they can turn within their slots – the hub stays locked. Verify the procedure in ELSA.'), verify: true }]
          },
          tension: {
            specs: [
              { label: V('Napínák – matice', 'Tensioner nut'), value: '20 Nm + 45°', verify: true },
              { label: V('Šrouby vačkového kola', 'Cam sprocket bolts'), value: V('dle ELSA', 'per ELSA'), verify: true }
            ]
          },
          refill: {
            specs: [
              { label: V('Tlumič kliky', 'Crank damper'), value: V('10 Nm + 90° (nové šrouby)', '10 Nm + 90° (new bolts)'), verify: true },
              { label: V('Chladicí kapalina', 'Coolant'), value: V('G13, cca 7–8 l', 'G13, approx. 7–8 L'), verify: true }
            ]
          }
        }
      },
      'volvo-xc60-b4': {
        status: 'pro',
        specs: [
          { label: V('Motor', 'Engine'), value: V('2.0 benzín (rodina VEP4), 48V mild hybrid', '2.0 petrol (VEP4 family), 48 V mild hybrid'), verify: true },
          { label: V('Rozvody', 'Timing drive'), value: V('ozubený řemen, dvě vačky s variátory (VVT)', 'toothed belt, two cams with VVT phasers'), verify: true },
          { label: V('Interval', 'Interval'), value: V('dle servisního plánu Volvo – ověřte ve VIDA pro váš VIN', 'per Volvo service schedule – check VIDA for your VIN'), verify: true },
          { label: V('Aretační nářadí', 'Locking tools'), value: V('speciální přípravky Volvo pro vačky a kliku', 'Volvo special tools for cams and crank'), verify: true }
        ],
        notes: [
          { level: 'warning', text: V('**48V mild hybrid:** Startér-generátor (ISGM) je poháněn drážkovým řemenem v těsné blízkosti rozvodů. Před prací **odpojte 12V i 48V systém** dle postupu ve VIDA. 48V baterie dodá obrovský proud – zkrat nářadím způsobí oblouk a popáleniny.', '**48 V mild hybrid:** The starter-generator (ISGM) is driven by the accessory belt right next to the timing drive. Before working **disconnect both the 12 V and 48 V systems** per the VIDA procedure. The 48 V battery delivers huge currents – a tool short causes arcing and burns.') },
          { level: 'warning', text: V('Motor má **dva vačkové hřídele s variátory (VVT)**. Nepovolujte středové šrouby variátorů, pokud to postup nevyžaduje – změníte základní nastavení vaček.', 'The engine has **two camshafts with VVT phasers**. Do not loosen the phaser centre bolts unless the procedure requires it – you will lose the base cam timing.') },
          { level: 'info', text: V('Doporučeno spíše pro dílnu s VIDA (stísněný příčně uložený motor, speciální nářadí, adaptace po montáži). Návod není zablokován – postup je obecný a přesné kroky najdete ve VIDA.', 'Workshop recommended (tight transverse engine bay, special tools, adaptations afterwards). Nothing is locked – the procedure here is generic and the exact steps are in VIDA.') },
          { level: 'info', text: V('Ověřte ve VIDA, zda vodní pumpu u vašeho motoru pohání rozvodový řemen – podle toho upravte rozsah práce.', 'Check in VIDA whether the water pump on your engine is driven by the timing belt – adjust the job scope accordingly.'), verify: true }
        ],
        tools: [
          V('Volvo aretační přípravky vaček a klikového hřídele (dle VIDA)', 'Volvo cam and crankshaft locking tools (per VIDA)'),
          V('Diagnostika VIDA (odpojení 48V, adaptace po výměně)', 'VIDA diagnostics (48 V disconnection, post-job adaptations)'),
          V('Izolované nářadí / rukavice pro práci u 48V komponent', 'Insulated tools / gloves for work near 48 V components')
        ],
        steps: {
          prep: {
            notes: [{ level: 'warning', text: V('Odpojte **12V i 48V** baterii dle postupu VIDA – pouhé odpojení 12V nestačí.', 'Disconnect **both the 12 V and 48 V** batteries per the VIDA procedure – disconnecting 12 V alone is not enough.') }]
          },
          lock: {
            notes: [{ level: 'warning', text: V('Volvo přípravek zajišťuje obě vačky najednou. Bez něj vačky s variátory nelze spolehlivě nastavit.', 'The Volvo tool locks both cams at once. Without it, cams with phasers cannot be set reliably.'), verify: true }]
          },
          test: {
            notes: [{ level: 'info', text: V('Po montáži proveďte ve VIDA případné adaptace a vymazání chyb.', 'After assembly run any required adaptations and clear fault codes in VIDA.') }]
          }
        }
      },
      'mb-cl500-c216': {
        status: 'pro',
        specs: [
          { label: V('Rozvody', 'Timing drive'), value: V('řetěz (M273 V8, 4 vačky)', 'chain (M273 V8, 4 camshafts)') },
          { label: V('Interval výměny', 'Replacement interval'), value: V('bez intervalu – výměna dle stavu', 'none – replace on condition') },
          { label: V('Typické chybové kódy', 'Typical fault codes'), value: 'P0016–P0019', verify: true },
          { label: V('Známá slabina', 'Known weakness'), value: V('opotřebení vloženého kola u raných motorů', 'idler gear wear on early engines'), verify: true },
          { label: V('Motorový olej', 'Engine oil'), value: V('MB 229.5', 'MB 229.5') }
        ],
        notes: [
          { level: 'info', text: V('Tento motor **nemá rozvodový řemen**. Návod proto ukazuje, jak stav řetězu sledovat a kdy jet do servisu.', 'This engine **has no timing belt**. The tutorial therefore shows how to monitor the chain and when to visit a workshop.') }
        ],
        replaceTools: true,
        replaceFinalChecks: true,
        tools: [
          V('Diagnostika XENTRY/DAS nebo tester s podporou Mercedes', 'XENTRY/DAS or a scan tool with Mercedes support'),
          V('Zápisník na hodnoty vaček (porovnání v čase)', 'Notebook for cam values (comparison over time)')
        ],
        parts: [
          V('Pro prevenci: motorový olej MB 229.5 + filtr', 'For prevention: MB 229.5 engine oil + filter'),
          V('Při opravě (servis): řetěz, lišty, napínák, kola dle WIS', 'For repair (workshop): chain, rails, tensioner, sprockets per WIS')
        ],
        finalChecks: [
          V('Hodnoty vaček zapsány s datem a km', 'Cam values recorded with date and mileage'),
          V('Další kontrola naplánována (cca za 10–20 tis. km)', 'Next check scheduled (approx. in 10–20 thousand km)')
        ],
        steps: skipAll(),
        extraSteps: chainSteps('mb')
      },
      'toyota-gr-yaris': {
        status: 'pro',
        specs: [
          { label: V('Rozvody', 'Timing drive'), value: V('řetěz (G16E-GTS)', 'chain (G16E-GTS)') },
          { label: V('Interval výměny', 'Replacement interval'), value: V('bez intervalu – výměna dle stavu', 'none – replace on condition') },
          { label: V('Diagnostika', 'Diagnostics'), value: V('Toyota Techstream / OBD živá data VVT', 'Toyota Techstream / OBD live VVT data') }
        ],
        notes: [
          { level: 'info', text: V('Tento motor **nemá rozvodový řemen**. Návod proto ukazuje, jak stav řetězu sledovat a jak ho chránit.', 'This engine **has no timing belt**. The tutorial therefore shows how to monitor the chain and how to protect it.') }
        ],
        replaceTools: true,
        replaceFinalChecks: true,
        tools: [
          V('OBD diagnostika s živými daty (ideálně Techstream)', 'OBD scan tool with live data (ideally Techstream)')
        ],
        parts: [
          V('Pro prevenci: motorový olej dle příručky + filtr', 'For prevention: engine oil per manual + filter')
        ],
        finalChecks: [
          V('Hodnoty VVT zapsány s datem a km', 'VVT values recorded with date and mileage'),
          V('Interval oleje upraven podle provozu (okruh = častěji)', 'Oil interval adjusted to use (track = more often)')
        ],
        steps: skipAll(),
        extraSteps: chainSteps('gr')
      }
    }
  });
})(window.STU);
