/* Tutorial: Wheel bearing diagnosis & replacement. */
(function (S) {
  'use strict';
  var V = function (cs, en) { return { cs: cs, en: en }; };

  S.registerTutorial({
    id: 'wheel-bearing',
    level: 2,
    thumb: 'wheel-bearing.types',
    time: V('2–4 hod. na kolo', '2–4 h per wheel'),
    title: V('Výměna ložiska kola', 'Wheel bearing replacement'),
    summary: V('Hučení podle rychlosti, vůle, typy ložisek (náboj / lisované), matice hnací hřídele, kroužek ABS.', 'Speed-dependent hum, play, bearing types (hub unit / pressed), drive-shaft nut, ABS ring.'),
    intro: V(
      'Vadné ložisko kola **hučí** – zvuk sílí s rychlostí a mění se v zatáčkách. Zanedbané ložisko se může zadřít nebo kolo získá vůli.\n\nExistují dva typy: **náboj s ložiskem** (šroubovaný – výměna je relativně snadná) a **ložisko lisované do těhlice** (potřebujete lis nebo speciální přípravek). Typ zjistěte podle VIN dřív, než začnete.',
      'A failing wheel bearing **hums** – the noise grows with speed and changes in bends. A neglected bearing can seize or the wheel develops play.\n\nThere are two types: a **hub unit** (bolted – fairly easy to replace) and a **bearing pressed into the knuckle** (needs a press or a special tool). Find out which type you have by VIN before you start.'
    ),
    safety: [
      { level: 'danger', text: V('Matice hnací hřídele má **obrovský utahovací moment**. Povolujte ji na zemi (kolo nasazené, pomocník brzdí) – nikdy ne na voze, který stojí jen na heveru nebo na stojanech.', 'The drive-shaft nut has a **huge torque**. Break it loose on the ground (wheel on, helper braking) – never with the car on a jack or on stands.') },
      { level: 'danger', text: V('Vůz na stojanech podle návodu **„Bezpečné zvednutí vozu“**. Při lisování / stahování působí velké síly – vůz nesmí na stojanech „pracovat“.', 'Car on stands per **"Safely lifting the car"**. Pressing / pulling generates big forces – the car must not move on its stands.') },
      { level: 'warning', text: V('Brzdový třmen nikdy nevisí na hadici – zavěsit na drát. Brzdový prach neofukovat.', 'Never let the caliper hang on its hose – hang it on wire. Do not blow brake dust.') },
      { level: 'warning', text: V('Lis a stahováky: brýle, rukavice, díly zajištěné. Lisovaný díl se může vymrštit.', 'Press and pullers: glasses, gloves, parts secured. A pressed part can shoot out.') },
      { level: 'caution', text: V('Matice hnací hřídele a šrouby náboje bývají **na jedno použití**. Vždy nové, momenty (+ úhel) přesně dle příručky.', 'The drive-shaft nut and hub bolts are often **single-use**. Always new, torques (+ angle) exactly per manual.') },
      { level: 'caution', text: V('Magnetický kroužek ABS na ložisku chraňte před poškrábáním a magnety. Musí směřovat ke snímači.', 'Protect the ABS magnetic ring on the bearing from scratches and magnets. It must face the sensor.') }
    ],
    tools: [
      V('Vše z návodu „Bezpečné zvednutí vozu“', 'Everything from "Safely lifting the car"'),
      V('Dlouhá páka + hlavice na matici hnací hřídele', 'Long breaker bar + socket for the drive-shaft nut'),
      V('Momentový klíč s velkým rozsahem (+ úhloměr)', 'High-range torque wrench (+ angle gauge)'),
      V('Stahovák náboje / ložiska, případně hydraulický lis', 'Hub / bearing puller, or a hydraulic press'),
      V('Sada trnů na lisování ložisek', 'Bearing driver set'),
      V('Drát na zavěšení třmenu, odrezovač, drátěný kartáč', 'Wire to hang the caliper, penetrating oil, wire brush'),
      V('Mechanický stetoskop (diagnostika)', 'Mechanic\'s stethoscope (diagnosis)')
    ],
    parts: [
      V('Ložisko / náboj s ložiskem dle VIN', 'Bearing / hub unit by VIN'),
      V('Nová matice hnací hřídele a šrouby náboje (pokud jsou na jedno použití)', 'New drive-shaft nut and hub bolts (if single-use)'),
      V('Pojistný kroužek (u lisovaného ložiska)', 'Circlip (for a pressed bearing)')
    ],
    finalChecks: [
      V('Matice hnací hřídele dotažena (+ úhel) a pojištěná', 'Drive-shaft nut torqued (+ angle) and locked'),
      V('Snímač ABS zpět, kabel uchycený, bez kontrolky ABS/ESP', 'ABS sensor refitted, wire clipped, no ABS/ESP light'),
      V('Brzdový pedál tvrdý před rozjezdem', 'Brake pedal firm before driving off'),
      V('Zkušební jízda: hučení zmizelo', 'Test drive: hum gone'),
      V('Po 50 km kontrola matice a šroubů kola', 'Re-check the nut and wheel bolts after 50 km')
    ],
    steps: [
      {
        id: 'hum', anim: 'wheel-bearing.hum',
        title: V('Rozpoznejte hučení ložiska', 'Recognise bearing hum'),
        body: V('Hučení nebo „letadlo“, které **sílí s rychlostí** (ne s otáčkami motoru). V levé zatáčce se zatíží pravá kola a naopak – pokud hluk zesílí v levotočivé zatáčce, podezřelé je spíše **pravé** ložisko.', 'A hum or "aeroplane" noise that **grows with road speed** (not engine rpm). A left bend loads the right wheels and vice versa – if the noise gets louder in a left-hand bend, suspect the **right** bearing.'),
        notes: [{ level: 'info', text: V('Podobně zní i nerovnoměrně ojeté pneumatiky – nejdřív je zkontrolujte (návod Pneumatiky).', 'Unevenly worn tyres sound similar – check them first (Tyres tutorial).') }]
      },
      {
        id: 'types', anim: 'wheel-bearing.types',
        title: V('Jaký typ ložiska máte', 'Which bearing type you have'),
        body: V('**Náboj s ložiskem:** přišroubovaný ke těhlici 3–4 šrouby – vyměníte celou jednotku.\n\n**Lisované ložisko:** zalisované v těhlici, pojištěné pojistným kroužkem – těhlice obvykle musí ven a na lis.', '**Hub unit:** bolted to the knuckle with 3–4 bolts – you swap the whole unit.\n\n**Pressed bearing:** pressed into the knuckle, held by a circlip – the knuckle usually has to come off and go on a press.'),
        notes: [{ level: 'tip', text: V('Nemáte lis? Lisované ložisko si nechte zalisovat v dílně – donesete jen těhlici.', 'No press? Have a pressed bearing fitted at a workshop – take just the knuckle.') }]
      },
      {
        id: 'axleNut', anim: 'wheel-bearing.axleNut',
        title: V('Povolte matici hnací hřídele – na zemi', 'Loosen the drive-shaft nut – on the ground'),
        body: V('U poháněného kola: sundejte krytku, pomocník sešlápne brzdu (nebo zařazená rychlost) a matici povolte dlouhou pákou. Nevyšroubujte ji úplně.', 'On a driven wheel: remove the cap, have a helper press the brake (or gear engaged) and break the nut loose with a long bar. Do not remove it fully.'),
        notes: [
          { level: 'danger', text: V('Nikdy nepovolovat s vozem na heveru nebo stojanech – vůz se může shodit.', 'Never break it loose with the car on a jack or stands – the car can fall.') },
          { level: 'info', text: V('Nepoháněné kolo matici hnací hřídele nemá – krok přeskočte.', 'A non-driven wheel has no drive-shaft nut – skip this step.') }
        ]
      },
      {
        id: 'lift', anim: 'wheel-bearing.lift',
        title: V('Zvedněte vůz a sundejte kolo', 'Lift the car and remove the wheel'),
        body: V('Zvedněte vůz podle návodu **„Bezpečné zvednutí vozu“** a sundejte kolo.', 'Lift the car per **"Safely lifting the car"** and remove the wheel.')
      },
      {
        id: 'play', anim: 'wheel-bearing.play',
        title: V('Potvrďte vadné ložisko', 'Confirm the faulty bearing'),
        body: V('Kolo ve visu: kývejte na 12/6 hodinách – vůle, která **zmizí při sešlápnuté brzdě**, je ložisko. Protočte kolo rukou: drhnutí, drnčení nebo hrubý chod = vadné ložisko.', 'Wheel hanging: rock at 12/6 o\'clock – play that **disappears with the brake pressed** is the bearing. Spin the wheel by hand: roughness, grinding or rumble = faulty bearing.'),
        notes: [{ level: 'tip', text: V('Stetoskop na těhlici a protáčení kolem prozradí, která strana hučí.', 'A stethoscope on the knuckle while spinning the wheel reveals which side hums.') }]
      },
      {
        id: 'brakeOff', anim: 'wheel-bearing.brakeOff',
        title: V('Sundejte třmen a kotouč', 'Remove the caliper and disc'),
        body: V('Třmen s držákem sundejte podle návodu **„Brzdy“** a zavěste na drát. Sundejte brzdový kotouč.', 'Remove the caliper with carrier per the **"Brakes"** tutorial and hang it on wire. Remove the brake disc.'),
        notes: [{ level: 'danger', text: V('Hadice nesmí být napnutá ani zkroucená.', 'The hose must not be stretched or twisted.') }]
      },
      {
        id: 'abs', anim: 'wheel-bearing.abs',
        title: V('Vyjměte snímač ABS', 'Remove the ABS sensor'),
        body: V('Vyšroubujte snímač ABS a opatrně ho vytáhněte (zapečený snímač kroutivým pohybem, odrezovač). Kroužek kodéru na ložisku chraňte před nečistotou a magnety.', 'Unbolt the ABS sensor and pull it out carefully (a seized sensor with a twisting motion, penetrating oil). Keep the encoder ring on the bearing away from dirt and magnets.'),
        notes: [{ level: 'warning', text: V('Snímač se snadno zlomí – vyjmout dřív, než začnete tlouct nebo lisovat.', 'The sensor breaks easily – remove it before any hammering or pressing.') }]
      },
      {
        id: 'remove', anim: 'wheel-bearing.remove',
        title: V('Vyjměte ložisko / náboj', 'Remove the bearing / hub'),
        body: V('**Náboj s ložiskem:** vyšroubujte šrouby zezadu a jednotku stáhněte stahovákem (rez!). **Lisované ložisko:** vyjměte hnací hřídel z náboje, těhlici sundejte, vylisujte náboj a pak ložisko (po vyjmutí pojistného kroužku).', '**Hub unit:** remove the bolts from behind and pull the unit off with a puller (rust!). **Pressed bearing:** push the drive shaft out of the hub, remove the knuckle, press out the hub and then the bearing (after removing the circlip).'),
        notes: [{ level: 'caution', text: V('Na ložisko netlučte kladivem – poškodíte těhlici a dosedací plochy.', 'Do not hammer on the bearing – you damage the knuckle and seating faces.') }]
      },
      {
        id: 'press', anim: 'wheel-bearing.press',
        title: V('Nové ložisko: lisovat správně', 'New bearing: press it correctly'),
        body: V('Lisované ložisko tlačte **jen přes vnější kroužek**, rovně a plynule až na doraz, pak pojistný kroužek. Náboj do ložiska lisujte s podepřeným vnitřním kroužkem. Strana s kodérem ABS musí směřovat ke snímači.', 'Press a pressed bearing **only via the outer race**, straight and smoothly fully home, then the circlip. Press the hub into the bearing with the inner race supported. The ABS encoder side must face the sensor.'),
        notes: [{ level: 'danger', text: V('Lisování přes vnitřní kroužek / kuličky ložisko zničí hned při montáži.', 'Pressing via the inner race / balls ruins the bearing during fitting.') }]
      },
      {
        id: 'torque', anim: 'wheel-bearing.torque',
        title: V('Montáž a dotažení matice hnací hřídele', 'Refit and torque the drive-shaft nut'),
        body: V('Složte vše v opačném pořadí (šrouby náboje momentem, brzdy, snímač ABS). **Novou** matici hnací hřídele dotáhněte předepsaným momentem a úhlem – často až s vozem na kolech. Pojistěte ji, pokud to výrobce předepisuje.', 'Reassemble in reverse (hub bolts torqued, brakes, ABS sensor). Torque the **new** drive-shaft nut to spec plus angle – often with the car on its wheels. Lock it if the maker specifies.'),
        specs: [{ label: V('Matice hnací hřídele', 'Drive-shaft nut'), value: V('dle příručky (moment + úhel)', 'per manual (torque + angle)'), verify: true }],
        notes: [{ level: 'warning', text: V('Před rozjezdem několikrát sešlápněte brzdu, dokud není pedál tvrdý.', 'Pump the brake pedal before driving until it is firm.') }]
      },
      {
        id: 'test', anim: 'wheel-bearing.test',
        title: V('Zkušební jízda', 'Test drive'),
        body: V('Jeďte opatrně: hučení musí zmizet, kontrolky ABS/ESP nesvítí. Po 50 km zkontrolujte matici a šrouby kol.', 'Drive carefully: the hum must be gone, no ABS/ESP lights. Re-check the nut and wheel bolts after 50 km.')
      }
    ],
    vehicles: {
      'mb-cl500-c216': {
        status: 'caution',
        specs: [
          { label: V('Poháněná náprava', 'Driven axle'), value: V('Zadní (RWD) – přední ložiska bez hnací hřídele', 'Rear (RWD) – front bearings without a drive shaft') },
          { label: V('Typ ložisek', 'Bearing type'), value: V('ověřit ve WIS podle nápravy', 'verify in WIS per axle'), verify: true }
        ],
        notes: [
          { level: 'danger', text: V('ABC: zvedat jen pod zvedací body na stojany, neměnit výšku vozu.', 'ABC: lift only under the jacking points onto stands, do not change the ride height.') },
          { level: 'info', text: V('Přední náprava nemá matici hnací hřídele – krok s maticí platí jen pro zadní kola.', 'The front axle has no drive-shaft nut – the nut step applies only to the rear wheels.') }
        ]
      },
      'volvo-xc60-b4': {
        status: 'caution',
        specs: [
          { label: V('Poháněné nápravy', 'Driven axles'), value: V('Přední i zadní (AWD)', 'Front and rear (AWD)') },
          { label: V('Typ ložisek', 'Bearing type'), value: V('Náboj s ložiskem – ověřit ve VIDA', 'Hub unit – verify in VIDA'), verify: true }
        ],
        notes: [{ level: 'danger', text: V('Vzduchový podvozek: před zvednutím vypnout regulaci výšky (režim zvedání).', 'Air suspension: switch off level control (jacking mode) before lifting.'), verify: true }]
      },
      'skoda-octavia-rs-tdi': {
        status: 'ok',
        specs: [
          { label: V('Poháněná náprava', 'Driven axle'), value: V('Přední (FWD)', 'Front (FWD)') },
          { label: V('Typ předních ložisek', 'Front bearing type'), value: V('Přišroubovaná jednotka s nábojem – ověřit', 'Bolted hub unit – verify'), verify: true },
          { label: V('Matice / šroub hnací hřídele', 'Drive-shaft nut / bolt'), value: V('dle ELSA (nový, moment + úhel)', 'per ELSA (new, torque + angle)'), verify: true }
        ]
      },
      'toyota-gr-yaris': {
        status: 'caution',
        specs: [
          { label: V('Poháněné nápravy', 'Driven axles'), value: V('Přední i zadní (GR-FOUR)', 'Front and rear (GR-FOUR)') },
          { label: V('Typ ložisek', 'Bearing type'), value: V('ověřit v TIS', 'verify in TIS'), verify: true }
        ],
        notes: [{ level: 'info', text: V('Okruhový provoz zatěžuje ložiska teplem z brzd – hučení po okruhu brát vážně.', 'Track use loads bearings with brake heat – take hum after a track day seriously.') }]
      },
      'citroen-jumper-22hdi': {
        status: 'caution',
        specs: [
          { label: V('Poháněná náprava', 'Driven axle'), value: V('Přední (FWD)', 'Front (FWD)') },
          { label: V('Typ předních ložisek', 'Front bearing type'), value: V('ověřit podle VIN (verze 30/33/35/40 Heavy se liší)', 'verify by VIN (30/33/35/40 Heavy versions differ)'), verify: true },
          { label: V('Matice hnací hřídele', 'Drive-shaft nut'), value: V('dle příručky PSA/Fiat (velmi vysoký moment)', 'per PSA/Fiat manual (very high torque)'), verify: true }
        ],
        notes: [{ level: 'danger', text: V('Hever a stojany min. 3 t, náklad vyložit. Díly jsou těžké.', 'Jack and stands rated at least 3 t, unload the cargo. Parts are heavy.') }]
      }
    }
  });
})(window.STU);
