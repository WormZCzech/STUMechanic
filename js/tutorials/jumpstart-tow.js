/* Tutorial: Jump-starting and towing safely. */
(function (S) {
  'use strict';
  var V = function (cs, en) { return { cs: cs, en: en }; };

  S.registerTutorial({
    id: 'jumpstart-tow',
    level: 1,
    thumb: 'jumpstart-tow.connect',
    time: V('15–30 min', '15–30 min'),
    title: V('Startování z jiného vozu a vlečení', 'Jump-starting and towing safely'),
    summary: V('Správné pořadí kabelů, startovací zdroj, ok na vlečení a kdy jen odtah na plošině.', 'The right cable order, jump packs, towing eye and when only a flatbed will do.'),
    intro: V(
      'Vybitá baterie se dá „nakopnout“ z jiného auta – ale **špatné pořadí kabelů může zničit elektroniku obou vozů nebo způsobit výbuch baterie**. A ne každé auto se smí vléct s koly na zemi.',
      'A flat battery can be jump-started from another car – but **the wrong cable order can destroy the electronics of both cars or make a battery explode**. And not every car may be towed with its wheels on the ground.'
    ),
    safety: [
      { level: 'danger', text: V('Nikdy nestartujte **zamrzlou, nafouknutou, prasklou nebo vytékající** baterii – hrozí výbuch.', 'Never jump a **frozen, swollen, cracked or leaking** battery – it can explode.') },
      { level: 'danger', text: V('Poslední svorku (−) připojte na **kostru / startovací bod**, ne na pól vybité baterie – jiskra u baterie může zapálit vodík.', 'Connect the last (−) clamp to **ground / the jump point**, not the dead battery\'s post – a spark near the battery can ignite hydrogen.') },
      { level: 'warning', text: V('Svorky se nesmí dotknout navzájem ani karoserie, dokud jsou připojené k baterii.', 'The clamps must not touch each other or the body while connected to a battery.') },
      { level: 'warning', text: V('Kabely veďte mimo řemeny a ventilátor – motor dárce běží.', 'Route the cables away from belts and fans – the donor engine is running.') },
      { level: 'caution', text: V('Používejte kvalitní kabely s dostatečným průřezem (min. 16–25 mm², pro diesel/velké motory víc).', 'Use quality cables with enough cross-section (at least 16–25 mm², more for diesels / big engines).') },
      { level: 'info', text: V('Pravidla vlečení (rychlost, vzdálenost, označení) upravují místní předpisy – ověřte aktuální znění.', 'Towing rules (speed, distance, marking) are set by local regulations – check the current wording.') }
    ],
    tools: [V('Startovací kabely (16–35 mm²)', 'Jump leads (16–35 mm²)'), V('nebo startovací zdroj (booster)', 'or a jump starter pack'), V('Tažné lano / tyč, výstražný praporek', 'Tow rope / bar, warning flag'), V('Ok na vlečení (sada nářadí ve voze)', 'Towing eye (car tool kit)'), V('Rukavice, brýle', 'Gloves, glasses')],
    parts: [V('Nic', 'Nothing')],
    finalChecks: [
      V('Kabely odpojené v opačném pořadí', 'Leads removed in reverse order'),
      V('Kontrolka baterie nesvítí, napětí 13,8–14,7 V', 'Battery light off, voltage 13.8–14.7 V'),
      V('Baterie dobitá jízdou (30+ min) nebo nabíječkou a otestovaná', 'Battery recharged by driving (30+ min) or a charger, then tested'),
      V('Ok na vlečení vrácené do sady nářadí, krytka zpět', 'Towing eye back in the tool kit, cover refitted')
    ],
    steps: [
      { id: 'check', anim: 'jumpstart-tow.check', title: V('Je to opravdu baterie?', 'Is it really the battery?'),
        body: V('Cvakání, pohasínající kontrolky a pomalé protáčení = typicky vybitá baterie. Pokud se motor točí normálně, ale nechytá, problém je jinde (palivo, žhavení, imobilizér) a startování z jiného vozu nepomůže.', 'Clicking, dimming lights and slow cranking = typically a flat battery. If the engine cranks normally but does not fire, the problem is elsewhere (fuel, glow plugs, immobiliser) and jump-starting will not help.'),
        notes: [{ level: 'danger', text: V('Baterie zamrzlá, nafouknutá nebo cítíte kyselinu? NESTARTOVAT.', 'Battery frozen, swollen or smelling of acid? DO NOT jump it.') }] },
      { id: 'position', anim: 'jumpstart-tow.position', title: V('Postavte vozy', 'Position the cars'),
        body: V('Dárcovský vůz blízko, aby kabely dosáhly, ale **vozy se nesmí dotýkat**. Oba motory vypnout, parkovací brzdy, spotřebiče (světla, rádio, ventilátor) vypnout.', 'Donor car close enough for the cables, but **the cars must not touch**. Both engines off, parking brakes on, consumers (lights, radio, blower) off.'),
        notes: [{ level: 'info', text: V('Dárce by měl mít stejné napětí (12 V) a podobnou nebo větší baterii.', 'The donor should have the same voltage (12 V) and a similar or bigger battery.') }] },
      { id: 'connect', anim: 'jumpstart-tow.connect', title: V('Připojte kabely ve správném pořadí', 'Connect the cables in the right order'),
        body: V('1. **Červený** na **+** vybité baterie (nebo + startovací bod)\n2. **Červený** na **+** dárce\n3. **Černý** na **−** dárce\n4. **Černý** na **kostru vybitého vozu** – nelakovaný kov motoru nebo startovací bod, dál od baterie', '1. **Red** to the **+** of the dead battery (or + jump point)\n2. **Red** to the donor **+**\n3. **Black** to the donor **−**\n4. **Black** to **ground on the dead car** – unpainted engine metal or the jump point, away from the battery'),
        notes: [{ level: 'danger', text: V('Nikdy neprohoďte + a −. Přepólování zničí řídicí jednotky, pojistky i alternátory.', 'Never swap + and −. Reverse polarity destroys control units, fuses and alternators.') }] },
      { id: 'start', anim: 'jumpstart-tow.start', title: V('Nastartujte', 'Start the engines'),
        body: V('Nastartujte dárce a nechte ho 2–5 minut běžet. Pak startujte vybitý vůz – **max. 10–15 s**, mezi pokusy 1 minuta pauza. Po nastartování nechte oba vozy 2–3 minuty běžet.', 'Start the donor and let it run for 2–5 minutes. Then crank the dead car – **max. 10–15 s**, 1 minute pause between attempts. Once running, let both cars run for 2–3 minutes.'),
        notes: [{ level: 'warning', text: V('Nestartuje po 3 pokusech? Přestaňte – přetížíte startér a kabely. Problém je jinde.', 'Not starting after 3 attempts? Stop – you will overheat the starter and cables. The problem is elsewhere.') }] },
      { id: 'disconnect', anim: 'jumpstart-tow.disconnect', title: V('Odpojte v opačném pořadí', 'Disconnect in reverse order'),
        body: V('Motory běží. Odpojte: 4. kostra vybitého vozu → 3. − dárce → 2. + dárce → 1. + vybitého vozu. Svorky držte od sebe.', 'Engines running. Remove: 4. dead car ground → 3. donor − → 2. donor + → 1. dead car +. Keep the clamps apart.'),
        notes: [{ level: 'tip', text: V('Před odpojením zapněte ve startovaném voze ventilátor / vyhřívání skla – tlumí napěťovou špičku.', 'Before disconnecting switch on the blower / rear heater in the jumped car – it damps the voltage spike.') }] },
      { id: 'booster', anim: 'jumpstart-tow.booster', title: V('Alternativa: startovací zdroj', 'Alternative: jump starter pack'),
        body: V('Nabitý startovací zdroj (booster) je bezpečnější než kabely – nepotřebujete druhé auto a nehrozí poškození jeho elektroniky. Připojte svorky (+ pak −/kostra), pak zdroj zapněte a startujte.', 'A charged jump starter pack is safer than cables – no second car needed and no risk to its electronics. Connect the clamps (+ then −/ground), then switch the pack on and crank.') },
      { id: 'towEye', anim: 'jumpstart-tow.towEye', title: V('Ok na vlečení', 'Towing eye'),
        body: V('Ok bývá v sadě nářadí (pod podlahou kufru). Vylomte krytku v nárazníku a ok **zašroubujte až na doraz**. Směr závitu je u některých vozů levotočivý – podívejte se do příručky.', 'The eye is in the tool kit (under the boot floor). Pop off the cover in the bumper and screw the eye **fully home**. Some cars use a left-hand thread – check the manual.'),
        notes: [{ level: 'warning', text: V('Nikdy neuvazujte lano za nápravu, rameno nebo nárazník – utrhnete je nebo poškodíte řízení.', 'Never tie the rope to an axle, arm or bumper – you will tear it off or damage the steering.') }] },
      { id: 'towRules', anim: 'jumpstart-tow.towRules', title: V('Bezpečné vlečení', 'Safe towing'),
        body: V('Ve vlečeném voze: **zapalování zapnuté** (odemčené řízení), výstražná světla, řidič s platným oprávněním. Bez běžícího motoru **nefunguje posilovač řízení ani brzd** – počítejte s velkou silou na volant a pedál. Jeďte pomalu, plynule, lano držte napnuté.', 'In the towed car: **ignition on** (steering unlocked), hazard lights on, a licensed driver. With the engine off **power steering and brake servo do not work** – expect heavy steering and pedal. Drive slowly and smoothly, keep the rope taut.'),
        notes: [{ level: 'info', text: V('Maximální rychlost, délka lana a označení dle místních předpisů – ověřte.', 'Max speed, rope length and marking per local regulations – verify.'), verify: true }] },
      { id: 'automatic', anim: 'jumpstart-tow.flatbed', title: V('Automat a 4×4: odtah na plošině', 'Automatic and AWD: flatbed'),
        body: V('Vozy s automatickou převodovkou a s pohonem všech kol se většinou **nesmí** vléct s koly na zemi (nebo jen krátce a pomalu). Převodovka nemá mazání a spojka 4×4 se může zničit. Řiďte se příručkou – v pochybnostech volejte odtahovou službu s plošinou.', 'Cars with automatic transmissions and AWD usually **must not** be towed with wheels on the ground (or only briefly and slowly). The gearbox is not lubricated and the AWD coupling can be destroyed. Follow the manual – when in doubt call a flatbed tow truck.') },
      { id: 'after', anim: 'jumpstart-tow.after', title: V('Po nastartování', 'After starting'),
        body: V('Zkontrolujte napětí (13,8–14,7 V). Jeďte aspoň 30 minut nebo baterii dobijte nabíječkou a pak ji otestujte. Pokud se vybije znovu, je vadná baterie, alternátor nebo něco vybíjí (klidový odběr).', 'Check the voltage (13.8–14.7 V). Drive at least 30 minutes or charge the battery with a charger, then test it. If it goes flat again, the battery or alternator is faulty or something drains it (parasitic drain).') }
    ],
    vehicles: {
      'mb-cl500-c216': {
        status: 'caution',
        specs: [
          { label: V('Startovací body', 'Jump points'), value: V('v motorovém prostoru (baterie je v kufru)', 'in the engine bay (battery is in the boot)'), verify: true },
          { label: V('Vlečení', 'Towing'), value: V('7G-Tronic: jen krátce a pomalu dle příručky, lépe plošina', '7G-Tronic: only briefly and slowly per manual, better a flatbed'), verify: true }
        ],
        notes: [{ level: 'warning', text: V('ABC podvozek: po dlouhém stání bez motoru může vůz poklesnout – při nakládání na plošinu dbejte na světlou výšku.', 'ABC suspension: after standing long without the engine the car may sink – mind ground clearance when loading onto a flatbed.') }],
        steps: { connect: { body: V('Použijte **startovací body v motorovém prostoru** (+ a kostra) – baterie je v kufru.', 'Use the **jump points in the engine bay** (+ and ground) – the battery is in the boot.') } }
      },
      'volvo-xc60-b4': {
        status: 'caution',
        specs: [
          { label: V('Startovací body', 'Jump points'), value: V('dle uživatelské příručky (ověřit)', 'per owner\'s manual (verify)'), verify: true },
          { label: V('Vlečení', 'Towing'), value: V('AWD + automat → plošina (dle příručky)', 'AWD + automatic → flatbed (per manual)'), verify: true }
        ],
        notes: [
          { level: 'danger', text: V('Kabely připojujte **jen na 12V body**. 48V systém se pro startování nikdy nepoužívá.', 'Connect cables **only to the 12 V points**. The 48 V system is never used for jump-starting.') },
          { level: 'warning', text: V('Vzduchový podvozek: před naložením na plošinu ověřte režim pro odtah / výšku dle příručky.', 'Air suspension: before loading on a flatbed check the towing / height mode per manual.'), verify: true },
          { level: 'info', text: V('Zda smí XC60 startovat jiný vůz (být dárcem), ověřte v příručce.', 'Check in the manual whether the XC60 may jump-start another car (act as donor).'), verify: true }
        ]
      },
      'skoda-octavia-rs-tdi': {
        status: 'ok',
        specs: [
          { label: V('Ok na vlečení', 'Towing eye'), value: V('levotočivý závit (ověřit)', 'left-hand thread (verify)'), verify: true },
          { label: V('Vlečení', 'Towing'), value: V('manuál, přední náhon – neutrál, zapalování zapnuté', 'manual, FWD – neutral, ignition on') }
        ],
        notes: [{ level: 'caution', text: V('Diesel s katalyzátorem a DPF neroztlačujte – nespálené palivo poškodí katalyzátor.', 'Do not push-start a diesel with catalyst and DPF – unburnt fuel damages the catalyst.') }]
      },
      'toyota-gr-yaris': {
        status: 'caution',
        specs: [
          { label: V('Baterie', 'Battery'), value: V('v kufru; startovací body dle příručky', 'in the boot; jump points per manual'), verify: true },
          { label: V('Vlečení', 'Towing'), value: V('GR-FOUR (4×4) → plošina dle příručky', 'GR-FOUR (AWD) → flatbed per manual'), verify: true }
        ],
        notes: [{ level: 'warning', text: V('Nízký vůz se spoilerem: při nakládání na plošinu použijte nájezdové klíny, aby se nepoškodil nárazník.', 'Low car with a splitter: use ramps when loading onto a flatbed so the bumper is not damaged.') }]
      },
      'citroen-jumper-22hdi': {
        status: 'ok',
        specs: [
          { label: V('Baterie', 'Battery'), value: V('velká dieselová baterie, umístění ověřit', 'large diesel battery, location to verify'), verify: true },
          { label: V('Vlečení', 'Towing'), value: V('těžké vozidlo – raději tyč nebo odtahová služba', 'heavy vehicle – preferably a tow bar or a tow service') }
        ],
        notes: [
          { level: 'warning', text: V('Diesel s velkou baterií potřebuje silné kabely (min. 25–35 mm²) a dárce s dostatečnou baterií. Malý osobní vůz často nestačí.', 'A diesel with a big battery needs heavy cables (at least 25–35 mm²) and a donor with a large enough battery. A small car is often not enough.') },
          { level: 'warning', text: V('Naložená dodávka je velmi těžká na brzdění při vlečení na laně – vyložte náklad nebo volejte odtah.', 'A loaded van is very hard to stop when towed on a rope – unload it or call a tow truck.') }
        ]
      }
    }
  });
})(window.STU);
