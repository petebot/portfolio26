# Brown Dog Inn

## Before and after

The comparison below shows how I translated Brown Dog Inn’s existing public site into a calmer, mobile-first hospitality experience. The redesign preserves the strongest raw material—a nature-based retreat on ten private acres, small playgroups, glass-fronted suites, overnight care, a pool and waterfall, and a warm philosophy built around connection and hygge—while giving that story a clearer hierarchy and more focused guest journeys.

The existing website made that story difficult to see. Its fixed-width layout clipped on a phone, the first screen emphasized lobby hours over the experience, long pages mixed policies with storytelling, and new and returning guest journeys repeatedly crossed one another.

## A hospitality position hiding in plain sight

The redesign does not invent a new business. It reveals the one described by the original site. “Slow down. Sniff around.” translates the existing Stay in Nature idea into a concise hospitality promise, then supports it with authentic photography, concrete proof, and a quieter Maine-inn visual language.

Deep pine, warm cream, inn brown, editorial serif type, and fine rules make the experience feel grounded and considered. Playfulness lives in the language and dogs themselves rather than novelty pet graphics, decorative paw prints, or a page full of cards.

## Two journeys, made explicit

The service has an important operational distinction: returning Brown Doggers can reserve, while new families need to register, provide health records, and establish fit before a first stay. The redesign turns that distinction into the primary information architecture instead of leaving visitors to discover it late.

The homepage leads with Plan a first stay and preserves Returning guest as a persistent secondary route. The first-stay page explains requirements and the process before presenting a form. Rates, boarding, the Inn, and visit information each have one clear purpose rather than competing inside a single long page.

## A content system with guardrails

The Astro implementation pairs the public site with Keystatic. Editors can safely update approved copy, rates, requirements, hours, links, and photography. They cannot change fonts, colors, spacing, column counts, image ratios, section order, or arbitrary page structure.

That boundary treats the visual and interaction system as product code while giving the business control over facts that genuinely change. Shared content collections support columns, rows, and media grids without multiplying one-off components. Light and dark appearance consume semantic roles rather than remapping individual pages.

## Beyond the marketing site

I extended the concept into first-stay registration, record collection, sign-in, and a fictional returning-family account. These screens test whether the hospitality language can survive more operational work: dog profiles, upcoming stays, health-record status, actions requiring attention, and household details.

The portfolio forms and account are deliberately labeled concepts. They do not authenticate, persist, upload, or send customer information. Production identity, records, and reservations would require a protected operational service separate from the public CMS.

## Current status and boundaries

This is an independent redesign concept. It was not commissioned, reviewed, approved, or adopted by Brown Dog Inn, and the existing public site remains the business’s source of truth. Any business-facing release would require owner confirmation of rates, hours, requirements, policies, booking integration, and image rights.

Within those boundaries, the working build demonstrates the full direction across responsive public pages, structured content, adaptive themes, accessible form architecture, and a coherent account concept.

## What I owned

I conducted the website audit, synthesized the service and content strategy, defined the positioning and information architecture, designed the brand expression and component system, built the Astro and Keystatic implementation, modeled the future forms and account boundaries, and created the automated rendered-output checks.
