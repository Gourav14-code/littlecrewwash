# Little Wash Crew

A stylized 3D car wash simulation game built with **Three.js + JavaScript + Vite**.

- **Repository:** https://github.com/Gourav14-code/littlecrewwash.git
- **License:** Open Source / Creative Commons CC0
- **Budget:** ₹0 (No paid tools, assets, or subscriptions)

## Development Setup

```bash
# Install dependencies
npm install

# Start local development server
npm run dev

# Build production bundle
npm run build
```

## Architecture
- `src/entities/CarPlaceholder.js`: Stylized compact sedan with bonnet, boot, 4 doors, rims, and headlights.
- `src/entities/CharacterPlaceholder.js`: Modular wash crew character structured for GLB drop-in replacement.
- `src/entities/GarageEnvironment.js`: Workshop wash bay with drainage trench, hazard markings, ceiling girders, and props.
- `src/entities/PressureWasher.js`: Mobile pressure washer unit with connected high-pressure hose and trigger wand.
- `src/main.js`: Three.js scene manager, lighting, rendering pipeline, and dual-mode (third-person & first-person) camera controller.

