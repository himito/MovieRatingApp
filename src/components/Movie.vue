<template>
    <v-layout row wrap>
        <v-flex xs4>
            <v-card>
                <v-card-title primary-title>
                    <div>
                        <div class="headline">
                            {{ movie.name }}
                        </div>
                        <span class="grey--text">
                            {{ movie.release_year }} ‧ {{ movie.genre }}
                        </span>
                    </div>
                </v-card-title>
                <h6 class="card-title" v-if="current_user" @click="rate">Rate this movie</h6>
                <v-card-text>
                    {{ movie.description }}
                </v-card-text>
            </v-card>
            <v-btn v-bind:to="`/movies/edit/${movie._id}`">Éditer</v-btn>
            <v-btn id="delete_btn" @click="deleteMovie">Supprimer</v-btn>
        </v-flex>
    </v-layout>
</template>
<script>
import axios from 'axios';
import StarRating from 'vue-star-rating';
import Vue from 'vue';

const wrapper = document.createElement('div');
// shared state
const state = {
  note: 0,
};
// create component to content
const RatingComponent = Vue.extend({
  data() {
    return { rating: 0 };
  },
  watch: { // Si rating change, update avec cette fonction
    rating(newVal) { state.note = newVal; },
  },
  template: `
    <div class="rating">
      How was your experience getting help with this issues?
      <star-rating v-model="rating"></star-rating>
    </div>`,
  components: { 'star-rating': StarRating }, // Couple les balises nommées star-rating a la lib
});

const component = new RatingComponent().$mount(wrapper);


export default {
  name: 'Movie',
  components: { 'star-rating': StarRating },
  data() {
    return {
      movie: [],
      current_user: null,
    };
  },
  // When page loads
  mounted() {
    this.fetchMovie();
    this.fetchUser();
  },
  methods: {
    async fetchUser() {
      return axios({
        method: 'get',
        url: '/current_user',
      })
        .then((response) => {
          this.current_user = response.data.current_user;
        })
        .catch(() => {
        });
    },
    async fetchMovie() {
      return axios({
        method: 'get',
        url: `http://localhost:8081/movies/${this.$route.params.id}`,
      })
        .then((response) => {
          this.movie = response.data;
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.log(error);
        });
    },
    async rate() { // If user rates, pop up + SEND signal
      this.$swal({
        content: component.$el,
        buttons: {
          confirm: {
            value: 0,
          },
        },
      }).then(() => {
        const movieId = this.$route.params.id;
        return axios({
          method: 'post',
          data: {
            rate: state.note,
          },
          url: `http://localhost:8081/movies/rate/${movieId}`,
          headers: { 'Content-Type': 'application/json' },
        })
          .then(() => {
            this.$swal(`Thank you for rating! ${state.note}`, 'success');
          })
          .catch((error) => {
            const msg = error.response.data.message;
            this.$swal('Oh oh', `${msg}`, 'error');
          });
      });
    },
    async deleteMovie() {
      this.$swal({
        title: 'Êtes-vous sûr de vouloir supprimer ce film ?',
        text: 'Une fois supprimé, vous ne pourrez pas le retrouver.',
        icon: 'warning',
        buttons: true,
        dangerMode: true,
      })
        // eslint-disable-next-line consistent-return
        .then((willDelete) => {
          if (willDelete) {
            // eslint-disable-next-line no-console
            console.log('Delete Movie appelé ! \n');
            return axios({
              method: 'delete',
              url: `http://localhost:8081/movies/${this.$route.params.id}`,
            })
              .then((response) => {
                this.$swal('Le fichier a bien été supprimé!', 'success');
                // eslint-disable-next-line no-console
                console.log(response);
              })
              .catch((error) => {
                const msg = JSON.stringify(error);
                this.$swal('Oh oh', `${msg}`, 'error');
              });
          }
          this.$swal('Le fichier n\'a pas été supprimé.');
        });
    },
  },
};
</script>
