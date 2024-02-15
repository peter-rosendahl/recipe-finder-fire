<template>
    <div class="auth-bar">
        <template v-if="this.currentMember != null">
            <p>{{ this.currentMember?.name }}</p>
            <v-btn
                icon="mdi-arrow-right-circle-outline"
                title="Sign out"
                @click="this.signOut()"   
            ></v-btn>
        </template>
        <template v-else>
            <v-btn @click="promptLogin">Profile</v-btn>
        </template>
    </div>
    <v-dialog v-model="loginDialog.isVisible" max-width="600px">
        <v-card>
            <v-card-title style="text-align: center; font-size: 32px; padding: 24px 0;">Profile</v-card-title>
            <v-card-text>
                <v-form v-model="isValid">
                    <v-container>
                        <!-- <v-row>
                            <v-col>
                                <p>Login or create profile</p>
                            </v-col>
                        </v-row> -->
                        <v-row>
                            <v-col>
                                <v-text-field
                                    v-model="loginDialog.email"
                                    variant="solo"
                                    label="Email*"
                                    :rules="emailRules"
                                    type="email"></v-text-field>
                            </v-col>
                            <v-col>
                                <v-text-field
                                    v-model="loginDialog.password"
                                    variant="solo"
                                    label="Password*"
                                    :rules="passwordRules"
                                    type="password"></v-text-field>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="12" sm="3">
                                <v-switch
                                    class="v-input--reverse"
                                    v-model="loginDialog.isCreate"
                                    color="orange-darken-3"
                                    inset>
                                    <template #label>
                                        Create
                                    </template>
                                </v-switch>
                            </v-col>
                            <v-col>
                                <v-text-field
                                    v-model="loginDialog.name"
                                    v-if="loginDialog.isCreate"
                                    variant="solo"
                                    :rules="nameRules"
                                    label="Full name*"
                                    type="text"></v-text-field>
                                <p class="error">{{ loginDialog.errorMessage }}</p>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col>
                                <p>Forgot password?</p>
                                <v-btn @click="sendResetPassword" variant="plain">Send reset password link to email</v-btn>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-form>
            </v-card-text>
            <v-card-actions>
                <v-container>
                    <v-row>
                        <v-col cols="auto">
                            <v-btn blank @click="clearLogin">Cancel</v-btn>
                        </v-col>
                        <v-spacer></v-spacer>
                        <v-col cols="auto">
                            <v-btn color="success" @click="confirmLogin">{{loginDialog.isCreate ? 'Create' : 'Submit'}}</v-btn>
                        </v-col>
                    </v-row>
                </v-container>
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
                isValid: false,
                memberSignedIn: null,
                labels: {
                    email: "Email",
                    password: "Password"
                },
                loginDialog: {
                    isVisible: false,
                    email: "",
                    password: "",
                    isCreate: false,
                    name: "",
                    isLoading: false,
                    errorMessage: ""
                },
                emailRules: [
                    v => {
                        if (v) return true
                        return 'Email is required'
                    },
                    v => {
                        if (/.+@.+\..+/.test(v)) return true
                        return 'E-mail must be valid.'
                    }
                ],
                passwordRules: [
                    v => {
                        if (v) return true
                        return 'Password is required'
                    },
                    v => {
                        if (v.length > 5) return true
                        return 'Password must be minimum 6 characters'
                    }
                ],
                nameRules: [
                    v => {
                        if (!this.loginDialog.isCreate || v) return true
                        return 'Name is required'
                    }
                ]
            }
        },

        async created() {
            await this.checkForLoggedIn();
        },

        watch: {
            currentMember(oldValue, updatedValue) {
                console.log(oldValue, updatedValue);
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

            promptLogin() {
                this.loginDialog.isVisible = true;
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
                    this.setlocalMemberData(this.currentMember);
                }
            },

            setlocalMemberData(data) {
                this.memberSignedIn = data;
                this.isAuthenticated = data != null;
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
        display: flex;
        align-items: center;
    }

    .error {
        color: red;
    }
</style>