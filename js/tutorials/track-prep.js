/* Tutorial: GR Yaris track-day preparation and post-track checks. */
(function (S) {
  'use strict';
  var V = function (cs, en) { return { cs: cs, en: en }; };

  S.registerTutorial({
    id: 'track-prep',
    level: 2,
    only: ['toyota-gr-yaris'],
    thumb: 'track-prep.overview',
    status: 'ok',
    time: V('2–4 h (příprava) + 30 min (po trati)', '2–4 h (prep) + 30 min (after)'),
    title: V('GR Yaris: příprava na okruh a kontrola po trati', 'GR Yaris: track-day preparation & post-track checks'),
    summary: V('Brzdová kapalina, destičky, olej, tlaky, momenty, interiér, vybavení řidiče – a co zkontrolovat po trati.', 'Brake fluid, pads, oil, pressures, torques, interior, driver kit – and what to check after the track.'),
    intro: V(
      'Okruh zatíží vůz víc než rok běžné jízdy: brzdy dosahují stovek °C, olej se přelévá, pneumatiky se přehřívají. **Připravte vůz den předem** a po trati ho zkontrolujte dřív, než pojedete domů.\n\nNávod odkazuje na **Odvzdušnění brzd**, **Výměnu brzd**, **Oleje převodovky a diferenciálů** a **Bezpečné zvednutí**. Řiďte se také pravidly pořadatele akce.',
      'A track day stresses the car more than a year of normal driving: brakes reach hundreds of °C, oil sloshes, tyres overheat. **Prepare the car the day before** and check it after the track before driving home.\n\nThis tutorial refers to **Brake bleeding**, **Brakes**, **Gearbox & differential oils** and **Safely lifting the car**. Also follow the event organiser\'s rules.'
    ),
    safety: [
      { level: 'danger', text: V('**Brzdová kapalina** starší než ~1 rok nebo běžná DOT 4 se na trati může vařit → pedál propadne bez varování. Před tratí kapalinu s vysokým bodem varu a odvzdušnit.', '**Brake fluid** older than ~1 year or standard DOT 4 can boil on track → the pedal sinks without warning. Before the track fit high boiling-point fluid and bleed.') },
      { level: 'danger', text: V('**Horké brzdy:** po jízdě nezatahujte ruční brzdu (destičky se přivaří, kotouč se zkřiví) a nesahejte na kola, kotouče ani výfuk.', '**Hot brakes:** after driving do not pull the handbrake (pads stick, discs warp) and do not touch wheels, discs or exhaust.') },
      { level: 'warning', text: V('Volné předměty v kabině a kufru se při brzdění stanou projektily – vše vyndat.', 'Loose items in the cabin and boot become projectiles under braking – take everything out.') },
      { level: 'warning', text: V('Helma s platnou homologací a oblečení dle pravidel pořadatele. Bez nich vás na trať nepustí.', 'Helmet with valid approval and clothing per the organiser\'s rules. Without them you will not be allowed on track.') },
      { level: 'info', text: V('Okruhový provoz může ovlivnit záruku – ověřte podmínky Toyota.', 'Track use may affect the warranty – check Toyota\'s terms.'), verify: true }
    ],
    tools: [
      V('Momentový klíč + hlavice 21 mm (ověřit)', 'Torque wrench + 21 mm socket (verify)'),
      V('Digitální měřič tlaku pneumatik', 'Digital tyre pressure gauge'),
      V('Sada na odvzdušnění brzd', 'Brake bleeding kit'),
      V('Posuvné měřítko / měrka destiček', 'Calliper / pad gauge'),
      V('OBD dongle + aplikace / laptimer, pevný držák telefonu', 'OBD dongle + app / lap timer, solid phone mount'),
      V('Tažné oko (z výbavy vozu)', 'Tow eye (from the car tool kit)'),
      V('Helma, rukavice, oblečení z bavlny', 'Helmet, gloves, cotton clothing')
    ],
    parts: [
      V('Brzdová kapalina s vysokým bodem varu (kompatibilní s DOT 4 – ověřit)', 'High boiling-point brake fluid (DOT 4 compatible – verify)'),
      V('Okruhové destičky (volitelně, dle výrobce)', 'Track pads (optional, per maker)'),
      V('Motorový olej na dolití', 'Engine oil for topping up'),
      V('Páska na čísla / pravidla pořadatele', 'Number tape / organiser requirements')
    ],
    finalChecks: [
      V('Brzdy: pedál tvrdý, destičky s rezervou, kotouče bez trhlin', 'Brakes: firm pedal, pads with margin, discs without cracks'),
      V('Olej u horní značky, žádné úniky', 'Oil at the upper mark, no leaks'),
      V('Tlaky nastavené, matice kol dotažené na moment', 'Pressures set, wheel nuts torqued'),
      V('Interiér prázdný, tažné oko namontované', 'Interior empty, tow eye fitted'),
      V('Po trati: kontrola brzd, pneumatik, matic a kapalin před cestou domů', 'After the track: brakes, tyres, nuts and fluids checked before driving home')
    ],
    steps: [
      { id: 'overview', anim: 'track-prep.overview', title: V('Plán přípravy', 'Preparation plan'),
        body: V('Den předem projděte celý seznam. Vůz umytý (lépe uvidíte úniky), plná nádrž dle délky akce, nářadí a náhradní kapaliny s sebou.', 'Go through the whole list the day before. Car washed (leaks are easier to see), fuel for the event length, tools and spare fluids with you.') },
      { id: 'fluid', anim: 'track-prep.fluid', title: V('Brzdová kapalina', 'Brake fluid'),
        body: V('Vyměňte za kapalinu s **vysokým bodem varu** a celý systém odvzdušněte podle návodu **Odvzdušnění brzd** (u 4pístkových třmenů obě odvzdušňovací místa – ověřit).', 'Replace it with **high boiling-point** fluid and bleed the whole system per the **Brake bleeding** tutorial (on 4-piston calipers both bleed nipples – verify).'),
        specs: [{ label: V('Kapalina', 'Fluid'), value: V('High-temp kompatibilní s DOT 4 – dle Toyota / výrobce', 'High-temp DOT 4 compatible – per Toyota / maker'), verify: true }],
        notes: [{ level: 'danger', text: V('Nikdy DOT 5 (silikon) – nemísitelná, zničí těsnění.', 'Never DOT 5 (silicone) – not miscible, destroys seals.') }] },
      { id: 'pads', anim: 'track-prep.pads', title: V('Destičky a kotouče', 'Pads and discs'),
        body: V('Změřte tloušťku destiček – na trať jeďte s výraznou rezervou. Kotouče bez trhlin od otvorů a bez velkého otřepu. Nové destičky před tratí zabrzdit.', 'Measure pad thickness – go to the track with a good margin. Discs without cracks and without a big lip. Bed in new pads before the track.'),
        specs: [{ label: V('Min. tloušťka destičky', 'Min. pad thickness'), value: V('dle TIS / výrobce destiček', 'per TIS / pad maker'), verify: true }] },
      { id: 'oil', anim: 'track-prep.oil', title: V('Hladina oleje', 'Oil level'),
        body: V('Na rovině s teplým motorem doplňte **k horní značce, ne nad ni**. Málo oleje = hladovění v zatáčkách, moc = pěnění a únik odvětráním. Zvažte zkrácený interval výměny.', 'On level ground with a warm engine top up **to the upper mark, not above**. Too little = starvation in corners, too much = foaming and loss via the breather. Consider a shorter change interval.'),
        notes: [{ level: 'info', text: V('Oleje převodovky a diferenciálů měňte při okruhovém provozu častěji (viz Oleje převodovky a diferenciálů).', 'Change gearbox and differential oils more often with track use (see Gearbox & differential oils).'), verify: true }] },
      { id: 'tyres', anim: 'track-prep.tyres', title: V('Pneumatiky a tlaky', 'Tyres and pressures'),
        body: V('Zkontrolujte dezén, poškození a stáří. Tlak nastavte za studena dle doporučení, po prvním výjezdu změřte **hned za tepla** a upravte dle výrobce pneumatik.', 'Check tread, damage and age. Set cold pressures per the recommendation, after the first session measure **hot straight away** and adjust per the tyre maker.'),
        specs: [{ label: V('Tlaky studené / teplé', 'Pressures cold / hot'), value: V('dle Toyota a výrobce pneumatik', 'per Toyota and the tyre maker'), verify: true }],
        notes: [{ level: 'warning', text: V('Teplé pneumatiky nepouštějte pod minimum výrobce – po vychladnutí by byly podhuštěné.', 'Do not bleed hot tyres below the maker\'s minimum – they would be under-inflated when cold.') }] },
      { id: 'torque', anim: 'track-prep.torque', title: V('Moment matic kol', 'Wheel nut torque'),
        body: V('Studená kola dotáhněte momentovým klíčem do kříže. Po prvním výjezdu (po vychladnutí) zkontrolujte znovu.', 'Torque the cold wheels with a torque wrench in a star pattern. Check again after the first session (once cool).'),
        specs: [{ label: V('Moment', 'Torque'), value: '103 Nm', verify: true }] },
      { id: 'interior', anim: 'track-prep.interior', title: V('Interiér a tažné oko', 'Interior and tow eye'),
        body: V('Vyndejte vše volné z kabiny i kufru (rohože, láhve, lékárničku zajistěte dle pravidel). Zašroubujte **tažné oko** dopředu, ať vás lze rychle odtáhnout.', 'Take everything loose out of the cabin and boot (mats, bottles; secure the first-aid kit per the rules). Screw in the **tow eye** at the front so you can be recovered quickly.') },
      { id: 'logging', anim: 'track-prep.logging', title: V('Záznam dat', 'Data logging'),
        body: V('OBD dongle + aplikace ukáže časy kol a hlavně **teplotu oleje a chladiva**. Telefon pevně uchyťte. Chybové kódy po trati přečtěte (viz Diagnostika).', 'An OBD dongle + app shows lap times and above all **oil and coolant temperature**. Mount the phone securely. Read fault codes after the track (see Diagnostics).'),
        notes: [{ level: 'info', text: V('Jízdní režimy GR-FOUR (rozdělení momentu) a případné vypnutí stabilizace – dle uživatelské příručky a pravidel pořadatele.', 'GR-FOUR drive modes (torque split) and any stability-control setting – per the owner\'s manual and organiser\'s rules.'), verify: true }] },
      { id: 'driver', anim: 'track-prep.driver', title: V('Vybavení řidiče', 'Driver kit'),
        body: V('Homologovaná helma, dlouhé rukávy a kalhoty z bavlny, pevná obuv s tenkou podrážkou. Sedadlo, volant a zrcátka seřiďte v boxech, pásy pevně.', 'Approved helmet, long cotton sleeves and trousers, sturdy thin-soled shoes. Adjust seat, wheel and mirrors in the pits, belts tight.') },
      { id: 'cooldown', anim: 'track-prep.cooldown', title: V('Chladicí kolo a parkování', 'Cool-down lap and parking'),
        body: V('Poslední kolo jeďte pomalu a téměř bez brzdění. V boxech **nezatahujte ruční brzdu** – zařaďte rychlost a případně zaklínujte. Motor nechte chvíli běžet na volnoběh (turbo).', 'Drive the last lap slowly with almost no braking. In the pits **do not pull the handbrake** – leave it in gear and chock if needed. Let the engine idle briefly (turbo).'),
        notes: [{ level: 'danger', text: V('Ruční brzda na horkých brzdách = přivařené destičky a zkřivený kotouč.', 'Handbrake on hot brakes = stuck pads and warped disc.') }] },
      { id: 'after', anim: 'track-prep.after', title: V('Kontrola po trati', 'Post-track check'),
        body: V('Po vychladnutí: destičky a kotouče, tlaky a opotřebení pneumatik, **dotažení matic**, hladiny oleje, chladiva a brzdové kapaliny, úniky pod vozem. Pak teprve na cestu domů.', 'Once cool: pads and discs, tyre pressures and wear, **wheel nut torque**, oil, coolant and brake fluid levels, leaks under the car. Only then drive home.'),
        notes: [{ level: 'warning', text: V('Měkký pedál, vibrace nebo nový zvuk = domů nejezdit, zkontrolovat.', 'Soft pedal, vibration or a new noise = do not drive home, inspect first.') }] }
    ],
    vehicles: {
      'toyota-gr-yaris': {
        status: 'ok',
        specs: [
          { label: V('Přední brzdy', 'Front brakes'), value: V('4pístkové pevné třmeny, kotouč 356 mm', '4-piston fixed calipers, 356 mm disc'), verify: true },
          { label: V('Matice kol', 'Wheel nuts'), value: '103 Nm', verify: true },
          { label: V('Pohon', 'Drive'), value: 'GR-FOUR AWD' }
        ],
        notes: [
          { level: 'info', text: V('Turbomotor G16E: po trati nechte chvíli volnoběh, ať turbo vychladne.', 'G16E turbo engine: idle briefly after the track so the turbo cools.') }
        ]
      }
    }
  });
})(window.STU);
