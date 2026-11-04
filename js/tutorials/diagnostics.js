/* Tutorial: Basic OBD-II diagnostics for beginners. */
(function (S) {
  'use strict';
  var V = function (cs, en) { return { cs: cs, en: en }; };

  S.registerTutorial({
    id: 'diagnostics',
    level: 1,
    thumb: 'diag.read',
    time: V('20–60 min', '20–60 min'),
    title: V('Základní diagnostika (OBD) – čtení závad', 'Basic diagnostics (OBD) – reading fault codes'),
    summary: V('Kontrolky, připojení testeru, čtení a pochopení kódů, živá data. Proč nemazat závady naslepo.', 'Warning lights, connecting a scanner, reading and understanding codes, live data. Why not to clear faults blindly.'),
    intro: V(
      'Každé moderní auto má **OBD zásuvku**, přes kterou řídicí jednotky prozradí, co je špatně. Diagnostika vám ušetří peníze i nervy – ale jen když ji správně čtete.\n\n**Hlavní pravidlo:** kód závady ukazuje, **kde** systém vidí problém – ne, **který díl** máte koupit. Nejdřív měřte a ověřujte, pak měňte.',
      'Every modern car has an **OBD port** through which the control units tell you what is wrong. Diagnostics saves money and nerves – but only if you read it correctly.\n\n**Main rule:** a fault code shows **where** the system sees a problem – not **which part** to buy. Measure and verify first, then replace.'
    ),
    safety: [
      { level: 'danger', text: V('Nikdy neovládejte tester ani telefon **za jízdy**. Při zkušební jízdě ať data sleduje spolujezdec, nebo je nahrávejte.', 'Never operate a scanner or phone **while driving**. On a test drive let a passenger watch the data, or record it.') },
      { level: 'warning', text: V('Kabel testeru veďte **mimo pedály** a volant. Zaseknutý kabel pod brzdovým pedálem je smrtelně nebezpečný.', 'Route the scanner cable **away from the pedals** and steering wheel. A cable stuck under the brake pedal is deadly dangerous.') },
      { level: 'warning', text: V('Při diagnostice s běžícím motorem: vůz zabrzděný, P / neutrál, v uzavřené garáži nikdy (CO). Pozor na ventilátor a řemeny.', 'Diagnosing with the engine running: parking brake on, P / neutral, never in a closed garage (CO). Mind the fan and belts.') },
      { level: 'caution', text: V('**Servisní funkce** (kódování, adaptace, aktivace akčních členů, regenerace DPF, EPB) mohou při chybě poškodit vůz. Spouštějte jen ty, kterým rozumíte, a podle návodu výrobce.', '**Service functions** (coding, adaptations, actuator tests, DPF regeneration, EPB) can damage the car if done wrong. Only run those you understand and follow the manufacturer\'s procedure.') },
      { level: 'caution', text: V('Nízké napětí baterie vytváří **falešné chybové kódy** a může přerušit programování. Delší práce = udržovací nabíječka.', 'Low battery voltage creates **false fault codes** and can interrupt programming. Longer sessions = battery maintainer.') }
    ],
    tools: [
      V('Diagnostický nástroj (OBD adaptér + aplikace, ruční tester nebo značková diagnostika)', 'Scan tool (OBD dongle + app, handheld scanner or brand-specific tool)'),
      V('Multimetr (pro ověření obvodů)', 'Multimeter (to verify circuits)'),
      V('Udržovací nabíječka baterie (delší diagnostika)', 'Battery maintainer (longer sessions)'),
      V('Telefon / zápisník na kódy a hodnoty', 'Phone / notebook for codes and values')
    ],
    parts: [
      V('Žádné – diagnostika jen zjišťuje stav', 'None – diagnostics only find the state')
    ],
    finalChecks: [
      V('Kódy a freeze frame zapsány / vyfoceny PŘED vymazáním', 'Codes and freeze frame written down / photographed BEFORE clearing'),
      V('Příčina opravena, ne jen vymazána', 'Cause repaired, not just cleared'),
      V('Po zkušební jízdě žádný nový kód, monitory připravenosti dokončené', 'No new code after a test drive, readiness monitors complete'),
      V('Tester odpojen, kabel nezůstal u pedálů', 'Scanner disconnected, no cable left near the pedals'),
      V('Zapalování vypnuté (vybitá baterie)', 'Ignition off (flat battery)')
    ],
    steps: [
      {
        id: 'lights', anim: 'diag.lights',
        title: V('Pochopte varovné kontrolky', 'Understand the warning lights'),
        body: V(
          '- **Červená** (tlak oleje, teplota, dobíjení, brzdy, airbag): zastavte, jakmile je to bezpečné, a motor vypněte.\n- **Žlutá/oranžová** (motor, ABS, tlak pneumatik): jízda je možná, ale brzy do servisu.\n- **Blikající kontrolka motoru** = vynechávání zapalování: zpomalte, nejezděte pod plným plynem, hrozí zničení katalyzátoru.',
          '- **Red** (oil pressure, temperature, charging, brakes, airbag): stop as soon as it is safe and switch the engine off.\n- **Yellow/amber** (engine, ABS, tyre pressure): you can drive, but get it checked soon.\n- **Flashing engine light** = misfire: slow down, no full throttle, risk of destroying the catalytic converter.'
        ),
        notes: [
          { level: 'danger', text: V('Červená kontrolka **tlaku oleje** nebo **teploty**: okamžitě zastavit a vypnout motor. Každá další minuta jízdy může motor zničit.', 'Red **oil pressure** or **temperature** light: stop and switch off immediately. Every further minute of driving can destroy the engine.') },
          { level: 'warning', text: V('Červená kontrolka **brzd** (při uvolněné ruční brzdě) = nízká hladina kapaliny nebo závada brzd. Nejezděte.', 'Red **brake** light (parking brake released) = low fluid or brake fault. Do not drive.') }
        ]
      },
      {
        id: 'secure', anim: 'diag.battery',
        title: V('Zajistěte vůz a baterii', 'Secure the car and battery'),
        body: V(
          'Vůz zabrzděte, automat do **P**, manuál do neutrálu. Zkontrolujte napětí baterie – při vypnutém motoru by mělo být **12,4 V a víc**.\n\nPokud budete diagnostikovat déle než pár minut se zapnutým zapalováním, připojte **udržovací nabíječku**.',
          'Apply the parking brake, automatic in **P**, manual in neutral. Check the battery voltage – with the engine off it should be **12.4 V or more**.\n\nIf you will diagnose for more than a few minutes with the ignition on, connect a **battery maintainer**.'
        ),
        notes: [
          { level: 'caution', text: V('Pod cca 12,0 V se objevují náhodné komunikační kódy (U-kódy) ve více jednotkách – to není závada jednotek, ale baterie.', 'Below approx. 12.0 V random network codes (U-codes) appear in several modules – that is not a module fault, it is the battery.') }
        ]
      },
      {
        id: 'tools', anim: 'diag.tools',
        title: V('Vyberte diagnostický nástroj', 'Choose a scan tool'),
        body: V(
          '- **Levný OBD adaptér (ELM327) + aplikace:** jen motor/emise, živá data. Dobrý začátek.\n- **Ruční tester s více systémy:** čte i ABS, airbag, převodovku, často umí základní servisní funkce.\n- **Značková diagnostika** (XENTRY, VIDA, VCDS/OBDeleven, Techstream): všechny moduly, adaptace, kódování, servisní funkce.',
          '- **Cheap OBD dongle (ELM327) + app:** engine/emissions and live data only. A good start.\n- **Multi-system handheld:** also reads ABS, airbag, transmission, often has basic service functions.\n- **Brand tool** (XENTRY, VIDA, VCDS/OBDeleven, Techstream): all modules, adaptations, coding, service functions.'
        ),
        notes: [
          { level: 'caution', text: V('Velmi levné klony adaptérů mohou být nespolehlivé a některé zůstávají aktivní a vybíjejí baterii. Po práci adaptér vytáhněte.', 'Very cheap clone dongles can be unreliable and some stay active and drain the battery. Unplug the dongle after use.') }
        ]
      },
      {
        id: 'port', anim: 'diag.port',
        title: V('Připojte tester do OBD zásuvky', 'Plug the scanner into the OBD port'),
        body: V(
          'OBD zásuvka (16 pinů, lichoběžníkový tvar) je obvykle **pod palubní deskou u řidiče**. Konektor nasaďte jen jedním směrem, bez násilí. Pak zapněte **zapalování (motor nestartujte)**.',
          'The OBD port (16 pins, trapezoid shape) is usually **under the dash on the driver side**. The connector fits only one way, no force. Then switch the **ignition on (do not start the engine)**.'
        ),
        notes: [
          { level: 'warning', text: V('Kabel ani adaptér nesmí zasahovat k pedálům.', 'Neither the cable nor the dongle may reach the pedals.') }
        ]
      },
      {
        id: 'read', anim: 'diag.read',
        title: V('Přečtěte chybové kódy', 'Read the fault codes'),
        body: V(
          'Spusťte čtení paměti závad – ideálně **všech modulů** (motor, převodovka, ABS, airbag, karoserie). Každý kód si **vyfoťte nebo zapište** i se stavem (aktivní / uložený / občasný).',
          'Run a fault memory read – ideally **all modules** (engine, transmission, ABS, airbag, body). **Photograph or write down** every code including its status (active / stored / intermittent).'
        ),
        notes: [
          { level: 'info', text: V('**Aktivní** závada je přítomná právě teď. **Uložená/občasná** se objevila v minulosti – může jít o volný konektor nebo slabou baterii.', 'An **active** fault is present right now. A **stored/intermittent** one happened in the past – it can be a loose connector or a weak battery.') }
        ]
      },
      {
        id: 'anatomy', anim: 'diag.codeAnatomy',
        title: V('Pochopte strukturu kódu', 'Understand the code structure'),
        body: V(
          'Kód má 5 znaků:\n- 1. písmeno: **P** pohon, **C** podvozek, **B** karoserie, **U** komunikace.\n- 2. znak: **0** obecný kód (stejný u všech značek), **1** výrobcový.\n- 3. znak: podsystém (např. 3 = zapalování).\n- Poslední dvě číslice: konkrétní závada (např. 01 = válec 1).',
          'A code has 5 characters:\n- 1st letter: **P** powertrain, **C** chassis, **B** body, **U** network.\n- 2nd character: **0** generic (same for all brands), **1** manufacturer-specific.\n- 3rd character: subsystem (e.g. 3 = ignition).\n- Last two digits: the specific fault (e.g. 01 = cylinder 1).'
        ),
        notes: [
          { level: 'tip', text: V('Výrobcové kódy (P1xxx, nebo dlouhé kódy značkových testerů) vyhledávejte vždy s názvem modelu a motoru.', 'Always search manufacturer codes (P1xxx or long brand-tool codes) together with the model and engine.') }
        ]
      },
      {
        id: 'freeze', anim: 'diag.freeze',
        title: V('Podívejte se na freeze frame', 'Look at the freeze frame'),
        body: V(
          'Freeze frame je **snímek hodnot v okamžiku vzniku závady**: otáčky, rychlost, teplota, zatížení, korekce paliva. Prozradí, **za jakých podmínek** závada vzniká (studený motor, plný plyn, volnoběh…) – tak ji můžete zopakovat a ověřit.',
          'The freeze frame is a **snapshot of values at the moment the fault set**: RPM, speed, temperature, load, fuel trims. It tells you **under which conditions** the fault occurs (cold engine, full throttle, idle…) – so you can reproduce and verify it.'
        )
      },
      {
        id: 'live', anim: 'diag.live',
        title: V('Sledujte živá data', 'Watch the live data'),
        body: V(
          'Užitečné hodnoty pro začátek:\n- **Teplota chladiva** – po zahřátí cca 85–105 °C.\n- **Korekce paliva** (krátkodobá + dlouhodobá) – ideálně kolem 0 %, trvale nad +10 % = sání falešného vzduchu / málo paliva.\n- **Lambda sonda** před katalyzátorem – u benzínu rychle kmitá.\n- **Napětí** – motor běží: cca 13,8–14,7 V (u inteligentního dobíjení může kolísat).',
          'Useful values to start with:\n- **Coolant temperature** – when warm approx. 85–105 °C.\n- **Fuel trims** (short + long term) – ideally around 0 %, permanently above +10 % = vacuum leak / fuel delivery issue.\n- **Upstream O2 sensor** – on petrol it switches quickly.\n- **Voltage** – engine running approx. 13.8–14.7 V (may vary with smart charging).'
        ),
        notes: [
          { level: 'info', text: V('Uvedené hodnoty jsou orientační – přesné rozsahy se liší podle motoru. Porovnávejte se stejným motorem nebo s dílenskou příručkou.', 'These values are indicative – exact ranges differ by engine. Compare with the same engine or the workshop manual.'), verify: true }
        ]
      },
      {
        id: 'interpret', anim: 'diag.circuit',
        title: V('Kód ukazuje na obvod, ne na díl', 'A code points to a circuit, not a part'),
        body: V(
          'Příklad: kód „snímač teploty – signál nízký“ může způsobit snímač, **konektor, přerušený kabel**, zkrat nebo řídicí jednotka. Proto:\n1. Vyhledejte popis kódu pro váš motor.\n2. Zkontrolujte konektory a kabely (koroze, ohnuté piny).\n3. Změřte multimetrem dle schématu.\n4. Teprve pak měňte díl.',
          'Example: the code "temperature sensor – signal low" can be caused by the sensor, **a connector, a broken wire**, a short or the control unit. So:\n1. Look up the code description for your engine.\n2. Check connectors and wiring (corrosion, bent pins).\n3. Measure with a multimeter per the wiring diagram.\n4. Only then replace a part.'
        ),
        notes: [
          { level: 'caution', text: V('Nepropichujte izolaci kabelů hroty multimetru – do kabelu pak vniká vlhkost a koroze. Měřte ze zadní strany konektoru vhodnými hroty.', 'Do not pierce wire insulation with multimeter probes – moisture and corrosion then get in. Back-probe the connector with suitable pins.') },
          { level: 'warning', text: V('Na kabeláži airbagů (obvykle **žluté** konektory) nikdy neměřte multimetrem – hrozí odpálení airbagu.', 'Never measure airbag wiring (usually **yellow** connectors) with a multimeter – risk of deploying the airbag.') }
        ]
      },
      {
        id: 'clear', anim: 'diag.clear',
        title: V('Mažte závady až po opravě', 'Clear faults only after the repair'),
        body: V(
          'Vymazání kódu **závadu neopraví** – jen zhasne kontrolku do příště a smaže freeze frame, který by pomohl mechanikovi. Postup: **najít příčinu → opravit → vymazat → ověřit**.',
          'Clearing a code **does not fix the fault** – it only turns off the light until next time and erases the freeze frame that would help a mechanic. Procedure: **find the cause → repair → clear → verify**.'
        ),
        notes: [
          { level: 'danger', text: V('Závady **airbagu, ABS/ESP a brzd** nikdy jen nemažte. Pokud se vrací, systém nemusí v nehodě fungovat. Nechte zkontrolovat.', 'Never just clear **airbag, ABS/ESP or brake** faults. If they come back, the system may not work in a crash. Have it checked.') },
          { level: 'info', text: V('Po vymazání závad jsou monitory připravenosti nedokončené – na STK/emisích to může vadit, dokud vůz neodjezdí jízdní cyklus.', 'After clearing, readiness monitors are incomplete – this can be a problem at the MOT/emissions test until the car completes a drive cycle.') }
        ]
      },
      {
        id: 'verify', anim: 'diag.monitors',
        title: V('Ověřte opravu zkušební jízdou', 'Verify the repair with a test drive'),
        body: V(
          'Po opravě a vymazání se projeďte v podmínkách, kdy závada vznikala (podle freeze frame). Pak znovu přečtěte paměť závad a zkontrolujte **monitory připravenosti**. Žádný nový kód + dokončené monitory = oprava úspěšná.',
          'After repairing and clearing, drive under the conditions in which the fault occurred (per the freeze frame). Then read the fault memory again and check the **readiness monitors**. No new code + completed monitors = successful repair.'
        ),
        notes: [
          { level: 'danger', text: V('Data za jízdy sleduje spolujezdec, ne řidič.', 'A passenger watches the data while driving, not the driver.') }
        ]
      }
    ],
    vehicles: {
      'mb-cl500-c216': {
        status: 'ok',
        specs: [
          { label: V('OBD zásuvka', 'OBD port'), value: V('pod palubní deskou vlevo, u nohou řidiče (za krytkou)', 'under the dash, left, driver footwell (behind a cover)'), verify: true },
          { label: V('Doporučená diagnostika', 'Recommended tool'), value: V('XENTRY / DAS, nebo multiznačkový tester s podporou MB (Autel, iCarsoft MB…)', 'XENTRY / DAS, or a multi-brand tool with MB support (Autel, iCarsoft MB…)') },
          { label: V('Baterie', 'Battery'), value: V('v kufru; nabíječku připojte na startovací body v motorovém prostoru', 'in the boot; connect the charger to the jump-start points in the engine bay'), verify: true }
        ],
        notes: [
          { level: 'info', text: V('Generický OBD adaptér přečte jen motor. Pro **ABC podvozek, 7G-Tronic, SAM moduly, komfort** potřebujete tester s podporou Mercedes.', 'A generic OBD dongle reads the engine only. For **ABC suspension, 7G-Tronic, SAM modules, comfort systems** you need a tool with Mercedes support.') },
          { level: 'warning', text: V('Typické kódy M273: korelace vaček a klikové hřídele (P0016–P0019) – mohou ukazovat na opotřebené rozvody. Viz návod Rozvody.', 'Typical M273 codes: cam/crank correlation (P0016–P0019) – may point to a worn timing drive. See the Timing tutorial.'), verify: true },
          { level: 'caution', text: V('C216 má mnoho řídicích jednotek na sběrnici CAN – při slabé baterii se objeví desítky U-kódů. Nejdřív dobít, vymazat, znovu přečíst.', 'The C216 has many control units on the CAN bus – a weak battery triggers dozens of U-codes. Charge first, clear, then read again.') }
        ],
        steps: {
          port: { body: V('U CL 500 hledejte zásuvku pod palubní deskou vlevo v prostoru nohou řidiče (může být za krytkou).', 'On the CL 500 look under the dash on the left in the driver footwell (may be behind a cover).'), notes: [{ level: 'info', text: V('Přesné umístění ověřte v uživatelské příručce.', 'Verify the exact location in the owner\'s manual.'), verify: true }] },
          live: { notes: [{ level: 'tip', text: V('U ABC sledujte v testeru tlak a polohu jednotlivých vzpěr – ukáže netěsnost nebo vadný snímač výšky.', 'For ABC watch the pressure and position of each strut in the tool – it reveals a leak or a faulty level sensor.') }] }
        }
      },
      'volvo-xc60-b4': {
        status: 'ok',
        specs: [
          { label: V('OBD zásuvka', 'OBD port'), value: V('pod palubní deskou u řidiče', 'under the dash, driver side'), verify: true },
          { label: V('Doporučená diagnostika', 'Recommended tool'), value: V('VIDA (předplatné) nebo tester s podporou Volvo', 'VIDA (subscription) or a tool with Volvo support') },
          { label: V('Software', 'Software'), value: V('aktualizace vzduchem (OTA) – některé závady opravuje update', 'over-the-air (OTA) updates – some faults are fixed by an update') }
        ],
        notes: [
          { level: 'info', text: V('Generický OBD čte jen emise. **48V mild hybrid, vzduchové odpružení, EPB, ADAS kamery a radar** vyžadují značkovou diagnostiku (čtení, kalibrace, servisní režimy).', 'Generic OBD reads emissions only. **48 V mild hybrid, air suspension, EPB, ADAS cameras and radar** require a brand tool (reading, calibration, service modes).') },
          { level: 'warning', text: V('Vzduchové odpružení: chyby regulace výšky neignorujte – vůz může klesnout. Kalibraci výšky po opravě provádí diagnostika.', 'Air suspension: do not ignore level control faults – the car can drop. Ride height calibration after a repair is done with the scan tool.') },
          { level: 'tip', text: V('Před placenou diagnostikou zkontrolujte v centrálním displeji, jestli nečeká aktualizace softwaru.', 'Before paying for diagnostics, check the centre display for a pending software update.') }
        ]
      },
      'skoda-octavia-rs-tdi': {
        status: 'ok',
        specs: [
          { label: V('OBD zásuvka', 'OBD port'), value: V('pod palubní deskou vlevo od volantu', 'under the dash, left of the steering column'), verify: true },
          { label: V('Doporučená diagnostika', 'Recommended tool'), value: V('VCDS (Ross-Tech) nebo OBDeleven', 'VCDS (Ross-Tech) or OBDeleven') }
        ],
        notes: [
          { level: 'info', text: V('Užitečná živá data 2.0 TDI CR: **zanesení DPF** (saze v gramech), stav a historie **regenerace**, poloha **EGR**, **korekce vstřikovačů** na volnoběhu (rozdíly mezi válci).', 'Useful 2.0 TDI CR live data: **DPF soot load** (grams), **regeneration** status and history, **EGR** position, idle **injector correction values** (differences between cylinders).') },
          { level: 'warning', text: V('**Vynucenou regeneraci DPF** spouštějte jen podle postupu (motor teplý, dost paliva, vůz venku, mimo hořlavé materiály). Výfuk má při regeneraci přes 600 °C.', 'Only start a **forced DPF regeneration** per the procedure (engine warm, enough fuel, car outdoors, away from flammable materials). The exhaust exceeds 600 °C during regeneration.'), verify: true },
          { level: 'caution', text: V('Velké rozdíly korekcí vstřikovačů mezi válci ukazují na vadný vstřikovač – před výměnou nechte změřit přepad / ověřit v servisu.', 'Large injector correction differences between cylinders point to a faulty injector – have the leak-off measured / checked before replacing.'), verify: true }
        ]
      },
      'toyota-gr-yaris': {
        status: 'ok',
        specs: [
          { label: V('OBD zásuvka', 'OBD port'), value: V('pod palubní deskou u řidiče', 'under the dash, driver side'), verify: true },
          { label: V('Doporučená diagnostika', 'Recommended tool'), value: V('Toyota Techstream / GTS, nebo tester s podporou Toyota', 'Toyota Techstream / GTS, or a tool with Toyota support') }
        ],
        notes: [
          { level: 'info', text: V('Generický OBD přečte motor a živá data (plnicí tlak, předstih, teploty). Pro **pohon GR-FOUR**, ABS/VSC a karoserii potřebujete Toyota diagnostiku.', 'Generic OBD reads the engine and live data (boost, ignition timing, temperatures). For the **GR-FOUR drivetrain**, ABS/VSC and body you need a Toyota tool.') },
          { level: 'tip', text: V('Při okruhovém provozu se vyplatí logovat teplotu oleje a nasávaného vzduchu – ukáže, jestli motor nepřehříváte.', 'With track use it pays to log oil and intake air temperature – it shows whether you are overheating the engine.') },
          { level: 'caution', text: V('Úpravy řídicí jednotky (tuning) mohou změnit chování diagnostiky a záruku. Před čtením/mazáním kódů na upraveném voze se poraďte s tunerem.', 'ECU modifications (tuning) can change diagnostic behaviour and warranty. Talk to your tuner before reading/clearing codes on a modified car.') }
        ]
      }
    }
  });
})(window.STU);
