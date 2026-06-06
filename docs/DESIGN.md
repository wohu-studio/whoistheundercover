# The Design System: Tactical Desert Retro

## 1. Overview & Creative North Star

**The Creative North Star: "The Pixelated Mirage"**

The design system moves beyond the standard "game UI" by marrying the high-end editorial layouts of a luxury fashion journal with the nostalgic, tactile grit of an 8-bit adventure. We are not just building a game; we are building a digital sand dune—shifting, layered, and deeply atmospheric.

The aesthetic breaks the "template" look by utilizing **intentional asymmetry** and **tonal depth**. Instead of centering everything, we embrace off-kilter layouts that mimic the shifting sands of Arrakis. We combine the high-fidelity clarity of a modern sans-serif with the raw, blocky charm of pixel-inspired display type. The goal is "Tactile Digitalism"—where every screen feels like a physical object you could pick up and hold.

---

## 2. Colors

Our palette is a sophisticated interpretation of "Dune-meets-Gameboy." It relies on warmth and earthiness to create an immersive, low-fatigue environment.

- **Primary (#8d4f11) & Primary Container (#f4a460):** The core of the system. Use the Primary for high-action touchpoints and the Container for large, welcoming surfaces that signify the "warm sand" identity.
- **Secondary (#944925):** The "Deep Terracotta." Used for the "Undercover" elements—darker, more mysterious, and grounding.
- **Tertiary (#006d3d):** The "Cactus Green." A vital accent for "Success" states and safe zones within the game.
- **The "No-Line" Rule:** We explicitly prohibit 1px solid borders for sectioning. Boundaries must be defined solely through background color shifts. To separate content, place a `surface-container-low` section against a `surface` background. The eye should perceive the edge through tone, not a line.
- **The "Glass & Gradient" Rule:** To avoid a flat "Flash game" feel, use **Glassmorphism** for floating cards (Identity Cards, Pop-ups). Use `surface` colors with a 60-80% opacity and a `24px` backdrop-blur.
- **Signature Textures:** Apply a subtle linear gradient from `primary` to `primary-container` on major Action Buttons. This adds a "weighted" feel to the pixels, making them look like embossed clay.

---

## 3. Typography

We utilize a "High-Low" typographic strategy: high-concept editorial headers paired with low-fi, high-readability body text.

- **Display & Headlines (Space Grotesk):** This font choice provides a "neo-pixel" vibe—wide, technical, yet organic. Use `display-lg` for game outcomes and `headline-md` for player roles. The large scale creates an authoritative, cinematic feel.
- **Body & Titles (Manrope):** All functional text (rules, chat, descriptions) uses Manrope. Its clean, geometric nature provides the necessary contrast to the blocky surroundings, ensuring players don't suffer from "pixel fatigue" during long sessions.
- **Editorial Hierarchy:** Break the grid. Use `display-sm` for titles but offset them to the left or right margins to create a bespoke, non-traditional magazine layout.

---
