<template>
    <div class="auth-bar">
        <template v-if="this.currentMember != null">
            <p>{{ this.currentMember?.name }}</p>
            <v-btn
                icon="mdi-logout"
                @click="this.signOut()"   
            ></v-btn>
        </template>
        <template v-else>
            <v-btn @click="promptLogin">Login</v-btn>
        </template>
    </div>
    <v-dialog v-model="loginDialog.isVisible" width="900px">
        <v-card>
            <v-card-title>Login</v-card-title>
            <v-card-text>
                <v-text-field
                    v-model="loginDialog.email"
                    label="Email"
                    type="email"></v-text-field>
                <v-text-field
                    v-model="loginDialog.password"
                    label="Password"
                    type="password"></v-text-field>
                <p class="error">{{ loginDialog.errorMessage }}</p>
            </v-card-text>
            <v-card-actions>
                <v-btn color="success" @click="confirmLogin">Submit</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
const authHelper = createNamespacedHelpers("auth");
    export default {
        data() {
            return {
                memberSignedIn: null,
                loginDialog: {
                    isVisible: false,
                    email: "",
                    password: "",
                    isLoading: false,
                    errorMessage: ""
                }
            }
        },

        async created() {
            await this.checkForLoggedIn();
        },

        computed: {
            ...authHelper.mapGetters(["currentMember", "isAuthLoading"]),
            
        },

        methods: {
            ...authHelper.mapActions(["signIn", "isLoggedIn", "signOut"]),

            promptLogin() {
                this.loginDialog.isVisible = true;
            },

            async confirmLogin() {
                this.loginDialog.isLoading = true;
                this.signIn({email: this.loginDialog.email, password: this.loginDialog.password})
                    .then(()=> {
                        this.clearLogin();
                    })
                    .catch(error => {
                        console.log("confirm Login error", error);
                        this.loginDialog.errorMessage = error;
                    })
            },

            async checkForLoggedIn() {
                if (await this.isLoggedIn()) {
                    this.memberSignedIn = this.currentMember;
                    this.isAuthenticated = this.currentMember != null;
                }
            },

            clearLogin() {
                this.loginDialog.email = "";
                this.loginDialog.password = "";
                this.loginDialog.isVisible = false;
            }
        }
    }
</script>

<style lang="scss" scoped>
    .auth-bar {
        display: flex;
        align-items: center;
    }

    .error {
        color: red;
    }
</style>