/* Tutorial: Turbocharger – diagnosis, causes, replacement (high level). */
(function (S) {
  'use strict';
  var V = function (cs, en) { return { cs: cs, en: en }; };
  var ALL = ['how', 'causes', 'play', 'oil', 'boost', 'root', 'remove', 'lines', 'prime', 'first', 'test'];

  S.registerTutorial({
    id: 'turbo',
    level: 3,
    status: 'pro',
    thumb: 'turbo.overview',
    time: V('diagnostika 1–2 h, výměna 4–10 h', 'diagnosis 1–2 h, replacement 4–10 h'),
    title: V('Turbodmychadlo: diagnostika a výměna', 'Turbocharger: diagnosis and replacement'),
    summary: V('Proč turba odcházejí, jak ověřit vůli, únik plnicího tlaku, a co nesmíte vynechat při výměně.', 'Why turbos fail, checking shaft play, boost leaks and what you must not skip when replacing one.'),
    intro: V(
      'Turbo se málokdy pokazí „samo od sebe“. Typické příčiny jsou **mazání** (starý olej, ucpaný přívod, nedostatek oleje), **ucpaný odvod / odvětrání** nebo **cizí těleso** v sání. Proto platí: **nejdřív najít příčinu**, jinak nové turbo odejde znovu.\n\nNávod ukazuje diagnostiku (vůle, olej v sání, únik plnicího tlaku, živá data) a **přehled výměny** s kroky, které rozhodují o životnosti nového turba (nové olejové vedení, předmazání). Samotná výměna je náročná – práce pro zkušené nebo dílnu.',
      'A turbo rarely fails "by itself". Typical causes are **lubrication** (old oil, a blocked feed, low oil), **a blocked drain / breather** or **a foreign object** in the intake. So: **find the cause first**, otherwise the new turbo fails again.\n\nThis tutorial covers diagnosis (play, oil in the intake, boost leaks, live data) and an **overview of the replacement** with the steps that decide the life of the new turbo (new oil line, priming). The swap itself is demanding – a job for experienced hands or a workshop.'
    ),
    safety: [
      { level: 'danger', text: V('Turbo a výfuk mají za chodu **stovky °C** (turbína až ~900 °C u benzínu). Pracujte jen na úplně vychladlém motoru.', 'The turbo and exhaust run at **hundreds of °C** (turbine up to ~900 °C on petrol). Only work on a fully cooled engine.') },
      { level: 'danger', text: V('Nikdy nesahejte do sání ani k lopatkám, když motor běží – kompresor vtáhne prsty, rukavici i hadr.', 'Never reach into the intake or near the blades with the engine running – the compressor sucks in fingers, gloves and rags.') },
      { level: 'warning', text: V('Do otevřeného sání, výfuku nebo olejových otvorů nesmí nic spadnout – zaslepte je ihned.', 'Nothing may fall into the open intake, exhaust or oil ports – cap them at once.') },
      { level: 'warning', text: V('Šrouby výfukového potrubí bývají zarezlé – pronikavý olej, trpělivost, nové matice / šrouby.', 'Exhaust manifold fasteners are often seized – penetrating oil, patience, new nuts / bolts.') },
      { level: 'caution', text: V('Vozidlo zvedejte jen podle návodu „Bezpečné zvednutí vozu“.', 'Lift the car only as described in "Safely lifting the car".') }
    ],
    tools: [
      V('Diagnostika (plnicí tlak požadovaný / skutečný, chyby)', 'Scan tool (requested / actual boost, faults)'),
      V('Kouřový generátor nebo tester těsnosti plnicího potrubí', 'Smoke machine or boost leak tester'),
      V('Ráčny, prodloužení, kloubové hlavice, momentový klíč', 'Ratchets, extensions, swivel sockets, torque wrench'),
      V('Pronikavý olej, krytky na zaslepení', 'Penetrating oil, blanking caps'),
      V('Čistý motorový olej na předmazání', 'Clean engine oil for priming')
    ],
    parts: [
      V('Turbo podle VIN (nové / profesionálně repasované)', 'Turbo by VIN (new / professionally reconditioned)'),
      V('Kompletní sada těsnění a podložek (banjo, příruby)', 'Complete gasket and washer kit (banjo, flanges)'),
      V('Nové přívodní olejové vedení (doporučeno)', 'New oil feed line (recommended)'),
      V('Olej a olejový filtr (výměna při výměně turba)', 'Oil and oil filter (change with the turbo)'),
      V('Vzduchový filtr, případně vyčištěný intercooler', 'Air filter, and a cleaned intercooler if needed')
    ],
    finalChecks: [
      V('Kontrolka tlaku oleje zhasla ihned po startu', 'Oil pressure light went out right after starting'),
      V('Žádný únik oleje, spalin ani plnicího tlaku', 'No oil, exhaust or boost leaks'),
      V('Požadovaný a skutečný plnicí tlak se shodují', 'Requested and actual boost match'),
      V('Olej po 500 km zkontrolován (hladina, spotřeba)', 'Oil checked after 500 km (level, consumption)')
    ],
    steps: [
      { id: 'how', anim: 'turbo.overview',
        title: V('Jak turbo funguje', 'How a turbo works'),
        body: V('Spaliny roztáčí **turbínu**, na stejné hřídeli je **kompresor**, který tlačí vzduch do motoru. Hřídel se točí až ~200 000 ot/min a ložiska jsou mazána **jen tlakovým olejem** z motoru.', 'Exhaust gas spins the **turbine**; on the same shaft the **compressor** pushes air into the engine. The shaft spins at up to ~200,000 rpm and the bearings are lubricated **only by pressurised engine oil**.'),
        notes: [{ level: 'tip', text: V('Po ostré jízdě nechte motor ~30–60 s doběhnout na volnoběh – turbo se ochladí olejem.', 'After hard driving let the engine idle ~30–60 s before switching off – oil cools the turbo.') }] },
      { id: 'causes', anim: 'turbo.causes',
        title: V('Proč turba odcházejí', 'Why turbos fail'),
        body: V('- **Mazání:** prodloužené intervaly výměny oleje, nízká hladina, ucpané sítko v banjo šroubu, karbon v přívodu\n- **Odvod oleje a odvětrání:** ucpaný odvod nebo vysoký tlak v klikové skříni tlačí olej kolem těsnění\n- **Cizí těleso:** úlomek, matka, kus filtru – poškozené lopatky\n- **Přehřátí / karbon:** vypínání horkého motoru, ucpaný DPF, zaseknuté lopatky VGT', '- **Lubrication:** extended oil change intervals, low level, blocked strainer in the banjo bolt, carbon in the feed\n- **Oil drain and breather:** a blocked drain or high crankcase pressure pushes oil past the seals\n- **Foreign object:** debris, a nut, part of a filter – damaged blades\n- **Overheating / carbon:** switching off a hot engine, a blocked DPF, sticking VGT vanes') },
      { id: 'play', anim: 'turbo.play',
        title: V('Kontrola vůle hřídele', 'Check shaft play'),
        body: V('Na studeném motoru sundejte sací hadici před turbem. Hřídel uchopte za matici kompresoru:\n- **axiálně** (tam a zpět) – prakticky žádná vůle\n- **radiálně** (nahoru-dolů) – malá vůle je normální (plovoucí ložiska), lopatky ale **nesmí drhnout o skříň**\nZkontrolujte i stopy dotyku a poškozené hrany lopatek.', 'On a cold engine remove the intake hose before the turbo. Hold the shaft by the compressor nut:\n- **axially** (in and out) – practically no play\n- **radially** (up and down) – a little play is normal (floating bearings), but the blades **must not touch the housing**\nAlso look for rub marks and damaged blade edges.'),
        notes: [{ level: 'danger', text: V('Motor NESMÍ běžet – a dejte pozor, aby nikdo nestartoval (klíč u vás).', 'The engine must NOT run – and make sure nobody starts it (keep the key with you).') }] },
      { id: 'oil', anim: 'turbo.oil',
        title: V('Olej v sání a kouř', 'Oil in the intake and smoke'),
        body: V('Lehký olejový film v sání je normální (odvětrání klikové skříně). **Louže oleje v intercooleru**, modrý kouř a rostoucí spotřeba oleje ukazují na netěsnost turba – nebo na ucpané odvětrání / odvod, které olej tlačí kolem těsnění.', 'A light oil film in the intake is normal (crankcase breather). **Puddles of oil in the intercooler**, blue smoke and rising oil consumption point to a leaking turbo – or to a blocked breather / drain pushing oil past the seals.') },
      { id: 'boost', anim: 'turbo.boostLeak',
        title: V('Únik plnicího tlaku', 'Boost leaks'),
        body: V('Nejčastější „vadné turbo“ je ve skutečnosti **prasklá hadice nebo povolená spona**. Natlakujte plnicí potrubí testerem (nebo kouřem) a hledejte únik. V diagnostice porovnejte **požadovaný a skutečný plnicí tlak**.', 'The most common "faulty turbo" is really **a split hose or loose clamp**. Pressurise the boost pipes with a tester (or smoke) and find the leak. In the scan tool compare **requested and actual boost**.'),
        notes: [{ level: 'warning', text: V('Tlak při testu nepřekračujte (typicky do ~1–1,5 bar dle návodu testeru) – hrozí poškození intercooleru a hadic.', 'Do not exceed the test pressure (typically up to ~1–1.5 bar per the tester instructions) – risk of damaging the intercooler and hoses.'), verify: true }] },
      { id: 'root', anim: 'turbo.rootCause',
        title: V('Najděte příčinu před výměnou', 'Find the cause before replacing'),
        body: V('Než objednáte turbo, zkontrolujte přívod a odvod oleje, odvětrání klikové skříně, vzduchový filtr a sání (cizí tělesa), DPF / katalyzátor (ucpaný výfuk = přehřátí), stav a typ oleje.', 'Before ordering a turbo, check the oil feed and drain, the crankcase breather, the air filter and intake (foreign objects), the DPF / catalyst (blocked exhaust = overheating), oil condition and type.') },
      { id: 'remove', anim: 'turbo.remove',
        title: V('Demontáž (přehled)', 'Removal (overview)'),
        body: V('Studený motor, odpojit baterii. Odpojit sání a plnicí potrubí, snímače a aktuátor VGT / wastegate, přívod a odvod oleje, výfukové spojení. Zarezlé šrouby nechat působit pronikavým olejem. Všechny otvory zaslepit.', 'Cold engine, battery disconnected. Disconnect intake and boost pipes, sensors and the VGT / wastegate actuator, oil feed and drain, the exhaust joint. Soak seized fasteners in penetrating oil. Cap every opening.'),
        notes: [{ level: 'warning', text: V('U mnoha vozů je nutné spustit výfuk nebo podepřít motor – řiďte se dílenskou příručkou.', 'Many cars need the exhaust dropped or the engine supported – follow the workshop manual.') }] },
      { id: 'lines', anim: 'turbo.oilLines',
        title: V('Nové olejové vedení a těsnění', 'New oil line and seals'),
        body: V('Starý přívod oleje bývá zanesený karbonem – **vyměňte ho**, nebo ho prokazatelně vyčistěte. Vždy nové měděné podložky a těsnění. Žádný silikon na olejové spoje.', 'The old oil feed is often coked with carbon – **replace it**, or provably clean it. Always new copper washers and gaskets. No silicone on oil joints.') },
      { id: 'prime', anim: 'turbo.prime',
        title: V('Předmazání nového turba', 'Prime the new turbo'),
        body: V('Před připojením přívodu nalijte do otvoru přívodu čistý motorový olej a rukou protočte hřídel. Ložiska tak nejsou při prvním startu suchá.', 'Before connecting the feed pour clean engine oil into the feed port and turn the shaft by hand. The bearings are then not dry on the first start.'),
        notes: [{ level: 'danger', text: V('Suchý start = zadřená ložiska nového turba během sekund.', 'A dry start = seized bearings in the new turbo within seconds.') }] },
      { id: 'first', anim: 'turbo.firstStart',
        title: V('První start', 'First start'),
        body: V('Vyměňte olej a filtr. Motor protáčejte startérem bez nastartování (postup dle výrobce – např. odpojená pojistka čerpadla / vstřiku), dokud nezhasne kontrolka tlaku oleje. Pak nastartujte a nechte 1–2 min běžet na volnoběh bez plynu.', 'Change the oil and filter. Crank the engine without starting (per manufacturer – e.g. pump / injection fuse removed) until the oil pressure light goes out. Then start and idle for 1–2 min without throttle.') },
      { id: 'test', anim: 'turbo.test',
        title: V('Kontrola a zkušební jízda', 'Check and test drive'),
        body: V('Zkontrolujte těsnost oleje, spalin a plnicího potrubí. Na zkušební jízdě porovnejte požadovaný a skutečný plnicí tlak. Prvních ~500 km jezděte šetrně a hlídejte hladinu oleje.', 'Check for oil, exhaust and boost leaks. On the test drive compare requested and actual boost. Drive gently for the first ~500 km and watch the oil level.') }
    ],
    vehicles: {
      'mb-cl500-c216': {
        status: 'ok',
        title: V('Turbo: váš CL 500 žádné nemá', 'Turbo: your CL 500 has none'),
        summary: V('M273 V8 je atmosférický motor. Co dělat při ztrátě výkonu.', 'The M273 V8 is naturally aspirated. What to do about a loss of power.'),
        intro: V('Motor M273 (5.5 V8) v CL 500 je **atmosférický – nemá turbo**. Kroky výměny turba proto přeskakujeme. Při ztrátě výkonu hledejte netěsnosti sání, vadný snímač hmotnosti vzduchu, škrticí klapku, zapalování nebo palivo (viz návod Diagnostika).', 'The M273 engine (5.5 V8) in the CL 500 is **naturally aspirated – it has no turbo**. So we skip the turbo replacement steps. For a loss of power look for intake leaks, a faulty mass air flow sensor, the throttle body, ignition or fuel (see the Diagnostics tutorial).'),
        replaceTools: true, replaceFinalChecks: true,
        tools: [V('Diagnostika (snímač hmotnosti vzduchu, korekce, vynechávání)', 'Scan tool (mass air flow, trims, misfires)')],
        parts: [V('Nic – informační návod', 'Nothing – information only')],
        finalChecks: [V('Příčina ztráty výkonu nalezena diagnostikou', 'Cause of power loss found by diagnosis')],
        steps: (function () { var o = {}; ALL.forEach(function (id) { o[id] = { skip: true }; }); return o; })(),
        extraSteps: [
          { after: 'how', step: { id: 'na', anim: 'turbo.na', title: V('Atmosférický V8 – bez turba', 'Naturally aspirated V8 – no turbo'),
            body: V('Vzduch proudí přes vzduchové filtry a snímač hmotnosti vzduchu přímo do sání. Ztráta výkonu = sání, netěsnosti podtlaku, snímače, zapalování nebo palivo.', 'Air flows through the air filters and the mass air flow sensor straight into the intake. Loss of power = intake, vacuum leaks, sensors, ignition or fuel.') } },
          { after: 'na', step: { id: 'naCheck', anim: 'turbo.naCheck', title: V('Hledání falešného vzduchu', 'Finding false air (vacuum leaks)'),
            body: V('V diagnostice porovnejte palivové korekce obou bank (V8). Vysoké kladné korekce na volnoběh, které klesají s otáčkami, ukazují na netěsnost sání. Najdete ji kouřovým testem nebo poslechem syčení u hadic odvětrání a sacího potrubí.', 'In the scan tool compare the fuel trims of both banks (V8). High positive trims at idle that drop with revs point to an intake leak. Find it with a smoke test or by listening for hissing at the breather hoses and intake manifold.'),
            notes: [{ level: 'warning', text: V('Kouřový test jen s vypnutým motorem a dle návodu přístroje.', 'Smoke test only with the engine off and per the tester instructions.') }] } }
        ]
      },
      'volvo-xc60-b4': {
        status: 'pro',
        specs: [
          { label: V('Přeplňování', 'Forced induction'), value: V('turbo (benzín) + 48V mild hybrid', 'turbo (petrol) + 48 V mild hybrid'), verify: true },
          { label: V('Chlazení turba', 'Turbo cooling'), value: V('olej + chladicí kapalina – ověřit', 'oil + coolant – verify'), verify: true }
        ],
        notes: [
          { level: 'warning', text: V('Turbo může být chlazené i kapalinou – při výměně vypustit, poté doplnit a odvzdušnit dle VIDA.', 'The turbo may also be coolant-cooled – drain, then refill and bleed per VIDA when replacing.'), verify: true },
          { level: 'warning', text: V('48V systém: před prací v motorovém prostoru odpojte 12 V i 48 V dle postupu VIDA.', '48 V system: disconnect both 12 V and 48 V per the VIDA procedure before working in the engine bay.') }
        ]
      },
      'toyota-gr-yaris': {
        status: 'pro',
        specs: [
          { label: V('Přeplňování', 'Forced induction'), value: V('vysokotlaké turbo (G16E-GTS)', 'high-boost turbo (G16E-GTS)'), verify: true },
          { label: V('Olej', 'Oil'), value: V('dle příručky – při okruhu častější výměna', 'per manual – change more often with track use'), verify: true }
        ],
        notes: [
          { level: 'warning', text: V('Okruhový provoz: po rozjížďce nechte motor doběhnout, olej měňte často, kontrolujte hadice plnicího tlaku (vysoký tlak + teplo).', 'Track use: let the engine idle down after the cool-down lap, change oil often, check the boost hoses (high pressure + heat).') },
          { level: 'info', text: V('Úpravy plnicího tlaku (chiptuning) zkracují život turba a nejsou legální bez homologace.', 'Raising boost (chip tuning) shortens turbo life and is not legal without approval.') }
        ]
      },
      'skoda-octavia-rs-tdi': {
        status: 'pro',
        specs: [
          { label: V('Turbo', 'Turbo'), value: V('s proměnnou geometrií (VGT/VNT)', 'variable geometry (VGT/VNT)'), verify: true },
          { label: V('Olej', 'Oil'), value: 'VW 507.00' }
        ],
        notes: [
          { level: 'info', text: V('Častá závada VGT: zaseknuté lopatky karbonem → nouzový režim při plném plynu (chyba přetlaku/podtlaku). Pomůže čištění nebo oprava, ne vždy nové turbo.', 'A common VGT fault: vanes stuck with carbon → limp mode at full throttle (over/under-boost fault). Cleaning or repair may help, not always a new turbo.') },
          { level: 'warning', text: V('Při výměně turba zkontrolujte i DPF – ucpaný filtr přehřívá turbo.', 'When replacing the turbo also check the DPF – a blocked filter overheats the turbo.') }
        ]
      },
      'citroen-jumper-22hdi': {
        status: 'pro',
        specs: [
          { label: V('Turbo', 'Turbo'), value: V('VGT – typ podle verze 100/120 k (ověřit)', 'VGT – type depends on 100/120 hp version (verify)'), verify: true }
        ],
        notes: [
          { level: 'warning', text: V('Užitkový vůz pod zatížením: turbo trpí při jízdě s nákladem a okamžitém vypnutí – nechte motor doběhnout.', 'Commercial van under load: the turbo suffers when driving loaded and switching off immediately – let the engine idle down.') },
          { level: 'info', text: V('Ověřte, zda je osazen DPF – ucpaný filtr nebo EGR zvyšují zatížení turba.', 'Check whether a DPF is fitted – a blocked filter or EGR increases the load on the turbo.') }
        ]
      }
    }
  });
})(window.STU);
