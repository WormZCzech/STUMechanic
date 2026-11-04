/* Tutorial: Thermostat & water pump (pump not driven by the timing belt). 3D scenes: js/3d/scenes/thermostat-pump.js */
(function (S) {
  'use strict';
  var V = function (cs, en) { return { cs: cs, en: en }; };

  S.registerTutorial({
    id: 'thermostat-pump',
    level: 2,
    thumb: 'thermostat-pump.cutaway',
    time: V('1,5–4 h', '1.5–4 h'),
    title: V('Termostat a vodní pumpa', 'Thermostat & water pump'),
    summary: V('Pomalé zahřívání, přehřívání nebo únik u pumpy? Výměna termostatu a vodní pumpy (mimo rozvody).', 'Slow warm-up, overheating or a leaking pump? Replacing the thermostat and the water pump (not timing-driven).'),
    intro: V(
      '**Termostat** řídí, kdy jde chladicí kapalina do chladiče. Zaseknutý otevřený = motor se pomalu zahřívá, slabě topí a víc žere. Zaseknutý zavřený = **rychlé přehřátí**.\n\n**Vodní pumpa** žene kapalinu motorem. Vadná pumpa kape z kontrolního otvoru, hučí, má vůli – nebo přestane čerpat a motor se uvaří.\n\nU některých motorů pohání pumpu **rozvodový řemen** – pak se mění při výměně rozvodů (viz návod „Výměna rozvodů“).',
      'The **thermostat** decides when coolant flows to the radiator. Stuck open = slow warm-up, weak heating, higher consumption. Stuck closed = **rapid overheating**.\n\nThe **water pump** pushes coolant through the engine. A failing pump drips from its weep hole, whines, has play – or stops pumping and the engine overheats.\n\nOn some engines the pump is driven by the **timing belt** – then it is replaced with the timing belt (see "Timing belt replacement").'
    ),
    safety: [
      { level: 'danger', text: V('**Nikdy neotevírejte chladicí systém zahřátého motoru.** Kapalina je pod tlakem a přes 100 °C – vystříkne a způsobí těžké popáleniny.', '**Never open the cooling system of a warm engine.** The coolant is pressurised and above 100 °C – it sprays out and causes severe burns.') },
      { level: 'warning', text: V('Chladicí kapalina je **jedovatá** a sladká – láká děti a zvířata. Zachyťte ji celou a odevzdejte do sběru.', 'Coolant is **poisonous** and sweet – it attracts children and animals. Catch all of it and take it to a collection point.') },
      { level: 'warning', text: V('Elektrický ventilátor chladiče se může rozběhnout i při vypnutém motoru – odpojte baterii.', 'The electric radiator fan can start even with the engine off – disconnect the battery.') },
      { level: 'caution', text: V('Používejte **jen předepsaný typ kapaliny**. Míchání typů vede ke kalu a korozi.', 'Use **only the specified coolant type**. Mixing types causes sludge and corrosion.') },
      { level: 'danger', text: V('Pokud teplota během jízdy letí nahoru: **okamžitě zastavte a vypněte motor**. Jízda s přehřátým motorem zničí těsnění hlavy.', 'If the temperature shoots up while driving: **stop and switch off immediately**. Driving an overheating engine destroys the head gasket.') }
    ],
    tools: [
      V('Sada klíčů a nástrčných hlavic, Torx', 'Spanners and sockets, Torx'),
      V('Momentový klíč', 'Torque wrench'),
      V('Kleště na hadicové spony (pružinové)', 'Hose clamp pliers (spring clamps)'),
      V('Záchytná vana (min. 10 l), trychtýř', 'Drain pan (at least 10 L), funnel'),
      V('Plastová škrabka, čisticí hadr, odmašťovač', 'Plastic scraper, clean rag, degreaser'),
      V('Vakuové plnicí zařízení (doporučeno)', 'Vacuum filler (recommended)')
    ],
    parts: [
      V('Termostat (s těsněním / O-kroužkem) dle VIN', 'Thermostat (with gasket / O-ring) by VIN'),
      V('Vodní pumpa s těsněním dle VIN (pokud se mění)', 'Water pump with gasket by VIN (if replaced)'),
      V('Chladicí kapalina předepsaného typu', 'Coolant of the specified type'),
      V('Případně nové hadicové spony a šrouby', 'New hose clamps and bolts if needed')
    ],
    finalChecks: [
      V('Hladina kapaliny po vychladnutí mezi MIN a MAX', 'Coolant level between MIN and MAX after cooling'),
      V('Žádné kapky u termostatu, pumpy ani hadic', 'No drips at the thermostat, pump or hoses'),
      V('Teplota se ustálí v polovině, ventilátor spíná', 'Temperature settles mid-scale, fan switches on'),
      V('Topení fouká teplý vzduch', 'Heater blows warm air'),
      V('Po 1–2 dnech hladinu zkontrolovat znovu (vzduch se dostává ven)', 'Re-check the level after 1–2 days (air keeps working out)')
    ],
    steps: [
      {
        id: 'symptoms', anim: 'thermostat-pump.symptoms',
        title: V('Poznejte závadu', 'Recognise the fault'),
        body: V('- **Pomalé zahřívání**, ručička se drží nízko, slabé topení → termostat otevřený.\n- **Rychlý růst teploty**, var, pára → termostat zavřený, vadná pumpa nebo únik.\n- **Kapky / krusta pod pumpou**, hučení nebo vůle řemenice → vadná pumpa.',
          '- **Slow warm-up**, needle stays low, weak heating → thermostat stuck open.\n- **Temperature rising fast**, boiling, steam → thermostat stuck closed, failed pump or a leak.\n- **Drips / crust under the pump**, whining or pulley play → failed pump.'),
        notes: [{ level: 'info', text: V('Diagnostika (návod „Diagnostika OBD“) ukáže teplotu kapaliny v reálném čase a chybové kódy termostatu.', 'A scan tool ("OBD diagnostics" tutorial) shows live coolant temperature and thermostat fault codes.') }]
      },
      {
        id: 'how', anim: 'thermostat-pump.cutaway',
        title: V('Jak termostat funguje', 'How the thermostat works'),
        body: V('Ve studeném motoru je termostat zavřený a kapalina obíhá jen motorem, aby se rychle zahřál. Při provozní teplotě se vosk v tělísku roztáhne a ventil otevře cestu do chladiče. Moderní motory mají často **elektronicky řízený** termostat.',
          'In a cold engine the thermostat is closed and coolant circulates only in the engine so it warms up quickly. At operating temperature the wax in the pellet expands and the valve opens the way to the radiator. Modern engines often have an **electronically controlled** thermostat.')
      },
      {
        id: 'locate', anim: 'thermostat-pump.locate',
        title: V('Najděte termostat a pumpu', 'Locate the thermostat and pump'),
        body: V('Termostat bývá v plastovém nebo hliníkovém pouzdru u výstupu z hlavy nebo na vstupu do motoru. Pumpa je vpředu na motoru – poháněná drážkovým řemenem, rozvodovým řemenem/řetězem nebo elektricky. **Ověřte pohon pumpy pro váš motor.**',
          'The thermostat sits in a plastic or aluminium housing at the head outlet or the engine inlet. The pump is at the engine front – driven by the aux belt, the timing belt/chain or electrically. **Verify the pump drive for your engine.**')
      },
      {
        id: 'drain', anim: 'thermostat-pump.drain',
        title: V('Vypusťte chladicí kapalinu', 'Drain the coolant'),
        body: V('Jen **studený motor**. Odpojte baterii, pomalu povolte víčko expanzní nádoby a vypusťte kapalinu do vany (výpustný šroub chladiče nebo spodní hadice). Podrobně viz návod „Výměna chladicí kapaliny“.',
          '**Cold engine** only. Disconnect the battery, slowly open the expansion tank cap and drain into a pan (radiator drain plug or lower hose). Details in the "Coolant change" tutorial.')
      },
      {
        id: 'thermo', anim: 'thermostat-pump.thermoOut',
        title: V('Vyměňte termostat', 'Replace the thermostat'),
        body: V('Sundejte hadici, povolte šrouby víka, víko sejměte a termostat vyndejte. **Zapamatujte si orientaci** (šipka, odvzdušňovací kolík nahoru). Dosedací plochu očistěte plastovou škrabkou, vložte nový termostat s novým těsněním a víko dotáhněte do kříže předepsaným momentem.',
          'Remove the hose, undo the cover bolts, lift the cover and take the thermostat out. **Note its orientation** (arrow, jiggle pin up). Clean the face with a plastic scraper, fit the new thermostat with a new seal and tighten the cover in a cross pattern to the specified torque.'),
        specs: [{ label: V('Šrouby víka termostatu', 'Thermostat cover bolts'), value: V('dle příručky (malý moment!)', 'per manual (low torque!)') }],
        notes: [{ level: 'caution', text: V('Plastová pouzdra praskají při přetažení – vždy momentovým klíčem.', 'Plastic housings crack when over-tightened – always use a torque wrench.') }]
      },
      {
        id: 'test', anim: 'thermostat-pump.thermoTest',
        title: V('Test starého termostatu (volitelné)', 'Testing the old thermostat (optional)'),
        body: V('Termostat ponořte do vody s teploměrem a pomalu ohřívejte. Ventil se má začít otevírat při teplotě vyražené na termostatu a úplně otevřít o pár stupňů výš. Neotevře se nebo je otevřený už za studena = vadný.',
          'Put the thermostat in water with a thermometer and heat slowly. The valve should start opening at the temperature stamped on it and fully open a few degrees higher. Does not open, or is open when cold = faulty.'),
        notes: [{ level: 'warning', text: V('Vařící voda a pára způsobují popáleniny. Test není nutný – nový termostat je levný.', 'Boiling water and steam cause burns. The test is not essential – a new thermostat is cheap.') }]
      },
      {
        id: 'pump', anim: 'thermostat-pump.pumpOut',
        title: V('Demontujte vodní pumpu', 'Remove the water pump'),
        body: V('Sundejte řemen pohánějící pumpu (návod „Drážkový řemen“), povolte šrouby řemenice a pak šrouby pumpy **do kříže**. Pumpu opatrně vyjměte – vyteče zbytek kapaliny. Prohlédněte oběžné kolo (koroze, ulomené lopatky).',
          'Remove the belt that drives the pump (see "Auxiliary belt"), loosen the pulley bolts, then the pump bolts **in a cross pattern**. Lift the pump out carefully – the rest of the coolant will run out. Inspect the impeller (corrosion, broken vanes).'),
        notes: [{ level: 'info', text: V('Je-li pumpa poháněná rozvody, tento krok nedělejte – pumpa se mění s rozvody.', 'If the pump is driven by the timing belt, skip this step – it is replaced with the timing belt.') }]
      },
      {
        id: 'fit', anim: 'thermostat-pump.fit',
        title: V('Namontujte novou pumpu', 'Fit the new pump'),
        body: V('Dosedací plochy očistěte a odmastěte. Novou pumpu nasaďte s **novým těsněním** (bez silikonu, pokud ho výrobce nepředepisuje), šrouby dotáhněte do kříže předepsaným momentem. Nasaďte řemenici a řemen.',
          'Clean and degrease the faces. Fit the new pump with a **new gasket** (no sealant unless the manufacturer specifies it), tighten the bolts in a cross pattern to the specified torque. Refit the pulley and belt.'),
        specs: [{ label: V('Šrouby pumpy', 'Pump bolts'), value: V('dle příručky', 'per manual') }]
      },
      {
        id: 'bleed', anim: 'thermostat-pump.bleed',
        title: V('Naplňte a odvzdušněte', 'Refill and bleed'),
        body: V('Plňte **předepsanou kapalinou** (ideálně vakuovým plničem). Otevřete odvzdušňovací šrouby, dokud neteče kapalina bez bublin, topení nastavte na maximum. Postup odvzdušnění se liší podle vozu – viz návod „Výměna chladicí kapaliny“.',
          'Fill with the **specified coolant** (ideally with a vacuum filler). Open the bleed screws until coolant runs bubble-free, set the heater to maximum. Bleeding differs per car – see the "Coolant change" tutorial.'),
        notes: [{ level: 'warning', text: V('Vzduch v systému = lokální přehřátí a prasklá hlava. Odvzdušnění nepodceňujte.', 'Air in the system = local overheating and a cracked head. Do not rush the bleeding.') }]
      },
      {
        id: 'run', anim: 'thermostat-pump.test',
        title: V('Zkušební chod a kontrola', 'Test run and check'),
        body: V('Nechte motor zahřát se **otevřeným víčkem jen pokud to postup výrobce dovoluje**, jinak zavřený systém. Sledujte teplotu – musí se ustálit v polovině, ventilátor sepne. Opatrně ohmatejte hadice chladiče: obě teplé = termostat otevírá. Po vychladnutí doplňte na MAX a zkontrolujte těsnost.',
          'Warm the engine up **with the cap off only if the manufacturer\'s procedure allows it**, otherwise closed. Watch the temperature – it must settle mid-scale and the fan switches on. Carefully feel the radiator hoses: both warm = thermostat opening. After cooling, top up to MAX and check for leaks.'),
        notes: [{ level: 'danger', text: V('Víčko zahřátého systému nikdy neotevírejte.', 'Never open the cap of a hot system.') }]
      }
    ],
    vehicles: {
      'mb-cl500-c216': {
        status: 'caution',
        specs: [
          { label: V('Chladicí kapalina', 'Coolant'), value: V('MB 325.0 (50 : 50)', 'MB 325.0 (50 : 50)'), verify: true },
          { label: V('Pohon pumpy', 'Pump drive'), value: V('drážkovým řemenem, vpředu na motoru', 'aux belt, at the engine front'), verify: true },
          { label: V('Termostat', 'Thermostat'), value: V('vpředu na motoru, případně elektronicky řízený', 'engine front, possibly electronically controlled'), verify: true }
        ],
        notes: [
          { level: 'warning', text: V('Velký objem kapaliny (cca 10–12 l) – připravte dostatečnou vanu.', 'Large coolant volume (approx. 10–12 L) – have a big enough pan ready.'), verify: true },
          { level: 'info', text: V('Pro výměnu pumpy se sundává drážkový řemen, který pohání i čerpadlo ABC – motor bez řemene nestartujte.', 'The pump job needs the aux belt off, which also drives the ABC pump – do not run the engine without it.') }
        ]
      },
      'volvo-xc60-b4': {
        status: 'pro',
        specs: [
          { label: V('Termostat', 'Thermostat'), value: V('elektronicky řízený', 'electronically controlled'), verify: true },
          { label: V('Čerpadla', 'Pumps'), value: V('hlavní pumpa + pomocná elektrická čerpadla – dle VIDA', 'main pump + auxiliary electric pumps – per VIDA'), verify: true },
          { label: V('Odvzdušnění', 'Bleeding'), value: V('postup VIDA (spuštění el. čerpadel)', 'VIDA procedure (runs electric pumps)'), verify: true }
        ],
        notes: [
          { level: 'warning', text: V('Více chladicích okruhů a 48V komponenty – postupujte podle VIDA. Před prací odpojte 12V i 48V systém dle VIDA.', 'Multiple cooling circuits and 48V components – follow VIDA. Disconnect both 12V and 48V per VIDA before working.') },
          { level: 'info', text: V('Bez diagnostiky nelze spolehlivě odvzdušnit – zvažte servis. Nic není zablokováno, jen upozorňujeme.', 'Reliable bleeding needs a scan tool – consider a workshop. Nothing is locked, this is only a warning.') }
        ]
      },
      'skoda-octavia-rs-tdi': {
        status: 'ok',
        specs: [
          { label: V('Chladicí kapalina', 'Coolant'), value: V('G13 (fialová), nemíchat', 'G13 (violet), do not mix'), verify: true },
          { label: V('Pohon pumpy', 'Pump drive'), value: V('rozvodovým řemenem', 'timing belt') },
          { label: V('Termostat', 'Thermostat'), value: V('pouzdro na motoru – umístění dle ELSA', 'housing on the engine – location per ELSA'), verify: true }
        ],
        notes: [{ level: 'danger', text: V('Vodní pumpa je poháněná **rozvodovým řemenem** – měňte ji jen v rámci výměny rozvodů (interferenční motor!).', 'The water pump is driven by the **timing belt** – replace it only as part of the timing belt job (interference engine!).') }],
        steps: { pump: { skip: true }, fit: { skip: true } },
        extraSteps: [{ after: 'test', step: { id: 'timingPump', anim: 'thermostat-pump.timing',
          title: V('Pumpa: jen s rozvody', 'Pump: only with the timing belt'),
          body: V('U 2.0 TDI CR je vodní pumpa za krytem rozvodů a pohání ji rozvodový řemen. Při jejím úniku nebo hluku postupujte podle návodu **„Výměna rozvodů“** – měňte celou sadu (řemen, napínák, kladky, pumpa).', 'On the 2.0 TDI CR the water pump sits behind the timing cover and is driven by the timing belt. If it leaks or is noisy, follow the **"Timing belt replacement"** tutorial – replace the whole kit (belt, tensioner, idlers, pump).'),
          notes: [{ level: 'danger', text: V('Neprovádějte demontáž pumpy bez aretace rozvodů – hrozí zničení motoru.', 'Never remove the pump without locking the timing – risk of destroying the engine.') }] } }]
      },
      'toyota-gr-yaris': {
        status: 'caution',
        specs: [
          { label: V('Chladicí kapalina', 'Coolant'), value: V('Toyota SLLC (růžová, předmíchaná)', 'Toyota SLLC (pink, pre-mixed)'), verify: true },
          { label: V('Pohon pumpy / termostat', 'Pump drive / thermostat'), value: V('dle TIS', 'per TIS'), verify: true }
        ],
        notes: [{ level: 'info', text: V('Pohon a umístění pumpy G16E si ověřte v TIS dřív, než začnete – nechceme hádat.', 'Verify the G16E pump drive and location in TIS before you start – we do not want to guess.') }]
      },
      'citroen-jumper-22hdi': {
        status: 'caution',
        specs: [
          { label: V('Chladicí kapalina', 'Coolant'), value: V('dle příručky – typ ověřit, nemíchat', 'per manual – verify type, do not mix'), verify: true },
          { label: V('Pohon pumpy', 'Pump drive'), value: V('ověřit (řemen příslušenství / rozvody)', 'verify (aux belt / timing drive)'), verify: true }
        ],
        notes: [
          { level: 'info', text: V('Pohon a umístění pumpy 2.2 HDi ověřte v dokumentaci PSA/Fiat (sdílené s Ducato/Boxer). Pokud ji pohání rozvody, pumpu měňte jen v servisu s rozvody.', 'Verify the 2.2 HDi pump drive and location in PSA/Fiat documentation (shared with Ducato/Boxer). If it is driven by the timing drive, have it replaced with the timing work.') },
          { level: 'tip', text: V('Přídavné (nezávislé) topení prodlužuje odvzdušnění – nechte ho při odvzdušnění zapnuté dle návodu.', 'An auxiliary heater makes bleeding longer – run it during bleeding per its instructions.'), verify: true }
        ]
      }
    }
  });
})(window.STU);
