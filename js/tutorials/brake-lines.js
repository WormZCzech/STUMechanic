/* Tutorial: Brake hoses & steel brake lines – inspection and replacement. */
(function (S) {
  'use strict';
  var V = function (cs, en) { return { cs: cs, en: en }; };

  S.registerTutorial({
    id: 'brake-lines',
    level: 2,
    thumb: 'brake-lines.inspect',
    time: V('2–4 hod. (dle počtu vedení)', '2–4 h (depending on the number of lines)'),
    title: V('Brzdové hadice a trubky – kontrola a výměna', 'Brake hoses & steel lines – inspection and replacement'),
    summary: V('Zkorodované trubky, nafouklé hadice, správný typ lemu, klíč na převlečné matice, odvzdušnění.', 'Corroded lines, bulging hoses, correct flare type, flare-nut wrench, bleeding.'),
    intro: V(
      'Brzdová kapalina pod tlakem přes **100 bar** teče z hlavního válce ocelovými trubkami a pružnými hadicemi ke kolům. Prasklá trubka nebo hadice = **náhlá ztráta brzd**. Tento návod ukazuje, jak vedení zkontrolovat a jak vyměnit hadici nebo úsek trubky.\n\nPo jakémkoli otevření okruhu **musí následovat úplné odvzdušnění** – viz návod **Odvzdušnění brzd**. Pokud si nejste jisti, svěřte trubky dílně – tady není prostor pro chybu.',
      'Brake fluid at over **100 bar** travels from the master cylinder through steel lines and flexible hoses to the wheels. A burst line or hose = **sudden brake failure**. This tutorial shows how to inspect the lines and how to replace a hose or a section of line.\n\nAny opening of the circuit **must be followed by a complete bleed** – see the **Brake bleeding** tutorial. If you are unsure, leave steel lines to a workshop – there is no room for error here.'
    ),
    safety: [
      { level: 'danger', text: V('**Bez brzd se nejezdí.** Po výměně vedení vůz nesmí vyjet, dokud není odvzdušněný, pedál tvrdý a těsnost ověřená pod tlakem.', '**No brakes – no driving.** After replacing a line the car must not move until it is bled, the pedal is firm and the joints are leak-checked under pressure.') },
      { level: 'danger', text: V('Pod vůz jen na stojanech – viz **Bezpečné zvednutí vozu**.', 'Only under the car on stands – see **Safely lifting the car**.') },
      { level: 'danger', text: V('**Nikdy nepoužívejte měděné instalatérské trubky, šroubení z hobby marketu ani „opravu“ páskou či lepidlem.** Pouze brzdové trubky (Cu-Ni / pozinkovaná ocel) a homologované hadice.', '**Never use plumbing copper pipe, hardware-store fittings or a "repair" with tape or glue.** Only brake line (Cu-Ni / coated steel) and approved brake hoses.') },
      { level: 'warning', text: V('Brzdová kapalina leptá lak a dráždí oči. Brýle, rukavice, ihned oplachovat vodou.', 'Brake fluid strips paint and irritates eyes. Glasses, gloves, rinse with water at once.') },
      { level: 'warning', text: V('**Typ lemu musí odpovídat šroubení** (DIN/ISO „bubble“ vs. SAE dvojitý lem). Špatný lem těsní zdánlivě – a pod tlakem povolí.', '**The flare type must match the fitting** (DIN/ISO "bubble" vs SAE double flare). A wrong flare seems to seal – and lets go under pressure.') },
      { level: 'caution', text: V('Hadice se **nesmí zkroutit** – kroucená hadice se rychle unaví a praskne. Hlídejte podélný proužek na hadici.', 'A hose must **never be twisted** – a twisted hose fatigues and bursts quickly. Watch the stripe along the hose.') },
      { level: 'info', text: V('Vedení u jednotky ABS/ESP a u hlavního válce svěřte dílně – po zavzdušnění jednotky je často nutné odvzdušnění diagnostikou.', 'Leave the lines at the ABS/ESP unit and master cylinder to a workshop – an aerated unit often needs a bleed routine via a scan tool.') }
    ],
    tools: [
      V('Klíče na převlečné matice (flare-nut, 10 a 11 mm – ověřit)', 'Flare-nut wrenches (10 and 11 mm – verify)'),
      V('Klíč na kontru šestihranu hadice', 'Spanner to counter-hold the hose hex'),
      V('Kleště na hadice (svorka bez zubů)', 'Hose clamp pliers (smooth jaws)'),
      V('Řezák trubek, odhrotovač', 'Tube cutter, deburring tool'),
      V('Lemovačka pro daný typ lemu (DIN/ISO nebo SAE) + matrice', 'Flaring tool for the right flare type (DIN/ISO or SAE) + dies'),
      V('Ohýbačka trubek (nebo ohýbání rukou přes trn)', 'Tube bender (or bending by hand over a mandrel)'),
      V('Penetrační olej, drátěný kartáč', 'Penetrating oil, wire brush'),
      V('Momentový klíč (rozsah cca 10–50 Nm)', 'Torque wrench (range approx. 10–50 Nm)'),
      V('Vybavení na odvzdušnění (viz návod Odvzdušnění brzd)', 'Bleeding equipment (see Brake bleeding)'),
      V('Brýle, nitrilové rukavice', 'Safety glasses, nitrile gloves')
    ],
    parts: [
      V('Brzdová hadice podle VIN (délka, konce, držáky)', 'Brake hose per VIN (length, ends, brackets)'),
      V('Brzdová trubka (Cu-Ni 4,75 mm / 3/16" – ověřit průměr) nebo předlemované kusy', 'Brake line (Cu-Ni 4.75 mm / 3/16" – verify diameter) or pre-flared lengths'),
      V('Převlečné matice se správným závitem (často M10×1 – ověřit)', 'Flare nuts with the correct thread (often M10×1 – verify)'),
      V('Nové měděné podložky pro dutý šroub (banjo)', 'New copper washers for the banjo bolt'),
      V('Spony / držáky trubek, ochranná hadička', 'Line clips / brackets, protective sleeve'),
      V('Nová brzdová kapalina dle specifikace (1 l)', 'New brake fluid to spec (1 L)')
    ],
    finalChecks: [
      V('Okruh kompletně odvzdušněný, pedál tvrdý a vysoko', 'Circuit fully bled, pedal firm and high'),
      V('Spoje suché pod tlakem (pomocník drží pedál 30 s)', 'Joints dry under pressure (helper holds the pedal for 30 s)'),
      V('Hadice se netře o kolo / pružinu v plném rejdu ani ve vyvěšení', 'Hose does not rub on wheel / spring at full lock or full droop'),
      V('Trubky upnuté ve sponách, nevibrují', 'Lines held in their clips, not vibrating'),
      V('Hladina kapaliny na MAX, víčko zavřené', 'Fluid level at MAX, cap closed'),
      V('Zkušební jízda nízkou rychlostí, opakovaná kontrola spojů', 'Low-speed test drive, joints re-checked')
    ],
    steps: [
      {
        id: 'inspect', anim: 'brake-lines.inspect',
        title: V('Prohlédněte trubky a hadice', 'Inspect lines and hoses'),
        body: V(
          'Se svítilnou projděte celé vedení od hlavního válce ke všem kolům:\n- **trubky**: hrubá rez, šupinky, důlky, ohyby, prodření o karoserii\n- **hadice**: praskliny, nafouklá místa (zvlášť při sešlápnutém pedálu), vlhko u konců, zkroucení\n- **spoje**: vlhko, krusty, zaschlá kapalina\n\nPovrchová rez na trubce se dá setřít – pokud ale zůstane důlek nebo šupina, trubka jde ven.',
          'With a torch, follow the whole system from the master cylinder to every wheel:\n- **lines**: heavy rust, flaking, pitting, kinks, chafing on the body\n- **hoses**: cracks, bulges (especially with the pedal pressed), damp ends, twisting\n- **joints**: dampness, crust, dried fluid\n\nSurface rust on a line can be wiped off – but if a pit or flake remains, the line must be replaced.'
        ),
        notes: [
          { level: 'danger', text: V('Nafouklá hadice nebo vlhko na spoji = **nejezdit**, vůz odtáhnout.', 'A bulging hose or a wet joint = **do not drive**, have the car towed.') },
          { level: 'tip', text: V('Pomocník ať sešlápne pedál – nafouknutí hadice je pak dobře vidět.', 'Have a helper press the pedal – a bulging hose becomes easy to see.') }
        ]
      },
      {
        id: 'plan', anim: 'brake-lines.flares',
        title: V('Zjistěte typ lemu a připravte díly', 'Identify the flare type and get the parts'),
        body: V(
          'Evropské vozy mají většinou **lem DIN/ISO („bubble“)**, některé vozy **dvojitý lem SAE**. Lem musí odpovídat dosedací ploše v šroubení – podívejte se na starou trubku a ověřte v katalogu dílů.\n\nKupte **hadice podle VIN** a buď hotové předlemované trubky, nebo trubku v návinu + správné matice. Matice se navlékají **před lemováním**!',
          'European cars mostly use the **DIN/ISO ("bubble") flare**, some cars an **SAE double flare**. The flare must match the seat in the fitting – look at the old line and verify in the parts catalogue.\n\nBuy **hoses by VIN** and either ready-made pre-flared lines or line on a roll + the correct nuts. The nuts go on **before flaring**!'
        ),
        specs: [{ label: V('Typ lemu', 'Flare type'), value: V('dle vozu (DIN/ISO nebo SAE)', 'per car (DIN/ISO or SAE)'), verify: true }],
        notes: [{ level: 'warning', text: V('Lemy nekombinujte a nepoužívejte matice s jiným závitem – „skoro sedí“ nestačí.', 'Never mix flare types or use nuts with a different thread – "almost fits" is not good enough.') }]
      },
      {
        id: 'lift', anim: 'lift.stands',
        title: V('Zvedněte vůz a sundejte kola', 'Lift the car and remove the wheels'),
        body: V('Postupujte podle návodu **Bezpečné zvednutí vozu**. Pro práci na zadních trubkách zvedněte celý vůz na 4 stojany.', 'Follow **Safely lifting the car**. For work on rear lines lift the whole car onto 4 stands.'),
        notes: [{ level: 'danger', text: V('Pod vůz až po testu stability.', 'Get under the car only after the stability test.') }]
      },
      {
        id: 'clamp', anim: 'brake-lines.clamp',
        title: V('Omezte únik kapaliny', 'Limit fluid loss'),
        body: V(
          'Pod víčko nádržky dejte potravinovou fólii a víčko zašroubujte – vznikne podtlak a kapalina skoro neteče. Na **gumovou hadici** (ne na trubku!) před místem rozpojení nasaďte **kleště na hadice** s hladkými čelistmi.',
          'Put cling film under the reservoir cap and screw the cap on – the vacuum stops most of the flow. Put **hose clamp pliers** with smooth jaws on the **rubber hose** (never on a steel line!) before the joint you will open.'
        ),
        notes: [
          { level: 'caution', text: V('Nikdy nepoužívejte kombinačky ani svěrky se zuby – poškodí vnitřek hadice a ta pak může prasknout.', 'Never use pliers or toothed clamps – they damage the inside of the hose, which can then burst.') },
          { level: 'warning', text: V('Nádržka nesmí vyprázdnit – vzduch v ABS jednotce = odvzdušnění diagnostikou.', 'The reservoir must not run dry – air in the ABS unit = scan-tool bleed.') }
        ]
      },
      {
        id: 'flarenut', anim: 'brake-lines.flarenut',
        title: V('Povolte převlečnou matici klíčem na trubky', 'Crack the flare nut with a flare-nut wrench'),
        body: V(
          'Spoj nastříkejte penetračním olejem a nechte působit. Převlečnou matici povolujte **klíčem na převlečné matice** (obejme 5 ploch) a šestihran hadice držte **druhým klíčem na kontru** – trubka se tak nezkroutí.',
          'Soak the joint with penetrating oil and let it work. Loosen the flare nut with a **flare-nut wrench** (grips 5 flats) and **counter-hold** the hose hex with a second spanner – the line will not twist.'
        ),
        notes: [
          { level: 'caution', text: V('Otevřený klíč matici zakulatí. Zakulacenou matici už neřešte – trubku uřízněte a vyměňte i s maticí.', 'An open-ended spanner rounds the nut. If a nut rounds off, stop – cut the line and replace it with the nut.') },
          { level: 'tip', text: V('Když se trubka točí s maticí, je zarezlá – počítejte s výměnou celého úseku.', 'If the line turns with the nut, it is seized – plan to replace the whole section.') }
        ]
      },
      {
        id: 'hose', anim: 'brake-lines.hose',
        title: V('Vyměňte hadici', 'Replace the hose'),
        body: V(
          '1. Uvolněte pojistnou sponu hadice v držáku.\n2. Na třmenu vyšroubujte dutý šroub (banjo), měděné podložky vyhoďte.\n3. Novou hadici namontujte **nejdřív na třmen**, pak do držáku – **bez zkroucení** (proužek rovně).\n4. Vždy nové měděné podložky.',
          '1. Remove the hose retaining clip at the bracket.\n2. At the caliper undo the banjo bolt, discard the copper washers.\n3. Fit the new hose **to the caliper first**, then into the bracket – **without twisting** (stripe straight).\n4. Always new copper washers.'
        ),
        specs: [{ label: V('Dutý šroub hadice', 'Hose banjo bolt'), value: V('dle příručky', 'per manual'), verify: true }],
        notes: [{ level: 'warning', text: V('Proužek na hadici musí být rovný po celé délce – jinak je hadice zkroucená.', 'The stripe on the hose must run straight along its length – otherwise the hose is twisted.') }]
      },
      {
        id: 'flaring', anim: 'brake-lines.flaring',
        title: V('Připravte trubku: řez, matice, lem', 'Prepare the line: cut, nuts, flare'),
        body: V(
          '1. Trubku uřízněte **řezákem** kolmo (ne pilkou).\n2. Odhrotujte vnitřní i vnější hranu, vyfoukejte piliny.\n3. **Navlékněte obě matice** správným směrem.\n4. Upněte trubku do lemovačky s přesahem dle návodu nástroje a vytvořte lem.\n5. Lem zkontrolujte: souměrný, bez trhlin, hladký.',
          '1. Cut the line square with a **tube cutter** (not a hacksaw).\n2. Deburr inside and out, blow out the chips.\n3. **Slide on both nuts** facing the right way.\n4. Clamp the line in the flaring tool with the overhang from the tool manual and form the flare.\n5. Check the flare: symmetrical, no cracks, smooth.'
        ),
        notes: [
          { level: 'warning', text: V('Prasklý nebo nesouměrný lem = uříznout a lemovat znovu. Nikdy ho „nedotahovat víc“.', 'A cracked or lop-sided flare = cut it off and flare again. Never "just tighten it more".') },
          { level: 'tip', text: V('Vyzkoušejte si lemování nejdřív na odřezku.', 'Practise flaring on an offcut first.') }
        ]
      },
      {
        id: 'bend', anim: 'brake-lines.bend',
        title: V('Ohněte a veďte trubku jako originál', 'Bend and route the line like the original'),
        body: V(
          'Ohýbejte **ohýbačkou** nebo přes trn – žádné zalomení. Veďte trubku **přesně původní trasou**, do všech spon, mimo výfuk, hrany a pohyblivé díly. Kde se trubka může odírat, nasaďte ochrannou hadičku.',
          'Bend with a **tube bender** or over a mandrel – no kinks. Route the line **exactly along the original path**, into every clip, away from the exhaust, sharp edges and moving parts. Where the line could chafe, fit a protective sleeve.'
        ),
        notes: [{ level: 'caution', text: V('Zalomená trubka zúží průtok a v místě zlomu praskne.', 'A kinked line restricts flow and cracks at the kink.') }]
      },
      {
        id: 'fit', anim: 'brake-lines.fit',
        title: V('Připojte a dotáhněte', 'Connect and tighten'),
        body: V(
          'Matice zašroubujte **rukou** (nesmí drhnout – jinak je trubka šikmo), pak dotáhněte klíčem na převlečné matice předepsaným momentem / citem. Kontrolujte, že hadice v plném rejdu a ve vyvěšení nikde nedře.',
          'Thread the nuts in **by hand** (they must not bind – otherwise the line is at an angle), then tighten with the flare-nut wrench to the specified torque / by feel. Check that the hose rubs nowhere at full steering lock and full droop.'
        ),
        specs: [{ label: V('Převlečná matice M10×1', 'Flare nut M10×1'), value: V('cca 14–16 Nm', 'approx. 14–16 Nm'), verify: true }],
        notes: [{ level: 'caution', text: V('Přetažená matice zdeformuje lem – víc neznamená lépe.', 'Over-tightening deforms the flare – more is not better.') }]
      },
      {
        id: 'bleed', anim: 'bleed.nipple',
        title: V('Odvzdušněte brzdy', 'Bleed the brakes'),
        body: V('Sundejte kleště z hadice a celý okruh **odvzdušněte podle návodu Odvzdušnění brzd** – minimálně dotčené kolo, raději všechna.', 'Remove the hose clamp and **bleed the circuit following the Brake bleeding tutorial** – at least the affected wheel, preferably all.'),
        notes: [{ level: 'danger', text: V('Měkký pedál = vzduch v systému. Nejezdit!', 'A soft pedal = air in the system. Do not drive!') }]
      },
      {
        id: 'leak', anim: 'brake-lines.leak',
        title: V('Tlaková zkouška těsnosti', 'Pressure leak test'),
        body: V(
          'Pomocník sešlápne pedál silou a drží 30 s. Vy kontrolujete každý spoj papírovým ubrouskem – musí zůstat suchý. Pak volant z rejdu do rejdu a znovu kontrola.',
          'A helper presses the pedal hard and holds it for 30 s. You check every joint with a paper towel – it must stay dry. Then turn the steering lock to lock and check again.'
        ),
        notes: [{ level: 'warning', text: V('Kapka na spoji = dotáhnout / předělat lem a znovu odvzdušnit. Nikdy nejezdit s vlhkým spojem.', 'A drop at a joint = tighten / redo the flare and bleed again. Never drive with a wet joint.') }]
      }
    ],
    vehicles: {
      'mb-cl500-c216': {
        status: 'caution',
        specs: [
          { label: V('Brzdová kapalina', 'Brake fluid'), value: 'DOT 4 Plus (MB 331.0)', verify: true },
          { label: V('Typ lemu', 'Flare type'), value: V('DIN/ISO (bubble) – ověřit', 'DIN/ISO (bubble) – verify'), verify: true }
        ],
        notes: [
          { level: 'danger', text: V('**ABC podvozek:** pod vůz jen na stojanech, nikdy se nespoléhejte na hydrauliku podvozku. Nezaměňte vedení ABC (zelená kapalina, vysoký tlak) s brzdovým vedením!', '**ABC suspension:** only under the car on stands, never rely on the suspension hydraulics. Do not confuse ABC lines (green fluid, high pressure) with brake lines!'), verify: true },
          { level: 'info', text: V('Dlouhé zadní trubky vedou pod podlahou vozu (zadní pohon) – výměna celé délky je práce pro dílnu se zvedákem.', 'Long rear lines run under the floor (RWD) – replacing the full length is a job for a workshop with a lift.') }
        ]
      },
      'volvo-xc60-b4': {
        status: 'caution',
        specs: [{ label: V('Brzdová kapalina', 'Brake fluid'), value: V('DOT 4 nízkoviskózní (třída 6)', 'DOT 4 low viscosity (class 6)'), verify: true }],
        notes: [
          { level: 'danger', text: V('**Vzduchové odpružení:** před zvedáním vypnout regulaci výšky (režim zvedání).', '**Air suspension:** switch off level control (jacking mode) before lifting.'), verify: true },
          { level: 'info', text: V('U zadních kol vedou vedle brzdových hadic i kabely elektrické parkovací brzdy a snímače – nezaměňte je a nepoškoďte.', 'At the rear wheels the electric parking brake cables and sensors run next to the hoses – do not confuse or damage them.') },
          { level: 'warning', text: V('Při zavzdušnění jednotky ESP je nutné odvzdušnění přes VIDA.', 'If the ESP unit gets air in it, a VIDA bleed routine is required.'), verify: true }
        ]
      },
      'skoda-octavia-rs-tdi': {
        status: 'ok',
        specs: [
          { label: V('Typ lemu', 'Flare type'), value: V('DIN/ISO (bubble), matice M10×1 – ověřit', 'DIN/ISO (bubble), nuts M10×1 – verify'), verify: true },
          { label: V('Brzdová kapalina', 'Brake fluid'), value: 'DOT 4 (VW 501 14)' }
        ],
        notes: [{ level: 'info', text: V('Spojka sdílí nádržku s brzdami – při odsávání kapaliny nevyprázdněte ani přívod ke spojce.', 'The clutch shares the brake reservoir – when removing fluid, do not drain the clutch feed either.') }]
      },
      'toyota-gr-yaris': {
        status: 'ok',
        specs: [{ label: V('Brzdová kapalina', 'Brake fluid'), value: V('dle příručky (okruh: vysokoteplotní)', 'per manual (track: high-temp)'), verify: true }],
        notes: [
          { level: 'warning', text: V('**Opletené (pancéřové) hadice** jen s homologací pro daný vůz – jinak neprojdou STK a mohou být nebezpečné.', '**Braided hoses** only with approval for this car – otherwise they fail the inspection and can be dangerous.') },
          { level: 'info', text: V('Pevné 4pístkové třmeny mají propojovací trubku mezi polovinami – tu nerozpojujte.', 'Fixed 4-piston calipers have a crossover tube between the halves – do not disconnect it.'), verify: true }
        ]
      },
      'citroen-jumper-22hdi': {
        status: 'caution',
        specs: [
          { label: V('Typ lemu', 'Flare type'), value: V('dle katalogu dílů (ověřit)', 'per parts catalogue (verify)'), verify: true },
          { label: V('Brzdová kapalina', 'Brake fluid'), value: 'DOT 4', verify: true }
        ],
        notes: [
          { level: 'danger', text: V('**Těžká dodávka:** hever i stojany min. 3 t, náklad vyložit.', '**Heavy van:** jack and stands rated at least 3 t, unload the cargo.') },
          { level: 'warning', text: V('Zadní trubky vedou podél rámu a často **silně korodují** – zkontrolujte je po celé délce, ne jen u kol.', 'Rear lines run along the chassis and often **corrode badly** – inspect their full length, not only at the wheels.'), verify: true }
        ],
        steps: { lift: { notes: [{ level: 'danger', text: V('Hever a každý stojan s nosností min. 3 t. Nikdy zvedák z osobního auta.', 'Jack and every stand rated at least 3 t. Never a car jack.') }] } }
      }
    }
  });
})(window.STU);
