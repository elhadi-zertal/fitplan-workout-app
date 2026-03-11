// JavaScript Logic for FitPlan

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("workoutForm");
    const views = document.querySelectorAll(".view");
    const planContainer = document.getElementById("planContainer");
    const nutritionContainer = document.getElementById("nutritionContainer");
    const mealContainer = document.getElementById("mealContainer");
    const loader = document.getElementById("loader");
    const startBtn = document.getElementById("startBtn");
    const resetBtn = document.getElementById("resetBtn");
    const printBtn = document.getElementById("printBtn");
    const tabBtns = document.querySelectorAll(".tab-btn");
    const tabContents = document.querySelectorAll(".tab-content");

    // Exercise Database
    const exercises = {
        chest: [
            { name: "Barbell Bench Press", sets: 4, reps: "8-10" },
            { name: "Incline Dumbbell Press", sets: 3, reps: "10-12" },
            { name: "Cable Crossovers", sets: 3, reps: "12-15" },
            { name: "Push-ups", sets: 3, reps: "To failure" }
        ],
        back: [
            { name: "Barbell Rows", sets: 4, reps: "8-10" },
            { name: "Lat Pulldowns", sets: 3, reps: "10-12" },
            { name: "Seated Cable Rows", sets: 3, reps: "10-12" },
            { name: "Face Pulls", sets: 3, reps: "15-20" },
            { name: "Pull-ups", sets: 3, reps: "To failure" }
        ],
        legs: [
            { name: "Barbell Squats", sets: 4, reps: "6-8" },
            { name: "Romanian Deadlifts", sets: 3, reps: "8-10" },
            { name: "Leg Press", sets: 3, reps: "10-12" },
            { name: "Leg Extensions", sets: 3, reps: "12-15" },
            { name: "Lying Leg Curls", sets: 3, reps: "12-15" },
            { name: "Calf Raises", sets: 4, reps: "15-20" }
        ],
        shoulders: [
            { name: "Overhead Press", sets: 4, reps: "8-10" },
            { name: "Lateral Raises", sets: 4, reps: "12-15" },
            { name: "Front Raises", sets: 3, reps: "12-15" },
            { name: "Reverse Pec Deck", sets: 3, reps: "15-20" }
        ],
        arms: [
            { name: "Barbell Curls", sets: 3, reps: "10-12" },
            { name: "Tricep Pushdowns", sets: 3, reps: "10-12" },
            { name: "Hammer Curls", sets: 3, reps: "12-15" },
            { name: "Overhead Tricep Ext.", sets: 3, reps: "12-15" }
        ],
        core: [
            { name: "Plank", sets: 3, reps: "60 seconds" },
            { name: "Cable Crunches", sets: 3, reps: "15-20" },
            { name: "Hanging Leg Raises", sets: 3, reps: "12-15" },
            { name: "Russian Twists", sets: 3, reps: "20 each side" }
        ],
        cardio: [
            { name: "HIIT Sprints", sets: 1, reps: "15 mins" },
            { name: "Steady State Treadmill", sets: 1, reps: "30 mins" },
            { name: "Cycling", sets: 1, reps: "25 mins" }
        ]
    };

    // ---- ROUTING ----
    function switchView(viewId) {
        views.forEach(v => v.classList.remove("active"));
        const target = document.getElementById(viewId);
        if (target) target.classList.add("active");
        window.scrollTo(0, 0);
        if (viewId === "view-dashboard") {
            if (resetBtn) resetBtn.classList.remove("hidden");
            if (printBtn) printBtn.classList.remove("hidden");
        } else {
            if (resetBtn) resetBtn.classList.add("hidden");
            if (printBtn) printBtn.classList.add("hidden");
        }
    }

    // ---- PERSISTENCE ----
    function saveState(data) { localStorage.setItem("fitplan_data", JSON.stringify(data)); }
    function loadState() { const d = localStorage.getItem("fitplan_data"); return d ? JSON.parse(d) : null; }
    function saveCheck(id, v) { const c = JSON.parse(localStorage.getItem("fitplan_checks") || "{}"); c[id] = v; localStorage.setItem("fitplan_checks", JSON.stringify(c)); }
    function getChecks() { return JSON.parse(localStorage.getItem("fitplan_checks") || "{}"); }
    function clearAll() { localStorage.removeItem("fitplan_data"); localStorage.removeItem("fitplan_checks"); if(form) form.reset(); switchView("view-landing"); }

    // ---- GENERATORS ----
    function generatePlan(goal, level, days) {
        const plan = [];
        const adj = (ex) => { let s = ex.sets; if (level==="beginner") s=Math.max(2,s-1); if (level==="advanced") s=s+1; return {...ex, sets: s}; };
        const pick = (m, n) => { const a=[...exercises[m]]; a.sort(()=>0.5-Math.random()); return a.slice(0,n).map(adj); };
        if (days===3) {
            plan.push({dayNumber:1,title:"Full Body A",exercises:[...pick("chest",1),...pick("back",1),...pick("legs",1),...pick("shoulders",1),...pick("arms",1)]});
            plan.push({dayNumber:2,title:"Active Recovery",exercises:[...pick("cardio",1),...pick("core",2)]});
            plan.push({dayNumber:3,title:"Full Body B",exercises:[...pick("legs",1),...pick("chest",1),...pick("back",1),...pick("shoulders",1),...pick("core",1)]});
        } else if (days===4) {
            plan.push({dayNumber:1,title:"Upper Body Power",exercises:[...pick("chest",2),...pick("back",2),...pick("shoulders",1)]});
            plan.push({dayNumber:2,title:"Lower Body Power",exercises:[...pick("legs",4),...pick("core",2)]});
            plan.push({dayNumber:3,title:"Upper Body Hypertrophy",exercises:[...pick("chest",2),...pick("back",2),...pick("arms",2)]});
            plan.push({dayNumber:4,title:"Lower Body Hypertrophy",exercises:[...pick("legs",4)]});
        } else {
            plan.push({dayNumber:1,title:"Push (Chest, Shoulders, Triceps)",exercises:[...pick("chest",3),...pick("shoulders",2),...pick("arms",2)]});
            plan.push({dayNumber:2,title:"Pull (Back, Biceps)",exercises:[...pick("back",4),...pick("arms",2)]});
            plan.push({dayNumber:3,title:"Legs",exercises:[...pick("legs",5),...pick("core",1)]});
            plan.push({dayNumber:4,title:"Upper Body Focus",exercises:[...pick("chest",2),...pick("back",2),...pick("shoulders",2)]});
            plan.push({dayNumber:5,title:"Lower Body Focus",exercises:[...pick("legs",4),...pick("core",2)]});
        }
        return plan;
    }

    function generateNutrition(sex, age, weight, height, goal, days) {
        let bmr = (10*weight)+(6.25*height)-(5*age)+(sex==="male"?5:-161);
        const mults = {3:1.375, 4:1.55, 5:1.725};
        let tdee = bmr * (mults[days] || 1.375);
        if (goal==="lose-weight") tdee -= 500;
        if (goal==="build-muscle") tdee += 300;
        const calories = Math.round(tdee);
        const protein = Math.round(weight * 2.2);
        const fat = Math.round(calories * 0.25 / 9);
        const carbs = Math.max(0, Math.round((calories - protein*4 - fat*9) / 4));
        return { calories, protein, fat, carbs };
    }

    function generateMeals(n) {
        return [
            {name:"Breakfast",     desc:"Eggs/Egg whites, Oatmeal, Berries",          p:Math.round(n.protein*0.28), c:Math.round(n.carbs*0.28), f:Math.round(n.fat*0.28)},
            {name:"Lunch",         desc:"Chicken Breast, Brown Rice, Broccoli",        p:Math.round(n.protein*0.28), c:Math.round(n.carbs*0.28), f:Math.round(n.fat*0.28)},
            {name:"Snack",         desc:"Greek Yogurt or Whey Protein, Almonds",       p:Math.round(n.protein*0.16), c:Math.round(n.carbs*0.16), f:Math.round(n.fat*0.16)},
            {name:"Dinner",        desc:"Lean Beef or Salmon, Sweet Potato, Asparagus",p:Math.round(n.protein*0.28), c:Math.round(n.carbs*0.28), f:Math.round(n.fat*0.28)}
        ];
    }

    // ---- RENDER ----
    function renderDashboard(data) {
        const { plan, nutrition, meals } = data;
        planContainer.innerHTML = "";
        nutritionContainer.innerHTML = "";
        if (mealContainer) mealContainer.innerHTML = "";

        // Nutrition cards
        nutritionContainer.innerHTML = `
            <div class="plan-header"><h2>Your Daily Nutrition Target</h2><p>Eat according to these targets to reach your goal.</p></div>
            <div class="nutrition-dashboard">
                <div class="calories-circle"><span class="amount">${nutrition.calories}</span><span class="label">KCAL / DAY</span></div>
                <div class="macros-grid">
                    <div class="macro-card macro-protein"><div class="macro-val">${nutrition.protein}g</div><div class="macro-label">Protein</div></div>
                    <div class="macro-card macro-carbs"><div class="macro-val">${nutrition.carbs}g</div><div class="macro-label">Carbs</div></div>
                    <div class="macro-card macro-fats"><div class="macro-val">${nutrition.fat}g</div><div class="macro-label">Fats</div></div>
                </div>
            </div>`;

        // Meal plan
        if (mealContainer) {
            let html = `<div class="plan-header" style="margin-top:2rem"><h2>Sample Daily Meal Plan</h2><p>Meal breakdown matched to your macro targets.</p></div><div class="workout-grid">`;
            meals.forEach(m => {
                html += `<div class="day-card"><div class="day-header"><h3>${m.name}</h3></div>
                <ul class="exercise-list"><li class="exercise-item" style="padding:1rem;">
                    <div class="exercise-info" style="width:100%">
                        <span class="exercise-name" style="display:block;margin-bottom:.5rem">${m.desc}</span>
                        <div class="exercise-meta" style="display:flex;justify-content:space-between;color:var(--text-muted);font-size:.9rem">
                            <span>${m.p}g P</span><span>${m.c}g C</span><span>${m.f}g F</span>
                        </div>
                    </div>
                </li></ul></div>`;
            });
            html += `</div>`;
            mealContainer.innerHTML = html;
        }

        // Workout plan
        planContainer.innerHTML = `<div class="plan-header"><h2>Your Weekly Workout Split</h2><p>Follow the sets and reps. Check off exercises as you go.</p></div>`;
        const grid = document.createElement("div");
        grid.className = "workout-grid";
        const checks = getChecks();
        plan.forEach((day, di) => {
            const card = document.createElement("div");
            card.className = "day-card";
            card.style.animationDelay = di * 0.1 + "s";
            let rows = "";
            day.exercises.forEach((ex, ei) => {
                if (!ex) return;
                const uid = "cb-day" + day.dayNumber + "-ex" + ei;
                const checked = checks[uid] ? "checked" : "";
                rows += `<li class="exercise-item">
                    <label class="custom-checkbox">
                        <input type="checkbox" id="${uid}" ${checked}>
                        <span class="checkmark"><i class="bx bx-check"></i></span>
                    </label>
                    <div class="exercise-info ${checked ? "completed" : ""}">
                        <span class="exercise-name">${ex.name}</span>
                        <div class="exercise-meta">
                            <span><i class="bx bx-layer"></i> ${ex.sets} Sets</span>
                            <span><i class="bx bx-refresh"></i> ${ex.reps}</span>
                        </div>
                    </div></li>`;
            });
            card.innerHTML = `<div class="day-header"><h3>Day ${day.dayNumber}</h3><p>${day.title}</p></div><ul class="exercise-list">${rows}</ul>`;
            grid.appendChild(card);
        });
        planContainer.appendChild(grid);

        // Checkbox persistence
        planContainer.querySelectorAll('input[type="checkbox"]').forEach(cb => {
            cb.addEventListener("change", e => {
                const info = e.target.closest(".exercise-item").querySelector(".exercise-info");
                e.target.checked ? info.classList.add("completed") : info.classList.remove("completed");
                saveCheck(e.target.id, e.target.checked);
            });
        });
    }

    // ---- EVENT LISTENERS ----
    if (startBtn) startBtn.addEventListener("click", () => switchView("view-form"));
    if (resetBtn) resetBtn.addEventListener("click", () => { if (confirm("Reset all data and start over?")) clearAll(); });
    if (printBtn) printBtn.addEventListener("click", () => window.print());

    tabBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            tabBtns.forEach(b => b.classList.remove("active"));
            tabContents.forEach(c => c.classList.remove("active"));
            btn.classList.add("active");
            document.getElementById(btn.dataset.target).classList.add("active");
        });
    });

    if (form) {
        form.addEventListener("submit", e => {
            e.preventDefault();
            const sex = document.querySelector("input[name=\"sex\"]:checked").value;
            const age = parseInt(document.getElementById("ageInput").value);
            const weight = parseFloat(document.getElementById("weightInput").value);
            const height = parseFloat(document.getElementById("heightInput").value);
            const goal = document.querySelector("input[name=\"goal\"]:checked").value;
            const level = document.querySelector("input[name=\"level\"]:checked").value;
            const days = parseInt(document.querySelector("input[name=\"days\"]:checked").value);

            switchView("view-dashboard");
            document.querySelector(".tabs-nav").classList.add("hidden");
            tabContents.forEach(c => c.classList.remove("active"));
            loader.classList.add("active");

            setTimeout(() => {
                const plan = generatePlan(goal, level, days);
                const nutrition = generateNutrition(sex, age, weight, height, goal, days);
                const meals = generateMeals(nutrition);
                const fullData = { plan, nutrition, meals };
                localStorage.removeItem("fitplan_checks");
                saveState(fullData);
                loader.classList.remove("active");
                document.querySelector(".tabs-nav").classList.remove("hidden");
                document.getElementById("tab-nutrition").classList.add("active");
                document.querySelector("[data-target=\"tab-nutrition\"]").classList.add("active");
                renderDashboard(fullData);
            }, 1200);
        });
    }

    // ---- INITIAL LOAD ----
    const saved = loadState();
    // Validate schema — discard old data that doesn't have a meals array
    if (saved && saved.plan && saved.nutrition && saved.meals) {
        renderDashboard(saved);
        switchView("view-dashboard");
        // Activate the first tab
        if (tabContents.length > 0) {
            tabContents.forEach(c => c.classList.remove("active"));
            tabBtns.forEach(b => b.classList.remove("active"));
            document.getElementById("tab-nutrition").classList.add("active");
            document.querySelector("[data-target='tab-nutrition']").classList.add("active");
        }
    } else {
        // Clear any bad/old data
        localStorage.removeItem("fitplan_data");
        localStorage.removeItem("fitplan_checks");
        switchView("view-landing");
    }
});
