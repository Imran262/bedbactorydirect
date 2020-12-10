import { isServer } from '@vue-storefront/core/helpers'

// const isBottomVisible = () => {
//   if (isServer) {
//     return false
//   }
//   const SAFETY_MARGIN = 20
//   const scrollY = window.scrollY
//   const visible = window.innerHeight
//   const pageHeight = document.documentElement.scrollHeight
//   const bottomOfPage = scrollY + SAFETY_MARGIN >= pageHeight - visible

//   return bottomOfPage || pageHeight < visible
// }
const isBottomVisible = () => {
  if (isServer) {
    return false;
  }
  var SAFETY_MARGIN = 20;
  const FOOTER_HEIGHT = document.getElementsByClassName('footer-main')[0]
    .offsetHeight;
  if (FOOTER_HEIGHT) {
    const singleCategoryElement = document.getElementsByClassName('product-listing')[0].firstChild.offsetHeight;
    SAFETY_MARGIN = FOOTER_HEIGHT + singleCategoryElement;
  } else {
    SAFETY_MARGIN = 500;
  }
  const scrollY = window.scrollY;
  const visible = window.innerHeight;
  const pageHeight = document.documentElement.scrollHeight;
  const bottomOfPage = (scrollY + SAFETY_MARGIN + 300) >= pageHeight - visible;
  // console.log('SAFETY_MARGIN', SAFETY_MARGIN, '\n\n FOOTER_HEIGHT', '\nele', document.getElementsByClassName('product-listing')[0].firstChild.offsetHeight, FOOTER_HEIGHT, '\n\n scrollY', scrollY, '\n\n visible', visible, '\n\n pageHeight', pageHeight, '\n\n bottomOfPage', bottomOfPage, '\n\nscrollY + SAFETY_MARGIN', scrollY + SAFETY_MARGIN, '        pageHeight - visible', (pageHeight - visible), (bottomOfPage || pageHeight < visible));
  return bottomOfPage || pageHeight < visible;
};

/**
 * By implementing this mixin add "onBottomScroll" method in component.
 * It will be invoked when view reach the bottom.
 */
export default {
  mounted () {
    const scrollHandler = () => {
      if (isBottomVisible()) {
        this.onBottomScroll()
      }
    }
    document.addEventListener('scroll', scrollHandler)
    this.$once('hook:destroyed', () => {
      document.removeEventListener('scroll', scrollHandler)
    })
  }
}
