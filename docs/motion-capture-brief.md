# Scroll-linked portrait film brief

## The idea

Create a short, quiet portrait loop that feels like a moment from the studio rather than a showreel. The page should reveal Pete at work while the visitor scrolls: a glance toward camera, a small turn, a hand moving across a desk, or a shift from sketchbook to screen.

The motion should add presence without competing with the project work. One strong shot is better than a montage.

## Shoot

- Record one locked-off shot, 8–12 seconds long, at 4K if possible.
- Shoot landscape with Pete placed off-center. Leave roughly one-third of the frame calm enough to hold page copy.
- Use a simple background with one saturated object or light source that relates to the site palette.
- Keep the action small and continuous. Avoid speaking, fast gestures, cuts, or anything that requires sound.
- Hold the first and final pose for one full second. This makes the poster and end state feel intentional.
- Capture at 30 fps with a shutter near 1/60. Lock exposure, focus, and white balance so the frame does not pulse.
- Record a second clean take with no subject movement for an accessible static fallback if time allows.

## Edit

- Choose a 6–9 second section with one readable movement.
- Grade for natural skin tones, a slightly warm neutral background, and one controlled color accent.
- Do not add titles or a logo to the video; the site supplies the typography.
- Export a high-quality master before making web versions.

## Web delivery

Deliver these files into `static/video/portrait/`:

1. `pete-portrait.mp4` — H.264, 1920×1080, no audio, fast-start enabled, about 6–12 Mbps.
2. `pete-portrait.webm` — VP9 or AV1, 1920×1080, no audio, visually comparable to the MP4.
3. `pete-portrait-poster.jpg` — the strongest still frame, 1920×1080, about 75–85% JPEG quality.

For smooth scroll scrubbing, use frequent keyframes. A keyframe interval of 1–3 frames is ideal; longer intervals can make the playhead feel sticky on mobile.

## Intended interaction

- The video occupies one large color-block section, not the hero.
- Scrolling through the section advances the video once from beginning to end.
- A short label and one sentence remain fixed beside the film while it plays.
- On touch devices or slow connections, the film may play as a muted inline loop instead of exact scrubbing.
- With reduced motion enabled, the poster is shown with no autoplay or scroll-linked movement.

This direction borrows the sense of presence and pacing from the references without reproducing their composition or visual identity.
