<template>
    <div class="wrapper">
        <v-badge
            v-if="this.shoppingList != undefined && this.shoppingList?.length != 0"
            color="error"
            :content="this.shoppingList?.length ?? 0">
            <v-icon size="x-large" @click="() => { this.dialog.isVisible = !this.dialog.isVisible }">
                mdi-cart
            </v-icon>
        </v-badge>
        <v-dialog  persistent fullscreen v-model="this.dialog.isVisible" max-width="100%" >
            <v-card>
                <v-toolbar>
                    <v-toolbar-title class="text-h6">
                        Shopping list
                    </v-toolbar-title>
                    <template v-slot:append>
                        <v-btn icon="mdi-delete-outline" @click="clearList"></v-btn>
                        <v-btn icon="mdi-close" @click="dialog.isVisible = false"></v-btn>
                    </template>
                </v-toolbar>
                <v-card-text>
                    <v-data-table
                        :items="shoppingList"
                        :headers="headers"
                        :row-props="rowProps"
                        >
                        <template #item.remove="{ item }">
                            <v-icon color="red" @click="removeFromShoppingList(item)">
                            mdi-close
                            </v-icon>
                        </template>

                        <template #item.name="{ item }">
                            {{ item.name }}
                        </template>

                        <template #item.category="{ item }">
                            {{ item.category }}
                        </template>

                        <template #item.quantities="{ item }">
                            <p v-for="(itm, index) in item.quantities" :key="index">
                            {{ index > 0 ? '+' : '' }} {{ itm.amount }} {{ itm.unitType }}
                            </p>
                        </template>

                        <template #item.fetched="{ item }">
                            <v-icon
                            :color="item.isFetched ? 'black' : 'green'"
                            @click="toggleItemAsFetched(item)"
                            >
                            <template v-if="item.isFetched">
                                 mdi-arrow-u-left-top
                            </template>
                            <template v-else>
                                mdi-check
                            </template>
                            </v-icon>
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
                { title: "Got it", align: "end", key: "fetched" }
            ]
        }
    },

    watch: {
        shoppingList: {
            deep: true,
            handler(value, oldValue) {
                console.log('watch.shoppingList: updated', value, oldValue);
            }
        }
    },
    computed: {
        ...shoppingListHelper.mapGetters(["shoppingList"]),
        
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

        toggleItemAsFetched(item) {
            console.log("toggleItemAsFetched", item);
            this.markAsFetched(item);
        },

        clearList() {
            this.clearShoppingList();
        }
    }
}
</script>

<style lang="scss" scoped>

    .wrapper {
        padding-right: 25px;
    }

    .v-toolbar {
        background-color: #d1e7ee;
    }

    :deep(.fetched) {
        background: rgba(189, 255, 189, 0.9) !important;
    }
</style>