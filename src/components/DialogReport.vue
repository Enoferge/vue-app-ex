<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <v-dialog v-model="show" lazy persistent width="600">
        <v-card class="report-card pa-3">
            <v-card-title class="font-weight-bold pa-0 pb-4">
                <v-flex align-self-center md6 style="font-size: larger">
                    {{ action === 'create' ? 'Создать отчет' : 'Редактировать отчет'}}
                </v-flex>
                <v-spacer></v-spacer>
                <v-icon @click="closeCard">close</v-icon>
            </v-card-title>
            <v-card-text class="pa-0">
                <v-layout row class="pa-0 mb-2 report-field">
                    <v-flex md4 xs4 class="name-font">
                        <span>Название</span>
                    </v-flex>
                    <v-flex md8 xs8 class="value-font">
                        <v-text-field
                                v-model="reportInternal.title"
                                hide-details
                                disabled
                        ></v-text-field>
                    </v-flex>
                </v-layout>
                <v-layout row class="pa-0 mb-2 report-field">
                    <v-flex md4 xs4 class="name-font">
                        <span>Автор</span>
                    </v-flex>
                    <v-flex md8 xs8 class="value-font">
                        <v-text-field
                                v-model="reportInternal.author"
                                hide-details
                                disabled
                        ></v-text-field>
                    </v-flex>
                </v-layout>
                <v-layout row class="pa-0 mb-2 report-field">
                    <v-flex md4 xs4 class="name-font">
                        <span>Комментарий</span>
                    </v-flex>
                    <v-flex md8 xs8 class="value-font">
                        <v-textarea
                                v-model="reportInternal.comment"
                                auto-grow
                                rows="1"
                                hide-details
                                disabled
                        ></v-textarea>
                    </v-flex>
                </v-layout>
            </v-card-text>
            <v-card-actions>
                <v-layout column class="pt-3">
                    <v-layout row>
                        <v-spacer></v-spacer>
                        <v-btn color="" flat @click="closeCard">Отмена</v-btn>
                        <v-btn color="primary" @click="save" :disabled="!validForm">Сохранить</v-btn>
                    </v-layout>
                </v-layout>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
    export default {
        name: "DialogReport",

        props: ['value', "action", "report"],

        data() {
            return {
                reportInternal: {
                    "title": '',
                    "author": "",
                    "comment": "",
                }
            }
        },

        filters: {
            noData(v) {
                return (v == null || v == '') ? '-' : v;
            }
        },

        computed: {
            show: {
                set: function (v) {
                    this.$emit('input', v)
                },
                get: function () {
                    return this.value;
                }
            },

            validForm() {
                return this.reportInternal.title;
            }
        },

        watch: {
            report(v) {
                this.reportInternal = Object.assign({}, v);
            },

            show(v) {
                if (v) {
                    this.reportInternal = Object.assign({}, this.report);
                }
            }
        },

        mounted() {
        },

        methods: {
            closeCard() {
                this.show = false;
                this.reportInternal = {};
            },

            save() {
                console.log("save");
                this.$emit('updateReport', this.reportInternal);
                this.closeCard();
            }
        }
    }
</script>

<style>
    .value-font .v-input .v-textarea {
        display: none;
    }
    .value-font .v-input.v-textarea {
        padding-top: 0;
    }

    .value-font .v-input.v-input--checkbox {
        margin: 0;
        padding: 0;
    }
    .value-font .v-input.v-input--checkbox .v-messages{
        display: none;
    }
    .name-font {
        font-size: 20px;

    }
    .report-field {
        align-items: baseline;
        justify-content: center;
    }
</style>

<style scoped>
</style>