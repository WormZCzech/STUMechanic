/* Tutorial: Diesel fuel filter – water drain, replacement, priming. */
(function (S) {
  'use strict';
  var V = function (cs, en) { return { cs: cs, en: en }; };

  var PETROL_STEPS = ['drain', 'lines', 'remove', 'fit', 'prime', 'start'];
  function petrolOverride(car) {
    var steps = {};
    PETROL_STEPS.forEach(function (id) { steps[id] = { skip: true }; });
    steps.locate = { notes: [{ level: 'info', text: V('U benzínových motorů bývá jemný filtr součástí modulu palivového čerpadla v nádrži. Ověřte v servisním plánu, zda má váš motor samostatný filtr pod vozem.', 'On petrol engines the fine filter is usually part of the fuel pump module in the tank. Check the service plan whether your engine has a separate filter under the car.'), verify: true }] };
    return {
      status: 'pro',
      title: V('Palivový filtr (benzín): v nádrži, bez pravidelné výměny', 'Fuel filter (petrol): in the tank, no routine change'),
      summary: V('Benzínový motor – filtr bývá v nádrži. Kdy na něj myslet a proč to není práce pro DIY.', 'Petrol engine – the filter is usually in the tank. When it matters and why it is not a DIY job.'),
      time: V('5 min čtení', '5 min read'),
      intro: V(
        'Váš ' + car + ' je **benzínový**. Palivový filtr je u většiny moderních benzínových aut **součástí modulu čerpadla v nádrži** a v servisním plánu se běžně nemění. Postup pro diesel proto přeskakujeme.\n\nPokud motor ztrácí výkon při plném plynu nebo má chybu nízkého tlaku paliva, nechte to **diagnostikovat v dílně** – otevírání nádrže znamená práci s benzínovými výpary.',
        'Your ' + car + ' runs on **petrol**. On most modern petrol cars the fuel filter is **part of the pump module inside the tank** and is not a routine service item. So we skip the diesel procedure.\n\nIf the engine loses power at full throttle or logs a low fuel pressure fault, have it **diagnosed by a workshop** – opening the tank means working with petrol vapour.'
      ),
      replaceTools: true, replaceFinalChecks: true,
      tools: [V('Diagnostika pro čtení chyb a tlaku paliva (volitelně)', 'Scan tool to read faults and fuel pressure (optional)')],
      parts: [V('Nic – pouze kontrola', 'Nothing – inspection only')],
      finalChecks: [V('Ověřeno v servisním plánu, zda vůz má vyměnitelný filtr', 'Checked in the service plan whether the car has a replaceable filter')],
      specs: [{ label: V('Umístění filtru', 'Filter location'), value: V('v nádrži (modul čerpadla) – ověřit', 'in the tank (pump module) – verify'), verify: true }],
      steps: steps,
      extraSteps: [{ after: 'locate', step: {
        id: 'petrol', anim: 'fuel-filter.petrol',
        title: V('Filtr v nádrži – co to znamená', 'Filter in the tank – what it means'),
        body: V('Sací sítko a jemný filtr jsou v modulu čerpadla. Výměna se provádí jen při závadě čerpadla nebo filtru – vyžaduje přístup k nádrži (pod sedadlem / pod vozem) a práci s výpary.', 'The strainer and fine filter sit in the pump module. They are only replaced when the pump or filter fails – this requires access to the tank (under the seat / under the car) and working with vapour.'),
        notes: [{ level: 'danger', text: V('Benzínové výpary jsou výbušné. Práce na nádrži jen v dílně s odsáváním a bez zdrojů jisker.', 'Petrol vapour is explosive. Tank work only in a workshop with extraction and no spark sources.') }]
      } }]
    };
  }

  S.registerTutorial({
    id: 'fuel-filter',
    level: 1,
    thumb: 'fuel-filter.overview',
    time: V('30–60 min', '30–60 min'),
    title: V('Palivový filtr (diesel): odvodnění, výměna, odvzdušnění', 'Diesel fuel filter: water drain, replacement, priming'),
    summary: V('Chrání vstřikovače před vodou a nečistotou. Vypuštění vody, výměna vložky, odvzdušnění.', 'Protects the injectors from water and dirt. Draining water, replacing the element, priming.'),
    intro: V(
      'Moderní dieselový motor (Common Rail) vstřikuje palivo pod tlakem až ~2000 bar. **Voda nebo nečistota v naftě** zničí vysokotlaké čerpadlo i vstřikovače – oprava stojí desítky tisíc. Palivový filtr je proto levná pojistka.\n\nNávod ukazuje **vypuštění vody** z odlučovače, **výměnu filtrační vložky** a **odvzdušnění**. Pracujete jen na **nízkotlaké straně** – vysokotlaká vedení nikdy neotvírejte.',
      'A modern diesel engine (Common Rail) injects fuel at up to ~2000 bar. **Water or dirt in the fuel** destroys the high-pressure pump and the injectors – a very expensive repair. The fuel filter is a cheap insurance.\n\nThis tutorial shows **draining water** from the separator, **replacing the element** and **priming**. You only work on the **low-pressure side** – never open high-pressure lines.'
    ),
    safety: [
      { level: 'danger', text: V('**Nikdy neotevírejte vysokotlaká vedení** (ocelové trubky mezi čerpadlem, railem a vstřikovači). Tlak až ~2000 bar – paprsek nafty pronikne kůží a způsobí otravu krve.', '**Never open high-pressure lines** (steel pipes between pump, rail and injectors). Up to ~2000 bar – a diesel jet penetrates skin and causes blood poisoning.') },
      { level: 'danger', text: V('Žádný otevřený oheň, nekouřit, žádné jiskry. Nafta a hlavně její výpary na horkém motoru jsou hořlavé.', 'No open flames, no smoking, no sparks. Diesel – especially vapour on a hot engine – is flammable.') },
      { level: 'warning', text: V('Pracujte na **studeném motoru**. Nafta na horkém výfuku může vzplanout.', 'Work on a **cold engine**. Diesel on a hot exhaust can ignite.') },
      { level: 'warning', text: V('Nafta dráždí kůži a oči – nitrilové rukavice a brýle. Rozlitou naftu ihned utřete (kluzká podlaha).', 'Diesel irritates skin and eyes – nitrile gloves and glasses. Wipe up spills at once (slippery floor).') },
      { level: 'caution', text: V('**Čistota je zásadní.** Každé zrnko nečistoty za filtrem jde rovnou do vstřikovačů. Otevřené přípojky ihned zaslepte.', '**Cleanliness is vital.** Every grain of dirt after the filter goes straight into the injectors. Cap open connections at once.') },
      { level: 'info', text: V('Použitý filtr a naftu s vodou odevzdejte jako nebezpečný odpad.', 'Dispose of the used filter and the diesel/water mix as hazardous waste.') }
    ],
    tools: [
      V('Klíč / hlavice na víko filtru (dle typu)', 'Wrench / socket for the filter lid (per type)'),
      V('Malý šroubovák na pojistky rychlospojek', 'Small screwdriver for quick-connector latches'),
      V('Průhledná nádobka na vypuštěnou naftu', 'Clear container for drained diesel'),
      V('Záchytná miska, čisté hadry bez vláken', 'Drip tray, clean lint-free rags'),
      V('Čisté krytky na zaslepení vedení', 'Clean caps to seal the lines'),
      V('Nitrilové rukavice, brýle', 'Nitrile gloves, glasses')
    ],
    parts: [
      V('Palivový filtr podle VIN / kódu motoru', 'Fuel filter by VIN / engine code'),
      V('Nová těsnění / O-kroužky (bývají v balení)', 'New seals / O-rings (usually included)'),
      V('Čistá nafta na navlhčení těsnění', 'Clean diesel to wet the seals')
    ],
    finalChecks: [
      V('Vypouštěcí šroub dotažený, žádné kapání', 'Drain screw closed, no drips'),
      V('Všechny rychlospojky zacvaknuté (kontrola tahem)', 'All quick connectors clicked in (tug test)'),
      V('Motor startuje a běží klidně, bez škubání', 'Engine starts and runs smoothly, no surging'),
      V('Po 20–50 km znovu zkontrolovat těsnost', 'Re-check for leaks after 20–50 km'),
      V('Kontrolka vody v palivu / motoru nesvítí', 'Water-in-fuel / engine warning light off')
    ],
    steps: [
      {
        id: 'why', anim: 'fuel-filter.overview',
        title: V('Jak funguje palivový filtr', 'How the fuel filter works'),
        body: V(
          'Nafta teče z nádrže přes filtr k vysokotlakému čerpadlu. Filtr zachytí **nečistoty** a ve spodní části odloučí **vodu** (je těžší než nafta). Většina filtrů má **vypouštěcí šroub** a často i **snímač vody** – kontrolka „voda v palivu“.\n\nInterval výměny je v servisním plánu (typicky 30–60 tis. km nebo 2 roky). Po tankování nekvalitní nafty nebo při kontrolce vody filtr odvodněte hned.',
          'Diesel flows from the tank through the filter to the high-pressure pump. The filter catches **dirt** and separates **water** at the bottom (it is heavier than diesel). Most filters have a **drain screw** and often a **water sensor** – the "water in fuel" warning light.\n\nThe change interval is in the service plan (typically 30–60 thousand km or 2 years). Drain the filter at once after bad fuel or when the water light comes on.'
        ),
        notes: [{ level: 'warning', text: V('Kontrolka „voda v palivu“ = zastavit co nejdřív a vodu vypustit. Voda ničí vysokotlaké čerpadlo během minut.', '"Water in fuel" light = stop as soon as possible and drain. Water destroys the high-pressure pump within minutes.') }]
      },
      {
        id: 'prep', anim: 'fuel-filter.prep',
        title: V('Příprava a čisté pracoviště', 'Preparation and a clean workplace'),
        body: V(
          'Motor studený, vypnutý, klíč mimo zapalování. Připravte záchytnou misku, čisté hadry, nový filtr a krytky. Okolí filtru **očistěte od prachu a nečistot ještě před otevřením** (suchý štětec, hadr).',
          'Engine cold and off, key out of the ignition. Get a drip tray, clean rags, the new filter and caps ready. **Clean the area around the filter before opening anything** (dry brush, rag).'
        ),
        notes: [{ level: 'caution', text: V('Nepoužívejte stlačený vzduch do otevřeného systému – nafouká nečistoty dovnitř.', 'Do not use compressed air near the open system – it blows dirt inside.') }]
      },
      {
        id: 'locate', anim: 'fuel-filter.locate',
        title: V('Najděte filtr', 'Find the filter'),
        body: V(
          'Diesely mají filtr obvykle v **motorovém prostoru** (na boku motoru, u přepážky nebo u nádržky chladicí kapaliny), některé vozy **pod vozem u nádrže**. Ověřte polohu v dílenské příručce pro váš kód motoru.',
          'Diesels usually have the filter in the **engine bay** (on the side of the engine, at the bulkhead or near the coolant tank), some cars **under the car near the tank**. Verify the position in the workshop manual for your engine code.'
        )
      },
      {
        id: 'drain', anim: 'fuel-filter.drain',
        title: V('Vypusťte vodu z odlučovače', 'Drain water from the separator'),
        body: V(
          '1. Pod vypouštěcí šroub dejte průhlednou nádobku.\n2. Šroub povolte o 2–3 otáčky (úplně ho nevyšroubujte).\n3. Nechte vytékat, dokud místo vody (čirá, drobné kapky) neteče **čistá nafta**.\n4. Šroub rukou zavřete.',
          '1. Put a clear container under the drain screw.\n2. Open the screw 2–3 turns (do not remove it completely).\n3. Let it run until **clean diesel** comes out instead of water (clear droplets).\n4. Close the screw by hand.'
        ),
        notes: [
          { level: 'info', text: V('Některé filtry potřebují k vytékání povolit i odvzdušňovací šroub nahoře nebo zapnout zapalování (elektrické čerpadlo). Řiďte se příručkou.', 'Some filters need the top bleed screw opened or the ignition switched on (electric pump) to drain. Follow the manual.'), verify: true },
          { level: 'tip', text: V('Pokud vypouštíte jen vodu (bez výměny filtru), po zavření šroubu proveďte odvzdušnění (krok „Odvzdušnění“).', 'If you only drain water (no filter change), prime the system after closing the screw (the "Priming" step).') }
        ]
      },
      {
        id: 'lines', anim: 'fuel-filter.lines',
        title: V('Odpojte palivová vedení', 'Disconnect the fuel lines'),
        body: V(
          'Vedení si označte (vstup z nádrže / výstup k čerpadlu). Stiskněte pojistku rychlospojky a spojku stáhněte. Konce **ihned zaslepte** čistými krytkami a podložte hadrem.',
          'Mark the lines (inlet from the tank / outlet to the pump). Press the quick-connector latch and pull it off. **Cap the ends at once** with clean caps and put a rag underneath.'
        ),
        notes: [{ level: 'caution', text: V('Staré plastové spojky jsou křehké – netahejte za trubku, ale za spojku. Zlomenou spojku nahraďte novou.', 'Old plastic connectors are brittle – pull the connector, not the pipe. Replace a broken connector.') }]
      },
      {
        id: 'remove', anim: 'fuel-filter.remove',
        title: V('Vyjměte starý filtr', 'Remove the old filter'),
        body: V(
          '**Vložkový filtr:** povolte víko pouzdra, vyjměte vložku svisle nahoru, vyčistěte pouzdro bezvláknovým hadrem.\n\n**Celokovový filtr:** povolte objímku / šrouby držáku a filtr vyjměte celý.',
          '**Cartridge filter:** unscrew the housing lid, lift the element straight up, wipe the housing with a lint-free rag.\n\n**Complete canister filter:** loosen the clamp / bracket bolts and remove the whole filter.'
        ),
        notes: [{ level: 'warning', text: V('Některé filtry mají vyhřívání nebo regulační (termostatický) ventil – zapamatujte si jeho polohu a konektor (foto).', 'Some filters have a heater or a regulating (thermostatic) valve – note its position and connector (take a photo).') }]
      },
      {
        id: 'fit', anim: 'fuel-filter.fit',
        title: V('Vložte nový filtr', 'Fit the new filter'),
        body: V(
          'Nová těsnění navlhčete čistou naftou. Vložte novou vložku / filtr, **předplňte čistou naftou**, pokud to výrobce povoluje (zkrátí odvzdušnění). Víko dotáhněte předepsaným momentem a připojte vedení – musí slyšitelně zacvaknout.',
          'Wet the new seals with clean diesel. Fit the new element / filter and **pre-fill it with clean diesel** if the manufacturer allows (shortens priming). Tighten the lid to the specified torque and reconnect the lines – they must click audibly.'
        ),
        specs: [{ label: V('Moment víka', 'Lid torque'), value: V('dle příručky', 'per manual'), verify: true }],
        notes: [{ level: 'caution', text: V('Nepředplňujte výstupní (čistou) stranu nefiltrovanou naftou.', 'Never pre-fill the outlet (clean) side with unfiltered diesel.') }]
      },
      {
        id: 'prime', anim: 'fuel-filter.prime',
        title: V('Odvzdušněte systém', 'Prime the system'),
        body: V(
          '**Ruční pumpička:** pumpujte, dokud nebude tvrdá (typicky 20–40×).\n\n**Elektrické čerpadlo v nádrži:** zapněte zapalování (bez startu) na ~10–20 s, vypněte, opakujte 3–5×.\n\nPak startujte v krátkých intervalech (max. ~10 s) s pauzou.',
          '**Hand primer:** pump until it gets firm (typically 20–40 strokes).\n\n**Electric in-tank pump:** switch the ignition on (no cranking) for ~10–20 s, off, repeat 3–5 times.\n\nThen crank in short bursts (max ~10 s) with pauses.'
        ),
        notes: [
          { level: 'danger', text: V('Nikdy neodvzdušňujte povolením vysokotlakých trubek na vstřikovačích.', 'Never bleed by loosening high-pressure pipes at the injectors.') },
          { level: 'warning', text: V('Dlouhé startování „na sucho“ poškozuje vysokotlaké čerpadlo (mazané naftou) a startér.', 'Long cranking "dry" damages the high-pressure pump (lubricated by diesel) and the starter.') }
        ]
      },
      {
        id: 'start', anim: 'fuel-filter.start',
        title: V('Nastartujte a zkontrolujte těsnost', 'Start up and check for leaks'),
        body: V(
          'Motor může chvíli běžet nepravidelně, než se vzduch vyplaví. Nechte ho 1–2 min běžet na volnoběh a zkontrolujte **všechny spoje** – nesmí kapat. Vymažte případné chyby nízkého tlaku paliva a proveďte zkušební jízdu.',
          'The engine may run rough for a moment until the air is purged. Let it idle for 1–2 min and check **every joint** – nothing may drip. Clear any low fuel pressure faults and do a test drive.'
        ),
        notes: [{ level: 'warning', text: V('Pokud motor nechytá ani po odvzdušnění, nestartujte dál – zkontrolujte zacvaknutí spojek a správný směr vedení.', 'If the engine will not start after priming, stop cranking – check the connectors are clicked in and the lines are the right way round.') }]
      }
    ],
    vehicles: {
      'mb-cl500-c216': petrolOverride('CL 500'),
      'volvo-xc60-b4': petrolOverride('XC60 B4'),
      'toyota-gr-yaris': petrolOverride('GR Yaris'),
      'skoda-octavia-rs-tdi': {
        status: 'ok',
        specs: [
          { label: V('Typ filtru', 'Filter type'), value: V('dle VIN / kódu motoru CEGA', 'per VIN / engine code CEGA'), verify: true },
          { label: V('Umístění', 'Location'), value: V('motorový prostor – ověřit v ELSA', 'engine bay – verify in ELSA'), verify: true },
          { label: V('Interval', 'Interval'), value: V('dle servisního plánu (často 60 000 km)', 'per service plan (often 60,000 km)'), verify: true },
          { label: V('Odvzdušnění', 'Priming'), value: V('elektrické čerpadlo v nádrži – zapalování ZAP/VYP', 'electric in-tank pump – ignition ON/OFF'), verify: true }
        ],
        notes: [
          { level: 'warning', text: V('Common Rail – vysokotlaká strana až cca 1800 bar. Pracujte jen na vstupu/výstupu filtru.', 'Common Rail – high-pressure side up to approx. 1800 bar. Only work at the filter inlet/outlet.'), verify: true },
          { level: 'info', text: V('Filtr může mít regulační ventil teploty nafty (sponou uchycený nahoře). Při výměně ho přendejte a zajistěte sponou.', 'The filter may have a fuel temperature regulating valve (clipped on top). Transfer it to the new filter and secure the clip.'), verify: true }
        ],
        steps: {
          prime: { body: V('Octavia CR TDI nemá ruční pumpičku (ověřit). Filtr předplňte (pokud to jde), zapalování 3–5× ZAP na ~15 s, pak startujte v krátkých intervalech. Některé diagnostiky (VCDS) mají test palivového čerpadla.', 'The Octavia CR TDI has no hand primer (verify). Pre-fill the filter (if possible), ignition ON 3–5× for ~15 s, then crank in short bursts. Some scan tools (VCDS) have a fuel pump output test.') }
        }
      },
      'citroen-jumper-22hdi': {
        status: 'ok',
        specs: [
          { label: V('Typ filtru', 'Filter type'), value: V('dle VIN (verze 100/120 k)', 'per VIN (100/120 hp version)'), verify: true },
          { label: V('Umístění', 'Location'), value: V('motorový prostor – ověřit', 'engine bay – verify'), verify: true },
          { label: V('Odvzdušnění', 'Priming'), value: V('ruční pumpička na filtru (pokud je osazena)', 'hand primer on the filter (if fitted)'), verify: true },
          { label: V('Snímač vody', 'Water sensor'), value: V('ve spodní části filtru – konektor odpojit před vyjmutím', 'at the bottom of the filter – unplug before removal'), verify: true }
        ],
        notes: [
          { level: 'warning', text: V('Užitkový vůz často tankuje na různých místech – vodu z filtru vypouštějte preventivně (např. při každé výměně oleje).', 'A commercial van often refuels at many places – drain water from the filter preventively (e.g. at every oil change).') },
          { level: 'info', text: V('Interval výměny filtru u užitkových vozů bývá kratší – ověřte v servisním plánu Citroën.', 'The filter interval on commercial vehicles is often shorter – verify in the Citroën service plan.'), verify: true }
        ]
      }
    }
  });
})(window.STU);
