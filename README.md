# CounterLens

![License: CC BY-NC 4.0](https://img.shields.io/badge/License-CC%20BY--NC%204.0-lightgrey.svg)
![Version](https://img.shields.io/badge/version-2.5.0-blue)

**CounterLens** is an interactive educational interface designed to help users explore dataset slices, decision margins, and algorithmic fairness through a guided counterfactual visualizer and demo scenarios.

🌍 **Live Demo:** [https://rmwillia-umbc.github.io/CounterLens/](https://rmwillia-umbc.github.io/CounterLens/)

## Features
- **Guided Tutorials:** Walkthrough systems with spotlights and tooltips to help new users understand the modules.
- **Counterfactual Visualizer:** Educational help popups and interactive tools for exploring model behavior.
- **Demo Scenarios:** Multi-language support (English/Chinese) for different interactive scenarios.
- **Dataset Slices:** In-depth visual exploration tools to understand algorithmic decision margins.

## Local Development

To run this project locally on your machine:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/rmwillia-umbc/CounterLens.git
   cd CounterLens
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:5173`.

## Deployment

To deploy updates to GitHub Pages:
```bash
npm run deploy
```
*(Note: You must have 'Write' access to the repository to push the `gh-pages` branch. The live site is updated automatically from the `gh-pages` branch).*

## License

This project is licensed under the **Creative Commons Attribution-NonCommercial 4.0 International (CC BY-NC 4.0)** license.
You are free to share and adapt the material, provided you give appropriate credit and **do not use the material for commercial purposes**.

See the `LICENSE` file for the full text.
