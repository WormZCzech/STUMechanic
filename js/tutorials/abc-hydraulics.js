/* Tutorial: Mercedes ABC (Active Body Control) hydraulics – CL 500 C216 only. */
(function (S) {
  'use strict';
  var V = function (cs, en) { return { cs: cs, en: en }; };

  S.registerTutorial({
    id: 'abc-hydraulics',
    level: 3,
    only: ['mb-cl500-c216'],
    status: 'pro',
    thumb: 'abc.overview',
    time: V('1–4 h (kontrola) · výměna kapaliny dle WIS', '1–4 h (inspection) · fluid change per WIS'),
    title: V('ABC hydraulika: kontrola, kapalina, kalibrace', 'ABC hydraulics: inspection, fluid, calibration'),
    summary: V('Active Body Control na CL 500: jak funguje, příznaky, kontrola kapaliny a netěsností, servis a kalibrace výšky.', 'Active Body Control on the CL 500: how it works, symptoms, fluid and leak checks, service and level calibration.'),
    intro: V(
      'ABC je **aktivní hydraulické odpružení**: tandemové čerpadlo na motoru tlačí speciální kapalinu (Pentosin CHF 11S) pod tlakem kolem **200 bar** přes ventilové bloky do plunžrových válců na každé vzpěře. Řídicí jednotka tak drží karoserii rovně v zatáčkách i při brzdění.\n\nKontrolu, hledání netěsností a výměnu kapaliny zvládnete sami. **Práce na vedeních, zásobnících a vzpěrách jsou nebezpečné kvůli vysokému tlaku** – vždy jen po odtlakování dle WIS. Nic není zablokované, ale berte varování vážně.',
      'ABC is **active hydraulic suspension**: a tandem pump on the engine pushes a special fluid (Pentosin CHF 11S) at around **200 bar** through valve blocks into a plunger cylinder on each strut. The control unit keeps the body level in corners and under braking.\n\nYou can do the inspection, leak hunting and fluid change yourself. **Work on lines, accumulators and struts is dangerous because of the high pressure** – only ever after depressurising per WIS. Nothing is locked, but take the warnings seriously.'
    ),
    safety: [
      { level: 'danger', text: V('**Vysoký tlak (~200 bar):** Nikdy nepovolujte šroubení, zásobník ani vedení ABC, dokud systém není odtlakovaný dle WIS. Paprsek kapaliny pronikne kůží – vstřik kapaliny do těla vyžaduje okamžitou operaci.', '**High pressure (~200 bar):** Never loosen an ABC fitting, accumulator or line until the system is depressurised per WIS. A fluid jet penetrates skin – an injection injury needs immediate surgery.'), verify: true },
      { level: 'danger', text: V('Nikdy nepracujte pod vozem drženým jen hydraulikou ABC. Vůz může sám klesnout nebo se zvednout. Vždy stojany pod zvedacími body.', 'Never work under a car held only by the ABC hydraulics. It can lower or rise on its own. Always use stands under the jacking points.') },
      { level: 'warning', text: V('Netěsnost nehledejte rukou – jen očima a baterkou při vypnutém motoru.', 'Never feel for leaks with your hand – eyes and a torch only, engine off.') },
      { level: 'warning', text: V('Používejte **jen Pentosin CHF 11S (MB 343.0)**. Jiná kapalina (i jiná zelená) zničí těsnění, ventily a čerpadlo.', 'Use **only Pentosin CHF 11S (MB 343.0)**. Any other fluid (even another green one) destroys seals, valves and the pump.'), verify: true },
      { level: 'caution', text: V('Ochranné brýle a nitrilové rukavice. Kapalina dráždí oči a kůži.', 'Safety glasses and nitrile gloves. The fluid irritates eyes and skin.') }
    ],
    tools: [
      V('Diagnostika XENTRY / DAS nebo tester s funkcemi ABC', 'XENTRY / DAS or a scan tool with ABC functions'),
      V('Baterka, zrcátko', 'Torch, inspection mirror'),
      V('Odsávací stříkačka / podtlaková pumpa na kapalinu', 'Fluid extraction syringe / vacuum pump'),
      V('Hever a stojany (min. 2 t)', 'Jack and stands (at least 2 t)'),
      V('Svinovací metr', 'Tape measure'),
      V('Ochranné brýle, nitrilové rukavice, čisté hadry', 'Safety glasses, nitrile gloves, clean rags')
    ],
    parts: [
      V('Pentosin CHF 11S (MB 343.0) – množství dle WIS', 'Pentosin CHF 11S (MB 343.0) – amount per WIS'),
      V('Filtr / sítko nádržky ABC (dle VIN)', 'ABC reservoir filter / strainer (by VIN)'),
      V('Těsnicí kroužky šroubení (při práci na vedeních)', 'Fitting seal rings (when working on lines)')
    ],
    finalChecks: [
      V('Hladina kapaliny ABC mezi MIN a MAX (měřeno dle WIS)', 'ABC fluid level between MIN and MAX (measured per WIS)'),
      V('Žádná netěsnost po zkušební jízdě a noci stání', 'No leak after a test drive and an overnight stand'),
      V('Vůz ráno nestojí níž ani nakřivo', 'Car does not sit lower or uneven in the morning'),
      V('Žádná kontrolka / hlášení ABC', 'No ABC warning light / message'),
      V('Výška vozu odpovídá hodnotám z WIS', 'Ride height matches the WIS values')
    ],
    steps: [
      {
        id: 'how', anim: 'abc.overview',
        title: V('Jak ABC funguje', 'How ABC works'),
        body: V(
          '- **Tandemové čerpadlo** na motoru: jedna část pro ABC, druhá pro posilovač řízení (ověřit u vašeho motoru).\n- **Nádržka** s kapalinou a filtrem.\n- **Ventilové bloky** vpředu a vzadu řídí tok do jednotlivých vzpěr.\n- **Plunžrové válce** na vzpěrách zvedají/spouštějí roh vozu.\n- **Tlakové zásobníky** tlumí rázy a drží tlak.',
          '- **Tandem pump** on the engine: one half for ABC, the other for power steering (verify for your engine).\n- **Reservoir** with fluid and filter.\n- **Valve blocks** front and rear control the flow to each strut.\n- **Plunger cylinders** on the struts raise / lower each corner.\n- **Pressure accumulators** absorb shocks and hold pressure.'
        ),
        notes: [{ level: 'info', text: V('Rozložení a počet zásobníků se může lišit podle roku a výbavy – ověřte ve WIS.', 'Layout and number of accumulators can differ by year and equipment – verify in WIS.'), verify: true }]
      },
      {
        id: 'symptoms', anim: 'abc.symptoms',
        title: V('Příznaky problému s ABC', 'Symptoms of an ABC problem'),
        body: V(
          '- Vůz **přes noc klesne** (jeden roh nebo celý).\n- **Tvrdá, bouchavá jízda** – často vadné zásobníky.\n- **Hluk / pískání čerpadla**, hlavně za studena.\n- **Kontrolka ABC**: žlutá = do servisu, červená = zastavit.\n- Mokré vzpěry, kapky zelené kapaliny pod vozem.',
          '- The car **sinks overnight** (one corner or all).\n- **Harsh, knocking ride** – often worn accumulators.\n- **Pump whine / noise**, mainly when cold.\n- **ABC warning**: yellow = workshop, red = stop.\n- Wet struts, drops of green fluid under the car.'
        ),
        notes: [{ level: 'danger', text: V('Červené hlášení ABC („Zastavte vůz“): bezpečně zastavte, nepokračujte v jízdě – hrozí ztráta odpružení a ovladatelnosti.', 'Red ABC message ("Stop vehicle"): stop safely and do not drive on – risk of losing suspension and control.') }]
      },
      {
        id: 'pressure', anim: 'abc.injection',
        title: V('Bezpečnost: vysoký tlak', 'Safety: high pressure'),
        body: V(
          'Systém pracuje s tlakem kolem 200 bar a **zásobníky drží tlak i po vypnutí motoru**. Než povolíte cokoli hydraulického, systém musí být odtlakovaný (krok „Odtlakování“).',
          'The system runs at around 200 bar and **the accumulators hold pressure even after the engine is off**. Before you loosen anything hydraulic, the system must be depressurised (step "Depressurise").'
        ),
        notes: [{ level: 'danger', text: V('Při zasažení paprskem kapaliny jeďte okamžitě na pohotovost a řekněte „vstřik hydraulické kapaliny pod vysokým tlakem“ – i když rána vypadá malá.', 'If hit by a fluid jet, go to A&E immediately and say "high-pressure hydraulic fluid injection" – even if the wound looks tiny.') }]
      },
      {
        id: 'lift', anim: 'abc.lift',
        title: V('Bezpečné zvednutí vozu s ABC', 'Safely lifting a car with ABC'),
        body: V(
          '1. Nechte vůz v **normální výšce** (ne zvýšené).\n2. Vypněte motor, zavřete dveře, klíč (Keyless-Go) mimo dosah, počkejte cca 1 minutu.\n3. Zvedejte jen za zvedací body a vždy podložte stojany – viz návod Bezpečné zvednutí vozu.',
          '1. Leave the car at **normal ride height** (not raised).\n2. Switch off, close the doors, key (Keyless-Go) out of range, wait about 1 minute.\n3. Lift only at the jacking points and always use stands – see the Safely lifting the car tutorial.'
        ),
        notes: [{ level: 'warning', text: V('Nepoužívejte tlačítko změny výšky, když je vůz na heveru nebo stojanech.', 'Do not use the ride-height button while the car is on a jack or stands.') }]
      },
      {
        id: 'level', anim: 'abc.reservoir',
        title: V('Hladina a stav kapaliny', 'Fluid level and condition'),
        body: V(
          'Nádržka ABC je v motorovém prostoru. Hladinu měřte **přesně podle WIS** (v jakém stavu motoru a výšky vozu – ověřte). Kapalina má být **zelená a čirá**.\n\nTmavá, kalná nebo zpěněná kapalina = výměna kapaliny a filtru.',
          'The ABC reservoir is in the engine bay. Measure the level **exactly per WIS** (engine and ride-height condition – verify). The fluid should be **green and clear**.\n\nDark, cloudy or foamy fluid = change fluid and filter.'
        ),
        notes: [
          { level: 'warning', text: V('Nepřelévat nad MAX – při poklesu vozu se kapalina vrací do nádržky a může vytéct.', 'Do not overfill above MAX – when the car lowers, fluid returns to the reservoir and can overflow.'), verify: true },
          { level: 'caution', text: V('Klesající hladina = netěsnost. Nedolévejte „naslepo“ dlouhodobě – najděte příčinu.', 'A falling level = a leak. Do not just keep topping up – find the cause.') }
        ]
      },
      {
        id: 'leaks', anim: 'abc.leakCheck',
        title: V('Hledání netěsností', 'Finding leaks'),
        body: V(
          'Při **vypnutém motoru** projděte baterkou: plunžry a vzpěry, šroubení a vedení u kol, ventilové bloky, čerpadlo, hadice ke chladiči kapaliny a nádržku. Zelené mokré stopy a prach nalepený na mastném povrchu prozradí únik.',
          'With the **engine off**, go over with a torch: plungers and struts, fittings and lines at the wheels, valve blocks, the pump, hoses to the fluid cooler and the reservoir. Green wet traces and dust stuck to an oily surface reveal the leak.'
        ),
        notes: [
          { level: 'danger', text: V('Nikdy neprohmatávejte vedení rukou a nepovolujte šroubení při běžícím motoru.', 'Never feel along the lines with your hand or loosen fittings with the engine running.') },
          { level: 'tip', text: V('Podložte pod vůz přes noc karton – kapky ukážou, který roh teče.', 'Put cardboard under the car overnight – the drops show which corner leaks.') }
        ]
      },
      {
        id: 'accu', anim: 'abc.accumulator',
        title: V('Tlakové zásobníky', 'Pressure accumulators'),
        body: V(
          'Zásobník má uvnitř membránu – na jedné straně dusík, na druhé kapalina. Časem dusík uniká a jízda je **tvrdá a bouchavá**, čerpadlo víc pracuje.\n\nDiagnostika stavu zásobníků se dělá v XENTRY / měřením dle WIS (ověřit).',
          'An accumulator has a diaphragm inside – nitrogen on one side, fluid on the other. Over time the nitrogen leaks and the ride becomes **harsh and knocking**, the pump works harder.\n\nAccumulator condition is checked in XENTRY / by measurement per WIS (verify).'
        ),
        notes: [{ level: 'danger', text: V('Zásobník měňte jen po odtlakování systému a starý nikdy nerozřezávejte ani nezahřívejte – obsahuje stlačený plyn.', 'Replace an accumulator only after depressurising, and never cut open or heat an old one – it contains compressed gas.') }]
      },
      {
        id: 'depressurise', anim: 'abc.depressurise',
        title: V('Odtlakování před prací na vedeních', 'Depressurising before line work'),
        body: V(
          'Před povolením jakéhokoli šroubení, zásobníku nebo vzpěry systém **odtlakujte postupem z WIS** (obvykle přes XENTRY a/nebo předepsaným postupem s motorem vypnutým – ověřit). Teprve při 0 bar povolujte – pomalu a s hadrem přes šroubení.',
          'Before loosening any fitting, accumulator or strut, **depressurise the system using the WIS procedure** (usually via XENTRY and/or a set procedure with the engine off – verify). Only at 0 bar loosen – slowly, with a rag over the fitting.'
        ),
        notes: [{ level: 'danger', text: V('Nevíte jistě, že je systém bez tlaku? Nepovolujte nic. Raději specializovaná dílna.', 'Not sure the system is pressure-free? Do not loosen anything. Use a specialist workshop instead.') }]
      },
      {
        id: 'flush', anim: 'abc.flush',
        title: V('Výměna kapaliny a filtru', 'Fluid and filter change'),
        body: V(
          'Výměna se dělá odsátím z nádržky, výměnou filtru (sítka) a postupným výplachem podle WIS – často ve více cyklech, než je kapalina čistá (ověřit postup a množství).\n\nPoužijte jen nový Pentosin CHF 11S z originálního balení.',
          'The change is done by extracting from the reservoir, replacing the filter (strainer) and a gradual flush per WIS – often in several cycles until the fluid is clean (verify procedure and amount).\n\nUse only new Pentosin CHF 11S from a sealed container.'
        ),
        notes: [
          { level: 'warning', text: V('Nemíchejte s jinou kapalinou a nepoužívejte „univerzální“ hydraulické oleje.', 'Do not mix with other fluids or use "universal" hydraulic oils.') },
          { level: 'info', text: V('Starou kapalinu odevzdejte jako nebezpečný odpad.', 'Dispose of the old fluid as hazardous waste.') }
        ]
      },
      {
        id: 'start', anim: 'abc.overview',
        title: V('Nastartování, odvzdušnění, kontrola', 'Start-up, bleeding, check'),
        body: V(
          'Po výměně kapaliny nebo práci na vedeních nastartujte dle WIS, sledujte hladinu (dolévejte, aby čerpadlo nenasálo vzduch) a nechte systém několikrát zvednout a spustit vůz (ověřit postup). Zkontrolujte těsnost všech šroubení.',
          'After a fluid change or line work, start per WIS, watch the level (top up so the pump never sucks air) and let the system raise and lower the car several times (verify procedure). Check all fittings for leaks.'
        ),
        notes: [{ level: 'warning', text: V('Čerpadlo nikdy nesmí běžet nasucho – při prvním startu hlídejte hladinu.', 'The pump must never run dry – watch the level on the first start.') }]
      },
      {
        id: 'calibrate', anim: 'abc.calibrate',
        title: V('Kalibrace výšky (XENTRY)', 'Level calibration (XENTRY)'),
        body: V(
          'Po výměně vzpěry, snímače výšky nebo když vůz stojí nakřivo, se výška kalibruje v XENTRY: změříte výšky na kolech dle WIS a zadáte je (ověřit postup).',
          'After replacing a strut or height sensor, or when the car sits unevenly, the level is calibrated in XENTRY: you measure the heights at the wheels per WIS and enter them (verify procedure).'
        ),
        notes: [{ level: 'info', text: V('Vůz na rovné ploše, správné tlaky pneumatik, prázdný kufr, plná nádrž dle WIS (ověřit).', 'Car on level ground, correct tyre pressures, empty boot, fuel level per WIS (verify).'), verify: true }]
      },
      {
        id: 'specialist', anim: 'abc.symptoms',
        title: V('Kdy do specializované dílny', 'When to go to a specialist'),
        body: V(
          '- Červené hlášení ABC nebo vůz na dorazech.\n- Netěsný ventilový blok, čerpadlo nebo vzpěra (oprava vyžaduje odtlakování a speciální postupy).\n- Opakovaná chyba po výměně kapaliny.\n- Nemáte XENTRY pro kalibraci a odtlakování.',
          '- Red ABC message or the car on its bump stops.\n- Leaking valve block, pump or strut (repair needs depressurising and special procedures).\n- Recurring fault after a fluid change.\n- You do not have XENTRY for calibration and depressurising.'
        ),
        notes: [{ level: 'tip', text: V('Vyplatí se dílna specializovaná na ABC / Mercedes – generické servisy systém často neznají.', 'A workshop specialising in ABC / Mercedes is worth it – general garages often do not know the system.') }]
      }
    ]
  });
})(window.STU);
