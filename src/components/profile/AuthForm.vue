<template>
    <v-form v-model="isValid">
        <v-container>
            <v-row>
                <v-col>
                    <h3 style="font-weight: 400;">Login or create profile</h3>
                </v-col>
            </v-row>
            <v-row>
                <v-col>
                    <v-text-field
                        v-model="authForm.email"
                        variant="solo"
                        label="Email*"
                        :rules="emailRules"
                        type="email"></v-text-field>
                </v-col>
            </v-row>
            <v-row>
                <v-col>
                    <v-text-field
                        v-model="authForm.password"
                        variant="solo"
                        label="Password*"
                        :rules="passwordRules"
                        type="password"></v-text-field>
                </v-col>
            </v-row>
            <v-row>
                <v-col>
                    <v-switch
                        class="v-input--reverse"
                        v-model="authForm.isCreate"
                        color="blue-lighten-3"
                        inset>
                        <template #label>
                            Create
                        </template>
                    </v-switch>
                </v-col>
            </v-row>
            <v-row>
                <v-col>
                    <v-text-field
                        v-model="authForm.name"
                        v-if="authForm.isCreate"
                        variant="solo"
                        :rules="nameRules"
                        label="Full name*"
                        type="text"></v-text-field>
                    <p class="error">{{ authForm.errorMessage }}</p>
                </v-col>
            </v-row>
            <v-row>
                <v-col>
                    <v-btn block color="blue-darken-4" @click="confirmLogin">{{ authForm.isCreate ? 'Create' : 'Login' }}</v-btn>
                </v-col>
            </v-row>
            <v-row>
                <v-col style="text-align: center; margin-top: 50px;">
                    <h4>Forgot password?</h4>
                    <br>
                    <!-- <i>Click on the "RESET" button to send a reset password request to the provided email address above.</i> -->
                    <v-btn block variant="outlined" @click="sendResetPassword" color="grey">Request Reset</v-btn>
                </v-col>
            </v-row>
        </v-container>
    </v-form>
</template>

<script>
    import { createNamespacedHelpers } from 'vuex';
    const authHelper = createNamespacedHelpers("auth");
    export default {

        data() {
            return {
                isValid: false,
                authForm: {
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
                        if (!this.authForm.isCreate || v) return true
                        return 'Name is required'
                    }
                ]
            }
        },

        methods: {
            ...authHelper.mapActions([
                "signIn", 
                "create", 
                "isLoggedIn", 
                "signOut",
                "requestPasswordReset"
            ]),

            async confirmLogin() {
                console.log('confirmLogin valid', this.isValid);
                if (!this.isValid) return;
                this.authForm.isLoading = true;
                const {email, password, name} = this.authForm;
                if (this.authForm.isCreate) {
                    this.create({email, password, name})
                        .then(() => {
                            this.clearForm();
                        })
                        .catch(error => {
                            console.log("Create profile error", error);
                            this.authForm.errorMessage = error;
                        });
                } else {
                    this.signIn({email: email, password: password})
                        .then(()=> {
                            this.clearForm();
                        })
                        .catch(error => {
                            console.log("confirm Login error", error);
                            this.authForm.errorMessage = error;
                        })
                }
            },

            async sendResetPassword() {
                var result = await this.requestPasswordReset({email: this.authForm.email});
                console.log('AuthBar: sendResetPassword result', result);
            },

            clearForm() {
                this.authForm.email = "";
                this.authForm.password = "";
                this.authForm.name = "";
                this.authForm.isCreate = false;
            }
        }
    }
</script>

<style lang="scss" scoped>

</style>