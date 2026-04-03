/**
 * Trusted static HTML for the Trimble LiDAR / SketchUp blog post.
 * Replace each .blog-media-slot-placeholder with <img src="/blog/posts/trimble-lidar/....jpg" alt="..." loading="lazy" /> when assets exist.
 * Video: embedded via privacy-enhanced YouTube iframe in body below.
 */
export const trimbleLidarPostBodyHtml = `
      <p>In steel fabrication, most costly mistakes don't come from welding or cutting. They come from bad measurements.</p>
      <p>Field dimensions taken with tape measures, missing conditions behind walls, uneven concrete, and undocumented site changes can all cause rework, delays, and expensive field fixes. Even small errors can compound when fabricating stairs, railings, embeds, or structural steel.</p>
      <p>Over the past few years, reality capture using LiDAR scanners has changed how fabrication companies can approach existing conditions. Instead of guessing or relying on incomplete drawings, fabricators can now model directly from highly accurate site data.</p>
      <p>This article explains a practical workflow for using a Trimble LiDAR scanner, importing the data into SketchUp, and detailing fabrication drawings directly from point clouds.</p>
      <p><strong>This is not theory. This is a real workflow fabrication shops can implement.</strong></p>

      <h2>Why LiDAR Scanning Changes Steel Fabrication</h2>
      <p>Traditional field measuring has limitations:</p>
      <ul>
        <li>You can only measure what you can physically reach</li>
        <li>You cannot easily verify squareness or plumbness</li>
        <li>You cannot capture complex geometry efficiently</li>
        <li>You cannot revisit the site digitally</li>
      </ul>
      <p>LiDAR scanning solves these problems by capturing millions of measurement points in minutes.</p>
      <p>Instead of individual dimensions, you get a full spatial dataset of the jobsite.</p>
      <p>This allows you to:</p>
      <ul>
        <li>Verify existing conditions before fabrication</li>
        <li>Design around real field tolerances</li>
        <li>Reduce change orders</li>
        <li>Prevent installation delays</li>
        <li>Create more accurate shop drawings</li>
      </ul>
      <figure class="blog-media-slot">
        <img src="/blog/Lidar_post_1/blogpost_scannerimage2.jpg" alt="Trimble LiDAR scanner capturing existing building conditions before steel detailing begins." loading="lazy" />
        <figcaption>Trimble LiDAR scanner capturing existing building conditions before steel detailing begins.</figcaption>
      </figure>

      <h2>Step 1 – Field Scanning Best Practices (Where Most People Fail)</h2>
      <p>Most problems with point cloud workflows actually start in the field, not in software.</p>
      <p><strong>Bad scans create bad models.</strong></p>
      <h3>Proper scan planning matters more than scan speed</h3>
      <p>Before scanning, determine:</p>
      <ul>
        <li>Where steel connects to structure</li>
        <li>Critical connection points</li>
        <li>Areas requiring tight tolerances</li>
        <li>Obstructions that may block line of sight</li>
      </ul>
      <p>Think like a fabricator, not a surveyor.</p>
      <p>You are not just capturing a building. You are capturing fabrication reference geometry.</p>
      <h3>Recommended field workflow</h3>
      <ul>
        <li>Walk site first without scanning</li>
        <li>Identify key reference surfaces</li>
        <li>Plan scan positions before starting</li>
      </ul>
      <h3>Typical scan targets</h3>
      <ul>
        <li>Column locations</li>
        <li>Concrete edges</li>
        <li>Wall faces</li>
        <li>Anchor bolts</li>
        <li>Stair openings</li>
        <li>Embed plates</li>
        <li>Existing railings</li>
        <li>Structural penetrations</li>
      </ul>
      <figure class="blog-media-slot">
        <img src="/blog/Lidar_post_1/blogpost_scannerimage3.png" alt="Multiple scan positions ensure proper overlap and prevent missing critical fabrication geometry." loading="lazy" />
        <figcaption>Multiple scan positions ensure proper overlap and prevent missing critical fabrication geometry.</figcaption>
      </figure>

      <h2>Step 2 – Registration and Cleaning Point Cloud Data</h2>
      <p>After scanning, the raw data must be registered and cleaned.</p>
      <p>Registration aligns multiple scans into one coordinate system.</p>
      <p>Using Trimble software, the typical process includes:</p>
      <ul>
        <li>Register scans</li>
        <li>Verify alignment accuracy</li>
        <li>Remove noise</li>
        <li>Trim unnecessary data</li>
        <li>Export usable dataset</li>
      </ul>
      <h3>What to remove</h3>
      <ul>
        <li>People walking through scan</li>
        <li>Moving equipment</li>
        <li>Temporary objects</li>
        <li>Vegetation (if irrelevant)</li>
        <li>Distant geometry not related to project</li>
      </ul>
      <p>Reducing unnecessary data dramatically improves SketchUp performance.</p>
      <p><strong>Clean data equals faster modeling.</strong></p>
      <figure class="blog-media-slot">
        <img src="/blog/Lidar_post_1/blogpost_scannerimage4.webp" alt="Point cloud before and after cleanup. Removing unnecessary geometry improves modeling speed and clarity." loading="lazy" />
        <figcaption>Point cloud before and after cleanup. Removing unnecessary geometry improves modeling speed and clarity.</figcaption>
      </figure>

      <h2>Step 3 – Exporting the Point Cloud for SketchUp</h2>
      <p>Point clouds typically export as:</p>
      <ul>
        <li>RCP / RCS</li>
        <li>E57</li>
        <li>LAS</li>
        <li>PTS</li>
      </ul>
      <p>For SketchUp workflows, common approaches include:</p>
      <ul>
        <li>Using Scan Essentials</li>
        <li>Using Undet plugin</li>
        <li>Using conversion workflows</li>
      </ul>
      <p>E57 is often preferred due to compatibility.</p>
      <h3>Before export</h3>
      <ul>
        <li>Verify coordinate orientation</li>
        <li>Confirm units</li>
        <li>Confirm origin location</li>
      </ul>
      <p>Bad origin setup causes major modeling headaches later.</p>

      <h2>Step 4 – Importing Point Clouds into SketchUp</h2>
      <p>Once imported, performance depends heavily on how you manage the data.</p>
      <h3>Recommended setup</h3>
      <ul>
        <li>Create dedicated point cloud tag</li>
        <li>Lock point cloud layer</li>
        <li>Reduce point display density if needed</li>
      </ul>
      <p><strong>Never model directly on an unlocked point cloud.</strong> Accidental movement destroys alignment.</p>
      <figure class="blog-media-slot">
        <img src="/blog/Lidar_post_1/blogpost_scannerimage5.png" alt="Point cloud imported into SketchUp using Scan Essentials, ready for fabrication modeling." loading="lazy" />
        <figcaption>Point cloud imported into SketchUp using Scan Essentials, ready for fabrication modeling.</figcaption>
      </figure>

      <h2>Step 5 – Modeling Steel Directly Over the Point Cloud</h2>
      <p>This is where the workflow becomes extremely powerful.</p>
      <p>Instead of guessing dimensions, you can model directly against real geometry.</p>
      <h3>Typical workflow</h3>
      <ul>
        <li>Establish reference planes</li>
        <li>Trace structural surfaces</li>
        <li>Locate connection points</li>
        <li>Build steel geometry from real conditions</li>
      </ul>
      <h3>Practical detailing examples</h3>
      <p><strong>For railings:</strong></p>
      <ul>
        <li>Trace slab edge</li>
        <li>Locate wall deviations</li>
        <li>Model posts exactly where installable</li>
      </ul>
      <p><strong>For stairs:</strong></p>
      <ul>
        <li>Verify opening dimensions</li>
        <li>Confirm landing elevations</li>
        <li>Detect slab slope</li>
      </ul>
      <p><strong>For embeds:</strong></p>
      <ul>
        <li>Locate concrete face</li>
        <li>Verify anchor locations</li>
        <li>Confirm edge distances</li>
      </ul>
      <figure class="blog-media-slot">
        <img src="/blog/Lidar_post_1/blogpost_scannerimage6.jpeg" alt="Steel railing model built directly over real-world scan data to ensure install accuracy." loading="lazy" />
        <figcaption>Steel railing model built directly over real-world scan data to ensure install accuracy.</figcaption>
      </figure>

      <h2>Step 6 – Managing Accuracy Expectations</h2>
      <p>LiDAR scanning is accurate, but not perfect.</p>
      <p>Typical Trimble scanner accuracy is within a few millimeters at close range.</p>
      <p>However real accuracy depends on:</p>
      <ul>
        <li>Scan distance</li>
        <li>Registration quality</li>
        <li>Surface reflectivity</li>
        <li>Environmental conditions</li>
      </ul>
      <p>Steel fabrication tolerances are often larger than scan tolerances.</p>
      <p>This means the scanner is usually more accurate than the fabrication tolerance itself.</p>
      <h3>Best practice</h3>
      <p>Use scan data as verification, not absolute truth. Always apply fabrication judgment.</p>

      <h2>Step 7 – Hardware Considerations Most People Don't Talk About</h2>
      <p>Point cloud workflows demand more computing power than traditional CAD.</p>
      <h3>Recommended specs</h3>
      <ul>
        <li>32GB RAM preferred</li>
        <li>Dedicated GPU recommended</li>
        <li>Fast SSD storage</li>
        <li>Modern CPU</li>
      </ul>
      <p>Large point clouds can easily exceed several gigabytes.</p>
      <p>Without proper hardware, modeling becomes frustrating.</p>

      <h2>Step 8 – Common Mistakes Fabricators Make When Starting LiDAR Workflows</h2>
      <p>Most failures come from process mistakes, not technology.</p>
      <p>Common mistakes include:</p>
      <ul>
        <li>Taking too few scans</li>
        <li>Not scanning critical areas</li>
        <li>Keeping too much unnecessary data</li>
        <li>Trying to model entire scan at once</li>
        <li>Ignoring coordinate setup</li>
        <li>Modeling from noisy data</li>
      </ul>
      <p>The biggest mistake is treating LiDAR like a measuring tool.</p>
      <p><strong>It is not. It is a spatial documentation tool.</strong></p>
      <p>The real value comes from combining scanning with fabrication expertise.</p>

      <h2>Real Workflow Example (Video Demonstration)</h2>
      <p>Before implementing a workflow like this, it helps to see how point clouds function inside SketchUp. The following video shows how scan data becomes usable modeling geometry.</p>
      <figure class="blog-media-slot blog-media-slot--video">
        <iframe
          src="https://www.youtube-nocookie.com/embed/LmZbwBB8CcM?start=1"
          title="Example of point cloud data being used inside SketchUp for modeling and detailing workflows"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerpolicy="strict-origin-when-cross-origin"
          allowfullscreen
          loading="lazy"
        ></iframe>
        <figcaption>Example of point cloud data being used inside SketchUp for modeling and detailing workflows.</figcaption>
      </figure>

      <h2>Step 9 – Real Fabrication Use Cases Where This Workflow Excels</h2>
      <p>LiDAR workflows are especially valuable for:</p>
      <ul>
        <li>Renovations</li>
        <li>Tenant improvements</li>
        <li>Existing building retrofits</li>
        <li>Complex railing layouts</li>
        <li>Custom stairs</li>
        <li>Architectural steel</li>
        <li>Irregular concrete conditions</li>
      </ul>
      <p>These are projects where drawings rarely match reality.</p>
      <figure class="blog-media-slot">
        <img src="/projects/photo41.jpg" alt="Installed steel railing work showing finished fabrication aligned to field conditions." loading="lazy" />
        <figcaption>Comparison of scan data and finished installation showing how reality capture improves fit and alignment.</figcaption>
      </figure>

      <h2>Step 10 – Where This Workflow Saves the Most Money</h2>
      <p>The biggest savings usually come from:</p>
      <ul>
        <li>Prevented remakes</li>
        <li>Fewer site visits</li>
        <li>Reduced install delays</li>
        <li>Better prefab accuracy</li>
        <li>Reduced field welding</li>
      </ul>
      <p>A single avoided remake often pays for the scanning time.</p>
      <p>For miscellaneous metals contractors, ROI is often immediate.</p>

      <h2>Final Thoughts</h2>
      <p>LiDAR scanning is not just a technology upgrade. It is a workflow upgrade.</p>
      <p>Fabrication companies that adopt reality capture gain a major advantage because they move from assumption based detailing to data driven detailing.</p>
      <p>Instead of asking: <em>Will this fit?</em> You already know.</p>
      <p>Instead of discovering problems during installation, you solve them during detailing.</p>
      <p>And in fabrication, the earlier a problem is solved, the cheaper it is.</p>
      <p>Because in modern fabrication, accuracy is no longer limited by what you can measure. It is limited by what you choose to capture.</p>
      <p>Questions about detailing or field verification? <a href="/contact">Contact us</a> and we can talk through your project.</p>
    `;
