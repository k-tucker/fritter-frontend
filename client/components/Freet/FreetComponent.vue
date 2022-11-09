<!-- Reusable component representing a single freet and its actions -->
<!-- We've tagged some elements with classes; consider writing CSS using those classes to style them... -->

<template>
  <article
  v-bind:class="[isActive ? 'freet' : 'highlight']"
  >
    <header>
      <h3 class="author">
        @{{ freet.author }}
      </h3>
      <div
        v-if="$store.state.username === freet.author"
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

        <!-- div 1 -->
        <!-- <div class='div' v-bind:class="[isActive ? 'red' : 'blue']" @click="toggleClass()"></div> -->
        <!-- div 2
        <div class='div' v-bind:class="[isActive ? 'blue' : 'red']" @click="isActive = !isActive"></div> -->
        
        <button
          v-if="highlightCondition2"
          @click="highlightPost"
        >
          ⭐️ Highlight
        </button>
        <button
          v-if="highlightCondition1"
          @click="unhighlightPost"
        >
          ⭐️ Highlighted
        </button>
        <button
          v-if="!editing"
          @click="startEditing"
        >
          ✏️ Edit
        </button>
        <button @click="deleteFreet">
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
      {{ freet.content }}
    </p>
    <p class="info">
      Posted at {{ freet.dateModified }}
      <i v-if="freet.dateModified !== freet.dateCreated">(edited)</i>
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
    <button 
      v-if="!quoting"
      @click="quoteFreet"
    >
        💬 Quote
    </button>
    <textarea
      v-if="quoting"
      class="content"
      @input="quoteText = $event.target.value"
    />
    <button
      v-if="anonCondition1"
      @click="unanonymize"
    >
      Anonymized
    </button>
    <button
      v-if="anonCondition2"
      @click="anonymize"
    >
      Non-anonymized
    </button>
    <button
      v-if="quoting"
      @click="submitQuote"
    >
      ✅ Post quote
    </button>
    <button
      v-if="quoting"
      @click="stopQuoting"
    >
      🚫 Cancel quote
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
  name: 'FreetComponent',
  props: {
    // Data from the stored freet
    freet: {
      type: Object,
      required: true
    }
  },
  computed: {
    anonCondition1() {
      return this.quoting && this.anon;
    },
    anonCondition2() {
      return this.quoting && !(this.anon);
    },
    highlightCondition1() {
      return !this.editing && this.highlighted;
    },
    highlightCondition2() {
      return !this.editing && !(this.highlighted);
    }
  },
  data() {
    return {
      editing: false, // Whether or not this freet is in edit mode
      liked: false,
      highlighted: this.freet.highlight,
      quoting: false,
      anon: false,
      isActive: true,
      draft: this.freet.content, // Potentially-new content for this freet
      alerts: {}, // Displays success/error messages encountered during freet modification
      quoteText: ''
    };
  },
  methods: {
    startEditing() {
      /**
       * Enables edit mode on this freet.
       */
      this.editing = true; // Keeps track of if a freet is being edited
      this.draft = this.freet.content; // The content of our current "draft" while being edited
    },
    stopEditing() {
      /**
       * Disables edit mode on this freet.
       */
      this.editing = false;
      this.draft = this.freet.content;
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
    highlightPost() {
      /**
       * Toggles a highlight on this post.
       */
      this.highlighted = true; // Keeps track of if a freet is already highlighted

      const params = {
        method: 'POST',
        message: 'Successfully highlighted freet!',
        callback: () => {
          this.$set(this.alerts, params.message, 'success');
          setTimeout(() => this.$delete(this.alerts, params.message), 3000);
        }
      };
      this.highlight(params);
      this.isActive = !this.isActive;
    },
    unhighlightPost() {
      /**
       * Toggles the highlight on this post.
       */
      this.highlighted = false;

      const params = {
        method: 'DELETE',
        message: 'Successfully unhighlighted freet!',
        callback: () => {
          this.$set(this.alerts, params.message, 'success');
          setTimeout(() => this.$delete(this.alerts, params.message), 3000);
        }
      };
      this.highlight(params);
      this.isActive = !this.isActive;
    },
    anonymize() {
      /**
       * Toggles on the anonymity on this quote freet.
       */
      this.anon = true; // Keeps track of if a freet is being edited
    },
    unanonymize() {
      /**
       * Toggles off the anonymity on this quote freet.
       */
      this.anon = false;
    },
    quoteFreet() {
      /**
       * Initiates quote freet.
       */
      this.quoting = true;
    },
    stopQuoting() {
      /**
       * Cancels quote freet.
       */
      this.quoting = false;
    },
    deleteFreet() {
      /**
       * Deletes this freet.
       */
      const params = {
        method: 'DELETE',
        callback: () => {
          this.$store.commit('alert', {
            message: 'Successfully deleted freet!', status: 'success'
          });
        }
      };
      this.request(params);
    },
    submitEdit() {
      /**
       * Updates freet to have the submitted draft content.
       */
      if (this.freet.content === this.draft) {
        const error = 'Error: Edited freet content should be different than current freet content.';
        this.$set(this.alerts, error, 'error'); // Set an alert to be the error text, timeout of 3000 ms
        setTimeout(() => this.$delete(this.alerts, error), 3000);
        return;
      }

      const params = {
        method: 'PATCH',
        message: 'Successfully edited freet!',
        body: JSON.stringify({content: this.draft}),
        callback: () => {
          this.$set(this.alerts, params.message, 'success');
          setTimeout(() => this.$delete(this.alerts, params.message), 3000);
        }
      };
      this.request(params);
    },
    submitQuote() {
      /**
       * Posts quote freet.
       */
      if (!this.quoteText) {
        const error = 'Error: Quote freet cannot be empty.';
        this.$set(this.alerts, error, 'error'); // Set an alert to be the error text, timeout of 3000 ms
        setTimeout(() => this.$delete(this.alerts, error), 3000);
        return;
      }

      const params = {
        method: 'POST',
        message: 'Successfully posted quote freet!',
        body: JSON.stringify({content: this.quoteText,
                              anon: this.anon,
                              refId: this.freet._id}),
        callback: () => {
          this.$set(this.alerts, params.message, 'success');
          setTimeout(() => this.$delete(this.alerts, params.message), 3000);
        }
      };
      this.post(params);
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
        const r = await fetch(`/api/likes/${this.freet._id}&Freet`, options);
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
  },
  async highlight(params) {
      /**
       * Submits a highlight request to the like endpoint.
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
        const r = await fetch(`/api/users/highlights/${this.freet._id}`, options);
        if (!r.ok) {
          const res = await r.json();
          throw new Error(res.error);
        }

        this.$store.commit('refreshFreets');
        this.$store.commit('refreshHighlights')

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
.highlight {
    border: 5px solid rgb(52, 14, 105);
    background-color: rgb(190, 175, 211);
    padding: 20px;
    position: relative;
}
</style>
