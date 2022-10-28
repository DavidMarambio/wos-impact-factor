<template>
  <h1>Publicaciones</h1>
  <ul>
    <li v-for="(paper, index) in papers" :key="index">
      {{ paper.title }}
    </li>
  </ul>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { getPapers } from "@/services/PaperService";
import { Paper } from "@/interfaces/Paper";

export default defineComponent({
  data() {
    return {
      papers: [] as Paper[],
    };
  },
  methods: {
    async loadPapers() {
      const res = await getPapers();
      this.papers = res.data;
    },
  },
  mounted() {
    this.loadPapers();
  },
});
</script>