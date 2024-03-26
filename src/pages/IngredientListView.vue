<template>
        <v-row>
            <v-col>
                <IngredientTable />
            </v-col>
        </v-row>
</template>

<script>
    import IngredientTable from '../components/ingredient/IngredientTable.vue';
    export default {
        components: {
            IngredientTable
        }
    }
</script>

<style lang="scss" scoped>

</style>