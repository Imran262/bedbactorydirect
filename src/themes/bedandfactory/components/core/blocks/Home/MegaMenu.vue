<template>
  <div>
    <div class="container">
      <ul class="flex menu" @mouseover="mouseover" @mouseleave="mouseleave()">
        <li
          v-for="links in link"
          class="sb-menu nav-item level0 nav-1 level-top first nav-item--parent mega nav-item--only-blocks parent"
        >
          <router-link
            :to="localizedRoute(links.link)"
            class="level-top sb-forward"
            >{{ links.title }}</router-link
          >
          <div v-if="links.submenu" class="nav-panel-dropdown">
            <div class="nav-panel-inner">
              <div class="nav-block">
                <div
                  v-for="sublink in links.submenu"
                  class="sb-height-dropdown-menu col-lg-2 col-md-2"
                >
                  <span class="subcag-title">{{ sublink.main_title }}</span>
                  <ul class="bullet">
                    <li v-for="finallink in sublink.sub_links">
                      <router-link :to="localizedRoute(finallink.link)">
                        {{ finallink.title }}
                      </router-link>
                    </li>
                  </ul>
                </div>
              </div>
              <div class="sb-price-match">
                <div class="menu-dropdown-logo-img">&nbsp;</div>
              </div>
              <div v-if="links.submenuimg" class="dropdown-menu-right-img">
                <a>
                  <img :src="links.submenuimg" />
                </a>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import cmsBlock from "vsf-cms-block-mixin/components/cmsBlock";
export default {
  name: "MegaMenu",
  mixins: [cmsBlock],
  computed: {
    link() {
      //console.log('dataIs', this.data);

      // console.log("Urllllll 2", this.data);
      var mainTopLinks = [];
      var i = 0;

      if(this.data){
        var mbclasses = this.parsedContent.querySelectorAll(".sb-menu");
      // console.log('Sb -class ', mbclasses);
      [].forEach.call(mbclasses, mbclass => {
        // do whatever
        // console.log('class - ' + i, mbclass);
        var menulink = [];
        if (mbclass.querySelector("a.sb-forward").attributes["href"]) {
          menulink["link"] = mbclass.querySelector("a.sb-forward").attributes[
            "href"
          ];
        } else {
          menulink["link"] = "#";
        }
        if (mbclass.querySelector("a.sb-forward").rawText) {
          menulink["title"] = mbclass.querySelector("a.sb-forward").rawText;
        } else {
          menulink["title"] = "UnDefined";
        }

        var issubmenu = false;
        var submenuimg = false;

        if (mbclass.querySelector(".nav-panel-dropdown")) {
          var totalsubmenublocks = 0;
          var blockiterator = 0;
          var submenublockselements = mbclass.querySelectorAll(
            ".sb-height-dropdown-menu"
          );
          if (submenublockselements.length) {
            issubmenu = true;
            totalsubmenublocks = submenublockselements.length;

            var allsubmenublocks = [];
            [].forEach.call(submenublockselements, submenublockelement => {
              var submenublockls = [];
              var submenublocklinks = [];

              if (submenublockelement.querySelector(".subcag-title").rawText) {
                var subblocktitle = submenublockelement.querySelector(
                  ".subcag-title"
                ).rawText;
              } else {
                var subblocktitle = "UnDefined";
              }

              submenublockls["main_title"] = subblocktitle;

              var bulletul = submenublockelement.querySelector("ul.bullet");
              var bulletullis = bulletul.querySelectorAll("li");
              var bulletlicount = 0;

              [].forEach.call(bulletullis, bulletulli => {
                var submenulink = new Array(2);

                var bulletullianchor = bulletulli.querySelector("a");
                if (bulletullianchor && bulletullianchor.attributes["href"]) {
                  submenulink["link"] = bulletullianchor.attributes["href"];
                } else {
                  submenulink["link"] = "#";
                }

                if (bulletullianchor && bulletullianchor.rawText) {
                  submenulink["title"] = bulletullianchor.rawText;
                } else {
                  submenulink["title"] = "UnDefined";
                }

                submenublocklinks[bulletlicount] = submenulink;

                bulletlicount++;
              });

              submenublockls["sub_links"] = submenublocklinks;
              allsubmenublocks[blockiterator] = submenublockls;
              blockiterator++;
            });

            if (mbclass.querySelector("img")) {
              // submenuimg = true;
              submenuimg = mbclass.querySelector("img").attributes["src"];
            }
          }
          // console.log('Total subblocks ' + totalsubmenublocks);
        }

        if (issubmenu) {
          // console.log('Submenuhtml', allsubmenublocks);
          menulink["submenu"] = allsubmenublocks;
        }

        if (submenuimg) {
          menulink["submenuimg"] = submenuimg;
        }
        mainTopLinks[i] = menulink;
        i++;
      });

      // this.parsedContent.querySelectorAll('.mb_class').forEach(this.title);
      }
      

      return mainTopLinks;
      // return this.parsedContent.querySelector('a').attributes['href'];
    },
    title() {
      console.log("dsadsadsadsadd");
      // return this.parsedContent.querySelector('a').rawText;
    }
  },
  methods: {
    mouseover() {
      const sort_by = document.getElementsByClassName("sort-by-desktop")[0];
      if (sort_by) {
        sort_by.classList.add("hidden");
      }
    },
    mouseleave() {
      const sort_by = document.getElementsByClassName("sort-by-desktop")[0];
      if (sort_by) {
        sort_by.classList.remove("hidden");
      }
    }
  }
};
</script>
<style>
.hidden {
  display: none !important;
}
</style>
