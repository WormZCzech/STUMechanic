/* Tutorial: Tyres – check, pressure, tread, age, rotation, seasonal swap, TPMS, storage. */
(function (S) {
  'use strict';
  var V = function (cs, en) { return { cs: cs, en: en }; };

  S.registerTutorial({
    id: 'tyres',
    level: 1,
    thumb: 'tyres.rotation',
    time: V('30 min kontrola · 1–2 h přezutí', '30 min check · 1–2 h seasonal swap'),
    title: V('Pneumatiky: kontrola, tlak, přezutí a rotace', 'Tyres: check, pressure, seasonal swap and rotation'),
    summary: V('Tlak za studena, hloubka dezénu, stáří, poškození, rotace kol, zimní pneu a reset TPMS.', 'Cold pressure, tread depth, age, damage, wheel rotation, winter tyres and TPMS reset.'),
    intro: V(
      'Pneumatiky jsou **jediný kontakt auta se silnicí** – brzdy, řízení i stabilita jsou jen tak dobré jako pneu. Kontrola trvá pár minut a odhalí problém dřív, než vznikne nehoda.\n\nNa přezutí kol použijte návod **Bezpečné zvednutí vozu**.',
      'Tyres are **the car\'s only contact with the road** – brakes, steering and stability are only as good as the tyres. A check takes a few minutes and finds problems before they cause an accident.\n\nFor the seasonal swap use the **Safely lifting the car** tutorial.'
    ),
    safety: [
      { level: 'danger', text: V('Pneumatika s boulí, prořízlým bokem nebo viditelnou kostrou může kdykoli explodovat. **Nejezděte** – nasaďte rezervu nebo volejte asistenci.', 'A tyre with a bulge, a cut sidewall or visible cords can burst at any moment. **Do not drive** – fit the spare or call assistance.') },
      { level: 'warning', text: V('Tlak měřte **za studena**. Teplou pneumatiku nikdy nepodhušťujte „na předpis“ – po vychladnutí bude tlak nízký.', 'Measure pressure **cold**. Never let air out of a warm tyre "to spec" – it will be too low once it cools down.') },
      { level: 'warning', text: V('Na jedné nápravě vždy stejné pneu (rozměr, typ, dezén, podobné opotřebení). U pohonu 4×4 platí pro všechna 4 kola.', 'Always the same tyres on one axle (size, type, pattern, similar wear). On AWD this applies to all 4 wheels.') },
      { level: 'caution', text: V('Rozměr, index nosnosti a rychlosti musí odpovídat technickému průkazu (ORV/TP).', 'Size, load and speed index must match the registration papers.') }
    ],
    tools: [
      V('Digitální měřič tlaku (přesný)', 'Digital pressure gauge (accurate)'),
      V('Kompresor nebo hustič', 'Compressor or inflator'),
      V('Hloubkoměr dezénu', 'Tread depth gauge'),
      V('Křída / štítky na označení kol', 'Chalk / tags to mark wheels'),
      V('Na přezutí: hever, stojany, momentový klíč (viz návod na zvedání)', 'For the swap: jack, stands, torque wrench (see lifting tutorial)')
    ],
    parts: [
      V('Případně nové ventilky / čepičky', 'New valve stems / caps if needed'),
      V('Sada zimních / letních kol', 'Set of winter / summer wheels')
    ],
    finalChecks: [
      V('Tlak ve všech 4 kolech (a rezervě) podle štítku', 'Pressure in all 4 wheels (and spare) per sticker'),
      V('Čepičky ventilků nasazené', 'Valve caps fitted'),
      V('Šrouby kol dotažené momentem, po 50–100 km znovu', 'Wheel bolts torqued, re-torque after 50–100 km'),
      V('TPMS zkalibrováno (pokud je)', 'TPMS calibrated (if fitted)'),
      V('Uskladněná kola označená podle polohy', 'Stored wheels marked by position')
    ],
    steps: [
      {
        id: 'markings', anim: 'tyres.markings',
        title: V('Přečtěte si označení pneumatiky', 'Read the tyre markings'),
        body: V(
          'Na boku je rozměr, např. **225/45 R17 91W**:\n- 225 = šířka v mm\n- 45 = výška boku v % šířky\n- R17 = radiální, ráfek 17"\n- 91 = index nosnosti, W = index rychlosti\n\nZimní pneu mají symbol **vločky v hoře (3PMSF)**, případně M+S.',
          'The sidewall shows the size, e.g. **225/45 R17 91W**:\n- 225 = width in mm\n- 45 = sidewall height as % of width\n- R17 = radial, 17" rim\n- 91 = load index, W = speed index\n\nWinter tyres carry the **snowflake-in-mountain (3PMSF)** symbol, sometimes M+S.'
        ),
        notes: [{ level: 'caution', text: V('Nižší index nosnosti nebo rychlosti než v ORV = nelegální a nebezpečné.', 'A lower load or speed index than in the papers = illegal and dangerous.') }]
      },
      {
        id: 'sticker', anim: 'tyres.sticker',
        title: V('Najděte předepsaný tlak', 'Find the specified pressure'),
        body: V('Předepsaný tlak je na **štítku vozu** (B-sloupek, víčko nádrže) a v uživatelské příručce – často zvlášť pro běžné a plné zatížení. Číslo na boku pneumatiky je **maximum**, ne doporučený tlak.', 'The specified pressure is on the **car\'s sticker** (B-pillar, fuel flap) and in the owner\'s manual – often separately for normal and full load. The number on the tyre sidewall is the **maximum**, not the recommended pressure.'),
        notes: [{ level: 'info', text: V('Hodnoty tlaku záměrně neuvádíme – liší se podle rozměru pneu a zatížení. Vždy použijte štítek vašeho vozu.', 'We deliberately do not list pressure values – they depend on tyre size and load. Always use your car\'s sticker.') }]
      },
      {
        id: 'pressure', anim: 'tyres.pressure',
        title: V('Změřte a upravte tlak za studena', 'Measure and adjust the pressure cold'),
        body: V('1. Odšroubujte čepičku ventilku.\n2. Nasaďte měřič rovně a rychle, ať neuniká vzduch.\n3. Dohustěte nebo upusťte na předepsanou hodnotu.\n4. Nasaďte čepičku (chrání ventil před nečistotou).\n\nKontrolujte **jednou za měsíc** a před dlouhou cestou – i rezervu.', '1. Unscrew the valve cap.\n2. Press the gauge on straight and quickly so no air escapes.\n3. Inflate or deflate to the specified value.\n4. Refit the cap (keeps dirt out of the valve).\n\nCheck **once a month** and before a long trip – including the spare.'),
        notes: [
          { level: 'warning', text: V('Podhuštěná pneu se přehřívá, horší brzdění a může se rozpadnout při vysoké rychlosti.', 'An under-inflated tyre overheats, brakes worse and can fail at high speed.') },
          { level: 'tip', text: V('Čerpací stanice mívají nepřesné měřiče – vlastní digitální měřič se vyplatí.', 'Petrol station gauges are often inaccurate – your own digital gauge is worth it.') }
        ]
      },
      {
        id: 'tread', anim: 'tyres.tread',
        title: V('Změřte hloubku dezénu', 'Measure the tread depth'),
        body: V('Hloubkoměrem změřte hlavní drážky na **vnitřní, střední a vnější** části a na několika místech obvodu. Nerovnoměrné sjetí napovídá:\n- vnitřní / vnější hrana = geometrie (sbíhavost, odklon)\n- střed = přehušťování\n- obě hrany = podhušťování\n- „zuby“ / ploška = tlumiče, vyvážení', 'With the gauge measure the main grooves on the **inner, middle and outer** part and at several places around. Uneven wear tells you:\n- inner / outer edge = alignment (toe, camber)\n- centre = over-inflation\n- both edges = under-inflation\n- cupping / flat spot = shocks, balancing'),
        specs: [{ label: V('Zákonné minimum (letní)', 'Legal minimum (summer)'), value: '1,6 mm', verify: true }, { label: V('Zimní pneu (pro zimní provoz)', 'Winter tyre (for winter use)'), value: V('≥ 4 mm (osobní), vyšší pro těžší vozidla', '≥ 4 mm (cars), more for heavier vehicles'), verify: true }],
        notes: [
          { level: 'warning', text: V('Pod 3 mm (zima 4 mm) prudce roste brzdná dráha na mokru i riziko aquaplaningu – plánujte výměnu dřív, než dosáhnete minima.', 'Below 3 mm (winter 4 mm) the wet braking distance and aquaplaning risk rise sharply – plan replacement before you reach the minimum.') }
        ]
      },
      {
        id: 'dot', anim: 'tyres.dot',
        title: V('Zkontrolujte stáří pneumatik', 'Check the tyre age'),
        body: V('Poslední čtyři číslice kódu **DOT** jsou týden a rok výroby (2321 = 23. týden 2021). Guma stárne i bez jízdy – tvrdne a praská.', 'The last four digits of the **DOT** code are week and year of manufacture (2321 = week 23 of 2021). Rubber ages even without driving – it hardens and cracks.'),
        notes: [{ level: 'caution', text: V('Doporučení výrobců se liší; obecně: od 6 let pečlivě kontrolovat, nad 10 let vyměnit i s dobrým dezénem (ověřit u výrobce pneu).', 'Manufacturer advice varies; generally: inspect carefully from 6 years, replace over 10 years even with good tread (verify with the tyre maker).'), verify: true }]
      },
      {
        id: 'damage', anim: 'tyres.damage',
        title: V('Prohlédněte poškození', 'Inspect for damage'),
        body: V('Projděte celý obvod včetně **vnitřního boku** (natočte kola / použijte baterku): boule, řezy, praskliny, cizí předměty, poškozené ventilky, ohnutý disk.', 'Go over the whole circumference including the **inner sidewall** (turn the steering / use a torch): bulges, cuts, cracks, foreign objects, damaged valves, bent rims.'),
        notes: [
          { level: 'danger', text: V('Boule na boku = přetržená kostra. Okamžitě vyměnit, nejezdit.', 'A bulge on the sidewall = broken carcass. Replace immediately, do not drive.') },
          { level: 'info', text: V('Hřebík ve vzorku nevytahujte – utěsňuje díru. Dojeďte opatrně do pneuservisu (oprava jen ve vzorku, ne v boku).', 'Do not pull out a nail in the tread – it plugs the hole. Drive carefully to a tyre shop (repairs only in the tread, never in the sidewall).') }
        ]
      },
      {
        id: 'rotation', anim: 'tyres.rotation',
        title: V('Rotace kol (prohození)', 'Wheel rotation'),
        body: V('Prohazováním kol se pneu sjíždějí rovnoměrněji. Schéma závisí na pohonu a typu pneu – viz animaci pro váš vůz. **Směrové pneu** (šipka na boku) jen dopředu↔dozadu na stejné straně.', 'Rotating the wheels makes the tyres wear more evenly. The pattern depends on the drive and tyre type – see the animation for your car. **Directional tyres** (arrow on the sidewall) only front↔rear on the same side.'),
        notes: [{ level: 'caution', text: V('Různé rozměry vpředu a vzadu (staggered) nelze prohazovat mezi nápravami.', 'Different front and rear sizes (staggered) cannot be swapped between axles.') }]
      },
      {
        id: 'lift', anim: 'lift.stands',
        title: V('Přezutí: zvedněte vůz bezpečně', 'Seasonal swap: lift the car safely'),
        body: V('Šrouby povolte ještě na zemi, pak zvedejte podle návodu **Bezpečné zvednutí vozu**. Pracujte vždy na jednom kole, nebo použijte stojany pod celou nápravu.', 'Loosen the bolts while still on the ground, then lift as described in **Safely lifting the car**. Work on one wheel at a time, or use stands under the whole axle.'),
        notes: [{ level: 'danger', text: V('Nikdy pod vůz jen na heveru.', 'Never under the car on a jack alone.') }]
      },
      {
        id: 'swap', anim: 'lift.wheeloff',
        title: V('Vyměňte kola', 'Swap the wheels'),
        body: V('Sundejte kolo, očistěte dosedací plochu náboje, nasaďte kolo na správnou pozici (dle označení) a šrouby zašroubujte rukou. Hliníkové a ocelové disky mohou mít **jiné šrouby** – nezaměňujte je.', 'Remove the wheel, clean the hub contact face, fit the wheel in the correct position (per the marking) and thread the bolts in by hand. Alloy and steel wheels may need **different bolts** – do not mix them up.'),
        notes: [{ level: 'warning', text: V('Špatné šrouby (délka, tvar dosedací plochy kužel/koule) = kolo se může uvolnit.', 'Wrong bolts (length, seat shape cone/ball) = the wheel can come loose.') }]
      },
      {
        id: 'torque', anim: 'lift.torque',
        title: V('Dotáhněte momentem a dohustěte', 'Torque the bolts and set pressures'),
        body: V('Na zemi dotáhněte do kříže momentovým klíčem, pak nastavte tlak ve všech kolech. Po 50–100 km šrouby znovu dotáhněte.', 'On the ground tighten in a star pattern with a torque wrench, then set the pressure in all wheels. Re-torque the bolts after 50–100 km.'),
        specs: [{ label: V('Utahovací moment', 'Torque'), value: V('viz návod na zvedání / příručka', 'see lifting tutorial / manual') }]
      },
      {
        id: 'tpms', anim: 'tyres.tpms',
        title: V('Reset / kalibrace TPMS', 'TPMS reset / calibration'),
        body: V('Pokud má vůz hlídání tlaku (TPMS), po úpravě tlaku nebo přezutí ho zkalibrujte. **Nepřímé TPMS** (přes ABS) se učí za jízdy, **přímé** (senzory v kolech) potřebuje senzory i v zimních kolech, jinak svítí kontrolka.', 'If the car has tyre pressure monitoring (TPMS), calibrate it after adjusting pressures or swapping wheels. **Indirect TPMS** (via ABS) learns while driving, **direct** (sensors in the wheels) needs sensors in the winter wheels too, otherwise the warning stays on.'),
        notes: [{ level: 'warning', text: V('Kalibrace při špatném tlaku „naučí“ systém špatnou hodnotu – únik pak neodhalí.', 'Calibrating with wrong pressures "teaches" the system a wrong value – it will then miss a leak.') }]
      },
      {
        id: 'storage', anim: 'tyres.storage',
        title: V('Uskladněte sundaná kola', 'Store the removed wheels'),
        body: V('Kola omyjte, označte polohu (LP, PP, LZ, PZ), zkontrolujte dezén a poškození. Kola s disky skladujte naležato nebo zavěšená, pneu bez disků nastojato.', 'Wash the wheels, mark their position (FL, FR, RL, RR), check tread and damage. Store wheels on rims flat or hung, tyres without rims upright.')
      }
    ],
    vehicles: {
      'mb-cl500-c216': {
        status: 'ok',
        specs: [
          { label: V('Rozměr', 'Size'), value: V('dle ORV – možná rozdílné rozměry vpředu/vzadu (staggered)', 'per papers – possibly different front/rear sizes (staggered)'), verify: true },
          { label: V('Štítek s tlaky', 'Pressure sticker'), value: V('víčko nádrže', 'fuel filler flap'), verify: true },
          { label: V('TPMS', 'TPMS'), value: V('volitelné – ověřte, zda je ve voze', 'optional – check whether fitted'), verify: true }
        ],
        notes: [
          { level: 'warning', text: V('**ABC:** při přezouvání dodržte postup zvedání z návodu – ABC podvozek se může sám pohnout.', '**ABC:** follow the lifting tutorial when swapping wheels – the ABC suspension can move on its own.') },
          { level: 'info', text: V('Těžká 18–20" kola: použijte středicí trn a zvedejte z nohou.', 'Heavy 18–20" wheels: use an alignment pin and lift with your legs.') }
        ],
        steps: { rotation: { notes: [{ level: 'caution', text: V('Pokud máte vpředu a vzadu různé šířky, rotace mezi nápravami není možná – ověřte v ORV.', 'If front and rear widths differ, rotating between axles is not possible – check the papers.'), verify: true }] } }
      },
      'volvo-xc60-b4': {
        status: 'caution',
        specs: [
          { label: V('Pohon', 'Drive'), value: 'AWD' },
          { label: V('Štítek s tlaky', 'Pressure sticker'), value: V('B-sloupek řidiče', 'driver B-pillar'), verify: true },
          { label: V('TPMS', 'TPMS'), value: V('ano – kalibrace v centrálním displeji', 'yes – calibration in the centre display'), verify: true }
        ],
        notes: [
          { level: 'danger', text: V('**Vzduchový podvozek:** před zvedáním vypněte regulaci výšky / režim zvedání (viz návod na zvedání).', '**Air suspension:** switch off level control / jacking mode before lifting (see lifting tutorial).'), verify: true },
          { level: 'warning', text: V('**AWD:** všechna 4 pneu stejný rozměr, typ a podobné opotřebení – jinak hrozí poškození spojky pohonu zadních kol.', '**AWD:** all 4 tyres same size, type and similar wear – otherwise the rear drive coupling can be damaged.') }
        ]
      },
      'skoda-octavia-rs-tdi': {
        status: 'ok',
        specs: [
          { label: V('Pohon', 'Drive'), value: V('přední (FWD)', 'front (FWD)') },
          { label: V('Štítek s tlaky', 'Pressure sticker'), value: V('víčko nádrže', 'fuel filler flap'), verify: true },
          { label: V('Kontrola tlaku', 'Pressure monitoring'), value: V('nepřímá (přes ABS), pokud je ve výbavě – tlačítko SET / menu', 'indirect (via ABS) if fitted – SET button / menu'), verify: true }
        ],
        notes: [{ level: 'info', text: V('U předního pohonu se rychleji sjíždí přední pneu – lepší pneu dávejte dozadu (stabilita).', 'With FWD the front tyres wear faster – put the better tyres on the rear (stability).') }]
      },
      'toyota-gr-yaris': {
        status: 'caution',
        specs: [
          { label: V('Pohon', 'Drive'), value: 'GR-FOUR AWD' },
          { label: V('Štítek s tlaky', 'Pressure sticker'), value: V('B-sloupek řidiče', 'driver B-pillar'), verify: true },
          { label: V('TPMS', 'TPMS'), value: V('přímé (senzory) – inicializace v menu MID', 'direct (sensors) – initialisation in the MID menu'), verify: true }
        ],
        notes: [
          { level: 'warning', text: V('**AWD:** rozdíl obvodu pneu mezi nápravami zatěžuje spojku a diferenciály – vždy sada 4 stejných pneu.', '**AWD:** circumference differences between axles stress the coupling and diffs – always a set of 4 identical tyres.') },
          { level: 'info', text: V('Po trackdayi kontrolujte tlak za studena a pneu na trhání/„graining“.', 'After a track day check cold pressures and look for chunking / graining.') }
        ]
      },
      'citroen-jumper-22hdi': {
        status: 'caution',
        specs: [
          { label: V('Pneu', 'Tyres'), value: V('zátěžové „C“ (Commercial) – index nosnosti dle ORV', 'load-rated "C" (commercial) – load index per papers'), verify: true },
          { label: V('Tlak', 'Pressure'), value: V('podle zatížení – štítek / příručka', 'depends on load – sticker / manual'), verify: true },
          { label: V('Zimní pneu', 'Winter tyres'), value: V('min. hloubka dle kategorie vozidla (3,5 t vs. více) – ověřit', 'minimum depth depends on vehicle category (3.5 t vs. more) – verify'), verify: true }
        ],
        notes: [
          { level: 'danger', text: V('**Těžké vozidlo:** hever a stojany min. 3 t, vyložit náklad. Kolo dodávky je těžké – opatrně.', '**Heavy vehicle:** jack and stands rated ≥3 t, unload cargo. A van wheel is heavy – be careful.') },
          { level: 'warning', text: V('Jen pneu s označením **C** a správným indexem nosnosti – osobní pneu na dodávku nepatří.', 'Only tyres marked **C** with the correct load index – passenger-car tyres do not belong on a van.') }
        ],
        steps: { sticker: { body: V('U dodávky je tlak silně závislý na zatížení – zadní kola plně naložené dodávky potřebují výrazně víc. Hodnoty najdete na štítku / v příručce.', 'On a van the pressure strongly depends on load – the rear tyres of a fully loaded van need considerably more. Values are on the sticker / in the manual.') } }
      }
    }
  });
})(window.STU);
