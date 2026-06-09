/**
 * Trusted static HTML for the "What Is Tube Laser Cutting?" blog post.
 * Images live in /public/blog/tube_laser_post/
 */
export const tubeLaserPostBodyHtml = `
      <p>Most tube and HSS on a commercial job still gets processed the old way: saw it to length, drill the holes, cope the connections by hand, deburr, then hope it fits in the welding bay.</p>
      <p>That works until it doesn't. A post base that misses the anchor bolt pattern by half an inch. Stringers that don't land on the connection the way the shop drawing showed. A mitered railing corner with a gap a welder has to fill with buildup.</p>
      <p>Those problems usually trace back to how the tube was cut — not to the welder.</p>
      <p>Tube laser cutting is a CNC process that cuts, miters, slots, and holes tube and pipe in one setup. If you have HSS, pipe railings, or complex tube connections on your project, it helps to know what it does and when it actually matters.</p>

      <h2>What Is Tube Laser Cutting?</h2>
      <p>A tube laser uses a fiber laser beam to cut metal tube, pipe, and HSS. The tube sits in a rotary chuck that spins and feeds the stock. The laser reaches every face of the profile without someone repositioning it by hand.</p>
      <p>There is no blade. The laser melts or vaporizes metal along a programmed path. A single part can come off the machine with:</p>
      <ul>
        <li>Mitered or square end cuts</li>
        <li>Copes and notches for tube-to-tube connections</li>
        <li>Through-holes, slots, and bolt patterns</li>
        <li>Tab-and-slot joints</li>
        <li>Contoured cuts on round, square, or rectangular HSS</li>
      </ul>
      <p>Most shops running tube lasers today use fiber laser machines. They handle carbon steel, stainless, and aluminum tube within the machine's size and wall-thickness limits.</p>
      <p>The useful way to think about it: one machine replaces the saw line, the drill press, and the layout table for parts that would otherwise bounce between three setups.</p>

      <h2>How Tube Laser Cutting Works</h2>
      <p>The workflow is straightforward.</p>
      <h3>Loading</h3>
      <p>Standard stick lengths of tube or pipe go into the machine's feed system. Machine capacity varies by shop — small handrail tube up through larger structural HSS.</p>
      <h3>Programming</h3>
      <p>Cut paths come from CAD or CAM files. Parts get nested along the length of a stick to cut scrap. Laser kerf is narrow — usually under 0.5 mm — so you get more parts per length than a saw blade allows.</p>
      <h3>Cutting</h3>
      <p>The chuck rotates and indexes while the laser runs. A part that would need a miter cut, a cope, and a row of bolt holes on a traditional line comes out in one cycle.</p>
      <h3>Downstream</h3>
      <p>Parts go to welding, coating, or assembly. Edges are clean enough that fit-up in the bay is faster — assuming the detailing was right to begin with.</p>
      <figure class="blog-media-slot">
        <img src="/blog/tube_laser_post/tube-laser-process.png" alt="Steel fabrication shop floor with tube and HSS work in progress." loading="lazy" />
        <figcaption>Tube laser work happens in the shop before parts hit the welding bay — which is where fit problems get expensive to fix.</figcaption>
      </figure>

      <h2>Tube Laser vs. Saw, Drill, and Layout</h2>
      <p>Tube lasers don't replace everything in the shop. But they replace a lot of the multi-step work that adds tolerance at every handoff.</p>
      <h3>Cold saw and band saw</h3>
      <p>Good for straight length cuts. Fast, simple, handles a wide size range. Leaves burrs. Can't cope a tube-to-tube joint or cut a slot without a second operation. Miter accuracy depends on the setup — and the operator.</p>
      <h3>Drill press and punch</h3>
      <p>Fine for a row of holes on one face. Gets slow when the pattern wraps around the tube, lands on an angle, or has to match a connection detail on the opposite face. Fixture time adds up.</p>
      <h3>Plasma and oxy-fuel</h3>
      <p>Useful for heavy wall pipe and rough work. Wider kerf, rougher edge, looser tolerances than laser. Not what you want on a visible railing miter or a bolt pattern that has to hit cast-in anchors.</p>
      <h3>Where a tube laser earns its keep</h3>
      <ul>
        <li>Parts with miters, holes, and copes that would otherwise need multiple setups</li>
        <li>Runs of identical parts — posts, stringers, frame members</li>
        <li>Work where field fit is tight and a remake costs you a week</li>
        <li>Visible joints that have to close clean without a bunch of weld fill</li>
      </ul>
      <h3>Where a saw still makes more sense</h3>
      <ul>
        <li>Plain square cuts, no secondary features</li>
        <li>Heavy wall pipe beyond what the laser can handle</li>
        <li>One-off parts where programming time costs more than cutting time</li>
        <li>Anything you're modifying in the field during install</li>
      </ul>

      <h2>Tolerances and Field Fit</h2>
      <p>Fabrication mistakes are cheap in the shop. On site they cost schedule.</p>
      <p>A stair stringer that doesn't land on its connection holds up drywall in the stairwell. A guardrail post pattern that doesn't match the embed layout means field drilling or a remake. A coped tube joint with too much gap means excess weld metal and a connection that looks bad even if it passes.</p>
      <p>Tube lasers hold repeatability across a run — miter angles, hole locations, cope profiles. Modern fiber systems typically hold ±0.1 mm on cut features. That matters on:</p>
      <ul>
        <li>Mitered stringers and railing frames</li>
        <li>Post base hole patterns tied to anchor bolt layouts in concrete</li>
        <li>Coped tube-to-tube connections that need to close without shimming</li>
        <li>Tab-and-slot assemblies that have to go together without forcing</li>
      </ul>
      <p>Every manual setup between saw, drill, and layout table adds tolerance. A tube laser cuts most of that stack-up out before the part gets to the welder.</p>
      <figure class="blog-media-slot">
        <img src="/blog/tube_laser_post/tube-cut-detail.png" alt="Close-up of a cut steel tube connection on a stair or railing fabrication job." loading="lazy" />
        <figcaption>Fit problems discovered during installation are the expensive ones. Most of them start upstream in how the tube was cut.</figcaption>
      </figure>

      <h2>Where You See It on Commercial Jobs</h2>
      <p>Tube laser work shows up across miscellaneous metals and structural-adjacent scopes — not just one product type.</p>
      <h3>Pipe and tube railings</h3>
      <p>Posts need consistent length, mitered corners, and base plate holes that line up with anchors. A tube laser cuts all of that per part without moving the piece between machines. For context on how this scope fits a commercial package, see <a href="/blog/what-is-a-miscellaneous-metals-contractor">what a miscellaneous metals contractor actually builds</a>.</p>
      <h3>Stair stringers</h3>
      <p>HSS and tube stringers often need mitered ends, coped landing connections, and hole patterns for tread brackets. Laser-cut stringers stay matched as pairs — which matters when you're setting steel in a stairwell with limited access.</p>
      <h3>HSS frames</h3>
      <p>Shade structures, pergolas, canopies, and architectural frames built from HSS use mitered joints and tab-and-slot connections that need to repeat accurately across a run. Our Firefly Entrance Arch used a hidden HSS core inside Corten panels — tube and plate work on the same job, both needing tight fit.</p>
      <h3>Gates and enclosures</h3>
      <p>Dumpster gates and site enclosures are repetitive tube frame work. Same post, same hole pattern, same miter — twenty times across a multi-bay enclosure. Batch cutting keeps those parts consistent.</p>
      <h3>Platforms and access structures</h3>
      <p>Mezzanine framing, equipment platforms, and roof access structures use angled cuts, copes, and bolt patterns that are faster to laser-cut than to lay out by hand on every piece.</p>
      <figure class="blog-media-slot">
        <img src="/blog/tube_laser_post/hss-railing-application.jpg" alt="Pipe and tube guardrail being installed on a commercial project." loading="lazy" />
        <figcaption>Pipe and tube railings are the most common place tube cutting quality shows up — or doesn't — during installation.</figcaption>
      </figure>

      <h2>What to Put on the Drawings</h2>
      <p>If you're writing a scope or reviewing shop drawings for tube work, these are the details fabricators need to quote and cut correctly.</p>
      <h3>Material and profile</h3>
      <ul>
        <li>Shape: round, square, or rectangular HSS</li>
        <li>Outside dimensions and wall thickness (e.g., 2" × 2" × 14 ga HSS)</li>
        <li>Grade: A500 Gr. B/C for HSS, A53 for pipe, 304/316 for stainless</li>
        <li>Finish: bare, primed, painted, powder coat, or galvanized</li>
      </ul>
      <h3>Cut details</h3>
      <ul>
        <li>End cuts: square, mitered (state the angle), or coped (show the connection)</li>
        <li>Holes and slots: size, location reference, which face of the tube</li>
        <li>Tab-and-slot or other locating joint details</li>
      </ul>
      <h3>Tolerances and connections</h3>
      <ul>
        <li>Fabrication tolerances per AISC Code of Standard Practice, or tighter if the project requires it</li>
        <li>Connection details showing how members meet at joints</li>
        <li>Anchor bolt layouts for post bases — these have to match what's cast in the concrete</li>
      </ul>
      <h3>Lead time</h3>
      <p>Laser cutting speeds up the cutting side. It doesn't shorten detailing, submittal review, or material procurement. Flag long-lead tube sizes early. If you're vetting a fabricator's timeline, see <a href="/blog/choose-steel-fabricator-utah">10 things to verify before awarding custom steel work in Utah</a>.</p>

      <h2>When It's Worth Using — and When It Isn't</h2>
      <p>Use a tube laser when the part has enough features that consolidating setups saves real time and reduces fit risk. Skip it when a saw cut is all you need.</p>
      <p>Good candidates: multi-feature parts, production quantities, tight field-fit requirements, visible architectural joints, stainless or aluminum where clean edges save finishing labor.</p>
      <p>Poor candidates: simple length cuts, one-off parts with no secondary features, heavy wall pipe past machine limits, anything you're modifying on site after delivery.</p>

      <h2>Tube Laser Work on Utah Projects</h2>
      <p>Multifamily, mixed-use, office, and campus work across the Wasatch Front generates a lot of tube and HSS scope — stairs, guardrails, canopies, shade structures, custom architectural steel.</p>
      <p>Most Wasatch Front commercial projects fall in Seismic Design Category D. That affects connection design on stairs, platforms, and mezzanines. Connections that fit on the first install aren't a nice-to-have when inspection and finish trades are waiting on the misc metals package.</p>
      <p>The fabricator question is simple: how does your shop process tube work, and can you show me parts that fit the way the drawings say they should?</p>

      <h2>Final Thoughts</h2>
      <p>Tube laser cutting doesn't replace every tool in the shop. It replaces the saw-drill-layout loop on parts complex enough to benefit from one-setup processing.</p>
      <p>If your scope has miters, copes, bolt patterns, or a run of identical tube parts, ask your fabricator how they're cutting it. The answer will tell you a lot about what install day looks like.</p>
      <p>Working on a Utah project with tube railings, HSS framing, stairs, or custom steel? <a href="/contact">Contact us</a> and we can talk through what your scope needs.</p>
    `;
