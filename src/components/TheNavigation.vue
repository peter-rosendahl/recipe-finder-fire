<template>
    <template v-for="item in links">
        <router-link v-if="item.isAdmin == false || (this.currentMember != null && this.currentMember.isAdmin)" :to="item.link" class-active="active" class="link text-darkgreen">
            <v-icon :icon="item.icon" :title="item.text"></v-icon>
            <p>{{ item.text }}</p>
        </router-link>
    </template>
    <!-- <v-card>
        <v-list nav class="text-darkgreen">
            <template v-for="item in links">
                <router-link :to="item.link" class="text-darkgreen">
                    <v-list-item :prepend-icon="item.icon" :title="item.text"></v-list-item>
                </router-link>
            </template>
        </v-list>
    </v-card> -->
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
const authHelper = createNamespacedHelpers('auth');
    export default {
        computed: {
            ...authHelper.mapGetters(["currentMember"]),
            links() {
                return [
                    {
                        icon: "mdi-food-variant",
                        text: "Ingredients",
                        link: "/ingredients",
                        isAdmin: true,
                    },
                    {
                        icon: "mdi-format-list-text",
                        text: "Recipes",
                        link: "/recipes",
                        isAdmin: false
                    },
                    {
                        icon: "mdi-fridge-variant-outline",
                        text: "My Kitchen",
                        link: "/kitchen",
                        isAdmin: false
                    }
                ]
            }
        },
    }
</script>

<style lang="scss" scoped>
    .link {
        padding: 10px 15px;
        margin: 0 5px;
        display: flex;
        flex-flow: row nowrap;
        align-items: center;
        border-radius: 4px;
        background: #fff;
        box-shadow: 0px 2px 3px rgba(0,0,0,0.2);

        &.router-link-active {
            // background-color: #978476;
            background-color: #6badc1;
            color: #fff !important;
            box-shadow: none;
        }

        p {
            font-weight: 100;
            margin-left: 5px;
        }
    }

    @media screen and (max-width: 900px) {
        .link {
            p {
                display: none;
            }
        }
    }
</style>