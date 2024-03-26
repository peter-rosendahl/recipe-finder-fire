<template>
    <template v-for="item in currentIngredients">
        <div class="flex row wrap align_center mb_20">
            <v-text-field
                class="flex-item o1 mobile_o2"
                style="max-width: 100px;"
                v-model="item.quantity"
                hide-details
                density="compact"
                variant="solo"
                dense
                label="Quantity">
            </v-text-field>
            <v-select
                class="flex-item o2 mobile_o3"
                style="max-width: 100px;"
                :items="item.unitTypeList"
                v-model="item.selectedUnitType"
                hide-details
                variant="solo"
                density="compact"
                dense
                label="Unit type"></v-select>
            <v-select 
                class="flex-item mobile_grow o3 mobile_o1"
                :items="this.ingredients.map(x => x.name.en)" 
                v-model="item.selectedName"
                @update:modelValue="(e) => setIngredient(e, item)"
                variant="solo"
                density="compact"
                hide-details
                single-line
                dense
                label="Name"
            ></v-select>
            <v-btn 
                fab 
                icon 
                color="white" 
                @click="() => removeIngredient(item)"
                class="flex-item mobile_o4 ml_auto">
                <v-icon size="18px" icon="mdi-trash-can-outline" color="red"></v-icon>
            </v-btn>
        </div>
    </template>
    <v-row>
        <v-col>
            <v-btn class="add-ingredient-btn" solo @click="addIngredient()">
                Add ingredient
            </v-btn>
        </v-col>
    </v-row>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
const ingredientHelper = createNamespacedHelpers("ingredient");
const kitchenHelper = createNamespacedHelpers("kitchen");
const recipeHelper = createNamespacedHelpers("recipe");

    export default {
        
        props: {
            source: {
                type: String,
                required: true
            }
        },

        data() {
            return {
                currentIngredients: []
            }
        },

        computed: {
            ...ingredientHelper.mapGetters(["ingredients", "unitTypeList", "recipeIngredientList"]),
            ...kitchenHelper.mapGetters(["kitchenList"]),
        },

        methods: {
            ...ingredientHelper.mapActions([
                "fetchIngredients",
                "setRecipeIngredientList",
                "appendToRecipeIngredientList",
                "updateRecipeIngredient",
                "removeRecipeIngredient",
                "clearRecipeIngredientList"
            ]),
            ...kitchenHelper.mapActions(
                [
                    "appendToKitchenList",
                    "updateKitchenItem",
                    "removeKitchenItem",
                    "clearKitchenList"
                ]),

            async addIngredient() {
                if (this.ingredients.length == 0) {
                    await this.fetchIngredients();
                };
                console.log("addIngredient", this.ingredients);
                const tmp = this.ingredients[0];
                this.appendToRecipeIngredientList({
                    listId: this.recipe.recipeIngredients?.length ?? 0,
                    id: tmp.id,
                    name: tmp.name,
                    selectedName: tmp.name.en,
                    quantity: 1,
                    recipeId: 0,
                    unitTypeList: tmp.unitType,
                    selectedUnitType: tmp.unitType[0]
                });
            },

            removeIngredient(item) {
                this.removeItemFromList(item, this.source);
            },

            setIngredient(value, item) {
                console.log('setIngredient', value, item, this.recipeIngredientList);
                const ingredient = this.ingredients.find(x => x.name.en.includes(value));
                if (ingredient != null) {
                    console.log("found ingredient", ingredient, ingredient.id, ingredient.unitType);
                    const existing = this.recipeIngredientList.find(x => x.selectedName == value);
                    console.log("existing ingredient", existing);
                    const itemtoBeAdded = {
                        listId: existing.listId ?? 0,
                        id: ingredient.id,
                        name: ingredient.name,
                        selectedName: value,
                        unitTypeList: ingredient.unitType,
                        selectedUnitType: ingredient.unitType[0],
                        quantity: 0,
                    };
                    console.log("item to be added", Object.values(itemtoBeAdded));
                    console.log("status on the actual list", this.recipeIngredientList);

                    if (existing == null) {
                        this.addToList(itemtoBeAdded, this.source);
                    } else {
                        itemtoBeAdded.quantity = existing.quantity;
                        this.updateItemInList(itemtoBeAdded, existing.id, this.source);
                    }
                }
            },

            addToList(item, sourceType) {

            },

            updateItemInList(item, originalId, sourceType) {
                let sourceList = [];

                switch(sourceType) {
                    case "kitchen":
                        sourceList = [...this.kitchenList];
                        break;

                    case "recipe":
                        sourceList: [...this.recipeIngredientList];
                }

            },

            removeItemFromList(item, sourceType) {
                switch(sourceType) {
                    case "kitchen":
                        this.removeKitchenItem(item);
                        break;

                    case "recipe":
                        this.removeRecipeIngredient(item);
                        break;
                }
            }
        }
    }
</script>

<style lang="scss" scoped>

</style>