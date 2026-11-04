/* Tutorial: Engine & gearbox mounts. 3D scenes: js/3d/scenes/engine-mounts.js */
(function (S) {
  'use strict';
  var V = function (cs, en) { return { cs: cs, en: en }; };

  S.registerTutorial({
    id: 'engine-mounts',
    level: 2,
    thumb: 'engine-mounts.overview',
    time: V('1–3 h (na držák)', '1–3 h (per mount)'),
    title: V('Uložení motoru a převodovky (silentbloky)', 'Engine & gearbox mounts'),
    summary: V('Rána při rozjezdu, vibrace na volnoběh? Kontrola a výměna držáků motoru a reakční vzpěry.', 'Clunk on take-off, vibration at idle? Inspecting and replacing engine mounts and the torque rod.'),
    intro: V(
      'Motor a převodovka stojí na **pryžových (často hydraulických) držácích**, které tlumí vibrace a zachycují kroutící moment. Opotřebený držák způsobuje **rány při rozjezdu a řazení**, vibrace a nadměrný pohyb motoru – což zatěžuje hadice, výfuk a kabely.\n\nNejčastěji odchází spodní **reakční vzpěra („kost“)** a hydrodržák na straně motoru.',
      'The engine and gearbox sit on **rubber (often hydraulic) mounts** that damp vibration and take the torque. A worn mount causes **clunks on take-off and gear changes**, vibration and excessive engine movement – which strains hoses, exhaust and cables.\n\nThe lower **torque rod ("dog-bone")** and the hydro mount on the engine side fail most often.'
    ),
    safety: [
      { level: 'danger', text: V('Před povolením jakéhokoli držáku **motor podepřete** (traverza přes blatníky nebo hever s dřevěnou podložkou pod vanou). Motor bez podpory spadne nebo se nakloní – hrozí rozdrcení rukou.', '**Support the engine** before undoing any mount (support bar across the wings or a jack with a wooden pad under the sump). An unsupported engine drops or tilts – risk of crushed hands.') },
      { level: 'danger', text: V('Test s pomocníkem jen za těchto podmínek: parkovací brzda, **neutrál / P**, nikdo před ani za vozem, krátké přidání plynu. Ruce mimo řemeny a ventilátor.', 'Helper test only under these conditions: parking brake, **neutral / P**, nobody in front of or behind the car, short throttle blips. Hands away from belts and fan.') },
      { level: 'warning', text: V('Pod vůz jen na stojanech – viz návod „Bezpečné zvednutí vozu“.', 'Under the car only on stands – see "Safely lifting the car".') },
      { level: 'caution', text: V('Šrouby držáků bývají **na jedno použití** a dotahují se na moment + úhel. Hodnoty vždy z příručky.', 'Mount bolts are often **single-use** and tightened to torque + angle. Always take values from the manual.') }
    ],
    tools: [
      V('Traverza pro podepření motoru nebo hever + dřevěný hranol', 'Engine support bar or a jack + wooden block'),
      V('Páčidlo (montážní páka)', 'Pry bar'),
      V('Nástrčné klíče, Torx / E-Torx, prodlužovací nástavce', 'Sockets, Torx / E-Torx, extensions'),
      V('Momentový klíč (a úhloměr)', 'Torque wrench (and angle gauge)'),
      V('Svítilna, zrcátko', 'Torch, mirror')
    ],
    parts: [
      V('Držák / reakční vzpěra dle VIN (originál nebo kvalitní ekvivalent)', 'Mount / torque rod by VIN (OE or quality equivalent)'),
      V('Nové šrouby a matice (jsou-li předepsané)', 'New bolts and nuts (if specified)')
    ],
    finalChecks: [
      V('Všechny šrouby dotaženy předepsaným momentem (a úhlem)', 'All bolts torqued to spec (and angle)'),
      V('Podpěra motoru odstraněna, hadice a kabely nikde nedřou', 'Engine support removed, hoses and cables not rubbing'),
      V('Při rozjezdu a řazení žádné rány', 'No clunks on take-off and gear changes'),
      V('Po 100–200 km šrouby zkontrolovat', 'Check the bolts after 100–200 km')
    ],
    steps: [
      {
        id: 'overview', anim: 'engine-mounts.overview',
        title: V('Kde jsou držáky', 'Where the mounts are'),
        body: V('U napříč uloženého motoru: **pravý držák** (strana motoru, často hydraulický), **levý držák** (převodovka) a **spodní reakční vzpěra** mezi převodovkou a pomocným rámem. U podélného motoru: dva držáky motoru po stranách a držák převodovky vzadu.',
          'On a transverse engine: the **right mount** (engine side, often hydraulic), the **left mount** (gearbox) and the **lower torque rod** between gearbox and subframe. On a longitudinal engine: two engine mounts on the sides and a transmission mount at the rear.')
      },
      {
        id: 'symptoms', anim: 'engine-mounts.symptoms',
        title: V('Příznaky', 'Symptoms'),
        body: V('- **Rána („ťuk“)** při rozjezdu, přeřazení, přechodu mezi plynem a brzděním motorem.\n- **Vibrace** volantu, sedadel a karoserie na volnoběh, hlavně se zařazenou D.\n- Motor se viditelně **kýve** při startu a vypnutí.\n- Zvuky z řazení, „cukání“ pedálu spojky.',
          '- A **clunk** on take-off, gear changes and on/off throttle.\n- **Vibration** in the steering wheel, seats and body at idle, especially in D.\n- The engine visibly **rocks** when starting and stopping.\n- Gear-change noises, a juddering clutch pedal.'),
        notes: [{ level: 'info', text: V('Podobné rány dělají i čepy, silentbloky ramen a kloubové hřídele – viz průvodce příznaky.', 'Similar clunks come from ball joints, arm bushes and driveshafts – see the symptom guide.') }]
      },
      {
        id: 'inspect', anim: 'engine-mounts.inspect',
        title: V('Vizuální kontrola', 'Visual inspection'),
        body: V('Svítilnou a zrcátkem prohlédněte všechny držáky: **trhliny a odtržení pryže**, olejová skvrna pod hydrodržákem (vyteklá náplň), pokleslý motor, vydřená místa na karoserii či rámu, roztržené pouzdro reakční vzpěry.',
          'With a torch and mirror inspect all mounts: **cracked or separated rubber**, an oily stain under a hydro mount (leaked fluid), a sagging engine, rub marks on body or frame, a torn torque-rod bush.')
      },
      {
        id: 'helper', anim: 'engine-mounts.helper',
        title: V('Test pohybu', 'Movement test'),
        body: V('**Motor vypnutý:** páčidlem mezi pomocným rámem a převodovkou / vzpěrou zkuste motor pohnout – nesmí se výrazně posouvat ani klepat.\n\n**S pomocníkem:** parkovací brzda, neutrál (automat P), krátké přidání plynu a nastartování / vypnutí – vy z bezpečné vzdálenosti sledujete, jak se motor kývá. Velký pohyb nebo ťuknutí = vadný držák.',
          '**Engine off:** with a pry bar between subframe and gearbox / torque rod try to move the engine – it must not shift a lot or knock.\n\n**With a helper:** parking brake, neutral (automatic P), short throttle blips and start / stop – you watch the engine rock from a safe distance. Large movement or a knock = failed mount.'),
        notes: [
          { level: 'danger', text: V('Žádné zatěžování se zařazeným rychlostním stupněm proti brzdě – vůz může vyrazit. Nikdo před ani za vozem.', 'No loading against the brake with a gear engaged – the car can lunge. Nobody in front of or behind the car.') },
          { level: 'warning', text: V('Ruce a oblečení mimo řemeny a ventilátor.', 'Hands and clothing away from belts and fan.') }
        ]
      },
      {
        id: 'support', anim: 'engine-mounts.support',
        title: V('Podepřete motor', 'Support the engine'),
        body: V('Vůz bezpečně zvedněte (je-li potřeba). Motor podepřete **traverzou** přes blatníky (háky do závěsných ok) nebo **heverem s dřevěnou podložkou** pod vanou. Jen lehce odlehčete – nezvedejte motor, ohnuli byste vanu nebo natrhli hadice.',
          'Lift the car safely (if needed). Support the engine with a **support bar** across the wings (hooks into the lifting eyes) or a **jack with a wooden pad** under the sump. Just take the weight – do not lift the engine or you will bend the sump or pull hoses.'),
        notes: [{ level: 'danger', text: V('Nikdy nemějte ruce mezi motorem a karoserií, když povolujete držák.', 'Never have your hands between engine and body while undoing a mount.') }]
      },
      {
        id: 'replace', anim: 'engine-mounts.replace',
        title: V('Vyměňte držák', 'Replace the mount'),
        body: V('Povolte šrouby držáku (u vzpěry obvykle 2 šrouby), starý díl vyjměte a porovnejte s novým. Nový díl nasaďte **ve stejné orientaci** a šrouby zatím jen přitáhněte. Měňte vždy jen jeden držák najednou.',
          'Undo the mount bolts (a torque rod usually has 2), remove the old part and compare it with the new one. Fit the new part **in the same orientation** and only snug the bolts for now. Replace one mount at a time.'),
        notes: [{ level: 'caution', text: V('Použijte nové šrouby, pokud je výrobce předepisuje (pružné šrouby).', 'Use new bolts if the manufacturer specifies them (stretch bolts).') }]
      },
      {
        id: 'torque', anim: 'engine-mounts.torque',
        title: V('Dotáhněte předepsaným momentem', 'Tighten to the specified torque'),
        body: V('Odstraňte podpěru tak, aby motor dosedl do své přirozené polohy (často vůz na kolech), a teprve pak šrouby dotáhněte **momentem (a úhlem) dle příručky**. Dotažení v napnuté poloze způsobí vibrace a rychlé opotřebení.',
          'Remove the support so the engine settles in its natural position (often with the car on its wheels), and only then tighten the bolts **to the torque (and angle) per manual**. Tightening under preload causes vibration and fast wear.'),
        specs: [{ label: V('Šrouby držáků', 'Mount bolts'), value: V('dle příručky (moment + úhel)', 'per manual (torque + angle)') }]
      },
      {
        id: 'test', anim: 'engine-mounts.symptoms',
        title: V('Zkušební jízda', 'Test drive'),
        body: V('Rozjeďte se, přeřaďte, přidejte a uberte plyn – rány musí zmizet a vibrace na volnoběh se zmenšit. Po 100–200 km zkontrolujte dotažení.',
          'Pull away, change gears, accelerate and lift off – the clunks must be gone and idle vibration reduced. Check the bolts after 100–200 km.')
      }
    ],
    vehicles: {
      'mb-cl500-c216': {
        status: 'caution',
        specs: [
          { label: V('Uložení', 'Layout'), value: V('podélný V8: 2 držáky motoru + držák převodovky', 'longitudinal V8: 2 engine mounts + transmission mount') },
          { label: V('Typ držáků motoru', 'Engine mount type'), value: V('hydraulické – ověřit (případně elektronicky řízené)', 'hydraulic – verify (possibly electronically controlled)'), verify: true }
        ],
        notes: [
          { level: 'warning', text: V('Těžký V8 – podpírejte stabilně a postupujte podle WIS (přístup k držákům bývá zdola přes pomocný rám).', 'Heavy V8 – support it securely and follow WIS (mounts are usually reached from below through the subframe).'), verify: true },
          { level: 'warning', text: V('Zvedání s ABC podvozkem: viz návod Bezpečné zvednutí vozu.', 'Lifting with ABC suspension: see Safely lifting the car.') }
        ]
      },
      'volvo-xc60-b4': {
        status: 'caution',
        specs: [
          { label: V('Uložení', 'Layout'), value: V('napříč: pravý, levý držák + spodní reakční vzpěra', 'transverse: right, left mount + lower torque rod'), verify: true }
        ],
        notes: [
          { level: 'warning', text: V('Vzduchový podvozek: před zvedáním režim zvedání. Práce u 48V komponent: odpojit 12V i 48V dle VIDA.', 'Air suspension: jacking mode before lifting. Work near 48V components: disconnect 12V and 48V per VIDA.') },
          { level: 'info', text: V('Momenty a šrouby na jedno použití dle VIDA.', 'Torques and single-use bolts per VIDA.') }
        ]
      },
      'skoda-octavia-rs-tdi': {
        status: 'ok',
        specs: [
          { label: V('Uložení', 'Layout'), value: V('pravý hydrodržák motoru, levý držák převodovky, spodní kyvná vzpěra', 'right hydro engine mount, left gearbox mount, lower pendulum (dog-bone) mount') },
          { label: V('Šrouby', 'Bolts'), value: V('moment + úhel dle ELSA, často na jedno použití', 'torque + angle per ELSA, often single-use'), verify: true }
        ],
        notes: [{ level: 'tip', text: V('Spodní kyvná vzpěra je u TDI častou příčinou rány při rozjezdu a vibrací – výměna je relativně snadná zespodu.', 'The lower pendulum mount is a common cause of take-off clunks and vibration on TDIs – it is relatively easy to replace from below.') }]
      },
      'toyota-gr-yaris': {
        status: 'ok',
        specs: [{ label: V('Uložení', 'Layout'), value: V('napříč – rozložení a momenty dle TIS', 'transverse – layout and torques per TIS'), verify: true }],
        notes: [{ level: 'info', text: V('Tužší sportovní držáky zvyšují vibrace v kabině – při okruhovém provozu kontrolujte držáky častěji.', 'Stiffer sport mounts increase cabin vibration – with track use inspect the mounts more often.') }]
      },
      'citroen-jumper-22hdi': {
        status: 'caution',
        specs: [{ label: V('Uložení', 'Layout'), value: V('napříč: držáky + spodní reakční vzpěra – ověřit', 'transverse: mounts + lower torque rod – verify'), verify: true }],
        notes: [
          { level: 'warning', text: V('Těžký motor a převodovka – podpěra s dostatečnou nosností; zvedání jen s heverem a stojany min. 3 t.', 'Heavy engine and gearbox – use a support rated accordingly; lift only with a jack and stands rated at least 3 t.') },
          { level: 'info', text: V('Díly a postup jsou shodné s Fiat Ducato / Peugeot Boxer stejného motoru.', 'Parts and procedure match the Fiat Ducato / Peugeot Boxer with the same engine.') }
        ]
      }
    }
  });
})(window.STU);
