/* Tutorial: EGR valve cleaning / replacement and DPF (GPF) care – legal maintenance only. */
(function (S) {
  'use strict';
  var V = function (cs, en) { return { cs: cs, en: en }; };
  var EGR_STEPS = ['egrOut', 'egrClean', 'egrIn'];
  function skip(ids) { var o = {}; ids.forEach(function (i) { o[i] = { skip: true }; }); return o; }

  function gpfOverride(car, extraNotes) {
    var steps = skip(EGR_STEPS.concat(['forced', 'sensor']));
    steps.why = { anim: 'egr-dpf.petrol', title: V('Benzín: filtr GPF a (ne)přítomnost EGR', 'Petrol: GPF filter and (no) EGR valve'),
      body: V('Benzínové motory s přímým vstřikem mají často **filtr pevných částic GPF** (OPF). Regeneruje se většinou **sám při běžné jízdě** (benzín má vyšší teplotu spalin). Externí EGR ventil mnoho moderních benzínových motorů nemá – recirkulaci řeší časování ventilů. Ověřte pro svůj motor.',
        'Petrol direct-injection engines often have a **gasoline particulate filter GPF** (OPF). It mostly **regenerates by itself during normal driving** (petrol exhaust runs hotter). Many modern petrol engines have no external EGR valve – recirculation is done by valve timing. Verify for your engine.') };
    return {
      status: 'ok',
      title: V('Péče o filtr GPF (benzín)', 'GPF filter care (petrol)'),
      summary: V('Benzínový filtr pevných částic: jak funguje, co mu škodí, kdy do dílny. Žádné odstranění filtru.', 'Petrol particulate filter: how it works, what harms it, when to see a workshop. No filter removal.'),
      intro: V(
        'Váš ' + car + ' je benzínový. Pokud má **filtr GPF**, údržba je jednodušší než u dieselu – vypalování probíhá převážně samo. Kroky pro EGR ventil a vynucenou regeneraci přeskakujeme; řešte je jen podle diagnostiky v dílně.',
        'Your ' + car + ' runs on petrol. If it has a **GPF**, care is simpler than on a diesel – burn-off mostly happens on its own. We skip the EGR valve and forced regeneration steps; only do them based on a workshop diagnosis.'
      ),
      notes: [{ level: 'info', text: V('Zda je osazen GPF a zda má motor externí EGR ventil, ověřte podle VIN / v dílenské příručce.', 'Verify by VIN / in the workshop manual whether a GPF is fitted and whether the engine has an external EGR valve.'), verify: true }].concat(extraNotes || []),
      specs: [{ label: V('Filtr částic', 'Particulate filter'), value: V('GPF – ověřit osazení', 'GPF – verify if fitted'), verify: true }],
      steps: steps
    };
  }

  S.registerTutorial({
    id: 'egr-dpf',
    level: 2,
    thumb: 'egr-dpf.overview',
    time: V('1–3 h', '1–3 h'),
    title: V('EGR ventil a péče o DPF', 'EGR valve and DPF care'),
    summary: V('Čištění / výměna EGR, regenerace a diagnostika filtru pevných částic. Jen legální údržba.', 'EGR cleaning / replacement, DPF regeneration and diagnosis. Legal maintenance only.'),
    intro: V(
      '**EGR ventil** vrací část spalin do sání (snižuje NOx) a časem se zanáší karbonem. **Filtr pevných částic (DPF/FAP)** zachytává saze a pravidelně je vypaluje (regenerace). Městský provoz, krátké jízdy a špatný olej oba systémy zanášejí.\n\n**Důležité:** odstranění DPF/EGR nebo jejich vypnutí v softwaru je v ČR i EU **nezákonné**, vůz neprojde STK a hrozí pokuta. Tento návod ukazuje jen **legální údržbu a opravy**.',
      'The **EGR valve** returns part of the exhaust into the intake (lowers NOx) and clogs with carbon over time. The **diesel particulate filter (DPF/FAP)** traps soot and regularly burns it off (regeneration). City driving, short trips and the wrong oil clog both systems.\n\n**Important:** removing a DPF/EGR or disabling them in software is **illegal** in CZ and the EU, the car fails its inspection and you risk a fine. This tutorial shows **legal maintenance and repairs only**.'
    ),
    safety: [
      { level: 'danger', text: V('Výfuk a filtr mají při regeneraci **přes 600 °C**. Nestavte vůz nad trávu, listí či papír; vynucenou regeneraci jen venku a s hasicím přístrojem po ruce.', 'The exhaust and filter exceed **600 °C** during regeneration. Never park over grass, leaves or paper; force a regeneration only outdoors with a fire extinguisher at hand.') },
      { level: 'danger', text: V('Motor při diagnostice a regeneraci nikdy nenechávejte běžet v uzavřené garáži – oxid uhelnatý zabíjí.', 'Never run the engine in a closed garage during diagnosis or regeneration – carbon monoxide kills.') },
      { level: 'warning', text: V('Na EGR a filtru pracujte jen na **studeném** motoru. Saze a karbon jsou zdraví škodlivé – rukavice, respirátor FFP2/FFP3.', 'Work on the EGR and filter only on a **cold** engine. Soot and carbon are harmful – gloves, FFP2/FFP3 mask.') },
      { level: 'warning', text: V('**Žádné odstranění ani „vypnutí“ DPF/EGR** – nelegální, nebezpečné pro zdraví a vůz nevyhoví STK.', '**No removal or "delete" of DPF/EGR** – illegal, harmful to health and the car fails its inspection.') },
      { level: 'caution', text: V('Čistič sání je hořlavý. Nestříkejte ho do elektrického aktuátoru ani na horké díly.', 'Intake cleaner is flammable. Do not spray it into the electric actuator or onto hot parts.') }
    ],
    tools: [
      V('Diagnostika s funkcemi pro DPF/EGR (VCDS, Diagbox, VIDA…)', 'Scan tool with DPF/EGR functions (VCDS, Diagbox, VIDA…)'),
      V('Ráčna, hlavice, prodloužení, Torx', 'Ratchet, sockets, extensions, Torx'),
      V('Momentový klíč', 'Torque wrench'),
      V('Čistič sání / EGR, plastová a mosazná škrabka', 'Intake / EGR cleaner, plastic and brass scraper'),
      V('Hasicí přístroj (pro vynucenou regeneraci)', 'Fire extinguisher (for forced regeneration)'),
      V('Rukavice, brýle, respirátor FFP2/FFP3', 'Gloves, glasses, FFP2/FFP3 mask')
    ],
    parts: [
      V('Těsnění EGR ventilu (vždy nové)', 'EGR valve gasket (always new)'),
      V('Případně nový EGR ventil podle VIN', 'If needed a new EGR valve by VIN'),
      V('Hadičky snímače diferenčního tlaku (při poškození)', 'Differential pressure sensor hoses (if damaged)'),
      V('Motorový olej low-SAPS dle normy výrobce', 'Low-SAPS engine oil per manufacturer approval')
    ],
    finalChecks: [
      V('Chybová paměť vymazaná, nové chyby se neobjevily', 'Fault memory cleared, no new faults'),
      V('Množství sazí a diferenční tlak v limitech', 'Soot load and differential pressure within limits'),
      V('Těsnění EGR bez úniku spalin (žádné syčení / saze)', 'EGR gasket not leaking (no hissing / soot)'),
      V('Kontrolka motoru / DPF nesvítí', 'Engine / DPF warning light off')
    ],
    steps: [
      {
        id: 'why', anim: 'egr-dpf.overview',
        title: V('Jak EGR a DPF fungují', 'How EGR and DPF work'),
        body: V('**EGR:** část spalin se vrací do sání a snižuje teplotu spalování (méně NOx). Spaliny nesou saze a olejové páry – na ventilu vzniká karbon.\n\n**DPF:** keramická voština zachytí saze. Když je jich dost, řídicí jednotka zvýší teplotu spalin a saze shoří (regenerace). Popel z oleje ale zůstává navždy.', '**EGR:** part of the exhaust goes back to the intake and lowers combustion temperature (less NOx). The exhaust carries soot and oil vapour – carbon builds up on the valve.\n\n**DPF:** a ceramic honeycomb traps soot. When there is enough, the ECU raises the exhaust temperature and the soot burns (regeneration). Ash from the oil, however, stays forever.'),
        notes: [{ level: 'info', text: V('Typické příznaky: kontrolka DPF, nouzový režim, ztráta výkonu, častý ventilátor po vypnutí, kouř, chyby P2002/P2463/P0401 (příklady).', 'Typical symptoms: DPF light, limp mode, power loss, fan running after switch-off, smoke, codes P2002/P2463/P0401 (examples).') }]
      },
      {
        id: 'legal', anim: 'egr-dpf.legal',
        title: V('Co je zakázané (a proč)', 'What is forbidden (and why)'),
        body: V('Fyzické odstranění filtru, „prázdná“ trubka, záslepka EGR nebo úprava softwaru, která systém vypne, jsou **nelegální**. Vůz pak nesplňuje homologaci, neprojde STK a škodí zdraví (jemné částice). Při závadě je legální cestou **oprava, profesionální čištění nebo nový díl**.', 'Physically removing the filter, a "straight pipe", blanking the EGR or software that disables the system are **illegal**. The car then no longer matches its type approval, fails the inspection and harms health (fine particles). When something fails, the legal route is **repair, professional cleaning or a new part**.'),
        notes: [{ level: 'danger', text: V('Neinstalujte „DPF/EGR off“ software ani emulátory – STK to odhalí měřením a hrozí pokuta.', 'Do not install "DPF/EGR off" software or emulators – the inspection detects it by measurement and you risk a fine.') }]
      },
      {
        id: 'codes', anim: 'egr-dpf.codes',
        title: V('Diagnostika: chyby a živá data', 'Diagnosis: faults and live data'),
        body: V('Připojte diagnostiku (viz návod Diagnostika) a přečtěte: chybové kódy, **množství sazí** (g), **diferenční tlak** na filtru, km od poslední regenerace, **požadovanou vs. skutečnou polohu EGR**. Hodnoty si zapište před zásahem.', 'Connect the scan tool (see the Diagnostics tutorial) and read: fault codes, **soot load** (g), **differential pressure** across the filter, km since the last regeneration, **requested vs actual EGR position**. Write the values down before you start.'),
        notes: [{ level: 'info', text: V('Limity jsou různé podle motoru – porovnejte s dílenskou příručkou.', 'Limits differ per engine – compare with the workshop manual.'), verify: true }]
      },
      {
        id: 'regen', anim: 'egr-dpf.regen',
        title: V('Jízdní režim a pasivní regenerace', 'Driving pattern and passive regeneration'),
        body: V('Nejlevnější „oprava“: **15–20 minut plynulé jízdy** mimo město (dálnice / silnice, vyšší otáčky, ne podtočený motor). Filtr se ohřeje a saze vyhoří. Pokud jezdíte hlavně krátké trasy, dopřejte vozu takovou jízdu pravidelně.', 'The cheapest "repair": **15–20 minutes of steady driving** out of town (motorway / open road, higher revs, not lugging the engine). The filter heats up and the soot burns off. If you mostly drive short trips, give the car such a drive regularly.'),
        notes: [{ level: 'tip', text: V('Probíhající regeneraci poznáte např. podle běžícího ventilátoru, vyššího volnoběhu nebo spotřeby – nevypínejte motor, pokud to jde.', 'You can spot an active regeneration by the fan running, higher idle or fuel use – avoid switching off if possible.') }]
      },
      {
        id: 'sensor', anim: 'egr-dpf.sensor',
        title: V('Zkontrolujte snímač diferenčního tlaku', 'Check the differential pressure sensor'),
        body: V('Snímač měří rozdíl tlaku před a za filtrem. **Prasklá, ucpaná nebo prohozená hadička** ukazuje nesmyslné hodnoty a vede k zbytečným regeneracím nebo nouzovému režimu. Zkontrolujte hadičky a konektor dřív, než budete měnit filtr.', 'The sensor measures the pressure difference before and after the filter. **A cracked, blocked or swapped hose** gives nonsense readings and causes needless regenerations or limp mode. Check the hoses and connector before replacing the filter.'),
        notes: [{ level: 'caution', text: V('Hadičky odolné vysoké teplotě – nahraďte jen originálním / správným typem.', 'Use high-temperature hoses only – replace with the original / correct type.') }]
      },
      {
        id: 'forced', anim: 'egr-dpf.forced',
        title: V('Vynucená (servisní) regenerace', 'Forced (service) regeneration'),
        body: V('Pokud pasivní regenerace nepomůže a množství sazí je ještě v povoleném rozsahu, lze diagnostikou spustit **servisní regeneraci** (motor běží 15–40 min na zvýšené otáčky). Dodržte podmínky z diagnostiky (teplota motoru, palivo v nádrži, vůz stojí venku).', 'If passive regeneration does not help and the soot load is still within the allowed range, a **service regeneration** can be started with a scan tool (the engine runs 15–40 min at raised revs). Follow the conditions shown by the tool (engine temperature, fuel in the tank, car parked outdoors).'),
        notes: [
          { level: 'danger', text: V('Přeplněný filtr (nad limit) se nesmí regenerovat – hrozí přehřátí a prasknutí keramiky / požár. To je práce pro dílnu.', 'An overloaded filter (above the limit) must not be regenerated – risk of overheating, cracking the ceramic / fire. That is a workshop job.') },
          { level: 'warning', text: V('Venku, mimo hořlavé materiály, hasicí přístroj na dosah, nikdo za výfukem.', 'Outdoors, away from flammables, extinguisher within reach, nobody behind the exhaust.') }
        ]
      },
      {
        id: 'ash', anim: 'egr-dpf.ash',
        title: V('Popel: kdy filtr čistit nebo měnit', 'Ash: when to clean or replace the filter'),
        body: V('Popel z aditiv oleje se v kanálcích hromadí trvale. Když diagnostika ukáže vysoké **množství popela** nebo diferenční tlak zůstává vysoký i po regeneraci, řešením je **profesionální čištění filtru** (demontáž, propláchnutí) nebo **nový filtr**. Po výměně filtru je nutné v diagnostice zadat adaptaci / vynulování hodnot.', 'Ash from oil additives builds up in the channels permanently. When the scan tool shows a high **ash load** or the differential pressure stays high even after regeneration, the fix is **professional filter cleaning** (removal, flushing) or a **new filter**. After a filter change an adaptation / reset must be entered in the scan tool.'),
        notes: [{ level: 'info', text: V('Nepoužívejte „čisticí“ chemii do nádrže jako náhradu opravy – maximálně podpoří regeneraci.', 'Do not rely on fuel-tank "cleaning" additives instead of a repair – at best they assist regeneration.') }]
      },
      {
        id: 'egrOut', anim: 'egr-dpf.egrOut',
        title: V('Demontáž EGR ventilu', 'Remove the EGR valve'),
        body: V('Studený motor. Odpojte konektor, případně hadice chlazení EGR (vypusťte část chladicí kapaliny). Povolte šrouby příruby a ventil vyjměte. Polohu a těsnění si vyfoťte.', 'Cold engine. Unplug the connector and, if fitted, the EGR cooler hoses (drain some coolant). Undo the flange bolts and remove the valve. Photograph its position and the gaskets.'),
        notes: [{ level: 'warning', text: V('U chlazeného EGR hlídejte chladicí kapalinu – jedovatá, horká; po montáži doplnit a odvzdušnit.', 'With a cooled EGR watch the coolant – toxic, hot; refill and bleed after reassembly.') }]
      },
      {
        id: 'egrClean', anim: 'egr-dpf.egrClean',
        title: V('Vyčistěte ventil a kanál', 'Clean the valve and port'),
        body: V('Karbon změkčete čističem sání / EGR a odstraňte plastovou nebo mosaznou škrabkou. Vyčistěte i kanál v sání, kam ventil ústí. Talířek ventilu musí volně a celý dosednout.', 'Soften the carbon with intake / EGR cleaner and remove it with a plastic or brass scraper. Also clean the port in the intake where the valve sits. The valve plate must move freely and seat fully.'),
        notes: [
          { level: 'caution', text: V('Nepoužívejte ocelový kartáč na brusce – poškodí dosedací plochu i aktuátor.', 'Do not use a steel wire wheel on a grinder – it damages the seat and the actuator.') },
          { level: 'info', text: V('Pokud je ventil mechanicky nebo elektricky vadný (zaseknutý aktuátor, chyba polohy), vyměňte ho za nový.', 'If the valve is mechanically or electrically faulty (stuck actuator, position fault), replace it with a new one.') }
        ]
      },
      {
        id: 'egrIn', anim: 'egr-dpf.egrIn',
        title: V('Montáž a adaptace', 'Refit and adapt'),
        body: V('Nové těsnění, šrouby dotáhnout momentem dle příručky, konektor zacvaknout. Diagnostikou proveďte **adaptaci / učení EGR** (pokud ji vůz vyžaduje) a vymažte chyby.', 'New gasket, bolts to the specified torque, click the connector in. Run the **EGR adaptation / learning** with the scan tool (if the car requires it) and clear the faults.'),
        specs: [{ label: V('Moment šroubů EGR', 'EGR bolt torque'), value: V('dle příručky', 'per manual'), verify: true }]
      },
      {
        id: 'oil', anim: 'egr-dpf.oil',
        title: V('Správný olej = delší život filtru', 'The right oil = longer filter life'),
        body: V('Motory s filtrem částic potřebují olej **low-SAPS** (málo popela) s přesnou normou výrobce. Olej bez normy zvyšuje množství popela, který nejde vypálit.', 'Engines with a particulate filter need **low-SAPS** oil (low ash) with the exact manufacturer approval. Oil without the approval increases ash that cannot be burned off.')
      },
      {
        id: 'test', anim: 'egr-dpf.test',
        title: V('Zkušební jízda a kontrola hodnot', 'Test drive and check the values'),
        body: V('Po zásahu jeďte 15–20 min plynule a znovu přečtěte živá data: saze, diferenční tlak, odchylku EGR. Pokud se chyby vrátí, hledejte příčinu (vstřikovače, turbo, únik oleje, snímače) – zanesení bývá **následek**, ne příčina.', 'After the work drive steadily for 15–20 min and read the live data again: soot, differential pressure, EGR deviation. If faults return, look for the root cause (injectors, turbo, oil consumption, sensors) – clogging is often a **consequence**, not the cause.')
      }
    ],
    vehicles: {
      'mb-cl500-c216': {
        status: 'ok',
        title: V('EGR a filtr částic: na benzínovém V8 jen okrajově', 'EGR and particulate filter: barely relevant on the petrol V8'),
        summary: V('M273 V8 nemá DPF/GPF. Co z návodu platí a co ne.', 'The M273 V8 has no DPF/GPF. What applies and what does not.'),
        intro: V('Váš CL 500 (M273, benzín, 2007) **nemá filtr pevných částic** a recirkulaci spalin řeší převážně časování ventilů. Většina kroků proto neplatí – ponecháváme vysvětlení, zákonný rámec a diagnostiku.', 'Your CL 500 (M273, petrol, 2007) **has no particulate filter**, and exhaust gas recirculation is mainly handled by valve timing. Most steps therefore do not apply – we keep the explanation, the legal framework and the diagnosis.'),
        notes: [{ level: 'info', text: V('Zda motor M273 má externí EGR ventil, ověřte ve WIS pro váš VIN.', 'Verify in WIS for your VIN whether the M273 has an external EGR valve.'), verify: true }],
        specs: [{ label: V('Filtr částic', 'Particulate filter'), value: V('není', 'none') }],
        steps: (function () { var o = skip(['regen', 'sensor', 'forced', 'ash', 'egrOut', 'egrClean', 'egrIn']); o.why = { anim: 'egr-dpf.petrol' }; return o; })()
      },
      'volvo-xc60-b4': gpfOverride('XC60 B4', [{ level: 'warning', text: V('48V mild hybrid: při práci u výfuku/startér-generátoru dbejte na kabeláž 48 V.', '48 V mild hybrid: mind the 48 V wiring when working near the exhaust / starter-generator.') }]),
      'toyota-gr-yaris': gpfOverride('GR Yaris', [{ level: 'info', text: V('Při okruhovém provozu je GPF velmi horký – po jízdě nechte vůz vychladnout, nestavte nad trávu.', 'With track use the GPF gets very hot – let the car cool down after driving, never park over grass.') }]),
      'skoda-octavia-rs-tdi': {
        status: 'caution',
        specs: [
          { label: V('Filtr částic', 'Particulate filter'), value: V('DPF (kombinovaný s katalyzátorem)', 'DPF (combined with the catalyst)'), verify: true },
          { label: V('EGR', 'EGR'), value: V('chlazený EGR ventil', 'cooled EGR valve'), verify: true },
          { label: V('Diagnostika', 'Scan tool'), value: 'VCDS / OBDeleven' },
          { label: V('Olej', 'Oil'), value: 'VW 507.00' }
        ],
        notes: [
          { level: 'info', text: V('VCDS: množství sazí a popela najdete v měřených hodnotách řídicí jednotky motoru; servisní regenerace jako základní nastavení / test – postup dle verze softwaru.', 'VCDS: soot and ash values are in the engine ECU measured values; service regeneration via basic settings / output test – procedure depends on software version.'), verify: true },
          { level: 'warning', text: V('Vadný vstřikovač nebo turbo zanáší DPF rychle – po výměně filtru najděte příčinu.', 'A faulty injector or turbo clogs the DPF quickly – find the cause after replacing the filter.') }
        ]
      },
      'citroen-jumper-22hdi': {
        status: 'caution',
        specs: [
          { label: V('Filtr částic', 'Particulate filter'), value: V('neznámo – zkontrolujte (FAP/DPF za katalyzátorem)', 'unknown – check (FAP/DPF after the catalyst)'), verify: true },
          { label: V('EGR', 'EGR'), value: V('EGR ventil – ověřit typ (chlazený?)', 'EGR valve – verify type (cooled?)'), verify: true },
          { label: V('Diagnostika', 'Scan tool'), value: 'Diagbox / Lexia (PP2000)' },
          { label: V('Olej', 'Oil'), value: V('s DPF: low-SAPS (PSA B71 2290)', 'with DPF: low-SAPS (PSA B71 2290)'), verify: true }
        ],
        notes: [
          { level: 'warning', text: V('**Nejdřív zjistěte, zda dodávka má DPF.** Pokud ne, kroky k regeneraci a popelu přeskočte; EGR kroky platí.', '**First find out whether the van has a DPF.** If not, skip the regeneration and ash steps; the EGR steps still apply.') },
          { level: 'info', text: V('Dodávka jezdící po městě s krátkými trasami potřebuje pravidelnou delší jízdu – jinak se DPF a EGR rychle zanášejí.', 'A van doing short city runs needs a regular longer drive – otherwise the DPF and EGR clog quickly.') }
        ],
        steps: { why: { notes: [{ level: 'info', text: V('Jak poznat DPF: za katalyzátorem je velké válcové pouzdro se dvěma tenkými hadičkami ke snímači tlaku.', 'How to spot a DPF: after the catalyst there is a large cylindrical canister with two thin hoses to a pressure sensor.') }] } }
      }
    }
  });
})(window.STU);
