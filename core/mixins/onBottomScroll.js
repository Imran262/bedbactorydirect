import { isServer } from '@vue-storefront/core/helpers'
import debounce from 'lodash-es/debounce'

const isBottomVisible = () => {
  if (isServer) {
    return false
  }
  if (document.getElementsByClassName('product-listing') && document.getElementsByClassName('product-listing').length <= 0) {
    return false
  }
  var SAFETY_MARGIN = 20;
  const FOOTER_HEIGHT = document.getElementsByClassName('footer-main') !== undefined && document.getElementsByClassName('footer-main').length > 0 ? document.getElementsByClassName('footer-main')[0]
    .offsetHeight : null;
  if (FOOTER_HEIGHT) {
    const singleCategoryElement = document.getElementsByClassName('product-listing') && document.getElementsByClassName('product-listing').length > 0 ? document.getElementsByClassName('product-listing')[0].firstChild.offsetHeight + 200 : 0;
    // console.log('singleCategoryElement', singleCategoryElement)
    SAFETY_MARGIN = FOOTER_HEIGHT + singleCategoryElement;
  } else {
    SAFETY_MARGIN = 600;
  }
  const scrollY = window.scrollY;
  const visible = window.innerHeight;
  const pageHeight = document.documentElement.scrollHeight;
  const bottomOfPage = scrollY + SAFETY_MARGIN >= pageHeight - visible;
  return bottomOfPage || pageHeight < visible;
}

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
