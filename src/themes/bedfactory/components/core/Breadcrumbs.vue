<template>
  <div
    class="breadcrumbs h5 cl-gray"
    itemscope
    itemtype="https://schema.org/BreadcrumbList"
  >
    <span
      itemprop="itemListElement"
      itemscope
      itemtype="https://schema.org/ListItem"
    >
      <router-link :to="'/'" itemprop="item">
        <span class="no-padding" itemprop="name"> Home </span>
      </router-link>/
      <meta itemprop="position" :content="'1'" />
    </span>
    <span
      v-for="(link, index) in paths"
      :key="link.route_link"
      v-if="link.name !== 'Default Category' && link.name !== 'New Default'"
      itemprop="itemListElement"
      itemscope
      itemtype="https://schema.org/ListItem"
    >
      <template
        v-if="link.name !== 'Default Category' && link.name !== 'New Default'"
      >
        <router-link
          :to="link.route_link"
          itemprop="item"
          :class="paths.length - 1 == index ? 'LastElement' : ''"
        >
            <span class="no-padding" itemprop="name">
              {{ link.name | htmlDecode }}
            </span>
        </router-link>
        <meta itemprop="position" :content="index + 1" />
      </template>
      /
    </span>
    <span
      class="cl-mine-shaft"
      itemprop="itemListElement"
      itemscope
      itemtype="https://schema.org/ListItem"
    >
      <span class="no-padding" itemprop="name" id="current-tag-name">{{
        current | htmlDecode
      }}</span>
      <meta itemprop="position" :content="paths.length + 1" />
    </span>
  </div>
</template>

<script>
import { Breadcrumbs } from '@vue-storefront/core/modules/breadcrumbs/components/Breadcrumbs.ts'

export default {
  mixins: [Breadcrumbs]
}
</script>
<style lang="scss" scoped>
.breadcrumbs {
  span {
    padding-right: 10px;
    font-size: 12px;
    font-family: Arial;
  }
  a {
    padding-right: 10px;
    // color: #b2b2b1;
    font-size: 12px;
    font-family: Arial;
    :hover {
      color: #ca0413;
    }
  }
  .current {
    color: #2a285a;
    font-size: 12px;
    font-family: Arial;
  }
}
a.underline:after,
a:not(.no-underline):hover:after {
  content: none;
}
@media (max-width: 991px) {
  .breadcrumbs {
    a {
      font-size: 10px;
    }
  }
  .current {
    font-size: 10px;
  }
}
.no-padding {
  padding-left: 0px !important;
  padding-right: 0px !important;
  padding-bottom: 0px !important;
  padding-top: 0px !important;
  color: #333333;
}
</style>
