# Roma — Frontend

Roma is a conversational emotional support assistant for Spanish-speaking
adults. It is not a generic chatbot — it is a friend with personality,
history, and philosophy of its own. The goal is for it to feel human,
warm, and different from any chatbot on the market.

## Stack

- Next.js 15 (App Router)
- Tailwind CSS
- Framer Motion

## Colors — NEVER use colors outside this palette

- Dark garnet: `#6B1D2E` — header, primary buttons, action elements
- Soft garnet: `#C4697A` — user bubbles, accents, borders
- Garnet rose: `#E8A0AC` — user bubble background
- Beige/cream: `#FDF6EC` — chat background, warm backgrounds
- Beige border: `#EDD5C0` — soft borders, dividers
- White: `#FFFFFF` — Roma bubbles
- Primary text: `#2C1A1A`
- Secondary text: `#6B3A3A`
- Muted text: `#9E7A6A`

## Typography

- Inter (Google Fonts) — only font allowed
- Weights: 400 (regular) and 500 (medium) only

## File Structure

- `src/app/page.tsx` — landing page with entrance animation
- `src/app/chat/page.tsx` — web chat interface
- Backend URL: `https://proyecto-roma-production.up.railway.app`

## Component Behavior

- User bubbles: background `#E8A0AC`, border-radius `18px 18px 4px 18px`
- Roma bubbles: white background, border `2px solid #C4697A`, border-radius `18px 18px 18px 4px`
- Input: border-radius 20px, border `0.5px solid #C4697A`
- Send button: circle `#6B1D2E`, white send icon
- Animations: Framer Motion, smooth and purposeful — nothing abrupt
- Mobile-first always

## Current Project State

### Built:

- Functional chat connected to backend
- Persistent conversation history
- Bubble design with garnet/cream palette

### Pending:

- Landing page with chaos animation → Roma appears
- Onboarding form before chat
- Button integration → WhatsApp

## Work Rules

- You are technical support, not a decision maker
- Any visual or structural decision outside this file → ask first
- The design has intention — nothing generic, nothing AI-template
- Details make the difference: spacing, transitions, microinteractions
- If you need an external resource (icon, font, library) → ask before assuming
- Before generating extensive code → show the plan and wait for confirmation

## Prohibitions

- DO NOT use shadcn/ui or any component library without consulting
- DO NOT add colors outside the defined palette
- DO NOT use font weights other than 400 and 500
- DO NOT make layout decisions without showing a plan first
- DO NOT install new libraries without consulting
- DO NOT use decorative gradients or shadows
