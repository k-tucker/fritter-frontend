<!-- Reusable component representing a single quote freet and its actions -->
<!-- We've tagged some elements with classes; consider writing CSS using those classes to style them... -->

<template>
  <article
    class="quote"
  >
    <header>
      <h3 class="author">
        @{{ quote.author }}
      </h3>
      <div
        v-if="$store.state.username === quote.author"
        class="actions"
      >
        <button
          v-if="editing"
          @click="submitEdit"
        >
          ✅ Save changes
        </button>
        <button
          v-if="editing"
          @click="stopEditing"
        >
          🚫 Discard changes
        </button>
        <button
          v-if="!editing"
          @click="startEditing"
        >
          ✏️ Edit
        </button>
        <button @click="deleteQuote">
          🗑️ Delete
        </button>
      </div>

    </header>
    <textarea
      v-if="editing"
      class="content"
      :value="draft"
      @input="draft = $event.target.value"
    />
    <p
      v-else
      class="content"
    >
      {{ quote.content }}
    </p>
    <div
      class="ref"
    >
      <p
        v-if="!quote.anon"
        class="refAuthor"
      >
        @{{ quote.refAuthor }}
      </p>
      <p
        v-if="quote.anon"
        class="refAuthor"
      >
        Posted by an anonymous user.
      </p>
      <p>
        {{ quote.refContent }}
      </p>
    </div>
    <p class="info">
      Posted at {{ quote.dateModified }}
      <i v-if="quote.dateModified !== quote.dateCreated">(edited)</i>
    </p>
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
  name: 'QuoteComponent',
  props: {
    // Data from the stored freet
    quote: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      editing: false, // Whether or not this freet is in edit mode
      liked: false,
      draft: this.quote.content, // Potentially-new content for this freet
      alerts: {} // Displays success/error messages encountered during freet modification
    };
  },
  methods: {
    startEditing() {
      /**
       * Enables edit mode on this freet.
       */
      this.editing = true; // Keeps track of if a freet is being edited
      this.draft = this.quote.content; // The content of our current "draft" while being edited
    },
    stopEditing() {
      /**
       * Disables edit mode on this freet.
       */
      this.editing = false;
      this.draft = this.quote.content;
    },
    likePost() {
      /**
       * Toggles on a like on this post.
       */
      this.liked = true; // Keeps track of if a freet is being edited

      const params = {
        method: 'POST',
        message: 'Successfully liked freet!',
        callback: () => {
          this.$set(this.alerts, params.message, 'success');
          setTimeout(() => this.$delete(this.alerts, params.message), 3000);
        }
      };
      this.like(params);
    },
    unlikePost() {
      /**
       * Toggles off the like on this post.
       */
      this.liked = false;

      const params = {
        method: 'DELETE',
        message: 'Successfully unliked freet!',
        callback: () => {
          this.$set(this.alerts, params.message, 'success');
          setTimeout(() => this.$delete(this.alerts, params.message), 3000);
        }
      };
      this.like(params);
    },
    deleteQuote() {
      /**
       * Deletes this quote freet.
       */
      const params = {
        method: 'DELETE',
        callback: () => {
          this.$store.commit('alert', {
            message: 'Successfully deleted quote freet!', status: 'success'
          });
        }
      };
      this.request(params);
    },
    submitEdit() {
      /**
       * Updates freet to have the submitted draft content.
       */
      if (this.quote.content === this.draft) {
        const error = 'Error: Edited quote freet content should be different than current quote freet content.';
        this.$set(this.alerts, error, 'error'); // Set an alert to be the error text, timeout of 3000 ms
        setTimeout(() => this.$delete(this.alerts, error), 3000);
        return;
      }

      const params = {
        method: 'PATCH',
        message: 'Successfully edited quote!',
        body: JSON.stringify({content: this.draft}),
        callback: () => {
          this.$set(this.alerts, params.message, 'success');
          setTimeout(() => this.$delete(this.alerts, params.message), 3000);
        }
      };
      this.request(params);
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
        const r = await fetch(`/api/quotes/${this.quote._id}`, options);
        if (!r.ok) {
          const res = await r.json();
          throw new Error(res.error);
        }

        this.editing = false;
        this.$store.commit('refreshQuotes');

        params.callback();
      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    },
    async like(params) {
      /**
       * Submits a like request to the like endpoint.
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
        const r = await fetch(`/api/likes/${this.quote._id}&Quote`, options);
        if (!r.ok) {
          const res = await r.json();
          throw new Error(res.error);
        }

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
.quote {
    border: 1px solid #111;
    padding: 20px;
    position: relative;
}
.ref {
    border: 1px solid #111;
    padding: 20px;
    position: relative;
}
.refAuthor {
    font-weight: bold;
}
</style>
