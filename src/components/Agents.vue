<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <v-container full-screen fluid class="pa-0 ma-0" style="height: 100%; background: #fff">
        <v-data-table
                :headers="headers"
                :items.sync="agents"
                :search.sync="search"
                :loading="loading"
                :rows-per-page-items="pages"
                :pagination.sync="pagination"
                item-key="name"
                class="elevation-1 custom-table">
            <template v-slot:headers="props">
                <tr>
                    <th	v-for="header in props.headers"
                           :key="header.text"
                           :class="['column sortable', pagination.descending ? 'desc' : 'asc', header.value === pagination.sortBy ? 'active' : '']"
                           :style="{textAlign: header.align}"
                           class="table-headers"
                           @click="changeSort(header.value)">
                        <span v-html="header.text"></span>
                        <v-icon v-if="header.sortable" small>arrow_upward</v-icon>
                    </th>
                </tr>
            </template>
            <template v-slot:items="props">
                <td>{{ props.item.name | noData}}</td>
                <td>
                    <v-menu bottom left>
                        <template v-slot:activator="{ on }">
                            <div class="table-cell-clickable" v-on="on">
                                {{ props.item.role | noData}}
                            </div>
                        </template>
                        <v-list>
                            <v-list-tile
                                    class="custom-list"
                                    v-for="(role, index) in roles"
                                    :key="index"
                                    @click="chooseRole(props.item.login, role.label)"
                            >
                                <v-list-tile-title>{{ role.label }}</v-list-tile-title>
                            </v-list-tile>
                        </v-list>
                    </v-menu>
                </td>
                <td>{{ props.item.rank | noData}}</td>
                <td>{{ props.item.missions_succeed | noData}}</td>
                <td>{{ props.item.missions_failed | noData}}</td>
                <td>
                    <div style="display: flex; justify-content: center;">
                        <v-menu bottom left>
                            <template v-slot:activator="{ on }">
                                <v-icon class="icon-btn" v-on="on" color="accent">{{props.item.isCalled ? 'flash_on' : 'flash_off'}}</v-icon>
                            </template>
                            <menu-mark-agent :agent-login="props.item.login" :is-called-now="props.item.isCalled" @changeCall="changeCallStatus(props.item)" @notification="showMarkNtfc"></menu-mark-agent>
                        </v-menu>
                    </div>
                </td>
            </template>
        </v-data-table>
        <notifications group="agent-mark"
                       position="bottom center"
                       classes="n-light custom-notification"
                       :max="3"
                       :width="400"/>
        <notifications group="change-role"
                       position="bottom center"
                       classes="n-light custom-notification"
                       :max="3"
                       :width="400"/>
    </v-container>
</template>

<script>
    import moment from 'moment';

    import { agentsData } from '../static-data/agents'
    import MenuMarkAgent from "@/components/MenuMarkAgent";


    export default {
        name: "Users",

        components: {MenuMarkAgent},

        data: function () {
            return {
                pagination: {
                    sortBy: 'name'
                },
                search: '',
                loading: false,
                pages:[10,25,50,{"text":"$vuetify.dataIterator.rowsPerPageAll","value":-1}],
                headers: [
                    { text: 'Имя', align: 'center', value: 'name', sortable: true},
                    { text: 'Уровень', align: 'center', value: 'role', sortable: true},
                    { text: 'Ранг', align: 'center', value: 'rank', sortable: true},
                    { text: 'Успешные миссии', align: 'center', value: 'missions_succeed', sortable: true },
                    { text: 'Проваленные миссии', align: 'center', value: 'missions_failed', sortable: true },
                    { text: 'Отметить', align: 'center', value: 'is_enabled', sortable: false }
                ],

                agents:[],
                roles: [
                    {"label":"Мастер","nm":"master"},
                    {"label":"Агент","nm":"agent"},
                   ],

                showEditReportDialog: false
            }
        },

        filters: {
            noData(v) {
                return (v == null || v === '') ? 'Никогда' : v;
            }
        },

        mounted(){
            this.getAgents();
        },

        computed: {
        },

        watch: {
        },

        methods: {
            changeCallStatus(agent) {
              agent.isCalled = !agent.isCalled;
            },

            showMarkNtfc(group, type = '', login, blockStatus) {
                let messageText = '';
                let prSuccess = blockStatus ? "за" : "раз";
                let prError = blockStatus ? "" : "раз";
                switch (type) {
                    case 'success':
                        messageText = `Пользователь ${login} успешно ${prSuccess}блокирован`;
                        break;
                    case 'error':
                        messageText = `Ошибка ${prError}блокировки пользователя`
                }
                this.$notify({
                    group,
                    text: messageText,
                    type,
                    duration: 3000
                })
            },

            showPassNtfc(group, type = '', login) {
                console.log("ntfc");
                let messageText = '';
                switch (type) {
                    case 'success':
                        messageText = 'Пароль' + (login ? ` пользователя ${login}` : '') + ' успешно изменен';
                        break;
                    case 'error':
                        messageText = 'Ошибка смены пароля'
                }
                this.$notify({
                    group,
                    text: messageText,
                    type,
                    duration: 3000
                })
            },

            showRoleNtfc(group, type = '') {
                let messageText = '';
                switch (type) {
                    case 'success':
                        messageText = "Группа успешно изменена";
                        break;
                    case 'error':
                        messageText = "Не удалось назначить выбранную группу"
                }
                this.$notify({
                    group,
                    text: messageText,
                    type,
                    duration: 3000
                })
            },

            getAgents(){
                this.loading = true;
                this.agents = agentsData;

                /*
                console.log("get users");
                this.$axios.get(`/v_users`)
                    .then(response => {
                        this.agents = response.data;
                    })
                    .catch(response => {
                        if (response.status === 404) {
                            console.log("error 404");
                        }
                    })
                    .then(() => {
                        this.loading = false;
                    });
                 */
                this.loading = false;
            },

            chooseRole(login, role) {
                /*
                let data = {
                    role: role
                };
                this.$axios.patch(`/users`, data, {params: {login: `eq.${login}`}})
                    .then(() => {
                        this.showRoleNtfc('change-role', 'success');
                    })
                    .catch(error => {
                        console.log("error message: " +  error.data.message ? error.data.message : error);
                        if (error.status === 400 && error.data.message === 'Не удалось назначить выбранный уровень') {
                            this.showRoleNtfc('change-role', 'error');
                        }
                    })
                    .then(() => {
                        this.getAgents();
                    });
                 */
            },

            changeSort (column) {
                if (this.pagination.sortBy === column) {
                    this.pagination.descending = !this.pagination.descending
                } else {
                    this.pagination.sortBy = column
                    this.pagination.descending = false
                }
            },

            dateFormatDay(date) {
                if (date)
                    return moment(date).locale('ru').format("DD.MM.YYYY");
                else
                    return null
            },

            dateFormatTime(date) {
                if (date)
                    return moment(date).locale('ru').format("DD.MM.YYYY hh:mm");
                else
                    return null
            }
        }
    }
</script>

<style scoped>
    .text-icon-btn {
        cursor: pointer;
        font-weight: bold;
        padding: 10px;
        display: flex;
        justify-content: left;
        align-items: center;
        text-transform: uppercase;
    }

    .text-icon-btn:hover {
        background-color: rgba(106, 125, 160, 0.2);
        /*        background-color: #eee6d3;*/
    }

    .icon-btn {
        cursor: pointer;
    }

    .top-row {
        /*        padding: 0 24px;*/
    }

    .table-cell-clickable {
        cursor: pointer;
    }
</style>

<style>
    .v-table thead th.table-headers {
        text-transform: uppercase;
        font-weight: bold;
        color: #2c2a50 !important;
    }
    .custom-list>a.v-list__tile{
        height: 32px;
    }

    .custom-table a{
        text-decoration: none;
    }
</style>

<style lang="scss">
    .custom-notification {
        padding: 20px 10px;
        margin: 0 5px 5px;

        font-size: 16px;

        color: #ffffff;
        background: #44A4FC;
        border-radius: 5px 5px;

        //border-left: 5px solid #187FE7;

        &.warn {
            background: #ffb648 !important;
            border-left-color: #f48a06;
        }

        &.error {
            background: #E54D42 !important;
            border-left-color: #B82E24;
        }

        &.success {
            background: #36a557 !important;
            border-left-color: #42A85F;
            color: white;
        }

        .notification-content {
            display: flex;
            justify-content: center;
        }
    }
</style>