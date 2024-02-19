<template>
    <div class="wrapper">
        <v-badge
            v-if="this.shoppingList != undefined && this.shoppingList?.length != 0"
            color="error"
            :content="this.shoppingList?.length ?? 0">
            <v-icon size="x-large" @click="dialog.isVisible = true">
                mdi-cart
            </v-icon>
        </v-badge>
        <v-dialog persistent v-model="dialog.isVisible" max-width="500px">
            <v-card>
                <v-toolbar>
                    <v-toolbar-title class="text-h6">
                        Shopping list
                    </v-toolbar-title>
                    <template v-slot:append>
                        <v-btn icon="mdi-close" @click="dialog.isVisible = false"></v-btn>
                    </template>
                </v-toolbar>
                <v-card-text>
                    <v-data-table
                        :items="this.shoppingList"
                        :headers="headers">
                        <template v-slot:item.quantities="{item}">
                            <p v-for="(itm, index) in item.raw.quantities">{{(index > 0 ? '+' : '')}} {{ itm.amount }} {{ itm.unitType }}</p>
                        </template>
                    </v-data-table>
                </v-card-text>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
const shoppingListHelper = createNamespacedHelpers("shoppinglist");

export default {
    data() {
        return {
            dialog: {
                isVisible: false
            },
            headers: [
                { title: "Name", align: "start", key: "name" },
                { title: "Category", align: "start", key: "category" },
                { title: "Amount", align: "end", key: "quantities" }
            ]
        }
    },
    computed: {
        ...shoppingListHelper.mapGetters(["shoppingList"]),
    }
}
</script>

<style lang="scss" scoped>
    .wrapper {
        padding-right: 25px;
    }
</style>