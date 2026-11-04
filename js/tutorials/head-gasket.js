/* Tutorial: Head gasket – diagnosis and what a workshop does. */
(function (S) {
  'use strict';
  var V = function (cs, en) { return { cs: cs, en: en }; };

  S.registerTutorial({
    id: 'head-gasket',
    level: 3,
    status: 'pro',
    thumb: 'head-gasket.overview',
    time: V('diagnostika 1–3 h; oprava 1–3 dny (dílna)', 'diagnosis 1–3 h; repair 1–3 days (workshop)'),
    title: V('Těsnění pod hlavou: diagnostika a oprava', 'Head gasket: diagnosis and repair'),
    summary: V('Jak poznat vadné těsnění pod hlavou, jak ho ověřit testy a co obnáší oprava.', 'How to spot a failed head gasket, how to prove it with tests and what the repair involves.'),
    intro: V(
      'Těsnění pod hlavou válců odděluje **spalovací prostor, olej a chladicí kapalinu**. Když selže (nejčastěji po **přehřátí**), spaliny se dostávají do chlazení, kapalina do válců nebo do oleje.\n\nTento návod se soustředí na **spolehlivou diagnostiku** – ať zbytečně nerozebíráte motor kvůli prasklé hadici nebo termostatu. Samotná oprava (demontáž hlavy) je **expertní práce**: popisujeme ji, abyste rozuměli, co dílna dělá a na co se ptát.',
      'The cylinder head gasket separates **the combustion chamber, oil and coolant**. When it fails (most often after **overheating**), exhaust gas gets into the coolant, coolant into the cylinders or the oil.\n\nThis tutorial focuses on **reliable diagnosis** – so you do not strip an engine because of a split hose or a thermostat. The repair itself (head removal) is **expert work**: we describe it so you understand what the workshop does and what to ask.'
    ),
    safety: [
      { level: 'danger', text: V('**Víčko chladicí soustavy nikdy neotevírejte na horkém motoru** – kapalina pod tlakem vystříkne a opaří.', '**Never open the cooling system cap on a hot engine** – pressurised coolant sprays out and scalds.') },
      { level: 'danger', text: V('Při podezření na vadné těsnění **nejezděte** – přehřátí může zničit motor, kapalina ve válci může ohnout ojnici (hydraulický ráz).', 'If you suspect a failed gasket **do not drive** – overheating can destroy the engine, coolant in a cylinder can bend a con-rod (hydraulic lock).') },
      { level: 'warning', text: V('Chladicí kapalina je jedovatá (sladká chuť láká zvířata). Rozlitou ihned utřete.', 'Coolant is poisonous (its sweet taste attracts animals). Wipe up spills at once.') },
      { level: 'warning', text: V('Při testu komprese motor protáčí startérem – ruce, kabely a nářadí z dosahu řemenů a ventilátoru.', 'During a compression test the starter spins the engine – keep hands, cables and tools away from belts and the fan.') },
      { level: 'caution', text: V('Před testy odpojte zapalování / vstřik dle příručky, aby motor nenastartoval.', 'Before the tests disable ignition / injection per the manual so the engine cannot start.') }
    ],
    tools: [
      V('Tester CO₂ v chladicí kapalině („block tester“) + testovací kapalina', 'Combustion leak tester ("block tester") + test fluid'),
      V('Tlaková pumpa chladicí soustavy s adaptéry', 'Cooling system pressure tester with adapters'),
      V('Kompresiometr (pro diesel speciální, vysokotlaký)', 'Compression gauge (special high-pressure one for diesels)'),
      V('Tester úniku tlaku (leak-down) + kompresor', 'Leak-down tester + compressor'),
      V('Diagnostika (teplota, vynechávání, korekce)', 'Scan tool (temperature, misfires, trims)')
    ],
    parts: [
      V('Pro diagnostiku nic; pro opravu sada těsnění hlavy, nové šrouby hlavy, chladicí kapalina, olej', 'Nothing for diagnosis; for the repair a head gasket set, new head bolts, coolant, oil')
    ],
    finalChecks: [
      V('Příčina potvrzena alespoň dvěma testy', 'Cause confirmed by at least two tests'),
      V('Po opravě: chlazení odvzdušněné, hladina stabilní několik dní', 'After repair: cooling system bled, level stable for several days'),
      V('Teplota motoru normální i při zátěži', 'Engine temperature normal even under load'),
      V('Olej bez „majonézy“, výfuk bez bílé páry po zahřátí', 'Oil without "mayonnaise", no white steam from the exhaust when warm')
    ],
    steps: [
      { id: 'what', anim: 'head-gasket.overview',
        title: V('Co dělá těsnění pod hlavou', 'What the head gasket does'),
        body: V('Utěsňuje spoj mezi blokem a hlavou: spalovací tlak (desítky barů), olejové kanály a kanály chladicí kapaliny. Selhání je obvykle **následek** – přehřátí, nedotažené šrouby, únava materiálu nebo detonační spalování.', 'It seals the joint between block and head: combustion pressure (tens of bar), oil passages and coolant passages. Failure is usually a **consequence** – overheating, under-torqued bolts, fatigue or detonation.') },
      { id: 'symptoms', anim: 'head-gasket.symptoms',
        title: V('Příznaky', 'Symptoms'),
        body: V('- bílý, nasládlý kouř i na zahřátém motoru\n- úbytek chladicí kapaliny bez viditelného úniku\n- přehřívání, bubliny v nádržce, tvrdé hadice\n- béžová „majonéza“ v oleji (pozor: lehký povlak pod víčkem dělají i krátké jízdy v zimě)\n- vynechávání jednoho válce po studeném startu', '- white, sweet-smelling smoke even when warm\n- coolant loss without a visible leak\n- overheating, bubbles in the tank, rock-hard hoses\n- beige "mayonnaise" in the oil (careful: a light film under the cap also comes from short winter trips)\n- one cylinder misfiring after a cold start') },
      { id: 'rule', anim: 'head-gasket.ruleOut',
        title: V('Vylučte levnější příčiny', 'Rule out cheaper causes'),
        body: V('Než podezříváte těsnění: vnější úniky (hadice, chladič, vodní pumpa), termostat, ventilátor chladiče, víčko nádržky, chladič oleje, chladič EGR (diesel) a topení.', 'Before blaming the gasket: external leaks (hoses, radiator, water pump), thermostat, radiator fan, tank cap, oil cooler, EGR cooler (diesel) and the heater core.'),
        notes: [{ level: 'info', text: V('Návody Chladicí kapalina a Termostat/vodní pumpa vám pomohou tyto díly zkontrolovat.', 'The Coolant and Thermostat/water pump tutorials help you check these parts.') }] },
      { id: 'bubbles', anim: 'head-gasket.bubbles',
        title: V('Bubliny v nádržce', 'Bubbles in the expansion tank'),
        body: V('Na **studeném** motoru otevřete víčko, nastartujte a sledujte nádržku při volnoběhu a lehkém přidání plynu. Stálý proud bublin = podezření na spaliny v chlazení.', 'On a **cold** engine open the cap, start and watch the tank at idle and with light throttle. A constant stream of bubbles = suspect exhaust gas in the coolant.'),
        notes: [{ level: 'warning', text: V('Jakmile se motor zahřeje, víčko zavřete opatrně přes hadr – kapalina může vystřiknout.', 'Once the engine warms up close the cap carefully through a rag – coolant may spray.') }] },
      { id: 'block', anim: 'head-gasket.blockTest',
        title: V('Test CO₂ v chladicí kapalině', 'Combustion leak (CO₂) test'),
        body: V('Tester s modrou kapalinou nasaďte na hrdlo nádržky a balónkem nasávejte vzduch nad hladinou. Pokud kapalina zežloutne, v chlazení jsou spaliny. Funguje u benzínu i dieselu.', 'Fit the tester with blue fluid onto the tank neck and draw air from above the coolant with the bulb. If the fluid turns yellow, there is exhaust gas in the coolant. Works on petrol and diesel.'),
        notes: [{ level: 'caution', text: V('Hladinu kapaliny mírně snižte, aby se nenasála do testeru (falešný výsledek).', 'Lower the coolant level slightly so it is not drawn into the tester (false result).') }] },
      { id: 'pressure', anim: 'head-gasket.pressure',
        title: V('Tlaková zkouška chlazení', 'Cooling system pressure test'),
        body: V('Na studeném motoru natlakujte soustavu na tlak víčka a sledujte manometr 10–20 minut. Pokles bez vnějšího úniku znamená únik dovnitř (těsnění, chladič oleje/EGR, topení).', 'On a cold engine pressurise the system to the cap rating and watch the gauge for 10–20 minutes. A drop with no external leak means an internal leak (gasket, oil/EGR cooler, heater).'),
        specs: [{ label: V('Zkušební tlak', 'Test pressure'), value: V('dle víčka / příručky (typicky 1–1,5 bar)', 'per cap / manual (typically 1–1.5 bar)'), verify: true }] },
      { id: 'compression', anim: 'head-gasket.compression',
        title: V('Test komprese', 'Compression test'),
        body: V('Vyšroubujte všechny svíčky (diesel: žhavicí svíčky / vstřikovače dle příručky), vyřaďte vstřik/zapalování, kompresiometr do otvoru a protočte motor. Porovnejte válce: **rozdíl** je důležitější než absolutní číslo. Dva sousední nízké válce ukazují na těsnění mezi nimi.', 'Remove all plugs (diesel: glow plugs / injectors per manual), disable injection/ignition, fit the gauge and crank. Compare cylinders: **the difference** matters more than the absolute value. Two adjacent low cylinders point to the gasket between them.'),
        specs: [{ label: V('Minimální komprese / max. rozdíl', 'Minimum compression / max. difference'), value: V('dle příručky', 'per manual'), verify: true }],
        notes: [{ level: 'warning', text: V('U dieselu jsou tlaky vysoké (~25–35 bar) – jen kompresiometr pro diesel a správné adaptéry.', 'Diesel pressures are high (~25–35 bar) – only a diesel gauge and the correct adapters.') }] },
      { id: 'leakdown', anim: 'head-gasket.leakdown',
        title: V('Test úniku tlaku (leak-down)', 'Leak-down test'),
        body: V('Válec do horní úvrati (oba ventily zavřené), natlakujte vzduchem a čtěte % úniku. Poslouchejte, kudy vzduch uniká: sání = sací ventil, výfuk = výfukový ventil, plnicí hrdlo oleje = pístní kroužky, **bubliny v nádržce = těsnění / prasklá hlava**.', 'Bring the cylinder to TDC (both valves closed), pressurise with air and read the % loss. Listen where the air escapes: intake = intake valve, exhaust = exhaust valve, oil filler = piston rings, **bubbles in the tank = gasket / cracked head**.'),
        notes: [{ level: 'warning', text: V('Natlakovaný válec může motor pootočit – klíč na řemenici musí být zajištěný, ruce pryč.', 'A pressurised cylinder can turn the engine – secure the wrench on the pulley, hands clear.') }] },
      { id: 'workshop', anim: 'head-gasket.workshop',
        title: V('Co dělá dílna při opravě', 'What the workshop does'),
        body: V('Demontáž sání, výfuku, rozvodů a hlavy; kontrola **rovinnosti hlavy a bloku**, případně broušení a tlaková zkouška hlavy (praskliny); kontrola ventilů; nové těsnění, **nové šrouby hlavy**, nová sada rozvodů podle stavu; nová chladicí kapalina a olej.', 'Removal of intake, exhaust, timing drive and head; checking **head and block flatness**, skimming and pressure-testing the head (cracks) if needed; checking the valves; new gasket, **new head bolts**, a new timing kit as required; new coolant and oil.'),
        notes: [{ level: 'danger', text: V('DIY demontáž hlavy je expertní práce: chyba v časování rozvodů = zničený motor.', 'DIY head removal is expert work: a timing mistake = a destroyed engine.') }] },
      { id: 'torque', anim: 'head-gasket.torque',
        title: V('Šrouby hlavy: pořadí a moment', 'Head bolts: sequence and torque'),
        body: V('Šrouby hlavy se dotahují **v předepsaném pořadí** (obvykle spirálou od středu ven) v několika krocích **momentem a úhlem**. Většina moderních šroubů je **protahovacích – jen na jedno použití**.', 'Head bolts are tightened **in the specified sequence** (usually a spiral from the centre outwards) in several stages **by torque and angle**. Most modern bolts are **torque-to-yield – single use only**.'),
        specs: [{ label: V('Moment / úhly', 'Torque / angles'), value: V('výhradně dle dílenské příručky', 'strictly per the workshop manual'), verify: true }] },
      { id: 'after', anim: 'head-gasket.after',
        title: V('Po opravě', 'After the repair'),
        body: V('Doplnit a odvzdušnit chlazení, vyměnit olej (pokud se v něm objevila kapalina), zkontrolovat teplotu a hladinu několik dní po sobě. Odstraňte i původní příčinu přehřátí (termostat, ventilátor, únik).', 'Refill and bleed the cooling system, change the oil (if coolant got into it), check temperature and level for several days. Also fix the original cause of overheating (thermostat, fan, leak).') }
    ],
    vehicles: {
      'mb-cl500-c216': {
        status: 'pro',
        specs: [{ label: V('Motor', 'Engine'), value: V('V8 – dvě hlavy, dvě těsnění', 'V8 – two heads, two gaskets') }],
        notes: [
          { level: 'info', text: V('U V8 porovnávejte kompresi po bankách; demontáž hlav M273 je rozsáhlá (rozvodový řetěz) – dílna se znalostí WIS.', 'On a V8 compare compression per bank; removing the M273 heads is extensive (timing chain) – a workshop with WIS knowledge.'), verify: true },
          { level: 'warning', text: V('ABC podvozek: při práci pod vozem jen na stojanech.', 'ABC suspension: under the car only on stands.') }
        ]
      },
      'volvo-xc60-b4': {
        status: 'pro',
        notes: [
          { level: 'warning', text: V('Hliníkový motor je citlivý na přehřátí – při přehřívání okamžitě zastavte.', 'The aluminium engine is sensitive to overheating – stop immediately when it overheats.') },
          { level: 'warning', text: V('48V systém – před prací v motorovém prostoru odpojit 12 V i 48 V dle VIDA.', '48 V system – disconnect 12 V and 48 V per VIDA before working in the engine bay.') },
          { level: 'info', text: V('Více chladicích okruhů – tlakovou zkoušku a odvzdušnění provádějte dle VIDA.', 'Several cooling circuits – pressure test and bleed per VIDA.'), verify: true }
        ]
      },
      'toyota-gr-yaris': {
        status: 'pro',
        specs: [{ label: V('Motor', 'Engine'), value: V('3válec turbo, vysoké plnicí tlaky', '3-cyl turbo, high boost'), verify: true }],
        notes: [{ level: 'warning', text: V('Při okruhovém provozu a úpravách výkonu je těsnění více namáhané – hlídejte teplotu a detonace.', 'With track use and power upgrades the gasket is stressed more – watch temperature and knock.') }]
      },
      'skoda-octavia-rs-tdi': {
        status: 'pro',
        notes: [
          { level: 'info', text: V('Diesel: komprese se měří přes otvor žhavicí svíčky / vstřikovače dieselovým kompresiometrem (ověřit adaptér).', 'Diesel: compression is measured through the glow plug / injector hole with a diesel gauge (verify adapter).'), verify: true },
          { level: 'info', text: V('Prasklý chladič EGR má podobné příznaky (úbytek kapaliny, bílý kouř) – vylučte ho tlakovou zkouškou.', 'A cracked EGR cooler shows similar symptoms (coolant loss, white smoke) – rule it out with a pressure test.') }
        ]
      },
      'citroen-jumper-22hdi': {
        status: 'pro',
        notes: [
          { level: 'info', text: V('Diesel: dieselový kompresiometr přes otvor žhavicí svíčky; chladič EGR a chladič oleje vylučte jako první.', 'Diesel: diesel compression gauge via the glow plug hole; rule out the EGR cooler and oil cooler first.'), verify: true },
          { level: 'warning', text: V('Těžká dodávka s nákladem zatěžuje chlazení – kontrolujte hladinu a teplotu zvlášť v létě a do kopce.', 'A heavy loaded van stresses the cooling system – watch level and temperature especially in summer and uphill.') }
        ]
      }
    }
  });
})(window.STU);
