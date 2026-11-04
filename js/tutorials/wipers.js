/* Tutorial: Wipers & washers – blade replacement, washer fluid, nozzles. */
(function (S) {
  'use strict';
  var V = function (cs, en) { return { cs: cs, en: en }; };

  S.registerTutorial({
    id: 'wipers',
    level: 1,
    thumb: 'wipers.lift',
    time: V('15–20 min', '15–20 min'),
    title: V('Stěrače a ostřikovače: výměna lišt, kapalina, trysky', 'Wipers & washers: blades, fluid, nozzles'),
    summary: V('Servisní poloha, bezpečné zvednutí ramen, výměna lišt, zimní kapalina a seřízení trysek.', 'Service position, lifting the arms safely, blade change, winter fluid and nozzle adjustment.'),
    intro: V(
      'Dobrý výhled je základ bezpečnosti – a výměna lišt je jeden z nejjednodušších úkonů. Pozor jen na jedno: **rameno bez lišty umí rozbít čelní sklo.**',
      'Good visibility is basic safety – and changing blades is one of the easiest jobs. Watch out for one thing: **an arm without a blade can crack the windscreen.**'
    ),
    safety: [
      { level: 'warning', text: V('Před prací vypněte zapalování a stěrače (i automatické – dešťový senzor může stěrače nečekaně spustit a zranit prsty).', 'Switch off the ignition and the wipers before working (also automatic – the rain sensor can start the wipers unexpectedly and injure fingers).') },
      { level: 'warning', text: V('Zvednuté rameno bez lišty nikdy nepouštějte – pružina ho vymrští proti sklu. Na sklo položte složený ručník.', 'Never let go of a lifted arm without a blade – the spring snaps it onto the glass. Put a folded towel on the glass.') },
      { level: 'caution', text: V('U mnoha vozů jdou ramena zvednout jen v servisní poloze – jinak narazí do kapoty a poškodí lak.', 'On many cars the arms can only be lifted in the service position – otherwise they hit the bonnet and damage the paint.') }
    ],
    tools: [
      V('Nové stírací lišty (správná délka a typ uchycení)', 'New wiper blades (correct length and mounting type)'),
      V('Měkký ručník / hadr', 'Soft towel / cloth'),
      V('Jehla nebo tenký drát (seřízení trysek)', 'Needle or thin wire (nozzle adjustment)'),
      V('Čistič skel, odmašťovač', 'Glass cleaner, degreaser')
    ],
    parts: [
      V('Stírací lišty vpředu (často dvě různé délky) + zadní, pokud je', 'Front wiper blades (often two different lengths) + rear if fitted'),
      V('Kapalina do ostřikovačů (v zimě −20 °C a méně)', 'Washer fluid (in winter rated −20 °C or lower)')
    ],
    finalChecks: [
      V('Lišty zacvaknuté, nepohnou se', 'Blades clicked in and secure'),
      V('Stěrače se vrátily do klidové polohy', 'Wipers returned to the park position'),
      V('Ostřikovače stříkají na sklo, ne přes střechu', 'Washers spray on the glass, not over the roof'),
      V('Nádržka plná, víčko zavřené', 'Reservoir full, cap closed'),
      V('Žádné šmouhy ani drnčení', 'No smearing or chattering')
    ],
    steps: [
      { id: 'inspect', anim: 'wipers.inspect', title: V('Poznejte opotřebené lišty', 'Recognise worn blades'), body: V('Šmouhy, nestírané pruhy, drnčení nebo popraskaná guma = výměna. Guma stárne i od slunce a mrazu, obvykle vydrží asi rok.', 'Smears, unwiped streaks, chattering or cracked rubber = replace. Rubber also ages from sun and frost and usually lasts about a year.'), notes: [{ level: 'tip', text: V('Délku a typ lišt najdete v katalogu podle vozu nebo změřte staré.', 'Find the blade length and type in a parts catalogue for your car or measure the old ones.') }] },
      { id: 'service', anim: 'wipers.service', title: V('Nastavte servisní polohu', 'Set the service position'), body: V('U vozů, kde ramena v klidu leží pod okrajem kapoty, je nejdřív posuňte do **servisní polohy** (postup v příručce). U ostatních lze ramena zvednout přímo.', 'On cars where the arms rest under the bonnet edge, first move them to the **service position** (procedure in the manual). On others the arms can be lifted directly.'), notes: [{ level: 'caution', text: V('Nezvedejte ramena v klidové poloze násilím – poškodíte kapotu i mechanismus.', 'Do not force the arms up in the park position – you will damage the bonnet and mechanism.') }] },
      { id: 'lift', anim: 'wipers.lift', title: V('Zvedněte ramena a chraňte sklo', 'Lift the arms and protect the glass'), body: V('Rameno uchopte u konce a zvedněte kolmo od skla, dokud nezaskočí. Na sklo pod rameno položte složený ručník.', 'Grip the arm near its end and lift it straight away from the glass until it latches. Put a folded towel on the glass under the arm.'), notes: [{ level: 'danger', text: V('Rameno bez lišty nepouštějte – při úderu sklo praskne.', 'Do not let go of an arm without a blade – the impact cracks the glass.') }] },
      { id: 'swap', anim: 'wipers.hook', title: V('Vyměňte lištu', 'Change the blade'), body: V('Nejběžnější je **háčkový (J) adaptér**: stiskněte pojistku, posuňte lištu směrem k ose ramena a vyvlékněte ji z háčku. Novou nasaďte opačně, dokud nezacvakne. Jiné typy (pin, boční uchycení, „top lock“) mají adaptér v balení.', 'The most common is the **J-hook adapter**: press the release tab, slide the blade towards the arm pivot and unhook it. Fit the new one the opposite way until it clicks. Other types (pin, side lock, "top lock") come with an adapter in the box.'), notes: [{ level: 'warning', text: V('Po nasazení za lištu zatáhněte – nesmí vyklouznout. Uvolněná lišta za jízdy poškrábe sklo.', 'After fitting, tug the blade – it must not slip out. A loose blade scratches the glass while driving.') }] },
      { id: 'lower', anim: 'wipers.lower', title: V('Spusťte ramena zpět', 'Lower the arms'), body: V('Rameno spouštějte rukou až ke sklu. Pak zapněte zapalování a jedním setřením vraťte stěrače do klidové polohy.', 'Lower each arm by hand until it touches the glass. Then switch on the ignition and return the wipers to the park position with one wipe.') },
      { id: 'fluid', anim: 'wipers.fluid', title: V('Doplňte kapalinu do ostřikovačů', 'Top up the washer fluid'), body: V('Víčko s **symbolem ostřikovače** bývá v motorovém prostoru. Doplňte kapalinu vhodnou pro roční období (v zimě −20 °C a méně).', 'The cap with the **washer symbol** is usually in the engine bay. Top up with fluid suited to the season (in winter rated −20 °C or lower).'), notes: [{ level: 'danger', text: V('Nezaměňte víčko s chladicí nebo brzdovou kapalinou – následky jsou drahé až nebezpečné.', 'Do not confuse the cap with the coolant or brake fluid – the consequences are expensive or even dangerous.') }, { level: 'warning', text: V('V zimě nikdy čistou vodu – zamrzne a roztrhne nádržku, čerpadlo i hadičky.', 'Never plain water in winter – it freezes and splits the reservoir, pump and hoses.') }] },
      { id: 'nozzle', anim: 'wipers.nozzle', title: V('Seřiďte trysky', 'Adjust the nozzles'), body: V('Kulové trysky se natáčejí jehlou zasunutou do otvoru. Paprsek má mířit do horní třetiny stíraného pole. Ploché (vějířové) trysky bývají pevné. Ucpanou trysku pročistěte jehlou opatrně.', 'Ball nozzles are aimed with a needle pushed into the opening. The jet should hit the upper third of the wiped area. Flat (fan) nozzles are usually fixed. Clear a blocked nozzle gently with a needle.'), notes: [{ level: 'caution', text: V('Jehlu nezasouvejte hluboko a nepáčte – trysku snadno zničíte.', 'Do not push the needle deep or lever it – the nozzle breaks easily.') }] },
      { id: 'test', anim: 'wipers.test', title: V('Vyzkoušejte', 'Test'), body: V('Zapněte ostřikovače a všechny rychlosti stěračů. Lišty musí stírat čistě a tiše.', 'Run the washers and all wiper speeds. The blades must wipe cleanly and quietly.'), notes: [{ level: 'warning', text: V('Nestírejte suché ani zamrzlé sklo – zničíte nové lišty i motorek stěračů.', 'Do not wipe a dry or frozen windscreen – it ruins the new blades and the wiper motor.') }] }
    ],
    vehicles: {
      'mb-cl500-c216': {
        status: 'ok',
        specs: [{ label: V('Servisní poloha', 'Service position'), value: V('dle příručky Mercedes', 'per Mercedes manual'), verify: true }, { label: V('Lišty', 'Blades'), value: V('dle katalogu (typ uchycení ověřit)', 'per catalogue (check mounting type)'), verify: true }],
        notes: [{ level: 'info', text: V('Vůz může mít vyhřívané trysky a dešťový senzor – před prací stěrače vypněte.', 'The car may have heated nozzles and a rain sensor – switch the wipers off before working.'), verify: true }],
        steps: { service: { body: SERVICE_TXT('mb') } }
      },
      'volvo-xc60-b4': {
        status: 'ok',
        specs: [{ label: V('Servisní poloha', 'Service position'), value: V('centrální displej – nastavení stěračů', 'centre display – wiper settings'), verify: true }, { label: V('Ostřikovače', 'Washers'), value: V('mohou být v ramenech stěračů (ověřit)', 'may be integrated in the wiper arms (verify)'), verify: true }],
        notes: [{ level: 'warning', text: V('Ramena v klidové poloze jsou pod kapotou – bez servisní polohy je nezvedejte.', 'The arms park under the bonnet – do not lift them without the service position.') }],
        steps: { service: { body: SERVICE_TXT('volvo') }, nozzle: { notes: [{ level: 'info', text: V('Pokud má vůz trysky v lištách/ramenech, seřízení jehlou neplatí – kontrolujte jen průchodnost.', 'If the washers are in the blades/arms, needle adjustment does not apply – only check they are clear.'), verify: true }] } }
      },
      'skoda-octavia-rs-tdi': {
        status: 'ok',
        specs: [{ label: V('Servisní poloha', 'Service position'), value: V('vypnout zapalování, do 10 s páčku stěračů dolů', 'ignition off, within 10 s push the wiper stalk down'), verify: true }],
        steps: { service: { body: SERVICE_TXT('octavia') } }
      },
      'toyota-gr-yaris': {
        status: 'ok',
        specs: [{ label: V('Lišty', 'Blades'), value: V('vpředu 2 + vzadu 1 (ověřit délky v katalogu)', 'front 2 + rear 1 (check lengths in the catalogue)'), verify: true }],
        notes: [{ level: 'info', text: V('Ramena se obvykle zvedají přímo – ověřte v příručce.', 'The arms usually lift directly – verify in the manual.'), verify: true }]
      },
      'citroen-jumper-22hdi': {
        status: 'ok',
        specs: [{ label: V('Lišty', 'Blades'), value: V('dvě dlouhé lišty, typ uchycení ověřit', 'two long blades, check mounting type'), verify: true }, { label: V('Nádržka ostřikovačů', 'Washer reservoir'), value: V('v motorovém prostoru (ověřit)', 'in the engine bay (verify)'), verify: true }],
        notes: [{ level: 'warning', text: V('Vysoké čelní sklo: na ramena nedosáhnete ze země bezpečně – použijte stabilní stupínek, ne nárazník ani kolo.', 'Tall windscreen: you cannot reach the arms safely from the ground – use a stable step, not the bumper or wheel.') }]
      }
    }
  });

  function SERVICE_TXT(car) {
    if (car === 'volvo') return V('XC60: servisní polohu aktivujte v centrálním displeji (nastavení stěračů) při zapnutém zapalování – přesnou cestu ověřte v příručce. Ramena se posunou nahoru a pak je lze zvednout.', 'XC60: activate the service position in the centre display (wiper settings) with the ignition on – verify the exact path in the manual. The arms move up and can then be lifted.');
    if (car === 'octavia') return V('Octavia II: zapněte a vypněte zapalování, pak do 10 s krátce stiskněte páčku stěračů dolů – ramena se zastaví v servisní poloze (ověřit). Zpět je vrátíte zapnutím stěračů.', 'Octavia II: switch the ignition on and off, then within 10 s briefly push the wiper stalk down – the arms stop in the service position (verify). Switching the wipers on returns them.');
    return V('Postup servisní polohy ověřte v uživatelské příručce Mercedes.', 'Verify the service position procedure in the Mercedes owner\'s manual.');
  }
})(window.STU);
