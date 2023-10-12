<template>
        <v-row>
            <v-col>
                <IngredientList />
            </v-col>
        </v-row>
</template>

<script>
    import IngredientList from '../components/IngredientList.vue';
    export default {
        components: {
            IngredientList
        }
    }
</script>

<style lang="scss" scoped>

</style>