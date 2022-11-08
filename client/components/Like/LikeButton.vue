<!-- NOT IN USE -->

<template>
  <article
    class="like"
  >
    <button 
      v-if="!liked"
      @click="likePost"
    >
        ❤️ Like
    </button>
    <button 
      v-if="liked"
      @click="unlikePost"
    >
        ❤️ Liked
    </button>
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
  name: 'LikeButton',
  props: {
    // Data from the stored freet
    like: {
      type: Object,
      required: true
    }
  }
  },
  data() {
    return {
      liked: false,
      alerts: {}, // Displays success/error messages encountered during freet modification
    };
  },
  methods: {
    likePost() {
      /**
       * Toggles on a like on this post.
       */
      this.liked = true; // Keeps track of if a freet is being edited
    },
    unlikePost() {
      /**
       * Toggles off the like on this post.
       */
      this.liked = false;
    },
    async request(params) {
      /**
       * Submits a request to the freet's endpoint
       * @param params - Options for the request
       * @param params.body - Body for the request, if it exists
       * @param params.callback - Function to run if the the request succeeds
       */
      const options = {
        method: params.method, headers: {'Content-Type': 'application/json'}
      };
      if (params.body) {
        options.body = params.body;
      }

      try {
        const r = await fetch(`/api/freets/${this.freet._id}`, options);
        if (!r.ok) {
          const res = await r.json();
          throw new Error(res.error);
        }

        this.editing = false;
        this.$store.commit('refreshFreets');

        params.callback();
      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    },
    async post(params) {
      /**
       * Submits a post to the quote endpoint.
       * @param params - Options for the request
       * @param params.body - Body for the request, if it exists
       * @param params.callback - Function to run if the the request succeeds
       */
      const options = {
        method: params.method, headers: {'Content-Type': 'application/json'}
      };
      if (params.body) {
        options.body = params.body;
      }

      try {
        const r = await fetch('/api/quotes', options);
        if (!r.ok) {
          const res = await r.json();
          throw new Error(res.error);
        }

        this.quoting = false;
        this.$store.commit('refreshFreets');
        this.$store.commit('refreshQuotes');

        params.callback();
      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    }
  }
};
</script>

<style scoped>
.freet {
    border: 1px solid #111;
    padding: 20px;
    position: relative;
}
</style>
