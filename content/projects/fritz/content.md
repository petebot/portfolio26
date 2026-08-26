# Fritz

## The moment that shaped it

Fritz began with a very physical constraint: a caregiver standing outside with a puppy, a leash, and only a few free seconds. The household needed to remember who had taken him out, whether anything happened, how long he had slept, and what might matter next. A conventional pet dashboard would have added work at exactly the wrong moment.

The product therefore starts with capture. Common events take one tap; compound reports can be spoken or typed in natural language. The interface retains the original wording, proposes structured events, and asks a question only when ambiguity would materially change the record or guidance.

## A shared memory, not another dashboard

Today answers three questions in order: what is happening now, what confirmed it, and what should the household consider next. The dominant field is current state. A quieter field carries a checkpoint or trigger-based suggestion. Capture stays available without replacing the active destination.

This hierarchy supports a fast handoff without requiring one caregiver to verbally reconstruct the day. Timeline holds the shared factual history, Patterns explains what the record may suggest, and Care keeps the durable profile, routine, developmental context, and safety boundaries around that history.

## Truth before prediction

The difficult part was not recording a pee or nap. It was preventing a convenient interface from quietly inventing certainty. Fritz keeps occurred-at and recorded-at time, timestamp precision, reporter, location, confirmation status, corrections, merges, splits, and retractions as first-class data.

A late historical event cannot replace the dog’s current state. “Possible urination” does not become a confirmed success. Quiet rest, likely sleep, and confirmed sleep can affect guidance differently. Every save is validated and promoted as a checksummed generation, with recovery behavior that avoids overwriting unreadable or newer data.

## Patterns that show their work

Patterns use recent comparable observations rather than a lifetime average. Each result names its sample, window, exclusions, confidence factors, and what would improve it. When recent behavior no longer fits an earlier rhythm, the app widens or withholds the result instead of presenting a misleading midpoint.

Current behavior still wins. Waking, food or water, a no-result trip, or live sniffing and restlessness can outrank a learned interval. The interface separates a routine care trigger from a statistical pattern so evidence language never launders a practical instruction into a prediction.

## Native in the moments that matter

The iPhone pilot is built in SwiftUI with local persistence, dictation, notifications, and an ActivityKit extension. A Live Activity can count a deliberate potty-purpose outing upward or carry a short retry countdown, but neutral walks and play never acquire potty coaching simply because the dog is outside.

The product remains local and intentionally small. There is no account, cloud sync, remote notification service, or household sharing backend yet. That boundary keeps the first pilot focused on whether the record, capture model, and guidance are trustworthy before broader infrastructure is added.

## The private pilot

Fritz is a real household tool but not a public veterinary or training product. It does not diagnose illness, interpret tests, recommend medication, or replace professional care. Breed and developmental guidance are optional context, never a deterministic model of an individual dog.

The screens presented here use the app’s synthetic simulator scenario. Personal event history, household details, veterinary information, and licensed source artwork remain private.

## What I owned

I defined the product model, capture and correction flows, evidence vocabulary, pattern behavior, brand and design system, data-integrity contract, native application, Live Activity, notification policy, automated tests, and phone-pilot process. The work joins product strategy, interaction design, visual direction, domain modeling, and iOS engineering in one continuously tested system.
