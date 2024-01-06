<template>
    <v-row class="labels">
        <v-col class="label"><p @click="requestPageChange(1)" :class="{'active': currentPage == 1, 'clickable': currentPage != 1}">{{ currentPage == 1 ? '- ' : ''}}Basic info{{ currentPage == 1 ? ' -' : ''}}</p></v-col>
        <v-col class="label"><p @click="requestPageChange(2)" :class="{'active': currentPage == 2, 'clickable': currentPage != 2}">{{ currentPage == 2 ? '- ' : ''}}Ingredients{{ currentPage == 2 ? ' -' : ''}}</p></v-col>
        <v-col class="label"><p @click="requestPageChange(3)" :class="{'active': currentPage == 3, 'clickable': currentPage != 3}">{{ currentPage == 3 ? '- ' : ''}}Preparation{{ currentPage == 3 ? ' -' : ''}}</p></v-col>
    </v-row>
    <v-row class="markers">
        <v-col class="marker"><v-progress-linear :color="basicColor" v-model="progress.basic"></v-progress-linear></v-col>
        <v-col class="marker"><v-progress-linear color="babyblue" v-model="progress.ingredients"></v-progress-linear></v-col>
        <v-col class="marker"><v-progress-linear color="babyblue" v-model="progress.preparation"></v-progress-linear></v-col>
    </v-row>
</template>

<script>
export default {
    props: {
        totalBasicFields: {
            type: Number,
            required: true
        },
        totalIngredientFields: {
            type: Number,
            required: true
        },
        totalPreparationFields: {
            type: Number,
            required: true
        },
        currentPage: {
            type: Number,
            required: true
        }
    },
    emits: ["onPageChange"],
    data() {
        return {
            progress: {
                basic: 0,
                ingredients: 0,
                preparation: 0
            }
        }
    },

    computed: {
        basicColor() {
            if (this.progress.basic > 95) {
                return 'light-green';
            } else {
                return 'babyblue';
            }
        },
        ingredientColor() {
            if (this.progress.ingredients > 95) {
                return 'light-green';
            } else {
                return 'babyblue';
            }
        },
        preparationColor() {
            if (this.progress.preparation > 95) {
                return 'light-green';
            } else {
                return 'babyblue';
            }
        }
    },

    methods: {
        update(type, count) {
            switch (type) {
                case "basic":
                    this.progress.basic = this.countPercentage(this.totalBasicFields, count);
                    break;
                
                case "ingredients":
                    this.progress.ingredients = this.countPercentage(this.totalIngredientFields, count);
                    break;

                case "preparation":
                    this.progress.preparation = this.countPercentage(this.totalPreparationFields, count);
                    break;

                default:
                    break;
            }
        },

        countPercentage(total, count) {
            return (count/total)*100;
        },

        requestPageChange(pageNumber) {
            if (pageNumber != this.currentPage) {
                this.$emit('onPageChange', pageNumber);
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.labels, .labels > * {
    margin: 0;
    padding: 0;
}
.label {
    text-align: center;

    .active {
        font-weight: 800;
    }

    .clickable {
        cursor: pointer;
    }
}
.markers, .markers > * {
    margin: 0;
    padding: 0;
}

.markers {
    margin-bottom: 32px;
}

</style>