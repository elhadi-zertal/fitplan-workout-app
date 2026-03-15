# 💪 FitPlan — Smart Workout & Nutrition Planner

A fully client-side, science-based workout and nutrition planning web app. No backend. No API keys. Everything runs in the browser using vanilla HTML, CSS, and JavaScript.

---

## ✨ Features

### 🏋️ Workout Generator
- Generates a full **weekly workout split** based on your goal, fitness level, and available days (3, 4, or 5 days/week)
- Supported splits: **Full Body**, **Upper/Lower**, and **Push/Pull/Legs**
- Sets and reps are adjusted based on your level (Beginner → Advanced)
- Volume markers follow **Dr. Brad Schoenfeld's hypertrophy guidelines** (10–20 sets per muscle/week)
- **Progress checklist** — check off exercises as you complete them

### 🥗 Nutrition Calculator
- Calculates your **BMR** using the **Mifflin-St Jeor equation** (sex, age, weight, height)
- Applies **activity multipliers** based on training days to get your TDEE
- Adjusts calories for your goal: **−500 kcal deficit** (lose weight) or **+300 kcal surplus** (build muscle)
- Calculates optimal daily **Protein**, **Carbs**, and **Fat** targets
- Generates a **4-meal sample plan** (Breakfast, Lunch, Snack, Dinner) matched to your macros

### 💾 Persistence
- Your full plan and exercise progress is **saved in the browser** (localStorage)
- **Refreshing the page restores your dashboard** — no progress lost
- Includes a **Reset** button to start fresh

### 🖨️ Print / PDF
- Clean print layout that exports both Nutrition and Workout sections

---

## 🚀 How to Run

🌐 **Live:**  [fitplan-workout-app.vercel.app](https://fitplan-workout-app.vercel.app/)

---

## 🛠️ Tech Stack

| Tech | Purpose |
|------|---------|
| HTML5 | App structure & SPA views |
| CSS3 | Dark glassmorphism UI, animations |
| Vanilla JavaScript | Routing, generation algorithms, localStorage |
| Google Fonts (Inter, Outfit) | Typography |
| Boxicons | UI Icons |

---

## 📐 Science References

- **Nutrition**: Mifflin MD, St Jeor ST et al. *A new predictive equation for resting energy expenditure in healthy individuals.* Am J Clin Nutr. 1990
- **Hypertrophy Volume**: Schoenfeld BJ, Ogborn D, Krieger JW. *Dose-response relationship between weekly resistance training volume and increases in muscle mass.* J Sports Sci. 2017

---

## 📁 File Structure

```
fitplan-workout-app/
├── index.html      # SPA structure (Landing, Form, Dashboard views)
├── style.css       # Dark theme, glassmorphism, animations
├── app.js          # All logic: routing, generation, localStorage
└── ReadMe.md
```

---


> Built using vanilla web technologies — no frameworks, no dependencies, no limits.
