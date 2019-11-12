<template>
    <v-card width="350" class="pa-2 cardDialog">
        <v-card-title class="cardTitle">
            <span>Внимание</span>
        </v-card-title>
        <v-card-text>
            <div>Вы точно хотите {{ isCalledNow ? 'снять отметку с агента ' : 'отметить агента ' }}{{ agentLogin }}?</div>
        </v-card-text>
        <v-card-actions>
            <v-layout align-center justify-space-between row fill-height>
                <v-btn class="cardBtn" color="#fefdf3">Нет</v-btn>
                <v-btn class="cardBtn btnAction" color="#E54D42" @click="action">Да</v-btn>
            </v-layout>
        </v-card-actions>
    </v-card>

</template>

<script>

    export default {
        name: "MenuMarkAgent",

        components: {},

        props: {
            login: null,
            isCalledNow: null
        },

        data() {
            return {

            }
        },

        watch: {

        },

        computed: {
            agentLogin() {
                return this.login || null;
            },
        },

        methods: {
            action() {
                this.$emit('changeCall');
            },

            switchBlockUser(login, is_enabled_now) {
                let data = {
                    is_enabled: !is_enabled_now
                };
                this.$axios.patch(`/v_users`, data, {params: {login: `eq.${login}`}})
                    .then(() => {
                        this.$emit('notification', 'user-block', 'success', login, is_enabled_now)
                    })
                    .catch(error => {
                        console.log("error message: " +  error.data.message ? error.data.message : error);
                        this.$emit('notification', 'user-block', 'error', login, is_enabled_now)
                    })
                    .finally(() => {
                        console.log("finally");
                        this.$emit('updateData');
                    });
            }
        }
    }
</script>

<style scoped>
    .cardTitle {
        text-transform: uppercase;
        font-weight: bold;
    }

    .cardDialog {
        color: #000;
    }

    .cardBtn {
        padding: 0 20px;
    }
</style>
<style>
    .btnAction .v-btn__content {
        color: #FFF;
    }
</style>
