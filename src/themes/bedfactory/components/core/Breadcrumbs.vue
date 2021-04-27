<template>
  <div class="breadcrumbs h5 cl-gray" itemscope itemtype="https://schema.org/BreadcrumbList">
  <router-link :to="'/'" itemprop="item">
         <span class="no-padding" itemprop="name"> Home </span>
          
        </router-link>
    <span v-for="(link, index) in paths" :key="link.route_link" itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
      <template
        v-if="link.name !== 'Default Category' && link.name !== 'New Default'"
      >
        <router-link :to="link.name.includes('Root') ? '/' : link.route_link" itemprop="item" :class="paths.length - 1 == index ? 'LastElement' : ''">
          <template v-if="link.name.includes('Root')"> <span class="no-padding" itemprop="name"> Home </span></template>
          <template v-else>
            <span class="no-padding" itemprop="name"> {{ link.name | htmlDecode }} </span>
          </template>
        </router-link>
        <meta itemprop="position" :content="index + 1" />
      </template>
      /
    </span>
    <span class="cl-mine-shaft" itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
      <span class="no-padding" itemprop="name" id="current-tag-name">{{ current | htmlDecode }}</span>
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
    :hover{
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
}
</style>
