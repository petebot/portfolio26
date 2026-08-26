<script lang="ts">
	import { onMount } from 'svelte';

	onMount(() => {
		let dispose: (() => void) | undefined;
		let cancelled = false;

		void (async () => {
			const root = document.querySelector<HTMLElement>('[data-home-motion]');
			if (!root) return;

			const reducedMotion =
				window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
				new URLSearchParams(window.location.search).get('motion') === 'reduce';
			if (reducedMotion) {
				root.dataset.motion = 'reduced';
				return;
			}

			const [{ gsap }, { ScrollTrigger }] = await Promise.all([
				import('gsap'),
				import('gsap/ScrollTrigger')
			]);

			if (cancelled) return;

			gsap.registerPlugin(ScrollTrigger);
			root.dataset.motion = 'ready';

			const context = gsap.context(() => {
				const heroLines = gsap.utils.toArray<HTMLElement>('[data-hero-line] > span');
				const heroTimeline = gsap.timeline({ defaults: { ease: 'power3.out' } });

				heroTimeline
					.from('.hero .section-tag', { opacity: 0, y: 12, duration: 0.55 })
					.from(
						heroLines,
						{
							yPercent: 112,
							rotation: (index) => (index % 2 === 0 ? 1.4 : -1.1),
							duration: 1.05,
							stagger: 0.09
						},
						0.08
					)
					.from(
						'.hero-intro, .hero-meta',
						{ opacity: 0, y: 18, duration: 0.7, stagger: 0.08 },
						0.52
					)
					.from('.hero-marker', { scaleX: 0, duration: 0.7, transformOrigin: 'left center' }, 0.58);

				gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((element) => {
					const restRotation = Number(element.dataset.restRotation ?? 0);

					gsap.fromTo(
						element,
						{ opacity: 0, y: 46, rotation: restRotation * -0.6 },
						{
							opacity: 1,
							y: 0,
							rotation: restRotation,
							duration: 0.9,
							ease: 'power3.out',
							scrollTrigger: {
								trigger: element,
								start: 'top 86%',
								once: true
							}
						}
					);
				});

				gsap.utils.toArray<HTMLElement>('[data-project-card]').forEach((card, index) => {
					const restRotation = Number(card.dataset.restRotation ?? 0);

					gsap.fromTo(
						card,
						{ y: 72, rotation: restRotation + (index % 2 === 0 ? 1.2 : -1.2) },
						{
							y: 0,
							rotation: restRotation,
							duration: 0.9,
							ease: 'power3.out',
							scrollTrigger: {
								trigger: card,
								start: 'top 92%',
								once: true
							}
						}
					);
				});

				const reel = root.querySelector<HTMLElement>('[data-scroll-reel]');
				const portraitVideo = root.querySelector<HTMLVideoElement>('[data-portrait-video]');
				const reelProgress = root.querySelector<HTMLElement>('[data-reel-progress]');
				const reelProgressLabel = root.querySelector<HTMLElement>('[data-reel-progress-label]');

				if (reel && portraitVideo && reelProgress && reelProgressLabel) {
					const portraitFps = 30;
					let portraitProgress = 0;

					portraitVideo.pause();

					const syncPortraitFrame = (progress: number) => {
						portraitProgress = progress;
						reelProgressLabel.textContent = `${Math.round(progress * 100)}%`;

						if (!Number.isFinite(portraitVideo.duration) || portraitVideo.duration <= 0) return;

						const finalFrameTime = Math.max(0, portraitVideo.duration - 1 / portraitFps);
						const frame = Math.round(progress * finalFrameTime * portraitFps);
						const frameTime = frame / portraitFps;

						if (Math.abs(portraitVideo.currentTime - frameTime) > 1 / (portraitFps * 2)) {
							portraitVideo.currentTime = frameTime;
						}
					};

					portraitVideo.addEventListener(
						'loadedmetadata',
						() => syncPortraitFrame(portraitProgress),
						{ once: true }
					);

					const reelTimeline = gsap.timeline({
						scrollTrigger: {
							trigger: reel,
							start: 'top top',
							end: 'bottom bottom',
							scrub: true,
							onUpdate: (self) => syncPortraitFrame(self.progress),
							onRefresh: (self) => syncPortraitFrame(self.progress)
						}
					});

					reelTimeline
						.to(reelProgress, { scaleX: 1, duration: 1, ease: 'none' }, 0)
						.fromTo(
							portraitVideo,
							{ scale: 1.075, xPercent: -1 },
							{ scale: 1.015, xPercent: 0, duration: 1, ease: 'none' },
							0
						)
						.fromTo(
							portraitVideo,
							{ opacity: 0 },
							{ opacity: 1, duration: 0.15, ease: 'power2.out' },
							0
						)
						.fromTo(
							portraitVideo,
							{ filter: 'saturate(0.12) contrast(1.04) brightness(0.7)' },
							{
								filter: 'saturate(0.82) contrast(1.04) brightness(0.76)',
								duration: 0.4,
								ease: 'power1.inOut'
							},
							0.08
						)
						.to(
							portraitVideo,
							{
								filter: 'saturate(0.38) contrast(1.04) brightness(0.7)',
								duration: 0.3,
								ease: 'power1.inOut'
							},
							0.7
						)
						.to(portraitVideo, { opacity: 0, duration: 0.15, ease: 'power2.in' }, 0.85);
				}

				const blinds = gsap.utils.toArray<HTMLElement>('.color-bridge__blind');
				const bridgeContent = root.querySelector<HTMLElement>('.color-bridge__content');

				if (blinds.length && bridgeContent) {
					gsap.set(blinds, { scaleX: 0 });
					gsap.set(bridgeContent, { opacity: 0, y: 34, rotation: -0.5 });

					gsap
						.timeline({
							scrollTrigger: {
								trigger: '.color-bridge',
								start: 'top 88%',
								end: 'center 45%',
								scrub: 0.65
							}
						})
						.to(blinds, {
							scaleX: 1,
							duration: 0.72,
							ease: 'none',
							stagger: { each: 0.055, from: 'start' }
						})
						.to(
							bridgeContent,
							{ opacity: 1, y: 0, rotation: -0.2, duration: 0.38, ease: 'power2.out' },
							0.48
						);
				}

				gsap.from('.practice-grid > li', {
					y: 32,
					opacity: 0,
					duration: 0.7,
					stagger: 0.07,
					ease: 'power2.out',
					scrollTrigger: {
						trigger: '.practice-grid',
						start: 'top 82%',
						once: true
					}
				});
			}, root);

			ScrollTrigger.refresh();

			dispose = () => {
				root.querySelector<HTMLVideoElement>('[data-portrait-video]')?.pause();
				context.revert();
				root.removeAttribute('data-motion');
			};
		})();

		return () => {
			cancelled = true;
			dispose?.();
		};
	});
</script>
