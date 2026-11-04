/* Tutorial: Fuses & relays. */
(function (S) {
  'use strict';
  var V = function (cs, en) { return { cs: cs, en: en }; };

  S.registerTutorial({
    id: 'fuses',
    level: 1,
    thumb: 'fuses.overview',
    time: V('10–30 min', '10–30 min'),
    title: V('Pojistky a relé: najít a vyměnit', 'Fuses & relays: find and replace'),
    summary: V('Kde jsou pojistkové skříně, jak číst schéma, jak pojistku otestovat a proč nikdy nedávat silnější.', 'Where the fuse boxes are, how to read the diagram, how to test a fuse and why never to fit a bigger one.'),
    intro: V(
      'Přestala fungovat zásuvka, stěrače nebo jedno světlo? Často je to jen **přepálená pojistka**. Výměna trvá minutu – ale **pojistka, která se pálí znovu, varuje před zkratem**, který může způsobit požár.',
      'The power socket, wipers or one light stopped working? Often it is just a **blown fuse**. Replacing it takes a minute – but **a fuse that keeps blowing warns of a short circuit** that can cause a fire.'
    ),
    safety: [
      { level: 'danger', text: V('**Nikdy nedávejte silnější pojistku, drát ani alobal.** Pojistka chrání kabel – bez ní se kabel přehřeje a začne hořet.', '**Never fit a bigger fuse, a wire or foil.** The fuse protects the wire – without it the wire overheats and catches fire.') },
      { level: 'warning', text: V('Před výměnou vypněte zapalování a příslušný spotřebič.', 'Switch off the ignition and the consumer before replacing a fuse.') },
      { level: 'warning', text: V('Velké hlavní pojistky (desítky až stovky A) u baterie jsou pod stálým napětím – před manipulací odpojte baterii.', 'Large main fuses (tens to hundreds of A) near the battery are always live – disconnect the battery before touching them.') },
      { level: 'caution', text: V('Pojistky pro airbag, ABS a řízení neřešte pokusem – pokud se pálí, vůz nechte zkontrolovat.', 'Do not trial-and-error fuses for airbags, ABS or steering – if they blow, have the car checked.') }
    ],
    tools: [V('Vytahovák pojistek (bývá ve víku skříně)', 'Fuse puller (usually in the box lid)'), V('Zkoušečka 12 V nebo multimetr', '12 V test light or multimeter'), V('Svítilna', 'Torch'), V('Uživatelská příručka (schéma pojistek)', 'Owner\'s manual (fuse diagram)')],
    parts: [V('Sada pojistek (mini / standard / micro dle vozu)', 'Fuse kit (mini / standard / micro depending on the car)'), V('Případně relé se stejným číslem', 'If needed a relay with the same part number')],
    finalChecks: [
      V('Nová pojistka má STEJNÝ proud (barvu)', 'The new fuse has the SAME rating (colour)'),
      V('Funkce ověřena', 'Function tested'),
      V('Víka skříní dosedají, žádná volná pojistka v autě', 'Box lids seated, no loose fuse left in the car'),
      V('Pokud se pojistka pálí znovu: zkrat – nechat zkontrolovat', 'If the fuse blows again: short circuit – have it checked')
    ],
    steps: [
      { id: 'symptom', anim: 'fuses.overview', title: V('Kdy hledat pojistku', 'When to look for a fuse'),
        body: V('Typicky když **přestane fungovat jedna funkce úplně** (zásuvka, stěrače, světla brzd, rádio). Když funguje „napůl“ nebo občas, příčina bývá spíš v konektoru, kabelu nebo spínači.', 'Typically when **one function stops completely** (socket, wipers, brake lights, radio). If it works "halfway" or intermittently, the cause is more likely a connector, wire or switch.') },
      { id: 'locate', anim: 'fuses.locate', title: V('Najděte pojistkové skříně', 'Find the fuse boxes'),
        body: V('Většina aut má **víc skříní**: v interiéru (bok palubní desky, pod volantem, u přihrádky), v motorovém prostoru a někdy v kufru. Přesná místa jsou v uživatelské příručce.', 'Most cars have **several boxes**: in the cabin (dashboard side, under the steering wheel, by the glovebox), in the engine bay and sometimes in the boot. Exact locations are in the owner\'s manual.') },
      { id: 'diagram', anim: 'fuses.diagram', title: V('Přečtěte schéma', 'Read the diagram'),
        body: V('Na víku nebo v příručce najdete tabulku: **číslo pozice – proud (A) – funkce**. Najděte pojistku pro nefunkční spotřebič.', 'On the lid or in the manual there is a table: **slot number – current (A) – function**. Find the fuse for the dead consumer.'),
        notes: [{ level: 'tip', text: V('Vyfoťte si skříň před zásahem – víte, kde co bylo.', 'Photograph the box before you start – you will know what went where.') }] },
      { id: 'pull', anim: 'fuses.pull', title: V('Vytáhněte pojistku', 'Pull the fuse'),
        body: V('Zapalování a spotřebič vypněte. Vytahovákem chyťte pojistku a vytáhněte ji **rovně nahoru**. Nepáčte šroubovákem – poškodíte kontakty.', 'Switch off the ignition and the consumer. Grip the fuse with the puller and pull it **straight up**. Do not lever with a screwdriver – you will damage the contacts.') },
      { id: 'inspect', anim: 'fuses.inspect', title: V('Prohlédněte ji', 'Inspect it'),
        body: V('Podívejte se proti světlu: **přerušený nebo začernalý drátek = přepálená**. Některé přepálené pojistky ale vypadají celé – proto je lepší je změřit.', 'Look against the light: **a broken or blackened link = blown**. Some blown fuses look intact though – so it is better to test them.') },
      { id: 'test', anim: 'fuses.test', title: V('Otestujte bez vytahování', 'Test without pulling'),
        body: V('Zkoušečka: krokosvorku na kostru, zapalování/spotřebič zapnout, hrotem se dotkněte **obou testovacích bodů** na vrchu pojistky. Svítí na obou stranách = pojistka OK. Jen na jedné = přepálená.', 'Test light: clip to ground, switch the ignition/consumer on, touch **both test points** on top of the fuse. Lights on both sides = fuse OK. Only one side = blown.'),
        notes: [{ level: 'caution', text: V('Na obvody airbagů nikdy neměřte zkoušečkou ani multimetrem.', 'Never probe airbag circuits with a test light or multimeter.') }] },
      { id: 'replace', anim: 'fuses.colors', title: V('Vložte novou se stejným proudem', 'Fit a new one with the same rating'),
        body: V('Nová pojistka musí mít **stejný proud (A) a stejný typ** (mini, standard, micro). Barva odpovídá proudu: 5 A béžová, 7,5 A hnědá, 10 A červená, 15 A modrá, 20 A žlutá, 25 A bílá, 30 A zelená.', 'The new fuse must have **the same rating (A) and type** (mini, standard, micro). The colour matches the rating: 5 A tan, 7.5 A brown, 10 A red, 15 A blue, 20 A yellow, 25 A white, 30 A green.'),
        notes: [{ level: 'danger', text: V('Silnější pojistka = kabel se přehřeje dřív, než pojistka shoří. Riziko požáru.', 'A bigger fuse = the wire overheats before the fuse blows. Fire risk.') }] },
      { id: 'blowAgain', anim: 'fuses.blow', title: V('Pálí se znovu? Hledejte příčinu', 'Blows again? Find the cause'),
        body: V('Okamžité přepálení = **zkrat** (prodřený kabel, voda v konektoru, vadný spotřebič). Přepálení po čase = přetížení (zadřený motorek stěračů, ventilátor). Spotřebič odpojte a hledejte závadu – nebo vůz nechte zkontrolovat.', 'Instant blow = **short circuit** (chafed wire, water in a connector, faulty device). Blowing after a while = overload (seized wiper motor, blower). Disconnect the consumer and look for the fault – or have the car checked.') },
      { id: 'relay', anim: 'fuses.relay', title: V('Test relé záměnou', 'Relay swap test'),
        body: V('Pokud je pojistka v pořádku, ale funkce nejde, může být vadné relé. Zaměňte ho se **stejným relé (stejné číslo)** jiné funkce (např. houkačka). Přestěhuje se závada? Relé je vadné.', 'If the fuse is fine but the function does not work, the relay may be faulty. Swap it with **an identical relay (same part number)** from another function (e.g. horn). Does the fault move? The relay is faulty.') },
      { id: 'check', anim: 'fuses.check', title: V('Ověřte a zavřete', 'Test and close'),
        body: V('Zapněte spotřebič a ověřte funkci. Zavřete víko skříně – musí dosednout, chrání kontakty před vlhkostí. Náhradní pojistky mějte v autě.', 'Switch the consumer on and check it works. Close the box lid – it must seat properly to keep moisture off the contacts. Keep spare fuses in the car.') }
    ],
    vehicles: {
      'mb-cl500-c216': {
        status: 'ok',
        specs: [{ label: V('Skříně', 'Boxes'), value: V('přední SAM (motorový prostor), zadní SAM (kufr), bok palubní desky – dle příručky', 'front SAM (engine bay), rear SAM (boot), dashboard side – per manual'), verify: true }],
        notes: [{ level: 'info', text: V('Mercedes používá moduly SAM s pojistkami a relé; tabulka je často v kufru nebo v příručce.', 'Mercedes uses SAM modules with fuses and relays; the chart is often in the boot or the manual.'), verify: true }]
      },
      'volvo-xc60-b4': {
        status: 'ok',
        specs: [{ label: V('Skříně', 'Boxes'), value: V('motorový prostor, pod přihrádkou, kufr – dle příručky', 'engine bay, under the glovebox, boot – per manual'), verify: true }],
        notes: [{ level: 'warning', text: V('Pojistky a díly 48V systému neotevírejte – pracujte jen ve 12V skříních.', 'Do not open fuses or parts of the 48 V system – work only in the 12 V boxes.') }]
      },
      'skoda-octavia-rs-tdi': {
        status: 'ok',
        specs: [{ label: V('Skříně', 'Boxes'), value: V('bok palubní desky vlevo (pod krytem), motorový prostor / na baterii', 'left end of the dashboard (under a cover), engine bay / on the battery'), verify: true }],
        notes: [{ level: 'info', text: V('Pojistky na + pólu baterie jsou silové – před manipulací odpojte baterii.', 'The fuses on the battery + post are high-current – disconnect the battery before touching them.') }]
      },
      'toyota-gr-yaris': {
        status: 'ok',
        specs: [{ label: V('Skříně', 'Boxes'), value: V('motorový prostor a pod palubní deskou u řidiče – dle příručky', 'engine bay and under the dash on the driver side – per manual'), verify: true }]
      },
      'citroen-jumper-22hdi': {
        status: 'ok',
        specs: [{ label: V('Skříně', 'Boxes'), value: V('pod palubní deskou u řidiče a v motorovém prostoru u baterie – dle příručky', 'under the dash on the driver side and in the engine bay near the battery – per manual'), verify: true }],
        notes: [{ level: 'info', text: V('Přestavby (zásuvky, osvětlení nákladového prostoru, tažné zařízení) mívají vlastní pojistky – hledejte je u spotřebiče.', 'Conversions (sockets, cargo lighting, towbar) often have their own fuses – look near the device.') }]
      }
    }
  });
})(window.STU);
