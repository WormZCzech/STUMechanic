/* Tutorial: Bodywork – small dent & rust repair on a non-structural outer panel (filler, primer, paint). */
(function (S) {
  'use strict';
  var V = function (cs, en) { return { cs: cs, en: en }; };

  S.registerTutorial({
    id: 'bodywork',
    level: 3,
    thumb: 'body.layers',
    status: 'caution',
    time: V('2–3 dny (vč. schnutí)', '2–3 days (incl. curing)'),
    title: V('Klempířské práce: oprava promáčkliny a koroze (tmel, základ, lak)', 'Bodywork: dent & rust repair (filler, primer, paint)'),
    summary: V('Vyrovnání malé promáčkliny, odstranění povrchové rzi, tmelení, plnič, báze a bezbarvý lak.', 'Straightening a small dent, removing surface rust, filler, primer, base coat and clear coat.'),
    intro: V(
      'Tento návod pokrývá **malé promáčkliny a povrchovou / okrajovou korozi na nenosném vnějším dílu** (dveře, blatník, kapota, víko kufru) – zhruba do velikosti dlaně.\n\n**Mimo rozsah tohoto návodu (patří do karosárny):**\n\n- nosné a deformační části: sloupky, prahy, podlaha, podélníky, rámy střechy\n- prorezlé díry vyžadující svařování nebo výměnu plechu\n- poškození po nehodě s deformací geometrie / skeletu\n- oblast airbagů, senzorů nárazu a radarů asistentů\n- díly z ultra-pevné oceli, hliníku nebo kompozitu, pokud nemáte správné vybavení\n\nKlempířina je řemeslo – počítejte s tím, že první oprava nebude dokonalá. Zkuste si postup nejdřív na starém dílu z vrakoviště.',
      'This tutorial covers **small dents and surface / edge rust on a non-structural outer panel** (door, wing, bonnet, boot lid) – roughly up to the size of a palm.\n\n**Out of scope for this tutorial (body shop job):**\n\n- structural and crash parts: pillars, sills, floor, chassis rails, roof frames\n- rust-through holes needing welding or panel replacement\n- accident damage with distorted geometry / body shell\n- areas around airbags, crash sensors and driver-assistance radars\n- ultra-high-strength steel, aluminium or composite parts unless you have the right equipment\n\nBodywork is a craft – expect your first repair not to be perfect. Practise on an old panel from a scrapyard first.'
    ),
    safety: [
      { level: 'danger', text: V('**2K laky, plniče a bezbarvé laky obsahují isokyanáty.** Vdechnutí mlhy může způsobit trvalé astma a těžké alergie i po jediné expozici. Nikdy nestříkejte 2K bez **polomasky s filtry A2P3 (lépe masky s přívodem vzduchu)**, a to ani „jen chvilku“. Obyčejný respirátor proti prachu nechrání.', '**2K paints, primers and clear coats contain isocyanates.** Inhaling the mist can cause permanent asthma and severe allergies, even after a single exposure. Never spray 2K without a **half mask with A2P3 filters (preferably a supplied-air mask)**, not even "just for a moment". A plain dust mask does not protect you.') },
      { level: 'danger', text: V('**Požár:** Výpary ředidel a odmašťovačů jsou těžší než vzduch a vznětlivé. Jiskry z brusky letí několik metrů. Nebruste a nestříkejte poblíž palivové nádrže, palivových vedení, plynového kotle ani otevřeného ohně. Zákaz kouření. Hasicí přístroj na dosah.', '**Fire:** Solvent and degreaser vapours are heavier than air and flammable. Grinder sparks fly several metres. Never grind or spray near the fuel tank, fuel lines, a gas boiler or open flame. No smoking. Fire extinguisher within reach.') },
      { level: 'warning', text: V('**Prach z broušení** (tmel, starý lak, rez) – respirátor P2/P3, ochranné brýle a ideálně odsávání. Staré laky mohou obsahovat olovo a chromáty.', '**Sanding dust** (filler, old paint, rust) – P2/P3 respirator, goggles and ideally dust extraction. Old paints can contain lead and chromates.') },
      { level: 'warning', text: V('**Úhlová bruska:** vždy oběma rukama, s krytem, brýle/štít. Kotouč s nižšími max. otáčkami, než má bruska, se může roztrhnout.', '**Angle grinder:** always two hands, guard fitted, goggles / face shield. A disc rated for lower RPM than the grinder can burst.') },
      { level: 'warning', text: V('Před svařováním, prací poblíž senzorů, airbagů nebo kabeláže **odpojte 12V baterii** (a u hybridů i trakční / 48V systém dle výrobce). Svařování není součástí tohoto návodu.', 'Before welding or working near sensors, airbags or wiring, **disconnect the 12 V battery** (and on hybrids the traction / 48 V system per the manufacturer). Welding is not part of this tutorial.') },
      { level: 'caution', text: V('Nitrilové rukavice (tmel, ředidla a laky dráždí kůži), dobré větrání, ale bez průvanu a prachu při stříkání. Pracovní teplota obvykle **15–25 °C**, vlhkost pod cca 75 % – přesné hodnoty jsou v technickém listu (TL) výrobce materiálu.', 'Nitrile gloves (filler, thinners and paints irritate skin), good ventilation, but no draught or dust while spraying. Working temperature usually **15–25 °C**, humidity below approx. 75 % – exact values are in the manufacturer\'s technical data sheet (TDS).'), verify: true },
      { level: 'caution', text: V('Hadry napuštěné ředidlem nebo olejem mohou samovolně vzplanout. Ukládejte je do uzavřené plechové nádoby nebo namočené ve vodě a zlikvidujte jako nebezpečný odpad. Zbytky barev a ředidel nelijte do kanálu.', 'Rags soaked with solvent or oil can self-ignite. Store them in a closed metal container or soaked in water and dispose of them as hazardous waste. Never pour paint or thinner residue down the drain.') }
    ],
    tools: [
      V('Polomaska s filtry A2P3 (pro stříkání 2K), respirátor P2/P3 (broušení)', 'Half mask with A2P3 filters (for spraying 2K), P2/P3 respirator (sanding)'),
      V('Uzavřené ochranné brýle, nitrilové rukavice, hasicí přístroj', 'Sealed goggles, nitrile gloves, fire extinguisher'),
      V('Magnet (test materiálu), lampa / zářivka pro kontrolu odrazu', 'Magnet (material test), lamp / striplight for reflection check'),
      V('Klempířské kladivo + kovadlinka (sada), případně lepicí vytahovák', 'Body hammer + dolly (set), optionally a glue puller kit'),
      V('Excentrická bruska nebo úhlová bruska s lamelovým / brusným kotoučem', 'Orbital sander or angle grinder with flap / sanding disc'),
      V('Brusné bloky (tvrdý a měkký), brusný papír P80, P180, P240, P400, P600, P1500–P3000', 'Sanding blocks (hard and soft), sandpaper P80, P180, P240, P400, P600, P1500–P3000'),
      V('Stěrky na tmel (plast / ocel), míchací podložka', 'Filler spreaders (plastic / steel), mixing board'),
      V('Stříkací pistole (HVLP, tryska ~1,3 mm báze/lak, ~1,7–1,8 mm plnič) + kompresor s odlučovačem vody a oleje', 'Spray gun (HVLP, ~1.3 mm nozzle for base/clear, ~1.7–1.8 mm for primer) + compressor with water/oil separator'),
      V('Rotační / excentrická leštička s kotouči', 'Rotary / dual-action polisher with pads'),
      V('Kelímky s ryskami, sítka, váha', 'Graduated cups, strainers, scale')
    ],
    parts: [
      V('Odmašťovač silikonů (antisilikon), utěrky bez žmolků, lepicí (tack) hadřík', 'Silicone & wax remover, lint-free wipes, tack cloth'),
      V('Krycí páska (i na vytvoření měkké hrany), krycí papír / fólie', 'Masking tape (incl. soft-edge foam), masking paper / film'),
      V('Konvertor rzi (jen na zbytky v pórech) a epoxidový základ 2K', 'Rust converter (only for residues in pits) and 2K epoxy primer'),
      V('Polyesterový tmel 2K (plnicí + jemný) s tužidlem', '2K polyester body filler (standard + finishing) with hardener'),
      V('Kontrolní prášek (guide coat)', 'Guide coat'),
      V('Plnič 2K + tužidlo + ředidlo', '2K primer filler + hardener + thinner'),
      V('Báze v odstínu vozu (dle kódu barvy) + ředidlo', 'Base coat in the car\'s colour (by paint code) + thinner'),
      V('Bezbarvý lak 2K + tužidlo', '2K clear coat + hardener'),
      V('Brusná a leštící pasta', 'Cutting compound and polish'),
      V('Dutinový vosk / ochrana spodku (zevnitř dílu po opravě rzi)', 'Cavity wax / underbody protection (inside the panel after rust repair)')
    ],
    finalChecks: [
      V('Rez odstraněna na 100 % a holý kov ošetřen základem – žádná rez pod tmelem', 'Rust 100 % removed and bare metal primed – no rust under the filler'),
      V('Při pohledu proti světlu nejsou vidět vlny ani okraje opravy', 'No waves or repair edges visible when looking against the light'),
      V('Lak plně vytvrzený dle technického listu před leštěním a mytím v myčce', 'Paint fully cured per the data sheet before polishing and car-wash use'),
      V('Senzory, kamery a radary čisté a funkční (žádné chybové hlášky)', 'Sensors, cameras and radars clean and working (no error messages)'),
      V('Vnitřní strana opravovaného dílu ošetřena dutinovým voskem', 'Inner side of the repaired panel treated with cavity wax'),
      V('Odpad (hadry, zbytky barev, filtry) uložen bezpečně a zlikvidován jako nebezpečný odpad', 'Waste (rags, paint residue, filters) stored safely and disposed of as hazardous waste')
    ],
    steps: [
      {
        id: 'assess', anim: 'body.assess',
        title: V('Posuďte poškození a materiál dílu', 'Assess the damage and panel material'),
        body: V(
          '1. Díl očistěte a podívejte se na něj **proti světlu** (zářivka, lampa). Rovné odrazy se v místě promáčkliny ohnou – tak zjistíte skutečný rozsah, který je často větší, než se zdá.\n2. Přejeďte dlaní v rukavici přes povrch se zavřenýma očima – nerovnosti ucítíte.\n3. **Test magnetem:** drží = ocel. Nedrží = hliník, plast nebo kompozit → jiný postup a materiály.\n4. U rzi zjistěte, jestli je jen **povrchová** (bublinky pod lakem), nebo už **prorezlá** (díra, měkký plech při zatlačení šroubovákem).',
          '1. Clean the panel and look at it **against the light** (striplight, lamp). Straight reflections bend where the dent is – this shows the real extent, which is often larger than it seems.\n2. Run your gloved palm over the surface with your eyes closed – you will feel the unevenness.\n3. **Magnet test:** sticks = steel. Does not stick = aluminium, plastic or composite → different procedure and materials.\n4. For rust, find out whether it is only **surface** rust (bubbles under paint) or already **rust-through** (hole, soft metal when pressed with a screwdriver).'
        ),
        notes: [
          { level: 'danger', text: V('Je-li poškozený **sloupek, práh, podlaha, podélník, rám střechy** nebo jsou-li po nehodě nerovné spáry dveří/kapoty, nejde o kosmetickou vadu. Vůz patří do karosárny na kontrolu geometrie – takto opravený vůz nemusí ochránit posádku při nárazu.', 'If a **pillar, sill, floor, chassis rail or roof frame** is damaged, or door/bonnet gaps are uneven after an accident, it is not cosmetic. The car belongs in a body shop for a geometry check – a car repaired this way may not protect occupants in a crash.') },
          { level: 'warning', text: V('Prorezlá díra se nesmí „zalepit“ tmelem – tmel nasaje vlhkost a rez pokračuje zevnitř. Prorezlý plech se vyřízne a zavaří nový (svařování mimo rozsah tohoto návodu).', 'A rust-through hole must not be "patched" with filler – filler absorbs moisture and the rust continues from inside. Rusted-through metal is cut out and a new patch welded in (welding is outside the scope of this tutorial).') },
          { level: 'tip', text: V('Malé promáčkliny bez poškozeného laku jde často opravit bez lakování metodou PDR (vytlačování zevnitř) – zeptejte se specialisty, vyjde to levněji.', 'Small dents with undamaged paint can often be fixed without repainting using PDR (paintless dent repair) – ask a specialist, it is cheaper.') }
        ]
      },
      {
        id: 'prep', anim: 'body.ppe',
        title: V('Připravte pracoviště a ochranné pomůcky', 'Prepare the workspace and protective equipment'),
        body: V(
          '- Pracujte v suché, větrané garáži s teplotou cca 15–25 °C, ne na přímém slunci.\n- Odkliďte hořlaviny, připravte hasicí přístroj.\n- Na broušení respirátor P2/P3 a brýle, na stříkání 2K **polomaska A2P3** nebo maska s přívodem vzduchu, nitrilové rukavice a kombinéza.\n- Přečtěte si **technické listy (TL)** všech materiálů – poměry míchání, časy odvětrání a schnutí se liší výrobce od výrobce.',
          '- Work in a dry, ventilated garage at approx. 15–25 °C, not in direct sunlight.\n- Remove flammables, have a fire extinguisher ready.\n- For sanding a P2/P3 respirator and goggles, for spraying 2K an **A2P3 half mask** or supplied-air mask, nitrile gloves and overalls.\n- Read the **technical data sheets (TDS)** of all materials – mixing ratios, flash and drying times differ between manufacturers.'
        ),
        notes: [
          { level: 'danger', text: V('Filtry A2P3 mají omezenou životnost – po otevření je měňte dle výrobce. Pokud cítíte zápach ředidla uvnitř masky, okamžitě odejděte na čerstvý vzduch a vyměňte filtry.', 'A2P3 filters have a limited life – replace them as the manufacturer specifies once opened. If you smell solvent inside the mask, leave for fresh air immediately and replace the filters.') },
          { level: 'warning', text: V('Při stříkání nesmí být v garáži nikdo bez masky – ani děti, ani zvířata. Mlha se drží ve vzduchu dlouho po stříkání.', 'Nobody without a mask may be in the garage while spraying – no children, no animals. The mist stays in the air long after spraying.') }
        ]
      },
      {
        id: 'clean', anim: 'body.clean',
        title: V('Umyjte a odmastěte díl', 'Wash and degrease the panel'),
        body: V(
          'Díl umyjte vodou se šamponem a nechte oschnout. Pak ho otřete **odmašťovačem silikonů**: jeden hadr namočený, druhým hned dosucha, vždy jedním směrem.\n\nOdmašťujte **před broušením** – jinak brusný papír zatře vosk a silikon do laku.',
          'Wash the panel with water and car shampoo and let it dry. Then wipe it with **silicone & wax remover**: one cloth wet, the other immediately dry, always in one direction.\n\nDegrease **before sanding** – otherwise the sandpaper drives wax and silicone into the paint.'
        ),
        notes: [
          { level: 'caution', text: V('Zbytky silikonu (vosky, leštěnky, spreje na plasty) způsobí v laku „rybí oka“ – krátery, které nejdou opravit jinak než přebroušením.', 'Silicone residue (waxes, polishes, plastic sprays) causes "fish eyes" in the paint – craters that can only be fixed by sanding back.') },
          { level: 'tip', text: V('Na díl po odmaštění nesahejte holou rukou – mastnota z kůže také vadí.', 'Do not touch the panel with bare hands after degreasing – skin oil also causes defects.') }
        ]
      },
      {
        id: 'mask', anim: 'body.mask',
        title: V('Zakryjte okolí', 'Mask the surroundings'),
        body: V(
          'Krycí páskou a papírem zakryjte sousední díly, sklo, gumy, světla, lišty a spáry. Při broušení chrání okolí před škrábanci, při stříkání před mlhou.\n\nPřed stříkáním maskování obnovte – na hranách opravy se hodí **pěnová páska / ohnutá páska** (měkká hrana), aby nevznikl ostrý schod v laku.',
          'Use masking tape and paper to cover adjacent panels, glass, rubbers, lights, trims and gaps. During sanding it protects against scratches, during spraying against overspray.\n\nRenew the masking before spraying – at the repair edges use **foam tape / back-rolled tape** (soft edge) so no hard step forms in the paint.'
        ),
        notes: [
          { level: 'caution', text: V('Používejte autolakýrnickou pásku – obyčejná páska nechá lepidlo nebo se při ředidlech odlepí.', 'Use automotive masking tape – ordinary tape leaves adhesive or lifts with solvents.') }
        ]
      },
      {
        id: 'dent', anim: 'body.dentPull',
        title: V('Vyrovnejte promáčklinu', 'Straighten the dent'),
        body: V(
          'Cíl: dostat plech co nejblíž původnímu tvaru, aby stačila **tenká** vrstva tmelu.\n\n- **Kladivo a kovadlinka:** je-li přístup zezadu (sundané čalounění dveří, podběh), přitlačte kovadlinku zespodu a lehkými údery kladiva pracujte **od okrajů promáčkliny ke středu**.\n- **Lepicí vytahovák:** bez přístupu zezadu nalepte tavnou pistolí trn do středu a postupně táhněte; lepidlo pak uvolněte isopropylalkoholem.\n\nNa konci by žádné místo nemělo vyčnívat **nad** původní povrch.',
          'Goal: get the metal as close to its original shape as possible so only a **thin** layer of filler is needed.\n\n- **Hammer and dolly:** if there is access from behind (door trim removed, wheel arch liner), hold the dolly behind and work with light hammer taps **from the edges of the dent towards the centre**.\n- **Glue puller:** without rear access, glue a tab to the centre with a hot-glue gun and pull gradually; release the glue with isopropyl alcohol.\n\nAt the end, no spot should stick out **above** the original surface.'
        ),
        notes: [
          { level: 'warning', text: V('Silné údery **natahují plech** – vznikne „boule“, která přeskakuje (olejová plechovka) a jde jen těžko srovnat. Raději mnoho lehkých úderů.', 'Heavy blows **stretch the metal** – you get an "oil-can" bulge that pops in and out and is very hard to fix. Many light taps are better.') },
          { level: 'warning', text: V('Před sundáním čalounění dveří odpojte baterii, pokud jsou ve dveřích boční airbagy nebo senzory nárazu, a dodržte postup výrobce.', 'Before removing a door trim, disconnect the battery if the door contains side airbags or crash sensors, and follow the manufacturer\'s procedure.') },
          { level: 'caution', text: V('Plech neohřívejte hořákem – mění se jeho pevnost a ochrana proti korozi (zinek) shoří.', 'Do not heat the metal with a torch – it changes its strength and the zinc corrosion protection burns off.') }
        ]
      },
      {
        id: 'grind', anim: 'body.grind',
        title: V('Obruste na holý kov a odstraňte veškerou rez', 'Sand to bare metal and remove all rust'),
        body: V(
          '1. Brusným papírem / kotoučem **P80** obruste lak v místě opravy na holý kov.\n2. Rez odstraňte **úplně** – i 2–3 cm za její viditelný okraj, rez pod lakem leze dál, než je vidět.\n3. Přechod lak → základ → kov **zkoste (feather)** jemnějším papírem (P120–P180) do plynulého kruhu – nesmí být cítit žádný schod.\n4. Okolí, kam půjde plnič, zmatněte P240–P320.',
          '1. Use **P80** sandpaper / disc to sand the paint in the repair area down to bare metal.\n2. Remove the rust **completely** – also 2–3 cm beyond its visible edge, rust under paint spreads further than it looks.\n3. **Feather** the paint → primer → metal transition with finer paper (P120–P180) into a smooth ring – you must not feel any step.\n4. Scuff the surrounding area where primer will go with P240–P320.'
        ),
        notes: [
          { level: 'warning', text: V('Jiskry z brusky: žádné hořlaviny, palivová nádrž ani vedení v blízkosti. Brýle a respirátor P3 povinně.', 'Grinder sparks: no flammables, fuel tank or lines nearby. Goggles and P3 respirator are mandatory.') },
          { level: 'caution', text: V('Úhlovou bruskou se drženou dlouho na jednom místě plech přehřejete a zkroutíte. Pohybujte se plynule a nepoužívejte hrubé kotouče na tenký plech.', 'Holding an angle grinder on one spot overheats and warps the panel. Keep moving and do not use coarse discs on thin sheet metal.') },
          { level: 'info', text: V('Konvertor rzi je jen pro zbytky v pórech, které nejdou vybrousit. Na souvislou rez nepomůže. Po něm použijte základ podle TL (některé konvertory nejsou kompatibilní s epoxidem).', 'Rust converter is only for residues in pits that cannot be sanded out. It does not fix solid rust. Afterwards use primer per the TDS (some converters are not compatible with epoxy).') }
        ]
      },
      {
        id: 'epoxy', anim: 'body.epoxy',
        title: V('Ošetřete holý kov epoxidovým základem', 'Protect bare metal with epoxy primer'),
        body: V(
          'Holý kov odmastěte a **co nejdříve** (ideálně do pár hodin) ho přestříkejte tenkou vrstvou **2K epoxidového základu**. Epoxid dobře drží na kovu a chrání ho proti korozi.\n\nPolyesterový tmel se nanáší buď přímo na čistý zbroušený kov, nebo na vybroušený epoxid – podle technického listu tmelu.',
          'Degrease the bare metal and **as soon as possible** (ideally within a few hours) spray a thin coat of **2K epoxy primer**. Epoxy adheres well to metal and protects it from corrosion.\n\nPolyester filler goes either directly onto clean, sanded bare metal or onto sanded epoxy – depending on the filler\'s data sheet.'
        ),
        notes: [
          { level: 'danger', text: V('Epoxidový základ 2K se stříká – platí stejná ochrana dýchacích cest jako u ostatních 2K materiálů (A2P3 / přívod vzduchu).', '2K epoxy primer is sprayed – the same respiratory protection applies as for other 2K materials (A2P3 / supplied air).') },
          { level: 'caution', text: V('Holý kov nechytejte holou rukou a nenechávejte ho přes noc – vlhkost a pot spustí korozi ještě před nanesením základu.', 'Do not touch bare metal with bare hands and do not leave it overnight – moisture and sweat start corrosion before primer goes on.') }
        ]
      },
      {
        id: 'mix', anim: 'body.mix',
        title: V('Namíchejte tmel s tužidlem', 'Mix the filler with hardener'),
        body: V(
          'Na čistou podložku dejte jen tolik tmelu, kolik zpracujete za pár minut. Přidejte tužidlo – obvykle **2–3 % hmotnosti** (proužek tužidla přes průměr hrudky tmelu, dle TL).\n\nMíchejte **stíráním a překládáním** stěrkou, ne šleháním – vzduchové bubliny by v tmelu udělaly póry. Hotová směs má **jednotnou barvu bez pruhů**.',
          'Put only as much filler on a clean board as you can use in a few minutes. Add hardener – usually **2–3 % by weight** (a stripe of hardener across the diameter of the filler blob, per the TDS).\n\nMix by **spreading and folding** with the spreader, not whipping – air bubbles would leave pinholes. The finished mix has an **even colour with no streaks**.'
        ),
        specs: [{ label: V('Tužidlo', 'Hardener'), value: V('cca 2–3 % (dle TL)', 'approx. 2–3 % (per TDS)') }, { label: V('Doba zpracování', 'Working time'), value: V('cca 4–5 min při 20 °C', 'approx. 4–5 min at 20 °C'), verify: true }],
        notes: [
          { level: 'warning', text: V('**Moc tužidla není „rychlejší a pevnější“.** Přebytečný peroxid v tmelu později prokreslí lakem skvrny (prokrvácení) a tmel bude křehký. Málo tužidla = tmel nevytvrdne a lepí.', '**More hardener is not "faster and stronger".** Excess peroxide later bleeds through the paint as stains and makes the filler brittle. Too little hardener = the filler never cures and stays sticky.') },
          { level: 'caution', text: V('Tužidlo (peroxid) dráždí oči a kůži – rukavice a brýle. Při zasažení oka vyplachujte vodou 15 minut a vyhledejte lékaře.', 'Hardener (peroxide) irritates eyes and skin – gloves and goggles. If it gets in the eye, rinse with water for 15 minutes and see a doctor.') },
          { level: 'tip', text: V('Při nižší teplotě tmel tvrdne pomaleji – i tak tužidla nepřidávejte víc, raději ohřejte místnost.', 'At lower temperatures filler cures more slowly – still do not add more hardener, warm the room instead.') }
        ]
      },
      {
        id: 'filler', anim: 'body.filler',
        title: V('Naneste tmel v tenkých vrstvách', 'Apply the filler in thin layers'),
        body: V(
          '1. První tenkou vrstvu **vtlačte** pevně stěrkou do povrchu (dobrá přilnavost, žádné bubliny).\n2. Další vrstvy nanášejte, až předchozí vytvrdne, a postupně dorovnejte tvar.\n3. Poslední vrstvu nechte **mírně přeplněnou** nad okolní povrch – při broušení se srovná.\n\nTmel nanášejte jen na zbroušený podklad a ne přes neobroušený lak kolem.',
          '1. **Press** the first thin layer firmly into the surface with the spreader (good adhesion, no bubbles).\n2. Apply further layers once the previous one has cured, gradually building the shape.\n3. Leave the last layer **slightly proud** of the surrounding surface – sanding will level it.\n\nApply filler only onto the sanded area, never over unsanded surrounding paint.'
        ),
        specs: [{ label: V('Max. celková tloušťka tmelu', 'Max. total filler thickness'), value: V('cca 3 mm (dle TL)', 'approx. 3 mm (per TDS)'), verify: true }],
        notes: [
          { level: 'warning', text: V('Silná vrstva tmelu praská, odpadává a propadá se. Pokud potřebujete víc než pár mm, vraťte se ke kroku vyrovnání plechu.', 'A thick filler layer cracks, falls off and sinks. If you need more than a few mm, go back to the straightening step.') },
          { level: 'caution', text: V('Polyesterový tmel je porézní a saje vlhkost – nikdy ho nenechávejte bez plniče venku ani ho nemyjte vodou (broušení tmelu jen nasucho).', 'Polyester filler is porous and absorbs moisture – never leave it unprimed outdoors or wet it (sand filler dry only).') }
        ]
      },
      {
        id: 'shape', anim: 'body.blockSand',
        title: V('Vybruste tvar blokem (P80 → P180 → P240)', 'Block sand the shape (P80 → P180 → P240)'),
        body: V(
          '1. Na vytvrzený tmel naneste **kontrolní prášek** (guide coat).\n2. Brusným blokem brouste **křížem** (do X) P80, dokud prášek nezmizí z vyvýšených míst. Kde prášek zůstal, je důlek → doplňte tmel.\n3. Postupně přejděte na P180 a P240 a **zkoste okraje** tmelu do okolního laku.\n4. Kontrolujte dlaní a proti světlu. Hotovo, když je povrch hladký a nikde necítíte přechod.',
          '1. Apply **guide coat** to the cured filler.\n2. With a sanding block sand **criss-cross** (X pattern) with P80 until the guide coat disappears from the high spots. Where guide coat remains there is a low spot → add filler.\n3. Move up to P180 and P240 and **feather the edges** of the filler into the surrounding paint.\n4. Check with your palm and against the light. Done when the surface is smooth and you cannot feel any transition.'
        ),
        notes: [
          { level: 'caution', text: V('Nikdy nebruste jen prsty nebo dlaní přes papír – vybrousíte vlny. Blok musí ležet naplocho a kopírovat tvar dílu.', 'Never sand with just your fingers or palm on the paper – you will sand waves into it. The block must lie flat and follow the panel shape.') },
          { level: 'warning', text: V('Prach z tmelu – respirátor P2/P3 a ideálně brusku s odsáváním.', 'Filler dust – P2/P3 respirator and ideally a sander with extraction.') }
        ]
      },
      {
        id: 'primer', anim: 'body.primer',
        title: V('Nastříkejte plnič 2K', 'Spray 2K primer filler'),
        body: V(
          'Obnovte maskování, místo odmastěte a otřete lepicím hadříkem. Plnič namíchejte s tužidlem a ředidlem **přesně podle TL** (často na váze nebo kelímku s ryskami) a přeceďte sítkem.\n\nStříkejte 2–3 vrstvy ze vzdálenosti cca 15–20 cm, každý pruh **překrývá předchozí o 50 %**. Každou další vrstvu dejte o kousek větší a mezi vrstvami nechte odvětrat (zmatní).',
          'Renew the masking, degrease and wipe with a tack cloth. Mix the primer with hardener and thinner **exactly per the TDS** (often by scale or graduated cup) and strain it.\n\nSpray 2–3 coats from approx. 15–20 cm, each pass **overlapping the previous by 50 %**. Make each coat slightly larger and let it flash off (turns matt) between coats.'
        ),
        specs: [{ label: V('Odvětrání mezi vrstvami', 'Flash-off between coats'), value: V('cca 5–10 min (dle TL)', 'approx. 5–10 min (per TDS)'), verify: true }],
        notes: [
          { level: 'danger', text: V('**Isokyanáty:** stříkáte 2K materiál – polomaska A2P3 nebo přívod vzduchu, brýle, rukavice, kombinéza. Nikdo další v místnosti.', '**Isocyanates:** you are spraying 2K material – A2P3 half mask or supplied air, goggles, gloves, overalls. Nobody else in the room.') },
          { level: 'caution', text: V('Kompresor musí mít odlučovač vody a oleje – kapka oleje ve vzduchu udělá v laku krátery.', 'The compressor needs a water and oil separator – one drop of oil in the air causes craters in the paint.') },
          { level: 'tip', text: V('Nastavení pistole si vyzkoušejte na papíře nebo zkušebním plechu: tvar stopy má být rovnoměrný ovál.', 'Test the gun settings on paper or a test panel first: the spray pattern should be an even oval.') }
        ]
      },
      {
        id: 'wetsand', anim: 'body.wetSand',
        title: V('Vybruste plnič za mokra (P400–P600)', 'Wet sand the primer (P400–P600)'),
        body: V(
          'Po úplném vytvrzení plniče (dle TL, často přes noc nebo po vysušení infralampou) naneste kontrolní prášek a brouste blokem **za mokra P400**, pak **P600**. Okolní lak, kam bude zasahovat báze a lak, zmatněte P600–P800 nebo brusnou houbičkou.\n\nPovrch nakonec opláchněte, osušte a nechte úplně vyschnout.',
          'Once the primer is fully cured (per TDS, often overnight or after an infrared lamp), apply guide coat and block sand **wet with P400**, then **P600**. Scuff the surrounding paint where base and clear will go with P600–P800 or a scuff pad.\n\nFinally rinse, dry and let the surface dry completely.'
        ),
        notes: [
          { level: 'caution', text: V('Pokud probrousíte až na kov nebo tmel, místo znovu ošetřete základem / plničem. Báze na holém tmelu se propadne a bude vidět.', 'If you sand through to metal or filler, prime that spot again. Base coat over bare filler sinks and shows.') }
        ]
      },
      {
        id: 'base', anim: 'body.base',
        title: V('Nastříkejte bázi (barvu)', 'Spray the base coat (colour)'),
        body: V(
          '1. **Kód barvy** najdete na štítku vozu (viz poznámky k vašemu vozu). Barvu nechte namíchat v prodejně autolaků – u metalíz s odstínem podle konkrétního vozu.\n2. Vždy nejdřív **nastříkejte zkušební plech** a porovnejte odstín na denním světle.\n3. Stříkejte tenké vrstvy, dokud báze nekryje (obvykle 2–3), s odvětráním mezi vrstvami. U metalíz poslední vrstvu jako jemný „mlžný“ nástřik pro sjednocení efektu.\n4. U opravy na části dílu bázi **rozmlžte do okolí** (přechod) – lak pak stříkejte přes celý díl.',
          '1. The **paint code** is on the car\'s label (see notes for your vehicle). Have the paint mixed by an automotive paint supplier – for metallics matched to your actual car.\n2. Always **spray a test panel** first and compare the shade in daylight.\n3. Spray thin coats until the base covers (usually 2–3), flashing off between coats. For metallics apply the last coat as a light "drop coat" to even out the effect.\n4. For a partial-panel repair **blend the base into the surroundings** – then clear coat the whole panel.'
        ),
        notes: [
          { level: 'warning', text: V('Báze bývá 1K, ale ředidla jsou zdraví škodlivá a hořlavá – respirátor s filtrem A, větrání, žádný otevřený oheň.', 'Base coat is often 1K, but its thinners are harmful and flammable – respirator with A filter, ventilation, no open flame.') },
          { level: 'caution', text: V('Báze nemá lesk ani ochranu – bez bezbarvého laku zůstane matná a měkká. Lak je nutno nanést v časovém okně dle TL.', 'Base coat has no gloss or protection – without clear coat it stays matt and soft. Clear must be applied within the time window per the TDS.') }
        ]
      },
      {
        id: 'clear', anim: 'body.clear',
        title: V('Nastříkejte bezbarvý lak 2K a nechte vytvrdnout', 'Spray 2K clear coat and let it cure'),
        body: V(
          'Po odvětrání báze (zmatní, dle TL) nastříkejte **2 mokré vrstvy bezbarvého 2K laku** s odvětráním mezi nimi. První vrstva střední, druhá plná a lesklá. Lak stříkejte **přes celý díl** až po hrany nebo do určeného přechodového místa.\n\nPak nechte lak **vytvrdit**: obvykle prachově suchý za 20–30 min, manipulovatelný druhý den, plně vytvrzený za dny až týdny (dle TL a teploty).',
          'After the base has flashed off (turns matt, per TDS) spray **2 wet coats of 2K clear** with a flash-off between them. First coat medium, second full and glossy. Spray the clear **over the whole panel** up to the edges or into the planned blend zone.\n\nThen let it **cure**: usually dust-dry after 20–30 min, handleable the next day, fully cured after days to weeks (per TDS and temperature).'
        ),
        specs: [{ label: V('Odvětrání mezi vrstvami laku', 'Flash-off between clear coats'), value: V('cca 5–10 min (dle TL)', 'approx. 5–10 min (per TDS)'), verify: true }],
        notes: [
          { level: 'danger', text: V('**Bezbarvý 2K lak = nejvyšší koncentrace isokyanátů.** Bez masky A2P3 / přívodu vzduchu nestříkejte. Masku si nechte i při odvětrávání a úklidu.', '**2K clear coat = highest isocyanate concentration.** Do not spray without an A2P3 / supplied-air mask. Keep the mask on while flashing off and cleaning up.') },
          { level: 'caution', text: V('Moc lakem naráz = stékání. Raději dvě střední vrstvy než jedna silná. Stékance se opraví až po vytvrzení přebroušením.', 'Too much clear at once = runs. Two medium coats are better than one heavy. Runs can only be fixed after curing by sanding.') },
          { level: 'info', text: V('Pistoli vyčistěte ihned po stříkání ředidlem – vytvrzený 2K lak už z ní nedostanete.', 'Clean the gun with thinner immediately after spraying – cured 2K clear cannot be removed from it.') }
        ]
      },
      {
        id: 'polish', anim: 'body.polish',
        title: V('Po vytvrzení vybruste a vyleštěte', 'After curing, cut and polish'),
        body: V(
          'Až když je lak **plně vytvrzený** (dle TL), odstraňte prachová zrnka a pomerančovou kůru jemným broušením za mokra **P1500 → P2000 → P3000**. Pak leštičkou s **brusnou pastou** a nakonec **leštěnkou** obnovte lesk.\n\nPrvní týdny lak nevoskujte a nemyjte v kartáčové myčce.',
          'Only once the clear is **fully cured** (per TDS), remove dust nibs and orange peel by wet sanding with **P1500 → P2000 → P3000**. Then use a polisher with **cutting compound** and finally **polish** to restore the gloss.\n\nDo not wax the paint or use a brush car wash for the first weeks.'
        ),
        notes: [
          { level: 'caution', text: V('Na hranách a prolisech je lak nejtenčí – zde nebruste a leštičkou jen lehce, jinak lak „propálíte“ až na bázi.', 'The clear is thinnest on edges and creases – do not sand there and polish only lightly, or you will burn through to the base.') },
          { level: 'tip', text: V('Leštičku držte v neustálém pohybu, nízké otáčky, malé množství pasty. Lak nesmí zhřát tak, že na něj nevydržíte sáhnout.', 'Keep the polisher moving, low speed, a small amount of compound. The paint must never get too hot to touch.') }
        ]
      }
    ],
    vehicles: {
      'mb-cl500-c216': {
        status: 'caution',
        specs: [
          { label: V('Hliníkové díly', 'Aluminium panels'), value: V('Kapota, přední blatníky, dveře, víko kufru', 'Bonnet, front wings, doors, boot lid'), verify: true },
          { label: V('Ocelové díly', 'Steel panels'), value: V('Zadní blatníky / boční stěny, střecha (ocel)', 'Rear quarter panels, roof (steel)'), verify: true },
          { label: V('Kód barvy', 'Paint code'), value: V('Na štítku s VIN / v B-sloupku nebo pod kapotou (3místný kód, např. 197)', 'On the VIN / data label in the B-pillar or under the bonnet (3-digit code, e.g. 197)'), verify: true },
          { label: V('Senzory', 'Sensors'), value: V('Parkovací senzory v nárazníku, případně radar Distronic za maskou', 'Parking sensors in the bumpers, possibly Distronic radar behind the grille'), verify: true }
        ],
        notes: [
          { level: 'warning', text: V('**Hliník:** Používejte zcela oddělené nářadí, kotouče, brusné papíry a kartáče – ocelový prach zatlačený do hliníku způsobí **galvanickou korozi** (bílé bubliny pod lakem). Nikdy nepoužívejte ocelové drátěné kartáče.', '**Aluminium:** Use completely separate tools, discs, sandpaper and brushes – steel dust embedded in aluminium causes **galvanic corrosion** (white blisters under the paint). Never use steel wire brushes.') },
          { level: 'warning', text: V('Hliník **nemění barvu při ohřevu** a náhle ztrácí pevnost – nikdy ho neohřívejte hořákem. Rovnání je tvrdší a hliník se snáze trhá, pracujte velmi jemně nebo svěřte specialistovi.', 'Aluminium **shows no heat colours** and suddenly loses strength – never heat it with a torch. Straightening is harder and it tears more easily; work very gently or leave it to a specialist.') },
          { level: 'caution', text: V('Na holý hliník použijte **reaktivní (wash) nebo epoxidový základ** vhodný pro hliník a tmel schválený pro hliník (dle TL).', 'On bare aluminium use a **wash/etch or epoxy primer** suitable for aluminium and a filler approved for aluminium (per TDS).') },
          { level: 'caution', text: V('Nad parkovacími senzory v nárazníku nesmí být silná vrstva tmelu ani laku – senzory by hlásily chyby. Senzory se lakují zvlášť, tence a bez tmelu.', 'There must be no thick filler or paint over the parking sensors in the bumpers – they would report faults. Sensors are painted separately, thinly and without filler.') }
        ],
        tools: [V('Samostatná sada nářadí a brusiva jen pro hliník', 'Separate set of tools and abrasives for aluminium only'), V('Nerezový nebo nylonový kartáč', 'Stainless or nylon brush')],
        parts: [
          V('Odmašťovač silikonů, utěrky, tack hadřík', 'Silicone remover, wipes, tack cloth'),
          V('Krycí páska, papír / fólie', 'Masking tape, paper / film'),
          V('Reaktivní nebo epoxidový základ vhodný na hliník', 'Etch or epoxy primer suitable for aluminium'),
          V('Tmel 2K schválený pro hliník + tužidlo', '2K filler approved for aluminium + hardener'),
          V('Kontrolní prášek', 'Guide coat'),
          V('Plnič 2K + tužidlo + ředidlo', '2K primer filler + hardener + thinner'),
          V('Báze dle kódu barvy Mercedes + ředidlo', 'Base coat per Mercedes paint code + thinner'),
          V('Bezbarvý lak 2K + tužidlo', '2K clear coat + hardener'),
          V('Brusná a leštící pasta, dutinový vosk', 'Cutting compound and polish, cavity wax')
        ],
        steps: {
          assess: { notes: [{ level: 'info', text: V('Test magnetem: na kapotě, předních blatnících, dveřích a víku kufru magnet **nedrží** (hliník), na zadních blatnících drží.', 'Magnet test: on the bonnet, front wings, doors and boot lid the magnet **does not stick** (aluminium); on the rear quarters it does.'), verify: true }] },
          grind: { notes: [{ level: 'warning', text: V('U hliníku nepoužívejte kotouče, které byly použity na ocel. Hliník brousíte jemněji (P80–P120 excentrem), nepřehřívat.', 'On aluminium never use discs that were used on steel. Sand aluminium more gently (P80–P120 with an orbital), do not overheat.') }] },
          epoxy: { notes: [{ level: 'warning', text: V('Holý hliník oxiduje během minut – základ nanášejte hned po vybroušení a odmaštění.', 'Bare aluminium oxidises within minutes – apply primer right after sanding and degreasing.') }] },
          base: { notes: [{ level: 'info', text: V('Metalízy Mercedes jsou náročné na shodu odstínu – nechte barvu namíchat podle vzorku (např. víčko nádrže) a bázi rozmlžte do sousedních dílů.', 'Mercedes metallics are difficult to colour-match – have the paint matched to a sample (e.g. fuel flap) and blend the base into adjacent panels.') }] }
        }
      },
      'volvo-xc60-b4': {
        status: 'caution',
        specs: [
          { label: V('Ultra-pevná (borová) ocel', 'Ultra-high-strength (boron) steel'), value: V('A/B sloupky, prahy, rámy střechy, výztuhy dveří', 'A/B pillars, sills, roof rails, door reinforcements') },
          { label: V('Radar ACC / City Safety', 'ACC / City Safety radar'), value: V('Za logem / maskou v předním nárazníku', 'Behind the badge / grille in the front bumper'), verify: true },
          { label: V('Kamera', 'Camera'), value: V('U zpětného zrcátka na čelním skle', 'At the rear-view mirror on the windscreen') },
          { label: V('Senzory', 'Sensors'), value: V('Parkovací senzory v nárazníkách, radary BLIS / boční radary v zadním nárazníku', 'Parking sensors in the bumpers, BLIS / side radars in the rear bumper'), verify: true },
          { label: V('Kód barvy', 'Paint code'), value: V('Na štítku ve sloupku dveří řidiče (3místný kód, např. 707)', 'On the label in the driver\'s door pillar (3-digit code, e.g. 707)'), verify: true }
        ],
        notes: [
          { level: 'danger', text: V('**Borová / ultra-pevná ocel** ve sloupcích, prazích a rámu střechy: **žádné ohřívání, rovnání ani svařování**. Ohřátím ztratí pevnost a při nárazu nemusí ochránit posádku. Takové díly se jen vyměňují v autorizované karosárně dle postupu Volvo.', '**Boron / ultra-high-strength steel** in the pillars, sills and roof frame: **no heating, straightening or welding**. Heat destroys its strength and it may not protect occupants in a crash. Such parts are only replaced in an approved body shop per Volvo procedure.') },
          { level: 'warning', text: V('**Radar za předním nárazníkem / logem:** v zóně radaru nesmí být tmel, metalická báze ani silnější vrstva laku, než povoluje výrobce. Po opravě nebo výměně nárazníku a čelního skla je nutná **kalibrace ADAS** (VIDA) – jinak může City Safety brzdit chybně nebo vůbec.', '**Radar behind the front bumper / badge:** in the radar zone there must be no filler, metallic base or thicker paint than the manufacturer allows. After bumper repair or replacement and windscreen work an **ADAS calibration** (VIDA) is required – otherwise City Safety may brake wrongly or not at all.'), verify: true },
          { level: 'warning', text: V('Před prací v zadním nárazníku (BLIS radary, senzory) nebo v blízkosti kabeláže odpojte 12V baterii a 48V systém dle postupu VIDA.', 'Before working on the rear bumper (BLIS radars, sensors) or near wiring, disconnect the 12 V battery and 48 V system per VIDA.') },
          { level: 'info', text: V('Vnější panely (dveře, blatníky, víko) z běžné ocele / hliníku DIY opravit jde – vždy ale nejdřív test magnetem.', 'Outer panels (doors, wings, tailgate) made of regular steel / aluminium can be repaired DIY – always do the magnet test first.') }
        ],
        steps: {
          assess: { notes: [{ level: 'warning', text: V('Je-li poškození u sloupku, prahu nebo hrany střechy, nepokračujte – borová ocel. Vůz do autorizované karosárny.', 'If the damage is at a pillar, sill or roof edge, do not continue – boron steel. Take the car to an approved body shop.') }] },
          dent: { notes: [{ level: 'warning', text: V('Při sundávání čalounění dveří: ve dveřích jsou senzory nárazu a reproduktory s kabeláží – odpojte baterii dle VIDA.', 'When removing a door trim: the doors contain crash sensors and wired speakers – disconnect the battery per VIDA.'), verify: true }] },
          clear: { notes: [{ level: 'warning', text: V('Po lakování nárazníku nebo okolí radarů / kamer nechte provést kalibraci ADAS a ověřte, že nesvítí žádná chyba asistentů.', 'After painting a bumper or near radars / cameras, have the ADAS calibrated and check that no driver-assistance error is shown.') }] }
        }
      },
      'skoda-octavia-rs-tdi': {
        status: 'ok',
        specs: [
          { label: V('Karoserie', 'Body'), value: V('Celozinkovaná ocel – vhodná pro DIY opravy', 'Fully galvanised steel – suitable for DIY repairs') },
          { label: V('Typická koroze (stáří ~15 let)', 'Typical rust (age ~15 years)'), value: V('Lemy podběhů, spodní hrany dveří, víko kufru / páté dveře kolem SPZ a lišty, prahy', 'Wheel-arch lips, door bottoms, boot lid / tailgate around the number plate and trim, sills'), verify: true },
          { label: V('Kód barvy', 'Paint code'), value: V('Na datovém štítku v rezervě (kufr) a v servisní knížce, např. „LF9R“', 'On the data sticker in the spare-wheel well and in the service book, e.g. "LF9R"'), verify: true }
        ],
        notes: [
          { level: 'info', text: V('Zinková vrstva chrání plech zespodu laku. Při broušení ji odstraníte – holý kov proto **vždy** ihned ošetřete epoxidovým základem.', 'The zinc layer protects the metal under the paint. Sanding removes it – so **always** protect bare metal with epoxy primer immediately.') },
          { level: 'warning', text: V('Rez na **prazích** a v místech zvedacích bodů je nosná část – pokud je prorezlá, patří do karosárny (svařování).', 'Rust on the **sills** and around jacking points affects a structural part – if it is rusted through, it is a body-shop (welding) job.') },
          { level: 'tip', text: V('Po opravě lemu podběhu vystříkejte zevnitř dutinový vosk a zkontrolujte, že odtokové otvory dveří a prahů nejsou ucpané.', 'After repairing a wheel-arch lip, spray cavity wax inside and check that the door and sill drain holes are not blocked.') }
        ],
        steps: {
          grind: { notes: [{ level: 'caution', text: V('Lem podběhu je ohnutý dvojitý plech – rez často pokračuje mezi plechy. Pokud po obroušení vidíte rez ve spáře, je oprava jen dočasná.', 'The wheel-arch lip is folded double metal – rust often continues between the layers. If you see rust in the seam after sanding, the repair is only temporary.') }] }
        }
      },
      'toyota-gr-yaris': {
        status: 'caution',
        specs: [
          { label: V('Hliníkové díly', 'Aluminium panels'), value: V('Kapota, dveře, víko kufru (páté dveře)', 'Bonnet, doors, tailgate'), verify: true },
          { label: V('Kompozitní díly', 'Composite parts'), value: V('Střecha z uhlíkového kompozitu (CFRP / SMC)', 'Carbon-fibre composite roof (CFRP / SMC)'), verify: true },
          { label: V('Ocelové díly', 'Steel panels'), value: V('Blatníky, zadní boční stěny (ocel)', 'Wings, rear quarter panels (steel)'), verify: true },
          { label: V('Kód barvy', 'Paint code'), value: V('Na štítku ve sloupku dveří řidiče (C/TR, např. 089)', 'On the label in the driver\'s door pillar (C/TR, e.g. 089)'), verify: true }
        ],
        notes: [
          { level: 'warning', text: V('**Hliníkové díly** (kapota, dveře, víko kufru): oddělené nářadí a brusivo, žádné ocelové kartáče, žádné ohřívání, základ vhodný pro hliník – jinak galvanická koroze.', '**Aluminium panels** (bonnet, doors, tailgate): separate tools and abrasives, no steel brushes, no heating, primer suitable for aluminium – otherwise galvanic corrosion.') },
          { level: 'warning', text: V('**Kompozitní střecha:** žádné teplo, žádný ocelový tmel, nebrousit do vláken. Poškozená vlákna snižují pevnost – opravu svěřte specialistovi na kompozity.', '**Composite roof:** no heat, no steel filler, do not sand into the fibres. Damaged fibres reduce strength – leave the repair to a composite specialist.') },
          { level: 'caution', text: V('Plastové nárazníky a spoilery vyžadují **promotor přilnavosti na plasty** a pružný tmel / plnič – jinak lak opadá.', 'Plastic bumpers and spoilers need **plastic adhesion promoter** and flexible filler / primer – otherwise the paint peels off.') }
        ],
        tools: [V('Samostatná sada nářadí a brusiva jen pro hliník', 'Separate set of tools and abrasives for aluminium only')],
        steps: {
          assess: { notes: [{ level: 'info', text: V('Test magnetem: na kapotě, dveřích a víku kufru magnet nedrží (hliník), na střeše nedrží (kompozit), na blatnících drží (ocel).', 'Magnet test: on the bonnet, doors and tailgate the magnet does not stick (aluminium), on the roof it does not stick (composite), on the wings it sticks (steel).'), verify: true }] },
          epoxy: { notes: [{ level: 'warning', text: V('Na hliník použijte reaktivní nebo epoxidový základ pro hliník ihned po vybroušení – holý hliník rychle oxiduje.', 'On aluminium apply an etch or epoxy primer for aluminium immediately after sanding – bare aluminium oxidises quickly.') }] }
        }
      }
    }
  });
})(window.STU);
