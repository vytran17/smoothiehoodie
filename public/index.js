import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getAnalytics, logEvent } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-analytics.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDjcemQWwxxnQ70hRuXf0P1j4VqboNgtig",
  authDomain: "smoothiehoodie.firebaseapp.com",
  projectId: "smoothiehoodie",
  storageBucket: "smoothiehoodie.appspot.com",
  messagingSenderId: "693315166110",
  appId: "1:693315166110:web:9b0aae1722a12ea482008f",
  measurementId: "G-DRMGRD6YFC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

$('input[type=radio][name=heightUnit]').change(function() {
    if (this.value == 'metric') {
        $("#inchesContainer").hide();
        $("#feetContainer").hide();
        $("#cmContainer").show();
        $("#heightFeet").prop('required', false);
        $("#heightInches").prop('required', false);
        $("#heightCm").prop('required', true);
    }
    else if (this.value == 'imperial') {
        $("#inchesContainer").show();
        $("#feetContainer").show();
        $("#cmContainer").hide();
        $("#heightFeet").prop('required', true);
        $("#heightInches").prop('required', true);
        $("#heightCm").prop('required', false);
    }
});

//hide result container before hitting submit button
$("#resultContainer").hide();

$("#cmContainer").hide();

//document.addEventListener('DOMContentLoaded', function() {
$(function() {
  console.log("Initilized page");
  //Initialize select dropdown
  $('select').formSelect();
  //initialize collapsible
  $('.collapsible').collapsible();

  // Add an event listener for the submit event
  $('form').submit(function( event ) {
    console.log('Submitted form, will calculate diet');

    // Prevent the default form submission behavior
    event.preventDefault();

    // Get the values of the form elements
    // const gender = form.gender.value; //javascript
    const gender = $('#gender').val();
    const age = Number($('#age').val());

    var weight = Number($('#weight').val());
    const weightUnit = $('input[name="weightUnit"]:checked').val();

    const heightUnit = $('input[name="heightUnit"]:checked').val()
    const heightCm = Number($('#heightCm').val());
    const heightFeet = Number($('#heightFeet').val());
    const heightInches = Number($('#heightInches').val());

    const activityLevels = $('#activityLevels').val();
    const healthGoals = $('#healthGoals').val();
    const selectedDiet = $('#diet').val();
    const selectedAllergens = $('#allergens').val();

    console.log(`gender ${gender}`);
    console.log(`age ${age}`);
    console.log(`weight ${weight}`);
    console.log(`weightUnit ${weightUnit}`);
    console.log(`heightUnit ${heightUnit}`);
    console.log(`heightCm ${heightCm}`);
    console.log(`heightFeet ${heightFeet}`);
    console.log(`heightInches ${heightInches}`);
    console.log(`activityLevels ${activityLevels}`);
    console.log(`healthGoals ${healthGoals}`);
    console.log(`selectedDiet ${selectedDiet}`);
    console.log(`selectedAllergens ${selectedAllergens}`);

    //converting into kgs
    if (weightUnit == "imperial") {
      weight = weight * 0.4535; //lbs to kgs
    }
    console.log("weight after converting to kg is " + weight);

    //converting into cm
    var height = 0;
    if (heightUnit == "imperial") {
      var inches = heightInches + heightFeet * 12;
      height = inches * 2.54; //inches to cm
    } else if (heightUnit == "metric") {
      height = heightCm;
    }
    console.log("height after converting to cm is " + height);

    logEvent(analytics, 'submit_form', {
      name: 'bmr_form',
      age: age,
      gender: gender,
      weight: weight,
      height: height,
      weightUnit: weightUnit,
      heightUnit: heightUnit,
      activityLevels: activityLevels,
      healthGoals: healthGoals,
      selectedDiet: selectedDiet,
      selectedAllergens: selectedAllergens
    });

    // Calculate the BMR for males and other - weight in kgs & height in cm
    var bmr = 0;
    if (gender === "male" || gender === "other") {
      bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
    }
    // Calculate the BMR for females
    else if (gender === "female") {
      bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
    }

    $("#resultBmr").html(`Your Basal Metabolic Rate (BMR) is <b>${bmr.toFixed(0)}
    calories/day</b>.<br/><br/>BMR is the amount of energy your body uses at rest to
    maintain vital functions such as breathing, circulation, and cell production.
     Think of these as your \"couch-potato\" calories. No physical activity required!`);

    // Adjust the TDEE based on the exercise level
    let tdee = 0;
    if (activityLevels === "sedentary") {
      tdee = bmr * 1.2;
    } else if (activityLevels === "light") {
      tdee = bmr * 1.375;
    } else if (activityLevels === "moderate") {
      tdee = bmr * 1.55;
    } else if (activityLevels === "very-active") {
      tdee = bmr * 1.725;
    } else if (activityLevels === "extra-active") {
      tdee = bmr * 1.9;
    }

    $("#resultTdee").html(`Your Total Daily Energy Expenditure (TDEE) is <b>${tdee.toFixed(0)}
     calories/day</b>.<br/><br/>Your TDEE is the total number of calories you burn in a day,
     including your BMR and the calories you burn through physical activity.`);

    // CALCULATE NEW TDEE - BASED ON HEALTH GOAL
    let new_tdee = 0;
    if (healthGoals === "stay-healthy") {
      new_tdee = tdee;
      $("#resultHealthGoals").html(`To stay healthy, it is important to make sure
        that you are getting enough nutrients and staying within your TDEE range
        (<b>${new_tdee.toFixed(0)} calories/day</b>).
        <br/><br/>
        Have a balanced meal plan that includes a variety of healthy foods to help
        you meet your nutrient needs. It is also important to be physically active
        and get enough exercise to support your overall health.`);
    } else if (healthGoals === "lose-weight") {
      new_tdee = tdee - 500;
      $("#resultHealthGoals").html(`Your new TDEE based on your lose weight
        health goal is <b>${new_tdee.toFixed(0)} calories/day</b>.
        <br/><br/>
        If you want to lose weight, you will need
        to create a calorie deficit by consuming fewer calories than your TDEE.
        A safe and sustainable rate of weight loss is generally considered to be
        1-2 pounds per week, which can be achieved by creating a daily calorie
        deficit of 500-1000 calories.`);
    } else if (healthGoals === "gain-muscle") {
      new_tdee = tdee + 500;
      $("#resultHealthGoals").html(`Your adjusted TDEE based on your gain weight
        health goal is <b>${new_tdee.toFixed(0)} calories/day</b>.
        <br/><br/>
        If you want to gain muscle, you will need
        to consume more calories than your TDEE to support muscle growth. The
        amount of additional calories you need will depend on your goals,
        training intensity, and other factors. It is generally recommended to
        aim for a calorie surplus of 250-500 calories per day to support muscle
        growth.`);
    }

    //CALCULATE MACRONUTRIENTS
    let protein_calories = 0;
    let fat_calories = 0;
    let carb_calories = 0;
    switch (selectedDiet) {
      case "keto":
        protein_calories = new_tdee * 0.2;
        fat_calories = new_tdee * 0.7;
        carb_calories = new_tdee * 0.1;
        var protein_grams = protein_calories/4;
        var carb_grams = carb_calories/4;
        var fat_grams = fat_calories/9;
        $("#resultMacro").html(`The keto diet is a low carb, high fat diet.
          It lowers blood sugar and insulin levels
          and shifts the body’s metabolism away from carbs and toward fat and ketones.
          <br/><br/>
          Based on your BMR, activity level and health goal, your daily
          macronutrient intake should be as follows:
          <ul>
            <li>♥ <b>${protein_grams.toFixed(0)} grams of protein per day</b>
            (${protein_calories.toFixed(0)} of your daily calories should come from protein)</li>
            <li>♥ <b>${fat_grams.toFixed(0)} grams or fat per day</b>
            (${fat_calories.toFixed(0)} of your daily calories should come from fat)</li>
            <li>♥ <b>${carb_grams.toFixed(0)} grams of carb per day</b>
            (${carb_calories.toFixed(0)} of your daily calories should come from carb)</li>
          </ul>`);
        break;
      case "paleo":
        protein_calories = new_tdee * 0.3;
        fat_calories = new_tdee * 0.4;
        carb_calories = new_tdee * 0.3;
        var protein_grams = protein_calories/4;
        var carb_grams = carb_calories/4;
        var fat_grams = fat_calories/9;
        $("#resultMacro").html(`The Paleo diet provides 30% of total calories from protein,
          40% fat (from mostly monounsaturated and polyunsaturated fats)
          and 30% carbohydrates. It included lean meats, fish, eggs, vegetables, fruits,
          berries, nuts, avocado, and olive oil. <br/><br/>Based on your BMR, activity
          level and health goal, your daily macronutrient intake should be as follows:
          <ul>
            <li>♥ <b>${protein_grams.toFixed(0)} grams of protein per day</b>
            (${protein_calories.toFixed(0)} of your daily calories should come from protein)</li>
            <li>♥ <b>${fat_grams.toFixed(0)} grams or fat per day</b>
            (${fat_calories.toFixed(0)} of your daily calories should come from fat)</li>
            <li>♥ <b>${carb_grams.toFixed(0)} grams of carb per day</b>
            (${carb_calories.toFixed(0)} of your daily calories should come from carb)</li>
          </ul>`);
        break;
      case "vegan":
        protein_calories = new_tdee * 0.35;
        fat_calories = new_tdee * 0.2;
        carb_calories = new_tdee * 0.45;
        var protein_grams = protein_calories/4;
        var carb_grams = carb_calories/4;
        var fat_grams = fat_calories/9;
        $("#resultMacro").html(`The vegan diet is a plant-based diet that excludes
          all animal products, including meat, poultry, fish, eggs, and dairy.
          As a result, it can be challenging to get all the nutrients your body
          needs on a vegan diet, especially protein, vitamin B12, and omega-3
          fatty acids.<br/><br/>Based on your BMR, activity level and health goal,
          your daily macronutrient intake should be as follows:
          <ul>
            <li>♥ <b>${protein_grams.toFixed(0)} grams of protein per day</b>
            (${protein_calories.toFixed(0)} of your daily calories should come from protein)</li>
            <li>♥ <b>${fat_grams.toFixed(0)} grams or fat per day</b>
            (${fat_calories.toFixed(0)} of your daily calories should come from fat)</li>
            <li>♥ <b>${carb_grams.toFixed(0)} grams of carb per day</b>
            (${carb_calories.toFixed(0)} of your daily calories should come from carb)</li>
          </ul>`);
          break;
      case "vegetarian":
        protein_calories = new_tdee * 0.35;
        fat_calories = new_tdee * 0.2;
        carb_calories = new_tdee * 0.45;
        var protein_grams = protein_calories/4;
        var carb_grams = carb_calories/4;
        var fat_grams = fat_calories/9;
        $("#resultMacro").html(`The vegetarian diet is a plant-based diet that
          excludes meat, poultry, and fish, but may include other animal products
          such as eggs and dairy. As a result, it can be easier to get all the
          nutrients your body needs on a vegetarian diet compared to a vegan diet,
          but it is still important to pay attention to your nutrient intake.
          <br/><br/> Based on your BMR, activity level and health goal,
          your daily macronutrient intake should be as follows:
          <ul>
            <li>♥ <b>${protein_grams.toFixed(0)} grams of protein per day</b>
            (${protein_calories.toFixed(0)} of your daily calories should come from protein)</li>
            <li>♥ <b>${fat_grams.toFixed(0)} grams or fat per day</b>
            (${fat_calories.toFixed(0)} of your daily calories should come from fat)</li>
            <li>♥ <b>${carb_grams.toFixed(0)} grams of carb per day</b>
            (${carb_calories.toFixed(0)} of your daily calories should come from carb)</li>
          </ul>`);
        break;
      case "none":
        protein_calories = new_tdee * 0.35;
        fat_calories = new_tdee * 0.2;
        carb_calories = new_tdee * 0.45;
        var protein_grams = protein_calories/4;
        var carb_grams = carb_calories/4;
        var fat_grams = fat_calories/9;
        $("#resultMacro").html(`When eaten in the right ratios, these three macronutrients
            can improve your weight, health and overall physical well-being.
            In general, most adults should target their diets to comprise of
            45-65% Carbohydrates, 10-35% Protein and 20-35% Fat.
            <br/><br/> Based on your BMR, activity level and health goal,
            your daily macronutrient intake should be as follows:
            <ul>
              <li>♥ <b>${protein_grams.toFixed(0)} grams of protein per day</b>
              (${protein_calories.toFixed(0)} of your daily calories should come from protein)</li>
              <li>♥ <b>${fat_grams.toFixed(0)} grams or fat per day</b>
              (${fat_calories.toFixed(0)} of your daily calories should come from fat)</li>
              <li>♥ <b>${carb_grams.toFixed(0)} grams of carb per day</b>
              (${carb_calories.toFixed(0)} of your daily calories should come from carb)</li>
            </ul>`);
        break;
      default:
        $("#resultMacro").html(`Eat what makes you happy!`);
    }

    // TEST - MEAL SUGGESTION - BASED ON ALLERGENS
    let meals = [
      {
        name: "Bibimbap",
        servingSize: "1 bowl",
        macronutrients: {
            protein: 12,
            carbs: 85,
            fat: 7
        },
        calories: 440,
        allergens: ["gluten","soy","egg"],
        diets: ["none", "paleo"],
        recipeURL: "https://www.purewow.com/recipes/bibimbap-bowls",
        imgUrl: 'bibimbap.jpg'

      },
      {
        name: "Garlicky Spinach and Chickpea Soup with Lemon and Pecorino Romano",
        servingSize: "1 bowl",
        macronutrients: {
            protein: 22,
            carbs: 58,
            fat: 8
        },
        calories: 468,
        allergens: ["Gluten-contaning ingredients","dairy","egg"],
        diets: ["none", "vegan","vegetarian"],
        recipeURL: "https://www.purewow.com/recipes/garlicky-spinach-chickpea-soup-lemon-pecorino",
        imgUrl: 'chickpea.jpg'

      },
      {
        name: "Turkey Meatballs with Zucchini Noodles",
        servingSize: "1 bowl",
        macronutrients: {
            protein: 33,
            carbs: 28,
            fat: 18
        },
        calories: 393,
        allergens: ["dairy"],
        diets: ["none", "paleo"],
        recipeURL: "https://www.purewow.com/recipes/meal-prep-turkey-meatballs-zucchini-noodles",
        imgUrl: 'turkey.jpg'
      },
      {
        name: "Quick Guacamole Quinoa Salad",
        servingSize: "1 plate",
        macronutrients: {
            protein: 15,
            carbs: 57,
            fat: 18
        },
        calories: 431,
        allergens: [],
        diets: ["none", "vegan", "vegetarian"],
        recipeURL: "https://www.purewow.com/recipes/quick-guacamole-quinoa-salad",
        imgUrl: 'quionasalad.jpg'
      },
      {
        name: "Green Bowl with Chicken, Citrus and Herbs",
        servingSize: "1 bowl",
        macronutrients: {
            protein: 32,
            carbs: 45,
            fat: 19
        },
        calories: 443,
        allergens: [],
        diets: ["none"],
        recipeURL: "https://www.purewow.com/recipes/green-bowl-chicken-citrus-herbs",
        imgUrl: 'greenbowl.jpg'
      },
      {
        name: "The Ultimate Quinoa-Avocado Bowl",
        servingSize: "1 bowl",
        macronutrients: {
            protein: 31,
            carbs: 55,
            fat: 33
        },
        calories: 622,
        allergens: ["shellfish", "Gluten-contaning ingredients"],
        diets: ["none", "vegan","vegetarian"],
        recipeURL: "https://www.purewow.com/recipes/the-ultimate-quinoa-avocado-bowl",
        imgUrl: 'quionabowl.jpg'
      },
      {
        name: "Sheet-Pan Lemon Butter Veggies and Sausage",
        servingSize: "1 plate",
        macronutrients: {
            protein: 16,
            carbs: 18,
            fat: 20
        },
        calories: 310,
        allergens: [],
        diets: ["none"],
        recipeURL: "https://www.purewow.com/recipes/sheet-pan-lemon-garlic-butter-sausage",
        imgUrl: 'sausage.jpg'
      },
      // {
      //   name: "Sheet-Pan Chicken and Rainbow Vegetables",
      //   servingSize: "1 serving",
      //   macronutrients: {
      //       protein: 31,
      //       carbs: 31,
      //       fat: 14
      //   },
      //   calories: 380,
      //   allergens: ["sesame"],
      //   diets: ["none", "vegan","vegetarian", "paleo"],
      //   recipeURL: "https://www.purewow.com/recipes/keto-sheet-pan-chicken-rainbow-veggies",
      //   imgUrl: 'chickenveggie.jpg'
      // },
      {
        name: "Honey Sesame Chicken with Broccolini",
        servingSize: "1 plate",
        macronutrients: {
            protein: 31,
            carbs: 51,
            fat: 33
        },
        calories: 599,
        allergens: ["sesame"],
        diets: ["none", "paleo"],
        recipeURL: "https://www.purewow.com/recipes/meal-prep-honey-sesame-chicken-with-broccolini",
        imgUrl: 'chicken.jpg'
      },
      {
        name: "Buffalo-Stuffed Sweet Potatoes",
        servingSize: "1 plate",
        macronutrients: {
            protein: 28,
            carbs: 26,
            fat: 28
        },
        calories: 455,
        allergens: [],
        diets: ["none", "paleo"],
        recipeURL: "https://www.purewow.com/recipes/buffalo-stuffed-sweet-potatoes",
        imgUrl: 'buffalo.jpg'
      },
      {
        name: "Slow-Cooker Meal-Prep Burrito Bowls",
        servingSize: "1 bowl",
        macronutrients: {
            protein: 44,
            carbs: 54,
            fat: 55
        },
        calories: 854,
        allergens: ["gluten"],
        diets: ["none", "paleo"],
        recipeURL: "https://www.purewow.com/recipes/slow-cooker-meal-prep-burrito-bowls",
        imgUrl: 'burrito.jpg'
      },
      {
        name: "Shrimp with Cauliflower “Grits” and Arugula",
        servingSize: "1 plate",
        macronutrients: {
            protein: 24,
            carbs: 12,
            fat: 15
        },
        calories: 273,
        allergens: ["shellfish"],
        diets: ["none", "keto"],
        recipeURL: "https://www.purewow.com/recipes/shrimp-and-cauliflower-grits",
        imgUrl: 'keto1.jpg'
      },
      {
        name: "Ketogenic Baked Eggs and Zoodles with Avocado",
        servingSize: "1 plate",
        macronutrients: {
            protein: 20,
            carbs: 27,
            fat: 53
        },
        calories: 633,
        allergens: ["egg"],
        diets: ["none", "keto"],
        recipeURL: "https://www.purewow.com/recipes/ketogenic-baked-eggs-and-zoodles-with-avocado",
        imgUrl: 'keto2.jpg'
      },
      {
        name: "Slow-Cooker Pork Carnitas",
        servingSize: "1 serving",
        macronutrients: {
            protein: 30,
            carbs: 9,
            fat: 31
        },
        calories: 442,
        allergens: [],
        diets: ["none", "keto"],
        recipeURL: "https://www.purewow.com/recipes/Slow-Cooker-Pork-Carnitas-Tacos",
        imgUrl: 'keto3.jpg'
      },
    ];

    // Look at every meal and add the appropriate ones into recommendedMeals
    const recommendedMeals = meals.filter(meal => {
      return meal.diets.includes(selectedDiet) &&
          !selectedAllergens.some(a => meal.allergens.includes(a))
    }).slice(0, 5);
    // var recommendedMeals = [];
    // for (var i = 0; i < meals.length; i++) {
    //   var dietMatchesUserChoice = false;
    //   var allergenMatchesUserChoice = false;
    //   var meal = meals[i];
    //   console.log(`Checking if we should keep ${JSON.stringify(meal, null, 2)}`);
    //
    //   // Check if diet is acceptable.
    //   if (meal.diets.includes(selectedDiet)) {
    //     console.log(`it does include diet ${selectedDiet}`);
    //     dietMatchesUserChoice = true;
    //   }
    //
    //   // Loop thru user's allergesn to see if any one is in the list.
    //   for (var j = 0; j < selectedAllergens.length; j++) {
    //     if (meal.allergens.includes(selectedAllergens[j])) {
    //       console.log(`it does include allergen ${selectedAllergens[j]}`);
    //       allergenMatchesUserChoice = true;
    //     }
    //   }
    //
    //   // Now see if we keep this meal or not.
    //   console.log(`diet match is ${dietMatchesUserChoice} allergen is ${allergenMatchesUserChoice}`);
    //   if (dietMatchesUserChoice && !allergenMatchesUserChoice) {
    //     console.log("added meal " + meal);
    //     recommendedMeals.push(meal);
    //   }
    // }
    let recommendedMealText =
      recommendedMeals.length == 0
      ? "Ooops, no meals matched the criteria! We're updating our menu soon!"
      : "";
    recommendedMeals.forEach(m => {
      recommendedMealText += `
        <div class='section'>
          <h5>${m.name}</h5>
          <ul class="section">
            <li>♥ ${m.servingSize}</li>
            <li>♥ ${m.calories} calories</li>
            <li>♥ ${m.macronutrients.protein} grams of protein</li>
            <li>♥ ${m.macronutrients.carbs} grams of carb</li>
            <li>♥ ${m.macronutrients.fat} grams of fat</li>
            <li>♥ <a href='${m.recipeURL}' target="_blank">Recipe</a></li>
          </ul>
          <img class="materialboxed responsive-img" src="${m.imgUrl}">
        </div>
      `;
    });

    $("#resultMeals").html(`${recommendedMealText}
      <br><br>
      Please note that allergens and dietary restrictions can vary depending on
      how it is prepared and the ingredients used. The meal can be prepared in
      many different ways, with different ingredients. As a result, the
      macronutrient and caloric values could vary greatly based on the specific
      recipe and ingredients used.`);

    //DISCLAIMER
    $("#resultInfo").text(`It is always a good idea to consult with a healthcare
      professional or a registered dietitian before starting any new diet or
      exercise program. It is important to note that these are general guidelines,
      and your specific calorie and macronutrient needs may vary depending on
      your goals, body composition, and other factors. Note that no one diet is
      right for everyone, and it's important to choose a diet that is sustainable,
      nutritionally balanced, and meets your individual needs and goals.`);
    // Make image JS work.
    $('.materialboxed').materialbox();
    $("#resultContainer").show();

    logEvent(analytics, 'submit_form_complete', {
      name: 'bmr_form_complete'
    });
  });
});
