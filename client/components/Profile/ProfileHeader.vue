<!-- Block at the top of a profile page with info about the user. -->

<template>
  <article
    class="userProfile"
  >
    <header>
      <h1 class="user">
        @{{ $store.state.username }}
      </h1>
    </header>
    <section class="alerts">
      <article
        v-for="(status, alert, index) in alerts"
        :key="index"
        :class="status"
      >
        <p>{{ alert }}</p>
      </article>
    </section>
  </article>
</template>

<script>
export default {
  name: 'ProfileHeader',
  data() {
    return {
      alerts: {}, // Displays success/error messages encountered during freet modification
    };
  }
};
</script>

<style scoped>
.userProfile {
    border: 1px solid #111;
    padding: 20px;
    position: relative;
}
</style>
