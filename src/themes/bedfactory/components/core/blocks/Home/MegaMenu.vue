<template>
    <div class="container">
      <ul class="flex menu" @mouseover="mouseover" @mouseleave="mouseleave()">
        <li
          v-for="(links, index) in link"
          class="sb-menu nav-item level0 nav-1 level-top first nav-item--parent mega nav-item--only-blocks parent"
          :class="links.customClassName"
          :key="index"
        >
          <span @click="goto()" class="menuspan">
            <router-link
              :to="localizedRoute(links.link)"
              class="level-top sb-forward"
            >
            {{ links.title }}
            </router-link>
          </span>
          <div
            v-if="links.submenu"
            v-show="hovered"
            :class="`nav-panel-dropdown ` + (show ? ` displayBlock` : null)"
          >
            <div class="nav-panel-inner">
              <div class="nav-block">
                <div
                  v-for="sublink in links.submenu"
                  :class="sublink.sub_links.length>=10 ? 'sb-height-dropdown-menu col-lg-4 col-md-4':'sb-height-dropdown-menu col-lg-2 col-md-2'"
                >
                  <span class="subcag-title">{{ sublink.main_title }}</span>
                 <ul :class="sublink.sub_links.length>=10 ? 'bullet menu-frame':'bullet'">
                    <li v-for="finallink in sublink.sub_links">
                      <router-link
                        :class="finallink.class"
                        :to="localizedRoute(finallink.link)"
                        v-html="finallink.title"
                      >
                        <!-- {{ finallink.title }} -->
                      </router-link>
                    </li>
                  </ul>
                </div>
              </div>
              <div class="sb-price-match">
                <div class="menu-dropdown-logo-img">&nbsp;</div>
              </div>
              <div v-if="links.submenuimg" class="dropdown-menu-right-img">
                <router-link
                  v-if="links.imglink != '#'"
                  :to="localizedRoute(links.imglink)"
                >
                  <img alt="Menu Image" :src="links.submenuimg" />
                </router-link>
                <span v-else>
                  <img alt="Menu Image" :src="links.submenuimg" />
                </span>
              </div>
            </div>
          </div>
          <div class="box">
            <div class="arrow-down"></div>
          </div>
        </li>
      </ul>
    </div>
</template>
<script>
import cmsBlock from 'vsf-cms-block-mixin/components/cmsBlock'

export default {
  name: 'MegaMenu',
  mixins: [cmsBlock],

  computed: {
    link () {
      var mainTopLinks = []
      var i = 0

      if (this.data) {

        var mbclasses = this.parsedContent.querySelectorAll('.sb-menu');


        [].forEach.call(mbclasses, (mbclass) => {
          // do whatever
          // console.log('class - ' + i, mbclass.classNames);
          var menulink = []
          if (mbclass.classNames && mbclass.classNames.length > 0) {
            if (mbclass.classNames) {
              if (mbclass.classNames.includes('not_on_desktop')) {
                menulink['customClassName'] = 'not_on_desktop'
              } else {
                menulink['customClassName'] = ''
              }
            }
          } else {
            menulink['customClassName'] = ''
          }
          if (mbclass.querySelector('a.sb-forward').attributes['href']) {
            menulink['link'] = mbclass.querySelector('a.sb-forward').attributes['href']
          } else {
            menulink['link'] = '#'
          }
          if (mbclass.querySelector('a.sb-forward').rawText) {
            menulink['title'] = mbclass.querySelector('a.sb-forward').rawText
          } else {
            menulink['title'] = 'UnDefined'
          }
          if (mbclass.querySelector('.dropdown-menu-right-img a') && mbclass.querySelector('.dropdown-menu-right-img a').attributes['href']) {
            menulink['imglink'] = mbclass.querySelector('.dropdown-menu-right-img a').attributes['href']
          }
          else {
            menulink['imglink'] = '#'
          }

          var issubmenu = false
          var submenuimg = false

          if (mbclass.querySelector('.nav-panel-dropdown')) {
            var totalsubmenublocks = 0
            var blockiterator = 0
            var submenublockselements = mbclass.querySelectorAll(
              '.sb-height-dropdown-menu'
            )
            if (submenublockselements.length) {
              issubmenu = true
              totalsubmenublocks = submenublockselements.length

              var allsubmenublocks = [];
              [].forEach.call(submenublockselements, (submenublockelement) => {    
                var submenublockls = []
                var submenublocklinks = []

                if (
                  submenublockelement.querySelector('.subcag-title').rawText
                ) {
                  var subblocktitle = submenublockelement.querySelector(
                    '.subcag-title'
                  ).rawText
                } else {
                  var subblocktitle = 'UnDefined'
                }

                submenublockls['main_title'] = subblocktitle

                var bulletul = submenublockelement.querySelector('ul.bullet')
                var bulletullis = bulletul.querySelectorAll('li')
                var bulletlicount = 0;

                [].forEach.call(bulletullis, (bulletulli) => {
                  var submenulink = new Array(3)

                  var bulletullianchor = bulletulli.querySelector('a')
                 if (bulletulli && bulletulli.attributes['class']) {
                    submenulink['class'] = bulletulli.attributes['class']
                  } else {
                    submenulink['class'] = ''
                  }
                  if (bulletullianchor && bulletullianchor.attributes['href']) {
                    submenulink['link'] = bulletullianchor.attributes['href']
                  } else {
                    submenulink['link'] = '#'
                  }

                  if (bulletullianchor && bulletullianchor.rawText) {
                    submenulink['title'] = bulletullianchor.rawText
                  } else {
                    submenulink['title'] = 'UnDefined'
                  }

                  submenublocklinks[bulletlicount] = submenulink

                  bulletlicount++
                })

                submenublockls['sub_links'] = submenublocklinks
                allsubmenublocks[blockiterator] = submenublockls
                blockiterator++
              })

              if (mbclass.querySelector('img')) {
                // submenuimg = true;
                submenuimg = mbclass.querySelector('img').attributes['src']
              }
            }
            // console.log('Total subblocks ' + totalsubmenublocks);
          }

          if (issubmenu) {
            // console.log('Submenuhtml', allsubmenublocks);
            menulink['submenu'] = allsubmenublocks
          }

          if (submenuimg) {
            menulink['submenuimg'] = submenuimg
          }
          mainTopLinks[i] = menulink
          i++
        })

        // this.parsedContent.querySelectorAll('.mb_class').forEach(this.title);
      }
      // console.log("11223344", mainTopLinks);
      return mainTopLinks
      // return this.parsedContent.querySelector('a').attributes['href'];
    },
    currRoute () {
      return this.$route.name
    }
  },
  data () {
    return {
      show: false,
      hovered: false,
      windowWidth: 0
    }
  },
  mounted () {
    this.windowWidth = document.documentElement.clientWidth
  },
  methods: {
    goto () {
      this.$bus.$emit('gotop')
    },
    mouseover () {
      const sort_by = document.getElementsByClassName('sort-by-desktop')[0]
      if (sort_by) {
        sort_by.classList.add('hidden')
      }
      this.hovered = true
    },
    mouseleave () {
      const sort_by = document.getElementsByClassName('sort-by-desktop')[0]
      if (sort_by) {
        sort_by.classList.remove('hidden')
      }
      this.hovered = false
    }
  },
  watch: {
    currRoute (newVal, oldVal) {
      if (newVal !== oldVal) {
        this.hovered = false
      }
    }
  }
};
</script>
<style>
.hidden {
  display: none !important;
}
.not_on_desktop {
  display: none !important;
}
.menuspan {
  width: 100%;
} 
.bullet .view-all{
  color: #071A44 !important;
  font-weight: bold;
}
.menu-frame {
    max-height: 200px;
    -ms-flex-flow: wrap column;
    flex-flow: wrap column;
    display: -ms-flexbox;
    display: flex;
}
</style>
