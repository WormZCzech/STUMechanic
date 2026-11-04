/* Tutorial: Engine oil & filter change. */
(function (S) {
  'use strict';
  var V = function (cs, en) { return { cs: cs, en: en }; };

  S.registerTutorial({
    id: 'oil-change',
    level: 1,
    thumb: 'oil.drain',
    time: V('45–90 min', '45–90 min'),
    title: V('Výměna motorového oleje a filtru', 'Engine oil & filter change'),
    summary: V('Nejčastější servisní úkon. Správná specifikace oleje, nový filtr a těsnění, správné množství.', 'The most common service job. Correct oil spec, new filter and seals, correct amount.'),
    intro: V(
      'Olej maže, chladí a čistí motor. Špatný typ oleje, chybějící těsnění nebo zapomenuté víčko umí zničit motor za pár kilometrů. Postupujte pečlivě a **před prvním nastartováním vždy zkontrolujte hladinu**.\n\nPro zvednutí vozu použijte návod **Bezpečné zvednutí vozu**.',
      'Oil lubricates, cools and cleans the engine. The wrong oil, a missing seal or a forgotten cap can destroy an engine within a few kilometres. Work carefully and **always check the level before the first start**.\n\nTo lift the car use the **Safely lifting the car** tutorial.'
    ),
    safety: [
      { level: 'danger', text: V('Pod vůz jen na **stojanech nebo nájezdových rampách** – nikdy jen na heveru. Viz návod Bezpečné zvednutí vozu.', 'Only get under the car on **axle stands or drive-on ramps** – never on a jack alone. See the Safely lifting the car tutorial.') },
      { level: 'warning', text: V('Horký olej a výfuk způsobují popáleniny. Motor zahřejte jen krátce (olej teplý, ne horký) a pracujte v rukavicích.', 'Hot oil and exhaust cause burns. Warm the engine only briefly (oil warm, not hot) and wear gloves.') },
      { level: 'warning', text: V('Použitý motorový olej je karcinogenní. Nitrilové rukavice, ochranné brýle, kůži umýt mýdlem.', 'Used engine oil is carcinogenic. Nitrile gloves, safety glasses, wash skin with soap.') },
      { level: 'caution', text: V('Použijte **jen olej se správnou specifikací/normou výrobce** (ne jen viskozitu). Špatný olej ničí motor, turbo i filtr pevných částic.', 'Use **only oil meeting the manufacturer\'s approval/spec** (not just the viscosity). The wrong oil damages the engine, turbo and particulate filter.') },
      { level: 'info', text: V('Starý olej a filtr odevzdejte na sběrném dvoře nebo v servisu. Nikdy do kanálu ani do země – je to trestné a nebezpečné pro vodu.', 'Take old oil and filter to a recycling centre or garage. Never into a drain or the ground – it is illegal and poisons water.') }
    ],
    tools: [
      V('Hever + stojany nebo nájezdové rampy', 'Jack + axle stands or drive-on ramps'),
      V('Záchytná vana na olej (min. 10 l)', 'Oil drain pan (at least 10 L)'),
      V('Klíč / hlavice na vypouštěcí šroub', 'Wrench / socket for the drain plug'),
      V('Klíč na olejový filtr (hlavice na víko nebo stahovák)', 'Oil filter wrench (cap socket or strap wrench)'),
      V('Momentový klíč (rozsah cca 10–60 Nm)', 'Torque wrench (range approx. 10–60 Nm)'),
      V('Trychtýř', 'Funnel'),
      V('Papírové utěrky, odmašťovač', 'Paper towels, degreaser'),
      V('Nitrilové rukavice, brýle', 'Nitrile gloves, glasses')
    ],
    parts: [
      V('Motorový olej se správnou normou (viz specifikace vozu)', 'Engine oil with the correct approval (see vehicle specs)'),
      V('Olejový filtr (vložka nebo našroubovací)', 'Oil filter (cartridge or spin-on)'),
      V('Nové těsnění vypouštěcího šroubu (nebo nový šroub)', 'New drain plug seal (or new plug)'),
      V('O-kroužky víka filtru (bývají v balení filtru)', 'Filter cap O-rings (usually included with the filter)')
    ],
    finalChecks: [
      V('Víčko plnicího hrdla zašroubované', 'Oil filler cap fitted'),
      V('Hladina oleje mezi MIN a MAX', 'Oil level between MIN and MAX'),
      V('Žádná kapka pod vypouštěcím šroubem ani filtrem', 'No drip under the drain plug or filter'),
      V('Kontrolka tlaku oleje po nastartování zhasla do 2–3 s', 'Oil pressure light went off within 2–3 s after starting'),
      V('Žádné nářadí ani hadry v motorovém prostoru', 'No tools or rags left in the engine bay'),
      V('Servisní interval vynulován, km zapsány', 'Service interval reset, mileage recorded'),
      V('Po prvních 10–20 km znovu zkontrolovat hladinu a těsnost', 'Re-check level and leaks after the first 10–20 km')
    ],
    steps: [
      {
        id: 'prep', anim: 'oil.level',
        title: V('Připravte správný olej a zkontrolujte stav', 'Get the right oil and check the current state'),
        body: V(
          'Podle specifikace vozu kupte olej se **správnou normou** (např. VW 507.00, MB 229.5) a viskozitou, nový filtr a těsnění šroubu.\n\nZkontrolujte současnou hladinu – pokud olej rychle ubývá, zapište si to (možná netěsnost nebo spotřeba).',
          'Buy oil with the **correct approval** (e.g. VW 507.00, MB 229.5) and viscosity, a new filter and a plug seal according to the vehicle specs.\n\nCheck the current level – if oil disappears quickly, note it down (possible leak or consumption).'
        ),
        notes: [
          { level: 'caution', text: V('Olejový filtr vybírejte podle VIN / kódu motoru, ne jen podle modelu – i stejný model může mít různé filtry.', 'Choose the oil filter by VIN / engine code, not just the model – the same model can have different filters.') },
          { level: 'tip', text: V('Mléčný, pěnivý nebo kovově třpytivý olej je varovný signál (chladicí kapalina v oleji, opotřebení). Ukažte ho mechanikovi.', 'Milky, foamy or metallic glittering oil is a warning sign (coolant in oil, wear). Show it to a mechanic.') }
        ]
      },
      {
        id: 'warm', anim: 'oil.warm',
        title: V('Zahřejte motor – krátce', 'Warm the engine – briefly'),
        body: V(
          'Nechte motor běžet **2–5 minut** na volnoběh. Teplý olej je řidší a lépe vyteče i s nečistotami. Pak motor vypněte.',
          'Let the engine idle for **2–5 minutes**. Warm oil is thinner and drains better with the dirt. Then switch the engine off.'
        ),
        notes: [
          { level: 'warning', text: V('Po delší jízdě nechte motor 30–60 min vychladnout. Olej může mít přes 100 °C.', 'After a longer drive, let the engine cool for 30–60 min. Oil can be above 100 °C.') },
          { level: 'danger', text: V('Motor nikdy nenechávejte běžet v uzavřené garáži – oxid uhelnatý zabíjí bez varování.', 'Never run the engine in a closed garage – carbon monoxide kills without warning.') }
        ]
      },
      {
        id: 'lift', anim: 'lift.stands',
        title: V('Zvedněte vůz vodorovně', 'Lift the car level'),
        body: V(
          'Zvedněte vůz na stojany nebo najeďte na rampy podle návodu **Bezpečné zvednutí vozu**. Vůz by měl stát co nejvíc **vodorovně**, aby olej vytekl celý.\n\nDemontujte spodní kryt motoru, pokud zakrývá vypouštěcí šroub nebo filtr.',
          'Put the car on stands or drive onto ramps following the **Safely lifting the car** tutorial. The car should be as **level** as possible so all the oil drains.\n\nRemove the engine undertray if it covers the drain plug or filter.'
        ),
        notes: [
          { level: 'danger', text: V('Proveďte test stability (zatřesení) dřív, než pod vůz vlezete.', 'Do the stability (shake) test before you get under the car.') },
          { level: 'tip', text: V('Šrouby spodního krytu dávejte do misky – bývají různé délky.', 'Keep the undertray screws in a tray – they are often of different lengths.') }
        ]
      },
      {
        id: 'cap', anim: 'oil.capOff',
        title: V('Povolte víčko plnicího hrdla', 'Open the oil filler cap'),
        body: V(
          'Odšroubujte víčko plnicího hrdla nahoře na motoru. Do motoru pak může proudit vzduch a olej vyteče rychleji.\n\nVíčko položte na **viditelné místo** (např. na nové lahve oleje), abyste ho nezapomněli vrátit.',
          'Unscrew the oil filler cap on top of the engine. Air can then flow in and the oil drains faster.\n\nPut the cap somewhere **visible** (e.g. on top of the new oil bottles) so you do not forget to refit it.'
        ),
        notes: [
          { level: 'caution', text: V('Do otevřeného hrdla nesmí spadnout nečistoty ani šroubky – zakryjte ho čistým hadříkem.', 'No dirt or screws must fall into the open filler neck – cover it with a clean rag.') }
        ]
      },
      {
        id: 'drain', anim: 'oil.drain',
        title: V('Vypusťte starý olej', 'Drain the old oil'),
        body: V(
          '1. Záchytnou vanu dejte pod vypouštěcí šroub – **trochu stranou**, proud oleje stříká šikmo.\n2. Šroub povolte klíčem (proti směru hodinových ručiček).\n3. Poslední závity povolte rukou, šroub přitlačte a pak **rychle odtáhněte** do strany.\n4. Nechte olej vytékat 10–15 minut, dokud nekape jen občas.',
          '1. Place the drain pan under the drain plug – **slightly off to the side**, the oil stream shoots out at an angle.\n2. Loosen the plug with a wrench (counter-clockwise).\n3. Undo the last threads by hand, keep pressing the plug in, then **pull it away quickly** to the side.\n4. Let the oil drain for 10–15 minutes until it only drips occasionally.'
        ),
        notes: [
          { level: 'warning', text: V('Olej může být horký – rukavice, brýle, ruku hned odtáhnout.', 'The oil can be hot – gloves, glasses, pull your hand away at once.') },
          { level: 'caution', text: V('Prohlédněte vypouštěcí šroub: kovové špony na magnetu nebo poškozený závit = problém, nepokračujte bez konzultace.', 'Inspect the drain plug: metal chips on the magnet or damaged threads = problem, do not continue without advice.') }
        ]
      },
      {
        id: 'filter', anim: 'oil.filterCart',
        title: V('Vyměňte olejový filtr', 'Replace the oil filter'),
        body: V(
          '**Vložkový filtr (v pouzdře):** Povolte víko pouzdra, vyjměte starou vložku, vyměňte všechny O-kroužky (namažte je čistým olejem), vložte novou vložku a víko dotáhněte předepsaným momentem.\n\n**Našroubovací filtr:** Povolte klíčem na filtr, těsnění nového filtru namažte olejem, zašroubujte rukou až dosedne a dotáhněte o ¾ otáčky (nebo dle návodu na filtru).',
          '**Cartridge filter (in a housing):** Loosen the housing cap, remove the old element, replace all O-rings (lubricate them with clean oil), insert the new element and tighten the cap to the specified torque.\n\n**Spin-on filter:** Loosen with a filter wrench, oil the new filter\'s gasket, screw it on by hand until it seats, then tighten ¾ of a turn (or per the filter instructions).'
        ),
        notes: [
          { level: 'warning', text: V('Zkontrolujte, že **staré těsnění filtru nezůstalo přilepené** na motoru. Dvě těsnění na sobě = olej vystříká během minuty.', 'Make sure the **old filter gasket did not stay stuck** on the engine. Two gaskets on top of each other = oil sprays out within a minute.') },
          { level: 'caution', text: V('Víko plastového pouzdra nepřetahujte – praskne. Používejte momentový klíč.', 'Do not over-tighten a plastic housing cap – it cracks. Use a torque wrench.') }
        ]
      },
      {
        id: 'plug', anim: 'oil.plug',
        title: V('Zašroubujte vypouštěcí šroub s novým těsněním', 'Refit the drain plug with a new seal'),
        body: V(
          'Očistěte dosedací plochu, nasaďte **nové těsnění** (měděná/hliníková podložka nebo O-kroužek), šroub zašroubujte rukou a dotáhněte momentovým klíčem.',
          'Clean the sealing surface, fit a **new seal** (copper/aluminium washer or O-ring), screw the plug in by hand and tighten with a torque wrench.'
        ),
        specs: [{ label: V('Moment vypouštěcího šroubu', 'Drain plug torque'), value: V('dle příručky', 'per manual') }],
        notes: [
          { level: 'warning', text: V('Šroub nikdy nepřetahujte – strhnete závit v olejové vaně (drahá oprava). Hliníkové vany jsou zvlášť citlivé.', 'Never over-tighten the plug – you will strip the oil pan thread (expensive repair). Aluminium pans are especially sensitive.') }
        ]
      },
      {
        id: 'fill', anim: 'oil.fill',
        title: V('Nalijte nový olej', 'Fill with new oil'),
        body: V(
          'Spusťte vůz na zem (vodorovně). Nalijte přes trychtýř cca **90 % předepsaného množství**, počkejte 2–3 minuty a zkontrolujte hladinu. Doplňujte po malých dávkách (0,2–0,3 l) až k horní značce.',
          'Lower the car to the ground (level). Pour about **90 % of the specified amount** through a funnel, wait 2–3 minutes and check the level. Top up in small amounts (0.2–0.3 L) up to the upper mark.'
        ),
        notes: [
          { level: 'warning', text: V('Příliš mnoho oleje je stejně škodlivé jako málo – pění, poškodí těsnění, katalyzátor nebo DPF. Nad MAX odsajte.', 'Too much oil is as harmful as too little – it foams and damages seals, the catalytic converter or DPF. Suck out any excess above MAX.') }
        ]
      },
      {
        id: 'check', anim: 'oil.check',
        title: V('Nastartujte a zkontrolujte těsnost', 'Start up and check for leaks'),
        body: V(
          '1. Zkontrolujte, že je **víčko zašroubované**.\n2. Nastartujte – kontrolka tlaku oleje musí zhasnout do 2–3 sekund.\n3. Nechte běžet 30–60 s a zkontrolujte šroub a filtr – nesmí kapat.\n4. Vypněte, počkejte 5 minut a změřte hladinu. Případně doplňte.',
          '1. Make sure the **filler cap is on**.\n2. Start the engine – the oil pressure light must go out within 2–3 seconds.\n3. Let it run for 30–60 s and check the plug and filter – no drips.\n4. Switch off, wait 5 minutes and check the level. Top up if needed.'
        ),
        notes: [
          { level: 'danger', text: V('Pokud kontrolka tlaku oleje **nezhasne do 3 sekund, okamžitě vypněte motor!** Hledejte příčinu (chybějící olej, špatně nasazený filtr).', 'If the oil pressure light **does not go out within 3 seconds, switch off immediately!** Find the cause (missing oil, badly fitted filter).') }
        ]
      },
      {
        id: 'reset', anim: 'oil.reset',
        title: V('Vynulujte servis a zlikvidujte olej', 'Reset the service and dispose of the oil'),
        body: V(
          'Vynulujte servisní interval (menu vozu nebo diagnostika), zapište datum, km a použitý olej. Starý olej přelijte do lahví a odevzdejte ho i s filtrem na sběrném dvoře.',
          'Reset the service interval (car menu or scan tool), write down the date, mileage and oil used. Pour the old oil into the empty bottles and take it with the filter to a recycling centre.'
        ),
        notes: [
          { level: 'tip', text: V('Na víčko nebo do motorového prostoru dejte štítek s datem a km výměny.', 'Put a sticker with the date and mileage on the cap or in the engine bay.') }
        ]
      }
    ],
    vehicles: {
      'mb-cl500-c216': {
        status: 'ok',
        specs: [
          { label: V('Norma oleje', 'Oil approval'), value: V('MB 229.5 (např. 5W-40 / 0W-40)', 'MB 229.5 (e.g. 5W-40 / 0W-40)') },
          { label: V('Množství s filtrem', 'Capacity incl. filter'), value: V('cca 8,0 l', 'approx. 8.0 L'), verify: true },
          { label: V('Filtr', 'Filter'), value: V('Vložka v pouzdře nahoře na motoru (vpředu)', 'Cartridge in a housing on top of the engine (front)'), verify: true },
          { label: V('Moment víka filtru', 'Filter cap torque'), value: '25 Nm', verify: true },
          { label: V('Moment vypouštěcího šroubu', 'Drain plug torque'), value: '30 Nm', verify: true },
          { label: V('Servisní systém', 'Service system'), value: 'ASSYST PLUS' }
        ],
        notes: [
          { level: 'info', text: V('Velký V8 = hodně oleje. Kupte 2× 5l balení, ať máte rezervu na dolití.', 'Big V8 = lots of oil. Buy 2× 5 L cans so you have some left to top up.') },
          { level: 'warning', text: V('Při zvedání respektujte ABC podvozek – viz poznámky v návodu na zvedání.', 'Respect the ABC suspension when lifting – see notes in the lifting tutorial.') }
        ],
        steps: {
          filter: { body: V('Pouzdro filtru je **nahoře na motoru** – vložka se mění shora. Nejdřív lehce povolte víko filtru, aby olej z pouzdra stekl do vany, a až pak vypouštějte.', 'The filter housing is **on top of the engine** – the element is changed from above. First loosen the filter cap slightly so the housing drains into the sump, then drain the oil.'), specs: [{ label: V('Víko filtru', 'Filter cap'), value: '25 Nm', verify: true }] },
          plug: { specs: [{ label: V('Vypouštěcí šroub', 'Drain plug'), value: '30 Nm', verify: true }] },
          fill: { specs: [{ label: V('Množství', 'Capacity'), value: V('cca 8,0 l', 'approx. 8.0 L'), verify: true }], notes: [{ level: 'info', text: V('Hladinu kontrolujte měrkou a/nebo v menu přístrojové desky (pokud ho vůz nabízí).', 'Check the level with the dipstick and/or in the instrument cluster menu (if the car offers it).'), verify: true }] },
          reset: { body: V('Reset ASSYST PLUS v menu přístrojové desky (Servis), případně XENTRY. Přesný postup ověřte v uživatelské příručce.', 'Reset ASSYST PLUS in the instrument cluster menu (Service), or with XENTRY. Verify the exact procedure in the owner\'s manual.') }
        }
      },
      'volvo-xc60-b4': {
        status: 'ok',
        specs: [
          { label: V('Norma oleje', 'Oil spec'), value: 'VCC RBS0-2AE 0W-20', verify: true },
          { label: V('Množství s filtrem', 'Capacity incl. filter'), value: V('cca 5,2–5,9 l', 'approx. 5.2–5.9 L'), verify: true },
          { label: V('Kontrola hladiny', 'Level check'), value: V('Elektronicky na centrálním displeji (bez měrky)', 'Electronic on the centre display (no dipstick)'), verify: true },
          { label: V('Moment vypouštěcího šroubu', 'Drain plug torque'), value: V('dle VIDA', 'per VIDA'), verify: true },
          { label: V('Reset servisu', 'Service reset'), value: V('Diagnostika (VIDA / kompatibilní tester)', 'Scan tool (VIDA / compatible)'), verify: true }
        ],
        notes: [
          { level: 'warning', text: V('Vůz nemá klasickou měrku. Hladinu měřte jen podle postupu výrobce (vůz na rovině, motor teplý, po vypnutí vyčkat). **Neplňte „od oka“** – přeplnění hrozí.', 'The car has no conventional dipstick. Measure the level only per the manufacturer\'s procedure (car level, engine warm, wait after switching off). **Do not fill by guesswork** – risk of overfilling.'), verify: true },
          { level: 'info', text: V('Umístění filtru a přístup (shora / zespodu) ověřte ve VIDA pro váš VIN.', 'Check the filter location and access (from above / below) in VIDA for your VIN.'), verify: true }
        ],
        steps: {
          prep: { body: V('Na centrálním displeji zkontrolujte aktuální hladinu oleje. Kupte olej se specifikací Volvo – na obalu musí být uvedeno schválení.', 'Check the current oil level on the centre display. Buy oil with the Volvo specification – the approval must be printed on the bottle.') },
          fill: { notes: [{ level: 'caution', text: V('Po naplnění může elektronické měření potřebovat jízdu nebo několik minut, než ukáže hodnotu. Doplňujte opatrně po malých dávkách.', 'After filling, the electronic measurement may need a drive or several minutes before it shows a value. Top up carefully in small amounts.'), verify: true }] },
          reset: { body: V('Servisní interval Volvo vynulujte diagnostikou (VIDA nebo tester s funkcí Volvo service reset).', 'Reset the Volvo service interval with a scan tool (VIDA or a tester with a Volvo service-reset function).') }
        }
      },
      'skoda-octavia-rs-tdi': {
        status: 'ok',
        specs: [
          { label: V('Norma oleje', 'Oil approval'), value: V('VW 507.00, 5W-30', 'VW 507.00, 5W-30') },
          { label: V('Množství s filtrem', 'Capacity incl. filter'), value: V('cca 4,3 l', 'approx. 4.3 L'), verify: true },
          { label: V('Filtr', 'Filter'), value: V('Vložka v pouzdře nahoře vpředu na motoru', 'Cartridge in a housing on top front of the engine') },
          { label: V('Moment víka filtru', 'Filter cap torque'), value: '25 Nm', verify: true },
          { label: V('Moment vypouštěcího šroubu', 'Drain plug torque'), value: '30 Nm', verify: true }
        ],
        notes: [
          { level: 'caution', text: V('Jen olej **VW 507.00** (low-SAPS). Olej bez této normy zanáší filtr pevných částic (DPF).', 'Only **VW 507.00** oil (low-SAPS). Oil without this approval clogs the particulate filter (DPF).') },
          { level: 'tip', text: V('U naftového motoru s DPF doporučujeme měnit olej po 15 000 km nebo 1 roce, i když servisní interval ukazuje víc.', 'For a diesel with DPF we recommend changing the oil every 15,000 km or 1 year, even if the service indicator shows more.') }
        ],
        steps: {
          lift: { body: V('Spodní kryt motoru je přišroubovaný (Torx/šrouby). U některých verzí má servisní otvor pro vypouštěcí šroub – ověřte.', 'The engine undertray is screwed on (Torx/screws). Some versions have a service opening for the drain plug – verify.') },
          filter: { body: V('Pouzdro filtru je **nahoře vpředu na motoru**. Víko povolte hlavicí 32 mm (ověřit) a vyjměte vložku. Vyměňte O-kroužky víka.', 'The filter housing is **on top front of the engine**. Loosen the cap with a 32 mm socket (verify) and remove the element. Replace the cap O-rings.'), specs: [{ label: V('Víko filtru', 'Filter cap'), value: '25 Nm', verify: true }] },
          plug: { specs: [{ label: V('Vypouštěcí šroub', 'Drain plug'), value: '30 Nm', verify: true }], notes: [{ level: 'info', text: V('VW doporučuje vypouštěcí šroub s těsněním měnit vždy nový.', 'VW recommends always fitting a new drain plug with seal.') }] },
          fill: { specs: [{ label: V('Množství', 'Capacity'), value: V('cca 4,3 l', 'approx. 4.3 L'), verify: true }] },
          reset: { body: V('Octavia II: reset servisu tlačítkem nulování denních km (0.0/SET) při zapínání zapalování, nebo v menu MAXI DOT, případně VCDS (kanál pro servisní interval). Přesný postup ověřte v příručce.', 'Octavia II: reset the service indicator with the trip reset button (0.0/SET) while switching on the ignition, or in the MAXI DOT menu, or with VCDS (service interval channel). Verify the exact procedure in the manual.') }
        }
      },
      'toyota-gr-yaris': {
        status: 'ok',
        specs: [
          { label: V('Olej', 'Oil'), value: V('dle uživatelské příručky (viskozita dle provozu)', 'per owner\'s manual (viscosity depends on use)'), verify: true },
          { label: V('Množství s filtrem', 'Capacity incl. filter'), value: V('cca 4,5 l', 'approx. 4.5 L'), verify: true },
          { label: V('Filtr', 'Filter'), value: V('Našroubovací (ověřte typ na voze)', 'Spin-on (check the type on the car)'), verify: true },
          { label: V('Moment vypouštěcího šroubu', 'Drain plug torque'), value: V('dle TIS', 'per TIS'), verify: true }
        ],
        notes: [
          { level: 'warning', text: V('Při okruhovém provozu měňte olej mnohem častěji (např. po každé sezóně / akci na okruhu). Turbomotor s vysokým výkonem je na kvalitu oleje citlivý.', 'With track use change the oil much more often (e.g. after every season / track event). The high-output turbo engine is sensitive to oil quality.') },
          { level: 'info', text: V('Typ filtru a přístup k němu si ověřte před nákupem dílů (TIS / prodejce Toyota) – nechceme hádat.', 'Verify the filter type and access before buying parts (TIS / Toyota dealer) – we do not want to guess.'), verify: true }
        ],
        steps: {
          lift: { body: V('Vůz je nízký – použijte nízkoprofilový hever nebo nízké nájezdy. Pro přístup bývá nutné sundat spodní aerodynamický kryt.', 'The car is low – use a low-profile jack or low ramps. The underbody aero cover usually has to be removed for access.') },
          filter: { anim: 'oil.filterSpin', notes: [{ level: 'info', text: V('Animace ukazuje našroubovací filtr. Pokud má váš motor vložkový filtr, postupujte dle prvního odstavce.', 'The animation shows a spin-on filter. If your engine has a cartridge filter, follow the first paragraph.'), verify: true }] },
          fill: { specs: [{ label: V('Množství', 'Capacity'), value: V('cca 4,5 l', 'approx. 4.5 L'), verify: true }] },
          reset: { body: V('Upomínku údržby vynulujte v menu přístrojové desky (MID) – postup dle uživatelské příručky.', 'Reset the maintenance reminder in the instrument cluster menu (MID) – procedure per the owner\'s manual.'), verify: true }
        }
      }
    }
  });
})(window.STU);
