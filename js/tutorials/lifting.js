/* Tutorial: Safe lifting & wheel removal – the foundation for most other jobs. */
(function (S) {
  'use strict';
  var V = function (cs, en) { return { cs: cs, en: en }; };

  S.registerTutorial({
    id: 'lifting',
    level: 1,
    thumb: 'lift.stands',
    time: V('20–30 min', '20–30 min'),
    title: V('Bezpečné zvednutí vozu a sundání kola', 'Safely lifting the car & removing a wheel'),
    summary: V('Základ pro výměnu brzd, oleje i podvozkové práce. Hever, stojany, momenty kol.', 'The foundation for brakes, oil and suspension jobs. Jack, stands, wheel torque.'),
    intro: V(
      'Tohle je **nejdůležitější návod celé aplikace**. Většina vážných úrazů v domácích dílnách vzniká pádem vozu z heveru. Naučte se tento postup nazpaměť – použijete ho u výměny brzd, oleje, tlumičů i kol.',
      'This is **the most important tutorial in the app**. Most serious injuries in home garages are caused by a car falling off a jack. Learn this procedure by heart – you will use it for brakes, oil, shocks and wheels.'
    ),
    safety: [
      { level: 'danger', text: V('**Nikdy nelezte pod vůz, který stojí jen na heveru.** Hever slouží jen ke zvedání. Vždy použijte podpěrné stojany (s nosností min. 2 t každý) na pevném, rovném podkladu.', '**Never get under a car supported only by a jack.** A jack is for lifting only. Always use axle stands (rated at least 2 t each) on solid, level ground.') },
      { level: 'danger', text: V('Nezvedejte vůz na štěrku, trávě, svahu ani na asfaltu rozměklém sluncem – stojany se mohou propadnout nebo podjet.', 'Never lift on gravel, grass, a slope or sun-softened asphalt – stands can sink or slip.') },
      { level: 'warning', text: V('Nepoužívejte cihly, tvárnice, dřevěné špalky ani nouzový zvedák z kufru pro práci pod vozem. Cihly praskají bez varování.', 'Do not use bricks, blocks, wooden pieces or the emergency jack from the boot for working under the car. Bricks crack without warning.') },
      { level: 'warning', text: V('Při zvedání nikdo nesedí ve voze a v okolí nejsou děti ani zvířata.', 'Nobody sits in the car while lifting and no children or animals are around.') },
      { level: 'caution', text: V('Ochranné brýle a rukavice. Kolo osobního auta váží 15–30 kg – zvedejte z nohou, ne ze zad.', 'Safety glasses and gloves. A car wheel weighs 15–30 kg – lift with your legs, not your back.') }
    ],
    tools: [
      V('Pojízdný hever (nosnost min. 2 t)', 'Trolley jack (rated at least 2 t)'),
      V('2× podpěrný stojan (min. 2 t každý)', '2× axle stands (at least 2 t each)'),
      V('2× zakládací klín', '2× wheel chocks'),
      V('Křížový klíč nebo prodloužená ráčna + hlavice na šrouby kol', 'Wheel brace or breaker bar + socket for wheel bolts'),
      V('Momentový klíč (rozsah cca 40–200 Nm)', 'Torque wrench (range approx. 40–200 Nm)'),
      V('Adaptér bezpečnostních šroubů kol (je-li)', 'Locking wheel bolt key (if fitted)'),
      V('Pryžová podložka na misku heveru', 'Rubber pad for the jack saddle'),
      V('Rukavice, ochranné brýle', 'Gloves, safety glasses')
    ],
    parts: [
      V('Nic – pouze kontrola stavu šroubů / matic kol', 'Nothing – only check the condition of wheel bolts / nuts')
    ],
    finalChecks: [
      V('Všechny šrouby kol dotaženy momentovým klíčem', 'All wheel bolts tightened with a torque wrench'),
      V('Stojany, hever a klíny odklizené', 'Stands, jack and chocks removed'),
      V('Po 50–100 km šrouby kol znovu dotáhnout momentem', 'Re-torque the wheel bolts after 50–100 km'),
      V('Tlak v pneumatikách zkontrolován', 'Tyre pressure checked')
    ],
    steps: [
      {
        id: 'park', anim: 'lift.park',
        title: V('Zaparkujte a zajistěte vůz', 'Park and secure the car'),
        body: V(
          '1. Postavte vůz na **rovný a pevný** povrch (beton, dlažba).\n2. Zatáhněte parkovací brzdu, automat dejte do **P**, manuál zařaďte **1. rychlost**.\n3. Vypněte motor, vytáhněte klíč (Keyless klíč odložte dál od vozu).\n4. Zakliňte kola **na protější nápravě**, než budete zvedat (zvedáte předek → klíny za zadní kola a naopak).',
          '1. Park on **level, solid** ground (concrete, paving).\n2. Apply the parking brake, put an automatic in **P**, a manual in **1st gear**.\n3. Switch the engine off and remove the key (keep a keyless key away from the car).\n4. Chock the wheels **on the opposite axle** before lifting (lifting the front → chocks behind the rear wheels and vice versa).'
        ),
        notes: [
          { level: 'warning', text: V('Parkovací brzda u většiny aut brzdí jen zadní kola. Při zvedání zadní nápravy proto klíny před a za přední kola jsou povinné.', 'On most cars the parking brake only holds the rear wheels. When lifting the rear axle, chocks in front of and behind the front wheels are mandatory.') },
          { level: 'tip', text: V('Zapněte výstražná světla, pokud pracujete u silnice.', 'Switch on the hazard lights if you work near a road.') }
        ]
      },
      {
        id: 'loosen', anim: 'lift.loosen',
        title: V('Povolte šrouby kola – ještě na zemi', 'Loosen the wheel bolts – still on the ground'),
        body: V(
          'Dokud kolo stojí na zemi, nemůže se protáčet. Povolte každý šroub **jen o půl otáčky** proti směru hodinových ručiček. Úplně je vyšroubujete až po zvednutí.\n\nPokud máte bezpečnostní šroub, nasaďte adaptér rovně a celou plochou – jinak ho zničíte.',
          'While the wheel is on the ground it cannot spin. Loosen each bolt **only half a turn** counter-clockwise. You remove them fully only after lifting.\n\nIf you have a locking bolt, fit the key straight and fully seated – otherwise you will destroy it.'
        ),
        notes: [
          { level: 'caution', text: V('Netlačte na klíč skokem nebo nohou s celou vahou – při sklouznutí hrozí zranění a poškození disku. Použijte delší páku.', 'Do not jump or stand on the wrench with your full weight – if it slips you can get hurt and damage the rim. Use a longer bar.') }
        ]
      },
      {
        id: 'points', anim: 'lift.points',
        title: V('Najděte správné zvedací body', 'Find the correct jacking points'),
        body: V(
          'Výrobce určuje **zvedací body** – zesílená místa na prahu (často označená zářezem, šipkou nebo trojúhelníkem) nebo body na nosníku. Jinde se karoserie promáčkne nebo vůz sklouzne.\n\nNa misku heveru dejte **pryžovou podložku**, aby nedošlo k poškození lemu prahu a ochrany proti korozi.',
          'The manufacturer defines **jacking points** – reinforced spots on the sill (often marked by a notch, arrow or triangle) or points on the subframe. Anywhere else the body dents or the car slips.\n\nPut a **rubber pad** on the jack saddle so you do not damage the sill seam and its corrosion protection.'
        ),
        notes: [
          { level: 'danger', text: V('Nikdy nezvedejte za olejovou vanu, převodovku, nárazník, ramena podvozku ani výfuk.', 'Never lift by the oil pan, gearbox, bumper, suspension arms or exhaust.') },
          { level: 'info', text: V('Přesná místa najdete v uživatelské příručce (kapitola výměna kola) nebo v dílenské příručce.', 'Exact locations are in the owner\'s manual (wheel change chapter) or the workshop manual.') }
        ]
      },
      {
        id: 'jack', anim: 'lift.jack',
        title: V('Zvedněte vůz heverem', 'Raise the car with the jack'),
        body: V(
          'Hever podsuňte tak, aby miska byla přesně pod zvedacím bodem. Zvedejte **pomalu**, první centimetry sledujte, jestli miska správně dosedla a nesklouzává.\n\nZvedněte jen tak vysoko, aby šly pod vůz zasunout stojany a kolo bylo ~3 cm nad zemí.',
          'Slide the jack in so the saddle is exactly under the jacking point. Lift **slowly** and watch the first centimetres to make sure the saddle is seated and not slipping.\n\nRaise only high enough to fit the stands and get the wheel ~3 cm off the ground.'
        ),
        notes: [
          { level: 'danger', text: V('Od tohoto okamžiku: **žádná část těla pod vozem**, dokud nestojí na stojanech.', 'From now on: **no body part under the car** until it rests on stands.') },
          { level: 'caution', text: V('Pojízdný hever se při zvedání posouvá – kolečka ho nechte volně jet, nebrzděte ho rukou.', 'A trolley jack rolls while lifting – let its wheels move freely, do not hold it in place.') }
        ]
      },
      {
        id: 'stands', anim: 'lift.stands',
        title: V('Podložte vůz stojany', 'Support the car on axle stands'),
        body: V(
          'Stojan dejte pod **pevný bod** vedle heveru (zesílený práh, nosník nápravy dle příručky). Nastavte výšku a zajistěte čep stojanu.\n\nPak hever **pomalu povolte**, aby vůz dosedl na stojan. Hever nechte lehce pod vozem jako druhou pojistku.',
          'Place the stand under a **solid point** next to the jack (reinforced sill, subframe as per manual). Set the height and lock the stand pin.\n\nThen **slowly release** the jack so the car settles on the stand. Leave the jack lightly in place as a second safeguard.'
        ),
        notes: [
          { level: 'danger', text: V('Stojan musí stát celou plochou nohou na rovném podkladu a čep musí být úplně zasunutý.', 'The stand must sit with all feet flat on level ground and its pin fully inserted.') },
          { level: 'tip', text: V('Při zvedání celé nápravy použijte dva stojany ve stejné výšce.', 'When lifting a whole axle use two stands at the same height.') }
        ]
      },
      {
        id: 'shake', anim: 'lift.shake',
        title: V('Test stability – zatřeste vozem', 'Stability test – shake the car'),
        body: V(
          'Než pod vůz sáhnete, **pořádně do něj zatlačte** z boku a zepředu. Vůz se nesmí pohnout, kývat ani vrzat.\n\nPokud se cokoli hne: vůz znovu nadzvedněte, stojan přestavte a test opakujte.',
          'Before reaching under the car, **push it firmly** from the side and front. It must not move, rock or creak.\n\nIf anything moves: raise the car again, reposition the stand and repeat the test.'
        ),
        notes: [
          { level: 'danger', text: V('Tento test nikdy nevynechávejte. Trvá 10 sekund a může vám zachránit život.', 'Never skip this test. It takes 10 seconds and can save your life.') }
        ]
      },
      {
        id: 'wheeloff', anim: 'lift.wheeloff',
        title: V('Sundejte kolo', 'Remove the wheel'),
        body: V(
          'Vyšroubujte šrouby do kříže, **horní šroub naposledy** – kolo pak nespadne. Kolo uchopte oběma rukama na 3 a 9 hodinách a stáhněte ho k sobě.\n\nKolo položte **naplocho pod práh** vedle stojanu – kdyby vůz spadl, dopadne na kolo, ne na vás.',
          'Remove the bolts in a star pattern, **the top bolt last** – the wheel will not drop. Grip the wheel with both hands at 3 and 9 o\'clock and pull it towards you.\n\nLay the wheel **flat under the sill** next to the stand – if the car falls, it lands on the wheel, not on you.'
        ),
        notes: [
          { level: 'caution', text: V('Přikipělé kolo uvolněte kopnutím do pneumatiky nebo gumovou palicí – nikdy netřeste vozem na stojanech.', 'Free a seized wheel by kicking the tyre or with a rubber mallet – never rock the car on its stands.') },
          { level: 'tip', text: V('Šrouby odkládejte do misky, ať se neztratí a nezašpiní závit.', 'Keep the bolts in a tray so they do not get lost or dirty.') }
        ]
      },
      {
        id: 'refit', anim: 'lift.lower',
        title: V('Nasaďte kolo a spusťte vůz', 'Refit the wheel and lower the car'),
        body: V(
          '1. Očistěte dosedací plochu náboje a disku (rez, nečistoty).\n2. Kolo nasaďte a **všechny šrouby zašroubujte rukou**, pak je lehce dotáhněte do kříže.\n3. Vůz heverem nadzvedněte, vyndejte stojan a **pomalu** spusťte na zem.',
          '1. Clean the hub and wheel contact surfaces (rust, dirt).\n2. Fit the wheel and **thread all bolts in by hand**, then snug them lightly in a star pattern.\n3. Raise the car slightly with the jack, remove the stand and lower **slowly** to the ground.'
        ),
        notes: [
          { level: 'warning', text: V('Šrouby kol nemažte olejem ani vazelínou (pokud to výrobce výslovně neuvádí) – změní se utahovací moment a šrouby se mohou povolit.', 'Do not oil or grease wheel bolts (unless the manufacturer explicitly says so) – it changes the torque and the bolts can come loose.') },
          { level: 'caution', text: V('Rázovým utahovákem šrouby nedotahujte na plno – přetáhnete je nebo zkřivíte brzdový kotouč.', 'Do not fully tighten with an impact gun – you will over-torque the bolts or warp the brake disc.') }
        ]
      },
      {
        id: 'torque', anim: 'lift.torque',
        title: V('Dotáhněte kolo momentovým klíčem', 'Torque the wheel bolts'),
        body: V(
          'Na zemi dotáhněte šrouby **do kříže momentovým klíčem** ve dvou krocích: nejdřív cca na polovinu momentu, pak na plný moment. Klíč táhněte plynule, dokud necvakne – pak už nepřitahujte.',
          'With the car on the ground, tighten the bolts **in a star pattern with a torque wrench** in two passes: first to about half the torque, then to full torque. Pull smoothly until the wrench clicks – then stop.'
        ),
        specs: [{ label: V('Utahovací moment', 'Torque'), value: V('dle příručky vozu', 'per vehicle manual') }],
        notes: [
          { level: 'warning', text: V('Po **50–100 km** šrouby znovu dotáhněte předepsaným momentem.', 'Re-torque the bolts to spec after **50–100 km**.') },
          { level: 'tip', text: V('Momentový klíč po práci vždy povolte na nejnižší hodnotu – pružina tak zůstane přesná.', 'Always wind the torque wrench down to its lowest setting after use – the spring stays accurate.') }
        ]
      }
    ],
    vehicles: {
      'mb-cl500-c216': {
        status: 'caution',
        specs: [
          { label: V('Šrouby kol', 'Wheel bolts'), value: V('M14 × 1,5, hlava 17 mm', 'M14 × 1.5, 17 mm head'), verify: true },
          { label: V('Utahovací moment kol', 'Wheel torque'), value: '150 Nm', verify: true },
          { label: V('Podvozek', 'Suspension'), value: V('ABC – hydraulické aktivní odpružení', 'ABC – hydraulic active suspension') }
        ],
        notes: [
          { level: 'danger', text: V('**ABC:** Vůz může po vypnutí motoru nebo otevření dveří sám měnit výšku. Nikdy nespoléhejte na hydrauliku podvozku. Pracujte jen na stojanech pod zvedacími body.', '**ABC:** The car can change ride height on its own after the engine is switched off or a door is opened. Never rely on the suspension hydraulics. Work only on stands under the jacking points.') },
          { level: 'warning', text: V('Kola 18–20" s pneumatikami váží i přes 25 kg. Zvedejte opatrně a s rovnými zády.', '18–20" wheels with tyres can weigh more than 25 kg. Lift carefully with a straight back.') }
        ],
        tools: [V('Hlavice 17 mm (šrouby kol Mercedes)', '17 mm socket (Mercedes wheel bolts)'), V('Středicí trn na šroub kola (usnadní nasazení těžkého kola)', 'Wheel hanger / alignment pin (makes fitting the heavy wheel easier)')],
        steps: {
          park: { notes: [{ level: 'warning', text: V('Před vypnutím motoru nechte vůz v **normální výšce** (nezvýšené). Pak vypněte motor, zavřete dveře a vyčkejte cca 1 min., než se systém ABC ustálí.', 'Before switching off, leave the car at **normal ride height** (not raised). Then switch off, close the doors and wait approx. 1 min for the ABC system to settle.'), verify: true }] },
          points: { body: V('CL 500 má 4 zvedací body v prahu, zakryté krytkami v plastovém prahovém obložení (za předním / před zadním kolem). Krytku vyjměte a použijte adaptér na misku heveru, aby nedošlo k poškození obložení.', 'The CL 500 has 4 jacking points in the sills, hidden under covers in the plastic side skirts (behind the front / in front of the rear wheel). Remove the cover and use a jack adapter so you do not damage the skirt.'), notes: [{ level: 'caution', text: V('Přesný tvar adaptéru a umístění ověřte – prahové obložení se snadno zlomí.', 'Verify the exact adapter shape and position – the side skirts break easily.'), verify: true }] },
          wheeloff: { notes: [{ level: 'tip', text: V('Než vyšroubujete poslední šroub, zašroubujte do jedné díry středicí trn – těžké kolo pak jen sklouznete.', 'Before removing the last bolt, screw an alignment pin into one hole – you can then slide the heavy wheel off.') }] },
          torque: { specs: [{ label: V('Utahovací moment', 'Torque'), value: '150 Nm', verify: true }] }
        }
      },
      'volvo-xc60-b4': {
        status: 'ok',
        specs: [
          { label: V('Šrouby kol', 'Wheel bolts'), value: V('M14 × 1,5, hlava 19 mm', 'M14 × 1.5, 19 mm head'), verify: true },
          { label: V('Utahovací moment kol', 'Wheel torque'), value: '140 Nm', verify: true },
          { label: V('Parkovací brzda', 'Parking brake'), value: V('Elektrická – brzdí zadní kola', 'Electric – holds the rear wheels') }
        ],
        notes: [
          { level: 'warning', text: V('Pokud má váš XC60 volitelné **vzduchové odpružení**, před zvedáním aktivujte režim pro zvedání / vypněte regulaci výšky (dle příručky) – jinak se vůz může sám spustit.', 'If your XC60 has the optional **air suspension**, activate jacking mode / switch off level control before lifting (per manual) – otherwise the car can lower itself.'), verify: true },
          { level: 'info', text: V('Funkce Auto-hold a automatická parkovací brzda můžou při práci pípat a samy se aktivovat – to je normální.', 'Auto-hold and the automatic parking brake may beep and engage on their own while you work – that is normal.') }
        ],
        tools: [V('Hlavice 19 mm', '19 mm socket'), V('Adaptér bezpečnostního šroubu (v sadě nářadí ve voze)', 'Locking bolt key (in the car tool kit)')],
        steps: {
          park: { notes: [{ level: 'warning', text: V('EPB drží jen zadní kola. Při zvedání zadní nápravy zakliňte přední kola z obou stran.', 'The EPB holds the rear wheels only. When lifting the rear axle, chock the front wheels on both sides.') }] },
          torque: { specs: [{ label: V('Utahovací moment', 'Torque'), value: '140 Nm', verify: true }] }
        }
      },
      'skoda-octavia-rs-tdi': {
        status: 'ok',
        specs: [
          { label: V('Šrouby kol', 'Wheel bolts'), value: V('M14 × 1,5, hlava 17 mm', 'M14 × 1.5, 17 mm head') },
          { label: V('Utahovací moment kol', 'Wheel torque'), value: '120 Nm' }
        ],
        notes: [
          { level: 'info', text: V('Zvedací body jsou na spodním lemu prahu, označené zářezy / prolisy cca 20 cm za předním a před zadním podběhem.', 'The jacking points are on the lower sill seam, marked with notches approx. 20 cm behind the front and in front of the rear wheel arch.'), verify: true }
        ],
        tools: [V('Hlavice 17 mm', '17 mm socket')],
        steps: {
          torque: { specs: [{ label: V('Utahovací moment', 'Torque'), value: '120 Nm' }] }
        }
      },
      'toyota-gr-yaris': {
        status: 'ok',
        specs: [
          { label: V('Matice kol', 'Wheel nuts'), value: V('hlavice 21 mm', '21 mm socket'), verify: true },
          { label: V('Utahovací moment kol', 'Wheel torque'), value: '103 Nm', verify: true }
        ],
        notes: [
          { level: 'warning', text: V('Vůz je nízký a má spoilery. Použijte **nízkoprofilový hever** a podsunujte ho z boku. Při zvedání zepředu snadno poškodíte nárazník.', 'The car is low and has spoilers. Use a **low-profile jack** and slide it in from the side. Lifting from the front easily damages the bumper.') }
        ],
        tools: [V('Nízkoprofilový hever', 'Low-profile trolley jack'), V('Hlavice 21 mm (tenkostěnná, aby nepoškodila disk)', '21 mm thin-wall socket (to protect the rim)')],
        steps: {
          torque: { specs: [{ label: V('Utahovací moment', 'Torque'), value: '103 Nm', verify: true }] }
        }
      }
    }
  });
})(window.STU);
