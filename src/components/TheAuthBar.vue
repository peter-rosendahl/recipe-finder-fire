<template>
    <div class="auth-bar">
        <template v-if="this.currentMember != null">
            <h3>{{ this.currentMember?.name }}</h3>
            <div class="flex horizontal space_between">
                <p>Member since: </p>
                <p>{{ this.currentMember?.createdAt }}</p>
            </div>
            <div class="flex horizontal space_between">
                <p>Recipes: </p>
                <p>{{ memberRecipeCount }}</p>
            </div>

            <v-btn
                block
                color="blue-lighten-2"
                @click="this.signOut()"   
            >
                <span style="color: white;">sign out</span>
                <template v-slot:append>
                    <v-icon color="white">mdi-arrow-right-circle-outline</v-icon>
                </template>
            </v-btn>
        </template>
        <template v-else>
            <auth-form v-if="isAuthFormVisible"></auth-form>
        </template>
    </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import AuthForm from './profile/AuthForm.vue';
const authHelper = createNamespacedHelpers("auth");
const recipeHelper = createNamespacedHelpers("recipe");
    export default {
        data() {
            return {
                memberSignedIn: null,
                isAuthFormVisible: true,
                memberRecipeCount: 0,
            }
        },

        components: {
            'auth-form': AuthForm
        },

        async created() {
            await this.checkForLoggedIn();
        },

        watch: {
            currentMember(oldValue, updatedValue) {
                console.log('currentMember triggered', oldValue, updatedValue);
                this.setlocalMemberData(updatedValue);
            }
        },

        computed: {
            ...authHelper.mapGetters(["currentMember", "isAuthLoading"]),
        },

        methods: {
            ...authHelper.mapActions([
                "signIn", 
                "create", 
                "isLoggedIn", 
                "signOut",
                "requestPasswordReset"
            ]),
            ...recipeHelper.mapActions(["fetchRecipeListByAuthorId"]),

            promptLogin() {
                this.isAuthFormVisible = !this.isAuthFormVisible;
            },

            async confirmLogin() {
                console.log('confirmLogin valid', this.isValid);
                if (!this.isValid) return;
                this.loginDialog.isLoading = true;
                const {email, password, name} = this.loginDialog;
                if (this.loginDialog.isCreate) {
                    this.create({email, password, name})
                        .then(() => {
                            this.clearLogin();
                        })
                        .catch(error => {
                            console.log("Create profile error", error);
                            this.loginDialog.errorMessage = error;
                        });
                } else {
                    this.signIn({email: email, password: password})
                        .then(()=> {
                            this.clearLogin();
                        })
                        .catch(error => {
                            console.log("confirm Login error", error);
                            this.loginDialog.errorMessage = error;
                        })
                }
            },

            async checkForLoggedIn() {
                if (await this.isLoggedIn()) {
                    console.log('checkForLoggedIn Is Logged In', this.currentMember);
                    this.setlocalMemberData(this.currentMember);
                    await this.fetchRecipeListByAuthorId({uid: this.currentMember.id, callback: result => {
                        this.memberRecipeCount = result.length;
                    }});
                }
            },

            setlocalMemberData(data) {
                this.memberSignedIn = data;
                this.isAuthenticated = data != null;
                this.memberRecipeCount = data?.recipeCount;
            },

            async sendResetPassword() {
                var result = await this.requestPasswordReset({email: this.loginDialog.email});
                console.log('AuthBar: sendResetPassword result', result);
            },

            clearLogin() {
                this.loginDialog.email = "";
                this.loginDialog.password = "";
                this.loginDialog.name = "";
                this.loginDialog.isCreate = false;
                this.loginDialog.isVisible = false;
            }
        }
    }
</script>

<style lang="scss" scoped>
    .auth-bar {
        padding: 16px;
    }
    .error {
        color: red;
    }
</style>./profile/AuthForm.vue