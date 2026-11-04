/* Tutorial: Air conditioning – checks you may do yourself, and what belongs to a certified workshop. 3D: js/3d/scenes/aircon.js */
(function (S) {
  'use strict';
  var V = function (cs, en) { return { cs: cs, en: en }; };

  S.registerTutorial({
    id: 'aircon',
    level: 2,
    thumb: 'aircon.loop',
    time: V('30–90 min', '30–90 min'),
    title: V('Klimatizace: kontrola a údržba', 'Air conditioning: checks and care'),
    summary: V('Co smíte sami (filtr, kondenzátor, test výdechu, zápach) a co patří jen certifikovanému servisu.', 'What you may do yourself (filter, condenser, vent test, smell) and what belongs to a certified workshop.'),
    intro: V(
      'Klimatizace je **uzavřený tlakový okruh** s chladivem. Sami můžete zkontrolovat funkci, vyměnit kabinový filtr, vyčistit kondenzátor, hledat netěsnosti a řešit zápach.\n\n**Vypouštění, plnění a otevírání okruhu smí jen osoba s certifikátem pro F-plyny** (EU/ČR). Chladivo škodí klimatu a hadice jsou pod vysokým tlakem.',
      'Air conditioning is a **sealed pressurised circuit** with refrigerant. You can check its function, replace the cabin filter, clean the condenser, look for leaks and deal with smells.\n\n**Only a person with an F-gas certificate may release, fill or open the circuit** (EU/CZ). Refrigerant harms the climate and the lines are under high pressure.'
    ),
    safety: [
      { level: 'danger', text: V('**Okruh klimatizace neotevírejte.** Chladivo pod tlakem způsobí omrzliny a poranění očí; jeho vypouštění je navíc nezákonné.', '**Never open the A/C circuit.** Pressurised refrigerant causes frostbite and eye injuries; releasing it is also illegal.') },
      { level: 'warning', text: V('Nepoužívejte „domácí“ plnicí spreje s utěsňovačem – ucpou okruh i servisní stanici a oprava se prodraží.', 'Do not use DIY recharge cans with sealant – they clog the system and the workshop machine and make the repair much more expensive.') },
      { level: 'warning', text: V('Ventilátor chladiče a kondenzátoru se může rozběhnout sám – ruce pryč, u práce vpředu odpojte baterii.', 'The radiator/condenser fan can start on its own – keep hands clear, disconnect the battery for work at the front.') },
      { level: 'caution', text: V('Při testu za chodu motoru: parkovací brzda, P / neutrál, nesahat k řemenům.', 'For tests with the engine running: parking brake, P / neutral, hands away from belts.') }
    ],
    tools: [
      V('Teploměr s čidlem (kuchyňský nebo multimetr)', 'Probe thermometer (kitchen or multimeter)'),
      V('Svítilna; UV svítilna a brýle (pokud je v okruhu UV barvivo)', 'Torch; UV torch and glasses (if the system contains UV dye)'),
      V('Měkký kartáč, zahradní hadice (nízký tlak)', 'Soft brush, garden hose (low pressure)'),
      V('Nářadí na demontáž přihrádky / krytu filtru', 'Tools to remove the glovebox / filter cover')
    ],
    parts: [
      V('Kabinový filtr (ideálně s aktivním uhlím) dle VIN', 'Cabin filter (ideally activated carbon) by VIN'),
      V('Dezinfekce výparníku (pěna / sprej) dle návodu výrobce', 'Evaporator disinfectant (foam / spray) per its instructions')
    ],
    finalChecks: [
      V('Ze středového výdechu fouká studený vzduch', 'Cold air from the centre vent'),
      V('Kryt filtru zacvaknutý, přihrádka zpět', 'Filter cover clipped, glovebox refitted'),
      V('Pod vozem po jízdě kape jen čirá voda', 'Only clear water drips under the car after a drive'),
      V('Nalezené netěsnosti / slabý výkon předány certifikovanému servisu', 'Any leaks / poor performance passed to a certified workshop')
    ],
    steps: [
      {
        id: 'loop', anim: 'aircon.loop',
        title: V('Jak klimatizace funguje', 'How the A/C works'),
        body: V('Kompresor stlačí plynné chladivo (horké), v **kondenzátoru** před chladičem zkapalní, za **expanzním ventilem** se prudce rozpíná a ve **výparníku** v palubní desce odebírá teplo vzduchu do kabiny. Vysoušeč odstraňuje vlhkost.',
          'The compressor compresses gaseous refrigerant (hot), in the **condenser** in front of the radiator it liquefies, after the **expansion valve** it expands sharply and in the **evaporator** in the dashboard it takes heat from the cabin air. The dryer removes moisture.')
      },
      {
        id: 'legal', anim: 'aircon.legal',
        title: V('Co smíte a co ne', 'What you may and may not do'),
        body: V('**Smíte:** kontrolu funkce, výměnu kabinového filtru, čištění kondenzátoru, kontrolu odtoku kondenzátu, vizuální hledání netěsností, dezinfekci.\n\n**Nesmíte:** odsávat, doplňovat ani vypouštět chladivo, povolovat spoje okruhu. To dělá servis s certifikátem a servisní stanicí.',
          '**You may:** check function, replace the cabin filter, clean the condenser, check the condensate drain, look for leaks, disinfect.\n\n**You may not:** recover, top up or release refrigerant, or loosen circuit joints. That is for a certified workshop with a service machine.'),
        notes: [{ level: 'info', text: V('Typ chladiva (R134a / R1234yf) a jeho množství je na štítku pod kapotou.', 'The refrigerant type (R134a / R1234yf) and amount are on the label under the bonnet.') }]
      },
      {
        id: 'vent', anim: 'aircon.vent',
        title: V('Test výkonu na výdechu', 'Vent temperature test'),
        body: V('Motor běží, A/C zapnuté, recirkulace, ventilátor na maximum, okna zavřená. Po 3–5 minutách změřte teplotu ve středovém výdechu. Obvykle **4–8 °C** (závisí na venkovní teplotě a vlhkosti). Výrazně teplejší vzduch = málo chladiva nebo porucha → servis.',
          'Engine running, A/C on, recirculation, fan on max, windows closed. After 3–5 minutes measure the centre vent temperature. Typically **4–8 °C** (depends on ambient temperature and humidity). Much warmer air = low refrigerant or a fault → workshop.')
      },
      {
        id: 'clutch', anim: 'aircon.clutch',
        title: V('Spíná kompresor?', 'Does the compressor engage?'),
        body: V('U kompresorů se spojkou: při zapnutí A/C se přítlačný kotouč přitáhne k řemenici a začne se točit (slyšitelné cvaknutí). Nespíná = pojistka, relé, tlakový spínač nebo málo chladiva (ochrana). Mnoho moderních vozů má **kompresor bez spojky** řízený ventilem – tam je nutná diagnostika.',
          'With a clutch-type compressor: when A/C is switched on, the clutch plate pulls in to the pulley and spins (audible click). Does not engage = fuse, relay, pressure switch or low refrigerant (protection). Many modern cars have a **clutchless compressor** controlled by a valve – that needs a scan tool.'),
        notes: [{ level: 'warning', text: V('Při kontrole za chodu nesahejte k řemenu a řemenicím.', 'When checking with the engine running keep away from the belt and pulleys.') }]
      },
      {
        id: 'filter', anim: 'aircon.filter',
        title: V('Vyměňte kabinový filtr', 'Replace the cabin filter'),
        body: V('Kryt filtru bývá za přihrádkou spolujezdce nebo pod ní (někdy pod čelním sklem). Starý filtr vytáhněte, vyčistěte prostor od listí a vložte nový **podle šipky proudění vzduchu**. Měňte ho 1× ročně nebo při zápachu / mlžení oken.',
          'The filter cover is usually behind or under the passenger glovebox (sometimes under the windscreen cowl). Pull the old filter out, clean leaves from the housing and insert the new one **following the airflow arrow**. Replace yearly or when it smells / windows mist up.')
      },
      {
        id: 'condenser', anim: 'aircon.condenser',
        title: V('Vyčistěte kondenzátor', 'Clean the condenser'),
        body: V('Kondenzátor je před chladičem. Hmyz a listí odstraňte měkkým kartáčem a proplachujte **slabým proudem vody zevnitř ven**. Tlakovou myčku nepoužívejte – ohne lamely.',
          'The condenser sits in front of the radiator. Remove insects and leaves with a soft brush and rinse **with a gentle stream from the inside out**. Never use a pressure washer – it bends the fins.'),
        notes: [{ level: 'danger', text: V('Motor vypnutý a studený, baterie odpojená – ventilátor se může rozběhnout sám.', 'Engine off and cold, battery disconnected – the fan can start on its own.') }]
      },
      {
        id: 'drain', anim: 'aircon.drain',
        title: V('Odtok kondenzátu', 'Condensate drain'),
        body: V('Kapající **čirá voda** pod vozem při zapnuté klimatizaci je normální. Mokrý koberec u spolujezdce nebo šplouchání v palubní desce = ucpaná odtoková hadička – opatrně ji pročistěte (měkký drát, stlačený vzduch s citem).',
          'Clear **water dripping** under the car with A/C on is normal. A wet passenger carpet or sloshing in the dashboard = blocked drain tube – clear it gently (soft wire, a little compressed air).')
      },
      {
        id: 'leak', anim: 'aircon.leak',
        title: V('Hledejte netěsnosti', 'Look for leaks'),
        body: V('Netěsnost se projevuje **mastnými, zaprášenými skvrnami** u spojů, na kompresoru a kondenzátoru (s chladivem uniká olej). Pokud okruh obsahuje UV barvivo, ukáže místo úniku UV svítilna.',
          'A leak shows as **oily, dusty patches** at joints, on the compressor and the condenser (oil escapes with the refrigerant). If the system contains UV dye, a UV torch shows the leak.'),
        notes: [{ level: 'danger', text: V('Spoje nedotahujte ani nepovolujte – únik nahlaste servisu.', 'Do not tighten or loosen joints – report the leak to a workshop.') }]
      },
      {
        id: 'smell', anim: 'aircon.smell',
        title: V('Zápach z ventilace', 'Smell from the vents'),
        body: V('Zatuchlý zápach = plíseň a bakterie na vlhkém výparníku. Vyměňte filtr a výparník vydezinfikujte přípravkem dle jeho návodu (pěna do odtoku / výdechů nebo ultrazvuk v servisu). **Prevence:** 2 minuty před koncem jízdy vypněte A/C a nechte ventilátor foukat.',
          'A musty smell = mould and bacteria on the damp evaporator. Replace the filter and disinfect the evaporator per the product\'s instructions (foam into the drain / vents, or ultrasonic in a workshop). **Prevention:** switch A/C off 2 minutes before the end of the drive and keep the fan running.'),
        notes: [{ level: 'caution', text: V('Dezinfekci používejte jen podle návodu, vůz vyvětrejte. Nevdechujte aerosol.', 'Use the disinfectant only per its instructions and air the car out. Do not inhale the aerosol.') }]
      },
      {
        id: 'service', anim: 'aircon.workshop',
        title: V('Kdy do servisu', 'When to go to a workshop'),
        body: V('Slabý výkon, nalezená netěsnost, kompresor nespíná nebo hlučí → certifikovaný servis: odsátí chladiva, **vakuum a test těsnosti**, oprava a naplnění **přesným množstvím podle hmotnosti**. Doporučená kontrola cca každé 2 roky.',
          'Poor cooling, a found leak, compressor not engaging or noisy → certified workshop: refrigerant recovery, **vacuum and leak test**, repair and charge with **the exact amount by weight**. A check every ~2 years is recommended.')
      }
    ],
    vehicles: {
      'mb-cl500-c216': {
        status: 'ok',
        specs: [
          { label: V('Chladivo', 'Refrigerant'), value: 'R134a', verify: true },
          { label: V('Kabinový filtr', 'Cabin filter'), value: V('kombinovaný s aktivním uhlím – umístění dle WIS', 'combination with activated carbon – location per WIS'), verify: true }
        ],
        notes: [{ level: 'info', text: V('CL má automatickou klimatizaci (THERMOTRONIC) – chybové kódy čte XENTRY / diagnostika s podporou MB.', 'The CL has automatic climate control (THERMOTRONIC) – fault codes are read with XENTRY / an MB-capable scan tool.'), verify: true }]
      },
      'volvo-xc60-b4': {
        status: 'ok',
        specs: [
          { label: V('Chladivo', 'Refrigerant'), value: 'R1234yf', verify: true },
          { label: V('Kabinový filtr', 'Cabin filter'), value: V('za přihrádkou spolujezdce (CleanZone) – ověřit', 'behind the passenger glovebox (CleanZone) – verify'), verify: true }
        ],
        notes: [{ level: 'info', text: V('Kompresor je pravděpodobně řízený elektronicky bez klasické spojky – funkci ověří diagnostika (VIDA).', 'The compressor is probably electronically controlled without a classic clutch – check function with a scan tool (VIDA).'), verify: true }]
      },
      'skoda-octavia-rs-tdi': {
        status: 'ok',
        specs: [
          { label: V('Chladivo', 'Refrigerant'), value: 'R134a', verify: true },
          { label: V('Kabinový filtr', 'Cabin filter'), value: V('pod / za přihrádkou spolujezdce – ověřit', 'under / behind the passenger glovebox – verify'), verify: true },
          { label: V('Kompresor', 'Compressor'), value: V('pravděpodobně bez spojky (regulační ventil)', 'probably clutchless (control valve)'), verify: true }
        ],
        notes: [{ level: 'tip', text: V('Ucpaný odtok kondenzátu u Octavie II zaplavuje koberec spolujezdce – při mokrém koberci kontrolujte i odtoky pod čelním sklem.', 'A blocked condensate drain on the Octavia II floods the passenger carpet – with a wet carpet also check the drains under the windscreen.'), verify: true }]
      },
      'toyota-gr-yaris': {
        status: 'ok',
        specs: [
          { label: V('Chladivo', 'Refrigerant'), value: 'R1234yf', verify: true },
          { label: V('Kabinový filtr', 'Cabin filter'), value: V('za přihrádkou spolujezdce – ověřit', 'behind the passenger glovebox – verify'), verify: true }
        ]
      },
      'citroen-jumper-22hdi': {
        status: 'ok',
        specs: [
          { label: V('Klimatizace', 'Air conditioning'), value: V('podle výbavy – ověřte, zda je montována', 'depends on equipment – check whether fitted'), verify: true },
          { label: V('Chladivo', 'Refrigerant'), value: 'R134a', verify: true },
          { label: V('Kabinový filtr', 'Cabin filter'), value: V('umístění dle dokumentace PSA/Fiat', 'location per PSA/Fiat documentation'), verify: true }
        ],
        notes: [{ level: 'info', text: V('Pokud dodávka klimatizaci nemá, platí z návodu jen kabinový filtr a odtoky.', 'If the van has no A/C, only the cabin filter and drain parts of this tutorial apply.') }]
      }
    }
  });
})(window.STU);
