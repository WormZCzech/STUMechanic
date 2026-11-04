/* Tutorial: Volvo XC60 B4 – 48 V mild hybrid system: what it is, warning signs, safe disconnection. */
(function (S) {
  'use strict';
  var V = function (cs, en) { return { cs: cs, en: en }; };

  S.registerTutorial({
    id: 'mhev-48v',
    level: 2,
    only: ['volvo-xc60-b4'],
    status: 'caution',
    thumb: 'mhev-48v.overview',
    time: V('30–60 min (bez opravy)', '30–60 min (without repair)'),
    title: V('48V mild hybrid: systém a bezpečné odpojení', '48 V mild hybrid: the system and safe disconnection'),
    summary: V('Co je ISGM, 48V baterie a DC/DC měnič, jaké jsou varovné příznaky a jak systém bezpečně odpojit podle VIDA.', 'What the ISGM, 48 V battery and DC/DC converter are, the warning signs and how to disconnect the system safely per VIDA.'),
    intro: V(
      'Váš XC60 B4 má vedle běžné 12V sítě **48V mild-hybridní systém**: startér-generátor na řemenu (ISGM), 48V lithiovou baterii a DC/DC měnič. Pomáhá motoru, rekuperuje a zajišťuje plynulý start-stop.\n\n48 V je **pod hranicí vysokého napětí (60 V DC)**, ale baterie dodá při zkratu stovky ampér. Tento návod vysvětluje systém a obecný postup bezpečného odpojení – **přesné pořadí, díly a časy vždy podle VIDA pro váš VIN**.',
      'Next to the normal 12 V network your XC60 B4 has a **48 V mild hybrid system**: a belt-driven starter-generator (ISGM), a 48 V lithium battery and a DC/DC converter. It assists the engine, recuperates energy and gives smooth start-stop.\n\n48 V is **below the high-voltage threshold (60 V DC)**, but the battery can deliver hundreds of amps in a short. This tutorial explains the system and the general safe-disconnection approach – **exact order, parts and times always per VIDA for your VIN**.'
    ),
    safety: [
      { level: 'danger', text: V('**Zkrat 48V baterie** = elektrický oblouk, roztavené nářadí, popáleniny a požár. Žádné kovové předměty na rukou, izolované nářadí.', '**A 48 V battery short** = electric arc, molten tools, burns and fire. No metal on your hands, insulated tools.') },
      { level: 'danger', text: V('48V baterii (Li-ion), ISGM ani DC/DC měnič **neotevírejte**. Poškozená nebo přehřátá Li-ion baterie může hořet a uvolňovat jedovaté plyny.', 'Do **not open** the 48 V battery (Li-ion), the ISGM or the DC/DC converter. A damaged or overheated Li-ion battery can burn and release toxic gases.') },
      { level: 'warning', text: V('Pracujte podle **VIDA** a své kvalifikace. Návod nic neblokuje – ale postup dílny je závazný.', 'Work per **VIDA** and your qualification. Nothing here is locked – but the workshop procedure is binding.') },
      { level: 'warning', text: V('Beznapěťový stav vždy **ověřte měřením** (živý – mrtvý – živý) měřákem s odpovídající kategorií.', 'Always **prove dead by measuring** (live – dead – live) with a suitably rated meter.') },
      { level: 'info', text: V('Barvy kabelů, umístění dílů a postupy se liší podle modelového roku – v návodu jsou schematicky.', 'Cable colours, component locations and procedures vary by model year – they are shown schematically here.') }
    ],
    tools: [V('VIDA nebo kompatibilní diagnostika', 'VIDA or a compatible scan tool'), V('Izolační rukavice (třída dle normy) + brýle', 'Insulating gloves (class per standard) + glasses'), V('Izolované nářadí', 'Insulated tools'), V('Multimetr CAT III s ověřovacím zdrojem', 'CAT III multimeter with a proving unit'), V('Izolační krytky, štítek „Nezapínat“ / zámek', 'Insulating caps, "Do not switch on" tag / lock')],
    parts: [V('Dle závady (pouze originální díly a postupy VIDA)', 'Depending on the fault (only original parts and VIDA procedures)')],
    finalChecks: [
      V('Všechny konektory zapojené a zajištěné', 'All connectors plugged in and locked'),
      V('Izolační krytky a štítky odstraněny', 'Insulating caps and tags removed'),
      V('VIDA: žádné chyby, kalibrace dokončena', 'VIDA: no faults, calibration completed'),
      V('Start-stop a rekuperace fungují, žádná hlášení na displeji', 'Start-stop and recuperation work, no messages on the display')
    ],
    steps: [
      { id: 'what', anim: 'mhev-48v.overview', title: V('Jak 48V systém funguje', 'How the 48 V system works'),
        body: V('- **ISGM** (startér-generátor) na řemenu motoru – startuje motor ve start-stopu, pomáhá při rozjezdu, rekuperuje\n- **48V Li-ion baterie** – ukládá energii\n- **DC/DC měnič** – napájí 12V síť (místo klasického alternátoru)\n- **12V baterie** – pro řídicí jednotky a příslušenství', '- **ISGM** (starter-generator) on the engine belt – restarts the engine in start-stop, assists pulling away, recuperates\n- **48 V Li-ion battery** – stores the energy\n- **DC/DC converter** – supplies the 12 V network (instead of a classic alternator)\n- **12 V battery** – for control units and accessories'),
        notes: [{ level: 'info', text: V('Umístění dílů na obrázku je schematické – ověřte ve VIDA.', 'The component locations in the picture are schematic – verify in VIDA.'), verify: true }] },
      { id: 'signs', anim: 'mhev-48v.signs', title: V('Varovné příznaky', 'Warning signs'),
        body: V('- hlášení „Hybridní systém / Elektrický systém – servis“\n- start-stop dlouhodobě nefunguje\n- 12V baterie se vybíjí (nefunguje DC/DC)\n- pískání nebo klepání u řemene (ISGM, napínák)\n- zápach spáleniny, teplo od baterie', '- message "Hybrid system / Electrical system – service"\n- start-stop permanently unavailable\n- the 12 V battery keeps going flat (DC/DC not working)\n- squealing or knocking at the belt (ISGM, tensioner)\n- burning smell, heat from the battery'),
        notes: [{ level: 'danger', text: V('Zápach spáleniny, kouř nebo horká baterie = zastavit, vypnout, opustit vůz a volat pomoc.', 'Burning smell, smoke or a hot battery = stop, switch off, leave the car and call for help.') }] },
      { id: 'zones', anim: 'mhev-48v.zones', title: V('Co smíte a co ne', 'What you may and may not do'),
        body: V('**DIY bez odpojování 48V:** 12V baterie (viz návod Autobaterie), vizuální kontrola řemene a kabelů, čtení chyb diagnostikou.\n\n**Jen s postupem VIDA a kvalifikací:** odpojení 48V, výměna ISGM, DC/DC nebo 48V baterie, práce na 48V kabelech.', '**DIY without disconnecting 48 V:** the 12 V battery (see the Battery tutorial), visual check of belt and cables, reading codes with a scan tool.\n\n**Only with the VIDA procedure and qualification:** disconnecting 48 V, replacing the ISGM, DC/DC or 48 V battery, work on 48 V cables.') },
      { id: 'ppe', anim: 'mhev-48v.ppe', title: V('Ochranné pomůcky a nářadí', 'Protective equipment and tools'),
        body: V('Izolační rukavice (zkontrolujte, že nejsou proražené), brýle, izolované nářadí, měřák s odpovídající kategorií a ověřovací zdroj. Sundejte prsteny, hodinky a řetízky. Připravte štítek „Nezapínat“.', 'Insulating gloves (check they are not punctured), glasses, insulated tools, a suitably rated meter and a proving unit. Remove rings, watches and chains. Prepare a "Do not switch on" tag.') },
      { id: 'sleep', anim: 'mhev-48v.sleep', title: V('Uspání vozu', 'Put the car to sleep'),
        body: V('Zapalování vypnout, klíč daleko od vozu (keyless), dveře zavřít. Počkejte, až řídicí jednotky usnou – **dobu určuje VIDA**. Jinak hrozí chybové kódy nebo jiskra při odpojování.', 'Ignition off, key far from the car (keyless), doors closed. Wait until the control units are asleep – **VIDA specifies the time**. Otherwise you risk fault codes or a spark when disconnecting.'),
        notes: [{ level: 'info', text: V('Přesnou dobu čekání ověřte ve VIDA.', 'Verify the exact waiting time in VIDA.'), verify: true }] },
      { id: 'disconnect', anim: 'mhev-48v.disconnect', title: V('Odpojení 12V a 48V podle VIDA', 'Disconnect 12 V and 48 V per VIDA'),
        body: V('Obecně: nejdřív **12V mínus**, pak **48V odpojení** předepsaným způsobem (servisní konektor / pojistka / svorka – podle VIDA). Odpojený konektor zajistěte proti náhodnému zapojení.', 'In general: first the **12 V minus**, then the **48 V disconnection** in the prescribed way (service connector / fuse / terminal – per VIDA). Secure the disconnected connector against accidental reconnection.'),
        notes: [{ level: 'warning', text: V('Pořadí a konkrétní díl odpojení se liší podle verze – OVĚŘIT ve VIDA. Neimprovizujte.', 'The order and the exact disconnection point vary by version – VERIFY in VIDA. Do not improvise.'), verify: true }] },
      { id: 'measure', anim: 'mhev-48v.measure', title: V('Ověřte beznapěťový stav', 'Prove dead'),
        body: V('1. Ověřte měřák na známém zdroji (např. 12V baterie).\n2. Změřte na předepsaných 48V bodech – musí být cca 0 V.\n3. Znovu ověřte měřák na známém zdroji.', '1. Prove the meter on a known source (e.g. the 12 V battery).\n2. Measure at the prescribed 48 V points – it must be approx. 0 V.\n3. Prove the meter on the known source again.'),
        notes: [{ level: 'danger', text: V('Neukazuje měřák 0 V? STOP – systém není odpojený.', 'Meter not reading 0 V? STOP – the system is not disconnected.') }] },
      { id: 'cover', anim: 'mhev-48v.cover', title: V('Zaizolovat a označit', 'Insulate and tag'),
        body: V('Odkryté svorky zakryjte izolačními krytkami, na místo odpojení dejte štítek „Nezapínat – pracuje se“. Teprve pak začněte s prací.', 'Cover exposed terminals with insulating caps and put a "Do not switch on – work in progress" tag at the disconnection point. Only then start work.') },
      { id: 'reconnect', anim: 'mhev-48v.reconnect', title: V('Zapojení a kalibrace', 'Reconnect and calibrate'),
        body: V('Zapojte v opačném pořadí podle VIDA (48V, pak 12V), odstraňte krytky a štítky. Ve VIDA vymažte chyby a proveďte předepsané kalibrace. Zkontrolujte start-stop a hlášení na displeji.', 'Reconnect in reverse order per VIDA (48 V, then 12 V), remove caps and tags. In VIDA clear faults and run the prescribed calibrations. Check start-stop and the display messages.') }
    ],
    vehicles: {
      'volvo-xc60-b4': {
        status: 'caution',
        specs: [
          { label: V('Systém', 'System'), value: V('48V mild hybrid (ISGM, 48V Li-ion, DC/DC)', '48 V mild hybrid (ISGM, 48 V Li-ion, DC/DC)') },
          { label: V('Umístění 48V baterie', '48 V battery location'), value: V('dle VIDA', 'per VIDA'), verify: true },
          { label: V('Postup odpojení', 'Disconnection procedure'), value: V('dle VIDA pro váš VIN', 'per VIDA for your VIN'), verify: true }
        ],
        notes: [
          { level: 'info', text: V('Jste certifikovaný pro VN – návod nic neblokuje. Varování jsou zde pro úplnost a pro další čtenáře.', 'You are HV-certified – nothing in this tutorial is locked. The warnings are here for completeness and for other readers.') },
          { level: 'warning', text: V('Vzduchový podvozek: pokud kvůli práci zvedáte vůz, nejdřív vypněte regulaci výšky (viz návod na zvedání).', 'Air suspension: if you lift the car for the work, switch off level control first (see the lifting tutorial).') }
        ]
      }
    }
  });
})(window.STU);
