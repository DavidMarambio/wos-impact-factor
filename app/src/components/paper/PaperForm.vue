<template>
  <div class="card card-primary">
    <div class="card-header">
      <h3 class="card-title">Ingreso de Publicación</h3>
    </div>
    <form @submit.prevent="savePaper()">
      <div class="card-body">
        <div class="form-group">
          <label for="year">Año Publicación</label>
          <input
            type="number"
            name="year"
            id="year"
            class="form-control"
            v-model="paper.year"
            placeholder="Ingrese año de publicación"
          />
        </div>
        <div class="form-group">
          <label for="codeWos">Código WOS</label>
          <input
            type="text"
            name="codeWos"
            id="codeWos"
            class="form-control"
            v-model="paper.codeWos"
            placeholder="Ingrese código WOS de la publicación"
          />
        </div>
        <div class="form-group">
          <label for="codeDoi">Código DOI</label>
          <input
            type="text"
            name="codeDoi"
            id="codeDoi"
            class="form-control"
            v-model="paper.codeDoi"
            placeholder="Ingrese código DOI de la publicación"
          />
        </div>
        <div class="form-group">
          <label for="typePaper">Tipo de Publicación</label>
          <select
            name="typePaper"
            id="typePaper"
            class="form-control"
            v-model="paper.typePaper"
          >
            <option value="">-</option>
            <option value="articulo">Artículo</option>
            <option value="revision">Revisión</option>
          </select>
        </div>

        <div class="form-group">
          <label for="journalName">Nombre Revista</label>
          <input
            type="text"
            name="journalName"
            id="journalName"
            class="form-control"
            v-model="paper.journalName"
            placeholder="Ingrese el nombre de la revista"
          />
        </div>

        <div class="form-group">
          <label for="journalNumber">Número Revista</label>
          <input
            type="number"
            name="journalNumber"
            id="journalNumber"
            class="form-control"
            v-model="paper.journalNumber"
            placeholder="Ingrese el número de la revista"
          />
        </div>

        <div class="form-group">
          <label for="journalVolume">Volumen Revista</label>
          <input
            type="number"
            name="journalVolume"
            id="journalVolume"
            class="form-control"
            v-model="paper.journalVolume"
            placeholder="Ingrese el volumen de la revista"
          />
        </div>

        <div class="form-group">
          <label for="title">Título de Públicación</label>
          <input
            type="text"
            name="title"
            id="title"
            class="form-control"
            v-model="paper.title"
            placeholder="Ingrese el título de la publicación"
          />
        </div>

        <div class="form-group">
          <label for="chapterPage">Página del Capítulo</label>
          <input
            type="number"
            name="chapterPage"
            id="chapterPage"
            class="form-control"
            v-model="paper.chapterPage"
            placeholder="Ingrese la página del capítulo de la publicación"
          />
        </div>

        <div class="form-group">
          <label for="numberOfPages">Cantidad de Páginas</label>
          <input
            type="number"
            name="numberOfPages"
            id="numberOfPages"
            class="form-control"
            v-model="paper.numberOfPages"
            placeholder="Ingrese la cantidad de páginas de la publicación"
          />
        </div>

        <div class="form-group">
          <label for="initialPage">Página Inicial</label>
          <input
            type="number"
            name="initialPage"
            id="initialPage"
            class="form-control"
            v-model="paper.initialPage"
            placeholder="Ingrese la página de la revista donde comienza la publicación"
          />
        </div>
        <div class="form-group">
          <label for="endPage">Página Final</label>
          <input
            type="number"
            name="endPage"
            id="endPage"
            class="form-control"
            v-model="paper.endPage"
            placeholder="Ingrese la página de la revista donde finaliza la publicación"
          />
        </div>

        <div class="card-footer">
          <button
            type="submit"
            class="btn btn-primary"
            :disabled="!paper.title || !paper.year"
          >
            Guardar
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Paper } from "@/interfaces/Paper";
import { createPaper } from "@/services/PaperService";

export default defineComponent({
  data() {
    return {
      paper: {} as Paper,
    };
  },
  methods: {
    async savePaper() {
      const res = await createPaper(this.paper);
      console.log(res);
      this.$router.push({ name: "papers" });
    },
  },
});
</script>
