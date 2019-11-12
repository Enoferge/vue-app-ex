<template>
    <v-dialog v-model="show" lazy persistent width="500">
        <v-card class="dialog-card pa-3">
            <v-card-title class="font-weight-bold pa-0">
                <v-flex align-self-start md6 style="font-size: larger">
                    <span>Выбрать пользователя</span>
                </v-flex>
                <v-spacer></v-spacer>
                <v-icon @click="closeCard">close</v-icon>
            </v-card-title>
            <v-card-text class="pa-3">
                <v-layout class="main-block-dialog">
                    <v-select :items="userList"
                              single-line
                              v-model="chosenUser"
                              item-text="name"
                              item-value="name"
                    ></v-select>
                </v-layout>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script>
    import { agentsData } from '../static-data/agents'

    export default {
        name: "DialogChooseUser",

        props: ['value'],

        data() {
            return {
                userList: [],
                chosenUser: this.$store.getters.getLogin
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
        },

        watch: {
            chosenUser(v) {
                if (v) {
                    let u = this.userList.find(obj => obj.name === v);
                    this.$store.dispatch('setRole', u.role);
                    this.$store.dispatch('setLogin', u.name);
                    this.closeCard();
                    this.$emit('getUserInfo');
                }
            }
        },

        mounted() {
            this.userList = agentsData;
            this.chosenUser = this.$store.getters.getLogin;
        },

        methods: {
            closeCard() {
                this.show = false;
                //this.chosenUser = '';
            },
        }
    }
</script>



<style>
    .dialog-card .v-card__text {
        /*display: flex;*/
        /*align-items: center;*/
        /*justify-content: center;*/
    }
    .dialog-card .main-block-dialog {
        width: 50%;
        margin: 0 auto;
    }

</style>