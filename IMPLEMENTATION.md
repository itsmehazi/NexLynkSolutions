# Start a conversation — implementation note

Current asset version: `venom48` · Updated: 24 October 2026

The lower “Start a conversation” CTA uses animated SVG tendrils based on the interaction in `10.mp4`. `05.jpeg` is a visual reference for the glossy material, irregular bulges, and highlights. Its web lattice is not stamped across the strands. The implementation is independently authored; it does not use the reference component’s original source code.

## Scope and files

- `script.js` contains the reusable `initVenomCTA` component, SVG geometry, gloss rendering, pointer handling, and spring simulation.
- `style.css` contains the button appearance and SVG layer styles.
- `index.html`, `about.html`, `work.html`, `services.html`, and `process.html` reference `script.js?v=venom48` and `style.css?v=venom48`.
- `05.jpeg` is used as a visual reference only; the website does not load it.

The reusable `initVenomCTA` component initializes each `.mini-cta .contact-button` on each page. Page content and layouts were preserved. The workspace contains five HTML pages; the existing `contact.html` was not supplied or modified. The CTA remains a normal link to its existing destination.

## Interaction

1. **Capture:** A mouse or pen pointer entering within 18 CSS pixels of the button’s bounding rectangle activates 24 strands. Roots always start inside the top and bottom edges, regardless of the pointer’s approach direction. They are distributed across nearly the full button width and remain fixed throughout the gesture.
2. **Stretch:** Strand tips follow the pointer through springs with slightly different response rates and all converge to the pointer, with a small individual orbit for a living, clustered tip. Slack strands curve; stretched strands straighten and taper. Each strand moves independently.
3. **Release:** Moving more than 115 CSS pixels from the button’s bounding rectangle detaches the strands. Each tip receives an impulse toward its own root.
4. **Recoil:** Tips pass their roots and briefly overshoot toward the opposite side, then settle. An upward pull therefore recoils downward, with equivalent behavior in other directions. The button itself stays in place.

Recoil changes the strand geometry rather than shrinking or translating the tendrils as a group. A new capture waits until recoil finishes. Animation frames stop when the effect returns to idle.

## Appearance and texture

Each tendril is a compact, glossy black, irregular liquid ribbon with a tapered tip. Seven glossy black droplets hang from the lower pill edge; they lengthen and fall in staggered loops on hover, focus, or touch. Cool-black reflective blood-lines flow along the liquid-black strand bodies to carry the dripping-blood look through each tendril. A shaded body, narrow volumetric ridge, moving specular glint, and independent ripples give the ribbons a rounded, wet surface inspired by `05.jpeg`; there is no repeated mesh pattern or web of connectors.

`05.jpeg` guides the material appearance only. The page draws near-black ribbons with shaded volume and animated offset highlights. Under tension they straighten; at the tip, each strand follows a small individual orbit around the pointer and curls through procedural waves. Pointer velocity adds temporary lag, so fast movement pulls the tendrils behind it. The spring physics gives them smooth acceleration, overshoot, and retract motion.

Ribbon widths, bulges, roots, and wave phases vary deterministically between strands, avoiding flicker from new random values every frame. Tendrils stay glossy black both over the black pill and outside it; narrow cool highlights travel along each independently shaped ribbon. The current ribbon thickness multiplier is `1.38`; width, bulge positions, curl radius, orbit speed, and spring response vary by strand.

## Main tuning values

| Setting | Current value | Effect |
| --- | --- | --- |
| Strand count | 24 | Main ribbon density; keep even for opposing root groups |
| Capture distance | 18 px | How close the pointer must come to attach |
| Release distance | 115 px | Maximum pointer distance before detachment |
| Ribbon thickness multiplier | 1.38 | Scales ribbon width without changing motion |
| Release stiffness | 740–990 | Higher values return the tips faster |
| Release damping | 15–18 | Higher values reduce overshoot and oscillation |
| Physics step | 1/240 second | Keeps spring integration consistent across display rates |
| Recoil cleanup | After settling, or 800 ms maximum | Prevents residual animation from running indefinitely |
| Tip orbit radius | 1–5 px per strand | Adds a tight curl around the pointer |
| Pointer lag | Up to 14 px | Lets fast pointer motion pull the tendrils behind it |
| Tail curl | 2–9 px per strand | Adds an individual hook near each tip |

The release impulse is seven times the vector from tip to root, plus a small portion of the tip’s existing velocity. Measured runtime checks placed the first opposite-side peak roughly 0.1 seconds after release.

## Accessibility and lifecycle

The SVG is decorative, hidden from assistive technology, and does not intercept clicks. Mouse and pen activate on hover. A touch press briefly pulls strands toward the press and releases them while leaving the link tap intact. Keyboard focus triggers the same short pull and release. Keyboard focus and touch presses trigger a short tendril pull and release. The lime focus outline is visible against the page background. Reduced-motion preferences disable motion while leaving the CTA usable.

Touch presses and keyboard focus trigger a short pull and release; neither blocks normal link activation. Leaving the browser viewport or losing focus releases the strands. Scrolling, resizing, hiding the document, or changing the motion preference clears the effect. The general magnetic-button handler skips this CTA to avoid competing movement.

## Deployment

Upload the five HTML files, `script.js`, and `style.css` together. Preserve the deployed contact page and all other site assets. `05.jpeg` is a visual reference and is not loaded by the page at runtime.

The HTML asset query strings are currently `venom48`; update them together when publishing later script or style changes. `10.mp4` is a reference only and is not loaded by the website. The existing `Archive.zip` was not rebuilt during this implementation; deploy the current files listed above.

## Verification and limits

The JavaScript renderer was executed in a simulated DOM using JavaScriptCore. Checks passed for 24-strand capture with all tips tracking the pointer, valid SVG coordinates, fixed roots, opposite-direction recoil in all four directions, cleanup, repeated capture, reduced motion, and 60/120 fps update schedules. Generated path geometry was also inspected through offline raster previews. A local HTTP server could not bind in this sandbox, so the page could not be opened for a browser rendering check.

These checks are not a browser rendering test. The sandbox blocked the local HTTP server from binding, and Chrome could not launch, so final shading and interaction remain unverified in a browser. Exact frame-for-frame equivalence with the video is not established. Check the CTA on each supplied page, pull away in every direction, and verify normal link navigation, touch activation, keyboard focus, responsive sizing, and reduced-motion behavior in a browser.
