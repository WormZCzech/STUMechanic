/* Tutorial: Mercedes 7G-Tronic (722.9) – symptoms, ATF, adaptation, conductor plate. CL 500 only. */
(function (S) {
  'use strict';
  var V = function (cs, en) { return { cs: cs, en: en }; };

  S.registerTutorial({
    id: 'gearbox-7g',
    level: 2,
    only: ['mb-cl500-c216'],
    thumb: 'gearbox-7g.overview',
    time: V('1–3 hod. (diagnostika, kontrola ATF)', '1–3 h (diagnosis, ATF check)'),
    title: V('Převodovka 7G-Tronic (722.9) – příznaky a péče', '7G-Tronic (722.9) gearbox – symptoms and care'),
    summary: V('Tvrdé řazení, nouzový režim, chyby snímačů otáček (vodicí deska), kontrola ATF při 80 °C, adaptace, škubání převodníku.', 'Harsh shifts, limp mode, speed-sensor faults (conductor plate), ATF check at 80 °C, adaptation, converter shudder.'),
    intro: V(
      '7G-Tronic je sedmistupňový automat s **elektrohydraulickou jednotkou** (ventilový blok + řídicí jednotka a snímače na tzv. **vodicí desce / conductor plate** uvnitř převodovky). Většina problémů se dá **poznat diagnostikou a podle chování** – a mnoho z nich vyřeší čerstvá ATF a adaptace.\n\nTento návod vás provede kontrolou, ne opravou vnitřku převodovky. Výměna vodicí desky vyžaduje **kódování řídicí jednotky (VGS)** – práce pro specialistu.',
      '7G-Tronic is a seven-speed automatic with an **electro-hydraulic unit** (valve body + control unit and sensors on the so-called **conductor plate** inside the gearbox). Most problems can be **identified by diagnosis and behaviour** – and many are solved by fresh ATF and an adaptation.\n\nThis tutorial covers checking, not internal repair. Replacing the conductor plate requires **coding the control unit (VGS)** – specialist work.'
    ),
    safety: [
      { level: 'danger', text: V('Kontrola ATF probíhá při **běžícím motoru** pod vozem: vůz na stojanech / zvedáku, parkovací brzda, poloha P, nikdo za volantem, ruce mimo kloubové hřídele a výfuk.', 'The ATF check is done **with the engine running** under the car: car on stands / a lift, parking brake, position P, nobody at the wheel, hands clear of the propshaft and exhaust.') },
      { level: 'danger', text: V('**ABC podvozek:** pod vůz jen na stojanech pod zvedacími body, nikdy na hydraulice podvozku.', '**ABC suspension:** only under the car on stands under the jacking points, never on the suspension hydraulics.') },
      { level: 'warning', text: V('Horká ATF (80 °C+) a výfuk způsobí popáleniny – rukavice, brýle.', 'Hot ATF (80 °C+) and the exhaust cause burns – gloves, glasses.') },
      { level: 'warning', text: V('Nouzový režim (jen 2. nebo 3. převod) = jeďte pomalu a jen nezbytně. Při skluzu převodovky nejezděte.', 'Limp mode (2nd or 3rd only) = drive slowly and only when necessary. If the gearbox slips, do not drive.') },
      { level: 'caution', text: V('Jen ATF se schválením MB (236.14 / 236.15 – ověřit). Jiná kapalina mění řazení a může převodovku poškodit.', 'Only ATF with MB approval (236.14 / 236.15 – verify). Other fluid changes shift quality and can damage the gearbox.'), verify: true }
    ],
    tools: [
      V('Diagnostika XENTRY / DAS nebo tester s podporou 722.9 (teplota ATF, adaptace)', 'XENTRY / DAS or a scan tool supporting 722.9 (ATF temperature, adaptation)'),
      V('Měrka ATF pro 722.9 (speciální nástroj – ověřit)', 'ATF dipstick tool for 722.9 (special tool – verify)'),
      V('Hever + 4 stojany (vůz vodorovně)', 'Jack + 4 axle stands (car level)'),
      V('Bílý papír / ubrousek na posouzení ATF', 'White paper / towel to judge the ATF'),
      V('Rukavice, brýle', 'Gloves, glasses')
    ],
    parts: [V('Při servisu: ATF dle MB (cca 7–9 l – ověřit), filtr, těsnění vany, šrouby / těsnění konektoru (viz Oleje převodovky)', 'For a service: ATF to MB spec (approx. 7–9 L – verify), filter, pan gasket, bolts / connector seal (see Drivetrain oils)')],
    finalChecks: [
      V('Chyby přečteny a zapsány (před smazáním)', 'Fault codes read and noted (before clearing)'),
      V('Hladina ATF ověřena při správné teplotě', 'ATF level verified at the correct temperature'),
      V('Žádné úniky u vany a konektoru převodovky', 'No leaks at the pan and gearbox connector'),
      V('Adaptace provedena + zkušební jízda všemi převody', 'Adaptation done + test drive through all gears')
    ],
    steps: [
      {
        id: 'overview', anim: 'gearbox-7g.overview',
        title: V('Jak 7G-Tronic funguje', 'How the 7G-Tronic works'),
        body: V(
          '- **Hydrodynamický měnič** s blokovací spojkou\n- **Planetová soukolí** a lamelové spojky/brzdy – řadí se tlakem ATF\n- **Ventilový blok** se solenoidy, pod ním **vodicí deska** s řídicí jednotkou a snímači otáček\n\nVodicí deska je ponořená v ATF – špatná nebo stará ATF a teplo stárnou její elektroniku.',
          '- **Torque converter** with a lock-up clutch\n- **Planetary gear sets** and multi-plate clutches/brakes – applied by ATF pressure\n- **Valve body** with solenoids, below it the **conductor plate** with the control unit and speed sensors\n\nThe conductor plate sits in ATF – bad or old ATF and heat age its electronics.'
        )
      },
      {
        id: 'symptoms', anim: 'gearbox-7g.symptoms',
        title: V('Typické příznaky', 'Typical symptoms'),
        body: V(
          '- **Tvrdé / škubavé řazení** (zvlášť 2→1, 3→2 při zastavování)\n- **Nouzový režim**: převodovka zůstane ve 2. nebo 3. převodu, kontrolka / hlášení\n- **Prodleva** při zařazení D nebo R\n- **Prokluzování**: otáčky stoupají bez zrychlení\n- **Škubání / vibrace** kolem 60–100 km/h při lehkém plynu (blokace měniče)',
          '- **Harsh / jerky shifts** (especially 2→1, 3→2 when stopping)\n- **Limp mode**: the gearbox stays in 2nd or 3rd, a warning / message\n- **Delay** when selecting D or R\n- **Slipping**: revs rise without acceleration\n- **Shudder / vibration** around 60–100 km/h on light throttle (converter lock-up)'
        ),
        notes: [{ level: 'warning', text: V('Prokluzování = nejezdit. Spálené lamely znečistí celou převodovku.', 'Slipping = do not drive. Burnt clutches contaminate the whole gearbox.') }]
      },
      {
        id: 'codes', anim: 'gearbox-7g.codes',
        title: V('Přečtěte chyby převodovky', 'Read the gearbox fault codes'),
        body: V(
          'Připojte XENTRY / kompatibilní tester a přečtěte paměť závad **řídicí jednotky převodovky (VGS / TCU)**. Chyby **snímačů otáček (Y3/8n1, n2, n3 – ověřit)** a napájení snímačů ukazují typicky na **vadnou vodicí desku**. Chyby si zapište a vyfoťte **před smazáním**.',
          'Connect XENTRY / a compatible tester and read the fault memory of the **transmission control unit (VGS / TCU)**. Faults of the **speed sensors (Y3/8n1, n2, n3 – verify)** and sensor supply typically point to a **failed conductor plate**. Note and photograph the codes **before clearing**.'
        ),
        notes: [{ level: 'info', text: V('Označení snímačů a kódy chyb ověřte v XENTRY pro váš VIN.', 'Verify sensor designations and fault codes in XENTRY for your VIN.'), verify: true }]
      },
      {
        id: 'atflevel', anim: 'gearbox-7g.atflevel',
        title: V('Hladina ATF při 80 °C', 'ATF level at 80 °C'),
        body: V(
          'Hladina 7G-Tronic se měří **speciální měrkou** zasunutou do plnicí trubky, při **běžícím motoru, poloze P a teplotě ATF cca 80 °C** (teplotu čtěte v XENTRY). Vůz musí stát **vodorovně**. Hodnota na měrce se porovná s tabulkou pro danou teplotu.',
          'The 7G-Tronic level is measured with a **special dipstick** inserted into the fill tube, with the **engine running, in P and the ATF at approx. 80 °C** (read the temperature in XENTRY). The car must be **level**. The reading is compared with the table for that temperature.'
        ),
        specs: [{ label: V('Teplota ATF pro měření', 'ATF temperature for the check'), value: V('cca 80 °C', 'approx. 80 °C'), verify: true }],
        notes: [
          { level: 'warning', text: V('Měření při jiné teplotě je nepřesné – přeplnění i nedostatek ATF převodovku poškodí.', 'Measuring at another temperature is inaccurate – both overfilling and underfilling damage the gearbox.') },
          { level: 'info', text: V('Plnicí trubka je zaslepená uzávěrem s pojistkou – po kontrole nasaďte novou pojistku (ověřit).', 'The fill tube is sealed with a cap and locking pin – fit a new pin after the check (verify).'), verify: true }
        ]
      },
      {
        id: 'atfcolor', anim: 'gearbox-7g.atfcolor',
        title: V('Posuďte stav ATF', 'Judge the ATF condition'),
        body: V(
          'Kapku ATF z měrky dejte na bílý papír:\n- **čirá, červená až světle hnědá** – v pořádku\n- **tmavě hnědá, zápach spáleniny** – opotřebení lamel, výměna ATF + diagnostika\n- **mléčná / pěnivá** – voda / chladicí kapalina v ATF – **nejezdit**, okamžitě do servisu',
          'Put a drop of ATF from the dipstick on white paper:\n- **clear, red to light brown** – OK\n- **dark brown, burnt smell** – clutch wear, change ATF + diagnose\n- **milky / foamy** – water / coolant in the ATF – **do not drive**, go to a workshop immediately'
        ),
        notes: [{ level: 'danger', text: V('Mléčná ATF = chladicí kapalina v převodovce (prasklý chladič). Nejezdit.', 'Milky ATF = coolant in the gearbox (cracked cooler). Do not drive.') }]
      },
      {
        id: 'service', anim: 'gearbox-7g.pan',
        title: V('Výměna ATF a filtru', 'ATF & filter change'),
        body: V(
          'Výměna ATF s filtrem (vana, filtr, těsnění, doplnění a kontrola při 80 °C) je popsána v návodu **Oleje převodovky a diferenciálů**. Výměnou se vymění jen část ATF (zbytek je v měniči) – při silně opotřebené kapalině ji opakujte nebo použijte výplach ve specializované dílně.',
          'The ATF change with filter (pan, filter, gasket, refill and check at 80 °C) is described in the **Gearbox & differential oils** tutorial. A pan change replaces only part of the ATF (the rest is in the converter) – with badly worn fluid repeat it or use a flush at a specialist.'
        ),
        notes: [{ level: 'info', text: V('Výrobce dříve uváděl „náplň na celou životnost“ – v praxi se doporučuje výměna cca po 60–100 tis. km (ověřit).', 'The maker used to state "lifetime fill" – in practice a change approx. every 60–100k km is recommended (verify).'), verify: true }]
      },
      {
        id: 'adapt', anim: 'gearbox-7g.adapt',
        title: V('Reset adaptací a učicí jízda', 'Adaptation reset and learning drive'),
        body: V(
          'Po výměně ATF nebo při tvrdém řazení vynulujte v XENTRY **adaptační hodnoty převodovky** a proveďte **učicí jízdu**: zahřátá ATF, opakované rozjezdy s lehkým plynem přes všechny převody, zastavení, couvání. Převodovka se znovu naučí tlaky řazení.',
          'After an ATF change or with harsh shifts, reset the **transmission adaptation values** in XENTRY and do a **learning drive**: warm ATF, repeated gentle pull-aways through all gears, stopping, reversing. The gearbox relearns the shift pressures.'
        ),
        notes: [{ level: 'caution', text: V('Reset adaptací bez učicí jízdy může řazení dočasně zhoršit.', 'An adaptation reset without a learning drive can temporarily make shifting worse.') }]
      },
      {
        id: 'shudder', anim: 'gearbox-7g.shudder',
        title: V('Škubání při blokaci měniče', 'Converter lock-up shudder'),
        body: V(
          'Jemné **chvění / škubání kolem 60–100 km/h** při lehkém plynu, jako jízda po „vroubkovaném“ povrchu, bývá **blokovací spojka měniče**. Často pomůže čerstvá ATF (správné třecí vlastnosti) a adaptace. Pokud ne, měnič patří ke specialistovi.',
          'A gentle **vibration / shudder around 60–100 km/h** on light throttle, like driving over rumble strips, is usually the **converter lock-up clutch**. Fresh ATF (correct friction properties) and an adaptation often help. If not, the converter is a job for a specialist.'
        )
      },
      {
        id: 'conductor', anim: 'gearbox-7g.conductor',
        title: V('Vodicí deska (conductor plate)', 'Conductor plate'),
        body: V(
          'Při chybách snímačů otáček se mění **vodicí deska** s elektronikou. Postup: vypuštění ATF, sundání vany, vyjmutí ventilového bloku, výměna desky, montáž, naplnění ATF, kontrola při 80 °C – a hlavně **nakódování nové desky / VGS na váš vůz** (online SCN kódování nebo předprogramovaný díl – ověřit).',
          'With speed-sensor faults the **conductor plate** with its electronics is replaced. Procedure: drain the ATF, remove the pan, remove the valve body, swap the plate, refit, refill the ATF, check at 80 °C – and above all **code the new plate / VGS to your car** (online SCN coding or a pre-programmed part – verify).'
        ),
        notes: [
          { level: 'warning', text: V('Nenakódovaná deska = převodovka nefunguje nebo zůstane v nouzovém režimu. Bez XENTRY a přístupu ke kódování nezačínejte.', 'An uncoded plate = the gearbox will not work or stays in limp mode. Do not start without XENTRY and coding access.') },
          { level: 'caution', text: V('Elektronika desky je citlivá na statickou elektřinu – uzemněte se.', 'The plate electronics are sensitive to static – ground yourself.') }
        ]
      },
      {
        id: 'next', anim: 'gearbox-7g.next',
        title: V('Kdy do specializované dílny', 'When to go to a specialist'),
        body: V(
          '- prokluzování nebo spálená ATF\n- kovové částice / mléčná ATF\n- chyby přetrvávají po ATF a adaptaci\n- výměna vodicí desky s kódováním\n\nSpecialista na automatické převodovky umí i repasi (lamely, měnič) – často levnější než nová převodovka.',
          '- slipping or burnt ATF\n- metal particles / milky ATF\n- faults persist after ATF and adaptation\n- conductor plate replacement with coding\n\nAn automatic gearbox specialist can also rebuild (clutches, converter) – often cheaper than a new gearbox.'
        )
      }
    ],
    vehicles: {
      'mb-cl500-c216': {
        status: 'caution',
        specs: [
          { label: V('Převodovka', 'Gearbox'), value: '7G-Tronic 722.9' },
          { label: V('ATF', 'ATF'), value: V('MB 236.14 / 236.15 (ověřit dle VIN)', 'MB 236.14 / 236.15 (verify by VIN)'), verify: true },
          { label: V('Objem (výměna vany)', 'Capacity (pan change)'), value: V('cca 5–7 l, celkem cca 9 l', 'approx. 5–7 L, total approx. 9 L'), verify: true },
          { label: V('Kontrola hladiny', 'Level check'), value: V('80 °C, speciální měrka, XENTRY', '80 °C, special dipstick, XENTRY'), verify: true }
        ],
        notes: [
          { level: 'danger', text: V('**ABC:** pod vůz jen na stojanech pod zvedacími body.', '**ABC:** only under the car on stands under the jacking points.') },
          { level: 'info', text: V('V kombinaci s V8 (530 Nm) a vyšším nájezdem se doporučuje kratší interval výměny ATF.', 'Combined with the V8 (530 Nm) and high mileage a shorter ATF change interval is recommended.') }
        ]
      }
    }
  });
})(window.STU);
