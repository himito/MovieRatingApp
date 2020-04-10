<template>
  <v-layout row wrap>
    <v-flex xs4 v-for="movie in movies" :key="movie._id">
      <v-card>
        <v-card-title primary-title>
          <div>
            <div class="headline">
                <v-btn v-bind:to="`/movies/${movie._id}`">
                {{movie.name}}
                </v-btn>
            </div>
            <span class="grey--text">{{movie.release_year}} ‧ {{movie.genre}}</span>
            </div>
        </v-card-title>
        <v-card-text>
            {{movie.description}}
        </v-card-text>
      </v-card>
    </v-flex>
  </v-layout>
</template>
<script>
/* eslint-disable no-console */
import axios from 'axios';

export default {
  name: 'Movies',
  data() {
    return {
      movies: [],
    };
  },
  // Function used when page loads
  mounted() {
    this.fetchMovies();
  },
  methods: {
    async fetchMovies() {
      const token = window.localStorage.getItem('auth');
      return axios({
        method: 'get',
        url: '/movies',
        headers: {
          Authorization: `JWT ${token}`,
          'Content-Type': 'application/json',
        },
      })
        .then((response) => {
          this.movies = response.data.movies;
          this.current_user = response.data.current_user;
        })
        .catch((error) => {
          console.log(JSON.stringify(error));
          this.$swal('No', `${error.response.data.message}`, 'error');
        });
    },
  },
};
</script>
