/* Tutorial: Coolant check & change. */
(function (S) {
  'use strict';
  var V = function (cs, en) { return { cs: cs, en: en }; };

  S.registerTutorial({
    id: 'coolant',
    level: 1,
    thumb: 'coolant.drain',
    time: V('1–2 h', '1–2 h'),
    title: V('Kontrola a výměna chladicí kapaliny', 'Coolant check & change'),
    summary: V('Mrazuvzdornost, správný typ kapaliny, vypuštění, naplnění a hlavně odvzdušnění.', 'Freeze protection, correct coolant type, draining, filling and above all bleeding.'),
    intro: V(
      'Chladicí kapalina chrání motor před přehřátím, zamrznutím i korozí. Časem ztrácí přísady a začne motor zevnitř poškozovat. Výrobci předepisují výměnu podle let / km (často 4–10 let) – podívejte se do servisní knížky.\n\nNejdůležitější je **správný typ kapaliny** a **dokonalé odvzdušnění**. Vzduchová bublina v hlavě motoru způsobí přehřátí, i když je nádobka plná.',
      'Coolant protects the engine against overheating, freezing and corrosion. Over time it loses its additives and starts damaging the engine from the inside. Manufacturers specify a change by years / mileage (often 4–10 years) – check the service book.\n\nThe most important things are **the correct coolant type** and **complete bleeding**. An air pocket in the cylinder head causes overheating even when the tank is full.'
    ),
    safety: [
      { level: 'danger', text: V('**Nikdy neotvírejte horký chladicí systém.** Je pod tlakem a kapalina má přes 100 °C – vystříkne a způsobí těžké popáleniny. Otevírejte jen studený motor (pod cca 40 °C), pomalu, přes hadr.', '**Never open a hot cooling system.** It is pressurised and the coolant is above 100 °C – it sprays out and causes severe burns. Open only a cold engine (below approx. 40 °C), slowly, through a rag.') },
      { level: 'danger', text: V('Chladicí kapalina (etylenglykol) je **jedovatá** a chutná sladce – smrtelná pro psy, kočky i děti. Každou louži hned vytřete, vypuštěnou kapalinu uzavřete a odevzdejte na sběrném dvoře.', 'Coolant (ethylene glycol) is **poisonous** and tastes sweet – deadly for dogs, cats and children. Wipe up every puddle immediately, seal drained coolant and take it to a recycling centre.') },
      { level: 'warning', text: V('Ventilátor chladiče se může **rozběhnout i při vypnutém motoru**. Ruce, vlasy a hadry dál od ventilátoru; při práci u ventilátoru odpojte jeho konektor nebo baterii.', 'The radiator fan can **start even with the engine off**. Keep hands, hair and rags away from the fan; disconnect its plug or the battery when working near it.') },
      { level: 'warning', text: V('Při odvzdušňování za chodu motoru pozor na rotující řemeny a horké díly (výfuk, hadice).', 'When bleeding with the engine running watch out for moving belts and hot parts (exhaust, hoses).') },
      { level: 'caution', text: V('**Typy kapalin nemíchejte.** Různé technologie (silikátová, OAT, HOAT, P-HOAT) spolu mohou reagovat a tvořit kal. Používejte jen typ předepsaný výrobcem, ředěný **destilovanou / demineralizovanou** vodou.', '**Do not mix coolant types.** Different technologies (silicate, OAT, HOAT, P-HOAT) can react and form sludge. Use only the type specified by the manufacturer, diluted with **distilled / demineralised** water.') },
      { level: 'info', text: V('Ochranné brýle a nitrilové rukavice. Kapalina dráždí oči a kůži.', 'Safety glasses and nitrile gloves. Coolant irritates eyes and skin.') }
    ],
    tools: [
      V('Refraktometr nebo hustoměr na chladicí kapalinu', 'Refractometer or coolant hydrometer'),
      V('Záchytná vana (min. 10–15 l) + kanystr s víčkem', 'Drain pan (at least 10–15 L) + canister with lid'),
      V('Kleště na hadicové spony', 'Hose clamp pliers'),
      V('Trychtýř (ideálně odvzdušňovací trychtýř na nádobku)', 'Funnel (ideally a spill-free bleeding funnel for the tank)'),
      V('Vakuové plnicí zařízení (doporučeno, na stlačený vzduch)', 'Vacuum filling tool (recommended, compressed-air driven)'),
      V('Hever a stojany (pokud je výpust zespodu)', 'Jack and stands (if the drain is underneath)'),
      V('Hadry, nitrilové rukavice, brýle', 'Rags, nitrile gloves, glasses')
    ],
    parts: [
      V('Chladicí kapalina dle specifikace výrobce (koncentrát nebo hotová směs)', 'Coolant per manufacturer spec (concentrate or ready mix)'),
      V('Destilovaná / demineralizovaná voda (pokud je koncentrát)', 'Distilled / demineralised water (if using concentrate)'),
      V('Těsnění vypouštěcího šroubu / O-kroužky dle potřeby', 'Drain plug seal / O-rings as needed')
    ],
    finalChecks: [
      V('Víčko nádobky dotažené', 'Expansion tank cap tight'),
      V('Hladina za studena mezi MIN a MAX', 'Level between MIN and MAX when cold'),
      V('Vypouštěcí šroub / hadice dotažené, nic nekape', 'Drain plug / hose tight, no leaks'),
      V('Teplota motoru při jízdě normální, ventilátor spíná', 'Engine temperature normal when driving, fan switches on'),
      V('Topení fouká teplý vzduch (= okruh topení odvzdušněn)', 'Heater blows warm air (= heater circuit bled)'),
      V('Vypuštěná kapalina uzavřená, žádné louže (zvířata!)', 'Drained coolant sealed, no puddles (pets!)'),
      V('Další den za studena hladina znovu zkontrolována', 'Level re-checked cold the next day')
    ],
    steps: [
      {
        id: 'check', anim: 'coolant.level',
        title: V('Zkontrolujte hladinu a stav kapaliny', 'Check the level and condition'),
        body: V(
          'Na **studeném** motoru a rovině zkontrolujte hladinu v expanzní nádobce – má být mezi MIN a MAX.\n\nPodívejte se na barvu a čistotu: kapalina má být čirá a barevná. **Hnědá, rezavá, mléčná nebo s olejovou vrstvou** = problém (koroze, únik oleje, vadné těsnění hlavy). V takovém případě nejdřív diagnostika, ne jen výměna.',
          'On a **cold** engine and level ground check the level in the expansion tank – it should be between MIN and MAX.\n\nLook at the colour and clarity: coolant should be clear and coloured. **Brown, rusty, milky or with an oily film** = problem (corrosion, oil leak, failed head gasket). In that case diagnose first, do not just change it.'
        ),
        notes: [
          { level: 'warning', text: V('Pokud kapalina pravidelně ubývá, hledejte únik (hadice, chladič, vodní pumpa, topení). Bílý kouř z výfuku a sladká vůně můžou znamenat vadné těsnění hlavy.', 'If coolant keeps disappearing, look for a leak (hoses, radiator, water pump, heater). White exhaust smoke and a sweet smell can mean a failed head gasket.') }
        ]
      },
      {
        id: 'test', anim: 'coolant.test',
        title: V('Změřte mrazuvzdornost', 'Measure freeze protection'),
        body: V(
          'Pár kapek kapaliny (ze studené nádobky) dejte na **refraktometr** a podívejte se proti světlu. Hranice modré a bílé ukazuje bod tuhnutí.\n\nV našich podmínkách by ochrana měla být alespoň **−25 °C**, ideálně −30 až −35 °C.',
          'Put a few drops of coolant (from the cold tank) on the **refractometer** and look through it against the light. The blue/white boundary shows the freezing point.\n\nIn central European conditions protection should be at least **−25 °C**, ideally −30 to −35 °C.'
        ),
        notes: [
          { level: 'tip', text: V('Mrazuvzdornost v pořádku neznamená, že je kapalina dobrá – antikorozní přísady se vyčerpají dřív. Řiďte se intervalem výměny.', 'Good freeze protection does not mean the coolant is fine – anti-corrosion additives run out sooner. Follow the change interval.') }
        ]
      },
      {
        id: 'cool', anim: 'coolant.hot',
        title: V('Nechte motor vychladnout a uvolněte tlak', 'Let the engine cool and release pressure'),
        body: V(
          'Motor nechte vychladnout – ideálně přes noc, minimálně 2–3 hodiny. Víčko expanzní nádobky přikryjte hadrem a povolte ho **pomalu o čtvrt otáčky** – nechte syčení doznít. Teprve pak víčko sundejte.',
          'Let the engine cool down – ideally overnight, at least 2–3 hours. Cover the expansion tank cap with a rag and loosen it **slowly by a quarter turn** – let any hissing stop. Only then remove the cap.'
        ),
        notes: [
          { level: 'danger', text: V('Pokud víčko syčí nebo z něj stříká – okamžitě zpět dotáhnout a dál čekat.', 'If the cap hisses or spits – tighten it back at once and keep waiting.') }
        ]
      },
      {
        id: 'type', anim: 'coolant.mix',
        title: V('Připravte správnou kapalinu', 'Prepare the correct coolant'),
        body: V(
          'Kupte kapalinu se **schválením výrobce** (norma na obalu, ne jen barva!). Barva není spolehlivé vodítko – různé typy mají podobnou barvu.\n\nKoncentrát řeďte **destilovanou vodou** – obvykle 1 : 1 (ochrana cca −35 °C). Nikdy ne víc než ~60 % koncentrátu – čistý koncentrát chladí hůř a dřív zamrzne. Hotové směsi (např. Toyota) **neřeďte**.',
          'Buy coolant with the **manufacturer approval** (spec on the bottle, not just the colour!). Colour is not a reliable guide – different types look alike.\n\nDilute concentrate with **distilled water** – usually 1 : 1 (protection approx. −35 °C). Never more than ~60 % concentrate – pure concentrate cools worse and freezes sooner. **Do not dilute** ready mixes (e.g. Toyota).'
        ),
        notes: [
          { level: 'caution', text: V('Kohoutková voda obsahuje vápník a chloridy – usazuje kámen a podporuje korozi. Jen destilovaná / demineralizovaná.', 'Tap water contains calcium and chlorides – it forms scale and promotes corrosion. Only distilled / demineralised.') },
          { level: 'info', text: V('Celkový objem systému (viz specifikace vozu) obvykle nevypustíte celý – část zůstane v bloku. Počítejte s rezervou.', 'You usually cannot drain the whole system volume (see vehicle specs) – some stays in the block. Buy some extra.') }
        ]
      },
      {
        id: 'lift', anim: 'lift.stands',
        title: V('Zpřístupněte výpust', 'Get access to the drain'),
        body: V(
          'Výpust (šroub na chladiči nebo spodní hadice) bývá zespodu za spodním krytem motoru. Pokud je potřeba vůz zvednout, postupujte podle návodu **Bezpečné zvednutí vozu**. Vůz by měl stát vodorovně.',
          'The drain (plug on the radiator or the lower hose) is usually underneath, behind the engine undertray. If the car must be lifted, follow the **Safely lifting the car** tutorial. The car should be level.'
        ),
        notes: [
          { level: 'danger', text: V('Pod vůz jen na stojanech po testu stability.', 'Only under the car on stands after the stability test.') }
        ]
      },
      {
        id: 'drain', anim: 'coolant.drain',
        title: V('Vypusťte starou kapalinu', 'Drain the old coolant'),
        body: V(
          '1. Víčko expanzní nádobky je **otevřené** (kapalina vyteče rychleji).\n2. Pod výpust dejte velkou vanu.\n3. Povolte vypouštěcí šroub chladiče (často plastový – citlivě) nebo stáhněte sponu a sundejte spodní hadici.\n4. Nechte vytéct. Pokud výrobce uvádí výpust na bloku motoru, použijte i ten.',
          '1. The expansion tank cap is **open** (coolant drains faster).\n2. Place a large pan under the drain.\n3. Open the radiator drain plug (often plastic – gently) or release the clamp and pull off the lower hose.\n4. Let it drain. If the manufacturer lists a drain on the engine block, use it too.'
        ),
        notes: [
          { level: 'caution', text: V('Plastové hrdlo chladiče a staré hadice snadno prasknou. Ztvrdlou hadici nepáčte šroubovákem – raději ji vyměňte.', 'Plastic radiator necks and old hoses crack easily. Do not lever a hardened hose with a screwdriver – replace it instead.') },
          { level: 'tip', text: V('Volitelně: systém propláchněte destilovanou vodou (naplnit, krátce prohřát, vypustit), pokud byla kapalina špinavá. Pak počítejte s vodou, která v bloku zůstane – zvyšte podíl koncentrátu.', 'Optional: flush the system with distilled water (fill, warm briefly, drain) if the coolant was dirty. Then account for the water left in the block – increase the concentrate share.') }
        ]
      },
      {
        id: 'vacuum', anim: 'coolant.vacuum',
        title: V('Zavřete výpust a (doporučeno) naplňte vakuem', 'Close the drain and (recommended) vacuum fill'),
        body: V(
          'Výpust zavřete s novým těsněním / hadici nasaďte a zajistěte sponou.\n\n**Vakuové plnění** (zařízení na stlačený vzduch): nasaďte adaptér na nádobku, vytvořte podtlak, chvíli vyčkejte (ručička nesmí klesat = systém těsní), pak otevřete ventil a kapalina se sama nasaje bez vzduchových bublin. U moderních motorů s dlouhými hadicemi je to nejspolehlivější metoda.',
          'Close the drain with a new seal / refit the hose and secure it with its clamp.\n\n**Vacuum filling** (compressed-air tool): fit the adapter to the tank, pull a vacuum, wait a moment (the needle must not drop = system is tight), then open the valve and the coolant is drawn in without air pockets. On modern engines with long hoses this is the most reliable method.'
        ),
        notes: [
          { level: 'info', text: V('Pokud vakuové zařízení nemáte, plňte pomalu podle dalšího kroku a důkladně odvzdušněte.', 'If you do not have a vacuum tool, fill slowly as in the next step and bleed thoroughly.') },
          { level: 'tip', text: V('Pokles podtlaku při testu = netěsnost. Najděte ji dřív, než nalijete novou kapalinu.', 'Vacuum dropping during the test = a leak. Find it before you pour in new coolant.') }
        ]
      },
      {
        id: 'fill', anim: 'coolant.fill',
        title: V('Naplňte kapalinou', 'Fill with coolant'),
        body: V(
          'Pokud neplníte vakuem: nalévejte **pomalu** do expanzní nádobky, aby vzduch stačil unikat. Občas promačkejte horní hadici chladiče – vytlačíte bubliny. Plňte, dokud hladina neklesá.',
          'If not vacuum filling: pour **slowly** into the expansion tank so air can escape. Squeeze the upper radiator hose now and then – it pushes out bubbles. Fill until the level stops dropping.'
        ),
        notes: [
          { level: 'tip', text: V('Odvzdušňovací trychtýř nasazený na nádobku (s vlastní zásobou kapaliny) usnadní odvzdušnění za chodu motoru.', 'A spill-free bleeding funnel fitted on the tank (with its own coolant reserve) makes bleeding with the engine running much easier.') }
        ]
      },
      {
        id: 'bleed', anim: 'coolant.bleed',
        title: V('Odvzdušněte šrouby (pokud jsou)', 'Open the bleed screws (if fitted)'),
        body: V(
          'Některé motory mají **odvzdušňovací šrouby** (na hadici, termostatu nebo chladiči). Povolte je, dokud z nich místo vzduchu nezačne téct kapalina bez bublin, pak zavřete.\n\nPokud motor odvzdušňovací šroub nemá, odvzdušní se přes expanzní nádobku za chodu (další krok).',
          'Some engines have **bleed screws** (on a hose, thermostat housing or radiator). Open them until coolant without bubbles comes out instead of air, then close.\n\nIf the engine has no bleed screw, it bleeds through the expansion tank while running (next step).'
        ),
        notes: [
          { level: 'caution', text: V('Odvzdušňovací šrouby bývají plastové – povolujte a dotahujte jen citlivě rukou nebo malým klíčem.', 'Bleed screws are often plastic – open and close them gently by hand or with a small tool.') }
        ]
      },
      {
        id: 'run', anim: 'coolant.run',
        title: V('Nastartujte a odvzdušněte za chodu', 'Start up and bleed while running'),
        body: V(
          '1. **Topení na maximum** teploty, ventilátor na nízký stupeň (okruh topení se tak otevře).\n2. Nastartujte, nechte běžet, občas zvyšte otáčky na ~2000 ot./min.\n3. Sledujte hladinu (nádobka otevřená jen s odvzdušňovacím trychtýřem, jinak zavřená!) a **ručičku teploty**.\n4. Po otevření termostatu klesne hladina – doplňte. Pokračujte, dokud nesepne ventilátor chladiče a topení nefouká teplý vzduch.',
          '1. **Heater to maximum** temperature, blower on a low setting (this opens the heater circuit).\n2. Start the engine, let it run, raise the revs to ~2000 rpm now and then.\n3. Watch the level (tank open only with a bleeding funnel, otherwise closed!) and **the temperature gauge**.\n4. When the thermostat opens the level drops – top up. Continue until the radiator fan switches on and the heater blows warm air.'
        ),
        notes: [
          { level: 'danger', text: V('Teplota stoupá nad normál nebo topení fouká studeně při horkém motoru = vzduchová bublina. **Motor ihned vypněte**, nechte vychladnout a odvzdušněte znovu. Přehřátí zničí těsnění hlavy.', 'Temperature rising above normal or the heater blowing cold with a hot engine = air pocket. **Switch off immediately**, let it cool and bleed again. Overheating destroys the head gasket.') },
          { level: 'warning', text: V('Víčko bez odvzdušňovacího trychtýře otevírejte zase **jen za studena**.', 'Without a bleeding funnel, open the cap again **only when cold**.') }
        ]
      },
      {
        id: 'recheck', anim: 'coolant.level',
        title: V('Kontrola za studena a těsnost', 'Cold check and leak check'),
        body: V(
          'Po vychladnutí (ideálně druhý den ráno) zkontrolujte hladinu – vzduch se ještě mohl dostat ven a hladina klesnout. Doplňte na MAX.\n\nZkontrolujte výpust, hadice a spony – nic nesmí kapat. Prvních pár dní sledujte teplotu a hladinu.',
          'After cooling (ideally the next morning) check the level – remaining air may have escaped and the level dropped. Top up to MAX.\n\nCheck the drain, hoses and clamps – nothing must drip. Watch temperature and level for the first few days.'
        ),
        notes: [
          { level: 'tip', text: V('Na nádobku nebo do servisní knížky zapište datum výměny a typ kapaliny.', 'Write the change date and coolant type on the tank or in the service book.') }
        ]
      }
    ],
    vehicles: {
      'skoda-octavia-rs-tdi': {
        status: 'ok',
        specs: [
          { label: V('Typ kapaliny', 'Coolant type'), value: V('G13 (VW TL 774 J) – fialová, nemíchat s G11', 'G13 (VW TL 774 J) – violet, do not mix with G11'), verify: true },
          { label: V('Objem systému', 'System capacity'), value: V('cca 7–8 l', 'approx. 7–8 L'), verify: true },
          { label: V('Poměr', 'Ratio'), value: V('min. 40 % koncentrátu (−25 °C), běžně 50 % (−35 °C)', 'min. 40 % concentrate (−25 °C), typically 50 % (−35 °C)') },
          { label: V('Doporučené plnění', 'Recommended filling'), value: V('Vakuové zařízení', 'Vacuum filler'), verify: true }
        ],
        notes: [
          { level: 'info', text: V('Chladič VAG obvykle nemá vypouštěcí šroub – kapalina se vypouští **stažením spodní hadice** u chladiče (pružinová spona). Ověřte v ELSA.', 'VAG radiators usually have no drain plug – coolant is drained by **pulling off the lower hose** at the radiator (spring clamp). Verify in ELSA.'), verify: true },
          { level: 'caution', text: V('Motor nemá klasický odvzdušňovací šroub – odvzdušnění vakuem nebo za chodu přes nádobku. Kontrolujte i chladič EGR (vzduch v něm zhoršuje chlazení výfukových plynů).', 'The engine has no classic bleed screw – bleed by vacuum or while running via the tank. Also mind the EGR cooler (air in it impairs exhaust gas cooling).'), verify: true }
        ],
        steps: {
          drain: { body: V('Uvolněte pružinovou sponu spodní hadice u chladiče kleštěmi a hadici stáhněte (ověřte v ELSA, zda váš chladič nemá výpust).', 'Release the spring clamp of the lower radiator hose with pliers and pull off the hose (verify in ELSA whether your radiator has a drain).') },
          bleed: { skip: true }
        }
      },
      'volvo-xc60-b4': {
        status: 'caution',
        specs: [
          { label: V('Typ kapaliny', 'Coolant type'), value: V('Originální chladicí kapalina Volvo (dle VIDA)', 'Genuine Volvo coolant (per VIDA)'), verify: true },
          { label: V('Objem systému', 'System capacity'), value: V('dle VIDA', 'per VIDA'), verify: true },
          { label: V('Okruhy', 'Circuits'), value: V('možný samostatný nízkoteplotní okruh (elektronika / mezichladič)', 'possible separate low-temperature circuit (electronics / intercooler)'), verify: true },
          { label: V('Odvzdušnění', 'Bleeding'), value: V('postup VIDA s elektrickým čerpadlem', 'VIDA procedure with electric pump'), verify: true }
        ],
        notes: [
          { level: 'danger', text: V('**Vzduchové odpružení:** pokud vůz zvedáte, nejdřív aktivujte režim zvedání / vypněte regulaci výšky podle návodu Bezpečné zvednutí vozu.', '**Air suspension:** if you lift the car, first activate jacking mode / switch off level control per the Safely lifting the car tutorial.') },
          { level: 'warning', text: V('Moderní Volvo může mít **více chladicích okruhů** a elektrická čerpadla, která se při odvzdušnění spouští diagnostikou. Bez postupu z VIDA hrozí, že v okruhu zůstane vzduch a elektronika / turbo se přehřeje.', 'A modern Volvo may have **several cooling circuits** and electric pumps that are run by a scan tool during bleeding. Without the VIDA procedure air may remain and electronics / the turbo can overheat.'), verify: true },
          { level: 'info', text: V('48V mild-hybrid: komponenty (např. měnič DC/DC) mohou být chlazené kapalinou. Při práci kolem nich dodržte postup odpojení 12V + 48V z VIDA.', '48 V mild hybrid: components (e.g. the DC/DC converter) may be liquid cooled. When working near them follow the 12 V + 48 V disconnection procedure from VIDA.'), verify: true }
        ],
        steps: {
          run: { body: V('Odvzdušnění dokončete podle **VIDA** – servisní funkce spustí elektrická čerpadla chladicí kapaliny a otevře ventily okruhů. Pak teprve zkušební jízda.', 'Complete the bleeding per **VIDA** – the service function runs the electric coolant pumps and opens the circuit valves. Only then do a test drive.') }
        }
      },
      'mb-cl500-c216': {
        status: 'ok',
        specs: [
          { label: V('Typ kapaliny', 'Coolant type'), value: V('MB 325.0 (50 : 50 s destilovanou vodou)', 'MB 325.0 (50 : 50 with distilled water)'), verify: true },
          { label: V('Objem systému', 'System capacity'), value: V('cca 10–12 l', 'approx. 10–12 L'), verify: true },
          { label: V('Výpust', 'Drain'), value: V('šroub na chladiči (ověřit) + případně na bloku', 'radiator plug (verify) + possibly on the block'), verify: true }
        ],
        notes: [
          { level: 'danger', text: V('**ABC podvozek:** pokud vůz zvedáte, jen podle návodu Bezpečné zvednutí vozu a pouze na stojanech.', '**ABC suspension:** if you lift the car, only per the Safely lifting the car tutorial and only on stands.') },
          { level: 'info', text: V('Velký V8 = velký objem. Kupte dostatek kapaliny (koncentrát cca 6 l + destilovaná voda).', 'Big V8 = big volume. Buy enough coolant (approx. 6 L concentrate + distilled water).'), verify: true },
          { level: 'caution', text: V('Plastové hrdla a spojky chladicího systému M273 jsou po letech křehké – manipulujte opatrně, mějte náhradní spony.', 'Plastic necks and connectors of the M273 cooling system become brittle with age – handle gently, have spare clamps ready.') }
        ]
      },
      'toyota-gr-yaris': {
        status: 'ok',
        specs: [
          { label: V('Typ kapaliny', 'Coolant type'), value: V('Toyota Super Long Life Coolant (růžová, předmíchaná)', 'Toyota Super Long Life Coolant (pink, pre-mixed)'), verify: true },
          { label: V('Objem systému', 'System capacity'), value: V('dle TIS', 'per TIS'), verify: true },
          { label: V('Ředění', 'Dilution'), value: V('NEŘEDIT – už je 50 %', 'DO NOT dilute – already 50 %') }
        ],
        notes: [
          { level: 'caution', text: V('Toyota SLLC se prodává **předmíchaná** – neředit vodou. Nemíchat s jinými typy.', 'Toyota SLLC is sold **pre-mixed** – do not dilute with water. Do not mix with other types.'), verify: true },
          { level: 'info', text: V('Mezichladič je vzduch-vzduch (není v okruhu chladicí kapaliny) – ověřte. Postup odvzdušnění a umístění výpustí podle TIS.', 'The intercooler is air-to-air (not in the coolant circuit) – verify. Bleeding procedure and drain locations per TIS.'), verify: true },
          { level: 'warning', text: V('Při okruhovém provozu kontrolujte hladinu před každou jízdou a po ní (za studena).', 'With track use check the level before and after every session (when cold).') }
        ],
        steps: {
          type: { body: V('GR Yaris: použijte Toyota SLLC (předmíchanou) – žádné ředění.', 'GR Yaris: use Toyota SLLC (pre-mixed) – no dilution.') },
          lift: { body: V('Vůz je nízký – nízkoprofilový hever, zvedací body z boku. Spodní aerodynamický kryt bývá nutné sundat.', 'The car is low – low-profile jack, jacking points from the side. The underbody aero cover usually has to be removed.') }
        }
      }
    }
  });
})(window.STU);
