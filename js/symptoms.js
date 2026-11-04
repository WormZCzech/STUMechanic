/* Symptom guide ("what is wrong?" roadmap): symptom → possible causes → explanation → how to check → tutorials.
 * Schema: see js/core.js (registerSymptomGroup / registerSymptom). Bilingual cs/en.
 * Causes are listed common → rare; severity: 'stop' (do not drive), 'soon', 'watch'.
 */
(function (S) {
  'use strict';
  var V = function (cs, en) { return { cs: cs, en: en }; };
  /** cause helper: C(title, explain, likelihood, severity, check, tutorials, vehicles) */
  function C(title, explain, like, sev, check, tuts, veh) {
    return { title: title, explain: explain, likelihood: like, severity: sev, check: check, tutorials: tuts || [], vehicles: veh || {} };
  }
  function SYM(id, group, sev, title, desc, ask, causes) {
    S.registerSymptom({ id: id, group: group, severity: sev, title: title, desc: desc, ask: ask || [], causes: causes });
  }
  var CL = 'mb-cl500-c216', XC = 'volvo-xc60-b4', OC = 'skoda-octavia-rs-tdi', GR = 'toyota-gr-yaris', JU = 'citroen-jumper-22hdi';
  var DIAG = V('Nejdřív načtěte chybové kódy diagnostikou – výrazně zúží hledání.', 'First read the fault codes with a scan tool – it narrows the search a lot.');

  /* ================================================================ GROUPS */
  [
    ['noises', '🔊', V('Zvuky', 'Noises'), V('Klepání, pískání, vrčení, cvakání…', 'Knocking, squealing, humming, clicking…')],
    ['vibrations', '〰️', V('Vibrace', 'Vibrations'), V('Chvění volantu, karoserie nebo motoru', 'Shaking of the steering wheel, body or engine')],
    ['brakes', '🛑', V('Brzdy', 'Brakes'), V('Pedál, pískání, tahání do strany', 'Pedal feel, squealing, pulling')],
    ['steering', '🎯', V('Řízení a podvozek', 'Steering & handling'), V('Tahání, vůle, nestabilita, výška vozu', 'Pulling, play, instability, ride height')],
    ['clutch', '⚙️', V('Spojka a převodovka', 'Clutch & gearbox'), V('Prokluz, tvrdé řazení, automat', 'Slipping, hard shifting, automatic')],
    ['engine', '🔧', V('Chod motoru', 'Engine running'), V('Startování, volnoběh, výkon, zhasínání', 'Starting, idle, power, stalling')],
    ['smoke', '💨', V('Kouř a zápach', 'Smoke & smells'), V('Barva kouře a co znamenají pachy', 'Smoke colour and what smells mean')],
    ['leaks', '💧', V('Úniky kapalin', 'Leaks'), V('Barva skvrny pod autem prozradí kapalinu', 'The colour of the puddle tells you the fluid')],
    ['lights', '🚨', V('Kontrolky', 'Warning lights'), V('Červená = zastavit, žlutá = brzy řešit', 'Red = stop, yellow = fix soon')],
    ['electrical', '🔋', V('Elektrika', 'Electrical'), V('Baterie, startér, světla, pojistky', 'Battery, starter, lights, fuses')],
    ['temperature', '🌡️', V('Teplota a klimatizace', 'Temperature & A/C'), V('Přehřívání, studené topení, klimatizace', 'Overheating, cold heater, air conditioning')],
    ['tyres', '🛞', V('Pneumatiky a kola', 'Tyres & wheels'), V('Opotřebení, ztráta tlaku, poškození', 'Wear, pressure loss, damage')]
  ].forEach(function (g) { S.registerSymptomGroup({ id: g[0], icon: g[1], title: g[2], intro: g[3] }); });

  /* ================================================================ NOISES */
  SYM('knock-bumps', 'noises', 'soon',
    V('Klepání nebo ťukání přes nerovnosti', 'Knocking or clunking over bumps'),
    V('Kovové ťuknutí nebo dunění při přejezdu výmolů, retardérů nebo kolejí. Často je slyšet víc při nízké rychlosti a s otevřeným oknem.', 'A metallic clunk or thud when driving over potholes, speed bumps or rails. Often heard more at low speed with the window open.'),
    [V('Je zvuk vepředu nebo vzadu? Vlevo nebo vpravo?', 'Is it at the front or rear? Left or right?'), V('Klepe to i při otáčení volantem na místě?', 'Does it also knock when turning the wheel while stationary?'), V('Zhoršuje se to s nákladem?', 'Does it get worse with a load?')],
    [
      C(V('Opotřebené tyčky stabilizátoru', 'Worn anti-roll bar links'), V('Nejčastější příčina klepání. Malé kulové čepy na koncích tyček se vytlučou a při každém hupu ťuknou.', 'The most common cause of knocking. The small ball joints at the ends of the links wear out and clunk on every bump.'), 'common', 'soon',
        V('Na zvednutém voze uchopte tyčku a zkuste s ní pohnout – nesmí mít žádnou vůli ani klepat.', 'With the car lifted, grab the link and try to move it – there must be no play or knock.'), ['suspension-wear', 'lifting']),
      C(V('Silentbloky nebo kulové čepy ramen', 'Control arm bushes or ball joints'), V('Popraskaná pryž v uložení ramen nebo vytlučený kulový čep dovolí kolu pohyb, který se ozve jako dunění a vůz může „plavat“.', 'Cracked rubber in the arm bushes or a worn ball joint lets the wheel move, which you hear as a thud and the car may feel vague.'), 'common', 'soon',
        V('Páčidlem opatrně zapáčte mezi rameno a karoserii – viditelný pohyb nebo trhliny v pryži = výměna.', 'Carefully lever between the arm and the body with a pry bar – visible movement or cracked rubber = replace.'), ['suspension-wear', 'alignment']),
      C(V('Vadné tlumiče nebo jejich uložení (horní ložisko)', 'Worn shock absorbers or top mounts'), V('Tlumič bez oleje nebo vytlučené horní uložení přenáší nárazy přímo do karoserie.', 'A shock without oil or a worn top mount passes impacts straight into the body.'), 'possible', 'soon',
        V('Zatlačte na roh vozu a pusťte – víc než jeden a půl zhoupnutí nebo olej na tlumiči = vadný.', 'Push down on the corner and let go – more than one and a half bounces or oil on the shock = faulty.'), ['struts-springs']),
      C(V('Prasklá pružina', 'Broken coil spring'), V('Ulomený závit pružiny klepe a vůz v tom rohu sedí níž. Ostrý konec může prořezat pneumatiku!', 'A broken coil clunks and the car sits lower on that corner. The sharp end can cut the tyre!'), 'possible', 'stop',
        V('Prohlédněte pružinu svítilnou za kolem – hledejte zlom, obvykle u spodního talíře.', 'Inspect the spring with a torch behind the wheel – look for a break, usually near the lower seat.'), ['struts-springs']),
      C(V('Volný výfuk nebo tepelný štít', 'Loose exhaust or heat shield'), V('Prasklý gumový závěs nebo zrezivělá spona tepelného štítu udělá plechové chrastění.', 'A broken rubber hanger or rusted heat-shield clip makes a tinny rattle.'), 'possible', 'watch',
        V('Na studeném autě zatřeste koncovkou výfuku – nesmí narážet do karoserie.', 'On a cold car shake the tailpipe – it must not hit the body.'), ['exhaust'])
    ]);
  S.symptomMap['knock-bumps'].causes[2].vehicles[CL] = V('CL 500 má hydraulický podvozek ABC – klepání může dělat i vytlučená vzpěra ABC nebo uložení. Diagnostika XENTRY.', 'The CL 500 has hydraulic ABC suspension – a worn ABC strut or mount can knock too. Diagnose with XENTRY.');
  S.symptomMap['knock-bumps'].causes[2].vehicles[XC] = V('XC60 má vzduchové měchy – klepání může dělat vadné horní uložení měchu nebo tlumič.', 'The XC60 has air springs – a worn air strut top mount or damper can knock.');
  S.symptomMap['knock-bumps'].causes[3].vehicles[JU] = V('Jumper má vzadu listová pera – zkontrolujte zlomené listy, třmeny a uložení per (náklad je namáhá).', 'The Jumper has rear leaf springs – check for broken leaves, U-bolts and spring eyes (load stresses them).');

  SYM('squeal-belt', 'noises', 'soon',
    V('Pískání z motoru při startu nebo zapnutí topení/klimatizace', 'Squealing from the engine on start-up or when A/C is switched on'),
    V('Vysoké pištění z motorového prostoru, nejvíc ráno, za vlhka nebo při prudkém otočení volantem či zapnutí klimatizace.', 'A high-pitched squeal from the engine bay, worst in the morning, when damp, on full steering lock or switching the A/C on.'),
    [V('Zmizí pískání po zahřátí?', 'Does it go away once warm?'), V('Mění se se zatížením (světla, klima, řízení)?', 'Does it change with load (lights, A/C, steering)?')],
    [
      C(V('Prokluzující drážkový řemen', 'Slipping auxiliary (poly-V) belt'), V('Starý, ztvrdlý nebo povolený řemen proklouzne na řemenici, když alternátor nebo kompresor klimatizace chtějí víc síly.', 'An old, hardened or loose belt slips on a pulley when the alternator or A/C compressor demand more torque.'), 'common', 'soon',
        V('Vypnutý motor: prohlédněte řemen – trhliny, lesklé boky nebo chybějící kousky žeber = výměna.', 'Engine off: inspect the belt – cracks, glazed sides or missing rib pieces = replace.'), ['aux-belt'],
        null),
      C(V('Vadný napínák nebo vodicí kladka', 'Faulty tensioner or idler pulley'), V('Unavená pružina napínáku nedrží řemen napnutý, ložisko kladky může pískat samo.', 'A tired tensioner spring cannot keep the belt tight, and a pulley bearing can squeal on its own.'), 'common', 'soon',
        V('Při běžícím motoru sledujte rameno napínáku – nesmí výrazně kmitat. Kladky protočte rukou se sundaným řemenem.', 'With the engine running watch the tensioner arm – it must not flutter. Spin the pulleys by hand with the belt off.'), ['aux-belt']),
      C(V('Ložisko alternátoru, vodní pumpy nebo kompresoru', 'Alternator, water pump or compressor bearing'), V('Ložisko na konci životnosti píská nebo vrčí stále a s otáčkami.', 'A worn bearing squeals or growls constantly and with revs.'), 'possible', 'soon',
        V('Se sundaným řemenem protočte řemenice rukou – drhnutí nebo vůle = vadné ložisko.', 'With the belt off spin each pulley by hand – roughness or play = bad bearing.'), ['aux-belt', 'alternator-starter', 'thermostat-pump']),
      C(V('Brzdy (pískání při jízdě)', 'Brakes (squeal while driving)'), V('Pokud pískání souvisí s jízdou a ne s otáčkami motoru, podívejte se na brzdy.', 'If the squeal follows road speed rather than engine revs, look at the brakes.'), 'rare', 'soon', null, ['brakes'])
    ]);
  S.symptomMap['squeal-belt'].causes[0].vehicles[XC] = V('Na XC60 pohání řemen i 48V startér-generátor (ISGM) – řemen je výrazně zatížen. Před prací odpojte 12V i 48V systém dle VIDA.', 'On the XC60 the belt also drives the 48V starter-generator (ISGM) and is heavily loaded. Disconnect 12V and 48V systems per VIDA before working.');

  SYM('hum-speed', 'noises', 'soon',
    V('Hučení nebo vrčení, které sílí s rychlostí', 'Humming or growling that rises with speed'),
    V('Hluboké hučení jako letadlo, které se mění s rychlostí jízdy (ne s otáčkami motoru). Často se mění v zatáčce.', 'A deep drone like an aeroplane that changes with road speed (not engine revs). Often changes in corners.'),
    [V('Zeslábne v levotočivé, nebo pravotočivé zatáčce?', 'Does it get quieter in a left-hand or a right-hand bend?'), V('Je stejné při plynu i bez plynu?', 'Is it the same on and off the throttle?')],
    [
      C(V('Opotřebené ložisko kola', 'Worn wheel bearing'), V('Ložisko kola hučí a zesiluje, když ho zatížíte. Zatáčka doleva zatíží pravá ložiska a naopak – když hluk v pravotočivé zatáčce zesílí, bývá vadné levé ložisko.', 'A wheel bearing hums and gets louder when loaded. A left turn loads the right-hand bearings and vice versa – if the noise rises in a right-hand bend, the left bearing is usually bad.'), 'common', 'soon',
        V('Na zvednutém voze uchopte kolo na 12 a 6 hodinách a kývejte – vůle; protočte kolo rukou – drhnutí nebo hrčení.', 'With the car lifted, grip the wheel at 12 and 6 o’clock and rock it – play; spin it by hand – roughness or grinding.'), ['wheel-bearing', 'lifting']),
      C(V('Nerovnoměrně sjeté pneumatiky („zubaté“)', 'Unevenly worn (cupped) tyres'), V('Vzorek sjetý do zubů hučí podobně jako ložisko. Bývá to následek špatné geometrie nebo tlumičů.', 'Tread worn into a saw-tooth pattern hums like a bearing. Usually caused by bad alignment or shocks.'), 'common', 'watch',
        V('Přejeďte dlaní po vzorku dopředu a dozadu – cítíte schody? Prohoďte kola a sledujte, zda se zvuk přesune.', 'Run your palm over the tread forwards and backwards – can you feel steps? Swap wheels and see if the noise moves.'), ['tyres', 'alignment']),
      C(V('Diferenciál / rozvodovka', 'Differential / final drive'), V('Vytí nebo hučení, které se mění mezi plynem a brzděním motorem, může být opotřebené ozubení nebo ložisko diferenciálu – často kvůli starému oleji.', 'A whine that changes between throttle and coasting can be worn gears or diff bearings – often from old oil.'), 'possible', 'soon',
        V('Zkontrolujte hladinu a stav oleje v převodovce / diferenciálu.', 'Check the level and condition of the gearbox / differential oil.'), ['drivetrain-oils', 'gearbox-noise'],
        null)
    ]);
  S.symptomMap['hum-speed'].causes[2].vehicles = {};
  S.symptomMap['hum-speed'].causes[2].vehicles[GR] = V('GR Yaris má přední i zadní diferenciál a spojku GR-FOUR – po okruzích olej rychle stárne. Viz příprava na okruh.', 'The GR Yaris has front and rear diffs and the GR-FOUR coupling – oil ages fast after track use. See track preparation.');
  S.symptomMap['hum-speed'].causes[2].tutorials.push('track-prep');
  S.symptomMap['hum-speed'].causes[2].vehicles[XC] = V('XC60 AWD má úhlový převod (PTU) a zadní diferenciál s vlastním olejem.', 'The XC60 AWD has a PTU and a rear drive unit with their own oil.');

  SYM('click-turning', 'noises', 'soon',
    V('Cvakání při zatáčení a rozjezdu', 'Clicking when turning and accelerating'),
    V('Rytmické cvak-cvak-cvak při plném rejdu, typicky při vyjíždění z parkoviště nebo na kruhovém objezdu.', 'A rhythmic click-click-click on full lock, typically pulling out of a parking space or on a roundabout.'),
    [V('Je to slyšet hlavně se zatočeným volantem a při plynu?', 'Is it mainly with the wheel turned and on the throttle?')],
    [
      C(V('Opotřebený vnější homokinetický kloub', 'Worn outer CV joint'), V('Když praskne gumová manžeta, vyteče mazivo a dovnitř se dostane písek. Kuličky kloubu se vytlučou a cvakají pod zatížením v rejdu.', 'When the rubber boot splits, grease escapes and grit gets in. The joint balls wear and click under load at full lock.'), 'common', 'soon',
        V('Prohlédněte manžety poloos za koly – roztržení nebo mazivo rozstříkané po okolí = začátek problému.', 'Inspect the driveshaft boots behind the wheels – a split or grease sprayed around = the start of the problem.'), ['cv-boot', 'lifting']),
      C(V('Volný kryt podběhu nebo brzdový plech', 'Loose wheel-arch liner or brake backing plate'), V('Ohnutý plech nebo uvolněný plast může ťukat o kolo v rejdu.', 'A bent backing plate or loose plastic liner can tick against the wheel on lock.'), 'possible', 'watch',
        V('Podívejte se, zda v rejdu něco neškrtá o pneumatiku nebo kotouč.', 'Look whether anything rubs on the tyre or disc at full lock.'), ['brakes']),
      C(V('Horní ložisko tlumiče (cvak při otáčení na místě)', 'Strut top bearing (click when turning while stationary)'), V('Ložisko v horním uložení vzpěry umožňuje otáčení – když je vadné, cvakne nebo vrže při otáčení volantem.', 'The bearing in the strut top mount lets it rotate – when worn it clicks or creaks as you turn the wheel.'), 'possible', 'watch',
        V('Ruku položte na pružinu nebo horní uložení a nechte druhého otáčet volantem – cítíte skok?', 'Put a hand on the spring or top mount while a helper turns the wheel – do you feel it jump?'), ['struts-springs'])
    ]);

  SYM('rattle-cold-start', 'noises', 'soon',
    V('Chrastění pár sekund po studeném startu', 'Rattle for a few seconds after a cold start'),
    V('Kovové chrastění z motoru hned po nastartování, které po několika sekundách zmizí.', 'A metallic rattle from the engine right after starting that disappears after a few seconds.'),
    [V('Trvá jen do natlakování oleje (2–5 s)?', 'Does it last only until oil pressure builds (2–5 s)?'), V('Svítí kontrolka motoru?', 'Is the engine light on?')],
    [
      C(V('Natažený rozvodový řetěz / napínák', 'Stretched timing chain / tensioner'), V('Hydraulický napínák řetězu potřebuje tlak oleje. Při nataženém řetězu nebo opotřebeném napínáku řetěz po startu chvíli „plácá“. Neřešený problém může skončit přeskočením řetězu a zničením motoru.', 'The hydraulic chain tensioner needs oil pressure. With a stretched chain or worn tensioner the chain slaps briefly after a start. Ignored, it can jump teeth and destroy the engine.'), 'common', 'soon',
        DIAG, ['timing-belt', 'diagnostics', 'oil-change']),
      C(V('Hydraulická zdvihátka ventilů', 'Hydraulic valve lifters'), V('Zdvihátka vyprázdněná přes noc chvíli ťukají, než se naplní olejem. Horší se starým nebo nesprávným olejem.', 'Lifters that drained overnight tick until they fill with oil. Worse with old or wrong oil.'), 'possible', 'watch',
        V('Zkontrolujte stáří a specifikaci oleje; po výměně často zmizí.', 'Check the age and spec of the oil; often disappears after a change.'), ['oil-change']),
      C(V('Dvouhmotový setrvačník (diesel)', 'Dual-mass flywheel (diesel)'), V('Chrastění při startu a vypnutí motoru nebo na volnoběh u dieselu bývá vytlučený dvouhmotový setrvačník.', 'A rattle on start-up and shut-down or at idle on a diesel is often a worn dual-mass flywheel.'), 'possible', 'soon',
        V('Zmizí chrastění po sešlápnutí spojky na volnoběh? Pak je to spíš setrvačník.', 'Does the rattle stop when you press the clutch at idle? Then it is more likely the flywheel.'), ['clutch', 'gearbox-noise'])
    ]);
  S.symptomMap['rattle-cold-start'].causes[0].vehicles[CL] = V('M273 V8: u raných motorů známé opotřebení vložených kol a vodítek řetězu (kódy P0016–P0019). Neodkládejte diagnostiku – OVĚŘIT dle čísla motoru.', 'M273 V8: early engines are known for idler gear and chain guide wear (codes P0016–P0019). Do not delay diagnosis – VERIFY by engine number.');
  S.symptomMap['rattle-cold-start'].causes[0].vehicles[JU] = V('2.2 HDi má rozvodový řetěz – chrastění po startu je důvod k diagnostice.', 'The 2.2 HDi has a timing chain – rattle after start-up is a reason for diagnosis.');
  S.symptomMap['rattle-cold-start'].causes[0].vehicles[GR] = V('G16E má řetěz – při okruhovém provozu a starém oleji je natažení pravděpodobnější. Měňte olej často.', 'The G16E has a chain – stretching is more likely with track use and old oil. Change the oil often.');
  S.symptomMap['rattle-cold-start'].causes[2].vehicles[OC] = V('Octavia 2.0 TDI s manuálem má dvouhmotový setrvačník – typický zdroj chrastění na volnoběh.', 'The Octavia 2.0 TDI manual has a dual-mass flywheel – a typical source of rattle at idle.');

  SYM('exhaust-loud', 'noises', 'soon',
    V('Hlasitější výfuk, bručení nebo syčení', 'Louder exhaust, droning or hissing'),
    V('Motor najednou zní hlasitěji, při plynu syčí nebo „prdí“, případně je cítit výfukové plyny v kabině.', 'The engine suddenly sounds louder, hisses or puffs under throttle, or you smell exhaust in the cabin.'),
    [V('Cítíte výfukové plyny uvnitř?', 'Can you smell exhaust inside?'), V('Je hluk vepředu u motoru nebo vzadu?', 'Is the noise at the front near the engine or at the rear?')],
    [
      C(V('Prorezlý tlumič nebo trubka', 'Rusted-through silencer or pipe'), V('Výfuk koroduje zevnitř kondenzátem – hlavně při krátkých jízdách. Díra = hluk a výfukové plyny pod vozem.', 'Exhausts rust from the inside due to condensation – especially on short trips. A hole = noise and fumes under the car.'), 'common', 'soon',
        V('Studený výfuk: prohlédněte svítilnou, při běžícím motoru (venku!) poslouchejte, kde syčí.', 'Cold exhaust: inspect with a torch; with the engine running (outdoors!) listen where it hisses.'), ['exhaust']),
      C(V('Netěsný spoj, těsnění nebo prasklý svod', 'Leaking joint, gasket or cracked manifold'), V('Syčení nebo ťukání u motoru, hlavně za studena. Netěsnost před lambda sondou může rozhodit směs.', 'Hissing or ticking near the engine, mainly when cold. A leak before the lambda sensor can upset the mixture.'), 'possible', 'soon',
        V('Hledejte černé saze u spojů a příruby.', 'Look for black soot around joints and flanges.'), ['exhaust', 'diagnostics']),
      C(V('Prasklý závěs a výfuk naráží', 'Broken hanger, exhaust knocking'), V('Bez závěsu se výfuk prověsí a duní nebo naráží do karoserie.', 'Without a hanger the exhaust sags and drones or hits the body.'), 'possible', 'watch', null, ['exhaust'])
    ]);
  S.symptomMap['exhaust-loud'].causes[0].severity = 'soon';
  S.symptomMap['exhaust-loud'].causes[0].vehicles[JU] = V('Jumper: pokud má DPF/FAP, netěsnost před ním zkresluje měření tlaku – může svítit kontrolka DPF.', 'Jumper: if it has a DPF/FAP, a leak before it upsets pressure measurement – the DPF light may come on.');

  SYM('turbo-whistle', 'noises', 'soon',
    V('Hvízdání nebo sirénové zvuky při plynu (turbo)', 'Whistling or siren sound under throttle (turbo)'),
    V('Nový, výraznější pískot nebo „siréna“ při zrychlování, někdy se ztrátou výkonu nebo modrým kouřem.', 'A new, louder whistle or siren under acceleration, sometimes with loss of power or blue smoke.'),
    [V('Je přitom méně výkonu?', 'Is there less power at the same time?'), V('Kouří auto?', 'Is the car smoking?')],
    [
      C(V('Netěsná hadice plnicího vzduchu / intercooler', 'Leaking boost hose / intercooler'), V('Prasklá nebo sklouznutá hadice za turbem píská a syčí; motor nemá plnicí tlak a jde do nouzového režimu.', 'A split or loose hose after the turbo whistles and hisses; the engine lacks boost and goes into limp mode.'), 'common', 'soon',
        V('Na studeném motoru prohlédněte hadice a spony – olejový povlak prozradí netěsnost.', 'On a cold engine inspect hoses and clamps – an oily film shows a leak.'), ['turbo', 'diagnostics']),
      C(V('Opotřebené turbodmychadlo', 'Worn turbocharger'), V('Vůle hřídele turba způsobí, že lopatky drhnou o skříň – siréna, modrý kouř, olej v sání. Nejčastější příčinou je starý olej a vypínání motoru hned po jízdě.', 'Shaft play lets the blades rub on the housing – siren, blue smoke, oil in the intake. Usually caused by old oil and switching off right after hard driving.'), 'possible', 'stop',
        V('Sundejte hadici sání a opatrně (vypnutý motor) zkontrolujte vůli hřídele a stopy dotyku lopatek.', 'Remove the intake hose and carefully (engine off) check shaft play and blade rub marks.'), ['turbo', 'oil-change'])
    ]);
  S.symptomMap['turbo-whistle'].causes[1].vehicles[GR] = V('GR Yaris: po rychlé jízdě nechte motor 30–60 s na volnoběh, aby turbo vychladlo.', 'GR Yaris: after hard driving idle 30–60 s so the turbo can cool down.');

  SYM('clunk-gearchange', 'noises', 'watch',
    V('Ťuknutí při rozjezdu, přeřazení nebo přidání plynu', 'Clunk when pulling away, shifting or getting on the throttle'),
    V('Jedno silné ťuknutí nebo cuknutí, když se mění zatížení – rozjezd, zařazení D/R, prudké přidání nebo ubrání plynu.', 'A single heavy clunk or jolt when the load changes – pulling away, selecting D/R, sudden throttle on or off.'),
    [V('Hýbe se motor viditelně, když druhý přidá plyn se zataženou brzdou?', 'Does the engine visibly move when a helper revs it with the brakes on?')],
    [
      C(V('Opotřebená uložení motoru / převodovky', 'Worn engine / gearbox mounts'), V('Pryžová uložení stárnutím praskají nebo se z nich vytratí kapalina. Motor se pak při změně zatížení „hodí“ a ťukne.', 'Rubber mounts crack with age or lose their fluid. The engine then rocks and clunks when the load changes.'), 'common', 'watch',
        V('Druhý člověk sešlápne brzdu, zařadí a krátce přidá – sledujte, zda motor neposkočí víc než ~1 cm. Stůjte bokem, nikdy před vozem!', 'A helper holds the brake, selects a gear and blips the throttle – watch whether the engine jumps more than ~1 cm. Stand to the side, never in front of the car!'), ['engine-mounts']),
      C(V('Vůle v kloubech poloos nebo kardanu', 'Play in driveshaft joints or propshaft'), V('Vůle v kloubech se projeví ťuknutím při změně směru točivého momentu.', 'Play in the joints shows up as a clunk when the torque direction changes.'), 'possible', 'watch',
        V('Na zvednutém voze zkuste poloosou nebo kardanem otočit proti sobě – vůle?', 'With the car lifted try twisting the driveshaft or propshaft against itself – play?'), ['cv-boot']),
      C(V('Automat: tvrdé zařazení (adaptace, olej)', 'Automatic: harsh engagement (adaptation, fluid)'), V('Starý olej nebo chybná adaptace převodovky způsobí tvrdé zařazení nebo cuknutí.', 'Old fluid or wrong adaptation causes harsh engagement or a jolt.'), 'possible', 'watch', DIAG, ['gearbox-7g', 'drivetrain-oils', 'diagnostics'])
    ]);
  S.symptomMap['clunk-gearchange'].causes[2].vehicles[CL] = V('7G-Tronic (722.9): typické jsou chyby vodičové desky a tvrdé řazení se starým olejem – viz návod 7G-Tronic.', '7G-Tronic (722.9): conductor-plate faults and harsh shifts with old fluid are typical – see the 7G-Tronic tutorial.');

  /* ============================================================ VIBRATIONS */
  SYM('vib-speed', 'vibrations', 'soon',
    V('Chvění volantu nebo vozu v určité rychlosti', 'Steering wheel or car shakes at a certain speed'),
    V('Volant se třese typicky mezi 80 a 120 km/h, při vyšší nebo nižší rychlosti chvění slábne.', 'The steering wheel shakes typically between 80 and 120 km/h and calms down above or below that.'),
    [V('Třese se volant (přední kola), nebo sedačka (zadní kola)?', 'Does the steering wheel shake (front wheels) or the seat (rear wheels)?'), V('Začalo to po přezutí nebo nárazu do obrubníku?', 'Did it start after a tyre change or hitting a kerb?')],
    [
      C(V('Nevyvážené kolo', 'Unbalanced wheel'), V('Odpadlé vyvažovací závaží nebo nalepené bláto/sníh v disku. Nejčastější příčina, levná oprava.', 'A lost balance weight or mud/snow stuck inside the rim. The most common cause and a cheap fix.'), 'common', 'watch',
        V('Zkontrolujte, zda na disku nechybí závaží (čistý obdélník po závaží), vyčistěte vnitřek disku. Nechte vyvážit.', 'Check whether a weight is missing (a clean rectangle where it was), clean the inside of the rim. Have the wheels balanced.'), ['tyres']),
      C(V('Poškozená pneumatika nebo ohnutý disk', 'Damaged tyre or bent rim'), V('Boule na boku, posunutý nárazník pláště nebo ohnutý disk po obrubníku – vibrace nejdou vyvážit.', 'A bulge on the sidewall, a shifted belt or a rim bent by a kerb – the vibration cannot be balanced out.'), 'possible', 'stop',
        V('Prohlédněte boky pneumatik a vnitřní stranu disků. Boule = okamžitě vyměnit, hrozí roztržení.', 'Inspect tyre sidewalls and the inside of the rims. A bulge = replace immediately, risk of a blowout.'), ['tyres']),
      C(V('Volné šrouby kol', 'Loose wheel bolts'), V('Po přezutí bez momentového klíče se šrouby mohou povolit. Velmi nebezpečné – kolo může upadnout.', 'After a wheel change without a torque wrench, bolts can loosen. Very dangerous – the wheel can come off.'), 'possible', 'stop',
        V('Okamžitě zastavte a dotáhněte šrouby momentovým klíčem.', 'Stop immediately and torque the bolts with a torque wrench.'), ['lifting', 'tyres']),
      C(V('Vůle v řízení nebo podvozku', 'Play in the steering or suspension'), V('Vytlučené čepy nebo silentbloky zesilují i malou nevyváženost.', 'Worn joints or bushes amplify even a small imbalance.'), 'possible', 'soon', null, ['suspension-wear', 'alignment'])
    ]);

  SYM('vib-idle', 'vibrations', 'soon',
    V('Motor se třese na volnoběh', 'Engine shakes at idle'),
    V('Karoserie, volant nebo řadicí páka vibrují na volnoběh, někdy víc se zapnutou klimatizací nebo zařazeným D.', 'The body, steering wheel or gear lever vibrate at idle, sometimes more with A/C on or in D.'),
    [V('Svítí nebo bliká kontrolka motoru?', 'Is the engine light on or flashing?'), V('Je to horší za studena?', 'Is it worse when cold?')],
    [
      C(V('Vynechávání válce', 'Misfire'), V('Jeden válec nepracuje (svíčka, cívka, vstřikovač, žhavicí svíčka za studena). Motor pak běží nerovnoměrně.', 'One cylinder is not firing (spark plug, coil, injector, glow plug when cold). The engine then runs unevenly.'), 'common', 'soon',
        DIAG, ['diagnostics', 'spark-plugs', 'injectors']),
      C(V('Vadná uložení motoru', 'Worn engine mounts'), V('Uložení tlumí vibrace motoru – opotřebené je přenáší do karoserie.', 'Mounts damp engine vibration – worn ones pass it into the body.'), 'common', 'watch', null, ['engine-mounts']),
      C(V('Dvouhmotový setrvačník (diesel s manuálem)', 'Dual-mass flywheel (manual diesel)'), V('Opotřebený setrvačník přestane tlumit rázy motoru – chvění a chrastění na volnoběh.', 'A worn flywheel stops absorbing engine pulses – shaking and rattling at idle.'), 'possible', 'soon', null, ['clutch']),
      C(V('Falešný vzduch / EGR', 'Vacuum leak / EGR'), V('Netěsnost v sání nebo zaseknutý ventil EGR rozhodí směs a volnoběh.', 'An intake leak or a stuck EGR valve upsets the mixture and idle.'), 'possible', 'watch', DIAG, ['egr-dpf', 'diagnostics'])
    ]);
  S.symptomMap['vib-idle'].causes[3].vehicles[OC] = V('Octavia 2.0 TDI: zanesený EGR ventil a chladič EGR jsou časté – viz návod EGR/DPF.', 'Octavia 2.0 TDI: a clogged EGR valve and cooler are common – see the EGR/DPF tutorial.');

  SYM('vib-accel', 'vibrations', 'soon',
    V('Vibrace jen při zrychlování', 'Vibration only under acceleration'),
    V('Chvění, které se objeví při plynu (hlavně z nízké rychlosti) a zmizí při jízdě bez plynu.', 'Shaking that appears under throttle (mainly from low speed) and disappears when coasting.'),
    [V('Zmizí vibrace, když pustíte plyn?', 'Does it go away when you lift off?')],
    [
      C(V('Vnitřní kloub poloosy', 'Inner driveshaft joint'), V('Opotřebený vnitřní (trojramenný) kloub vibruje pod zatížením, hlavně při rozjezdu do kopce.', 'A worn inner (tripod) joint vibrates under load, especially pulling away uphill.'), 'common', 'soon',
        V('Zkontrolujte manžety a vůli poloos.', 'Check the boots and driveshaft play.'), ['cv-boot']),
      C(V('Uložení motoru', 'Engine mounts'), V('Motor se pod zatížením naklání víc, než má, a vibrace jdou do karoserie.', 'The engine tilts more than it should under load and vibration goes into the body.'), 'possible', 'watch', null, ['engine-mounts']),
      C(V('Kardan / mezilehlé ložisko (zadní pohon)', 'Propshaft / centre bearing (RWD)'), V('U vozů se zadním pohonem může vibrace dělat opotřebený pružný kotouč kardanu nebo mezilehlé ložisko.', 'On rear-wheel-drive cars a worn propshaft flex disc or centre bearing can cause it.'), 'possible', 'soon', null, ['drivetrain-oils'])
    ]);
  S.symptomMap['vib-accel'].causes[2].vehicles[CL] = V('CL 500 je zadokolka – zkontrolujte pružné kotouče (hardy disky) a středové ložisko kardanu.', 'The CL 500 is rear-wheel drive – check the flex discs (guibos) and the propshaft centre bearing.');

  SYM('vib-low-speed', 'vibrations', 'watch',
    V('Houpání nebo „hrbolatost“ v nízké rychlosti po stání', 'Lumpy, bumpy ride at low speed after standing'),
    V('Po delším stání se auto prvních pár kilometrů „hrbolí“, pak se to srovná.', 'After standing for a while the car feels lumpy for the first few kilometres, then it smooths out.'),
    [],
    [
      C(V('Zploštělé pneumatiky po stání', 'Flat-spotted tyres after standing'), V('Pneumatika se po dlouhém stání na jednom místě zdeformuje, po zahřátí se obvykle vrátí.', 'A tyre deforms after standing in one place for a long time and usually recovers once warm.'), 'common', 'watch',
        V('Zkontrolujte tlak; pokud to po 10 km nezmizí, nechte vyvážit a prohlédnout pneumatiky.', 'Check the pressure; if it does not go away after 10 km, have the tyres balanced and inspected.'), ['tyres']),
      C(V('Zatuhlé brzdy po stání', 'Brakes sticking after standing'), V('Rez na kotoučích nebo zatuhlý píst může krátce drhnout.', 'Rust on the discs or a sticky piston can drag briefly.'), 'possible', 'watch', null, ['brakes'])
    ]);

  /* ================================================================ BRAKES */
  SYM('pedal-soft', 'brakes', 'stop',
    V('Měkký nebo propadající se brzdový pedál', 'Soft or sinking brake pedal'),
    V('Pedál jde hlouběji než dřív, je „houbovitý“, nebo při držení pomalu klesá k podlaze.', 'The pedal travels further than before, feels spongy, or slowly sinks to the floor while held.'),
    [V('Klesá pedál při stálém tlaku na semaforu?', 'Does the pedal sink when held steady at the lights?'), V('Klesla hladina brzdové kapaliny?', 'Has the brake fluid level dropped?'), V('Měnily se nedávno brzdy?', 'Were the brakes worked on recently?')],
    [
      C(V('Vzduch v brzdové soustavě', 'Air in the brake system'), V('Vzduch se na rozdíl od kapaliny stlačuje – pedál je měkký. Typicky po výměně dílů nebo když nádržka vyschla.', 'Unlike fluid, air compresses – the pedal goes soft. Typically after parts were replaced or the reservoir ran dry.'), 'common', 'stop',
        V('Nejezděte. Odvzdušněte brzdy podle návodu a zkontrolujte, odkud se vzduch dostal.', 'Do not drive. Bleed the brakes per the tutorial and find where the air got in.'), ['brake-bleed']),
      C(V('Únik brzdové kapaliny', 'Brake fluid leak'), V('Netěsná hadice, trubka nebo píst třmenu – kapalina ubývá a brzdný účinek mizí. Životu nebezpečné.', 'A leaking hose, pipe or caliper piston – fluid is lost and braking disappears. Life-threatening.'), 'common', 'stop',
        V('Hledejte mokrá místa u kol, na hadicích a pod hlavním válcem. Kapalina je čirá až nažloutlá, olejovitá.', 'Look for wet spots at the wheels, hoses and under the master cylinder. Fluid is clear to yellowish and oily.'), ['brake-lines', 'brake-bleed']),
      C(V('Stará brzdová kapalina (vroucí)', 'Old brake fluid (boiling)'), V('Kapalina natahuje vodu, která se při horkých brzdách vaří na páru – pedál po dlouhém brzdění z kopce změkne.', 'Fluid absorbs water, which boils into vapour with hot brakes – the pedal goes soft after long downhill braking.'), 'possible', 'stop',
        V('Kapalina starší než 2 roky nebo tmavá = výměna.', 'Fluid older than 2 years or dark = replace.'), ['brake-bleed']),
      C(V('Vadný hlavní brzdový válec', 'Faulty master cylinder'), V('Vnitřní netěsnost hlavního válce: pedál pomalu klesá, i když nic neteče ven.', 'An internal leak in the master cylinder: the pedal slowly sinks even though nothing leaks outside.'), 'rare', 'stop', null, ['brake-lines'])
    ]);
  S.symptomMap['pedal-soft'].causes[2].vehicles[GR] = V('GR Yaris na okruhu: použijte vysokoteplotní kapalinu a měňte ji častěji.', 'GR Yaris on track: use high-temperature fluid and change it more often.');

  SYM('pedal-hard', 'brakes', 'stop',
    V('Tvrdý brzdový pedál, auto špatně brzdí', 'Hard brake pedal, poor braking'),
    V('Na pedál musíte šlapat mnohem silněji než dřív, hlavně při vypnutém nebo právě nastartovaném motoru.', 'You have to press much harder than before, especially with the engine off or just started.'),
    [],
    [
      C(V('Posilovač brzd nemá podtlak', 'Brake booster has no vacuum'), V('Posilovač využívá podtlak (u dieselu z vývěvy). Prasklá hadička nebo vadná vývěva = tvrdý pedál.', 'The booster uses vacuum (from a vacuum pump on diesels). A split hose or failed pump = hard pedal.'), 'common', 'stop',
        V('S vypnutým motorem několikrát sešlápněte, držte a nastartujte – pedál by měl lehce „poklesnout“. Pokud ne, posilovač nefunguje.', 'With the engine off pump the pedal, hold it and start the engine – the pedal should drop slightly. If not, the booster is not working.'), ['brake-lines', 'diagnostics']),
      C(V('Zatuhlé třmeny nebo zasklené destičky', 'Seized calipers or glazed pads'), V('Destičky přehřáté nebo znečištěné olejem mají malé tření.', 'Overheated or oil-contaminated pads have little friction.'), 'possible', 'stop', null, ['brakes'])
    ]);

  SYM('brake-pulse', 'brakes', 'soon',
    V('Pulzující pedál a chvění volantu při brzdění', 'Pulsing pedal and shaking steering wheel when braking'),
    V('Pedál pod nohou „tepe“ a volant se chvěje, hlavně při brzdění z vyšší rychlosti.', 'The pedal pulses under your foot and the steering wheel shakes, especially braking from higher speed.'),
    [V('Je to jen z vyšší rychlosti?', 'Only from higher speed?'), V('Neplete se to s ABS (vrčení pedálu na kluzku)?', 'Is it not just ABS working (pedal buzz on a slippery road)?')],
    [
      C(V('Nerovnoměrné kotouče („házivé“)', 'Uneven discs (runout / thickness variation)'), V('Kotouč má nerovnou tloušťku nebo házivost – často kvůli rzi na náboji, přetaženým šroubům kol nebo přehřátí.', 'The disc has uneven thickness or runout – often due to rust on the hub, overtightened wheel bolts or overheating.'), 'common', 'soon',
        V('Změřte tloušťku kotouče na více místech, zkontrolujte stav dosedací plochy náboje.', 'Measure disc thickness at several points and check the hub contact face.'), ['brakes', 'lifting']),
      C(V('Vůle v podvozku', 'Suspension play'), V('Vytlučené silentbloky zesílí chvění při brzdění.', 'Worn bushes amplify judder when braking.'), 'possible', 'soon', null, ['suspension-wear'])
    ]);

  SYM('brake-squeal', 'brakes', 'watch',
    V('Pískání nebo vrzání brzd', 'Squealing or squeaking brakes'),
    V('Vysoký tón při lehkém brzdění nebo při jízdě bez brzdění.', 'A high-pitched noise when braking lightly or while driving without braking.'),
    [V('Píská to i bez brzdění?', 'Does it squeal without braking too?')],
    [
      C(V('Indikátor opotřebení destiček', 'Pad wear indicator'), V('Mnoho destiček má kovový jazýček, který při opotřebení začne pískat – varování, že je čas na výměnu.', 'Many pads have a metal tab that squeals when worn – a warning that it is time to replace them.'), 'common', 'soon',
        V('Změřte tloušťku obložení – pod 3 mm = výměna.', 'Measure the pad lining – under 3 mm = replace.'), ['brakes']),
      C(V('Vibrace destiček (chybí pasta, spony)', 'Pad vibration (missing paste, clips)'), V('Destička kmitá ve vedení – pomůže správná montáž, antivibrační pasta na zadní stranu a nové spony.', 'The pad vibrates in its guides – correct fitting, anti-squeal paste on the back and new clips help.'), 'common', 'watch', null, ['brakes']),
      C(V('Rez nebo vlhkost ráno', 'Rust or moisture in the morning'), V('Po dešti nebo ráno je na kotoučích tenká rez – pár zabrzdění ji očistí. Neškodné.', 'After rain or in the morning there is a thin rust film on the discs – a few stops clean it off. Harmless.'), 'common', 'watch', null, [])
    ]);

  SYM('brake-grind', 'brakes', 'stop',
    V('Skřípání kov na kov při brzdění', 'Metal-on-metal grinding when braking'),
    V('Hrubý skřípavý zvuk a cítit drhnutí pod nohou. Brzdná dráha se prodlužuje.', 'A harsh grinding noise and a rough feel under your foot. Stopping distance gets longer.'),
    [],
    [
      C(V('Úplně sjeté destičky', 'Completely worn pads'), V('Obložení je pryč a ocelová základna dře o kotouč. Brzdy rychle ztrácejí účinnost a kotouč se ničí.', 'The lining is gone and the steel backing grinds on the disc. Braking fades fast and the disc is ruined.'), 'common', 'stop',
        V('Nejezděte dál, než je nutné. Vyměňte destičky i kotouče.', 'Do not drive further than necessary. Replace pads and discs.'), ['brakes']),
      C(V('Kamínek mezi kotoučem a krytem', 'Stone between disc and dust shield'), V('Kamínek zaklíněný za kotoučem skřípe i bez brzdění.', 'A stone trapped behind the disc grinds even without braking.'), 'possible', 'soon', null, ['brakes'])
    ]);

  SYM('brake-pull', 'brakes', 'stop',
    V('Při brzdění auto táhne do strany', 'Car pulls to one side when braking'),
    V('Při sešlápnutí brzdy musíte volantem kontrovat, auto uhýbá vlevo nebo vpravo.', 'When you brake you have to correct with the steering, the car veers left or right.'),
    [V('Je jedno kolo po jízdě výrazně teplejší?', 'Is one wheel much hotter after a drive?')],
    [
      C(V('Zatuhlý píst nebo vodítko třmenu', 'Seized caliper piston or guide pin'), V('Jedna strana brzdí víc nebo neuvolní. Kolo se přehřívá a cítíte zápach.', 'One side brakes more or does not release. The wheel overheats and you smell it.'), 'common', 'stop',
        V('Po jízdě opatrně (bez dotyku!) porovnejte teplotu disků – teploměrem nebo přiblížením ruky.', 'After a drive carefully compare disc temperatures (without touching!) – with a thermometer or by holding a hand near.'), ['brakes']),
      C(V('Olej nebo kapalina na destičkách', 'Oil or fluid on the pads'), V('Znečištěné obložení na jedné straně ztratí tření.', 'Contaminated lining on one side loses friction.'), 'possible', 'stop', null, ['brakes', 'brake-lines']),
      C(V('Vůle v podvozku nebo pneumatiky', 'Suspension play or tyres'), V('Různé pneumatiky nebo vytlučené uložení ramen se projeví hlavně při brzdění.', 'Mismatched tyres or worn arm bushes show up mainly when braking.'), 'possible', 'soon', null, ['suspension-wear', 'tyres'])
    ]);

  SYM('parkbrake-weak', 'brakes', 'soon',
    V('Parkovací brzda nedrží nebo hlásí chybu', 'Parking brake does not hold or shows a fault'),
    V('Auto na svahu popojíždí, páka jde vysoko, nebo elektrická parkovací brzda hlásí chybu.', 'The car creeps on a slope, the lever goes up too far, or the electric parking brake shows a fault.'),
    [],
    [
      C(V('Povolená nebo zatuhlá lanka', 'Stretched or seized cables'), V('Lanka se natahují a rezaví. Mechanismus v třmenu nebo bubnu zatuhne.', 'Cables stretch and rust. The mechanism in the caliper or drum seizes.'), 'common', 'soon', null, ['brakes']),
      C(V('Sjeté zadní destičky / čelisti', 'Worn rear pads / shoes'), V('S tenkým obložením musí páka jít výš, než brzda začne držet.', 'With thin linings the lever has to travel further before the brake holds.'), 'possible', 'soon', null, ['brakes'])
    ]);
  S.symptomMap['parkbrake-weak'].causes[0].vehicles[XC] = V('XC60: elektrická parkovací brzda s motory na třmenech – chyba se čte diagnostikou; při výměně destiček nutný servisní režim.', 'XC60: electric parking brake with caliper motors – read the fault with a scan tool; service mode is required for pad changes.');
  S.symptomMap['parkbrake-weak'].causes[0].vehicles[CL] = V('CL 500: elektrická parkovací brzda s lankovým aktuátorem a čelistmi v kotouči (OVĚŘIT) – čelisti se nastavují stavěcím kolečkem.', 'CL 500: electric parking brake with a cable actuator and shoes inside the disc (VERIFY) – the shoes are adjusted with a star wheel.');
  S.symptomMap['parkbrake-weak'].causes[0].tutorials.push('diagnostics');

  /* ============================================================== STEERING */
  SYM('pull-straight', 'steering', 'soon',
    V('Auto táhne do strany při jízdě rovně', 'Car pulls to one side when driving straight'),
    V('Na rovné silnici musíte volant držet mírně na jednu stranu, nebo je volant při jízdě rovně nakřivo.', 'On a straight road you have to hold the wheel slightly to one side, or the wheel is off-centre when driving straight.'),
    [V('Začalo to po nárazu do obrubníku nebo výměně dílů?', 'Did it start after hitting a kerb or replacing parts?'), V('Táhne i po prohození předních kol?', 'Does it still pull after swapping the front wheels?')],
    [
      C(V('Rozdílný tlak v pneumatikách', 'Different tyre pressures'), V('Měkčí pneumatika má větší valivý odpor a auto táhne na její stranu.', 'A softer tyre has more rolling resistance and the car pulls towards it.'), 'common', 'watch',
        V('Zkontrolujte tlak na studených pneumatikách podle štítku ve dveřích.', 'Check pressures on cold tyres per the door-pillar label.'), ['tyres']),
      C(V('Špatná geometrie', 'Wrong wheel alignment'), V('Po nárazu nebo výměně dílů podvozku se změní sbíhavost / odklon. Auto táhne a pneumatiky se nerovnoměrně sjíždějí.', 'After an impact or replacing suspension parts, toe / camber change. The car pulls and tyres wear unevenly.'), 'common', 'soon',
        V('Podívejte se na opotřebení pneumatik – sjetý vnitřní nebo vnější okraj. Nechte změřit geometrii.', 'Look at tyre wear – a worn inner or outer edge. Have the alignment measured.'), ['alignment']),
      C(V('Drhnoucí brzda', 'Dragging brake'), V('Zatuhlý třmen brzdí jedno kolo i bez sešlápnutí pedálu.', 'A seized caliper brakes one wheel even without the pedal.'), 'possible', 'stop', null, ['brakes']),
      C(V('Opotřebený díl podvozku', 'Worn suspension part'), V('Vytlučený silentblok dovolí kolu „uhnout“.', 'A worn bush lets the wheel steer itself.'), 'possible', 'soon', null, ['suspension-wear'])
    ]);

  SYM('steering-play', 'steering', 'stop',
    V('Vůle ve volantu, auto „plave“', 'Play in the steering, car wanders'),
    V('Volant se dá kousek otočit, než auto zareaguje, nebo auto na rovné silnici samo bloudí.', 'You can turn the wheel a little before the car reacts, or the car wanders by itself on a straight road.'),
    [],
    [
      C(V('Opotřebené kulové čepy řízení (konce tyčí)', 'Worn tie-rod ends / inner tie rods'), V('Čepy řízení spojují řízení s koly. Vůle v nich je nebezpečná – v extrému může kolo ztratit vedení.', 'Tie-rod joints connect the steering to the wheels. Play is dangerous – in the extreme the wheel can lose guidance.'), 'common', 'stop',
        V('Na zvednutém voze uchopte kolo na 3 a 9 hodinách a kývejte – vůle = čep řízení. Do opravy nejezděte.', 'With the car lifted, grip the wheel at 3 and 9 o’clock and rock it – play = tie-rod. Do not drive until fixed.'), ['suspension-wear', 'alignment', 'lifting']),
      C(V('Vůle v ložisku kola nebo kulovém čepu ramene', 'Wheel bearing or lower ball joint play'), V('Vůle kolu dovolí pohyb nezávisle na řízení.', 'Play lets the wheel move independently of the steering.'), 'possible', 'stop', null, ['wheel-bearing', 'suspension-wear']),
      C(V('Opotřebená hřebenová převodka', 'Worn steering rack'), V('Vůle uvnitř převodky, často s klepáním na nerovnostech.', 'Play inside the rack, often with knocking over bumps.'), 'rare', 'stop', null, ['suspension-wear'])
    ]);

  SYM('steering-heavy', 'steering', 'soon',
    V('Těžké řízení', 'Heavy steering'),
    V('Volant jde ztěžka, hlavně při parkování, nebo posilovač občas vypadne.', 'The steering is heavy, especially when parking, or the power assistance cuts out sometimes.'),
    [V('Svítí kontrolka řízení?', 'Is a steering warning light on?')],
    [
      C(V('Podhuštěné pneumatiky', 'Under-inflated tyres'), V('Měkké pneumatiky mají větší styčnou plochu a řízení ztěžkne.', 'Soft tyres have a bigger contact patch and the steering gets heavy.'), 'common', 'watch', null, ['tyres']),
      C(V('Elektrický posilovač – chyba nebo slabá baterie', 'Electric power steering – fault or weak battery'), V('Elektrický posilovač potřebuje dobré napětí. Při slabé baterii nebo chybě snímače omezí pomoc.', 'Electric power steering needs good voltage. With a weak battery or a sensor fault it reduces assistance.'), 'possible', 'soon', DIAG, ['diagnostics', 'battery']),
      C(V('Hydraulický posilovač – málo kapaliny / řemen', 'Hydraulic power steering – low fluid / belt'), V('Únik kapaliny nebo prokluzující řemen čerpadla posilovače.', 'A fluid leak or a slipping pump belt.'), 'possible', 'soon', null, ['aux-belt']),
      C(V('Zatuhlé horní uložení nebo kulový čep', 'Seized top mount or ball joint'), V('Zarezlé díly kladou odpor a volant se po zatáčce špatně vrací.', 'Rusted parts resist and the wheel returns poorly after a turn.'), 'rare', 'soon', null, ['struts-springs', 'suspension-wear'])
    ]);
  S.symptomMap['steering-heavy'].causes[2].vehicles[CL] = V('CL 500 sdílí hydrauliku řízení s okruhem ABC (OVĚŘIT) – únik kapaliny se projeví na obou systémech.', 'The CL 500 power steering may share hydraulics with the ABC circuit (VERIFY) – a leak shows on both systems.');
  S.symptomMap['steering-heavy'].causes[2].tutorials.push('abc-hydraulics');

  SYM('car-sags', 'steering', 'soon',
    V('Auto stojí nakřivo nebo je jeden roh nízko', 'Car sits unevenly or one corner is low'),
    V('Po stání (přes noc) je vůz v jednom rohu nebo celý níž, případně se naklání.', 'After standing (overnight) the car is lower on one corner or overall, or it leans.'),
    [V('Klesá auto po vypnutí motoru postupně?', 'Does the car slowly drop after switching off?'), V('Svítí kontrolka podvozku?', 'Is a suspension warning light on?')],
    [
      C(V('Zlomená nebo unavená pružina', 'Broken or sagging spring'), V('Ulomený závit pružiny nebo zlomený list pera – vůz v rohu klesne.', 'A broken coil or leaf – the car drops at that corner.'), 'common', 'stop',
        V('Změřte výšku podběhů nad středem kol a porovnejte strany. Prohlédněte pružiny.', 'Measure arch height above wheel centres and compare sides. Inspect the springs.'), ['struts-springs']),
      C(V('Únik ze vzduchového měchu', 'Air spring leak'), V('Prasklý měch nebo netěsné vedení – vzduch uniká a vůz klesá, kompresor se přetěžuje.', 'A cracked air spring or leaking line – air escapes, the car drops and the compressor is overworked.'), 'possible', 'soon',
        V('Mýdlovou vodou postříkejte měchy a spoje – bubliny = únik.', 'Spray soapy water on springs and fittings – bubbles = leak.'), ['air-suspension']),
      C(V('Únik nebo vadný akumulátor v ABC', 'ABC leak or failed accumulator'), V('Hydraulický podvozek ABC drží výšku tlakem kapaliny. Únik nebo vadné akumulátory = pokles a tvrdá jízda.', 'ABC hydraulic suspension holds height with fluid pressure. A leak or failed accumulators = sagging and a harsh ride.'), 'possible', 'soon', DIAG, ['abc-hydraulics', 'diagnostics'])
    ]);
  S.symptomMap['car-sags'].causes[1].vehicles[XC] = V('Váš XC60 má vzduchové odpružení – při práci pod vozem vždy vypněte regulaci výšky!', 'Your XC60 has air suspension – always switch off level control before working under the car!');
  S.symptomMap['car-sags'].causes[2].vehicles[CL] = V('Typické pro CL 500 (ABC): pokles přes noc o několik cm = netěsný ventilový blok nebo vzpěra. Nikdy nepracujte pod vozem drženým jen ABC.', 'Typical for the CL 500 (ABC): dropping several cm overnight = a leaking valve block or strut. Never work under a car held up only by ABC.');
  S.symptomMap['car-sags'].causes[0].vehicles[JU] = V('Jumper: zadní listová pera trpí přetěžováním – zlomené listy, uvolněné třmeny. Dodržujte užitečné zatížení.', 'Jumper: the rear leaf springs suffer from overloading – broken leaves, loose U-bolts. Respect the payload.');
  S.symptomMap['car-sags'].causes[0].tutorials.push('van-care');

  SYM('bouncy-ride', 'steering', 'soon',
    V('Auto se houpe a je nestabilní v zatáčkách', 'Car bounces and feels unstable in corners'),
    V('Po nerovnosti se vůz několikrát zhoupne, v zatáčkách se víc naklání, při brzdění „kývá“ nosem.', 'After a bump the car bounces several times, leans more in corners and dives under braking.'),
    [],
    [
      C(V('Opotřebené tlumiče', 'Worn shock absorbers'), V('Tlumič mění pohyb pružiny na teplo. Bez oleje nebo plynu přestane tlumit – prodlouží se brzdná dráha!', 'A shock turns spring movement into heat. Without oil or gas it stops damping – stopping distances get longer!'), 'common', 'soon',
        V('Test zhoupnutím a hledání olejových stop na tělese tlumiče.', 'Bounce test and look for oil traces on the shock body.'), ['struts-springs']),
      C(V('Stabilizátor / jeho uložení', 'Anti-roll bar / its mounts'), V('Prasklé pouzdro nebo tyčka stabilizátoru zvětší náklon.', 'A cracked bush or link increases body roll.'), 'possible', 'watch', null, ['suspension-wear'])
    ]);
  S.symptomMap['bouncy-ride'].causes[0].vehicles[GR] = V('GR Yaris po okruzích: zkontrolujte tlumiče a uložení častěji.', 'GR Yaris after track days: check dampers and mounts more often.');
  S.symptomMap['bouncy-ride'].causes[0].tutorials.push('track-prep');

  /* ================================================================ CLUTCH */
  SYM('clutch-slip', 'clutch', 'soon',
    V('Prokluzující spojka', 'Slipping clutch'),
    V('Při plynu v vyšším převodu otáčky vyletí, ale auto skoro nezrychlí. Může být cítit spálené obložení.', 'Under throttle in a higher gear the revs flare but the car barely speeds up. You may smell burnt lining.'),
    [V('Je to horší ve vyšších převodech a do kopce?', 'Is it worse in higher gears and uphill?'), V('Kde začíná záběr pedálu – nahoře?', 'Where does the pedal bite – at the very top?')],
    [
      C(V('Opotřebené obložení lamely', 'Worn clutch disc lining'), V('Lamela se postupně obrušuje; když je tenká, přítlačný talíř ji neudrží.', 'The disc wears over time; once thin, the pressure plate cannot hold it.'), 'common', 'soon',
        V('Ve 4. převodu při 50 km/h prudce přidejte – když otáčky rostou rychleji než rychlost, spojka prokluzuje.', 'In 4th gear at 50 km/h floor it – if revs rise faster than speed, the clutch slips.'), ['clutch']),
      C(V('Olej na lamele', 'Oil on the clutch disc'), V('Netěsné gufero klikové hřídele nebo převodovky zamastí lamelu – prokluz i při malém opotřebení.', 'A leaking crankshaft or gearbox seal oils the disc – it slips even with little wear.'), 'possible', 'soon', null, ['clutch']),
      C(V('Hydraulika nepovolí (vypínací ložisko)', 'Hydraulics not releasing (release bearing)'), V('Zaseknutý válec nebo ložisko drží spojku částečně vypnutou.', 'A sticking slave cylinder or bearing keeps the clutch partly disengaged.'), 'rare', 'soon', null, ['clutch', 'brake-bleed'])
    ]);
  S.symptomMap['clutch-slip'].causes[0].vehicles[JU] = V('Jumper s plným nákladem zatěžuje spojku víc – rozjíždějte se v kopci s citem.', 'A fully loaded Jumper stresses the clutch more – pull away gently on hills.');
  S.symptomMap['clutch-slip'].causes[0].vehicles[GR] = V('GR Yaris: časté starty z místa a okruh výrazně zkracují život spojky.', 'GR Yaris: launches and track use shorten clutch life a lot.');

  SYM('clutch-soft', 'clutch', 'stop',
    V('Měkký, propadlý nebo nevracející se pedál spojky', 'Soft, sinking or sticking clutch pedal'),
    V('Pedál spojky jde k podlaze bez odporu, zůstane dole, nebo nejdou zařadit převody.', 'The clutch pedal goes to the floor without resistance, stays down, or gears will not engage.'),
    [V('Klesla hladina v nádržce brzdové kapaliny (u mnoha aut společná)?', 'Has the level in the brake fluid reservoir dropped (shared on many cars)?')],
    [
      C(V('Vzduch nebo únik v hydraulice spojky', 'Air or a leak in the clutch hydraulics'), V('Hydraulika spojky často sdílí nádržku s brzdami. Únik nebo vzduch = pedál bez odporu.', 'The clutch hydraulics often share the brake reservoir. A leak or air = a pedal without resistance.'), 'common', 'stop',
        V('Zkontrolujte nádržku a stopy kapaliny u pedálu a převodovky. Odvzdušněte.', 'Check the reservoir and look for fluid at the pedal and gearbox. Bleed the system.'), ['brake-bleed', 'clutch']),
      C(V('Vadný pomocný válec / centrální vypínač (CSC)', 'Faulty slave cylinder / central release (CSC)'), V('Centrální vypínač uvnitř zvonu převodovky po čase netěsní – výměna znamená sundat převodovku.', 'A central slave cylinder inside the bellhousing eventually leaks – replacing it means removing the gearbox.'), 'possible', 'stop', null, ['clutch']),
      C(V('Prasklá pružina pedálu / ložisko', 'Broken pedal spring / bearing'), V('Mechanická závada pedálu – pedál zůstane dole.', 'A mechanical pedal fault – the pedal stays down.'), 'rare', 'soon', null, ['clutch'])
    ]);
  S.symptomMap['clutch-soft'].causes[1].vehicles[OC] = V('Octavia 02Q: centrální vypínač (CSC) – při výměně spojky ho měňte rovnou.', 'Octavia 02Q: central slave cylinder (CSC) – replace it together with the clutch.');

  SYM('clutch-heavy', 'clutch', 'soon',
    V('Těžká spojka nebo záběr úplně nahoře', 'Heavy clutch or bite point right at the top'),
    V('Pedál jde ztuha, nebo spojka bere až na samém konci zdvihu.', 'The pedal is stiff, or the clutch only engages at the very end of the travel.'),
    [],
    [
      C(V('Opotřebená spojka (samostavitelný talíř)', 'Worn clutch (self-adjusting plate)'), V('S opotřebením se mění poloha záběru a síla pedálu.', 'As it wears, the bite point and pedal effort change.'), 'common', 'soon', null, ['clutch']),
      C(V('Zatuhlé ložisko nebo vedení', 'Sticking bearing or guide'), V('Suché vedení vypínacího ložiska zvyšuje sílu.', 'A dry release bearing guide increases effort.'), 'possible', 'watch', null, ['clutch'])
    ]);

  SYM('clutch-judder', 'clutch', 'watch',
    V('Cukání při rozjezdu', 'Judder when pulling away'),
    V('Auto se při rozjezdu „třese“ a cuká, hlavně za studena nebo ve zpátečce.', 'The car shakes and jerks when pulling away, especially when cold or in reverse.'),
    [],
    [
      C(V('Opotřebený dvouhmotový setrvačník', 'Worn dual-mass flywheel'), V('Setrvačník už netlumí rázy – cukání a chrastění.', 'The flywheel no longer absorbs pulses – judder and rattle.'), 'common', 'soon', null, ['clutch']),
      C(V('Zamaštěná nebo přehřátá lamela', 'Contaminated or overheated disc'), V('Nerovnoměrné tření lamely.', 'Uneven friction of the disc.'), 'possible', 'watch', null, ['clutch']),
      C(V('Uložení motoru', 'Engine mounts'), V('Motor se při rozjezdu kývá a zesiluje cukání.', 'The engine rocks when pulling away and amplifies judder.'), 'possible', 'watch', null, ['engine-mounts'])
    ]);

  SYM('gear-grind', 'clutch', 'soon',
    V('Drhnutí nebo skřípání při řazení', 'Grinding or crunching when shifting'),
    V('Převod jde zařadit jen ztuha nebo „zaskřípe“, typicky dvojka nebo trojka, nebo zpátečka.', 'A gear is hard to engage or crunches, typically 2nd/3rd or reverse.'),
    [V('Děje se to i se spojkou úplně sešlápnutou a po chvíli čekání?', 'Does it happen even with the clutch fully down and after waiting a moment?')],
    [
      C(V('Spojka úplně nevypíná', 'Clutch not fully disengaging'), V('Vzduch v hydraulice nebo opotřebení – převodovka stále dostává moment.', 'Air in the hydraulics or wear – the gearbox still receives torque.'), 'common', 'soon', null, ['clutch', 'brake-bleed']),
      C(V('Opotřebené synchrony', 'Worn synchronisers'), V('Synchronizační kroužky srovnávají otáčky. Opotřebené (nebo poškozené špatným olejem GL-5) dovolí skřípání.', 'Synchro rings match speeds. Worn ones (or damaged by the wrong GL-5 oil) allow crunching.'), 'common', 'soon',
        V('Zkontrolujte olej v převodovce – správná specifikace a hladina.', 'Check the gearbox oil – correct spec and level.'), ['gearbox-noise', 'drivetrain-oils']),
      C(V('Zpátečka bez synchronu', 'Reverse without synchro'), V('U mnoha převodovek nemá zpátečka synchron – před zařazením chvíli počkejte se sešlápnutou spojkou. Normální.', 'On many gearboxes reverse has no synchro – wait a moment with the clutch down before selecting it. Normal.'), 'possible', 'watch', null, [])
    ]);

  SYM('gearbox-whine', 'clutch', 'soon',
    V('Vytí nebo hučení z převodovky', 'Whine or hum from the gearbox'),
    V('Kňučivý zvuk, který se mění s rychlostí a převodem, často jen při plynu nebo jen při brzdění motorem.', 'A whine that changes with speed and gear, often only under load or only when coasting.'),
    [V('Zmizí zvuk, když sešlápnete spojku na volnoběh?', 'Does it go away when you press the clutch at idle?')],
    [
      C(V('Ložiska převodovky / málo oleje', 'Gearbox bearings / low oil'), V('Ložiska hřídelů převodovky po letech hučí, hlavně při nedostatku oleje.', 'Gearbox shaft bearings hum after years, especially with low oil.'), 'common', 'soon', null, ['gearbox-noise', 'drivetrain-oils']),
      C(V('Vypínací ložisko (zvuk se mění se spojkou)', 'Release bearing (noise changes with the clutch)'), V('Když se zvuk mění sešlápnutím spojky, je to často vypínací ložisko.', 'If the noise changes when you press the clutch, it is often the release bearing.'), 'possible', 'watch', null, ['clutch'])
    ]);

  SYM('auto-shift', 'clutch', 'soon',
    V('Automat řadí tvrdě, pozdě nebo zůstane v jednom převodu', 'Automatic shifts harshly, late or stays in one gear'),
    V('Cukání při řazení, prokluz otáček, nebo převodovka zůstane v jednom převodu (nouzový režim) a svítí kontrolka.', 'Jerky shifts, revs flaring, or the gearbox stays in one gear (limp mode) with a warning light.'),
    [V('Je to horší za studena nebo za tepla?', 'Is it worse cold or hot?'), V('Kdy se naposledy měnil olej v převodovce?', 'When was the gearbox fluid last changed?')],
    [
      C(V('Starý nebo nízký olej (ATF)', 'Old or low fluid (ATF)'), V('Olej v automatu stárne a ztrácí třecí vlastnosti, i když výrobce píše „na celou životnost“.', 'Automatic fluid ages and loses friction properties, even if the manufacturer says it is lifetime.'), 'common', 'soon', DIAG, ['drivetrain-oils', 'diagnostics']),
      C(V('Elektronika / snímače převodovky', 'Gearbox electronics / sensors'), V('Vadný snímač otáček nebo řídicí deska pošle převodovku do nouzového režimu.', 'A faulty speed sensor or control board sends the gearbox into limp mode.'), 'possible', 'soon', DIAG, ['diagnostics']),
      C(V('Chybná adaptace', 'Wrong adaptation'), V('Po odpojení baterie nebo výměně oleje se převodovka musí znovu naučit body řazení.', 'After disconnecting the battery or a fluid change the gearbox must relearn its shift points.'), 'possible', 'watch', null, ['diagnostics'])
    ]);
  S.symptomMap['auto-shift'].causes[1].vehicles[CL] = V('7G-Tronic 722.9: známé závady vodičové desky (snímače otáček) – viz návod 7G-Tronic.', '7G-Tronic 722.9: known conductor-plate (speed sensor) faults – see the 7G-Tronic tutorial.');
  S.symptomMap['auto-shift'].causes[1].tutorials.push('gearbox-7g');
  S.symptomMap['auto-shift'].causes[0].vehicles[XC] = V('XC60 (Aisin 8st.): hladina se kontroluje při určené teplotě diagnostikou VIDA – nehádejte.', 'XC60 (Aisin 8-speed): the level is checked at a set temperature with VIDA – do not guess.');

  SYM('pops-out', 'clutch', 'soon',
    V('Vyskakuje převod', 'Jumps out of gear'),
    V('Převodovka sama vyhodí převod, typicky při ubrání plynu.', 'The gearbox drops out of gear by itself, typically when lifting off the throttle.'),
    [],
    [
      C(V('Opotřebené řazení nebo synchrony', 'Worn selector or synchros'), V('Opotřebené zubové spojky nebo aretace nedrží převod.', 'Worn dog teeth or detents cannot hold the gear.'), 'common', 'soon', null, ['gearbox-noise']),
      C(V('Uložení motoru / převodovky', 'Engine / gearbox mounts'), V('Pohyb motoru tahá za lanka řazení.', 'Engine movement pulls on the shift cables.'), 'possible', 'watch', null, ['engine-mounts'])
    ]);

  /* ================================================================ ENGINE */
  SYM('hard-start-cold', 'engine', 'soon',
    V('Špatně startuje za studena', 'Hard to start when cold'),
    V('Motor se dlouho protáčí, než chytne, nebo po startu kouří a třese se. Hlavně ráno v zimě.', 'The engine cranks for a long time before it fires, or it smokes and shakes after starting. Mainly on winter mornings.'),
    [V('Je to diesel nebo benzín?', 'Is it a diesel or petrol?'), V('Protáčí startér rychle, nebo pomalu?', 'Does the starter crank fast or slowly?')],
    [
      C(V('Vadné žhavicí svíčky (diesel)', 'Faulty glow plugs (diesel)'), V('Diesel za studena potřebuje předehřátí. S vadnými svíčkami startuje špatně a bíle kouří.', 'A cold diesel needs pre-heating. With faulty glow plugs it starts badly and smokes white.'), 'common', 'soon', DIAG, ['spark-plugs', 'diagnostics']),
      C(V('Slabá baterie', 'Weak battery'), V('Za mrazu baterie ztrácí výkon; startér točí pomalu a motor nechytne.', 'In the cold a battery loses power; the starter turns slowly and the engine does not fire.'), 'common', 'soon',
        V('Změřte napětí v klidu (12,6 V = plná) a při startu (nemá klesnout pod ~10 V).', 'Measure resting voltage (12.6 V = full) and while cranking (should not drop below ~10 V).'), ['battery', 'jumpstart-tow']),
      C(V('Voda v naftě / ucpaný palivový filtr', 'Water in diesel / clogged fuel filter'), V('Voda nebo parafín v naftě za mrazu ucpe filtr.', 'Water or wax in diesel clogs the filter in frost.'), 'possible', 'soon', null, ['fuel-filter']),
      C(V('Opotřebené zapalovací svíčky (benzín)', 'Worn spark plugs (petrol)'), V('Velká mezera elektrod nebo zanesené svíčky zhorší start.', 'A wide gap or fouled plugs make starting worse.'), 'possible', 'watch', null, ['spark-plugs'])
    ]);
  S.symptomMap['hard-start-cold'].causes[0].vehicles[OC] = V('Octavia 2.0 TDI: žhavicí svíčky jdou těžko ven – nikdy nepřetahujte, hrozí ulomení.', 'Octavia 2.0 TDI: glow plugs can be tight – never force them, they can snap.');
  S.symptomMap['hard-start-cold'].causes[0].vehicles[JU] = V('Jumper 2.2 HDi: diesel se žhavicími svíčkami – kontrolka žhavení musí po zapnutí zhasnout.', 'Jumper 2.2 HDi: diesel with glow plugs – the glow light must go out after switching on.');

  SYM('no-start-cranks', 'engine', 'soon',
    V('Startér točí, ale motor nenaskočí', 'Engine cranks but will not start'),
    V('Startér normálně protáčí, ale motor vůbec nechytne.', 'The starter turns normally but the engine does not catch at all.'),
    [V('Je v nádrži palivo (nevěřte jen ukazateli)?', 'Is there fuel in the tank (do not trust the gauge alone)?'), V('Bliká imobilizér?', 'Is the immobiliser light flashing?')],
    [
      C(V('Chybí palivo / vadné palivové čerpadlo', 'No fuel / failed fuel pump'), V('Při zapnutí zapalování by mělo být slyšet krátké bzučení čerpadla v nádrži.', 'When you switch on the ignition you should hear the fuel pump hum briefly in the tank.'), 'common', 'soon', DIAG, ['diagnostics', 'fuses', 'fuel-filter']),
      C(V('Imobilizér nerozpoznal klíč', 'Immobiliser does not recognise the key'), V('Vybitá baterie v klíči nebo závada čtečky – motor nedostane povolení ke startu.', 'A flat key battery or reader fault – the engine is not allowed to start.'), 'possible', 'watch', null, ['diagnostics']),
      C(V('Snímač otáček klikové hřídele', 'Crankshaft position sensor'), V('Bez signálu klikové hřídele řídicí jednotka nevstřikuje ani nezapaluje.', 'Without the crank signal the ECU does not inject or ignite.'), 'possible', 'soon', DIAG, ['diagnostics']),
      C(V('Spálená pojistka nebo relé', 'Blown fuse or relay'), V('Pojistka čerpadla nebo hlavní relé – levná oprava.', 'The fuel pump fuse or main relay – a cheap fix.'), 'possible', 'watch', null, ['fuses'])
    ]);

  SYM('rough-idle', 'engine', 'soon',
    V('Nepravidelný volnoběh, motor škube nebo vynechává', 'Rough idle, engine jerks or misfires'),
    V('Otáčky volnoběhu kolísají, motor „klepe“ nebo při zrychlení cuká. Kontrolka motoru může blikat.', 'Idle speed hunts, the engine stumbles or jerks when accelerating. The engine light may flash.'),
    [V('Bliká kontrolka motoru? (bliká = nejezdit, ničí se katalyzátor)', 'Is the engine light flashing? (flashing = do not drive, the catalyst is being damaged)')],
    [
      C(V('Zapalovací svíčka nebo cívka (benzín)', 'Spark plug or ignition coil (petrol)'), V('Jeden válec nezapaluje – motor běží nerovnoměrně a nespálené palivo přehřívá katalyzátor.', 'One cylinder is not firing – the engine runs unevenly and unburnt fuel overheats the catalyst.'), 'common', 'soon', DIAG, ['diagnostics', 'spark-plugs']),
      C(V('Vstřikovač (diesel i benzín)', 'Injector (diesel and petrol)'), V('Netěsný nebo ucpaný vstřikovač nedávkuje správně. U dieselu se sledují korekce vstřikovačů.', 'A leaking or clogged injector doses wrongly. On diesels the injector correction values are checked.'), 'possible', 'soon', DIAG, ['injectors', 'diagnostics']),
      C(V('Falešný vzduch nebo EGR', 'Vacuum leak or EGR'), V('Prasklá hadička v sání nebo zaseknutý EGR ventil rozhodí směs.', 'A split intake hose or stuck EGR valve upsets the mixture.'), 'possible', 'watch', null, ['egr-dpf']),
      C(V('Zanesený vzduchový filtr', 'Clogged air filter'), V('Motor se dusí – méně výkonu a vyšší spotřeba.', 'The engine is starved of air – less power and higher consumption.'), 'possible', 'watch', null, ['filters'])
    ]);
  S.symptomMap['rough-idle'].causes[0].vehicles[CL] = V('CL 500 M273 má 16 svíček (2 na válec) – vynechávání se často týká jedné cívky.', 'The CL 500 M273 has 16 plugs (2 per cylinder) – a misfire often comes from one coil.');

  SYM('power-loss', 'engine', 'soon',
    V('Ztráta výkonu / nouzový režim', 'Loss of power / limp mode'),
    V('Auto nejede, otáčky nejdou nad určitou mez, svítí kontrolka motoru. Často po prudkém zrychlení.', 'The car will not pull, revs are capped, the engine light is on. Often after hard acceleration.'),
    [V('Zmizí to po vypnutí a novém startu motoru?', 'Does it go away after switching off and restarting?')],
    [
      C(V('Netěsnost plnicího tlaku (turbo)', 'Boost leak (turbo)'), V('Sklouznutá nebo prasklá hadice plnicího vzduchu – řídicí jednotka sníží výkon, aby chránila motor.', 'A loose or split boost hose – the ECU reduces power to protect the engine.'), 'common', 'soon', DIAG, ['turbo', 'diagnostics']),
      C(V('Ucpaný filtr pevných částic (DPF)', 'Clogged particulate filter (DPF)'), V('DPF se plní sazemi a musí se vypalovat jízdou po dálnici. Při krátkých jízdách se ucpe.', 'The DPF fills with soot and must burn it off on motorway drives. Short trips clog it.'), 'common', 'soon', DIAG, ['egr-dpf', 'diagnostics']),
      C(V('EGR ventil, regulace turba, snímače', 'EGR valve, turbo actuator, sensors'), V('Zaseknutý EGR nebo vadný snímač tlaku spustí nouzový režim.', 'A stuck EGR or faulty pressure sensor triggers limp mode.'), 'possible', 'soon', DIAG, ['egr-dpf', 'diagnostics']),
      C(V('Ucpaný palivový nebo vzduchový filtr', 'Clogged fuel or air filter'), V('Motor nedostane dost paliva nebo vzduchu.', 'The engine cannot get enough fuel or air.'), 'possible', 'watch', null, ['fuel-filter', 'filters'])
    ]);
  S.symptomMap['power-loss'].causes[1].vehicles[OC] = V('Octavia 2.0 TDI má DPF – při krátkých jízdách se ucpává. Používejte jen olej VW 507.00.', 'The Octavia 2.0 TDI has a DPF – it clogs with short trips. Use only VW 507.00 oil.');
  S.symptomMap['power-loss'].causes[1].vehicles[JU] = V('U Jumperu zatím nevíme, zda má DPF – zjistěte to (velké pouzdro za katalyzátorem / ORV).', 'We do not know yet whether the Jumper has a DPF – find out (a large canister after the catalyst / papers).');

  SYM('stalling', 'engine', 'soon',
    V('Motor zhasíná', 'Engine stalls'),
    V('Motor zhasne na volnoběh, při zastavování nebo za jízdy.', 'The engine dies at idle, when coming to a stop or while driving.'),
    [],
    [
      C(V('Zanesená škrticí klapka / regulace volnoběhu', 'Dirty throttle body / idle control'), V('Usazeniny omezí průtok vzduchu na volnoběh.', 'Deposits restrict airflow at idle.'), 'common', 'watch', DIAG, ['diagnostics', 'filters']),
      C(V('Dodávka paliva', 'Fuel supply'), V('Slabé čerpadlo nebo ucpaný filtr – motor zhasne pod zatížením.', 'A weak pump or clogged filter – the engine dies under load.'), 'possible', 'soon', null, ['fuel-filter']),
      C(V('Snímač nebo elektrika', 'Sensor or wiring'), V('Přerušovaný signál snímače klikové hřídele nebo volný kontakt.', 'An intermittent crank sensor signal or a loose connection.'), 'possible', 'soon', DIAG, ['diagnostics', 'fuses'])
    ]);

  SYM('oil-consumption', 'engine', 'soon',
    V('Motor „žere“ olej', 'Engine uses a lot of oil'),
    V('Musíte často dolévat olej (víc než ~0,5 l na 1000 km), bez viditelného úniku.', 'You have to top up oil often (more than ~0.5 L per 1000 km) with no visible leak.'),
    [V('Kouří motor namodro?', 'Does the engine smoke blue?')],
    [
      C(V('Opotřebená těsnění ventilů nebo pístní kroužky', 'Worn valve stem seals or piston rings'), V('Olej se dostává do válců a spaluje – modrý kouř, hlavně po startu nebo při brzdění motorem.', 'Oil gets into the cylinders and burns – blue smoke, mainly after starting or on engine braking.'), 'common', 'soon', null, ['oil-change', 'head-gasket']),
      C(V('Turbo propouští olej', 'Turbo leaking oil'), V('Opotřebená těsnění turba pouštějí olej do sání nebo výfuku.', 'Worn turbo seals let oil into the intake or exhaust.'), 'possible', 'soon', null, ['turbo']),
      C(V('Odvětrání klikové skříně', 'Crankcase ventilation'), V('Zanesený ventil odvětrání nasává olej do sání.', 'A clogged breather valve sucks oil into the intake.'), 'possible', 'watch', null, ['oil-change'])
    ]);

  /* ================================================================= SMOKE */
  SYM('smoke-white', 'smoke', 'stop',
    V('Bílý kouř z výfuku', 'White smoke from the exhaust'),
    V('Hustý bílý kouř, který nezmizí po zahřátí, často sladce voní. (Tenká pára za studena je normální kondenzace.)', 'Thick white smoke that does not clear when warm, often smelling sweet. (Thin vapour when cold is normal condensation.)'),
    [V('Zmizí kouř po zahřátí motoru?', 'Does it clear once the engine is warm?'), V('Ubývá chladicí kapalina?', 'Is coolant disappearing?')],
    [
      C(V('Normální kondenzace (za studena)', 'Normal condensation (when cold)'), V('Za studena a vlhka kondenzuje voda ve výfuku. Zmizí po zahřátí – neškodné.', 'When cold and damp, water condenses in the exhaust. It clears when warm – harmless.'), 'common', 'watch', null, []),
      C(V('Chladicí kapalina ve válci (těsnění hlavy)', 'Coolant in the cylinder (head gasket)'), V('Proražené těsnění hlavy pouští kapalinu do spalovacího prostoru. Hrozí přehřátí a zničení motoru.', 'A blown head gasket lets coolant into the combustion chamber. Risk of overheating and engine destruction.'), 'possible', 'stop',
        V('Hladina chladicí kapaliny klesá, bubliny v nádržce, olej jako „majonéza“ pod víčkem = nejezděte.', 'Coolant level dropping, bubbles in the tank, mayonnaise-like oil under the cap = do not drive.'), ['head-gasket', 'coolant']),
      C(V('Diesel: žhavení nebo vstřikovače za studena', 'Diesel: glow plugs or injectors when cold'), V('Nespálená nafta za studena dělá bělošedý dráždivý kouř.', 'Unburnt diesel when cold makes grey-white irritating smoke.'), 'possible', 'soon', null, ['spark-plugs', 'injectors'])
    ]);

  SYM('smoke-blue', 'smoke', 'soon',
    V('Modrý kouř z výfuku', 'Blue smoke from the exhaust'),
    V('Namodralý kouř se zápachem spáleného oleje, hlavně po startu, při brzdění motorem nebo prudkém zrychlení.', 'Bluish smoke smelling of burnt oil, mainly after start-up, on engine braking or hard acceleration.'),
    [],
    [
      C(V('Turbo pouští olej', 'Turbo leaking oil'), V('Opotřebená ložiska a těsnění turba – olej jde do sání nebo výfuku.', 'Worn turbo bearings and seals – oil goes into the intake or exhaust.'), 'common', 'soon', null, ['turbo']),
      C(V('Těsnění ventilů / pístní kroužky', 'Valve seals / piston rings'), V('Olej prosakuje do válců a spaluje se.', 'Oil seeps into the cylinders and burns.'), 'common', 'soon', null, ['oil-change', 'head-gasket']),
      C(V('Přeplněný motor olejem', 'Overfilled engine oil'), V('Příliš mnoho oleje pění a dostává se do odvětrání.', 'Too much oil foams and gets into the breather.'), 'possible', 'soon', V('Zkontrolujte měrku – nad MAX odsajte.', 'Check the dipstick – drain anything above MAX.'), ['oil-change'])
    ]);

  SYM('smoke-black', 'smoke', 'soon',
    V('Černý kouř z výfuku', 'Black smoke from the exhaust'),
    V('Černé saze při zrychlení. U dieselu lehký obláček při plném plynu může být normální, souvislý černý kouř ne.', 'Black soot under acceleration. On a diesel a light puff at full throttle can be normal, continuous black smoke is not.'),
    [],
    [
      C(V('Bohatá směs – ucpaný vzduchový filtr, EGR', 'Rich mixture – clogged air filter, EGR'), V('Motor dostává víc paliva, než stihne spálit.', 'The engine gets more fuel than it can burn.'), 'common', 'soon', null, ['filters', 'egr-dpf']),
      C(V('Vadný vstřikovač', 'Faulty injector'), V('Kapající nebo špatně rozprašující vstřikovač.', 'A dribbling or poorly atomising injector.'), 'possible', 'soon', DIAG, ['injectors']),
      C(V('Netěsnost plnicího tlaku', 'Boost leak'), V('Málo vzduchu z turba na danou dávku paliva.', 'Too little air from the turbo for the fuel delivered.'), 'possible', 'soon', null, ['turbo']),
      C(V('Poškozený nebo odstraněný DPF', 'Damaged or removed DPF'), V('Vůz s DPF nesmí černě kouřit. Odstranění DPF je nelegální.', 'A car with a DPF must not smoke black. Removing a DPF is illegal.'), 'rare', 'soon', null, ['egr-dpf', 'exhaust'])
    ]);

  SYM('smell-burning', 'smoke', 'soon',
    V('Zápach spáleniny po jízdě', 'Burning smell after driving'),
    V('Štiplavý zápach spáleného z kola, motoru nebo kabiny.', 'An acrid burnt smell from a wheel, the engine or the cabin.'),
    [V('Je cítit u jednoho kola?', 'Is it at one wheel?'), V('Je kouř z motorového prostoru?', 'Is there smoke from the engine bay?')],
    [
      C(V('Drhnoucí brzda', 'Dragging brake'), V('Zatuhlý třmen nebo zatažená parkovací brzda – kolo je velmi horké.', 'A seized caliper or applied parking brake – the wheel is very hot.'), 'common', 'stop', null, ['brakes']),
      C(V('Prokluzující spojka', 'Slipping clutch'), V('Spálené obložení páchne jako spálený papír.', 'Burnt lining smells like burnt paper.'), 'common', 'soon', null, ['clutch']),
      C(V('Olej kape na horký výfuk', 'Oil dripping on the hot exhaust'), V('Netěsné víko ventilů nebo filtr – olej se pálí na výfuku. Riziko požáru!', 'A leaking valve cover or filter – oil burns on the exhaust. Fire risk!'), 'possible', 'stop', null, ['oil-change']),
      C(V('Spálený plast nebo elektrika', 'Burnt plastic or wiring'), V('Přehřátý kabel nebo pojistka – může začít hořet. Zastavte, vypněte motor, sledujte kouř.', 'An overheated wire or fuse – it can catch fire. Stop, switch off, watch for smoke.'), 'possible', 'stop', null, ['fuses'])
    ]);

  SYM('smell-sweet', 'smoke', 'soon',
    V('Sladký zápach (chladicí kapalina)', 'Sweet smell (coolant)'),
    V('Sladká vůně v kabině nebo kolem motoru, někdy zamlžená okna zevnitř.', 'A sweet smell in the cabin or around the engine, sometimes fogged windows inside.'),
    [],
    [
      C(V('Únik chladicí kapaliny z hadice nebo chladiče', 'Coolant leak from a hose or radiator'), V('Kapalina kape na horký motor a odpařuje se.', 'Coolant drips on the hot engine and evaporates.'), 'common', 'soon', null, ['coolant', 'thermostat-pump']),
      C(V('Netěsný výměník topení', 'Leaking heater core'), V('Pára v kabině, mokrý koberec u spolujezdce, mlžení skel.', 'Steam in the cabin, wet carpet on the passenger side, fogging windows.'), 'possible', 'soon', null, ['coolant']),
      C(V('Těsnění hlavy', 'Head gasket'), V('Sladký bílý kouř z výfuku a ubývající kapalina.', 'Sweet white exhaust smoke and disappearing coolant.'), 'rare', 'stop', null, ['head-gasket'])
    ]);

  SYM('smell-fuel', 'smoke', 'stop',
    V('Zápach paliva', 'Fuel smell'),
    V('Výrazný zápach benzínu nebo nafty v kabině nebo kolem auta.', 'A strong smell of petrol or diesel in the cabin or around the car.'),
    [],
    [
      C(V('Netěsné palivové vedení nebo filtr', 'Leaking fuel line or filter'), V('Prosakující spoj nebo zkorodované potrubí. U benzínu hrozí požár!', 'A weeping joint or corroded pipe. With petrol there is a fire risk!'), 'common', 'stop',
        V('Nekuřte, nestartujte, hledejte mokrá místa pod vozem a v motorovém prostoru. Nechte vůz odtáhnout.', 'No smoking, do not start, look for wet spots under the car and in the engine bay. Have the car towed.'), ['fuel-filter', 'jumpstart-tow']),
      C(V('Netěsný vstřikovač nebo zpětné vedení (diesel)', 'Leaking injector or return line (diesel)'), V('Nafta prosakuje u vstřikovačů.', 'Diesel seeps at the injectors.'), 'possible', 'stop', null, ['injectors']),
      C(V('Víčko nádrže / odvětrání', 'Fuel cap / evaporative system'), V('Netěsné víčko – slabý zápach u nádrže, kontrolka motoru.', 'A leaking cap – a faint smell at the tank, engine light.'), 'possible', 'watch', null, ['diagnostics'])
    ]);

  SYM('smell-eggs', 'smoke', 'watch',
    V('Zápach zkažených vajec', 'Rotten egg smell'),
    V('Sirný zápach z výfuku, hlavně při zrychlení.', 'A sulphur smell from the exhaust, especially when accelerating.'),
    [],
    [
      C(V('Přetížený katalyzátor (bohatá směs)', 'Overloaded catalyst (rich mixture)'), V('Katalyzátor nestíhá zpracovat síru při bohaté směsi – příčinou bývá vynechávání nebo vadná lambda sonda.', 'The catalyst cannot cope with sulphur when the mixture is rich – usually a misfire or bad lambda sensor.'), 'common', 'watch', DIAG, ['diagnostics', 'exhaust']),
      C(V('Stará převodová náplň', 'Old gear oil'), V('Velmi stará převodová olejová náplň může páchnout sírou.', 'Very old gear oil can smell of sulphur.'), 'rare', 'watch', null, ['drivetrain-oils'])
    ]);

  /* ================================================================= LEAKS */
  SYM('leak-oil', 'leaks', 'soon',
    V('Hnědá až černá skvrna (motorový olej)', 'Brown to black puddle (engine oil)'),
    V('Kluzká hnědá nebo černá skvrna pod motorem. Olej je mastný a nemá výraznou vůni.', 'A slippery brown or black spot under the engine. Oil is greasy with little smell.'),
    [],
    [
      C(V('Vypouštěcí šroub nebo filtr', 'Drain plug or filter'), V('Po výměně oleje: chybí nové těsnění, šroub povolený nebo dvojité těsnění filtru.', 'After an oil change: missing new seal, loose plug or a double filter gasket.'), 'common', 'soon',
        V('Očistěte okolí, zajeďte a sledujte, odkud kape.', 'Clean the area, drive and watch where it drips from.'), ['oil-change']),
      C(V('Těsnění víka ventilů / olejové vany', 'Valve cover / oil pan gasket'), V('Stárnoucí těsnění prosakuje, olej stéká po bloku.', 'Ageing gaskets weep and oil runs down the block.'), 'common', 'watch', null, ['oil-change']),
      C(V('Gufera klikové hřídele', 'Crankshaft seals'), V('Únik mezi motorem a převodovkou může zamastit spojku.', 'A leak between engine and gearbox can contaminate the clutch.'), 'possible', 'soon', null, ['clutch'])
    ]);

  SYM('leak-coolant', 'leaks', 'soon',
    V('Barevná sladce vonící kapalina (chladicí)', 'Coloured, sweet-smelling fluid (coolant)'),
    V('Zelená, růžová, modrá nebo fialová vodnatá kapalina, sladce voní. Jedovatá pro zvířata!', 'Green, pink, blue or violet watery fluid with a sweet smell. Poisonous to pets!'),
    [],
    [
      C(V('Hadice nebo spony', 'Hoses or clamps'), V('Popraskaná hadice nebo povolená spona – nejčastější a nejlevnější.', 'A cracked hose or loose clamp – most common and cheapest.'), 'common', 'soon', null, ['coolant']),
      C(V('Vodní pumpa', 'Water pump'), V('Pumpa má odtokový otvor – stopy kapaliny pod ní ukazují vadné těsnění.', 'The pump has a weep hole – traces of coolant under it show a failing seal.'), 'possible', 'soon', null, ['thermostat-pump', 'timing-belt']),
      C(V('Chladič', 'Radiator'), V('Koroze nebo kamínek proděraví chladič.', 'Corrosion or a stone holes the radiator.'), 'possible', 'soon', null, ['coolant'])
    ]);
  S.symptomMap['leak-coolant'].causes[1].vehicles[OC] = V('Octavia: vodní pumpu pohání rozvodový řemen – měňte ji s rozvody.', 'Octavia: the water pump is driven by the timing belt – replace it with the timing belt.');

  SYM('leak-brake', 'leaks', 'stop',
    V('Čirá až nažloutlá olejovitá kapalina u kola (brzdová)', 'Clear to yellowish oily fluid at a wheel (brake fluid)'),
    V('Kluzká kapalina u kola nebo pod motorovým prostorem u pedálů. Brzdová kapalina leptá lak.', 'Slippery fluid at a wheel or under the engine bay near the pedals. Brake fluid eats paint.'),
    [],
    [
      C(V('Netěsná hadice, trubka nebo třmen', 'Leaking hose, pipe or caliper'), V('Únik brzdové kapaliny = ztráta brzd. Nejezděte!', 'A brake fluid leak = loss of brakes. Do not drive!'), 'common', 'stop', null, ['brake-lines', 'brake-bleed', 'brakes']),
      C(V('Pomocný válec spojky', 'Clutch slave cylinder'), V('Pokud je kapalina u převodovky – netěsná hydraulika spojky (sdílí nádržku).', 'If the fluid is at the gearbox – leaking clutch hydraulics (shared reservoir).'), 'possible', 'stop', null, ['clutch'])
    ]);

  SYM('leak-red', 'leaks', 'soon',
    V('Červená nebo hnědočervená kapalina', 'Red or reddish-brown fluid'),
    V('Červená olejovitá kapalina – převodový olej automatu (ATF) nebo kapalina posilovače.', 'Red oily fluid – automatic transmission fluid (ATF) or power steering fluid.'),
    [],
    [
      C(V('Automatická převodovka', 'Automatic transmission'), V('Únik z vany, chladiče nebo konektoru převodovky.', 'A leak from the pan, cooler or gearbox connector.'), 'common', 'soon', null, ['drivetrain-oils']),
      C(V('Posilovač řízení', 'Power steering'), V('Hadice nebo převodka posilovače.', 'Power steering hoses or rack.'), 'possible', 'soon', null, ['suspension-wear'])
    ]);
  S.symptomMap['leak-red'].causes[0].vehicles[CL] = V('CL 500: 7G-Tronic často prosakuje u konektoru vodičové desky – olej leze po kabelu.', 'CL 500: the 7G-Tronic often leaks at the conductor plate connector – oil wicks along the cable.');
  S.symptomMap['leak-red'].causes[0].tutorials.push('gearbox-7g');
  S.symptomMap['leak-red'].causes[1].vehicles[CL] = V('CL 500: zelená kapalina = ABC / posilovač (Pentosin) – viz návod ABC.', 'CL 500: green fluid = ABC / power steering (Pentosin) – see the ABC tutorial.');
  S.symptomMap['leak-red'].causes[1].tutorials.push('abc-hydraulics');

  SYM('leak-water', 'leaks', 'watch',
    V('Čistá voda pod autem', 'Clear water under the car'),
    V('Čirá voda bez zápachu pod přední částí po jízdě s klimatizací.', 'Clear odourless water under the front after driving with the A/C on.'),
    [],
    [
      C(V('Kondenzát z klimatizace – normální', 'A/C condensation – normal'), V('Klimatizace vysušuje vzduch a voda odkapává pod vůz. Neškodné.', 'The A/C dries the air and water drips under the car. Harmless.'), 'common', 'watch', null, ['aircon']),
      C(V('Ucpaný odtok – voda v kabině', 'Blocked drain – water in the cabin'), V('Pokud voda neteče ven, ale je na koberci, je ucpaný odtok klimatizace nebo nádržky pod stěrači.', 'If water is on the carpet instead of under the car, the A/C or scuttle drain is blocked.'), 'possible', 'soon', null, ['aircon', 'wipers'])
    ]);

  SYM('leak-diesel', 'leaks', 'stop',
    V('Nafta nebo benzín pod autem', 'Diesel or petrol under the car'),
    V('Duhová skvrna s typickým zápachem paliva.', 'A rainbow-sheen puddle with a typical fuel smell.'),
    [],
    [
      C(V('Palivové vedení, filtr, nádrž', 'Fuel line, filter, tank'), V('Netěsnost paliva je nebezpečná (požár, kluzká vozovka). Nestartujte, nechte odtáhnout.', 'A fuel leak is dangerous (fire, slippery road). Do not start, have it towed.'), 'common', 'stop', null, ['fuel-filter', 'jumpstart-tow'])
    ]);

  /* ======================================================== WARNING LIGHTS */
  SYM('wl-oil', 'lights', 'stop',
    V('Červená kontrolka tlaku oleje (konvička)', 'Red oil pressure light (oil can)'),
    V('Rozsvítí se za jízdy nebo bliká v zatáčkách. Motor bez tlaku oleje se zničí za pár minut.', 'Comes on while driving or flickers in corners. An engine without oil pressure destroys itself within minutes.'),
    [],
    [
      C(V('Málo oleje', 'Low oil level'), V('Únik nebo spotřeba – čerpadlo nasává vzduch.', 'A leak or consumption – the pump sucks air.'), 'common', 'stop',
        V('Okamžitě zastavte a vypněte motor. Po 5 minutách zkontrolujte hladinu.', 'Stop immediately and switch off. After 5 minutes check the level.'), ['oil-change']),
      C(V('Vadné olejové čerpadlo nebo ucpaný sací koš', 'Failed oil pump or clogged pickup'), V('Hladina je v pořádku, ale tlak chybí. Nejezděte – odtah.', 'The level is fine but there is no pressure. Do not drive – tow it.'), 'possible', 'stop', null, ['jumpstart-tow', 'diagnostics']),
      C(V('Vadný spínač tlaku', 'Faulty pressure switch'), V('Možné, ale nikdy to nepředpokládejte bez měření tlaku manometrem.', 'Possible, but never assume it without measuring pressure with a gauge.'), 'rare', 'stop', null, ['diagnostics'])
    ]);

  SYM('wl-battery', 'lights', 'soon',
    V('Kontrolka baterie / dobíjení za jízdy', 'Battery / charging light while driving'),
    V('Svítí za jízdy – alternátor nedobíjí. Auto pojede jen do vybití baterie.', 'On while driving – the alternator is not charging. The car runs only until the battery is flat.'),
    [],
    [
      C(V('Prasklý nebo prokluzující řemen', 'Broken or slipping belt'), V('Bez řemenu se netočí alternátor – a často ani vodní pumpa (přehřátí!).', 'Without the belt the alternator does not turn – and often the water pump too (overheating!).'), 'common', 'stop', V('Otevřete kapotu a podívejte se na drážkový řemen.', 'Open the bonnet and look at the auxiliary belt.'), ['aux-belt']),
      C(V('Vadný alternátor / regulátor', 'Faulty alternator / regulator'), V('Napětí při běžícím motoru má být cca 13,8–14,7 V.', 'Voltage with the engine running should be about 13.8–14.7 V.'), 'common', 'soon', V('Změřte napětí na baterii při běžícím motoru.', 'Measure battery voltage with the engine running.'), ['alternator-starter', 'battery']),
      C(V('Volný kabel / koroze svorek', 'Loose cable / corroded terminals'), V('Špatný kontakt omezí dobíjení.', 'A poor contact restricts charging.'), 'possible', 'watch', null, ['battery'])
    ]);
  S.symptomMap['wl-battery'].causes[1].vehicles[XC] = V('XC60 B4: 12V se dobíjí přes DC/DC měnič z 48V systému – chyba může být v mild-hybrid systému. Diagnostika VIDA.', 'XC60 B4: the 12V battery is charged by a DC/DC converter from the 48V system – the fault may be in the mild hybrid system. Diagnose with VIDA.');
  S.symptomMap['wl-battery'].causes[1].tutorials.push('mhev-48v');

  SYM('wl-coolant', 'lights', 'stop',
    V('Kontrolka teploty / hladiny chladicí kapaliny', 'Coolant temperature / level light'),
    V('Červená = přehřátí, zastavte. Žlutá / modrá může znamenat nízkou hladinu nebo studený motor.', 'Red = overheating, stop. Yellow / blue can mean low level or a cold engine.'),
    [],
    [
      C(V('Nízká hladina chladicí kapaliny', 'Low coolant level'), V('Únik nebo vnitřní spotřeba (těsnění hlavy).', 'A leak or internal loss (head gasket).'), 'common', 'stop', V('Nikdy neotvírejte horké víčko! Počkejte na vychladnutí.', 'Never open a hot cap! Wait until it cools.'), ['coolant']),
      C(V('Termostat, pumpa, ventilátor', 'Thermostat, pump, fan'), V('Viz Přehřívání motoru.', 'See Engine overheating.'), 'possible', 'stop', null, ['thermostat-pump'])
    ]);

  SYM('wl-cel', 'lights', 'soon',
    V('Žlutá kontrolka motoru svítí', 'Yellow engine (check engine) light on'),
    V('Řídicí jednotka zaznamenala závadu v motoru nebo emisním systému. Motor může běžet normálně.', 'The ECU detected a fault in the engine or emissions system. The engine may run normally.'),
    [V('Svítí trvale, nebo bliká? Bliká = vynechávání, jeďte jen pomalu na nejbližší místo.', 'Steady or flashing? Flashing = misfire, drive slowly to the nearest place only.')],
    [
      C(V('Jakákoli emisní závada – přečtěte kód', 'Any emissions fault – read the code'), V('Možností jsou stovky (lambda sonda, EGR, snímače, víčko nádrže…). Bez kódu jen hádáte.', 'There are hundreds of possibilities (lambda sensor, EGR, sensors, fuel cap…). Without the code you are just guessing.'), 'common', 'soon', DIAG, ['diagnostics']),
      C(V('Vynechávání (bliká)', 'Misfire (flashing)'), V('Nespálené palivo ničí katalyzátor.', 'Unburnt fuel destroys the catalyst.'), 'common', 'stop', DIAG, ['diagnostics', 'spark-plugs'])
    ]);

  SYM('wl-abs', 'lights', 'soon',
    V('Kontrolka ABS / ESP', 'ABS / ESP light'),
    V('ABS nebo stabilizace jsou vypnuté. Běžné brzdy fungují, ale bez ABS se kola mohou zablokovat.', 'ABS or stability control is disabled. Normal brakes work, but without ABS the wheels can lock.'),
    [],
    [
      C(V('Snímač otáček kola nebo jeho kabel', 'Wheel speed sensor or its wiring'), V('Nejčastější – snímač u kola je vystaven nečistotám a solí.', 'The most common – the sensor at the wheel is exposed to dirt and salt.'), 'common', 'soon', DIAG, ['diagnostics', 'wheel-bearing']),
      C(V('Nízké napětí baterie', 'Low battery voltage'), V('Při slabé baterii se mohou rozsvítit různé kontrolky najednou.', 'With a weak battery several lights can come on at once.'), 'possible', 'watch', null, ['battery']),
      C(V('Brzdová kapalina / jednotka ABS', 'Brake fluid / ABS unit'), V('Méně často vadná hydraulická jednotka.', 'Less often a faulty hydraulic unit.'), 'rare', 'soon', DIAG, ['diagnostics', 'brake-bleed'])
    ]);

  SYM('wl-airbag', 'lights', 'stop',
    V('Kontrolka airbagu', 'Airbag light'),
    V('Systém airbagů má závadu – v nehodě se airbagy nemusí aktivovat. Kódy airbagu nikdy jen nemažte.', 'The airbag system has a fault – airbags may not deploy in a crash. Never just clear airbag codes.'),
    [],
    [
      C(V('Konektor pod sedadlem', 'Connector under a seat'), V('Posouvání sedadla uvolní konektor bočního airbagu nebo předpínače.', 'Moving a seat loosens a side airbag or pretensioner connector.'), 'common', 'soon',
        V('Zapalování vypnuté, baterie odpojená, počkat dle příručky – teprve pak kontrolovat konektory.', 'Ignition off, battery disconnected, wait per manual – only then check connectors.'), ['diagnostics', 'steering-wheel']),
      C(V('Spirálový kabel ve volantu', 'Clock spring in the steering wheel'), V('Přetržený spirálový kabel – nefunguje často ani klakson nebo tlačítka na volantu.', 'A broken clock spring – often the horn or wheel buttons stop working too.'), 'possible', 'soon', null, ['steering-wheel'])
    ]);

  SYM('wl-brake', 'lights', 'stop',
    V('Červená kontrolka brzd (!)', 'Red brake warning light (!)'),
    V('Svítí i po uvolnění parkovací brzdy – nízká hladina brzdové kapaliny nebo závada brzd.', 'On even with the parking brake released – low brake fluid or a brake fault.'),
    [],
    [
      C(V('Nízká hladina brzdové kapaliny', 'Low brake fluid level'), V('Opotřebené destičky snižují hladinu pomalu; náhlý pokles = únik!', 'Worn pads lower the level slowly; a sudden drop = leak!'), 'common', 'stop', V('Zkontrolujte nádržku a destičky. Únik = nejezdit.', 'Check the reservoir and pads. A leak = do not drive.'), ['brakes', 'brake-lines', 'brake-bleed']),
      C(V('Parkovací brzda není úplně uvolněná', 'Parking brake not fully released'), V('Spínač páky hlásí zataženou brzdu.', 'The lever switch reports an applied brake.'), 'common', 'watch', null, ['brakes'])
    ]);

  SYM('wl-dpf', 'lights', 'soon',
    V('Kontrolka DPF (filtr pevných částic)', 'DPF (particulate filter) light'),
    V('Filtr je plný sazí a nemohl se sám vyčistit.', 'The filter is full of soot and could not clean itself.'),
    [],
    [
      C(V('Krátké jízdy – neproběhla regenerace', 'Short trips – no regeneration'), V('Regenerace potřebuje cca 15–20 min jízdy při stálé vyšší rychlosti. Pomůže jízda po dálnici (dle příručky).', 'Regeneration needs about 15–20 min at a steady higher speed. A motorway drive helps (per manual).'), 'common', 'soon', null, ['egr-dpf']),
      C(V('Vadný snímač diferenčního tlaku nebo hadičky', 'Faulty differential pressure sensor or hoses'), V('Prasklá hadička snímače zkreslí měření.', 'A split sensor hose falsifies the reading.'), 'possible', 'soon', DIAG, ['egr-dpf', 'diagnostics']),
      C(V('Problém motoru (EGR, vstřikovače) produkuje saze', 'Engine fault (EGR, injectors) makes soot'), V('Pokud se DPF ucpává rychle, hledejte příčinu v motoru.', 'If the DPF clogs quickly, look for the cause in the engine.'), 'possible', 'soon', DIAG, ['injectors', 'egr-dpf'])
    ]);
  S.symptomMap['wl-dpf'].causes[0].vehicles[JU] = V('Jumper: nejdřív zjistěte, zda DPF/FAP vůbec má.', 'Jumper: first find out whether it has a DPF/FAP at all.');

  SYM('wl-glow', 'lights', 'soon',
    V('Bliká kontrolka žhavení (diesel)', 'Glow plug light flashing (diesel)'),
    V('Spirálka bliká za jízdy – u mnoha dieselů znamená závadu motoru, nejen žhavení.', 'The coil light flashes while driving – on many diesels it means an engine fault, not just glow plugs.'),
    [],
    [
      C(V('Žhavicí svíčka nebo relé', 'Glow plug or relay'), V('Vadná svíčka nebo řídicí jednotka žhavení.', 'A faulty glow plug or glow control unit.'), 'common', 'soon', DIAG, ['spark-plugs', 'diagnostics']),
      C(V('Jiná závada motoru (EGR, tlak paliva)', 'Other engine fault (EGR, fuel pressure)'), V('Kontrolka žhavení slouží u některých aut jako kontrolka motoru.', 'On some cars the glow light doubles as an engine warning.'), 'possible', 'soon', DIAG, ['diagnostics', 'egr-dpf'])
    ]);

  SYM('wl-tpms', 'lights', 'soon',
    V('Kontrolka tlaku v pneumatikách', 'Tyre pressure (TPMS) light'),
    V('Systém zjistil pokles tlaku nebo má závadu snímače.', 'The system detected a pressure drop or has a sensor fault.'),
    [],
    [
      C(V('Pokles tlaku – defekt nebo teplota', 'Pressure drop – puncture or temperature'), V('V zimě tlak klesá s teplotou. Defekt může být pomalý.', 'In winter pressure drops with temperature. A puncture can be slow.'), 'common', 'soon', V('Změřte tlak všech kol, prohlédněte běhouny.', 'Measure all tyres, inspect the treads.'), ['tyres']),
      C(V('Vybitý snímač / nutný reset', 'Flat sensor battery / reset needed'), V('Snímače mají baterii na 5–10 let; po přezutí je nutné systém resetovat.', 'Sensors have a 5–10-year battery; after a tyre change the system needs a reset.'), 'possible', 'watch', null, ['tyres', 'diagnostics'])
    ]);

  SYM('wl-suspension', 'lights', 'soon',
    V('Kontrolka podvozku / výšky (ABC, vzduch)', 'Suspension / level warning (ABC, air)'),
    V('Hlášení „Vůz příliš nízko“, „Zastavte“ nebo kontrolka podvozku.', 'A “Car too low”, “Stop” message or a suspension warning light.'),
    [],
    [
      C(V('Únik hydrauliky ABC / vzduchu', 'ABC hydraulic / air leak'), V('Ztráta tlaku – vůz klesá. Při hlášení „Zastavte“ nejezděte, hrozí poškození pneumatik a podvozku.', 'Loss of pressure – the car drops. With a “Stop” message do not drive, tyres and suspension can be damaged.'), 'common', 'stop', DIAG, ['abc-hydraulics', 'air-suspension', 'diagnostics']),
      C(V('Kompresor / čerpadlo / snímač výšky', 'Compressor / pump / height sensor'), V('Přehřátý kompresor nebo vadný snímač výšky.', 'An overheated compressor or a faulty height sensor.'), 'possible', 'soon', DIAG, ['diagnostics', 'air-suspension'])
    ]);
  S.symptomMap['wl-suspension'].causes[0].vehicles[CL] = V('CL 500 (ABC): hlídejte hladinu zelené kapaliny Pentosin a úniky u čerpadla a vzpěr.', 'CL 500 (ABC): watch the green Pentosin level and leaks at the pump and struts.');
  S.symptomMap['wl-suspension'].causes[0].vehicles[XC] = V('XC60 (vzduch): netěsný měch nebo vedení; kompresor se při častém dofukování přehřívá.', 'XC60 (air): a leaking spring or line; the compressor overheats with frequent top-ups.');

  /* ============================================================ ELECTRICAL */
  SYM('battery-flat', 'electrical', 'soon',
    V('Baterie se opakovaně vybíjí', 'Battery keeps going flat'),
    V('Auto po pár dnech stání nenastartuje, nebo ráno startuje pomalu.', 'The car will not start after a few days of standing, or cranks slowly in the morning.'),
    [V('Kolik je baterii let?', 'How old is the battery?'), V('Jezdíte hlavně krátké trasy?', 'Do you mostly make short trips?')],
    [
      C(V('Stará baterie', 'Old battery'), V('Baterie vydrží obvykle 4–7 let. Pak ztrácí kapacitu, hlavně v zimě.', 'A battery usually lasts 4–7 years. Then it loses capacity, especially in winter.'), 'common', 'soon', V('Otestujte testerem baterie (CCA) nebo nechte změřit.', 'Test with a battery tester (CCA) or have it measured.'), ['battery']),
      C(V('Krátké jízdy – baterie se nedobije', 'Short trips – battery never recharges'), V('Start spotřebuje hodně energie, krátká jízda ji nevrátí.', 'Starting uses a lot of energy and a short trip does not put it back.'), 'common', 'watch', V('Dobijte nabíječkou a sledujte, zda vydrží.', 'Charge with a charger and see if it holds.'), ['battery']),
      C(V('Parazitní odběr', 'Parasitic drain'), V('Něco zůstává zapnuté (osvětlení, modul, příslušenství). Klidový odběr má být typicky pod 50 mA.', 'Something stays on (a light, a module, an accessory). Resting draw is typically under 50 mA.'), 'possible', 'soon',
        V('Ampérmetrem v sérii s mínus pólem změřte proud po uspání vozu; vytahováním pojistek najděte okruh.', 'Measure current in series with the negative terminal after the car goes to sleep; pull fuses to find the circuit.'), ['fuses', 'battery']),
      C(V('Nedobíjí alternátor', 'Alternator not charging'), V('Viz Kontrolka dobíjení.', 'See Charging light.'), 'possible', 'soon', null, ['alternator-starter'])
    ]);
  S.symptomMap['battery-flat'].causes[0].vehicles[CL] = V('CL 500: baterie je v kufru – při výměně často nutné kódování / registrace.', 'CL 500: the battery is in the boot – coding/registration often needed after replacement.');
  S.symptomMap['battery-flat'].causes[0].vehicles[XC] = V('XC60: má 12V i 48V baterii – pro start a elektroniku je důležitá 12V. Výměnu registrujte ve VIDA.', 'XC60: has 12V and 48V batteries – the 12V matters for start-up and electronics. Register a replacement in VIDA.');
  S.symptomMap['battery-flat'].causes[0].tutorials.push('mhev-48v');

  SYM('starter-clicks', 'electrical', 'soon',
    V('Při startu jen cvakne nebo nic', 'Only a click (or nothing) when starting'),
    V('Po otočení klíčem / stisku START jen cvakne relé nebo se nic nestane, kontrolky svítí nebo poblikávají.', 'Turning the key / pressing START gives only a click or nothing, the warning lights stay on or flicker.'),
    [],
    [
      C(V('Vybitá baterie', 'Flat battery'), V('Na kontrolky stačí, na startér ne.', 'Enough for the lights, not for the starter.'), 'common', 'soon', null, ['battery', 'jumpstart-tow']),
      C(V('Zkorodované nebo volné svorky', 'Corroded or loose terminals'), V('Velký proud startéru neprojde špatným kontaktem.', 'The starter’s big current cannot pass a poor contact.'), 'common', 'watch', V('Očistěte a dotáhněte svorky (nejdřív odpojit mínus).', 'Clean and tighten the terminals (disconnect negative first).'), ['battery']),
      C(V('Vadný startér / solenoid', 'Faulty starter / solenoid'), V('Baterie je v pořádku, ale startér netočí.', 'The battery is fine but the starter does not turn.'), 'possible', 'soon', null, ['alternator-starter']),
      C(V('Spínač spojky / brzdy, imobilizér', 'Clutch / brake switch, immobiliser'), V('Auto nedostane signál ke startu.', 'The car does not receive the start signal.'), 'possible', 'watch', DIAG, ['diagnostics', 'fuses'])
    ]);

  SYM('lights-dim', 'electrical', 'watch',
    V('Světla blikají, slábnou nebo jedno nesvítí', 'Lights flicker, dim or one is out'),
    V('Světla mění jas s otáčkami, jedno světlo nesvítí nebo hlásí závadu žárovky.', 'Lights change brightness with revs, one light is out or a bulb warning appears.'),
    [],
    [
      C(V('Spálená žárovka', 'Blown bulb'), V('Nejčastější. Měňte v párech (stejná barva a svítivost).', 'The most common. Replace in pairs (same colour and output).'), 'common', 'soon', null, ['headlights', 'rearlights']),
      C(V('Koroze v objímce / konektoru', 'Corrosion in the socket / connector'), V('Vlhkost ve světle způsobí zelenou korozi.', 'Moisture in the lamp causes green corrosion.'), 'possible', 'watch', null, ['rearlights', 'headlights']),
      C(V('Pojistka nebo kostra', 'Fuse or earth'), V('Špatná kostra = blikání a slabé světlo.', 'A poor earth = flickering and dim light.'), 'possible', 'watch', null, ['fuses']),
      C(V('Kolísání dobíjení', 'Charging fluctuation'), V('Jas se mění s otáčkami – regulátor alternátoru.', 'Brightness changes with revs – alternator regulator.'), 'possible', 'soon', null, ['alternator-starter'])
    ]);

  SYM('circuit-dead', 'electrical', 'watch',
    V('Nefunguje jeden spotřebič (okna, zásuvka, rádio…)', 'One thing stopped working (windows, socket, radio…)'),
    V('Jeden okruh je úplně mrtvý, zbytek auta funguje.', 'One circuit is completely dead, the rest of the car works.'),
    [],
    [
      C(V('Spálená pojistka', 'Blown fuse'), V('Pojistka chrání kabel před přehřátím. Spálená = přetížení nebo zkrat.', 'A fuse protects the wire from overheating. Blown = overload or short.'), 'common', 'watch',
        V('Najděte pojistku podle schématu; vždy nahraďte STEJNOU hodnotou. Když hned znovu spálí, hledejte zkrat.', 'Find the fuse using the diagram; always replace with the SAME rating. If it blows again immediately, look for a short.'), ['fuses']),
      C(V('Relé, spínač nebo konektor', 'Relay, switch or connector'), V('Okruh má pojistku v pořádku, ale nedostane signál.', 'The circuit’s fuse is fine but it gets no signal.'), 'possible', 'watch', null, ['fuses', 'diagnostics'])
    ]);

  /* =========================================================== TEMPERATURE */
  SYM('overheating', 'temperature', 'stop',
    V('Přehřívání motoru', 'Engine overheating'),
    V('Ručička teploty jde nad polovinu, svítí červená kontrolka, z pod kapoty jde pára.', 'The temperature needle goes above the middle, the red light comes on, steam comes from under the bonnet.'),
    [V('Přehřívá se v koloně, nebo na dálnici?', 'Does it overheat in traffic or on the motorway?')],
    [
      C(V('Nedostatek chladicí kapaliny', 'Low coolant'), V('Únik – bez kapaliny motor neodvádí teplo.', 'A leak – without coolant the engine cannot shed heat.'), 'common', 'stop', V('Zastavte, vypněte motor, NEotvírejte horké víčko. Po vychladnutí zkontrolujte hladinu.', 'Stop, switch off, do NOT open the hot cap. Check the level once cool.'), ['coolant']),
      C(V('Termostat zaseknutý zavřený', 'Thermostat stuck closed'), V('Kapalina nejde do chladiče – rychlé přehřátí, horní hadice chladiče je studená.', 'Coolant cannot reach the radiator – fast overheating, the upper radiator hose stays cold.'), 'common', 'stop', null, ['thermostat-pump']),
      C(V('Ventilátor chlazení nefunguje (kolona)', 'Cooling fan not working (traffic)'), V('V pomalé jízdě chybí proudění vzduchu – přehřívá se v koloně, na dálnici je v pořádku.', 'At low speed there is no airflow – overheats in traffic but is fine on the motorway.'), 'possible', 'stop', null, ['fuses', 'coolant']),
      C(V('Vodní pumpa nebo řemen', 'Water pump or belt'), V('Pumpa necirkuluje kapalinu.', 'The pump does not circulate coolant.'), 'possible', 'stop', null, ['thermostat-pump', 'aux-belt', 'timing-belt']),
      C(V('Těsnění hlavy', 'Head gasket'), V('Spaliny v chladicím okruhu – bubliny, tlak, ztráta kapaliny.', 'Combustion gases in the cooling system – bubbles, pressure, coolant loss.'), 'rare', 'stop', null, ['head-gasket'])
    ]);

  SYM('heater-cold', 'temperature', 'watch',
    V('Topení netopí / motor se nezahřeje', 'Heater blows cold / engine never warms up'),
    V('Z topení jde vlažný vzduch, ručička teploty zůstává nízko.', 'The heater blows lukewarm air and the temperature needle stays low.'),
    [],
    [
      C(V('Termostat zaseknutý otevřený', 'Thermostat stuck open'), V('Motor se nedostane na provozní teplotu – vyšší spotřeba, slabé topení.', 'The engine never reaches operating temperature – higher consumption, weak heater.'), 'common', 'watch', null, ['thermostat-pump']),
      C(V('Vzduch v okruhu / nízká hladina', 'Air in the system / low level'), V('Vzduchová bublina ve výměníku topení.', 'An air lock in the heater core.'), 'common', 'soon', null, ['coolant']),
      C(V('Ucpaný výměník nebo klapky', 'Clogged heater core or flaps'), V('Usazeniny nebo vadný servomotor klapky.', 'Deposits or a faulty flap actuator.'), 'possible', 'watch', null, ['coolant', 'diagnostics'])
    ]);

  SYM('ac-warm', 'temperature', 'watch',
    V('Klimatizace nechladí', 'Air conditioning not cold'),
    V('Z klimatizace jde teplý nebo jen trochu chladný vzduch.', 'The A/C blows warm or only slightly cool air.'),
    [],
    [
      C(V('Málo chladiva (únik)', 'Low refrigerant (leak)'), V('Chladivo pomalu uniká. Plnění smí provádět jen certifikovaný servis (EU).', 'Refrigerant slowly escapes. Only a certified shop may refill it (EU).'), 'common', 'watch', null, ['aircon']),
      C(V('Ucpaný pylový filtr / kondenzátor', 'Clogged cabin filter / condenser'), V('Málo vzduchu nebo špatný odvod tepla v kondenzátoru před chladičem.', 'Little airflow or poor heat rejection at the condenser in front of the radiator.'), 'common', 'watch', null, ['filters', 'aircon']),
      C(V('Kompresor nespíná', 'Compressor not engaging'), V('Spojka kompresoru, pojistka nebo tlakový spínač.', 'Compressor clutch, fuse or pressure switch.'), 'possible', 'watch', null, ['aircon', 'fuses'])
    ]);

  /* ================================================================= TYRES */
  SYM('tyre-wear-uneven', 'tyres', 'soon',
    V('Nerovnoměrně sjeté pneumatiky', 'Uneven tyre wear'),
    V('Vnitřní nebo vnější okraj je sjetý víc než střed, nebo jsou na běhounu „zuby“.', 'The inner or outer edge is worn more than the centre, or the tread is cupped.'),
    [],
    [
      C(V('Geometrie (sbíhavost / odklon)', 'Alignment (toe / camber)'), V('Špatně nastavená kola se „drhnou“ po silnici.', 'Misaligned wheels scrub along the road.'), 'common', 'soon', null, ['alignment']),
      C(V('Tlak v pneumatikách', 'Tyre pressure'), V('Podhuštěná = sjeté okraje, přehuštěná = sjetý střed.', 'Under-inflated = worn edges, over-inflated = worn centre.'), 'common', 'watch', null, ['tyres']),
      C(V('Opotřebené tlumiče nebo čepy', 'Worn shocks or joints'), V('Kolo poskakuje – vznikají „zuby“.', 'The wheel bounces – cupping appears.'), 'possible', 'soon', null, ['struts-springs', 'suspension-wear'])
    ]);
  S.symptomMap['tyre-wear-uneven'].causes[0].vehicles[GR] = V('GR Yaris po okruhu: vnější hrany se sjíždějí rychle – kontrolujte tlaky za tepla a geometrii.', 'GR Yaris after track days: outer shoulders wear fast – check hot pressures and alignment.');
  S.symptomMap['tyre-wear-uneven'].causes[0].tutorials.push('track-prep');
  S.symptomMap['tyre-wear-uneven'].causes[1].vehicles[JU] = V('Jumper: tlak podle zatížení (prázdný / plný) – štítek ve dveřích.', 'Jumper: pressure depends on load (empty / full) – see the door-pillar label.');

  SYM('tyre-pressure-loss', 'tyres', 'soon',
    V('Pneumatika ztrácí tlak', 'Tyre keeps losing pressure'),
    V('Jedno kolo musíte opakovaně dohušťovat.', 'You keep having to re-inflate one tyre.'),
    [],
    [
      C(V('Hřebík / defekt v běhounu', 'Nail / puncture in the tread'), V('Pomalý defekt. Opravitelný jen ve střední části běhounu.', 'A slow puncture. Repairable only in the central tread area.'), 'common', 'soon', V('Postříkejte pneumatiku mýdlovou vodou – bubliny prozradí místo.', 'Spray the tyre with soapy water – bubbles show the spot.'), ['tyres']),
      C(V('Zkorodovaný disk nebo ventilek', 'Corroded rim or valve'), V('Netěsnost na dosedu pneumatiky nebo u ventilku.', 'A leak at the bead seat or valve.'), 'possible', 'watch', null, ['tyres'])
    ]);

  SYM('tyre-bulge', 'tyres', 'stop',
    V('Boule nebo řez na boku pneumatiky', 'Bulge or cut on the tyre sidewall'),
    V('Vyboulení na boku pneumatiky po nárazu do obrubníku nebo výmolu.', 'A bulge on the sidewall after hitting a kerb or pothole.'),
    [],
    [
      C(V('Přetržená kostra pneumatiky', 'Broken tyre carcass'), V('Vlákna kostry jsou přetržená a vzduch tlačí na gumu. Hrozí náhlé roztržení!', 'The carcass cords are broken and air pushes on the rubber. Risk of a sudden blowout!'), 'common', 'stop', V('Okamžitě nasaďte rezervu / nejezděte, pneumatiku vyměňte.', 'Fit the spare immediately / do not drive, replace the tyre.'), ['tyres', 'lifting'])
    ]);
})(window.STU);

/* Applicability: hide symptoms / causes that cannot occur on a given car (the generic vehicle shows everything). */
(function (S) {
  'use strict';
  var CL = 'mb-cl500-c216', XC = 'volvo-xc60-b4', OCT = 'skoda-octavia-rs-tdi', GR = 'toyota-gr-yaris', JMP = 'citroen-jumper-22hdi';
  var DIESEL = [OCT, JMP], AUTO = [CL, XC], MANUAL = [OCT, GR, JMP], BELT = [OCT, XC], NA = [CL];
  var rules = {
    'rattle-cold-start#0': { notFor: BELT },      // chain stretch – belt engines have no chain
    'rattle-cold-start#2': { onlyFor: DIESEL },   // diesel dual-mass flywheel
    'vib-idle#2': { onlyFor: DIESEL },
    'turbo-whistle': { notFor: NA },              // naturally aspirated V8 has no turbo
    'power-loss#0': { notFor: NA },
    'power-loss#1': { onlyFor: DIESEL },
    'oil-consumption#1': { notFor: NA },
    'smoke-blue#0': { notFor: NA },
    'smoke-black#3': { onlyFor: DIESEL },
    'smoke-white#2': { onlyFor: DIESEL },
    'hard-start-cold#0': { onlyFor: DIESEL },
    'smell-fuel#1': { onlyFor: DIESEL },
    'wl-dpf': { onlyFor: DIESEL },
    'wl-glow': { onlyFor: DIESEL },
    'clunk-gearchange#2': { onlyFor: AUTO },
    'auto-shift': { onlyFor: AUTO },
    'leak-red#0': { onlyFor: AUTO },
    'clutch-slip': { onlyFor: MANUAL },
    'clutch-soft': { onlyFor: MANUAL },
    'clutch-heavy': { onlyFor: MANUAL },
    'gear-grind': { onlyFor: MANUAL },
    'gearbox-whine#1': { onlyFor: MANUAL },
    'gear-grind#0': { onlyFor: MANUAL },
    'smell-burning#1': { onlyFor: MANUAL },
    'leak-brake#1': { onlyFor: MANUAL },
    'car-sags#1': { onlyFor: [XC] },
    'car-sags#2': { onlyFor: [CL] },
    'wl-suspension': { onlyFor: [CL, XC] }
  };
  Object.keys(rules).forEach(function (key) {
    var parts = key.split('#'), sm = S.symptomMap[parts[0]];
    if (!sm) return;
    var target = parts.length > 1 ? sm.causes[+parts[1]] : sm;
    if (target) Object.assign(target, rules[key]);
  });
})(window.STU);

