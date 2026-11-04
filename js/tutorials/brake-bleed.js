/* Tutorial: Brake fluid change & bleeding. */
(function (S) {
  'use strict';
  var V = function (cs, en) { return { cs: cs, en: en }; };

  S.registerTutorial({
    id: 'brake-bleed',
    level: 2,
    thumb: 'bleed.nipple',
    time: V('1–2 h', '1–2 h'),
    title: V('Výměna brzdové kapaliny a odvzdušnění brzd', 'Brake fluid change & bleeding the brakes'),
    summary: V('Stará kapalina obsahuje vodu a vaří se – pedál pak propadne. Výměna každé ~2 roky.', 'Old fluid contains water and boils – the pedal then sinks. Change every ~2 years.'),
    intro: V(
      'Brzdová kapalina je **hygroskopická** – saje vlhkost ze vzduchu. Po dvou letech má i o 70 °C nižší bod varu. Při dlouhém brzdění z kopce se pak vaří, vzniknou bubliny páry a **pedál propadne k podlaze**.\n\nPři výměně se stará kapalina vytlačí novou přes odvzdušňovací šroubky na každém kole. Je to přesná práce: **jedna bublina vzduchu v systému = měkký pedál**.\n\nPro zvednutí vozu použijte návod **Bezpečné zvednutí vozu**.',
      'Brake fluid is **hygroscopic** – it absorbs moisture from the air. After two years its boiling point can be 70 °C lower. During long downhill braking it then boils, vapour bubbles form and **the pedal sinks to the floor**.\n\nDuring a change the old fluid is pushed out by new fluid through the bleed nipples on each wheel. It is precise work: **one air bubble in the system = a soft pedal**.\n\nTo lift the car use the **Safely lifting the car** tutorial.'
    ),
    safety: [
      { level: 'danger', text: V('**Brzdy jsou životně důležitý systém.** Pokud po práci pedál není tvrdý a vysoko, **s vozem nevyjíždějte**. Nechte ho odtáhnout nebo zkontrolovat.', '**Brakes are a life-critical system.** If the pedal is not firm and high after the job, **do not drive the car**. Have it towed or inspected.') },
      { level: 'danger', text: V('Pod vůz jen na **stojanech** – nikdy jen na heveru. Viz návod Bezpečné zvednutí vozu.', 'Only get under the car on **axle stands** – never on a jack alone. See the Safely lifting the car tutorial.') },
      { level: 'warning', text: V('Brzdová kapalina je **jedovatá a dráždí oči**. Ochranné brýle a nitrilové rukavice jsou povinné. Při zasažení oka vyplachujte vodou 15 minut a vyhledejte lékaře.', 'Brake fluid is **toxic and irritates the eyes**. Safety glasses and nitrile gloves are mandatory. If it gets in your eye, rinse with water for 15 minutes and see a doctor.') },
      { level: 'warning', text: V('**Nikdy nenechte nádobku vyschnout.** Vzduch nasátý do hydraulické jednotky ABS/ESP se dá dostat ven jen diagnostikou – jinak pedál zůstane měkký.', '**Never let the reservoir run dry.** Air sucked into the ABS/ESP hydraulic unit can only be removed with a scan tool – otherwise the pedal stays soft.') },
      { level: 'caution', text: V('Kapalina **leptá lak**. Rozlitou kapalinu ihned spláchněte velkým množstvím vody. Kolem nádobky dejte hadry.', 'Fluid **strips paint**. Rinse any spill immediately with plenty of water. Put rags around the reservoir.') },
      { level: 'caution', text: V('**Nemíchejte typy.** DOT 3, DOT 4 a DOT 5.1 jsou na bázi glykolu a mísitelné, ale použijte vždy typ dle výrobce. **DOT 5 (silikonový) se nesmí míchat s ničím** – zničí těsnění.', '**Do not mix types.** DOT 3, DOT 4 and DOT 5.1 are glycol based and miscible, but always use the type specified by the manufacturer. **DOT 5 (silicone) must never be mixed with anything** – it destroys the seals.') },
      { level: 'info', text: V('Kapalinu používejte jen z **nově otevřeného** balení – otevřená láhev saje vlhkost i v garáži. Starou kapalinu odevzdejte na sběrném dvoře.', 'Use fluid only from a **freshly opened** bottle – an open bottle absorbs moisture even in the garage. Take old fluid to a recycling centre.') }
    ],
    tools: [
      V('Očkový klíč na odvzdušňovací šroubky (obvykle 7–11 mm)', 'Ring spanner for the bleed nipples (usually 7–11 mm)'),
      V('Průhledná hadička, která těsně sedí na šroubek', 'Clear tube that fits tightly on the nipple'),
      V('Láhev na starou kapalinu', 'Bottle for old fluid'),
      V('Injekční stříkačka / odsávačka (na odsátí z nádobky)', 'Syringe / extractor (to empty the reservoir)'),
      V('Tlakové odvzdušňovací zařízení (doporučeno) nebo pomocník', 'Pressure bleeder (recommended) or a helper'),
      V('Hever, stojany, klíč na kola, momentový klíč', 'Jack, stands, wheel brace, torque wrench'),
      V('Čistič brzd, hadry, kbelík vody (na rozlitou kapalinu)', 'Brake cleaner, rags, bucket of water (for spills)'),
      V('Nitrilové rukavice, ochranné brýle', 'Nitrile gloves, safety glasses')
    ],
    parts: [
      V('Brzdová kapalina dle specifikace vozu – nové, uzavřené balení (obvykle 1 l stačí)', 'Brake fluid per vehicle spec – new, sealed bottle (usually 1 L is enough)'),
      V('Gumové krytky odvzdušňovacích šroubků (pokud chybí)', 'Rubber bleed nipple caps (if missing)')
    ],
    finalChecks: [
      V('Pedál tvrdý a vysoko, při delším držení neklesá', 'Pedal firm and high, does not sink when held'),
      V('Všechny odvzdušňovací šroubky dotažené a s krytkami, nic nekape', 'All bleed nipples tight and capped, no leaks'),
      V('Hladina v nádobce na MAX, víčko zavřené', 'Reservoir at MAX, cap closed'),
      V('Rozlitá kapalina opláchnuta z laku a dílů', 'Spilled fluid rinsed off paint and parts'),
      V('Kola dotažena momentovým klíčem', 'Wheels torqued with a torque wrench'),
      V('Žádné výstražné kontrolky brzd / ABS', 'No brake / ABS warning lights'),
      V('Zkušební jízda nízkou rychlostí v bezpečném prostoru proběhla v pořádku', 'Low-speed test drive in a safe area went fine'),
      V('Zapsáno datum výměny (další za ~2 roky)', 'Change date recorded (next in ~2 years)')
    ],
    steps: [
      {
        id: 'why', anim: 'bleed.why',
        title: V('Kdy a proč měnit brzdovou kapalinu', 'When and why to change brake fluid'),
        body: V(
          'Výrobci předepisují výměnu obvykle **každé 2 roky** bez ohledu na najeté km. Stav můžete orientačně ověřit testerem bodu varu nebo vlhkosti (pero do nádobky je jen hrubý odhad).\n\nVýměna je nutná také po výměně třmenu, hadice nebo hlavního válce a vždy, když je pedál měkký.',
          'Manufacturers usually specify a change **every 2 years** regardless of mileage. You can roughly check the condition with a boiling-point or moisture tester (a pen tester in the reservoir is only a rough estimate).\n\nA change is also needed after replacing a caliper, hose or master cylinder, and whenever the pedal is soft.'
        ),
        notes: [
          { level: 'warning', text: V('Měkký pedál může mít i jinou příčinu (netěsnost, vadný hlavní válec). Pokud kapalina ubývá, hledejte únik – samotné odvzdušnění to nevyřeší.', 'A soft pedal can have other causes (leak, faulty master cylinder). If fluid is going down, find the leak – bleeding alone will not fix it.') }
        ]
      },
      {
        id: 'method', anim: 'bleed.pressure',
        title: V('Zvolte metodu a připravte se', 'Choose a method and prepare'),
        body: V(
          '- **Tlakové zařízení (doporučeno):** nádobka je pod mírným tlakem, kapalina stále přitéká – stačí jeden člověk a nádobka nevyschne.\n- **Ve dvou přes pedál:** pomocník šlape, vy otevíráte a zavíráte šroubek. Funguje dobře, ale vyžaduje přesnou komunikaci.\n- **Podtlaková pumpička:** nasaje kapalinu u šroubku. Pozor – kolem závitu šroubku může nasávat vzduch a bubliny klamou.\n\nPřipravte nové uzavřené balení kapaliny, hadry, vodu na opláchnutí a nářadí.',
          '- **Pressure bleeder (recommended):** the reservoir is kept under mild pressure, fluid keeps flowing in – one person is enough and the reservoir never runs dry.\n- **Two-person pedal method:** a helper presses the pedal, you open and close the nipple. Works well but needs precise communication.\n- **Vacuum pump:** sucks fluid out at the nipple. Note – it can draw air past the nipple thread and the bubbles are misleading.\n\nPrepare a new sealed bottle of fluid, rags, water for rinsing and the tools.'
        ),
        notes: [
          { level: 'warning', text: V('Tlakové zařízení nikdy nenatlakujte víc, než dovoluje výrobce vozu / zařízení (obvykle cca 1–2 bar). Vyšší tlak může nádobku roztrhnout.', 'Never pressurise a bleeder above what the car / device maker allows (usually approx. 1–2 bar). Higher pressure can burst the reservoir.'), verify: true },
          { level: 'tip', text: V('Nádobu tlakového zařízení plňte novou kapalinou – ne vzduchem přímo do nádobky vozu.', 'Fill the bleeder tank with new fluid – never pressurise the car reservoir with air only.') }
        ]
      },
      {
        id: 'lift', anim: 'lift.stands',
        title: V('Zvedněte vůz a zpřístupněte šroubky', 'Lift the car and access the nipples'),
        body: V(
          'Vůz zvedněte a podepřete podle návodu **Bezpečné zvednutí vozu** – ideálně všechna 4 kola na stojanech, nebo postupně náprava po nápravě. Sundáním kol získáte lepší přístup k šroubkům.\n\nŠroubky očistěte drátěným kartáčem a nastříkejte čističem brzd. Zarezlý šroubek předem postříkejte uvolňovačem a nechte působit.',
          'Lift and support the car following the **Safely lifting the car** tutorial – ideally all 4 wheels on stands, or one axle at a time. Removing the wheels gives better access to the nipples.\n\nClean the nipples with a wire brush and spray them with brake cleaner. Soak a seized nipple with penetrating oil in advance.'
        ),
        notes: [
          { level: 'danger', text: V('Proveďte test stability (zatřesení) dřív, než pod vůz sáhnete.', 'Do the stability (shake) test before you reach under the car.') },
          { level: 'caution', text: V('Šroubky jsou duté a snadno se **utrhnou**. Používejte jen očkový klíč, nikdy otevřený. Zarezlý šroubek raději nechte v servisu.', 'Nipples are hollow and **snap easily**. Use only a ring spanner, never an open-end one. Leave a seized nipple to a workshop.') }
        ]
      },
      {
        id: 'reservoir', anim: 'bleed.syringe',
        title: V('Odsajte starou kapalinu z nádobky a doplňte novou', 'Suck old fluid from the reservoir and add new'),
        body: V(
          'Stříkačkou odsajte co nejvíc staré kapaliny z nádobky – ale **jen nad značku MIN** (ne úplně do dna). Doplňte novou kapalinou po MAX.\n\nTím ušetříte čas: nová kapalina pak k šroubkům dorazí dřív.',
          'Use the syringe to suck out as much old fluid from the reservoir as possible – but **only down to above MIN** (not to the bottom). Top up with new fluid to MAX.\n\nThis saves time: new fluid reaches the nipples sooner.'
        ),
        notes: [
          { level: 'warning', text: V('Nádobku nikdy nevysajte do sucha – vzduch se dostane do hlavního válce a ABS.', 'Never suck the reservoir dry – air gets into the master cylinder and ABS.') },
          { level: 'caution', text: V('Sítko v hrdle nádobky nevyndávejte a nic do nádobky nesmí spadnout.', 'Do not remove the strainer in the reservoir neck and do not let anything fall in.') }
        ]
      },
      {
        id: 'order', anim: 'bleed.order',
        title: V('Dodržte pořadí kol', 'Follow the wheel order'),
        body: V(
          'Obvykle se začíná **nejvzdálenějším kolem od hlavního válce** a končí nejbližším: např. pravé zadní → levé zadní → pravé přední → levé přední (u vozu s řízením vlevo).\n\nU vozů s ABS/ESP ale výrobce někdy předepisuje **jiné pořadí** (např. nejdřív přední nápravu). Platí vždy dílenská příručka pro váš vůz.',
          'You usually start with **the wheel furthest from the master cylinder** and finish with the closest: e.g. rear right → rear left → front right → front left (on a left-hand-drive car).\n\nOn cars with ABS/ESP the manufacturer sometimes specifies **a different order** (e.g. front axle first). The workshop manual for your car always wins.'
        ),
        notes: [
          { level: 'info', text: V('Pořadí si napište na papír a položte k vozu – při práci se snadno splete.', 'Write the order on paper and keep it by the car – it is easy to lose track.') }
        ]
      },
      {
        id: 'connect', anim: 'bleed.nipple',
        title: V('Nasaďte klíč a hadičku na šroubek', 'Fit the spanner and tube to the nipple'),
        body: V(
          '1. Sundejte gumovou krytku šroubku.\n2. Nasaďte **očkový klíč** (nejdřív klíč, pak hadičku).\n3. Hadičku nasuňte těsně na šroubek a druhý konec dejte do láhve s trochou kapaliny – **konec hadičky musí být ponořený**, aby se vzduch nenasál zpět.\n4. Hadičku veďte nahoru nad šroubek (smyčka) – bubliny pak lépe uvidíte.',
          '1. Remove the nipple\'s rubber cap.\n2. Fit the **ring spanner** (spanner first, then the tube).\n3. Push the tube tightly onto the nipple and put the other end in a bottle with a little fluid – **the tube end must be submerged** so air is not sucked back.\n4. Route the tube up above the nipple (a loop) – bubbles are easier to see.'
        ),
        notes: [
          { level: 'caution', text: V('Šroubek povolujte jen o **¼ až ½ otáčky**. Víc není potřeba a vzduch by mohl vnikat kolem závitu.', 'Open the nipple only **¼ to ½ turn**. More is not needed and air could get in past the thread.') }
        ]
      },
      {
        id: 'bleedWheel', anim: 'bleed.pedalCycle',
        title: V('Odvzdušněte kolo', 'Bleed the wheel'),
        body: V(
          '**Ve dvou přes pedál** – domluvte si jasné povely:\n1. Pomocník pomalu sešlápne pedál a **drží** („Dole!“).\n2. Vy povolíte šroubek ¼ otáčky – kapalina vyteče, pedál klesne.\n3. **Šroubek zavřete.**\n4. Teprve potom pomocník pedál pustí („Pustit!“).\n5. Opakujte.\n\n**S tlakovým zařízením:** zařízení natlakujte, povolte šroubek a nechte kapalinu téct, dokud není čistá; pak zavřete.',
          '**Two-person pedal method** – agree on clear commands:\n1. The helper slowly presses the pedal and **holds** it ("Down!").\n2. You open the nipple ¼ turn – fluid flows out, the pedal drops.\n3. **Close the nipple.**\n4. Only then the helper releases the pedal ("Release!").\n5. Repeat.\n\n**With a pressure bleeder:** pressurise the device, open the nipple and let fluid flow until it is clean; then close.'
        ),
        notes: [
          { level: 'warning', text: V('**Nikdy nepouštějte pedál s otevřeným šroubkem** – nasaje se vzduch zpět do třmenu.', '**Never release the pedal with the nipple open** – air is sucked back into the caliper.') },
          { level: 'caution', text: V('Pedál nešlapejte „až na podlahu“ silou, pokud je vůz starší – píst hlavního válce přejede do zkorodované části a může poškodit těsnění. Stačí plynule, cca ¾ zdvihu.', 'On an older car do not force the pedal all the way to the floor – the master cylinder piston travels into a corroded area and can damage its seals. Smoothly, about ¾ of the stroke is enough.') }
        ]
      },
      {
        id: 'clean', anim: 'bleed.color',
        title: V('Dokud nejde čistá kapalina – pak další kolo', 'Until the fluid runs clean – then the next wheel'),
        body: V(
          'Pokračujte, dokud v hadičce neteče **čistá, světlá kapalina bez bublin** (obvykle 150–250 ml na kolo). Pak šroubek **zavřete**, sundejte hadičku, nasaďte krytku a přejděte na další kolo podle pořadí.\n\nPo každém kole (u metody přes pedál i častěji) **zkontrolujte a doplňte nádobku**.',
          'Continue until **clean, light fluid without bubbles** runs through the tube (usually 150–250 ml per wheel). Then **close** the nipple, remove the tube, refit the cap and move to the next wheel in the order.\n\nAfter each wheel (more often with the pedal method) **check and top up the reservoir**.'
        ),
        specs: [{ label: V('Moment odvzdušňovacího šroubku', 'Bleed nipple torque'), value: V('jen citlivě, cca 5–10 Nm (dle příručky)', 'gently, approx. 5–10 Nm (per manual)'), verify: true }],
        notes: [
          { level: 'warning', text: V('Šroubek **nepřetahujte** – utržený šroubek ve třmenu znamená výměnu nebo vrtání třmenu.', '**Do not over-tighten** the nipple – a snapped nipple in the caliper means replacing or drilling the caliper.') },
          { level: 'tip', text: V('Pokud chodí bubliny bez konce, často je to vzduch kolem závitu šroubku – omotejte závit teflonovou páskou nebo použijte tlakovou metodu.', 'If bubbles never stop, it is often air drawn past the nipple thread – wrap the thread with PTFE tape or use the pressure method.') }
        ]
      },
      {
        id: 'abs', anim: 'bleed.abs',
        title: V('Pokud nádobka vyschla nebo pedál zůstává měkký', 'If the reservoir ran dry or the pedal stays soft'),
        body: V(
          'Pokud se do systému dostal vzduch na straně hlavního válce nebo ABS (např. nádobka vyschla), běžné odvzdušnění často nestačí. Hydraulická jednotka ABS/ESP má vlastní okruhy, které se otevřou jen **servisní funkcí v diagnostice** (čerpadlo a ventily se spustí a vy současně odvzdušňujete).\n\nBez diagnostiky: s vozem nejezděte a nechte odvzdušnění dokončit v servisu.',
          'If air got into the master cylinder or ABS side (e.g. the reservoir ran dry), normal bleeding is often not enough. The ABS/ESP hydraulic unit has its own circuits that only open with a **service function in a scan tool** (the pump and valves run while you bleed).\n\nWithout a scan tool: do not drive the car and have the bleeding finished at a workshop.'
        ),
        notes: [
          { level: 'danger', text: V('Měkký nebo „dlouhý“ pedál = vůz nesmí na silnici.', 'Soft or "long" pedal = the car must not go on the road.') }
        ]
      },
      {
        id: 'level', anim: 'brake.reservoir',
        title: V('Nastavte hladinu a uklid', 'Set the level and clean up'),
        body: V(
          'Hladinu v nádobce doplňte na **MAX** (u tlakové metody nejdřív zařízení odtlakujte a odpojte). Zavřete víčko.\n\nVšechny šroubky ještě jednou zkontrolujte (dotažené, s krytkou). Rozlitou kapalinu opláchněte vodou, třmeny a disky očistěte čističem brzd.',
          'Top up the reservoir to **MAX** (with the pressure method depressurise and disconnect the device first). Close the cap.\n\nCheck all nipples once more (tight, capped). Rinse spilled fluid with water and clean the calipers and discs with brake cleaner.'
        ),
        notes: [
          { level: 'caution', text: V('Odsátou / vytečenou kapalinu už nikdy nepoužívejte znovu.', 'Never reuse fluid that has been drained or bled out.') }
        ]
      },
      {
        id: 'pedal', anim: 'brake.pedal',
        title: V('Test pedálu', 'Pedal test'),
        body: V(
          'Nasaďte kola a dotáhněte je momentem (návod Bezpečné zvednutí vozu). Spusťte vůz.\n\nV klidu sešlápněte pedál: musí být **tvrdý a vysoko**. Při stálém tlaku na pedál **nesmí pomalu klesat**. Zkuste to i s nastartovaným motorem (posilovač) – pedál lehce klesne a pak zůstane pevný.',
          'Refit the wheels and torque them (Safely lifting the car tutorial). Lower the car.\n\nPress the pedal at rest: it must be **firm and high**. Under steady pressure it **must not slowly sink**. Try it also with the engine running (servo) – the pedal drops slightly and then stays firm.'
        ),
        notes: [
          { level: 'danger', text: V('Pedál měkký, dlouhý nebo pomalu klesá → **nejezděte**. Opakujte odvzdušnění nebo hledejte netěsnost.', 'Pedal soft, long or slowly sinking → **do not drive**. Repeat the bleeding or look for a leak.') }
        ]
      },
      {
        id: 'test', anim: 'bleed.test',
        title: V('Zkušební jízda nízkou rychlostí', 'Low-speed test drive'),
        body: V(
          'Na prázdném parkovišti nebo klidné cestě několikrát zabrzděte z 5–10 km/h, pak z 30 km/h. Vůz musí brzdit **rovně a jistě**, pedál beze změny.\n\nPo jízdě znovu zkontrolujte šroubky (nic nekape) a hladinu.',
          'In an empty car park or quiet road brake several times from 5–10 km/h, then from 30 km/h. The car must brake **straight and firmly**, pedal unchanged.\n\nAfter the drive check the nipples again (no drips) and the level.'
        ),
        notes: [
          { level: 'warning', text: V('Při jakékoli odchylce (tahá do strany, pedál se mění, kontrolka ABS) zastavte a dál nejezděte.', 'At any irregularity (pulls to one side, pedal changes, ABS light) stop and do not drive further.') }
        ]
      }
    ],
    vehicles: {
      'skoda-octavia-rs-tdi': {
        status: 'ok',
        specs: [
          { label: V('Brzdová kapalina', 'Brake fluid'), value: V('DOT 4 (VW 501 14)', 'DOT 4 (VW 501 14)') },
          { label: V('Množství na výměnu', 'Amount for a change'), value: V('cca 1 l', 'approx. 1 L'), verify: true },
          { label: V('Tlak zařízení', 'Bleeder pressure'), value: V('cca 2 bar', 'approx. 2 bar'), verify: true },
          { label: V('Pořadí kol', 'Wheel order'), value: V('dle ELSA (obecně od nejvzdálenějšího)', 'per ELSA (generally furthest first)'), verify: true }
        ],
        notes: [
          { level: 'warning', text: V('**Manuální převodovka:** hydraulika spojky sdílí nádobku s brzdami. Po výměně brzdové kapaliny odvzdušněte i **pracovní válec spojky** – jinak v něm zůstane stará kapalina.', '**Manual gearbox:** the clutch hydraulics share the reservoir with the brakes. After changing the brake fluid also bleed the **clutch slave cylinder** – otherwise old fluid stays in it.') },
          { level: 'info', text: V('Přesné pořadí kol a postup pro ESP najdete v ELSA / erWin pro váš VIN.', 'The exact wheel order and ESP procedure is in ELSA / erWin for your VIN.'), verify: true }
        ],
        extraSteps: [
          {
            after: 'clean',
            step: {
              id: 'clutch', anim: 'bleed.nipple',
              title: V('Odvzdušněte spojku (manuál)', 'Bleed the clutch (manual gearbox)'),
              body: V(
                'Odvzdušňovací šroubek pracovního válce spojky je na převodovce (přístup bývá shora po sundání baterie a vzduchového filtru nebo zespodu). Postup je stejný jako u brzd: pomocník šlape **spojkový** pedál, vy otevíráte a zavíráte šroubek, dokud nejde čistá kapalina.\n\nPo odvzdušnění vyzkoušejte řazení všech rychlostí s motorem v chodu.',
                'The clutch slave cylinder bleed nipple is on the gearbox (access is usually from above after removing the battery and air filter, or from below). The procedure is the same as for the brakes: the helper presses the **clutch** pedal, you open and close the nipple until clean fluid comes out.\n\nAfter bleeding test shifting into all gears with the engine running.'
              ),
              notes: [
                { level: 'caution', text: V('Spojkový pedál po odvzdušnění několikrát rukou vytáhněte nahoru – u VAG někdy zůstane „ležet“ u podlahy, dokud se systém neodvzdušní.', 'After bleeding pull the clutch pedal up by hand a few times – on VAG cars it sometimes stays near the floor until the system is fully bled.'), verify: true },
                { level: 'info', text: V('Přesný přístup k šroubku a postup ověřte v ELSA.', 'Verify the exact access to the nipple and procedure in ELSA.'), verify: true }
              ]
            }
          }
        ],
        finalChecks: [V('Spojka vypíná normálně, rychlosti se řadí bez drhnutí', 'Clutch disengages normally, gears shift without grinding')]
      },
      'volvo-xc60-b4': {
        status: 'caution',
        specs: [
          { label: V('Brzdová kapalina', 'Brake fluid'), value: V('DOT 4 nízkoviskózní (třída 6)', 'DOT 4 low viscosity (class 6)'), verify: true },
          { label: V('Metoda', 'Method'), value: V('Tlakové zařízení (doporučeno)', 'Pressure bleeder (recommended)') },
          { label: V('Odvzdušnění ABS/ESP', 'ABS/ESP bleed'), value: V('VIDA / kompatibilní diagnostika', 'VIDA / compatible scan tool'), verify: true }
        ],
        notes: [
          { level: 'danger', text: V('**Vzduchové odpružení:** před zvednutím aktivujte režim zvedání / vypněte regulaci výšky podle návodu Bezpečné zvednutí vozu. Jinak může vůz na stojanech sám klesnout.', '**Air suspension:** before lifting activate jacking mode / switch off level control as described in the Safely lifting the car tutorial. Otherwise the car can lower itself on the stands.') },
          { level: 'warning', text: V('Používejte jen nízkoviskózní kapalinu DOT 4 (třída 6) dle Volvo – systém ESP je na viskozitu citlivý.', 'Use only low-viscosity DOT 4 (class 6) fluid per Volvo – the ESP system is sensitive to viscosity.'), verify: true },
          { level: 'info', text: V('Elektrická parkovací brzda se odvzdušnění netýká – servisní režim EPB zde není potřeba.', 'The electric parking brake is not involved in bleeding – EPB service mode is not needed here.') }
        ],
        steps: {
          method: { notes: [{ level: 'tip', text: V('U XC60 doporučujeme tlakové zařízení – nádobka je hůř přístupná a metoda přes pedál zvyšuje riziko vzduchu v hydraulické jednotce.', 'For the XC60 we recommend a pressure bleeder – the reservoir is harder to reach and the pedal method raises the risk of air in the hydraulic unit.') }] },
          order: { notes: [{ level: 'info', text: V('Pořadí kol a případnou servisní funkci odvzdušnění ověřte ve VIDA.', 'Verify the wheel order and any bleed service function in VIDA.'), verify: true }] },
          abs: { body: V('Pokud se vzduch dostal do hydraulické jednotky, použijte funkci odvzdušnění ABS/ESP ve **VIDA** nebo kompatibilní diagnostice s podporou Volvo.', 'If air got into the hydraulic unit, use the ABS/ESP bleed function in **VIDA** or a compatible scan tool with Volvo support.') }
        }
      },
      'mb-cl500-c216': {
        status: 'caution',
        specs: [
          { label: V('Brzdová kapalina', 'Brake fluid'), value: V('DOT 4 Plus (MB 331.0)', 'DOT 4 Plus (MB 331.0)'), verify: true },
          { label: V('Pořadí kol', 'Wheel order'), value: V('dle WIS', 'per WIS'), verify: true },
          { label: V('Odvzdušňovací šroubky', 'Bleed nipples'), value: V('u některých třmenů 2 na třmen (vnitřní + vnější)', 'some calipers have 2 per caliper (inner + outer)'), verify: true }
        ],
        notes: [
          { level: 'danger', text: V('**ABC podvozek:** vůz zvedejte jen podle návodu Bezpečné zvednutí vozu a pracujte jen na stojanech.', '**ABC suspension:** lift the car only per the Safely lifting the car tutorial and work only on stands.') },
          { level: 'info', text: V('Pokud má třmen dva šroubky, odvzdušňujte nejdřív ten, který určuje WIS (obvykle vnitřní, pak vnější), každý dokud nejde čistá kapalina.', 'If a caliper has two nipples, bleed first the one WIS specifies (usually inner, then outer), each until clean fluid flows.'), verify: true }
        ],
        steps: {
          abs: { body: V('Odvzdušnění hydraulické jednotky ESP se dělá přes **XENTRY / DAS** nebo diagnostiku s podporou Mercedes.', 'The ESP hydraulic unit is bled using **XENTRY / DAS** or a scan tool with Mercedes support.') }
        }
      },
      'toyota-gr-yaris': {
        status: 'ok',
        specs: [
          { label: V('Brzdová kapalina', 'Brake fluid'), value: V('dle uživatelské příručky (DOT 4 / Toyota spec)', 'per owner\'s manual (DOT 4 / Toyota spec)'), verify: true },
          { label: V('Přední třmeny', 'Front calipers'), value: V('4pístkové – 2 šroubky (vnitřní + vnější)', '4-piston – 2 nipples (inner + outer)'), verify: true },
          { label: V('Okruh', 'Track use'), value: V('výměna před každou sezónou', 'change before every season') }
        ],
        notes: [
          { level: 'warning', text: V('**Okruh:** běžná kapalina se při okruhovém brzdění vaří. Pro okruh použijte kvalitní vysokoteplotní kapalinu na bázi glykolu (DOT 4 / 5.1) a měňte ji často. **Nikdy DOT 5 (silikon).**', '**Track use:** normal fluid boils under track braking. For track use a quality high-temperature glycol-based fluid (DOT 4 / 5.1) and change it often. **Never DOT 5 (silicone).**') },
          { level: 'info', text: V('Manuální převodovka: hydraulika spojky pravděpodobně sdílí nádobku s brzdami – po výměně odvzdušněte i pracovní válec spojky.', 'Manual gearbox: the clutch hydraulics likely share the reservoir with the brakes – after the change also bleed the clutch slave cylinder.'), verify: true }
        ],
        steps: {
          connect: { notes: [{ level: 'info', text: V('4pístkový přední třmen má šroubek na **vnitřní i vnější** polovině. Odvzdušňujte nejdřív vnitřní, pak vnější (ověřte v TIS).', 'The 4-piston front caliper has a nipple on **both the inner and outer** half. Bleed the inner first, then the outer (verify in TIS).'), verify: true }] },
          abs: { body: V('Odvzdušnění akčního členu ABS/VSC se dělá přes **Techstream** nebo kompatibilní diagnostiku Toyota.', 'Bleeding the ABS/VSC actuator is done with **Techstream** or a compatible Toyota scan tool.') }
        },
        finalChecks: [V('Spojka vypíná normálně (pokud se odvzdušňovala)', 'Clutch disengages normally (if it was bled)')]
      },
      /* -------------------------------------------------- Citroën Jumper (van) */
      'citroen-jumper-22hdi': {
        status: 'ok',
        specs: [
          { label: V('Brzdová kapalina', 'Brake fluid'), value: 'DOT 4', verify: true },
          { label: V('Pořadí odvzdušnění', 'Bleeding order'), value: V('dle dílenské příručky (vůz s ABS)', 'per workshop manual (ABS vehicle)'), verify: true },
          { label: V('Spojka', 'Clutch'), value: V('Hydraulická – obvykle sdílí nádržku s brzdami', 'Hydraulic – usually shares the reservoir with the brakes'), verify: true }
        ],
        notes: [
          { level: 'info', text: V('Dlouhá vedení k zadní nápravě dodávky = víc kapaliny. Mějte připraveno cca 1–1,5 l.', 'Long lines to the rear axle of a van = more fluid. Have approx. 1–1.5 L ready.'), verify: true },
          { level: 'warning', text: V('Manuální převodovka: spojka obvykle sdílí nádržku s brzdami. Po výměně brzdové kapaliny vyměňte i kapalinu ve spojce (viz krok níže).', 'Manual gearbox: the clutch usually shares the reservoir with the brakes. After replacing the brake fluid, replace the clutch fluid too (see the step below).'), verify: true }
        ],
        steps: {
          lift: { notes: [{ level: 'danger', text: V('Dodávka: hever a stojany s nosností min. 3 t, náklad vyložený.', 'Van: jack and stands rated at least 3 t, cargo unloaded.') }] },
          order: { notes: [{ level: 'info', text: V('Pořadí kol a případný postup pro jednotku ABS ověřte v dílenské příručce podle VIN.', 'Verify the wheel order and any ABS unit procedure in the workshop manual by VIN.'), verify: true }] }
        },
        extraSteps: [
          {
            after: 'clean',
            step: {
              id: 'jmpClutch', anim: 'bleed.nipple',
              title: V('Spojka: vyměňte kapalinu i v ní', 'Clutch: replace the fluid there too'),
              body: V(
                '1. Najděte odvzdušňovací šroubek spojky (u převodovky – přesné místo ověřte v příručce).\n2. Hadička do lahve, šroubek povolit, pomocník pomalu šlape spojku.\n3. Vypouštějte, dokud nevytéká čistá kapalina bez bublin. Hladina v nádržce nesmí klesnout pod MIN.\n4. Šroubek dotáhnout, pedál spojky musí mít plný chod a vracet se.',
                '1. Find the clutch bleed nipple (on the gearbox – verify the exact location in the manual).\n2. Tube into a bottle, open the nipple, the helper presses the clutch slowly.\n3. Bleed until clean fluid without bubbles comes out. The reservoir level must not drop below MIN.\n4. Close the nipple; the clutch pedal must have full travel and return.'
              ),
              notes: [
                { level: 'caution', text: V('Přístup k odvzdušňovacímu šroubku spojky je u dodávky stísněný – místo ověřte v dílenské příručce.', 'Access to the clutch bleed nipple on the van is tight – verify its location in the workshop manual.'), verify: true },
                { level: 'warning', text: V('Pokud pedál spojky zůstane u podlahy, nejezděte – systém je zavzdušněný.', 'If the clutch pedal stays on the floor, do not drive – the system has air in it.') }
              ]
            }
          }
        ],
        finalChecks: [V('Pedál spojky se vrací a spojka čistě vypíná', 'The clutch pedal returns and the clutch disengages cleanly')]
      }
    }
  });
})(window.STU);
