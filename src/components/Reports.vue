<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <div>
    <v-layout row justify-start align-baseline>
      <p>Поиск за период с</p>
      <v-flex md2>
        <v-menu
          ref="menuStart"
          v-model="menuStart"
          :close-on-content-click="false"
          lazy
          transition="scale-transition"
          offset-y
          full-width
          min-width="290px"
        >
          <template v-slot:activator="{ on }">
            <v-text-field
              v-model="startDateFormatted"
              clearable
              append-icon="event"
              readonly
              v-on="on"
              class="mx-2"
            ></v-text-field>
          </template>
          <v-date-picker
            v-model="startDate"
            :max="maxStartDate"
            no-title
            @input="menuStart = false"
          ></v-date-picker>
        </v-menu>
      </v-flex>
      <p>по</p>
      <v-flex md2>
        <v-menu
          ref="menuEnd"
          v-model="menuEnd"
          :close-on-content-click="false"
          transition="scale-transition"
          offset-y
          full-width
          min-width="290px"
        >
          <template v-slot:activator="{ on }">
            <v-text-field
              v-model="endDateFormatted"
              clearable
              append-icon="event"
              readonly
              v-on="on"
              class="mx-2"
            ></v-text-field>
          </template>
          <v-date-picker
            v-model="endDate"
            :min="startDate"
            :max="today"
            no-title
            @input="menuEnd = false"
          ></v-date-picker>
        </v-menu>
      </v-flex>
    </v-layout>
    <v-data-table
      :headers="headers"
      :items.sync="resultRows"
      :pagination.sync="pagination"
      :items-per-page="5"
      class="custom-table"
    >
      <template v-slot:headers="props">
        <tr>
          <th	v-for="header in props.headers"
               :key="header.text"
               :class="['table-headers', header.sortable ? 'column sortable' : '', pagination.descending ? 'desc' : 'asc', header.value === pagination.sortBy ? 'active' : '']"
               :style="{textAlign: header.align}"
               @click="changeSort(header)">
<!--            <v-icon v-if="header.align==='right' && header.sortable" small>arrow_upward</v-icon>-->
            <span v-html="header.text"></span>
            <v-icon v-if="header.sortable" small>arrow_upward</v-icon>
          </th>
        </tr>
      </template>
      <template v-slot:items="props">
        <td>
          <span
                @click="isReportOwn(props.item) ? editReport(props.item) : ''"
                :class="isReportOwn(props.item) ? 'own-report' : ''"
          >{{ props.item.title | noData}}
          </span>
        </td>
        <td> {{ props.item.author }} </td>
        <td> {{ dateFormatTime(props.item.create_date) }} </td>
        <td>
          <a @click="getFile(props.item.file_url)">
            <!--<v-icon>save_alt</v-icon>-->
            <v-icon color="primary">vertical_align_bottom</v-icon>
           Скачать отчет
          </a>
        </td>
      </template>
    </v-data-table>
    <dialog-report v-model="showDialogReport" :report="currentReport" action="edit" @updateReport="updateReport"></dialog-report>
    <notifications group="get-file"
                   position="bottom center"
                   classes="n-light custom-notification"
                   :max="3"
                   :width="400"/>
  </div>
</template>

<script>
  import moment from 'moment';
  import _ from 'lodash';
  import { reportsData } from '../static-data/reports'
  import DialogReport from "@/components/DialogReport";

  export default {
    name: "Reports",

    components: {DialogReport},

    data() {
      return {
        pagination: {
          sortBy: 'title',
          descending: true,
          rowsPerPage: 10
        },
        loading: false,
        pages:[10,25,50,{"text":"$vuetify.dataIterator.rowsPerPageAll","value":-1}],

        headers: [
          {
            text: "Название",
            align: 'center',
            value: 'title',
            sortable: true
          },
          {
            text: "Автор",
            align: 'center',
            value: 'author',
            sortable: true
          },
          {
            text: "Дата создания",
            align: 'center',
            value: 'create_date',
            sortable: true
          },
          {
            text: "Файл",
            align: 'center',
            value: 'url',
            sortable: false
          }
        ],
        reports: [],
        currentReport: {},

        menuStart: false,
        menuEnd: false,
        startDate: null,
        endDate: null,
        startDateFormatted: null,
        endDateFormatted: null,

        showDialogReport: false
      }
    },

    mounted() {
      this.getData()
    },

    watch: {
      startDate (v) {
        this.startDateFormatted = this.formatDate(v);
      },

      endDate (v) {
        this.endDateFormatted = this.formatDate(v);
      },

      startDateFormatted (v) {
        if (v == null) {
          this.startDate = null;
        }
      },

      endDateFormatted (v) {
        if (v == null) {
          this.endDate = null;
        }
      },
    },

    computed: {
      today() {return moment.utc(new Date()).format()},

      resultRows: function() {
        if (this.startDate == null && this.endDate == null) {
          return this.reports
        }

        if (this.startDate != null && this.endDate != null ) {
          return filterByAll(this.reports, this.startDate, this.endDate);
        }

        if (this.startDate != null) {
          return filterByStart(this.reports, this.startDate);
        }

        if (this.endDate != null) {
          return filterByEnd(this.reports, this.endDate);
        }
        return this.reports
      },

      maxStartDate() {
        return this.endDate ? this.endDate : this.today
      }
    },
    methods: {
      getFile(url) {
/*        reportGetters.getReportByLink(link, filename)
          .then(() => {
          })
          .catch(() =>{
            console.log("ошибка получения файла");
            this.showFileNtfc('get-file', 'error');
          })*/
        window.open(url);
      },

      showFileNtfc(group, type = '') {
        let messageText = "Ошибка получения файла";
        this.$notify({
          group,
          text: messageText,
          type,
          duration: 3000
        })
      },

      getData() {
        //получение с бека
/*
        let config = {
          headers: {
            'Authorization': 'Bearer ' + this.$store.getters.getToken
          }
        };
        this.$axios.get(
          '/reports',
          config
        )
          .then(response => {
            this.reports = response.data;
          })
          .catch(response => {
            if (response.status === 404) {
              console.log("error 404");
            }
          });
        */
          this.reports = reportsData;
      },

      isReportOwn(report) {
        return report.author === this.$store.getters.getLogin;
      },

      editReport(report) {
        this.currentReport = report;
        this.showDialogReport = true;
      },

      updateReport(changedReport) {
        this.currentReport = null;
        this.reports.forEach((rep, idx) => {
          if (rep.id === changedReport.id) {
            this.reports[idx] = Object.assign({}, changedReport);
          }
        });
      },

      dateFormatTime(date) {
        if (date)
          return moment(date).format("DD.MM.YYYY HH:MM");
        else
          return null
      },

      formatDate(date) {
        if (date)
          return moment(date).format("DD.MM.YYYY");
      },

      changeSort (header) {
        if (header.sortable) {
          if (this.pagination.sortBy === header.value) {
            this.pagination.descending = !this.pagination.descending
          } else {
            this.pagination.sortBy = header.value;
            this.pagination.descending = false
          }
        }
      },
    }
  }
  function filterByAll(data, startDate, endDate) {
    let end = moment.utc(endDate).subtract(0,'days').endOf('day').format();
    let start = moment.utc(startDate).subtract(0,'days').startOf('day').format();
    // eslint-disable-next-line no-console
    console.log("end: " + end);
    // eslint-disable-next-line no-console
    console.log("start: " + start);
    // eslint-disable-next-line no-console
    console.log("report.create_date: " + data[0].create_date);
    return _.filter(data, (report) =>  (moment.utc(report.create_date).isSameOrAfter(start) && moment.utc(report.create_date).isSameOrBefore(end)));
  }

  function filterByStart(data, startDate) {
    let start = moment.utc(startDate).subtract(0,'days').startOf('day').format();
    return _.filter(data, (report) =>  (moment.utc(report.create_date).isSameOrAfter(start)));
  }

  function filterByEnd(data, endDate) {
    let end = moment.utc(endDate).subtract(0,'days').endOf('day').format();
    return _.filter(data, (report) =>  (moment.utc(report.create_date).isSameOrBefore(end)));
  }
</script>

<style>
  .own-report {
    cursor: pointer;
    color: #b71c1c;
    font-weight: bold;
  }
</style>
