<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-container align-center justify-start column class="main-layout">
    <v-layout row justify-end class="main-header">
      Приветствую, {{ this.roleMap[role] + ' ' + login }}
      <!--<Logo></Logo>-->
    </v-layout>

    <!--Табы-->
    <v-layout class="main-tabs">
      <v-flex xs7 md6>
        <v-tabs v-model="tabs" left height="40" color="#322b52" slider-color="#FFD82B"  show-arrows>
          <v-tab v-for="(item, i) in items" :key="i" :disabled="item.disable">
            {{item.name}}
          </v-tab>
        </v-tabs>
      </v-flex>
      <v-flex xs5 md6>
        <v-layout align-content-end justify-end class="">
          <div class="custom-btn user-btn" @click="changeUser">
            <span>Сменить пользователя</span>
<!--            <v-icon>account_circle</v-icon>-->
          </div>
        </v-layout>
      </v-flex>
    </v-layout>
    <v-layout column class="tab-item-wrapper">
      <v-tabs-items v-model="tabs" v-if="role === 'agent'" touchless>
        <v-tab-item touchless>
          <reports></reports>
        </v-tab-item>
        <v-tab-item touchless>
          <missions></missions>
        </v-tab-item>
      </v-tabs-items>
      <v-tabs-items  v-model="tabs" v-if="role === 'master'" touchless>
        <v-tab-item touchless>
          <agents></agents>
        </v-tab-item>
        <v-tab-item touchless>
          <reports></reports>
        </v-tab-item>
        <v-tab-item touchless>
          <missions></missions>
        </v-tab-item>
      </v-tabs-items>
    </v-layout>
    <DialogChooseUser v-model="showChooseUserDialog" :login="login" @getUserInfo="getUserInfo"></DialogChooseUser>
  </v-container>
</template>

<script>
  import Reports from "../components/Reports"
  import Agents from "../components/Agents";
  import Missions from "../components/Missions"
  import DialogChooseUser from "@/components/DialogChooseUser";

  export default {
    name: "Main",

    components: {Reports, Agents, Missions, DialogChooseUser},

    data() {
      return {
        tabs: 0,
        showChooseUserDialog: false,
        role: this.$store.getters.getRole,
        login: this.$store.getters.getLogin,

        roleMap: {
          'agent': 'Агент',
          'master': 'Мастер'
        }
      }
    },

    mounted() {
      this.getUserInfo()
    },

    updated() {
      this.getUserInfo()
    },

    watch: {
      role() {
        this.tabs = null;
      },

      items() {
      }
    },

    computed: {
      items() {
        switch (this.role) {
          case 'agent':
            return [
              {name: 'ОТЧЕТЫ', disable: false},
              {name: 'МИССИИ', disable: false}
            ];
          case 'master':
            return [
              {name: 'АГЕНТЫ', disable: false},
              {name: 'ОТЧЕТЫ', disable: false},
              {name: 'МИССИИ', disable: false}
            ];
          default:
            return []
        }
      }
    },

    methods: {
        changeUser() {
          this.showChooseUserDialog = true;
        },

        getUserInfo() {
            this.role = this.$store.getters.getRole;
            this.login = this.$store.getters.getLogin;
        },

        getRoleLabel(role) {
          return this.roleMap[role];
        }
      }
  }
</script>

<style>
  .container.main-layout {
    padding-top: 30px !important;
    min-width: 800px;
  }
  @media only screen and (min-width: 1264px) {
    .container {
      max-width: 100% !important;
    }
    .main-layout {
      max-width: 90% !important;
    }
  }

  .main-header {
    min-height: 80px;
    padding: 30px 20px 20px 0;
    background-color: #322b52;
  }

  .main-tabs {
    background-color: #322b52;
    padding: 0 40px;
    color: #fff;
  }

  .main-tabs .v-tabs__item {
    color: #fff;
  }

  .main-tabs .v-tabs__div {
    padding: 10px;
  }

  .main-tabs .v-tabs__slider {
    height: 6px;
  }

  .tab-item-wrapper {
    /*временная заглушка*/
    height: calc(100vh - 195px);
    overflow: auto;
    background: #fff;
    color: #2c2a50 !important;
    padding: 10px 30px 20px;
  }

  .tab-item-wrapper .elevation-1 {
    box-shadow: none !important;
  }

  /*    .tab-item-wrapper table.v-table thead th {
          padding-left: 0 !important;
      }*/

  .custom-btn {
    display: inline-block;
    line-height: 40px;
    cursor: pointer;
    text-decoration: none;
    text-transform: uppercase;
    padding: 0 10px;
  }

  .custom-btn.user-btn {
    -moz-box-sizing: border-box; /* Для Firefox */
    box-sizing: border-box; /* Ширина блока с полями */
    text-align: center;
  }

  .custom-btn.user-btn:hover {
    background-color: #756e91;
  }

  .main-tabs .v-tabs__item--active {
    color: #FFD82B;
  }
</style>
