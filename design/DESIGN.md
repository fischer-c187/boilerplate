# 🎨 DESIGN.md – boilerPPPPLATE

Ce fichier définit la direction artistique et les contraintes UI pour le boilerplate fullstack.

---

## 📌 Design Summary

| Aspect      | Valeur                                  |
| ----------- | --------------------------------------- |
| 🎯 Goal     | Générer des leads & démontrer l'outil   |
| 🎨 Style    | Dark mode tech, moderne, dynamique      |
| 🧠 Mood     | Innovation, vitesse, fiabilité          |
| 🧩 Target   | Développeurs indépendants, solopreneurs |
| 📱 Platform | Web Desktop & Mobile                    |

---

## 🧬 Brand Personality

| Aspect              | Description                               |
| ------------------- | ----------------------------------------- |
| **Tone**            | Direct, technique mais accessible, punchy |
| **Inspirations**    | Vercel, Linear, Supabase                  |
| **Visual language** | Contrasté, néons subtils, grille visible  |
| **Avoid**           | Corporate ennuyeux, couleurs ternes       |

---

## 🎨 Color Palette (60-30-10 Rule) – Dark Mode Native

### Primary Colors (60% – Dominant)

| Name          | HEX       | Usage                    | Tailwind        |
| ------------- | --------- | ------------------------ | --------------- |
| 🌑 Background | `#0A0A0A` | Fond principal           | `bg-background` |
| 🌫️ Surface    | `#171717` | Cards, sections          | `bg-surface`    |
| 🟦 Primary    | `#3B82F6` | CTAs, accents principaux | `bg-primary`    |

### Secondary Colors (30% – Structure)

| Name         | HEX       | Usage                      | Tailwind          |
| ------------ | --------- | -------------------------- | ----------------- |
| ⚪ Text      | `#EDEDED` | Texte principal            | `text-foreground` |
| 🌫️ Muted     | `#A1A1AA` | Texte secondaire, bordures | `text-muted`      |
| 🔵 Highlight | `#1E3A8A` | Hover, sélection           | `bg-highlight`    |

### Accent Colors (10% – Highlights)

| Name       | HEX       | Usage               | Tailwind       |
| ---------- | --------- | ------------------- | -------------- |
| 🟣 Accent  | `#8B5CF6` | Gradients, focus    | `text-accent`  |
| 🟢 Success | `#10B981` | Validations, prix   | `text-success` |
| 🟠 Warning | `#F59E0B` | Alertes, attention  | `text-warning` |
| 🔴 Danger  | `#EF4444` | Erreurs, destructif | `text-danger`  |

---

## 📏 Spacing System (8px Grid)

Base unit: **4px** | Standard unit: **8px**

| Token        | Value | Tailwind       | Usage           |
| ------------ | ----- | -------------- | --------------- |
| `--space-2`  | 8px   | `p-2`, `m-2`   | Tight spacing   |
| `--space-4`  | 16px  | `p-4`, `m-4`   | Default padding |
| `--space-6`  | 24px  | `p-6`, `m-6`   | Card padding    |
| `--space-8`  | 32px  | `p-8`, `m-8`   | Section gaps    |
| `--space-12` | 48px  | `p-12`, `m-12` | Section padding |

---

## 🌑 Shadows / Elevation System (Glow Effects)

| Level | Shadow                             | Tailwind      | Usage                 |
| ----- | ---------------------------------- | ------------- | --------------------- |
| **0** | none                               | `shadow-none` | Éléments plats        |
| **1** | `0 0 0 1px #262626`                | `shadow-sm`   | Bordures subtiles     |
| **2** | `0 4px 6px -1px rgba(0,0,0,0.5)`   | `shadow-md`   | Cards                 |
| **3** | `0 0 15px rgba(59, 130, 246, 0.5)` | `shadow-lg`   | **Glow** (CTAs, Hero) |

---

## 🔘 Border Radius System

| Token           | Value  | Tailwind       | Usage                 |
| --------------- | ------ | -------------- | --------------------- |
| `--radius-md`   | 6px    | `rounded-md`   | Boutons, inputs       |
| `--radius-lg`   | 8px    | `rounded-lg`   | Cards standards       |
| `--radius-xl`   | 12px   | `rounded-xl`   | Containers principaux |
| `--radius-full` | 9999px | `rounded-full` | Badges, pills         |

---

## 🔤 Typography

### Font Stack

```css
--font-sans: 'Inter', system-ui, sans-serif;
--font-mono: 'JetBrains Mono', monospace; /* Pour le code et les données techniques */
```

### Typography Scale

| Element     | Size | Weight | Tailwind                                |
| ----------- | ---- | ------ | --------------------------------------- |
| **Display** | 48px | 800    | `text-5xl font-bold tracking-tight`     |
| **H1**      | 36px | 700    | `text-4xl font-bold tracking-tight`     |
| **H2**      | 30px | 600    | `text-3xl font-semibold tracking-tight` |
| **Body**    | 16px | 400    | `text-base`                             |
| **Code**    | 14px | 400    | `font-mono text-sm`                     |

---

## 🧩 Key Components

### Buttons

```html
<!-- Primary (Glow Effect) -->
<button
  class="bg-primary text-white px-6 py-3 rounded-md font-medium 
         shadow-lg shadow-primary/20 hover:shadow-primary/40 
         hover:bg-primary/90 active:scale-95 transition-all duration-200"
>
  Get Started
</button>

<!-- Secondary (Outline) -->
<button
  class="bg-transparent border border-muted/30 text-foreground px-6 py-3 rounded-md 
         hover:bg-surface hover:border-muted/50 transition-all"
>
  Documentation
</button>
```

### Cards (Glass/Tech)

```html
<div
  class="bg-surface/50 backdrop-blur-sm border border-white/5 p-6 rounded-xl 
         hover:border-primary/30 transition-colors"
>
  <!-- Content -->
</div>
```

---

## 🎨 Tailwind @theme Configuration

```html
<style type="text/tailwindcss">
  @theme {
    /* Colors */
    --color-primary: #3b82f6;
    --color-background: #0a0a0a;
    --color-surface: #171717;
    --color-foreground: #ededed;
    --color-muted: #a1a1aa;
    --color-highlight: #1e3a8a;
    --color-accent: #8b5cf6;
    --color-success: #10b981;
    --color-warning: #f59e0b;
    --color-danger: #ef4444;

    /* Typography */
    --font-sans: 'Inter', system-ui, sans-serif;
    --font-mono: 'JetBrains Mono', monospace;

    /* Shadows (Custom Glows) */
    --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.5);
    --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.5);
    --shadow-lg: 0 0 20px -5px rgba(59, 130, 246, 0.4); /* Glow bleu */

    /* Radius */
    --radius-md: 6px;
    --radius-lg: 8px;
    --radius-xl: 12px;
  }
</style>
```
