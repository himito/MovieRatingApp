<template>
  <v-app id="inspire">
    <v-navigation-drawer
      fixed
      v-model="drawer"
      app
    >
      <v-list dense>
        <router-link v-bind:to="{ name: 'Home' }" class="side_bar_link">
          <v-list-item link>
            <v-list-item-action>
              <v-icon>mdi-home</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>Home</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </router-link>
        <router-link v-bind:to="{ name: 'Contact' }" class="side_bar_link">
          <v-list-item link>
            <v-list-item-action>
              <v-icon>mdi-contact-mail</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>Contact</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </router-link>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar
      app
      fixed
      color="indigo"
      dark
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title>Home</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items class="hidden-sm-and-down">
        <v-btn id="add_movie_link"  v-bind:to="{name : 'AddMovie' }" v-if="current_user">
          Add Movie
        </v-btn>
        <v-btn id="user_email" v-if="current_user">
          {{ current_user.email }}
        </v-btn>
        <v-btn id="register_btn" v-bind:to="{ name: 'Register' }" v-if="!current_user">
          Register
        </v-btn>
        <v-btn id="login_btn" v-bind:to="{ name: 'Login' }" v-if="!current_user">
          Login
        </v-btn>
        <v-btn id="logout_btn" v-if="current_user" @click="logout">
          Logout
        </v-btn>
      </v-toolbar-items>
    </v-app-bar>

    <v-content>
      <v-container
        fluid
      >
        <div id="app">
          <router-view/>
        </div>
      </v-container>
    </v-content>
    <v-footer
      color="indigo"
      app
    >
      <span class="white--text">&copy; 2019</span>
    </v-footer>
  </v-app>
</template>
<script>
import axios from 'axios';
import './assets/stylesheets/main.css';
import bus from './bus';

export default {
  data: () => ({
    drawer: null,
    current_user: null,
  }),
  props: {
    source: String,
  },
  mounted() {
    this.fetchUser();
    this.listenToEvents();
  },
  methods: {
    listenToEvents() {
      bus.$on('refreshUser', () => {
        this.fetchUser();
      });
    },
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
    logout() {
      return axios({
        method: 'get',
        url: '/logout',
      })
        .then(() => {
          bus.$emit('refreshUser');
          this.$router.push({ name: 'Home' });
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.error(error);
        });
    },
  },
};
</script>
