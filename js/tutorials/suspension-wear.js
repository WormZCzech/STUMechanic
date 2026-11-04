/* Tutorial: Suspension wear – finding play, drop links, tie-rod ends, ball joints, bushings. */
(function (S) {
  'use strict';
  var V = function (cs, en) { return { cs: cs, en: en }; };

  S.registerTutorial({
    id: 'suspension-wear',
    level: 2,
    thumb: 'suspension-wear.overview',
    time: V('kontrola 30 min · výměna 1–3 hod.', 'check 30 min · replacement 1–3 h'),
    title: V('Opotřebení podvozku: vůle, čepy, silentbloky', 'Suspension wear: play, joints, bushings'),
    summary: V('Jak najít klepání: spojovací tyče stabilizátoru, čepy řízení, kulové čepy, silentbloky. Výměna a dotažení v jízdní výšce.', 'Finding knocks: anti-roll bar links, tie-rod ends, ball joints, bushings. Replacement and tightening at ride height.'),
    intro: V(
      'Klepání přes nerovnosti, vůle ve volantu nebo nepřesné řízení mají většinou jednoduchou příčinu: **opotřebený kloub nebo pryžové uložení**. Naučíte se je systematicky najít a vyměnit ty nejčastější.\n\nČásti řízení a kulové čepy **drží kolo na voze** – chyba může znamenat ztrátu řízení. Pokud si nejste jistí, nechte výměnu dílně; najít závadu ale zvládnete sami.',
      'Knocking over bumps, play in the steering or vague handling usually have a simple cause: **a worn joint or rubber bushing**. You will learn to find them systematically and replace the most common ones.\n\nSteering parts and ball joints **hold the wheel on the car** – a mistake can mean loss of steering. If unsure, leave the replacement to a workshop; finding the fault you can do yourself.'
    ),
    safety: [
      { level: 'danger', text: V('Vůz na stojanech podle návodu **„Bezpečné zvednutí vozu“**. Při páčení a kývání kolem nesmí vůz na stojanech ujet ani se zhoupnout – nejdřív test stability.', 'Car on stands per **"Safely lifting the car"**. When levering and rocking the wheel the car must not shift on the stands – do the stability test first.') },
      { level: 'danger', text: V('Kulové čepy, čepy řízení a ramena: **samojistné matice a šrouby jen nové**, momenty přesně dle příručky. Uvolněný čep = kolo se může vyklopit.', 'Ball joints, tie-rod ends and arms: **self-locking nuts and bolts only new**, torques exactly per manual. A loose joint = the wheel can fold under.') },
      { level: 'warning', text: V('Po výměně čepu řízení, ramene nebo vzpěry **vždy geometrie**. Špatná sbíhavost ničí pneumatiky a zhoršuje řízení.', 'After replacing a tie-rod end, arm or strut **always do an alignment**. Wrong toe destroys tyres and worsens steering.') },
      { level: 'warning', text: V('Na kulové čepy nikdy netlučte kladivem na závit – použijte stahovák nebo rozpěrák. Zničený závit / zdeformovaný kužel = nebezpečný spoj.', 'Never hammer on a ball-joint thread – use a splitter or puller. A ruined thread / deformed taper = a dangerous joint.') },
      { level: 'caution', text: V('Pryžová uložení dotahujte až **v jízdní výšce** (zatížené kolo nebo zvedák pod ramenem).', 'Tighten rubber bushings only **at ride height** (wheel loaded or jack under the arm).') }
    ],
    tools: [
      V('Vše z návodu „Bezpečné zvednutí vozu“', 'Everything from "Safely lifting the car"'),
      V('Montážní páka, svítilna', 'Pry bar, torch'),
      V('Pomocník (točí volantem / šlape na brzdu)', 'A helper (turns the wheel / presses the brake)'),
      V('Klíče + imbus/Torx bity na kontru čepů', 'Spanners + hex/Torx bits to counter-hold studs'),
      V('Stahovák kulových čepů (vidlicový nebo šroubový)', 'Ball-joint splitter / puller'),
      V('Momentový klíč', 'Torque wrench'),
      V('Svinovací metr / posuvné měřítko (délka tyče řízení)', 'Tape measure / calliper (tie-rod length)'),
      V('Odrezovač', 'Penetrating oil')
    ],
    parts: [
      V('Podle nálezu: spojovací tyče stabilizátoru (v páru), čepy řízení, kulové čepy / ramena, silentbloky', 'As found: anti-roll bar drop links (in pairs), tie-rod ends, ball joints / arms, bushings'),
      V('Nové samojistné matice a šrouby', 'New self-locking nuts and bolts')
    ],
    finalChecks: [
      V('Všechny matice nové a dotažené momentem, závlačky (pokud jsou) zajištěné', 'All nuts new and torqued, split pins (if any) fitted'),
      V('Silentbloky dotažené v jízdní výšce', 'Bushings tightened at ride height'),
      V('Manžety čepů a řízení celé, nezkroucené', 'Joint and rack boots intact, not twisted'),
      V('Geometrie po výměně čepů řízení / ramen', 'Alignment after tie-rod ends / arms'),
      V('Zkušební jízda: klepání zmizelo, volant rovně', 'Test drive: knock gone, steering wheel straight')
    ],
    steps: [
      {
        id: 'overview', anim: 'suspension-wear.overview',
        title: V('Co klepe? Přehled kloubů', 'What is knocking? Joint overview'),
        body: V(
          '- **Spojovací tyč stabilizátoru** – nejčastější tupé klepání přes nerovnosti, hlavně při pomalé jízdě\n- **Silentbloky ramene** – bouchnutí při rozjezdu/brzdění, nepřesné řízení\n- **Kulový čep** – klepání, vůle; při vypadnutí se kolo vyklopí\n- **Čep řízení** – vůle ve volantu, ťukání při zatáčení\n- **Horní uložení vzpěry** – ťukání/vrzání při točení volantem na místě',
          '- **Anti-roll bar drop link** – the most common dull knock over bumps, especially at low speed\n- **Arm bushings** – clunk when pulling away/braking, vague steering\n- **Ball joint** – knock, play; if it separates the wheel folds under\n- **Tie-rod end** – play in the steering, tapping when turning\n- **Strut top mount** – knocking/creaking when steering at standstill'
        ),
        notes: [{ level: 'tip', text: V('Zapamatujte si, kdy klepe: nerovnosti, zatáčení, brzdění, rozjezd – pomůže to v průvodci příznaky.', 'Note when it knocks: bumps, turning, braking, pulling away – it helps in the symptom guide.') }]
      },
      {
        id: 'lift', anim: 'suspension-wear.lift',
        title: V('Zvedněte vůz – kolo musí viset', 'Lift the car – the wheel must hang free'),
        body: V('Zvedněte nápravu podle návodu **„Bezpečné zvednutí vozu“**, stojany pod karoserii. Kolo musí viset, aby se vůle projevila.', 'Lift the axle per **"Safely lifting the car"**, stands under the body. The wheel must hang so the play shows.'),
        notes: [{ level: 'danger', text: V('Před kýváním kolem vždy test stability vozu na stojanech.', 'Always do the stability test before rocking the wheel.') }]
      },
      {
        id: 'rock126', anim: 'suspension-wear.rock126',
        title: V('Test vůle na 12 a 6 hodinách', 'Play test at 12 and 6 o\'clock'),
        body: V('Uchopte kolo nahoře a dole a střídavě tlačte a táhněte. Cítíte cvaknutí? Pomocník sešlápne brzdu: **vůle zmizí = ložisko kola**, **zůstane = kulový čep / uložení**.', 'Grip the wheel top and bottom and push/pull alternately. Feel a clunk? A helper presses the brake: **play gone = wheel bearing**, **play remains = ball joint / mount**.'),
        notes: [{ level: 'info', text: V('Ložisko: viz návod „Výměna ložiska kola“.', 'Bearing: see the "Wheel bearing replacement" tutorial.') }]
      },
      {
        id: 'rock39', anim: 'suspension-wear.rock39',
        title: V('Test vůle na 3 a 9 hodinách', 'Play test at 3 and 9 o\'clock'),
        body: V('Uchopte kolo vlevo a vpravo a kývejte do stran. Vůle zde ukazuje na **čep řízení** nebo **vnitřní kloub tyče řízení**. Položte ruku na čep – pohyb ucítíte.', 'Grip the wheel left and right and rock it side to side. Play here points to the **tie-rod end** or the **inner tie-rod joint**. Put a hand on the joint – you will feel the movement.'),
        notes: [{ level: 'warning', text: V('Vůle v řízení = nejezdit déle, než je nutné. Vadný čep řízení se může utrhnout.', 'Play in the steering = do not drive longer than necessary. A worn tie-rod end can break.') }]
      },
      {
        id: 'pry', anim: 'suspension-wear.pry',
        title: V('Montážní pákou: silentbloky a uložení', 'With a pry bar: bushings and mounts'),
        body: V('Opatrně páčte mezi rameno a rám (nebo stabilizátor a jeho uložení). Pohyb o víc než pár milimetrů, praskání nebo vytlačená guma = opotřebený silentblok.', 'Carefully lever between the arm and the subframe (or the anti-roll bar and its mount). Movement of more than a few millimetres, cracking or pushed-out rubber = worn bushing.'),
        notes: [{ level: 'caution', text: V('Nepáčte přes manžety, kabely, brzdové trubky ani o kotouč.', 'Do not lever on boots, wires, brake pipes or the disc.') }]
      },
      {
        id: 'bushing', anim: 'suspension-wear.bushing',
        title: V('Vizuální kontrola pryží', 'Visual check of the rubber'),
        body: V('Prohlédněte všechny silentbloky a manžety: praskliny, natržení, vytlačená nebo olejem nabobtnalá guma, posunuté jádro. Natržená manžeta kulového čepu nebo řízení = do čepu jde voda a brzy se opotřebí.', 'Inspect all bushings and boots: cracks, tears, pushed-out or oil-swollen rubber, offset centre. A split ball-joint or rack boot = water gets in and the joint soon wears out.')
      },
      {
        id: 'dropLink', anim: 'suspension-wear.dropLink',
        title: V('Výměna spojovací tyče stabilizátoru', 'Replace an anti-roll bar drop link'),
        body: V(
          '1. Kolo v jízdní výšce nebo zvedák pod rameno (stabilizátor bez pnutí).\n2. Povolte horní a dolní matici – čep kontrujte imbusem/Torxem.\n3. Vyndejte starou tyč, vložte novou.\n4. Nové matice dotáhněte momentem (čep opět kontrovat).',
          '1. Wheel at ride height or a jack under the arm (anti-roll bar unloaded).\n2. Undo the top and bottom nut – counter-hold the stud with hex/Torx.\n3. Remove the old link, fit the new one.\n4. Torque the new nuts (counter-hold again).'
        ),
        specs: [{ label: V('Matice tyče', 'Link nuts'), value: V('dle příručky', 'per manual'), verify: true }],
        notes: [
          { level: 'tip', text: V('Protáčí se čep i s kontrou? Zatlačte na kloub (zatížit), nebo použijte speciální klíč s kontrou.', 'Stud spins even with counter-hold? Load the joint, or use a special counter-hold spanner.') },
          { level: 'info', text: V('Spojovací tyče je dobré měnit v páru na nápravě.', 'Replacing drop links in pairs per axle is good practice.') }
        ]
      },
      {
        id: 'tieRod', anim: 'suspension-wear.tieRod',
        title: V('Výměna čepu řízení', 'Replace a tie-rod end'),
        body: V(
          '1. **Změřte délku** nebo spočítejte otáčky – nový čep našroubujete na stejnou délku.\n2. Povolte kontramatici, matici čepu a čep vytlačte stahovákem.\n3. Vyšroubujte starý čep, nový našroubujte na stejný počet otáček.\n4. Nová samojistná matice, kontramatice, momenty dle příručky.\n5. **Geometrie** – sbíhavost se vždy trochu změní.',
          '1. **Measure the length** or count the turns – fit the new end at the same length.\n2. Undo the lock nut and the joint nut, press the joint out with a splitter.\n3. Unscrew the old end, screw the new one on by the same number of turns.\n4. New self-locking nut, lock nut, torques per manual.\n5. **Alignment** – toe always changes slightly.'
        ),
        specs: [{ label: V('Matice čepu / kontramatice', 'Joint nut / lock nut'), value: V('dle příručky', 'per manual'), verify: true }],
        notes: [{ level: 'danger', text: V('Kontramatice musí být dotažená – povolená tyč se může protočit a změnit směr kola za jízdy.', 'The lock nut must be tight – a loose rod can turn and change the wheel direction while driving.') }]
      },
      {
        id: 'ballJoint', anim: 'suspension-wear.ballJoint',
        title: V('Kulový čep / rameno (přehled)', 'Ball joint / arm (overview)'),
        body: V('Kulový čep bývá **šroubovaný, nýtovaný nebo zalisovaný** do ramene – podle toho se mění čep, nebo celé rameno. Postup: svěrný šroub ven, rameno páčit dolů, čep z těhlice; montáž v opačném pořadí s novými šrouby. Pokud si nejste jistí, **dílna**.', 'A ball joint is **bolted, riveted or pressed** into the arm – so either the joint or the whole arm is replaced. Procedure: pinch bolt out, lever the arm down, joint out of the knuckle; refit in reverse with new bolts. If unsure, **workshop**.'),
        notes: [{ level: 'danger', text: V('Kulový čep drží kolo – chyba = ztráta kontroly nad vozem.', 'The ball joint holds the wheel – a mistake = loss of control of the car.') }]
      },
      {
        id: 'rideHeight', anim: 'suspension-wear.rideHeight',
        title: V('Dotažení silentbloků v jízdní výšce', 'Tighten bushings at ride height'),
        body: V('Rameno zvedněte zvedákem do polohy, ve které je při jízdě (nebo spusťte vůz na kola a dotáhněte přístupné šrouby). Teprve pak dotáhněte šrouby silentbloků momentem.', 'Raise the arm with a jack to its normal driving position (or lower the car onto its wheels and tighten accessible bolts). Only then torque the bushing bolts.'),
        notes: [{ level: 'warning', text: V('Dotažené ve visu = pryž stále zkroucená → praskne během pár tisíc km.', 'Tightened while hanging = the rubber stays twisted → cracks within a few thousand km.') }]
      },
      {
        id: 'align', anim: 'suspension-wear.align',
        title: V('Geometrie a zkušební jízda', 'Alignment and test drive'),
        body: V('Po výměně čepu řízení, ramene nebo uložení nechte **seřídit geometrii**. Zkušební jízda: klepání zmizelo, vůz netáhne, volant rovně.', 'After a tie-rod end, arm or mount, **have the alignment set**. Test drive: knock gone, no pull, steering wheel straight.')
      }
    ],
    vehicles: {
      'mb-cl500-c216': {
        status: 'caution',
        specs: [
          { label: V('Přední náprava', 'Front axle'), value: V('Víceprvková (horní a dolní ramena) + ABC vzpěry', 'Multi-link (upper and lower arms) + ABC struts'), verify: true },
          { label: V('Typické opotřebení', 'Typical wear'), value: V('Silentbloky ramen (těžký vůz), tlačné/tahové vzpěry', 'Arm bushings (heavy car), tension/thrust struts'), verify: true }
        ],
        notes: [
          { level: 'danger', text: V('ABC: zvedat jen na stojany pod zvedací body, výšku neměnit; hydraulická vedení neotvírat.', 'ABC: lift only onto stands under the jacking points, do not change the ride height; do not open hydraulic lines.') },
          { level: 'info', text: V('Spojovací tyče stabilizátoru u ABC nejsou (stabilizaci řeší ABC) – klepání hledejte v ramenech a uložení vzpěr.', 'ABC cars have no conventional drop links (ABC handles roll) – look for knocks in the arms and strut mounts.'), verify: true }
        ],
        steps: { dropLink: { notes: [{ level: 'info', text: V('U CL 500 s ABC tento krok nemusí platit – ověřte ve WIS.', 'On a CL 500 with ABC this step may not apply – verify in WIS.'), verify: true }] } }
      },
      'volvo-xc60-b4': {
        status: 'caution',
        specs: [
          { label: V('Přední náprava', 'Front axle'), value: V('Dvojitá lichoběžníková (ověřit)', 'Double wishbone (verify)'), verify: true },
          { label: V('Po geometrii', 'After alignment'), value: V('Kalibrace kamery / radaru (VIDA)', 'Camera / radar calibration (VIDA)') }
        ],
        notes: [
          { level: 'danger', text: V('Vzduchový podvozek: před zvednutím vypnout regulaci výšky (režim zvedání).', 'Air suspension: switch off level control (jacking mode) before lifting.'), verify: true },
          { level: 'warning', text: V('Po výměně čepů řízení / ramen: geometrie + kalibrace ADAS, jinak nemusí správně fungovat asistenti.', 'After tie-rod ends / arms: alignment + ADAS calibration, otherwise driver assists may not work correctly.') }
        ]
      },
      'skoda-octavia-rs-tdi': {
        status: 'ok',
        specs: [
          { label: V('Přední náprava', 'Front axle'), value: V('McPherson + dolní trojúhelníkové rameno', 'MacPherson + lower wishbone') },
          { label: V('Kulový čep', 'Ball joint'), value: V('Přišroubovaný k ramenu (lze měnit samostatně) – ověřit', 'Bolted to the arm (replaceable separately) – verify'), verify: true },
          { label: V('Momenty', 'Torques'), value: V('dle ELSA (často nové šrouby + úhel)', 'per ELSA (often new bolts + angle)'), verify: true }
        ],
        notes: [{ level: 'info', text: V('Častá závada: spojovací tyče stabilizátoru a zadní silentbloky předních ramen.', 'Common faults: anti-roll bar drop links and the rear bushings of the front arms.'), verify: true }]
      },
      'toyota-gr-yaris': {
        status: 'ok',
        specs: [{ label: V('Momenty', 'Torques'), value: V('dle TIS', 'per TIS'), verify: true }],
        notes: [
          { level: 'warning', text: V('Po okruhovém dni zkontrolujte vůle a momenty – podvozek je silně namáhaný.', 'After a track day check for play and torques – the suspension is heavily loaded.') },
          { level: 'info', text: V('Nízký vůz: k ramenům se dostanete jen se stojany a nízkoprofilovým heverem.', 'Low car: you only reach the arms with stands and a low-profile jack.') }
        ]
      },
      'citroen-jumper-22hdi': {
        status: 'ok',
        specs: [
          { label: V('Přední náprava', 'Front axle'), value: V('McPherson + dolní rameno', 'MacPherson + lower arm') },
          { label: V('Momenty', 'Torques'), value: V('dle příručky PSA/Fiat', 'per PSA/Fiat manual'), verify: true }
        ],
        notes: [
          { level: 'warning', text: V('Těžká dodávka opotřebovává ramena, čepy a stabilizátor rychleji – hlavně při plném naložení.', 'A heavy van wears arms, joints and the anti-roll bar faster – especially fully loaded.') },
          { level: 'danger', text: V('Hever a stojany min. 3 t, náklad vyložit.', 'Jack and stands rated at least 3 t, unload the cargo.') }
        ]
      }
    }
  });
})(window.STU);
