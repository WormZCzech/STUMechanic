/* Tutorial: Volvo XC60 air suspension – XC60 only. */
(function (S) {
  'use strict';
  var V = function (cs, en) { return { cs: cs, en: en }; };

  S.registerTutorial({
    id: 'air-suspension',
    level: 2,
    only: ['volvo-xc60-b4'],
    status: 'caution',
    thumb: 'airsus.overview',
    time: V('1–3 h (diagnostika a kontrola)', '1–3 h (diagnosis and inspection)'),
    title: V('Vzduchový podvozek: kontrola, netěsnosti, kalibrace', 'Air suspension: inspection, leaks, calibration'),
    summary: V('Volvo XC60 se vzduchovým odpružením: jak funguje, režim zvedání, hledání úniků, kompresor, odtlakování a kalibrace výšky.', 'Volvo XC60 air suspension: how it works, jacking mode, leak finding, compressor, depressurising and height calibration.'),
    intro: V(
      'Váš XC60 má **vzduchové odpružení na všech čtyřech kolech**: kompresor plní přes ventilový blok vzduchové měchy, snímače výšky hlídají každý roh a řídicí jednotka mění výšku podle rychlosti, zatížení a režimu.\n\nNejčastější závadou je **netěsný měch nebo spojka vedení** – vůz pak přes noc klesne a kompresor běží dlouho. Hledání úniku a kontrolu zvládnete sami, kalibrace potřebuje VIDA.',
      'Your XC60 has **air suspension on all four corners**: a compressor fills the air springs through a valve block, height sensors watch each corner and the control unit adjusts the height for speed, load and drive mode.\n\nThe most common fault is a **leaking air spring or line connector** – the car then sinks overnight and the compressor runs long. You can find the leak and inspect yourself; calibration needs VIDA.'
    ),
    safety: [
      { level: 'danger', text: V('**Před zvednutím** vypněte automatickou regulaci výšky / zapněte režim zvedání (cestu v menu ověřte v příručce). Jinak se vůz na stojanech může sám zvednout nebo spustit.', '**Before lifting** switch off automatic level control / enable jacking mode (verify the menu path in the manual). Otherwise the car can raise or lower itself on the stands.'), verify: true },
      { level: 'danger', text: V('Měchy a vedení jsou pod tlakem (cca 10+ bar). Nic neodpojujte bez odtlakování dle VIDA – spojka může vystřelit, měch prasknout.', 'Springs and lines are pressurised (approx. 10+ bar). Disconnect nothing without depressurising per VIDA – a connector can blow out, a spring can burst.'), verify: true },
      { level: 'warning', text: V('Nikdy nepracujte pod vozem, který stojí jen na vzduchových měších nebo heveru – vždy stojany.', 'Never work under a car resting only on its air springs or a jack – always stands.') },
      { level: 'warning', text: V('Prasklý měch / vůz na dorazech: nejezděte – odtah. Jízda poškodí pneumatiky, karoserii a řízení.', 'Burst spring / car on its bump stops: do not drive – tow. Driving damages tyres, body and steering.') },
      { level: 'caution', text: V('Ochranné brýle při práci se stlačeným vzduchem. 48V a 12V systém se tu neodpojuje, ale nezkratujte nic nářadím.', 'Safety glasses when working with compressed air. The 48 V and 12 V systems are not disconnected here, but do not short anything with tools.') }
    ],
    tools: [
      V('Diagnostika VIDA nebo kompatibilní tester s funkcemi podvozku', 'VIDA or a compatible scan tool with suspension functions'),
      V('Rozprašovač s vodou a saponátem', 'Spray bottle with soapy water'),
      V('Baterka, zrcátko, fix na označení místa', 'Torch, mirror, marker to mark the spot'),
      V('Hever a stojany (min. 2,5 t)', 'Jack and stands (at least 2.5 t)'),
      V('Svinovací metr', 'Tape measure'),
      V('Ochranné brýle, rukavice', 'Safety glasses, gloves')
    ],
    parts: [
      V('Vzduchový měch / vzpěra – jen podle VIN (dle nálezu)', 'Air spring / strut – by VIN only (as found)'),
      V('Spojky vedení, O-kroužky (dle nálezu)', 'Line connectors, O-rings (as found)'),
      V('Pojistka / relé kompresoru (dle diagnózy)', 'Compressor fuse / relay (as diagnosed)')
    ],
    finalChecks: [
      V('Regulace výšky znovu zapnutá', 'Level control switched back on'),
      V('Vůz po noci stojí ve stejné výšce na všech rozích', 'Car is at the same height on all corners after a night'),
      V('Kompresor po nastartování doplní a vypne se v rozumném čase', 'Compressor tops up after start and switches off within a reasonable time'),
      V('Žádné hlášení podvozku na displeji', 'No suspension message on the display'),
      V('Při výměně snímače / měchu provedena kalibrace výšky', 'Height calibration done after a sensor / spring replacement')
    ],
    steps: [
      {
        id: 'how', anim: 'airsus.overview',
        title: V('Jak vzduchový podvozek funguje', 'How the air suspension works'),
        body: V(
          '- **Kompresor** (obvykle vpředu pod vozem – ověřit) stlačuje vzduch.\n- **Ventilový blok** rozděluje vzduch do jednotlivých měchů.\n- **Vzduchové měchy** s tlumiči nesou vůz místo ocelových pružin.\n- **Snímače výšky** u každého kola hlásí polohu.\n- Řídicí jednotka mění výšku (jízda, nakládání, rychlost).',
          '- The **compressor** (usually at the front under the car – verify) compresses air.\n- The **valve block** distributes air to each spring.\n- **Air springs** with dampers carry the car instead of steel springs.\n- **Height sensors** at each wheel report the position.\n- The control unit adjusts the height (driving, loading, speed).'
        ),
        notes: [{ level: 'info', text: V('Přesné umístění kompresoru, ventilového bloku a případného zásobníku ověřte ve VIDA pro váš VIN.', 'Verify the exact location of the compressor, valve block and any reservoir in VIDA for your VIN.'), verify: true }]
      },
      {
        id: 'symptoms', anim: 'airsus.sag',
        title: V('Příznaky poruchy', 'Fault symptoms'),
        body: V(
          '- Vůz **přes noc klesne** (často jeden roh).\n- Kompresor běží **dlouho nebo často**, případně je slyšet z podvozku.\n- **Hlášení podvozku** na displeji.\n- Vůz stojí **nakřivo** nebo se nezvedá do terénního režimu.',
          '- The car **sinks overnight** (often one corner).\n- The compressor runs **long or often**, or can be heard under the car.\n- A **suspension message** on the display.\n- The car sits **unevenly** or will not rise to off-road height.'
        ),
        notes: [{ level: 'tip', text: V('Změřte večer a ráno výšku každého rohu (střed kola → lem blatníku) a zapište si ji – hned uvidíte, který roh uniká.', 'Measure each corner\'s height (wheel centre → arch lip) in the evening and the morning and write it down – you will see at once which corner leaks.') }]
      },
      {
        id: 'jackmode', anim: 'airsus.jackMode',
        title: V('Režim zvedání – vypnout regulaci výšky', 'Jacking mode – switch off level control'),
        body: V(
          'Na centrálním displeji v nastavení vozu/podvozku vypněte automatickou regulaci výšky nebo zapněte režim zvedání (přesný název a cestu v menu ověřte v uživatelské příručce). Teprve pak vůz zvedejte.',
          'On the centre display, in the car / suspension settings, switch off automatic level control or enable jacking mode (verify the exact name and menu path in the owner\'s manual). Only then lift the car.'
        ),
        notes: [{ level: 'danger', text: V('Bez režimu zvedání se systém snaží vyrovnat výšku – vůz se může na stojanech pohnout.', 'Without jacking mode the system tries to correct the height – the car can move on the stands.'), verify: true }]
      },
      {
        id: 'lift', anim: 'airsus.lift',
        title: V('Bezpečné zvednutí', 'Lifting safely'),
        body: V(
          'Postupujte podle návodu **Bezpečné zvednutí vozu**: zvedací body, stojany, test stability. Hever nikdy nepokládejte pod měch, rameno ani vedení.',
          'Follow the **Safely lifting the car** tutorial: jacking points, stands, stability test. Never put the jack under an air spring, arm or line.'
        ),
        notes: [{ level: 'warning', text: V('Při zvednutém kole může měch povolit a ohnout se – nezapínejte regulaci, dokud jsou kola ve vzduchu.', 'With a wheel in the air the spring may unload and fold – do not switch level control on while the wheels are off the ground.') }]
      },
      {
        id: 'inspect', anim: 'airsus.spring',
        title: V('Prohlídka měchů a vedení', 'Inspecting springs and lines'),
        body: V(
          'Prohlédněte baterkou každý měch: **praskliny v ohybu**, odřeniny, zdeformovaný tvar. Zkontrolujte spojky vedení, upevnění vedení a jejich odření o karoserii.',
          'Inspect each spring with a torch: **cracks in the fold**, chafing, deformed shape. Check the line connectors, line clips and chafing against the body.'
        ),
        notes: [{ level: 'caution', text: V('Prasklý měch měňte vždy – „lepení“ ani spreje nejsou trvalá oprava.', 'Always replace a cracked spring – glue or sprays are not a lasting repair.') }]
      },
      {
        id: 'leak', anim: 'airsus.leak',
        title: V('Hledání úniku saponátem', 'Finding the leak with soapy water'),
        body: V(
          'Při natlakovaném systému nastříkejte vodu se saponátem na měch (hlavně ohyb a horní/dolní uchycení), spojky vedení a ventilový blok. **Rostoucí bubliny** = únik. Místo si označte fixou.',
          'With the system pressurised, spray soapy water on the spring (especially the fold and upper / lower mounts), the line connectors and the valve block. **Growing bubbles** = a leak. Mark the spot.'
        ),
        notes: [
          { level: 'tip', text: V('Malý únik ukáže až pěna po několika minutách – buďte trpěliví.', 'A small leak only shows as foam after a few minutes – be patient.') },
          { level: 'caution', text: V('Saponát poté opláchněte vodou – nesmí zůstat na pryži a v konektorech.', 'Rinse the soap off afterwards – it must not stay on rubber and in connectors.') }
        ]
      },
      {
        id: 'compressor', anim: 'airsus.compressor',
        title: V('Kompresor, pojistka a relé', 'Compressor, fuse and relay'),
        body: V(
          'Kompresor, který běží dlouho, se přehřeje a **tepelná ochrana ho vypne** – to je příznak úniku, ne vadného kompresoru. Když neběží vůbec: zkontrolujte pojistku a relé kompresoru (umístění dle VIDA) a chybové kódy.',
          'A compressor that runs long overheats and **thermal protection switches it off** – that is a symptom of a leak, not a bad compressor. If it does not run at all: check the compressor fuse and relay (location per VIDA) and the fault codes.'
        ),
        notes: [
          { level: 'warning', text: V('Nový kompresor bez opravy úniku brzy znovu odejde.', 'A new compressor without fixing the leak will soon fail again.') },
          { level: 'info', text: V('Pojistky měňte jen za stejnou hodnotu.', 'Replace fuses only with the same rating.') }
        ]
      },
      {
        id: 'depressurise', anim: 'airsus.depressurise',
        title: V('Odtlakování před rozpojením', 'Depressurising before disconnecting'),
        body: V(
          'Před odpojením vedení nebo výměnou měchu vypusťte z daného okruhu vzduch postupem ve VIDA (ověřit). Vůz musí stát na stojanech, kolo pod daným rohem odlehčené dle postupu.',
          'Before disconnecting a line or replacing a spring, release the air from that circuit using the VIDA procedure (verify). The car must be on stands, the wheel at that corner unloaded as per the procedure.'
        ),
        notes: [{ level: 'danger', text: V('Spojku pod tlakem nikdy nerozpojujte – může vystřelit do obličeje.', 'Never release a connector under pressure – it can shoot into your face.') }]
      },
      {
        id: 'replace', anim: 'airsus.replace',
        title: V('Výměna měchu (přehled)', 'Replacing an air spring (overview)'),
        body: V(
          'Postup se liší podle provedení (samostatný měch nebo celá vzpěra – ověřit ve VIDA): odtlakovat, odpojit vedení, uvolnit spony/matice, vyjmout měch, nový usadit, připojit vedení, **plnit až po správném zatížení / usazení** dle VIDA.',
          'The procedure depends on the design (separate spring or complete strut – verify in VIDA): depressurise, disconnect the line, release the clips / nuts, remove the spring, seat the new one, reconnect the line, **inflate only once correctly loaded / seated** per VIDA.'
        ),
        notes: [
          { level: 'warning', text: V('Měch plněný bez vedení / v nesprávné poloze se může přeložit a prasknout.', 'A spring inflated without guidance / in the wrong position can fold and burst.') },
          { level: 'info', text: V('Utahovací momenty a postup ze VIDA – nehádáme.', 'Torques and procedure from VIDA – we do not guess.'), verify: true }
        ]
      },
      {
        id: 'calibrate', anim: 'airsus.calibrate',
        title: V('Kalibrace výšky (VIDA)', 'Height calibration (VIDA)'),
        body: V(
          'Po výměně snímače výšky, měchu nebo řídicí jednotky se výška kalibruje ve VIDA: změříte výšky na kolech a zadáte je (ověřit postup).',
          'After replacing a height sensor, spring or control unit, the height is calibrated in VIDA: measure the heights at the wheels and enter them (verify procedure).'
        ),
        notes: [{ level: 'info', text: V('Rovná plocha, správné tlaky pneumatik, prázdný vůz.', 'Level ground, correct tyre pressures, empty car.') }]
      },
      {
        id: 'test', anim: 'airsus.limp',
        title: V('Zkouška a nouzová jízda', 'Test and limp mode'),
        body: V(
          'Zapněte regulaci výšky, nastartujte, nechte kompresor doplnit. Projeďte se a druhý den ráno změřte výšky. Při hlášení poruchy jezděte pomalu a jen do servisu.',
          'Switch level control on, start the engine, let the compressor top up. Take a drive and measure the heights the next morning. With a fault message drive slowly and only to a workshop.'
        ),
        notes: [{ level: 'danger', text: V('Vůz na dorazech / prasklý měch: nejezdit, volat odtah.', 'Car on its bump stops / burst spring: do not drive, call a tow.') }]
      }
    ]
  });
})(window.STU);
