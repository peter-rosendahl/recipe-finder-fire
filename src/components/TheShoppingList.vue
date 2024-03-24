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
        <v-dialog  persistent fullscreen v-model="dialog.isVisible" max-width="100%" >
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
                        <template v-slot:item="{item}">
                            <tr :class="item.raw.isFetched ? 'fetched' : ''">
                                <td><v-icon color="red" @click="(e) => this.removeFromShoppingList(item.raw)">mdi-close</v-icon></td>
                                <td>{{ item.raw.name }}</td>
                                <td>{{ item.raw.category }}</td>
                                <td><p v-for="(itm, index) in item.raw.quantities">{{(index > 0 ? '+' : '')}} {{ itm.amount }} {{ itm.unitType }}</p></td>
                                <td><v-icon :disabled="item.raw.isFetched" :color="item.raw.isFetched ? 'gray' : 'green'" @click="(e) => this.markItemAsFetched(item.raw)">mdi-check</v-icon></td>
                            </tr>
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
                { title: "Remove", align: "start", key: "remove" },
                { title: "Name", align: "start", key: "name" },
                { title: "Category", align: "start", key: "category" },
                { title: "Amount", align: "end", key: "quantities" },
                { title: "Got it", align: "end", key: "complete" }
            ]
        }
    },
    computed: {
        ...shoppingListHelper.mapGetters(["shoppingList"]),
        renderRowClasses(data) {
            return data?.item?.isFetched ? "fetched" : "unfetched";
        }
    },
    methods: {
        ...shoppingListHelper.mapActions(["removeFromShoppingList", "clearShoppingList","markAsFetched"]),

        rowProps(data) {
            return {
                class: {
                    'fetched': data.item.isFetched,
                    'unfetched': data.item.isFetched == false
                }
            }
        },

        markItemAsFetched(item) {
            console.log("markItemAsFetched", item);
            this.markAsFetched(item);
        }
    }
}
</script>

<style lang="scss" scoped>

    .wrapper {
        padding-right: 25px;
    }

    .fetched td {
        background: rgba(189, 255, 189, 0.9) !important;
    }
</style>