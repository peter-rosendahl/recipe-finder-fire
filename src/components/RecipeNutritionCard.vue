<template>
    <v-card>
        <v-card-title>Recipe nutritions ({{ renderTotalWeight() }}g)</v-card-title>
        <v-card-text>
            <div class="stat">
                <p>Carbohydrates:</p>
                <p>{{ calculateRecipeNutritions("carbs").toFixed(2) }} g</p>
            </div>
            <div class="stat">
                <p>Of which sugar:</p>
                <p>{{ calculateRecipeNutritions("sugar").toFixed(2) }} g</p>
            </div>
            <div class="stat">
                <p>Fat:</p>
                <p>{{ calculateRecipeNutritions("fat").toFixed(2) }} g</p>
            </div>
            <div class="stat">
                <p>Of which is saturated:</p>
                <p>{{ calculateRecipeNutritions("satFat").toFixed(2) }} g</p>
            </div>
            <div class="stat">
                <p>Fiber:</p>
                <p>{{ calculateRecipeNutritions("fiber").toFixed(2) }} g</p>
            </div>
            <div class="stat">
                <p>Protein:</p>
                <p>{{ calculateRecipeNutritions("protein").toFixed(2) }} g</p>
            </div>
        </v-card-text>
    </v-card>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
const ingredientHelper = createNamespacedHelpers("ingredient");
    export default {
        created() {
            this.ingredientList.forEach(item => {
                this.calculateIngredientNutritions(item);
            });
        },

        data() {
            return {
                nutritions: []
            };
        },

        props: {
            ingredientList: {
                type: Object,
                required: true
            }
        },

        computed: {
            ...ingredientHelper.mapGetters(["ingredients"]),  
        },

        methods: {
            calculateIngredientNutritions(item) {
                const src = this.ingredients.find(x => x.id == item.id);
                const q = item.quantity;
                let calory = 0,
                    carb = 0,
                    sugar = 0,
                    fat = 0,
                    satFat = 0,
                    fiber = 0,
                    protein = 0;
                switch (src.unitType) {
                    case "stk./pc.":
                        calory = parseFloat(src.calories) > 0 ? (src.calories*q).toFixed(2) : 0;
                        carb = parseFloat(src.carbohydrates) > 0 ? (src.carbohydrates*q).toFixed(2) : 0;
                        sugar = parseFloat(src.sugars) > 0 ? (src.sugars*q).toFixed(2) : 0;
                        fat = parseFloat(src.fat) > 0 ? (src.fat*q).toFixed(2) : 0;
                        satFat = parseFloat(src.saturatedFat) > 0 ? (src.saturatedFat*q).toFixed(2) : 0;
                        fiber = parseFloat(src.fiber) > 0 ? (src.fiber*q).toFixed(2) : 0;
                        protein = parseFloat(src.protein) > 0 ? (src.protein*q).toFixed(2) : 0;
                        break;
                        
                    case "teaspoon":
                        calory = parseFloat(src.calories) > 0 ? ((q*5.69)/src.calories).toFixed(2) : 0;
                        carb = parseFloat(src.carbohydrates) > 0 ? ((q*5.69)/src.carbohydrates).toFixed(2) : 0;
                        sugar = parseFloat(src.sugars) > 0 ? ((q*5.69)/src.sugars).toFixed(2) : 0;
                        fat = parseFloat(src.fat) > 0 ? ((q*5.69)/src.fat).toFixed(2) : 0;
                        satFat = parseFloat(src.saturatedFat) > 0 ? ((q*5.69)/src.saturatedFat).toFixed(2) : 0;
                        fiber = parseFloat(src.fiber) > 0 ? ((q*5.69)/src.fiber).toFixed(2) : 0;
                        protein = parseFloat(src.protein) > 0 ? ((q*5.69)/src.protein).toFixed(2) : 0;
                        break;
                    
                    case "g":
                        calory = parseFloat(src.calories) > 0 ? ((src.calories/100)*q).toFixed(2) : 0;
                        carb = parseFloat(src.carbohydrates) > 0 ? ((src.carbohydrates/100)*q).toFixed(2) : 0;
                        sugar = parseFloat(src.sugars) > 0 ? ((src.sugars/100)*q).toFixed(2) : 0;
                        fat = parseFloat(src.fat) > 0 ? ((src.fat/100)*q).toFixed(2) : 0;
                        satFat = parseFloat(src.saturatedFat) > 0 ? ((src.saturatedFat/100)*q).toFixed(2) : 0;
                        fiber = parseFloat(src.fiber) > 0 ? ((src.fiber/100)*q).toFixed(2) : 0;
                        protein = parseFloat(src.protein) > 0 ? ((src.protein/100)*q).toFixed(2) : 0;
                        break;
                    
                    case "ml":
                        calory = parseFloat(src.calories) > 0 ? ((src.calories/100)*q).toFixed(2) : 0;
                        carb = parseFloat(src.carbohydrates) > 0 ? ((src.carbohydrates/100)*q).toFixed(2) : 0;
                        sugar = parseFloat(src.sugars) > 0 ? ((src.sugars/100)*q).toFixed(2) : 0;
                        fat = parseFloat(src.fat) > 0 ? ((src.fat/100)*q).toFixed(2) : 0;
                        satFat = parseFloat(src.saturatedFat) > 0 ? ((src.saturatedFat/100)*q).toFixed(2) : 0;
                        fiber = parseFloat(src.fiber) > 0 ? ((src.fiber/100)*q).toFixed(2) : 0;
                        protein = parseFloat(src.protein) > 0 ? ((src.protein/100)*q).toFixed(2) : 0;
                        break;

                    default: 
                        calory = parseFloat(src.calories) > 0 ? ((q)/src.calories).toFixed(2) : 0;
                        carb = parseFloat(src.carbohydrates) > 0 ? ((q)/src.carbohydrates).toFixed(2) : 0;
                        sugar = parseFloat(src.sugars) > 0 ? ((q)/src.sugars).toFixed(2) : 0;
                        fat = parseFloat(src.fat) > 0 ? ((q)/src.fat).toFixed(2) : 0;
                        satFat = parseFloat(src.saturatedFat) > 0 ? ((q)/src.saturatedFat).toFixed(2) : 0;
                        fiber = parseFloat(src.fiber) > 0 ? ((q)/src.fiber).toFixed(2) : 0;
                        protein = parseFloat(src.protein) > 0 ? ((q)/src.protein).toFixed(2) : 0;
                        break;
                }
                if (this.nutritions.find(x => x.id == src.id) == null) {
                    this.nutritions.push({
                        id: src.id, 
                        cal: calory,
                        carb: carb,
                        sugar: sugar,
                        fat: fat,
                        satFat: satFat,
                        fiber: fiber,
                        protein: protein
                    });
                }
            },

            calculateRecipeNutritions(type) {
                let sum = 0;
                let array = [];
                switch (type) {
                    case "calories":
                        array = this.nutritions.map(x => x.cal);
                        break;
                    
                    case "carbs":
                        array = this.nutritions.map(x => x.carb);
                        break;
                    
                    case "sugar":
                        array = this.nutritions.map(x => x.sugar);
                        break;
                    
                    case "fat":
                        array = this.nutritions.map(x => x.fat);
                        break;

                    case "satFat":
                        array = this.nutritions.map(x => x.satFat);
                        break;

                    case "fiber":
                        array = this.nutritions.map(x => x.fiber);
                        break;

                    case "protein":
                        array = this.nutritions.map(x => x.protein);
                        break;

                    default: 
                        array = [];
                        break;
                }

                if (array.length > 0) {
                    for (let i = 0; i < array.length; i++) {
                        const el = array[i];
                        sum += parseFloat(el);
                    }
                }

                return sum;
            },

            renderTotalWeight() {
                const quantityList = this.ingredientList.map(x => parseInt(x.quantity));
                return quantityList.reduce((a, b) => {
                    return a + b;
                }, 0);
            }
        }
    }
</script>

<style lang="scss" scoped>
    .stat {
        display: flex;
        justify-content: space-between;
        border-bottom: 1px solid rgba(0,0,0,0.08);
    }
</style>