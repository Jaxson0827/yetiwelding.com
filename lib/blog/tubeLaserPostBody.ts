/**
 * Trusted static HTML for the "What Is Tube Laser Cutting?" blog post.
 * Images live in /public/blog/tube_laser_post/
 */
export const tubeLaserPostBodyHtml = `
      <p>On most commercial steel projects, tube and HSS work still moves through the shop the same way it has for decades: saw to length, drill or punch holes, notch or cope by hand, deburr, then fit in the welding bay.</p>
      <p>Each step adds tolerance. Each handoff adds time. And on stairs, railings, and miscellaneous metals packages, those small errors compound into field fit problems that show up during installation — not during fabrication.</p>
      <p>Tube laser cutting changes that equation. It replaces multiple traditional operations with a single CNC-controlled process that cuts, miters, slots, and holes tube and pipe in one setup.</p>
      <p>This guide explains what tube laser cutting is, how it works, how it compares to sawing and drilling, where it matters on commercial steel projects, and what contractors and architects should know when specifying tube work.</p>
      <p><strong>If your project includes HSS, pipe railings, or complex tube connections, understanding this process is worth your time.</strong></p>

      <h2>What Is Tube Laser Cutting?</h2>
      <p>Tube laser cutting is a non-contact, CNC-controlled fabrication process that uses a high-energy laser beam to cut metal tube, pipe, and open structural profiles.</p>
      <p>Unlike a cold saw or band saw — which physically removes material with a blade — a tube laser melts or vaporizes metal along a programmed path. The tube is held in a rotary chuck that can rotate and advance the workpiece, allowing the laser to reach every face of the profile without manual repositioning.</p>
      <p>The result is a finished part that may include:</p>
      <ul>
        <li>Square or angled end cuts (miters)</li>
        <li>Coped or notched connections for tube-to-tube joints</li>
        <li>Through-holes, slots, and keyholes</li>
        <li>Tab-and-slot self-locating joints</li>
        <li>Complex contour cuts on round, square, and rectangular HSS</li>
      </ul>
      <p>Modern tube laser systems use fiber laser technology — efficient, low-maintenance, and well-suited to cutting carbon steel, stainless steel, and aluminum tube.</p>
      <p><strong>In practice, tube laser cutting is less a "faster saw" and more a process consolidation platform: one machine, one setup, multiple operations.</strong></p>

      <h2>How Tube Laser Cutting Works</h2>
      <p>A typical CNC tube laser workflow follows a predictable sequence from raw stock to finished part.</p>
      <h3>1. Material loading</h3>
      <p>Standard-length tube or pipe stock is loaded into the machine's feeding system. Most systems handle round tube, square HSS, rectangular HSS, and pipe within a defined size range — typically from small handrail tube up to large structural HSS sections.</p>
      <h3>2. Programming and nesting</h3>
      <p>Cut paths are programmed from CAD or CAM files. Multiple parts can be nested along a single length of stock to minimize waste. Because the laser kerf is narrow — often under 0.5 mm — material utilization is significantly better than traditional saw cutting.</p>
      <h3>3. Laser cutting</h3>
      <p>The fiber laser follows the programmed path while the chuck rotates and indexes the tube. Cuts that would require multiple setups on a saw-and-drill line — a mitered end, a coped joint, and a row of bolt holes — are completed in a single automated sequence.</p>
      <h3>4. Unloading and downstream work</h3>
      <p>Finished parts are unloaded and move to welding, coating, or assembly. Because edges are clean and dimensions are consistent, fit-up in the welding bay is faster and more repeatable than with manually processed tube.</p>
      <figure class="blog-media-slot">
        <img src="/blog/tube_laser_post/tube-laser-process.jpg" alt="Steel fabrication shop floor showing CNC-controlled tube and HSS processing for commercial metalwork." loading="lazy" />
        <figcaption>Tube laser cutting consolidates sawing, drilling, and notching into one CNC operation — reducing tolerance stack-up before parts reach the welding bay.</figcaption>
      </figure>

      <h2>Tube Laser vs. Traditional Tube Processing</h2>
      <p>Understanding where tube laser cutting fits requires comparing it to the methods it replaces — and recognizing where those traditional methods still make sense.</p>
      <h3>Cold saw and band saw</h3>
      <p>Saws cut tube to length efficiently and handle a wide range of sizes. But they leave burrs that require deburring, cannot produce complex copes or slots without secondary operations, and struggle with tight angular tolerances on miter cuts. Each additional feature — a hole pattern, a notch, a slot — means another setup on another machine.</p>
      <h3>Drill press and punch</h3>
      <p>Drilling holes in tube is straightforward for simple patterns on accessible faces. It becomes slow and imprecise when holes must land on multiple faces, at angles, or in patterns that wrap around the profile. Fixture setup time dominates on complex parts.</p>
      <h3>Plasma and oxy-fuel cutting</h3>
      <p>These processes handle heavy wall pipe and plate-adjacent work, but produce wider kerfs, rougher edges, and wider tolerance bands than laser cutting. They are better suited to rough cutting and heavy structural work than to precision tube connections.</p>
      <h3>Where tube laser wins</h3>
      <ul>
        <li><strong>Complex geometry:</strong> Mitered joints, coped connections, and multi-face hole patterns in one setup</li>
        <li><strong>Tight tolerances:</strong> Repeatable accuracy that reduces field fit problems</li>
        <li><strong>Batch production:</strong> Identical parts cut back-to-back with no setup change between pieces</li>
        <li><strong>Material efficiency:</strong> Narrow kerf and optimized nesting reduce scrap on expensive tube stock</li>
        <li><strong>Speed on complex parts:</strong> A part that needs sawing, drilling, notching, and deburring may take longer through traditional methods than through a single laser cycle</li>
      </ul>
      <h3>Where traditional methods still make sense</h3>
      <ul>
        <li>Simple length cuts on standard tube with no secondary features</li>
        <li>Very heavy wall pipe beyond typical laser system capacity</li>
        <li>One-off prototypes where programming time exceeds cutting time</li>
        <li>Field modifications during installation</li>
      </ul>
      <p><strong>The decision is not "laser or saw" — it is whether the part complexity justifies consolidating multiple operations into one process.</strong></p>

      <h2>Precision, Tolerances, and Why Fit-Up Matters on Site</h2>
      <p>On commercial projects, the cost of a fabrication error does not show up in the shop. It shows up on site — when a stair stringer does not land on its connection, when a guardrail post pattern does not align with embed anchors, or when a mitered tube joint leaves a gap that a welder cannot close without rework.</p>
      <p>Tube laser cutting produces consistent dimensions across a production run. Miter angles, hole locations, and cope profiles repeat within tight tolerances — typically within ±0.1 mm on modern fiber laser systems.</p>
      <p>That consistency matters because:</p>
      <ul>
        <li><strong>Mitered tube connections</strong> on stair stringers and railing frames must close cleanly for structural and visual quality</li>
        <li><strong>Hole patterns</strong> in post bases must align with anchor bolt layouts cast into concrete — a mismatch means field drilling or remaking the part</li>
        <li><strong>Coped joints</strong> between tube members must fit without excessive weld fill, which distorts the connection and adds heat-affected zone issues</li>
        <li><strong>Slot-and-tab joints</strong> used in modular assemblies must locate precisely for the assembly to go together without forcing</li>
      </ul>
      <p>A fabricator who processes tube through multiple manual setups accumulates tolerance at each step. A tube laser eliminates most of that stack-up before the part reaches the welder.</p>
      <figure class="blog-media-slot">
        <img src="/blog/tube_laser_post/tube-cut-detail.jpg" alt="Close-up of precision-cut steel tube connection showing tight miter fit for commercial stair or railing fabrication." loading="lazy" />
        <figcaption>Precision tube cutting reduces field fit problems — the most expensive place to discover a dimensional error on a commercial project.</figcaption>
      </figure>

      <h2>Commercial Applications for Tube Laser Cutting</h2>
      <p>Tube laser cutting is not limited to one trade or product type. On commercial construction projects, it shows up across the miscellaneous metals scope and into structural-adjacent work.</p>
      <h3>Pipe and tube railings</h3>
      <p>Guardrails and handrails built from round or square tube require consistent post lengths, mitered corners, and base plate hole patterns that align with anchor bolts. Tube laser cutting handles all of these features in one pass per part. For a deeper look at how this scope fits into commercial projects, see our guide on <a href="/blog/what-is-a-miscellaneous-metals-contractor">what a miscellaneous metals contractor builds</a>.</p>
      <h3>Stair stringers and frames</h3>
      <p>Tube and HSS stringers often require mitered ends, coped connections to landings, and slot or bolt hole patterns for tread brackets. Processing these through a tube laser keeps stringer pairs matched and reduces installation time in the stairwell.</p>
      <h3>HSS structural frames and bracing</h3>
      <p>Architectural shade structures, pergolas, canopies, and feature frames built from HSS benefit from mitered joints and tab-and-slot connections that tube lasers produce accurately. The Firefly Entrance Arch — one of our landmark projects — used a hidden HSS structural core inside sculpted Corten panels, demonstrating how precision tube and plate work combine on complex structures.</p>
      <h3>Custom gates and enclosures</h3>
      <p>Commercial dumpster gates, entry gates, and site enclosures built from tube frames require repeated identical parts with hole patterns for hardware and infill panels. Batch cutting on a tube laser keeps those parts consistent across a multi-bay enclosure.</p>
      <h3>Platforms, mezzanines, and access structures</h3>
      <p>Tube and HSS used in mezzanine framing, equipment platforms, and roof access structures often includes angled cuts, coped connections, and bolt-hole patterns that are faster and more accurate through laser processing than through manual layout.</p>
      <figure class="blog-media-slot">
        <img src="/blog/tube_laser_post/hss-railing-application.jpg" alt="Pipe and tube guardrail installation on a commercial Utah project showing precision-fabricated steel railing components." loading="lazy" />
        <figcaption>Pipe and tube railings are one of the most common commercial applications where precision tube cutting directly affects installation speed and fit quality.</figcaption>
      </figure>

      <h2>What to Specify on Drawings for Tube Laser Work</h2>
      <p>If you are an architect, engineer, or GC writing a scope that includes tube or HSS fabrication, the following details help fabricators quote accurately and produce parts that match your intent.</p>
      <h3>Material and profile</h3>
      <ul>
        <li>Tube shape: round, square, or rectangular HSS</li>
        <li>Outside dimensions and wall thickness (e.g., 2" × 2" × 14 ga HSS)</li>
        <li>Material grade: A500 Gr. B/C for HSS, A53 for pipe, 304/316 for stainless</li>
        <li>Finish: bare steel, primed, painted, powder coated, or galvanized</li>
      </ul>
      <h3>Cut types</h3>
      <ul>
        <li>End cuts: square, mitered (include angle), or coped (include connection detail)</li>
        <li>Holes and slots: diameter, location reference, and which face of the tube</li>
        <li>Tab-and-slot or other self-locating joint details</li>
        <li>Contoured cuts on round tube (for decorative or structural profiles)</li>
      </ul>
      <h3>Tolerances and fit requirements</h3>
      <ul>
        <li>Standard fabrication tolerances per AISC Code of Standard Practice, or project-specific tolerances if tighter</li>
        <li>Connection details showing how tube members meet at joints</li>
        <li>Anchor bolt layouts for post bases — critical for alignment with embed plates cast in concrete</li>
      </ul>
      <h3>Lead time and procurement</h3>
      <p>Tube laser cutting reduces fabrication time on complex parts, but it does not eliminate detailing, submittal review, or material procurement. Long-lead tube sizes and specialty alloys should be identified early in the schedule. For guidance on vetting a fabricator's process and timeline, see <a href="/blog/choose-steel-fabricator-utah">10 things to verify before awarding custom steel work in Utah</a>.</p>

      <h2>When Tube Laser Cutting Is Worth It — and When It Is Not</h2>
      <h3>Worth it</h3>
      <ul>
        <li>Parts with multiple features (miters + holes + notches) that would otherwise require three or more setups</li>
        <li>Production runs of identical or similar parts — posts, stringers, frame members, brackets</li>
        <li>Projects where field fit tolerance is tight and rework on site is costly</li>
        <li>Architectural work where visible tube joints must close cleanly</li>
        <li>Stainless or aluminum tube where clean edges reduce finishing labor</li>
      </ul>
      <h3>Not worth it (or not the right tool)</h3>
      <ul>
        <li>Simple square cuts on standard tube — a saw is faster for plain length cuts</li>
        <li>Single one-off parts with no secondary features</li>
        <li>Very heavy wall pipe beyond the laser system's thickness capacity</li>
        <li>Field modifications — tube lasers are a shop process, not a site tool</li>
      </ul>
      <p><strong>The question is not whether tube laser cutting is better than every alternative. It is whether your parts are complex enough that consolidating operations saves time, reduces errors, and improves fit on site.</strong></p>

      <h2>Tube Laser Cutting on Utah Commercial Projects</h2>
      <p>Utah's commercial construction market — multifamily, mixed-use, office, data centers, and technology campuses across the Wasatch Front — generates significant tube and HSS scope in miscellaneous metals packages.</p>
      <p>Stairs, guardrails, canopies, shade structures, and custom architectural steel all depend on tube and HSS processed to consistent dimensions. As project complexity increases, the gap between fabricators who invest in precision tube processing and those who rely on manual methods becomes more visible — in submittal quality, fabrication speed, and installation fit.</p>
      <p>Utah's seismic design requirements (SDC D on most Wasatch Front projects) also affect how tube connections must be designed and fabricated. Connections that fit correctly on the first installation attempt are not just a quality preference — they are a schedule requirement when inspection and finish trades are waiting.</p>
      <p>Fabricators working in this market need the detailing capability to translate architect and engineer intent into shop-ready parts, and the fabrication equipment to produce those parts within the tolerances the project demands.</p>

      <h2>Final Thoughts</h2>
      <p>Tube laser cutting is one of the most significant process improvements in metal tube fabrication over the past decade. It does not replace every cutting method in the shop — but on complex commercial work, it replaces the tolerance stack-up and schedule risk that come from processing tube through saw, drill, and manual layout.</p>
      <p>For contractors and architects, the practical takeaway is straightforward: when your project includes tube or HSS with mitered joints, hole patterns, coped connections, or production quantities of identical parts, ask how your fabricator processes that work. The answer tells you a lot about what installation day will look like.</p>
      <p><strong>Precision in the shop prevents problems on site. Tube laser cutting is one of the tools that makes that possible.</strong></p>
      <p>If you have a commercial project in Utah that includes tube railings, HSS framing, stairs, or custom steel and want to discuss how your scope should be processed, <a href="/contact">contact us</a> and we can walk through it with you.</p>
    `;
