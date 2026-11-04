/* Vehicle definitions.
 * facts:  [{ label, value, verify? }]  – values flagged verify:true are NOT 100 % certain.
 * quirks: [{ level, text, verify? }]   – vehicle-wide warnings shown on the vehicle page.
 */
(function (S) {
  S.registerVehicle({
    id: 'generic',
    name: { cs: 'Obecné vozidlo', en: 'Generic vehicle' },
    short: { cs: 'Obecné', en: 'Generic' },
    sub: { cs: 'Obecný postup platný pro většinu aut', en: 'General procedure valid for most cars' },
    color: '#8a94a6',
    facts: [],
    quirks: [
      { level: 'info', text: { cs: 'Obecný návod popisuje princip. Konkrétní momenty, objemy a pořadí kroků se liší podle vozu – vždy použijte dílenskou příručku pro váš VIN.', en: 'The generic tutorial explains the principle. Exact torques, capacities and step order differ per car – always use the workshop manual for your VIN.' } }
    ]
  });

  S.registerVehicle({
    id: 'mb-cl500-c216',
    name: { cs: 'Mercedes-Benz CL 500 (C216) 2007', en: 'Mercedes-Benz CL 500 (C216) 2007' },
    short: { cs: 'CL 500', en: 'CL 500' },
    sub: { cs: 'M273 5.5 V8 · 7G-Tronic · zadní náhon · ABC', en: 'M273 5.5 V8 · 7G-Tronic · RWD · ABC' },
    color: '#c0c6d0',
    facts: [
      { label: { cs: 'Motor', en: 'Engine' }, value: { cs: 'M273 KE55, 5461 cm³ V8, 285 kW (388 k), 530 Nm', en: 'M273 KE55, 5461 cc V8, 285 kW (388 hp), 530 Nm' } },
      { label: { cs: 'Převodovka', en: 'Transmission' }, value: { cs: '7G-Tronic (722.9), 7st. automat', en: '7G-Tronic (722.9), 7-speed automatic' } },
      { label: { cs: 'Pohon', en: 'Drive' }, value: { cs: 'Zadní kola (RWD)', en: 'Rear-wheel drive (RWD)' } },
      { label: { cs: 'Podvozek', en: 'Suspension' }, value: { cs: 'ABC – Active Body Control (hydraulické aktivní odpružení)', en: 'ABC – Active Body Control (hydraulic active suspension)' }, verify: true },
      { label: { cs: 'Motorový olej', en: 'Engine oil' }, value: { cs: 'Schválení MB 229.5 (např. 5W-40 / 0W-40)', en: 'MB approval 229.5 (e.g. 5W-40 / 0W-40)' } },
      { label: { cs: 'Množství oleje (s filtrem)', en: 'Oil capacity (with filter)' }, value: { cs: 'cca 8,0 l', en: 'approx. 8.0 L' }, verify: true },
      { label: { cs: 'Rozvody', en: 'Timing drive' }, value: { cs: 'Řetěz (bez pravidelného intervalu výměny)', en: 'Chain (no scheduled replacement interval)' } },
      { label: { cs: 'Kapalina ABC', en: 'ABC fluid' }, value: { cs: 'Pentosin CHF 11S (MB 343.0) – zelená', en: 'Pentosin CHF 11S (MB 343.0) – green' }, verify: true },
      { label: { cs: 'Brzdová kapalina', en: 'Brake fluid' }, value: { cs: 'DOT 4 Plus (MB 331.0)', en: 'DOT 4 Plus (MB 331.0)' }, verify: true },
      { label: { cs: 'Chladicí kapalina', en: 'Coolant' }, value: { cs: 'MB 325.0 (50 : 50)', en: 'MB 325.0 (50 : 50)' }, verify: true },
      { label: { cs: 'Šrouby kol', en: 'Wheel bolts' }, value: { cs: 'M14 × 1,5 · 150 Nm', en: 'M14 × 1.5 · 150 Nm' }, verify: true },
      { label: { cs: 'Parkovací brzda', en: 'Parking brake' }, value: { cs: 'Elektrická s lanovým aktuátorem, bubínková v zadním kotouči (drum-in-hat)', en: 'Electric with cable actuator, drum-in-hat shoes in rear disc' }, verify: true },
      { label: { cs: 'Baterie 12 V', en: '12 V battery' }, value: { cs: 'V zavazadlovém prostoru; startovací body v motorovém prostoru', en: 'In the trunk; jump-start points in the engine bay' }, verify: true }
    ],
    quirks: [
      { level: 'danger', text: { cs: '**ABC podvozek:** Nikdy nepracujte pod vozem, který „stojí“ jen na ABC – vozidlo může samo klesnout nebo se zvednout. Vždy podepřete na stojanech pod zvedacími body. Před zvednutím vypněte motor, vytáhněte klíč/odložte Keyless-Go klíč mimo dosah a nepoužívejte tlačítko změny výšky.', en: '**ABC suspension:** Never work under a car that is held only by ABC – it can lower or rise on its own. Always support it on stands under the jacking points. Before lifting switch the engine off, remove the key / keep the Keyless-Go key out of range and do not use the ride-height button.' } },
      { level: 'warning', text: { cs: '**Hydraulika ABC pracuje s tlakem přes 200 bar.** Na vedení, ventilové bloky a vzpěry ABC nesahejte bez znalosti postupu odtlakování z WIS.', en: '**ABC hydraulics run at over 200 bar.** Do not open ABC lines, valve blocks or struts without the WIS depressurisation procedure.' }, verify: true },
      { level: 'warning', text: { cs: '**Rozvodový řetěz M273:** u raných motorů (cca do 2006/2007) se vyskytuje opotřebení vložených ozubených kol / napínací kolejnice. Příznaky: chrastění po studeném startu, chyby P0016–P0019. Ověřte číslo motoru u servisu Mercedes.', en: '**M273 timing chain:** early engines (approx. up to 2006/2007) are known for wear of idler gears / guide rails. Symptoms: rattle after cold start, codes P0016–P0019. Check your engine number with a Mercedes dealer.' }, verify: true },
      { level: 'caution', text: { cs: 'Části karoserie jsou z hliníku (kapota, přední blatníky, dveře, víko kufru). Na hliník používejte samostatné nářadí a brusivo – ocelový prach způsobuje korozi.', en: 'Parts of the body are aluminium (bonnet, front wings, doors, boot lid). Use separate tools and abrasives for aluminium – steel dust causes corrosion.' }, verify: true },
      { level: 'info', text: { cs: 'Pro diagnostiku a servisní funkce (reset servisu, adaptace převodovky, ABC) je ideální XENTRY/DAS nebo kvalitní diagnostika s podporou Mercedes.', en: 'For diagnostics and service functions (service reset, transmission adaptation, ABC) XENTRY/DAS or a quality scan tool with Mercedes support is ideal.' } }
    ]
  });

  S.registerVehicle({
    id: 'volvo-xc60-b4',
    name: { cs: 'Volvo XC60 B4 AWD 2024', en: 'Volvo XC60 B4 AWD 2024' },
    short: { cs: 'XC60', en: 'XC60' },
    sub: { cs: '2.0 benzín · 48V mild hybrid · 8st. automat · AWD', en: '2.0 petrol · 48V mild hybrid · 8-speed auto · AWD' },
    color: '#4a7bd0',
    facts: [
      { label: { cs: 'Motor', en: 'Engine' }, value: { cs: '2.0 4válec turbo benzín (rodina Drive-E / VEP4), cca 145 kW (197 k)', en: '2.0 4-cyl turbo petrol (Drive-E / VEP4 family), approx. 145 kW (197 hp)' }, verify: true },
      { label: { cs: 'Hybridní systém', en: 'Hybrid system' }, value: { cs: '48V mild hybrid (ISGM startér-generátor + 48V baterie + DC/DC měnič)', en: '48 V mild hybrid (ISGM starter-generator + 48 V battery + DC/DC converter)' } },
      { label: { cs: 'Převodovka', en: 'Transmission' }, value: { cs: '8st. automat (Aisin AWF8G45)', en: '8-speed automatic (Aisin AWF8G45)' }, verify: true },
      { label: { cs: 'Pohon', en: 'Drive' }, value: { cs: 'AWD – zadní diferenciál s lamelovou spojkou (vlastní olej)', en: 'AWD – rear drive unit with multi-plate coupling (own oil)' } },
      { label: { cs: 'Podvozek', en: 'Suspension' }, value: { cs: 'Vzduchové odpružení (všechna 4 kola) s regulací výšky', en: 'Air suspension (all 4 corners) with level control' } },
      { label: { cs: 'Motorový olej', en: 'Engine oil' }, value: { cs: 'Volvo specifikace VCC RBS0-2AE, 0W-20', en: 'Volvo spec VCC RBS0-2AE, 0W-20' }, verify: true },
      { label: { cs: 'Množství oleje (s filtrem)', en: 'Oil capacity (with filter)' }, value: { cs: 'cca 5,2–5,9 l (dle verze)', en: 'approx. 5.2–5.9 L (depends on version)' }, verify: true },
      { label: { cs: 'Rozvody', en: 'Timing drive' }, value: { cs: 'Ozubený řemen – interval dle servisního plánu Volvo', en: 'Timing belt – interval per Volvo service schedule' }, verify: true },
      { label: { cs: 'Šrouby kol', en: 'Wheel bolts' }, value: { cs: 'M14 × 1,5 · 140 Nm', en: 'M14 × 1.5 · 140 Nm' }, verify: true },
      { label: { cs: 'Parkovací brzda', en: 'Parking brake' }, value: { cs: 'Elektrická (EPB), motory přímo na zadních třmenech – nutný servisní režim', en: 'Electric (EPB), motors directly on rear calipers – service mode required' } },
      { label: { cs: 'Brzdová kapalina', en: 'Brake fluid' }, value: { cs: 'DOT 4 nízkoviskózní (třída 6)', en: 'DOT 4 low viscosity (class 6)' }, verify: true },
      { label: { cs: 'Asistenční systémy', en: 'Driver assistance' }, value: { cs: 'Radar v předním nárazníku/masce, kamera u čelního skla – po zásahu nutná kalibrace', en: 'Radar in front bumper/grille, camera at windscreen – calibration required after repairs' } }
    ],
    quirks: [
      { level: 'danger', text: { cs: '**Vzduchové odpružení:** Před zvedáním heverem nebo na zvedáku VŽDY vypněte automatickou regulaci výšky / zapněte režim zvedání (centrální displej – přesnou cestu v menu ověřte v uživatelské příručce). Jinak se vůz může sám spustit nebo zvednout a sklouznout ze stojanů. Pod vůz jen na stojanech.', en: '**Air suspension:** Before lifting with a jack or on a lift ALWAYS switch off automatic level control / enable jacking mode (centre display – verify the exact menu path in the owner\'s manual). Otherwise the car can lower or raise itself and slip off the stands. Only get under the car on stands.' }, verify: true },
      { level: 'warning', text: { cs: '**Vzduchové měchy a vedení** jsou pod tlakem (cca 10+ bar). Neodpojujte je bez odtlakování přes VIDA. Vozidlo nikdy nenechávejte stát na zemi se sundaným kolem a vypuštěným měchem.', en: '**Air springs and lines** are pressurised (approx. 10+ bar). Do not disconnect them without depressurising via VIDA. Never leave the car standing with a wheel off and a deflated spring.' }, verify: true },
      { level: 'warning', text: { cs: '**48V systém:** 48 V je pod hranicí „vysokého napětí“ (60 V DC), ale baterie dodá obrovský proud – zkrat nářadím způsobí oblouk, popáleniny a požár. Před prací na startér-generátoru, DC/DC měniči nebo kabeláži odpojte 12V i 48V systém dle postupu VIDA.', en: '**48 V system:** 48 V is below the "high-voltage" threshold (60 V DC), but the battery can deliver huge currents – a tool short causes arcing, burns and fire. Before working on the starter-generator, DC/DC converter or wiring, disconnect both 12 V and 48 V systems per the VIDA procedure.' } },
      { level: 'warning', text: { cs: '**Elektrická parkovací brzda:** Před výměnou zadních destiček MUSÍ být EPB v servisním režimu (diagnostika VIDA / kompatibilní tester, nebo postup z uživatelské příručky). Zatlačení pístu násilím zničí motor třmenu.', en: '**Electric parking brake:** Before replacing rear pads the EPB MUST be in service mode (VIDA / compatible scan tool, or the owner-manual procedure). Forcing the piston back destroys the caliper motor.' } },
      { level: 'warning', text: { cs: '**Ultra-pevné oceli (bór):** A/B sloupky, prahy a střešní rámy jsou z borové oceli. Žádné ohřívání, rovnání ani svařování – výměna jen dle postupu Volvo v autorizované karosárně.', en: '**Ultra-high-strength (boron) steel:** A/B pillars, sills and roof rails are boron steel. No heating, straightening or welding – replacement only per Volvo procedure in an approved body shop.' } },
      { level: 'caution', text: { cs: 'Po odpojení baterie může být nutná inicializace oken, střešního okna a kalibrace systémů. Zkontrolujte VIDA.', en: 'After disconnecting the battery, windows/sunroof initialisation and system calibration may be needed. Check VIDA.' }, verify: true },
      { level: 'info', text: { cs: 'Umístění 12V a 48V baterie se liší podle modelového roku – ověřte ve VIDA nebo uživatelské příručce.', en: 'The location of the 12 V and 48 V batteries differs by model year – check VIDA or the owner\'s manual.' }, verify: true }
    ]
  });

  S.registerVehicle({
    id: 'skoda-octavia-rs-tdi',
    name: { cs: 'Škoda Octavia RS 2.0 TDI 2011', en: 'Škoda Octavia RS 2.0 TDI 2011' },
    short: { cs: 'Octavia RS', en: 'Octavia RS' },
    sub: { cs: 'Liftback · 2.0 TDI CR 125 kW · 6st. manuál · přední náhon', en: 'Liftback · 2.0 TDI CR 125 kW · 6-speed manual · FWD' },
    color: '#4ba82e',
    facts: [
      { label: { cs: 'Generace / karoserie', en: 'Generation / body' }, value: { cs: 'Octavia II facelift (1Z), 2009–2013 · liftback', en: 'Octavia II facelift (1Z), 2009–2013 · liftback' } },
      { label: { cs: 'Světlomety', en: 'Headlights' }, value: { cs: 'Bi-xenon s AFS (natáčecí)', en: 'Bi-xenon with AFS (cornering)' } },
      { label: { cs: 'Motor', en: 'Engine' }, value: { cs: '2.0 TDI Common Rail, kód CEGA, 125 kW (170 k), 350 Nm, DPF', en: '2.0 TDI Common Rail, code CEGA, 125 kW (170 hp), 350 Nm, DPF' }, verify: true },
      { label: { cs: 'Převodovka', en: 'Transmission' }, value: { cs: '6st. manuál (02Q), dvouhmotový setrvačník', en: '6-speed manual (02Q), dual-mass flywheel' } },
      { label: { cs: 'Pohon', en: 'Drive' }, value: { cs: 'Přední kola (FWD)', en: 'Front-wheel drive (FWD)' } },
      { label: { cs: 'Motorový olej', en: 'Engine oil' }, value: { cs: 'VW 507.00, 5W-30 (low-SAPS kvůli DPF)', en: 'VW 507.00, 5W-30 (low-SAPS because of DPF)' } },
      { label: { cs: 'Množství oleje (s filtrem)', en: 'Oil capacity (with filter)' }, value: { cs: 'cca 4,3 l', en: 'approx. 4.3 L' }, verify: true },
      { label: { cs: 'Rozvody', en: 'Timing drive' }, value: { cs: 'Ozubený řemen + vodní pumpa, interval cca 210 000 km', en: 'Timing belt + water pump, interval approx. 210,000 km' }, verify: true },
      { label: { cs: 'Šrouby kol', en: 'Wheel bolts' }, value: { cs: 'M14 × 1,5 · 120 Nm', en: 'M14 × 1.5 · 120 Nm' } },
      { label: { cs: 'Parkovací brzda', en: 'Parking brake' }, value: { cs: 'Mechanická (páka), zadní písty se zašroubovávají', en: 'Mechanical (lever), rear pistons wind back (screw-in)' } },
      { label: { cs: 'Brzdová kapalina', en: 'Brake fluid' }, value: { cs: 'DOT 4 (VW 501 14)', en: 'DOT 4 (VW 501 14)' } },
      { label: { cs: 'Chladicí kapalina', en: 'Coolant' }, value: { cs: 'G13 (fialová), nemíchat s G11', en: 'G13 (violet), do not mix with G11' }, verify: true },
      { label: { cs: 'Kód motoru', en: 'Engine code' }, value: { cs: 'Na štítku v rezervním kole a v servisní knížce', en: 'On the data sticker in the spare wheel well and in the service book' } }
    ],
    quirks: [
      { level: 'danger', text: { cs: '**Rozvody:** Přetržení nebo přeskočení řemenu u tohoto motoru (interferenční) zničí ventily a písty. Interval nepřekračujte a vždy měňte celou sadu včetně vodní pumpy.', en: '**Timing belt:** A snapped or jumped belt on this (interference) engine destroys valves and pistons. Never exceed the interval and always replace the full kit including the water pump.' } },
      { level: 'warning', text: { cs: '**Common Rail:** Vysokotlaký systém paliva pracuje s tlakem až cca 1800 bar. Nikdy neotevírejte vysokotlaká vedení za chodu nebo krátce po vypnutí motoru – paprsek nafty pronikne kůží.', en: '**Common Rail:** The high-pressure fuel system runs up to approx. 1800 bar. Never open high-pressure lines with the engine running or shortly after switching off – a diesel jet penetrates skin.' }, verify: true },
      { level: 'caution', text: { cs: 'Používejte jen olej VW 507.00 – jiný olej ničí DPF filtr pevných částic.', en: 'Use only VW 507.00 oil – other oils damage the diesel particulate filter.' } },
      { level: 'info', text: { cs: 'Interval rozvodů a kód motoru si ověřte v servisní knížce / ELSA pro váš VIN – některé motory mají jiný interval.', en: 'Check the timing belt interval and engine code in the service book / ELSA for your VIN – some engines have a different interval.' } }
    ]
  });

  S.registerVehicle({
    id: 'toyota-gr-yaris',
    name: { cs: 'Toyota GR Yaris 2024 (manuál)', en: 'Toyota GR Yaris 2024 (manual)' },
    short: { cs: 'GR Yaris', en: 'GR Yaris' },
    sub: { cs: 'G16E-GTS 1.6 turbo · 6st. manuál · GR-FOUR AWD', en: 'G16E-GTS 1.6 turbo · 6-speed manual · GR-FOUR AWD' },
    color: '#d0302f',
    facts: [
      { label: { cs: 'Motor', en: 'Engine' }, value: { cs: 'G16E-GTS 1.6 3válec turbo, 206 kW (280 k), 390 Nm (facelift 2024)', en: 'G16E-GTS 1.6 3-cyl turbo, 206 kW (280 hp), 390 Nm (2024 facelift)' }, verify: true },
      { label: { cs: 'Převodovka', en: 'Transmission' }, value: { cs: '6st. manuál (iMT)', en: '6-speed manual (iMT)' } },
      { label: { cs: 'Pohon', en: 'Drive' }, value: { cs: 'GR-FOUR AWD s elektronicky řízenou spojkou, přední a zadní diferenciál (vlastní oleje)', en: 'GR-FOUR AWD with electronically controlled coupling, front and rear diffs (own oils)' } },
      { label: { cs: 'Motorový olej', en: 'Engine oil' }, value: { cs: 'Dle uživatelské příručky (0W-20 / 5W-30 dle provozu)', en: 'Per owner\'s manual (0W-20 / 5W-30 depending on use)' }, verify: true },
      { label: { cs: 'Množství oleje (s filtrem)', en: 'Oil capacity (with filter)' }, value: { cs: 'cca 4,5 l', en: 'approx. 4.5 L' }, verify: true },
      { label: { cs: 'Rozvody', en: 'Timing drive' }, value: { cs: 'Řetěz (bez pravidelného intervalu výměny)', en: 'Chain (no scheduled replacement interval)' } },
      { label: { cs: 'Přední brzdy', en: 'Front brakes' }, value: { cs: '4pístkové pevné třmeny, kotouč 356 mm', en: '4-piston fixed calipers, 356 mm disc' }, verify: true },
      { label: { cs: 'Zadní brzdy', en: 'Rear brakes' }, value: { cs: '2pístkové třmeny, kotouč 297 mm', en: '2-piston calipers, 297 mm disc' }, verify: true },
      { label: { cs: 'Matice kol', en: 'Wheel nuts' }, value: { cs: '103 Nm', en: '103 Nm' }, verify: true },
      { label: { cs: 'Parkovací brzda', en: 'Parking brake' }, value: { cs: 'Mechanická (páka)', en: 'Mechanical (lever)' } },
      { label: { cs: 'Karoserie', en: 'Body' }, value: { cs: 'Hliníková kapota, dveře a víko kufru; střecha z kompozitu (CFRP)', en: 'Aluminium bonnet, doors and tailgate; composite (CFRP) roof' }, verify: true }
    ],
    quirks: [
      { level: 'warning', text: { cs: '**Nízký podvozek a spoilery:** Hever vždy zasouvejte z boku pod zvedací body. Nárazník a difuzor se snadno poškodí.', en: '**Low car with spoilers:** Always slide the jack in from the side under the jacking points. The bumper and diffuser are easily damaged.' } },
      { level: 'caution', text: { cs: '**Hliník a kompozit:** Kapota, dveře a víko kufru jsou hliníkové, střecha kompozitová. Klempířské práce jen s hliníkovým nářadím; na kompozit nepoužívejte teplo ani tmel pro ocel.', en: '**Aluminium and composite:** The bonnet, doors and tailgate are aluminium, the roof is composite. Bodywork only with aluminium tools; never use heat or steel filler on the composite.' }, verify: true },
      { level: 'info', text: { cs: 'Při závodním / okruhovém provozu výrazně zkraťte intervaly oleje, brzdové kapaliny a olejů diferenciálů.', en: 'With track use, shorten the intervals for oil, brake fluid and differential oils considerably.' } }
    ]
  });
})(window.STU);
