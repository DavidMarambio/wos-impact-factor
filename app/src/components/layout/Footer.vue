<template>
  <footer class="main-footer">
    <strong
      >Copyright &copy; {{ year }}
      <a href="https://quimica.uchile.cl/" target="_blank"
        >Facultad de Química y Farmacia - Universidad de Chile</a
      ></strong
    >
    <div class="float-right d-none d-sm-inline-block"><b>Version</b> 0.1.0</div>
  </footer>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "FooterComponents",
  data() {
    return {
      year: "",
    };
  },
  methods: {
    printDate() {
      const date = new Date();
      this.year = date.getFullYear().toString();
    },
  },
  mounted() {
    this.printDate();
  },
});
</script>

<style></style>
