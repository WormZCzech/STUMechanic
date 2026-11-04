/* Tutorial: Commercial van care – Citroën Jumper X250 only. */
(function (S) {
  'use strict';
  var V = function (cs, en) { return { cs: cs, en: en }; };

  S.registerTutorial({
    id: 'van-care',
    level: 1,
    only: ['citroen-jumper-22hdi'],
    thumb: 'van-care.payload',
    time: V('1–3 h (dle rozsahu)', '1–3 h (depending on scope)'),
    title: V('Péče o dodávku: náklad, pera, dveře, rez', 'Van care: payload, springs, doors, rust'),
    summary: V('Zatížení a tlak v pneu, kontrola listových per, mazání posuvných dveří, ochrana proti korozi a zajištění nákladu.', 'Payload and tyre pressure, leaf spring check, sliding door lubrication, corrosion protection and load securing.'),
    intro: V(
      'Užitková dodávka žije jiný život než osobní auto: těžký náklad, hodně kilometrů, časté otevírání dveří a sůl na podvozku. Tento návod shrnuje údržbu, která dodávce **prodlouží život a ochrání vás před pokutou i nehodou**.',
      'A working van lives a different life from a car: heavy loads, high mileage, constant door use and road salt on the underbody. This tutorial sums up the maintenance that **extends the van\'s life and protects you from fines and accidents**.'
    ),
    safety: [
      { level: 'danger', text: V('Pod dodávku jen na stojanech s nosností min. 3 t, náklad vyložený. Nikdy jen na heveru.', 'Under the van only on stands rated at least 3 t, with the cargo unloaded. Never on a jack alone.') },
      { level: 'warning', text: V('Ochranné vosky a spreje: respirátor, brýle, rukavice, dobré větrání. Hořlavé – žádný oheň ani jiskry.', 'Protective waxes and sprays: respirator, goggles, gloves, good ventilation. Flammable – no flames or sparks.') },
      { level: 'warning', text: V('Při práci na posuvných dveřích pozor na prsty – dveře jsou těžké a mohou se samy rozjet ve svahu.', 'Mind your fingers on the sliding door – it is heavy and can roll on its own on a slope.') }
    ],
    tools: [
      V('Hever a stojany min. 3 t', 'Jack and stands rated ≥3 t'),
      V('Baterka, drátěný kartáč, zrcátko', 'Torch, wire brush, inspection mirror'),
      V('Tlakový měřič a kompresor', 'Pressure gauge and compressor'),
      V('Pistole na dutinový vosk se 360° sondou', 'Cavity wax gun with a 360° wand'),
      V('Upínací popruhy s ráčnou', 'Ratchet lashing straps')
    ],
    parts: [
      V('Mazivo na kolejnice (sprej, PTFE / lithiové)', 'Rail lubricant (spray, PTFE / lithium)'),
      V('Konvertor rzi, ochranný podvozkový vosk, dutinový vosk', 'Rust converter, underbody protection wax, cavity wax'),
      V('Popruhy s certifikací (LC dle hmotnosti nákladu)', 'Certified straps (LC to match the load weight)')
    ],
    finalChecks: [
      V('Tlak v pneu odpovídá zatížení', 'Tyre pressure matches the load'),
      V('Pera bez prasklin, třmeny dotažené', 'Springs without cracks, U-bolts tight'),
      V('Posuvné dveře jdou lehce a zacvaknou', 'Sliding door runs easily and latches'),
      V('Vosk není na výfuku, brzdách ani řemenech', 'No wax on the exhaust, brakes or belts'),
      V('Odtoky v prazích a dveřích průchodné', 'Drain holes in sills and doors clear')
    ],
    steps: [
      { id: 'payload', anim: 'van-care.payload', title: V('Hmotnost nákladu a rozložení', 'Payload and weight distribution'), body: V('Zjistěte **největší povolenou hmotnost** a **zatížení náprav** (ORV, štítek ve dveřích). Těžké věci dávejte dolů, k přepážce a nad zadní nápravu.', 'Find the **gross vehicle weight** and **axle load limits** (registration papers, door-pillar plate). Put heavy items low, against the bulkhead and over the rear axle.'), specs: [{ label: V('Celková hmotnost', 'Gross weight'), value: V('3,0–4,0 t dle verze (ORV)', '3.0–4.0 t depending on version (papers)'), verify: true }], notes: [{ level: 'danger', text: V('Přetížená dodávka brzdí výrazně hůř a přetížení zadní nápravy láme pera.', 'An overloaded van brakes much worse and overloading the rear axle breaks springs.') }, { level: 'tip', text: V('Při pochybnosti zvažte dodávku na veřejné váze.', 'If in doubt, weigh the van on a public weighbridge.') }] },
      { id: 'tyres', anim: 'tyres.pressure', title: V('Tlak v pneu podle zatížení', 'Tyre pressure for the load'), body: V('U dodávky se tlak výrazně mění podle zatížení – pro plně naloženou dodávku platí vyšší hodnota (hlavně vzadu). Hodnoty jsou na štítku / v příručce. Pneu musí mít označení **C** a správný index nosnosti.', 'On a van the pressure changes a lot with load – a fully loaded van needs the higher value (especially at the rear). Values are on the sticker / in the manual. Tyres must be marked **C** with the correct load index.'), notes: [{ level: 'warning', text: V('Podhuštěné pneu plně naložené dodávky se přehřívají a mohou se roztrhnout.', 'Under-inflated tyres on a fully loaded van overheat and can burst.') }] },
      { id: 'springs', anim: 'van-care.springs', title: V('Kontrola zadních per', 'Check the rear springs'), body: V('S dodávkou na stojanech (vyložená) prohlédněte listová pera: praskliny listů, posunuté listy, opotřebené silentbloky v oku a závěsu, uvolněné třmeny (U-šrouby), rez mezi listy.', 'With the van on stands (unloaded) inspect the leaf springs: cracked leaves, shifted leaves, worn bushes in the eye and shackle, loose U-bolts, rust between the leaves.'), notes: [{ level: 'danger', text: V('Prasklé pero = nejezdit naložený, vyměnit (v páru na nápravě).', 'A broken leaf = do not drive loaded, replace (in pairs on the axle).') }, { level: 'info', text: V('Provedení zadního zavěšení (počet listů, pomocná pera) ověřte pro váš vůz.', 'Verify the rear suspension version (number of leaves, helper springs) for your van.'), verify: true }] },
      { id: 'slider', anim: 'van-care.slider', title: V('Posuvné dveře: čištění a mazání', 'Sliding door: clean and lubricate'), body: V('Vyčistěte horní, střední a spodní kolejnici, odstraňte písek a nečistoty. Na kolejnice a válečky naneste tenkou vrstvu maziva. Zkontrolujte zámek a zachycovač v otevřené poloze.', 'Clean the upper, centre and lower rails and remove grit and dirt. Apply a thin film of lubricant to the rails and rollers. Check the lock and the open-position catch.'), notes: [{ level: 'caution', text: V('Mazivo nedávejte na gumová těsnění a nepoužívejte přemíru – chytá prach.', 'Keep lubricant off the rubber seals and do not overdo it – it attracts dust.') }] },
      { id: 'rust', anim: 'van-care.rust', title: V('Ochrana podvozku proti korozi', 'Underbody corrosion protection'), body: V('Podvozek umyjte (i od soli), nechte vyschnout. Povrchovou rez odstraňte kartáčem a ošetřete konvertorem, pak naneste ochranný vosk. Kritická místa X250: lemy blatníků, prahy, spodky dveří, kotvení per (ověřit).', 'Wash the underbody (incl. salt) and let it dry. Remove surface rust with a brush and treat with converter, then apply protection wax. X250 critical spots: arch lips, sills, door bottoms, spring mounts (verify).'), notes: [{ level: 'danger', text: V('Vosk ani olej nesmí na brzdy, výfuk (požár), pístnice tlumičů a řemeny.', 'No wax or oil on the brakes, exhaust (fire), shock rods or belts.') }, { level: 'info', text: V('Prorezlé nosné části (rám, kotvení per) jsou na STK vážná závada – řešte v karosárně (návod Svařování).', 'Rusted-through load-bearing parts (frame, spring mounts) are a serious inspection defect – a body shop job (Welding tutorial).') }] },
      { id: 'cavity', anim: 'van-care.cavity', title: V('Dutinový vosk', 'Cavity wax'), body: V('Nejdřív pročistěte odtokové otvory v prazích a dveřích. Pak sondou se 360° tryskou nastříkejte dutinový vosk do prahů, sloupků a spodků dveří – sondu zasuňte a pomalu vytahujte.', 'First clear the drain holes in the sills and doors. Then spray cavity wax into the sills, pillars and door bottoms with a 360° wand – push the wand in and pull it out slowly.') },
      { id: 'load', anim: 'van-care.load', title: V('Zajištění nákladu', 'Securing the load'), body: V('Náklad opřete o přepážku a zajistěte popruhy do kotevních ok. Používejte certifikované popruhy s dostatečnou nosností a kontrolujte je (natržení, poškozená ráčna).', 'Rest the load against the bulkhead and strap it to the lashing points. Use certified straps with sufficient capacity and inspect them (tears, damaged ratchet).'), notes: [{ level: 'danger', text: V('Při nouzovém brzdění působí náklad mnohonásobkem své hmotnosti – nezajištěná paleta prorazí přepážku.', 'In an emergency stop the load acts with many times its weight – an unsecured pallet can break through the bulkhead.') }] },
      { id: 'checks', anim: 'van-care.checks', title: V('Pravidelná týdenní kontrola', 'Regular weekly check'), body: V('U dodávky s vysokým nájezdem stačí 10 minut týdně: olej, chladicí kapalina, pneu, světla, stěrače, pohled pod vůz (úniky, pera), dveře a upevnění nákladu.', 'For a high-mileage van 10 minutes a week is enough: oil, coolant, tyres, lights, wipers, a look underneath (leaks, springs), doors and load securing.'), notes: [{ level: 'tip', text: V('Servisní interval pro „těžký provoz“ bývá kratší – ověřte v servisním plánu.', 'The service interval for "severe use" is often shorter – verify in the service schedule.'), verify: true }] }
    ],
    vehicles: {
      'citroen-jumper-22hdi': {
        status: 'ok',
        specs: [
          { label: V('Zadní náprava', 'Rear axle'), value: V('tuhá náprava s listovými pery (ověřit provedení)', 'rigid axle with leaf springs (verify version)'), verify: true },
          { label: V('Posuvné dveře', 'Sliding door'), value: V('vpravo (dle verze i vlevo)', 'right side (on some versions also left)'), verify: true }
        ],
        notes: [{ level: 'info', text: V('Jumper III je technicky shodný s Fiat Ducato a Peugeot Boxer – díly a návody k nim pomohou.', 'The Jumper III is technically identical to the Fiat Ducato and Peugeot Boxer – their parts and guides help.') }]
      }
    }
  });
})(window.STU);
