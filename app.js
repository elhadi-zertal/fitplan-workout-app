// JavaScript Logic for FitPlan

document.addEventListener('DOMContentLoaded', () => {
    // 1. DOM Elements
    const form = document.getElementById('workoutForm');
    const planContainer = document.getElementById('planContainer');
    const nutritionContainer = document.getElementById('nutritionContainer');
    const loader = document.getElementById('loader');
    const printBtn = document.getElementById('printBtn');

    // 2. Data Base (Exercises)
    const db = {
        chest: [
            { name: "Barbell Bench Press", type: "compound" },
            { name: "Incline Dumbbell Press", type: "compound" },
            { name: "Push-ups", type: "bodyweight" },
            { name: "Cable Crossovers", type: "isolation" },
            { name: "Dumbbell Flyes", type: "isolation" }
        ],
        back: [
            { name: "Pull-ups", type: "bodyweight" },
            { name: "Lat Pulldowns", type: "compound" },
            { name: "Barbell Rows", type: "compound" },
            { name: "Seated Cable Rows", type: "compound" },
            { name: "Face Pulls", type: "isolation" }
        ],
        legs: [
            { name: "Barbell Squats", type: "compound" },
            { name: "Romanian Deadlifts", type: "compound" },
            { name: "Leg Press", type: "compound" },
            { name: "Walking Lunges", type: "compound" },
            { name: "Leg Extensions", type: "isolation" },
            { name: "Lying Leg Curls", type: "isolation" },
            { name: "Standing Calf Raises", type: "isolation" }
        ],
        shoulders: [
            { name: "Overhead Military Press", type: "compound" },
            { name: "Dumbbell Shoulder Press", type: "compound" },
            { name: "Lateral Raises", type: "isolation" },
            { name: "Front Raises", type: "isolation" },
            { name: "Reverse Pec Deck", type: "isolation" }
        ],
        arms: [
            { name: "Barbell Bicep Curls", type: "isolation" },
            { name: "Hammer Curls", type: "isolation" },
            { name: "Tricep Pushdowns", type: "isolation" },
            { name: "Overhead Tricep Extension", type: "isolation" },
            { name: "Skullcrushers", type: "isolation" }
        ],
        core: [
            { name: "Plank", type: "bodyweight" },
            { name: "Bicycle Crunches", type: "bodyweight" },
            { name: "Hanging Leg Raises", type: "bodyweight" },
            { name: "Russian Twists", type: "bodyweight" },
            { name: "Ab Wheel Rollouts", type: "compound" }
        ],
        cardio: [
            { name: "Treadmill Sprint Intervals", type: "cardio" },
            { name: "Rowing Machine", type: "cardio" },
            { name: "Jump Rope", type: "cardio" },
            { name: "Stairmaster", type: "cardio" },
            { name: "Stationary Bike", type: "cardio" }
        ]
    };

    // Helper to get random X exercises from a category
    function getRandom(arr, count) {
        const shuffled = [...arr].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    }

    // 3. Generator Algorithm
    function generatePlan(goal, level, days) {
        // Define Sets, Reps, Rest based on Goal & Level
        let sets = 3;
        if (level === 'intermediate') sets = 4;
        if (level === 'advanced') sets = 5;

        let reps, rest;
        if (goal === 'lose-weight') {
            reps = "12-15";
            rest = "45-60s";
        } else if (goal === 'build-muscle') {
            reps = "8-10";
            rest = "90-120s";
        } else {
            reps = "10-12";
            rest = "60-90s";
        }

        const plan = [];

        // Build Plan Structure
        let structure = [];
        if (days === 3) {
            structure = [
                { title: "Full Body A", focus: ["chest", "back", "legs", "shoulders", "core"] },
                { title: "Full Body B", focus: ["legs", "chest", "back", "arms", "cardio"] },
                { title: "Full Body C", focus: ["chest", "back", "legs", "shoulders", "core"] }
            ];
        } else if (days === 4) {
            structure = [
                { title: "Upper Body Power", focus: ["chest", "back", "shoulders", "arms"] },
                { title: "Lower Body Power", focus: ["legs", "core", "cardio"] },
                { title: "Upper Body Hypertrophy", focus: ["chest", "back", "shoulders", "arms"] },
                { title: "Lower Body Hypertrophy", focus: ["legs", "core", "cardio"] }
            ];
        } else if (days === 5) {
            structure = [
                { title: "Chest & Triceps (Push)", focus: ["chest", "arms"] },
                { title: "Back & Biceps (Pull)", focus: ["back", "arms"] },
                { title: "Legs (Quads & Hams)", focus: ["legs"] },
                { title: "Shoulders & Abs", focus: ["shoulders", "core"] },
                { title: "Full Body / Weak Points", focus: ["chest", "back", "legs", "cardio"] }
            ];
        }

        // Populate exercises
        structure.forEach((day, index) => {
            let dayExercises = [];
            
            // Determine how many exercises per group based on total focuses
            const exPerGroup = Math.max(1, Math.floor(6 / day.focus.length)); 
            
            day.focus.forEach(group => {
                const selected = getRandom(db[group], exPerGroup + (level==='advanced'?1:0));
                
                selected.forEach(ex => {
                    dayExercises.push({
                        name: ex.name,
                        sets: (ex.type === 'bodyweight') ? 3 : sets,
                        reps: (ex.type === 'bodyweight') ? "AMRAP" : (ex.type === 'cardio' ? "15-20 mins" : reps),
                        rest: (ex.type === 'cardio') ? "N/A" : rest
                    });
                });
            });

            plan.push({
                dayNumber: index + 1,
                title: day.title,
                exercises: dayExercises
            });
        });

        return plan;
    }

    // 4. Nutrition Generation Algorithm
    function generateNutrition(sex, age, weight, height, goal, days) {
        // Mifflin-St Jeor Equation for BMR
        // Male: (10 x weight) + (6.25 x height) - (5 x age) + 5
        // Female: (10 x weight) + (6.25 x height) - (5 x age) - 161
        let bmr = (10 * weight) + (6.25 * height) - (5 * age);
        bmr = sex === 'male' ? bmr + 5 : bmr - 161;

        // Activity Multiplier based on Days working out
        let multiplier = 1.2; // Sedentary base
        if (days === 3) multiplier = 1.375; // Lightly active
        if (days === 4) multiplier = 1.55;  // Moderately active
        if (days === 5) multiplier = 1.725; // Very active

        let tdee = bmr * multiplier;

        // Goal Adjustment
        let targetCalories = tdee;
        if (goal === 'lose-weight') {
            targetCalories = tdee - 500; // 500 cal deficit
        } else if (goal === 'build-muscle') {
            targetCalories = tdee + 300; // 300 cal surplus
        }

        targetCalories = Math.round(targetCalories);

        // Macro Rules
        // Protein: ~2.2g per kg of bodyweight
        let protein = Math.round(weight * 2.2); 
        
        // Fat: 25% of total calories (1g fat = 9 kcal)
        let fat = Math.round((targetCalories * 0.25) / 9);
        
        // Carbs: Remaining calories (1g carb = 4 kcal, 1g protein = 4 kcal)
        let proteinCals = protein * 4;
        let fatCals = fat * 9;
        let remainingCals = targetCalories - (proteinCals + fatCals);
        let carbs = Math.max(0, Math.round(remainingCals / 4)); // Ensure no negative carbs

        return {
            calories: targetCalories,
            protein: protein,
            carbs: carbs,
            fat: fat
        };
    }

    // 5. UI Rendering Functions
    function renderPlan(planData, nutritionData) {
        planContainer.innerHTML = ''; 
        nutritionContainer.innerHTML = '';

        // -- Render Nutrition Dashboard --
        nutritionContainer.innerHTML = `
            <div class="plan-header">
                <h2>Your Daily Nutrition Target</h2>
                <p>Eat according to these targets to reach your specific goal.</p>
            </div>
            <div class="nutrition-dashboard">
                <div class="calories-circle">
                    <span class="amount">${nutritionData.calories}</span>
                    <span class="label">KCAL / DAY</span>
                </div>
                <div class="macros-grid">
                    <div class="macro-card macro-protein">
                        <div class="macro-val">${nutritionData.protein}g</div>
                        <div class="macro-label">Protein</div>
                    </div>
                    <div class="macro-card macro-carbs">
                        <div class="macro-val">${nutritionData.carbs}g</div>
                        <div class="macro-label">Carbs</div>
                    </div>
                    <div class="macro-card macro-fats">
                        <div class="macro-val">${nutritionData.fat}g</div>
                        <div class="macro-label">Fats</div>
                    </div>
                </div>
            </div>
        `;

        // -- Render Workout Plan --

        // Header View
        const headerDiv = document.createElement('div');
        headerDiv.className = "plan-header";
        headerDiv.innerHTML = `
            <h2>Your Custom Routine</h2>
            <p>Your science-based routine is ready. Stick to it and track your progress.</p>
        `;
        planContainer.appendChild(headerDiv);

        // Grid Container
        const gridDiv = document.createElement('div');
        gridDiv.className = "plan-grid";

        planData.forEach(day => {
            const card = document.createElement('div');
            card.className = "day-card";
            
            // Build exercises HTML
            let exercisesHTML = `<ul class="exercise-list">`;
            
            day.exercises.forEach((ex, idx) => {
                const uniqueId = `cb-day${day.dayNumber}-ex${idx}`;
                exercisesHTML += `
                    <li class="exercise-item">
                        <label class="exercise-checkbox" for="${uniqueId}">
                            <input type="checkbox" id="${uniqueId}" class="exercise-cb">
                        </label>
                        <div class="exercise-details">
                            <h4 class="exercise-name">${ex.name}</h4>
                            <div class="exercise-meta">
                                <span><i class='bx bx-refresh'></i> ${ex.sets} Sets</span>
                                <span><i class='bx bx-repeat'></i> ${ex.reps}</span>
                                <span><i class='bx bx-time'></i> ${ex.rest} Rest</span>
                            </div>
                        </div>
                    </li>
                `;
            });
            exercisesHTML += `</ul>`;

            card.innerHTML = `
                <div class="day-header">
                    <h3>Day ${day.dayNumber}</h3>
                    <span class="day-focus">${day.title}</span>
                </div>
                ${exercisesHTML}
            `;
            
            gridDiv.appendChild(card);
        });

        planContainer.appendChild(gridDiv);

        // Add Event Listeners to Checkboxes
        const checkboxes = document.querySelectorAll('.exercise-cb');
        checkboxes.forEach(cb => {
            // we use the hidden visual hack in pure CSS for the most part, 
            // but we add a class to cross out text
            cb.addEventListener('change', function() {
                const item = this.closest('.exercise-item');
                if(this.checked) {
                    item.classList.add('completed');
                } else {
                    item.classList.remove('completed');
                }
            });
        });
    }

    // 6. Event Listeners
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Biometrics
        const sex = document.querySelector('input[name="sex"]:checked').value;
        const age = parseInt(document.getElementById('ageInput').value);
        const weight = parseFloat(document.getElementById('weightInput').value);
        const height = parseFloat(document.getElementById('heightInput').value);
        
        // Preferences
        const goal = document.querySelector('input[name="goal"]:checked').value;
        const level = document.querySelector('input[name="level"]:checked').value;
        const days = parseInt(document.querySelector('input[name="days"]:checked').value);

        // UI transition
        document.getElementById('configPanel').classList.add('hidden');
        loader.classList.add('active');
        
        // Timeout to simulate generation/loading 
        setTimeout(() => {
            const plan = generatePlan(goal, level, days);
            const nutrition = generateNutrition(sex, age, weight, height, goal, days);
            
            loader.classList.remove('active');
            renderPlan(plan, nutrition);
            
            printBtn.style.display = 'inline-flex';
            planContainer.classList.add('active');
            nutritionContainer.classList.add('active');
            
            // Smooth scroll down
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }, 1200);
    });

    printBtn.addEventListener('click', () => {
        window.print();
    });
});
