/* Tutorial: Engine air filter + cabin (pollen) filter. */
(function (S) {
  'use strict';
  var V = function (cs, en) { return { cs: cs, en: en }; };

  S.registerTutorial({
    id: 'filters',
    level: 1,
    thumb: 'filters.airSwap',
    time: V('20–45 min', '20–45 min'),
    title: V('Vzduchový a kabinový filtr', 'Engine air filter & cabin filter'),
    summary: V('Výměna vzduchového filtru motoru a pylového (kabinového) filtru – rychlá a levná údržba.', 'Replacing the engine air filter and the pollen (cabin) filter – quick and cheap maintenance.'),
    intro: V(
      'Vzduchový filtr chrání motor před prachem, kabinový filtr chrání vás před pylem, prachem a pachy. Obě výměny zvládne začátečník – stačí dodržet čistotu a správnou orientaci filtru.',
      'The air filter protects the engine from dust, the cabin filter protects you from pollen, dust and smells. A beginner can do both – just keep things clean and fit the filter the right way round.'
    ),
    safety: [
      { level: 'warning', text: V('Pracujte s vypnutým a vychladlým motorem. Klíč mimo zapalování (u Keyless klíč dál od vozu).', 'Work with the engine off and cool. Key out of the ignition (keyless key away from the car).') },
      { level: 'caution', text: V('Do sacího potrubí nesmí nic spadnout – šroubek nebo kus filtru může zničit motor nebo turbo. Otevřený sací kanál zakryjte.', 'Nothing may fall into the intake – a screw or piece of filter can destroy the engine or turbo. Cover the open intake duct.') },
      { level: 'caution', text: V('Starý kabinový filtr bývá plný plísní a pylu – rukavice, případně respirátor (alergici).', 'An old cabin filter is often full of mould and pollen – gloves, and a mask if you are allergic.') }
    ],
    tools: [
      V('Šroubováky / Torx bity (dle vozu)', 'Screwdrivers / Torx bits (depending on the car)'),
      V('Vysavač', 'Vacuum cleaner'),
      V('Rukavice, čistý hadr', 'Gloves, clean rag'),
      V('Baterka', 'Torch')
    ],
    parts: [
      V('Vzduchový filtr motoru (podle VIN / kódu motoru)', 'Engine air filter (by VIN / engine code)'),
      V('Kabinový filtr – nejlépe s aktivním uhlím', 'Cabin filter – ideally with activated carbon')
    ],
    finalChecks: [
      V('Víko filtru zacvaknuté, žádné mezery', 'Air box lid clipped, no gaps'),
      V('Konektory a hadice zapojené', 'Connectors and hoses reconnected'),
      V('Žádné nářadí v motorovém prostoru', 'No tools in the engine bay'),
      V('Motor běží klidně, bez kontrolky', 'Engine runs smoothly, no warning light'),
      V('Ventilátor fouká silně na všechny stupně', 'Fan blows strongly on all speeds')
    ],
    steps: [
      { id: 'where', anim: 'filters.where', title: V('Kde jsou filtry', 'Where the filters are'), body: V('**Vzduchový filtr** je ve filtrační skříni v motorovém prostoru, **kabinový filtr** nejčastěji za přihrádkou spolujezdce nebo pod plastovým krytem pod stěrači. Interval obvykle: vzduchový 30–60 tis. km, kabinový 1× ročně – ověřte v servisním plánu.', 'The **air filter** sits in the air box in the engine bay, the **cabin filter** usually behind the passenger glovebox or under the plastic cowl below the wipers. Typical interval: air filter 30–60k km, cabin filter once a year – verify in the service schedule.'), notes: [{ level: 'tip', text: V('V prašném prostředí (polní cesty, stavby) měňte častěji.', 'In dusty conditions (dirt roads, building sites) change more often.') }] },
      { id: 'open', anim: 'filters.airboxOpen', title: V('Otevřete filtrační skříň', 'Open the air box'), body: V('Uvolněte spony nebo šrouby víka. Pokud je na víku snímač (MAF) nebo hadičky, odpojte je opatrně – nebo víko jen odklopte, aby se nenatáhly.', 'Release the clips or screws of the lid. If there is a sensor (MAF) or hoses on the lid, disconnect them carefully – or just tilt the lid so they are not stretched.'), notes: [{ level: 'caution', text: V('Konektor tahejte za tělo po stisku západky, nikdy za kabely.', 'Pull the connector by its body after pressing the latch, never by the wires.') }] },
      { id: 'swap', anim: 'filters.airSwap', title: V('Vyměňte vzduchový filtr', 'Replace the air filter'), body: V('Vyjměte starý filtr a podívejte se, jak byl orientovaný. Nový vložte stejně, těsnicí okraj musí dosednout po celém obvodu.', 'Remove the old filter and note how it was oriented. Fit the new one the same way; the sealing edge must sit all the way round.'), notes: [{ level: 'warning', text: V('Filtr, který nedosedá, propouští prach přímo do motoru (opotřebení válců, turba).', 'A filter that does not seal lets dust straight into the engine (wear of cylinders, turbo).') }] },
      { id: 'clean', anim: 'filters.clean', title: V('Vyčistěte skříň', 'Clean the air box'), body: V('Spodní díl skříně vysajte nebo vytřete vlhkým hadrem. Výstupní (čistou) stranu přitom zakryjte.', 'Vacuum or wipe the lower half of the box with a damp rag. Cover the outlet (clean) side while doing so.'), notes: [{ level: 'danger', text: V('Nikdy nefoukejte stlačeným vzduchem do sání a nepoužívejte filtr znovu po „vyfoukání“ – papír se poškodí.', 'Never blow compressed air into the intake and do not reuse a filter after "blowing it out" – the paper gets damaged.') }] },
      { id: 'close', anim: 'filters.airClose', title: V('Zavřete a zapojte', 'Close and reconnect'), body: V('Nasaďte víko, zacvakněte spony, zapojte konektory a hadice. Nastartujte – motor musí běžet klidně a bez kontrolky.', 'Refit the lid, close the clips, reconnect the connectors and hoses. Start the engine – it must run smoothly with no warning light.') },
      { id: 'cabinAccess', anim: 'filters.cabinAccess', title: V('Přístup ke kabinovému filtru', 'Access the cabin filter'), body: V('Vyprázdněte přihrádku spolujezdce, otevřete ji a uvolněte boční zarážky, aby se spustila. Za ní je kryt šachty filtru. U některých vozů je filtr pod krytem pod stěrači.', 'Empty the passenger glovebox, open it and release the side stops so it drops. Behind it is the filter housing cover. On some cars the filter sits under the cowl below the wipers.') },
      { id: 'cabinSwap', anim: 'filters.cabinSwap', title: V('Vyměňte kabinový filtr', 'Replace the cabin filter'), body: V('Starý filtr vytahujte pomalu, ať nečistoty nepadají do ventilátoru. Šachtu vysajte. Nový filtr zasuňte se šipkou ve směru proudění vzduchu.', 'Pull the old filter out slowly so debris does not fall into the blower. Vacuum the housing. Slide the new filter in with the arrow in the direction of airflow.'), notes: [{ level: 'tip', text: V('Uhlíkový filtr (černý) pohlcuje i pachy z provozu – vyplatí se.', 'A carbon filter (black) also absorbs traffic smells – worth it.') }, { level: 'info', text: V('Zápach z klimatizace po výměně filtru? Pomůže dezinfekce výparníku (viz návod Klimatizace).', 'Air-con smells even after a new filter? Disinfecting the evaporator helps (see the Air conditioning tutorial).') }] },
      { id: 'test', anim: 'filters.test', title: V('Vyzkoušejte ventilátor', 'Test the blower'), body: V('Vraťte kryt a přihrádku. Zapněte ventilátor na všechny stupně a recirkulaci – proud vzduchu musí být silný a bez pachu.', 'Refit the cover and glovebox. Run the fan on all speeds and recirculation – the airflow must be strong and odour-free.') }
    ],
    vehicles: {
      'mb-cl500-c216': {
        status: 'ok',
        specs: [{ label: V('Vzduchové filtry', 'Air filters'), value: V('V8 M273: pravděpodobně 2 filtry (2 skříně) – ověřit', 'V8 M273: probably 2 filters (2 boxes) – verify'), verify: true }, { label: V('Kabinový filtr', 'Cabin filter'), value: V('kombinovaný / uhlíkový, umístění dle WIS', 'combination / carbon, location per WIS'), verify: true }],
        notes: [{ level: 'info', text: V('U V8 vyměňte vždy oba vzduchové filtry současně.', 'On the V8 always replace both air filters at the same time.') }],
        steps: { swap: { body: V('Pokud má váš motor dvě filtrační skříně, postup opakujte na obou stranách – nikdy jen jednu.', 'If your engine has two air boxes, repeat the procedure on both sides – never just one.') } }
      },
      'volvo-xc60-b4': {
        status: 'ok',
        specs: [{ label: V('Vzduchový filtr', 'Air filter'), value: V('umístění dle VIDA', 'location per VIDA'), verify: true }, { label: V('Kabinový filtr', 'Cabin filter'), value: V('za přihrádkou (ověřit); může být i čistička vzduchu', 'behind the glovebox (verify); may also have an air purifier'), verify: true }],
        notes: [{ level: 'info', text: V('Pokud má vůz čističku vzduchu (Clean Zone / PM2.5), její filtr se mění zvlášť – ověřte v příručce.', 'If the car has an air purifier (Clean Zone / PM2.5), its filter is changed separately – verify in the manual.'), verify: true }]
      },
      'skoda-octavia-rs-tdi': {
        status: 'ok',
        specs: [{ label: V('Vzduchový filtr', 'Air filter'), value: V('skříň nad motorem, víko na šrouby (ověřit)', 'box above the engine, lid with screws (verify)'), verify: true }, { label: V('Kabinový filtr', 'Cabin filter'), value: V('za přihrádkou spolujezdce (ověřit)', 'behind the passenger glovebox (verify)'), verify: true }],
        notes: [{ level: 'caution', text: V('Diesel s turbem: čistý a těsný vzduchový filtr je zásadní pro životnost turba.', 'Turbo diesel: a clean, well-sealed air filter is essential for turbo life.') }]
      },
      'toyota-gr-yaris': {
        status: 'ok',
        specs: [{ label: V('Vzduchový filtr', 'Air filter'), value: V('dle TIS (ověřit přístup)', 'per TIS (verify access)'), verify: true }, { label: V('Kabinový filtr', 'Cabin filter'), value: V('za přihrádkou spolujezdce (ověřit)', 'behind the passenger glovebox (verify)'), verify: true }],
        notes: [{ level: 'info', text: V('Sportovní „open“ filtry mohou zhoršit měření vzduchu a nejsou homologované – zůstaňte u originálu.', 'Sport "open" filters can upset the air measurement and are not homologated – stick to the original.') }]
      },
      'citroen-jumper-22hdi': {
        status: 'ok',
        specs: [{ label: V('Vzduchový filtr', 'Air filter'), value: V('skříň v motorovém prostoru (ověřit)', 'box in the engine bay (verify)'), verify: true }, { label: V('Kabinový filtr', 'Cabin filter'), value: V('pod palubní deskou spolujezdce / pod krytem (ověřit)', 'under the passenger dash / behind a cover (verify)'), verify: true }],
        notes: [{ level: 'tip', text: V('Dodávka často jezdí v prachu (stavby) – kontrolujte vzduchový filtr při každé výměně oleje.', 'Vans often work in dust (building sites) – check the air filter at every oil change.') }]
      }
    }
  });
})(window.STU);
