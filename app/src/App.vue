/* eslint-disable */
<template>
  <body class="hold-transition sidebar-mini layout-fixed">
    <div class="wrapper">
      <Preloader />
      <Navbar />
      <Sidebar />

      <div class="content-wrapper">
        <ContentHeader />

        <section class="content">
          <div class="container-fluid">
            <router-view></router-view>
          </div>
        </section>
      </div>

      <Footer></Footer>
      <ControlSidebar />
    </div>
  </body>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import "../node_modules/admin-lte/plugins/select2-bootstrap4-theme/select2-bootstrap4.min.css";
import "../node_modules/admin-lte/plugins/select2/css/select2.min.css";
import Preloader from "./components/layout/Preloader.vue";
import ContentHeader from "./components/layout/ContentHeader.vue";
import Navbar from "./components/layout/Navbar.vue";
import Sidebar from "./components/layout/Sidebar.vue";
import Footer from "./components/layout/Footer.vue";
import ControlSidebar from "./components/layout/ControlSidebar.vue";

export default defineComponent({
  name: "App",
  components: {
    Preloader,
    ContentHeader,
    Navbar,
    Sidebar,
    Footer,
    ControlSidebar,
  },
});
</script>

<style>
@import url("https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,400i,700&display=fallback");
</style>
