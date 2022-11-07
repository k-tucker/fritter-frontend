<!-- Default page that also displays freets -->

<template>
  <main>
    <section v-if="$store.state.username">
      <header>
        <h2>Welcome @{{ $store.state.username }}</h2>
      </header>
      <CreateFreetForm />
    </section>
    <section v-else>
      <header>
        <h2>Welcome to Fritter!</h2>
      </header>
      <article>
        <h3>
          <router-link to="/login">
            Sign in
          </router-link>
          to create, edit, and delete freets.
        </h3>
      </article>
    </section>
    <section>
      <header>
        <div class="left">
          <h2>
            Viewing all posts
            <span v-if="$store.state.filter">
              by @{{ $store.state.filter }}
            </span>
          </h2>
        </div>
        <div class="right">
          <GetPostsForm
            ref="getPostsForm"
            value="author"
            placeholder="🔍 Filter by author (optional)"
            button="🔄 Get posts"
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
        <QuoteComponent
          v-for="quote in $store.state.quotes"
          :key="quote.id"
          :quote="quote"
        />
      </section>
      <article
        v-else
      >
        <h3>No posts found.</h3>
      </article>
    </section>
  </main>
</template>

<script>
import FreetComponent from '@/components/Freet/FreetComponent.vue';
import QuoteComponent from '@/components/Quote/QuoteComponent.vue';
import CreateFreetForm from '@/components/Freet/CreateFreetForm.vue';
import GetPostsForm from '@/components/Freet/GetPostsForm.vue';

export default {
  name: 'FreetPage',
  components: {FreetComponent, QuoteComponent, GetPostsForm, CreateFreetForm},
  mounted() {
    this.$refs.getPostsForm.submit();
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
