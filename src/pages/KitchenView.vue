<template>
    <v-row>
        <v-col cols="12" sm="6">
            <h1 class="text-babyblue">My kitchen</h1>
        </v-col>
    </v-row>
    <v-row>
        <v-col>
            <ingredient-list source="kitchen" />
        </v-col>
    </v-row>
    <v-row>
        <v-col>
            <v-btn @click="() => saveKitchenList({uid: this.currentMember.id, data: this.kitchenList})">Save</v-btn>
        </v-col>
    </v-row>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import IngredientList from '../components/ingredient/IngredientList.vue';
const kitchenHelper = createNamespacedHelpers("kitchenlist");
const authHelper = createNamespacedHelpers("auth");

    export default {
        name: "My kitchen",

        components: {
            'ingredient-list': IngredientList
        },

        created() {
        },

        mounted() {
        },

        data() {
            return {

            }
        },

        watch: {
            currentMember: {
                handler(value, oldValue) {
                    console.log('current member', value, oldValue);
                    if (this.kitchenList.length == 0 && this.currentMember != null) {
                        this.fetchKitchenListByAuthorId(this.currentMember.id);
                    }
                }
            }
        },

        computed: {
            ...kitchenHelper.mapGetters(["kitchenList"]),
            ...authHelper.mapGetters(["currentMember"]),
            headers() {
                return [
                    { title: "Name", align: "start", key: "customName" },
                ]
            }
        },

        methods: {
            ...kitchenHelper.mapActions([
                "addToKitchenList", 
                "removeFromKitchenList", 
                "clearList", 
                "fetchKitchenListByAuthorId", 
                "saveKitchenList"
            ]),
        }
    }
</script>

<style lang="scss" scoped>

</style>