<!-- Displays a user's profile page -->

<template>
  <main>
    <section>
      <ProfileHeader />
    </section>
    <section>
      <header>
        <div class="left">
          <h3>Viewing all posts</h3>
        </div>
        <div class="right">
          <GetUserPostsForm
            ref="getUserPostsForm"
          />
        </div>
      </header>
      <section
        v-if="$store.state.freets.length"
      >
        <FreetComponent
          v-for="freet in $store.state.freets"
          :key="freet.id"
          :freet="freet"
        />
      </section>
      <section
        v-if="$store.state.quotes.length"
      >
        <QuoteComponent
          v-for="quote in $store.state.quotes"
          :key="quote.id"
          :quote="quote"
        />
      </section>
      <article
        v-else
      >
        <h3>You've reached the end.</h3>
      </article>
    </section>
  </main>
</template>

<script>
import FreetComponent from '@/components/Freet/FreetComponent.vue';
import QuoteComponent from '@/components/Quote/QuoteComponent.vue';
import GetUserPostsForm from '@/components/Profile/GetUserPostsForm.vue';
import ProfileHeader from '@/components/Profile/ProfileHeader.vue';

export default {
  name: 'FreetPage',
  components: {FreetComponent, QuoteComponent, GetUserPostsForm, ProfileHeader},
  mounted() {
    this.$refs.getUserPostsForm.submit();
  },
  computed: {
    console: () => console,
    window: () => window,
  }
};
</script>

<style scoped>
section {
  display: flex;
  flex-direction: column;
}

header, header > * {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

button {
    margin-right: 10px;
}

section .scrollbox {
  flex: 1 0 50vh;
  padding: 3%;
  overflow-y: scroll;
}
</style>
