# Rascals Karaoke

## The premise

Karaoke gets awkward when the song list is scattered, the queue feels arbitrary, or one person has to manage the whole night. Rascals makes the social rules visible without flattening the fun.

## The product

Members keep a private songbook, join rooms through invite codes, add performances to a shared queue, and react after each song. A KJ can guide the room manually or use Auto-KJ to suggest the next singer.

## Fairness as a feature

Auto-KJ favors the person who has waited longest since their last performance, gives newcomers a boost, and uses queue age as a tie-breaker. The logic is intentionally simple enough to explain in the room—fairness works better when everyone can understand it.

## The system

- One Expo codebase serves iOS, Android, and the web.
- Supabase provides authentication, Postgres data, and realtime queue updates.
- Row-level security keeps personal songbooks private and room data scoped to members.
- A server-side search pipeline finds karaoke versions without exposing provider credentials in the client.

## What I owned

I defined the MVP, domain model, interaction patterns, visual identity, mobile shell, database policies, realtime behavior, and search workflow. The product was designed cost-first so a small friend group could test the full ritual before expensive integrations were added.
