/* Tutorial: MIG welding basics for rust repair (non-structural outer panels). */
(function (S) {
  'use strict';
  var V = function (cs, en) { return { cs: cs, en: en }; };

  S.registerTutorial({
    id: 'welding',
    level: 3,
    thumb: 'welding.stitch',
    status: 'caution',
    time: V('1–2 dny', '1–2 days'),
    title: V('Svařování MIG: oprava prorezlého plechu', 'MIG welding: repairing rusted-through panels'),
    summary: V('Vyříznout rez, zavařit záplatu bodovými svary, zabrousit a ochránit. Jen nenosné vnější plechy.', 'Cut out the rust, weld in a patch with stitch welds, grind and protect. Non-structural outer panels only.'),
    intro: V(
      'Když rez prožere plech skrz, tmel nepomůže – rez se vrátí. Správná oprava je **vyříznout zkorodované místo až do zdravého kovu a zavařit novou záplatu**.\n\nTento návod je pro **nenosné vnější plechy** (blatník, spodek dveří, lem podběhu). **Prahy, sloupky, podélníky a uchycení podvozku jsou nosné** – u moderních aut navíc z vysokopevnostních ocelí. Ty patří do karosárny. Po svařování pokračujte návodem **Klempířské práce** (tmel, plnič, lak).',
      'When rust eats through the metal, filler will not help – the rust comes back. The proper repair is to **cut the corroded area out to sound metal and weld in a new patch**.\n\nThis tutorial is for **non-structural outer panels** (wing, door bottom, wheel-arch lip). **Sills, pillars, chassis rails and suspension mounts are structural** – on modern cars also made of high-strength steels. Those belong in a body shop. After welding continue with the **Bodywork** tutorial (filler, primer, paint).'
    ),
    safety: [
      { level: 'danger', text: V('**Požár:** svařování a broušení zapaluje palivo, podvozkový vosk, čalounění i prach. V okolí 1 m nic hořlavého, palivové potrubí a nádrž zakrýt / odmontovat, **hasicí přístroj na dosah** a po práci **30 minut hlídat** – dutiny mohou doutnat.', '**Fire:** welding and grinding ignite fuel, underbody wax, trim and dust. Nothing flammable within 1 m, cover / remove fuel lines and tank, **extinguisher within reach** and **watch for 30 minutes** after work – cavities can smoulder.') },
      { level: 'danger', text: V('**Oblouk** pálí oči a kůži (UV) i na odraz. Samostmívací kukla, kožené rukavice, dlouhé rukávy z bavlny – **žádné syntetické oblečení** (taví se). Kolemjdoucí nesmí do oblouku hledět.', '**The arc** burns eyes and skin (UV) even by reflection. Auto-darkening helmet, leather gloves, long cotton sleeves – **no synthetic clothing** (it melts). Bystanders must not look at the arc.') },
      { level: 'warning', text: V('**Výpary:** pozinkovaný plech uvolňuje zinkové výpary (horečka slévačů), barvy a vosky jedovaté plyny. Odsávání / venku, respirátor s filtrem na svařovací dýmy. Pozink a barvu nejdřív v místě svaru obrousit.', '**Fumes:** galvanised steel releases zinc fumes (metal fume fever), paint and wax release toxic gases. Extraction / outdoors, respirator with a welding-fume filter. Grind zinc and paint off at the weld area first.') },
      { level: 'warning', text: V('**Elektronika:** odpojte baterii, zemnicí kleště co nejblíž svaru, nikdy přes ložiska nebo řídicí jednotky. U moderních aut zvažte ochranu proti přepětí – ověřte v dílenské příručce.', '**Electronics:** disconnect the battery, earth clamp as close to the weld as possible, never through bearings or control units. On modern cars consider surge protection – verify in the workshop manual.') },
      { level: 'warning', text: V('**Nosné díly svépomocí nesvařujte.** Špatný svar na prahu nebo sloupku změní chování vozu při nárazu a neprojde STK.', '**Do not weld structural parts yourself.** A poor weld on a sill or pillar changes crash behaviour and fails the inspection.') },
      { level: 'caution', text: V('Řezací kotouče mohou prasknout – brýle + štít, kryt na brusce, nikdy nestát v rovině kotouče.', 'Cutting discs can shatter – glasses + face shield, guard on the grinder, never stand in line with the disc.') }
    ],
    tools: [
      V('Svářečka MIG/MAG (ochranná atmosféra)', 'MIG/MAG welder (gas shielded)'),
      V('Drát 0,6 mm (tenký plech) nebo 0,8 mm', 'Wire 0.6 mm (thin sheet) or 0.8 mm'),
      V('Plyn Ar/CO₂ (např. 82/18) + regulátor', 'Ar/CO₂ gas (e.g. 82/18) + regulator'),
      V('Samostmívací kukla, kožené rukavice, respirátor', 'Auto-darkening helmet, leather gloves, respirator'),
      V('Úhlová bruska + řezné kotouče 1 mm + lamelové P60–P80', 'Angle grinder + 1 mm cutting discs + P60–P80 flap discs'),
      V('Hasicí přístroj, svářečská deka, kbelík vody', 'Fire extinguisher, welding blanket, bucket of water'),
      V('Magnetické úhelníky / svěrky, nůžky na plech', 'Magnetic squares / clamps, tin snips'),
      V('Pistole na tmel, štětec, nástavec na dutinový vosk', 'Sealant gun, brush, cavity-wax wand')
    ],
    parts: [
      V('Ocelový plech stejné tloušťky (často 0,7–1,0 mm – změřit)', 'Steel sheet of the same thickness (often 0.7–1.0 mm – measure)'),
      V('Epoxidový základ', 'Epoxy primer'),
      V('Těsnicí tmel na spoje (seam sealer)', 'Seam sealer'),
      V('Dutinový vosk, ochrana podvozku', 'Cavity wax, underbody protection'),
      V('Odmašťovač', 'Degreaser')
    ],
    finalChecks: [
      V('Nic nedoutná – 30 min po práci zkontrolováno i uvnitř dutin', 'Nothing smouldering – checked 30 min after work, inside cavities too'),
      V('Svary zabroušené, bez děr a pórů', 'Welds ground flush, no holes or porosity'),
      V('Spoje zatěsněné, holý kov pod epoxidem', 'Joints sealed, bare metal under epoxy'),
      V('Dutiny ošetřené voskem (po lakování)', 'Cavities treated with wax (after painting)'),
      V('Baterie připojená, žádné chybové kontrolky', 'Battery reconnected, no warning lights')
    ],
    steps: [
      {
        id: 'safety', anim: 'welding.safety',
        title: V('Ochranné pomůcky a protipožární opatření', 'Protective gear and fire precautions'),
        body: V('Připravte kuklu, rukavice, respirátor, nehořlavé oblečení, **hasicí přístroj** a svářečskou deku. Pracujte venku nebo s odsáváním.', 'Prepare the helmet, gloves, respirator, flame-resistant clothes, **fire extinguisher** and welding blanket. Work outdoors or with extraction.'),
        notes: [
          { level: 'danger', text: V('Nikdy nesvařujte sami bez možnosti přivolat pomoc a bez hasicího přístroje.', 'Never weld alone without a way to call for help and without an extinguisher.') }
        ]
      },
      {
        id: 'prep', anim: 'welding.prep',
        title: V('Připravte vůz', 'Prepare the car'),
        body: V('1. Odpojte minus pól baterie.\n2. V okolí 30 cm odstraňte čalounění, koberce, ochranný vosk a podvozkový nástřik.\n3. Palivové a brzdové potrubí v blízkosti odmontujte nebo zakryjte mokrou tkaninou / tepelným štítem.\n4. Hasicí přístroj a kbelík vody postavte k vozu.', '1. Disconnect the battery negative.\n2. Within 30 cm remove trim, carpets, wax and underbody coating.\n3. Remove fuel and brake lines nearby or cover them with a wet cloth / heat shield.\n4. Put the extinguisher and a bucket of water next to the car.'),
        notes: [
          { level: 'danger', text: V('Nesvařujte v blízkosti palivové nádrže ani plnicího hrdla – výpary se vznítí.', 'Never weld near the fuel tank or filler neck – vapour ignites.') }
        ]
      },
      {
        id: 'assess', anim: 'welding.assess',
        title: V('Posuďte rozsah a materiál', 'Assess the extent and material'),
        body: V('Šroubovákem proklepejte okolí – kde projde, je plech prorezlý. Magnetem ověřte, že jde o ocel. Rez bývá pod lakem dál, než je vidět.', 'Probe the area with a screwdriver – where it goes through, the metal is rotten. Check with a magnet that it is steel. Rust usually spreads further under the paint than it looks.'),
        notes: [
          { level: 'danger', text: V('Prorezlý **práh, sloupek, podélník nebo uchycení podvozku = nosná část** → karosárna. Tento návod nepoužívejte.', 'Rotten **sill, pillar, chassis rail or suspension mount = structural** → body shop. Do not use this tutorial.') },
          { level: 'warning', text: V('Hliník (magnet nedrží) **nelze svařovat ocelovým drátem MIG** – potřebuje speciální svářečku, drát a čisté prostředí.', 'Aluminium (magnet does not stick) **cannot be welded with steel MIG wire** – it needs a special welder, wire and clean conditions.') }
        ]
      },
      {
        id: 'cut', anim: 'welding.cut',
        title: V('Vyřízněte rez až do zdravého plechu', 'Cut out the rust to sound metal'),
        body: V('Řezným kotoučem vyřízněte obdélník se zaoblenými rohy **2–3 cm do zdravého plechu**. Okraje obruste do lesku z obou stran a odstraňte zinek a barvu.', 'With a cutting disc cut out a rectangle with rounded corners **2–3 cm into sound metal**. Grind the edges bright on both sides and remove zinc and paint.'),
        notes: [
          { level: 'warning', text: V('Zkontrolujte, co je za plechem (kabely, hadičky, nádrž, airbag) – kotouč projde i tím.', 'Check what is behind the panel (wires, hoses, tank, airbag) – the disc cuts through those too.') }
        ]
      },
      {
        id: 'patch', anim: 'welding.patch',
        title: V('Vyrobte a přiložte záplatu', 'Make and fit the patch'),
        body: V('Z plechu **stejné tloušťky** vystřihněte záplatu přesně do otvoru (mezera ~1 mm, tloušťka drátu). Vytvarujte ji podle oblouku panelu a zajistěte magnety nebo svěrkami.', 'Cut a patch from sheet of **the same thickness** to fit the hole exactly (gap ~1 mm, the wire diameter). Shape it to the panel curve and hold it with magnets or clamps.'),
        notes: [
          { level: 'tip', text: V('Šablonu si udělejte z papíru nebo kartonu – přiložit, obkreslit, vystřihnout.', 'Make a template from paper or cardboard – fit, trace, cut.') }
        ]
      },
      {
        id: 'settings', anim: 'welding.settings',
        title: V('Nastavte svářečku a vyzkoušejte', 'Set up the welder and test'),
        body: V('Drát 0,6 mm pro tenký plech (0,8 mm jde také), plyn Ar/CO₂ cca 8–10 l/min. Napětí a posuv drátu podle tabulky na svářečce. **Zkušební svár na odřezku stejného plechu**: správný svár syčí rovnoměrně („smaží slaninu“) a nepropaluje.', 'Wire 0.6 mm for thin sheet (0.8 mm also works), Ar/CO₂ gas approx. 8–10 L/min. Voltage and wire speed from the chart on the welder. **Test weld on scrap of the same sheet**: a good weld sizzles evenly ("frying bacon") and does not burn through.'),
        specs: [{ label: V('Průtok plynu', 'Gas flow'), value: V('cca 8–10 l/min', 'approx. 8–10 L/min'), verify: true }],
        notes: [
          { level: 'info', text: V('Zemnicí kleště na čistý kov co nejblíž svaru.', 'Earth clamp on clean metal as close to the weld as possible.') }
        ]
      },
      {
        id: 'tack', anim: 'welding.tack',
        title: V('Nastehujte záplatu', 'Tack the patch in'),
        body: V('Udělejte krátké stehy (1–2 s) **naproti sobě** – nahoře, dole, vlevo, vpravo – a postupně mezi ně. Kontrolujte, zda záplata zůstává zarovnaná s panelem.', 'Make short tacks (1–2 s) **on opposite sides** – top, bottom, left, right – then in between. Check the patch stays flush with the panel.'),
        notes: [
          { level: 'danger', text: V('Kukla dolů před každým zapálením oblouku. Horké stehy nesahat.', 'Helmet down before every arc. Do not touch hot tacks.') }
        ]
      },
      {
        id: 'stitch', anim: 'welding.stitch',
        title: V('Zavařte bodovými svary', 'Weld it in with stitch welds'),
        body: V('Spojte stehy **krátkými body / úseky 1–2 cm**, pokaždé jinde po obvodu, a nechte plech vychladnout (stlačeným vzduchem, ne vodou). Souvislý šev na tenkém plechu = zkroucený panel.', 'Join the tacks with **short spots / runs of 1–2 cm**, each time somewhere else around the patch, and let the metal cool (compressed air, not water). A continuous seam on thin sheet = a warped panel.'),
        notes: [
          { level: 'caution', text: V('Propálená díra? Nechat vychladnout a zavařit postupně od okraje.', 'Blew a hole? Let it cool and fill it gradually from the edge.') }
        ]
      },
      {
        id: 'grind', anim: 'welding.grind',
        title: V('Zabruste svary', 'Grind the welds flush'),
        body: V('Lamelovým kotoučem P60–P80 zbruste svary do roviny. Brusku veďte po svaru, ne napříč do plechu – ten se zeslabí. Zkontrolujte, že nejsou póry ani díry (případně dovařit).', 'Grind the welds flush with a P60–P80 flap disc. Move along the weld, not across into the panel – it would get thinner. Check for porosity or holes (weld again if needed).'),
        notes: [
          { level: 'warning', text: V('Jiskry daleko od paliva a skla (vypalují se do skla).', 'Keep sparks away from fuel and glass (they burn into glass).') }
        ]
      },
      {
        id: 'seal', anim: 'welding.seal',
        title: V('Zatěsněte a základujte', 'Seal and prime'),
        body: V('Odmastěte, na holý kov naneste **epoxidový základ**, spoje z rubu i líce zatěsněte těsnicím tmelem. Pak pokračujte návodem **Klempířské práce** (tmel, plnič, lak).', 'Degrease, apply **epoxy primer** on bare metal, seal the joints front and back with seam sealer. Then continue with the **Bodywork** tutorial (filler, primer, paint).'),
        notes: [{ level: 'info', text: V('Holý kov nenechávejte bez ochrany přes noc – začne rezivět.', 'Do not leave bare metal unprotected overnight – it starts rusting.') }]
      },
      {
        id: 'wax', anim: 'welding.wax',
        title: V('Ošetřete dutiny voskem', 'Treat cavities with wax'),
        body: V('Po nalakování nastříkejte do dutin (zevnitř dveří, prahy přes zátky) **dutinový vosk** a podvozek ošetřete ochranným nástřikem. Svar zevnitř bývá nechráněný – tam rez začne nejdřív.', 'After painting spray **cavity wax** into the cavities (inside doors, sills through the plugs) and treat the underbody. The back of the weld is usually unprotected – rust starts there first.'),
        notes: [{ level: 'danger', text: V('Vosk je hořlavý – nikdy ho nenanášejte před svařováním v okolí.', 'Wax is flammable – never apply it before welding nearby.') }]
      }
    ],
    vehicles: {
      'mb-cl500-c216': {
        status: 'pro',
        specs: [
          { label: V('Materiál', 'Material'), value: V('Kapota, přední blatníky, dveře a víko kufru hliník; zbytek ocel', 'Bonnet, front wings, doors and boot lid aluminium; the rest steel'), verify: true }
        ],
        notes: [
          { level: 'warning', text: V('Hliníkové díly **nesvařovat ocelovým drátem** – hliník se svařuje jinou technologií (MIG Al / TIG) a pro karoserii jen ve specializované dílně. Poškozený hliníkový díl se obvykle mění.', 'Do **not weld aluminium parts with steel wire** – aluminium needs a different process (Al MIG / TIG) and, for body parts, a specialist shop. A damaged aluminium part is usually replaced.'), verify: true },
          { level: 'warning', text: V('ABC podvozek: při práci zespodu vůz na stojanech, ne na hydraulice (viz Bezpečné zvednutí).', 'ABC suspension: when working underneath, car on stands, not on the hydraulics (see Safely lifting).') }
        ]
      },
      'volvo-xc60-b4': {
        status: 'pro',
        specs: [{ label: V('Nosná struktura', 'Structure'), value: V('Borová / ultra-pevná ocel v prazích, sloupcích a rámech – nesvařovat', 'Boron / ultra-high-strength steel in sills, pillars and frames – do not weld') }],
        notes: [
          { level: 'danger', text: V('UHSS a borová ocel **ztrácí pevnost teplem** – žádné svařování, rovnání ani ohřev. Opravy jen dle Volvo postupu v autorizované karosárně.', 'UHSS and boron steel **lose strength when heated** – no welding, straightening or heating. Repairs only per the Volvo procedure in an approved body shop.') },
          { level: 'warning', text: V('Před svařováním odpojte 12V i 48V systém dle VIDA (MHEV) a chraňte radary a kamery.', 'Before welding disconnect both the 12 V and 48 V systems per VIDA (MHEV) and protect radars and cameras.'), verify: true },
          { level: 'warning', text: V('Vzduchový podvozek: režim zvedání / vypnout regulaci výšky před prací zespodu.', 'Air suspension: jacking mode / level control off before working underneath.') }
        ]
      },
      'skoda-octavia-rs-tdi': {
        status: 'caution',
        specs: [{ label: V('Karoserie', 'Body'), value: V('Plně pozinkovaná ocel', 'Fully galvanised steel'), verify: true }],
        notes: [
          { level: 'warning', text: V('Pozink: před svařováním obrousit do čistého kovu, odsávání a respirátor – zinkové výpary.', 'Galvanising: grind to clean metal before welding, extraction and respirator – zinc fumes.') },
          { level: 'info', text: V('Typická místa: lemy podběhů, spodky dveří a víka kufru – zkontrolujte, zda nejde jen o povrchovou rez (pak stačí Klempířské práce).', 'Typical spots: wheel-arch lips, door and boot-lid bottoms – check whether it is only surface rust (then Bodywork is enough).'), verify: true }
        ]
      },
      'toyota-gr-yaris': {
        status: 'pro',
        specs: [{ label: V('Materiál', 'Material'), value: V('Kapota, dveře, víko kufru hliník; střecha kompozit', 'Bonnet, doors, tailgate aluminium; composite roof'), verify: true }],
        notes: [
          { level: 'danger', text: V('Hliníkové a kompozitové díly **nesvařovat MIG ocelí** a neohřívat – specializovaná karosárna / výměna dílu.', '**Do not MIG-weld** aluminium and composite parts with steel wire and do not heat them – specialist body shop / part replacement.'), verify: true },
          { level: 'info', text: V('Ocelové části (prahy, podlaha) jsou nosné – nesvařovat svépomocí.', 'Steel areas (sills, floor) are structural – do not weld them yourself.') }
        ]
      },
      'citroen-jumper-22hdi': {
        status: 'caution',
        specs: [{ label: V('Karoserie', 'Body'), value: V('Ocel, částečně pozinkovaná', 'Steel, partly galvanised'), verify: true }],
        notes: [
          { level: 'info', text: V('Typická rez X250: lemy podběhů, spodky zadních a posuvných dveří, lišta posuvných dveří, prahy – ověřte, které díly jsou nosné (prahy a podlaha ano).', 'Typical X250 rust: wheel-arch lips, bottoms of rear and sliding doors, sliding-door rail, sills – verify which parts are structural (sills and floor are).'), verify: true },
          { level: 'caution', text: V('Velké rovné panely dodávky se teplem snadno zvlní („oil-canning“) – jen krátké body a dlouhé chlazení.', 'Large flat van panels distort easily with heat ("oil-canning") – short spots only and long cooling.') },
          { level: 'warning', text: V('Těžké vozidlo: práce zespodu jen na stojanech ≥ 3 t.', 'Heavy vehicle: work underneath only on stands rated ≥ 3 t.') }
        ],
        steps: {
          stitch: { notes: [{ level: 'caution', text: V('Na velkém plochém panelu dodávky dělejte ještě kratší body a víc chlaďte – panel se jinak zvlní.', 'On a large flat van panel make even shorter spots and cool more – otherwise the panel ripples.') }] }
        }
      }
    }
  });
})(window.STU);
