<template>
    <v-row>
            <v-col cols="12" sm="6">
                <h1 class="text-babyblue">My kitchen</h1>
            </v-col>
    </v-row>
    <v-row>
        <v-col>
        </v-col>
    </v-row>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
const kitchenHelper = createNamespacedHelpers("kitchen");
const recipeHelper = createNamespacedHelpers("recipe");

    export default {
        name: "My kitchen",

        created() {

        },

        mounted() {
        },

        data() {
            return {

            }
        },

        computed: {
            ...kitchenHelper.mapGetters(["kitchenList"]),
            headers() {
                return [
                    { title: "Name", align: "start", key: "customName" },
                ]
            }
        },

        methods: {
            ...kitchenHelper.mapActions(["addToKitchenList", "removeFromKitchenList", "clearList"]),
            // ...recipeHelper.mapActions([""])
        }
    }
</script>

<style lang="scss" scoped>

</style>