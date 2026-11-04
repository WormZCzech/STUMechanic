/* Tutorial: Exhaust replacement and legal modifications. */
(function (S) {
  'use strict';
  var V = function (cs, en) { return { cs: cs, en: en }; };

  S.registerTutorial({
    id: 'exhaust',
    level: 2,
    status: 'caution',
    thumb: 'exhaust.layout',
    time: V('1–4 hod.', '1–4 h'),
    title: V('Výměna výfuku a legální úpravy', 'Exhaust replacement & legal modifications'),
    summary: V('Výměna tlumičů a trubek, závěsy, těsnost. Homologované sportovní výfuky, klapky, koncovky, downpipe.', 'Replacing silencers and pipes, hangers, leak check. Homologated sport exhausts, valves, tips, downpipe.'),
    intro: V(
      'Výfuk odvádí jedovaté plyny, tlumí hluk a čistí emise (katalyzátor, filtr pevných částic). Výměna zadních dílů je dobře zvládnutelná, největší nepřítel je **rez a teplo**.\n\nÚpravy: popisujeme **jen legální cestu** – homologované díly (značka E/e), doklady a zápis. **Neposkytujeme návody na odstranění DPF/GPF, katalyzátoru ani EGR** ani na obcházení emisních systémů – je to v ČR/EU nelegální, vůz neprojde STK, hrozí vysoké pokuty a škodí to zdraví lidí kolem.\n\nPro zvednutí vozu použijte návod **Bezpečné zvednutí vozu**.',
      'The exhaust removes poisonous gases, reduces noise and cleans emissions (catalyst, particulate filter). Replacing the rear parts is very doable – the biggest enemies are **rust and heat**.\n\nModifications: we only describe **the legal route** – homologated parts (E/e mark), documents and registration. **We do not provide instructions to remove the DPF/GPF, catalyst or EGR** or to defeat emission systems – it is illegal in CZ/EU, the car fails its inspection (STK), fines are high and it harms people around you.\n\nTo lift the car use the **Safely lifting the car** tutorial.'
    ),
    safety: [
      { level: 'danger', text: V('Pod vůz jen na **stojanech** (viz Bezpečné zvednutí vozu). Při povolování rezavých šroubů působí velké síly – vůz se nesmí ani pohnout.', 'Only get under the car on **axle stands** (see Safely lifting the car). Undoing rusty bolts needs big forces – the car must not move at all.') },
      { level: 'danger', text: V('**Oxid uhelnatý (CO) zabíjí bez varování.** Motor s netěsným nebo rozpojeným výfukem nikdy nespouštějte v garáži – jen venku.', '**Carbon monoxide (CO) kills without warning.** Never run an engine with a leaking or open exhaust in a garage – outdoors only.') },
      { level: 'warning', text: V('**Pracujte jen na studeném výfuku.** Katalyzátor a filtr pevných částic mají po jízdě i 300–600 °C a chladnou přes hodinu.', '**Work only on a cold exhaust.** The catalyst and particulate filter can be 300–600 °C after a drive and take over an hour to cool.') },
      { level: 'warning', text: V('Ohřev hořákem / indukcí jen s maximální opatrností: v blízkosti jsou **palivové a brzdové trubky, nádrž, kabely a ochrana podvozku**. Hasicí přístroj na dosah, žádné ohřívání u nádrže.', 'Heating with a torch / induction only with extreme care: **fuel and brake lines, the tank, wiring and underbody coating** are close by. Fire extinguisher within reach, never heat near the tank.') },
      { level: 'warning', text: V('**Ochranné brýle jsou povinné** – při práci nad hlavou padá rez a saze do očí. Rukavice proti ostrým hranám.', '**Safety glasses are mandatory** – working overhead, rust and soot fall into your eyes. Gloves against sharp edges.') },
      { level: 'caution', text: V('Lambda sondy, snímače teploty a tlaku jsou citlivé a drahé. Před demontáží odpojte jejich konektory a nenechte díly viset na kabelech.', 'Lambda sensors, temperature and pressure sensors are delicate and expensive. Unplug their connectors before removal and never let parts hang by the wires.') },
      { level: 'info', text: V('**Nelegální úpravy (odstranění DPF/GPF/katalyzátoru/EGR, „simulátory“, vypnutí v řídicí jednotce) v tomto návodu nenajdete.** Takto upravený vůz nesmí na silnici.', '**Illegal modifications (removing DPF/GPF/catalyst/EGR, "simulators", disabling in the ECU) are not in this tutorial.** A car modified like that is not allowed on public roads.') }
    ],
    tools: [
      V('Hever + stojany (viz návod na zvedání)', 'Jack + axle stands (see the lifting tutorial)'),
      V('Odrezovač / penetrační olej', 'Penetrating oil'),
      V('Ráčna, hlavice, očkoploché klíče, prodloužená páka', 'Ratchet, sockets, combination spanners, breaker bar'),
      V('Momentový klíč', 'Torque wrench'),
      V('Kleště na pryžové závěsy výfuku (nebo páčidlo)', 'Exhaust hanger pliers (or a pry bar)'),
      V('Klíč na lambda sondy (vyříznutá hlavice)', 'Lambda sensor socket (slotted)'),
      V('Popruh / druhý stojan na podepření výfuku', 'Strap / second stand to support the exhaust'),
      V('Úhlová bruska nebo pilka (jen na zapečené objímky)', 'Angle grinder or hacksaw (only for seized clamps)'),
      V('Hasicí přístroj', 'Fire extinguisher'),
      V('Ochranné brýle, rukavice', 'Safety glasses, gloves')
    ],
    parts: [
      V('Nový díl výfuku (u úprav vždy s homologací pro váš vůz)', 'New exhaust part (for modifications always homologated for your car)'),
      V('Nová těsnění přírub a nové matice/šrouby (samojisticí)', 'New flange gaskets and new nuts/bolts (self-locking)'),
      V('Nové objímky (nepoužívat staré deformované)', 'New clamps (do not reuse old deformed ones)'),
      V('Nové pryžové závěsy', 'New rubber hangers'),
      V('Měděná pasta na závity lambda sond (pokud nová sonda nemá pastu nanesenou)', 'Copper anti-seize for lambda sensor threads (if the new sensor is not pre-coated)')
    ],
    finalChecks: [
      V('Výfuk se nikde nedotýká karoserie, podvozku ani tepelných štítů', 'The exhaust touches no body, suspension or heat shield'),
      V('Žádné syčení ani saze u spojů (kontrola venku)', 'No hissing or soot at the joints (checked outdoors)'),
      V('Všechny konektory sond zapojené, žádná kontrolka motoru', 'All sensor connectors plugged in, no engine warning light'),
      V('Žádné nářadí, hadry ani kartony pod vozem (požár!)', 'No tools, rags or cardboard under the car (fire!)'),
      V('Po 50–100 km a vychladnutí spoje znovu dotáhnout', 'Re-tighten the joints after 50–100 km once cold'),
      V('U úprav: doklady o homologaci ve voze, případně zápis na STK', 'For modifications: approval documents in the car, registration at STK if required')
    ],
    steps: [
      {
        id: 'layout', anim: 'exhaust.layout',
        title: V('Seznamte se s výfukem', 'Get to know the exhaust'),
        body: V(
          'Výfuk se skládá z dílů (od motoru dozadu):\n- **svod / downpipe** (u turbomotorů za turbem)\n- **katalyzátor** a u novějších aut **filtr pevných částic** (DPF u naft, GPF u benzínů)\n- **střední díl / střední tlumič**\n- **zadní tlumič** s koncovkou\n\nVše visí na **pryžových závěsech**, díly jsou spojené přírubami nebo objímkami. Na trubkách jsou **lambda sondy** a u naft také snímače teploty a tlaku.',
          'The exhaust consists of these parts (from the engine backwards):\n- **manifold / downpipe** (on turbo engines after the turbo)\n- **catalyst** and on newer cars a **particulate filter** (DPF on diesels, GPF on petrol)\n- **mid pipe / centre silencer**\n- **rear silencer** with the tip\n\nEverything hangs on **rubber hangers**; parts are joined by flanges or clamps. The pipes carry **lambda sensors**, diesels also temperature and pressure sensors.'
        ),
        notes: [
          { level: 'info', text: V('Kupujte díly podle VIN / kódu motoru. Délky a polohy závěsů se liší i u stejného modelu.', 'Buy parts by VIN / engine code. Lengths and hanger positions differ even within one model.') }
        ]
      },
      {
        id: 'legal', anim: 'exhaust.legal',
        title: V('Plánujete úpravu? Nejdřív legislativa', 'Planning a modification? Legal first'),
        body: V(
          'Před nákupem sportovního dílu si ověřte:\n- díl má **homologaci (značka E/e a číslo schválení)** a platí **pro váš typ vozu a motor**\n- dodavatel dodá **doklady** (schválení, příp. technický protokol)\n- hluk vozu zůstane **v limitu** zapsaném v technickém průkazu\n- zda je nutný **zápis do technického průkazu / ověření na STK** (u změny výfukového systému obvykle ano)\n\nKatalyzátor a filtr pevných částic musí **vždy zůstat** – sportovní katalyzátor jen homologovaný pro váš vůz.',
          'Before buying a sport part, check:\n- the part has an **approval (E/e mark and approval number)** valid **for your car type and engine**\n- the supplier provides **documents** (approval, possibly a technical report)\n- the car\'s noise stays **within the limit** in the registration documents\n- whether **registration in the vehicle documents / an STK check** is required (usually yes for exhaust system changes)\n\nThe catalyst and particulate filter must **always stay** – a sport catalyst only if homologated for your car.'
        ),
        notes: [
          { level: 'warning', text: V('Postup schválení a zápisu (STK, zkušebna, registr) se mění – aktuální požadavky si ověřte na STK nebo u dodavatele dílu, než díl koupíte.', 'The approval and registration process (STK, test station, registry) changes – check the current requirements with an STK station or the parts supplier before buying.'), verify: true },
          { level: 'info', text: V('Typické předpisy: EHK/OSN R59 (náhradní tlumiče) a R92 (neoriginální výfukové systémy), hlukové limity dle R51.', 'Typical regulations: UN ECE R59 (replacement silencers) and R92 (non-original exhaust systems), noise limits per R51.'), verify: true },
          { level: 'tip', text: V('Pokud díl jen nahrazujete originálem nebo kvalitní náhradou se stejnými parametry, zápis obvykle není potřeba.', 'If you only replace a part with the original or a quality equivalent with the same specs, registration is usually not needed.') }
        ]
      },
      {
        id: 'inspect', anim: 'exhaust.leak',
        title: V('Najděte vadný díl', 'Find the faulty part'),
        body: V(
          'Při studeném motoru a voze na stojanech prohlédněte:\n- **díry a prorezlá místa** (hlavně tlumiče a ohyby)\n- **černé saze** u spojů = netěsnost\n- **prasklé nebo protažené závěsy**\n- **uvolněné tepelné štíty** (chrastění)\n\nPak nechte motor krátce běžet **venku** a poslouchejte syčení – rukama nesahejte.',
          'With a cold engine and the car on stands, inspect:\n- **holes and rusted-through spots** (mainly silencers and bends)\n- **black soot** at joints = leak\n- **cracked or stretched hangers**\n- **loose heat shields** (rattling)\n\nThen run the engine briefly **outdoors** and listen for hissing – keep your hands away.'
        ),
        notes: [
          { level: 'warning', text: V('Netěsnost před lambda sondou nebo u svodu může způsobit chyby motoru a únik CO do kabiny. Řešte ji hned.', 'A leak before a lambda sensor or at the manifold can cause engine faults and CO entering the cabin. Fix it straight away.') }
        ]
      },
      {
        id: 'lift', anim: 'lift.stands',
        title: V('Zvedněte vůz a nechte výfuk vychladnout', 'Lift the car and let the exhaust cool'),
        body: V(
          'Zvedněte vůz na stojany dle návodu **Bezpečné zvednutí vozu** – ideálně celý vůz vodorovně, ať máte místo pod celou délkou výfuku. Výfuk musí být **studený na dotek**.',
          'Put the car on stands following **Safely lifting the car** – ideally the whole car level so you have room under the full length. The exhaust must be **cold to the touch**.'
        ),
        notes: [
          { level: 'danger', text: V('Test stability (zatřesení) před prací pod vozem. Rezavé šrouby se povolují velkou silou.', 'Do the stability (shake) test before working under the car. Rusty bolts need a lot of force.') }
        ]
      },
      {
        id: 'soak', anim: 'exhaust.soak',
        title: V('Nastříkejte rezavé spoje', 'Soak the rusty fasteners'),
        body: V(
          'Všechny matice, šrouby a objímky nastříkejte **penetračním olejem** a nechte 10–15 minut působit (u velmi rezavých i přes noc, opakovaně).\n\nPoužijte **šestihrannou hlavici** (ne dvanáctihrannou), aby se zrezlá matice nezakulatila.',
          'Spray all nuts, bolts and clamps with **penetrating oil** and leave it for 10–15 minutes (very rusty ones overnight, repeatedly).\n\nUse a **6-point socket** (not 12-point) so the rusty nut does not round off.'
        ),
        notes: [
          { level: 'warning', text: V('Penetrační olej je hořlavý – nestříkejte na horký výfuk a před použitím hořáku ho nechte odvětrat.', 'Penetrating oil is flammable – never spray it on a hot exhaust and let it evaporate before using a torch.') },
          { level: 'tip', text: V('Lambda sondy povolujte, dokud je výfuk lehce teplý (ne horký) – jdou ven snáz. Rukavice!', 'Undo lambda sensors while the exhaust is slightly warm (not hot) – they come out easier. Gloves!') }
        ]
      },
      {
        id: 'sensors', anim: 'exhaust.sensor',
        title: V('Odpojte snímače a podepřete výfuk', 'Unplug the sensors and support the exhaust'),
        body: V(
          'Pokud měněný díl nese snímače, **odpojte nejdřív jejich konektory** (obvykle na karoserii) a pak snímač vyšroubujte klíčem na lambda sondy. Kabel nikdy nekruťte.\n\nVýfuk **podepřete** popruhem nebo stojanem, aby po rozpojení nespadl a nevisel na flexi trubce nebo na zbylých závěsech.',
          'If the part you replace carries sensors, **unplug their connectors first** (usually on the body), then unscrew the sensor with a lambda sensor socket. Never twist the wire.\n\n**Support** the exhaust with a strap or stand so it does not drop after separating or hang on the flex pipe or the remaining hangers.'
        ),
        notes: [
          { level: 'warning', text: V('Celý výfuk váží i 20–40 kg. Spadnutím zraní obličej – pracujte z boku, ne přímo pod ním.', 'A complete exhaust can weigh 20–40 kg. If it drops it injures your face – work from the side, not directly underneath.') },
          { level: 'caution', text: V('Flexi (vlnovcová) trubka se ohybem nebo tahem poškodí a začne netěsnit.', 'The flex pipe gets damaged by bending or pulling and starts to leak.') }
        ]
      },
      {
        id: 'release', anim: 'exhaust.clamp',
        title: V('Rozpojte spoje', 'Separate the joints'),
        body: V(
          'Povolte matice přírub nebo objímek. **Zapečené šrouby raději uřízněte** (pilka, bruska), než abyste strhli závit ve svodu či katalyzátoru – oprava závitu je drahá.\n\nPokud měníte jen zadní díl a spoj je bez příruby (přesuvka), lze starou trubku těsně před spojem uříznout a nový díl připojit **objímkou** – ověřte, že to výrobce dílu podporuje.',
          'Undo the flange or clamp nuts. **Cut seized bolts** (hacksaw, grinder) rather than stripping a thread in the manifold or catalyst – thread repair is expensive.\n\nIf you only replace the rear part and the joint has no flange (slip joint), the old pipe can be cut just before the joint and the new part joined with a **clamp** – check that the part manufacturer supports this.'
        ),
        notes: [
          { level: 'warning', text: V('Při řezání: brýle, rukavice, jiskry pryč od palivových trubek a nádrže. Nikdy neřežte u nádrže nebo palivového filtru.', 'When cutting: glasses, gloves, sparks away from fuel lines and the tank. Never cut near the tank or fuel filter.') },
          { level: 'caution', text: V('Neřežte tam, kde je katalyzátor nebo filtr pevných částic – jen v trubce za nimi.', 'Never cut into the catalyst or particulate filter – only in the pipe behind them.') }
        ]
      },
      {
        id: 'hangers', anim: 'exhaust.hanger',
        title: V('Sundejte závěsy a starý díl', 'Remove the hangers and the old part'),
        body: V(
          'Pryžové závěsy namažte **mýdlovou vodou nebo silikonovým sprejem** a stáhněte je z čepů kleštěmi na závěsy nebo páčidlem. Pak starý díl vyndejte.\n\nZkontrolujte závěsy – popraskané nebo protažené vyměňte.',
          'Lubricate the rubber hangers with **soapy water or silicone spray** and lever them off the pins with hanger pliers or a pry bar. Then remove the old part.\n\nCheck the hangers – replace any that are cracked or stretched.'
        ),
        notes: [
          { level: 'caution', text: V('Na pryž nepoužívejte olej ani penetrační sprej – rozleptá ji a závěs brzy praskne.', 'Never use oil or penetrating spray on rubber – it rots it and the hanger soon breaks.') },
          { level: 'warning', text: V('Páčidlo může sklouznout – držte obličej mimo dráhu páky.', 'A pry bar can slip – keep your face out of its path.') }
        ]
      },
      {
        id: 'fit', anim: 'exhaust.fit',
        title: V('Nasaďte nový díl – volně', 'Fit the new part – loosely'),
        body: V(
          'Nový díl nejdřív **zavěste do závěsů**, pak nasaďte **nová těsnění** a spoje jen **volně** našroubujte (matice na pár závitů). Výfuk tak ještě můžete posunout a vyrovnat.\n\nZašroubujte zpět snímače (nové těsnicí kroužky, měděná pasta jen na závit, ne na hlavici sondy) a připojte konektory.',
          'First **hang the new part in its hangers**, then fit **new gaskets** and only **loosely** start the joints (nuts a few turns). That way you can still slide and align the exhaust.\n\nRefit the sensors (new sealing rings, anti-seize only on the thread, never on the sensor tip) and plug in the connectors.'
        ),
        notes: [
          { level: 'caution', text: V('Měděná pasta na špičce lambda sondy ji zničí. Nová sonda mívá pastu už nanesenou.', 'Anti-seize on the lambda sensor tip ruins it. New sensors usually come pre-coated.') }
        ]
      },
      {
        id: 'align', anim: 'exhaust.align',
        title: V('Vyrovnejte výfuk', 'Align the exhaust'),
        body: V(
          'Výfuk posuňte tak, aby:\n- **koncovka byla uprostřed výřezu** v nárazníku\n- měl všude **mezeru k tepelným štítům, karoserii a podvozku** (orientačně alespoň 2 cm)\n- závěsy byly zatížené rovnoměrně (ne natažené na jednu stranu)',
          'Slide the exhaust so that:\n- **the tip is centred in the bumper cutout**\n- it has **clearance to heat shields, body and suspension** everywhere (as a guide at least 2 cm)\n- the hangers are loaded evenly (not stretched to one side)'
        ),
        notes: [
          { level: 'warning', text: V('Výfuk dotýkající se plastu nebo kabelů může způsobit **požár**. Nárazník u koncovky zkontrolujte i po jízdě.', 'An exhaust touching plastic or wiring can cause a **fire**. Check the bumper near the tip again after a drive.') },
          { level: 'info', text: V('Minimální vzdálenost závisí na voze – řiďte se polohou tepelných štítů a pokyny výrobce dílu.', 'Minimum clearance depends on the car – follow the heat shield positions and the part maker\'s instructions.'), verify: true }
        ]
      },
      {
        id: 'tighten', anim: 'exhaust.tighten',
        title: V('Dotáhněte spoje od motoru dozadu', 'Tighten the joints from the engine backwards'),
        body: V(
          'Spoje dotahujte **postupně od motoru směrem dozadu**, u přírub střídavě a rovnoměrně. Objímky dotáhněte tak, aby trubky nešly protočit, ale nezdeformovaly se.',
          'Tighten the joints **in order from the engine towards the rear**, flange nuts alternately and evenly. Tighten clamps so the pipes cannot rotate, but without crushing them.'
        ),
        specs: [{ label: V('Utahovací momenty', 'Torques'), value: V('dle příručky / výrobce dílu', 'per manual / part maker') }],
        notes: [
          { level: 'caution', text: V('Přetažené šrouby přírub se v teple utrhnou. Používejte nové samojisticí matice a momentový klíč.', 'Over-tightened flange bolts snap in the heat. Use new self-locking nuts and a torque wrench.') }
        ]
      },
      {
        id: 'leak', anim: 'exhaust.leak',
        title: V('Zkouška těsnosti – venku', 'Leak test – outdoors'),
        body: V(
          'Spusťte vůz ze stojanů (nebo nechte stát na stojanech **venku** a nikdo pod vozem). Nastartujte a poslouchejte syčení u spojů. Kontrolka motoru nesmí svítit.\n\nPo zahřátí motor vypněte a zkontrolujte, zda se nic nedotýká. **Po vychladnutí** spoje přetáhněte.',
          'Lower the car (or leave it on stands **outdoors** with nobody under it). Start the engine and listen for hissing at the joints. No engine warning light.\n\nAfter warming up, switch off and check nothing is touching. **Once cold**, re-check the joint tightness.'
        ),
        notes: [
          { level: 'danger', text: V('Za chodu motoru nikdo pod vozem. Výfuk se zahřeje na stovky °C během minut.', 'Nobody under the car with the engine running. The exhaust reaches hundreds of °C within minutes.') }
        ]
      },
      {
        id: 'mods', anim: 'exhaust.valve',
        title: V('Úpravy: klapky, ovladače a koncovky', 'Modifications: valves, controllers and tips'),
        body: V(
          '**Výfuk s klapkou:** klapka mění hlasitost. Elektrické nebo podtlakové ovládání připojte **přesně podle návodu výrobce** (pojistka, kabeláž mimo horké díly). Homologace obvykle platí jen pro popsaný režim klapky – pro silnici dodržte předepsané nastavení.\n\n**Koncovky:** nasuňte na trubku a zajistěte objímkou. Nesmí přesahovat obrys vozu ani mít ostré hrany, a nesmí měnit tlak/hluk mimo limit.',
          '**Valved exhaust:** the flap changes the volume. Wire the electric or vacuum control **exactly per the manufacturer\'s instructions** (fuse, wiring away from hot parts). The approval usually only covers the described valve mode – keep the prescribed setting on the road.\n\n**Tips:** slide onto the pipe and secure with a clamp. They must not stick out past the body or have sharp edges, and must not push noise beyond the limit.'
        ),
        notes: [
          { level: 'warning', text: V('Kabeláž ovladače veďte daleko od výfuku a pohyblivých dílů podvozku, s vlastní pojistkou. Zkrat = požár.', 'Route controller wiring far from the exhaust and moving suspension parts, with its own fuse. A short = fire.') },
          { level: 'caution', text: V('Ovladače, které „vypínají“ hlukové režimy mimo homologaci, nejsou na silnici legální.', 'Controllers that override noise modes beyond the approval are not road legal.') }
        ]
      },
      {
        id: 'downpipe', anim: 'exhaust.downpipe',
        title: V('Downpipe / sportovní katalyzátor – co to obnáší', 'Downpipe / sport catalyst – what it involves'),
        body: V(
          'Výměna downpipe (trubka za turbem) je **nejnáročnější úprava**:\n- je nutný **sportovní katalyzátor s homologací pro váš vůz** (žádné „rovné trubky“)\n- většinou je nutná **kalibrace řídicí jednotky** od specialisty (jinak chyby lambda sond a nouzový režim)\n- je potřeba **doklad, měření emisí a zápis** do technického průkazu\n- práce u turba: velké teploty, zapečené šrouby, citlivé snímače\n\nDoporučujeme specializovanou dílnu, která dodá díly, kalibraci i papíry v jednom.',
          'Replacing the downpipe (the pipe after the turbo) is **the most demanding modification**:\n- a **sport catalyst homologated for your car** is required (no "straight pipes")\n- usually an **ECU calibration** by a specialist is needed (otherwise lambda faults and limp mode)\n- you need **documents, an emissions test and registration** in the vehicle documents\n- work near the turbo: high temperatures, seized bolts, delicate sensors\n\nWe recommend a specialist workshop that provides parts, calibration and paperwork in one package.'
        ),
        notes: [
          { level: 'warning', text: V('Downpipe bez katalyzátoru nebo s nehomologovaným katalyzátorem je na silnici nelegální a vůz neprojde měřením emisí.', 'A downpipe without a catalyst or with a non-homologated one is illegal on the road and fails the emissions test.') },
          { level: 'info', text: V('Kalibrace mění záruku a pojistné podmínky – informujte pojišťovnu.', 'A calibration affects warranty and insurance terms – inform your insurer.') }
        ]
      }
    ],
    vehicles: {
      'skoda-octavia-rs-tdi': {
        status: 'ok',
        specs: [
          { label: V('Emisní systém', 'Emission system'), value: V('oxidační katalyzátor + DPF (filtr pevných částic)', 'oxidation catalyst + DPF (particulate filter)') },
          { label: V('Snímače', 'Sensors'), value: V('lambda sonda, snímače teploty (EGT), snímač diferenčního tlaku DPF', 'lambda sensor, temperature sensors (EGT), DPF differential pressure sensor'), verify: true },
          { label: V('Typicky vyměňované díly', 'Typically replaced parts'), value: V('střední a zadní díl (koncový tlumič)', 'mid and rear section (rear silencer)') }
        ],
        notes: [
          { level: 'warning', text: V('**DPF musí zůstat.** Odstranění DPF je nelegální a vůz neprojde měřením kouřivosti na STK.', '**The DPF must stay.** Removing the DPF is illegal and the car fails the smoke test at STK.') },
          { level: 'caution', text: V('Hadičky snímače diferenčního tlaku DPF nesmí být prasklé ani přehozené – jinak chyby a nefunkční regenerace.', 'The DPF differential pressure sensor hoses must not be cracked or swapped – otherwise faults and failed regeneration.'), verify: true },
          { level: 'info', text: V('Zvukové úpravy dieselu mají malý efekt. Realistické jsou homologované koncové díly a koncovky.', 'Sound modifications on a diesel have little effect. Realistic options are homologated rear silencers and tips.') }
        ],
        steps: {
          downpipe: {
            body: V('U 2.0 TDI CR je za turbem **oxidační katalyzátor a DPF v jednom celku blízko motoru** (ověřte). Legální „sportovní downpipe“ pro tento motor prakticky neexistuje – doporučujeme tento celek ponechat originální.', 'On the 2.0 TDI CR, the **oxidation catalyst and DPF form one unit close to the engine** behind the turbo (verify). A legal "sport downpipe" for this engine practically does not exist – we recommend keeping this unit original.'),
            notes: [{ level: 'warning', text: V('Jakýkoli zásah do DPF/katalyzátoru u tohoto vozu = nelegální úprava.', 'Any interference with the DPF/catalyst on this car = illegal modification.') }]
          },
          sensors: { notes: [{ level: 'caution', text: V('Snímače teploty výfukových plynů jsou zapečené – povolujte opatrně s penetračním olejem, utržený snímač v DPF je drahý.', 'Exhaust temperature sensors seize – undo carefully with penetrating oil, a snapped sensor in the DPF is expensive.'), verify: true }] }
        }
      },
      'mb-cl500-c216': {
        status: 'caution',
        specs: [
          { label: V('Systém', 'System'), value: V('dvojitý výfuk (dvě větve V8)', 'dual exhaust (two V8 banks)') },
          { label: V('Katalyzátory', 'Catalysts'), value: V('pro každou řadu válců (předkatalyzátory + hlavní)', 'per cylinder bank (pre-cats + main)'), verify: true },
          { label: V('Lambda sondy', 'Lambda sensors'), value: V('4 ks (2 před a 2 za katalyzátory)', '4 pcs (2 before and 2 after the catalysts)'), verify: true }
        ],
        notes: [
          { level: 'warning', text: V('Dlouhý a těžký dvojitý výfuk – vždy s pomocníkem a podepřený ve více bodech.', 'Long and heavy dual exhaust – always with a helper and supported at several points.') },
          { level: 'warning', text: V('Při zvedání respektujte ABC podvozek – viz návod na zvedání.', 'Respect the ABC suspension when lifting – see the lifting tutorial.') },
          { level: 'info', text: V('Pro M273 existují homologované cat-back systémy a klapkové výfuky – vyžadujte doklad pro C216 CL 500.', 'Homologated cat-back and valved systems exist for the M273 – ask for documentation valid for the C216 CL 500.'), verify: true }
        ],
        steps: {
          tighten: { notes: [{ level: 'tip', text: V('Obě větve dotahujte souběžně, ať jsou koncovky ve stejné výšce a symetrické.', 'Tighten both branches in parallel so the tips sit at the same height and symmetric.') }] }
        }
      },
      'volvo-xc60-b4': {
        status: 'caution',
        specs: [
          { label: V('Emisní systém', 'Emission system'), value: V('katalyzátor + filtr pevných částic GPF', 'catalyst + gasoline particulate filter (GPF)'), verify: true },
          { label: V('Podvozek', 'Suspension'), value: V('vzduchové odpružení – před zvednutím režim zvedání', 'air suspension – jacking mode before lifting') }
        ],
        notes: [
          { level: 'danger', text: V('**Vzduchové odpružení:** před zvednutím vypněte regulaci výšky / aktivujte režim pro zvedání dle uživatelské příručky. Jinak může vůz na stojanech klesnout nebo se zvednout.', '**Air suspension:** before lifting, switch off level control / activate jacking mode per the owner\'s manual. Otherwise the car can lower or rise on the stands.'), verify: true },
          { level: 'warning', text: V('GPF musí zůstat. Na vozech v záruce může jakákoli úprava výfuku komplikovat záruku.', 'The GPF must stay. On cars under warranty any exhaust modification may complicate the warranty.') },
          { level: 'caution', text: V('Neoriginální klapkové výfuky a ovladače se nemusí snést s elektronikou vozu a aktualizacemi (OTA). Ověřte kompatibilitu u dodavatele.', 'Aftermarket valved exhausts and controllers may not get along with the car\'s electronics and over-the-air updates. Check compatibility with the supplier.'), verify: true },
          { level: 'info', text: V('48V systém se výfuku netýká, ale kabeláž pod vozem nepoškoďte (oranžové / označené kabely).', 'The 48 V system is not involved, but do not damage wiring under the car (orange / marked cables).') }
        ],
        steps: {
          lift: { notes: [{ level: 'danger', text: V('Nejdřív režim zvedání vzduchového podvozku, pak zvedat.', 'Air suspension jacking mode first, then lift.'), verify: true }] },
          downpipe: { body: V('U tohoto vozu je katalyzátor/GPF blízko motoru a vůz je v záruce. Úprava downpipe se nedoporučuje – vyžadovala by kalibraci a homologaci, kterou pro tento model prakticky nezískáte.', 'On this car the catalyst/GPF sits close to the engine and the car is under warranty. A downpipe change is not recommended – it would need a calibration and approval that are practically unavailable for this model.'), notes: [{ level: 'info', text: V('Uspořádání katalyzátoru/GPF ověřte ve VIDA.', 'Verify the catalyst/GPF layout in VIDA.'), verify: true }] }
        }
      },
      'toyota-gr-yaris': {
        status: 'caution',
        specs: [
          { label: V('Emisní systém', 'Emission system'), value: V('katalyzátor + GPF (evropská verze)', 'catalyst + GPF (EU version)'), verify: true },
          { label: V('Sériový výfuk', 'Stock exhaust'), value: V('s řízenou klapkou (variabilní)', 'with a controlled valve (variable)'), verify: true }
        ],
        notes: [
          { level: 'warning', text: V('GPF v evropské verzi musí zůstat. Pro GR Yaris existují homologované cat-back systémy – vyžadujte doklady pro evropskou verzi 2024.', 'The GPF on the EU version must stay. Homologated cat-back systems exist for the GR Yaris – ask for documentation for the 2024 EU version.'), verify: true },
          { level: 'caution', text: V('Nízký vůz: nízkoprofilový hever, opatrně kolem difuzoru.', 'Low car: low-profile jack, careful around the diffuser.') },
          { level: 'info', text: V('Okruhové „decat“ díly jsou jen pro uzavřenou trať a na silnici nelegální.', 'Track-only "decat" parts are for closed circuits only and illegal on the road.') }
        ],
        steps: {
          mods: { notes: [{ level: 'info', text: V('Sériová klapka je řízená motorovou jednotkou. Při výměně za neoriginální systém ověřte, jak výrobce řeší konektor klapky (záslepka / adaptér), aby nesvítila kontrolka.', 'The stock valve is controlled by the engine ECU. When fitting an aftermarket system, check how the maker handles the valve connector (plug / adapter) so no warning light comes on.'), verify: true }] },
          downpipe: { notes: [{ level: 'warning', text: V('Downpipe na G16E vyžaduje kalibraci a homologovaný katalyzátor – jinak nelegální a riziko poškození motoru.', 'A downpipe on the G16E requires a calibration and a homologated catalyst – otherwise illegal and a risk of engine damage.') }] }
        }
      }
    }
  });
})(window.STU);
