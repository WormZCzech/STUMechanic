/* Tutorial: plastic bumper crack repair + paintless dent repair (PDR) basics. */
(function (S) {
  'use strict';
  var V = function (cs, en) { return { cs: cs, en: en }; };

  S.registerTutorial({
    id: 'plastic-pdr',
    level: 3,
    thumb: 'plastic-pdr.glue',
    status: 'caution',
    time: V('3–6 h + schnutí', '3–6 h + curing'),
    title: V('Oprava plastového nárazníku a vytahování promáčklin (PDR)', 'Plastic bumper repair & paintless dent repair (PDR)'),
    summary: V('Prasklý nárazník svařit sponkami nebo slepit se síťkou. Malé promáčkliny vytáhnout bez lakování.', 'Weld a cracked bumper with staples or bond it with mesh. Pull small dents without repainting.'),
    intro: V(
      'Prasklý plastový nárazník často nemusí do koše: prasklinu lze **zpevnit z rubu** (horké sponky nebo 2K lepidlo se síťkou) a z líce zatmelit pružným tmelem.\n\nMalé hladké promáčkliny na plechu bez poškozeného laku se dají **vytáhnout metodou PDR** (paintless dent repair) – lepicím terčem a vyrovnáním. Ostré lomy, natažený plech a poškozený lak patří do **Klempířských prací** nebo karosárny.',
      'A cracked plastic bumper often does not need replacing: the crack can be **reinforced from behind** (hot staples or 2K adhesive with mesh) and filled from the front with flexible filler.\n\nSmall, smooth dents in metal with undamaged paint can be **pulled with PDR** (paintless dent repair) – a glue tab and knockdown. Sharp creases, stretched metal and damaged paint belong in **Bodywork** or a body shop.'
    ),
    safety: [
      { level: 'danger', text: V('**Senzory a radary v nárazníku:** v zóně radaru (adaptivní tempomat, nouzové brzdění) nic neopravujte, netmelte a nepřelakovávejte silnou vrstvou – asistent pak může selhat. Po zásahu do nárazníku může být nutná kalibrace.', '**Sensors and radars in the bumper:** do not repair, fill or thickly repaint the radar zone (adaptive cruise, emergency braking) – the assist may then fail. After bumper work calibration may be required.') },
      { level: 'warning', text: V('Horká sponkovačka a sponky mají stovky °C – rukavice, odkládat na stojánek, nesahat na čerstvé sponky.', 'The hot stapler and staples reach hundreds of °C – gloves, put it on its stand, do not touch fresh staples.') },
      { level: 'warning', text: V('Broušení plastů a tmelů: respirátor P2/P3, brýle. Promotor a lepidla: rukavice, větrání, daleko od ohně.', 'Sanding plastics and fillers: P2/P3 respirator, glasses. Promoter and adhesives: gloves, ventilation, away from flames.') },
      { level: 'caution', text: V('Nárazník sundejte jen s jistotou, že víte, kde jsou úchyty a konektory (mlhovky, senzory, ostřikovače). Fotky před demontáží.', 'Remove the bumper only when you know where the clips and connectors are (fog lights, sensors, washers). Take photos before removal.') },
      { level: 'info', text: V('Utržené úchyty, chybějící kusy nebo poškozená výztuha za nárazníkem = nový díl. Výztuhu a absorbér po nárazu vždy zkontrolujte.', 'Torn mounting tabs, missing pieces or a damaged reinforcement behind the bumper = new part. Always check the reinforcement and absorber after an impact.') }
    ],
    tools: [
      V('Horká sponkovačka na plasty + sponky (vlnité / V)', 'Hot plastic stapler + staples (wave / V)'),
      V('2K lepidlo na plasty + pistole, výztužná síťka', '2K plastic adhesive + gun, reinforcement mesh'),
      V('Vrtačka s vrtákem 3 mm, bruska / brusný papír P80–P320', 'Drill with 3 mm bit, sander / P80–P320 paper'),
      V('PDR sada: lepicí terče, tavná pistole, tahák (slide hammer / most)', 'PDR kit: glue tabs, hot glue gun, puller (slide hammer / bridge)'),
      V('Reflexní deska / pruhovaná LED lampa', 'Reflection board / striped LED lamp'),
      V('Plastový průbojník (knockdown) a lehké kladívko', 'Plastic knockdown and light hammer'),
      V('Izopropylalkohol, antisilikon', 'Isopropyl alcohol, silicone remover'),
      V('Respirátor P2/P3, rukavice, brýle', 'P2/P3 respirator, gloves, glasses')
    ],
    parts: [
      V('Promotor přilnavosti na plasty', 'Plastic adhesion promoter'),
      V('Pružný tmel na plasty', 'Flexible plastic filler'),
      V('Plnič s pružnou přísadou, barva, lak (viz Klempířské práce)', 'Primer with flex additive, paint, clear coat (see Bodywork)')
    ],
    finalChecks: [
      V('Prasklina zpevněná z rubu, konce provrtané', 'Crack reinforced from behind, ends drilled'),
      V('Senzory / radar nepřetmelené, funkční (bez chyb)', 'Sensors / radar not filled over, working (no faults)'),
      V('Asistenty po případné kalibraci zkontrolovány', 'Driver assists checked after any calibration'),
      V('Promáčklina na desce rovná, lak bez trhlin', 'Dent straight on the board, paint without cracks'),
      V('Nárazník pevně uchycený, mezery rovnoměrné', 'Bumper firmly fitted, gaps even')
    ],
    steps: [
      { id: 'assess', anim: 'plastic-pdr.assess', title: V('Posuďte poškození', 'Assess the damage'),
        body: V('Prasklina do ~10 cm bez chybějících kusů a s celými úchyty = oprava má smysl. Zkontrolujte také výztuhu a absorbér za nárazníkem.', 'A crack up to ~10 cm with no missing pieces and intact tabs = worth repairing. Also check the reinforcement and absorber behind the bumper.'),
        notes: [{ level: 'warning', text: V('Poškození v místě senzoru / radaru = raději nový díl a kalibrace.', 'Damage at a sensor / radar = better a new part and calibration.') }] },
      { id: 'identify', anim: 'plastic-pdr.identify', title: V('Zjistěte typ plastu', 'Identify the plastic'),
        body: V('Na rubu nárazníku je značka materiálu, např. **>PP<, >PP-EPDM<, >ABS<, >PC/PBT<**. Podle ní vyberte sponky, lepidlo a promotor.', 'The back of the bumper carries a material code, e.g. **>PP<, >PP-EPDM<, >ABS<, >PC/PBT<**. Choose staples, adhesive and promoter by it.'),
        notes: [{ level: 'tip', text: V('Na nárazník se dostanete lépe po demontáži – zezadu se opravuje pohodlněji a kvalitněji.', 'Removing the bumper gives better access – repairing from behind is easier and better.') }] },
      { id: 'sensors', anim: 'plastic-pdr.sensors', title: V('Najděte senzory a zónu radaru', 'Locate the sensors and radar zone'),
        body: V('Označte si parkovací senzory, kamery a oblast radaru. Senzory před broušením / sponkováním vyndejte z držáků a konektory odpojte.', 'Mark parking sensors, cameras and the radar area. Remove the sensors from their holders and unplug them before sanding / stapling.'),
        notes: [{ level: 'danger', text: V('V zóně radaru žádný tmel ani silný lak. Při pochybnostech kalibrace v servisu.', 'No filler or thick paint in the radar zone. When in doubt, calibration at a dealer.') }] },
      { id: 'prep', anim: 'plastic-pdr.prep', title: V('Provrtejte konce a připravte prasklinu', 'Drill the ends and prepare the crack'),
        body: V('Odmastěte. Na koncích praskliny vyvrtejte **otvory Ø 3 mm** (prasklina se nebude šířit). Z líce vybruste drážku do V, okolí zmatněte P80–P120.', 'Degrease. Drill **3 mm holes** at the crack ends (stops it spreading). From the front grind a V-groove and key the area with P80–P120.') },
      { id: 'staple', anim: 'plastic-pdr.staple', title: V('Zpevněte sponkami z rubu', 'Reinforce with staples from behind'),
        body: V('Zarovnejte okraje praskliny. Horké sponky zatlačte do plastu **napříč prasklinou ~1 cm od sebe**, do poloviny tloušťky. Vyčnívající konce zastřihněte a zabruste.', 'Align the crack edges. Press the hot staples into the plastic **across the crack ~1 cm apart**, half the thickness deep. Snip and grind the protruding ends.'),
        notes: [{ level: 'warning', text: V('Sponky nepropichovat skrz na lícovou stranu.', 'Do not push staples through to the front face.') }] },
      { id: 'adhesive', anim: 'plastic-pdr.adhesive', title: V('Nebo: 2K lepidlo se síťkou', 'Or: 2K adhesive with mesh'),
        body: V('Alternativa ke sponkám: rub zdrsnit, nanést promotor, přiložit výztužnou síťku a zalít **2K lepidlem na plasty**. Dodržte dobu zpracovatelnosti a tuhnutí.', 'Alternative to staples: key the back, apply promoter, place the reinforcement mesh and cover with **2K plastic adhesive**. Respect pot life and curing time.') },
      { id: 'filler', anim: 'plastic-pdr.filler', title: V('Promotor a pružný tmel', 'Promoter and flexible filler'),
        body: V('Z líce naneste **promotor přilnavosti**, pak **pružný tmel na plasty** do drážky. Po vytvrzení brousit P180 → P320 a pokračovat plničem s pružnou přísadou a lakem (viz Klempířské práce).', 'From the front apply **adhesion promoter**, then **flexible plastic filler** into the groove. When cured sand P180 → P320 and continue with flex-additive primer and paint (see Bodywork).'),
        notes: [{ level: 'caution', text: V('Tvrdý tmel na ocel na nárazníku popraská při prvním ťuknutí.', 'Hard steel filler cracks on a bumper at the first knock.') }] },
      { id: 'pdrBoard', anim: 'plastic-pdr.pdrBoard', title: V('PDR: zviditelněte promáčklinu', 'PDR: reveal the dent'),
        body: V('Pruhovanou desku nebo LED lampu nasměrujte tak, aby se pruhy zrcadlily přes promáčklinu. Zkřivené pruhy ukazují tvar a střed promáčkliny.', 'Aim a striped board or LED lamp so the stripes reflect across the dent. Bent stripes show the shape and centre of the dent.'),
        notes: [{ level: 'info', text: V('PDR jen pro hladké promáčkliny s neporušeným lakem, ne na hranách a lomech.', 'PDR only for smooth dents with intact paint, not on edges and creases.') }] },
      { id: 'glue', anim: 'plastic-pdr.glue', title: V('Vytáhněte lepicím terčem', 'Pull with a glue tab'),
        body: V('Místo odmastěte izopropylalkoholem, nalepte terč horkým lepidlem do středu promáčkliny, nechte zatuhnout a **táhněte po malých krocích**. Lepidlo uvolněte alkoholem.', 'Clean with isopropyl alcohol, glue the tab into the dent centre with hot glue, let it set and **pull in small steps**. Release the glue with alcohol.'),
        notes: [{ level: 'warning', text: V('Na čerstvém nebo opravovaném laku může lepidlo lak vytrhnout.', 'On fresh or refinished paint the glue can rip the paint off.') }] },
      { id: 'knock', anim: 'plastic-pdr.knock', title: V('Srovnejte vyvýšená místa', 'Knock down the high spots'),
        body: V('Po tahu vzniknou vyvýšená místa kolem. Plastovým průbojníkem a lehkými údery je srovnejte, průběžně kontrolujte na desce. Opakujte tah a srovnání, dokud nejsou pruhy rovné.', 'Pulling leaves high spots around the dent. Tap them down with a plastic knockdown and light blows, checking on the board. Repeat pulling and knocking until the stripes are straight.') }
    ],
    vehicles: {
      'mb-cl500-c216': {
        status: 'caution',
        notes: [
          { level: 'warning', text: V('Hliníkové panely (kapota, blatníky, dveře, víko) jsou na PDR citlivější a hůř se tvarují – jen malé promáčkliny, jinak specialista.', 'Aluminium panels (bonnet, wings, doors, lid) are more delicate for PDR and harder to shape – small dents only, otherwise a specialist.'), verify: true },
          { level: 'info', text: V('Parkovací senzory a případně radar (Distronic) v předním nárazníku – po zásahu ověřit funkci / kalibraci.', 'Parking sensors and possibly radar (Distronic) in the front bumper – check function / calibration after work.'), verify: true }
        ]
      },
      'volvo-xc60-b4': {
        status: 'caution',
        notes: [
          { level: 'danger', text: V('Radar za předním nárazníkem / maskou: v jeho zóně neopravovat ani netmelit. Po demontáži nárazníku kalibrace ADAS ve VIDA.', 'Radar behind the front bumper / grille: no repair or filler in its zone. After bumper removal ADAS calibration in VIDA.'), verify: true },
          { level: 'warning', text: V('BLIS radary v rohách zadního nárazníku – oprava v jejich okolí jen s kalibrací.', 'BLIS radars in the rear bumper corners – repairs near them only with calibration.'), verify: true }
        ]
      },
      'skoda-octavia-rs-tdi': {
        status: 'ok',
        notes: [{ level: 'info', text: V('Nárazník RS z PP-EPDM – ověřte značku na rubu. Parkovací senzory (jsou-li) vyndat před opravou.', 'RS bumper made of PP-EPDM – verify the code on the back. Remove parking sensors (if fitted) before repairing.'), verify: true }]
      },
      'toyota-gr-yaris': {
        status: 'caution',
        notes: [
          { level: 'warning', text: V('Hliníkové dveře, kapota a víko: PDR jen velmi opatrně / specialista. Kompozitovou střechu PDR neopravovat.', 'Aluminium doors, bonnet and tailgate: PDR only very carefully / specialist. Never PDR the composite roof.'), verify: true },
          { level: 'info', text: V('Spodní spoiler a difuzor často trpí od obrubníků – při prasklinách zvažte výměnu (aerodynamické díly).', 'The lower splitter and diffuser often suffer from kerbs – consider replacing cracked aero parts.') }
        ]
      },
      'citroen-jumper-22hdi': {
        status: 'ok',
        notes: [
          { level: 'info', text: V('Nárazníky jsou z nelakovaného černého plastu – stačí zpevnit, tmel nemusí být a lakování odpadá.', 'Bumpers are unpainted black plastic – reinforcing is enough, filler and paint are not needed.'), verify: true },
          { level: 'caution', text: V('Velké tenké panely dodávky se při PDR snadno „přetáhnou“ – jen po malých krocích.', 'Large thin van panels easily get over-pulled with PDR – small steps only.') }
        ],
        steps: {
          filler: { body: V('U černého texturovaného nárazníku stačí rub zpevnit; z líce jen zarovnat. Texturu lze napodobit strukturovým sprejem na plasty.', 'On a black textured bumper reinforcing the back is enough; just level the front. Texture can be imitated with plastic texture spray.') }
        }
      }
    }
  });
})(window.STU);
