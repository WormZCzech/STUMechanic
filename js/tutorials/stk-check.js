/* Tutorial: Self-check before the Czech roadworthiness test (STK). */
(function (S) {
  'use strict';
  var V = function (cs, en) { return { cs: cs, en: en }; };

  S.registerTutorial({
    id: 'stk-check',
    level: 1,
    thumb: 'stk-check.lights',
    time: V('45–60 min', '45–60 min'),
    title: V('Před STK: kontrola vlastními silami', 'Before the STK: self-check of your car'),
    summary: V('Projděte si, co technik na STK kontroluje – světla, brzdy, vůle, úniky, emise, výbava a doklady.', 'Go through what the inspector checks – lights, brakes, play, leaks, emissions, equipment and documents.'),
    intro: V(
      '**STK** (stanice technické kontroly) je v ČR povinná pravidelná prohlídka. Většina neúspěchů má banální příčinu – nesvítící žárovka, kontrolka, sjeté pneu. Tento kontrolní seznam vám ušetří opakovanou cestu.\n\nIntervaly a přesné požadavky se mohou měnit – ověřte je na webu MD ČR nebo u vaší STK.',
      'The **STK** is the mandatory periodic roadworthiness test in the Czech Republic. Most failures have trivial causes – a dead bulb, a warning light, worn tyres. This checklist saves you a second trip.\n\nIntervals and exact requirements can change – verify them on the Ministry of Transport website or with your test station.'
    ),
    safety: [
      { level: 'danger', text: V('Kontrolu vůlí a podvozku dělejte jen na vozidle bezpečně podepřeném stojany (viz návod na zvedání).', 'Check play and the underside only with the car safely supported on stands (see the lifting tutorial).') },
      { level: 'warning', text: V('Motor nenechávejte běžet v uzavřené garáži (zkouška světel, kouřivosti).', 'Do not run the engine in a closed garage (testing lights, smoke).') },
      { level: 'info', text: V('Tento seznam je pomůcka, ne oficiální metodika STK. Konečné rozhodnutí má technik.', 'This list is an aid, not the official STK methodology. The inspector has the final say.') }
    ],
    tools: [
      V('Pomocník nebo odrazná plocha (kontrola světel)', 'A helper or reflective surface (checking lights)'),
      V('Baterka, hloubkoměr dezénu, měřič tlaku', 'Torch, tread depth gauge, pressure gauge'),
      V('Čistý karton (kontrola úniků)', 'Clean cardboard (leak check)'),
      V('Hever + stojany (kontrola vůlí)', 'Jack + stands (checking play)')
    ],
    parts: [
      V('Náhradní žárovky dle vozu', 'Spare bulbs for your car'),
      V('Stírací lišty, kapalina do ostřikovačů', 'Wiper blades, washer fluid'),
      V('Lékárnička (platná), trojúhelník, reflexní vesta', 'First-aid kit (in date), warning triangle, reflective vest')
    ],
    finalChecks: [
      V('Všechna světla fungují, kontrolky zhasnou', 'All lights work, warning lights go out'),
      V('Pneu nad limitem, správný rozměr dle ORV', 'Tyres above the limit, correct size per papers'),
      V('Žádné úniky, výfuk těsný', 'No leaks, exhaust sealed'),
      V('Povinná výbava a doklady ve voze', 'Mandatory equipment and documents in the car'),
      V('Vůz čistý, VIN čitelný', 'Car clean, VIN legible')
    ],
    steps: [
      { id: 'lights', anim: 'stk-check.lights', title: V('Světla a směrovky', 'Lights and indicators'), body: V('Zkontrolujte všechna světla vpředu i vzadu, včetně mlhovek, couvacího, 3. brzdového a osvětlení SPZ. Kryty světel nesmí být prasklé, zamlžené uvnitř ani zatažené fólií. Seřízení světlometů viz návod **Světlomety**.', 'Check every light front and rear, incl. fogs, reverse, the 3rd brake light and the number plate light. Lenses must not be cracked, fogged inside or tinted. For headlight aiming see the **Headlights** tutorial.'), notes: [{ level: 'tip', text: V('Vadné žárovky vyměňte doma (návody Světlomety a Zadní světla) – na STK je to zbytečná závada.', 'Replace dead bulbs at home (Headlights and Rear lights tutorials) – at the test it is a needless failure.') }] },
      { id: 'cabin', anim: 'stk-check.cabin', title: V('Kontrolky, klakson, pásy', 'Warning lights, horn, belts'), body: V('Po zapnutí zapalování se rozsvítí kontrolky a po nastartování musí zhasnout. Vyzkoušejte klakson, stěrače a ostřikovače, všechny bezpečnostní pásy (zapnutí, navíjení, zablokování při trhnutí).', 'With the ignition on the warning lights come on and must go out after starting. Test the horn, wipers and washers, and every seatbelt (buckle, retract, lock when jerked).'), notes: [{ level: 'danger', text: V('Svítící kontrolka airbagu, ABS nebo motoru = závada. Kódy nechte přečíst (návod Diagnostika), nemažte je bez opravy.', 'A lit airbag, ABS or engine light = defect. Have the codes read (Diagnostics tutorial), do not clear them without a repair.') }] },
      { id: 'brakes', anim: 'stk-check.brakes', title: V('Brzdy a ruční brzda', 'Brakes and parking brake'), body: V('Pedál musí být pevný a při delším stisku neklesat. Vůz při brzdění netáhne do strany. Ruční brzda udrží vůz ve svahu. Zkontrolujte hladinu brzdové kapaliny.', 'The pedal must be firm and not sink when held. The car must not pull to one side when braking. The parking brake holds the car on a slope. Check the brake fluid level.'), notes: [{ level: 'warning', text: V('Měkký pedál nebo tah do strany řešte hned – viz návody Brzdy a Odvzdušnění brzd.', 'A soft pedal or pulling to one side needs fixing now – see the Brakes and Brake bleeding tutorials.') }] },
      { id: 'tyres', anim: 'tyres.tread', title: V('Pneumatiky a kola', 'Tyres and wheels'), body: V('Hloubka dezénu nad limitem, žádné boule a praskliny, stejné pneu na nápravě, rozměr a indexy podle ORV. Viz návod **Pneumatiky**.', 'Tread above the limit, no bulges or cracks, the same tyres on each axle, size and indexes per the papers. See the **Tyres** tutorial.') },
      { id: 'play', anim: 'stk-check.play', title: V('Vůle v podvozku a ložiskách', 'Play in suspension and bearings'), body: V('S kolem ve vzduchu (vůz na stojanech) zakývejte kolem za 12 a 6 hodin (ložisko, čepy) a za 3 a 9 hodin (řízení). Poslouchejte klepání při přejezdu nerovností.', 'With the wheel in the air (car on stands) rock the wheel at 12 and 6 o\'clock (bearing, ball joints) and at 3 and 9 o\'clock (steering). Listen for knocks over bumps.'), notes: [{ level: 'danger', text: V('Nikdy pod vůz jen na heveru.', 'Never under the car on a jack alone.') }] },
      { id: 'steering', anim: 'stk-check.steering', title: V('Vůle v řízení', 'Steering play'), body: V('Se zapnutým motorem a koly rovně jemně pootáčejte volantem. Kola se musí začít hýbat téměř hned, bez klepání a drhnutí.', 'With the engine running and wheels straight, gently turn the steering wheel. The wheels must start moving almost at once, without clunks or binding.') },
      { id: 'leaks', anim: 'stk-check.leaks', title: V('Úniky kapalin', 'Fluid leaks'), body: V('Pod vůz dejte přes noc čistý karton. Ráno podle barvy a místa poznáte zdroj: olej (hnědá/černá), chladicí kapalina (barevná, sladce voní), brzdová kapalina (nažloutlá, u kola), převodový olej (u převodovky).', 'Put clean cardboard under the car overnight. In the morning the colour and location tell you the source: oil (brown/black), coolant (coloured, sweet smell), brake fluid (yellowish, near a wheel), gear oil (at the gearbox).'), notes: [{ level: 'danger', text: V('Únik brzdové kapaliny = nejezdit.', 'Brake fluid leak = do not drive.') }] },
      { id: 'exhaust', anim: 'stk-check.exhaust', title: V('Výfuk a emise', 'Exhaust and emissions'), body: V('Výfuk musí být těsný a pevně uchycený. Součástí STK je měření emisí – u dieselu kouřivost, u benzínu CO/HC/lambda. Před STK vůz projeďte, aby byl motor teplý.', 'The exhaust must be sealed and firmly mounted. The STK includes an emissions test – smoke opacity on diesels, CO/HC/lambda on petrol cars. Drive the car before the test so the engine is warm.'), notes: [{ level: 'danger', text: V('Odstraněný nebo nefunkční DPF/katalyzátor je nezákonný a STK neprojde.', 'A removed or non-working DPF/catalyst is illegal and fails the test.') }] },
      { id: 'vin', anim: 'stk-check.vin', title: V('VIN a doklady', 'VIN and documents'), body: V('VIN na štítku a vyražený na karoserii musí být čitelný a shodný s ORV. Vezměte ORV (a TP, pokud ho máte), případně doklad o pojištění.', 'The VIN on the plate and stamped into the body must be legible and match the papers. Bring the registration certificate (and vehicle passport if you have one), possibly the insurance card.') },
      { id: 'kit', anim: 'stk-check.kit', title: V('Povinná výbava', 'Mandatory equipment'), body: V('Lékárnička s platnou expirací, výstražný trojúhelník, reflexní vesta na dosah řidiče, rezervní kolo nebo sada na opravu + nářadí dle výbavy vozu. Aktuální seznam ověřte – vyhláška se mění.', 'First-aid kit within its expiry date, warning triangle, reflective vest within the driver\'s reach, spare wheel or repair kit + tools per the car\'s equipment. Verify the current list – the regulation changes.'), notes: [{ level: 'info', text: V('Seznam povinné výbavy a lhůty STK ověřte na webu MD ČR.', 'Verify the mandatory equipment list and inspection intervals on the Czech Ministry of Transport website.'), verify: true }] }
    ],
    vehicles: {
      'mb-cl500-c216': {
        status: 'ok',
        notes: [
          { level: 'warning', text: V('**ABC:** propad vozu přes noc nebo kontrolka podvozku = závada. Úniky Pentosinu (zelená kapalina) jsou závada i ekologický problém.', '**ABC:** the car sagging overnight or a suspension warning = defect. Pentosin leaks (green fluid) are a defect and an environmental problem.') },
          { level: 'info', text: V('Bi-xenon: vadná výbojka nebo AFS = závada světel; seřízení dle návodu Světlomety.', 'Bi-xenon: a failed bulb or AFS = lighting defect; aiming per the Headlights tutorial.') }
        ],
        steps: { exhaust: { body: V('V8 benzín: emise CO/HC/lambda se měří na obou řadách válců společně (2 katalyzátory, 4 lambda sondy – ověřit). Kontrolka motoru = neprojde.', 'V8 petrol: CO/HC/lambda are measured for both cylinder banks together (2 catalysts, 4 lambda sensors – verify). Engine light on = fail.'), notes: [] } }
      },
      'volvo-xc60-b4': {
        status: 'ok',
        notes: [
          { level: 'danger', text: V('**Vzduchový podvozek:** před zvedáním vypněte regulaci výšky / režim zvedání.', '**Air suspension:** switch off level control / jacking mode before lifting.'), verify: true },
          { level: 'info', text: V('STK může číst chyby přes OBD – chyby asistenčních systémů (radar, kamera) po nehodě řešte předem.', 'The test station may read faults via OBD – fix driver-assist faults (radar, camera) after a collision beforehand.'), verify: true }
        ]
      },
      'skoda-octavia-rs-tdi': {
        status: 'ok',
        notes: [
          { level: 'warning', text: V('**Diesel s DPF:** zanesený DPF nebo EGR zvyšuje kouřivost. Před STK jeďte 20–30 min po dálnici (regenerace), nevypínejte motor v půli regenerace.', '**Diesel with DPF:** a clogged DPF or EGR raises smoke. Before the test drive 20–30 min on the motorway (regeneration), do not switch off mid-regeneration.') },
          { level: 'info', text: V('Bi-xenon s AFS: chyba natáčení nebo výbojky = závada světel.', 'Bi-xenon with AFS: a swivel or bulb fault = lighting defect.') }
        ]
      },
      'toyota-gr-yaris': {
        status: 'ok',
        notes: [
          { level: 'warning', text: V('Úpravy (výfuk, chip, podvozek, kola) musí být homologované a zapsané v ORV – jinak STK neprojde.', 'Modifications (exhaust, tune, suspension, wheels) must be homologated and entered in the papers – otherwise the car fails.') },
          { level: 'info', text: V('Po trackdayi zkontrolujte brzdy, pneu a úniky před STK.', 'After a track day check brakes, tyres and leaks before the test.') }
        ]
      },
      'citroen-jumper-22hdi': {
        status: 'ok',
        specs: [{ label: V('Kategorie', 'Category'), value: V('N1 / N2 dle hmotnosti – lhůty STK a požadavky ověřit', 'N1 / N2 depending on weight – test intervals and requirements to verify'), verify: true }],
        notes: [
          { level: 'warning', text: V('**Diesel:** kouřivost a stav DPF (pokud je) se kontrolují. Pokud DPF nemáte, motor musí splnit limit kouřivosti své emisní třídy.', '**Diesel:** smoke and the DPF condition (if fitted) are checked. Without a DPF the engine must still meet the smoke limit for its emission class.') },
          { level: 'info', text: V('U dodávek se kontrolují i listové pružiny, upevnění nákladu, zadní dveře a kotevní body – viz návod Péče o dodávku.', 'On vans leaf springs, load anchor points and rear doors are also checked – see the Van care tutorial.'), verify: true }
        ]
      }
    }
  });
})(window.STU);
