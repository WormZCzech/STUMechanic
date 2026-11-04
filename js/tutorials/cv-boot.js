/* Tutorial: CV joint boot & CV joint replacement. */
(function (S) {
  'use strict';
  var V = function (cs, en) { return { cs: cs, en: en }; };

  S.registerTutorial({
    id: 'cv-boot',
    level: 3,
    thumb: 'cv-boot.cutaway',
    time: V('3–5 hod. na stranu', '3–5 h per side'),
    title: V('Manžeta a homokinetický kloub poloosy', 'CV boot & CV joint replacement'),
    summary: V('Cvakání v plném rejdu, mastnota kolem kola. Vyjmutí poloosy, nový kloub / manžeta, správné množství tuku, stahovací pásky.', 'Clicking on full lock, grease around the wheel. Driveshaft removal, new joint / boot, correct grease amount, band clamps.'),
    intro: V(
      'Homokinetický kloub přenáší točivý moment na kolo i v rejdu. Chrání ho **gumová manžeta** naplněná tukem. Když manžeta praskne, tuk vyletí, dovnitř se dostane písek a voda a kloub se za pár tisíc km zničí – začne **cvakat v plném rejdu** při rozjezdu.\n\nVčas vyměněná manžeta ušetří kloub. Zničený kloub se mění celý (nebo celá poloosa). Práce vyžaduje **velký moment na matici poloosy**, rozpojení čepů podvozku a pečlivost.',
      'The constant-velocity (CV) joint transmits torque to the wheel even when steering. It is protected by a **rubber boot** filled with grease. When the boot splits, the grease is flung out, sand and water get in and the joint is destroyed within a few thousand km – it starts **clicking on full lock** when pulling away.\n\nA boot replaced in time saves the joint. A worn joint is replaced as a unit (or the whole driveshaft). The job needs **high torque on the axle nut**, separating suspension joints and care.'
    ),
    safety: [
      { level: 'danger', text: V('Pod vůz jen na stojanech – viz **Bezpečné zvednutí vozu**. Při povolování matice poloosy musí kolo stát **na zemi**, nikdy na stojanu.', 'Only under the car on stands – see **Safely lifting the car**. When loosening the axle nut the wheel must be **on the ground**, never on a stand.') },
      { level: 'danger', text: V('Matice poloosy, čepy ramen a tyčí řízení jsou **bezpečnostní spoje**. Samojistné matice a jednorázové šrouby vždy nové, utahovat předepsaným momentem.', 'The axle nut, ball joints and tie-rod ends are **safety-critical joints**. Self-locking nuts and stretch bolts always new, tightened to the specified torque.') },
      { level: 'warning', text: V('Poloosu nikdy nenechte viset jen na vnitřním kloubu – kloub se přelomí do krajní polohy a poškodí. Podepřete ji drátem.', 'Never let the driveshaft hang on its inner joint – the joint over-articulates and gets damaged. Support it with wire.') },
      { level: 'warning', text: V('Při vytažení vnitřního kloubu z převodovky vyteče olej – připravte misku a nový těsnicí kroužek.', 'Pulling the inner joint out of the gearbox releases oil – have a tray and a new oil seal ready.') },
      { level: 'caution', text: V('**Dělené (lepené) manžety nedoporučujeme** – často netěsní. Použijte celistvou manžetu.', '**We do not recommend split (glued) boots** – they often leak. Use a one-piece boot.') },
      { level: 'caution', text: V('Do kloubu dejte **jen tuk ze sady** a celé množství – jiný tuk nebo méně tuku zkrátí životnost.', 'Use **only the grease from the kit**, all of it – other grease or less grease shortens joint life.') }
    ],
    tools: [
      V('Vše z návodu „Bezpečné zvednutí vozu“', 'Everything from "Safely lifting the car"'),
      V('Hlavice na matici poloosy (často 30–36 mm, 12hran – ověřit) + dlouhá páka', 'Axle nut socket (often 30–36 mm, 12-point – verify) + long breaker bar'),
      V('Momentový klíč s rozsahem pro matici poloosy (až cca 300+ Nm)', 'Torque wrench rated for the axle nut (up to approx. 300+ Nm)'),
      V('Stahovák / vyrážeč kulových čepů', 'Ball-joint splitter / separator'),
      V('Kleště na stahovací pásky (crimp) nebo napínák pásek', 'Band clamp crimping pliers or band tensioner'),
      V('Měděná / plastová palice, kleště na pojistné kroužky', 'Copper / plastic mallet, circlip pliers'),
      V('Odmašťovač, hadry, miska na olej', 'Degreaser, rags, oil tray'),
      V('Rukavice, brýle', 'Gloves, glasses')
    ],
    parts: [
      V('Sada manžety (manžeta, tuk, pásky, pojistný kroužek) – nebo celý kloub / poloosa', 'Boot kit (boot, grease, bands, circlip) – or a complete joint / driveshaft'),
      V('Nová matice poloosy (často jednorázová)', 'New axle nut (often single-use)'),
      V('Nové samojistné matice kulových čepů', 'New self-locking ball-joint nuts'),
      V('Těsnicí kroužek převodovky (pokud se vytahuje vnitřní kloub)', 'Gearbox oil seal (if the inner joint is pulled out)'),
      V('Převodový olej na doplnění', 'Gear oil to top up')
    ],
    finalChecks: [
      V('Matice poloosy dotažena momentem na zemi (a zajištěna, je-li předepsáno)', 'Axle nut torqued with the wheel on the ground (and staked/locked if specified)'),
      V('Kulové čepy dotaženy novými maticemi', 'Ball joints tightened with new nuts'),
      V('Pásky manžety zacvaknuté, manžeta nezkroucená', 'Boot bands crimped, boot not twisted'),
      V('Olej v převodovce doplněn', 'Gearbox oil topped up'),
      V('Zkušební jízda v plném rejdu oběma směry – žádné cvakání', 'Test drive at full lock both ways – no clicking'),
      V('Po 50 km kontrola těsnosti a utažení', 'Check leaks and tightness after 50 km'),
      V('Geometrie – při rozpojení tyče řízení / ramen nechte zkontrolovat', 'Alignment – have it checked if tie rods / arms were disconnected')
    ],
    steps: [
      {
        id: 'symptoms', anim: 'cv-boot.symptoms',
        title: V('Poznejte vadný kloub', 'Recognise a failing joint'),
        body: V(
          '- **Cvakání / klepání při rozjezdu v plném rejdu** = opotřebený vnější kloub\n- **Vibrace při zrychlování** (ne při jízdě setrvačností) = vnitřní kloub\n- **Tuk rozstříknutý** po vnitřku kola, ramenech a podběhu = prasklá manžeta\n\nVyzkoušejte na prázdném parkovišti pomalé kroužení v plném rejdu doleva i doprava s okénkem dolů.',
          '- **Clicking / knocking when pulling away on full lock** = worn outer joint\n- **Vibration under acceleration** (not when coasting) = inner joint\n- **Grease sprayed** around the inside of the wheel, arms and arch = split boot\n\nTest on an empty car park: drive slow circles on full lock left and right with the window down.'
        ),
        notes: [{ level: 'warning', text: V('Silně klepající kloub se může rozpadnout – vůz pak ztratí pohon. Neodkládejte opravu.', 'A badly knocking joint can break up – the car then loses drive. Do not postpone the repair.') }]
      },
      {
        id: 'inspect', anim: 'cv-boot.inspect',
        title: V('Zkontrolujte manžety', 'Inspect the boots'),
        body: V(
          'Natočte kola do rejdu a prohlédněte vnější manžety ze všech stran – praskliny se nejčastěji skrývají v záhybech. Pak vnitřní manžety u převodovky. Prasklou manžetu měňte **hned** – pokud kloub ještě necvaká, stačí manžeta.',
          'Turn the wheels to full lock and inspect the outer boots all round – cracks usually hide in the folds. Then the inner boots at the gearbox. Replace a split boot **at once** – if the joint does not click yet, a boot is enough.'
        ),
        notes: [{ level: 'tip', text: V('Tuk v manžetě musí být čistý. Písek nebo voda uvnitř = kloub vyčistit a zkontrolovat, raději vyměnit.', 'The grease must be clean. Sand or water inside = clean and inspect the joint, preferably replace it.') }]
      },
      {
        id: 'axlenut', anim: 'cv-boot.axlenut',
        title: V('Povolte matici poloosy – kolo na zemi', 'Loosen the axle nut – wheel on the ground'),
        body: V(
          'Sundejte středovou krytku kola (nebo kolo povolte a matici povolte až s kolem namontovaným). Pomocník sešlápne brzdu. **Dlouhou pákou** povolte matici poloosy – je velmi utažená. Povolte i šrouby kola.',
          'Remove the wheel centre cap (or loosen with the wheel still fitted). A helper presses the brake. Break the axle nut loose with a **long breaker bar** – it is very tight. Loosen the wheel bolts too.'
        ),
        notes: [
          { level: 'danger', text: V('Nikdy nepovolujte ani nedotahujte matici poloosy na zvednutém voze na stojanech – vůz můžete ze stojanů strhnout.', 'Never loosen or tighten the axle nut with the car on stands – you can pull it off the stands.') },
          { level: 'caution', text: V('Zajištěné (zapěchované) matice nejdřív odklepněte, jinak poškodíte závit.', 'Staked nuts must be un-staked first, otherwise you damage the thread.') }
        ]
      },
      {
        id: 'lift', anim: 'lift.stands',
        title: V('Zvedněte vůz a sundejte kolo', 'Lift the car and remove the wheel'),
        body: V('Postupujte podle návodu **Bezpečné zvednutí vozu**.', 'Follow **Safely lifting the car**.'),
        notes: [{ level: 'danger', text: V('Pod vůz až po testu stability.', 'Only under the car after the stability test.') }]
      },
      {
        id: 'separate', anim: 'cv-boot.separate',
        title: V('Rozpojte čep ramene a vyklopte těhlici', 'Separate the ball joint and swing the knuckle out'),
        body: V(
          'Vyšroubujte matici poloosy. Rozpojte **kulový čep spodního ramene** (stahovákem) – případně i čep tyče řízení a stabilizátor podle konstrukce. Těhlici vyklopte ven a poloosu vysuňte z náboje.',
          'Remove the axle nut. Separate the **lower arm ball joint** (with a splitter) – and the tie-rod end and anti-roll bar link if the design needs it. Swing the knuckle out and push the driveshaft out of the hub.'
        ),
        notes: [
          { level: 'caution', text: V('Netlučte kladivem přímo na konec poloosy – poničíte závit. Použijte starou matici nasazenou zarovno nebo vyrážeč.', 'Do not hammer directly on the end of the shaft – you will ruin the thread. Use the old nut flush on the end or a press tool.') },
          { level: 'warning', text: V('Dejte pozor na kabel ABS snímače a brzdovou hadici – nesmí se natáhnout.', 'Watch the ABS sensor cable and the brake hose – they must not be stretched.') }
        ]
      },
      {
        id: 'shaftout', anim: 'cv-boot.shaftout',
        title: V('Vyjměte poloosu', 'Remove the driveshaft'),
        body: V(
          'Pokud měníte jen vnější manžetu, poloosa může zůstat v převodovce (podepřete ji). Jinak vnitřní kloub vypáčte z převodovky (pojistný kroužek) nebo odšroubujte přírubu. Olej zachyťte, otvor zakryjte.',
          'If you only replace the outer boot, the shaft can stay in the gearbox (support it). Otherwise lever the inner joint out of the gearbox (circlip) or unbolt the flange. Catch the oil, cover the opening.'
        ),
        notes: [{ level: 'warning', text: V('Páčte jen za kloub, nikdy netahejte za poloosu – vnitřní kloub se rozebere.', 'Lever only on the joint, never pull on the shaft – the inner joint comes apart.') }]
      },
      {
        id: 'jointoff', anim: 'cv-boot.jointoff',
        title: V('Sundejte kloub a starou manžetu', 'Remove the joint and old boot'),
        body: V(
          'Poloosu upněte do svěráku s měkkými čelistmi. Přestřihněte pásky, manžetu rozřízněte. Kloub sklepněte z drážkování **měděnou / plastovou palicí** na vnitřní kroužek (překoná pojistný kroužek). Starou manžetu stáhněte.',
          'Clamp the shaft in a vice with soft jaws. Cut the bands, slit the boot. Knock the joint off the splines with a **copper / plastic mallet** on the inner race (it overcomes the circlip). Pull off the old boot.'
        ),
        notes: [{ level: 'caution', text: V('Netlučte na klec ani kuličky – kloub se poškodí.', 'Do not hit the cage or balls – the joint gets damaged.') }]
      },
      {
        id: 'cutaway', anim: 'cv-boot.cutaway',
        title: V('Vyčistěte a posuďte kloub', 'Clean and assess the joint'),
        body: V(
          'Kloub vymyjte odmašťovačem a prohlédněte dráhy kuliček: **důlky, vydřené stopy nebo vůle** = nový kloub. Hladké lesklé dráhy a žádná vůle = stačí nová manžeta a tuk.',
          'Wash the joint in degreaser and inspect the ball tracks: **pitting, worn marks or play** = new joint. Smooth shiny tracks and no play = a new boot and grease are enough.'
        ),
        notes: [{ level: 'tip', text: V('Kloub, který už cvakal, se nevyplatí zachraňovat – vždy nový.', 'A joint that already clicked is not worth saving – always replace it.') }]
      },
      {
        id: 'grease', anim: 'cv-boot.grease',
        title: V('Naplňte kloub tukem', 'Pack the joint with grease'),
        body: V(
          'Nasuňte novou manžetu (a malou pásku) na poloosu. **Celé** balení tuku ze sady: zhruba polovinu vtlačte do kloubu (mezi kuličky a do drážek), zbytek dejte do manžety. Kloub nasaďte na drážkování a dorazte, až zacvakne pojistný kroužek.',
          'Slide the new boot (and small band) onto the shaft. Use **all** of the kit grease: press about half into the joint (between balls and into the tracks), put the rest into the boot. Fit the joint onto the splines and tap it home until the circlip snaps in.'
        ),
        notes: [{ level: 'warning', text: V('Zkontrolujte zatažením, že kloub drží – nezacvaknutý kloub se za jízdy vysune.', 'Pull to check the joint is held – a joint that did not lock can slide off while driving.') }]
      },
      {
        id: 'bands', anim: 'cv-boot.bands',
        title: V('Nasaďte manžetu a stáhněte pásky', 'Seat the boot and crimp the bands'),
        body: V(
          'Manžetu usaďte do drážek na kloubu i na poloose, nesmí být zkroucená. Šroubovákem nadzvedněte okraj a vypusťte vzduch. Pásky stáhněte **kleštěmi na pásky** – ucho pásky pevně zmáčkněte.',
          'Seat the boot in the grooves on the joint and the shaft, not twisted. Lift the edge with a screwdriver to let the air out. Crimp the bands with **band pliers** – squeeze the ear firmly.'
        ),
        notes: [{ level: 'caution', text: V('Volná páska = manžeta se protočí a tuk vyletí.', 'A loose band = the boot spins and the grease is flung out.') }]
      },
      {
        id: 'refit', anim: 'cv-boot.refit',
        title: V('Montáž zpět a utažení', 'Refit and tighten'),
        body: V(
          '1. Vnitřní kloub zasuňte do převodovky (nový pojistný kroužek / těsnění), doplňte olej.\n2. Poloosu provlékněte nábojem, spojte kulový čep **novou maticí**.\n3. Našroubujte **novou matici poloosy** jen lehce.\n4. Kolo nasaďte, vůz spusťte – **na zemi** dotáhněte matici poloosy předepsaným momentem a zajistěte ji (je-li předepsáno).',
          '1. Insert the inner joint into the gearbox (new circlip / seal), top up the oil.\n2. Feed the shaft through the hub, reconnect the ball joint with a **new nut**.\n3. Fit a **new axle nut** only snug.\n4. Fit the wheel, lower the car – **on the ground** torque the axle nut to spec and lock/stake it (if specified).'
        ),
        specs: [{ label: V('Matice poloosy', 'Axle nut'), value: V('dle příručky (často moment + úhel)', 'per manual (often torque + angle)'), verify: true }],
        notes: [{ level: 'danger', text: V('Nedotažená matice poloosy zničí ložisko kola a může vést k odpadnutí kola.', 'An under-torqued axle nut destroys the wheel bearing and can lead to the wheel coming off.') }]
      },
      {
        id: 'test', anim: 'cv-boot.test',
        title: V('Zkušební jízda', 'Test drive'),
        body: V('Pomalu kroužit v plném rejdu oběma směry, pak normální jízda. Žádné cvakání, vibrace ani tuk na manžetě. Po 50 km dotažení zkontrolovat.', 'Drive slow circles on full lock both ways, then normal driving. No clicking, vibration or grease on the boot. Re-check torques after 50 km.'),
        notes: [{ level: 'info', text: V('Pokud jste rozpojovali tyč řízení, nechte zkontrolovat geometrii.', 'If you disconnected the tie rod, have the alignment checked.') }]
      }
    ],
    vehicles: {
      'mb-cl500-c216': {
        status: 'pro',
        title: V('Manžety a klouby zadních poloos (zadní pohon)', 'Rear driveshaft boots & joints (RWD)'),
        intro: V(
          'CL 500 má **pohon zadních kol** – přední kola nemají poloosy. Homokinetické klouby a manžety jsou na **zadních poloosách** mezi diferenciálem a nábojem. Princip výměny je stejný, ale přístup a způsob uchycení se liší – postupujte podle WIS.',
          'The CL 500 is **rear-wheel drive** – the front wheels have no driveshafts. The CV joints and boots are on the **rear driveshafts** between the differential and the hub. The principle is the same, but access and fixing differ – follow WIS.'
        ),
        specs: [
          { label: V('Poloosy', 'Driveshafts'), value: V('jen vzadu (víceprvková náprava)', 'rear only (multi-link axle)'), verify: true },
          { label: V('Matice poloosy', 'Axle nut'), value: V('dle WIS', 'per WIS'), verify: true }
        ],
        notes: [
          { level: 'danger', text: V('**ABC podvozek:** pod vůz jen na stojanech pod zvedacími body.', '**ABC suspension:** only under the car on stands under the jacking points.') },
          { level: 'info', text: V('Příznaky jsou jiné než u předního pohonu: cvakání při rozjezdu a změně zatížení, ne v rejdu.', 'Symptoms differ from FWD: clicking when pulling away and on load changes, not on steering lock.') }
        ],
        steps: {
          symptoms: { body: V('U zadního pohonu se vadný kloub ozývá **cvakáním při rozjezdu, přeřazení D/R a změně plynu**, ne v rejdu. Tuk bývá rozstříknutý kolem zadní nápravy.', 'On RWD a failing joint shows as **clicking when pulling away, shifting D/R and on throttle changes**, not on steering lock. Grease is sprayed around the rear axle.') },
          separate: { body: V('Na zadní nápravě se poloosa uvolňuje z náboje a od příruby diferenciálu – rozpojování čepů řízení odpadá. Konkrétní postup a šrouby dle WIS.', 'On the rear axle the shaft is released from the hub and the differential flange – no steering joints to separate. Exact procedure and bolts per WIS.'), notes: [{ level: 'info', text: V('Postup ověřte ve WIS.', 'Verify the procedure in WIS.'), verify: true }] }
        }
      },
      'volvo-xc60-b4': {
        status: 'pro',
        specs: [
          { label: V('Poloosy', 'Driveshafts'), value: V('vpředu i vzadu (AWD)', 'front and rear (AWD)') },
          { label: V('Matice poloosy', 'Axle nut'), value: V('dle VIDA', 'per VIDA'), verify: true }
        ],
        notes: [
          { level: 'danger', text: V('**Vzduchové odpružení:** před zvedáním vypnout regulaci výšky (režim zvedání).', '**Air suspension:** switch off level control (jacking mode) before lifting.'), verify: true },
          { level: 'info', text: V('Vnitřní pravý kloub vpředu vede přes mezihřídel / úhlový převod (PTU) – postup a těsnění dle VIDA.', 'The front right inner joint goes via an intermediate shaft / angle gear (PTU) – procedure and seals per VIDA.'), verify: true },
          { level: 'warning', text: V('Vozy se vzduchovým podvozkem mají u kola i vedení vzduchu a snímač výšky – nepoškodit.', 'Cars with air suspension also have an air line and a height sensor at the wheel – do not damage them.') }
        ]
      },
      'skoda-octavia-rs-tdi': {
        status: 'caution',
        specs: [
          { label: V('Šroub poloosy', 'Axle bolt'), value: V('12hranný šroub, jednorázový, moment + úhel dle ELSA', '12-point bolt, single use, torque + angle per ELSA'), verify: true },
          { label: V('Vnitřní kloub', 'Inner joint'), value: V('přírubový, šrouby s vnitřním mnohozubem (ověřit)', 'flange type, triple-square bolts (verify)'), verify: true }
        ],
        notes: [{ level: 'info', text: V('U VW koncernu poloosu drží v náboji **šroub**, ne matice – vždy nový.', 'On VW Group cars the shaft is held in the hub by a **bolt**, not a nut – always new.'), verify: true }],
        steps: {
          axlenut: { title: V('Povolte šroub poloosy – kolo na zemi', 'Loosen the axle bolt – wheel on the ground') }
        }
      },
      'toyota-gr-yaris': {
        status: 'pro',
        specs: [
          { label: V('Poloosy', 'Driveshafts'), value: V('vpředu i vzadu (GR-FOUR)', 'front and rear (GR-FOUR)') },
          { label: V('Matice poloosy', 'Axle nut'), value: V('zapěchovaná, vždy nová – dle TIS', 'staked, always new – per TIS'), verify: true }
        ],
        notes: [
          { level: 'warning', text: V('Při okruhovém provozu kontrolujte manžety po každé akci – vysoké teploty od brzd je rychle stárnou.', 'With track use inspect the boots after every event – brake heat ages them quickly.') },
          { level: 'info', text: V('Zadní poloosy vedou z diferenciálu se spojkou – postup dle TIS.', 'Rear shafts come from the differential with the coupling – procedure per TIS.'), verify: true }
        ]
      },
      'citroen-jumper-22hdi': {
        status: 'pro',
        specs: [
          { label: V('Matice poloosy', 'Axle nut'), value: V('dle příručky (velmi vysoký moment)', 'per manual (very high torque)'), verify: true },
          { label: V('Poloosy', 'Driveshafts'), value: V('vpředu (FWD), těžké – ověřit mezihřídel', 'front (FWD), heavy – verify intermediate shaft'), verify: true }
        ],
        notes: [
          { level: 'danger', text: V('**Těžká dodávka:** hever a stojany min. 3 t, náklad vyložit.', '**Heavy van:** jack and stands rated at least 3 t, unload the cargo.') },
          { level: 'warning', text: V('Poloosy jsou těžké a matice velmi utažené – použijte dlouhou páku a pomocníka.', 'The shafts are heavy and the nut very tight – use a long bar and a helper.') }
        ],
        steps: { lift: { notes: [{ level: 'danger', text: V('Hever a každý stojan s nosností min. 3 t.', 'Jack and every stand rated at least 3 t.') }] } }
      }
    }
  });
})(window.STU);
