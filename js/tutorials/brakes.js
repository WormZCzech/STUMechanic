/* Tutorial: Brake pads & discs replacement. */
(function (S) {
  'use strict';
  var V = function (cs, en) { return { cs: cs, en: en }; };

  S.registerTutorial({
    id: 'brakes',
    level: 1,
    thumb: 'brake.overview',
    time: V('2–3 hod. na nápravu', '2–3 h per axle'),
    title: V('Výměna brzdových destiček a kotoučů', 'Replacing brake pads and discs'),
    summary: V('Destičky a kotouče na jedné nápravě – třmen, držák, náboj, píst, zajetí brzd.', 'Pads and discs on one axle – caliper, carrier, hub, piston, bedding in.'),
    intro: V(
      'Brzdy jsou **nejdůležitější bezpečnostní systém vozu**. Práce sama není složitá, ale každá chyba (nedotažený šroub, mastnota na kotouči, nenapumpovaný pedál) může mít fatální následky. Postupujte pomalu, krok za krokem, a **vždy měňte díly na obou stranách nápravy**.\n\nNávod popisuje nejčastější **plovoucí třmen**. Zvolte nahoře svůj vůz – postup se upraví (např. pevný 4pístkový třmen, elektrická parkovací brzda nebo zašroubovávací píst).',
      'Brakes are **the most important safety system of the car**. The job itself is not hard, but every mistake (an untorqued bolt, grease on the disc, a pedal not pumped up) can be fatal. Work slowly, step by step, and **always replace parts on both sides of an axle**.\n\nThe tutorial covers the most common **floating caliper**. Select your car at the top – the procedure adapts (e.g. fixed 4-piston caliper, electric parking brake or wind-back piston).'
    ),
    safety: [
      { level: 'danger', text: V('Vůz zvedejte jen podle návodu **„Bezpečné zvednutí vozu“** – vždy na stojanech, nikdy jen na heveru.', 'Lift the car only as described in **"Safely lifting the car"** – always on stands, never on a jack alone.') },
      { level: 'danger', text: V('**Brzdový prach je zdraví škodlivý** (u velmi starých vozů a neoriginálních dílů může obsahovat azbest). Nikdy ho neofukujte stlačeným vzduchem ani nezametejte nasucho. Použijte čistič brzd, vlhký hadr a respirátor FFP2/FFP3.', '**Brake dust is harmful** (on very old cars and non-original parts it may contain asbestos). Never blow it off with compressed air or sweep it dry. Use brake cleaner, a damp cloth and an FFP2/FFP3 mask.') },
      { level: 'danger', text: V('**Nikdy nevyjíždějte, dokud brzdový pedál není tvrdý.** Po výměně destiček první sešlápnutí propadne k podlaze.', '**Never drive off until the brake pedal is firm.** After a pad change the first press goes to the floor.') },
      { level: 'warning', text: V('**Brzdová kapalina leptá lak a je jedovatá.** Chraňte oči brýlemi, kapky na laku ihned omyjte vodou. Kapalinu nelijte do kanálu.', '**Brake fluid strips paint and is toxic.** Protect your eyes with glasses, rinse drops on paint with water at once. Never pour fluid down the drain.') },
      { level: 'warning', text: V('Na třecí plochy destiček a kotoučů se **nesmí dostat olej, tuk ani pasta**. Znečištěné destičky nelze vyčistit – musí se vyměnit.', '**No oil, grease or paste** may touch the friction surfaces of pads and discs. Contaminated pads cannot be cleaned – they must be replaced.') },
      { level: 'warning', text: V('Čistič brzd je hořlavý. Nepoužívejte ho u otevřeného ohně, na horké díly ani na lakované plasty.', 'Brake cleaner is flammable. Do not use it near open flames, on hot parts or on painted plastics.') },
      { level: 'caution', text: V('Destičky i kotouče se mění **vždy v páru na celé nápravě** (levá + pravá) a od stejného výrobce a typu.', 'Pads and discs are always replaced **in pairs across the whole axle** (left + right), same brand and type.') },
      { level: 'info', text: V('Tento návod nepopisuje odvzdušnění brzd. Pokud otevřete hydraulický okruh (hadice, odvzdušňovací ventil) nebo zjistíte únik, brzdy se musí odvzdušnit – pokud si nejste jisti, svěřte to dílně.', 'This tutorial does not cover bleeding. If you open the hydraulic circuit (hose, bleed nipple) or find a leak, the brakes must be bled – if unsure, leave it to a workshop.') }
    ],
    tools: [
      V('Vše z návodu „Bezpečné zvednutí vozu“ (hever, stojany, klíny)', 'Everything from "Safely lifting the car" (jack, stands, chocks)'),
      V('Ráčna, nástrčné hlavice, imbus / Torx bity, očkoplochý klíč na kontru', 'Ratchet, sockets, hex / Torx bits, combination spanner to counter-hold'),
      V('Prodloužená páka (šrouby držáku třmenu bývají velmi utažené)', 'Breaker bar (carrier bolts are usually very tight)'),
      V('Momentový klíč (rozsah cca 20–250 Nm)', 'Torque wrench (range approx. 20–250 Nm)'),
      V('Stlačovák pístů / svěrka (a rotační stlačovák pro zadní třmeny s ruční brzdou)', 'Piston press / clamp (and a wind-back tool for rear calipers with a handbrake)'),
      V('Drátěný kartáč, brusná houbička', 'Wire brush, abrasive pad'),
      V('Drát nebo háček na zavěšení třmenu', 'Wire or hook to hang the caliper'),
      V('Injekční stříkačka na odsátí kapaliny', 'Syringe to remove fluid'),
      V('Gumová palice', 'Rubber mallet'),
      V('Posuvné měřítko / mikrometr (tloušťka kotouče)', 'Calliper gauge / micrometer (disc thickness)'),
      V('Nitrilové rukavice, ochranné brýle, respirátor FFP2', 'Nitrile gloves, safety glasses, FFP2 mask')
    ],
    parts: [
      V('Brzdové kotouče – pár na nápravu', 'Brake discs – one pair per axle'),
      V('Brzdové destičky – sada na nápravu', 'Brake pads – one set per axle'),
      V('Montážní sada (spony, pružiny, krytky vodicích čepů)', 'Fitting kit (clips, springs, guide pin boots)'),
      V('Senzor opotřebení (pokud svítila kontrolka nebo je v sadě)', 'Wear sensor (if the warning light came on or it is in the kit)'),
      V('Nové šrouby držáku/třmenu, pokud je výrobce předepisuje jako jednorázové', 'New carrier/caliper bolts if the manufacturer specifies one-time bolts'),
      V('Čistič brzd (sprej)', 'Brake cleaner (spray)'),
      V('Montážní pasta na brzdy (keramická, bez mědi) a mazivo na vodicí čepy', 'Brake assembly paste (ceramic, copper-free) and guide pin grease'),
      V('Brzdová kapalina správné specifikace na doplnění', 'Brake fluid of the correct spec for topping up')
    ],
    finalChecks: [
      V('Brzdový pedál je vysoko a tvrdý (napumpováno PŘED rozjezdem)', 'Brake pedal is high and firm (pumped BEFORE moving)'),
      V('Hladina brzdové kapaliny mezi MIN a MAX, víčko zavřené', 'Brake fluid level between MIN and MAX, cap closed'),
      V('Všechny šrouby třmenů, držáků a kol dotažené momentem – na obou stranách', 'All caliper, carrier and wheel bolts torqued – on both sides'),
      V('Senzory opotřebení zapojené, kabely uchycené mimo kotouč', 'Wear sensors connected, wires clipped away from the disc'),
      V('Brzdové hadice nepřekroucené a nedotýkají se kola při plném rejdu', 'Brake hoses not twisted and not touching the wheel at full lock'),
      V('Žádný únik kapaliny u třmenů', 'No fluid leaks at the calipers'),
      V('Kontrolka brzd / ABS na palubní desce nesvítí', 'Brake / ABS warning lights are off'),
      V('Parkovací brzda drží', 'Parking brake holds'),
      V('Zkušební brzdění ve chůzi na bezpečném místě, pak zajetí brzd', 'Test braking at walking pace in a safe place, then bedding-in'),
      V('Po 50–100 km znovu dotáhnout kola momentem', 'Re-torque the wheels after 50–100 km')
    ],
    steps: [
      {
        id: 'prep', anim: 'brake.reservoir',
        title: V('Příprava: díly a brzdová kapalina', 'Preparation: parts and brake fluid'),
        body: V(
          '1. **Porovnejte nové díly** se specifikací vozu (průměr a tloušťka kotouče, tvar destiček, senzor). Díly objednávejte podle VIN.\n2. Otevřete kapotu a najděte **nádržku brzdové kapaliny**.\n3. Je-li hladina u **MAX**, odsajte stříkačkou trochu kapaliny. Při zatlačování pístů hladina stoupne a kapalina by přetekla na lak.\n4. Víčko nádržky opět zavřete.',
          '1. **Compare the new parts** with the car spec (disc diameter and thickness, pad shape, sensor). Order parts by VIN.\n2. Open the bonnet and find the **brake fluid reservoir**.\n3. If the level is at **MAX**, remove some fluid with a syringe. Pushing the pistons back raises the level and fluid would overflow onto the paint.\n4. Close the reservoir cap again.'
        ),
        notes: [
          { level: 'warning', text: V('Blatník pod nádržkou zakryjte hadrem. Brzdová kapalina naleptá lak během minut.', 'Cover the wing below the reservoir with a cloth. Brake fluid damages paint within minutes.') },
          { level: 'info', text: V('Brzdová kapalina pohlcuje vlhkost – měňte ji obvykle každé 2 roky. Odsátou kapalinu znovu nepoužívejte.', 'Brake fluid absorbs moisture – usually change it every 2 years. Never reuse fluid you removed.') }
        ]
      },
      {
        id: 'lift', anim: 'lift.stands',
        title: V('Zvedněte vůz a sundejte kola', 'Lift the car and remove the wheels'),
        body: V(
          'Postupujte přesně podle návodu **„Bezpečné zvednutí vozu a sundání kola“** (povolit šrouby na zemi, zvednout, stojany, test stability). Zvedněte **celou nápravu** a sundejte obě kola.\n\nPracujte vždy **na jedné straně** – druhá vám zůstane jako vzor, jak má vše vypadat.',
          'Follow the **"Safely lifting the car & removing a wheel"** tutorial exactly (loosen bolts on the ground, lift, stands, stability test). Raise the **whole axle** and remove both wheels.\n\nAlways work **on one side at a time** – the other side stays as a reference for how everything should look.'
        ),
        notes: [
          { level: 'danger', text: V('Žádná práce na brzdách, dokud vůz nestojí na stojanech a neprošel testem stability.', 'No brake work until the car is on stands and has passed the stability test.') },
          { level: 'tip', text: V('Než cokoli rozeberete, vyfoťte si brzdu telefonem z více úhlů (spony, pružiny, vedení kabelů).', 'Before taking anything apart, photograph the brake from several angles (clips, springs, cable routing).') }
        ]
      },
      {
        id: 'inspect', anim: 'brake.overview',
        title: V('Prohlédněte brzdu a pochopte, jak funguje', 'Inspect the brake and understand how it works'),
        body: V(
          'Při sešlápnutí pedálu tlačí kapalina **píst** a ten přitlačí **destičky** na **kotouč**. U plovoucího třmenu je píst jen na vnitřní straně – třmen se po vodicích čepech posune a přitlačí i vnější destičku.\n\nZkontrolujte:\n- **brzdovou hadici** – praskliny, boule, vlhkost,\n- **manžetu pístu** – roztržení, únik kapaliny,\n- **kotouč** – minimální tloušťka (vyražena na kotouči „MIN TH“), rýhy, praskliny,\n- **opotřebení destiček** – nerovnoměrné opotřebení znamená zadřený vodicí čep nebo píst.',
          'When you press the pedal, fluid pushes the **piston**, which presses the **pads** onto the **disc**. On a floating caliper the piston is only on the inner side – the caliper slides on its guide pins and pulls the outer pad in too.\n\nCheck:\n- the **brake hose** – cracks, bulges, dampness,\n- the **piston boot** – tears, fluid leaks,\n- the **disc** – minimum thickness (stamped on the disc as "MIN TH"), grooves, cracks,\n- **pad wear** – uneven wear means a seized guide pin or piston.'
        ),
        notes: [
          { level: 'danger', text: V('Popraskaná hadice nebo unikající kapalina u pístu = **nepokračujte**. Oprava vyžaduje odvzdušnění brzd – svěřte ji dílně nebo si nejdřív nastudujte postup.', 'A cracked hose or fluid leaking at the piston = **do not continue**. The repair requires bleeding the brakes – leave it to a workshop or study the procedure first.') },
          { level: 'warning', text: V('Kotouč pod minimální tloušťkou je nutné vyměnit vždy – i když vypadá hladce.', 'A disc below minimum thickness must always be replaced – even if it looks smooth.') }
        ]
      },
      {
        id: 'caliper', anim: 'brake.caliperOff',
        title: V('Odšroubujte třmen a zavěste ho', 'Unbolt the caliper and hang it up'),
        body: V(
          '1. Vypojte konektor **senzoru opotřebení** (je-li).\n2. Na vnitřní straně třmenu povolte **dva vodicí šrouby** (často pod gumovými krytkami). Vodicí čep přidržte klíčem na kontru, aby se neprotáčel.\n3. Třmen stáhněte z destiček a **zavěste ho drátem nebo háčkem** na pružinu či tlumič.',
          '1. Unplug the **wear sensor** connector (if fitted).\n2. On the inner side of the caliper undo the **two guide bolts** (often under rubber caps). Counter-hold the guide pin with a spanner so it does not spin.\n3. Pull the caliper off the pads and **hang it with wire or a hook** from the spring or shock absorber.'
        ),
        notes: [
          { level: 'danger', text: V('**Třmen nikdy nenechávejte viset na brzdové hadici.** Hadice se uvnitř poškodí a může později při brzdění prasknout.', '**Never let the caliper hang by the brake hose.** The hose gets damaged inside and can burst later under braking.') },
          { level: 'warning', text: V('Když je třmen sundaný, **nešlapejte na brzdový pedál** – píst vyletí z třmenu a brzdy se musí odvzdušnit.', 'While the caliper is off, **do not press the brake pedal** – the piston pops out and the brakes must be bled.') }
        ]
      },
      {
        id: 'pads', anim: 'brake.padsOut',
        title: V('Vyjměte staré destičky', 'Remove the old pads'),
        body: V(
          'Vytáhněte vnější i vnitřní destičku z držáku a sundejte staré **spony / pružiny**. Všimněte si, jak byly destičky orientované (šipky, senzor, plíšky proti pískání).\n\nVodicí čepy vytáhněte, očistěte a namažte **jen mazivem určeným na vodicí čepy** (obvykle je v sadě).',
          'Pull the outer and inner pad out of the carrier and remove the old **clips / springs**. Note how the pads were oriented (arrows, sensor, anti-squeal shims).\n\nPull out the guide pins, clean them and grease them **only with grease meant for guide pins** (usually in the kit).'
        ),
        notes: [
          { level: 'caution', text: V('Běžná minerální vazelína nafoukne pryžové manžety vodicích čepů a čep se zadře.', 'Ordinary mineral grease swells the rubber guide pin boots and the pin seizes.') },
          { level: 'info', text: V('Vnitřní destička výrazně opotřebenější než vnější = zadřený vodicí čep nebo píst. Příčinu odstraňte, jinak se problém vrátí.', 'Inner pad much more worn than the outer = seized guide pin or piston. Fix the cause or the problem will return.') }
        ]
      },
      {
        id: 'disc', anim: 'brake.carrierDisc',
        title: V('Demontujte držák třmenu a kotouč', 'Remove the caliper carrier and disc'),
        body: V(
          '1. Zezadu povolte **dva šrouby držáku třmenu** (bývají velmi utažené – použijte prodlouženou páku).\n2. Vyšroubujte malý **pojistný šroubek kotouče** (pokud je).\n3. Kotouč stáhněte z náboje. Pokud je přikipělý, poklepejte gumovou palicí **mezi šrouby kola** a nastříkejte uvolňovač na střed náboje (ne na třecí plochu).',
          '1. From behind, undo the **two caliper carrier bolts** (usually very tight – use a breaker bar).\n2. Remove the small **disc retaining screw** (if fitted).\n3. Pull the disc off the hub. If it is seized, tap with a rubber mallet **between the wheel studs** and spray penetrating oil on the hub centre (not on the friction surface).'
        ),
        notes: [
          { level: 'warning', text: V('Šrouby držáku třmenu jsou bezpečnostní díly. Někteří výrobci předepisují **nové šrouby** nebo zajištění závitu – ověřte v dílenské příručce.', 'Carrier bolts are safety-critical parts. Some manufacturers require **new bolts** or thread locker – check the workshop manual.') },
          { level: 'info', text: V('Pojistný šroubek jen drží kotouč při montáži. Kotouč drží na místě až kolo.', 'The retaining screw only holds the disc during assembly. The wheel is what holds the disc in place.') }
        ]
      },
      {
        id: 'hub', anim: 'brake.hubClean',
        title: V('Očistěte náboj', 'Clean the hub'),
        body: V(
          'Dosedací plochu náboje očistěte drátěným kartáčem nebo brusnou houbičkou **do čistého kovu**. I tenká vrstva rzi způsobí házení kotouče a vibrace volantu při brzdění.\n\nNa středicí límec náboje (ne na dosedací plochu) můžete dát tenkou vrstvu montážní pasty, pokud to výrobce dovoluje.',
          'Clean the hub contact face with a wire brush or abrasive pad **to bare metal**. Even a thin layer of rust causes disc runout and steering wheel vibration under braking.\n\nYou may put a thin layer of assembly paste on the hub spigot (not on the contact face) if the manufacturer allows it.'
        ),
        notes: [
          { level: 'caution', text: V('Při kartáčování noste respirátor a brýle – rez a brzdový prach létají do obličeje.', 'Wear a mask and glasses while brushing – rust and brake dust fly into your face.') }
        ]
      },
      {
        id: 'newdisc', anim: 'brake.discFit',
        title: V('Nasaďte nový kotouč a držák třmenu', 'Fit the new disc and caliper carrier'),
        body: V(
          '1. Nový kotouč z obou stran **odmastěte čističem brzd** – je pokrytý konzervačním olejem.\n2. Nasaďte kotouč a zašroubujte pojistný šroubek.\n3. Nasaďte držák třmenu a šrouby dotáhněte **momentovým klíčem** na předepsanou hodnotu.',
          '1. **Degrease the new disc** on both sides with brake cleaner – it is coated with protective oil.\n2. Fit the disc and its retaining screw.\n3. Fit the caliper carrier and tighten the bolts **with a torque wrench** to spec.'
        ),
        specs: [
          { label: V('Šrouby držáku třmenu', 'Caliper carrier bolts'), value: V('dle dílenské příručky', 'per workshop manual') }
        ],
        notes: [
          { level: 'danger', text: V('Šrouby držáku třmenu vždy dotáhněte momentovým klíčem – nikdy „od oka“.', 'Always tighten carrier bolts with a torque wrench – never by feel.') },
          { level: 'caution', text: V('Třecích ploch kotouče se nedotýkejte mastnými rukavicemi.', 'Do not touch the disc friction surfaces with greasy gloves.') }
        ]
      },
      {
        id: 'piston', anim: 'brake.pistonPush',
        title: V('Zatlačte píst zpět', 'Push the piston back'),
        body: V(
          'Nové destičky jsou silnější, proto se píst musí **zatlačit úplně zpět do třmenu**. Přiložte starou destičku, nasaďte stlačovák nebo svěrku a tlačte **pomalu a rovně**.\n\nBěhem tlačení **sledujte nádržku** – hladina stoupá.',
          'New pads are thicker, so the piston must be **pushed fully back into the caliper**. Place the old pad against it, fit the piston press or clamp and push **slowly and straight**.\n\n**Watch the reservoir** while pushing – the level rises.'
        ),
        notes: [
          { level: 'warning', text: V('**Zadní třmeny s mechanickou ruční brzdou** mají píst, který se musí **zašroubovat** (točit a tlačit). Prosté tlačení zničí mechanismus. Třmeny s **elektrickou parkovací brzdou** potřebují servisní režim. Zvolte svůj vůz nahoře.', '**Rear calipers with a mechanical handbrake** have a piston that must be **wound back** (turn and push). Plain pushing destroys the mechanism. Calipers with an **electric parking brake** need service mode. Select your car at the top.') },
          { level: 'caution', text: V('Netlačte na střed pístu ostrým nástrojem a dbejte, aby se nepoškodila prachová manžeta.', 'Do not push on the piston with a sharp tool and make sure the dust boot is not damaged.') },
          { level: 'info', text: V('Jde-li píst ztuha nebo vůbec, třmen je zadřený – je třeba ho repasovat nebo vyměnit.', 'If the piston is very stiff or will not move, the caliper is seized – it needs a rebuild or replacement.') }
        ]
      },
      {
        id: 'newpads', anim: 'brake.padsIn',
        title: V('Nasaďte nové destičky a spony', 'Fit the new pads and clips'),
        body: V(
          '1. Do držáku nasaďte **nové spony** ze sady.\n2. Tenkou vrstvu montážní pasty dejte **jen na uši destiček** (místa, kde se dotýkají spon) a na zadní stranu nosné desky, pokud to výrobce dovoluje.\n3. Vložte vnitřní a vnější destičku správnou stranou (šipky směru otáčení, destička se senzorem na správné místo).',
          '1. Fit the **new clips** from the kit into the carrier.\n2. Put a thin layer of assembly paste **only on the pad ears** (where they touch the clips) and on the back of the backing plate if the manufacturer allows it.\n3. Insert the inner and outer pad the right way round (rotation arrows, pad with sensor in the correct position).'
        ),
        notes: [
          { level: 'danger', text: V('Pasta, tuk ani otisky mastných prstů **nikdy na třecí materiál destiček nebo kotouč**.', '**Never** get paste, grease or greasy fingerprints on the pad friction material or the disc.') },
          { level: 'caution', text: V('Na obou stranách nápravy musí být destičky stejného výrobce a typu – jinak vůz při brzdění táhne do strany.', 'Both sides of the axle must have pads of the same brand and type – otherwise the car pulls to one side when braking.') }
        ]
      },
      {
        id: 'refit', anim: 'brake.caliperOn',
        title: V('Namontujte třmen a dotáhněte vodicí šrouby', 'Refit the caliper and torque the guide bolts'),
        body: V(
          '1. Třmen nasuňte přes destičky a zašroubujte vodicí šrouby (samojistné šrouby vyměňte za nové).\n2. Dotáhněte je **momentovým klíčem**, čep přidržujte na kontru.\n3. Zapojte senzor opotřebení a kabel uchyťte do držáků mimo kotouč.\n4. Zkontrolujte, že brzdová hadice není překroucená.',
          '1. Slide the caliper over the pads and fit the guide bolts (replace self-locking bolts with new ones).\n2. Tighten them **with a torque wrench** while counter-holding the pin.\n3. Connect the wear sensor and clip its wire away from the disc.\n4. Check that the brake hose is not twisted.'
        ),
        specs: [
          { label: V('Vodicí šrouby třmenu', 'Caliper guide bolts'), value: V('dle dílenské příručky', 'per workshop manual') }
        ],
        notes: [
          { level: 'warning', text: V('Překroucená hadice se může při rejdu dotýkat kola nebo pneumatiky a prodřít se.', 'A twisted hose can touch the wheel or tyre at full lock and wear through.') }
        ]
      },
      {
        id: 'wheels', anim: 'lift.torque',
        title: V('Druhá strana, kola a spuštění vozu', 'Other side, wheels and lowering the car'),
        body: V(
          'Celý postup **zopakujte na druhé straně nápravy**. Pak nasaďte kola, spusťte vůz (viz návod „Bezpečné zvednutí vozu“) a šrouby kol dotáhněte momentovým klíčem do kříže.',
          '**Repeat the whole procedure on the other side of the axle.** Then refit the wheels, lower the car (see "Safely lifting the car") and torque the wheel bolts in a star pattern.'
        ),
        specs: [
          { label: V('Šrouby kol', 'Wheel bolts'), value: V('dle příručky vozu', 'per vehicle manual') }
        ],
        notes: [
          { level: 'danger', text: V('Nikdy neměňte brzdy jen na jedné straně nápravy.', 'Never replace brakes on only one side of an axle.') }
        ]
      },
      {
        id: 'pedal', anim: 'brake.pedal',
        title: V('Napumpujte brzdový pedál – PŘED rozjezdem', 'Pump the brake pedal – BEFORE moving'),
        body: V(
          '1. Sedněte do vozu (motor vypnutý) a **pomalu sešlápněte pedál 10–20×**, dokud není vysoko a tvrdý. Písty se tak vysunou k destičkám.\n2. Zkontrolujte hladinu brzdové kapaliny a doplňte ji **po MAX** správnou kapalinou. Víčko zavřete.',
          '1. Sit in the car (engine off) and **slowly press the pedal 10–20 times** until it is high and firm. This moves the pistons out to the pads.\n2. Check the brake fluid level and top up **to MAX** with the correct fluid. Close the cap.'
        ),
        notes: [
          { level: 'danger', text: V('Pokud pedál zůstává měkký nebo propadá i po napumpování, je v systému vzduch nebo únik. **Nejezděte** a nechte brzdy zkontrolovat.', 'If the pedal stays soft or sinks even after pumping, there is air in the system or a leak. **Do not drive** – have the brakes checked.') },
          { level: 'caution', text: V('Nepřelévejte nad MAX – při opotřebení destiček hladina klesá, to je normální.', 'Do not overfill above MAX – the level drops as the pads wear, which is normal.') }
        ]
      },
      {
        id: 'bedding', anim: 'brake.bedding',
        title: V('Zkušební jízda a zajetí brzd', 'Test drive and bedding in'),
        body: V(
          '1. Na prázdném bezpečném místě nejdřív vyzkoušejte brzdy **ve chůzi**.\n2. Pak brzdy zajeďte: **8–10× přibrzděte z cca 80 na 30 km/h** středně silně, bez úplného zastavení.\n3. Poté jeďte několik kilometrů bez brzdění, aby brzdy vychladly.\n4. Prvních **200–300 km** se vyhněte prudkému brzdění.',
          '1. In an empty, safe place first test the brakes **at walking pace**.\n2. Then bed them in: **8–10 moderate stops from about 80 to 30 km/h**, without coming to a complete stop.\n3. Then drive a few kilometres without braking to let the brakes cool.\n4. Avoid hard braking for the first **200–300 km**.'
        ),
        notes: [
          { level: 'warning', text: V('Zajíždění dělejte jen tam, kde nikoho neohrozíte (žádný provoz za vámi). Nové brzdy mohou zpočátku brzdit hůř.', 'Bed in only where you endanger nobody (no traffic behind you). New brakes may be weaker at first.') },
          { level: 'caution', text: V('S rozpálenými brzdami nestůjte dlouho na sešlápnutém pedálu – destičky se otisknou do kotouče a ten pak „hází“.', 'Do not sit with the pedal pressed on hot brakes for long – the pads imprint onto the disc and cause judder.') },
          { level: 'info', text: V('Táhne-li vůz při brzdění do strany nebo brzdy skřípou kov o kov, okamžitě zastavte a závadu najděte.', 'If the car pulls to one side under braking or you hear metal on metal, stop immediately and find the fault.') }
        ]
      }
    ],
    vehicles: {
      /* ------------------------------------------------------------ Octavia */
      'skoda-octavia-rs-tdi': {
        status: 'ok',
        specs: [
          { label: V('Přední brzdy', 'Front brakes'), value: V('Plovoucí 1pístkový třmen (FN3), kotouč 312 × 25 mm ventilovaný', 'Floating single-piston caliper (FN3), 312 × 25 mm vented disc'), verify: true },
          { label: V('Zadní brzdy', 'Rear brakes'), value: V('Plovoucí třmen s mechanickou ruční brzdou, kotouč 272 × 10 mm nebo 286 × 12 mm (dle PR kódu)', 'Floating caliper with mechanical handbrake, 272 × 10 mm or 286 × 12 mm disc (depends on PR code)'), verify: true },
          { label: V('Zadní píst', 'Rear piston'), value: V('Zašroubovává se rotačním stlačovákem', 'Wind back with a rotating tool') },
          { label: V('Vodicí šrouby přední / zadní', 'Guide bolts front / rear'), value: V('28 Nm / 35 Nm (samojistné – nové)', '28 Nm / 35 Nm (self-locking – new)'), verify: true },
          { label: V('Šrouby držáku přední / zadní', 'Carrier bolts front / rear'), value: V('200 Nm / 90 Nm', '200 Nm / 90 Nm'), verify: true },
          { label: V('Šrouby kol', 'Wheel bolts'), value: '120 Nm' },
          { label: V('Brzdová kapalina', 'Brake fluid'), value: V('DOT 4 (VW 501 14)', 'DOT 4 (VW 501 14)') }
        ],
        notes: [
          { level: 'info', text: V('Velikost brzd se u Octavie liší podle **PR kódu** (štítek v prohlubni rezervního kola / v servisní knížce). Díly objednávejte podle VIN.', 'Brake size on the Octavia depends on the **PR code** (sticker in the spare wheel well / service book). Order parts by VIN.') },
          { level: 'warning', text: V('Zadní písty se **nesmí jen zatlačit** – musí se zašroubovat. Při práci na zadní nápravě musí být **ruční brzda uvolněná** (a kola předku zakliněná).', 'The rear pistons **must not just be pushed** – they must be wound back. When working on the rear axle the **handbrake must be released** (and the front wheels chocked).') }
        ],
        tools: [
          V('Imbus 7 mm (vodicí šrouby předního třmenu)', '7 mm hex bit (front caliper guide bolts)'),
          V('Rotační stlačovák pístů s adaptérem pro VW/Škoda', 'Wind-back piston tool with VW/Škoda adapter')
        ],
        steps: {
          caliper: { notes: [{ level: 'warning', text: V('Zadní náprava: povolte ruční brzdu. Lanko ruční brzdy na třmenu nechte připojené, třmen jen zavěste.', 'Rear axle: release the handbrake. Leave the handbrake cable attached to the caliper, just hang the caliper up.') }] },
          newdisc: { specs: [
            { label: V('Držák třmenu – přední', 'Carrier – front'), value: '200 Nm', verify: true },
            { label: V('Držák třmenu – zadní', 'Carrier – rear'), value: '90 Nm', verify: true },
            { label: V('Pojistný šroubek kotouče', 'Disc retaining screw'), value: '4 Nm', verify: true }
          ] },
          piston: { body: V('Toto platí pro **přední** třmeny: píst se jen zatlačí. **Zadní** třmeny – viz následující krok.', 'This applies to the **front** calipers: the piston is simply pushed back. **Rear** calipers – see the next step.') },
          refit: { specs: [
            { label: V('Vodicí šrouby – přední', 'Guide bolts – front'), value: '28 Nm', verify: true },
            { label: V('Vodicí šrouby – zadní (nové)', 'Guide bolts – rear (new)'), value: '35 Nm', verify: true }
          ] },
          wheels: { specs: [{ label: V('Šrouby kol', 'Wheel bolts'), value: '120 Nm' }] },
          pedal: { notes: [{ level: 'info', text: V('Po výměně zadních destiček sešlápněte pedál a pak **několikrát zatáhněte a povolte ruční brzdu** – samostavěcí mechanismus se tak dorovná.', 'After replacing the rear pads, pump the pedal and then **pull and release the handbrake several times** – this lets the self-adjuster take up the clearance.') }] }
        },
        extraSteps: [
          {
            after: 'piston',
            step: {
              id: 'rearWind', anim: 'brake.pistonWind',
              title: V('Zadní třmen: píst zašroubujte', 'Rear caliper: wind the piston back'),
              body: V(
                '1. Ruční brzda musí být **uvolněná**.\n2. Nasaďte rotační stlačovák se správným adaptérem (kolíky do zářezů pístu).\n3. **Otáčejte a zároveň tlačte**, dokud píst není úplně zašroubovaný. U VW/Škoda se píst obvykle točí **ve směru hodinových ručiček**.\n4. Zářezy pístu natočte tak, aby do nich zapadl výstupek na zadní straně destičky (je-li).',
                '1. The handbrake must be **released**.\n2. Fit the wind-back tool with the correct adapter (pins in the piston slots).\n3. **Turn and push at the same time** until the piston is fully wound in. On VW/Škoda the piston usually turns **clockwise**.\n4. Align the piston slots so the nub on the back of the pad (if any) fits into them.'
              ),
              notes: [
                { level: 'warning', text: V('**Nikdy píst jen netlačte** svěrkou – zničíte vnitřní závit a ruční brzda přestane fungovat.', '**Never just push** the piston with a clamp – you destroy the internal thread and the handbrake stops working.') },
                { level: 'caution', text: V('Směr otáčení ověřte podle nářadí / dílenské příručky. Pokud píst nejde, netlačte silou – zkuste opačný směr nebo zkontrolujte, zda je ruční brzda uvolněná.', 'Verify the direction with your tool / workshop manual. If the piston does not move, do not force it – try the other direction or check that the handbrake is released.'), verify: true },
                { level: 'caution', text: V('Prachová manžeta se při točení nesmí zkroutit ani roztrhnout.', 'The dust boot must not twist or tear while turning.') }
              ]
            }
          }
        ],
        finalChecks: [
          V('Ruční brzda drží vůz ve svahu a po uvolnění se kola volně otáčejí', 'Handbrake holds the car on a slope and wheels turn freely when released')
        ]
      },

      /* ------------------------------------------------------------ Volvo */
      'volvo-xc60-b4': {
        status: 'caution',
        specs: [
          { label: V('Velikost kotoučů', 'Disc size'), value: V('Liší se dle verze / velikosti kol – ověřte podle VIN', 'Varies by version / wheel size – check by VIN'), verify: true },
          { label: V('Zadní třmeny', 'Rear calipers'), value: V('Integrovaná elektrická parkovací brzda (motor na třmenu)', 'Integrated electric parking brake (motor on caliper)') },
          { label: V('Utahovací momenty třmenů', 'Caliper torques'), value: V('dle VIDA – hodnotu nehádejte', 'per VIDA – do not guess'), verify: true },
          { label: V('Šrouby kol', 'Wheel bolts'), value: '140 Nm', verify: true },
          { label: V('Brzdová kapalina', 'Brake fluid'), value: V('DOT 4 nízkoviskózní (třída 6)', 'DOT 4 low viscosity (class 6)'), verify: true },
          { label: V('Senzor opotřebení', 'Wear sensor'), value: V('Ano – umístění ověřte (obvykle jedna přední a jedna zadní destička)', 'Yes – check location (usually one front and one rear pad)'), verify: true }
        ],
        notes: [
          { level: 'warning', text: V('**Elektrická parkovací brzda (EPB):** Před prací na zadní nápravě musí být EPB v **servisním režimu**. Zatlačení pístu bez něj zničí motor / převod třmenu.', '**Electric parking brake (EPB):** Before working on the rear axle, the EPB must be in **service mode**. Pushing the piston back without it destroys the caliper motor / gear.') },
          { level: 'info', text: V('48V mild hybrid systém se brzd netýká – není třeba ho odpojovat. Mějte ale **12V baterii nabitou** (připojte udržovací nabíječku), protože servisní režim vyžaduje zapnuté zapalování.', 'The 48 V mild hybrid system is not involved in brake work – no need to disconnect it. Keep the **12 V battery charged** though (connect a maintainer), as service mode needs the ignition on.') },
          { level: 'info', text: V('Přední brzdy nemají EPB – postupuje se podle obecného postupu.', 'The front brakes have no EPB – follow the generic procedure.') }
        ],
        tools: [
          V('Diagnostika se servisní funkcí EPB pro Volvo (VIDA nebo kompatibilní tester)', 'Scan tool with Volvo EPB service function (VIDA or compatible tester)'),
          V('Udržovací nabíječka 12V baterie', '12 V battery maintainer')
        ],
        safety: [
          { level: 'danger', text: V('V servisním režimu EPB vůz **nedrží parkovací brzda**. Automat v P a klíny pod přední kola jsou povinné.', 'In EPB service mode the **parking brake does not hold** the car. Automatic in P and chocks under the front wheels are mandatory.') }
        ],
        steps: {
          piston: { notes: [{ level: 'warning', text: V('Zadní písty (EPB) zatlačujte **rovně, neotáčet**, a jen když je aktivní servisní režim.', 'Push the rear (EPB) pistons back **straight, without turning**, and only while service mode is active.') }] },
          newdisc: { specs: [{ label: V('Šrouby držáku třmenu', 'Carrier bolts'), value: V('dle VIDA', 'per VIDA'), verify: true }] },
          refit: { specs: [{ label: V('Vodicí šrouby třmenu', 'Caliper guide bolts'), value: V('dle VIDA', 'per VIDA'), verify: true }], notes: [{ level: 'caution', text: V('Zapojte konektor motoru EPB a zkontrolujte, že je zaaretovaný a kabel není napnutý.', 'Reconnect the EPB motor connector and check it is locked and the wire is not under tension.') }] },
          wheels: { specs: [{ label: V('Šrouby kol', 'Wheel bolts'), value: '140 Nm', verify: true }] }
        },
        extraSteps: [
          {
            after: 'prep',
            step: {
              id: 'epbOn', anim: 'brake.epb',
              title: V('Zadní náprava: aktivujte servisní režim EPB', 'Rear axle: activate EPB service mode'),
              body: V(
                'Dělá se **před zvednutím vozu**, pokud budete měnit zadní brzdy.\n\n1. Vůz na rovině, automat v **P**, klíny pod přední kola.\n2. Zapněte zapalování (motor neběží), připojte nabíječku.\n3. V diagnostice (VIDA nebo kompatibilní tester) zvolte **Parkovací brzda → servisní režim / výměna destiček**. Motory třmenů stáhnou vřetena zcela zpět.\n4. Ověřte hlášení, že je servisní režim **aktivní**.\n\nNěkteré modely umožňují aktivaci i bez diagnostiky postupem z uživatelské příručky – ověřte pro svůj modelový rok.',
                'Do this **before lifting the car** if you will replace the rear brakes.\n\n1. Car on level ground, automatic in **P**, chocks under the front wheels.\n2. Ignition on (engine not running), connect the charger.\n3. In the scan tool (VIDA or compatible) select **Parking brake → service mode / pad replacement**. The caliper motors wind the spindles fully back.\n4. Confirm the message that service mode is **active**.\n\nSome models allow activation without a scan tool using a procedure from the owner\'s manual – verify for your model year.'
              ),
              notes: [
                { level: 'danger', text: V('V servisním režimu parkovací brzda nedrží – vůz musí být zajištěný klíny.', 'In service mode the parking brake does not hold – the car must be chocked.') },
                { level: 'warning', text: V('Dokud jsou zadní třmeny rozebrané, **nemačkejte spínač EPB** a nevypínejte servisní režim.', 'While the rear calipers are apart, **do not press the EPB switch** and do not exit service mode.') },
                { level: 'info', text: V('Přesný název funkce a postup bez diagnostiky se liší dle verze softwaru vozu.', 'The exact function name and the no-tool procedure differ by car software version.'), verify: true }
              ]
            }
          },
          {
            after: 'pedal',
            step: {
              id: 'epbOff', anim: 'brake.epb',
              title: V('Ukončete servisní režim EPB a kalibrujte', 'Exit EPB service mode and calibrate'),
              body: V(
                '1. Kola jsou nasazená, vůz stojí na zemi, pedál je napumpovaný.\n2. V diagnostice **ukončete servisní režim** a spusťte kalibraci / test parkovací brzdy.\n3. Několikrát zabrzděte a odbrzděte EPB spínačem – na displeji nesmí zůstat žádné varování.',
                '1. Wheels refitted, car on the ground, pedal pumped up.\n2. In the scan tool **exit service mode** and run the parking brake calibration / test.\n3. Apply and release the EPB with its switch several times – no warning may remain on the display.'
              ),
              notes: [
                { level: 'danger', text: V('Svítí-li po kalibraci varování parkovací brzdy, **nejezděte** – parkovací brzda nemusí držet.', 'If a parking brake warning remains after calibration, **do not drive** – the parking brake may not hold.') }
              ]
            }
          }
        ],
        finalChecks: [
          V('EPB ukončena ze servisního režimu, zabrzdí i odbrzdí bez varování', 'EPB out of service mode, applies and releases without warnings')
        ]
      },

      /* ------------------------------------------------------------ GR Yaris */
      'toyota-gr-yaris': {
        status: 'ok',
        specs: [
          { label: V('Přední brzdy', 'Front brakes'), value: V('Pevný 4pístkový monoblok, kotouč 356 mm', 'Fixed 4-piston monoblock, 356 mm disc'), verify: true },
          { label: V('Zadní brzdy', 'Rear brakes'), value: V('2pístkový třmen, kotouč 297 mm – typ třmenu ověřte v TIS', '2-piston caliper, 297 mm disc – check caliper type in TIS'), verify: true },
          { label: V('Utahovací momenty třmenů', 'Caliper torques'), value: V('dle TIS – hodnotu nehádejte', 'per TIS – do not guess'), verify: true },
          { label: V('Matice kol', 'Wheel nuts'), value: '103 Nm', verify: true },
          { label: V('Parkovací brzda', 'Parking brake'), value: V('Mechanická (páka)', 'Mechanical (lever)') }
        ],
        notes: [
          { level: 'info', text: V('Tento postup je pro **přední nápravu** s pevným 4pístkovým třmenem – třmen zůstává na voze, destičky se vyjímají nahoru po vytažení kolíků. Pro zadní nápravu ověřte typ třmenu v TIS; je-li plovoucí, použijte obecný postup (zvolte „Obecné vozidlo“).', 'This procedure is for the **front axle** with fixed 4-piston calipers – the caliper stays on the car and the pads come out upwards after removing the pins. For the rear axle check the caliper type in TIS; if it is floating, use the generic procedure (select "Generic vehicle").'), verify: true },
          { level: 'warning', text: V('Při **okruhovém provozu** používejte vysokoteplotní brzdovou kapalinu a měňte ji před každou sezónou. Závodní destičky za studena brzdí hůř a mohou pískat.', 'For **track use**, use high-temperature brake fluid and change it before every season. Race pads brake worse when cold and may squeal.') }
        ],
        tools: [
          V('Vyrážeč / průbojník na kolíky destiček', 'Pin punch for the pad pins'),
          V('Roztahovák pístů (nebo plochá páka s ochranou)', 'Piston spreader (or a protected flat lever)')
        ],
        steps: {
          caliper: { skip: true },
          pads: { skip: true },
          piston: { skip: true },
          newpads: { skip: true },
          refit: { skip: true },
          disc: {
            title: V('Sundejte třmen a kotouč', 'Remove the caliper and disc'),
            body: V('Pevný třmen je přišroubovaný přímo k těhlici **dvěma šrouby** (bez držáku). Povolte je, třmen opatrně stáhněte z kotouče a **zavěste ho drátem** – nikdy za hadici. Pak vyšroubujte pojistný šroubek (je-li) a stáhněte kotouč.', 'The fixed caliper is bolted directly to the knuckle with **two bolts** (no carrier). Undo them, carefully slide the caliper off the disc and **hang it with wire** – never by the hose. Then remove the retaining screw (if fitted) and pull the disc off.'),
            notes: [{ level: 'danger', text: V('Třmen je těžký – nenechte ho viset na hadici ani na chvíli.', 'The caliper is heavy – do not let it hang by the hose even for a moment.') }]
          },
          newdisc: {
            title: V('Nasaďte nový kotouč a třmen', 'Fit the new disc and caliper'),
            body: V('Nový kotouč odmastěte, nasaďte, pak nasuňte třmen (písty zcela zatlačené) a montážní šrouby dotáhněte **momentovým klíčem**.', 'Degrease and fit the new disc, then slide the caliper on (pistons fully back) and tighten the mounting bolts **with a torque wrench**.'),
            specs: [{ label: V('Montážní šrouby třmenu', 'Caliper mounting bolts'), value: V('dle TIS', 'per TIS'), verify: true }]
          },
          wheels: { specs: [{ label: V('Matice kol', 'Wheel nuts'), value: '103 Nm', verify: true }] }
        },
        extraSteps: [
          {
            after: 'inspect',
            step: {
              id: 'fxPistons', anim: 'brake.fixedPistons',
              title: V('Zatlačte písty rovnoměrně zpět', 'Push the pistons back evenly'),
              body: V(
                'Se starými destičkami ještě v třmenu zatlačte písty zpět: páku / roztahovák vložte mezi destičku a kotouč a tlačte **pomalu a rovnoměrně** – nejdřív jedna strana, pak druhá. Sledujte hladinu v nádržce.',
                'With the old pads still in the caliper, push the pistons back: put the lever / spreader between pad and disc and push **slowly and evenly** – one side first, then the other. Watch the reservoir level.'
              ),
              notes: [
                { level: 'caution', text: V('Páka mezi destičkou a kotoučem kotouč poškrábe – to nevadí jen tehdy, když kotouč měníte. Pokud kotouč zůstává, použijte roztahovák pístů po vyjmutí destiček.', 'A lever between pad and disc scratches the disc – fine only if you are replacing the disc. If the disc stays, use a piston spreader after removing the pads.') },
                { level: 'warning', text: V('Zatlačíte-li jeden píst, protější se může vysunout. Tlačte vždy celou destičkou, ne jeden píst.', 'Pushing one piston can push the opposite one out. Always push with the whole pad, not a single piston.') }
              ]
            }
          },
          {
            after: 'fxPistons',
            step: {
              id: 'fxPins', anim: 'brake.fixedPins',
              title: V('Vyjměte destičky z pevného třmenu', 'Remove the pads from the fixed caliper'),
              body: V(
                '1. Vypojte senzor opotřebení (je-li).\n2. Sundejte **pojistnou pružinu** (anti-rattle).\n3. Vytáhněte / vyrazte **kolíky destiček** (pojistné sponky vyjměte nejdřív).\n4. Destičky vytáhněte **nahoru z okna třmenu**.',
                '1. Unplug the wear sensor (if fitted).\n2. Remove the **anti-rattle spring**.\n3. Pull / drift out the **pad pins** (remove their retaining clips first).\n4. Lift the pads **up out of the caliper window**.'
              ),
              notes: [
                { level: 'caution', text: V('Přesné uspořádání kolíků a pružiny si vyfoťte – liší se dle provedení.', 'Photograph the exact arrangement of the pins and spring – it differs between versions.'), verify: true }
              ]
            }
          },
          {
            after: 'newdisc',
            step: {
              id: 'fxPadsIn', anim: 'brake.fixedPadsIn',
              title: V('Vložte nové destičky, kolíky a pružinu', 'Fit new pads, pins and spring'),
              body: V(
                '1. Nové destičky vsuňte shora do třmenu (plíšky proti pískání na stranu pístů).\n2. Zasuňte **kolíky** a zajistěte je sponkami.\n3. Nasaďte **pojistnou pružinu** a zapojte senzor.',
                '1. Slide the new pads into the caliper from above (anti-squeal shims towards the pistons).\n2. Insert the **pins** and secure them with their clips.\n3. Fit the **anti-rattle spring** and connect the sensor.'
              ),
              notes: [
                { level: 'danger', text: V('Kolíky musí být zajištěné. Vypadlý kolík = destička může vypadnout z třmenu.', 'The pins must be secured. A lost pin = the pad can fall out of the caliper.') },
                { level: 'danger', text: V('Žádná pasta ani tuk na třecí plochy.', 'No paste or grease on the friction surfaces.') }
              ]
            }
          }
        ],
        finalChecks: [
          V('Kolíky destiček zajištěné sponkami, pružina správně nasazená', 'Pad pins secured with clips, spring correctly fitted')
        ]
      },

      /* ------------------------------------------------------------ Mercedes */
      'mb-cl500-c216': {
        status: 'caution',
        specs: [
          { label: V('Typ předních třmenů', 'Front caliper type'), value: V('Ověřte (plovoucí / pevný) – postup se liší', 'Verify (floating / fixed) – procedure differs'), verify: true },
          { label: V('Parkovací brzda', 'Parking brake'), value: V('Elektrická s lanovým aktuátorem, čelisti uvnitř zadního kotouče (drum-in-hat)', 'Electric with cable actuator, shoes inside the rear disc (drum-in-hat)'), verify: true },
          { label: V('Senzory opotřebení', 'Wear sensors'), value: V('Obvykle levá přední a pravá zadní', 'Usually left front and right rear'), verify: true },
          { label: V('Utahovací momenty třmenů', 'Caliper torques'), value: V('dle WIS – hodnotu nehádejte', 'per WIS – do not guess'), verify: true },
          { label: V('Šrouby kol', 'Wheel bolts'), value: '150 Nm', verify: true },
          { label: V('Brzdová kapalina', 'Brake fluid'), value: V('DOT 4 Plus (MB 331.0)', 'DOT 4 Plus (MB 331.0)'), verify: true }
        ],
        notes: [
          { level: 'danger', text: V('**ABC podvozek:** zvedejte jen podle návodu „Bezpečné zvednutí vozu“ (verze pro CL 500) – nikdy nespoléhejte na hydrauliku podvozku.', '**ABC suspension:** lift only as described in "Safely lifting the car" (CL 500 version) – never rely on the suspension hydraulics.') },
          { level: 'warning', text: V('Před sundáním zadního kotouče musí být **parkovací brzda uvolněná**. Pokud kotouč nejde dolů, drží ho čelisti – stáhněte je seřizovačem otvorem v kotouči (dle WIS).', 'Before removing the rear disc the **parking brake must be released**. If the disc will not come off, the shoes are holding it – back them off with the adjuster through the hole in the disc (per WIS).'), verify: true },
          { level: 'caution', text: V('Kotouče CL 500 jsou velké a těžké (často přes 10 kg). Držte je oběma rukama.', 'CL 500 discs are large and heavy (often over 10 kg). Hold them with both hands.') },
          { level: 'info', text: V('Pokud svítila kontrolka opotřebení, senzor vyměňte – po přetření je jednorázový.', 'If the wear warning came on, replace the sensor – once worn through it is single-use.') }
        ],
        tools: [
          V('XENTRY nebo diagnostika s funkcí parkovací brzdy Mercedes (doporučeno)', 'XENTRY or a scan tool with Mercedes parking brake functions (recommended)'),
          V('Plochý šroubovák na seřizovač čelistí parkovací brzdy', 'Flat screwdriver for the parking brake shoe adjuster')
        ],
        steps: {
          prep: { notes: [{ level: 'warning', text: V('Při práci na zadní nápravě nesmí být parkovací brzda zabrzděná – vůz zajistěte P a klíny pod přední kola. U některých verzí lze aktuátor parkovací brzdy dát diagnostikou do montážní polohy.', 'When working on the rear axle the parking brake must not be applied – secure the car with P and chocks under the front wheels. On some versions the parking brake actuator can be set to an assembly position with a scan tool.'), verify: true }] },
          disc: { notes: [{ level: 'warning', text: V('Zadní kotouč nesundávejte násilím – nejdřív ověřte, že čelisti parkovací brzdy jsou stažené.', 'Do not force the rear disc off – first make sure the parking brake shoes are backed off.') }] },
          newdisc: { specs: [{ label: V('Šrouby držáku / třmenu', 'Carrier / caliper bolts'), value: V('dle WIS', 'per WIS'), verify: true }] },
          refit: { specs: [{ label: V('Vodicí šrouby třmenu', 'Caliper guide bolts'), value: V('dle WIS', 'per WIS'), verify: true }] },
          wheels: { specs: [{ label: V('Šrouby kol', 'Wheel bolts'), value: '150 Nm', verify: true }] }
        },
        extraSteps: [
          {
            after: 'hub',
            step: {
              id: 'mbShoes', anim: 'brake.drumInHat',
              title: V('Zadní: zkontrolujte čelisti parkovací brzdy', 'Rear: check the parking brake shoes'),
              body: V(
                'Uvnitř zadního kotouče (v „klobouku“) jsou **čelisti parkovací brzdy**. Když je kotouč dole, zkontrolujte jejich tloušťku, pružiny a seřizovač. Nový kotouč musí přes čelisti jít nasadit volně – případně je seřizovačem stáhněte. Po montáži čelisti seřiďte podle WIS.',
                'Inside the rear disc (in the "hat") are the **parking brake shoes**. With the disc off, check their lining thickness, springs and adjuster. The new disc must slide over the shoes freely – back them off with the adjuster if needed. After assembly adjust the shoes per WIS.'
              ),
              notes: [
                { level: 'warning', text: V('Příliš povolené čelisti = parkovací brzda nedrží. Příliš utažené = přehřívání a opotřebení. Seřízení ověřte podle WIS.', 'Shoes too loose = parking brake does not hold. Too tight = overheating and wear. Verify the adjustment per WIS.'), verify: true }
              ]
            }
          }
        ],
        finalChecks: [
          V('Parkovací brzda drží ve svahu, zadní kola se po uvolnění volně otáčejí', 'Parking brake holds on a slope, rear wheels turn freely when released'),
          V('Kontrolka opotřebení / parkovací brzdy nesvítí', 'Wear / parking brake warnings are off')
        ]
      }
    }
  });
})(window.STU);
